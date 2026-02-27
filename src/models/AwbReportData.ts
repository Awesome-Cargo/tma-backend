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
  descripcion?: string;
  codigo_cliente?: string;
  currency: string;
  price_class?: string;
  shc?: string;
  fecha_creacion: Date;
  charge_code?: string;
  create_oper: string;
}

const awbReportDataSchemaDefinition: mongoose.SchemaDefinition<mongoose.AnyObject> =
  {
    _id: { type: mongoose.Schema.Types.ObjectId, auto: true },
    prefijo: { type: String },
    awb: { type: String },
    carrier: { type: String },
    orig: { type: String },
    dest: { type: String },
    codigo_agente: { type: String },
    nombre_agente: { type: String },
    pieces: { type: Number },
    weight: { type: Number },
    gross_weight: { type: Number },
    volume: { type: Number },
    rate: { type: Number },
    flete: { type: Number },
    subtotal: { type: Number },
    iva: { type: Number },
    total: { type: Number },
    tipo_pago: { type: String },
    descripcion: { type: String },
    codigo_cliente: { type: String },
    currency: { type: String },
    price_class: { type: String },
    shc: { type: String },
    fecha_creacion: { type: Date },
    charge_code: { type: String },
    create_oper: { type: String },
  };

const AwbReportDataSchema = new mongoose.Schema(awbReportDataSchemaDefinition, {
  timestamps: true,
});

export const AwbReportData = mongoose.model<IAwbReportData>(
  "AwbReportData",
  AwbReportDataSchema,
);
