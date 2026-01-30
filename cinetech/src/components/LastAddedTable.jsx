/**
 * Composant LastAddedTable (Tableau des derniers ajouts)
 * Affiche deux tableaux côte à côte :
 * - Derniers films ajoutés
 * - Dernières séries ajoutées
 */

import { useEffect, useState } from "react";
import { fetchAllMovies, fetchAllSeries } from "../services/tmdb";
import { Link } from 'react-router-dom';

const LastAddedTable = () => {
    // États pour stocker les derniers films et séries
    const [latestMovies, setLatestMovies] = useState([]); // 8 derniers films
    const [latestSeries, setLatestSeries] = useState([]); // 8 dernières séries

    /**
     * Effect pour charger les données au montage du composant
     */
    useEffect(() => {
        async function fetchData() {
            const movies = await fetchAllMovies(1);
            setLatestMovies(movies.results.slice(0, 8));
            const series = await fetchAllSeries(1);
            setLatestSeries(series.results.slice(0, 8));
        }
        fetchData();
    }, []);

    return (
        <div className="flex flex-col md:flex-row justify-center items-start gap-6 md:gap-12 lg:gap-24 mx-auto max-w-[1200px] px-2">
            <div className="w-full md:w-auto bg-gray-900 rounded-md p-4 md:p-[18px_12px] min-w-0 md:min-w-[320px] lg:min-w-[340px] shadow-[0_2px_16px_#000a]">
                <div className="text-[#4e8fae] text-base md:text-lg lg:text-xl font-bold mb-3 flex items-center gap-2 border-b-2 md:border-b-3 border-[#4e8fae] pb-1.5 md:pb-2 tracking-wide">
                    <span role="img" aria-label="film">🎬</span> DERNIERS FILMS AJOUTÉS
                </div>
                <div className="mt-2">
                    {latestMovies.map((movie) => (
                        <div className="bg-slate-800 text-white rounded p-2 md:p-[10px_12px] mb-2 text-sm md:text-base flex items-center justify-between transition-colors duration-200 hover:bg-slate-700 last:mb-0" key={movie.id}>
                            <Link to={`/movie/${movie.id}`} className="text-white underline truncate">
                                {movie.title} {movie.release_date ? `(${movie.release_date.slice(0, 4)})` : ''}
                            </Link>
                        </div>
                    ))}
                </div>
            </div>
            <div className="w-full md:w-auto bg-gray-900 rounded-md p-4 md:p-[18px_12px] min-w-0 md:min-w-[320px] lg:min-w-[340px] shadow-[0_2px_16px_#000a]">
                <div className="text-[#4e8fae] text-base md:text-lg lg:text-xl font-bold mb-3 flex items-center gap-2 border-b-2 md:border-b-3 border-[#4e8fae] pb-1.5 md:pb-2 tracking-wide">
                    <span role="img" aria-label="tv">📺</span> DERNIÈRES SÉRIES AJOUTÉES
                </div>
                <div className="mt-2">
                    {latestSeries.map((serie) => (
                        <div className="bg-slate-800 text-white rounded p-2 md:p-[10px_12px] mb-2 text-sm md:text-base flex items-center justify-between transition-colors duration-200 hover:bg-slate-700 last:mb-0" key={serie.id}>
                            <Link to={`/tv/${serie.id}`} className="text-white underline truncate">
                                {serie.name} {serie.first_air_date ? `(${serie.first_air_date.slice(0, 4)})` : ''}
                            </Link>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default LastAddedTable;
