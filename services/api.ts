
import { mockCategories, mockMeals, mockSubscriptionPlans, mockUsers, MockUser } from '../data/mockData';
import { Category, Meal, SubscriptionPlan, User, UserRole } from '../types';

const simulateNetwork = <T,>(data: T): Promise<T> => {
  return new Promise(resolve => setTimeout(() => resolve(data), 500));
}

export const api = {
  fetchCategories: (): Promise<Category[]> => simulateNetwork(mockCategories),
  fetchMeals: (): Promise<Meal[]> => simulateNetwork(mockMeals),
  fetchSubscriptionPlans: (): Promise<SubscriptionPlan[]> => simulateNetwork(mockSubscriptionPlans),
  // FIX: Implement mock authentication methods to resolve errors in AuthContext.
  login: (email: string, password: string): Promise<User | null> => {
    const user = mockUsers.find(u => u.email === email && u.password === password);
    if (user) {
      // Don't send password back to the client side
      const { password: _p, ...userWithoutPassword } = user;
      return simulateNetwork(userWithoutPassword);
    }
    return simulateNetwork(null);
  },

  register: (userData: Omit<User, 'id' | 'role'> & { password?: string }): Promise<User | null> => {
    if (mockUsers.some(u => u.email === userData.email)) {
      // Email already exists
      return simulateNetwork(null);
    }
    const newUser: MockUser = {
      ...userData,
      id: String(mockUsers.length + 1),
      role: UserRole.MEMBER, // Default role for new sign-ups
    };
    mockUsers.push(newUser);
    const { password: _p, ...userWithoutPassword } = newUser;
    return simulateNetwork(userWithoutPassword);
  },
  
  forgotPassword: (email: string): Promise<{ success: boolean }> => {
    console.log(`Password reset requested for ${email}`);
    // In a real app, this would trigger an email.
    // For mock, we'll say it's always successful if user exists to simulate the flow.
    const userExists = mockUsers.some(u => u.email === email);
    return simulateNetwork({ success: userExists });
  },
};
