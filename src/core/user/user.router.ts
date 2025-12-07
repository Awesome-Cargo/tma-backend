import { Router } from "express";
import { UserController } from "./user.controller.js";
import { validateToken } from "../../utils/validations.js";

const app = Router();
const userController = new UserController();

app.get("/", validateToken, userController.getUsers.bind(userController));
app.post("/signin", userController.signIn.bind(userController));
app.post("/signup", userController.createUser.bind(userController));
app.get("/me", validateToken, userController.getUser.bind(userController));
app.post(
  "/create",
  validateToken,
  userController.createUser.bind(userController)
);
app.put(
  "/update/:id",
  validateToken,
  userController.updateUser.bind(userController)
);
app.delete(
  "/delete/:id",
  validateToken,
  userController.deleteUser.bind(userController)
);

export { app as UserRouter };
