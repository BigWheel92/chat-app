import jwt from "jsonwebtoken";
import { Types } from "mongoose";

class JwtService {
  static generateAccessToken = (
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

  static generateEmailVerificationToken = (
    userId: Types.ObjectId
  ): { emailVerificationToken: string; expiresAt: string } => {
    const emailVerificationToken = jwt.sign(
      {
        userId,
      },
      process.env.JWT_EMAIL_VERIFICATION_TOKEN_SECRET as string,
      { expiresIn: process.env.JWT_EMAIL_VERIFICATION_TOKEN_EXPIRY }
    );
    const decoded = jwt.decode(emailVerificationToken) as { exp: number };
    const expiresAt = new Date(decoded.exp * 1000).toISOString(); // Convert to ISO string

    return { emailVerificationToken, expiresAt };
  };
}

export default JwtService;
