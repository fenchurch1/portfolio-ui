import React, { useState } from 'react';
import { Table, Textarea, ScrollArea } from '@mantine/core';
import clsx from 'clsx';
import classes from './CopyPaste.module.css';


const CopyPaste = ({ setPastedData, headerIncluded }) => {
  const [data, setData] = useState([]);
  const [headers, setHeaders] = useState([]);

  const poolRegex = /^[A-Za-z]{2} [A-Za-z0-9]{6}$/;
  const cusipRegex = /^[A-Za-z0-9]{9}$/;

  const handlePaste = (event) => {
    event.preventDefault();
    const clipboardData = event.clipboardData.getData('text');

    const rows = clipboardData
      .trim()
      .split('\n')
      .map((row) => row.split('\t').map((cell) => cell.trim()))
      .filter((row) => row.length > 0);

    let detectedHeaders = [];

    if (headerIncluded) {
      // If headerIncluded = true, first row is header
      detectedHeaders = rows[0];
      setData(rows.slice(1));
    } else {
      // Dynamically detect headers from first row
      const firstRow = rows[0];

      detectedHeaders = firstRow.map((cell) => {
        if (cusipRegex.test(cell)) return 'Cusip';
        if (poolRegex.test(cell)) return 'Pool Id';
        return 'Orig Face Amount';
      });

      setData(rows);
    }

    setHeaders(detectedHeaders);
    setPastedData?.(rows);
  };

  return (
    <div className={clsx(classes.hfull, classes.wfull)}>
      <Textarea
        placeholder="Paste Excel data here (Ctrl+V / Cmd+V)"
        minRows={10}
        w="100%"
        onPaste={handlePaste}
      />

      {data.length > 0 && (
        <ScrollArea h={300} mt="md">
          <Table striped highlightOnHover withTableBorder withColumnBorders>
            <thead>
              <tr>
                {headers.map((header, i) => (
                  <th key={i}>{header || `Column ${i + 1}`}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.map((row, rowIndex) => (
                <tr key={rowIndex}>
                  {row.map((cell, cellIndex) => (
                    <td key={cellIndex} className={classes.tableCell}>
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </Table>
        </ScrollArea>
      )}
    </div>
  );
};

export default CopyPaste;
