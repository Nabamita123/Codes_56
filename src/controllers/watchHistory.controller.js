import {asyncHandler} from "../utils/asyncHandler.js";
import { WatchHistory } from "../models/watchHistory.model.js";
import { Video } from "../models/video.model.js";
import {ApiError} from "../utils/ApiError.js";
import {ApiResponse} from "../utils/ApiResponse.js";

// Add or update watch history
const addToHistory = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  const userId = req.user._id;

  const video = await Video.findById(videoId);
  if (!video) {
    throw new ApiError(404, "Video not found");
  }

  const existingHistory = await WatchHistory.findOne({ user: userId, video: videoId });

  if (existingHistory) {
    existingHistory.watchedAt = Date.now();
    await existingHistory.save();
  } else {
    await WatchHistory.create({ user: userId, video: videoId });
  }

  return res.status(200).json(new ApiResponse(200, null, "Watch history updated"));
});

// Get user's watch history
const getWatchHistory = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  const history = await WatchHistory.find({ user: userId })
    .populate("video")
    .sort({ watchedAt: -1 });

  return res.status(200).json(new ApiResponse(200, history));
});

export{getWatchHistory,addToHistory}