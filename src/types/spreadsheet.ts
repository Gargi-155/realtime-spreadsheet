export type CellValue = string | number;

export interface Cell {
  id: string;
  value: CellValue;
}

export interface SpreadsheetDocument {
  id: string;
  title: string;
  createdBy: string;
  lastModified: number;
}