import type { Request, Response } from "express";
import { ReportService } from "./report.service.js";
import { UserService } from "../user/user.service.js";
export declare class ReportController {
    reportService: ReportService;
    userService: UserService;
    constructor();
    createReport(req: Request, res: Response): Promise<void>;
    generateReport(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    getAvailableFields(_req: Request, res: Response): Promise<void>;
    getAllReports(_req: Request, res: Response): Promise<void>;
    updateReport(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    deleteReport(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    getUserReports(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
}
//# sourceMappingURL=report.controller.d.ts.map