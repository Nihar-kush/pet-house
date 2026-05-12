import { useCallback, useEffect, useState } from "react";
import { fetchImageSize, fetchPets } from "../api";
import type { DataStatus, Pet } from "../types";
import { normalizePets } from "../utils";

type UsePetsState = {
  pets: Pet[];
  status: DataStatus;
  error: string | null;
};

const initialState: UsePetsState = {
  pets: [],
  status: "idle",
  error: null,
};

let cachedPets: Pet[] | null = null;
let pendingPetsRequest: Promise<Pet[]> | null = null;
const preloadedImageUrls = new Set<string>();

function preloadPetImages(pets: Pet[]) {
  pets.forEach((pet) => {
    if (preloadedImageUrls.has(pet.url)) {
      return;
    }

    preloadedImageUrls.add(pet.url);
    const image = new Image();
    image.decoding = "async";
    image.src = pet.url;
  });
}

async function loadCachedPets() {
  // Keep one shared in-memory request so route changes do not kick off duplicate fetches.
  if (cachedPets) {
    return cachedPets;
  }

  pendingPetsRequest ??= fetchPets().then((rawPets) => {
    cachedPets = normalizePets(rawPets);
    preloadPetImages(cachedPets);
    return cachedPets;
  });

  return pendingPetsRequest;
}

export function usePets() {
  const [state, setState] = useState<UsePetsState>(initialState);

  const loadPets = useCallback(async () => {
    if (cachedPets) {
      setState({
        pets: cachedPets,
        status: "success",
        error: null,
      });
      return;
    }

    setState((currentState) => ({
      ...currentState,
      status: "loading",
      error: null,
    }));

    try {
      const pets = await loadCachedPets();

      setState({
        pets,
        status: "success",
        error: null,
      });

      // Fill in real file sizes after first paint so the gallery can render immediately.
      void Promise.all(
        pets.map(async (pet) => {
          let sizeBytes: number | null = null;

          try {
            sizeBytes = await fetchImageSize(pet.url);
          } catch {
            sizeBytes = null;
          }

          if (!sizeBytes) {
            return;
          }

          setState((currentState) => ({
            ...currentState,
            pets: currentState.pets.map((currentPet) =>
              currentPet.id === pet.id
                ? { ...currentPet, sizeBytes, sizeSource: "remote" }
                : currentPet,
            ),
          }));
          cachedPets = cachedPets?.map((currentPet) =>
            currentPet.id === pet.id
              ? { ...currentPet, sizeBytes, sizeSource: "remote" }
              : currentPet,
          ) ?? null;
        }),
      );
    } catch (error) {
      setState({
        pets: [],
        status: "error",
        error:
          error instanceof Error
            ? error.message
            : "Something went wrong while loading pets.",
      });
    }
  }, []);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      void loadPets();
    }, 0);

    return () => window.clearTimeout(timeoutId);
  }, [loadPets]);

  return {
    pets: state.pets,
    status: state.status,
    error: state.error,
    isLoading: state.status === "loading" || state.status === "idle",
    isError: state.status === "error",
    isEmpty: state.status === "success" && state.pets.length === 0,
    retry: loadPets,
  };
}
