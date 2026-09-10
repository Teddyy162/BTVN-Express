import express from 'express';
import rootRouter from './src/routers/root.router.js';

const app = express();

app.use("/api", rootRouter)



const PORT = 3069;
app.listen(PORT, ()=> {
    console.log(`server online at localhost:${PORT}`)
})