import express from "express";

import UserValidation from "../middleware/validation/userValidation";
import UserController from "../controllers/userController";

const userRouter = express.Router();
userRouter.post(
  "/signup",
  UserValidation.validateSignup,
  UserController.signup
);
userRouter.post("/login", UserValidation.validateLogin, UserController.login);

export default userRouter;
