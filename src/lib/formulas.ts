export function evaluateFormula(
  rawValue: string,
  cells: Record<string, string>
): string {

  if (!rawValue.startsWith("=")) {
    return rawValue;
  }

  let expression = rawValue.slice(1);

  expression = expression.replace(/[A-Z][0-9]+/g, (ref) => {
    const value = cells[ref];
    const num = Number(value);
    return isNaN(num) ? "0" : num.toString();
  });

  try {
    const result = eval(expression);
    return String(result);
  } catch {
    return "ERROR";
  }
}