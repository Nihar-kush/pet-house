import type { DateSort, NameSort, Pet, RawPet, SortBy } from "./types";

const FALLBACK_IMAGE_SIZE_BYTES = 420 * 1024;

export function slugify(value: string) {
  // Turn user-facing titles into predictable URL/file-safe strings.
  return value
    .toLowerCase()
    .trim()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function parseCreatedDate(value: string) {
  const normalizedValue = value.replace(" UTC ", " GMT ");
  const timestamp = Date.parse(normalizedValue);

  if (Number.isNaN(timestamp)) {
    return {
      createdAt: new Date().toISOString(),
      createdTimestamp: Date.now(),
    };
  }

  return {
    createdAt: new Date(timestamp).toISOString(),
    createdTimestamp: timestamp,
  };
}

function getFileExtension(url: string) {
  // Pull the file extension out of the image URL so downloads keep a sensible name.
  const pathname = new URL(url).pathname;
  const extension = pathname.split(".").pop();

  if (!extension || extension.length > 5) {
    // Some URLs have no real extension, so default to jpg for the download name.
    return "jpg";
  }

  return extension;
}

export function getPetFileName(pet: Pick<Pet, "title" | "url">) {
  // Combine a slugged title with the detected extension for cleaner downloads.
  return `${slugify(pet.title) || "pet-photo"}.${getFileExtension(pet.url)}`;
}

function estimateImageSize(rawPet: RawPet, index: number) {
  // The API does not give image sizes, so this keeps selection totals believable
  // until we can replace them with remote values later.
  const descriptionWeight = rawPet.description.length * 900;
  const titleWeight = rawPet.title.length * 1200;
  const indexWeight = (index % 5) * 48 * 1024;

  return (
    FALLBACK_IMAGE_SIZE_BYTES + descriptionWeight + titleWeight + indexWeight
  );
}

export function normalizePets(rawPets: RawPet[]): Pet[] {
  return rawPets.map((rawPet, index) => {
    const dateFields = parseCreatedDate(rawPet.created);
    // Add the index so duplicate titles still get stable unique ids.
    const idBase = slugify(`${rawPet.title}-${index + 1}`);
    const pet = {
      ...rawPet,
      id: idBase,
      ...dateFields,
      fileName: "",
      sizeBytes: estimateImageSize(rawPet, index),
      sizeSource: "estimated" as const,
    };

    return {
      ...pet,
      fileName: getPetFileName(pet),
    };
  });
}

export function formatDate(value: string) {
  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(value));
}

export function formatFileSize(bytes: number) {
  // Use KB for smaller files and one-decimal MB for anything larger.
  if (bytes < 1024 * 1024) {
    return `${Math.max(1, Math.round(bytes / 1024))} KB`;
  }

  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function filterPets(pets: Pet[], searchTerm: string) {
  const normalizedSearch = searchTerm.trim().toLowerCase();

  if (!normalizedSearch) {
    return pets;
  }

  return pets.filter((pet) => {
    return `${pet.title} ${pet.description}`
      .toLowerCase()
      .includes(normalizedSearch);
  });
}

function compareByName(firstPet: Pet, secondPet: Pet, nameSort: NameSort) {
  // sensitivity: "base" keeps case from affecting order, numeric: true helps mixed labels.
  return nameSort === "name-asc"
    ? firstPet.title.localeCompare(secondPet.title, undefined, {
        sensitivity: "base",
        numeric: true,
      })
    : secondPet.title.localeCompare(firstPet.title, undefined, {
        sensitivity: "base",
        numeric: true,
      });
}

function compareByDate(firstPet: Pet, secondPet: Pet, dateSort: DateSort) {
  // Compare the precomputed timestamps instead of reparsing date strings during sort.
  return dateSort === "date-asc"
    ? firstPet.createdTimestamp - secondPet.createdTimestamp
    : secondPet.createdTimestamp - firstPet.createdTimestamp;
}

export function sortPets(
  pets: Pet[],
  nameSort: NameSort,
  dateSort: DateSort,
  sortBy: SortBy,
) {
  return [...pets].sort((firstPet, secondPet) => {
    const primaryComparison =
      sortBy === "name"
        ? compareByName(firstPet, secondPet, nameSort)
        : compareByDate(firstPet, secondPet, dateSort);

    if (primaryComparison !== 0) {
      return primaryComparison;
    }

    return sortBy === "name"
      ? compareByDate(firstPet, secondPet, dateSort)
      : compareByName(firstPet, secondPet, nameSort);
  });
}

export function paginatePets(pets: Pet[], page: number, pageSize: number) {
  const start = (page - 1) * pageSize;
  return pets.slice(start, start + pageSize);
}

function triggerDownload(url: string, fileName: string) {
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = fileName;
  anchor.rel = "noopener";
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
}

export async function downloadPetImage(pet: Pet) {
  try {
    // Fetch first so we can save a blob and keep a cleaner file name when possible.
    const response = await fetch(pet.url);

    if (!response.ok) {
      throw new Error(`Image download failed with ${response.status}`);
    }

    const blob = await response.blob();
    const objectUrl = URL.createObjectURL(blob);
    triggerDownload(objectUrl, pet.fileName);
    // Revoke shortly after the click so the browser has time to start the download.
    window.setTimeout(() => URL.revokeObjectURL(objectUrl), 1000);
  } catch {
    // Fall back to the source URL so the download still works when fetch is blocked.
    triggerDownload(pet.url, pet.fileName);
  }
}

export async function downloadPetImages(pets: Pet[]) {
  // Keep downloads sequential so browsers are less likely to block a burst of files.
  for (const pet of pets) {
    // Wait between each download attempt by chaining them in the loop.
    await downloadPetImage(pet);
  }
}
