import { AppNotification } from "@/lib/types/notifications";

type GetNotificationsResponse = {
  data: AppNotification[];
};

export async function getNotifications(): Promise<AppNotification[]> {
  // ✅ update endpoint here if backend uses a different route
  const res = await fetch("/api/notifications?type=capsule_unlocked", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Failed to fetch notifications");
  }

  const json = (await res.json()) as GetNotificationsResponse;
  return json.data ?? [];
}
