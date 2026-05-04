import { useState } from "react";
import { useAuth } from "@/context/AuthContext";

export const useGuestAuth = () => {
  const [loading, setLoading] = useState(false);
  const { loginAsGuest } = useAuth();

  const login = async () => {
    try {
      setLoading(true);
      await loginAsGuest();
    } finally {
      setLoading(false);
    }
  };

  return { login, loading };
};