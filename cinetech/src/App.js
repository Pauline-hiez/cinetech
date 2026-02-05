import { useEffect } from 'react';
import './App.tailwind.css';

import Header from './components/Header';
import Footer from './components/Footer';
import StarryBackground from './components/StarryBackground';
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
      <StarryBackground />
      <div className="App min-h-screen flex flex-col justify-between relative" style={{ position: 'relative', zIndex: 10 }}>
        <Header />
        <main className="flex-1 w-full max-w-[1200px] mx-auto mt-[70px] md:mt-[130px] mb-0 px-3 md:px-6">
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
        <Footer />
      </div>
    </Router>
  );
}


export default App;
