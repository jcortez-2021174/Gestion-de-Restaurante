const escapeCell = (value) => {
  const text = value === null || value === undefined ? "" : String(value);
  return `"${text.replaceAll('"', '""')}"`;
};

export const buildCsv = (columns, rows) => {
  const header = columns.map(({ label }) => escapeCell(label));
  const body = rows.map((row) => columns.map(({ key, value }) => (
    escapeCell(value ? value(row) : row[key])
  )));
  return [header, ...body].map((line) => line.join(",")).join("\r\n");
};

export const downloadCsv = (filename, columns, rows) => {
  const blob = new Blob(["\uFEFF", buildCsv(columns, rows)], {
    type: "text/csv;charset=utf-8",
  });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
};
