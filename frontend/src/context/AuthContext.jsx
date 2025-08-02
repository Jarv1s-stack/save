import React, { createContext, useEffect, useState } from "react";
import api from "../utils/api"; // <-- обязательно импортируй свой axios instance

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token") || null);
  const [loading, setLoading] = useState(true);

  // Восстановление пользователя по токену из localStorage при запуске приложения
  useEffect(() => {
    async function fetchUser() {
      if (!token) {
        setUser(null);
        setLoading(false);
        return;
      }
      try {
        // Используй api.get, чтобы токен автоматически добавлялся из interceptors
        const res = await api.get("/auth/me");
        setUser(res.data);
      } catch {
        setUser(null);
        setToken(null);
        localStorage.removeItem("token");
      } finally {
        setLoading(false);
      }
    }
    fetchUser();
  }, [token]);

  // Вход: сохраняет user и token, пишет token в localStorage
  function login(user, token) {
    setUser(user);
    setToken(token);
    localStorage.setItem("token", token);
  }

  // Выход: сбрасывает всё
  function logout() {
    setUser(null);
    setToken(null);
    localStorage.removeItem("token");
  }

  return (
    <AuthContext.Provider value={{ user, token, login, logout, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
