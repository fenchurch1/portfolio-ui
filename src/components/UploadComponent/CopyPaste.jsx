import React, { useEffect, useState } from 'react';
import { Table, Textarea, ScrollArea, ActionIcon, Group, Text } from '@mantine/core';
import { IconX } from '@Assets/icons';
import clsx from 'clsx';
import classes from './CopyPaste.module.css';
import { toast } from 'react-toastify';

const CopyPaste = ({ setPastedData, headerIncluded }) => {
  const [data, setData] = useState([]);
  const [headers, setHeaders] = useState([]);
  const [rowResults, setRowResults] = useState([]);
  const [rawRows, setRawRows] = useState([]);
  const poolRegex = /^[A-Za-z]{2} [A-Za-z0-9]{6}$/;
  const cusipRegex = /^[A-Za-z0-9]{9}$/;
  const numberRegex = /^\d+(\.\d+)?$/;

  const allowedCombinations = [
    ['cusip'],
    ['cusip', 'amount'],
    ['pool_id'],
    ['pool_id', 'amount'],
  ];

  const classifyCell = (cell) => {
    if (cusipRegex.test(cell)) return 'cusip';
    if (poolRegex.test(cell)) return 'pool_id';
    if (numberRegex.test(cell)) return 'amount';
    return 'unknown';
  };

  const validateRow = (row, isHeaderRow = false) => {
    if (isHeaderRow) return { isValid: true, error: '' }; // skip validation for header

    const types = row.map((cell) => classifyCell(cell));
    const validTypes = types.filter((t) => t !== 'unknown');

    const isValid = allowedCombinations.some((allowed) => {
      if (allowed.length !== validTypes.length) return false;
      return allowed.every((a) => validTypes.includes(a));
    });

    let error = '';
    if (!isValid) {
      if (validTypes.length === 0) error = 'Row is empty or contains invalid values';
      else if (validTypes.length > 2) error = 'More than 2 valid columns detected — only 1 or 2 allowed';
      else if (!validTypes.includes('cusip') && !validTypes.includes('pool_id')) error = 'Must contain Cusip or Pool ID';
      else error = 'Row does not match allowed combination (Cusip/Pool + optional amount)';
    }

    // Store per-cell validation for coloring
    const cellResults = row.map((cell, i) => {
      const type = classifyCell(cell);
      const valid = allowedCombinations.some((allowed) =>
        allowed.includes(type)
      );
      return { valid, type };
    });

    return { isValid, error, cellResults };
  };

  const handlePaste = (event) => {
    event.preventDefault();
    const clipboardData = event.clipboardData.getData('text');

    const rows = clipboardData
      .trim()
      .split('\n')
      .map((row) => row.split('\t').map((cell) => cell.trim()))
      .filter((row) => row.length > 0);
    if (!rows.length) return toast.error('No data pasted');

    setRawRows(rows);

    if (headerIncluded && rows.length < 2 || (rows[0].length > 2 || rows[0].length < 0)) {
      toast.error("Data is not proper")
      return;
    }

    if (!headerIncluded && (rows[0].length > 2 || rows[0].length < 0)) {
      toast.error("Data is not proper")
      return;
    }

    const rowValidation = rows.map((row, idx) =>
      validateRow(row, headerIncluded && idx === 0)
    );

    if (headerIncluded) {
      setHeaders(rows[0]);
      setData(rows.slice(1));
      setRowResults(rowValidation.slice(1));
      setPastedData?.(rows.slice(1));
    } else {
      const firstRow = rows[0];
      const detectedHeaders = firstRow.map((cell) => {
        if (cusipRegex.test(cell)) return 'Cusip';
        if (poolRegex.test(cell)) return 'Pool Id';
        return 'Orig Face Amount';
      });
      setHeaders(detectedHeaders);
      setData(rows);
      setRowResults(rowValidation);
      setPastedData?.(rows);
    }
  };

  const handleClear = () => {
    setData([]);
    setHeaders([]);
    setRowResults([]);
    setPastedData?.([]);
  };

  useEffect(() => {
    if (!rawRows || rawRows.length === 0) return;

    const rowValidation = rawRows.map((row, idx) =>
      validateRow(row, headerIncluded && idx === 0)
    );

    if (headerIncluded) {
      setHeaders(rawRows[0]);
      setData(rawRows.slice(1));
      setRowResults(rowValidation.slice(1));
      setPastedData?.(rawRows.slice(1));
    } else {
      const firstRow = rawRows[0];
      const detectedHeaders = firstRow.map((cell) => {
        if (cusipRegex.test(cell)) return 'Cusip';
        if (poolRegex.test(cell)) return 'Pool Id';
        return 'Orig Face Amount';
      });
      setHeaders(detectedHeaders);
      setData(rawRows);
      setRowResults(rowValidation);
      setPastedData?.(rawRows);
    }
  }, [headerIncluded, rawRows]);

  return (
    <div className={clsx(classes.hfull, classes.wfull)}>
      <Textarea
        placeholder="Paste Excel data here (Ctrl+V / Cmd+V)"
        minRows={10}
        w="100%"
        onPaste={handlePaste}
      />

      {data.length > 0 && (
        <>
          <Group position="right" mt="sm" mb="sm">
            <ActionIcon color="red" variant="light" onClick={handleClear} title="Clear data">
              <IconX size={18} />
            </ActionIcon>
          </Group>

          <ScrollArea h={300}>
            <Table striped highlightOnHover withTableBorder withColumnBorders>
              <thead>
                <tr>
                  {headers.map((header, i) => (
                    <th key={i}>{header}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {data.map((row, rowIndex) => {
                  const { isValid, error, cellResults } = rowResults[rowIndex] || {};
                  return (
                    <tr
                      key={rowIndex}
                      className={clsx({
                        [classes.validRow]: isValid,
                        [classes.invalidRow]: !isValid,
                      })}
                    >
                      {row.map((cell, cellIndex) => {
                        const valid = cellResults?.[cellIndex]?.valid ?? true;
                        return (
                          <td
                            key={cellIndex}
                            className={clsx(classes.tableCell, {
                              [classes.validCell]: valid,
                              [classes.invalidCell]: !valid,
                            })}
                          >
                            {cell}
                          </td>
                        );
                      })}
                      {!isValid && (
                        <td className={classes.errorCell}>
                          <Text color="red" size="xs">{error}</Text>
                        </td>
                      )}
                    </tr>
                  );
                })}
              </tbody>
            </Table>
          </ScrollArea>
        </>
      )}
    </div>
  );
};

export default CopyPaste;
