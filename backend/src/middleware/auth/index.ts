import jwt from "jsonwebtoken";
import { Types } from "mongoose";

export const generateAccessToken = (
  userId: Types.ObjectId,
  email: string,
  username: string
): { accessToken: string; expiresAt: string } => {
  const accessToken = jwt.sign(
    {
      userId,
      email,
      username,
    },
    process.env.JWT_ACCESS_TOKEN_SECRET as string,
    { expiresIn: process.env.JWT_ACCESS_TOKEN_EXPIRY }
  );
  const decoded = jwt.decode(accessToken) as { exp: number };
  const expiresAt = new Date(decoded.exp * 1000).toISOString(); // Convert to ISO string

  return { accessToken, expiresAt };
};
