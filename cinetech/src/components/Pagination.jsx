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
        <div className="flex justify-center gap-1 md:gap-2 my-6 md:my-8 flex-wrap px-2">
            <button
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className={`px-2 py-1.5 md:px-3 md:py-2 rounded border-none bg-slate-800 text-white text-sm md:text-base transition-opacity ${currentPage === 1 ? 'cursor-not-allowed opacity-50' : 'cursor-pointer opacity-100 hover:bg-slate-700'}`}
            >
                &lt;
            </button>
            {pages.map(page => (
                <button
                    key={page}
                    onClick={() => onPageChange(page)}
                    className={`px-2 py-1.5 md:px-3 md:py-2 rounded border-none text-sm md:text-base cursor-pointer transition-all ${page === currentPage
                        ? 'bg-[#24f7fb] text-slate-900 font-bold shadow-[0_2px_8px_#fbbf2433]'
                        : 'bg-slate-800 text-white font-normal hover:bg-slate-700'
                        }`}
                >
                    {page}
                </button>
            ))}
            <button
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className={`px-2 py-1.5 md:px-3 md:py-2 rounded border-none bg-slate-800 text-white text-sm md:text-base transition-opacity ${currentPage === totalPages ? 'cursor-not-allowed opacity-50' : 'cursor-pointer opacity-100 hover:bg-slate-700'}`}
            >
                &gt;
            </button>
        </div>
    );
}
