"use client";

import NotificationItem from "./NotificationItem";
import { AppNotification } from "@/lib/types/notifications";

export default function NotificationDropdown({
  open,
  notifications,
  onClose,
}: {
  open: boolean;
  notifications: AppNotification[];
  onClose: () => void;
}) {
  if (!open) return null;

  return (
    <div className="absolute right-0 mt-2 w-80 rounded-xl border bg-white shadow-lg overflow-hidden z-50">
      <div className="flex items-center justify-between px-4 py-3 border-b">
        <p className="text-sm font-semibold">Notifications</p>
        <button
          onClick={onClose}
          className="text-xs text-gray-500 hover:text-gray-800"
        >
          Close
        </button>
      </div>

      <div className="max-h-[360px] overflow-auto p-2">
        {notifications.length === 0 ? (
          <p className="text-sm text-gray-500 px-3 py-6 text-center">
            No notifications yet
          </p>
        ) : (
          <div className="space-y-1">
            {notifications.map((n) => (
              <NotificationItem key={n.id} notification={n} onClick={onClose} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
