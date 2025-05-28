import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import {User} from "../models/user.model.js";
import {Video} from "../models/video.model.js";
import {uploadOnCloudinary, extractPublicId,deleteFromCloudinary, deleteFromCloudinaryVideo} from "../utils/cloudinary.js";
import {ApiResponse} from "../utils/ApiResponse.js";
import {Comment} from "../models/comment.model.js"

const addComment = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  const { text } = req.body;

  if (!text) {
    throw new ApiError(400, "Comment text is required");
  }

  // Check if video exists
  const video = await Video.findById(videoId);
  if (!video) {
    throw new ApiError(404, "Video not found");
  }

  const comment = await Comment.create({
    video: videoId,
    owner: req.user._id,
    text,
  });

  return res.status(201).json(new ApiResponse(201, comment, "Comment added"));
});

const getComments = asyncHandler(async (req, res) => {
  const { videoId } = req.params;

  const comments = await Comment.find({ video: videoId })
    .populate("owner", "username avatar")
    .sort({ createdAt: -1 });

  return res.status(200).json(new ApiResponse(200, comments, "Comments fetched"));
});

const deleteComment = asyncHandler(async (req, res) => {
  const { commentId } = req.params;

  const comment = await Comment.findById(commentId);
  if (!comment) {
    throw new ApiError(404, "Comment not found");
  }

  if (comment.owner.toString() !== req.user._id.toString()) {
    throw new ApiError(403, "You are not allowed to delete this comment");
  }

  await Comment.findByIdAndDelete(commentId);

  return res.status(200).json(new ApiResponse(200, null, "Comment deleted"));
});

export{
    addComment,
    getComments,
    deleteComment
}
