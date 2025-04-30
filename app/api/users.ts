import { mockUserApi } from "./mock/users";
import { User } from "./mock/users";

// This is the interface that will be used throughout the app
// Replace mockUserApi with real API calls when ready
export const userApi = {
  getUsers: async (): Promise<User[]> => {
    // In future, replace with:
    // const response = await axios.get('/api/users');
    // return response.data;
    return mockUserApi.getUsers();
  },
  getUserById: async (id: number): Promise<User | undefined> => {
    // In future, replace with:
    // const response = await axios.get(`/api/users/${id}`);
    // return response.data;
    return mockUserApi.getUserById(id);
  },
};
