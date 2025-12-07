import mongoose from "mongoose";

export interface IAwbReportData {
  _id: mongoose.Types.ObjectId;
  prefijo: string;
  awb: string;
  carrier: string;
  orig: string;
  dest: string;
  codigo_agente: string;
  nombre_agente: string;
  pieces: number;
  weight: number;
  gross_weight: number;
  volume: number;
  rate?: number;
  flete: number;
  subtotal: number;
  iva: number;
  total?: number;
  tipo_pago?: string;
  descripcion: string;
  codigo_cliente?: string;
  currency: string;
  price_class?: string;
  shc?: string;
  fecha_creacion: Date;
  charge_code?: string;
  create_oper: string;
}

const AwbReportDataSchema = new mongoose.Schema<IAwbReportData>(
  {
    _id: { type: mongoose.Schema.Types.ObjectId, auto: true },
    prefijo: { type: String, required: true },
    awb: { type: String, required: true },
    carrier: { type: String, required: true },
    orig: { type: String, required: true },
    dest: { type: String, required: true },
    codigo_agente: { type: String, required: true },
    nombre_agente: { type: String, required: true },
    pieces: { type: Number, required: true },
    weight: { type: Number, required: true },
    gross_weight: { type: Number, required: true },
    volume: { type: Number, required: true },
    rate: { type: Number },
    flete: { type: Number, required: true },
    subtotal: { type: Number, required: true },
    iva: { type: Number, required: true },
    total: { type: Number },
    tipo_pago: { type: String },
    descripcion: { type: String, required: true },
    codigo_cliente: { type: String },
    currency: { type: String, required: true },
    price_class: { type: String },
    shc: { type: String },
    fecha_creacion: { type: Date, required: true },
    charge_code: { type: String },
    create_oper: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

export const AwbReportData = mongoose.model<IAwbReportData>(
  "AwbReportData",
  AwbReportDataSchema
);
