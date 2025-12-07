export declare class ReportService {
    getAllReports(): Promise<(import("mongoose").FlattenMaps<import("../../models/Report.js").IReport> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    })[]>;
    createReport(data: {
        name: string;
        description: string;
        fields: string[];
    }): Promise<import("mongoose").Document<unknown, {}, import("../../models/Report.js").IReport, {}, {}> & import("../../models/Report.js").IReport & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }>;
    getReportById(id: string): Promise<(import("mongoose").FlattenMaps<import("../../models/Report.js").IReport> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }) | null>;
    updateReport(id: string, data: {
        name?: string;
        description?: string;
        fields?: string[];
    }): Promise<(import("mongoose").Document<unknown, {}, import("../../models/Report.js").IReport, {}, {}> & import("../../models/Report.js").IReport & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }) | null>;
    deleteReport(id: string): Promise<(import("mongoose").Document<unknown, {}, import("../../models/Report.js").IReport, {}, {}> & import("../../models/Report.js").IReport & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }) | null>;
    generateReports(id: string): Promise<(import("mongoose").Document<unknown, {}, import("../../models/AwbReportData.js").IAwbReportData, {}, {}> & import("../../models/AwbReportData.js").IAwbReportData & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    })[]>;
    getAvailableFields(): string[];
}
//# sourceMappingURL=report.service.d.ts.map