export const buildQueryPrisma = (req) => {
    let { page, pageSize, filters } = req.query;

    try {
        filters = JSON.parse(filters);
    } catch (error) {
        filters = {};
    }

    Object.entries(filters).forEach(([key, value]) => {
        if (typeof value === "string") {
            filters[key] = {
                contains: value,
            };
        }
    });

    const where = {
        isDeleted: false,
        ...filters,
    }

    const defaultPage = 1;
    const defaultPageSize = 3;

    //chuyển đổi thành số
    page = Number(page);
    pageSize = Number(pageSize);

    //nếu gõ chữ thì chuyển về số
    page = Number(page) || defaultPage;
    pageSize = Number(pageSize) || defaultPageSize;

    //nếu trường hợp là số âm
    if (page < 1) page = defaultPage;
    if (pageSize < 1) pageSize = defaultPageSize;

    //công thức tính chỉ số bắt đầu cho phân trang
    const index = (page - 1) * pageSize;

    return {
        where,
        index,
        page,
        pageSize
    }
}