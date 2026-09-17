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


};