import styles from "./Header.module.css";

export default function Footer() {

    return(
        <footer style={{ width: "100%", height: "50px", backgroundColor: "#4F46E5", display: "flex", justifyContent: 'center', alignItems: 'center',}}>
            <h3 style={{ fontSiza: "20px", fontFamily: "sanse-selif", color: "white" }}>© all rights reserved</h3>
        </footer>
    )
}

