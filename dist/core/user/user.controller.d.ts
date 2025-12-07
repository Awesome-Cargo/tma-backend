import type { Request, Response } from "express";
import { UserService } from "./user.service.js";
export declare class UserController {
    userService: UserService;
    constructor();
    signIn(req: Request, res: Response): Promise<void>;
    createUser(req: Request, res: Response): Promise<void>;
    updateUser(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    deleteUser(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    getUser(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    getUsers(_req: Request, res: Response): Promise<void>;
}
//# sourceMappingURL=user.controller.d.ts.map