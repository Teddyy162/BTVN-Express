import express from 'express';
import { nguoi_dungController } from "../controllers/nguoi_dung.controller.js";
import multer from 'multer';
import { uploadDiskStorage } from '../common/multer/disk-storage.multer.js';
import { protect } from '../common/middlewares/protect.middleware.js';


const nguoi_dungRouter = express.Router();
// const upload = multer({dest: 'images/'});
// Tạo route CRUD
nguoi_dungRouter.post('/avatar-local', protect, uploadDiskStorage.single("avatar"), nguoi_dungController.avatarLocal);
nguoi_dungRouter.post('/avatar-cloud', nguoi_dungController.avatarCloud);

nguoi_dungRouter.put('/:id', protect, nguoi_dungController.updateUserInfo);

export default nguoi_dungRouter;