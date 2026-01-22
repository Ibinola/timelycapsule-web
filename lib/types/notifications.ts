export type CapsuleUnlockedNotification = {
  id: string;
  type: "capsule_unlocked";
  capsuleId: string;
  capsuleTitle?: string;
  unlockedAt: string;
  read?: boolean;
};

export type AppNotification = CapsuleUnlockedNotification;
