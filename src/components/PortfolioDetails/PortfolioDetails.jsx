import React, { useEffect, useMemo, useState } from "react";
import { Tabs, useComputedColorScheme, Card, Text, Group, Stack, Button, Badge } from "@mantine/core";
import { apiClient } from "../../API/apiservises";
import APIEndpoints from "../../API/profile/APIEndpoints";
import { useParams } from "react-router-dom";
import PortfolioGrid from "@utils/Table/PortfolioGrid";
import PortfolioGraph from "../PortfolioDetails/PortfolioGraph";
import BadgesList from "@utils/Badge/BadgesList";
import SharePortfolioModal from "@components/AllPortfolios/SharePortfolioModal";
const PortfolioDetails = () => {
    const computedColorScheme = useComputedColorScheme();
    const UserId = localStorage.getItem("UserId");
    const themeClass =
        computedColorScheme === "dark" ? "ag-theme-alpine-dark" : "ag-theme-alpine";

    const { portfolioId } = useParams();
    const [columDefsForPools, setColumnDefsForPools] = useState([]);
    const [selectedPortfolioData, setSelectedPortfolioData] = useState([]);
    const [CardsData, setCardsData] = useState([]);
    const [shareOpened, setShareOpened] = useState(false)
    const [selectedPortfolio, setSelectedPortfolio] = useState(null);
    const [portfolioMeta, setPortfolioMeta] = useState({
        name: "",
        sharedBy: "",
        team: "",
    });

    const defaultColDef = useMemo(
        () => ({
            sortable: true,
            filter: true,
            resizable: true,
            flex: 1,
            minWidth: 100,
        }),
        []
    );

    useEffect(() => {
        if (!portfolioId) return;

        const fetchPortfolioDetails = async () => {
            try {
                const response = await apiClient.get(
                    APIEndpoints.getPortfolioById
                        .replace("{userId}", UserId)
                        .replace("{portfolioId}", portfolioId)
                );

                const data = response?.portfolio_data || [];
                setSelectedPortfolioData(data);

                // ✅ Extract portfolio meta info
                setPortfolioMeta({
                    name: response?.portfolio_name || "Unnamed Portfolio",
                    sharedBy: response?.shared_by || "N/A",
                    team: response?.team_name || "N/A",
                    IsOwner:response?.is_owner || false,
                });

                const allKeys = new Set();
                const FinalObj = {
                    PoolCount: 0,
                    unknownpools: 0,
                    validpools: 0,
                };

                data.forEach((obj) => {
                    Object.keys(obj).forEach((key) => allKeys.add(key));
                    FinalObj.PoolCount += obj.pool_count || 0;
                    FinalObj.unknownpools += obj.unknown_pools || 0;
                    FinalObj.validpools += obj.valid_pools || 0;
                });

                const InvalidPools =
                    response.pool_count - response.unknown_pools - response.valid_pools;

                const cards = [
                    {
                        label: "Pool Count",
                        value: response.pool_count,
                        BackgroundColor: "#e0e0e0",
                    },
                    {
                        label: "Unknown Pools",
                        value: response.unknown_pools,
                        BackgroundColor: "#FFF3CD",
                        TextColor: "#7A4D00",
                    },
                    {
                        label: "Valid Pools",
                        value: response.valid_pools,
                        BackgroundColor: "#D4EDDA",
                        TextColor: "#155724",
                    },
                    {
                        label: "Invalid Pools",
                        value: InvalidPools,
                        BackgroundColor: "#F8D7DA",
                        TextColor: "#721C24",
                    },
                ];
                setCardsData(cards);

                const columnDefs = Array.from(allKeys).map((key) => ({
                    headerName: key,
                    field: key,
                    flex: 1,
                }));
                setColumnDefsForPools(columnDefs);
            } catch (error) {
                console.error("Error fetching portfolios:", error);
            }
        };

        fetchPortfolioDetails();
    }, [portfolioId]);

    const sharedPortfolio = async (selected) => {debugger
        console.log("Selected", selected);
        const body =
        {
            "owner_user_id": UserId,
            "portfolio_id": portfolioId,
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
    return (
        <div className="space-y-4">
            {/* 📌 Top Meta Information */}
            <Card shadow="sm" radius="lg" withBorder p="lg">
                <Stack spacing="xs">
                    <Group spacing="lg" justify="space-between" align="center" w="100%">
                        <Text size="xl" fw={700}>
                            Portfolio Name: {portfolioMeta.name}
                        </Text>
                        <Button
                            variant="outline"
                            onClick={() =>
                                setShareOpened(true)
                            }
                         disabled={!portfolioMeta.IsOwner}
                        >
                            Share
                        </Button>
                    </Group>

                    <Group justify="space-between" align="center" w="100%">
                        {/* Left Side: Two Badges */}
                        <Group spacing="sm">
                            <Badge color="blue" variant="light">
                                Shared By: {portfolioMeta.sharedBy}
                            </Badge>
                            <Badge color="teal" variant="light">
                                Team: {portfolioMeta.team}
                            </Badge>
                        </Group>

                        {/* Right Side: BadgesList */}
                        <BadgesList data={CardsData} />
                    </Group>

                </Stack>
            </Card>

            <br />
            {/* 📌 Tabs */}
            <Tabs defaultValue="portfolioDetails">
                <Tabs.List>
                    <Tabs.Tab value="portfolioDetails">Portfolio Details</Tabs.Tab>
                    <Tabs.Tab value="portfolioGraph">Portfolio Graph</Tabs.Tab>
                </Tabs.List>

                <Tabs.Panel value="portfolioDetails">
                    <br />
                    <div className={themeClass} style={{ height: 400, width: "100%" }}>
                        <PortfolioGrid
                            rowData={selectedPortfolioData}
                            columnDefs={columDefsForPools}
                            defaultColDef={defaultColDef}
                        />
                    </div>
                </Tabs.Panel>

                <Tabs.Panel value="portfolioGraph">
                    <br />
                    <div className={themeClass} style={{ height: 400, width: "100%" }}>
                        <PortfolioGraph selectedPortfolioData={selectedPortfolioData} />
                    </div>
                </Tabs.Panel>
            </Tabs>
            <SharePortfolioModal
                opened={shareOpened}
                onClose={() => setShareOpened(false)}
                portfolioName={selectedPortfolio?.portfolio_name}
                onSave={sharedPortfolio}
            />
        </div>
    );
};

export default PortfolioDetails;
