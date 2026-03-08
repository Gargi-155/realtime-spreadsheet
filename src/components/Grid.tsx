"use client";

import { useState } from "react";

const ROWS = 20;
const COLS = 10;

function getColumnLabel(index: number) {
  return String.fromCharCode(65 + index);
}

export default function Grid() {
  const [cells, setCells] = useState<Record<string, string>>({});

  const handleChange = (cellId: string, value: string) => {
    setCells((prev) => ({
      ...prev,
      [cellId]: value,
    }));
  };

  return (
    <div className="overflow-auto border rounded-lg mt-6">
      <table className="border-collapse">
        <thead>
          <tr>
            <th className="w-12"></th>
            {Array.from({ length: COLS }).map((_, col) => (
              <th
                key={col}
                className="border px-4 py-2 bg-gray-100 text-center"
              >
                {getColumnLabel(col)}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {Array.from({ length: ROWS }).map((_, row) => (
            <tr key={row}>
              <td className="border px-2 text-center bg-gray-100">
                {row + 1}
              </td>

              {Array.from({ length: COLS }).map((_, col) => {
                const cellId = `${getColumnLabel(col)}${row + 1}`;

                return (
                  <td key={cellId} className="border">
                    <input
                      className="w-full p-2 outline-none"
                      value={cells[cellId] || ""}
                      onChange={(e) =>
                        handleChange(cellId, e.target.value)
                      }
                    />
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}