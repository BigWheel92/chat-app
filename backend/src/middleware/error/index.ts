import { Request, Response, NextFunction } from "express";
import Messages from "../../Messages";

export class HttpError extends Error {
  status: number;
  errors: Array<string> | undefined;
  constructor(
    status: number,
    message: string,
    errors: Array<string> | undefined = undefined
  ) {
    super(message);
    this.status = status;
    this.errors = errors;
  }
}
export class ErrorMiddleware {
  static notFoundHandler = (req: Request, _: Response, next: NextFunction) => {
    const error = new HttpError(404, `Url Not Found - ${req.originalUrl}`);

    next(error); //errorHandler will be called
  };

  static errorHandler = (
    error: HttpError,
    _: Request,
    res: Response,
    __: NextFunction
  ) => {
    const httpStatus = error.status || 500;
    res.status(httpStatus);

    //error logging
    console.error(error.stack);
    if (error.errors) console.error(error.errors);

    return res.json({
      message: res.statusCode === 500 ? Messages.SERVER_ERROR : error.message,
      ...(error.errors && { errors: error.errors }),
    });
  };
}
