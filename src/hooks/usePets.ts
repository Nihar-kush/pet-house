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

async function loadCachedPets() {
  // Keep one shared in-memory request so route changes do not kick off duplicate fetches.
  if (cachedPets) {
    return cachedPets;
  }

  pendingPetsRequest ??= (async () => {
    const rawPets = await fetchPets();
    cachedPets = normalizePets(rawPets);
    return cachedPets;
  })().catch((error: unknown) => {
    pendingPetsRequest = null;
    throw error;
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

      void (async () => {
        const sizeUpdates = await Promise.all(
          pets.map(async (pet) => {
            try {
              const sizeBytes = await fetchImageSize(pet.url);
              return sizeBytes ? { id: pet.id, sizeBytes } : null;
            } catch {
              return null;
            }
          }),
        );
        const sizeById = new Map(
          sizeUpdates
            .filter(
              (update): update is { id: string; sizeBytes: number } =>
                update !== null,
            )
            .map((update) => [update.id, update.sizeBytes]),
        );

        if (sizeById.size === 0) {
          return;
        }

        setState((currentState) => ({
          ...currentState,
          pets: currentState.pets.map((currentPet) =>
            sizeById.has(currentPet.id)
              ? {
                  ...currentPet,
                  sizeBytes: sizeById.get(currentPet.id) ?? currentPet.sizeBytes,
                  sizeSource: "remote",
                }
              : currentPet,
          ),
        }));

        cachedPets = pets.map((currentPet) =>
          sizeById.has(currentPet.id)
            ? {
                ...currentPet,
                sizeBytes: sizeById.get(currentPet.id) ?? currentPet.sizeBytes,
                sizeSource: "remote",
              }
            : currentPet,
        ) ?? null;
      })();
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
