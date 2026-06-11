import { useState } from "react";
import {
  downloadCsv,
  exportPdf,
  exportXlsx,
  printAureaDocument,
} from "../utils/exports";
import "./export-modal.css";

const printableTable = (columns, rows) => `
  <table>
    <thead><tr>${columns.map((column) => `<th>${column.label}</th>`).join("")}</tr></thead>
    <tbody>
      ${rows.map((row) => `<tr>${columns.map(({ key, value }) => `<td>${value ? value(row) : row[key] ?? ""}</td>`).join("")}</tr>`).join("")}
    </tbody>
  </table>
`;

export const ExportButtons = ({ basename, title, columns, rows, summary }) => {
  const [open, setOpen] = useState(false);

  const run = async (action) => {
    await action();
    setOpen(false);
  };

  return (
    <>
      <button className="admin-export-trigger" type="button" onClick={() => setOpen(true)}>
        <i className="ri-download-cloud-2-line" />
        Exportar
        <i className="ri-arrow-down-s-line" />
      </button>

      {open && (
        <div className="export-modal-backdrop" role="presentation" onClick={() => setOpen(false)}>
          <section
            className="export-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="export-modal-title"
            onClick={(event) => event.stopPropagation()}
          >
            <button className="export-modal-close" type="button" onClick={() => setOpen(false)} aria-label="Cerrar">
              <i className="ri-close-line" />
            </button>
            <span className="export-modal-eyebrow">Aurea Business Suite</span>
            <h2 id="export-modal-title">Exportar informacion</h2>
            <p>{summary || `${rows.length} registros listos para exportar.`}</p>

            <div className="export-format-grid">
              <button type="button" onClick={() => run(() => exportPdf({ filename: `${basename}.pdf`, title, columns, rows, summary }))}>
                <i className="ri-file-pdf-2-line" />
                <span><strong>PDF</strong><small>Documento presentable</small></span>
              </button>
              <button type="button" onClick={() => run(() => exportXlsx(`${basename}.xlsx`, columns, rows))}>
                <i className="ri-file-excel-2-line" />
                <span><strong>Excel</strong><small>Analisis y formulas</small></span>
              </button>
              <button type="button" onClick={() => run(() => downloadCsv(`${basename}.csv`, columns, rows))}>
                <i className="ri-file-text-line" />
                <span><strong>CSV</strong><small>Datos universales</small></span>
              </button>
              <button type="button" onClick={() => run(() => printAureaDocument({
                title,
                subtitle: summary,
                content: printableTable(columns, rows),
              }))}>
                <i className="ri-printer-line" />
                <span><strong>Imprimir</strong><small>Vista optimizada</small></span>
              </button>
            </div>

            <footer>
              <i className="ri-shield-check-line" />
              Los datos se generan localmente desde la vista actual.
            </footer>
          </section>
        </div>
      )}
    </>
  );
};
