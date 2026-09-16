import { responseError } from "./response.helper.js"
import jwt from "jsonwebtoken";
import { statusCodes } from "./statusCode.helper.js";

export const appError = (err, req, res, next) => {
    if(err instanceof jwt.JsonWebTokenError){
        err.code = statusCodes.UNAUTHORIZED; //401: fe sẽ yêu cầu login lại
    }

    if(err instanceof jwt.TokenExpiredError){
        //TokenExpiredError: liên quan đến token đã hết hạn
        err.code = statusCodes.FORBIDDEN; //403: fe sẽ yêu cầu refresh token
    }
    const response = responseError(err?.message, err?.code, err?.stack);
    res.status(response.statusCode).json(response);
};