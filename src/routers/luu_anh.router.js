import express from "express";
import { luu_anhController } from "../controllers/luu_anh.controller.js";
import { protect } from "../common/middlewares/protect.middleware.js";

const luu_anhRouter = express.Router();

luu_anhRouter.post("/", protect, luu_anhController.save);
luu_anhRouter.get("/:hinhId/da-luu", protect, luu_anhController.checkSaved);

export default luu_anhRouter;
