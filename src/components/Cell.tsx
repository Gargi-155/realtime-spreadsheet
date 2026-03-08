"use client";

interface CellProps {
  value: string;
  onChange: (value: string) => void;
}

export default function Cell({ value, onChange }: CellProps) {
  return (
    <input
      className="w-full p-2 outline-none"
      value={value}
      onChange={(e) => onChange(e.target.value)}
    />
  );
}