import mongoose, { Schema, Document } from "mongoose";

export interface IDepartment extends Document {
  _id: mongoose.Types.ObjectId;
  name: string;
  isActive: boolean;
  reports: mongoose.Types.ObjectId[];
}

const DepartmentSchema: Schema = new Schema<IDepartment>(
  {
    _id: { type: Schema.Types.ObjectId, auto: true },
    name: { type: String, required: true, unique: true },
    isActive: { type: Boolean, default: true },
    reports: [{ type: Schema.Types.ObjectId, ref: "Report" }],
  },
  {
    timestamps: true,
  }
);

export const Department = mongoose.model<IDepartment>(
  "Department",
  DepartmentSchema
);
