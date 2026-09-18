import { nguoi_dungService } from "../services/nguoi_dung.service.js";
import { responseSuccess } from "../common/helpers/response.helper.js";


export const nguoi_dungController = {
   async avatarLocal(req, res, next) {
      const result = await nguoi_dungService.avatarLocal(req);
      const response = responseSuccess(result, `Upload avatar locally successfully`);
      res.status(response.statusCode).json(response);
   },

   async avatarCloud(req, res, next) {
      const result = await nguoi_dungService.avatarCloud(req);
      const response = responseSuccess(result, `Upload avatar to cloud successfully`);
      res.status(response.statusCode).json(response);
   },

   async updateUserInfo(req, res, next) {
      try {
         const { id } = req.params;
         const { ho_ten, tuoi, email } = req.body;
         const result = await nguoi_dungService.updateUserInfo(Number(id), {
            ho_ten,
            tuoi,
            email
         });
         const response = responseSuccess(result, "Cập nhật thông tin user thành công");
         res.status(response.statusCode).json(response);
      } catch (error) {
         next(error);
      }
   },


};