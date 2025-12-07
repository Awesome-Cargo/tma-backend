import type { Request, Response } from "express";
import { DepartmentService } from "./department.service.js";
export declare class DepartmentController {
    departmentService: DepartmentService;
    constructor();
    getDepartments(_req: Request, res: Response): Promise<void>;
}
//# sourceMappingURL=department.controller.d.ts.map