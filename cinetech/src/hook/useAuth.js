import { useState, useEffect, createContext, useContext } from 'react';

// Créer le contexte d'authentification
const AuthContext = createContext(null);

// Provider pour envelopper l'application
export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // URL de votre backend - à ajuster selon votre configuration
    const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5050';

    // Vérifier si un utilisateur est déjà connecté au chargement
    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            try {
                setUser(JSON.parse(storedUser));
            } catch (err) {
                console.error('Erreur lors de la récupération de l\'utilisateur:', err);
                localStorage.removeItem('user');
            }
        }
        setLoading(false);
    }, []);

    // Fonction d'inscription
    const register = async (email, password) => {
        try {
            setError(null);
            setLoading(true);

            console.log('🔵 [REGISTER] Tentative d\'inscription...');
            console.log('📍 URL:', `${API_URL}/api/register`);
            console.log('📧 Email:', email);

            const response = await fetch(`${API_URL}/api/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });

            console.log('📥 Statut de la réponse:', response.status, response.statusText);

            const data = await response.json();
            console.log('📦 Données reçues:', data);

            if (!response.ok) {
                console.error('❌ Erreur du serveur:', data.message);
                throw new Error(data.message || 'Erreur lors de l\'inscription');
            }

            console.log('✅ Inscription réussie!');
            // Après l'inscription réussie, connecter automatiquement l'utilisateur
            setUser(data.user);
            localStorage.setItem('user', JSON.stringify(data.user));

            setLoading(false);
            return { success: true, data };
        } catch (err) {
            console.error('🔴 [REGISTER] Erreur:', err.message);
            console.error('Détails:', err);
            setError(err.message);
            setLoading(false);
            return { success: false, error: err.message };
        }
    };

    // Fonction de connexion
    const login = async (email, password) => {
        try {
            setError(null);
            setLoading(true);

            console.log('🔵 [LOGIN] Tentative de connexion...');
            console.log('📍 URL:', `${API_URL}/api/login`);
            console.log('📧 Email:', email);

            const response = await fetch(`${API_URL}/api/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });

            console.log('📥 Statut de la réponse:', response.status, response.statusText);

            const data = await response.json();
            console.log('📦 Données reçues:', data);

            if (!response.ok) {
                console.error('❌ Erreur du serveur:', data.message);
                throw new Error(data.message || 'Erreur lors de la connexion');
            }

            console.log('✅ Connexion réussie!');
            // Stocker l'utilisateur dans le state et localStorage
            setUser(data.user);
            localStorage.setItem('user', JSON.stringify(data.user));

            setLoading(false);
            return { success: true, data };
        } catch (err) {
            console.error('🔴 [LOGIN] Erreur:', err.message);
            console.error('Détails:', err);
            setError(err.message);
            setLoading(false);
            return { success: false, error: err.message };
        }
    };

    // Fonction de déconnexion
    const logout = () => {
        setUser(null);
        localStorage.removeItem('user');
        setError(null);
    };

    // Vérifier si l'utilisateur est authentifié
    const isAuthenticated = () => {
        return user !== null;
    };

    const value = {
        user,
        loading,
        error,
        register,
        login,
        logout,
        isAuthenticated,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Hook personnalisé pour utiliser le contexte d'authentification
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth doit être utilisé à l\'intérieur d\'un AuthProvider');
    }
    return context;
};

export default useAuth;
