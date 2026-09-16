import { tokenService } from "../../services/token.service.js";
import { BadRequestException } from "../helpers/exception.helper.js";
import { prisma } from "../prisma/connect.prisma.js";

export const protect = async (req, res, next) => {
    const {accessToken, refreshToken} = req.cookies;

    if(!accessToken){
        throw new BadRequestException("không có accessToken")
    }

    //verify accessToken 
    const decode = tokenService.verifyAccessToken(accessToken);


    const userExit = await prisma.nguoi_dung.findUnique({
        where: {
            nguoi_dung_id: decode.userID
        },
    });

    if(!userExit){
        throw new BadRequestException("user không tồn tại");
    }
    req.nguoi_dung = userExit;
    next();
}