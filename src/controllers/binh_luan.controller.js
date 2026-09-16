import { responseSuccess } from "../common/helpers/response.helper.js";
import { statusCodes } from "../common/helpers/statusCode.helper.js";
import { binhLuanService } from "../services/binh_luan.service.js"

export const binhLuanController = {
    async findAll(req, res) {
        const result = await binhLuanService.findAll(req, res);
        const response = responseSuccess(result, "Lấy danh sách bình luận thành công");
        res.status(response.statusCode).json(response);
    },

    async create(req, res) {
        const result = await binhLuanService.create(req);
        const response = responseSuccess(
            result,
            "Tạo bình luận thành công",
            statusCodes.CREATED
        );
        res.status(response.statusCode).json(response);
    },

    async update(req, res) {
        const result = await binhLuanService.update(req);
        const response = responseSuccess(
            result,
            "Cập nhật bình luận thành công",
            statusCodes.OK
        );
        res.status(response.statusCode).json(response);
    },

    async delete(req, res) {
        const result = await binhLuanService.delete(req);
        const response = responseSuccess(
            result,
            "Xóa bình luận thành công",
            statusCodes.OK
        );
        res.status(response.statusCode).json(response);
    },
}