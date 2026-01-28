import React, { useState, useCallback, useEffect, useMemo, useRef } from 'react';
import { Link, useLocation, Outlet, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  HeartIcon, 
  ShoppingCartIcon, 
  UserIcon, 
  ChevronDownIcon, 
  ChevronUpIcon, 
  LogOutIcon, 
  Wallet, 
  MessagesSquare, 
  Bell, 
  X, 
  Check, 
  CheckCheck,
  Menu,
  X as CloseIcon
} from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '@/redux/slices/userSlice';
import { clearSessionId } from '@/redux/slices/sessionSlice';
import { 
  setNotifications, 
  markNotificationAsRead, 
  markAllNotificationsAsRead 
} from '@/redux/slices/notificationSlice';
import { getVendorNotification, markVendorNotificationAsRead } from '@/utils/allUsersApi';
import type { RootState } from '@/redux/store';
import type { Notification } from '@/redux/slices/notificationSlice';
import './dashboardLayout.css';

export interface DashboardLayoutProps {
  children?: React.ReactNode;
  searchValue?: string;
  onSearchChange?: (value: string) => void;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({
  children,
  searchValue = '',
  onSearchChange,
}) => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  // Redux state
  const { user } = useSelector((state: RootState) => state.user);
  const { vendor } = useSelector((state: RootState) => state.vendor);
  const { notifications = [] } = useSelector((state: RootState) => state.notifications);
  
  // Local state
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [markingAll, setMarkingAll] = useState(false);
  const [markingSingle, setMarkingSingle] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | 'unread' | 'read'>('all');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  
  // Refs
  const dropdownRef = useRef<HTMLDivElement>(null);
  const sidebarRef = useRef<HTMLDivElement>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const userPrimedRef = useRef(false);
  const prevIdsRef = useRef<Set<string>>(new Set());
  const prevUnreadRef = useRef<number>(0);
  const pollingIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const recentlyMarkedRef = useRef<Set<string>>(new Set());
  const markAllTimeRef = useRef<number>(0);
  
  // User info
  const currentUserId = user?._id || vendor?._id || '';
  const displayName = user?.name || vendor?.storeName || '';
  const userEmail = user?.email || vendor?.email || '';
  const initials = useMemo(() => {
    if (!displayName) return '';
    return displayName
      .split(' ')
      .map(w => w[0])
      .join('')
      .slice(0, 2)
      .toUpperCase();
  }, [displayName]);
  
  // Notifications
  const unreadCount = notifications.filter((n: Notification) => !n.isRead).length;
  const filteredNotifications = useMemo(() => {
    return notifications.filter((n: Notification) => {
      if (filter === 'unread') return !n.isRead;
      if (filter === 'read') return n.isRead;
      return true;
    });
  }, [notifications, filter]);
  
  // Sidebar items
  const sidebarItems = useMemo(() => [
    {
      icons: <UserIcon size={20} />,
      label: 'My Profile',
      urlLink: '/dashboard',
    },
    {
      icons: <HeartIcon size={20} />,
      label: 'My Wishlist',
      urlLink: '/dashboard/wishlist',
    },
    {
      icons: <Wallet size={20} />,
      label: 'Payment',
      urlLink: '/dashboard/checkout',
    },
    {
      icons: <MessagesSquare size={20} />,
      label: 'Messages',
      urlLink: '/dashboard/messages',
      showBadge: unreadCount > 0,
      badgeCount: unreadCount,
    },
    {
      icons: <ShoppingCartIcon size={20} />,
      label: 'Order',
      children: [
        { title: 'Order List', link: '/dashboard/orderlist' },
        { title: 'Cancel Order', link: '/dashboard/cancellation' },
        { title: 'Return Order', link: '/dashboard/returnproduct' },
      ],
    },
  ], [unreadCount]);
  
  // Handlers
  const toggleDropdown = useCallback((label: string) => {
    setOpenDropdown(prev => prev === label ? null : label);
  }, []);
  
  const handleItemClick = useCallback((label: string) => {
    if (openDropdown !== label) {
      setOpenDropdown(null);
    }
  }, [openDropdown]);
  
