import { useState } from "react";

export const useImageUpload = () => {
  const [productImage, setProductImage] = useState<{ uri: string } | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);

  const handleImageUpload = () => {
    setUploadProgress(0);

    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setProductImage({ uri: "https://via.placeholder.com/150" });
          return 100;
        }
        return prev + 20;
      });
    }, 300);
  };

  const removeImage = () => {
    setProductImage(null);
    setUploadProgress(0);
  };

  return {
    productImage,
    uploadProgress,
    handleImageUpload,
    removeImage,
  };
};