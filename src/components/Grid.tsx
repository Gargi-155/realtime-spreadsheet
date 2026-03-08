"use client";
import { evaluateFormula } from "@/lib/formulas";
import { useState } from "react";
import Cell from "./Cell";

const ROWS = 20;
const COLS = 10;

function columnLabel(index: number) {
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
    <div className="mt-8 overflow-auto border rounded-lg">
      <table className="border-collapse w-full">
        <thead>
          <tr>
            <th className="w-12"></th>
            {Array.from({ length: COLS }).map((_, col) => (
              <th key={col} className="border bg-gray-100 px-4 py-2 text-center">
                {columnLabel(col)}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {Array.from({ length: ROWS }).map((_, row) => (
            <tr key={row}>
              <td className="border text-center bg-gray-100">{row + 1}</td>

              {Array.from({ length: COLS }).map((_, col) => {
                const id = `${columnLabel(col)}${row + 1}`;

                return (
                  <td key={id} className="border">
                   <Cell
                   rawValue={cells[id] || ""}
                   value={evaluateFormula(cells[id] || "", cells)}
                   onChange={(value) => handleChange(id, value)}
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