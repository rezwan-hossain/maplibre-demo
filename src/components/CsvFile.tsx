import React, { useRef, useState } from "react";
import Papa from "papaparse";
import { useVirtualizer } from "@tanstack/react-virtual";

type CsvRow = Record<string, string>;

// const SAMPLE_CSV_URL = "/organizations-100.csv";
// const SAMPLE_CSV_URL = `${import.meta.env.BASE_URL}organizations-100000.csv`;

const BASE_URL = import.meta.env.BASE_URL || "/";
const SAMPLE_CSV_URL = `${BASE_URL.replace(
  /\/$/,
  ""
)}/organizations-100000.csv`;

const CsvFile = () => {
  const [csvData, setCsvData] = useState<CsvRow[]>([]);
  const [headers, setHeaders] = useState<string[]>([]);
  const [error, setError] = useState<string>("");

  const parentRef = useRef<HTMLDivElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) {
      setError("No file selected.");
      return;
    }

    if (file.type !== "text/csv") {
      setError("Please upload a valid CSV file.");
      return;
    }

    setError("");
    parseCsvFile(file);
  };

  const parseCsvFile = (file: File | string) => {
    Papa.parse<CsvRow>(file, {
      header: true,
      worker: false,
      skipEmptyLines: "greedy",
      complete: (results) => {
        // if (results.data.length === 0) {
        //   setError("CSV file is Empty.");
        // } else {
        //   setHeaders(Object.keys(results.data[0]));
        //   setCsvData(results.data);
        // }

        // Remove only null/undefined rows
        const validRows = results.data.filter(
          (row): row is CsvRow => row != null
        );

        if (validRows.length === 0) {
          setError("CSV file is Empty.");
          return;
        }

        const fields = results.meta.fields;

        if (!fields || fields.length === 0) {
          setError("CSV headers not found.");
          return;
        }
        setHeaders(Object.keys(validRows[0]));
        setCsvData(validRows);
      },
      error: (err) => {
        console.error(err);
        setError("Error reading the CSV file.");
      },
    });
  };

  // const loadSampleCsv = async () => {
  //   setError("");
  //   setCsvData([]);
  //   setHeaders([]);

  //   // Fetch and parse CSV from public folder
  //   // parseCsvFile(SAMPLE_CSV_URL);
  //   try {
  //     // 1. Fetch the file from the public folder
  //     const response = await fetch(SAMPLE_CSV_URL);

  //     const csvText = await response.text();
  //     parseCsvFile(csvText);
  //   } catch (err) {
  //     console.error(err);
  //     setError("Could not load sample file.");
  //   }
  // };

  const loadSampleCsv = async () => {
    setError("");
    setCsvData([]);
    setHeaders([]);

    try {
      console.log("Fetching from:", SAMPLE_CSV_URL);
      const response = await fetch(SAMPLE_CSV_URL);

      if (!response.ok) {
        throw new Error(`Failed to fetch CSV: ${response.statusText}`);
      }

      const contentType = response.headers.get("content-type");
      if (contentType && contentType.includes("text/html")) {
        throw new Error(
          "Server returned HTML instead of CSV (Check file path)"
        );
      }

      const csvText = await response.text();
      parseCsvFile(csvText);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Could not load sample file.");
    }
  };

  const rowVirtualizer = useVirtualizer({
    count: csvData.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 40,
    overscan: 10,
  });

  const virtualItems = rowVirtualizer.getVirtualItems();

  // Calculate the spacer heights
  const paddingTop = virtualItems.length > 0 ? virtualItems[0].start : 0;
  const paddingBottom =
    virtualItems.length > 0
      ? rowVirtualizer.getTotalSize() -
        virtualItems[virtualItems.length - 1].end
      : 0;

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold text-center mb-6">CSV File Viewer</h1>

      {/* File Upload */}
      <div className="mb-4">
        <label
          htmlFor="csvFile"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Upload a CSV File
        </label>
        <input
          id="csvFile"
          type="file"
          accept=".csv"
          onChange={handleFileUpload}
          className="block w-full rounded-md border border-gray-300 p-2 text-sm file:mr-4 file:rounded file:border-0
                     file:bg-blue-600 file:px-4 file:py-2 file:text-white hover:file:bg-blue-700"
        />
      </div>
      <div className="flex flex-col justify-end">
        <button
          onClick={loadSampleCsv}
          className={`px-6 py-2.5 rounded-md font-medium text-white transition bg-blue-600 hover:bg-blue-700 cursor-pointer`}
        >
          {"Load Sample CSV"}
        </button>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="mb-4 rounded-md bg-red-100 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* Table */}
      {csvData.length > 0 && (
        <div
          ref={parentRef}
          className="overflow-auto border border-gray-300 rounded-md mt-6 "
          style={{ height: "70vh" }}
        >
          <table className="min-w-full border border-gray-300 rounded-md relative">
            <thead className="bg-gray-100 sticky top-0  z-10">
              <tr>
                {headers.map((header, index) => (
                  <th
                    key={index}
                    className="border border-gray-300 px-3 py-2 text-left text-sm font-semibold text-gray-700"
                  >
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {/* Top Spacer Row */}
              {paddingTop > 0 && (
                <tr>
                  <td
                    style={{ height: `${paddingTop}px` }}
                    colSpan={headers.length}
                  />
                </tr>
              )}

              {/* Actual Virtual Rows */}
              {virtualItems.map((virtualRow) => {
                const row = csvData[virtualRow.index];
                return (
                  <tr
                    key={virtualRow.key} // Use the virtual key
                    data-index={virtualRow.index} // Useful for debugging
                    ref={rowVirtualizer.measureElement} // Dynamic height measurement
                    className="odd:bg-white even:bg-gray-50 hover:bg-gray-100"
                  >
                    {headers.map((header, colIndex) => (
                      <td
                        key={colIndex}
                        className="border border-gray-300 px-3 py-2 text-sm text-gray-700"
                      >
                        {row[header]}
                      </td>
                    ))}
                  </tr>
                );
              })}

              {/* Bottom Spacer Row */}
              {paddingBottom > 0 && (
                <tr>
                  <td
                    style={{ height: `${paddingBottom}px` }}
                    colSpan={headers.length}
                  />
                </tr>
              )}
            </tbody>

            {/* <tbody
              style={{
                height: `${rowVirtualizer.getTotalSize()}px`,
                position: "relative",
              }}
            >
              {csvData.map((row, rowIndex) => (
                <tr
                  key={rowIndex}
                  className=" odd:bg-white even:bg-gray-50 hover:bg-gray-100"
                >
                  {headers.map((header, colIndex) => (
                    <td
                      key={colIndex}
                      className="border border-gray-300 px-3 py-2 text-sm text-gray-700"
                    >
                      {row[header]}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody> */}
          </table>
        </div>
      )}

      {csvData.length > 0 && (
        <p className="mt-6 text-center text-sm text-gray-600">
          {csvData.length.toLocaleString()}
          row
        </p>
      )}
    </div>
  );
};

export default CsvFile;
