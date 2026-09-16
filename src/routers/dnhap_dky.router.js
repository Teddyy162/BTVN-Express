import express from 'express';
import { dnhap_dkyController } from '../controllers/dnhap_dky.controller.js';
import { protect } from '../common/middlewares/protect.middleware.js';

const dnhap_dkyRouter = express.Router();

// Tạo route CRUD
dnhap_dkyRouter.post('/dky', dnhap_dkyController.register);
dnhap_dkyRouter.post('/dnhap', dnhap_dkyController.login);
dnhap_dkyRouter.get("/lay_thong_tin", protect,dnhap_dkyController.getUserInfo);
dnhap_dkyRouter.post("/refresh-token", dnhap_dkyController.refreshToken);


export default dnhap_dkyRouter;