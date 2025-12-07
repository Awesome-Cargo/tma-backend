import type { createUserDto } from "./dto/createUser.dto.js";
export declare class UserService {
    getAllUsers(): Promise<(import("mongoose").FlattenMaps<import("../../models/User.js").IUser> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    })[]>;
    getUserByEmail(email: string): Promise<(import("mongoose").FlattenMaps<import("../../models/User.js").IUser> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }) | null>;
    getUserById(id: string): Promise<(import("mongoose").FlattenMaps<import("../../models/User.js").IUser> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }) | null>;
    createUser(userData: createUserDto): Promise<Omit<import("mongoose").Document<unknown, {}, import("../../models/User.js").IUser, {}, {}> & import("../../models/User.js").IUser & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }, never>>;
    updateUser(id: string, updateData: Partial<createUserDto>): Promise<(import("mongoose").Document<unknown, {}, import("../../models/User.js").IUser, {}, {}> & import("../../models/User.js").IUser & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }) | null>;
    deleteUser(id: string): Promise<(import("mongoose").Document<unknown, {}, import("../../models/User.js").IUser, {}, {}> & import("../../models/User.js").IUser & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }) | null>;
    signIn(email: string, password: string): Promise<import("mongoose").FlattenMaps<import("../../models/User.js").IUser> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }>;
}
//# sourceMappingURL=user.service.d.ts.map