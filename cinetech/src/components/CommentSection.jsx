
import React, { useState } from "react";

// Composant d'étoiles interactives
function StarRating({ rating, setRating }) {
    const [hovered, setHovered] = useState(0);
    return (
        <div style={{ display: "flex", gap: 4 }}>
            {[1, 2, 3, 4, 5].map((star) => {
                const filled = hovered ? star <= hovered : star <= rating;
                return (
                    <span
                        key={star}
                        style={{
                            cursor: "pointer",
                            color: filled ? "#4ee1ff" : "#233a4d",
                            textShadow: filled ? "0 0 8px #4ee1ff, 0 0 2px #fff" : "none",
                            fontSize: 24,
                            transition: 'color 0.18s, text-shadow 0.18s',
                        }}
                        onClick={() => setRating(star)}
                        onMouseEnter={() => setHovered(star)}
                        onMouseLeave={() => setHovered(0)}
                        data-testid={`star-${star}`}
                    >
                        ★
                    </span>
                );
            })}
        </div>
    );
}

// Section commentaires/avis

const CommentSection = ({ comments = [], onSubmit, user }) => {
    const [comment, setComment] = useState("");
    const [rating, setRating] = useState(0);
    const [error, setError] = useState("");
    // Toujours utiliser le pseudo de l'utilisateur connecté si présent
    const [username, setUsername] = useState(user?.name || "");

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!user && !username.trim()) {
            setError("Veuillez indiquer votre nom ou être connecté.");
            return;
        }
        if (rating === 0) {
            setError("Veuillez donner une note.");
            return;
        }
        // Si l'utilisateur est connecté, on force le pseudo à user.name
        const finalUser = user && user.name ? user.name : username || "Utilisateur";
        onSubmit && onSubmit({ comment, rating, user: finalUser });
        setComment("");
        setRating(0);
        setError("");
    };

    return (
        <section
            className="comment-section"
            style={{
                margin: "48px 0 0 0",
                padding: 24,
                background: "#1a2636",
                borderRadius: 12,
                border: "2.5px solid #4ee1ff",
                boxShadow: "0 0 16px 4px #4ee1ff, 0 0 32px 8px #1a2636 inset",
                outline: "none",
                transition: "box-shadow 0.2s, border 0.2s"
            }}
        >
            <h3 style={{ marginBottom: 16 }}>Avis et commentaires</h3>
            <form onSubmit={handleSubmit} style={{ marginBottom: 24 }}>
                <div style={{ marginBottom: 8 }}>
                    <StarRating rating={rating} setRating={setRating} />
                </div>
                {/* Si l'utilisateur est connecté, on n'affiche pas le champ nom */}
                {!user?.name && (
                    <input
                        type="text"
                        value={username}
                        onChange={e => setUsername(e.target.value)}
                        placeholder="Votre nom"
                        style={{
                            width: "100%",
                            minWidth: 0,
                            borderRadius: 8,
                            padding: 12,
                            marginBottom: 12,
                            fontWeight: 500,
                            fontSize: 17,
                            background: '#22304a',
                            color: '#aee1f9',
                            border: '1.5px solid #4ee1ff',
                            boxSizing: 'border-box',
                            boxShadow: '0 0 8px #4ee1ff44',
                            outline: 'none',
                            transition: 'border 0.2s, box-shadow 0.2s'
                        }}
                    />
                )}
                <textarea
                    value={comment}
                    onChange={e => setComment(e.target.value)}
                    rows={3}
                    placeholder="Votre commentaire..."
                    style={{
                        width: "100%",
                        minWidth: 0,
                        borderRadius: 8,
                        padding: 12,
                        fontSize: 16,
                        background: '#22304a',
                        color: '#fff',
                        border: '1.5px solid #4ee1ff',
                        boxSizing: 'border-box',
                        boxShadow: '0 0 8px #4ee1ff44',
                        outline: 'none',
                        marginBottom: 8,
                        resize: 'vertical',
                        transition: 'border 0.2s, box-shadow 0.2s'
                    }}
                />
                {error && <div style={{ color: "#ff7675", margin: "8px 0" }}>{error}</div>}
                <button
                    type="submit"
                    className="search-filters-btn"
                    style={{ maxWidth: 220, margin: '12px auto 0 auto', display: 'block' }}
                >
                    Publier
                </button>
            </form>
            <div>
                {comments.length === 0 ? (
                    <div style={{ color: "#aaa" }}>Aucun commentaire pour l'instant.</div>
                ) : (
                    comments.map((c, idx) => (
                        <div key={idx} style={{
                            marginBottom: 18,
                            padding: 18,
                            background: "#22304a",
                            borderRadius: 10,
                            width: '100%',
                            boxSizing: 'border-box',
                            boxShadow: '0 0 8px #4ee1ff22',
                            textAlign: 'left',
                        }}>
                            <>
                                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                                    <span style={{ fontWeight: 600, fontSize: 18 }}>{c.user || "Utilisateur"}</span>
                                    <StarRating rating={c.rating} setRating={() => { }} />
                                </div>
                                {c.date && c.time && (
                                    <div style={{ fontSize: 13, color: '#aee1f9', marginBottom: 4, marginLeft: 2 }}>
                                        {c.date} à {c.time}
                                    </div>
                                )}
                                <div style={{ marginTop: 6 }}>{c.comment}</div>
                            </>
                        </div>
                    ))
                )}
            </div>
        </section>
    );
};

export default CommentSection;
