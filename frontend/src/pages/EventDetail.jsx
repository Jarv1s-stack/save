// src/pages/EventDetail.jsx
import React, { useEffect, useState, useContext, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../utils/api";
import { AuthContext } from "../context/AuthContext";
import ChatBox from "../components/ChatBox";
import styles from "./EventDetail.module.css";

export default function EventDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const authContext = useContext(AuthContext);
  let actualUser = authContext?.user;
  if (actualUser?.user) actualUser = actualUser.user;

  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [joinStatus, setJoinStatus] = useState("");

  // проверяем, участвует ли текущий пользователь
  const isParticipant = useMemo(() => {
    if (!event?.participants || !actualUser) return false;
    const userId = String(actualUser.id ?? actualUser.user_id ?? actualUser._id);
    return event.participants
      .map(p => String(p.id ?? p.user_id ?? p._id))
      .includes(userId);
  }, [event, actualUser]);

  // загрузка события
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

  const handleUserClick = (userId) => {
    navigate(`/other/${userId}`);
  };

  if (loading) return <p className={styles.loading}>Загрузка события…</p>;
  if (!event)  return <p className={styles.error}>Событие не найдено.</p>;

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>{event.title}</h1>
      <p className={styles.description}>{event.description}</p>

      {joinStatus && <p className={styles.status}>{joinStatus}</p>}

      <div className={styles.main}>
        <div className={styles.participantsBlock}>
          <h3 className={styles.partHeader}>
            Участники ({event.participants?.length || 0}):
          </h3>

          <div className={styles.flex}>

          {event.participants?.length > 0 ? (
            <ul className={styles.participantsList}>
              {event.participants.map(participant => {
                const isMe = String(participant.id) === String(actualUser.id);
                return (
                  <li
                    key={participant.id}
                    className={styles.participantItem}
                    onClick={() => handleUserClick(participant.id)}
                  >
                    {participant.username}
                    {isMe && <span className={styles.you}>(вы)</span>}
                  </li>
                );
              })}
            </ul>
          ) : (
            <p className={styles.noParticipants}>Нет участников</p>
          )}

          <button
            onClick={isParticipant ? handleLeave : handleJoin}
            className={isParticipant ? styles.leaveBtn : styles.joinBtn}
          >
            {isParticipant ? "Выйти из события" : "Присоединиться"}
          </button>
          </div>
        </div>

        <div className={styles.chatBlock}>
          <ChatBox eventId={id} currentUser={actualUser} />
        </div>
      </div>
    </div>
  );
}
