// hooks/support/useSupportForm.ts

import {
    ImagePickerFieldRef,
} from "@/components/support/ImagePickerField";
import * as ImagePicker from "expo-image-picker";
import { useEffect, useRef, useState } from "react";

export type SupportPriority = "low" | "medium" | "high";

export const useSupportForm = () => {
    const imagePickerRef = useRef<ImagePickerFieldRef>(null);

    const [category, setCategory] = useState("");
    const [subject, setSubject] = useState("");
    const [description, setDescription] = useState("");
    const [priority, setPriority] =
        useState<SupportPriority>("medium");

    const [attachments, setAttachments] = useState<
        ImagePicker.ImagePickerAsset[]
    >([]);

    // Auto-fill subject when a category is selected
    useEffect(() => {
        if (category && !subject) {
            setSubject(category);
        }
    }, [category]);

    /**
     * Reset the form after a successful ticket submission.
     * Messages are managed separately by useSupportChat.
     */
    const resetForm = () => {
        setCategory("");
        setSubject("");
        setDescription("");
        setPriority("high");
        setAttachments([]);
    };

    /**
     * Open the image picker programmatically.
     */
    const openImagePicker = () => {
        imagePickerRef.current?.openPicker();
    };

    return {
        // Form fields
        category,
        setCategory,

        subject,
        setSubject,

        description,
        setDescription,

        priority,
        setPriority,

        // Images
        attachments,
        setAttachments,

        // Image picker
        imagePickerRef,
        openImagePicker,

        // Helpers
        resetForm,
    };
};

export default useSupportForm;