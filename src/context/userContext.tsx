// src/context/UserContext.tsx
import React, { createContext, useState, useEffect, ReactNode } from "react";
import axios from "../api/axios";

interface Task {
    id: string;
    description: string;
  }
  
  interface User {
    id: string;
    username: string;
    gmail: string;
    tasks: Task[];
  }

export const UserContext = createContext<User | null>(null);

interface UserProviderProps {
  children: ReactNode;
}

export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get("/profile");
        setUser(response.data.user);
        setLoading(false);
      } catch (error) {
        console.error("Failed to fetch user:", error);
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return <UserContext.Provider value={user}>{children}</UserContext.Provider>;
};

export const useUser = (): User | null => {
    return React.useContext(UserContext);
  };
