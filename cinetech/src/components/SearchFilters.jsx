import React, { useState } from "react";

const years = Array.from({ length: 2026 - 1950 }, (_, i) => 2025 - i);
export const genres = [
    { id: 28, name: "Action" },
    { id: 35, name: "Comédie" },
    { id: 18, name: "Drame" },
    { id: 27, name: "Horreur" },
    { id: 10749, name: "Romance" },
    { id: 16, name: "Animation" },
    { id: 12, name: "Aventure" },
    { id: 80, name: "Crime" },
    { id: 99, name: "Documentaire" },
    { id: 878, name: "Science-Fiction" },
];

const countries = [
    { code: "FR", name: "France" },
    { code: "US", name: "États-Unis" },
    { code: "GB", name: "Royaume-Uni" },
    { code: "JP", name: "Japon" },
    { code: "KR", name: "Corée du Sud" },
    { code: "IT", name: "Italie" },
    { code: "DE", name: "Allemagne" },
    { code: "ES", name: "Espagne" },
    { code: "IN", name: "Inde" },
    { code: "CA", name: "Canada" },
];

export default function SearchFilters({ onChange, visible }) {
    const [selectedType, setSelectedType] = useState("");
    const [selectedYear, setSelectedYear] = useState("");
    const [selectedGenre, setSelectedGenre] = useState("");
    const [selectedCountry, setSelectedCountry] = useState("");

    const handleTypeChange = (e) => {
        setSelectedType(e.target.value);
    };
    const handleYearChange = (e) => {
        setSelectedYear(e.target.value);
    };
    const handleGenreChange = (e) => {
        setSelectedGenre(e.target.value);
    };
    const handleCountryChange = (e) => {
        setSelectedCountry(e.target.value);
    };


    const handleFilterSearch = () => {
        onChange && onChange({ type: selectedType, year: selectedYear, genre: selectedGenre, country: selectedCountry });
    };

    const handleResetFilters = () => {
        setSelectedType("");
        setSelectedYear("");
        setSelectedGenre("");
        setSelectedCountry("");
        onChange && onChange({ type: "", year: "", genre: "", country: "" });
    };

    if (!visible) return null;

    return (
        <div className="search-filters-panel" style={{
            background: '#1e293b', color: '#fff', borderRadius: 18, boxShadow: '0 2px 16px #000a', padding: 18, width: '100%', minWidth: 260, maxWidth: 340, boxSizing: 'border-box', overflow: 'hidden'
        }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14, alignItems: 'center', justifyContent: 'center' }}>
                <div style={{ width: '100%' }}>
                    <label htmlFor="filter-type">Type :</label>
                    <select id="filter-type" value={selectedType} onChange={handleTypeChange} style={{ width: '100%', marginTop: 4, borderRadius: 24, padding: '10px 18px', border: '1px solid #e2e8f0', fontSize: 16 }}>
                        <option value="">Tous</option>
                        <option value="movie">Film</option>
                        <option value="tv">Série</option>
                    </select>
                </div>
                <div style={{ width: '100%' }}>
                    <label htmlFor="filter-year">Année :</label>
                    <select id="filter-year" value={selectedYear} onChange={handleYearChange} style={{ width: '100%', marginTop: 4, borderRadius: 24, padding: '10px 18px', border: '1px solid #e2e8f0', fontSize: 16 }}>
                        <option value="">Toutes</option>
                        {years.map(y => <option key={y} value={y}>{y}</option>)}
                    </select>
                </div>
                <div style={{ width: '100%' }}>
                    <label htmlFor="filter-genre">Genre :</label>
                    <select id="filter-genre" value={selectedGenre} onChange={handleGenreChange} style={{ width: '100%', marginTop: 4, borderRadius: 24, padding: '10px 18px', border: '1px solid #e2e8f0', fontSize: 16 }}>
                        <option value="">Tous</option>
                        {genres.map(g => <option key={g.id} value={g.id}>{g.name}</option>)}
                    </select>
                </div>
                <div style={{ width: '100%' }}>
                    <label htmlFor="filter-country">Pays d'origine :</label>
                    <select id="filter-country" value={selectedCountry} onChange={handleCountryChange} style={{ width: '100%', marginTop: 4, borderRadius: 24, padding: '10px 18px', border: '1px solid #e2e8f0', fontSize: 16 }}>
                        <option value="">Tous</option>
                        {countries.map(c => <option key={c.code} value={c.code}>{c.name}</option>)}
                    </select>
                </div>
                <button onClick={handleFilterSearch} className="search-filters-btn">
                    Rechercher
                </button>
                <button onClick={handleResetFilters} className="search-filters-btn" style={{ marginTop: 8, background: '#64748b', color: '#fff' }}>
                    Réinitialiser
                </button>
            </div>
        </div>
    );
}
