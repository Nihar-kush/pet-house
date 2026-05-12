import { BrowserRouter, Route, Routes } from "react-router-dom";
import styled from "styled-components";
import { Navbar } from "./components/Navbar";
import { SelectionProvider } from "./context/SelectionProvider";
import { AppThemeProvider } from "./context/ThemeContext";
import { About } from "./pages/About";
import { Home } from "./pages/Home";
import { PetDetails } from "./pages/PetDetails";
import { GlobalStyles } from "./styles/GlobalStyles";

const AppFrame = styled.div`
  min-height: 100dvh;
`;

const Main = styled.main`
  width: min(100% - 20px, ${({ theme }) => theme.layout.maxWidth});
  padding: ${({ theme }) => theme.space.lg} 0 ${({ theme }) => theme.space.xxl};
  margin: 0 auto;

  @media (max-width: 640px) {
    width: min(100% - 14px, ${({ theme }) => theme.layout.maxWidth});
    padding-top: ${({ theme }) => theme.space.lg};
  }
`;

const NotFoundPanel = styled.section`
  display: grid;
  place-content: center;
  justify-items: center;
  gap: ${({ theme }) => theme.space.md};
  max-width: 680px;
  min-height: calc(
    100dvh - ${({ theme }) => theme.layout.headerHeight} - 160px
  );
  padding: ${({ theme }) => theme.space.xl} 0;
  margin: 0 auto;
  text-align: center;

  h1,
  p {
    margin: 0;
  }

  p {
    color: ${({ theme }) => theme.colors.textMuted};
    line-height: 1.7;
  }
`;

function NotFound() {
  return (
    <NotFoundPanel>
      <h1>Page not found</h1>
      <p>
        That route does not exist yet. Head back to the gallery to continue.
      </p>
    </NotFoundPanel>
  );
}

function App() {
  return (
    <AppThemeProvider>
      <GlobalStyles />
      <BrowserRouter>
        <SelectionProvider>
          <AppFrame>
            <Navbar />
            <Main>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/pets/:id" element={<PetDetails />} />
                <Route path="/about" element={<About />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Main>
          </AppFrame>
        </SelectionProvider>
      </BrowserRouter>
    </AppThemeProvider>
  );
}

export default App;
