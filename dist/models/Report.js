import mongoose, { Schema, Document } from "mongoose";
const ReportSchema = new Schema({
    _id: { type: Schema.Types.ObjectId, auto: true },
    name: { type: String, required: true, unique: true },
    isActive: { type: Boolean, default: true },
    description: { type: String, required: true },
    fields: [{ type: String, required: true }],
}, {
    timestamps: true,
});
export const Report = mongoose.model("Report", ReportSchema);
//# sourceMappingURL=Report.js.map