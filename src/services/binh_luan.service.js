import binhLuanModel from "../models/binh_luan.model.js";
import { prisma } from "../common/prisma/connect.prisma.js";


export const binhLuanService = {
    async findAll(req, res) {
        //sequelize
        // return "list bình luận"
        const result = await prisma.binh_luan.findMany()
        return result;
    },
}