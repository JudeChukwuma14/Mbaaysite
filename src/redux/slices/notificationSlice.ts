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
  totalUnreadMessages?: number
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

    appendNotifications: (
      state,
      action: PayloadAction<{ notifications: Notification[]; pagination?: Pagination }>
    ) => {
      const { notifications, pagination } = action.payload
      state.notifications.push(...notifications)
      state.pagination = pagination
    },

    addNotification: (state, action: PayloadAction<Notification>) => {
      state.notifications.unshift(action.payload)
      if (state.pagination) {
        state.pagination.total += 1
      }
    },

    // MARK SINGLE NOTIFICATION AS READ
    markNotificationAsRead: (state, action: PayloadAction<string>) => {
      const notificationIndex = state.notifications.findIndex(n => n._id === action.payload)
      if (notificationIndex !== -1) {
        state.notifications[notificationIndex].isRead = true
      }
    },

    // MARK ALL NOTIFICATIONS AS READ
    markAllNotificationsAsRead: (state) => {
      state.notifications.forEach(notification => {
        notification.isRead = true
      })
    },

    setTotalUnreadMessages: (state, action: PayloadAction<number>) => {
      state.totalUnreadMessages = action.payload
    },

    clearNotifications: (state) => {
      state.notifications = []
      state.pagination = undefined
    },

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
  setTotalUnreadMessages,
  clearNotifications,
  setLoading,
  setError,
} = notificationSlice.actions

export default notificationSlice.reducer