import React, { useState, useEffect } from "react";

export default function Settings() {
    const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");

    useEffect(() => {
        document.body.setAttribute("data-theme", theme);
        localStorage.setItem("theme", theme);
    }, [theme]);

    const toggleTheme = () => {
        setTheme((prev) => (prev === "light" ? "dark" : "light"));
    };

    return (
        <div className="settings-container">
            <h1>Settings</h1>
            <div className="settings-card">
                <h2>Appearance</h2>
                <div className="setting-item">
                    <span>Theme:</span>
                    <button onClick={toggleTheme} className="theme-toggle-btn">
                        {theme === "light" ? "Switch to Dark Mode" : "Switch to Light Mode"}
                    </button>
                </div>
            </div>
        </div>
    );
}
