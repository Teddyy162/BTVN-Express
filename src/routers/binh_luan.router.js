import express from 'express';
import { binhLuanController } from '../controllers/binh_luan.controller.js';

const binhLuanRouter = express.Router();
//READ
binhLuanRouter.get("/", binhLuanController.findAll);

//CREATE
binhLuanRouter.post("/", binhLuanController.create);

//UPDATE
binhLuanRouter.put("/:binhLuanID", binhLuanController.update);

//DELETE
binhLuanRouter.delete("/:binhLuanID", binhLuanController.delete);

export default binhLuanRouter;