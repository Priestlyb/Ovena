import {
  FeedbackFn,
  UploadResponse,
  uploadToServer,
} from "@/services/uploadCore";
import { useCallback, useState } from "react";

export const useBusinessLogoUploader = (showFeedback: FeedbackFn) => {
  const [loading, setLoading] = useState(false);

  const uploadLogo = useCallback(async (): Promise<UploadResponse> => {
    try {
      setLoading(true);
      return await uploadToServer(showFeedback, "business_logo");
    } catch (error: any) {
      console.log("Business logo upload error:", error);

      showFeedback(error?.message || "Logo upload failed. Try again.", "error");

      return null;
    } finally {
      setLoading(false);
    }
  }, [showFeedback]);

  return { uploadLogo, loading };
};
