import { useState } from "react";

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
        <div style={{
            background: '#2c3e50',
            borderRadius: 18,
            boxShadow: '0 4px 24px rgba(0,0,0,0.3)',
            padding: '24px 20px',
            width: '100%',
            boxSizing: 'border-box'
        }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16, alignItems: 'stretch' }}>
                <div style={{ width: '100%' }}>
                    <label htmlFor="filter-type" style={{ display: 'block', textAlign: 'center', color: '#fff', fontSize: 15, fontWeight: '500', marginBottom: 8 }}>Type :</label>
                    <select
                        id="filter-type"
                        value={selectedType}
                        onChange={handleTypeChange}
                        style={{
                            width: '100%',
                            borderRadius: 20,
                            padding: '12px 16px',
                            border: 'none',
                            fontSize: 15,
                            color: '#000',
                            background: '#fff',
                            cursor: 'pointer',
                            outline: 'none'
                        }}
                    >
                        <option value="">Tous</option>
                        <option value="movie">Film</option>
                        <option value="tv">Série</option>
                    </select>
                </div>
                <div style={{ width: '100%' }}>
                    <label htmlFor="filter-year" style={{ display: 'block', textAlign: 'center', color: '#fff', fontSize: 15, fontWeight: '500', marginBottom: 8 }}>Année :</label>
                    <select
                        id="filter-year"
                        value={selectedYear}
                        onChange={handleYearChange}
                        style={{
                            width: '100%',
                            borderRadius: 20,
                            padding: '12px 16px',
                            border: 'none',
                            fontSize: 15,
                            color: '#000',
                            background: '#fff',
                            cursor: 'pointer',
                            outline: 'none'
                        }}
                    >
                        <option value="">Toutes</option>
                        {years.map(y => <option key={y} value={y}>{y}</option>)}
                    </select>
                </div>
                <div style={{ width: '100%' }}>
                    <label htmlFor="filter-genre" style={{ display: 'block', textAlign: 'center', color: '#fff', fontSize: 15, fontWeight: '500', marginBottom: 8 }}>Genre :</label>
                    <select
                        id="filter-genre"
                        value={selectedGenre}
                        onChange={handleGenreChange}
                        style={{
                            width: '100%',
                            borderRadius: 20,
                            padding: '12px 16px',
                            border: 'none',
                            fontSize: 15,
                            color: '#000',
                            background: '#fff',
                            cursor: 'pointer',
                            outline: 'none'
                        }}
                    >
                        <option value="">Tous</option>
                        {genres.map(g => <option key={g.id} value={g.id}>{g.name}</option>)}
                    </select>
                </div>
                <div style={{ width: '100%' }}>
                    <label htmlFor="filter-country" style={{ display: 'block', textAlign: 'center', color: '#fff', fontSize: 15, fontWeight: '500', marginBottom: 8 }}>Pays d'origine :</label>
                    <select
                        id="filter-country"
                        value={selectedCountry}
                        onChange={handleCountryChange}
                        style={{
                            width: '100%',
                            borderRadius: 20,
                            padding: '12px 16px',
                            border: 'none',
                            fontSize: 15,
                            color: '#000',
                            background: '#fff',
                            cursor: 'pointer',
                            outline: 'none'
                        }}
                    >
                        <option value="">Tous</option>
                        {countries.map(c => <option key={c.code} value={c.code}>{c.name}</option>)}
                    </select>
                </div>
                <button
                    onClick={handleFilterSearch}
                    style={{
                        width: '100%',
                        padding: '14px 24px',
                        background: '#5dade2',
                        color: '#fff',
                        border: 'none',
                        borderRadius: 20,
                        fontSize: 16,
                        fontWeight: '600',
                        cursor: 'pointer',
                        marginTop: 8,
                        transition: 'all 0.2s',
                        boxShadow: '0 2px 8px rgba(93, 173, 226, 0.3)'
                    }}
                    onMouseEnter={(e) => e.target.style.background = '#4a9fd5'}
                    onMouseLeave={(e) => e.target.style.background = '#5dade2'}
                >
                    Rechercher
                </button>
                <button
                    onClick={handleResetFilters}
                    style={{
                        width: '100%',
                        padding: '12px 24px',
                        background: '#7f8c8d',
                        color: '#fff',
                        border: 'none',
                        borderRadius: 20,
                        fontSize: 15,
                        fontWeight: '500',
                        cursor: 'pointer',
                        marginTop: 8,
                        transition: 'all 0.2s',
                        boxShadow: '0 2px 6px rgba(127, 140, 141, 0.2)'
                    }}
                    onMouseEnter={(e) => e.target.style.background = '#6d7b7c'}
                    onMouseLeave={(e) => e.target.style.background = '#7f8c8d'}
                >
                    Réinitialiser
                </button>
            </div>
        </div>
    );
}
