"use client";

import Link from "next/link";
import { AppNotification } from "@/lib/types/notifications";

export default function NotificationItem({
  notification,
  onClick,
}: {
  notification: AppNotification;
  onClick?: () => void;
}) {
  if (notification.type !== "capsule_unlocked") return null;

  const capsuleHref = `/capsules/${notification.capsuleId}`;

  return (
    <Link
      href={capsuleHref}
      onClick={onClick}
      className="block rounded-lg px-3 py-2 hover:bg-gray-50 transition"
    >
      <p className="text-sm font-medium">Capsule unlocked 🎉</p>
      <p className="text-xs text-gray-600">
        {notification.capsuleTitle ?? "View unlocked capsule"}
      </p>
      <p className="text-[11px] text-gray-400 mt-1">
        {new Date(notification.unlockedAt).toLocaleString()}
      </p>
    </Link>
  );
}
