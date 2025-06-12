import { createContext, ReactNode, useState, useEffect } from "react";
import axios from "../api/axios";
import { User } from "../models/User";

interface UserContextType {
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
  fetchUser: () => Promise<void>;
}

export const UserContext = createContext<UserContextType>({
  user: null,
  setUser: () => {},
  fetchUser: async () => {},
});

interface UserContextProviderProps {
  children: ReactNode;
}

export const UserContextProvider = ({ children }: UserContextProviderProps) => {
  const [user, setUser] = useState<User | null>(null);

  const fetchUser = async () => {
    try {
      console.log("API BASE URL:", import.meta.env.VITE_API_URL);
      const res = await axios.get("/profile");
      setUser(res.data.user);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser, fetchUser }}>
      {children}
    </UserContext.Provider>
  );
};
