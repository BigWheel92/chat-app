import { Request, Response, NextFunction } from "express";
import { string, object, ValidationError } from "yup";
import { HttpError } from "../error";
import Messages from "../../Messages";

const signupSchema = object().shape({
  username: string().min(4).required().label("Username"),
  email: string().email().required().label("Email"),
  password: string()
    .min(8)
    .matches(
      /[a-zA-Z]/,
      "Password must contain at least one alphabet character"
    )
    .matches(
      /[^a-zA-Z0-9]/,
      "Password must contain at least one special character"
    )
    .required()
    .label("Password"),
});

export const validateSignup = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    await signupSchema.validate(req.body, { abortEarly: false });
    next();
  } catch (error) {
    throw new HttpError(
      400,
      Messages.SIGNUP_VALIDATION_ERROR,
      (error as ValidationError).errors
    );
  }
};
