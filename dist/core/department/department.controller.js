import { DepartmentService } from "./department.service.js";
export class DepartmentController {
    departmentService;
    constructor() {
        this.departmentService = new DepartmentService();
    }
    async getDepartments(_req, res) {
        try {
            const departments = await this.departmentService.getAllDepartments();
            res.status(200).json({ departments });
        }
        catch (error) {
            res.status(400).json({ message: error.message });
        }
    }
}
//# sourceMappingURL=department.controller.js.map