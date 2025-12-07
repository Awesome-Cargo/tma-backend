import mongoose, { Schema, Document } from "mongoose";

export interface IReportData extends Document {
  _id: mongoose.Types.ObjectId;
  reportName: string;
  sheets: mongoose.Types.ObjectId[];
  isActive: boolean;
  description: string;
  createdAt: Date;
  updatedAt: Date;
}

const ReportDataSchema: Schema = new Schema<IReportData>(
  {
    _id: { type: Schema.Types.ObjectId, auto: true },
    reportName: { type: String, required: true },
    sheets: [{ type: Schema.Types.ObjectId, ref: "SheetData" }],
    isActive: { type: Boolean, default: true },
    description: { type: String, required: true },
    createdAt: { type: Date, default: Date.now() },
    updatedAt: { type: Date, default: Date.now() },
  },
  {
    timestamps: true,
  }
);

export const ReportData = mongoose.model<IReportData>(
  "ReportData",
  ReportDataSchema
);
