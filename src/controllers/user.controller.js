import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import {User} from "../models/user.model.js";
import {uploadOnCloudinary} from "../utils/cloudinary.js";
import {ApiResponse} from "../utils/ApiResponse.js";
import jwt from "jsonwebtoken";
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
export{registerUser,
    loginUser,
    logoutUser,
    refreshAccessToken
}