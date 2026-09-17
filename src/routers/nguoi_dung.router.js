import express from "express";
import { nguoi_dungController } from "../controllers/nguoi_dung.controller.js";
import { uploadDiskStorage } from "../common/multer/disk-storage.multer.js";
import { protect } from "../common/middlewares/protect.middleware.js";

const nguoi_dungRouter = express.Router();

nguoi_dungRouter.get("/thong-tin", protect, nguoi_dungController.getProfile);
nguoi_dungRouter.put("/thong-tin", protect, nguoi_dungController.updateProfile);
nguoi_dungRouter.get("/:nguoiDungId/anh-da-luu", protect, nguoi_dungController.getSavedImages);
nguoi_dungRouter.get("/:nguoiDungId/anh-da-tao", protect, nguoi_dungController.getCreatedImages);
nguoi_dungRouter.post("/avatar-local", protect, uploadDiskStorage.single("avatar"), nguoi_dungController.avatarLocal);
nguoi_dungRouter.post("/avatar-cloud", nguoi_dungController.avatarCloud);

export default nguoi_dungRouter;
