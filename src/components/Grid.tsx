"use client";

import { useState, useEffect } from "react";
import Cell from "./Cell";
import { evaluateFormula } from "@/lib/formulas";
import { db } from "@/lib/firebase";
import { doc, onSnapshot, updateDoc, serverTimestamp } from "firebase/firestore";

interface GridProps {
  docId: string;
}

const COLS = 10;

function columnLabel(index: number) {
  return String.fromCharCode(65 + index);
}

export default function Grid({ docId }: GridProps) {
  const [rows, setRows] = useState(20);

  const [cells, setCells] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);

  const [activeRow, setActiveRow] = useState(0);
  const [activeCol, setActiveCol] = useState(0);

  const [colWidths, setColWidths] = useState<number[]>(Array(COLS).fill(120));
  const [rowHeights, setRowHeights] = useState<number[]>(Array(20).fill(40));

  // Firestore realtime listener
  useEffect(() => {
    if (!docId) return;

    const docRef = doc(db, "documents", docId);

    const unsubscribe = onSnapshot(docRef, (snapshot) => {
      const data = snapshot.data();

      if (data?.cells) setCells(data.cells);
      if (data?.colWidths) setColWidths(data.colWidths);
      if (data?.rowHeights) setRowHeights(data.rowHeights);
    });

    return () => unsubscribe();
  }, [docId]);

  // Save cell value
  const handleChange = async (cellId: string, value: string) => {
    if (!docId) return;

    const newCells = { ...cells, [cellId]: value };

    setCells(newCells);
    setSaving(true);

    const docRef = doc(db, "documents", docId);

    await updateDoc(docRef, {
      cells: newCells,
      lastModified: serverTimestamp(),
    });

    setSaving(false);
  };

  // Keyboard navigation
  function handleKeyDown(e: React.KeyboardEvent<HTMLDivElement>) {
    if (e.key === "ArrowDown") {
      setActiveRow((r) => Math.min(r + 1, rows - 1));
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
      setActiveRow((r) => Math.min(r + 1, rows - 1));
    }
  }

  // Column Resize
  function startResize(colIndex: number, startX: number) {
    const startWidth = colWidths[colIndex];

    function onMouseMove(e: MouseEvent) {
      const newWidth = startWidth + (e.clientX - startX);

      setColWidths((prev) => {
        const copy = [...prev];
        copy[colIndex] = Math.max(newWidth, 60);
        return copy;
      });
    }

    function onMouseUp(e: MouseEvent) {
      const finalWidth = startWidth + (e.clientX - startX);

      const updated = [...colWidths];
      updated[colIndex] = Math.max(finalWidth, 60);

      setColWidths(updated);

      if (docId) {
        const docRef = doc(db, "documents", docId);
        updateDoc(docRef, { colWidths: updated });
      }

      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
    }

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
  }

  // Row Resize
  function startRowResize(rowIndex: number, startY: number) {
    const startHeight = rowHeights[rowIndex] || 40;

    function onMouseMove(e: MouseEvent) {
      const newHeight = startHeight + (e.clientY - startY);

      setRowHeights((prev) => {
        const copy = [...prev];
        copy[rowIndex] = Math.max(newHeight, 25);
        return copy;
      });
    }

    function onMouseUp(e: MouseEvent) {
      const finalHeight = startHeight + (e.clientY - startY);

      const updated = [...rowHeights];
      updated[rowIndex] = Math.max(finalHeight, 25);

      setRowHeights(updated);

      if (docId) {
        const docRef = doc(db, "documents", docId);
        updateDoc(docRef, { rowHeights: updated });
      }

      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
    }

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
  }

  return (
    <div
      className="mt-8 overflow-auto border rounded-lg p-2"
      tabIndex={0}
      onKeyDown={handleKeyDown}
      onScroll={(e) => {
        const el = e.currentTarget;

        if (el.scrollTop + el.clientHeight >= el.scrollHeight - 20) {
          setRows((r) => r + 20);

          setRowHeights((prev) => [...prev, ...Array(20).fill(40)]);
        }
      }}
    >
      <div className="text-sm text-gray-500 mb-2">
        {saving ? "Saving..." : "Saved ✓"}
      </div>

      <table className="border-collapse table-fixed w-full">
        <thead>
          <tr>
            <th className="w-12"></th>

            {Array.from({ length: COLS }).map((_, col) => (
              <th
                key={col}
                style={{ width: colWidths[col] || 120 }}
                className="border bg-gray-100 px-4 py-2 text-center relative"
              >
                {columnLabel(col)}

                <div
                  onMouseDown={(e) => startResize(col, e.clientX)}
                  className="absolute right-0 top-0 h-full w-2 cursor-col-resize hover:bg-gray-400"
                />
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {Array.from({ length: rows }).map((_, row) => (
            <tr key={row} style={{ height: rowHeights[row] || 40 }}>
              <td
                className="border text-center bg-gray-100 relative"
                style={{ height: rowHeights[row] || 40 }}
              >
                {row + 1}

                <div
                  onMouseDown={(e) => startRowResize(row, e.clientY)}
                  className="absolute bottom-0 left-0 w-full h-1 cursor-row-resize hover:bg-gray-400"
                />
              </td>

              {Array.from({ length: COLS }).map((_, col) => {
                const id = `${columnLabel(col)}${row + 1}`;
                const isActive = row === activeRow && col === activeCol;

                return (
                  <td
                    key={id}
                    className="border"
                    style={{ width: colWidths[col] || 120 }}
                  >
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