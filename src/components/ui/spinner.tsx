import { motion } from "framer-motion";

export function Spinner({ className = "" }: { className?: string }) {
  return (
    <motion.div
      className={`inline-block w-6 h-6 border-2 border-current border-t-transparent rounded-full ${className}`}
      animate={{ rotate: 360 }}
      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
    />
  );
}
