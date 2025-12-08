import { Router } from "express";
import { ReportController } from "./report.controller.js";
import { validateToken } from "../../utils/validations.js";

const app = Router();
const reportController = new ReportController();

app.post(
  "/create",
  // validateToken,
  reportController.createReport.bind(reportController)
);
app.get(
  "/generate/:reportId",
  // validateToken,
  reportController.generateReport.bind(reportController)
);
app.get(
  "/fields",
  // validateToken,
  reportController.getAvailableFields.bind(reportController)
);
app.get(
  "/all-reports",
  // validateToken,
  reportController.getAllReports.bind(reportController)
);
app.put(
  "/update/:reportId",
  validateToken,
  reportController.updateReport.bind(reportController)
);
app.delete(
  "/delete/:reportId",
  validateToken,
  reportController.deleteReport.bind(reportController)
);
app.get(
  "/my-reports",
  validateToken,
  reportController.getUserReports.bind(reportController)
);

app.get("/all-data", reportController.getAllData.bind(reportController));

export { app as ReportRouter };
