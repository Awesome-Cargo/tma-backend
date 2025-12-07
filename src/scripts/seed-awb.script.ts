import { AwbReportData } from "../models/AwbReportData.js";
import { connectToDatabase } from "../utils/db-connection.js";

async function seed() {
  const now = new Date();

  const awbData = Array.from({ length: 10 }).map((_, i) => ({
    prefijo: "780",
    awb: `${10000000 + i}`,
    carrier: "WIN",
    orig: ["MEX", "GDL", "MTY", "CUN"][i % 4],
    dest: ["LAX", "JFK", "ORD", "MIA"][i % 4],
    codigo_agente: `AGT${String(i + 1).padStart(3, "0")}`,
    pieces: Math.floor(Math.random() * 20) + 1,
    weight: Math.floor(Math.random() * 500) + 50,
    gross_weight: Math.floor(Math.random() * 500) + 60,
    volume: parseFloat((Math.random() * 5 + 1).toFixed(2)),
    rate: parseFloat((Math.random() * 15 + 5).toFixed(2)),
    flete: 0,
    subtotal: 0,
    iva: 0,
    total: 0,
    tipo_pago: i % 2 === 0 ? "CREDIT" : "CASH",
    dim_pieces: Math.floor(Math.random() * 10) + 1,
    dim_weight: Math.floor(Math.random() * 400) + 50,
    dim_length: Math.floor(Math.random() * 150) + 50,
    dim_width: Math.floor(Math.random() * 100) + 30,
    dim_height: Math.floor(Math.random() * 100) + 40,
    dim_volume: parseFloat((Math.random() * 4 + 1).toFixed(2)),
    descripcion: "Carga general - Awesome Cargo",
    codigo_cliente: `CLI-${String(1000 + i)}`,
    consignee: `Cliente ${i + 1} Inc.`,
    currency: "USD",
    product: ["Electronics", "Perishables", "Documents", "Machinery"][i % 4],
    price_class: ["A", "B", "C"][i % 3],
    fecha_creacion: new Date(now.getTime() - i * 86400000),
    charges: "FRT",
  }));

  awbData.forEach((item) => {
    item.flete = parseFloat((item.rate * item.weight).toFixed(2));
    item.subtotal = item.flete;
    item.iva = parseFloat((item.subtotal * 0.16).toFixed(2));
    item.total = parseFloat((item.subtotal + item.iva).toFixed(2));
  });

  await AwbReportData.insertMany(awbData);
}

connectToDatabase().then(() =>
  seed().catch((e) => console.log("Something went wrong: ", e))
);
