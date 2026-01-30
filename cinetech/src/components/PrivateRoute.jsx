/**
 * Composant Route Privée
 * Protège les routes nécessitant une authentification
 * Redirige vers la page de connexion si l'utilisateur n'est pas connecté
 */

import { Navigate } from "react-router-dom";

/**
 * @param {ReactNode} children - Composants enfants à afficher si l'utilisateur est authentifié
 */
export default function PrivateRoute({ children }) {
    // Vérification de l'existence d'un utilisateur dans le localStorage
    const user = localStorage.getItem("user");
    // Si aucun utilisateur n'est connecté, redirection vers /login
    if (!user) {
        return <Navigate to="/login" replace />;
    }
    return children;
}
