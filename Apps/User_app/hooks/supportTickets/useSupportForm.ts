import { useState } from "react";
import * as ImagePicker from "expo-image-picker";

import { TicketPriority } from "@/src/types/support";

export const useSupportForm = () => {
  const [category, setCategory] = useState("general");
  const [subject, setSubject] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] =
    useState<TicketPriority>("high");

  const [attachments, setAttachments] = useState<
    ImagePicker.ImagePickerAsset[]
  >([]);

  const resetForm = () => {
    setCategory("General");
    setSubject("");
    setDescription("");
    setPriority("high");
    setAttachments([]);
  };

  const isValid =
    !!category &&
    subject.trim().length > 0 &&
    description.trim().length > 0;

  return {
    // State
    category,
    subject,
    description,
    priority,
    attachments,

    // Derived state
    isValid,

    // Setters
    setCategory,
    setSubject,
    setDescription,
    setPriority,
    setAttachments,

    // Helpers
    resetForm,
  };
};