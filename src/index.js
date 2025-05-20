import dotenv from "dotenv";
// import mongoose from "mongoose";
// import { DB_NAME } from "./constants";
import connectDb from "./db/index.js";

dotenv.config({
    path: './env'
})

connectDb()
.then(() =>{
    app.listen(process.env.PORT || 8000 ,()=>{
        console.log(`Server is running at port : ${process.env.PORT}`);
    })
})
.catch((error) =>{
    console.log("Mongodb connection failed !",error)
})





























// ( async () => {
//     try {
//        await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
//     } catch (error) {
//         console.error("Error", error)
//         throw err
//         }
// })()
