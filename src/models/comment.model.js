import mongoose , {Schema} from "mongoose";

const commentSchema = new Schema({
  video: {
    type: Schema.Types.ObjectId,
    ref: "Video",
    required: true
  },
  owner: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  text: {
    type: String,
    required: true,
    trim: true,
  },
}, { timestamps: true });

export const Comment = mongoose.model("Comment", commentSchema);
