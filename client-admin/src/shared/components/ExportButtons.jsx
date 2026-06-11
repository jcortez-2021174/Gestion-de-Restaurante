import { downloadCsv, exportPdf, exportXlsx } from "../utils/exports";

export const ExportButtons = ({ basename, title, columns, rows, summary }) => (
  <div className="admin-export-actions">
    <button className="btn-outline" onClick={() => downloadCsv(`${basename}.csv`, columns, rows)}>CSV</button>
    <button className="btn-outline" onClick={() => exportXlsx(`${basename}.xlsx`, columns, rows)}>Excel</button>
    <button className="btn-outline" onClick={() => exportPdf({ filename: `${basename}.pdf`, title, columns, rows, summary })}>PDF</button>
  </div>
);
