import { prisma } from "../common/prisma/connect.prisma.js";
import {
    BadRequestException,
    ForbiddenException,
    NotFoundException,
} from "../common/helpers/exception.helper.js";

const getPagination = (req) => {
    const defaultPage = 1;
    const defaultPageSize = 10;

    let page = Number(req.query.page) || defaultPage;
    let pageSize = Number(req.query.pageSize) || defaultPageSize;

    if (page < 1) page = defaultPage;
    if (pageSize < 1) pageSize = defaultPageSize;

    return {
        page,
        pageSize,
        skip: (page - 1) * pageSize,
    };
};

const parseImageId = (value) => {
    const hinhId = Number(value);

    if (!Number.isInteger(hinhId) || hinhId < 1) {
        throw new BadRequestException("hinh_id không hợp lệ");
    }

    return hinhId;
};

export const hinh_anhService = {
    async findAll(req) {
        const { page, pageSize, skip } = getPagination(req);

        const [items, totalItems] = await prisma.$transaction([
            prisma.hinh_anh.findMany({
                skip,
                take: pageSize,
                orderBy: { hinh_id: "desc" },
                include: {
                    nguoi_dung: true,
                },
            }),
            prisma.hinh_anh.count(),
        ]);

        return {
            items,
            totalItems,
            totalPages: Math.ceil(totalItems / pageSize),
            page,
            pageSize,
        };
    },

    async searchByName(req) {
        const keyword = req.query.ten_hinh || req.query.keyword || req.query.q;

        if (!keyword) {
            throw new BadRequestException("Vui lòng nhập tên hình cần tìm");
        }

        const { page, pageSize, skip } = getPagination(req);
        const where = {
            ten_hinh: {
                contains: keyword,
            },
        };

        const [items, totalItems] = await prisma.$transaction([
            prisma.hinh_anh.findMany({
                where,
                skip,
                take: pageSize,
                orderBy: { hinh_id: "desc" },
                include: {
                    nguoi_dung: true,
                },
            }),
            prisma.hinh_anh.count({ where }),
        ]);

        return {
            items,
            totalItems,
            totalPages: Math.ceil(totalItems / pageSize),
            page,
            pageSize,
            keyword,
        };
    },

    async findDetail(req) {
        const hinhId = parseImageId(req.params.hinhId);

        const image = await prisma.hinh_anh.findUnique({
            where: {
                hinh_id: hinhId,
            },
            include: {
                nguoi_dung: true,
            },
        });

        if (!image) {
            throw new NotFoundException("Không tìm thấy hình ảnh");
        }

        return image;
    },

    async findCommentsByImageId(req) {
        const hinhId = parseImageId(req.params.hinhId);

        const image = await prisma.hinh_anh.findUnique({
            where: {
                hinh_id: hinhId,
            },
        });

        if (!image) {
            throw new NotFoundException("Không tìm thấy hình ảnh");
        }

        const comments = await prisma.binh_luan.findMany({
            where: {
                hinh_id: hinhId,
                isDeleted: false,
            },
            orderBy: {
                binh_luan_id: "desc",
            },
            include: {
                nguoi_dung: true,
            },
        });

        return comments;
    },

    async create(req) {
        const { ten_hinh, duong_dan, mo_ta } = req.body;

        if (!ten_hinh || !duong_dan) {
            throw new BadRequestException("ten_hinh và duong_dan là bắt buộc");
        }

        const result = await prisma.hinh_anh.create({
            data: {
                ten_hinh,
                duong_dan,
                mo_ta,
                nguoi_dung_id: req.nguoi_dung.nguoi_dung_id,
            },
        });

        return result;
    },

    async delete(req) {
        const hinhId = parseImageId(req.params.hinhId);
        const userId = req.nguoi_dung.nguoi_dung_id;

        const image = await prisma.hinh_anh.findUnique({
            where: {
                hinh_id: hinhId,
            },
        });

        if (!image) {
            throw new NotFoundException("Không tìm thấy hình ảnh");
        }

        if (image.nguoi_dung_id !== userId) {
            throw new ForbiddenException("Bạn không có quyền xóa hình ảnh này");
        }

        await prisma.$transaction([
            prisma.luu_anh.deleteMany({
                where: {
                    hinh_id: hinhId,
                },
            }),
            prisma.binh_luan.deleteMany({
                where: {
                    hinh_id: hinhId,
                },
            }),
            prisma.hinh_anh.delete({
                where: {
                    hinh_id: hinhId,
                },
            }),
        ]);

        return true;
    },
};
