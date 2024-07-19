import bcrypt from "bcrypt";
import { Request, Response } from "express";

import { UserModelHelper } from "../db/helpers/userHelper";
import Messages from "../Messages";

import "express-async-errors";
import { HttpError } from "../middleware/error";
import { generateAccessToken } from "../middleware/auth";

class UserController {
  static signup = async (req: Request, res: Response) => {
    const { username, email, password } = req.body;

    const existingUser = await UserModelHelper.getUserByUserNameOrEmail(
      username,
      email
    );

    if (existingUser) {
      const errorMessage =
        existingUser.email === email
          ? Messages.EMAIL_ALREADY_EXISTS
          : Messages.USERNAME_ALREADY_EXISTS;

      throw new HttpError(409, errorMessage);
    }

    await UserModelHelper.addNewUser(username, email, password);
    return res.status(201).json({ message: Messages.USER_ADDED });
  };
  static login = async (req: Request, res: Response) => {
    const { email, password } = req.body;

    const user = await UserModelHelper.getUserByEmail(email);
    if (!user) {
      throw new HttpError(401, Messages.INVALID_CREDENTIALS);
    } else {
      const isPasswordCorrect = await bcrypt.compare(
        password,
        user.password as string
      );
      if (!isPasswordCorrect) {
        throw new HttpError(401, Messages.INVALID_CREDENTIALS);
      } else {
        const { accessToken, expiresAt } = generateAccessToken(
          user._id,
          user.email,
          user.username
        );

        return res.status(200).json({
          accessToken,
          expiresAt,
          user: {
            id: user._id,
            name: user.username,
            email: user.email,
          },
        });
      }
    }
  };
}

export default UserController;
