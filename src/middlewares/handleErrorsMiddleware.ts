import { Request, Response, NextFunction } from "express";
import {
    AppError,
    errorTypeToStatusCode,
    isAppError,
} from "../utils/errorUtils.js";

export default function handleErrorsMiddleware(
    error: Error | AppError,
    req: Request,
    res: Response,
    next: NextFunction
) {
    // console.log(error);

    if (isAppError(error)) {
        return res
            .status(errorTypeToStatusCode(error.type))
            .send(error.message);
    }

    return res.sendStatus(500);
}
