import { createContext, ReactNode, useState, useEffect } from "react";
import axios from "../api/axios";

interface Task {
  id: string;
  title: string;
  description: string;
  status: string; 
  dueDate: string;
}

interface User {
  username: string;
  gmail: string;
  tasks: Task[];
}

interface UserContextType {
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
}

export const UserContext = createContext<UserContextType>({
  user: null,
  setUser: () => {},
});

interface UserContextProviderProps {
  children: ReactNode;
}

export const UserContextProvider = ({ children }: UserContextProviderProps) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    axios.get("/profile").then((res) => {
      setUser(res.data.user);
    }).catch((err) => {
      console.error("Error fetching user profile:", err);
    });
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};
