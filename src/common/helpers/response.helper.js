import { statusCodes } from "./statusCode.helper.js";


export const responseSuccess = (statusCode = statusCodes.OK, message = "Lấy danh sách thành công", result) => {
    return {
        status: "success",
        statusCode: statusCode,
        message: "Lấy danh sách bình luận thành công",
        data: result,
        doc: "swagger.com"
    }
}

export const responseError = (
    message = "Internal Server Error",
    statusCode = statusCodes.INTERNAL_SERVER_ERROR,
    stack
) => {
    return {
        status: "error",
        statusCode: statusCode,
        message: message,
        stack: stack, //chỉ nên hiển thị trong môi trường phát triển (development)
        doc: "swagger.com"
    }
}