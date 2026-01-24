export interface Capsule {
  id: string;
  title: string;
  description?: string;
  unlockDate: string; // ISO date string
  createdAt: string; // ISO date string
  status: 'locked' | 'unlocked'; // Changed to match requirements
  isLocked: boolean; // Backend flag indicating if the capsule is locked
}

export interface GetCapsulesResponse {
  success: boolean;
  data: Capsule[];
  message?: string;
}

export async function getCapsules(): Promise<Capsule[]> {
  try {
    // Assuming the backend endpoint is at /api/capsules based on controller
    const res = await fetch("/api/capsules", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      cache: "no-store",
    });

    if (!res.ok) {
      throw new Error("Failed to fetch capsules");
    }

    const json = (await res.json()) as GetCapsulesResponse;
    return json.data ?? [];
  } catch (error) {
    console.error("Error fetching capsules:", error);
    throw error;
  }
}