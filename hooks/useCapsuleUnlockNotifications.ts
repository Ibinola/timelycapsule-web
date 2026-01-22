"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import toast from "react-hot-toast";
import { getNotifications } from "@/lib/api/notifications";
import { AppNotification } from "@/lib/types/notifications";

export function useCapsuleUnlockNotifications(pollIntervalMs = 10000) {
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [loading, setLoading] = useState(true);

  const seenIdsRef = useRef<Set<string>>(new Set());

  const unreadCount = useMemo(() => {
    return notifications.filter((n) => n.read === false || n.read === undefined).length;
  }, [notifications]);

  useEffect(() => {
    let timer: NodeJS.Timeout | null = null;
    let cancelled = false;

    const fetchNotifications = async () => {
      try {
        const data = await getNotifications();

        if (cancelled) return;

        // detect new ones for toast
        for (const n of data) {
          if (!seenIdsRef.current.has(n.id)) {
            // new notification detected
            if (n.type === "capsule_unlocked") {
              toast.success(`Capsule unlocked: ${n.capsuleTitle ?? n.capsuleId}`);
            }

            seenIdsRef.current.add(n.id);
          }
        }

        setNotifications(data);
      } catch (err) {
        // optional: silence errors to avoid annoying users
        // console.error(err);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchNotifications();

    timer = setInterval(fetchNotifications, pollIntervalMs);

    return () => {
      cancelled = true;
      if (timer) clearInterval(timer);
    };
  }, [pollIntervalMs]);

  return {
    notifications,
    unreadCount,
    loading,
    setNotifications, // in case you want to mark read locally
  };
}
