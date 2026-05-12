import { useEffect, useMemo, useRef, useState } from "react";
import styled, { keyframes } from "styled-components";
import { Controls } from "../components/Controls";
import { Hero } from "../components/Hero";
import { Loader } from "../components/Loader";
import { MasonryLayout } from "../components/MasonryLayout";
import { PetCard } from "../components/PetCard";
import { SearchBar } from "../components/SearchBar";
import { useSelection } from "../context/selectionContext";
import { useDebounce } from "../hooks/useDebounce";
import { usePets } from "../hooks/usePets";
import type { DateSort, NameSort, Pet, SortBy } from "../types";
import {
  downloadPetImage,
  downloadPetImages,
  filterPets,
  paginatePets,
  sortPets,
} from "../utils";

const PAGE_SIZE = 8;

const Shell = styled.div`
  display: grid;
  gap: ${({ theme }) => theme.space.md};
`;

const NavbarSearchDock = styled.div<{ $visible: boolean }>`
  position: fixed;
  top: 14px;
  left: 50%;
  z-index: 25;
  width: min(520px, calc(100vw - 420px));
  opacity: ${({ $visible }) => ($visible ? 1 : 0)};
  pointer-events: ${({ $visible }) => ($visible ? "auto" : "none")};
  transform: translate(-50%, ${({ $visible }) => ($visible ? "0" : "-8px")});
  transition:
    opacity 180ms ease,
    transform 180ms ease;

  @media (max-width: 980px) {
    top: ${({ theme }) => theme.layout.headerHeight};
    width: min(640px, calc(100vw - 24px));
    padding-top: ${({ theme }) => theme.space.sm};
  }
`;

const SectionHeader = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: end;
  justify-content: space-between;
  gap: ${({ theme }) => theme.space.md};
  padding-top: ${({ theme }) => theme.space.md};
`;

const TitleGroup = styled.div`
  display: grid;
  gap: ${({ theme }) => theme.space.xs};
`;

const SectionTitle = styled.h2`
  margin: 0;
  font-size: clamp(1.6rem, 4vw, 2.45rem);
  line-height: 1.1;
  letter-spacing: 0;
`;

const SectionCopy = styled.p`
  margin: 0;
  color: ${({ theme }) => theme.colors.textMuted};
  line-height: 1.6;
`;

const AssetStrip = styled.div`
  position: relative;
  display: grid;
  grid-template-columns: auto minmax(0, 1fr);
  gap: ${({ theme }) => theme.space.md};
  align-items: center;
  padding: ${({ theme }) => theme.space.md};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.lg};
  overflow: hidden;
  background: ${({ theme }) => theme.colors.surfaceStrong};

  [data-theme="dark"] & {
    background: ${({ theme }) => theme.colors.surfaceStrong};
  }

  &::before,
  &::after {
    position: absolute;
    width: 220px;
    height: 220px;
    content: "";
    background-image: url("/assets/paw-pattern-light.svg");
    background-size: 220px 220px;
    opacity: 0.8;
    pointer-events: none;
  }

  &::before {
    top: -72px;
    right: -56px;
    transform: rotate(-18deg);
  }

  &::after {
    bottom: -96px;
    left: 28%;
    transform: rotate(24deg);
  }

  [data-theme="dark"] &::before,
  [data-theme="dark"] &::after {
    background-image: url("/assets/paw-pattern-dark.svg");
  }

  img {
    position: relative;
    z-index: 1;
    width: 72px;
    height: 72px;
    border-radius: ${({ theme }) => theme.radii.md};
  }

  p {
    position: relative;
    z-index: 1;
    margin: 0;
    color: ${({ theme }) => theme.colors.textMuted};
    line-height: 1.6;
  }

  @media (max-width: 640px) {
    grid-template-columns: 1fr;
  }
`;

const StatePanel = styled.div`
  display: grid;
  min-height: 400px;
  place-items: center;
  padding: ${({ theme }) => theme.space.xl};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.lg};
  background: ${({ theme }) => theme.colors.surfaceStrong};
  text-align: center;

  h2,
  p {
    margin: 0;
  }

  h2 {
    font-size: 1.45rem;
  }

  p {
    max-width: 46ch;
    color: ${({ theme }) => theme.colors.textMuted};
    line-height: 1.65;
  }
`;

const StateContent = styled.div`
  display: grid;
  gap: ${({ theme }) => theme.space.sm};
  justify-items: center;
