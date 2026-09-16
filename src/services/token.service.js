import { ACCESS_TOKEN_SECRET_KEY, REFRESH_TOKEN_SECRET_KEY } from "../common/constants/app.constant.js";
import { BadRequestException } from "../common/helpers/exception.helper.js"
import jwt from "jsonwebtoken";

export const tokenService = {
    createAccessToken(nguoi_dung_id) {
        if (!nguoi_dung_id) {
            throw new BadRequestException("không có userID để tạo access token");
        }

        const accessToken = jwt.sign({ userID: nguoi_dung_id }, ACCESS_TOKEN_SECRET_KEY, { expiresIn: "60s" });
        return accessToken;
    },

    createRefreshToken(nguoi_dung_id) {
        if (!nguoi_dung_id) {
            throw new BadRequestException("không có userID để tạo refresh token");
        }

        const refreshToken = jwt.sign({ userID: nguoi_dung_id }, REFRESH_TOKEN_SECRET_KEY, { expiresIn: "7d" });
        return refreshToken;
    },

    verifyAccessToken(accessToken, option){
        const decode = jwt.verify(accessToken, ACCESS_TOKEN_SECRET_KEY, option);

        return decode;
    },

    verifyRefreshToken(refreshToken, option){
        const decode = jwt.verify(refreshToken, REFRESH_TOKEN_SECRET_KEY, option);

        return decode;
    },
}