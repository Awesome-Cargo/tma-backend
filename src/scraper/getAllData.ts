import fs from "fs";
import path from "path";

import { allDataQuery } from "./querys.js";
import fetchCSData from "./scraper.js";
import { getAwbReportData } from "../utils/csv-to-db-service.js";
import { connectToDatabase } from "../utils/db-connection.js";
import { AwbReportData } from "../models/AwbReportData.js";

const DOWNLOAD_DIR = path.resolve(process.cwd(), "downloads");

export const getAllData = async (startDate: string, endDate: string) => {
  let filePath = "";
  try {
    const query = allDataQuery(startDate, endDate);
    await fetchCSData(query);

    const files = fs.readdirSync(DOWNLOAD_DIR);

    if (files.length === 0) {
      throw new Error("No se encontraron archivos descargados");
    }

    const csvFile = files.find((file) => file.endsWith(".csv"));

    if (!csvFile) {
      throw new Error(
        "No se encontró un archivo CSV en la carpeta de descargas",
      );
    }

    filePath = path.join(DOWNLOAD_DIR, csvFile);

    const sortedFiles = files
      .map((fileName) => ({
        fileName,
        modifiedTime: fs.statSync(path.join(DOWNLOAD_DIR, fileName)).mtimeMs,
      }))
      .sort((a, b) => b.modifiedTime - a.modifiedTime);

    if (sortedFiles.length === 0) {
      throw new Error("Error downloading data from CS");
    }

    const latestFile = sortedFiles[0]!.fileName;

    await connectToDatabase();

    await AwbReportData.deleteMany({});
    await getAwbReportData({ fileName: latestFile });

    process.exit(0);
  } catch (error) {
    console.log(error);
  } finally {
    fs.unlinkSync(filePath);
  }
};

getAllData("2025-10-01", "2026-02-27").catch((err) => {
  console.error("Error al obtener los datos:", err);
  process.exit(1);
});
