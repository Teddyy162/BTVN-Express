import { BadRequestException, ForbiddenException } from "../common/helpers/exception.helper.js";
import { prisma } from "../common/prisma/connect.prisma.js";
import path from "path";
import fs from "fs";

const validateCurrentUser = (req) => {
    const userId = Number(req.params.nguoiDungId);

    if (!Number.isInteger(userId) || userId < 1) {
        throw new BadRequestException("nguoi_dung_id không hợp lệ");
    }

    if (userId !== req.nguoi_dung.nguoi_dung_id) {
        throw new ForbiddenException("Bạn không có quyền truy cập dữ liệu của người dùng khác");
    }

    return userId;
};

export const nguoi_dungService = {
    async getProfile(req) {
        return req.nguoi_dung;
    },

    async updateProfile(req) {
        const { email, ho_ten, tuoi } = req.body;
        const data = {};

        if (email !== undefined) {
            const trimmedEmail = String(email).trim();

            if (!trimmedEmail) {
                throw new BadRequestException("email không được để trống");
            }

            if (trimmedEmail !== req.nguoi_dung.email) {
                const userExist = await prisma.nguoi_dung.findUnique({
                    where: {
                        email: trimmedEmail,
                    },
                });

                if (userExist) {
                    throw new BadRequestException("Email đã tồn tại");
                }
            }

            data.email = trimmedEmail;
        }

        if (ho_ten !== undefined) {
            data.ho_ten = ho_ten;
        }

        if (tuoi !== undefined) {
            if (tuoi === null || tuoi === "") {
                data.tuoi = null;
            } else {
                const age = Number(tuoi);

                if (!Number.isInteger(age) || age < 0) {
                    throw new BadRequestException("tuoi phải là số nguyên không âm");
                }

                data.tuoi = age;
            }
        }

        if (!Object.keys(data).length) {
            throw new BadRequestException("Không có dữ liệu hợp lệ để cập nhật");
        }

        const result = await prisma.nguoi_dung.update({
            where: {
                nguoi_dung_id: req.nguoi_dung.nguoi_dung_id,
            },
            data,
        });

        return result;
    },

    async getSavedImages(req) {
        const nguoiDungId = validateCurrentUser(req);

        const result = await prisma.luu_anh.findMany({
            where: {
                nguoi_dung_id: nguoiDungId,
            },
            orderBy: {
                hinh_id: "desc",
            },
            include: {
                hinh_anh: {
                    include: {
                        nguoi_dung: true,
                    },
                },
            },
        });

        return result;
    },

    async getCreatedImages(req) {
        const nguoiDungId = validateCurrentUser(req);

        const result = await prisma.hinh_anh.findMany({
            where: {
                nguoi_dung_id: nguoiDungId,
            },
            orderBy: {
                hinh_id: "desc",
            },
            include: {
                nguoi_dung: true,
            },
        });

        return result;
    },

    async avatarLocal(req) {
        if (!req.file) {
            throw new BadRequestException("Vui lòng chọn file để upload");
        }

        if (req.nguoi_dung.anh_dai_dien) {
            const oldFilePath = path.join("public/images", req.nguoi_dung.anh_dai_dien);

            if (fs.existsSync(oldFilePath)) {
                fs.unlinkSync(oldFilePath);
            }
        }

        await prisma.nguoi_dung.update({
            where: {
                nguoi_dung_id: req.nguoi_dung.nguoi_dung_id,
            },
            data: {
                anh_dai_dien: req.file.filename,
            },
        });

        return `image/${req.file.filename}`;
    },

    async avatarCloud(req) {
        return `This action uploads avatar to cloud`;
    },
};
