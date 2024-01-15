import { Router } from "express";
import {
  createUserController,
  deleteUserController,
  listUsersByIdController,
  listUsersController,
  updateUserController,
} from "../Controllers/users.controllers.js";
import { verifyUserId } from "../Middlewares/verifyUserId.middlewares.js";
import { verifyToken } from "../Middlewares/verifyToken.middlewares.js";
import { verifyPermission } from "../Middlewares/verifyPermissions.middleware.js";

export const userRoutes = Router();

userRoutes.get("/", verifyToken, listUsersController);
userRoutes.post("/", createUserController);
userRoutes.post("/register", createUserController);

userRoutes.use("/:userId", verifyToken, verifyPermission, verifyUserId);
userRoutes.get("/:userId", verifyUserId, listUsersByIdController);
userRoutes.patch("/:userId", updateUserController);
userRoutes.delete("/:userId", deleteUserController);
