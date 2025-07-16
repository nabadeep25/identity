
import { NextFunction, Request, Response } from "express";
import logger from "./logger";

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
): void => {

  logger.error("Error:", err.message);
  if (err.stack) logger.error(err.stack);
   const statusCode = 500;
   const message = err.message || "Internal server error";


  const response = {
    code: statusCode,
    message,
  };

  res.status(statusCode).send(response);
};
