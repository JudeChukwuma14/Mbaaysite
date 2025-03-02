import { get_one_community } from "@/utils/communityApi"
import { motion, AnimatePresence } from "framer-motion"
import { X } from "lucide-react"
import { useParams } from "react-router-dom"
import { useQuery } from "@tanstack/react-query";

interface DeleteConfirmationModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
}



export default function DeleteConfirmationModal({ isOpen, onClose, onConfirm }: DeleteConfirmationModalProps) {
  
  const {communityid} = useParams()


  const {data:one_community} = useQuery({
    queryKey: ['one_community'],
    queryFn: () => get_one_community(communityid)
  })

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 z-50"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ type: "spring", duration: 0.3 }}
            className="fixed left-1/3 top-1/3 -translate-x-1/2 -translate-y-1/2 min-w-[530px] max-w-md z-50"
          >
            <div className="bg-white rounded-lg shadow-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold">Confirm Deletion</h2>
                <motion.button onClick={onClose} className="text-gray-400 hover:text-gray-500 transition-colors">
                  <X className="w-5 h-5" />
                </motion.button>
              </div>
              <div className="flex items-center justify-center">
              <span className="mr-3">Are you sure you want to delete</span>
              <div className="flex items-center justify-center">
              <h1 className="font-extrabold ">{one_community?.name}</h1>
              <p className="ml-2">community?</p>
              </div>
              </div>
              <div className="flex justify-end gap-4 mt-4">
                <button
                  onClick={onClose}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 hover:bg-gray-300 rounded-lg transition-colors"
                >
                  No
                </button>
                <button
                  onClick={onConfirm}
                  className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors"
                >
                  Yes
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

