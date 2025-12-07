import mongoose from "mongoose";
import { Schema } from "mongoose";

export interface IFsuReportData {
  _id: mongoose.Types.ObjectId;
  awb: string;
  oper: string;
  time_stamp: Date;
  status: string;
  issue_code: string;
  flight_number?: string;
  flight_date?: Date;
  orig: string;
  dest: string;
}

const FsuReportDataSchema = new Schema<IFsuReportData>({
  _id: { type: Schema.Types.ObjectId, auto: true },
  awb: { type: String, required: true },
  oper: { type: String, required: true },
  time_stamp: { type: Date, required: true },
  status: { type: String },
  issue_code: { type: String },
  flight_number: { type: String },
  flight_date: { type: Date },
  orig: { type: String },
  dest: { type: String },
});

export const FsuReportData = mongoose.model<IFsuReportData>(
  "FsuReportData",
  FsuReportDataSchema
);
