import { responseSuccess } from '../common/helpers/response.helper.js';
import { dnhap_dkyService } from '../services/dnhap_dky.service.js';

const authCookieOptions = {
   httpOnly: true,
   sameSite: 'strict',
   secure: process.env.NODE_ENV === 'production',
};

export const dnhap_dkyController = {
   async register(req, res, next) {
      const result = await dnhap_dkyService.register(req);
      const response = responseSuccess(result, `đăng ký thành công`);
      res.status(response.statusCode).json(response);
   },

   async login(req, res, next) {
      const result = await dnhap_dkyService.login(req);
      const response = responseSuccess(true, `đăng nhập thành công`);

      res.cookie("accessToken", result.accessToken, authCookieOptions);
      res.cookie("refreshToken", result.refreshToken, authCookieOptions);

      res.status(response.statusCode).json(response);
   },

   async getUserInfo(req, res, next) {
      const result = await dnhap_dkyService.getUserInfo(req);
      const response = responseSuccess(result, `lấy thông tin người dùng thành công`);
      res.status(response.statusCode).json(response);
   },

   async refreshToken(req, res, next) {
      const result = await dnhap_dkyService.refreshToken(req);
      const response = responseSuccess(true, `Làm mới token thành công`);
      res.cookie("accessToken", result.accessToken, authCookieOptions);
      res.cookie("refreshToken", result.refreshToken, authCookieOptions);
      res.status(response.statusCode).json(response);
   }

};
