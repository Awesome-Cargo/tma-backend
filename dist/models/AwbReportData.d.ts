import mongoose from "mongoose";
export interface IAwbReportData {
    _id: mongoose.Types.ObjectId;
    prefijo: string;
    awb: string;
    carrier: string;
    orig: string;
    dest: string;
    codigo_agente: string;
    pieces: number;
    weight: number;
    gross_weight: number;
    volume: number;
    rate: number;
    flete: number;
    subtotal: number;
    iva: number;
    total: number;
    tipo_pago: string;
    dim_pieces: number;
    dim_weight: number;
    dim_length: number;
    dim_width: number;
    dim_height: number;
    dim_volume: number;
    descripcion: string;
    codigo_cliente: string;
    consignee: string;
    currency: string;
    product: string;
    price_class: string;
    fecha_creacion: Date;
    charges: string;
}
export declare const AwbReportData: mongoose.Model<IAwbReportData, {}, {}, {}, mongoose.Document<unknown, {}, IAwbReportData, {}, {}> & IAwbReportData & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
}, any>;
//# sourceMappingURL=AwbReportData.d.ts.map