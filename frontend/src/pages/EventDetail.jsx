// src/pages/EventDetail.jsx
import React, { useEffect, useState, useContext, useMemo } from "react";
import { useParams } from "react-router-dom";
import api from "../utils/api";
import { AuthContext } from "../context/AuthContext";
import ChatBox from "../components/ChatBox";
import styles from "./EventDetail.module.css";

export default function EventDetail() {
  const { id } = useParams();
  const authContext = useContext(AuthContext);
  let actualUser = authContext?.user;
  if (actualUser?.user) {
    actualUser = actualUser.user;
  }

  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [joinStatus, setJoinStatus] = useState("");

  useEffect(() => {
    console.log("AuthContext value:", authContext);
    console.log("Derived actualUser:", actualUser);
  }, [authContext, actualUser]);

  const isParticipant = useMemo(() => {
    if (!event?.participants || !actualUser) return false;
    const userId = String(actualUser.id ?? actualUser.user_id ?? actualUser._id);
    const participantIds = event.participants.map(p => String(p.id ?? p.user_id ?? p._id));
    const result = participantIds.includes(userId);
    return result;
  }, [event, actualUser]);

  const fetchEvent = async () => {
    setLoading(true);
    try {
      const { data } = await api.get(`/events/${id}`);
      setEvent(data);
    } catch (err) {
      console.error("Ошибка при загрузке события:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvent();
  }, [id]);

  const handleJoin = async () => {
    setJoinStatus("");
    try {
      await api.post(`/events/${id}/join`);
      setJoinStatus("Вы успешно присоединились к событию.");
      await fetchEvent();
    } catch (err) {
      setJoinStatus(
        err.response?.status === 400
          ? "Вы уже участвуете в этом событии."
          : "Ошибка при присоединении. Попробуйте позже."
      );
    }
  };

  const handleLeave = async () => {
    setJoinStatus("");
    try {
      await api.delete(`/events/${id}/leave`);
      setJoinStatus("Вы успешно вышли из события.");
      await fetchEvent();
    } catch (err) {
      setJoinStatus(
        err.response?.status === 400
          ? "Вы не участвуете в этом событии."
          : "Ошибка при выходе из события. Попробуйте позже."
      );
    }
  };

  if (loading) return <p>Загрузка события…</p>;
  if (!event) return <p>Событие не найдено.</p>;

  return (
    <>
    <div style={{ width: 600, margin: "0 auto", padding: "50px 40px", backgroundColor: "#4F46E5", color: "white", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", borderRadius: "20px" }}>
      <h1>{event.title}</h1>
      <p style={{ marginBottom: 20, marginTop: "-10px", textAlign: "center" }}>{event.description}</p>

      {joinStatus && <p style={{ color: "#444cf7", marginTop: 10 }}>{joinStatus}</p>}

    <div style={{ display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "center", width: "100%", marginTop: "10px" }}>
      <div style={{ marginTop: 30, display: "flex", flexDirection: "column", alignItems: "start", justifyContent: "center", width: "100%" }}>
        <h3 style={{marginBottom: "-10px"}} >Участники ({event.participants?.length || 0}):</h3>
        {event.participants?.length > 0 ? (
          <ul>
            {event.participants.map(p => {
              const name =
                p.name || p.username || [p.firstName, p.lastName].filter(Boolean).join(" ") ||
                `ID:${p.id ?? p.user_id ?? p._id}`;
              return (
                <li key={p.id ?? p._id}>
                  {name}{" "}
                  {String(p.id ?? p.user_id ?? p._id) === String(event.ownerId) &&
                    "(организатор)"}
                </li>
              );
            })}
          </ul>
        ) : (
          <p>Нет участников</p>
        )}
      </div>
              {!isParticipant ? (
        <button onClick={handleJoin} style={buttonStyle}>
          Присоединиться
        </button>
      ) : (
        <button
          onClick={handleLeave}
          style={{ ...buttonStyle, background: "#cc2222" }}
        >
          Выйти из события
        </button>
      )}
      </div>
      <div style={{ width: "100%", display: "flex", flexDirection: "column", alignItems: "start", justifyContent: "center", marginTop: "40px", borderTop: "2px solid white", paddingTop: "20px" }}>
      <ChatBox eventId={id} currentUser={actualUser} />
      </div>
    </div>
    </>
  );
}


const buttonStyle = {
  padding: "10px 22px",
  borderRadius: 10,
  border: "none",
  background: "#38DF00",
  color: "#fff",
  fontWeight: 500,
  cursor: "pointer",
  marginBottom: 18,
  width: "150px"
};
