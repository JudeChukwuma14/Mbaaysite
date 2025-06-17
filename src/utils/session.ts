// src/utils/session.ts
import { v4 as uuidv4 } from "uuid";

export const getSessionId = (): string => {
  let sessionId = localStorage.getItem("sessionId");
  if (!sessionId) {
    sessionId = uuidv4();
    localStorage.setItem("sessionId", sessionId);
  }
  return sessionId;
};

export const clearSessionId = (): string => {
  const newSessionId = uuidv4();
  localStorage.setItem("sessionId", newSessionId);
  return newSessionId;
};