"use client";

import { useState } from "react";

interface CellProps {
  rawValue: string;
  value: string;
  onCommit: (value: string) => void;
}

export default function Cell({ rawValue, value, onCommit }: CellProps) {
  const [editing, setEditing] = useState(false);
  const [localValue, setLocalValue] = useState(rawValue);

  return (
    <input
      className="w-full p-2 outline-none bg-transparent"
      value={editing ? localValue : value}
      onFocus={() => {
        setEditing(true);
        setLocalValue(rawValue);
      }}
      onBlur={() => {
        setEditing(false);
        onCommit(localValue);
      }}
      onChange={(e) => setLocalValue(e.target.value)}
    />
  );
}