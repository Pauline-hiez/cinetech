
import React from "react";
import { Link } from "react-router-dom";
import houseIcon from "../img/house-svgrepo-com.svg";
import filmIcon from "../img/film-camera-svgrepo-com.svg";
import imacIcon from "../img/imac-svgrepo-com.svg";
import manIcon from "../img/man-svgrepo-com.svg";

import heartIcon from "../img/heart-svgrepo-com.svg";
import caretIcon from "../img/caret-bottom-svgrepo-com.svg";
import SearchBar from "./SearchBar";

export default function Header() {
    // Remplacer par votre vraie logique d'authentification
    const isLoggedIn = false; // Mettre à true si l'utilisateur est connecté

    return (
        <header className="header-navbar">
            <div className="header-accueil-group">
                <Link to="/" className="header-link" style={{ display: 'flex', alignItems: 'center', textDecoration: 'none', color: 'inherit' }}>
                    <img src={houseIcon} alt="Accueil" className="header-accueil-icon" />
                    <span className="header-accueil">Accueil</span>
                </Link>
            </div>
            <div className="header-center-group">
                <Link to="/movies" className="header-link" style={{ display: 'flex', alignItems: 'center', textDecoration: 'none', color: 'inherit' }}>
                    <img src={filmIcon} alt="Films" className="header-accueil-icon" />
                    <span className="header-accueil">Films</span>
                    <img src={caretIcon} alt="dropdown" className="header-caret" />
                </Link>
                <Link to="/series" className="header-link" style={{ display: 'flex', alignItems: 'center', textDecoration: 'none', color: 'inherit' }}>
                    <img src={imacIcon} alt="Séries" className="header-accueil-icon" />
                    <span className="header-accueil">Séries</span>
                    <img src={caretIcon} alt="dropdown" className="header-caret" />
                </Link>
                <div className="header-link">
                    <img src={manIcon} alt="User" className="header-accueil-icon" />
                    {isLoggedIn && (
                        <Link to="/favoris">
                            <img src={heartIcon} alt="Favoris" className="header-accueil-icon ml-1" />
                        </Link>
                    )}
                </div>
            </div>
            <SearchBar />
        </header>
    );
}
