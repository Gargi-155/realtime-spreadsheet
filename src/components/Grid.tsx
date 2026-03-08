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
  const [activeCell, setActiveCell] = useState<string | null>(null);
  

  // Listen for realtime updates from Firestore
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

  // Update Firestore when a cell changes
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

  return (
    <div className="mt-8 overflow-auto border rounded-lg p-2">

      {/* Saving Indicator */}
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

                return (
                  <td key={id} className="border">
                    <Cell
                    rawValue={cells[id] || ""}
                    value={evaluateFormula(cells[id] || "", cells)}
                    onCommit={(value) => handleChange(id, value)}
                    active={activeCell === id}
                    onFocus={() => setActiveCell(id)}
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