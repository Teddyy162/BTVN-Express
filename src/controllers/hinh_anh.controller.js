import { responseSuccess } from "../common/helpers/response.helper.js";
import { statusCodes } from "../common/helpers/statusCode.helper.js";
import { hinh_anhService } from "../services/hinh_anh.service.js";

export const hinh_anhController = {
    async findAll(req, res) {
        const result = await hinh_anhService.findAll(req);
        const response = responseSuccess(result, "Lấy danh sách hình ảnh thành công");
        res.status(response.statusCode).json(response);
    },

    async searchByName(req, res) {
        const result = await hinh_anhService.searchByName(req);
        const response = responseSuccess(result, "Tìm kiếm hình ảnh thành công");
        res.status(response.statusCode).json(response);
    },

    async findDetail(req, res) {
        const result = await hinh_anhService.findDetail(req);
        const response = responseSuccess(result, "Lấy chi tiết hình ảnh thành công");
        res.status(response.statusCode).json(response);
    },

    async findCommentsByImageId(req, res) {
        const result = await hinh_anhService.findCommentsByImageId(req);
        const response = responseSuccess(result, "Lấy danh sách bình luận theo hình ảnh thành công");
        res.status(response.statusCode).json(response);
    },

    async create(req, res) {
        const result = await hinh_anhService.create(req);
        const response = responseSuccess(result, "Tạo hình ảnh thành công", statusCodes.CREATED);
        res.status(response.statusCode).json(response);
    },

    async delete(req, res) {
        const result = await hinh_anhService.delete(req);
        const response = responseSuccess(result, "Xóa hình ảnh thành công", statusCodes.OK);
        res.status(response.statusCode).json(response);
    },
};
