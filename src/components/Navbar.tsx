import { NavLink } from "react-router-dom";
import styled from "styled-components";
import { useSelection } from "../context/selectionContext";
import { useThemeMode } from "../context/themeModeContext";
import { ThemeToggle } from "./ThemeToggle";

const Header = styled.header`
  position: sticky;
  top: 0;
  z-index: 20;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  background: ${({ theme }) => theme.colors.surface};
`;

const HeaderInner = styled.div`
  display: flex;
  min-height: ${({ theme }) => theme.layout.headerHeight};
  max-width: ${({ theme }) => theme.layout.maxWidth};
  align-items: center;
  justify-content: space-between;
  gap: ${({ theme }) => theme.space.md};
  padding: 0 ${({ theme }) => theme.space.md};
  margin: 0 auto;

  @media (max-width: 640px) {
    padding: ${({ theme }) => theme.space.sm};
  }
`;

const Brand = styled(NavLink)`
  display: inline-flex;
  align-items: center;
  gap: ${({ theme }) => theme.space.sm};
  min-height: 44px;
  font-family: "Ubuntu", sans-serif;
  font-size: 1.18rem;
  font-weight: 400;
  letter-spacing: 0;
  color: ${({ theme }) => theme.colors.text};
`;

const BrandLogo = styled.img`
  display: inline-grid;
  width: 38px;
  height: 38px;
  border-radius: ${({ theme }) => theme.radii.md};
`;

const NavActions = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.space.sm};
`;

const Nav = styled.nav`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.space.xs};
`;

const NavItem = styled(NavLink)`
  display: inline-flex;
  min-height: 44px;
  align-items: center;
  padding: 0 ${({ theme }) => theme.space.md};
  border-radius: ${({ theme }) => theme.radii.pill};
  color: ${({ theme }) => theme.colors.textMuted};
  font-size: 0.94rem;
  font-weight: 650;
  transition:
    color 160ms ease,
    background 160ms ease;

  &:hover,
  &.active {
    color: ${({ theme }) => theme.colors.text};
    background: ${({ theme }) => theme.colors.surfaceStrong};
  }

  @media (max-width: 480px) {
    padding: 0 ${({ theme }) => theme.space.sm};
  }
`;

const SelectionBadge = styled.span`
  display: inline-flex;
  min-height: 36px;
  align-items: center;
  justify-content: center;
  padding: 0 ${({ theme }) => theme.space.md};
  border-radius: ${({ theme }) => theme.radii.pill};
  color: ${({ theme }) => theme.colors.primaryText};
  background: ${({ theme }) => theme.colors.primary};
  font-size: 0.88rem;
  font-weight: 750;

  @media (max-width: 720px) {
    display: none;
  }
`;

export function Navbar() {
  const { selectedCount } = useSelection();
  const { mode } = useThemeMode();
  const logoSrc =
    mode === "dark"
      ? "/assets/pet-house-logo-dark.svg"
      : "/assets/pet-house-logo-light.svg";

  return (
    <Header>
      <HeaderInner>
        <Brand to="/" aria-label="Pet House home">
          <BrandLogo src={logoSrc} alt="" aria-hidden="true" />
          <span>Pet House</span>
        </Brand>

        <NavActions>
          <Nav aria-label="Primary navigation">
            <NavItem to="/" end>
              Gallery
            </NavItem>
            <NavItem to="/about">About</NavItem>
          </Nav>
          {selectedCount > 0 ? (
            <SelectionBadge>{selectedCount} selected</SelectionBadge>
          ) : null}
          <ThemeToggle />
        </NavActions>
      </HeaderInner>
    </Header>
  );
}
