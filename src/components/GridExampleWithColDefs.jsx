import React, { useMemo } from "react";
import { observer } from "mobx-react";
import store from "../store";

import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-balham.css"; // Optional theme CSS
import "ag-grid-enterprise";

import { ModuleRegistry, ClientSideRowModelModule } from "ag-grid-community";
import { GridChartsModule } from "ag-grid-enterprise";

ModuleRegistry.registerModules([
    ClientSideRowModelModule,
    GridChartsModule
]);

import * as d3 from "d3";

// Cache for value formatters to avoid recreation
const formatterCache = new Map();

const createValueFormatter = (formatterString) => {
    if (formatterCache.has(formatterString)) {
        return formatterCache.get(formatterString);
    }
    
    const originalFormatter = new Function("d3", `return (${formatterString});`)(d3);
    const formatter = (params) => {
        if (params.value == null) return ""; // or "-"
        return originalFormatter(params);
    };
    
    formatterCache.set(formatterString, formatter);
    return formatter;
};

const Grid = observer(() => {
    // Memoize column definitions to prevent recreation on every render
    const columnDefs = useMemo(() => {
        if (!store.columnDefs || store.columnDefs.length === 0) {
            return [];
        }
        
        return store.columnDefs.map(colDef => {
            const newColDef = { ...colDef };
            
            if (typeof colDef.valueFormatter === "string") {
                newColDef.valueFormatter = createValueFormatter(colDef.valueFormatter);
            }
            
            return newColDef;
        });
    }, [store.columnDefs]); // Only recalculate when store.columnDefs changes

    if (!store.rowData || store.rowData.length === 0) {
        return null;
    }

    const statusBar = {
        statusPanels: [
            {
                statusPanel: 'agTotalRowCountComponent',
                align: 'right',
            }
        ]
    };
    
    return (
        <div
            className="ag-theme-balham-dark borders"
            style={{ width: "100%", height: "100%", borderBottom: '1px solid #333'}}
        >
            <AgGridReact
                enableCharts={true}
                enableRangeSelection={true}
                allowContextMenuWithControlKey={true}
                popupParent={document.body}
                columnDefs={columnDefs}
                rowData={store.rowData}
                suppressPaginationPanel={false}
                pagination={true}
                paginationPageSize={100} // Increased from 50 for better performance
                statusBar={statusBar}
                domLayout="normal"
                style={{
                    width: '100%',
                    height: '100%',
                }}

                headerHeight={26}
                rowSelection="multiple"
                rowHeight={30}
                suppressScrollOnNewData={true}
                suppressHorizontalScroll={false}
                
                // Performance optimizations
                suppressColumnVirtualisation={false} // Enable column virtualization
                suppressRowVirtualisation={false}    // Enable row virtualization
                animateRows={false}                  // Disable row animations for better performance
                suppressPropertyNamesCheck={true}    // Skip property validation for performance
            />
        </div>
    );
});

export default Grid;
