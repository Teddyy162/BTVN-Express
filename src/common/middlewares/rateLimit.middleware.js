import rateLimit from "express-rate-limit";
import { TooManyRequestsException } from "../helpers/exception.helper.js";

export const appLimit = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes

    max: 10, // limit each IP to 100 requests per windowMs

    standardHeaders: "draft-8", //định dạnh rate limit mới

    legacyHeaders: false, //tắt định dạng rate limit cũ

    handler: ()=>{
        throw new TooManyRequestsException("Quá nhiều yêu cầu từ IP này, vui lòng thử lại sau.");
    }
});