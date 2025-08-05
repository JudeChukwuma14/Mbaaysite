
import { useState } from "react"
import { ChatIcon } from "./ChatIcon"
import { ChatInterface } from "./ChatInterface"

export const ChatWidget = () => {
  const [isOpen, setIsOpen] = useState(false)

  const toggleChat = () => {
    setIsOpen(!isOpen)
  }

  return (
    <>
      {/* Chat Interface */}
      <ChatInterface isOpen={isOpen} onClose={() => setIsOpen(false)} />

      {/* Chat Icon Button */}
      <ChatIcon onClick={toggleChat} isOpen={isOpen} />
    </>
  )
}
