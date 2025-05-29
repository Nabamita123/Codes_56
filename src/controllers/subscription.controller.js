import { Subscription } from "../models/subscription.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
const toggleSubscription = asyncHandler(async (req, res) => {
  const subscriberId = req.user._id;
  const channelId = req.params.channelId;

  if (subscriberId.toString() === channelId.toString()) {
    throw new ApiError(400, "You cannot subscribe to yourself");
  }

  const existing = await Subscription.findOne({
    subscriber: subscriberId,
    channel: channelId,
  });

  if (existing) {
    await Subscription.deleteOne({ _id: existing._id });
    return res.status(200).json(
      new ApiResponse(200, null, "Unsubscribed successfully")
    );
  }

  const newSub = await Subscription.create({
    subscriber: subscriberId,
    channel: channelId,
  });

  return res.status(200).json(
    new ApiResponse(200, newSub, "Subscribed successfully")
  );
});

const getSubscriptions = asyncHandler(async (req, res) => {
  const subscriptions = await Subscription.find({ subscriber: req.user._id })
    .populate("channel", "username avatar");

  return res.status(200).json(
    new ApiResponse(200, subscriptions.map(s => s.channel), "Fetched subscriptions")
  );
});
const getSubscribers = asyncHandler(async (req, res) => {
  const subscribers = await Subscription.find({ channel: req.params.channelId })
    .populate("subscriber", "username avatar");

  return res.status(200).json(
    new ApiResponse(200, {
      count: subscribers.length,
      list: subscribers.map(s => s.subscriber),
    }, "Fetched subscriber list")
  );
});


export{toggleSubscription, getSubscriptions,getSubscribers}