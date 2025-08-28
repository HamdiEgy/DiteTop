
import { mockUsers, mockCategories, mockMeals, mockSubscriptionPlans, MockUser } from '../data/mockData';
import { Category, Meal, SubscriptionPlan, User, UserRole } from '../types';

const simulateNetwork = <T,>(data: T): Promise<T> => {
  return new Promise(resolve => setTimeout(() => resolve(data), 500));
}

export const api = {
  fetchCategories: (): Promise<Category[]> => simulateNetwork(mockCategories),
  fetchMeals: (): Promise<Meal[]> => simulateNetwork(mockMeals),
  fetchSubscriptionPlans: (): Promise<SubscriptionPlan[]> => simulateNetwork(mockSubscriptionPlans),
  
  login: (email: string, passwordInput: string): Promise<User | null> => {
    const userWithPassword = mockUsers.find(u => u.email.toLowerCase() === email.toLowerCase() && u.password === passwordInput);
    if (userWithPassword) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password, ...userWithoutPassword } = userWithPassword;
      return simulateNetwork(userWithoutPassword);
    }
    return simulateNetwork(null);
  },

  register: (userData: Omit<User, 'id' | 'role'> & { password?: string }): Promise<User | null> => {
    const existingUser = mockUsers.find(u => u.email.toLowerCase() === userData.email.toLowerCase());
    if (existingUser) {
      return simulateNetwork(null); // Email already exists
    }
    
    const newUser: MockUser = {
      id: String(Date.now()), // More unique ID
      ...userData,
      role: UserRole.MEMBER,
    };
    mockUsers.push(newUser);

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...userWithoutPassword } = newUser;
    return simulateNetwork(userWithoutPassword);
  },

  forgotPassword: (email: string): Promise<{ success: boolean }> => {
    const userExists = mockUsers.find(u => u.email.toLowerCase() === email.toLowerCase());
    // In a real app, this would trigger an email. Here, we just acknowledge.
    return simulateNetwork({ success: !!userExists });
  }
};
