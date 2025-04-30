export interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  joinedDate: string;
  joinedTime: string;
}

// Mock data generator
const generateMockUsers = (count: number): User[] => {
  const users: User[] = [];
  for (let i = 1; i <= count; i++) {
    users.push({
      id: i,
      firstName: "Secret",
      lastName: "Assad User",
      email: "asssa@gmail.com",
      phone: "090 000 0000",
      joinedDate: "21st Mar. 2023",
      joinedTime: "02:04:05",
    });
  }
  return users;
};

// Mock API functions
export const mockUserApi = {
  getUsers: async (): Promise<User[]> => {
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 500));
    return generateMockUsers(57);
  },
  getUserById: async (id: number): Promise<User | undefined> => {
    await new Promise((resolve) => setTimeout(resolve, 500));
    const users = generateMockUsers(57);
    return users.find((user) => user.id === id);
  },
};
