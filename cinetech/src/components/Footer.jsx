const Footer = () => {
    return (
        <footer className="text-[#aee1f9] mt-16 w-full" style={{ background: '#111827', padding: '2rem 0' }}>
            <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 2rem' }} className="flex flex-col items-center justify-center w-full">
                <nav className="flex flex-wrap justify-center gap-x-10 gap-y-2" style={{ marginBottom: '2.5rem' }}>
                    <a
                        href="#contact"
                        role="button"
                        tabIndex={0}
                        className="hover:text-[#4e8fae] transition-colors duration-200 underline"
                        style={{ color: '#fff', marginRight: '2.5rem', background: 'none', border: 'none', cursor: 'pointer', display: 'inline', font: 'inherit', padding: 0, textDecoration: 'underline' }}
                        onClick={e => {
                            e.preventDefault();
                            const modal = document.getElementById('contact-modal');
                            if (modal) modal.style.display = 'flex';
                        }}
                    >
                        Contact
                    </a>
                    {/* Modal de contact */}
                    <div id="contact-modal" style={{ display: 'none', position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.6)', alignItems: 'center', justifyContent: 'center', zIndex: 9999 }}>
                        <div style={{ background: '#1a2636', padding: '2rem', borderRadius: '12px', minWidth: 320, maxWidth: 400, color: '#fff', position: 'relative', border: '2.5px solid #4ee1ff', boxShadow: '0 0 16px 4px #4ee1ff, 0 0 32px 8px #1a2636 inset' }}>
                            <button onClick={() => { document.getElementById('contact-modal').style.display = 'none'; }} style={{ position: 'absolute', top: 8, right: 12, background: 'none', border: 'none', color: '#fff', fontSize: 22, cursor: 'pointer' }}>&times;</button>
                            <h2 className="text-lg font-bold mb-4" style={{ color: '#aee1f9' }}>Contactez-nous</h2>
                            <form>
                                <div className="mb-3">
                                    <label htmlFor="contact-email" className="block mb-1">Votre email</label>
                                    <input id="contact-email" type="email" required className="w-full px-2 py-1 rounded text-black" style={{ width: '100%' }} />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="contact-message" className="block mb-1">Message</label>
                                    <textarea id="contact-message" required className="w-full px-2 py-1 rounded text-black" rows={4} style={{ width: '100%' }} />
                                </div>
                                <button
                                    type="submit"
                                    style={{
                                        width: '100%',
                                        borderRadius: '12px',
                                        padding: '10px 24px',
                                        fontSize: '16px',
                                        fontWeight: '600',
                                        background: '#06b6d4',
                                        color: '#fff',
                                        border: 'none',
                                        cursor: 'pointer',
                                        transition: 'all 0.3s ease',
                                        boxShadow: '0 0 0 rgba(6, 182, 212, 0)'
                                    }}
                                    onMouseEnter={(e) => {
                                        e.target.style.background = '#0e7490';
                                        e.target.style.boxShadow = '0 0 20px rgba(6, 182, 212, 0.6), 0 0 40px rgba(6, 182, 212, 0.3)';
                                    }}
                                    onMouseLeave={(e) => {
                                        e.target.style.background = '#06b6d4';
                                        e.target.style.boxShadow = '0 0 0 rgba(6, 182, 212, 0)';
                                    }}
                                >
                                    Envoyer
                                </button>
                            </form>
                        </div>
                    </div>
                    <a
                        href="https://www.themoviedb.org/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-[#4e8fae] transition-colors duration-200 underline"
                        style={{ color: '#fff', marginRight: '2.5rem' }}
                    >
                        API TMDB
                    </a>
                    <a
                        href="#quisommesnous"
                        role="button"
                        tabIndex={0}
                        className="hover:text-[#4e8fae] transition-colors duration-200 underline"
                        style={{ color: '#fff', background: 'none', border: 'none', cursor: 'pointer', display: 'inline', font: 'inherit', padding: 0, textDecoration: 'underline' }}
                        onClick={e => {
                            e.preventDefault();
                            const modal = document.getElementById('quisommes-modal');
                            if (modal) modal.style.display = 'flex';
                        }}
                    >
                        Qui sommes-nous ?
                    </a>
                    {/* Modal Qui sommes-nous ? */}
                    <div id="quisommes-modal" style={{ display: 'none', position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.6)', alignItems: 'center', justifyContent: 'center', zIndex: 9999 }}>
                        <div style={{ background: '#1a2636', padding: '2rem', borderRadius: '12px', minWidth: 320, maxWidth: 500, color: '#fff', position: 'relative', maxHeight: '80vh', overflowY: 'auto', border: '2.5px solid #4ee1ff', boxShadow: '0 0 16px 4px #4ee1ff, 0 0 32px 8px #1a2636 inset' }}>
                            <button onClick={() => { document.getElementById('quisommes-modal').style.display = 'none'; }} style={{ position: 'absolute', top: 8, right: 12, background: 'none', border: 'none', color: '#fff', fontSize: 22, cursor: 'pointer' }}>&times;</button>
                            <h2 className="text-lg font-bold mb-4" style={{ color: '#aee1f9' }}>Qui sommes-nous ?</h2>
                            <div style={{ lineHeight: '1.7', fontSize: '1rem', color: '#e0e0e0' }}>
                                Bienvenue sur notre cinetech, site préféré des français en terme de référencement de films et de séries. <br></br>
                                Découvrez les dernières nouveautés ainsi que les programmes les plus populaires.<br></br>
                                Promenez-vous sur le site, découvrez notre contenu, apprenez-en plus sur vos films et séries préférées, ajoutez-les à vos favoris, laissez des avis et commentaires.
                                <h2 className="text-lg font-bold mb-4" style={{ color: '#aee1f9' }}>Pourquoi sommes-nous les meilleurs ?</h2>
                                Notre site a été pensé pour faciliter vos recherches, retrouvez toutes les informations dont vous avez besoin en seulement quelques clics ! <br></br> <br></br>
                                Nous vous souhaitons une bonne découverte !
                            </div>
                        </div>
                    </div>
                </nav>
                <div className="text-center font-bold text-white tracking-wide" style={{ marginTop: '2.5rem', marginBottom: '2.5rem', fontSize: '1.5rem' }}>
                    Site n°1 dans le référencement de films et séries !
                </div>
                <hr style={{ border: 0, height: '1px', background: '#1e293b', opacity: 0.7, width: '100%', margin: '0 auto 2.5rem auto' }} />
                <div className="text-xs text-[#4e8fae] text-center" style={{ marginTop: 0 }}>&copy; {new Date().getFullYear()} Cinetech. Tous droits réservés.</div>
            </div>
        </footer>
    );
};

export default Footer;
