"use client";

import { MessageCircle, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ChatIconProps {
  onClick: () => void;
  isOpen: boolean;
}

export const ChatIcon = ({ onClick, isOpen }: ChatIconProps) => {
  return (
    <Button
      onClick={onClick}
      className={cn(
        "fixed bottom-5 right-6 z-50 h-14 w-14 rounded-full p-0 mb-20",
        "bg-orange-500 shadow-lg",
        "hover:scale-110 active:scale-95",
        "transition-all duration-300 ease-out",
        "hover:shadow-xl",
        isOpen && "rotate-180"
      )}
      size="icon"
    >
      {isOpen ? (
        <X className="w-6 h-6 text-white transition-transform duration-300" />
      ) : (
        <MessageCircle className="w-6 h-6 text-white transition-transform duration-300" />
      )}
    </Button>
  );
};
