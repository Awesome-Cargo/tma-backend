import { Row } from "exceljs";
import { IAwbReportData } from "../models/AwbReportData.js";
import { IFsuReportData } from "../models/FsuReportData.js";

export const getCellValue = (row: Row, cellindex: number) => {
  const cell = row.getCell(cellindex);

  return cell.value ? cell.value.toString() : "";
};

type IReportExcel = Omit<IAwbReportData, "_id">;
type IFsuStatusExcel = Omit<IFsuReportData, "_id">;

export const reportExcelDto = (rows: Row[]): IReportExcel[] => {
  return rows.map((row): IReportExcel => {
    return {
      fecha_creacion: new Date(getCellValue(row, 2)),
      prefijo: getCellValue(row, 3).padStart(3, "0"),
      carrier: getCellValue(row, 4),
      awb: getCellValue(row, 5).padStart(8, "0"),
      orig: getCellValue(row, 6),
      dest: getCellValue(row, 7),
      codigo_agente: getCellValue(row, 8),
      nombre_agente: getCellValue(row, 9),
      pieces: parseInt(getCellValue(row, 10) || "0"),
      weight: parseFloat(getCellValue(row, 11) || "0"),
      gross_weight: parseFloat(getCellValue(row, 12) || "0"),
      volume: parseFloat(getCellValue(row, 13) || "0"),
      rate: parseFloat(getCellValue(row, 14) || "0"),
      flete: parseFloat(getCellValue(row, 15) || "0"),
      subtotal: parseFloat(getCellValue(row, 16) || "0"),
      iva: parseFloat(getCellValue(row, 17) || "0"),
      total: parseFloat(getCellValue(row, 18) || "0"),
      codigo_cliente: getCellValue(row, 19),
      currency: getCellValue(row, 20),
      price_class: getCellValue(row, 21),
      shc: getCellValue(row, 22),
      charge_code: getCellValue(row, 23),
      tipo_pago: getCellValue(row, 24),
      descripcion: getCellValue(row, 25),
      create_oper: getCellValue(row, 26),
    };
  });
};

export const fsuStatusExcelDto = (rows: Row[]): IFsuStatusExcel[] => {
  return rows.map((row): IFsuStatusExcel => {
    let flight_date: any = getCellValue(row, 7);
    if (flight_date) {
      flight_date = new Date(flight_date);
    }
    return {
      awb: getCellValue(row, 1).padStart(8, "0"),
      oper: getCellValue(row, 2),
      time_stamp: new Date(getCellValue(row, 3)),
      status: getCellValue(row, 4),
      issue_code: getCellValue(row, 5),
      flight_number: getCellValue(row, 6),
      flight_date,
      orig: getCellValue(row, 8),
      dest: getCellValue(row, 9),
    };
  });
};
