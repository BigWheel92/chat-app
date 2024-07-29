import bcrypt from "bcrypt";
import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { Types } from "mongoose";
import "express-async-errors";

import { UserModelHelper } from "../db/helpers/userHelper";
import Messages from "../Messages";
import { HttpError } from "../middleware/error";
import JwtService from "../services/JwtService";
import EmailService from "../services/EmailService";

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

    const newUser = await UserModelHelper.addNewUser(username, email, password);
    const { emailVerificationToken, expiresAt } =
      JwtService.generateEmailVerificationToken(newUser._id);
    const emailBody = `Hi,\nTo complete your signup process on chatapp, please verify your email by clicking on this link: ${
      process.env.FRONT_END_URL
    }/verify/${emailVerificationToken}.\n(The link will expire on ${new Date(
      expiresAt
    ).toUTCString()})). If you don't verify your email by this time, your data on chatapp will be removed.`;

    EmailService.sendEmail(
      email,
      "Signup on Chatapp - Verification",
      emailBody
    );
    return res.status(201).json({ message: Messages.USER_SIGNUP_SUCCESS });
  };

  static login = async (req: Request, res: Response) => {
    const { email, password } = req.body;

    const user = await UserModelHelper.getUserByEmail(email);
    if (!user) {
      throw new HttpError(401, Messages.INVALID_CREDENTIALS);
    } else if (!user.verified) {
      throw new HttpError(401, Messages.USER_UNVERIFIED);
    } else {
      const isPasswordCorrect = await bcrypt.compare(
        password,
        user.password as string
      );
      if (!isPasswordCorrect) {
        throw new HttpError(401, Messages.INVALID_CREDENTIALS);
      } else {
        const { accessToken, expiresAt } = JwtService.generateAccessToken(
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

  static verify = async (req: Request, res: Response) => {
    const token: string = req.params.token;

    let userId: Types.ObjectId | null = null;
    try {
      type JwtPayload = {
        userId: Types.ObjectId;
      };
      const decoded = jwt.verify(
        token,
        process.env.JWT_EMAIL_VERIFICATION_TOKEN_SECRET as string
      ) as JwtPayload;
      userId = decoded.userId;
    } catch (error) {
      if (error instanceof jwt.TokenExpiredError) {
        throw new HttpError(401, Messages.VERIFICATION_LINK_EXPIRED);
      } else {
        throw new HttpError(401, Messages.INVALID_VERIFICATION_LINK);
      }
    }

    const updatedRes = await UserModelHelper.verifyUser(userId);
    //if the user is already verified
    if (updatedRes.modifiedCount === 0)
      throw new HttpError(409, Messages.USER_ALREADY_VERIFIED);
    return res.status(200).json({ message: Messages.USER_VERIFIED });
  };
}

export default UserController;
