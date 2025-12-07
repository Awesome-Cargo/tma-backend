import { Department } from "../../models/index.js";
import type { CreateDepartmentDto } from "./dto/createDepartment.dto.js";

export class DepartmentService {
  async getAllDepartments() {
    return await Department.find().populate("reports").lean();
  }

  async getDepartmentById(id: string) {
    return await Department.findById(id).populate("reports").lean();
  }

  async createDepartment(departmentData: CreateDepartmentDto) {
    try {
      const department = new Department(departmentData);
      return await department.save();
    } catch (error) {
      throw error;
    }
  }

  async updateDepartment(
    id: string,
    departmentData: Partial<CreateDepartmentDto>
  ) {
    return await Department.findByIdAndUpdate(id, departmentData, {
      new: true,
    }).populate("reports");
  }

  async deleteDepartment(id: string) {
    return await Department.findByIdAndDelete(id);
  }
}
