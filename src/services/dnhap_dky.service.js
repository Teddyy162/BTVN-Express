import { prisma } from "../common/prisma/connect.prisma.js";
import { BadRequestException, UnauthorizedException } from "../common/helpers/exception.helper.js";
import bcrypt from "bcrypt";
import { tokenService } from "./token.service.js";

export const dnhap_dkyService = {
    async register(req) {
        const { email, mat_khau, ho_ten } = req.body;

        //kiểm tra email đã được đăng chưa
        const userExit = await prisma.nguoi_dung.findUnique({
            where: {
                email: email,
            }
        });
        //nếu đăng ký rồi -> từ chối đăng ký nữa
        if (userExit) {
            throw new BadRequestException("Tài khoản đã được đăng ký");
        }


        //nếu chưa đăng ký -> thực hiện đăng ký người dùng mới
        //sử dụng bcrypt để mã hóa mật khẩu
        const hashPassword = bcrypt.hashSync(mat_khau, 10); //băm ra 10 lần

        const newUser = await prisma.nguoi_dung.create({
            data: {
                email: email,
                mat_khau: hashPassword,
                ho_ten: ho_ten,
            }
        });
        return true;
    },

    async login(req) {
        const { email, mat_khau } = req.body;

        //kiểm tra email có tồn tại không
        const userExit = await prisma.nguoi_dung.findUnique({
            where: {
                email: email,
            },
            omit: {
                mat_khau: false
            }
        });
        //chưa -> yêu cầu đăng ký
        if (!userExit) {
            // throw new BadRequestException("Tài khoản không chính xác");
            throw new BadRequestException("Email chưa được đăng ký. Vui lòng đăn ký tài khoản mới");
        }

        //đã đăng ký -> xử lý logic đăng nhập
        const isPasswordValid = bcrypt.compareSync(mat_khau, userExit.mat_khau);

        if (!isPasswordValid) {
            // throw new BadRequestException("Tài khoản không chính xác.");
            throw new BadRequestException("Mật khẩu không chính xác");
        }

        const accessToken = tokenService.createAccessToken(userExit.nguoi_dung_id);

        const refreshToken = tokenService.createRefreshToken(userExit.nguoi_dung_id);

        return { accessToken: accessToken, refreshToken: refreshToken };
    },

    async getUserInfo(req) {
        const user = req.nguoi_dung
        return user;
    },

    async refreshToken(req) {
        const { accessToken, refreshToken } = req.cookies;

        if (!accessToken || !refreshToken) {
            throw new BadRequestException("Vui lòng đăng nhập để tiếp tục");
        }

        //giải mã accessToken và refreshToken để kiểm tra tính hợp lệ và lấy thông tin người dùng
        const decodeAccessToken = tokenService.verifyAccessToken(accessToken, { ignoreExpiration: true });

        //giải mã refreshToken để kiểm tra tính hợp lệ và lấy thông tin người dùng
        const decodeRefreshToken = tokenService.verifyRefreshToken(refreshToken);

        //so sánh thông tin người dùng trong accessToken và refreshToken để đảm bảo tính hợp lệ
        //VÀ TẠI SAO CHỖ NÀY LẠI .userID là do bên token.service.js khi tạo token, payload chứa { userID: nguoi_dung_id }
        if (decodeAccessToken.userID !== decodeRefreshToken.userID) {
            throw new UnauthorizedException("Token không hợp lệ");
        };
        
        //kiểm tra xem người dùng có tồn tại trong cơ sở dữ liệu hay không
        const userExist = await prisma.nguoi_dung.findUnique({
            where: {
                nguoi_dung_id: decodeRefreshToken.userID
            }
        });

        //nếu người dùng không tồn tại trong cơ sở dữ liệu, ném ra ngoại lệ
        if (!userExist) {
            throw new UnauthorizedException("Người dùng không tồn tại");
        }

        //tạo accessToken mới dựa trên thông tin từ refreshToken
        const newAccessToken = tokenService.createAccessToken(userExist.nguoi_dung_id);

        //thời hạn refreshtoken là 1 ngày

        //nếu trả về 1 cặp token mới
        //refreshToken sẽ luôn được làm mới, login của người dùng sẽ luôn duy trì
        //nếu trong 1 ngày người dùng k sử dụng -> logout

        // chỉ trả về accesstoken mới
        //sau khi refreshtoken hết hạn, người dùng sẽ phải đăng nhập lại
        return {
            accessToken: newAccessToken,
            refreshToken: refreshToken
        };
    },
};