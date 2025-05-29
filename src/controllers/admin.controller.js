import { asyncHandler } from "../utils/asyncHandler.js";
import { User } from "../models/user.model.js";
import { Video } from "../models/video.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Like } from "../models/like.model.js";
import{ Comment } from "../models/comment.model.js";
import { Subscription } from "../models/subscription.model.js";
import { extractPublicId, deleteFromCloudinary,deleteFromCloudinaryVideo } from "../utils/cloudinary.js";
const getAllUsers = asyncHandler(async (req, res) => {
  const users = await User.find().select("-password");
  res.status(200).json(new ApiResponse(200, users));
});

const deleteUser = asyncHandler(async (req, res) => {
  const { userId } = req.params;
  const user = await User.findById(userId);
  if (!user) throw new ApiError(404, "User not found");

   if (user.avatar) {
    const avatarPublicId = extractPublicId(user.avatar);
    await deleteFromCloudinary(avatarPublicId);
  }

  // Delete cover image
  if (user.coverImage) {
    const coverPublicId = extractPublicId(user.coverImage);
    await deleteFromCloudinary(coverPublicId);
  }

  // Delete user's comments & likes
  await Comment.deleteMany({ user: userId });
  await Like.deleteMany({ user: userId });

  // Remove user from all subscriptions
  await Subscription.deleteMany({ subscriber: userId });
  await Subscription.deleteMany({ channel: userId });

  // Delete user's videos & thumbnails
  const videos = await Video.find({ owner: userId });

  for (const video of videos) {
    if (video.videoFile) {
      const videoId = extractPublicId(video.videoFile);
      await deleteFromCloudinaryVideo(videoId);
    }

    if (video.thumbnail) {
      const thumbId = extractPublicId(video.thumbnail);
      await deleteFromCloudinary(thumbId);
    }

    await Video.findByIdAndDelete(video._id);
  }

  // Delete user
  await User.findByIdAndDelete(userId);
  res.status(200).json(new ApiResponse(200, null, "User deleted successfully"));
});

const deleteVideoByAdmin = asyncHandler(async (req, res) => {
  const { videoId } = req.params;

  const video = await Video.findById(videoId);
  if (!video) {
    throw new ApiError(404, "Video not found");
  }
  if(video.thumbnail){
    const tpath = extractPublicId(video.thumbnail)
    await deleteFromCloudinary(tpath)
  }
  if(video.videoFile){
     const vpath = extractPublicId(video.videoFile)
    await deleteFromCloudinaryVideo(vpath)
  }
  await Comment.deleteMany({ video: videoId });
  await Like.deleteMany({ video: videoId });

  await video.deleteOne();

  return res.status(200).json(new ApiResponse(200, null, "Video and all related data deleted by admin"));
});
export{getAllUsers,deleteUser,deleteVideoByAdmin}