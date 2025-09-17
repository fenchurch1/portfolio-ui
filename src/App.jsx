import React, { Suspense, useState } from "react";
import { AppShell } from "@mantine/core";
import HeaderBar from "@components/Header/HeaderBar";
import NavBar from "@components/Sidebar/NavBar";
import { AllCommunityModule, ModuleRegistry } from 'ag-grid-community';
import { Navigate, Route, Routes } from 'react-router-dom';
// Register all Community features
ModuleRegistry.registerModules([AllCommunityModule]);
function App() {
  const [view, setView] = useState("upload");
  const UploadView = React.lazy(() => import('@components/UploadComponent/UploadView'));
  const PortfolioDetails = React.lazy(() => import('@components/PortfolioDetails/PortfolioDetails'));
  const AllPortfolioDetails = React.lazy(() => import('@components/AllPortfolios/AllPortfolioDetails'));
  const PortfolioHoldings = React.lazy(() => import('@components/AllPortfolios/PortfolioHoldings'));
  return (
    <AppShell
      padding="md"
      header={{ height: 47 }}
      navbar={{ width: 250, breakpoint: 'sm' }}
    >
      <AppShell.Header>
        <HeaderBar />
      </AppShell.Header>

      <AppShell.Navbar>
        <NavBar onSelect={setView} activeTab={view} />
      </AppShell.Navbar>

      <AppShell.Main>
        <Suspense fallback={<div>Loading...</div>}>
          <Routes>
            <Route path="/" element={<UploadView />} />
            <Route path="/upload" element={<UploadView />} />
            <Route path="/portfolio/:portfolioId" element={<PortfolioDetails portfolioName={view} />} />
            <Route path="/AllPortfolios" element={<AllPortfolioDetails />} />
            <Route path="/Portfolios_Holdings" element={<PortfolioHoldings />} />
            <Route path="*" element={<div>404 Not Found</div>} />
          </Routes>
        </Suspense>

        {/* {view === "upload" ?<UploadView /> : view==='list'? <ListView />:<PortfolioDetails portfolioName={view} />} */}
      </AppShell.Main>
    </AppShell>
  );
}

export default App;
