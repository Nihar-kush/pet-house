import type { ReactNode } from "react";
import styled from "styled-components";

const Grid = styled.div`
  column-count: 4;
  column-gap: ${({ theme }) => theme.space.md};

  @media (max-width: 1024px) {
    column-count: 2;
  }

  @media (max-width: 620px) {
    column-count: 1;
  }
`;

export function MasonryLayout({ children }: { children: ReactNode }) {
  return <Grid>{children}</Grid>;
}
