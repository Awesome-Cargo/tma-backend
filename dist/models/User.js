import mongoose, { Schema, Document } from "mongoose";
export var Role;
(function (Role) {
    Role["ADMIN"] = "admin";
    Role["USER"] = "user";
})(Role || (Role = {}));
const UserSchema = new Schema({
    _id: { type: Schema.Types.ObjectId, auto: true },
    name: { type: String, required: true },
    lastname: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    isActive: { type: Boolean, default: true },
    department: {
        type: Schema.Types.ObjectId,
        ref: "Department",
        required: true,
    },
    role: { type: String, enum: Object.values(Role), default: Role.USER },
    reports: [{ type: Schema.Types.ObjectId, ref: "Report" }],
}, {
    timestamps: true,
});
export const User = mongoose.model("User", UserSchema);
//# sourceMappingURL=User.js.map