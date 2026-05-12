import type { RawPet } from "./types";

const PETS_ENDPOINT = "https://eulerity-hackathon.appspot.com/pets";

export async function fetchPets() {
  const response = await fetch(PETS_ENDPOINT);

  if (!response.ok) {
    throw new Error("Unable to load pets right now. Please try again shortly.");
  }

  const data: unknown = await response.json();

  if (!Array.isArray(data)) {
    throw new Error("We received an unexpected pets response.");
  }

  return data as RawPet[];
}

export async function fetchImageSize(url: string) {
  const response = await fetch(url, { method: "HEAD" });

  if (!response.ok) {
    return null;
  }

  const contentLength = response.headers.get("content-length");

  if (!contentLength) {
    return null;
  }

  const bytes = Number(contentLength);
  return Number.isFinite(bytes) && bytes > 0 ? bytes : null;
}
