import mongoose, { Document } from "mongoose";
export declare enum Role {
    ADMIN = "admin",
    USER = "user"
}
export interface IUser extends Document {
    _id: mongoose.Types.ObjectId;
    name: string;
    lastname: string;
    email: string;
    password: string;
    isActive: boolean;
    department: mongoose.Types.ObjectId;
    role: Role;
    reports: mongoose.Types.ObjectId[];
}
export declare const User: mongoose.Model<IUser, {}, {}, {}, mongoose.Document<unknown, {}, IUser, {}, {}> & IUser & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
}, any>;
//# sourceMappingURL=User.d.ts.map