// components/MessageSkeleton.tsx
import { Skeleton } from "@/components/ui/skeleton";

const MessageSkeleton = () => {
  return (
    <div className="p-4 space-y-4">
      {Array.from({ length: 10 }).map((_, index) => (
        <div
          key={index}
          className={`flex ${
            index % 2 === 0 ? "justify-start" : "justify-end"
          }`}
        >
          <div
            className={`max-w-[70%] ${index % 2 === 0 ? "order-1" : "order-2"}`}
          >
            <div
              className={`p-3 rounded-2xl ${
                index % 2 === 0 ? "bg-message-received" : "bg-message-sent"
              }`}
            >
              <Skeleton className="h-4 w-48 mb-2" />
              <div className="flex items-end justify-between">
                <Skeleton className="h-3 w-16" />
                {index % 2 === 1 && (
                  <Skeleton className="h-3 w-3 rounded-full" />
                )}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default MessageSkeleton;
