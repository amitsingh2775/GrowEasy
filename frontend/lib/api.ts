const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'http://192.168.1.43:3000/api';

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

export interface Todo {
  id: string;       
  title: string;
  completed: boolean;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

const mapTodo = (todo: any): Todo => ({
  id: todo._id,          
  title: todo.title,
  completed: todo.completed,
  userId: todo.user,
  createdAt: todo.createdAt,
  updatedAt: todo.updatedAt,
});

export const api = {
  auth: {
    login: async (email: string, password: string): Promise<AuthResponse> => {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Login failed');
      }

      return response.json();
    },

    signup: async (name: string, email: string, password: string): Promise<AuthResponse> => {
      const response = await fetch(`${API_BASE_URL}/auth/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Signup failed');
      }

      const data = await response.json();
      
      return data;
    },

    logout: async (token: string): Promise<void> => {
      await fetch(`${API_BASE_URL}/auth/logout`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
      });
    },

    getProfile: async (token: string): Promise<User> => {
      const response = await fetch(`${API_BASE_URL}/auth/profile`, {
        method: 'GET',
        headers: { 'Authorization': `Bearer ${token}` },
      });

      if (!response.ok) throw new Error('Failed to fetch profile');

      return response.json();
    },
  },

  todos: {
    getAll: async (token: string): Promise<Todo[]> => {
      const response = await fetch(`${API_BASE_URL}/todos`, {
        method: 'GET',
        headers: { 'Authorization': `Bearer ${token}` },
      });

      if (!response.ok) throw new Error('Failed to fetch todos');

      const data = await response.json();
      return data.map(mapTodo);   
    },

    create: async (token: string, title: string): Promise<Todo> => {
      const response = await fetch(`${API_BASE_URL}/todos`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ title, completed: false }),
      });

      if (!response.ok) throw new Error('Failed to create todo');

      const data = await response.json();
      return mapTodo(data);       
    },

    update: async (token: string, id: string, updates: Partial<Todo>): Promise<Todo> => {
      const response = await fetch(`${API_BASE_URL}/todos/${id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updates),
      });

      if (!response.ok) throw new Error('Failed to update todo');

      const data = await response.json();
      return mapTodo(data);       
    },

    toggleComplete: async (token: string, id: string, completed: boolean): Promise<Todo> => {
      const response = await fetch(`${API_BASE_URL}/todos/${id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ completed }),
      });

      if (!response.ok) throw new Error('Failed to toggle todo');

      const data = await response.json();
      return mapTodo(data);       
    },

    delete: async (token: string, id: string): Promise<void> => {
      const response = await fetch(`${API_BASE_URL}/todos/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` },
      });

      if (!response.ok) throw new Error('Failed to delete todo');
    },
  },
};
