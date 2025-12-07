import mongoose, { Document } from "mongoose";
export interface IDepartment extends Document {
    _id: mongoose.Types.ObjectId;
    name: string;
    isActive: boolean;
    reports: mongoose.Types.ObjectId[];
}
export declare const Department: mongoose.Model<IDepartment, {}, {}, {}, mongoose.Document<unknown, {}, IDepartment, {}, {}> & IDepartment & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
}, any>;
//# sourceMappingURL=Department.d.ts.map