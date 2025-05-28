import {v2 as cloudinary} from "cloudinary";
import fs from "fs";
cloudinary.config({ 
        cloud_name:process.env.CLOUDINARY_CLOUD_NAME, 
        api_key: process.env.CLOUDINARY_CLOUD_KEY, 
        api_secret: process.env.CLOUDINARY_CLOUD_SECRET
    });

const uploadOnCloudinary = async (localFilePath) => {
    try {
        if(!localFilePath) return null
      const response = await cloudinary.uploader.upload(localFilePath, {
            resource_type: "auto"
        })
        //console.log("File uploaded successfully", response.url);
        fs.unlinkSync(localFilePath)
        return response;
    } catch (error) {
        fs.unlinkSync(localFilePath)//if uploading fail
        return null;
    }
}
const extractPublicId = (cloudinaryUrl) => {
    try {
        if (!cloudinaryUrl) return null;

        // Example URL: https://res.cloudinary.com/demo/image/upload/v1234567890/folder/imageName.jpg
         const urlParts = cloudinaryUrl.split("/");
    const filename = urlParts[urlParts.length - 1]; // e.g., md1bd8qlhdxoozfgnkcs.png
    const publicId = filename.split(".")[0];        // remove .png


        return publicId;
    } catch (error) {
        return null;
    }
};
const deleteFromCloudinary = async (publicId) => {
  try {
    if (!publicId) return null;

    const result = await cloudinary.uploader.destroy(publicId, {
      invalidate: true
    });
     if (result.result === "ok") {
      console.log("Cloudinary: Old avatar deleted successfully");
      return { success: true, result };
    } else {
      console.warn("Cloudinary: Failed to delete avatar");
      return { success: false, result };
    }
  } catch (error) {
    console.error("Cloudinary deletion error:", error.message);
    return { success: false, error: error.message };
  }
};


export {uploadOnCloudinary,
    extractPublicId,
    deleteFromCloudinary
}