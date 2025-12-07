import type { CreateDepartmentDto } from "./dto/createDepartment.dto.js";
export declare class DepartmentService {
    getAllDepartments(): Promise<(import("mongoose").FlattenMaps<import("../../models/Department.js").IDepartment> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    })[]>;
    getDepartmentById(id: string): Promise<(import("mongoose").FlattenMaps<import("../../models/Department.js").IDepartment> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }) | null>;
    createDepartment(departmentData: CreateDepartmentDto): Promise<import("mongoose").Document<unknown, {}, import("../../models/Department.js").IDepartment, {}, {}> & import("../../models/Department.js").IDepartment & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }>;
    updateDepartment(id: string, departmentData: Partial<CreateDepartmentDto>): Promise<(import("mongoose").Document<unknown, {}, import("../../models/Department.js").IDepartment, {}, {}> & import("../../models/Department.js").IDepartment & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }) | null>;
    deleteDepartment(id: string): Promise<(import("mongoose").Document<unknown, {}, import("../../models/Department.js").IDepartment, {}, {}> & import("../../models/Department.js").IDepartment & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }) | null>;
}
//# sourceMappingURL=department.service.d.ts.map