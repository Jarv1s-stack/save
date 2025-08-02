import React, { useEffect, useState } from "react";
import lightIcon from "../assets/light.svg";
import darkIcon from "../assets/dark.svg";
import "../theme.css"

export default function ThemeToggle() {
  const [theme, setTheme] = useState(() =>
    localStorage.getItem("theme") || "light"
  );

  useEffect(() => {
    document.body.className = theme;
    localStorage.setItem("theme", theme);
  }, [theme]);

  function toggleTheme() {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  }

  return (
    <button className="theme-toggle" onClick={toggleTheme} aria-label="Тема">
      {theme === "dark" ? <img className="light" src={lightIcon} alt="" /> : <img src={darkIcon} alt="" className="dark"/>}
    </button>
  );
}
