import express, {} from "express";
import morgan from "morgan";
import cors from "cors";
const app = express();
app.set("port", process.env.PORT || 3000);
app.use(express.json());
app.use(morgan("dev"));
app.use(cors());
app.use("/api/users", (await import("./core/user/user.router.js")).UserRouter);
app.use("/api/departments", (await import("./core/department/department.router.js")).DepartmentRouter);
app.use("/api/reports", (await import("./core/reports/report.router.js")).ReportRouter);
export default app;
//# sourceMappingURL=app.js.map