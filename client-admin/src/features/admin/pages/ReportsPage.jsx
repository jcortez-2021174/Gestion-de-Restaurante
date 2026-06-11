import { useCallback, useEffect, useState } from "react";
import { AdminLayout } from "../../../shared/layouts/AdminLayout";
import { obtenerReportes } from "../../../services/dashboard.service";
import "../styles/reports.css";
import { ExportButtons } from "../../../shared/components/ExportButtons";

const iso = (date) => date.toISOString().slice(0, 10);
const money = (value) => `Q${Number(value || 0).toFixed(2)}`;

const period = (name) => {
  const end = new Date();
  const start = new Date(end);
  if (name === "dia") start.setHours(0, 0, 0, 0);
  if (name === "semana") start.setDate(end.getDate() - 6);
  if (name === "mes") start.setDate(1);
  if (name === "anio") start.setMonth(0, 1);
  return { desde: iso(start), hasta: iso(end) };
};

export const ReportsPage = () => {
  const [range, setRange] = useState(period("mes"));
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    try {
      setLoading(true);
      setError("");
      setReport(await obtenerReportes(range));
    } catch (requestError) {
      setError(requestError.userMessage || requestError.message);
    } finally {
      setLoading(false);
    }
  }, [range]);

  useEffect(() => {
    // Reload report data whenever the selected period changes.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    load();
  }, [load]);

  return (
    <AdminLayout notificationCount={0}>
      <header className="admin-module-header">
        <div><span className="admin-eyebrow">Inteligencia operativa</span><h1>Reportes</h1><p>Ventas, productos, reservaciones y clientes desde MongoDB.</p></div>
        {report && <ExportButtons
          basename={`reporte-aurea-${range.desde}-${range.hasta}`}
          title="Reporte ejecutivo Aurea"
          columns={[
            { key: "_id", label: "Fecha" },
            { key: "total", label: "Ventas" },
            { key: "pedidos", label: "Pedidos" },
          ]}
          rows={report.ventas || []}
          summary={`Ventas totales: ${money(report.totalVentas)}`}
        />}
      </header>

      <section className="reports-live-filter card">
        <div className="reports-presets">
          {["dia", "semana", "mes", "anio"].map((name) => <button key={name} onClick={() => setRange(period(name))}>{name}</button>)}
        </div>
        <input type="date" value={range.desde} onChange={(event) => setRange({ ...range, desde: event.target.value })} />
        <input type="date" value={range.hasta} onChange={(event) => setRange({ ...range, hasta: event.target.value })} />
      </section>

      {error && <div className="admin-feedback error">{error}</div>}
      {loading ? <div className="loading-state">Generando reporte...</div> : (
        <>
          <section className="reports-live-metrics">
            <article><span>Ventas</span><strong>{money(report.totalVentas)}</strong></article>
            <article><span>Pedidos</span><strong>{report.pedidos.reduce((sum, item) => sum + item.total, 0)}</strong></article>
            <article><span>Reservaciones</span><strong>{report.reservaciones.reduce((sum, item) => sum + item.total, 0)}</strong></article>
            <article><span>Clientes frecuentes</span><strong>{report.clientesFrecuentes.length}</strong></article>
          </section>

          <section className="reports-live-grid">
            <ReportTable title="Productos mas vendidos" rows={report.productosMasVendidos} columns={[
              ["nombre", "Producto"],
              ["ventas", "Unidades"],
              ["ingresos", "Ingresos", money],
            ]} />
            <ReportTable title="Productos menos vendidos" rows={report.productosMenosVendidos} columns={[
              ["nombre", "Producto"],
              ["ventas", "Unidades"],
              ["ingresos", "Ingresos", money],
            ]} />
            <ReportTable title="Clientes frecuentes" rows={report.clientesFrecuentes} columns={[
              ["nombre", "Cliente"],
              ["visitas", "Pedidos"],
              ["gasto", "Consumo", money],
            ]} />
            <div className="card report-status-panel">
              <h2>Estados</h2>
              {[...report.pedidos.map((item) => ({ ...item, tipo: "Pedido" })), ...report.reservaciones.map((item) => ({ ...item, tipo: "Reserva" }))].map((item) => (
                <div key={`${item.tipo}-${item._id}`}><span>{item.tipo}: {item._id}</span><strong>{item.total}</strong></div>
              ))}
            </div>
          </section>
        </>
      )}
    </AdminLayout>
  );
};

const ReportTable = ({ title, rows, columns }) => (
  <div className="card report-table-card">
    <h2>{title}</h2>
    <div className="report-table">
      <div className="report-table-row header">{columns.map(([, label]) => <span key={label}>{label}</span>)}</div>
      {rows.map((row, index) => <div className="report-table-row" key={row._id || row.id || index}>{columns.map(([key, label, format]) => <span key={label}>{format ? format(row[key]) : row[key]}</span>)}</div>)}
      {!rows.length && <div className="empty-state">Sin datos para este periodo.</div>}
    </div>
  </div>
);
