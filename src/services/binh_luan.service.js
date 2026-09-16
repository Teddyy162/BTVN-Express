import binhLuanModel from "../models/binh_luan.model.js";
import { prisma } from "../common/prisma/connect.prisma.js";
import { buildQueryPrisma } from "../common/helpers/build-query-prisma.helper.js";


export const binhLuanService = {
    async findAll(req, res) {
        //sequelize
        // return "list bình luận"

        const { where, index, page, pageSize } = buildQueryPrisma(req);

        const result = await prisma.binh_luan.findMany({
            where: where,
            skip: index,
            take: pageSize,
        });

        const totalItems = await prisma.binh_luan.count({
            where: where,
        });
        const totalPages = Math.ceil(totalItems / pageSize);

        return {
            items: result,
            totalItems,
            totalPages,
            page,
            pageSize
        };
    },

    async create(req) {
        const body = req.body;
        const result = await prisma.binh_luan.create({
            data: {
                noi_dung: body.noi_dung,
                ngay_binh_luan: body.ngay_binh_luan,
                nguoi_dung_id: body.nguoi_dung_id,
                hinh_id: body.hinh_id
            }
        })
        return result;
    },

    async update(req) {
        const body = req.body;
        const { binhLuanID } = req.params;

        if (!body || !body.noi_dung) {
            throw new Error("noi_dung is required");
        }

        const result = await prisma.binh_luan.update({
            where: {
                binh_luan_id: Number(binhLuanID)
            },
            data: {
                noi_dung: body.noi_dung,
                ngay_binh_luan: body.ngay_binh_luan
            }
        });

        return result;
    },

    async delete(req) {
        const { binhLuanID } = req.params;

        const result = await prisma.binh_luan.update({
            where: {
                binh_luan_id: Number(binhLuanID)
            },
            data: {
                isDeleted: true,
                deletedAt: new Date(),
                deletedBy: 1
            }
        });

        return result;
    },
}