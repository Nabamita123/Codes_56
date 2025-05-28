import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import {User} from "../models/user.model.js";
import {Video} from "../models/video.model.js";
import {uploadOnCloudinary, extractPublicId,deleteFromCloudinary, deleteFromCloudinaryVideo} from "../utils/cloudinary.js";
import {ApiResponse} from "../utils/ApiResponse.js";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
const getAllVideos = asyncHandler(async (req, res) => {
 const {search , page =1,limit =10}=req.query;
 const filter ={ isPublished: true};
 if(search){
    filter.title= {$regex: search , $options:"i"};
 }
 const videos = await Video.find(filter)
  .populate("owner", "username avatar")
  .sort({ createdAt: -1 })
  .skip((page - 1) * limit)
  .limit(parseInt(limit));
const total = await Video.countDocuments(filter);
return res.status(200).json(
  new ApiResponse(200, { videos, total, page, limit }, "Videos fetched successfully")
);


});
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

const getVideoById = asyncHandler(async(req,res)=>{
    const videoId = req.params.id;
     const video = await Video.findById(videoId).populate('owner', 'username avatar'); 

  if (!video) {
    throw new ApiError(404, "Video Not found")
  }

 return res.status(200).json(
    new ApiResponse(200, video,"Video Fetched by Id")
 )
  });

const getUserVideos = asyncHandler(async (req, res) => {
  const { userId } = req.params;

  const videos = await Video.find({ owner: userId, isPublished: true })
    .sort({ createdAt: -1 })
    .populate("owner", "username avatar");

  if (!videos || videos.length === 0) {
    throw new ApiError(404, "No videos found for this user");
  }

  return res.status(200).json(
    new ApiResponse(200, videos, "Videos fetched successfully for user")
  );
});

const updateVideo = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  const { title, description, isPublished } = req.body;
  const userId = req.user?._id;

  const video = await Video.findById(videoId);

  if (!video) {
    throw new ApiError(404, "Video not found");
  }

  if (video.owner.toString() !== userId.toString()) {
    throw new ApiError(403, "You are not allowed to update this video");
  }

  video.title = title || video.title;
  video.description = description || video.description;
  video.isPublished = isPublished !== undefined ? isPublished : video.isPublished;

  await video.save();

  return res.status(200).json(
    new ApiResponse(200, video, "Video updated successfully")
  );
});

const deleteVideo = asyncHandler(async (req, res) => {
  const { videoId } = req.params;

  const video = await Video.findById(videoId);

  if (!video) {
    throw new ApiError(404, "Video not found");
  }

  // Only the owner can delete the video
  if (video.owner.toString() !== req.user._id.toString()) {
    throw new ApiError(403, "You are not allowed to delete this video");
  }
   const publicVideoId = extractPublicId(video?.videoFile)
       if (publicVideoId) {
    const result = await deleteFromCloudinaryVideo(publicVideoId, "video");
       }
       const publicThumbnailId = extractPublicId(video?.thumbnail)
        if (publicThumbnailId) {
    const result = await deleteFromCloudinary(publicThumbnailId);
       }
// Delete video record from DB
await Video.findByIdAndDelete(videoId);

  return res.status(200).json(
    new ApiResponse(200, null, "Video deleted successfully")
  );
});

const togglePublishVideo = asyncHandler(async (req, res) => {
  const { videoId } = req.params;

  const video = await Video.findById(videoId);

  if (!video) {
    throw new ApiError(404, "Video not found");
  }

  // Check if the current user is the owner of the video
  if (video.owner.toString() !== req.user._id.toString()) {
    throw new ApiError(403, "You are not allowed to change the publish status of this video");
  }

  video.isPublished = !video.isPublished; // toggle the status

  await video.save();

  return res.status(200).json(
    new ApiResponse(200, video, `Video ${video.isPublished ? "Published" : "Unpublished"} successfully`)
  );
});

export{getAllVideos,
    uploadVideo,
    getVideoById,
    getUserVideos,
    updateVideo,
    deleteVideo,
    togglePublishVideo
}