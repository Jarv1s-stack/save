import React, { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import styles from "./Login.module.css";
import { useNavigate } from "react-router-dom";
import logo from "../assets/logo.svg";
import emailIcon from "../assets/emailIcon.svg";
import passwordIcon from "../assets/passwordIcon.svg"

export default function Login() {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  async function handleLogin(e) {
    e.preventDefault();
    setError("");
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Ошибка входа");
      login(data.user, data.token);
      navigate("/");
    } catch (e) {
      setError(e.message);
    }
  }

  return (
    <div className={styles.loginWrapper}>
<form className={styles.loginBox} onSubmit={handleLogin}>
        <img style={{width: "200px", height: "auto", marginTop: "-20px"}} src={logo} alt="" />
        <h3>If you have an account, <br />enter your details and go to the site.</h3>
        <label>
          
          Email
          <img className={styles.emailIcon} src={emailIcon} alt="" />
          <input
            className={styles.emailInput}
            type="email"
            autoFocus
            required
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="your email"
          />
        </label>
        <label>
          Пароль
          <img className={styles.passwordIcon} src={passwordIcon} alt="" />
          <div className={styles.passwordField}>
            <input
              className={styles.passwordInput}
              type="text"
              required
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="your password"
            />
          </div>
        </label>
        {error && <div className={styles.error}>{error}</div>}
        <button type="submit" className={styles.loginBtn}>Войти</button>
        <div className={styles.registerLink} onClick={() => navigate("/register")}>
          <p style={{color: "white"}}>else you don't have an account Register</p>
        </div>
      </form>
    </div>
  );
}
