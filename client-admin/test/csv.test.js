import test from "node:test";
import assert from "node:assert/strict";
import { buildCsv } from "../src/shared/utils/csv.js";

test("builds escaped CSV output for exported business data", () => {
  const csv = buildCsv(
    [
      { key: "nombre", label: "Producto" },
      { key: "precio", label: "Precio" },
    ],
    [{ nombre: 'Cordero "Aurea", especial', precio: 165 }]
  );

  assert.equal(
    csv,
    '"Producto","Precio"\r\n"Cordero ""Aurea"", especial","165"'
  );
});
