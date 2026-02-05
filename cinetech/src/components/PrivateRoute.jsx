/**
 * Composant Route Privée
 * Protège les routes nécessitant une authentification
 * Redirige vers la page de connexion si l'utilisateur n'est pas connecté
 */

import { Navigate } from "react-router-dom";
import { useAuth } from '../hook/useAuth';
import Spinner from './Spinner';

/**
 * @param {ReactNode} children - Composants enfants à afficher si l'utilisateur est authentifié
 */
export default function PrivateRoute({ children }) {
    const { isAuthenticated, loading } = useAuth();

    // Affichage d'un spinner pendant la vérification de l'authentification
    if (loading) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
                <Spinner />
            </div>
        );
    }

    // Si l'utilisateur n'est pas authentifié, redirection vers /login
    if (!isAuthenticated()) {
        return <Navigate to="/login" replace />;
    }

    return children;
}