`;

const ActionButton = styled.button`
  display: inline-flex;
  min-height: 44px;
  align-items: center;
  justify-content: center;
  border: 0;
  border-radius: ${({ theme }) => theme.radii.pill};
  padding: 0 ${({ theme }) => theme.space.lg};
  color: ${({ theme }) => theme.colors.primaryText};
  background: ${({ theme }) => theme.colors.primary};
  font-weight: 750;

  &:hover {
    background: ${({ theme }) => theme.colors.primaryHover};
  }
`;

const pulse = keyframes`
  0% {
    opacity: 0.58;
  }

  50% {
    opacity: 1;
  }

  100% {
    opacity: 0.58;
  }
`;

const SkeletonGrid = styled.div`
  column-count: 4;
  column-gap: ${({ theme }) => theme.space.md};

  @media (max-width: 1024px) {
    column-count: 2;
  }

  @media (max-width: 620px) {
    column-count: 1;
  }
`;

const SkeletonCard = styled.div<{ $height: number }>`
  display: inline-block;
  width: 100%;
  height: ${({ $height }) => $height}px;
  margin-bottom: ${({ theme }) => theme.space.md};
  border-radius: ${({ theme }) => theme.radii.md};
  background: ${({ theme }) => theme.colors.surfaceStrong};
  animation: ${pulse} 1.25s ease-in-out infinite;
`;

const LoadMoreSentinel = styled.div`
  min-height: 1px;
`;

const LoadingMore = styled.div`
  display: flex;
  justify-content: center;
  padding: ${({ theme }) => theme.space.lg} 0 0;
`;

const ResultsStage = styled.section<{ $minHeight?: number }>`
  min-height: ${({ $minHeight }) =>
    $minHeight ? `${Math.round($minHeight)}px` : "0"};
  transition: min-height 200ms ease;
