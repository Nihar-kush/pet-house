import { Children, useMemo, type ReactNode } from "react";
import styled from "styled-components";
import { useColumnCount } from "../hooks/useColumnCount";

const MasonryWrapper = styled.div`
  display: flex;
  width: 100%;
  gap: ${({ theme }) => theme.space.md};
  align-items: flex-start;
`;

const MasonryColumn = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  min-width: 0;
  gap: ${({ theme }) => theme.space.md};
`;

export function MasonryLayout({ children }: { children: ReactNode }) {
  const columns = useColumnCount();

  const columnContents = useMemo(() => {
    const result: ReactNode[][] = Array.from({ length: columns }, () => []);

    Children.forEach(children, (child, index) => {
      result[index % columns].push(child);
    });

    return result;
  }, [children, columns]);

  return (
    <MasonryWrapper>
      {columnContents.map((column, colIndex) => (
        <MasonryColumn key={colIndex}>{column}</MasonryColumn>
      ))}
    </MasonryWrapper>
  );
}
