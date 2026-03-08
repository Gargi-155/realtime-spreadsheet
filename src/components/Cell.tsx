"use client";

import { useState } from "react";

interface CellProps {
  value: string;
  rawValue: string;
  onChange: (value: string) => void;
}

export default function Cell({ value, rawValue, onChange }: CellProps) {
  const [editing, setEditing] = useState(false);

  return (
    <input
      className="w-full p-2 outline-none"
      value={editing ? rawValue : value}
      onFocus={() => setEditing(true)}
      onBlur={() => setEditing(false)}
      onChange={(e) => onChange(e.target.value)}
    />
  );
}