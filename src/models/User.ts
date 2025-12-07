import mongoose, { Schema, Document } from "mongoose";

export enum Role {
  ADMIN = "admin",
  USER = "user",
}

export interface IUser extends Document {
  _id: mongoose.Types.ObjectId;
  name: string;
  lastname: string;
  email: string;
  password: string;
  isActive: boolean;
  role: Role;
  reports: mongoose.Types.ObjectId[];
}

const UserSchema: Schema = new Schema<IUser>(
  {
    _id: { type: Schema.Types.ObjectId, auto: true },
    name: { type: String, required: true },
    lastname: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    isActive: { type: Boolean, default: true },
    role: { type: String, enum: Object.values(Role), default: Role.USER },
    reports: [{ type: Schema.Types.ObjectId, ref: "ReportData" }],
  },
  {
    timestamps: true,
  }
);

export const User = mongoose.model<IUser>("User", UserSchema);
