import { Router } from "express";
import { DepartmentController } from "./department.controller.js";
import { validateToken } from "../../utils/validations.js";
const app = Router();
const departmentController = new DepartmentController();
app.get("/", validateToken, departmentController.getDepartments.bind(departmentController));
export { app as DepartmentRouter };
//# sourceMappingURL=department.router.js.map