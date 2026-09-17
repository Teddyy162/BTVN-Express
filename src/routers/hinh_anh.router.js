import express from "express";
import { hinh_anhController } from "../controllers/hinh_anh.controller.js";
import { protect } from "../common/middlewares/protect.middleware.js";

const hinh_anhRouter = express.Router();

hinh_anhRouter.get("/", hinh_anhController.findAll);
hinh_anhRouter.get("/tim-kiem", hinh_anhController.searchByName);
hinh_anhRouter.get("/:hinhId", hinh_anhController.findDetail);
hinh_anhRouter.get("/:hinhId/binh-luan", hinh_anhController.findCommentsByImageId);
hinh_anhRouter.post("/", protect, hinh_anhController.create);
hinh_anhRouter.delete("/:hinhId", protect, hinh_anhController.delete);

export default hinh_anhRouter;
