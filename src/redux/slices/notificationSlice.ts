// src/redux/slices/notificationSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export interface Notification {
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

export interface Pagination {
  total: number
  page: number
  limit: number
  totalPages: number
}

export interface NotificationState {
  notifications: Notification[]
  pagination?: Pagination
  loading?: boolean
  error?: string | null
  totalUnreadMessages?: number  // ← For chat unread badge in sidebar
}

const initialState: NotificationState = {
  notifications: [],
  pagination: undefined,
  loading: false,
  error: null,
  totalUnreadMessages: 0,
}

const notificationSlice = createSlice({
  name: 'notifications',
  initialState,
  reducers: {
    // Set full notification list (with pagination)
    setNotifications: (
      state,
      action: PayloadAction<{ notifications: Notification[]; pagination?: Pagination }>
    ) => {
      const { notifications, pagination } = action.payload
      state.notifications = notifications
      state.pagination = pagination
      state.loading = false
      state.error = null
    },

    // Append more notifications (for future "Load More")
    appendNotifications: (
      state,
      action: PayloadAction<{ notifications: Notification[]; pagination?: Pagination }>
    ) => {
      const { notifications, pagination } = action.payload
      state.notifications.push(...notifications)
      state.pagination = pagination
    },

    // Add a single new notification (e.g., real-time)
    addNotification: (state, action: PayloadAction<Notification>) => {
      state.notifications.unshift(action.payload)
      if (state.pagination) {
        state.pagination.total += 1
      }
    },

    // Mark one as read
    markNotificationAsRead: (state, action: PayloadAction<string>) => {
      const notification = state.notifications.find(n => n._id === action.payload)
      if (notification) {
        notification.isRead = true
      }
    },

    // Mark all as read
    markAllNotificationsAsRead: (state) => {
      state.notifications.forEach(n => {
        n.isRead = true
      })
    },

    // Clear all
    clearNotifications: (state) => {
      state.notifications = []
      state.pagination = undefined
    },

    // Set total unread chat messages (for sidebar badge)
    setTotalUnreadMessages: (state, action: PayloadAction<number>) => {
      state.totalUnreadMessages = action.payload
    },

    // Optional loading/error states
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload
    },

    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload
      state.loading = false
    },
  },
})

export const {
  setNotifications,
  appendNotifications,
  addNotification,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  clearNotifications,
  setTotalUnreadMessages,
  setLoading,
  setError,
} = notificationSlice.actions

export default notificationSlice.reducer