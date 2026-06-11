import { buildCsv, downloadCsv } from "./csv";

const valuesForColumns = (columns, rows) => rows.map((row) => (
  Object.fromEntries(columns.map(({ key, label, value }) => [label, value ? value(row) : row[key]]))
));

export const exportXlsx = async (filename, columns, rows) => {
  const XLSX = await import("xlsx");
  const worksheet = XLSX.utils.json_to_sheet(valuesForColumns(columns, rows));
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Aurea");
  XLSX.writeFile(workbook, filename);
};

export const exportPdf = async ({ filename, title, columns, rows, summary = "" }) => {
  const { jsPDF } = await import("jspdf");
  const document = new jsPDF({ orientation: "landscape" });
  document.setFillColor(12, 12, 12);
  document.rect(0, 0, 297, 30, "F");
  document.setTextColor(212, 175, 55);
  document.setFontSize(22);
  document.text("AUREA", 14, 14);
  document.setTextColor(255, 255, 255);
  document.setFontSize(13);
  document.text(title, 14, 23);
  document.setTextColor(70, 70, 70);
  document.setFontSize(9);
  document.text(`Generado: ${new Date().toLocaleString("es-GT")}`, 14, 38);
  if (summary) document.text(summary, 14, 44);

  const startY = summary ? 52 : 46;
  const columnWidth = 270 / Math.max(columns.length, 1);
  document.setFontSize(8);
  columns.forEach((column, index) => document.text(column.label, 14 + index * columnWidth, startY));
  document.line(14, startY + 2, 283, startY + 2);

  rows.slice(0, 80).forEach((row, rowIndex) => {
    const y = startY + 8 + rowIndex * 5;
    if (y > 198) return;
    columns.forEach(({ key, value }, index) => {
      const cell = value ? value(row) : row[key];
      document.text(String(cell ?? "").slice(0, 32), 14 + index * columnWidth, y);
    });
  });
  document.save(filename);
};

export const exportCsvText = (columns, rows) => buildCsv(columns, rows);
export { downloadCsv };

export const printAureaDocument = ({ title, subtitle, content }) => {
  const printWindow = window.open("", "_blank", "width=900,height=700");
  if (!printWindow) return false;
  printWindow.document.write(`<!doctype html><html><head><title>${title}</title><style>
    body{font-family:Arial,sans-serif;color:#171717;padding:32px}header{border-bottom:3px solid #d4af37;margin-bottom:24px}
    h1{letter-spacing:4px;margin:0;color:#9b741f}h2{margin:6px 0 18px}table{width:100%;border-collapse:collapse}
    th,td{text-align:left;padding:10px;border-bottom:1px solid #ddd}.total{font-size:24px;color:#9b741f;text-align:right}
    @media print{button{display:none}}
  </style></head><body><header><h1>AUREA</h1><h2>${title}</h2><p>${subtitle || ""}</p></header>${content}</body></html>`);
  printWindow.document.close();
  printWindow.focus();
  printWindow.print();
  return true;
};
