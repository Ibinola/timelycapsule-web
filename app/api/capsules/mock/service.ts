// app/api/capsules/mock/service.ts
import { Capsule } from "../types";

/**
 * Utility function that creates a promise which resolves after the specified delay
 * Used to simulate network latency in mock services
 *
 * @param ms - Time to delay in milliseconds
 * @returns Promise that resolves after the specified delay
 */
const delay = (ms: number): Promise<void> => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

const generateMockCapsules = (count: number): Capsule[] => {
  const types = ["Text", "Image", "Video", "Audio"];
  const statuses: ("Active" | "Expired")[] = ["Active", "Expired"];

  return Array.from({ length: count }, (_, i) => ({
    id: i + 1,
    title: `Capsule ${i + 1}`,
    date: new Date(
      Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000,
    ).toLocaleDateString(),
    receiver: `Receiver ${i + 1}`,
    email: `receiver${i + 1}@example.com`,
    sender: `Sender ${i + 1}`,
    type: types[Math.floor(Math.random() * types.length)],
    expiry: new Date(
      Date.now() + Math.random() * 30 * 24 * 60 * 60 * 1000,
    ).toLocaleString(),
    status: statuses[Math.floor(Math.random() * statuses.length)],
  }));
};

export const mockCapsuleService = {
  getCapsules: async (): Promise<Capsule[]> => {
    await delay(500); // Simulate network delay
    return generateMockCapsules(50); // Generate 50 mock capsules
  },

  getCapsuleById: async (id: number): Promise<Capsule | undefined> => {
    await delay(300);
    const capsules = generateMockCapsules(50);
    return capsules.find((capsule) => capsule.id === id);
  },

  searchCapsules: async (query: string): Promise<Capsule[]> => {
    await delay(600);
    const capsules = generateMockCapsules(50);
    const lowerQuery = query.toLowerCase();
    return capsules.filter(
      (capsule) =>
        capsule.title.toLowerCase().includes(lowerQuery) ||
        capsule.receiver.toLowerCase().includes(lowerQuery) ||
        capsule.sender.toLowerCase().includes(lowerQuery),
    );
  },
};
