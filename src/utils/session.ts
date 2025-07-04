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
    store.dispatch(initializeSession());
    sessionId = store.getState().session.sessionId;
  }

  if (!sessionId) {
    throw new Error("Failed to initialize session ID");
  }

  return sessionId;
};

export const setSession = (sessionId: string): void => {
  store.dispatch(setSessionId(sessionId));
};

export const clearSession = (): string => {
  store.dispatch(initializeSession());
  const newSessionId = store.getState().session.sessionId;
  if (!newSessionId) {
    throw new Error("Failed to initialize new session ID");
  }
  return newSessionId;
};
