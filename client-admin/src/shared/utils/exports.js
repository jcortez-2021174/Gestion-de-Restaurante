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

const escapeHtml = (value) => String(value ?? "")
  .replaceAll("&", "&amp;")
  .replaceAll("<", "&lt;")
  .replaceAll(">", "&gt;")
  .replaceAll('"', "&quot;")
  .replaceAll("'", "&#039;");

const logoUrl = () => `${window.location.origin}/logo.png`;

const openPrintWindow = (title, width = 900) => {
  const printWindow = window.open("", "_blank", `width=${width},height=760`);
  if (!printWindow) return null;
  printWindow.document.write(`<html><head><title>${escapeHtml(title)}</title></head><body style="background:#fff;color:#111;font-family:Arial,sans-serif;padding:30px;text-align:center">Preparando documento Aurea...</body></html>`);
  return printWindow;
};

const finishPrint = (printWindow, html) => {
  printWindow.document.open();
  printWindow.document.write(html);
  printWindow.document.close();
  printWindow.focus();
  window.setTimeout(() => printWindow.print(), 180);
  return true;
};

export const printAureaDocument = ({ title, subtitle, content }) => {
  const printWindow = window.open("", "_blank", "width=900,height=700");
  if (!printWindow) return false;
  printWindow.document.write(`<!doctype html><html><head><title>${title}</title><style>
    body{font-family:Arial,sans-serif;color:#171717;padding:32px;max-width:1080px;margin:auto}header{display:flex;align-items:center;gap:22px;border-bottom:3px solid #d4af37;margin-bottom:24px;padding-bottom:18px}
    header img{width:112px;height:70px;object-fit:contain;background:#080808;border-radius:10px}h1{letter-spacing:4px;margin:0;color:#9b741f}h2{margin:6px 0 8px}p{color:#666}table{width:100%;border-collapse:collapse}
    th{background:#151515;color:#d4af37}th,td{text-align:left;padding:10px;border-bottom:1px solid #ddd}.total{font-size:24px;color:#9b741f;text-align:right}
    @media print{button{display:none}}
  </style></head><body><header><img src="${logoUrl()}" alt="Aurea"><div><h1>AUREA</h1><h2>${title}</h2><p>${subtitle || ""}</p></div></header>${content}</body></html>`);
  printWindow.document.close();
  printWindow.focus();
  printWindow.print();
  return true;
};

export const printOrderTicket = async (order, { productImages = {} } = {}) => {
  const printWindow = openPrintWindow(`Ticket pedido #${order.id.slice(-8)}`, 520);
  if (!printWindow) return false;
  const { default: QRCode } = await import("qrcode");
  const code = `AUREA-PEDIDO:${order.id}`;
  const qr = await QRCode.toDataURL(code, { width: 180, margin: 1, color: { dark: "#090909", light: "#ffffff" } });
  const createdAt = new Date(order.fechaCreacion);
  const rows = order.productos.map((product) => `
    <tr>
      <td>
        <span class="product-line">
          <img src="${escapeHtml(productImages[product.productoId] || "/plato1.jpeg")}" alt="">
          <span><strong>${escapeHtml(product.nombre)}</strong><small>${product.cantidad} x Q${Number(product.precioUnitario).toFixed(2)}</small></span>
        </span>
      </td>
      <td class="money">Q${Number(product.totalLinea).toFixed(2)}</td>
    </tr>
  `).join("");

  return finishPrint(printWindow, `<!doctype html><html lang="es"><head><title>Pedido ${escapeHtml(order.id)}</title><style>
    @page{size:80mm auto;margin:4mm}*{box-sizing:border-box}body{width:72mm;margin:0 auto;color:#111;font-family:"Courier New",monospace;font-size:11px}
    .brand{text-align:center;border-bottom:2px solid #111;padding-bottom:12px}.brand img{width:48mm;height:24mm;object-fit:contain;filter:grayscale(1) contrast(1.4)}
    .brand h1{margin:2px 0;font-family:Georgia,serif;font-size:22px;letter-spacing:4px}.brand p{margin:0;font-size:9px;letter-spacing:2px}
    .meta{padding:12px 0;border-bottom:1px dashed #777;display:grid;gap:5px}.meta div{display:flex;justify-content:space-between;gap:8px}.meta span{text-align:right}
    table{width:100%;border-collapse:collapse;margin:10px 0}td{padding:8px 0;border-bottom:1px dotted #aaa;vertical-align:middle}.money{text-align:right;font-weight:bold;white-space:nowrap}
    .product-line{display:flex;align-items:center;gap:7px}.product-line img{width:28px;height:28px;border-radius:4px;object-fit:cover;filter:grayscale(.2)}.product-line strong,.product-line small{display:block}.product-line small{margin-top:3px;color:#555}
    .totals{border-top:2px solid #111;padding-top:8px}.totals div{display:flex;justify-content:space-between;margin:5px 0}.totals .grand{font-size:17px;font-weight:bold}
    .qr{text-align:center;margin-top:14px}.qr img{width:32mm;height:32mm}.qr strong,.qr small{display:block}.qr strong{letter-spacing:2px}.qr small{margin-top:6px;color:#555}
    footer{text-align:center;margin-top:14px;padding-top:10px;border-top:1px dashed #777;font-size:9px;line-height:1.6}
  </style></head><body>
    <header class="brand"><img src="${logoUrl()}" alt="Aurea"><h1>AUREA</h1><p>RESTAURANT EXPERIENCE</p></header>
    <section class="meta">
      <div><b>Pedido</b><span>#${escapeHtml(order.id.slice(-8))}</span></div>
      <div><b>Fecha</b><span>${createdAt.toLocaleDateString("es-GT")}</span></div>
      <div><b>Hora</b><span>${createdAt.toLocaleTimeString("es-GT", { hour: "2-digit", minute: "2-digit" })}</span></div>
      <div><b>Cliente</b><span>${escapeHtml(order.clienteNombre)}</span></div>
      <div><b>Mesa</b><span>${escapeHtml(order.mesaId || "Sin mesa")}</span></div>
      <div><b>Mesero</b><span>No asignado</span></div>
    </section>
    <table><tbody>${rows}</tbody></table>
    <section class="totals">
      <div><span>Subtotal</span><strong>Q${Number(order.subtotal).toFixed(2)}</strong></div>
      <div class="grand"><span>TOTAL</span><strong>Q${Number(order.total).toFixed(2)}</strong></div>
    </section>
    <section class="qr"><img src="${qr}" alt="QR pedido"><strong>${escapeHtml(code)}</strong><small>Estado: ${escapeHtml(order.estado)}</small></section>
    <footer>Gracias por elegir Aurea.<br>5ta avenida 12-34, Zona 10<br>loscodiguitos26@gmail.com</footer>
  </body></html>`);
};

