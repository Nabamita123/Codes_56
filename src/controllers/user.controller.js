import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import {User} from "../models/user.model.js";
import {uploadOnCloudinary, extractPublicId,deleteFromCloudinary} from "../utils/cloudinary.js";
import {ApiResponse} from "../utils/ApiResponse.js";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";

const generateAccessandRefreshTokens = async (userId) => {
    try{
      const user =  await User.findById(userId)
      const accessToken = user.generateAccessToken()
      const refreshToken = user.generateRefreshToken()
      user.refreshToken = refreshToken
     await  user.save({validateBeforeSave: false})
     return {accessToken, refreshToken}
    } catch(error){
        throw new ApiError(500,"Something Went Wrong while generating Tokens")
    }
}
const registerUser = asyncHandler( async (req, res)=> {
    //get user data from frontend(postman)
    //validation - not empty
    //check if user already exist
    //check for image, avatar
    //upload to cloudinary,avatar
    //create user object - create entry in db(nosql)
    //remove pass & refresh token from response
    //check for user creation 
    // return res
    const {fullname, email, username, password }= req.body
    //console.log("email:", email);
    if(
        [fullname, email, username, password].some((field)=>
        field?.trim()==="")
    ){
        throw new ApiError(400, "All fields are required")
    }

    const existedUser =await User.findOne({
        $or: [{username},{email}]
    })
    if(existedUser){
        throw new ApiError(409, "User with email or username already exists")
    }

   const avatarLocalPath= req.files?.avatar[0]?.path;
   let coverImageLocalPath="";
   if(req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length>0){
   coverImageLocalPath= req.files.coverImage[0]?.path;
   }
   if(!avatarLocalPath){
    throw new ApiError(400, "Avatar is required")
   }
   
   const avatar = await uploadOnCloudinary(avatarLocalPath)
   const coverImage = await uploadOnCloudinary(coverImageLocalPath)
   if(!avatar){
    throw new ApiError(400,"Avatar is required")
   }
   const user = await User.create({
    fullname,
    avatar: avatar.url,
    coverImage: coverImage?.url || "",
    email,
    password,
    username: username.toLowerCase(),

   })

   const createdUser = await User.findById(user._id).select(
    "-password -refreshToken"
   )

   if(!createdUser){
    throw new ApiError(500,"Something went wrong while registration")
   }

   return res.status(201).json(
    new ApiResponse(200, createdUser, "User Registered Successfully")
    
   )

})
const loginUser = asyncHandler( async(req, res)=>{
    const {email, username, password} = req.body
    if(!username && !email){
        throw new ApiError(400,"username or email is required")
    }

    const user = await User.findOne({
        $or: [{username},{email}]
    })
    if(!user){
        throw new ApiError(404,"User does not exist")
    }
  const isPasswordValid =  await user.isPasswordCorrect(password)
  if(!isPasswordValid){
        throw new ApiError(404,"Incorrect Password")
    }
   const {accessToken, refreshToken} = await generateAccessandRefreshTokens(user._id)
   const loggedInUser = await User.findById(user._id).select("-password -refreshToken")
   const options ={
    httpOnly: true,
    secure : true
   }
   return res.status(200).cookie("accessToken", accessToken,options)
   .cookie("refreshToken", refreshToken,options)
   .json(
    new ApiResponse(200,{
        user: loggedInUser,accessToken, refreshToken
    },
"User logged in successfully")
   )
})
const logoutUser = asyncHandler(async(req,res) =>{
User.findByIdAndUpdate(
await req.user._id,
{
    $set: {
        refreshToken : undefined
    }
},
{
    new: true
}
)
const options = {
    httpOnly: true,
    secure: true
}
return res.status(200).clearCookie("accessToken",options)
.clearCookie("refreshToken",options)
.json(new ApiResponse(200,{},"User Logged out" ))
})

const refreshAccessToken = asyncHandler( async (req, res) =>{
    const incomingRefreshToken=req.cookies.refreshToken|| req.body.refreshToken
    if(!incomingRefreshToken){
        throw new ApiError(401,"Unauthorized request")
    }
    try {
        const decodedToken = jwt.verify(
            incomingRefreshToken,
            process.env.REFRESH_TOKEN_SECRET
        )
        const user = await User.findById(decodedToken._id)
        if(!user){
            throw new ApiError(401," Invalid token")
        }
    
        if(incomingRefreshToken !== user.refreshToken){
            throw new ApiError(401," Refresh Token is expired")
        }
        const options = {
            httpOnly: true,
            secure: true
        }
        const {accessToken, newrefreshToken}=await generateAccessandRefreshTokens(user._id)
        return res.status(200)
        .cookie("accessToken",accessToken,options)
        .cookie("refresToken",newrefreshToken,options)
        .json(
            new ApiResponse(
                200,
                {accessToken,refreshToken: newrefreshToken },
                "Access token refreshed"
    
            )
        )
    } catch (error) {
        throw new ApiError(401,error?.message || "Refresh token renew failed")
    }
})
const changeCurrentPassword = asyncHandler(async(req,res)=>{
    const {oldPassword , newPassword}= req.body
    const user =await User.findById(req.user?._id)
    const isPasswordCorrect = await user.isPasswordCorrect(oldPassword)

    if(!isPasswordCorrect){
        throw new ApiError(400,"Invalid Password")

    }
    user.password = newPassword
    await user.save({validateBeforeSave: false})
    return res.status(200)
    .json(new ApiResponse(200,{}, "Password Changed Successfully"))
})
const getCurrentUser= asyncHandler( async(req,res)=>{
    return res.status(200)
    .json(new ApiResponse(200, req.user,"Current User fetched successfully"))
})

