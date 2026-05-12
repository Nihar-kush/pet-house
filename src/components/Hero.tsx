import { forwardRef } from "react";
import styled from "styled-components";
import { SearchBar } from "./SearchBar";

type HeroProps = {
  searchTerm: string;
  onSearchChange: (value: string) => void;
};

const HeroShell = styled.section`
  display: grid;
  min-height: 360px;
  align-items: center;
  padding: clamp(44px, 7vw, 84px) ${({ theme }) => theme.space.lg};
  border-radius: ${({ theme }) => theme.radii.lg};
  color: #ffffff;
  background-color: #111111;
  background:
    linear-gradient(90deg, rgba(0, 0, 0, 0.86), rgba(0, 0, 0, 0.34)),
    url("https://images.pexels.com/photos/3299905/pexels-photo-3299905.jpeg?auto=compress&cs=tinysrgb&w=1800&sat=-100");
  background-position:
    center,
    center 42%;
  background-size: cover, cover;

  @media (max-width: 640px) {
    min-height: 400px;
    padding: ${({ theme }) => theme.space.xl} ${({ theme }) => theme.space.md};
  }
`;

const HeroContent = styled.div`
  display: grid;
  max-width: 780px;
  gap: ${({ theme }) => theme.space.lg};
`;

const TitleGroup = styled.div`
  display: grid;
  gap: ${({ theme }) => theme.space.md};
`;

const Eyebrow = styled.p`
  width: fit-content;
  margin: 0;
  padding: 7px 12px;
  border-radius: ${({ theme }) => theme.radii.pill};
  color: #ffffff;
  background: rgba(255, 255, 255, 0.18);
  font-size: 0.84rem;
  font-weight: 750;
`;

const Title = styled.h1`
  max-width: 760px;
  margin: 0;
  font-size: clamp(2.5rem, 7vw, 5.4rem);
  line-height: 0.98;
  letter-spacing: 0;
`;

const Copy = styled.p`
  max-width: 620px;
  margin: 0;
  color: rgba(255, 255, 255, 0.88);
  font-size: clamp(1rem, 2.2vw, 1.25rem);
  line-height: 1.55;
`;

export const Hero = forwardRef<HTMLElement, HeroProps>(function Hero(
  { searchTerm, onSearchChange },
  ref,
) {
  return (
    <HeroShell ref={ref}>
      <HeroContent>
        <TitleGroup>
          <Eyebrow>Pet House</Eyebrow>
          <Title>Find your favorite little companion.</Title>
          <Copy>
            Meet curious companions, save your favorites, and bring home a
            little more tail-wagging joy.
          </Copy>
        </TitleGroup>

        <SearchBar value={searchTerm} onChange={onSearchChange} />
      </HeroContent>
    </HeroShell>
  );
});
