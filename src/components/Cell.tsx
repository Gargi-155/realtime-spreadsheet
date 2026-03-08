"use client";

import { useState } from "react";

interface CellProps {
  rawValue: string;
  value: string;
  active: boolean;
  onFocus: () => void;
  onCommit: (value: string) => void;
}

export default function Cell({
  rawValue,
  value,
  active,
  onFocus,
  onCommit,
}: CellProps) {
  const [editing, setEditing] = useState(false);
  const [localValue, setLocalValue] = useState(rawValue);

  return (
    <input
      className={`w-full p-2 outline-none bg-transparent ${
        active ? "border-2 border-blue-500" : ""
      }`}
      value={editing ? localValue : value}
      onFocus={() => {
        setEditing(true);
        setLocalValue(rawValue);
        onFocus();
      }}
      onBlur={() => {
        setEditing(false);
        onCommit(localValue);
      }}
      onChange={(e) => setLocalValue(e.target.value)}
    />
  );
}