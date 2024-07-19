import { Request, Response, NextFunction } from "express";
import { string, object, ValidationError } from "yup";
import { HttpError } from "../error";
import Messages from "../../Messages";

class UserValidationSchema {
  static signupSchema = object().shape({
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

  static loginSchema = object().shape({
    email: string()
      .email("email field must contain an email")
      .required("email is a required field")
      .label("Email"),
    password: string()
      .required("password is a required field")
      .label("Password"),
  });
}

class UserValidation {
  static validateSignup = async (
    req: Request,
    _: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      await UserValidationSchema.signupSchema.validate(req.body, {
        abortEarly: false,
      });
      next();
    } catch (error) {
      throw new HttpError(
        400,
        Messages.SIGNUP_VALIDATION_ERROR,
        (error as ValidationError).errors
      );
    }
  };

  static validateLogin = async (
    req: Request,
    _: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      await UserValidationSchema.loginSchema.validate(req.body, {
        abortEarly: false,
      });
      next();
    } catch (error) {
      throw new HttpError(
        400,
        Messages.LOGIN_VALIDATION_ERROR,
        (error as ValidationError).errors
      );
    }
  };
}

export default UserValidation;
