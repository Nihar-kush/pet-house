import type { PointerEvent } from "react";
import { FiCheck, FiDownload, FiPlus } from "react-icons/fi";
import { Link } from "react-router-dom";
import styled from "styled-components";
import type { Pet } from "../types";

type PetCardProps = {
  pet: Pet;
  isSelected: boolean;
  onToggleSelection: (id: string) => void;
  onDownload: (pet: Pet) => void;
};

const Card = styled.article`
  position: relative;
  display: inline-block;
  width: 100%;
  margin: 0 0 ${({ theme }) => theme.space.md};
  break-inside: avoid;
  overflow: hidden;
  border-radius: ${({ theme }) => theme.radii.md};
  background: ${({ theme }) => theme.colors.surfaceStrong};
  transition:
    box-shadow 220ms ease,
    transform 220ms ease;

  &:hover,
  &:focus-within {
    box-shadow: 0 18px 42px rgba(0, 0, 0, 0.14);
  }
`;

const CardLink = styled(Link)`
  position: absolute;
  inset: 0;
  z-index: 1;
`;

const Image = styled.img`
  display: block;
  width: 100%;
  height: auto;
`;

const TopActions = styled.div`
  position: absolute;
  top: ${({ theme }) => theme.space.md};
  right: ${({ theme }) => theme.space.md};
  z-index: 3;
  display: flex;
  gap: ${({ theme }) => theme.space.sm};
  opacity: 0;
  transform: translateX(18px);
  transition:
    opacity 240ms cubic-bezier(0.22, 1, 0.36, 1),
    transform 240ms cubic-bezier(0.22, 1, 0.36, 1);

  ${Card}:hover &,
  ${Card}:focus-within & {
    opacity: 1;
    transform: translateX(0);
  }

  @media (hover: none) {
    opacity: 1;
    transform: none;
  }
`;

const IconButton = styled.button<{ $selected?: boolean }>`
  display: inline-flex;
  width: 42px;
  height: 42px;
  align-items: center;
  justify-content: center;
  border: 0;
  border-radius: ${({ theme }) => theme.radii.pill};
  color: ${({ $selected }) => ($selected ? "#111111" : "#777777")};
  background: ${({ $selected }) =>
    $selected ? "#ffffff" : "rgba(255, 255, 255, 0.9)"};
  transition:
    background 160ms ease,
    color 160ms ease;

  &:hover {
    background: #ffffff;
    color: #111111;
  }
`;

const BottomOverlay = styled.div`
  position: absolute;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 2;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${({ theme }) => theme.space.sm};
  min-height: 92px;
  padding: ${({ theme }) => theme.space.lg} ${({ theme }) => theme.space.md}
    ${({ theme }) => theme.space.md};
  background: linear-gradient(180deg, transparent, rgba(0, 0, 0, 0.7));
  pointer-events: none;
  opacity: 0;
  transform: translateY(26px);
  transition:
    opacity 260ms cubic-bezier(0.22, 1, 0.36, 1),
    transform 260ms cubic-bezier(0.22, 1, 0.36, 1);

  ${Card}:hover &,
  ${Card}:focus-within & {
    opacity: 1;
    transform: translateY(0);
  }

  @media (hover: none) {
    opacity: 1;
    transform: none;
  }
`;

const Title = styled.h2`
  margin: 0;
  color: #ffffff;
  font-size: 1.02rem;
  line-height: 1.3;
  text-shadow: 0 1px 18px rgba(0, 0, 0, 0.55);
  opacity: 0;
  transform: translateY(10px);
  transition:
    opacity 240ms ease 40ms,
    transform 240ms cubic-bezier(0.22, 1, 0.36, 1) 40ms;

  ${Card}:hover &,
  ${Card}:focus-within & {
    opacity: 1;
    transform: translateY(0);
  }

  @media (hover: none) {
    opacity: 1;
    transform: none;
  }
`;

const DownloadButton = styled.button`
  display: inline-flex;
  width: 42px;
  height: 42px;
  flex: 0 0 auto;
  align-items: center;
  justify-content: center;
  border: 1px solid rgba(255, 255, 255, 0.72);
  border-radius: ${({ theme }) => theme.radii.pill};
  color: #ffffff;
  background: rgba(0, 0, 0, 0.18);
  backdrop-filter: blur(10px);
  pointer-events: auto;
  opacity: 0;
  transform: translateY(10px);
  transition:
    background 160ms ease,
    opacity 240ms ease 70ms,
    transform 240ms cubic-bezier(0.22, 1, 0.36, 1) 70ms;

  ${Card}:hover &,
  ${Card}:focus-within & {
    opacity: 1;
    transform: translateY(0);
  }

  @media (hover: none) {
    opacity: 1;
    transform: none;
  }

  &:hover {
    transform: translateY(-1px);
    background: rgba(255, 255, 255, 0.16);
  }
`;

export function PetCard({
  pet,
  isSelected,
  onToggleSelection,
  onDownload,
}: PetCardProps) {
  const handlePointerUp = (
    event: PointerEvent<HTMLButtonElement>,
  ) => {
    // Drop button focus after pointer taps so the hover overlay does not linger.
    event.currentTarget.blur();
  };

  return (
    <Card>
      <Image src={pet.url} alt={pet.description} loading="lazy" />
      <CardLink to={`/pets/${pet.id}`} aria-label={`View ${pet.title}`} />

      <TopActions>
        <IconButton
          type="button"
          $selected={isSelected}
          aria-pressed={isSelected}
          aria-label={
            isSelected ? `Deselect ${pet.title}` : `Select ${pet.title}`
          }
          onClick={() => onToggleSelection(pet.id)}
          onPointerUp={handlePointerUp}
        >
          {isSelected ? (
            <FiCheck aria-hidden="true" />
          ) : (
            <FiPlus aria-hidden="true" />
          )}
        </IconButton>
      </TopActions>

      <BottomOverlay>
        <Title>{pet.title}</Title>
        <DownloadButton
          type="button"
          aria-label={`Download ${pet.title}`}
          onClick={() => onDownload(pet)}
          onPointerUp={handlePointerUp}
        >
          <FiDownload aria-hidden="true" />
        </DownloadButton>
      </BottomOverlay>
    </Card>
  );
}
