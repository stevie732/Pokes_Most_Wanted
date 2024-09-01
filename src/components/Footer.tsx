import React from "react";
import "./Footer.css";

const Footer: React.FC = () => {
    return (
        <footer className="footer">
            <p>&copy; {new Date().getFullYear()} Pokedex App. Created & Designed by Stevie732 - All rights reserved.</p>
        </footer>
    );
};

export default Footer;
