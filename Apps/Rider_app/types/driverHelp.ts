export type TicketPriority = 'low' | 'medium' | 'high';

export interface SupportTicket {
  id: string;
  category: string;
  subject: string;
  status: string; // 'open' | 'closed' etc.
  priority: TicketPriority;
  is_blocking: boolean;
  created_at: string;
  closed_at: string | null;
  owner_role: string;
  owner_id: string;
  owner_email: string;
}

export interface TicketMessageAttachment {
  id?: string;
  file: string;
  content_type: string;
  original_filename: string;
}

export interface TicketMessage {
  id: string;
  sender_type: 'driver' | 'admin' | string;
  sender_id: number;
  message: string;
  attachments: TicketMessageAttachment[];
  created_at: string;
}

export interface CreateTicketPayload {
  category: string;
  subject: string;
  description: string;
  priority: TicketPriority;
  attachments: string[];
}