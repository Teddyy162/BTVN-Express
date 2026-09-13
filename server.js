import express from 'express';
import rootRouter from './src/routers/root.router.js';
import { appError } from './src/common/helpers/appError.helper.js';

const app = express();

app.use(express.json())

app.use("/api", rootRouter)
app.use(appError)


const PORT = 3069;
app.listen(PORT, ()=> {
    console.log(`server online at localhost:${PORT}`)
})