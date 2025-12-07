export interface InputReportData {
  reportName: string;
  sheets: InputSheetData[];
  description: string;
}

export interface InputSheetData {
  id?: string;
  sheetName: string;
  fields: string[];
  collectionName: string;
  filterCriteria: Record<string, any>;
  sortedBy?: Record<string, 1 | -1>;
}
