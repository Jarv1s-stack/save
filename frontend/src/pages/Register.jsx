import React, { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import styles from "./Register.module.css";
import { useNavigate } from "react-router-dom";
import logo from "../assets/logo.svg";
import emailIcon from "../assets/emailIcon.svg";
import passwordIcon from "../assets/passwordIcon.svg";
import nameIcon from "../assets/nameIcon.svg"

export default function Register() {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [avatar, setAvatar] = useState(null);
  const [error, setError] = useState("");

  async function handleRegister(e) {
    e.preventDefault();
    setError("");
    try {
      const formData = new FormData();
      formData.append("username", username);
      formData.append("email", email);
      formData.append("password", password);
      if (avatar) formData.append("avatar", avatar);

      const res = await fetch("/api/auth/register", {
        method: "POST",
        body: formData
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Ошибка регистрации");
      login(data.user, data.token);
      navigate("/");
    } catch (e) {
      setError(e.message);
    }
  }

  return (
    <div className={styles.wrapper}>
      <form className={styles.form} onSubmit={handleRegister}>
        <img style={{width: "200px", height: "auto", marginTop: "-5px"}} src={logo} alt="" />
        <h3>If you don’t have an account, <br />enter your details and create account.</h3>

        <label>
          Username
          <img className={styles.nameIcon} src={nameIcon} alt="nameIcon" />
          <input
            className={styles.userInput}
            type="text"
            required
            value={username}
            onChange={e => setUsername(e.target.value)}
            placeholder="your username"
            autoFocus
          />
        </label>

        <label>
          Email
          <img className={styles.emailIcon} src={emailIcon} alt="" />
          <input
          className={styles.emailInput}
            type="email"
            required
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="your email"
          />
        </label>

        <label>
          Password
          <img className={styles.passwordIcon} src={passwordIcon} alt="" />
          <div className={styles.passwordField}>
            <input
            className={styles.passInput}
              type="password"
              required
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="your password"
            />
          </div>
        </label>

        <label>
          Photo profile
          <input
            className={styles.fileInput}
            type="file"
            accept="image/*"
            onChange={e => setAvatar(e.target.files[0])}
          />
        </label>

        {error && <div className={styles.error}>{error}</div>}
        <button type="submit" className={styles.registerBtn}>Create account</button>
        <div className={styles.loginLink} onClick={() => navigate("/login")}>
          <p style={{color: "white"}}>else you have an account login</p>
        </div>
      </form>
    </div>
  );
}
