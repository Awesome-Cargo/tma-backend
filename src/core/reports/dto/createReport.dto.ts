import type { InputReportData } from "../types/types.interface.js";

export const CreateReportDto = (data: any): InputReportData => {
  return {
    reportName: data.reportName,
    sheets: data.sheets,
    description: data.description,
  };
};
