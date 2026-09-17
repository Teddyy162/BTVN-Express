import { prisma } from "../common/prisma/connect.prisma.js";
import {
    BadRequestException,
    NotFoundException,
} from "../common/helpers/exception.helper.js";

const parseImageId = (value) => {
    const hinhId = Number(value);

    if (!Number.isInteger(hinhId) || hinhId < 1) {
        throw new BadRequestException("hinh_id không hợp lệ");
    }

    return hinhId;
};

export const luu_anhService = {
    async save(req) {
        const hinhId = parseImageId(req.body.hinh_id);
        const nguoiDungId = req.nguoi_dung.nguoi_dung_id;

        const image = await prisma.hinh_anh.findUnique({
            where: {
                hinh_id: hinhId,
            },
        });

        if (!image) {
            throw new NotFoundException("Không tìm thấy hình ảnh");
        }

        const existing = await prisma.luu_anh.findUnique({
            where: {
                nguoi_dung_id_hinh_id: {
                    nguoi_dung_id: nguoiDungId,
                    hinh_id: hinhId,
                },
            },
        });

        if (existing) {
            return {
                ...existing,
                da_luu: true,
            };
        }

        const result = await prisma.luu_anh.create({
            data: {
                nguoi_dung_id: nguoiDungId,
                hinh_id: hinhId,
                ngay_luu: req.body.ngay_luu || new Date(),
            },
        });

        return {
            ...result,
            da_luu: true,
        };
    },

    async checkSaved(req) {
        const hinhId = parseImageId(req.params.hinhId);
        const nguoiDungId = req.nguoi_dung.nguoi_dung_id;

        const existing = await prisma.luu_anh.findUnique({
            where: {
                nguoi_dung_id_hinh_id: {
                    nguoi_dung_id: nguoiDungId,
                    hinh_id: hinhId,
                },
            },
        });

        return {
            hinh_id: hinhId,
            nguoi_dung_id: nguoiDungId,
            da_luu: Boolean(existing),
            thong_tin_luu: existing,
        };
    },
};
