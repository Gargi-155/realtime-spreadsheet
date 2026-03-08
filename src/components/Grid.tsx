"use client";

import { useState, useEffect } from "react";
import Cell from "./Cell";
import { evaluateFormula } from "@/lib/formulas";
import { db } from "@/lib/firebase";
import { doc, onSnapshot, updateDoc } from "firebase/firestore";

interface GridProps {
  docId: string;
}

const ROWS = 20;
const COLS = 10;

function columnLabel(index: number) {
  return String.fromCharCode(65 + index);
}

export default function Grid({ docId }: GridProps) {
  const [cells, setCells] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);

  const [activeRow, setActiveRow] = useState(0);
  const [activeCol, setActiveCol] = useState(0);

  // Realtime Firestore listener
  useEffect(() => {
    if (!docId) return;

    const docRef = doc(db, "documents", docId);

    const unsubscribe = onSnapshot(docRef, (snapshot) => {
      const data = snapshot.data();

      if (data?.cells) {
        setCells(data.cells);
      }
    });

    return () => unsubscribe();
  }, [docId]);

  // Save cell change
  const handleChange = async (cellId: string, value: string) => {
    if (!docId) return;

    const newCells = {
      ...cells,
      [cellId]: value,
    };

    setCells(newCells);
    setSaving(true);

    const docRef = doc(db, "documents", docId);

    await updateDoc(docRef, {
      cells: newCells,
    });

    setSaving(false);
  };

  // Keyboard navigation
  function handleKeyDown(e: React.KeyboardEvent<HTMLDivElement>) {
    if (e.key === "ArrowDown") {
      setActiveRow((r) => Math.min(r + 1, ROWS - 1));
    }

    if (e.key === "ArrowUp") {
      setActiveRow((r) => Math.max(r - 1, 0));
    }

    if (e.key === "ArrowRight" || e.key === "Tab") {
      e.preventDefault();
      setActiveCol((c) => Math.min(c + 1, COLS - 1));
    }

    if (e.key === "ArrowLeft") {
      setActiveCol((c) => Math.max(c - 1, 0));
    }

    if (e.key === "Enter") {
      setActiveRow((r) => Math.min(r + 1, ROWS - 1));
    }
  }

  return (
    <div
      className="mt-8 overflow-auto border rounded-lg p-2"
      onKeyDown={handleKeyDown}
      tabIndex={0}
    >
      {/* Saving indicator */}
      <div className="text-sm text-gray-500 mb-2">
        {saving ? "Saving..." : "Saved ✓"}
      </div>

      <table className="border-collapse w-full">
        <thead>
          <tr>
            <th className="w-12"></th>

            {Array.from({ length: COLS }).map((_, col) => (
              <th
                key={col}
                className="border bg-gray-100 px-4 py-2 text-center"
              >
                {columnLabel(col)}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {Array.from({ length: ROWS }).map((_, row) => (
            <tr key={row}>
              <td className="border text-center bg-gray-100">
                {row + 1}
              </td>

              {Array.from({ length: COLS }).map((_, col) => {
                const id = `${columnLabel(col)}${row + 1}`;
                const isActive = row === activeRow && col === activeCol;

                return (
                  <td key={id} className="border">
                    <Cell
                      rawValue={cells[id] || ""}
                      value={evaluateFormula(cells[id] || "", cells)}
                      active={isActive}
                      onFocus={() => {
                        setActiveRow(row);
                        setActiveCol(col);
                      }}
                      onCommit={(value) => handleChange(id, value)}
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