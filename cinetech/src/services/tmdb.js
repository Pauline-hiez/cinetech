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


