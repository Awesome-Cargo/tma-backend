import type { Role } from "../../../models/User.js";
export interface createUserDto {
    name: string;
    lastname: string;
    email: string;
    password: string;
    department: string;
    role?: Role;
}
//# sourceMappingURL=createUser.dto.d.ts.map