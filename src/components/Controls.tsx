import { useEffect, useRef } from "react";
import {
  FiCalendar,
  FiCheck,
  FiChevronDown,
  FiDownload,
  FiRefreshCw,
  FiTrash2,
  FiType,
} from "react-icons/fi";
import styled from "styled-components";
import type { DateSort, NameSort, SortBy } from "../types";
import { formatFileSize } from "../utils";

type ControlsProps = {
  sortBy: SortBy;
  nameSort: NameSort;
  dateSort: DateSort;
  filteredCount: number;
  selectedCount: number;
  selectedSizeBytes: number;
  isDownloading: boolean;
  onSortByChange: (value: SortBy) => void;
  onNameSortChange: (value: NameSort) => void;
  onDateSortChange: (value: DateSort) => void;
  onSelectAll: () => void;
  onClearSelection: () => void;
  onDownloadSelected: () => void;
};

const Toolbar = styled.section`
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  gap: ${({ theme }) => theme.space.md};
  align-items: center;
  padding: ${({ theme }) => theme.space.md} 0 ${({ theme }) => theme.space.sm};

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
  }
`;

const Summary = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.space.sm};
  align-items: center;
  min-height: 44px;
  color: ${({ theme }) => theme.colors.textMuted};
  font-size: 0.95rem;
`;

const SelectionChip = styled.span`
  display: inline-flex;
  min-height: 36px;
  align-items: center;
  gap: ${({ theme }) => theme.space.sm};
  padding: 0 ${({ theme }) => theme.space.md};
  border: 1px solid ${({ theme }) => theme.colors.text};
  border-radius: ${({ theme }) => theme.radii.pill};
  color: ${({ theme }) => theme.colors.text};
  background: ${({ theme }) => theme.colors.surface};
  font-weight: 700;
`;

const Actions = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-end;
  gap: ${({ theme }) => theme.space.sm};

  @media (max-width: 900px) {
    justify-content: flex-start;
  }

  @media (max-width: 520px) {
    > * {
      flex: 1 1 100%;
    }
  }
`;

const SortMenu = styled.details`
  position: relative;

  @media (max-width: 520px) {
    width: 100%;
  }

  &[open] summary {
    border-color: ${({ theme }) => theme.colors.text};
    background: ${({ theme }) => theme.colors.surfaceStrong};
  }
`;

const SortSummary = styled.summary`
  display: inline-flex;
  height: 44px;
  align-items: center;
  justify-content: center;
  gap: ${({ theme }) => theme.space.sm};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.pill};
  padding: 0 ${({ theme }) => theme.space.md};
  color: ${({ theme }) => theme.colors.text};
  background: ${({ theme }) => theme.colors.surface};
  font-weight: 750;
  list-style: none;
  cursor: pointer;
  transition:
    background 160ms ease,
    border-color 160ms ease,
    transform 160ms ease;

  &::-webkit-details-marker {
    display: none;
  }

  &:hover {
    border-color: ${({ theme }) => theme.colors.text};
    background: ${({ theme }) => theme.colors.surfaceStrong};
  }

  svg {
    width: 16px;
    height: 16px;
  }

  @media (max-width: 520px) {
    width: 100%;
  }
`;

const MenuPanel = styled.div`
  position: absolute;
  top: calc(100% + ${({ theme }) => theme.space.sm});
  right: 0;
  z-index: 30;
  display: grid;
  width: min(320px, calc(100vw - 24px));
  gap: ${({ theme }) => theme.space.md};
  padding: ${({ theme }) => theme.space.md};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.lg};
  background: ${({ theme }) => theme.colors.surface};
  box-shadow: ${({ theme }) => theme.colors.shadow};

  @media (max-width: 640px) {
    right: auto;
    left: 0;
  }

  @media (max-width: 520px) {
    width: 100%;
  }
`;

const MenuSection = styled.div`
  display: grid;
  gap: ${({ theme }) => theme.space.sm};
`;

