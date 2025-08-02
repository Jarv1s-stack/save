import { useEffect, useState, useRef } from "react";
import api from "../utils/api";

export default function ChatBox({ eventId }) {
  const [messages, setMessages] = useState([]);
  const [content, setContent] = useState("");
  const bottomRef = useRef();

  useEffect(() => {
    fetchMessages();
    // eslint-disable-next-line
  }, [eventId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const fetchMessages = async () => {
    try {
      const res = await api.get(`/messages/${eventId}`);
      setMessages(res.data);
    } catch {
      setMessages([]);
    }
  };

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!content.trim()) return;
    try {
      await api.post(`/messages/${eventId}`, { content });
      setContent("");
      fetchMessages();
    } catch {}
  };

  return (
    <div className="chatbox">
      <div className="messages" style={{ maxHeight: 300, overflowY: "auto" }}>
        {messages.map((m, i) => (
          <div key={m.id || i} className="msg">
            <b>{m.username || "User"}: </b>
            <span>{m.content}</span>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>
      <form onSubmit={sendMessage} className="chat-form" style={{ display: "flex", gap: 0, flexDirection: "row", alignItems: "center", justifyContent: "center", marginTop: "15px" }}>
        <input
          value={content}
          onChange={e => setContent(e.target.value)}
          placeholder="Your massage..."
          maxLength={500}
          style={{ width: "300px", borderRadius: "8px", height: "20px", paddingLeft: "10px" }}
        />
        <button style={{ background: "none", border: "white solid 1px", color: "white", fontWeight: "600", height: "23px", borderRadius: "4px", width: "110px" }} type="submit">Enter</button>
      </form>
    </div>
  );
}
