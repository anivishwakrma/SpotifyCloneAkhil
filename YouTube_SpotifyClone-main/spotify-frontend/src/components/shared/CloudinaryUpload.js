import { openUploadWidget } from "../../utils/CloudinaryService"; // Correct path
 import config from "../../config"; // Ensure config.js exists
 const CloudinaryUpload = ({ setUrl, setName }) => {
  const uploadImageWidget = () => {
    let myUploadWidget = openUploadWidget(
      {
        cloudName: config.CLOUDINARY_CLOUD_NAME, // Use from config.js
        uploadPreset: config.CLOUDINARY_UPLOAD_PRESET, // Use from config.js
      },
      (error, result) => {
        if (!error && result.event === "success") {
          setUrl(result.info.secure_url);
          setName(result.info.original_filename);
        } else if (error) {
          console.error("Upload Error:", error);
        }
      }
    );
    myUploadWidget.open();
  };
  return (
    <button
      className="bg-white text-black rounded-full p-4 font-semibold"
      onClick={uploadImageWidget}
    >
      Upload Image
    </button>
  );
 };
 export default CloudinaryUpload;