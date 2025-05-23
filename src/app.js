import express from  "express";
import cors from "cors";
import cookieParser from "cookie-parser";
const app = express()

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}))
//middlewares
app.use(express.json({ limit:"16kb"}))
app.use(express.urlencoded({extended: true , limit:"16kb"}))
app.use(express.static("public"))//for assets ex: files
app.use(cookieParser())

//route import

import userRouter from "./routes/user.routes.js";

//route declaration
app.use("/api/v1/users", userRouter)

export { app }