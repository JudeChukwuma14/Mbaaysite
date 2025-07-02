// src/utils/session.ts
import {
  initializeSession,
  setSessionId,
} from "@/redux/slices/sessionSlice";
import store from "@/redux/store";
export const getSessionId = (): string => {
  const state = store.getState();
  let sessionId = state.session.sessionId;

  if (!sessionId) {
    // Dispatch action to initialize sessionId
    store.dispatch(initializeSession());
    sessionId = store.getState().session.sessionId;
  }

  if (!sessionId) {
    throw new Error("Failed to initialize session ID");
  }

  return sessionId;
};

// Optional: If you need to set a sessionId from the server or elsewhere
export const setSession = (sessionId: string): void => {
  store.dispatch(setSessionId(sessionId));
};

// Optional: If you ever need to clear the sessionId (not used in your case)
export const clearSession = (): string => {
  store.dispatch(initializeSession()); // Generate a new sessionId after clearing
  const newSessionId = store.getState().session.sessionId;
  if (!newSessionId) {
    throw new Error("Failed to initialize new session ID");
  }
  return newSessionId;
};
