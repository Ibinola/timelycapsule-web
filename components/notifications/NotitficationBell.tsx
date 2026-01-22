"use client";

import { useEffect, useRef, useState } from "react";
import { useCapsuleUnlockNotifications } from "@/lib/hooks/useCapsuleUnlockNotifications";
import NotificationDropdown from "./NotificationDropdown";

export default function NotificationBell() {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const { notifications, unreadCount } = useCapsuleUnlockNotifications(10000);

  // close dropdown on outside click
  useEffect(() => {
    function handleOutsideClick(e: MouseEvent) {
      if (!containerRef.current) return;

      if (!containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  return (
    <div ref={containerRef} className="relative">
      <button
        onClick={() => setOpen((prev) => !prev)}
        className="relative rounded-full p-2 hover:bg-gray-100 transition"
        aria-label="Notifications"
      >
        {/* simple bell icon */}
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          className="text-gray-800"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.9 2 2 2Zm6-6V11a6 6 0 0 0-5-5.91V4a1 1 0 1 0-2 0v1.09A6 6 0 0 0 6 11v5l-2 2v1h16v-1l-2-2Z"
            fill="currentColor"
          />
        </svg>

        {/* badge */}
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 text-[11px] font-bold rounded-full bg-red-600 text-white flex items-center justify-center">
            {unreadCount > 99 ? "99+" : unreadCount}
          </span>
        )}
      </button>

      <NotificationDropdown
        open={open}
        notifications={notifications}
        onClose={() => setOpen(false)}
      />
    </div>
  );
}