const MenuTitle = styled.p`
  margin: 0;
  color: ${({ theme }) => theme.colors.textMuted};
  font-size: 0.78rem;
  font-weight: 800;
`;

const OptionGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: ${({ theme }) => theme.space.sm};

  @media (max-width: 360px) {
    grid-template-columns: 1fr;
  }
`;

const MenuOption = styled.button<{ $active?: boolean }>`
  display: inline-flex;
  min-height: 42px;
  align-items: center;
  justify-content: space-between;
  gap: ${({ theme }) => theme.space.sm};
  border: 1px solid
    ${({ theme, $active }) =>
      $active ? theme.colors.text : theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.md};
  padding: 0 ${({ theme }) => theme.space.sm};
  color: ${({ theme, $active }) =>
    $active ? theme.colors.textInverse : theme.colors.text};
  background: ${({ theme, $active }) =>
    $active ? theme.colors.surfaceInverse : theme.colors.surface};
  font-weight: 750;
  transition:
    background 150ms ease,
    border-color 150ms ease,
    color 150ms ease,
    transform 150ms ease;

  &:hover {
    border-color: ${({ theme }) => theme.colors.text};
    background: ${({ theme, $active }) =>
      $active ? theme.colors.surfaceInverse : theme.colors.surfaceStrong};
  }

  svg {
    width: 16px;
    height: 16px;
  }
`;

const OptionText = styled.span`
  display: inline-flex;
  align-items: center;
  gap: ${({ theme }) => theme.space.sm};
`;

const Button = styled.button<{ $variant?: "primary" }>`
  display: inline-flex;
  height: 44px;
  align-items: center;
  justify-content: center;
  gap: ${({ theme }) => theme.space.sm};
  border: 1px solid
    ${({ theme, $variant }) =>
      $variant === "primary" ? theme.colors.text : theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.pill};
  padding: 0 ${({ theme }) => theme.space.md};
  color: ${({ theme, $variant }) =>
    $variant === "primary" ? theme.colors.primaryText : theme.colors.text};
  background: ${({ theme, $variant }) =>
    $variant === "primary" ? theme.colors.primary : theme.colors.surface};
  font-weight: 750;
  white-space: nowrap;
  transition:
    background 160ms ease,
    border-color 160ms ease,
    color 160ms ease,
    opacity 160ms ease,
    transform 160ms ease;

  &:hover:not(:disabled) {
    border-color: ${({ theme }) => theme.colors.text};
    background: ${({ theme, $variant }) =>
      $variant === "primary"
        ? theme.colors.primaryHover
        : theme.colors.surfaceStrong};
  }

  &:disabled {
    opacity: 0.42;
  }

  @media (max-width: 520px) {
    width: 100%;
  }
