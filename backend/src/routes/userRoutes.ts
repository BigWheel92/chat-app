import express from "express";

import { validateSignup } from "../middleware/validation/userValidation";
import UserController from "../controllers/userController";

const userRouter = express.Router();
userRouter.post("/signup", validateSignup, UserController.signup);

export default userRouter;
