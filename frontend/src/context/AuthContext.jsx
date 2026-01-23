import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext();
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const checkAuth = async () => {
    try {
      const res = await fetch(`${API_URL}/api/auth/me`, {
        credentials: "include",
      });

      if (res.ok) {
        const data = await res.json();
        setUser(data.user); // must include ProfilePicture
      } else {
        setUser(null);
      }
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser, loading, checkAuth }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
