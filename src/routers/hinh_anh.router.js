import express from 'express';
import { hinh_anhController } from '../controllers/hinh_anh.controller.js';
import { protect } from '../common/middlewares/protect.middleware.js';

const hinh_anhRouter = express.Router();

// Routes công khai
hinh_anhRouter.get('/', hinh_anhController.getList);
hinh_anhRouter.get('/search', hinh_anhController.search);
hinh_anhRouter.get('/:id', hinh_anhController.getById);
hinh_anhRouter.get('/:id/binh-luan', hinh_anhController.getCommentsByImageId);

// Routes cần authorization
hinh_anhRouter.post('/', protect, hinh_anhController.createImage);
hinh_anhRouter.delete('/:id', protect, hinh_anhController.deleteImage);

// Routes quản lý ảnh của user
hinh_anhRouter.get('/user/:userId/created', hinh_anhController.getUserCreatedImages);
hinh_anhRouter.get('/user/:userId/saved', hinh_anhController.getUserSavedImages);

export default hinh_anhRouter;