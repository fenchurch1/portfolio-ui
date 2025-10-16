import React, { useEffect, useState } from 'react';
import { observer } from 'mobx-react-lite';
import { apiClient } from '@API/apiservises';
import APIEndpoints from '@API/profile/APIEndpoints';
import PortfolioGrid from '@utils/Table/PortfolioGrid';
import { Tabs, Button } from '@mantine/core';
import { useNavigate } from 'react-router-dom';
import { generateColumnDefs } from '@utils/helperFunctions';

const AllPortfolioDetails = observer(() => {
  const [portFolioDetails, setPortfolioDetails] = useState({
    All: [],
    Shared: [],
    Mine: [],
    SharedByMe: []
  });
  const [coloumdefsFortable, setcoloumdefsFortable] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    let isMounted = true;

    (async () => {
      const UserId = localStorage.getItem('UserId');
      try {
        setLoading(true);
        const response = await apiClient.get(
          APIEndpoints.fetchPortfolios.replace('{userId}', UserId)
        );
        if (!isMounted) return; // ✅ Prevent state update if unmounted

        const data = response.portfolio_data;
        const HeaderData=response?.col_defs || {};

        // Prepare portfolio lists
        setPortfolioDetails({
          All: [...data?.shared_with_me_portfolios, ...data?.owned_portfolios],
          Shared: data?.shared_with_me_portfolios,
          Mine: data?.owned_portfolios,
          SharedByMe: data?.shared_by_me_portfolios,
        });

        // ✅ Function to generate column definitions dynamically
        const generateColumnDefsForAll = (dataset) => {
          const keys = new Set();

          dataset.forEach((obj) => {
            Object.keys(obj).forEach((key) => keys.add(key));
          });

          let colDefs = Array.from(keys)
            .map((key) => {
              if (key !== "portfolio_id" && key !== "user_id") {
                return {
                  headerName: key,
                  field: key,
                  flex: 1,
                  width: 400,
                  valueGetter: (params) => {
                    const value = params.data?.[key];
                    return value !== undefined && value !== null && value !== ""
                      ? value
                      : "N/A";
                  },
                };
              }
              return null;
            })
            .filter(Boolean);

          // ✅ Add Action column
          colDefs.push({
            headerName: "Action",
            field: "portfolio_id",
            cellRenderer: (params) => (
              <Button
                size="xs"
                onClick={() =>
                  navigate(`/portfolio/${params.data.portfolio_id}`, {
                    state: { portfolioId: params.data.portfolio_id },
                  })
                }
                style={{
                  backgroundColor: "transparent", // default transparent
                  transition: "background-color 0.2s",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#00BFFF")}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
              >
                Holdings
              </Button>
            ),
            width: 120,
            cellStyle: { display: "flex", justifyContent: "center" },
            headerClass: "ag-center-header",
          });


          return colDefs;
        };

        // ✅ Generate colDefs for all 4 datasets separately
        const colDefsForAll = generateColumnDefsForAll([
          ...data.owned_portfolios,
          ...data.shared_with_me_portfolios,
        ]);

        const colDefsForShared = generateColumnDefs(HeaderData.shared_with_me_portfolios);
        const colDefsForMine = generateColumnDefs(HeaderData.owned_portfolios);
        const colDefsForSharedByMe = generateColumnDefs(HeaderData.shared_by_me_portfolios);

        // ✅ Store all colDefs in state (optional)
        setcoloumdefsFortable({
          All: colDefsForAll,
          Shared: colDefsForShared,
          Mine: colDefsForMine,
          SharedByMe: colDefsForSharedByMe,
        });

      } catch (error) {
        console.error('Error fetching portfolios:', error);
      } finally {
        if (isMounted) setLoading(false);
      }
    })();

    return () => {
      isMounted = false;
    };
  }, [navigate]);

  if (loading) return <div>Loading portfolios...</div>;

  return (
    <div>
      <Tabs defaultValue="All">
        <Tabs.List>
          <Tabs.Tab value="All">All</Tabs.Tab>
          <Tabs.Tab value="Mine">Mine</Tabs.Tab>
          <Tabs.Tab value="Shared">Shared With Me</Tabs.Tab>
          <Tabs.Tab value="SharedByMe">Shared By Me</Tabs.Tab>
        </Tabs.List>

        <Tabs.Panel value="All">
          <br />
          <PortfolioGrid
            rowData={portFolioDetails.All}
            columnDefs={coloumdefsFortable.All}
          />
        </Tabs.Panel>

        <Tabs.Panel value="Mine">
          <br />
          <PortfolioGrid
            rowData={portFolioDetails.Mine}
            columnDefs={coloumdefsFortable.Mine}
          />
        </Tabs.Panel>

        <Tabs.Panel value="Shared">
          <br />
          <PortfolioGrid
            rowData={portFolioDetails.Shared}
            columnDefs={coloumdefsFortable.Shared}
          />
        </Tabs.Panel>

        <Tabs.Panel value="SharedByMe">
          <br />
          <PortfolioGrid
            rowData={portFolioDetails.SharedByMe}
            columnDefs={coloumdefsFortable.SharedByMe}
          />
        </Tabs.Panel>
      </Tabs>
    </div>
  );
});

export default AllPortfolioDetails;
