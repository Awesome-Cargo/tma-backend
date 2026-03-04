import fs from "fs";
import path from "path";

import { fsuDataQuery } from "./querys.js";
import fetchCSData from "./scraper.js";
import { getFsuReportData } from "../utils/csv-to-db-service.js";
import { connectToDatabase } from "../utils/db-connection.js";
import { FsuReportData } from "../models/FsuReportData.js";

const DOWNLOAD_DIR = path.resolve(process.cwd(), "downloads");
const REPORT_EXTENSIONS = new Set([".csv", ".txt"]);

type DownloadedReportFile = {
  fileName: string;
  fullPath: string;
  modifiedTime: number;
};

function listDownloadedReportFiles(): DownloadedReportFile[] {
  const entries = fs.readdirSync(DOWNLOAD_DIR, { withFileTypes: true });

  return entries
    .filter((entry) => entry.isFile())
    .map((entry) => {
      const fullPath = path.join(DOWNLOAD_DIR, entry.name);
      const ext = path.extname(entry.name).toLowerCase();
      if (!REPORT_EXTENSIONS.has(ext)) return null;

      return {
        fileName: entry.name,
        fullPath,
        modifiedTime: fs.statSync(fullPath).mtimeMs,
      };
    })
    .filter((file): file is DownloadedReportFile => file !== null);
}

function escapeCsvCell(value: string): string {
  const sanitized = value.replace(/\r/g, "");
  if (!/[",\n]/.test(sanitized)) return sanitized;
  return `"${sanitized.replace(/"/g, '""')}"`;
}

function convertTxtToCsv(txtPath: string): string {
  const csvPath = txtPath.replace(/\.txt$/i, ".csv");
  const raw = fs.readFileSync(txtPath, "utf8");
  const lines = raw
    .split(/\r?\n/)
    .map((line) => line.trimEnd())
    .filter((line) => line.length > 0);

  if (lines.length === 0) {
    throw new Error(`El TXT descargado está vacío: ${path.basename(txtPath)}`);
  }

  const csvContent = lines
    .map((line) => line.split("\t").map(escapeCsvCell).join(","))
    .join("\n");

  fs.writeFileSync(csvPath, csvContent, "utf8");
  return csvPath;
}

export const getFsuData = async (startDate: string, endDate: string) => {
  let filePath = "";
  try {
    const filesBefore = listDownloadedReportFiles();
    const filesByNameBefore = new Map(
      filesBefore.map((file) => [file.fileName, file.modifiedTime]),
    );

    const query = fsuDataQuery(startDate, endDate);
    await fetchCSData(query);

    const filesAfter = listDownloadedReportFiles();
    if (filesAfter.length === 0) {
      throw new Error("No se encontraron archivos descargados");
    }

    const recentFiles = filesAfter
      .filter((file) => {
        const previousMtime = filesByNameBefore.get(file.fileName);
        return previousMtime === undefined || file.modifiedTime > previousMtime;
      })
      .sort((a, b) => b.modifiedTime - a.modifiedTime);

    const fallbackLatest = [...filesAfter].sort(
      (a, b) => b.modifiedTime - a.modifiedTime,
    )[0];
    const selectedFile = recentFiles[0] ?? fallbackLatest ?? null;
    if (!selectedFile) {
      throw new Error("Error downloading data from CS");
    }

    const selectedExt = path.extname(selectedFile.fullPath).toLowerCase();
    filePath =
      selectedExt === ".txt"
        ? convertTxtToCsv(selectedFile.fullPath)
        : selectedFile.fullPath;

    const latestFile = path.basename(filePath);

    await connectToDatabase();
    await FsuReportData.deleteMany({});
    await getFsuReportData({ fileName: latestFile });

    process.exit(0);
  } catch (error) {
    console.log(error);
  } finally {
    if (filePath && fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
  }
};

const startDate = process.env.SCRAPER_START_DATE ?? "2025-10-01";
const endDate = process.env.SCRAPER_END_DATE ?? "2026-02-27";

getFsuData(startDate, endDate).catch((err) => {
  console.error("Error al obtener datos FSU:", err);
  process.exit(1);
});

