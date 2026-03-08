export function evaluateFormula(
  rawValue: string,
  cells: Record<string, string>
): string {

  if (!rawValue.startsWith("=")) {
    return rawValue;
  }

  let expression = rawValue.slice(1);

  // Handle SUM ranges like SUM(A1:A5)
  expression = expression.replace(/SUM\(([A-Z][0-9]+):([A-Z][0-9]+)\)/g, (_, start, end) => {

    const startCol = start.charAt(0);
    const startRow = parseInt(start.slice(1));

    const endCol = end.charAt(0);
    const endRow = parseInt(end.slice(1));

    let sum = 0;

    for (let row = startRow; row <= endRow; row++) {
      const cellId = `${startCol}${row}`;
      const value = Number(cells[cellId]);
      if (!isNaN(value)) {
        sum += value;
      }
    }

    return sum.toString();
  });

  // Replace single cell references
  expression = expression.replace(/[A-Z][0-9]+/g, (ref) => {
    const value = cells[ref];
    const num = Number(value);
    return isNaN(num) ? "0" : num.toString();
  });

  try {
    console.log("expression:", expression);
    const result = eval(expression);
    return String(result);
  } catch {
    return "ERROR";
  }
}