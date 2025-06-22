"use client";

import { createContext, useContext, useState } from "react";

// Notification context to manage notification state
const NotificationContext = createContext(undefined);

export function NotificationProvider({ children }) {
  const [notification, setNotification] = useState(null);

  const showNotification = (message, type) => {
    const id = Date.now();
    setNotification({ message, type, id });
    setTimeout(() => {
      setNotification((current) => (current?.id === id ? null : current));
    }, 3000); // Remove notification after 3 seconds
  };

  return (
    <NotificationContext.Provider value={{ showNotification }}>
      {children}
      {notification && (
        <div className="toast toast-bottom toast-end z-[100]">
          <div className={`alert ${getAlertClass(notification.type)}`}>
            <span>{notification.message}</span>
          </div>
        </div>
      )}
    </NotificationContext.Provider>
  );
}

// Helper function to map notification type to a class
function getAlertClass(type) {
  switch (type) {
    case "success":
      return "alert-success";
    case "error":
      return "alert-error";
    case "warning":
      return "alert-warning";
    case "info":
    default:
      return "alert-info";
  }
}

// Custom hook to access the notification context
export function useNotification() {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error("useNotification must be used within a NotificationProvider");
  }
  return context;
}
