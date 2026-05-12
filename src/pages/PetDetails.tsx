import { FiArrowLeft, FiCheck, FiDownload, FiPlus } from "react-icons/fi";
import { Link, useParams } from "react-router-dom";
import styled from "styled-components";
import { Loader } from "../components/Loader";
import { useSelection } from "../context/selectionContext";
import { usePets } from "../hooks/usePets";
import { downloadPetImage, formatDate, formatFileSize } from "../utils";

const DetailShell = styled.section`
  display: grid;
  gap: ${({ theme }) => theme.space.lg};
`;

const BackLink = styled(Link)`
  display: inline-flex;
  width: fit-content;
  min-height: 44px;
  align-items: center;
  gap: ${({ theme }) => theme.space.sm};
  padding: 0 ${({ theme }) => theme.space.md};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.pill};
  color: ${({ theme }) => theme.colors.text};
  background: ${({ theme }) => theme.colors.surface};
  font-weight: 700;
  transition:
    background 160ms ease,
    border-color 160ms ease,
    transform 160ms ease;

  &:hover {
    border-color: ${({ theme }) => theme.colors.text};
    background: ${({ theme }) => theme.colors.surfaceStrong};
  }
`;

const DetailGrid = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 1fr) 360px;
  gap: ${({ theme }) => theme.space.xl};
  align-items: start;

  @media (max-width: 980px) {
    grid-template-columns: 1fr;
  }
`;

const ImagePanel = styled.div`
  overflow: hidden;
  border-radius: ${({ theme }) => theme.radii.md};
  background: ${({ theme }) => theme.colors.surfaceStrong};
`;

const Image = styled.img`
  width: 100%;
  max-height: min(74vh, 840px);
  object-fit: contain;
  background: ${({ theme }) => theme.colors.surfaceStrong};
`;

const SidePanel = styled.aside`
  position: sticky;
  top: calc(${({ theme }) => theme.layout.headerHeight} + ${({ theme }) => theme.space.lg});
  display: grid;
  gap: ${({ theme }) => theme.space.lg};

  @media (max-width: 980px) {
    position: static;
  }
`;

const DetailBrand = styled.div`
  position: relative;
  display: grid;
  grid-template-columns: auto 1fr;
  gap: ${({ theme }) => theme.space.md};
  align-items: center;
  padding: ${({ theme }) => theme.space.md};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.md};
  overflow: hidden;
  background: ${({ theme }) => theme.colors.surfaceStrong};

  &::after {
    position: absolute;
    right: -74px;
    bottom: -86px;
    width: 190px;
    height: 190px;
    content: "";
    background-image: url("/assets/paw-pattern-light.svg");
    background-size: 190px 190px;
    pointer-events: none;
    transform: rotate(28deg);
  }

  &::before {
    position: absolute;
    top: -78px;
    left: 34px;
    width: 150px;
    height: 150px;
    content: "";
    background-image: url("/assets/paw-pattern-light.svg");
    background-size: 150px 150px;
    pointer-events: none;
    transform: rotate(-18deg);
  }

  [data-theme="dark"] &::after,
  [data-theme="dark"] &::before {
    background-image: url("/assets/paw-pattern-dark.svg");
  }

  img {
    position: relative;
    z-index: 1;
    width: 48px;
    height: 48px;
    border-radius: ${({ theme }) => theme.radii.sm};
  }

  p {
    position: relative;
    z-index: 1;
    margin: 0;
    color: ${({ theme }) => theme.colors.textMuted};
    font-size: 0.92rem;
    line-height: 1.45;
  }
`;

const Title = styled.h1`
  margin: 0;
  font-size: clamp(2rem, 5vw, 3.25rem);
  line-height: 1.05;
  letter-spacing: 0;
`;

const Copy = styled.p`
  margin: 0;
  color: ${({ theme }) => theme.colors.textMuted};
  line-height: 1.75;
`;

const Actions = styled.div`
  display: grid;
  gap: ${({ theme }) => theme.space.sm};
