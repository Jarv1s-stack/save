import React, { useContext } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import styles from "./Header.module.css";
import { AuthContext } from "../context/AuthContext";
import ThemeToggle from "./ThemeToggle";
import logo from "../assets/logo.svg";
import home from "../assets/home.svg";
import profile from "../assets/profile.svg";
import search from "../assets/searchIcon.svg";
import createEvent from "../assets/createEvent.svg";
import shop from "../assets/shop.svg"; 
import lightIcon from "../assets/light.svg";
import darkIcon from "../assets/dark.svg";

export default function Header() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <header style={{backgroundColor: "#4F46E5", display: "flex", flexDirection: "row", justifyContent: "space-around", alignItems: 'center', height: "95px", width: "100%",}} >
      <div className={styles["header-left"]} onClick={() => navigate("/")}>
        <img src={logo} alt="Logo" style={{width: "auto", height: "50px", marginLeft: "-50px"}} height={36} />
      </div>
      
      <form style={{width: 'auto', height: "100%", display: "flex", flexDirection: "row", alignItems: "center" }} onSubmit={e => { e.preventDefault(); }}>
        <input type="text" style={{width: "350px", height: "17px",  position: "relative"}} placeholder="Поиск событий..."/>
        <button style={{backgroundColor: "#4F46E5", borderRadius: "999px" ,border: "none", position: "absolute", top: "35px", right: "732px"}} type="submit" title="Поиск">
          <img src={search} alt="Search" height={22} />
        </button>
      </form>


      <nav style={{ marginRight: "-120px" ,width: '33%', height: '100%', display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: '30px'}} >

        <button
          style={{backgroundColor: "#4F46E5", border: "none"}}
          onClick={() => navigate("/")}
        >
          <img src={home} alt="Home" height={28} />
        </button>
        <button
          style={{backgroundColor: "#4F46E5", border: "none"}}
          onClick={() => navigate("/create-event")}
        >
          <img src={createEvent} alt="Create Event" height={28} />
        </button>
        <button
          style={{backgroundColor: "#4F46E5", border: "none"}}
          onClick={() => navigate("/shop")}
        >
         <img src={shop} alt="shop" height={28}/>
        </button>

        <button
          style={{backgroundColor: "#4F46E5", border: "none"}}
          onClick={() => navigate("/profile")}
        >
          <img src={profile} alt="Profile" height={28} />
        </button>
        <ThemeToggle/>
      </nav>
    </header>
  );
}
