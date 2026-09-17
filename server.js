import express from 'express';
import rootRouter from './src/routers/root.router.js';
import { appError } from './src/common/helpers/appError.helper.js';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { logAPI } from './src/common/middlewares/log-api.middleware.js';
import { appLimit } from './src/common/middlewares/rateLimit.middleware.js';
const app = express();

// app.use((req, res, next) => {
//     res.setHeader("access-control-allow-methods", "GET, POST, PUT, DELETE, PATCH");
//     (res.setHeader("access-control-allow-headers", "Content-Type"),
//     res.setHeader("access-control-allow-origin", "http://localhost:3069"));
//     next();
// });

app.use(cors({
    origin: "http://localhost:3069"
}));

app.use(express.json()); //middleware để parse json dữ liệu json từ client gửi lên server

app.use(cookieParser()); //middleware để parse cookie từ client gửi lên server

app.use(logAPI());

app.use(express.static("public"));//middleware để phục vụ các tệp tĩnh từ thư mục gốc của dự án


app.use("/api", appLimit,rootRouter)
app.use(appError)


const PORT = 3069;
app.listen(PORT, () => {
    console.log(`server online at localhost:${PORT}`)
})
