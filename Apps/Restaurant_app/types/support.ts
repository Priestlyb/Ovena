export interface MessageAttachment {
  id: string;
  file: string;
  original_filename: string;
  content_type: string;
  file_size: number;
  created_at: string;
}

export interface Message {
  id: string;
  type: "bot" | "user" | "agent" | "system";

  text: string;
  timestamp: string;

  attachments: MessageAttachment[];
}