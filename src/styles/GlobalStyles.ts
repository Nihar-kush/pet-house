import { createGlobalStyle } from "styled-components";

export const GlobalStyles = createGlobalStyle`
  :root {
    color-scheme: ${({ theme }) => theme.mode};
  }

  html {
    background: ${({ theme }) => theme.colors.background};
    scroll-behavior: smooth;
    scrollbar-gutter: stable;
  }

  body {
    min-width: 320px;
    color: ${({ theme }) => theme.colors.text};
    background: ${({ theme }) => theme.colors.background};
    transition:
      color 180ms ease,
      background 180ms ease;
  }

  button,
  input,
  select,
  textarea {
    color: inherit;
  }

  button {
    cursor: pointer;
  }

  button:disabled {
    cursor: not-allowed;
  }

  :focus-visible {
    outline: 3px solid ${({ theme }) => theme.colors.focus};
    outline-offset: 3px;
  }

  ::selection {
    color: ${({ theme }) => theme.colors.primaryText};
    background: ${({ theme }) => theme.colors.primary};
  }
`;
