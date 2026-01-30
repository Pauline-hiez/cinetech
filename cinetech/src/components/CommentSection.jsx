
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

const CommentSection = ({ comments = [], onSubmit, onDelete, onEdit, user }) => {
    const [comment, setComment] = useState("");
    const [rating, setRating] = useState(0);
    const [error, setError] = useState("");
    // Toujours utiliser le pseudo de l'utilisateur connecté si présent
    // Suppression du champ nom pour les non-connectés : seuls les connectés peuvent commenter

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!user) {
            setError("Vous devez être connecté pour publier un commentaire.");
            return;
        }
        if (rating === 0) {
            setError("Veuillez donner une note.");
            return;
        }
        onSubmit && onSubmit({ comment, rating, user: user.username });
        setComment("");
        setRating(0);
        setError("");
    };

    const [editIdx, setEditIdx] = useState(null);
    const [editComment, setEditComment] = useState("");
    const [editRating, setEditRating] = useState(0);

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
            {user ? (
                <form onSubmit={handleSubmit} style={{ marginBottom: 24 }}>
                    <div style={{ marginBottom: 8 }}>
                        <StarRating rating={rating} setRating={setRating} />
                    </div>
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
            ) : (
                <div style={{ color: '#aee1f9', marginBottom: 24, textAlign: 'center', fontSize: 17 }}>
                    Connectez-vous pour publier un commentaire.
                </div>
            )}
            <div>
                {comments.length === 0 ? (
                    <div style={{ color: "#aaa" }}>Aucun commentaire pour l'instant.</div>
                ) : (
                    comments.map((c, idx) => {
                        const isOwner = user && c.user === user.username;
                        const isEditing = editIdx === idx;
                        return (
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
                                {isEditing && isOwner && user ? (
                                    <form
                                        onSubmit={e => {
                                            e.preventDefault();
                                            if (user && isOwner) {
                                                onEdit && onEdit(idx, { ...c, comment: editComment, rating: editRating });
                                            }
                                            setEditIdx(null);
                                        }}
                                    >
                                        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                                            <span style={{ fontWeight: 600, fontSize: 18 }}>{c.user || "Utilisateur"}</span>
                                            <StarRating rating={editRating} setRating={setEditRating} />
                                        </div>
                                        <textarea
                                            value={editComment}
                                            onChange={e => setEditComment(e.target.value)}
                                            rows={3}
                                            style={{ width: '100%', margin: '8px 0', borderRadius: 8, padding: 8 }}
                                        />
                                        <button type="submit" className="search-filters-btn" style={{ maxWidth: 90, padding: '6px 0', fontSize: 14, borderRadius: 16, marginRight: 8, display: 'inline-block' }}>Enregistrer</button>
                                        <button type="button" className="search-filters-btn" style={{ maxWidth: 90, padding: '6px 0', fontSize: 14, borderRadius: 16, background: '#64748b', color: '#fff', display: 'inline-block' }} onClick={() => setEditIdx(null)}>Annuler</button>
                                    </form>
                                ) : (
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
                                        {isOwner && user && (
                                            <div style={{ marginTop: 8 }}>
                                                <button
                                                    className="search-filters-btn"
                                                    style={{ maxWidth: 80, padding: '6px 0', fontSize: 14, borderRadius: 16, marginRight: 8, display: 'inline-block' }}
                                                    onClick={() => {
                                                        setEditIdx(idx);
                                                        setEditComment(c.comment);
                                                        setEditRating(c.rating);
                                                    }}
                                                >
                                                    Modifier
                                                </button>
                                                <button
                                                    className="search-filters-btn"
                                                    style={{ maxWidth: 80, padding: '6px 0', fontSize: 14, borderRadius: 16, background: '#e53e3e', color: '#fff', display: 'inline-block' }}
                                                    onClick={() => onDelete && onDelete(idx)}
                                                >
                                                    Supprimer
                                                </button>
                                            </div>
                                        )}
                                    </>
                                )}
                            </div>
                        );
                    })
                )}
            </div>
        </section>
    );
};

export default CommentSection;
