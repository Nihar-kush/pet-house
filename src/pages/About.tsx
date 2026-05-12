import styled from "styled-components";

const Article = styled.article`
  position: relative;
  display: grid;
  max-width: 900px;
  gap: ${({ theme }) => theme.space.xl};
  padding: clamp(32px, 7vw, 84px) 0;

  &::before {
    position: absolute;
    top: 24px;
    right: -90px;
    width: 240px;
    height: 240px;
    content: "";
    background-image: url("/assets/paw-pattern-light.svg");
    background-size: 240px 240px;
    opacity: 0.8;
    pointer-events: none;
    transform: rotate(17deg);
  }

  &::after {
    position: absolute;
    bottom: 120px;
    left: -110px;
    width: 260px;
    height: 260px;
    content: "";
    background-image: url("/assets/paw-pattern-light.svg");
    background-size: 260px 260px;
    opacity: 0.7;
    pointer-events: none;
    transform: rotate(-21deg);
  }

  @media (max-width: 720px) {
    overflow: hidden;

    &::before {
      right: -150px;
    }

    &::after {
      left: -170px;
    }
  }

  [data-theme="dark"] &::before,
  [data-theme="dark"] &::after {
    background-image: url("/assets/paw-pattern-dark.svg");
  }
`;

const Title = styled.h1`
  margin: 0;
  max-width: 760px;
  font-size: clamp(2.4rem, 7vw, 5.4rem);
  line-height: 0.98;
  letter-spacing: 0;
`;

const Copy = styled.p`
  margin: 0;
  max-width: 68ch;
  color: ${({ theme }) => theme.colors.textMuted};
  font-size: 1.08rem;
  line-height: 1.72;
`;

const FeatureGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: ${({ theme }) => theme.space.md};

  @media (max-width: 780px) {
    grid-template-columns: 1fr;
  }
`;

const BrandAsset = styled.img`
  width: min(320px, 100%);
  border-radius: ${({ theme }) => theme.radii.lg};
  transform: rotate(-2deg);
`;

const Feature = styled.section`
  display: grid;
  gap: ${({ theme }) => theme.space.sm};
  padding: ${({ theme }) => theme.space.lg};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.md};

  h2,
  p {
    margin: 0;
  }

  h2 {
    font-size: 1.05rem;
  }

  p {
    color: ${({ theme }) => theme.colors.textMuted};
    line-height: 1.62;
  }
`;

export function About() {
  return (
    <Article>
      <BrandAsset src="/assets/pet-house-badge.svg" alt="" aria-hidden="true" />
      <Title>A warm little house for discovering pets with personality.</Title>
      <Copy>
        Pet House is a simple place to wander through adorable companions,
        search by the traits that make you smile, and keep a shortlist of pets
        you would love to bring closer.
      </Copy>

      <FeatureGrid>
        <Feature>
          <h2>Browse</h2>
          <p>
            Search names and little personality notes to quickly find the pet
            that catches your eye.
          </p>
        </Feature>
        <Feature>
          <h2>Shortlist</h2>
          <p>
            Select favorites as you move through the house. Your picks stay
            ready while you explore details.
          </p>
        </Feature>
        <Feature>
          <h2>Keep</h2>
          <p>
            Download the pets you love most and keep their photos close for
            later.
          </p>
        </Feature>
      </FeatureGrid>
    </Article>
  );
}
