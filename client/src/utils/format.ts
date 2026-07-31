export function formatDate(v?: string | null): string | undefined {
  if (!v) return undefined;
  const d = new Date(isNaN(Number(v)) ? v : Number(v));
  return isNaN(d.getTime()) ? undefined : d.toISOString().slice(0, 10);
}

export function recordsFoundLabel(count: number): string {
  if (count === 0) return "No records found";
  if (count === 1) return "1 record found";
  return `${count} records found`;
}
