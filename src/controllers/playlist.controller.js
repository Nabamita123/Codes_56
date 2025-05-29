import { Playlist } from "../models/playlist.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";

const createPlaylist = asyncHandler(async (req, res) => {
  const { name } = req.body;
  const owner = req.user._id;

  const playlist = await Playlist.create({ name, owner });
  res.status(201).json(new ApiResponse(201, playlist, "Playlist created"));
});
const getUserPlaylists = asyncHandler(async (req, res) => {
  const playlists = await Playlist.find({ owner: req.user._id }).populate("videos");
  res.status(200).json(new ApiResponse(200, playlists));
});
const addVideoToPlaylist = asyncHandler(async (req, res) => {
  const { playlistId } = req.params;
  const { videoId } = req.body;

  const playlist = await Playlist.findOne({ _id: playlistId, owner: req.user._id });
  if (!playlist) throw new ApiError(404, "Playlist not found");

  if (!playlist.videos.includes(videoId)) {
    playlist.videos.push(videoId);
    await playlist.save();
  }

  res.status(200).json(new ApiResponse(200, playlist, "Video added to playlist"));
});
const removeVideoFromPlaylist = asyncHandler(async (req, res) => {
  const { playlistId, videoId } = req.params;

  const playlist = await Playlist.findOne({ _id: playlistId, owner: req.user._id });
  if (!playlist) throw new ApiError(404, "Playlist not found");

  playlist.videos = playlist.videos.filter(
    (v) => v.toString() !== videoId
  );
  await playlist.save();

  res.status(200).json(new ApiResponse(200, playlist, "Video removed from playlist"));
});
const deletePlaylist = asyncHandler(async (req, res) => {
  const { playlistId } = req.params;

  const playlist = await Playlist.findOneAndDelete({
    _id: playlistId,
    owner: req.user._id
  });

  if (!playlist) throw new ApiError(404, "Playlist not found or already deleted");

  res.status(200).json(new ApiResponse(200, null, "Playlist deleted"));
});

export{createPlaylist, getUserPlaylists, addVideoToPlaylist, removeVideoFromPlaylist, deletePlaylist}