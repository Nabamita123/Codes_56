import mongoose, { Schema } from "mongoose";

const likeSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    video: {
      type: Schema.Types.ObjectId,
      ref: "Video",
      required: true,
    },
  },
  { timestamps: true }
);

//To Ensure a user can like a video only once
likeSchema.index({ user: 1, video: 1 }, { unique: true });

export const Like = mongoose.model("Like", likeSchema);
