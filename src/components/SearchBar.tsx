import { FiSearch, FiX } from "react-icons/fi";
import styled from "styled-components";

type SearchBarProps = {
  value: string;
  placeholder?: string;
  compact?: boolean;
  tabIndex?: number;
  onChange: (value: string) => void;
};

const SearchWrap = styled.div<{ $compact?: boolean }>`
  display: grid;
  grid-template-columns: auto 1fr auto;
  align-items: center;
  width: 100%;
  min-height: ${({ $compact }) => ($compact ? "46px" : "66px")};
  padding: 0 ${({ theme, $compact }) => ($compact ? theme.space.xs : theme.space.sm)}
    0 ${({ theme, $compact }) => ($compact ? theme.space.md : theme.space.lg)};
  border: 1px solid ${({ $compact }) => ($compact ? "#d0d0d0" : "transparent")};
  border-radius: ${({ theme }) => theme.radii.md};
  color: #111111;
  background: #ffffff;
  box-shadow: ${({ $compact }) =>
    $compact ? "0 10px 26px rgba(0, 0, 0, 0.12)" : "0 18px 48px rgba(0, 0, 0, 0.24)"};
  transition:
    border-color 180ms ease,
    box-shadow 180ms ease,
    transform 180ms ease;

  &:focus-within {
    border-color: ${({ $compact }) => ($compact ? "#d9d9d9" : "transparent")};
    box-shadow: ${({ $compact }) =>
      $compact
        ? "0 12px 30px rgba(0, 0, 0, 0.14)"
        : "0 20px 52px rgba(0, 0, 0, 0.26)"};
  }

  svg {
    width: ${({ $compact }) => ($compact ? "18px" : "22px")};
    height: ${({ $compact }) => ($compact ? "18px" : "22px")};
    color: #6b6b6b;
  }

  @media (max-width: 540px) {
    min-height: ${({ $compact }) => ($compact ? "44px" : "58px")};
  }
`;

const SearchInput = styled.input`
  width: 100%;
  min-width: 0;
  border: 0;
  padding: 0 ${({ theme }) => theme.space.md};
  color: #111111;
  background: transparent;
  font-size: 1rem;
  outline: none;

  &:focus,
  &:focus-visible {
    outline: none;
  }

  &::placeholder {
    color: #777777;
  }

  &::-webkit-search-cancel-button,
  &::-webkit-search-decoration {
    appearance: none;
  }
`;

const ClearButton = styled.button<{ $visible: boolean }>`
  display: inline-flex;
  width: ${({ $visible }) => ($visible ? "40px" : "0")};
  height: 40px;
  align-items: center;
  justify-content: center;
  border: 0;
  border-radius: ${({ theme }) => theme.radii.pill};
  color: #4a4a4a;
  background: transparent;
  overflow: hidden;
  opacity: ${({ $visible }) => ($visible ? 1 : 0)};
  pointer-events: ${({ $visible }) => ($visible ? "auto" : "none")};
  transform: scale(${({ $visible }) => ($visible ? 1 : 0.84)});
  transition:
    width 150ms ease,
    opacity 150ms ease,
    transform 150ms ease,
    background 150ms ease;

  &:hover {
    background: #f0f0f0;
  }

  &:focus,
  &:focus-visible {
    outline: none;
  }
`;

export function SearchBar({
  value,
  placeholder = "Search for amazing pets",
  compact,
  tabIndex,
  onChange,
}: SearchBarProps) {
  const hasValue = value.length > 0;

  return (
    <SearchWrap $compact={compact}>
      <FiSearch aria-hidden="true" />
      <SearchInput
        type="search"
        value={value}
        tabIndex={tabIndex}
        aria-label="Search pets"
        placeholder={placeholder}
        onChange={(event) => onChange(event.target.value)}
      />
      <ClearButton
        type="button"
        $visible={hasValue}
        tabIndex={hasValue ? tabIndex : -1}
        aria-label="Clear search"
        onClick={() => onChange("")}
      >
        <FiX aria-hidden="true" />
      </ClearButton>
    </SearchWrap>
  );
}
