// components/DateSeparator.tsx
import { cn } from "@/lib/utils";

interface DateSeparatorProps {
  date: string;
  className?: string;
}

const DateSeparator = ({ date, className }: DateSeparatorProps) => {
  return (
    <div className={cn("flex justify-center my-4", className)}>
      <div className="bg-gray-200 dark:bg-gray-700 px-3 py-1 rounded-full text-xs text-gray-600 dark:text-gray-300">
        {date}
      </div>
    </div>
  );
};

export default DateSeparator;