import React from "react";

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
                        <div style={{ background: '#1e293b', padding: '2rem', borderRadius: '12px', minWidth: 320, maxWidth: 400, color: '#fff', position: 'relative' }}>
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
                                <button type="submit" className="bg-[#4e8fae] hover:bg-[#aee1f9] text-[#111827] font-bold py-2 px-4 rounded transition-colors w-full">Envoyer</button>
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
                        className="hover:text-[#4e8fae] transition-colors duration-200 underline"
                        style={{ color: '#fff' }}
                    >
                        Qui sommes-nous ?
                    </a>
                </nav>
                <div className="text-center font-bold text-white tracking-wide" style={{ marginTop: '2.5rem', marginBottom: '2.5rem', fontSize: '2rem' }}>
                    Site n°1 dans le référencement de films et séries !
                </div>
                <hr style={{ border: 0, height: '1px', background: '#1e293b', opacity: 0.7, width: '100%', margin: '0 auto 2.5rem auto' }} />
                <div className="text-xs text-[#4e8fae] text-center" style={{ marginTop: 0 }}>&copy; {new Date().getFullYear()} Cinetech. Tous droits réservés.</div>
            </div>
        </footer>
    );
};

export default Footer;
