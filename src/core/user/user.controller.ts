import type { Request, Response } from "express";
import { UserService } from "./user.service.js";
import type { createUserDto } from "./dto/createUser.dto.js";
import { createToken, verifyToken } from "../../utils/jwt-utils.js";
import { encryptPassword } from "../../utils/password-utils.js";

export class UserController {
  userService;
  constructor() {
    this.userService = new UserService();
  }
  async signIn(req: Request, res: Response) {
    const { email, password } = req.body;
    try {
      const user = await this.userService.signIn(email, password);
      const token = createToken({ id: user._id });
      res.status(200).json({ user, token });
    } catch (error) {
      res.status(400).json({ message: (error as Error).message });
    }
  }

  async createUser(req: Request, res: Response) {
    const userData = req.body as createUserDto;
    const password = await encryptPassword("pass123456");
    userData.password = password;
    try {
      const user = await this.userService.createUser(userData);
      res.status(201).json({ user });
    } catch (error) {
      res.status(400).json({ message: (error as Error).message });
    }
  }

  async updateUser(req: Request, res: Response) {
    const userId = req.params.id;
    const updateData = req.body as Partial<createUserDto>;
    if (!userId) {
      return res.status(400).json({ message: "User ID is required" });
    }
    try {
      const updatedUser = await this.userService.updateUser(userId, updateData);
      if (!updatedUser) {
        return res.status(404).json({ message: "User not found" });
      }
      res.status(200).json({ user: updatedUser });
    } catch (error) {
      res.status(400).json({ message: (error as Error).message });
    }
  }

  async deleteUser(req: Request, res: Response) {
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
    } catch (error) {
      res.status(400).json({ message: (error as Error).message });
    }
  }

  async getUser(req: Request, res: Response) {
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
    } catch (error) {
      res.status(400).json({ message: (error as Error).message });
    }
  }

  async getUsers(_req: Request, res: Response) {
    try {
      const users = await this.userService.getAllUsers();
      res.status(200).json({ users });
    } catch (error) {
      res.status(400).json({ message: (error as Error).message });
    }
  }
}
