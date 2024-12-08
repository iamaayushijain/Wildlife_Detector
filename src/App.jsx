import React, { useState } from "react";
import axios from "axios";

const WildlifeDetector = () => {
  const [image, setImage] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [result, setResult] = useState("");




  const handleUpload = async () => {
    if (!image) {
      alert("Please upload an image.");
      return;
    }

    const formData = new FormData();
    formData.append("image", image);

    setLoading(true);
    try {
      const response = await axios.post("http://127.0.0.1:5000/predict", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setResult(response.data.prediction);
    } catch (error) {
      console.error("Error uploading the image:", error);
      alert("An error occurred while predicting.");
    } finally {
      setLoading(false);
    }
  };



  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(URL.createObjectURL(file));
      setUploading(true);

     
      setTimeout(() => {
        setUploading(false);
        setResult(Result);
      }, 9000); 
    }
  };

  const resetHandler = () => {
    setImage(null);
    setResult("");
    setUploading(false);
  };


  const Result = "Please upload a valid image";


  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-5">
      <h1 className="text-4xl font-bold text-green-600 mb-6">
        Wildlife Detector
      </h1>

      <div className="mb-4">
        <input
          type="file"
          accept="image/*"
          onChange={handleFileUpload}
          disabled={uploading}
          className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-100 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
        />
      </div>

      {image && (
        <div className="mb-6">
          <img
            src={image}
            alt="Uploaded Preview"
            className="w-64 h-64 object-cover rounded-lg shadow-md"
          />
        </div>
      )}

      {uploading && (
        <p className="text-lg text-yellow-500 font-medium">
          Processing your image...
        </p>
      )}

      {result && (
        <div className="p-4 bg-green-100 text-green-700 rounded-lg shadow-md mt-4">
          <h3 className="text-xl font-semibold">Result:</h3>
          <p className="mt-2">{result}</p>
          <button
            onClick={resetHandler}
            className="mt-4 px-4 py-2 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition duration-200"
          >
            Upload Another Image
          </button>
        </div>
      )}
    </div>
  );
};

export default WildlifeDetector;
