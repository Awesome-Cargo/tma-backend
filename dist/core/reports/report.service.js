import { AwbReportData } from "../../models/AwbReportData.js";
import { Report } from "../../models/index.js";
export class ReportService {
    async getAllReports() {
        return await Report.find().lean();
    }
    async createReport(data) {
        const newReport = new Report(data);
        return await newReport.save();
    }
    async getReportById(id) {
        return await Report.findById(id).lean();
    }
    async updateReport(id, data) {
        return await Report.findByIdAndUpdate(id, data, { new: true });
    }
    async deleteReport(id) {
        return await Report.findByIdAndDelete(id);
    }
    async generateReports(id) {
        const report = await this.getReportById(id);
        if (!report) {
            throw new Error("Report not found");
        }
        const projection = report.fields.reduce((acc, field) => {
            acc[field] = 1;
            return acc;
        }, { _id: 0 });
        return await AwbReportData.find({}, projection);
    }
    getAvailableFields() {
        const allFields = Object.keys(AwbReportData.schema.paths);
        return allFields.filter((f) => !["_id", "__v", "createdAt", "updatedAt"].includes(f));
    }
}
//# sourceMappingURL=report.service.js.map