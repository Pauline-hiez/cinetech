import React, { useState } from "react";
import userIcon from '../img/login.png';
import { useNavigate } from "react-router-dom";

const darkBlue = {
    background: "linear-gradient(135deg, #1e293b 0%, #0f172a 100%)",
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "32px",
};

const cardStyle = {
    background: "#111827",
    borderRadius: "1.25rem",
    boxShadow: "0 8px 32px 0 rgba(30,41,59,0.25)",
    border: "1px solid #334155",
    maxWidth: 400,
    width: "100%",
    padding: 0,
    overflow: "hidden",
};

const inputStyle = {
    width: "100%",
    padding: "12px 16px",
    background: "#1e293b",
    border: "1px solid #334155",
    borderRadius: "0.75rem",
    color: "#fff",
    fontSize: "1rem",
    marginBottom: 12,
    outline: "none",
};

const buttonStyle = {
    width: "100%",
    padding: "12px 0",
    background: "#223366",
    backgroundImage: "linear-gradient(90deg, #223366 0%, #1e293b 100%)",
    color: "#fff",
    fontWeight: 600,
    border: "none",
    borderRadius: "0.75rem",
    fontSize: "1.1rem",
    marginTop: 8,
    marginBottom: 8,
    boxShadow: "0 2px 8px #22336633",
    cursor: "pointer",
    transition: "background 0.2s",
};

const linkStyle = {
    color: "#60a5fa",
    textDecoration: "underline",
    cursor: "pointer",
};


export default function Login() {
    const [isLogin, setIsLogin] = useState(true);
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const navigate = useNavigate();

    // LocalStorage helpers multi-utilisateurs
    const saveUser = (username, password) => {
        let users = JSON.parse(localStorage.getItem("users")) || [];
        users.push({ username, password });
        localStorage.setItem("users", JSON.stringify(users));
    };
    const findUser = (username) => {
        const users = JSON.parse(localStorage.getItem("users")) || [];
        return users.find(u => u.username === username);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setError("");
        setSuccess("");
        if (isLogin) {
            // Connexion
            const user = findUser(username);
            if (!user || user.password !== password) {
                setError("Pseudo ou mot de passe incorrect.");
                return;
            }
            setSuccess("Connexion réussie !");
            // Nettoie tout pseudo résiduel avant de connecter
            localStorage.removeItem("pseudo");
            localStorage.setItem("user", JSON.stringify(user)); // utilisateur courant
            localStorage.setItem("pseudo", user.username); // Enregistre le pseudo pour l'affichage
            setTimeout(() => {
                window.dispatchEvent(new Event("storage"));
                navigate("/favoris");
            }, 500);
        } else {
            // Inscription
            if (!username || !password || !confirmPassword) {
                setError("Veuillez remplir tous les champs.");
                return;
            }
            if (password !== confirmPassword) {
                setError("Les mots de passe ne correspondent pas.");
                return;
            }
            if (findUser(username)) {
                setError("Ce pseudo existe déjà.");
                return;
            }
            saveUser(username, password);
            localStorage.setItem("pseudo", username); // Enregistre le pseudo pour l'affichage
            setSuccess("Inscription réussie ! Vous pouvez vous connecter.");
            setIsLogin(true);
            setUsername("");
            setPassword("");
            setConfirmPassword("");
        }
    };

    return (
        <div style={darkBlue}>
            <div style={cardStyle}>
                <div style={{ textAlign: "center", padding: "32px 0 16px 0" }}>
                    <div style={{ display: "inline-block", padding: 16, background: "#0f172a", borderRadius: "50%", marginBottom: 16, boxShadow: "0 0 16px #22336655" }}>
                        <img src={userIcon} alt="User" style={{ width: 56, height: 56, display: 'block', margin: '0 auto' }} />
                    </div>
                    <h2 style={{ fontSize: 32, fontWeight: 700, color: "#fff", marginBottom: 8, textShadow: "0 0 8px #223366" }}>
                        {isLogin ? "Connexion" : "Inscription"}
                    </h2>
                    <p style={{ color: "#60a5fa", marginBottom: 0 }}>
                        {isLogin ? "Connectez-vous avec votre pseudo" : "Créez un nouveau compte avec un pseudo"}
                    </p>
                </div>
                <div style={{ background: "#1e293b", borderTop: "1px solid #223366", padding: 32 }}>
                    <form onSubmit={handleSubmit}>
                        <div style={{ marginBottom: 18 }}>
                            <label htmlFor="username" style={{ color: "#cbd5e1", fontWeight: 500, marginBottom: 6, display: "block" }}>Pseudo</label>
                            <input
                                type="text"
                                id="username"
                                value={username}
                                onChange={e => setUsername(e.target.value)}
                                style={inputStyle}
                                placeholder="Votre pseudo"
                                autoComplete="username"
                            />
                        </div>
                        <div style={{ marginBottom: 18 }}>
                            <label htmlFor="password" style={{ color: "#cbd5e1", fontWeight: 500, marginBottom: 6, display: "block" }}>Mot de passe</label>
                            <input
                                type="password"
                                id="password"
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                                style={inputStyle}
                                placeholder="••••••••"
                                autoComplete={isLogin ? "current-password" : "new-password"}
                            />
                        </div>
                        {!isLogin && (
                            <div style={{ marginBottom: 18 }}>
                                <label htmlFor="confirmPassword" style={{ color: "#cbd5e1", fontWeight: 500, marginBottom: 6, display: "block" }}>Confirmer le mot de passe</label>
                                <input
                                    type="password"
                                    id="confirmPassword"
                                    value={confirmPassword}
                                    onChange={e => setConfirmPassword(e.target.value)}
                                    style={inputStyle}
                                    placeholder="••••••••"
                                    autoComplete="new-password"
                                />
                            </div>
                        )}
                        {error && <div style={{ color: "#f87171", marginBottom: 12, textAlign: "center" }}>{error}</div>}
                        {success && <div style={{ color: "#34d399", marginBottom: 12, textAlign: "center" }}>{success}</div>}
                        <button type="submit" style={buttonStyle}>
                            {isLogin ? "Se connecter" : "S'inscrire"}
                        </button>
                    </form>
                    <div style={{ textAlign: "center", marginTop: 16 }}>
                        <span style={{ color: "#cbd5e1" }}>
                            {isLogin ? "Pas encore de compte ? " : "Déjà un compte ? "}
                        </span>
                        <span style={linkStyle} onClick={() => { setIsLogin(!isLogin); setError(""); setSuccess(""); }}>
                            {isLogin ? "Inscrivez-vous" : "Connectez-vous"}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
}
