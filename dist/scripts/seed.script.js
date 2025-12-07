import { DepartmentService } from "../core/department/department.service.js";
import { UserService } from "../core/user/user.service.js";
import { Role } from "../models/User.js";
import { connectToDatabase } from "../utils/db-connection.js";
import { encryptPassword } from "../utils/password-utils.js";
async function seed() {
    try {
        console.log("Starting seeding...");
        const departmentService = new DepartmentService();
        const department = await departmentService.createDepartment({
            name: "T.I.",
        });
        const userService = new UserService();
        const password = await encryptPassword("pass123456");
        await userService.createUser({
            name: "David",
            lastname: "Farelas",
            email: "david.farelas.dev@gmail.com",
            password,
            department: department._id.toString(),
            role: Role.ADMIN,
        });
        console.log("Seeding completed successfully.");
    }
    catch (error) {
        throw error;
    }
}
connectToDatabase().then(() => seed().catch((e) => console.log("Something went wrong: ", e)));
//# sourceMappingURL=seed.script.js.map