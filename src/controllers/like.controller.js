import { asyncHandler } from "../utils/asyncHandler.js";
import { Video } from "../models/video.model.js";
import{Like} from "../models/like.model.js"
import {ApiResponse} from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
const toggleLike = asyncHandler(async(req,res)=>{
    const {videoId}= req.params;
    const userId = req.user._id;

  const video = await Video.findById(videoId);
  if (!video) throw new ApiError(404, "Video not found");

  const existingLike = await Like.findOne({ user: userId, video: videoId });

  if (existingLike) {
    await existingLike.deleteOne();
    return res.status(200).json(new ApiResponse(200, null, "Unliked the video"));
  } else {
    await Like.create({ user: userId, video: videoId });
    return res.status(201).json(new ApiResponse(201, null, "Liked the video"));
  }
})


export{toggleLike}