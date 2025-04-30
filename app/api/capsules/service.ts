import { mockCapsuleService } from "./mock/service";
import { Capsule } from "./types";

// Switch between mock and real implementation
const USE_MOCK = process.env.NEXT_PUBLIC_USE_MOCK_API === "true";

export const capsuleService = {
  getCapsules: async (): Promise<Capsule[]> => {
    if (USE_MOCK) return mockCapsuleService.getCapsules();
    // TODO: Replace with real API call
    // const response = await fetch('/api/capsules');
    // return response.json();
    return mockCapsuleService.getCapsules();
  },

  getCapsuleById: async (id: number): Promise<Capsule | undefined> => {
    if (USE_MOCK) return mockCapsuleService.getCapsuleById(id);
    // TODO: Replace with real API call
    // const response = await fetch(`/api/capsules/${id}`);
    // return response.json();
    return mockCapsuleService.getCapsuleById(id);
  },

  searchCapsules: async (query: string): Promise<Capsule[]> => {
    if (USE_MOCK) return mockCapsuleService.searchCapsules(query);
    // TODO: Replace with real API call
    // const response = await fetch(`/api/capsules/search?q=${query}`);
    // return response.json();
    return mockCapsuleService.searchCapsules(query);
  },
};
