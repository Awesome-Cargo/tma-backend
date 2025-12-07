import { User } from "../../models/index.js";
import { verifyPassword } from "../../utils/password-utils.js";
export class UserService {
    async getAllUsers() {
        return await User.find().populate("department").populate("reports").lean();
    }
    async getUserByEmail(email) {
        return await User.findOne({ email })
            .populate("department")
            .populate("reports")
            .lean();
    }
    async getUserById(id) {
        return await User.findById(id)
            .populate("department")
            .populate("reports")
            .lean();
    }
    async createUser(userData) {
        try {
            const user = new User(userData);
            const savedUser = await user.save();
            return await savedUser.populate([
                { path: "department" },
                { path: "reports" },
            ]);
        }
        catch (error) {
            throw error;
        }
    }
    async updateUser(id, updateData) {
        try {
            const updatedUser = await User.findByIdAndUpdate(id, updateData, {
                new: true,
            }).populate([{ path: "department" }, { path: "reports" }]);
            return updatedUser;
        }
        catch (error) {
            throw error;
        }
    }
    async deleteUser(id) {
        try {
            const deletedUser = await User.findByIdAndDelete(id);
            return deletedUser;
        }
        catch (error) {
            throw error;
        }
    }
    async signIn(email, password) {
        const user = await this.getUserByEmail(email);
        if (!user) {
            throw new Error("Wrong credentials");
        }
        const isPasswordValid = await verifyPassword({
            password,
            encrypedPassword: user.password,
        });
        if (!isPasswordValid) {
            throw new Error("Wrong credentials");
        }
        return user;
    }
}
//# sourceMappingURL=user.service.js.map