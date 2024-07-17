import { Request, Response } from "express";

import { UserModelHelper } from "../db/helpers/userHelper";
import Messages from "../Messages";

import "express-async-errors";
import { HttpError } from "../middleware/error";

class UserController {
  static signup = async (req: Request, res: Response) => {
    const { username, email, password } = req.body;

    const existingUser = await UserModelHelper.getUserByUserNameOrEmail(
      username,
      email
    );

    if (existingUser) {
      throw new HttpError(409, Messages.USER_ALREADY_EXISTS);
    }

    await UserModelHelper.addNewUser(username, email, password);
    return res.status(201).json({ message: Messages.USER_ADDED });
  };
}

export default UserController;
