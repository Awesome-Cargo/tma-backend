import { UserService } from "./user.service.js";
import { createToken, verifyToken } from "../../utils/jwt-utils.js";
import { encryptPassword } from "../../utils/password-utils.js";
export class UserController {
    userService;
    constructor() {
        this.userService = new UserService();
    }
    async signIn(req, res) {
        const { email, password } = req.body;
        try {
            const user = await this.userService.signIn(email, password);
            const token = createToken({ id: user._id });
            res.status(200).json({ user, token });
        }
        catch (error) {
            res.status(400).json({ message: error.message });
        }
    }
    async createUser(req, res) {
        const userData = req.body;
        const password = await encryptPassword("pass123456");
        userData.password = password;
        try {
            const user = await this.userService.createUser(userData);
            res.status(201).json({ user });
        }
        catch (error) {
            res.status(400).json({ message: error.message });
        }
    }
    async updateUser(req, res) {
        const userId = req.params.id;
        const updateData = req.body;
        if (!userId) {
            return res.status(400).json({ message: "User ID is required" });
        }
        try {
            const updatedUser = await this.userService.updateUser(userId, updateData);
            if (!updatedUser) {
                return res.status(404).json({ message: "User not found" });
            }
            res.status(200).json({ user: updatedUser });
        }
        catch (error) {
            res.status(400).json({ message: error.message });
        }
    }
    async deleteUser(req, res) {
        const userId = req.params.id;
        if (!userId) {
            return res.status(400).json({ message: "User ID is required" });
        }
        try {
            const deletedUser = await this.userService.deleteUser(userId);
            if (!deletedUser) {
                return res.status(404).json({ message: "User not found" });
            }
            res.status(200).json({ user: deletedUser });
        }
        catch (error) {
            res.status(400).json({ message: error.message });
        }
    }
    async getUser(req, res) {
        const token = req.headers.authorization?.split(" ")[1] || "";
        const { isValid, decoded } = verifyToken(token);
        if (!isValid || !decoded) {
            return res.status(401).json({ message: "Invalid token" });
        }
        const userId = decoded.id;
        try {
            const user = await this.userService.getUserById(userId);
            if (!user) {
                return res.status(404).json({ message: "User not found" });
            }
            const token = createToken({ id: user._id });
            res.status(200).json({ user, token });
        }
        catch (error) {
            res.status(400).json({ message: error.message });
        }
    }
    async getUsers(_req, res) {
        try {
            const users = await this.userService.getAllUsers();
            res.status(200).json({ users });
        }
        catch (error) {
            res.status(400).json({ message: error.message });
        }
    }
}
//# sourceMappingURL=user.controller.js.map