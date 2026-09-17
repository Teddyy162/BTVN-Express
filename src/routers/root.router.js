import express from 'express';
import binhLuanRouter from './binh_luan.router.js';
import dnhap_dkyRouter from './dnhap_dky.router.js';
import nguoi_dungRouter from './nguoi_dung.router.js';
const rootRouter = express.Router();

rootRouter.use("/binh_luan", binhLuanRouter);

rootRouter.use("/dnhap_dky", dnhap_dkyRouter);

rootRouter.use("/nguoi_dung", nguoi_dungRouter);

export default rootRouter;