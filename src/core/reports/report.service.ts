import mongoose, { isValidObjectId } from "mongoose";
import {
  AwbReportData,
  FsuReportData,
  IAwbReportData,
  IFsuReportData,
  ReportData,
  SheetData,
  type ISheetData,
} from "../../models/index.js";
import type { InputReportData } from "./types/types.interface.js";

export class ReportService {
  async getAllReports() {
    return await ReportData.find().populate("sheets").lean();
  }

  async createReport(data: InputReportData) {
    const sheetReportData = data.sheets.map((sheet) => new SheetData(sheet));
    await SheetData.insertMany(sheetReportData);

    const sheets = sheetReportData.map((sheet) => sheet._id);
    const newReport = new ReportData(data);
    newReport.sheets = sheets;

    await newReport.save();

    return this.getReportById(newReport._id.toString());
  }

  async getReportById(id: string) {
    return await ReportData.findById(id).populate("sheets").lean();
  }

  async updateReport(
    id: string,
    data: { reportName?: string; description?: string; sheets: ISheetData[] }
  ) {
    try {
      const report = await ReportData.findById(id);
      if (!report) throw new Error("Report not found");

      if (data.reportName !== undefined) report.reportName = data.reportName;
      if (data.description !== undefined) report.description = data.description;

      // IDs actuales en el reporte
      const currentSheetIds = report.sheets.map((s) => s.toString());

      // IDs enviados desde el frontend
      const incomingSheetIds = data.sheets
        .filter((s) => isValidObjectId(s._id))
        .map((s) => s._id.toString());

      /** ----------------------------------
       *   1. ELIMINAR SHEETS QUE YA NO VIENEN
       *  ---------------------------------- */
      const sheetsToRemove = currentSheetIds.filter(
        (id) => !incomingSheetIds.includes(id)
      );

      for (const sheetId of sheetsToRemove) {
        // Eliminar referencia en el reporte
        report.sheets = report.sheets.filter((s) => s.toString() !== sheetId);

        // Opcional: eliminar el SheetData de la colección
        await SheetData.findByIdAndDelete(sheetId);
      }

      /** ----------------------------------
       *   2. ACTUALIZAR SHEETS EXISTENTES
       *  ---------------------------------- */
      const sheetsToUpdate = data.sheets.filter((s) => isValidObjectId(s._id));

      for (const sheet of sheetsToUpdate) {
        await SheetData.findByIdAndUpdate(sheet._id, sheet, { new: true });
      }

      /** ----------------------------------
       *   3. AGREGAR NUEVOS SHEETS
       *  ---------------------------------- */
      const sheetsToAdd = data.sheets.filter((s) => !isValidObjectId(s._id));

      for (const newSheet of sheetsToAdd) {
        const created = await SheetData.create(newSheet);
        report.sheets.push(created._id);
      }

      await report.save();

      return this.getReportById(id);
    } catch (error) {
      throw new Error("Failed to update report: " + (error as Error).message);
    }
  }

  async deleteReport(id: string) {
    return await ReportData.findByIdAndDelete(id);
  }

  async generateReports(id: string) {
    const report = await this.getReportById(id);
    if (!report) {
      throw new Error("Report not found");
    }

    let response = [];

    for (const sheet of report.sheets) {
      const sheetData = sheet as unknown as ISheetData;
      const projection = sheetData.fields.reduce<Record<string, number>>(
        (acc, field) => {
          acc[field] = 1;
          return acc;
        },
        { _id: 0 }
      );

      const query = sheetData.filterCriteria || {};
      const sort = sheetData.sortedBy || {};

      const collection = this.getCollectionByName(sheetData.collectionName);

      const data = await collection
        .find(query, { projection })
        .sort(sort)
        .toArray();
      response.push({ sheetName: sheetData.sheetName, data });
    }

    return response;
  }

  getCollectionByName(name: string) {
    return mongoose.connection.collection(name);
  }

  getAvailableFields() {
    const collections = ["AwbReportData", "FsuReportData"];
    const allFields: Record<string, string[]> = {};

    collections.forEach((collectionName) => {
      allFields[collectionName] =
        this.getAllFieldsByCollectionName(collectionName);
    });

    return allFields;
  }

  getAllFieldsByCollectionName(collectionName: string) {
    let schemaPaths: string[] = [];
    switch (collectionName) {
      case "AwbReportData":
        schemaPaths = Object.keys(AwbReportData.schema.paths);
        break;
      case "FsuReportData":
        schemaPaths = Object.keys(FsuReportData.schema.paths);
        break;
      default:
        throw new Error("Unknown collection name");
    }
    return schemaPaths.filter(
      (f) => !["_id", "__v", "createdAt", "updatedAt"].includes(f)
    );
  }

  getAllData(
    startDate?: string,
    endDate?: string
  ): Promise<{
    awbReportData: IAwbReportData[];
    fsuReportData: IFsuReportData[];
  }> {
    const query: Record<string, any> = {};
    if (startDate || endDate) {
      query.createdAt = {};
      if (startDate) {
        query.createdAt.$gte = new Date(startDate);
      }
      if (endDate) {
        query.createdAt.$lte = new Date(endDate);
      }
    }
    return Promise.all([
      AwbReportData.find(query).lean(),
      FsuReportData.find(query).lean(),
    ]).then(([awbReportData, fsuReportData]) => ({
      awbReportData,
      fsuReportData,
    }));
  }
}
