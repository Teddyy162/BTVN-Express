import { hinh_anhService } from "../services/hinh_anh.service.js";
import { responseSuccess } from "../common/helpers/response.helper.js";

export const hinh_anhController = {
    // GET danh sách ảnh (có phân trang)
    async getList(req, res, next) {
        try {
            const { page = 1, pageSize = 10 } = req.query;
            const result = await hinh_anhService.getList(Number(page), Number(pageSize));
            const response = responseSuccess(result, "Lấy danh sách ảnh thành công");
            res.status(response.statusCode).json(response);
        } catch (error) {
            next(error);
        }
    },

    // GET tìm kiếm ảnh theo tên
    async search(req, res, next) {
        try {
            const { ten = "", page = 1, pageSize = 10 } = req.query;
            const result = await hinh_anhService.search(ten, Number(page), Number(pageSize));
            const response = responseSuccess(result, "Tìm kiếm ảnh thành công");
            res.status(response.statusCode).json(response);
        } catch (error) {
            next(error);
        }
    },

    // GET thông tin ảnh theo id + người tạo
    async getById(req, res, next) {
        try {
            const { id } = req.params;
            const result = await hinh_anhService.getById(Number(id));
            const response = responseSuccess(result, "Lấy thông tin ảnh thành công");
            res.status(response.statusCode).json(response);
        } catch (error) {
            next(error);
        }
    },

    // GET bình luận theo id ảnh
    async getCommentsByImageId(req, res, next) {
        try {
            const { id } = req.params;
            const { page = 1, pageSize = 10 } = req.query;
            const result = await hinh_anhService.getCommentsByImageId(Number(id), Number(page), Number(pageSize));
            const response = responseSuccess(result, "Lấy bình luận ảnh thành công");
            res.status(response.statusCode).json(response);
        } catch (error) {
            next(error);
        }
    },

    // POST thêm ảnh mới
    async createImage(req, res, next) {
        try {
            const { nguoi_dung_id } = req.nguoi_dung; // Lấy từ token
            const { ten_hinh, mo_ta, duong_dan } = req.body;
            const result = await hinh_anhService.createImage({
                ten_hinh,
                mo_ta,
                duong_dan,
                nguoi_dung_id
            });
            const response = responseSuccess(result, "Tạo ảnh thành công", 201);
            res.status(response.statusCode).json(response);
        } catch (error) {
            next(error);
        }
    },

    // DELETE xóa ảnh
    async deleteImage(req, res, next) {
        try {
            const { id } = req.params;
            const { nguoi_dung_id } = req.nguoi_dung;
            const result = await hinh_anhService.deleteImage(Number(id), nguoi_dung_id);
            const response = responseSuccess(result, "Xóa ảnh thành công");
            res.status(response.statusCode).json(response);
        } catch (error) {
            next(error);
        }
    },

    // GET ảnh đã tạo của user
    async getUserCreatedImages(req, res, next) {
        try {
            const { userId } = req.params;
            const { page = 1, pageSize = 10 } = req.query;
            const result = await hinh_anhService.getUserCreatedImages(
                Number(userId),
                Number(page),
                Number(pageSize)
            );
            const response = responseSuccess(result, "Lấy ảnh đã tạo thành công");
            res.status(response.statusCode).json(response);
        } catch (error) {
            next(error);
        }
    },

    // GET ảnh đã lưu của user
    async getUserSavedImages(req, res, next) {
        try {
            const { userId } = req.params;
            const { page = 1, pageSize = 10 } = req.query;
            const result = await hinh_anhService.getUserSavedImages(
                Number(userId),
                Number(page),
                Number(pageSize)
            );
            const response = responseSuccess(result, "Lấy ảnh đã lưu thành công");
            res.status(response.statusCode).json(response);
        } catch (error) {
            next(error);
        }
    }
};