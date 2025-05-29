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
import videoRouter from "./routes/video.routes.js";
import commentRouter from "./routes/comment.routes.js";
import likeRouter from "./routes/like.routes.js";
import subscribeRouter from "./routes/subscribe.routes.js"
import watchHistoryRouter  from "./routes/watchHistory.routes.js";
import adminRouter from "./routes/admin.routes.js";
import playlistRouter from "./routes/playlist.routes.js"
//route declaration
app.use("/api/v1/users", userRouter)
app.use("/api/v1/videos", videoRouter)
app.use("/api/v1/comments",commentRouter)
app.use("/api/v1/likes",likeRouter)
app.use("/api/v1/subscribe", subscribeRouter)
app.use("/api/v1/watchHistory",watchHistoryRouter)
app.use("/api/v1/admin",adminRouter)
app.use("/api/v1/playlist",playlistRouter)
export { app }