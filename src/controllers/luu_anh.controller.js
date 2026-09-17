import { responseSuccess } from "../common/helpers/response.helper.js";
import { statusCodes } from "../common/helpers/statusCode.helper.js";
import { luu_anhService } from "../services/luu_anh.service.js";

export const luu_anhController = {
    async save(req, res) {
        const result = await luu_anhService.save(req);
        const response = responseSuccess(result, "Lưu hình ảnh thành công", statusCodes.CREATED);
        res.status(response.statusCode).json(response);
    },

    async checkSaved(req, res) {
        const result = await luu_anhService.checkSaved(req);
        const response = responseSuccess(result, "Kiểm tra trạng thái lưu hình ảnh thành công");
        res.status(response.statusCode).json(response);
    },
};
