

import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import houseIcon from "../img/house-svgrepo-com.svg";
import filmIcon from "../img/film-camera-svgrepo-com.svg";
import imacIcon from "../img/imac-svgrepo-com.svg";
import manIcon from "../img/man-svgrepo-com.svg";
import heartIcon from "../img/heart-svgrepo-com.svg";
import caretIcon from "../img/caret-bottom-svgrepo-com.svg";
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
        setIsLoggedIn(false);
        window.dispatchEvent(new Event("storage"));
        navigate("/login");
    };

    return (
        <header className="header-navbar" style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100, background: '#111827' }}>
            <div className="header-accueil-group">
                <Link to="/" className="header-link" style={{ display: 'flex', alignItems: 'center', textDecoration: 'none', color: 'inherit' }}>
                    <img src={houseIcon} alt="Accueil" className="header-accueil-icon" />
                </Link>
            </div>
            <div className="header-center-group">
                <Link to="/movies" className="header-link" style={{ display: 'flex', alignItems: 'center', textDecoration: 'none', color: 'inherit' }}>
                    <img src={filmIcon} alt="Films" className="header-accueil-icon" />
                    <span className="header-accueil">Films</span>
                </Link>
                <Link to="/series" className="header-link" style={{ display: 'flex', alignItems: 'center', textDecoration: 'none', color: 'inherit' }}>
                    <img src={imacIcon} alt="Séries" className="header-accueil-icon" />
                    <span className="header-accueil">Séries</span>
                </Link>
            </div>
            <div className="header-actions" style={{ position: 'relative' }}>
                {isLoggedIn && (
                    <>
                        <button onClick={handleLogout} style={{
                            background: 'none',
                            color: '#f3f4f8',
                            border: 'none',
                            borderRadius: '8px',
                            padding: '6px',
                            cursor: 'pointer',
                            marginRight: 0,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            transition: 'background 0.2s',
                        }} title="Déconnexion">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="white"
                                strokeWidth="2"
                                className="header-accueil-icon logout-icon"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a2 2 0 01-2 2H7a2 2 0 01-2-2V7a2 2 0 012-2h4a2 2 0 012 2v1" />
                            </svg>
                        </button>
                        <Link to="/favoris">
                            <img src={heartIcon} alt="Favoris" className="header-accueil-icon" />
                        </Link>
                    </>
                )}
                {!isLoggedIn && (
                    <Link to="/login">
                        <img src={manIcon} alt="User" className="header-accueil-icon" />
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
                            <SearchFilters visible={showFilters} />
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
}
