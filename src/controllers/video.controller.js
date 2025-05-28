import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import {User} from "../models/user.model.js";
import {Video} from "../models/video.model.js";
import {uploadOnCloudinary, extractPublicId,deleteFromCloudinary} from "../utils/cloudinary.js";
import {ApiResponse} from "../utils/ApiResponse.js";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";

const uploadVideo = asyncHandler(async(req , res)=>{
    const {title, description } = req.body;
    const user = req.user?._id;
    if(!req.files?.videoFile || !req.files?.thumbnail){
        throw new ApiError(400, "Video and thumbnail are required")
    }
    const videoLocalPath= req.files?.videoFile[0]?.path;
   const thumbnailLocalPath= req.files?.thumbnail[0]?.path;
  
   if(!videoLocalPath){
    throw new ApiError(400, "VideoFile is required")
   }
   if(!thumbnailLocalPath){
    throw new ApiError(400, "Thumbnail is required")
   }
    const videoUrl = await uploadOnCloudinary(videoLocalPath)
    const thumbnailUrl = await uploadOnCloudinary(thumbnailLocalPath)
   const vidDuration = videoUrl.duration;
    const newVideo = await Video.create({
        title,
        description,
        videoFile: videoUrl.secure_url,
        thumbnail: thumbnailUrl.secure_url,
        duration: vidDuration,
        owner: user
    });
    if(!newVideo){
        throw new ApiError(500, "Video couldn't be uploaded")
    }
     return res.status(201).json(
    new ApiResponse(200, newVideo, "Video uploaded Successfully"))
})

export{uploadVideo}