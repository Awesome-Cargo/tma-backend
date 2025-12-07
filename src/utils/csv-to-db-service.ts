import path from "path";
import { fsuStatusExcelDto, reportExcelDto } from "./extract-csv-data.js";
import Exceljs from "exceljs";
import { fileURLToPath } from "url";
import { AwbReportData } from "../models/AwbReportData.js";
import { FsuReportData } from "../models/FsuReportData.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const getAwbReportData = async ({ fileName }: { fileName: string }) => {
  const filePath = path.resolve(__dirname, `../downloads/${fileName}.csv`);

  const workbook = new Exceljs.Workbook();
  const worksheet = await workbook.csv.readFile(filePath);

  const rowStartIndex = 2;
  const numberOfRows = worksheet.rowCount - 1;

  const rows = worksheet.getRows(rowStartIndex, numberOfRows) ?? [];
  const awbReportData = reportExcelDto(rows);

  const dictFlights = [
    ...new Map(awbReportData.map((item) => [item.awb, item])).values(),
  ];

  await AwbReportData.insertMany(dictFlights);

  console.log("Data imported successfully");
  return;
};

export const getFsuReportData = async ({ fileName }: { fileName: string }) => {
  const filePath = path.resolve(__dirname, `../downloads/${fileName}.csv`);

  const workbook = new Exceljs.Workbook();
  const worksheet = await workbook.csv.readFile(filePath);

  const rowStartIndex = 2;
  const numberOfRows = worksheet.rowCount - 1;

  const rows = worksheet.getRows(rowStartIndex, numberOfRows) ?? [];
  const fsuReportData = fsuStatusExcelDto(rows);

  await FsuReportData.insertMany(fsuReportData);

  console.log("Data imported successfully");
  return;
};
