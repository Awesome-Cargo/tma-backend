import mongoose, { Schema, Document } from "mongoose";

export interface IReport extends Document {
  _id: mongoose.Types.ObjectId;
  name: string;
  isActive: boolean;
  description: string;
  fields: string[];
}

const ReportSchema: Schema = new Schema<IReport>(
  {
    _id: { type: Schema.Types.ObjectId, auto: true },
    name: { type: String, required: true, unique: true },
    isActive: { type: Boolean, default: true },
    description: { type: String, required: true },
    fields: [{ type: String, required: true }],
  },
  {
    timestamps: true,
  }
);

export const Report = mongoose.model<IReport>("Report", ReportSchema);
