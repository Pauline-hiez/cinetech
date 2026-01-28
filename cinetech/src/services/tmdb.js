// Détail d'un film ou série
export async function getMovieDetails(id, type = 'movie') {
  const API_KEY = process.env.REACT_APP_API_KEY;
  const BASE_URL = 'https://api.themoviedb.org/3';
  const url = `${BASE_URL}/${type}/${id}?language=fr-FR`;
  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${API_KEY}`,
      'Content-Type': 'application/json',
    },
  });
  if (!response.ok) throw new Error('Erreur lors de la récupération du détail');
  return response.json();
}

// Casting et équipe technique
export async function getMovieCredits(id, type = 'movie') {
  const API_KEY = process.env.REACT_APP_API_KEY;
  const BASE_URL = 'https://api.themoviedb.org/3';
  const url = `${BASE_URL}/${type}/${id}/credits`;
  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${API_KEY}`,
      'Content-Type': 'application/json',
    },
  });
  if (!response.ok) throw new Error('Erreur lors de la récupération du casting');
  return response.json();
}

// Films ou séries similaires
export async function getSimilarMovies(id, type = 'movie') {
  const API_KEY = process.env.REACT_APP_API_KEY;
  const BASE_URL = 'https://api.themoviedb.org/3';
  const url = `${BASE_URL}/${type}/${id}/similar`;
  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${API_KEY}`,
      'Content-Type': 'application/json',
    },
  });
  if (!response.ok) throw new Error('Erreur lors de la récupération des similaires');
  return response.json();
}

// Avis et commentaires
export async function getMovieReviews(id, type = 'movie') {
  const API_KEY = process.env.REACT_APP_API_KEY;
  const BASE_URL = 'https://api.themoviedb.org/3';
  const url = `${BASE_URL}/${type}/${id}/reviews`;
  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${API_KEY}`,
      'Content-Type': 'application/json',
    },
  });
  if (!response.ok) throw new Error('Erreur lors de la récupération des avis');
  return response.json();
}
// Récupérer toutes les séries (discover, triées par date de première diffusion décroissante)
export async function fetchAllSeries(page = 1) {
  const response = await fetch(`${BASE_URL}/discover/tv?page=${page}&sort_by=first_air_date.desc`, {
    headers: {
      Authorization: `Bearer ${API_KEY}`,
      'Content-Type': 'application/json',
    },
  });
  if (!response.ok) {
    throw new Error('Erreur lors de la récupération de toutes les séries');
  }
  return response.json();
}
// Recherche films ET séries (combine movie et tv)
export async function searchMoviesAndSeries(query, page = 1) {
  if (!query) return { results: [], total_pages: 1 };
  const API_KEY = process.env.REACT_APP_API_KEY;
  const BASE_URL = 'https://api.themoviedb.org/3';
  // Appel films
  const movieRes = await fetch(`${BASE_URL}/search/movie?query=${encodeURIComponent(query)}&page=${page}`, {
    headers: {
      Authorization: `Bearer ${API_KEY}`,
      'Content-Type': 'application/json',
    },
  });
  // Appel séries
  const tvRes = await fetch(`${BASE_URL}/search/tv?query=${encodeURIComponent(query)}&page=${page}`, {
    headers: {
      Authorization: `Bearer ${API_KEY}`,
      'Content-Type': 'application/json',
    },
  });
  let movieData = { results: [], total_pages: 1 };
  let tvData = { results: [], total_pages: 1 };
  if (movieRes.ok) movieData = await movieRes.json();
  if (tvRes.ok) tvData = await tvRes.json();
  // Ajoute un champ media_type pour différencier
  const movies = (movieData.results || []).map(m => ({ ...m, media_type: 'movie' }));
  const series = (tvData.results || []).map(s => ({ ...s, media_type: 'tv' }));
  return {
    results: [...movies, ...series],
    total_pages: Math.max(movieData.total_pages || 1, tvData.total_pages || 1)
  };
}
// Recherche de films par titre (pour l'autocomplétion)
export async function searchMovies(query, page = 1) {
  if (!query) return { results: [], total_pages: 1 };
  const API_KEY = process.env.REACT_APP_API_KEY;
  const BASE_URL = 'https://api.themoviedb.org/3';
  const response = await fetch(`${BASE_URL}/search/movie?query=${encodeURIComponent(query)}&page=${page}`, {
    headers: {
      Authorization: `Bearer ${API_KEY}`,
      'Content-Type': 'application/json',
    },
  });
  if (!response.ok) {
    return { results: [], total_pages: 1 };
  }
  const data = await response.json();
  return { results: data.results || [], total_pages: data.total_pages || 1 };
}

// Récupérer les séries populaires
export async function fetchPopularSeries(page = 1) {
  const response = await fetch(`${BASE_URL}/tv/popular?page=${page}`, {
    headers: {
      Authorization: `Bearer ${API_KEY}`,
      'Content-Type': 'application/json',
    },
  });
  if (!response.ok) {
    throw new Error('Erreur lors de la récupération des séries populaires');
  }
  return response.json();
}
// Récupérer tous les films (discover, triés par date de sortie décroissante)
export async function fetchAllMovies(page = 1) {
  const response = await fetch(`${BASE_URL}/discover/movie?page=${page}&sort_by=release_date.desc`, {
    headers: {
      Authorization: `Bearer ${API_KEY}`,
      'Content-Type': 'application/json',
    },
  });
  if (!response.ok) {
    throw new Error('Erreur lors de la récupération de tous les films');
  }
  return response.json();
}
// src/services/api.js

const API_KEY = process.env.REACT_APP_API_KEY;
const BASE_URL = 'https://api.themoviedb.org/3';

// Récupérer les films populaires
export async function fetchPopularMovies(page = 1) {
  const response = await fetch(`${BASE_URL}/movie/popular?page=${page}`, {
    headers: {
      Authorization: `Bearer ${API_KEY}`,
      'Content-Type': 'application/json',
    },
  });
  if (!response.ok) {
    throw new Error('Erreur lors de la récupération des films populaires');
  }
  return response.json();
}


