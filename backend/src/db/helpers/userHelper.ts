import bcrypt from "bcrypt";
import { Types } from "mongoose";

import UserModel from "../models/userModel";

export class UserModelHelper {
  static getUserByUserNameOrEmail = async (username: string, email: string) =>
    await UserModel.findOne({ $or: [{ username }, { email }] });

  static getUserByEmail = async (email: string) =>
    await UserModel.findOne({ email });

  static addNewUser = async (
    username: string,
    email: string,
    password: string
  ) => {
    const hashedPassword = password ? await bcrypt.hash(password, 10) : null;

    const user = await UserModel.create({
      username,
      email,
      password: hashedPassword,
    });
    return user;
  };

  static verifyUser = async (userId: Types.ObjectId) =>
    await UserModel.updateOne({ _id: userId }, { $set: { verified: true } });
}
