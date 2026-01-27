import React from 'react';

export default function Pagination({ currentPage, totalPages, onPageChange }) {
    const pages = [];
    const maxPagesToShow = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2));
    let endPage = startPage + maxPagesToShow - 1;
    if (endPage > totalPages) {
        endPage = totalPages;
        startPage = Math.max(1, endPage - maxPagesToShow + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
    }

    return (
        <div style={{ display: 'flex', justifyContent: 'center', gap: 8, margin: '32px 0' }}>
            <button
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1}
                style={{ padding: '8px 14px', borderRadius: 6, border: 'none', background: '#1e293b', color: '#fff', cursor: currentPage === 1 ? 'not-allowed' : 'pointer', opacity: currentPage === 1 ? 0.5 : 1 }}
            >
                &lt;
            </button>
            {pages.map(page => (
                <button
                    key={page}
                    onClick={() => onPageChange(page)}
                    style={{
                        padding: '8px 14px',
                        borderRadius: 6,
                        border: 'none',
                        background: page === currentPage ? '#24f7fb' : '#1e293b',
                        color: page === currentPage ? '#1e293b' : '#fff',
                        fontWeight: page === currentPage ? 700 : 400,
                        cursor: 'pointer',
                        boxShadow: page === currentPage ? '0 2px 8px #fbbf2433' : 'none',
                        transition: 'background 0.2s',
                    }}
                >
                    {page}
                </button>
            ))}
            <button
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                style={{ padding: '8px 14px', borderRadius: 6, border: 'none', background: '#1e293b', color: '#fff', cursor: currentPage === totalPages ? 'not-allowed' : 'pointer', opacity: currentPage === totalPages ? 0.5 : 1 }}
            >
                &gt;
            </button>
        </div>
    );
}
