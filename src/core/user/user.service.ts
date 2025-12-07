import { User } from "../../models/index.js";
import { verifyPassword } from "../../utils/password-utils.js";
import type { createUserDto } from "./dto/createUser.dto.js";

export class UserService {
  async getAllUsers() {
    return await User.find().populate("reports").lean();
  }

  async getUserByEmail(email: string) {
    return await User.findOne({ email }).populate("reports").lean();
  }

  async getUserById(id: string) {
    return await User.findById(id).populate("reports").lean();
  }

  async createUser(userData: createUserDto) {
    try {
      const user = new User(userData);
      const savedUser = await user.save();
      return await savedUser.populate([{ path: "reports" }]);
    } catch (error) {
      throw error;
    }
  }

  async updateUser(id: string, updateData: Partial<createUserDto>) {
    try {
      const updatedUser = await User.findByIdAndUpdate(id, updateData, {
        new: true,
      }).populate([{ path: "reports" }]);
      return updatedUser;
    } catch (error) {
      throw error;
    }
  }

  async deleteUser(id: string) {
    try {
      const deletedUser = await User.findByIdAndDelete(id);
      return deletedUser;
    } catch (error) {
      throw error;
    }
  }

  async signIn(email: string, password: string) {
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
