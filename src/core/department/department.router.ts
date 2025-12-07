import { Router } from "express";
import { DepartmentController } from "./department.controller.js";
import { validateToken } from "../../utils/validations.js";

const app = Router();
const departmentController = new DepartmentController();

app.get(
  "/",
  validateToken,
  departmentController.getDepartments.bind(departmentController)
);
// app.get("/:id", departmentController.departmentService.getDepartmentById.bind(departmentController.departmentService));
// app.post("/", departmentController.departmentService.createDepartment.bind(departmentController.departmentService));
// app.put("/:id", departmentController.departmentService.updateDepartment.bind(departmentController.departmentService));
// app.delete("/:id", departmentController.departmentService.deleteDepartment.bind(departmentController.departmentService));

export { app as DepartmentRouter };
