import { BadRequestException } from "../common/helpers/exception.helper.js";
import { prisma } from "../common/prisma/connect.prisma.js";
import path from 'path';
import fs from 'fs';

export const nguoi_dungService = {
    async avatarLocal(req) {
        //req.file chứa thông tin về file được upload
        if (!req.file) {
            throw new BadRequestException("Vui lòng chọn file để upload");
        }

        //nếu người dùng đã có ảnh đại diện, có thể xóa ảnh cũ trước khi lưu ảnh mới (tùy nhu cầu)
        if (req.nguoi_dung.anh_dai_dien) {
            const oldFilePath = path.join("public/images", req.nguoi_dung.anh_dai_dien);

            if (fs.existsSync(oldFilePath)) {
                fs.unlinkSync(oldFilePath);
            }
        }

        //lưu vào database
        const result = await prisma.nguoi_dung.update({
            where: {
                nguoi_dung_id: req.nguoi_dung.nguoi_dung_id
            },
            data: {
                anh_dai_dien: req.file.filename,
            }
        })

        return `image/${req.file.filename}`;
    },

    async avatarCloud(req) {
        return `This action uploads avatar to cloud`;
    },

    async updateUserInfo(id, data) {
        try {
            const { ho_ten, tuoi, email } = data;

            // Kiểm tra user có tồn tại không
            const userExists = await prisma.nguoi_dung.findUnique({
                where: {
                    nguoi_dung_id: id
                }
            });

            if (!userExists) {
                throw new BadRequestException("User không tồn tại");
            }

            // Kiểm tra email có bị trùng không (nếu thay đổi email)
            if (email && email !== userExists.email) {
                const emailExists = await prisma.nguoi_dung.findUnique({
                    where: {
                        email: email
                    }
                });

                if (emailExists) {
                    throw new BadRequestException("Email này đã được sử dụng");
                }
            }

            // Cập nhật user
            const updatedUser = await prisma.nguoi_dung.update({
                where: {
                    nguoi_dung_id: id
                },
                data: {
                    ...(ho_ten && { ho_ten }),
                    ...(tuoi && { tuoi }),
                    ...(email && { email }),
                    updatedAt: new Date()
                },
                select: {
                    nguoi_dung_id: true,
                    ho_ten: true,
                    email: true,
                    tuoi: true,
                    anh_dai_dien: true,
                    createdAt: true,
                    updatedAt: true
                }
            });

            return updatedUser;
        } catch (error) {
            throw new Error(`Lỗi cập nhật thông tin user: ${error.message}`);
        }
    },


};