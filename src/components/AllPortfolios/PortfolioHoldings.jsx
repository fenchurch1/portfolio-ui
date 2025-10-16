import React, { useEffect, useMemo, useState } from "react";
import { observer } from "mobx-react-lite";
import { apiClient } from "@API/apiservises";
import APIEndpoints from "@API/profile/APIEndpoints";
import PortfolioGrid from "@utils/Table/PortfolioGrid";
import { useLocation } from "react-router-dom";
import { Select, Button } from "@mantine/core";
import SharePortfolioModal from "./SharePortfolioModal";
import { generateColumnDefs } from "@utils/helperFunctions";

const PortfolioHoldings = observer(() => {
  const [portFolioDetails, setPortfolioDetails] = useState({});
  const [coloumdefsFortable, setColoumDefsForTable] = useState([]);
  const [selectedPortfolio, setSelectedPortfolio] = useState(null);
  const [AllPortfolios, setAllportfolios] = useState({});
  const [shareOpened, setShareOpened] = useState(false)

  const location = useLocation();
  const { portfolioId } = location.state || {};
  const UserId = localStorage.getItem("UserId");

  // fetch holdings for a given portfolio
  const fetchHoldings = async (portfolioId) => {
    try {
      const response = await apiClient.get(
        APIEndpoints.getHoldingDetails
          .replace("{userId}", UserId)
          .replace("{portfolioId}", portfolioId)
      );
      const data = response.portfolio_details || [];
      setPortfolioDetails(response);

      // Build dynamic columns
      // if (data.length > 0) {
      //   const allKeys = new Set();
      //   data.forEach((obj) => {
      //     Object.keys(obj).forEach((key) => allKeys.add(key));
      //   });

      //   const columnDefs = Array.from(allKeys).map((key) => ({
      //     headerName: key
      //       .replace(/_/g, " ")
      //       .replace(/\b\w/g, (c) => c.toUpperCase()),
      //     field: key,
      //     flex: 1,
      //     width: 150,
      //   }));

      //   setColoumDefsForTable(columnDefs);
      // }
    } catch (error) {
      console.error("Error fetching portfolios:", error);
    }
  };

  // fetch all portfolios (owned + shared)
  useEffect(() => {
    const fetchAll = async () => {
      try {
        const response = await apiClient.get(
          APIEndpoints.fetchPortfolios.replace("{userId}", UserId)
        );
        const data = response.portfolioData || {};
        setAllportfolios(data);

        // if navigated with portfolioId, select it by default
        if (portfolioId) {
          const all = [
            ...(data.owned_portfolios || []),
            ...(data.shared_portfolios || []),
          ];
          const defaultPortfolio = all.find(
            (p) => String(p.portfolio_id) === String(portfolioId)
          );
          setSelectedPortfolio(defaultPortfolio || null);
          fetchHoldings(portfolioId);
        }
      } catch (error) {
        console.error("Error fetching portfolios:", error);
      }
    };
    fetchAll();
  }, [portfolioId, UserId]);
  const columnDefs = useMemo(() => generateColumnDefs(portFolioDetails?.col_defs), [portFolioDetails?.col_defs]);


  const sharedPortfolio = async (selected) => {
    console.log("Selected", selected);
    const body =
    {
      "owner_user_id": UserId,
      "portfolio_id": selectedPortfolio?.portfolio_id,
      "shared_with_user_id": selected
    }

    try {
      const response = await apiClient.post(
        APIEndpoints.sharePortfolio,
        '', body
      );
      const data = response || {};
      
    } catch (error) {
      console.error("Error fetching portfolios:", error);
    }

  }
  // dropdown change → fetch holdings
  const handleSelect = (value) => {
    if (!value) {
      setSelectedPortfolio(null);
      return;
    }

    const all = [
      ...(AllPortfolios.owned_portfolios || []),
      ...(AllPortfolios.shared_portfolios || []),
    ];

    const selected = all.find((p) => String(p.portfolio_id) === String(value));
    setSelectedPortfolio(selected || null);

    fetchHoldings(value);
  };

  const isSharedPortfolio = AllPortfolios.shared_portfolios?.some(
    (item) =>
      String(item.portfolio_id) === String(selectedPortfolio?.portfolio_id)
  );

  return (
    <div style={{ padding: "20px" }}>
      {/* Dropdown + Share Button */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          marginBottom: "20px",
          gap: "10px",
        }}
      >
        <Select
          placeholder="Select Portfolio"
          data={[
            {
              group: "Owned Portfolios",
              items: (AllPortfolios.owned_portfolios || [])
                .filter((p) => String(p.user_id) === UserId)
                .map((p) => ({
                  value: String(p.portfolio_id),
                  label: p.portfolio_name || `Portfolio ${p.portfolio_id}`,
                })),
            },
            {
              group: "Shared Portfolios",
              items: (AllPortfolios.shared_portfolios || [])
                .filter((p) => String(p.user_id) !== UserId)
                .map((p) => ({
                  value: String(p.portfolio_id),
                  label: p.portfolio_name || `Portfolio ${p.portfolio_id}`,
                })),
            },
          ]}
          value={
            selectedPortfolio
              ? String(selectedPortfolio.portfolio_id)
              : portfolioId
                ? String(portfolioId)
                : null
          }
          onChange={handleSelect}
          style={{ minWidth: "250px" }}
        />

        <Button
          variant="outline"
          onClick={() =>
            setShareOpened(true)
          }
          disabled={!selectedPortfolio || isSharedPortfolio}
        >
          Share
        </Button>
      </div>

      {/* Table */}
      <PortfolioGrid
        rowData={portFolioDetails?.portfolio_details || []}
        columnDefs={columnDefs}
      />
      <SharePortfolioModal
        opened={shareOpened}
        onClose={() => setShareOpened(false)}
        portfolioName={selectedPortfolio?.portfolio_name}
        onSave={sharedPortfolio}
      />
    </div>
  );
});

export default PortfolioHoldings;