export const printReservationVoucher = async (reservation) => {
  const printWindow = openPrintWindow(`Reservacion #${reservation.id.slice(-8)}`, 720);
  if (!printWindow) return false;
  const { default: QRCode } = await import("qrcode");
  const code = `AUREA-RESERVA:${reservation.id}`;
  const qr = await QRCode.toDataURL(code, { width: 220, margin: 1, color: { dark: "#d4af37", light: "#0a0a0a" } });
  const detail = (label, value) => `<div><span>${label}</span><strong>${escapeHtml(value)}</strong></div>`;

  return finishPrint(printWindow, `<!doctype html><html lang="es"><head><title>Reservacion ${escapeHtml(reservation.id)}</title><style>
    @page{size:A5 landscape;margin:8mm}*{box-sizing:border-box}body{margin:0;background:#080808;color:#f8f2e5;font-family:Arial,sans-serif}
    .voucher{min-height:125mm;display:grid;grid-template-columns:1fr 190px;border:1px solid #6b5525;background:radial-gradient(circle at 90% 5%,#2a2110,transparent 34%),#0b0b0b}
    .main{padding:28px}.brand{display:flex;align-items:center;gap:16px;border-bottom:1px solid #4b3c1f;padding-bottom:18px}.brand img{width:110px;height:62px;object-fit:contain}.brand h1{margin:0;color:#d4af37;font-family:Georgia,serif;letter-spacing:5px}.brand p{margin:5px 0 0;color:#81775f;font-size:10px;letter-spacing:2px}
    h2{margin:26px 0 6px;font-family:Georgia,serif;font-size:28px}.code{color:#d4af37;font-size:12px;letter-spacing:2px}.details{display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-top:24px}
    .details div{padding:13px;border:1px solid #2d291f;background:#111}.details span,.details strong{display:block}.details span{color:#817b6e;font-size:10px;text-transform:uppercase;letter-spacing:1px}.details strong{margin-top:6px;font-size:14px}
    .side{display:flex;flex-direction:column;align-items:center;justify-content:center;padding:20px;border-left:1px dashed #5b4b29;background:#0e0c08;text-align:center}.side img{width:145px;height:145px}.side strong{margin-top:15px;color:#d4af37}.side small{margin-top:8px;color:#817b6e;line-height:1.5}
  </style></head><body><article class="voucher">
    <section class="main">
      <header class="brand"><img src="${logoUrl()}" alt="Aurea"><div><h1>AUREA</h1><p>RESERVACION PRIVADA</p></div></header>
      <h2>Tu mesa te espera</h2><div class="code">RESERVACION #${escapeHtml(reservation.id.slice(-8))}</div>
      <div class="details">
        ${detail("Cliente", reservation.clienteNombre)}
        ${detail("Estado", reservation.estado)}
        ${detail("Fecha", reservation.fecha)}
        ${detail("Horario", `${reservation.horaInicio} - ${reservation.horaFin}`)}
        ${detail("Mesa", reservation.mesaNumero ? `Mesa ${reservation.mesaNumero}` : "Por asignar")}
        ${detail("Personas", reservation.personas)}
      </div>
    </section>
    <aside class="side"><img src="${qr}" alt="QR reservacion"><strong>${escapeHtml(code)}</strong><small>Presenta este codigo al llegar.<br>5ta avenida 12-34, Zona 10</small></aside>
  </article></body></html>`);
};