  const handleLogout = useCallback(() => {
    dispatch(clearSessionId());
    dispatch(logout());
    navigate('/signin');
  }, [dispatch, navigate]);
  
  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setNotificationsOpen(false);
      }
      if (sidebarRef.current && !sidebarRef.current.contains(event.target as Node)) {
        setSidebarOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);
  
  // Audio context setup
  useEffect(() => {
    const unlockAudio = async () => {
      if (userPrimedRef.current) return;
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      try {
        const ctx = new AudioCtx();
        const buffer = ctx.createBuffer(1, 1, 22050);
        const source = ctx.createBufferSource();
        source.buffer = buffer;
        source.connect(ctx.destination);
        if (ctx.state === 'suspended') await ctx.resume();
        source.start(0);
        audioCtxRef.current = ctx;
        userPrimedRef.current = true;
      } catch {}
    };
    
    const events = ['pointerdown', 'click', 'keydown', 'touchstart'];
    events.forEach(ev => window.addEventListener(ev, unlockAudio, { once: true }));
    return () => events.forEach(ev => window.removeEventListener(ev, unlockAudio));
  }, []);
  
  // Notification sound
  const playBeep = useCallback(async () => {
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx: AudioContext = audioCtxRef.current || new AudioCtx();
      if (ctx.state === 'suspended') await ctx.resume();
      
      const oscillator = ctx.createOscillator();
      const gainNode = ctx.createGain();
      oscillator.type = 'square';
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
  }, []);
  
  // Sound on new notifications
  useEffect(() => {
    if (!notifications.length) return;
    const currentIds = new Set(notifications.map((n: Notification) => n._id));
    if (prevIdsRef.current.size === 0) {
      prevIdsRef.current = currentIds;
      return;
    }
    const hasNew = [...currentIds].some(id => !prevIdsRef.current.has(id));
    if (hasNew) playBeep();
    prevIdsRef.current = currentIds;
  }, [notifications, playBeep]);
  
  useEffect(() => {
    if (unreadCount > prevUnreadRef.current) playBeep();
    prevUnreadRef.current = unreadCount;
  }, [unreadCount, playBeep]);
  
  // Fetch notifications
  const fetchNotifications = useCallback(async () => {
    if (!currentUserId) return;
    
    const timeSinceMarkAll = Date.now() - markAllTimeRef.current;
    if (timeSinceMarkAll < 5000) return;
    
    try {
      const response = await getVendorNotification(currentUserId);
      if (response.success && response.data) {
        const serverNotifications = response.data.notifications || [];
        
        const mergedNotifications = serverNotifications.map((serverNotif: Notification) => {
          if (recentlyMarkedRef.current.has(serverNotif._id)) {
            return { ...serverNotif, isRead: true };
          }
          return serverNotif;
        });
        
        dispatch(setNotifications({
          notifications: mergedNotifications,
          pagination: response.data.pagination,
        }));
        
        serverNotifications.forEach((notif: Notification) => {
          if (notif.isRead) {
            recentlyMarkedRef.current.delete(notif._id);
          }
        });
        
        setErrorMessage(null);
      }
    } catch (error: any) {
      console.error('Error fetching notifications:', error);
      setErrorMessage('Failed to load notifications');
    }
  }, [currentUserId, dispatch]);
  
  // Polling for notifications
  useEffect(() => {
    if (currentUserId) {
      fetchNotifications();
      pollingIntervalRef.current = setInterval(fetchNotifications, 15000);
    }
    return () => {
      if (pollingIntervalRef.current) clearInterval(pollingIntervalRef.current);
    };
  }, [currentUserId, fetchNotifications]);
  
  const handleMarkAllNotifications = useCallback(async () => {
    if (markingAll || unreadCount === 0) return;
    
    try {
      setMarkingAll(true);
      markAllTimeRef.current = Date.now();
      
      dispatch(markAllNotificationsAsRead());
      
      const unreadIds = notifications
        .filter((n: Notification) => !n.isRead)
        .map(n => n._id);
      
      unreadIds.forEach(id => {
        recentlyMarkedRef.current.add(id);
      });
      
      const response = await markVendorNotificationAsRead(currentUserId);
      
      if (!response?.success) {
        recentlyMarkedRef.current.clear();
        await fetchNotifications();
        setErrorMessage('Failed to mark all as read');
      } else {
        setErrorMessage(null);
      }
    } catch (error: any) {
      console.error('Mark all error:', error);
      recentlyMarkedRef.current.clear();
      await fetchNotifications();
      setErrorMessage(error?.response?.data?.message || 'Failed to mark all as read');
    } finally {
      setMarkingAll(false);
    }
  }, [markingAll, unreadCount, notifications, currentUserId, dispatch, fetchNotifications]);
  
  const handleMarkSingleNotification = useCallback(async (notificationId: string) => {
    if (markingSingle === notificationId) return;
    
    try {
      setMarkingSingle(notificationId);
      recentlyMarkedRef.current.add(notificationId);
      dispatch(markNotificationAsRead(notificationId));
      
      const response = await markVendorNotificationAsRead(currentUserId);
      
      if (!response?.success) {
        recentlyMarkedRef.current.delete(notificationId);
        await fetchNotifications();
        setErrorMessage('Failed to mark as read');
      } else {
        setErrorMessage(null);
      }
    } catch (error: any) {
      console.error('Mark single error:', error);
      
      if (error?.response?.status === 404) {
        console.log('Notification not found, keeping optimistic update');
        setErrorMessage(null);
      } else {
        recentlyMarkedRef.current.delete(notificationId);
        await fetchNotifications();
        setErrorMessage(error?.response?.data?.message || 'Failed to mark as read');
      }
    } finally {
      setMarkingSingle(null);
    }
  }, [markingSingle, currentUserId, dispatch, fetchNotifications]);
  
  const typeBadgeClasses = useCallback((type: string) => {
    switch (type?.toLowerCase()) {
      case 'order': return 'bg-blue-100 text-blue-800';
      case 'message': return 'bg-green-100 text-green-800';
      case 'alert': return 'bg-red-100 text-red-800';
      case 'info': return 'bg-yellow-100 text-yellow-800';
      case 'system': return 'bg-purple-100 text-purple-800';
      case 'transaction': return 'bg-indigo-100 text-indigo-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  }, []);
  
  const timeAgo = useCallback((dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    let interval = Math.floor(seconds / 31536000);
    if (interval >= 1) return `${interval} year${interval > 1 ? 's' : ''} ago`;
    
    interval = Math.floor(seconds / 2592000);
    if (interval >= 1) return `${interval} month${interval > 1 ? 's' : ''} ago`;
    
    interval = Math.floor(seconds / 86400);
    if (interval >= 1) return `${interval} day${interval > 1 ? 's' : ''} ago`;
    
    interval = Math.floor(seconds / 3600);
    if (interval >= 1) return `${interval} hour${interval > 1 ? 's' : ''} ago`;
    
    interval = Math.floor(seconds / 60);
    if (interval >= 1) return `${interval} minute${interval > 1 ? 's' : ''} ago`;
    
    return 'Just now';
  }, []);
  
  const isActive = useCallback((path: string) => {
    return location.pathname === path || location.pathname.startsWith(path + '/');
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#f2fcf7] via-[#fcfcfc] to-white text-[#101828] flex">
      {/* Sidebar */}
      <aside
        ref={sidebarRef}
        className={`sidebar-panel fixed inset-y-0 left-0 z-40 w-[250px] flex flex-col overflow-y-auto border-r border-[#E4E7EC] bg-white px-4 pt-6 pb-8 shadow-sm transition-transform duration-300 ease-[cubic-bezier(.4,.0,.2,1)] will-change-transform
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}
      >
        <div className="flex items-center gap-3 mb-8">
          <Link to="/">
            <motion.img
              src="https://mbaaysite-6b8n.vercel.app/assets/MBLogo-spwX6zWd.png"
              alt="Logo"
              width={60}
              height={60}
              whileHover={{ scale: 1.1 }}
              transition={{ duration: 0.2 }}
            />
          </Link>
        </div>
        
        <nav className="space-y-2 flex-1">
          {sidebarItems.map((item) => {
            const hasChildren = item.children && item.children.length > 0;
            
            return (
              <div key={item.label} className="relative">
                {item.urlLink ? (
                  <Link
                    to={item.urlLink}
                    onClick={() => {
                      setSidebarOpen(false);
                      handleItemClick(item.label);
                    }}
                    className={`group relative flex items-center justify-between gap-3 rounded-xl px-4 py-3 font-medium transition
                      ${isActive(item.urlLink) 
                        ? 'bg-orange-50 text-orange-600' 
                        : 'text-[#093154] hover:bg-orange-50/60 hover:text-orange-600'
                      }`}
                  >
                    <div className="flex items-center gap-3">
                      {item.icons}
                      <span>{item.label}</span>
                    </div>
                    
                    {item.showBadge && item.badgeCount && item.badgeCount > 0 && (
                      <span className="flex items-center justify-center min-w-5 h-5 px-1.5 text-xs font-bold text-white bg-red-500 rounded-full">
                        {item.badgeCount > 99 ? '99+' : item.badgeCount}
                      </span>
                    )}
                    
                    {isActive(item.urlLink) && (
                      <span className="absolute left-0 top-1/2 -translate-y-1/2 h-10 w-[6px] rounded-full bg-orange-500" />
                    )}
                  </Link>
                ) : (
                  <motion.div
                    onClick={() => toggleDropdown(item.label)}
                    className={`group flex items-center justify-between gap-3 cursor-pointer rounded-xl px-4 py-3 font-medium transition
                      ${openDropdown === item.label 
                        ? 'bg-orange-50 text-orange-600' 
                        : 'text-[#093154] hover:bg-orange-50/60 hover:text-orange-600'
                      }`}
                    whileHover={{ scale: 1.02 }}
                  >
                    <div className="flex items-center gap-3">
                      {item.icons}
                      <span>{item.label}</span>
                    </div>
                    
                    {hasChildren && (
                      <span className="transition-transform">
                        {openDropdown === item.label ? (
                          <ChevronUpIcon size={16} />
                        ) : (
                          <ChevronDownIcon size={16} />
                        )}
                      </span>
                    )}
                  </motion.div>
                )}
                
                {hasChildren && (
                  <AnimatePresence>
                    {openDropdown === item.label && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="pl-12 mt-1 space-y-1 overflow-hidden"
                      >
                        {item.children?.map((child) => (
                          <Link
                            key={child.title}
                            to={child.link}
                            onClick={() => setSidebarOpen(false)}
                            className={`flex items-center px-3 py-2 rounded-lg text-sm transition-colors
                              ${isActive(child.link)
                                ? 'bg-orange-100 text-orange-600'
                                : 'hover:bg-orange-50 text-gray-600'
                              }`}
                          >
                            {child.title}
                          </Link>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                )}
              </div>
            );
          })}
        </nav>
        
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 mt-auto px-4 py-3 rounded-xl hover:bg-orange-50 text-[#093154] hover:text-orange-600 transition-colors"
        >
          <LogOutIcon size={20} />
          <span className="font-medium">Logout</span>
        </button>
      </aside>

      {/* Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/30 backdrop-blur-[2px]"
          onClick={() => setSidebarOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Main content */}
      <div className="flex min-h-screen flex-1 flex-col">
        <header className="sticky top-0 z-20 bg-white/90 backdrop-blur-md border-b border-[#E4E7EC]">
          <div className="mx-auto flex h-[70px] w-full items-center px-4">
            <button
              onClick={() => setSidebarOpen((o) => !o)}
              aria-label={sidebarOpen ? 'Close navigation menu' : 'Open navigation menu'}
              className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-orange-500 text-white shadow hover:bg-orange-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-500/40 transition-colors"
            >
              {sidebarOpen ? <CloseIcon size={20} /> : <Menu size={20} />}
            </button>
            
            {/* Search bar */}
            {onSearchChange && (
              <div className="relative flex-1 hidden md:block ml-6">
                <input
                  value={searchValue}
                  onChange={(e) => onSearchChange(e.target.value)}
                  placeholder="Search anything"
                  className="w-full max-w-md rounded-lg border border-[#AFC7B9] bg-white pl-10 pr-3 py-2 text-sm focus:border-orange-400 focus:ring-2 focus:ring-orange-400/30 outline-none transition"
                />
                <svg
                  className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#98A2B3]"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.2-5.2" />
                  <circle cx="11" cy="11" r="7" />
                </svg>
              </div>
            )}
            
            {/* Right section */}
            <div className="ml-auto flex items-center gap-4">
              {/* Notifications */}
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setNotificationsOpen((o) => !o)}
                  className="relative inline-flex h-12 w-12 items-center justify-center rounded-full border border-[#AFC7B9] bg-white text-[#093154] hover:text-orange-600 hover:border-orange-400 transition"
                  aria-label="Notifications"
                >
                  <Bell size={20} />
                  {unreadCount > 0 && (
                    <span className="absolute top-2 right-2 inline-flex items-center justify-center rounded-full bg-red-500 text-white text-[10px] leading-none h-4 px-1 font-semibold">
                      {unreadCount}
                    </span>
                  )}
                </button>
                
                <AnimatePresence>
                  {notificationsOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -10, scale: 0.95 }}
                      className="fixed md:absolute inset-x-4 md:inset-x-auto md:right-0 mt-2 w-auto md:w-80 lg:w-96 bg-white border border-gray-200 rounded-xl shadow-xl overflow-hidden z-50 max-h-[80vh] md:max-h-96"
                    >
                      <div className="p-4 bg-gray-50 border-b border-gray-100">
                        <div className="flex items-center justify-between mb-3">
                          <h2 className="text-lg font-semibold">Notifications</h2>
                          <button
                            onClick={() => setNotificationsOpen(false)}
                            className="p-1 rounded-full hover:bg-gray-200"
                          >
                            <X className="w-5 h-5 text-gray-500" />
                          </button>
                        </div>
                        
                        <div className="flex gap-2 mb-2">
                          {(['all', 'unread', 'read'] as const).map((tab) => (
                            <button
                              key={tab}
                              onClick={() => setFilter(tab)}
                              className={`px-4 py-1.5 rounded-lg text-sm font-medium capitalize transition-all
                                ${filter === tab
                                  ? 'bg-orange-500 text-white'
                                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                }`}
                            >
                              {tab === 'all' ? 'All' : tab === 'unread' ? `Unread (${unreadCount})` : 'Read'}
                            </button>
                          ))}
                        </div>
                        
                        <p className="text-sm text-gray-500">
                          {filteredNotifications.length} {filter} notification{filteredNotifications.length !== 1 ? 's' : ''}
                        </p>
                        
                        {errorMessage && (
                          <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded text-red-600 text-sm">
                            {errorMessage}
                          </div>
                        )}
                      </div>
                      
                      <div className="overflow-y-auto max-h-80">
                        {filteredNotifications.length > 0 ? (
                          filteredNotifications.map((notification: Notification) => (
                            <div
                              key={notification._id}
                              onClick={() => !notification.isRead && handleMarkSingleNotification(notification._id)}
                              className={`group flex items-start gap-3 p-4 border-b border-gray-100 hover:bg-gray-50 transition-all cursor-pointer
                                ${!notification.isRead ? 'bg-blue-50' : ''}`}
                            >
                              {notification.sender?.avatar ? (
                                <img
                                  src={notification.sender.avatar}
                                  alt="Avatar"
                                  className="w-10 h-10 rounded-full flex-shrink-0"
                                />
                              ) : (
                                <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 text-white font-bold flex-shrink-0">
                                  {(notification.sender?.storeName?.[0] || notification.sender?.name?.[0] || 'N').toUpperCase()}
                                </div>
                              )}
                              
                              <div className="flex-1 min-w-0">
                                <div className="flex items-start justify-between gap-4">
                                  <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-1">
                                      <span className={`text-[10px] px-2 py-0.5 rounded-full ${typeBadgeClasses(notification.type)}`}>
                                        {notification.type}
                                      </span>
                                      {notification.sender && (
                                        <span className="text-xs text-gray-500 truncate">
                                          {notification.sender.storeName || notification.sender.name || notification.sender.email}
                                        </span>
                                      )}
                                    </div>
                                    <p className={`text-sm font-medium ${!notification.isRead ? 'text-gray-900' : 'text-gray-600'}`}>
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
                                        handleMarkSingleNotification(notification._id);
                                      }}
                                      disabled={markingSingle === notification._id}
                                      className="opacity-0 group-hover:opacity-100 p-1.5 rounded-full hover:bg-gray-200"
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
                              {filter === 'unread' ? 'No unread notifications' : 
                               filter === 'read' ? 'No read notifications' : 
                               'No notifications yet'}
                            </p>
                          </div>
                        )}
                      </div>
                      
                      {unreadCount > 0 && (
                        <div className="p-4 bg-gray-50 border-t border-gray-100">
                          <button
                            onClick={handleMarkAllNotifications}
                            disabled={markingAll || unreadCount === 0}
                            className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-medium rounded-lg transition-all hover:shadow-lg hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
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
              
              {/* User profile */}
              {initials ? (
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 bg-orange-500 text-white font-semibold text-sm rounded-full flex items-center justify-center">
                    {initials}
                  </div>
                  <div className="hidden md:flex flex-col text-left leading-tight">
                    <span className="text-sm font-bold text-[#091E42]">{displayName}</span>
                    <span className="text-[12px] text-[#505F79]">{userEmail}</span>
                  </div>
                </div>
              ) : (
                <Link
                  to="/signin"
                  className="text-sm font-semibold text-orange-500 hover:underline"
                >
                  Sign In
                </Link>
              )}
            </div>
          </div>
        </header>
        
        <main className="flex-1 p-4 md:p-6 overflow-y-auto">
          {children ? children : <Outlet />}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;