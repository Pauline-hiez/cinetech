import React from "react";
import houseIcon from "../img/house-svgrepo-com.svg";
import filmIcon from "../img/film-camera-svgrepo-com.svg";
import imacIcon from "../img/imac-svgrepo-com.svg";
import manIcon from "../img/man-svgrepo-com.svg";
import heartIcon from "../img/heart-svgrepo-com.svg";
import caretIcon from "../img/caret-bottom-svgrepo-com.svg";

export default function Header() {
    return (
        <header className="header-navbar">
            <div className="header-accueil-group">
                <img src={houseIcon} alt="Accueil" className="header-accueil-icon" />
                <span className="header-accueil">Accueil</span>
            </div>
            <div className="header-center-group">
                <div className="header-link">
                    <img src={filmIcon} alt="Films" className="header-accueil-icon" />
                    <span className="header-accueil">Films</span>
                    <img src={caretIcon} alt="dropdown" className="header-caret" />
                </div>
                <div className="header-link">
                    <img src={imacIcon} alt="Séries" className="header-accueil-icon" />
                    <span className="header-accueil">Séries</span>
                    <img src={caretIcon} alt="dropdown" className="header-caret" />
                </div>
                <div className="header-link">
                    <img src={manIcon} alt="User" className="header-accueil-icon" />
                    <img src={heartIcon} alt="Favoris" className="header-accueil-icon ml-1" />
                </div>
            </div>
            <form className="flex items-center bg-white rounded px-2 py-1 shadow">
                <input
                    type="text"
                    placeholder="SEARCH BAR"
                    className="outline-none px-2 py-1 bg-transparent text-gray-800 placeholder-gray-500"
                />
                <button type="submit" className="ml-2 text-gray-600 hover:text-blue-700">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4-4m0 0A7 7 0 104 4a7 7 0 0013 13z" />
                    </svg>
                </button>
            </form>
        </header>
    );
}
