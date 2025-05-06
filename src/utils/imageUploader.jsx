import React, { useState } from "react";
import { initializeApp } from "firebase/app";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";

const firebaseConfig = {
    apiKey: "AIzaSyCkJk4gi5Z8uTmvdxA-kJUaJJv0BdjMO98",
    authDomain: "automotive-5f3b5.firebaseapp.com",
    projectId: "automotive-5f3b5",
    storageBucket: "automotive-5f3b5.firebasestorage.app",
    messagingSenderId: "958347590694",
    appId: "1:958347590694:web:748f45eb4a170a21a8fae7",
    measurementId: "G-LX9ZPTD8X3"
};

const app = initializeApp(firebaseConfig);
const storage = getStorage(app);

const ImageUploader = ({ onSaveUrl }) => {
  const [uploading, setUploading] = useState(false);
  const [imageUrl, setImageUrl] = useState("");

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
  
    setUploading(true);
    try {
      const storageRef = ref(storage, `victoria-kids-shop/${Date.now()}_${file.name}`);
      await uploadBytes(storageRef, file);
      const url = await getDownloadURL(storageRef);
      setImageUrl(url);
  
      if (onSaveUrl) {
        await onSaveUrl(url);
      }
    } catch (error) {
      console.error("Error uploading image:", error);
    } finally {
      setUploading(false);
    }
  };
  
  return (
    <div className="flex flex-col items-center gap-2">
      <label className="cursor-pointer border-2 border-[#e91e63] text-[#e91e63] px-4 py-2 rounded-lg hover:bg-[#e91e63] hover:text-white transition">
        Upload Image
        <input
          type="file"
          onChange={handleFileChange}
          accept="image/*"
          className="hidden"
        />
      </label>
      {uploading && <p className="text-gray-500">Uploading image...</p>}
      {imageUrl && (
        <div className="mt-2">
          <img src={imageUrl} alt="Uploaded" className="w-36 h-36 object-cover rounded-md" />
        </div>
      )}
    </div>
  );
};

export default ImageUploader; 