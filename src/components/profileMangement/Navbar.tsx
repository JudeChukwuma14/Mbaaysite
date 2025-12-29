"use client"

import { Link } from "react-router-dom"
import MobileNavbar from "../ui/MobileNavbar"
import { AnimatePresence, motion } from "framer-motion"
import { useSelector, useDispatch } from "react-redux"
import type { RootState } from "@/redux/store"
import { Bell, X, Check, CheckCheck } from "lucide-react"
import { useState, useEffect } from "react"
import {
  getVendorNotification,
  markOneAsRead,
  markVendorNotificationAsRead,
} from "@/utils/vendorApi"
import {
  setNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
} from "@/redux/slices/notificationSlice"

interface Notification {
  _id: string
  recipient: string
  sender?: {
    _id?: string
    storeName?: string
    name?: string
    email?: string
    avatar?: string
  }
  type: string
  title: string
  message?: string
  isRead: boolean
  createdAt: string
  metadata?: {
    chatId?: string
    reference?: string
    amount?: number
  }
}

const Navbar = () => {
  const [showNotifications, setShowNotifications] = useState(false)
  const [loading, setLoading] = useState(false)

  const { user } = useSelector((state: RootState) => state.user)
  const { vendor } = useSelector((state: RootState) => state.vendor)

  // Correctly get notifications and pagination from Redux
  const { notifications = [] } = useSelector((state: RootState) => state.notifications)

  const dispatch = useDispatch()

  const displayName = user?.name || vendor?.storeName || ""
  const initials = displayName
    ? displayName.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase()
    : ""

  const currentUserId = user?._id || vendor?._id || ""

  const unreadCount = notifications.filter((n: Notification) => !n.isRead).length

  useEffect(() => {
    if (currentUserId) {
      fetchNotifications()
    }
  }, [currentUserId])

  const fetchNotifications = async () => {
    try {
      setLoading(true)
      const response = await getVendorNotification(currentUserId)

      if (response.success && response.data) {
        dispatch(
          setNotifications({
            notifications: response.data.notifications || [],
            pagination: response.data.pagination,
          })
        )
      }
    } catch (error) {
      console.error("Error fetching notifications:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleMarkSingleNotification = async (notificationId: string) => {
    try {
      const response = await markOneAsRead(notificationId, currentUserId)
      if (response.success) {
        dispatch(markNotificationAsRead(notificationId))
      }
    } catch (error) {
      console.error("Error marking notification as read:", error)
    }
  }

  const handleMarkAllNot = async () => {
    try {
      const response = await markVendorNotificationAsRead(currentUserId)
      if (response.success) {
        dispatch(markAllNotificationsAsRead())
      }
    } catch (error) {
      console.error("Error marking all notifications as read:", error)
    }
  }

  const typeBadgeClasses = (type: string) => {
    switch (type?.toLowerCase()) {
      case "order":
        return "bg-blue-100 text-blue-800"
      case "message":
        return "bg-green-100 text-green-800"
      case "alert":
        return "bg-red-100 text-red-800"
      case "info":
        return "bg-yellow-100 text-yellow-800"
      case "system":
        return "bg-purple-100 text-purple-800"
      case "transaction":
        return "bg-indigo-100 text-indigo-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const timeAgo = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000)

    let interval = Math.floor(seconds / 31536000)
    if (interval >= 1) return `${interval} year${interval > 1 ? "s" : ""} ago`

    interval = Math.floor(seconds / 2592000)
    if (interval >= 1) return `${interval} month${interval > 1 ? "s" : ""} ago`

    interval = Math.floor(seconds / 86400)
    if (interval >= 1) return `${interval} day${interval > 1 ? "s" : ""} ago`

    interval = Math.floor(seconds / 3600)
    if (interval >= 1) return `${interval} hour${interval > 1 ? "s" : ""} ago`

    interval = Math.floor(seconds / 60)
    if (interval >= 1) return `${interval} minute${interval > 1 ? "s" : ""} ago`

    return "Just now"
  }

  return (
    <motion.nav
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="bg-[#F3F4F6] w-full fixed z-50 flex items-center justify-between px-6 py-3 lg:px-10"
    >
      <Link to="/" className="flex items-center gap-1">
        <motion.img
          src="https://mbaaysite-6b8n.vercel.app/assets/MBLogo-spwX6zWd.png"
          alt="Logo"
          width={60}
          height={60}
          whileHover={{ scale: 1.1 }}
          transition={{ duration: 0.2 }}
        />
      </Link>

      <div className="flex items-center gap-5">
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-2 rounded-full hover:bg-gray-100 transition-colors"
          >
            <Bell className="text-gray-500" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs text-white animate-pulse">
                {unreadCount}
              </span>
            )}
          </button>

          <AnimatePresence>
            {showNotifications && (
              <motion.div
                initial={{ opacity: 0, y: -10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.95 }}
                className="fixed md:absolute inset-x-4 md:inset-x-auto md:right-0 mt-2 w-auto md:w-80 lg:w-96 bg-white border border-gray-200 rounded-xl shadow-xl overflow-hidden z-50 max-h-[80vh] md:max-h-96"
              >
                <div className="flex items-center justify-between p-4 bg-gray-50 border-b border-gray-100">
                  <div>
                    <h2 className="text-lg font-semibold">Notifications</h2>
                    <p className="text-sm text-gray-500">
                      {unreadCount} unread {unreadCount === 1 ? "notification" : "notifications"}
                    </p>
                  </div>
                  <button
                    onClick={() => setShowNotifications(false)}
                    className="p-1 rounded-full hover:bg-gray-200"
                  >
                    <X className="w-5 h-5 text-gray-500" />
                  </button>
                </div>

                <div className="overflow-y-auto max-h-80">
                  {loading ? (
                    <div className="flex items-center justify-center py-12">
                      <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-orange-500" />
                    </div>
                  ) : notifications.length > 0 ? (
                    notifications.map((notification: Notification) => (
                      <div
                        key={notification._id}
                        className={`group flex items-start gap-3 p-4 border-b border-gray-100 hover:bg-gray-50 transition-all ${
                          !notification.isRead ? "bg-blue-50" : ""
                        }`}
                      >
                        {notification.sender?.avatar ? (
                          <img
                            src={notification.sender.avatar}
                            alt="Avatar"
                            className="w-10 h-10 rounded-full flex-shrink-0"
                          />
                        ) : (
                          <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 text-white font-bold flex-shrink-0">
                            {(notification.sender?.storeName?.[0] ||
                              notification.sender?.name?.[0] ||
                              "N").toUpperCase()}
                          </div>
                        )}

                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <span
                                  className={`text-[10px] px-2 py-0.5 rounded-full ${typeBadgeClasses(
                                    notification.type
                                  )}`}
                                >
                                  {notification.type}
                                </span>
                                {notification.sender && (
                                  <span className="text-xs text-gray-500 truncate">
                                    {notification.sender.storeName ||
                                      notification.sender.name ||
                                      notification.sender.email}
                                  </span>
                                )}
                              </div>
                              <p
                                className={`text-sm font-medium ${
                                  !notification.isRead ? "text-gray-900" : "text-gray-600"
                                }`}
                              >
                                {notification.title}
                              </p>
                              {notification.message && (
                                <p className="text-sm text-gray-600 mt-1">
                                  {notification.message}
                                </p>
                              )}
                              <div className="flex items-center gap-2 mt-2">
                                <span className="text-xs text-gray-400">
                                  {timeAgo(notification.createdAt)}
                                </span>
                                {!notification.isRead && (
                                  <span className="w-2 h-2 bg-blue-500 rounded-full" />
                                )}
                              </div>
                            </div>

                            {!notification.isRead && (
                              <button
                                onClick={() => handleMarkSingleNotification(notification._id)}
                                className="opacity-0 group-hover:opacity-100 p-1.5 rounded-full hover:bg-gray-200"
                                title="Mark as read"
                              >
                                <Check className="w-4 h-4 text-gray-500" />
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="flex flex-col items-center justify-center py-12 text-center">
                      <Bell className="w-12 h-12 text-gray-300 mb-4" />
                      <p className="text-sm text-gray-500">No notifications yet</p>
                    </div>
                  )}
                </div>

                {notifications.length > 0 && unreadCount > 0 && (
                  <div className="p-4 bg-gray-50 border-t border-gray-100">
                    <button
                      onClick={handleMarkAllNot}
                      className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-medium rounded-lg transition-all hover:shadow-lg hover:scale-[1.02]"
                    >
                      <CheckCheck className="w-4 h-4" />
                      Mark All as Read
                    </button>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {initials ? (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="w-10 h-10 bg-orange-500 text-white font-semibold text-sm rounded-full flex items-center justify-center"
            title={displayName}
          >
            {initials}
          </motion.div>
        ) : (
          <Link to="/signin" className="text-sm font-semibold text-orange-500 hover:underline">
            Sign In
          </Link>
        )}

        <div className="lg:hidden">
          <MobileNavbar />
        </div>
      </div>
    </motion.nav>
  )
}

export default Navbar