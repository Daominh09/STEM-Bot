"use client";

import { PropsWithChildren, createContext, useEffect, useState } from "react";
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

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      setUser({ access_token: token });
    }
  }, []);

  const login = async (email: string, password: string): Promise<void> => {
    const params = new URLSearchParams();
    params.append("username", email);
    params.append("password", password);

    const response = await axios.post(
      "http://localhost:8000/auth/token",
      params,
      { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
    );

    axios.defaults.headers.common["Authorization"] = `Bearer ${response.data.access_token}`;
    localStorage.setItem("token", response.data.access_token);
    setUser(response.data);
    router.push("/chat");
  };

  const logout = (): void => {
    setUser(null);
    localStorage.removeItem("token");
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
