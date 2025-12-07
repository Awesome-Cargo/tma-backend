import mongoose, { Schema, Document } from "mongoose";
const DepartmentSchema = new Schema({
    _id: { type: Schema.Types.ObjectId, auto: true },
    name: { type: String, required: true, unique: true },
    isActive: { type: Boolean, default: true },
    reports: [{ type: Schema.Types.ObjectId, ref: "Report" }],
}, {
    timestamps: true,
});
export const Department = mongoose.model("Department", DepartmentSchema);
//# sourceMappingURL=Department.js.map