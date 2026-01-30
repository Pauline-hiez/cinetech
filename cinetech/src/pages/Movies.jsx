
import React, { useEffect, useState } from 'react';
import Spinner from '../components/Spinner';
import { fetchPopularMovies } from '../services/tmdb';
import MovieCard from '../components/MovieCard';
import Pagination from '../components/Pagination';


const MOVIES_PER_PAGE = 24;

function Movies() {
    const [movies, setMovies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    useEffect(() => {
        let isMounted = true;
        async function getPopularMoviesWithImages() {
            setLoading(true);
            setError(null);
            let moviesWithImage = [];
            let apiPage = page;
            try {
                // On va chercher autant de pages que nécessaire pour avoir 24 films avec image
                while (moviesWithImage.length < MOVIES_PER_PAGE) {
                    const data = await fetchPopularMovies(apiPage);
                    if (isMounted && data.results) {
                        const filtered = data.results.filter((movie) => movie.poster_path);
                        moviesWithImage = moviesWithImage.concat(filtered);
                        if (apiPage === 1) {
                            setTotalPages(data.total_pages);
                        }
                        if (data.page >= data.total_pages) break;
                        apiPage++;
                    } else {
                        break;
                    }
                }
                if (isMounted) setMovies(moviesWithImage.slice(0, MOVIES_PER_PAGE));
            } catch (err) {
                if (isMounted) setError('Erreur lors du chargement des films.');
            } finally {
                if (isMounted) setLoading(false);
            }
        }
        getPopularMoviesWithImages();
        return () => { isMounted = false; };
    }, [page]);

    if (loading) return <Spinner />;
    if (error) return <div>{error}</div>;

    return (
        <div className="px-2 sm:px-4">
            <div className="flex flex-wrap gap-4 md:gap-6 justify-center">
                {movies.map((movie) => (
                    <MovieCard key={movie.id} movie={movie} />
                ))}
            </div>
            <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
        </div>
    );
}

export default Movies;
