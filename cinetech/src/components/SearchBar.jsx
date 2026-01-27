import React from "react";

export default function SearchBar() {
    return (
        <form className="flex items-center bg-white rounded px-2 py-1 shadow">
            <input
                type="text"
                placeholder="Entrez votre recherche"
                className="outline-none px-2 py-1 bg-transparent text-gray-800 placeholder-gray-500"
            />
            <button type="submit" className="ml-2 text-gray-600 hover:text-blue-700 flex items-center justify-center" style={{ padding: 0, background: 'none', border: 'none' }}>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" style={{ color: 'currentColor', width: 24, height: 24, display: 'block' }}>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4-4m0 0A7 7 0 104 4a7 7 0 0013 13z" stroke="currentColor" />
                </svg>
            </button>
        </form>
    );
}
