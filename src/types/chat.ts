export type MessageType = "text" | "image" | "video" | "file";

export interface Message {
  _id: string;
  chatId: string;
  senderId: string;
  content: string;
  time: string;
  sent: boolean;
  type: MessageType;
  replyTo?: string;
}

export interface Chat {
  _id: string;
  name: string;
  lastMessage?: string;
  time?: string;
  unread: number;
  avatar?: string;
  online: boolean;
  pinned: boolean;
}