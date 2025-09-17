import React, { useEffect, useRef, useState } from 'react'
import Plot from 'react-plotly.js'
import { Flex, Select } from '@mantine/core';
import { apiClient } from '../../API/apiservises';
import APIEndpoints from '../../API/profile/APIEndpoints';

const PortfolioGraph = ({ selectedPortfolioData }) => {
  const plotRef = useRef(null);
  const [graphData, setGraphData] = useState([]);
  console.log("graphData",graphData);
  
  const [poolIdData, setPoolIdData] = useState([]);
  const [poolValue, setPoolValue] = useState(null);

  // second dropdown state
  const [fieldOptions, setFieldOptions] = useState([]);
  const [selectedField, setSelectedField] = useState(null);

  // Build unique dropdown options when selectedPortfolioData changes
  useEffect(() => {
    if (!selectedPortfolioData || selectedPortfolioData.length === 0) return;

    const dropdownData = Array.from(
      new Map(
        selectedPortfolioData.filter(item => item.cusip != null).map((id) => [
          id.cusip,
          { label: id.cusip, value: id.cusip },
        ])
      ).values()
    );

    setPoolIdData(dropdownData);

    if (!poolValue && dropdownData.length > 0) {
      setPoolValue(dropdownData[0].value);
    }
  }, [selectedPortfolioData]);

  // Fetch graph data when poolValue changes
  useEffect(() => {
    if (!poolValue) return;
    getGraphDataForId(poolValue);
  }, [poolValue]);

  const getGraphDataForId = async (id) => {
        const UserId = localStorage.getItem("UserId");
    try {
      const response = await apiClient.get(
        APIEndpoints.getGraphbyPoolId
          .replace('{userId}', UserId)
          .replace('{id}', id)
      );
      const apiData = response.data;

      if (apiData) {
        setGraphData(apiData);

        // dynamically build field options from keys (excluding x-axis)
        const sample = apiData[0];
        const keys = Object.keys(sample).filter(
          (k) => k !== 'factor_month' && k !== 'cusip' && k !== 'pool_number'
        );

        const dropdownFields = keys.map((k) => ({ label: k, value: k }));
        console.log("dropdownFields",dropdownFields);
        
        setFieldOptions(dropdownFields);

        // auto-select first field if none chosen
        if (!selectedField && dropdownFields.length > 0) {
          setSelectedField(dropdownFields[0].value);
        }
      }
    } catch (error) {
      console.error('Error fetching graph:', error);
    }
  };

  return (
    <>
      <Flex gap="20px">
        <Select
          label="Select Cusip/Pool"
          placeholder="Pick value"
          searchable
          data={poolIdData}
          value={poolValue}
          onChange={setPoolValue}
        />
        <Select
          label="Select Y-axis Field"
          placeholder="Pick field"
          searchable
          data={fieldOptions}
          value={selectedField}
          onChange={setSelectedField}
          disabled={fieldOptions.length === 0}
        />
      </Flex>

      <br />

      <div style={{ height: 400, width: '100%' }}>
        <Plot
          ref={plotRef}
          data={
            graphData?.length > 0 && selectedField
              ? [
                  {
                    x: graphData.map((d) =>
                      new Date(d.factor_month).toLocaleDateString()
                    ),
                    y: graphData.map((d) => Number(d[selectedField])),
                    type: 'scatter',
                    mode: 'lines+markers',
                    name: selectedField,
                    line: { color: '#00BFFF' },
                  },
                ]
              : [
                  // {
                  //   x: ['Sep 2024', 'Nov 2024', 'Jan 2025'],
                  //   y: [6.9, 7.0, 8.5],
                  //   type: 'scatter',
                  //   mode: 'lines+markers',
                  //   name: 'Sample',
                  //   line: { color: '#00BFFF' },
                  // },
                ]
          }
          layout={{
            title: 'Dynamic Pool Graph',
            xaxis: { title: 'Factor Month' },
            yaxis: { title: selectedField || 'Y-Axis', showgrid: true },
            legend: { orientation: 'h', x: 0, y: -0.3 },
            margin: { t: 40, b: 40 },
            plot_bgcolor: '#1A1B1E',
            paper_bgcolor: '#1A1B1E',
            font: { color: '#FFFFFF' },
          }}
          config={{ responsive: true }}
          useResizeHandler
          style={{ width: '100%', height: '100%' }}
        />
      </div>
    </>
  );
};

export default PortfolioGraph;