`;

function getOrderLabel(sortBy: SortBy, nameSort: NameSort, dateSort: DateSort) {
  if (sortBy === "name") {
    return nameSort === "name-asc" ? "A-Z" : "Z-A";
  }

  return dateSort === "date-desc" ? "Newest" : "Oldest";
}

export function Controls({
  sortBy,
  nameSort,
  dateSort,
  filteredCount,
  selectedCount,
  selectedSizeBytes,
  isDownloading,
  onSortByChange,
  onNameSortChange,
  onDateSortChange,
  onSelectAll,
  onClearSelection,
  onDownloadSelected,
}: ControlsProps) {
  const hasSelection = selectedCount > 0;
  const orderLabel = getOrderLabel(sortBy, nameSort, dateSort);
  const sortMenuRef = useRef<HTMLDetailsElement | null>(null);

  useEffect(() => {
    const handlePointerDown = (event: PointerEvent) => {
      const sortMenu = sortMenuRef.current;

      if (!sortMenu?.open) {
        return;
      }

      if (event.target instanceof Node && !sortMenu.contains(event.target)) {
        sortMenu.open = false;
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      const sortMenu = sortMenuRef.current;

      if (event.key === "Escape" && sortMenu?.open) {
        sortMenu.open = false;
      }
    };

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  return (
    <Toolbar aria-label="Gallery controls">
      <Summary>
        {hasSelection && (
          <SelectionChip>
            {selectedCount} selected
            <span aria-hidden="true">/</span>
            {formatFileSize(selectedSizeBytes)}
          </SelectionChip>
        )}
      </Summary>

      <Actions>
        <SortMenu ref={sortMenuRef}>
          <SortSummary>
            {sortBy === "name" ? (
              <FiType aria-hidden="true" />
            ) : (
              <FiCalendar aria-hidden="true" />
            )}
            Sort: {sortBy === "name" ? "Name" : "Date"} / {orderLabel}
            <FiChevronDown aria-hidden="true" />
          </SortSummary>

          <MenuPanel>
            <MenuSection>
              <MenuTitle>Sort by</MenuTitle>
              <OptionGrid>
                <MenuOption
                  type="button"
                  $active={sortBy === "name"}
                  onClick={() => onSortByChange("name")}
                >
                  <OptionText>
                    <FiType aria-hidden="true" />
                    Name
                  </OptionText>
                  {sortBy === "name" ? <FiCheck aria-hidden="true" /> : null}
                </MenuOption>
                <MenuOption
                  type="button"
                  $active={sortBy === "date"}
                  onClick={() => onSortByChange("date")}
                >
                  <OptionText>
                    <FiCalendar aria-hidden="true" />
                    Date
                  </OptionText>
                  {sortBy === "date" ? <FiCheck aria-hidden="true" /> : null}
                </MenuOption>
              </OptionGrid>
            </MenuSection>

            <MenuSection>
              <MenuTitle>Order by</MenuTitle>
              {sortBy === "name" ? (
                <OptionGrid>
                  <MenuOption
                    type="button"
                    $active={nameSort === "name-asc"}
                    onClick={() => onNameSortChange("name-asc")}
                  >
                    A-Z
                    {nameSort === "name-asc" ? (
                      <FiCheck aria-hidden="true" />
                    ) : null}
                  </MenuOption>
                  <MenuOption
                    type="button"
                    $active={nameSort === "name-desc"}
                    onClick={() => onNameSortChange("name-desc")}
                  >
                    Z-A
                    {nameSort === "name-desc" ? (
                      <FiCheck aria-hidden="true" />
                    ) : null}
                  </MenuOption>
                </OptionGrid>
              ) : (
                <OptionGrid>
                  <MenuOption
                    type="button"
                    $active={dateSort === "date-desc"}
                    onClick={() => onDateSortChange("date-desc")}
                  >
                    Newest
                    {dateSort === "date-desc" ? (
                      <FiCheck aria-hidden="true" />
                    ) : null}
                  </MenuOption>
                  <MenuOption
                    type="button"
                    $active={dateSort === "date-asc"}
                    onClick={() => onDateSortChange("date-asc")}
                  >
                    Oldest
                    {dateSort === "date-asc" ? (
                      <FiCheck aria-hidden="true" />
                    ) : null}
                  </MenuOption>
                </OptionGrid>
              )}
            </MenuSection>
          </MenuPanel>
        </SortMenu>

        <Button
          type="button"
          onClick={onSelectAll}
          disabled={filteredCount === 0}
        >
          Select All
        </Button>
        <Button
          type="button"
          onClick={onClearSelection}
          disabled={!hasSelection}
        >
          <FiTrash2 aria-hidden="true" />
          Clear
        </Button>
        <Button
          type="button"
          $variant="primary"
          onClick={onDownloadSelected}
          disabled={!hasSelection || isDownloading}
        >
          {isDownloading ? (
            <FiRefreshCw aria-hidden="true" />
          ) : (
            <FiDownload aria-hidden="true" />
          )}
          {isDownloading ? "Downloading" : "Download"}
        </Button>
      </Actions>
    </Toolbar>
  );
}
