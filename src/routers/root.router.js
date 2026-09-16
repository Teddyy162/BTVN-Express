import express from 'express';
import binhLuanRouter from './binh_luan.router.js';
import dnhap_dkyRouter from './dnhap_dky.router.js';
const rootRouter = express.Router();

rootRouter.use("/binh_luan", binhLuanRouter);

rootRouter.use("/dnhap_dky", dnhap_dkyRouter);

export default rootRouter;