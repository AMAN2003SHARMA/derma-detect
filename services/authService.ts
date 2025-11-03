import type { User } from '../types';

const USERS_KEY = 'derma_detect_users';
const SESSION_KEY = 'derma_detect_session';

// Helper to get users from localStorage
const getUsers = (): Record<string, Omit<User, 'email'> & { passwordHash: string }> => {
  const users = localStorage.getItem(USERS_KEY);
  return users ? JSON.parse(users) : {};
};

// Helper to save users to localStorage
const saveUsers = (users: Record<string, any>): void => {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
};

// Simple hashing function for demonstration. 
// In a real app, use a robust library like bcrypt.
const simpleHash = (password: string): string => {
  // This is not secure, for demo purposes only.
  return `hashed_${password}_salted`;
};


export const register = (name: string, email: string, password: string): Promise<User> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => { // Simulate network latency
      const users = getUsers();
      const normalizedEmail = email.toLowerCase();

      if (users[normalizedEmail]) {
        return reject(new Error('An account with this email already exists.'));
      }

      users[normalizedEmail] = {
        name,
        passwordHash: simpleHash(password),
      };

      saveUsers(users);

      const newUser: User = { name, email: normalizedEmail };
      localStorage.setItem(SESSION_KEY, JSON.stringify(newUser));
      resolve(newUser);
    }, 500);
  });
};

export const login = (email: string, password: string): Promise<User> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => { // Simulate network latency
      const users = getUsers();
      const normalizedEmail = email.toLowerCase();
      const userRecord = users[normalizedEmail];

      if (!userRecord || userRecord.passwordHash !== simpleHash(password)) {
        return reject(new Error('Invalid email or password.'));
      }
      
      const loggedInUser: User = { name: userRecord.name, email: normalizedEmail };
      localStorage.setItem(SESSION_KEY, JSON.stringify(loggedInUser));
      resolve(loggedInUser);
    }, 500);
  });
};

export const logout = (): void => {
  localStorage.removeItem(SESSION_KEY);
};

export const getCurrentUser = (): User | null => {
  const session = localStorage.getItem(SESSION_KEY);
  return session ? JSON.parse(session) : null;
};
