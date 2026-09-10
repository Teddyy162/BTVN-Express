import { responseSuccess } from "../common/helpers/response.helper.js";
import { binhLuanService } from "../services/binh_luan.service.js"

export const binhLuanController = {
    async findAll(req, res) {
        const result = await binhLuanService.findAll(req, res);

        const response = responseSuccess(200, "Lấy danh sách bình luận thành công", result);
        //trả dữ liệu về client
        res.json(response);
    }
}