import { Department } from "../../models/index.js";
export class DepartmentService {
    async getAllDepartments() {
        return await Department.find().populate("reports").lean();
    }
    async getDepartmentById(id) {
        return await Department.findById(id).populate("reports").lean();
    }
    async createDepartment(departmentData) {
        try {
            const department = new Department(departmentData);
            return await department.save();
        }
        catch (error) {
            throw error;
        }
    }
    async updateDepartment(id, departmentData) {
        return await Department.findByIdAndUpdate(id, departmentData, {
            new: true,
        }).populate("reports");
    }
    async deleteDepartment(id) {
        return await Department.findByIdAndDelete(id);
    }
}
//# sourceMappingURL=department.service.js.map