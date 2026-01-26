
import { Skeleton } from "@/components/ui/skeleton";

const ChatListSkeleton = () => {
  return (
    <div className="p-4 space-y-4">
      {Array.from({ length: 8 }).map((_, index) => (
        <div key={index} className="flex items-center space-x-3">
          <Skeleton className="h-10 w-10 rounded-full" />
          <div className="space-y-2 flex-1">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-3 w-1/2" />
          </div>
        </div>
      ))}
    </div>
  );
};

export default ChatListSkeleton;