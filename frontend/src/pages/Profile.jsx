import React, { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

export default function Profile() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showPasswordForm, setShowPasswordForm] = useState(false); // Стейт для управления видимостью формы
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");

  const { logout } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setLoading(false);
      return;
    }

    fetch("/api/users/me", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => setUser(data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setMessage("");

    if (newPassword !== confirmPassword) {
      setMessage("Новый пароль и подтверждение не совпадают");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const res = await fetch("/api/users/change-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ currentPassword, newPassword }),
      });
      const data = await res.json();

      if (!res.ok) {
        setMessage(data.message || "Ошибка при смене пароля");
      } else {
        setMessage("Пароль успешно изменён");
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
        setShowPasswordForm(false); // Скрываем форму после успешной смены пароля
      }
    } catch (err) {
      console.error(err);
      setMessage("Ошибка при запросе на сервер");
    }
  };

  if (loading) return <div>Загрузка...</div>;

  if (!user) {
    return (
      <div style={{ maxWidth: 480, margin: "40px auto", padding: "20px", background: "#fff", borderRadius: 14, boxShadow: "0 6px 32px #0001" }}>
        <h1>Вы не авторизованы</h1>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 480, margin: "40px auto",color: "white", padding: "20px", background: "#fff", borderRadius: 14, boxShadow: "0 6px 32px #0001", backgroundColor: "#4F46E5", display: "flex", flexDirection: "column", alignItems: "center" }}>                                 

      {user.avatar && (
        <img
          src={`http://localhost:5000${user.avatar}`}
          alt="avatar"
          style={{
            width: 120,
            height: 120,
            borderRadius: "50%",
            objectFit: "cover",
            marginBottom: 16,
          }}
        />
      )}

      <div style={{ marginBottom: 16 }}>
        <strong style={{marginRight: "10px", marginLeft: "-110px"}}>Имя:</strong> {user.username}
      </div>
      <div style={{ marginBottom: 16 }}>
        <strong style={{marginRight: "10px"}}>Email:</strong> {user.email}
      </div>
      <div style={{ marginBottom: 16 }}>
        <strong style={{marginRight: "10px", marginLeft: "-110px"}}>Points:</strong> {user.points}
      </div>

      <div style={{   
        display: "flex",
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        width: "100%",
        height: "auto", 
        gap: "15px"
      }}>

      <button
        onClick={() => {
          logout();
          navigate("/login");
        }}
        style={{
          marginTop: 16,
          padding: "8px 16px",
          background: "#f53d3d",
          color: "#fff",
          border: "none",
          borderRadius: 4,
          cursor: "pointer",
          width: "150px"
        }}
      >
        Log out
      </button>


      <button
        onClick={() => setShowPasswordForm(!showPasswordForm)} // Переключение видимости формы
        style={{
          marginTop: 16,
          padding: "8px 16px",
          background: "#38DF00",
          color: "#fff",
          border: "none",
          borderRadius: 4,
          cursor: "pointer",
          width: "150px"
        }}
      >
        {showPasswordForm ? "Cancel" : "Change Password"}
      </button>
      </div>

      {showPasswordForm && (
        <form onSubmit={handlePasswordChange} style={{ marginTop: 20 }}>
          <div style={{ marginBottom: 16 }}>
            <label>Your Password</label>
            <input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              required
              style={{ padding: "8px", borderRadius: 4, border: "1px solid #ccc" }}
            />
          </div>
          <div style={{ marginBottom: 16 }}>
            <label>New Password</label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              style={{ padding: "8px", borderRadius: 4, border: "1px solid #ccc" }}
            />
          </div>
          <div style={{ marginBottom: 16 }}>
            <label>Submit</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              style={{ padding: "8px", borderRadius: 4, border: "1px solid #ccc" }}
            />
          </div>
          {message && <div style={{ color: message.includes("успеш") ? "green" : "red" }}>{message}</div>}
          <button
            type="submit"
            style={{ padding: "8px 16px", background: "#1e88e5", color: "#fff", border: "none", borderRadius: 4 }}
          >
            Change Password
          </button>
        </form>
      )}
    </div>
  );
}
