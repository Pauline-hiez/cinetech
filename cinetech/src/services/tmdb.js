
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


