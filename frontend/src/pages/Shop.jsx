import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Shop = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetch("/api/shop")
      .then(res => res.json())
      .then(data => {
        setItems(data);
        setLoading(false);
      });
  }, []);

  const handleBuy = async (itemId) => {
    setMessage("");
    const res = await fetch("/api/shop/purchase", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ itemId }),
    });
    const data = await res.json();
    if (data.success){
      setMessage(data.message);
    } 
      
    else return setMessage(data.message || "Ошибка покупки");
  };

  if (loading) return <div>Загрузка товаров...</div>;
  return (
    <div style={{
      display: "grid", gap: 32, gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
      padding: 32, maxWidth: 1100, margin: "0 auto"
    }}>
      {items.map(item => (
        <div key={item.id}
          style={{
            background: "#fff", borderRadius: 18, boxShadow: "0 4px 24px #0001",
            padding: 24, display: "flex", flexDirection: "column", alignItems: "center"
          }}>
          <img src={item.image_url} alt={item.name} style={{ width: 120, height: 120, objectFit: "cover", borderRadius: 14 }} />
          <div style={{ fontWeight: 600, fontSize: 20, marginTop: 10 }}>{item.name}</div>
          <div style={{ color: "#888", margin: "10px 0" }}>{item.description}</div>
          <div style={{ fontWeight: 700, fontSize: 18 }}>{item.price} $</div>
          <button onClick={() => handleBuy(item.id)}
            style={{
              marginTop: 14, background: "#4F46E5", color: "#fff", border: "none",
              borderRadius: 9, padding: "10px 28px", fontSize: 16, fontWeight: 600, cursor: "pointer", transition: "0.2s"
            }}>
            Купить
          </button>
        </div>
      ))}
      {message && (
        <div style={{
          position: "fixed", bottom: 30, left: "50%", transform: "translateX(-50%)",
          background: "#4F46E5", color: "#fff", padding: "12px 26px", borderRadius: 20, fontSize: 17, boxShadow: "0 2px 16px #0003"
        }}>
          {message}
        </div>
      )}
    </div>
  );
};

export default Shop;
