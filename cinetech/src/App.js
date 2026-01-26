
import './App.css';
import Header from './components/Header';

function App() {
  return (
    <div className="App" style={{ minHeight: '100vh', background: '#f8fafc' }}>
      <Header />
      <main className="main-content" style={{ maxWidth: '1200px', margin: '40px auto 0 auto', padding: '24px' }}>
        {/* Placez ici vos routes ou votre contenu principal */}
        <h1>Bienvenue sur Cinetech</h1>
        <p>Votre contenu principal s'affichera ici.</p>
      </main>
    </div>
  );
}

export default App;
