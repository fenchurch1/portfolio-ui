import React, { useState, useRef, useEffect, useMemo } from 'react';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import './AgGridCustomStyles.css';
import { Box, useComputedColorScheme } from '@mantine/core';

const PortfolioGrid = ({ rowData, columnDefs }) => {
  console.log("PortfolioGrid columnDefs", columnDefs);
  
  const gridRef = useRef();
  const [pageSize, setPageSize] = useState(10);
  const computedColorScheme = useComputedColorScheme();
  const [selectedFile, setSelectedFile] = useState([]);

  console.log("rowData", rowData);
  const onGridReady = (params) => {
    gridRef.current = params.api;
    params.api.setPaginationPageSize(20); // Set your desired page size
  };

  const handleFileClick = (fileData) => {
    const matched = rowData.find(item => item.fileName === fileData.fileName);
    setSelectedFile(matched?.data || []);
  };

  const defaultColDef = useMemo(() => ({
    sortable: true,
    filter: true,
    resizable: true,
    flex: 1,
    minWidth: 100,
  }), []);

  const columnDefsForModal = [
    { headerName: 'Row', valueGetter: 'node.rowIndex + 1', flex: 1 },
    { headerName: 'Pool ID', field: 'pool_id', flex: 1 },
    { headerName: 'Amount', field: 'face_amt', flex: 1 },
  ];

  const paginationIcons = {
    first: '<span style="font-weight:bold;">⏮</span>',
    last: '<span style="font-weight:bold;">⏭</span>',
    previous: '<span style="font-weight:bold;">◀</span>',
    next: '<span style="font-weight:bold;">▶</span>',
  };

  const defaultColumnDefs = [
    {
      headerName: 'File Name',
      field: 'fileName',
      flex: 1,
      cellRenderer: (params) => (
        <span
          className="text-blue-600 underline cursor-pointer"
          style={{ cursor: 'pointer' }}
          onClick={() => handleFileClick(params.data)}
        >
          {params.value}
        </span>
      ),
    },
    { headerName: 'Portfolio Name', field: 'portfolioName', flex: 1 },
    { headerName: 'Date/Time Uploaded', field: 'uploadedAt', flex: 1 },
  ];

  const themeClass = computedColorScheme === 'dark' ? 'ag-theme-alpine-dark' : 'ag-theme-alpine';
  const statusBar = {
    statusPanels: [
      {
        statusPanel: 'agTotalRowCountComponent',
        align: 'right',
      }
    ]
  };
  return (
    <>
      <Box className={themeClass} style={{ width: '100%' }}>
        <AgGridReact
          ref={gridRef}
          onGridReady={onGridReady}
          rowData={rowData}
          columnDefs={columnDefs || defaultColumnDefs}
          defaultColDef={defaultColDef}
          pagination={true}
          paginationPageSize={pageSize}
          domLayout="autoHeight"
          icons={paginationIcons}
          theme="legacy"
          statusBar={statusBar}
          headerHeight={40}
          rowSelection="multiple"
          rowHeight={40}
          suppressScrollOnNewData={true}
          suppressHorizontalScroll={false}

          // Performance optimizations
          suppressColumnVirtualisation={false} // Enable column virtualization
          suppressRowVirtualisation={false}    // Enable row virtualization
          animateRows={false}                  // Disable row animations for better performance
        />
      </Box>
    </>
  );
};

export default PortfolioGrid;
/**
 * Generate AG Grid column definitions from backend col_defs
 * Supports dynamic D3-based formatters from backend
 */


