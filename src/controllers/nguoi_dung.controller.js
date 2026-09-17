import { nguoi_dungService } from "../services/nguoi_dung.service.js";
import { responseSuccess } from "../common/helpers/response.helper.js";

export const nguoi_dungController = {
    async getProfile(req, res) {
        const result = await nguoi_dungService.getProfile(req);
        const response = responseSuccess(result, "Lấy thông tin người dùng thành công");
        res.status(response.statusCode).json(response);
    },

    async updateProfile(req, res) {
        const result = await nguoi_dungService.updateProfile(req);
        const response = responseSuccess(result, "Cập nhật thông tin người dùng thành công");
        res.status(response.statusCode).json(response);
    },

    async getSavedImages(req, res) {
        const result = await nguoi_dungService.getSavedImages(req);
        const response = responseSuccess(result, "Lấy danh sách hình đã lưu thành công");
        res.status(response.statusCode).json(response);
    },

    async getCreatedImages(req, res) {
        const result = await nguoi_dungService.getCreatedImages(req);
        const response = responseSuccess(result, "Lấy danh sách hình đã tạo thành công");
        res.status(response.statusCode).json(response);
    },

    async avatarLocal(req, res) {
        const result = await nguoi_dungService.avatarLocal(req);
        const response = responseSuccess(result, `Upload avatar locally successfully`);
        res.status(response.statusCode).json(response);
    },

    async avatarCloud(req, res) {
        const result = await nguoi_dungService.avatarCloud(req);
        const response = responseSuccess(result, `Upload avatar to cloud successfully`);
        res.status(response.statusCode).json(response);
    },
};
