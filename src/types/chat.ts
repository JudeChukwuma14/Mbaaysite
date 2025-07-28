export interface Message {
  id: string;
  content: string;
  sender: string;
  timestamp: string;
  isVendor: boolean;
  files?: {
    type: "image" | "document" | "video";
    url: string;
    name: string;
    size: number;
    duration?: string;
  }[];
  replyTo?: string;
  isPinned?: boolean;
  isEdited?: boolean;
  deletedFor: "none" | "me" | "everyone";
}

export interface Chat {
  id: string;
  name: string;
  avatar: string;
  lastMessage: string;
  timestamp: string;
  isVendor: boolean;
  isOnline: boolean;
  messages: Message[];
  pinnedMessages: {
    messageId: string;
    unpinTimestamp: number;
  }[];
}

export interface UserOrVendor {
  id: string;
  name: string;
  avatar: string;
  isVendor: boolean;
}

export interface DeleteDialogState {
  isOpen: boolean;
  messageId: string | null;
}

export interface VideoPlayerState {
  isOpen: boolean;
  videoUrl: string | null;
}

export interface MediaGalleryState {
  isOpen: boolean;
  files: Message["files"] | null;
  startIndex: number;
}

export interface PinDurationDialogState {
  isOpen: boolean;
  messageId: string | null;
}