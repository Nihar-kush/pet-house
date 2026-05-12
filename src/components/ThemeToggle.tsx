import { FiMoon, FiSun } from "react-icons/fi";
import styled from "styled-components";
import { useThemeMode } from "../context/themeModeContext";

const ToggleButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 44px;
  border: none;
  border-radius: ${({ theme }) => theme.radii.pill};
  color: ${({ theme }) => theme.colors.textMuted};
  background: transparent;
  transition:
    transform 160ms ease,
    background 160ms ease;

  &:hover,
  &.active {
    color: ${({ theme }) => theme.colors.text};
    background: ${({ theme }) => theme.colors.surfaceStrong};
  }

  svg {
    width: 19px;
    height: 19px;
  }
`;

export function ThemeToggle() {
  const { mode, toggleTheme } = useThemeMode();
  const isDark = mode === "dark";

  return (
    <ToggleButton
      type="button"
      onClick={toggleTheme}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      title={isDark ? "Switch to light mode" : "Switch to dark mode"}
    >
      {isDark ? <FiSun aria-hidden="true" /> : <FiMoon aria-hidden="true" />}
    </ToggleButton>
  );
}