const updateAccountDetails= asyncHandler(async(req,res)=>{
    const { fullname, email}= req.body
    if(!fullname || !email){
        throw new ApiError(400,"All fields are required")
    }
    const user =await User.findByIdAndUpdate(req.user?._id,
       {
        $set: {
            fullname,
            email
        }
       },
       {new: true}
    ).select("-password")
    return res.status(200).json(new ApiResponse(200,user,"Account details updated successfully"))
})
const updateUserAvatar = asyncHandler(async(req,res)=>{
    const avatarLocalPath= req.file?.path
    let user = await User.findById(req.user._id)
    const oldAvatarUrl = user?.avatar
    if(!avatarLocalPath){
        throw new ApiError(400, "Avatar file is missing")
    }
    const avatar = await uploadOnCloudinary(avatarLocalPath)

    if(!avatar.url){
         throw new ApiError(400, "Error while uploading avatar")
    }
     user =await User.findByIdAndUpdate(
        req.user?._id,
        {
            $set :{
                avatar : avatar.url
            }
        },
        {
            new : true
        }
    ).select("-password")
    
    if(oldAvatarUrl){
        const publicId = extractPublicId(oldAvatarUrl)
       if (publicId) {
    const result = await deleteFromCloudinary(publicId);
    if (result.success) {
  console.log("Old avatar deleted successfully");
} 
}
    }

    return res.status(200)
    .json(
        new ApiResponse(200,user ,"Avatar Updated successfully")
    )
})

const updateUserCoverImage= asyncHandler(async(req,res)=>{
    const coverLocalPath= req.file?.path
    let user = await User.findById(req.user._id)
    const oldCoverUrl = user?.coverImage
    if(!coverLocalPath){
        throw new ApiError(400, "cover image file is missing")
    }
    const coverImage = await uploadOnCloudinary(coverLocalPath)
    if(!coverImage.url){
         throw new ApiError(400, "Error while uploading cover image")
    }
     user = await User.findByIdAndUpdate(
        req.user?._id,
        {
            $set :{
                coverImage : coverImage.url
            }
        },
        {
            new : true
        }
    ).select("-password")
     if(oldCoverUrl){
        const publicId = extractPublicId(oldCoverUrl)
       if (publicId) {
    const result = await deleteFromCloudinary(publicId);
    if (result.success) {
  console.log("Old Cover Image deleted successfully");
} 
}
    }
    return res.status(200)
    .json(
        new ApiResponse(200,user ,"Cover Image Updated successfully")
    )
})

const getUserChannelProfile = asyncHandler(async(req,res)=>{
   const{username}= req.params
   if(!username?.trim()){
    throw new ApiError(400, "Username is missing")
   }
   const channel = await User.aggregate([
    {
        $match:{
            username: username?.toLowerCase()

        }
    },
    {
        $lookup:{
            from: "subscriptions",
            localField: "_id",
            foreignField: "channel",
            as: "subscribers"
        }
    },
    {
        $lookup:{
            from: "subscriptions",
            localField: "_id",
            foreignField: "subscriber",
            as: "subscribedTo"
        }
    },
    {
        $addFields:{
            subscribersCount:{
                $size: "$subscribers"
            },
            subscribedToCount:{
                $size: "$subscribedTo"
            },
            isSubscribed:{
                $cond:{
                    if:{$in:[req.user?._id, "$subscribers.subscriber"]},
                    then: true,
                    else: false
                }
            }
        }
    },
    {
        $project:{
            fullname:1,
            username:1,
            subscribersCount:1,
            subscribedToCount:1,
            isSubscribed:1,
            avatar:1,
            coverImage:1
        }
    }
   ])
   if(!channel?.length){
    throw new ApiError(400,"Channel does not exists")
   }
   return res.status(200)
   .json(new ApiResponse(200,channel[0],"User channel fetched successfully"))
})

const getWatchHistory = asyncHandler(async (req,res)=>{
    const user = await User.aggregate([
        {
            $match:{
                
                _id: new mongoose.Types.ObjectId(req.user._id)
            }
        },
        {
            $lookup:{
                from:"videos",
                localField: "watchHistory",
                foreignField:"_id",
                as: "watchHistory",
                pipeline:[
                    {
                        $lookup:{
                            from:"users",
                            localField:"owner",
                            foreignField:"_id",
                            as:"owner",
                            pipeline:[
                                {
                                    $project:{
                                        fullname:1,
                                        username:1,
                                        avatar:1
                                    }
                                }
                            ]
                        }
                    },
                    {
                        $addFields:{
                            owner:{
                                $first: "$owner"
                            }
                        }
                    }
                ]
            }
        }
    ])
    return res.status(200)
    .json(new ApiResponse(200,user[0].watchHistory),"Watch History fetched successfully")
})

export{registerUser,
    loginUser,
    logoutUser,
    refreshAccessToken,
    changeCurrentPassword,
    getCurrentUser,
    updateAccountDetails,
    updateUserAvatar,
    updateUserCoverImage,
    getUserChannelProfile,
    getWatchHistory
}