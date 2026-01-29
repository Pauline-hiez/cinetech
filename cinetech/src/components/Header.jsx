

import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from "../img/logo.png";
import cinemaIcon from "../img/cinema.png";
import seriesIcon from "../img/series.png";
import userIcon from "../img/login.png";
import favorisIcon from "../img/favoris.png";
import logoutIcon from "../img/logout.png";
import SearchBar from "./SearchBar";
import { FilterIcon } from "./FilterIcon";
import SearchFilters from "./SearchFilters";
export default function Header() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [showFilters, setShowFilters] = useState(false);
    const navigate = useNavigate();

    // Gestion de la recherche globale
    const handleSearch = (query) => {
        if (query && query.length > 1) {
            navigate(`/search?q=${encodeURIComponent(query)}`);
        }
    };

    // Gestion de la recherche par filtres
    const handleFilterSearch = (filters) => {
        // Si tous les filtres sont vides, afficher tous les films
        if (!filters.type && !filters.year && !filters.genre && !filters.country) {
            navigate('/movies');
            return;
        }
        // Construction de l'URL avec les filtres sélectionnés
        const params = new URLSearchParams();
        if (filters.type) params.append('type', filters.type);
        if (filters.year) params.append('year', filters.year);
        if (filters.genre) params.append('genre', filters.genre);
        if (filters.country) params.append('country', filters.country);
        navigate(`/search?${params.toString()}`);
    };

    useEffect(() => {
        const checkLogin = () => {
            const user = localStorage.getItem("user");
            setIsLoggedIn(!!user);
        };
        checkLogin();
        window.addEventListener("storage", checkLogin);
        return () => window.removeEventListener("storage", checkLogin);
    }, []);

    const handleLogout = () => {
        localStorage.removeItem("user");
        localStorage.removeItem("pseudo"); // Supprime aussi le pseudo
        setIsLoggedIn(false);
        window.dispatchEvent(new Event("storage"));
        navigate("/login");
    };

    return (
        <header className="header-navbar" style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100, background: '#111827' }}>
            <div className="header-accueil-group">
                <Link to="/" className="header-link" style={{ display: 'flex', alignItems: 'center', textDecoration: 'none', color: 'inherit' }}>
                    <img src={logo} alt="Accueil" className="header-accueil-icon header-logo-large" style={{ marginLeft: 16, width: 50, height: 50 }} />
                </Link>
            </div>
            <div className="header-center-group">
                <Link to="/movies" className="header-link" style={{ display: 'flex', alignItems: 'center', textDecoration: 'none', color: 'inherit' }}>
                    <img src={cinemaIcon} alt="Films" className="header-accueil-icon" />
                    <span className="header-accueil">Films</span>
                </Link>
                <Link to="/series" className="header-link" style={{ display: 'flex', alignItems: 'center', textDecoration: 'none', color: 'inherit' }}>
                    <img src={seriesIcon} alt="Séries" className="header-accueil-icon" />
                    <span className="header-accueil">Séries</span>
                </Link>
            </div>

            <div className="header-actions" style={{ position: 'relative' }}>
                {isLoggedIn && (
                    <>
                        <Link to="/favoris">
                            <img src={favorisIcon} alt="Favoris" className="header-accueil-icon favoris-large" />
                        </Link>
                    </>
                )}
                {!isLoggedIn && (
                    <Link to="/login">
                        <img src={userIcon} alt="User" className="header-accueil-icon" />
                    </Link>
                )}
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, position: 'relative' }}>
                    <button
                        style={{ background: 'none', border: 'none', cursor: 'pointer', marginRight: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 4 }}
                        title="Filtres de recherche"
                        onClick={() => setShowFilters(f => !f)}
                    >
                        <FilterIcon size={28} />
                    </button>
                    <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                        <SearchBar onSearch={handleSearch} />
                        <div style={{ position: 'absolute', top: 56, left: 0, width: '100%', minWidth: 0, maxWidth: 340, zIndex: 200, boxSizing: 'border-box' }}>
                            <SearchFilters visible={showFilters} onChange={handleFilterSearch} />
                        </div>
                    </div>
                </div>
            </div>
            {/* Bouton de déconnexion flottant */}
            {isLoggedIn && (
                <button onClick={handleLogout} className="floating-logout-btn" title="Déconnexion">
                    <img src={logoutIcon} alt="Déconnexion" className="header-accueil-icon logout-icon" />
                </button>
            )}
        </header>
    );
}
