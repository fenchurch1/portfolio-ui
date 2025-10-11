import * as d3 from "d3";
export const generateColumnDefs = (colDefsFromBackend = []) => {
    debugger
    if (!Array.isArray(colDefsFromBackend) || colDefsFromBackend.length === 0) {
        return [];
    }
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
    return colDefsFromBackend.map((colDef) => {
        const newColDef = {
            headerName: colDef.headerName || colDef.field,
            field: colDef.field,
            width: colDef.width || 150,
            filter: colDef.filter || undefined,
            type: colDef.type || undefined,
            cellClass: colDef.cellClass || undefined,
            pinned: colDef.pinned || undefined,
            sortable: colDef.sortable !== false, // default true
            resizable: colDef.resizable !== false, // default true
            tooltipField: colDef.tooltipField || colDef.field,
        };

        // Convert backend formatter string → function
        if (typeof colDef.valueFormatter === "string") {
            newColDef.valueFormatter = createValueFormatter(colDef.valueFormatter);
        }

        return newColDef;
    });
};