`;

const Button = styled.button<{ $variant?: "primary" }>`
  display: inline-flex;
  min-height: 48px;
  align-items: center;
  justify-content: center;
  gap: ${({ theme }) => theme.space.sm};
  border: 1px solid
    ${({ theme, $variant }) =>
      $variant === "primary" ? theme.colors.primary : theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.pill};
  padding: 0 ${({ theme }) => theme.space.lg};
  color: ${({ theme, $variant }) =>
    $variant === "primary" ? theme.colors.primaryText : theme.colors.text};
  background: ${({ theme, $variant }) =>
    $variant === "primary" ? theme.colors.primary : theme.colors.surface};
  font-weight: 750;

  &:hover {
    border-color: ${({ theme }) => theme.colors.primary};
    background: ${({ theme, $variant }) =>
      $variant === "primary" ? theme.colors.primaryHover : theme.colors.surfaceStrong};
  }
`;

const MetaList = styled.dl`
  display: grid;
  grid-template-columns: auto 1fr;
  gap: ${({ theme }) => theme.space.sm} ${({ theme }) => theme.space.md};
  padding: ${({ theme }) => theme.space.lg} 0 0;
  margin: 0;
  border-top: 1px solid ${({ theme }) => theme.colors.border};

  dt {
    color: ${({ theme }) => theme.colors.textMuted};
  }

  dd {
    margin: 0;
    color: ${({ theme }) => theme.colors.text};
    font-weight: 650;
    text-align: right;
  }
`;

const StatePanel = styled.div`
  display: grid;
  min-height: 320px;
  place-items: center;
  padding: ${({ theme }) => theme.space.xl};
  border-radius: ${({ theme }) => theme.radii.lg};
  background: ${({ theme }) => theme.colors.surfaceStrong};
  text-align: center;

  h1,
  p {
    margin: 0;
  }

  p {
    color: ${({ theme }) => theme.colors.textMuted};
  }
`;

export function PetDetails() {
  const { id } = useParams();
  const { pets, isLoading, isError, error, retry } = usePets();
  const { isSelected, toggleSelection } = useSelection();
  const pet = pets.find((currentPet) => currentPet.id === id);

  if (isLoading) {
    return (
      <DetailShell>
        <BackLink to="/">
          <FiArrowLeft aria-hidden="true" />
          Back to gallery
        </BackLink>
        <StatePanel>
          <Loader label="" />
        </StatePanel>
      </DetailShell>
    );
  }

  if (isError) {
    return (
      <DetailShell>
        <BackLink to="/">
          <FiArrowLeft aria-hidden="true" />
          Back to gallery
        </BackLink>
        <StatePanel role="alert">
          <h1>Unable to load this pet</h1>
          <p>{error}</p>
          <Button type="button" $variant="primary" onClick={retry}>
            Try again
          </Button>
        </StatePanel>
      </DetailShell>
    );
  }

  if (!pet) {
    return (
      <DetailShell>
        <BackLink to="/">
          <FiArrowLeft aria-hidden="true" />
          Back to gallery
        </BackLink>
        <StatePanel>
          <h1>Pet not found</h1>
          <p>This pet may have wandered into another room.</p>
        </StatePanel>
      </DetailShell>
    );
  }

  const selected = isSelected(pet.id);

  return (
    <DetailShell>
      <BackLink to="/">
        <FiArrowLeft aria-hidden="true" />
        Back to gallery
      </BackLink>
      <DetailGrid>
        <ImagePanel>
          <Image src={pet.url} alt={pet.description} />
        </ImagePanel>

        <SidePanel>
          <DetailBrand>
            <img src="/assets/pet-house-logo-light.svg" alt="" aria-hidden="true" />
            <p>Save this buddy to your shortlist, then keep exploring the house.</p>
          </DetailBrand>

          <Title>{pet.title}</Title>
          <Copy>{pet.description}</Copy>

          <Actions>
            <Button
              type="button"
              $variant="primary"
              onClick={() => void downloadPetImage(pet)}
            >
              <FiDownload aria-hidden="true" />
              Download pet
            </Button>
            <Button type="button" onClick={() => toggleSelection(pet.id)}>
              {selected ? <FiCheck aria-hidden="true" /> : <FiPlus aria-hidden="true" />}
              {selected ? "Selected" : "Add to selection"}
            </Button>
          </Actions>

          <MetaList>
            <dt>Created</dt>
            <dd>{formatDate(pet.createdAt)}</dd>
            <dt>File size</dt>
            <dd>
              {formatFileSize(pet.sizeBytes)} {pet.sizeSource === "estimated" ? "est." : ""}
            </dd>
          </MetaList>
        </SidePanel>
      </DetailGrid>
    </DetailShell>
  );
}
