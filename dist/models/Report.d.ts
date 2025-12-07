import mongoose, { Document } from "mongoose";
export interface IReport extends Document {
    _id: mongoose.Types.ObjectId;
    name: string;
    isActive: boolean;
    description: string;
    fields: string[];
}
export declare const Report: mongoose.Model<IReport, {}, {}, {}, mongoose.Document<unknown, {}, IReport, {}, {}> & IReport & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
}, any>;
//# sourceMappingURL=Report.d.ts.map