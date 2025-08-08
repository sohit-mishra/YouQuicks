import React, { createContext, useEffect, useState } from "react";
import axios from "axios";
import { Progress } from "@/components/ui/progress";

export const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem("payload") || "");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [premium, setPremium] = useState("Free");
  const [role, setRole] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const verifyToken = async () => {
      const localToken = localStorage.getItem("payload");
      if (!localToken) {
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/auth/verify-token`,
          {
            headers: {
              Authorization: `Bearer ${localToken}`,
            },
          }
        );

        if (response.status === 200) {
          setToken(localToken);
          setIsLoggedIn(true);
          setRole(response.data.role || "USER");
          setPremium(response.data.premium || "Free");
        }
      } catch (error) {
        console.error("Token verification failed:", error);
        setIsLoggedIn(false);
        setRole("");
        setPremium("Free");
        localStorage.removeItem("payload");
        setToken("");
      } finally {
        setLoading(false);
      }
    };

    verifyToken();
  }, []);

  useEffect(() => {
    const handleStorageChange = (event) => {
      if (event.key === "payload") {
        const newToken = event.newValue || "";
        setToken(newToken);
        setIsLoggedIn(!!newToken);
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  if (loading) {
    return (
      <div className="w-full p-4">
        <div className="text-center mb-2"></div>
      </div>
    );
  }

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn,
        setIsLoggedIn,
        token,
        setToken,
        role,
        setRole,
        premium,
        setPremium,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
