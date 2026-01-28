import { useEffect } from 'react';
import './App.css';

import Header from './components/Header';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Movies from './pages/Movies';
import Series from './pages/Series';
import Favoris from './pages/Favoris';
import Login from './pages/Login';
import PrivateRoute from './components/PrivateRoute';
import SearchResults from './pages/SearchResults';
import Home from './pages/Home';
import Details from './pages/Details';
import PersonFilmography from './pages/PersonFilmography';

function App() {
  useEffect(() => {
    document.body.style.color = '#fff';
    return () => { document.body.style.color = null; };
  }, []);
  return (
    <Router>
      <div className="App">
        <Header />
        <main className="main-content" style={{ maxWidth: '1200px', margin: '130px auto 0 auto', padding: '24px' }}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/movies" element={<Movies />} />
            <Route path="/series" element={<Series />} />
            <Route path="/favoris" element={
              <PrivateRoute>
                <Favoris />
              </PrivateRoute>
            } />
            <Route path="/login" element={<Login />} />
            <Route path="/search" element={<SearchResults />} />
            <Route path="/:type/:id" element={<Details />} />
            <Route path="/person/:personId" element={<PersonFilmography />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
