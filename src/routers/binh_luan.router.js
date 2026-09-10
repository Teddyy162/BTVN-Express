import express from 'express';
import { binhLuanController } from '../controllers/binh_luan.controller.js';


const binhLuanRouter = express.Router();
binhLuanRouter.get("", binhLuanController.findAll)

export default binhLuanRouter;