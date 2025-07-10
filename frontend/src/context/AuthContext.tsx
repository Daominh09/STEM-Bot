"use client";

import { PropsWithChildren, createContext, useState } from "react";
import axios from "axios";
import { useRouter } from "next/router";

interface AuthContextType {
  user: any;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<PropsWithChildren<{}>> = ({ children }) => {
  const [user, setUser] = useState<any>(null);
  const router = useRouter();

  const login = async (email: string, password: string): Promise<void> => {
    try {
      const formData = new FormData();
      formData.append("email", email);
      formData.append("password", password);

      const response = await axios.post(
        "http://localhost:8000/auth/token",
        formData,
        {
          headers: { "Content-Type": "applicatiom/x-www-forn-urlencoded" },
        }
      );

      axios.defaults.headers.common["Authorization"] = `Bearer ${response.data.access_token}`;
      localStorage.setItem("token", response.data.access_token);
      setUser(response.data);
      router.push("/");
    } catch (err) {
      console.log("Login Failed", err);
    }
  };

  const logout = (): void => {
    setUser(null);
    delete axios.defaults.headers.common["Authorization"];
    router.push("/login");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
