import { ReportService } from "./report.service.js";
import { CreateReportDto } from "./dto/createReport.dto.js";
import { verifyToken } from "../../utils/jwt-utils.js";
import { UserService } from "../user/user.service.js";
export class ReportController {
    reportService;
    userService;
    constructor() {
        this.reportService = new ReportService();
        this.userService = new UserService();
    }
    async createReport(req, res) {
        const { body } = req;
        const reportData = CreateReportDto(body);
        try {
            const report = await this.reportService.createReport(reportData);
            res.status(201).json({ report });
        }
        catch (error) {
            res.status(400).json({ message: error.message });
        }
    }
    async generateReport(req, res) {
        const { reportId } = req.params;
        if (!reportId) {
            return res.status(400).json({ message: "Report ID is required" });
        }
        try {
            const reportData = await this.reportService.generateReports(reportId);
            res.status(200).json({ data: reportData });
        }
        catch (error) {
            res.status(400).json({ message: error.message });
        }
    }
    async getAvailableFields(_req, res) {
        try {
            const fields = this.reportService.getAvailableFields();
            res.status(200).json({ fields });
        }
        catch (error) {
            res.status(400).json({ message: error.message });
        }
    }
    async getAllReports(_req, res) {
        try {
            const reports = await this.reportService.getAllReports();
            res.status(200).json({ reports });
        }
        catch (error) {
            res.status(400).json({ message: error.message });
        }
    }
    async updateReport(req, res) {
        const { reportId } = req.params;
        const updateData = req.body;
        if (!reportId) {
            return res.status(400).json({ message: "Report ID is required" });
        }
        try {
            const updatedReport = await this.reportService.updateReport(reportId, updateData);
            if (!updatedReport) {
                return res.status(404).json({ message: "Report not found" });
            }
            res.status(200).json({ report: updatedReport });
        }
        catch (error) {
            res.status(400).json({ message: error.message });
        }
    }
    async deleteReport(req, res) {
        const { reportId } = req.params;
        if (!reportId) {
            return res.status(400).json({ message: "Report ID is required" });
        }
        try {
            const deletedReport = await this.reportService.deleteReport(reportId);
            if (!deletedReport) {
                return res.status(404).json({ message: "Report not found" });
            }
            res.status(200).json({ report: deletedReport });
        }
        catch (error) {
            res.status(400).json({ message: error.message });
        }
    }
    async getUserReports(req, res) {
        const token = req.headers.authorization?.split(" ")[1] || "";
        const { isValid, decoded } = verifyToken(token);
        if (!isValid || !decoded) {
            return res.status(401).json({ message: "Invalid token" });
        }
        const userId = decoded.id;
        try {
            const user = await this.userService.getUserById(userId);
            if (!user) {
                return res.status(404).json({ message: "User not found" });
            }
            res.status(200).json({ reports: user.reports });
        }
        catch (error) {
            res.status(400).json({ message: error.message });
        }
    }
}
//# sourceMappingURL=report.controller.js.map