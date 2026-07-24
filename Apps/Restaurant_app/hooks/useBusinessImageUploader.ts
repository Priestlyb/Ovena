import { FeedbackFn, UploadResponse, uploadToServer } from "@/services/uploadCore";
import { useCallback, useState } from "react";

export const useBusinessImageUploader = (showFeedback: FeedbackFn) => {
    const [loading, setLoading] = useState(false);

    const uploadImage = useCallback(async (): Promise<UploadResponse> => {
        try {
            setLoading(true);
            return await uploadToServer(showFeedback, "business_image");
        } catch (error: any) {
            console.log("Business image upload error:", error);

            showFeedback(
                error?.message || "Image upload failed. Try again.",
                "error"
            );

            return null;
        } finally {
            setLoading(false);
        }
    }, [showFeedback]);

    return { uploadImage, loading };
};