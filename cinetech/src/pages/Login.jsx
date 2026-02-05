/**
 * Page de connexion et d'inscription
 * Permet aux utilisateurs de créer un compte ou de se connecter via l'API backend
 */

// Importation des hooks React
import { useState } from "react";
// Importation de l'icône et du hook de navigation
import userIcon from '../img/cadenas.png';
import { useNavigate } from "react-router-dom";
import { useAuth } from '../hook/useAuth';

// Styles CSS en objets JavaScript
// Style du fond dégradé bleu foncé
const darkBlue = {
    background: "linear-gradient(135deg, #1e293b 0%, #0f172a 100%)",
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "16px",
};

// Style de la carte de connexion/inscription
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

// Style des champs de saisie
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

// Style du bouton principal
const buttonStyle = {
    width: "100%",
    padding: "12px 0",
    background: "#06b6d4",
    color: "#fff",
    fontWeight: 600,
    border: "none",
    borderRadius: "12px",
    fontSize: "1.1rem",
    marginTop: 8,
    marginBottom: 8,
    cursor: "pointer",
    transition: "all 0.3s ease",
    boxShadow: "0 0 0 rgba(6, 182, 212, 0)",
};

// Style des liens
const linkStyle = {
    color: "#60a5fa",
    textDecoration: "underline",
    cursor: "pointer",
};


export default function Login() {
    // États pour gérer le formulaire
    const [isLogin, setIsLogin] = useState(true); // true = connexion, false = inscription
    const [email, setEmail] = useState(""); // Email saisi
    const [password, setPassword] = useState(""); // Mot de passe saisi
    const [confirmPassword, setConfirmPassword] = useState(""); // Confirmation du mot de passe
    const [error, setError] = useState(""); // Message d'erreur
    const [success, setSuccess] = useState(""); // Message de succès
    const [isLoading, setIsLoading] = useState(false); // État de chargement
    const navigate = useNavigate(); // Hook pour naviguer vers une autre page
    const { login, register } = useAuth(); // Hook d'authentification

    /**
     * Gestion de la soumission du formulaire (connexion ou inscription)
     */
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setSuccess("");
        setIsLoading(true);

        if (isLogin) {
            // Mode connexion
            if (!email || !password) {
                setError("Veuillez remplir tous les champs.");
                setIsLoading(false);
                return;
            }

            const result = await login(email, password);
            setIsLoading(false);

            if (result.success) {
                setSuccess("Connexion réussie !");
                // Redirection vers la page des favoris après 500ms
                setTimeout(() => {
                    navigate("/favoris");
                }, 500);
            } else {
                setError(result.error || "Erreur lors de la connexion.");
            }
        } else {
            // Mode inscription
            if (!email || !password || !confirmPassword) {
                setError("Veuillez remplir tous les champs.");
                setIsLoading(false);
                return;
            }
            if (password !== confirmPassword) {
                setError("Les mots de passe ne correspondent pas.");
                setIsLoading(false);
                return;
            }
            if (password.length < 6) {
                setError("Le mot de passe doit contenir au moins 6 caractères.");
                setIsLoading(false);
                return;
            }

            const result = await register(email, password);
            setIsLoading(false);

            if (result.success) {
                setSuccess("Inscription réussie ! Redirection...");
                // Redirection vers la page des favoris après 1s
                setTimeout(() => {
                    navigate("/favoris");
                }, 1000);
            } else {
                setError(result.error || "Erreur lors de l'inscription.");
            }
        }
    };

    return (
        <div style={darkBlue}>
            <div style={cardStyle}>
                {/* En-tête de la carte avec icône et titre */}
                <div style={{ textAlign: "center", padding: "32px 0 16px 0" }}>
                    {/* Icône cadenas */}
                    <div style={{ display: "inline-block", padding: 16, background: "#0f172a", borderRadius: "50%", marginBottom: 16, boxShadow: "0 0 16px #22336655" }}>
                        <img src={userIcon} alt="User" style={{ width: 56, height: 56, display: 'block', margin: '0 auto' }} />
                    </div>
                    {/* Titre selon le mode (connexion ou inscription) */}
                    <h2 style={{ fontSize: 32, fontWeight: 700, color: "#fff", marginBottom: 8, textShadow: "0 0 8px #223366" }}>
                        {isLogin ? "Connexion" : "Inscription"}
                    </h2>
                    <p style={{ color: "#60a5fa", marginBottom: 0 }}>
                        {isLogin ? "Connectez-vous avec votre email" : "Créez un nouveau compte"}
                    </p>
                </div>

                {/* Formulaire */}
                <div style={{ background: "#1e293b", borderTop: "1px solid #223366", padding: 32 }}>
                    <form onSubmit={handleSubmit}>
                        {/* Champ Email */}
                        <div style={{ marginBottom: 18 }}>
                            <label htmlFor="email" style={{ color: "#cbd5e1", fontWeight: 500, marginBottom: 6, display: "block" }}>Email</label>
                            <input
                                type="email"
                                id="email"
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                                style={inputStyle}
                                placeholder="votre@email.com"
                                autoComplete="email"
                                disabled={isLoading}
                            />
                        </div>

                        {/* Champ Mot de passe */}
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
                                disabled={isLoading}
                            />
                        </div>

                        {/* Champ Confirmation mot de passe (uniquement en mode inscription) */}
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
                                    disabled={isLoading}
                                />
                            </div>
                        )}

                        {/* Messages d'erreur et de succès */}
                        {error && <div style={{ color: "#f87171", marginBottom: 12, textAlign: "center" }}>{error}</div>}
                        {success && <div style={{ color: "#34d399", marginBottom: 12, textAlign: "center" }}>{success}</div>}

                        {/* Bouton de soumission avec effets hover */}
                        <button
                            type="submit"
                            style={{ ...buttonStyle, opacity: isLoading ? 0.7 : 1, cursor: isLoading ? 'not-allowed' : 'pointer' }}
                            onMouseEnter={(e) => {
                                if (!isLoading) {
                                    e.target.style.background = '#0e7490';
                                    e.target.style.boxShadow = '0 0 20px rgba(6, 182, 212, 0.6), 0 0 40px rgba(6, 182, 212, 0.3)';
                                }
                            }}
                            onMouseLeave={(e) => {
                                if (!isLoading) {
                                    e.target.style.background = '#06b6d4';
                                    e.target.style.boxShadow = '0 0 0 rgba(6, 182, 212, 0)';
                                }
                            }}
                            disabled={isLoading}
                        >
                            {isLoading ? "Chargement..." : (isLogin ? "Se connecter" : "S'inscrire")}
                        </button>
                    </form>

                    {/* Lien pour basculer entre connexion et inscription */}
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
