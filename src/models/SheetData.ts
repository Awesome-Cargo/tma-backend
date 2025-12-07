import mongoose, { Document, Schema } from "mongoose";

export interface ISheetData extends Document {
  _id: mongoose.Types.ObjectId;
  sheetName: string;
  fields: string[];
  collectionName: string;
  filterCriteria: Record<string, any>;
  sortedBy?: Record<string, 1 | -1>;
}

const SheetDataSchema: Schema = new Schema<ISheetData>(
  {
    _id: { type: Schema.Types.ObjectId, auto: true },
    sheetName: { type: String, required: true },
    fields: [{ type: String, required: true }],
    collectionName: { type: String, required: true },
    filterCriteria: { type: mongoose.Schema.Types.Mixed },
    sortedBy: { type: mongoose.Schema.Types.Mixed },
  },
  {
    timestamps: true,
  }
);

export const SheetData = mongoose.model<ISheetData>(
  "SheetData",
  SheetDataSchema
);
