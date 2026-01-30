/**
 * Composant Icône de Filtre
 * Affiche une icône SVG d'entonnoir pour représenter les filtres de recherche
 * 
 * @param {number} size - Taille de l'icône en pixels (défaut: 24)
 * @param {string} color - Couleur de l'icône (défaut: #4e8fae)
 */
export const FilterIcon = ({ size = 24, color = "#4e8fae" }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M3 5h18l-7 9v5l-4 2v-7L3 5z" fill={color} stroke={color} strokeWidth="1.5" strokeLinejoin="round" />
    </svg>
);
