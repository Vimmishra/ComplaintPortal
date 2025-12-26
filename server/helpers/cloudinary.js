// helpers/cloudinary.js
import { v2 as cloudinary } from "cloudinary";

// Configure with environment variables
cloudinary.config({
  cloud_name: "drq3w7hmb",
  api_key: "522129271361339",
  api_secret: "5TdNxYZSy5OomrE-lNg9S8w3DKI",
  secure: true, // optional but recommended
});

// Upload media to Cloudinary
export const uploadMediaToCloudinary = async (filePath) => {
  try {
    const result = await cloudinary.uploader.upload(filePath, {  resource_type: "raw" });
    console.log("☁️ Cloudinary upload successful:", result);
    return result;
  } catch (error) {
    console.error("❌ Cloudinary upload error:", error);
    throw new Error("Error uploading to Cloudinary");
  }
};

// Delete media from Cloudinary
export const deleteMediaFromCloudinary = async (publicId) => {
  try {
    const result = await cloudinary.uploader.destroy(publicId);
    console.log("🗑️ Cloudinary deletion successful:", result);
    return result;
  } catch (error) {
    console.error("❌ Cloudinary deletion error:", error);
    throw new Error("Error deleting media from Cloudinary");
  }
};
