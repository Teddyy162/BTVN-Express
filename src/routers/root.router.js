import express from 'express';
import binhLuanRouter from './binh_luan.router.js';
const rootRouter = express.Router();

rootRouter.use("/binh_luan", binhLuanRouter);

export default rootRouter;