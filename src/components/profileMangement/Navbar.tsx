"use client";

import { Link } from "react-router-dom";
import MobileNavbar from "../ui/MobileNavbar";
import { AnimatePresence, motion } from "framer-motion";
import { useSelector, useDispatch } from "react-redux";
import type { RootState } from "@/redux/store";
import { Bell, X, Check, CheckCheck } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import {
  getVendorNotification,
  markOneAsRead,
  markVendorNotificationAsRead,
} from "@/utils/allUsersApi";
import {
  setNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
} from "@/redux/slices/notificationSlice";

interface Notification {
  _id: string;
  recipient: string;
  sender?: {
    _id?: string;
    storeName?: string;
    name?: string;
    email?: string;
    avatar?: string;
  };
  type: string;
  title: string;
  message?: string;
  isRead: boolean;
  createdAt: string;
  metadata?: {
    chatId?: string;
    reference?: string;
    amount?: number;
  };
}

type FilterType = "all" | "unread" | "read";

const Navbar = () => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [markingAll, setMarkingAll] = useState(false);
  const [markingSingle, setMarkingSingle] = useState<string | null>(null);
  const [filter, setFilter] = useState<FilterType>("all");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const { user } = useSelector((state: RootState) => state.user);
  const { vendor } = useSelector((state: RootState) => state.vendor);
  const { notifications = [] } = useSelector(
    (state: RootState) => state.notifications
  );

  const dispatch = useDispatch();
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Audio & polling refs
  const audioCtxRef = useRef<AudioContext | null>(null);
  const userPrimedRef = useRef(false);
  const prevIdsRef = useRef<Set<string>>(new Set());
  const prevUnreadRef = useRef<number>(0);
  const pollingIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const recentlyMarkedRef = useRef<Set<string>>(new Set());
  const markAllTimeRef = useRef<number>(0);

  const currentUserId = user?._id || vendor?._id || "";
  const displayName = user?.name || vendor?.storeName || "";
  const initials = displayName
    ? displayName
        .split(" ")
        .map((w) => w[0])
        .join("")
        .slice(0, 2)
        .toUpperCase()
    : "";

  const unreadCount = notifications.filter(
    (n: Notification) => !n.isRead
  ).length;

  // Filtered list
  const filteredNotifications = notifications.filter((n: Notification) => {
    if (filter === "unread") return !n.isRead;
    if (filter === "read") return n.isRead;
    return true;
  });

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setShowNotifications(false);
      }
    };

    if (showNotifications) {
      document.addEventListener("mousedown", handleClickOutside);
      const timeout = setTimeout(() => setShowNotifications(false), 10000);
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
        clearTimeout(timeout);
      };
    }
  }, [showNotifications]);

  // Unlock audio on first user interaction
  useEffect(() => {
    const unlockAudio = async () => {
      if (userPrimedRef.current) return;
      const AudioCtx =
        window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      try {
        const ctx = new AudioCtx();
        const buffer = ctx.createBuffer(1, 1, 22050);
        const source = ctx.createBufferSource();
        source.buffer = buffer;
        source.connect(ctx.destination);
        if (ctx.state === "suspended") await ctx.resume();
        source.start(0);
        audioCtxRef.current = ctx;
        userPrimedRef.current = true;
      } catch {}
    };

    const events = ["pointerdown", "click", "keydown", "touchstart"];
    events.forEach((ev) =>
      window.addEventListener(ev, unlockAudio, { once: true })
    );
    return () =>
      events.forEach((ev) => window.removeEventListener(ev, unlockAudio));
  }, []);

  // Play notification sound
  const playBeep = async () => {
    try {
      const AudioCtx =
        window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx: AudioContext = audioCtxRef.current || new AudioCtx();
      if (ctx.state === "suspended") await ctx.resume();

      const oscillator = ctx.createOscillator();
      const gainNode = ctx.createGain();
      oscillator.type = "square";
      oscillator.frequency.value = 880;
      oscillator.connect(gainNode);
      gainNode.connect(ctx.destination);

      const now = ctx.currentTime;
      gainNode.gain.setValueAtTime(0.0001, now);
      gainNode.gain.exponentialRampToValueAtTime(0.22, now + 0.02);
      oscillator.start(now);
      gainNode.gain.exponentialRampToValueAtTime(0.0001, now + 0.35);
      oscillator.stop(now + 0.4);

      audioCtxRef.current = ctx;
    } catch {}
  };

  // Sound on new notifications
  useEffect(() => {
    if (!notifications.length) return;
    const currentIds = new Set(notifications.map((n) => n._id));
    if (prevIdsRef.current.size === 0) {
      prevIdsRef.current = currentIds;
      return;
    }
    const hasNew = [...currentIds].some((id) => !prevIdsRef.current.has(id));
    if (hasNew) playBeep();
    prevIdsRef.current = currentIds;
  }, [notifications]);

  useEffect(() => {
    if (unreadCount > prevUnreadRef.current) playBeep();
    prevUnreadRef.current = unreadCount;
  }, [unreadCount]);

  // Polling function with protection against reverting marked notifications
  const fetchNotifications = async () => {
    if (!currentUserId) return;

    // If we just marked all notifications, skip this poll
    const timeSinceMarkAll = Date.now() - markAllTimeRef.current;
    if (timeSinceMarkAll < 5000) {
      return;
    }

    try {
      const response = await getVendorNotification(currentUserId);
      if (response.success && response.data) {
        const serverNotifications = response.data.notifications || [];

        // Merge server data with local optimistic updates
        const mergedNotifications = serverNotifications.map(
          (serverNotif: { _id: string }) => {
            // If this notification was recently marked as read locally, keep it read
            if (recentlyMarkedRef.current.has(serverNotif._id)) {
              return { ...serverNotif, isRead: true };
            }
            return serverNotif;
          }
        );

        dispatch(
          setNotifications({
            notifications: mergedNotifications,
            pagination: response.data.pagination,
          })
        );

        // Clean up recently marked IDs after they're confirmed by server
        serverNotifications.forEach((notif: { isRead: any; _id: string }) => {
          if (notif.isRead) {
            recentlyMarkedRef.current.delete(notif._id);
          }
        });

        setErrorMessage(null);
      }
    } catch (error: any) {
      console.error("Error fetching notifications:", error);
      setErrorMessage("Failed to load notifications");
    }
  };

  useEffect(() => {
    if (currentUserId) {
      fetchNotifications();
      pollingIntervalRef.current = setInterval(fetchNotifications, 15000);
    }
    return () => {
      if (pollingIntervalRef.current) clearInterval(pollingIntervalRef.current);
    };
  }, [currentUserId]);

  const handleMarkAllNot = async () => {
    if (markingAll || unreadCount === 0) return;
    try {
      setMarkingAll(true);
      markAllTimeRef.current = Date.now();

      // OPTIMISTIC UPDATE: Update Redux immediately
      dispatch(markAllNotificationsAsRead());

      // Track all current unread notifications
      const unreadIds = notifications
        .filter((n) => !n.isRead)
        .map((n) => n._id);

      unreadIds.forEach((id) => {
        recentlyMarkedRef.current.add(id);
      });

      // Then call API to update server
      const response = await markVendorNotificationAsRead(currentUserId);

      if (!response?.success) {
        // If API fails, clear the tracking and refetch
        recentlyMarkedRef.current.clear();
        await fetchNotifications();
        setErrorMessage("Failed to mark all as read");
      } else {
        setErrorMessage(null);
      }
    } catch (error: any) {
      console.error("Mark all error:", error);
      // On error, clear tracking and refetch
      recentlyMarkedRef.current.clear();
      await fetchNotifications();
      setErrorMessage(
        error?.response?.data?.message || "Failed to mark all as read"
      );
    } finally {
      setMarkingAll(false);
    }
  };

  const handleMarkSingleNotification = async (notificationId: string) => {
    if (markingSingle === notificationId) return;
    try {
      setMarkingSingle(notificationId);

      // Track this notification as recently marked
      recentlyMarkedRef.current.add(notificationId);

      // OPTIMISTIC UPDATE: Update Redux immediately
      dispatch(markNotificationAsRead(notificationId));

      // Then call API to update server
      const response = await markOneAsRead(currentUserId);

      if (!response?.success) {
        // If API fails, remove from tracking and refetch
        recentlyMarkedRef.current.delete(notificationId);
        await fetchNotifications();
        setErrorMessage("Failed to mark as read");
      } else {
        setErrorMessage(null);
      }
    } catch (error: any) {
      console.error("Mark single error:", error);

      // Handle 404 error - notification might not exist anymore
      if (error?.response?.status === 404) {
        // Notification not found - might already be deleted
        // Keep it marked as read in UI since it's gone anyway
        console.log("Notification not found, keeping optimistic update");
        setErrorMessage(null);
      } else {
        // On other errors, remove from tracking and refetch
        recentlyMarkedRef.current.delete(notificationId);
        await fetchNotifications();
        setErrorMessage(
          error?.response?.data?.message || "Failed to mark as read"
        );
      }
    } finally {
      setMarkingSingle(null);
    }
  };

  const typeBadgeClasses = (type: string) => {
    switch (type?.toLowerCase()) {
      case "order":
        return "bg-blue-100 text-blue-800";
      case "message":
        return "bg-green-100 text-green-800";
      case "alert":
        return "bg-red-100 text-red-800";
      case "info":
        return "bg-yellow-100 text-yellow-800";
      case "system":
        return "bg-purple-100 text-purple-800";
      case "transaction":
        return "bg-indigo-100 text-indigo-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const timeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    let interval = Math.floor(seconds / 31536000);
    if (interval >= 1) return `${interval} year${interval > 1 ? "s" : ""} ago`;

    interval = Math.floor(seconds / 2592000);
    if (interval >= 1) return `${interval} month${interval > 1 ? "s" : ""} ago`;

    interval = Math.floor(seconds / 86400);
    if (interval >= 1) return `${interval} day${interval > 1 ? "s" : ""} ago`;

    interval = Math.floor(seconds / 3600);
    if (interval >= 1) return `${interval} hour${interval > 1 ? "s" : ""} ago`;

    interval = Math.floor(seconds / 60);
    if (interval >= 1)
      return `${interval} minute${interval > 1 ? "s" : ""} ago`;

    return "Just now";
  };

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
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-2 rounded-full hover:bg-gray-100 transition-colors cursor-pointer"
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
                {/* Header + Tabs */}
                <div className="p-4 bg-gray-50 border-b border-gray-100">
                  <div className="flex items-center justify-between mb-3">
                    <h2 className="text-lg font-semibold">Notifications</h2>
                    <button
                      onClick={() => setShowNotifications(false)}
                      className="p-1 rounded-full hover:bg-gray-200 cursor-pointer"
                    >
                      <X className="w-5 h-5 text-gray-500" />
                    </button>
                  </div>

                  <div className="flex gap-2 mb-2">
                    {(["all", "unread", "read"] as FilterType[]).map((tab) => (
                      <button
                        key={tab}
                        onClick={() => setFilter(tab)}
                        className={`px-4 py-1.5 rounded-lg text-sm font-medium capitalize transition-all cursor-pointer ${
                          filter === tab
                            ? "bg-orange-500 text-white"
                            : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                        }`}
                      >
                        {tab === "all"
                          ? "All"
                          : tab === "unread"
                          ? `Unread (${unreadCount})`
                          : "Read"}
                      </button>
                    ))}
                  </div>

                  <p className="text-sm text-gray-500">
                    {filteredNotifications.length} {filter} notification
                    {filteredNotifications.length !== 1 ? "s" : ""}
                  </p>

                  {/* Error message */}
                  {errorMessage && (
                    <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded text-red-600 text-sm">
                      {errorMessage}
                    </div>
                  )}
                </div>

                {/* List */}
                <div className="overflow-y-auto max-h-80">
                  {filteredNotifications.length > 0 ? (
                    filteredNotifications.map((notification: Notification) => (
                      <div
                        key={notification._id}
                        onClick={() =>
                          !notification.isRead &&
                          handleMarkSingleNotification(notification._id)
                        }
                        className={`group flex items-start gap-3 p-4 border-b border-gray-100 hover:bg-gray-50 transition-all cursor-pointer ${
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
                            {(
                              notification.sender?.storeName?.[0] ||
                              notification.sender?.name?.[0] ||
                              "N"
                            ).toUpperCase()}
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
                                  !notification.isRead
                                    ? "text-gray-900"
                                    : "text-gray-600"
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
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleMarkSingleNotification(
                                    notification._id
                                  );
                                }}
                                disabled={markingSingle === notification._id}
                                className="opacity-0 group-hover:opacity-100 p-1.5 rounded-full hover:bg-gray-200 cursor-pointer"
                                title="Mark as read"
                              >
                                {markingSingle === notification._id ? (
                                  <div className="w-4 h-4 border-2 border-gray-300 border-t-gray-500 rounded-full animate-spin" />
                                ) : (
                                  <Check className="w-4 h-4 text-gray-500" />
                                )}
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="flex flex-col items-center justify-center py-12 text-center">
                      <Bell className="w-12 h-12 text-gray-300 mb-4" />
                      <p className="text-sm text-gray-500">
                        {filter === "unread"
                          ? "No unread notifications"
                          : filter === "read"
                          ? "No read notifications"
                          : "No notifications yet"}
                      </p>
                    </div>
                  )}
                </div>

                {/* Mark All as Read - Only show when there are unread notifications */}
                {unreadCount > 0 && (
                  <div className="p-4 bg-gray-50 border-t border-gray-100">
                    <button
                      onClick={handleMarkAllNot}
                      disabled={markingAll || unreadCount === 0}
                      className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-medium rounded-lg transition-all hover:shadow-lg hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                    >
                      {markingAll ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          Marking...
                        </>
                      ) : (
                        <>
                          <CheckCheck className="w-4 h-4" />
                          Mark All as Read
                        </>
                      )}
                    </button>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* User Avatar / Sign In */}
        {initials ? (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="w-10 h-10 bg-orange-500 text-white font-semibold text-sm rounded-full flex items-center justify-center cursor-pointer"
            title={displayName}
          >
            {initials}
          </motion.div>
        ) : (
          <Link
            to="/signin"
            className="text-sm font-semibold text-orange-500 hover:underline cursor-pointer"
          >
            Sign In
          </Link>
        )}

        <div className="lg:hidden">
          <MobileNavbar />
        </div>
      </div>
    </motion.nav>
  );
};

export default Navbar;
