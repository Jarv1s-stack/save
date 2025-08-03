import React, { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";


export default function OtherProfile() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const { id } = useParams();
  
  

  const { logout } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setLoading(false);
      return;
    }

    fetch(`http://localhost:5000/api/users/other/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => setUser(data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [id]);


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

    </div>
  );
}
