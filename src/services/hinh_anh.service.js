// hinh_anh.service.js
import { prisma } from "../common/prisma/connect.prisma.js";

export const hinh_anhService = {
    // GET danh sách ảnh (có phân trang)
    async getList(page, pageSize) {
        try {
            const skip = (page - 1) * pageSize;

            const [items, total] = await Promise.all([
                prisma.hinh_anh.findMany({
                    skip,
                    take: pageSize,
                    include: {
                        nguoi_dung: {
                            select: {
                                nguoi_dung_id: true,
                                ho_ten: true,
                                email: true,
                                anh_dai_dien: true
                            }
                        },
                        binh_luan: {
                            select: {
                                binh_luan_id: true
                            }
                        }
                    }
                }),
                prisma.hinh_anh.count()
            ]);

            return {
                items,
                totalItems: total,
                totalPages: Math.ceil(total / pageSize),
                currentPage: page,
                pageSize
            };
        } catch (error) {
            throw new Error(`Lỗi lấy danh sách ảnh: ${error.message}`);
        }
    },

    // GET tìm kiếm ảnh theo tên
    async search(ten, page, pageSize) {
        try {
            const skip = (page - 1) * pageSize;

            const [items, total] = await Promise.all([
                prisma.hinh_anh.findMany({
                    where: {
                        ten_hinh: {
                            contains: ten,
                        }
                    },
                    skip,
                    take: pageSize,
                    include: {
                        nguoi_dung: {
                            select: {
                                nguoi_dung_id: true,
                                ho_ten: true,
                                email: true,
                                anh_dai_dien: true
                            }
                        },
                        binh_luan: {
                            select: {
                                binh_luan_id: true
                            }
                        }
                    }
                }),
                prisma.hinh_anh.count({
                    where: {
                        ten_hinh: {
                            contains: ten,
                        }
                    }
                })
            ]);

            return {
                items,
                totalItems: total,
                totalPages: Math.ceil(total / pageSize),
                currentPage: page,
                pageSize
            };
        } catch (error) {
            throw new Error(`Lỗi tìm kiếm ảnh: ${error.message}`);
        }
    },

    // GET thông tin ảnh theo id + người tạo
    async getById(id) {
        try {
            const image = await prisma.hinh_anh.findUnique({
                where: {
                    hinh_id: id
                },
                include: {
                    nguoi_dung: {
                        select: {
                            nguoi_dung_id: true,
                            ho_ten: true,
                            email: true,
                            anh_dai_dien: true
                        }
                    },
                    binh_luan: {
                        select: {
                            binh_luan_id: true
                        }
                    }
                }
            });

            if (!image) {
                throw new Error("Ảnh không tồn tại");
            }

            return image;
        } catch (error) {
            throw new Error(`Lỗi lấy thông tin ảnh: ${error.message}`);
        }
    },

    // GET bình luận theo id ảnh
    async getCommentsByImageId(id, page, pageSize) {
        try {
            const skip = (page - 1) * pageSize;

            // Kiểm tra ảnh có tồn tại không
            const image = await prisma.hinh_anh.findUnique({
                where: { hinh_id: id }
            });

            if (!image) {
                throw new Error("Ảnh không tồn tại");
            }

            const [comments, total] = await Promise.all([
                prisma.binh_luan.findMany({
                    where: {
                        hinh_id: id
                    },
                    skip,
                    take: pageSize,
                    include: {
                        nguoi_dung: {
                            select: {
                                nguoi_dung_id: true,
                                ho_ten: true,
                                anh_dai_dien: true
                            }
                        }
                    },
                    orderBy: {
                        ngay_binh_luan: 'desc'
                    }
                }),
                prisma.binh_luan.count({
                    where: {
                        hinh_id: id
                    }
                })
            ]);

            return {
                items: comments,
                totalItems: total,
                totalPages: Math.ceil(total / pageSize),
                currentPage: page,
                pageSize
            };
        } catch (error) {
            throw new Error(`Lỗi lấy bình luận: ${error.message}`);
        }
    },

    // POST tạo ảnh mới
    async createImage(data) {
        try {
            const { ten_hinh, mo_ta, duong_dan, nguoi_dung_id } = data;

            if (!ten_hinh || !duong_dan || !nguoi_dung_id) {
                throw new Error("Thiếu thông tin bắt buộc (tên ảnh, đường dẫn ảnh, user ID)");
            }

            const image = await prisma.hinh_anh.create({
                data: {
                    ten_hinh,
                    mo_ta: mo_ta || null,
                    duong_dan,
                    nguoi_dung_id
                },
                include: {
                    nguoi_dung: {
                        select: {
                            nguoi_dung_id: true,
                            ho_ten: true,
                            email: true
                        }
                    }
                }
            });

            return image;
        } catch (error) {
            throw new Error(`Lỗi tạo ảnh: ${error.message}`);
        }
    },

    // DELETE xóa ảnh
    async deleteImage(id, nguoi_dung_id) {
        try {
            const image = await prisma.hinh_anh.findUnique({
                where: { hinh_id: id }
            });

            if (!image) {
                throw new Error("Ảnh không tồn tại");
            }

            // Kiểm tra quyền: chỉ người tạo mới có thể xóa
            if (image.nguoi_dung_id !== nguoi_dung_id) {
                throw new Error("Bạn không có quyền xóa ảnh này");
            }

            const deletedImage = await prisma.hinh_anh.delete({
                where: { hinh_id: id }
            });

            return deletedImage;
        } catch (error) {
            throw new Error(`Lỗi xóa ảnh: ${error.message}`);
        }
    },

    // GET ảnh đã tạo của user
    async getUserCreatedImages(userId, page, pageSize) {
        try {
            const skip = (page - 1) * pageSize;

            const [items, total] = await Promise.all([
                prisma.hinh_anh.findMany({
                    where: {
                        nguoi_dung_id: userId
                    },
                    skip,
                    take: pageSize,
                    include: {
                        binh_luan: {
                            select: {
                                binh_luan_id: true
                            }
                        }
                    }
                }),
                prisma.hinh_anh.count({
                    where: {
                        nguoi_dung_id: userId
                    }
                })
            ]);

            return {
                items,
                totalItems: total,
                totalPages: Math.ceil(total / pageSize),
                currentPage: page,
                pageSize
            };
        } catch (error) {
            throw new Error(`Lỗi lấy ảnh đã tạo: ${error.message}`);
        }
    },

    // GET ảnh đã lưu của user
    async getUserSavedImages(userId, page, pageSize) {
        try {
            const skip = (page - 1) * pageSize;

            const [items, total] = await Promise.all([
                prisma.luu_anh.findMany({
                    where: {
                        nguoi_dung_id: userId
                    },
                    skip,
                    take: pageSize,
                    include: {
                        hinh_anh: {
                            include: {
                                nguoi_dung: {
                                    select: {
                                        nguoi_dung_id: true,
                                        ho_ten: true,
                                        email: true
                                    }
                                }
                            }
                        }
                    },
                    orderBy: {
                        ngay_luu: 'desc'
                    }
                }),
                prisma.luu_anh.count({
                    where: {
                        nguoi_dung_id: userId
                    }
                })
            ]);

            return {
                items,
                totalItems: total,
                totalPages: Math.ceil(total / pageSize),
                currentPage: page,
                pageSize
            };
        } catch (error) {
            throw new Error(`Lỗi lấy ảnh đã lưu: ${error.message}`);
        }
    }
};