`;

export function Home() {
  const { pets, isLoading, isError, isEmpty, error, retry } = usePets();
  const {
    selectedIds,
    selectedCount,
    isSelected,
    toggleSelection,
    selectMany,
    clearSelection,
  } = useSelection();
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState<SortBy>("name");
  const [nameSort, setNameSort] = useState<NameSort>("name-asc");
  const [dateSort, setDateSort] = useState<DateSort>("date-desc");
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const [isDownloading, setIsDownloading] = useState(false);
  const loadMoreRef = useRef<HTMLDivElement | null>(null);
  const heroRef = useRef<HTMLElement | null>(null);
  const resultsContentRef = useRef<HTMLDivElement | null>(null);
  const [showNavbarSearch, setShowNavbarSearch] = useState(false);
  const [resultsMinHeight, setResultsMinHeight] = useState(0);
  const debouncedSearchTerm = useDebounce(searchTerm);

  const filteredPets = useMemo(
    () =>
      sortPets(
        filterPets(pets, debouncedSearchTerm),
        nameSort,
        dateSort,
        sortBy,
      ),
    [dateSort, debouncedSearchTerm, nameSort, pets, sortBy],
  );
  const visiblePets = useMemo(
    () => paginatePets(filteredPets, 1, visibleCount),
    [filteredPets, visibleCount],
  );
  const hasMorePets = visibleCount < filteredPets.length;
  const selectedPets = useMemo(
    () => pets.filter((pet) => selectedIds.includes(pet.id)),
    [pets, selectedIds],
  );
  const selectedSizeBytes = selectedPets.reduce(
    (total, pet) => total + pet.sizeBytes,
    0,
  );
  const showNoMatches =
    !isLoading && !isError && !isEmpty && filteredPets.length === 0;
  const stageMinHeight = showNoMatches
    ? Math.max(320, Math.min(resultsMinHeight, 560))
    : 0;

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    setVisibleCount(PAGE_SIZE);
  };

  const handleSortByChange = (value: SortBy) => {
    setSortBy(value);
    setVisibleCount(PAGE_SIZE);
  };

  const handleNameSortChange = (value: NameSort) => {
    setNameSort(value);
    setVisibleCount(PAGE_SIZE);
  };

  const handleDateSortChange = (value: DateSort) => {
    setDateSort(value);
    setVisibleCount(PAGE_SIZE);
  };

  useEffect(() => {
    const loadMoreElement = loadMoreRef.current;

    if (!loadMoreElement || !hasMorePets) {
      return undefined;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisibleCount((currentCount) =>
            Math.min(currentCount + PAGE_SIZE, filteredPets.length),
          );
        }
      },
      { rootMargin: "420px 0px" },
    );

    observer.observe(loadMoreElement);

    return () => observer.disconnect();
  }, [filteredPets.length, hasMorePets]);

  useEffect(() => {
    const heroElement = heroRef.current;

    if (!heroElement) {
      return undefined;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        setShowNavbarSearch(!entry.isIntersecting);
      },
      { threshold: 0.04 },
    );

    observer.observe(heroElement);

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const resultsElement = resultsContentRef.current;

    if (!resultsElement || isLoading || isError || filteredPets.length === 0) {
      return undefined;
    }

    // Hold onto the last populated gallery height so "no matches" does not yank the page upward.
    const updateHeight = () => {
      setResultsMinHeight(resultsElement.getBoundingClientRect().height);
    };

    updateHeight();

    const observer = new ResizeObserver(updateHeight);
    observer.observe(resultsElement);

    return () => observer.disconnect();
  }, [filteredPets.length, isError, isLoading, visiblePets.length]);

  const handleSelectAll = () => {
    selectMany(filteredPets.map((pet) => pet.id));
  };

  const handleDownloadPets = async (petsToDownload: Pet[]) => {
    if (petsToDownload.length === 0) {
      return;
    }

    setIsDownloading(true);

    try {
      await downloadPetImages(petsToDownload);
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <Shell>
      <NavbarSearchDock
        $visible={showNavbarSearch}
        aria-hidden={!showNavbarSearch}
      >
        <SearchBar
          compact
          value={searchTerm}
          tabIndex={showNavbarSearch ? 0 : -1}
          onChange={handleSearchChange}
        />
      </NavbarSearchDock>

      <Hero
        ref={heroRef}
        searchTerm={searchTerm}
        onSearchChange={handleSearchChange}
      />

      <Controls
        sortBy={sortBy}
        nameSort={nameSort}
        dateSort={dateSort}
        filteredCount={filteredPets.length}
        selectedCount={selectedCount}
        selectedSizeBytes={selectedSizeBytes}
        isDownloading={isDownloading}
        onSortByChange={handleSortByChange}
        onNameSortChange={handleNameSortChange}
        onDateSortChange={handleDateSortChange}
        onSelectAll={handleSelectAll}
        onClearSelection={clearSelection}
        onDownloadSelected={() => void handleDownloadPets(selectedPets)}
      />

      <SectionHeader>
        <TitleGroup>
          <SectionTitle>Pet House</SectionTitle>
          <SectionCopy>
            A cozy gallery of pets waiting to be found, selected, and saved as
            your next tiny sidekick.
          </SectionCopy>
        </TitleGroup>
      </SectionHeader>

      <AssetStrip>
        <img src="/assets/pet-house-badge.svg" alt="" aria-hidden="true" />
        <p>
          Wander through the house, choose the companions that make you pause,
          and keep their photos ready whenever you want another look.
        </p>
      </AssetStrip>

      <ResultsStage $minHeight={stageMinHeight}>
        {isLoading ? (
          <SkeletonGrid aria-label="Loading pet cards">
            {[260, 340, 290, 420, 310, 360, 280, 390].map((height, index) => (
              <SkeletonCard key={`${height}-${index}`} $height={height} />
            ))}
          </SkeletonGrid>
        ) : null}

        {isError ? (
          <StatePanel role="alert">
            <StateContent>
              <h2>Unable to load pets</h2>
              <p>{error}</p>
              <ActionButton type="button" onClick={retry}>
                Try again
              </ActionButton>
            </StateContent>
          </StatePanel>
        ) : null}

        {isEmpty ? (
          <StatePanel>
            <StateContent>
              <h2>No pets available</h2>
              <p>
                The house is quiet right now. Check back for new companions.
              </p>
            </StateContent>
          </StatePanel>
        ) : null}

        {showNoMatches ? (
          <StatePanel>
            <StateContent>
              <h2>No matching pets</h2>
              <p>Try a different title or description search.</p>
              <ActionButton type="button" onClick={() => setSearchTerm("")}>
                Clear search
              </ActionButton>
            </StateContent>
          </StatePanel>
        ) : null}

        {!isLoading && !isError && filteredPets.length > 0 ? (
          <div ref={resultsContentRef}>
            <MasonryLayout>
              {visiblePets.map((pet) => (
                <PetCard
                  key={pet.id}
                  pet={pet}
                  isSelected={isSelected(pet.id)}
                  onToggleSelection={toggleSelection}
                  onDownload={(selectedPet) =>
                    void downloadPetImage(selectedPet)
                  }
                />
              ))}
            </MasonryLayout>

            {hasMorePets ? (
              <>
                <LoadMoreSentinel ref={loadMoreRef} />
                <LoadingMore>
                  <Loader label="" />
                </LoadingMore>
              </>
            ) : null}
          </div>
        ) : null}
      </ResultsStage>
    </Shell>
  );
}
