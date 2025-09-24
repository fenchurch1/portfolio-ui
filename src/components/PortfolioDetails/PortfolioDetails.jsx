import React, { useEffect, useMemo, useState } from "react";
import { Tabs, useComputedColorScheme, Card, Text, Group, Stack, Button, Badge } from "@mantine/core";
import { apiClient } from "../../API/apiservises";
import APIEndpoints from "../../API/profile/APIEndpoints";
import { useParams } from "react-router-dom";
import PortfolioGrid from "@utils/Table/PortfolioGrid";
import PortfolioGraph from "@components/PortfolioDetails/PortfolioGraph";
import BadgesList from "@utils/Badge/BadgesList";
import SharePortfolioModal from "@components/AllPortfolios/SharePortfolioModal";

const PortfolioDetails = () => {
  const computedColorScheme = useComputedColorScheme();
  const UserId = localStorage.getItem("UserId");
  const themeClass = computedColorScheme === "dark" ? "ag-theme-alpine-dark" : "ag-theme-alpine";
  const { portfolioId } = useParams();

  // Combine related state into one object to reduce multiple renders
  const [portfolioData, setPortfolioData] = useState({
    columnDefs: [],
    rowData: [],
    cards: [],
    meta: { name: "", sharedBy: "", team: "", IsOwner: false }
  });

  const [shareOpened, setShareOpened] = useState(false);

  const defaultColDef = useMemo(() => ({
    sortable: true,
    filter: true,
    resizable: true,
    flex: 1,
    minWidth: 100,
  }), []);

  useEffect(() => {
    if (!portfolioId) return;
    let isMounted = true; // prevent updates after unmount

    const fetchPortfolioDetails = async () => {
      try {
        const response = await apiClient.get(
          APIEndpoints.getPortfolioById
            .replace("{userId}", UserId)
            .replace("{portfolioId}", portfolioId)
        );

        if (!isMounted) return;

        const data = response?.portfolio_data || [];

        const InvalidPools = response.pool_count - response.valid_pools;

        const cards = [
          { label: "Pool Count", value: response.pool_count, BackgroundColor: "#e0e0e0" },
          { label: "Unknown Pools", value: response.unknown_pools, BackgroundColor: "#FFF3CD", TextColor: "#7A4D00" },
          { label: "Valid Pools", value: response.valid_pools, BackgroundColor: "#D4EDDA", TextColor: "#155724" },
          { label: "Invalid Pools", value: InvalidPools, BackgroundColor: "#F8D7DA", TextColor: "#721C24" },
        ];

        const columnDefs = Array.from(response?.table_headers || []).map(key => ({
          headerName: key,
          field: key,
          flex: 1,
        }));

        setPortfolioData({
          columnDefs,
          rowData: data,
          cards,
          meta: {
            name: response?.portfolio_name || "Unnamed Portfolio",
            sharedBy: response?.shared_by || "N/A",
            team: response?.team_name || "N/A",
            IsOwner: response?.is_owner || false
          }
        });
      } catch (error) {
        console.error("Error fetching portfolios:", error);
      }
    };

    fetchPortfolioDetails();

    return () => {
      isMounted = false;
      // clear large data to free memory
      setPortfolioData({
        columnDefs: [],
        rowData: [],
        cards: [],
        meta: { name: "", sharedBy: "", team: "", IsOwner: false }
      });
    };
  }, [portfolioId]);

  const sharedPortfolio = async (selected) => {
    try {
      const body = {
        owner_user_id: UserId,
        portfolio_id: portfolioId,
        shared_with_user_id: selected
      };
      await apiClient.post(APIEndpoints.sharePortfolio, '', body);
    } catch (error) {
      console.error("Error sharing portfolio:", error);
    }
  };

  return (
    <div className="space-y-4">
      <Card shadow="sm" radius="lg" withBorder p="lg">
        <Stack spacing="xs">
          <Group spacing="lg" justify="space-between" align="center" w="100%">
            <Text size="xl" fw={700}>Portfolio Name: {portfolioData.meta.name}</Text>
            <Button variant="outline" onClick={() => setShareOpened(true)} disabled={!portfolioData.meta.IsOwner}>Share</Button>
          </Group>

          <Group justify="space-between" align="center" w="100%">
            <Group spacing="sm">
              <Badge color="blue" variant="light">Shared By: {portfolioData.meta.sharedBy}</Badge>
              <Badge color="teal" variant="light">Team: {portfolioData.meta.team}</Badge>
            </Group>
            <BadgesList data={portfolioData.cards} />
          </Group>
        </Stack>
      </Card>

      <Tabs defaultValue="portfolioDetails">
        <Tabs.List>
          <Tabs.Tab value="portfolioDetails">Portfolio Details</Tabs.Tab>
          <Tabs.Tab value="portfolioGraph">Portfolio Graph</Tabs.Tab>
        </Tabs.List>

        <Tabs.Panel value="portfolioDetails">
            <br />
          <div className={themeClass} style={{ height: 600, width: "100%" }}>
            <PortfolioGrid
              rowData={portfolioData.rowData}
              columnDefs={portfolioData.columnDefs}
              defaultColDef={defaultColDef}
            />
          </div>
        </Tabs.Panel>

        <Tabs.Panel value="portfolioGraph">
            <br />
          <div className={themeClass} style={{ height: 400, width: "100%" }}>
            <PortfolioGraph selectedPortfolioData={portfolioData.rowData} />
          </div>
        </Tabs.Panel>
      </Tabs>

      <SharePortfolioModal
        opened={shareOpened}
        onClose={() => setShareOpened(false)}
        portfolioName={portfolioData.meta.name}
        onSave={sharedPortfolio}
      />
    </div>
  );
};

export default PortfolioDetails;
