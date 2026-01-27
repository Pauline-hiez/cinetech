
import './App.css';

import Header from './components/Header';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Movies from './pages/Movies';
import Series from './pages/Series';
import Favoris from './pages/Favoris';

function App() {
  return (
    <Router>
      <div className="App" style={{ minHeight: '100vh', background: '#f8fafc' }}>
        <Header />
        <main className="main-content" style={{ maxWidth: '1200px', margin: '40px auto 0 auto', padding: '24px' }}>
          <Routes>
            <Route path="/" element={
              <>
                <h1>Bienvenue sur Cinetech</h1>
                <p>Votre contenu principal s'affichera ici.</p>
              </>
            } />
            <Route path="/movies" element={<Movies />} />
            <Route path="/series" element={<Series />} />
            <Route path="/favoris" element={<Favoris />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
