import { useState } from "react";

export function useFeedback() {
  const [feedback, setFeedback] = useState({
    visible: false,
    message: "",
    variant: "error" as
      | "success"
      | "error"
      | "warning"
      | "info",
  });

  const showFeedback = (
    message: string,
    variant:
      | "success"
      | "error"
      | "warning"
      | "info",
  ) => {
    setFeedback({
      visible: true,
      message,
      variant,
    });
  };

  return {
    feedback,
    setFeedback,
    showFeedback,
  };
}