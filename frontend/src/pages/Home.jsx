import React, { useEffect, useState, useContext } from "react";
import styles from "./Home.module.css";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import createEvent from "../assets/createEvent.svg";

export default function Home() {
  const { token } = useContext(AuthContext);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetch("/api/events")
      .then(res => res.json())
      .then(data => setEvents(Array.isArray(data) ? data : []))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className={styles.homeWrapper}>
      <div className={styles.headerBar}>
        <h1>Events List</h1>
        <button
          className={styles.createBtn}
          onClick={() => navigate("/create-event")}
          title="Создать событие"
        >
          <img src={createEvent} alt="Создать" height={22} />
          Create Event
        </button>
      </div>
      {loading ? (
        <div className={styles.loading}>Загрузка...</div>
      ) : events.length === 0 ? (
        <div className={styles.empty}>Нет событий</div>
      ) : (
        <div className={styles.grid}>
          {events.map(event => (
            <div
              className={styles.card}
              key={event.id}
              onClick={() => navigate(`/events/${event.id}`)}
              title="Подробнее"
            >
              <div className={styles.title}>{event.title}</div>
              <div className={styles.date}>
                {new Date(event.date).toLocaleString()}
              </div>
              <div className={styles.desc}>{event.description}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
