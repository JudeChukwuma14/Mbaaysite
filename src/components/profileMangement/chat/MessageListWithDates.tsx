// components/MessageListWithDates.tsx
import DateSeparator from "./DateSeparator";
import { formatMessageDate } from "./dateUtils";
import MessageBubble from "./MessageBubble";

interface Message {
  _id: string;
  content: string;
  images?: string[];
  video?: string;
  time: string;
  timestamp: Date;
  sent: boolean;
  type: "text" | "image" | "video" | "file";
  replyTo?: string;
  isUploading?: boolean;
}

interface MessageListWithDatesProps {
  messages: Message[];
  onDeleteMessage: (messageId: string) => void;
  onEditMessage: (messageId: string, newContent: string) => void;
}

const MessageListWithDates = ({
  messages,
  onDeleteMessage,
  onEditMessage,
}: MessageListWithDatesProps) => {
  const groupedMessages: { date: string; messages: Message[] }[] = [];

  if (messages.length === 0) {
    return null;
  }

  // Group messages by date
  let currentDate = formatMessageDate(messages[0].timestamp);
  let currentGroup: Message[] = [];

  messages.forEach((message, index) => {
    const messageDate = formatMessageDate(message.timestamp);

    if (messageDate !== currentDate) {
      // Push the current group and start a new one
      groupedMessages.push({
        date: currentDate,
        messages: currentGroup,
      });

      currentDate = messageDate;
      currentGroup = [message];
    } else {
      currentGroup.push(message);
    }

    // Push the last group
    if (index === messages.length - 1) {
      groupedMessages.push({
        date: currentDate,
        messages: currentGroup,
      });
    }
  });

  return (
    <div className="space-y-1">
      {groupedMessages.map((group, groupIndex) => (
        <div key={groupIndex}>
          <DateSeparator date={group.date} />
          {group.messages.map((message) => (
            <MessageBubble
              key={message._id}
              message={message}
              onDelete={() => onDeleteMessage(message._id)}
              onEdit={(content) => onEditMessage(message._id, content)}
            />
          ))}
        </div>
      ))}
    </div>
  );
};

export default MessageListWithDates;
