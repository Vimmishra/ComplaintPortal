import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  

  useEffect(() => {
    const checkAuth = async () => {
      
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/auth/checkAuth`, {
          withCredentials: true,
        });

        if (res.data) {
          setUser(res.data.user);
        } else {
          setUser(null);
        }
      } catch (err) {
        console.error("Auth check failed:", err);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []); // ✅ Run only once on mount

const login = (data) => {
  setUser(data.user);
};
  const logout = async () => {
  try {
    await axios.post(`${import.meta.env.VITE_API_URL}/api/auth/logout`, {}, { withCredentials: true });

    sessionStorage.removeItem("token");
    setUser(null);
  
    
  } catch (err) {
    console.log("Logout error:", err);
  }
};

  const value = { user, login, logout, loading };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
