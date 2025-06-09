document.addEventListener('DOMContentLoaded', function () {
    const searchButton = document.getElementById('search-button');
    const searchInput = document.getElementById('search-input');
    const ratingFilter = document.getElementById('rating-filter');
    const genreFilter = document.getElementById('genre-filter');
    const yearFilter = document.getElementById('year-filter');
    const votesFilter = document.getElementById('votes-filter');
    const resultsContainer = document.getElementById('search-results');
    const paginationContainer = document.getElementById('pagination');

    let filteredMovies = [];
    let currentPage = 1;
    const MOVIES_PER_PAGE = 10;

    function showLoader() {
        resultsContainer.innerHTML = `
            <div class="loader-container">
                <div class="loader"></div>
                <p class="loading-text">Loading movies...</p>
            </div>
        `;
    }

    function paginateData(data) {
        const start = (currentPage - 1) * MOVIES_PER_PAGE;
        return data.slice(start, start + MOVIES_PER_PAGE);
    }

    function renderPagination(totalPages) {
        paginationContainer.innerHTML = '';
        if (totalPages <= 1) return;

        const createBtn = (page, text = null) => {
            const btn = document.createElement('button');
            btn.textContent = text || page;
            btn.className = page === currentPage ? 'active' : '';
            btn.disabled = page === currentPage;
            btn.addEventListener('click', () => {
                currentPage = page;
                displayMovies();
            });
            return btn;
        };

        const addEllipsis = () => {
            const span = document.createElement('span');
            span.textContent = '...';
            span.className = 'ellipsis';
            paginationContainer.appendChild(span);
        };

        // Prev button
        if (currentPage > 1) {
            const prevBtn = createBtn(currentPage - 1, 'Prev');
            prevBtn.classList.add('prev-btn');
            paginationContainer.appendChild(prevBtn);
        }

        // First page
        paginationContainer.appendChild(createBtn(1));

        // Left Ellipsis
        if (currentPage > 4) addEllipsis();

        // Middle pages
        const start = Math.max(2, currentPage - 1);
        const end = Math.min(totalPages - 1, currentPage + 1);
        for (let i = start; i <= end; i++) {
            paginationContainer.appendChild(createBtn(i));
        }

        // Right Ellipsis
        if (currentPage < totalPages - 3) addEllipsis();

        // Last page
        if (totalPages > 1) {
            paginationContainer.appendChild(createBtn(totalPages));
        }

        // Next button
        if (currentPage < totalPages) {
            const nextBtn = createBtn(currentPage + 1, 'Next');
            nextBtn.classList.add('next-btn');
            paginationContainer.appendChild(nextBtn);
        }
    }

    function displayMovies() {
        const paginated = paginateData(filteredMovies);
        resultsContainer.innerHTML = '';

        paginated.forEach(movie => {
            const card = document.createElement('div');
            card.className = 'movie-card';
            card.innerHTML = `
                <a href="/movie/${encodeURIComponent(movie.title)}">
                    <div class="movie-poster-container">
                        <img 
                            src="${movie.poster || 'data:image/svg+xml;utf8,<svg xmlns=%27http://www.w3.org/2000/svg%27 width=%27300%27 height=%27450%27 viewBox=%270 0 300 450%27><rect width=%27300%27 height=%27450%27 fill=%27%23f3f4f6%27/><text x=%2750%25%27 y=%2750%25%27 dominant-baseline=%27middle%27 text-anchor=%27middle%27 fill=%27%239ca3af%27 font-family=%27sans-serif%27 font-size=%2720%27>No Image</text></svg>'}" 
                            alt="${movie.title}" 
                            class="movie-poster"
                            onerror="this.onerror=null; this.src='data:image/svg+xml;utf8,<svg xmlns=%27http://www.w3.org/2000/svg%27 width=%27300%27 height=%27450%27 viewBox=%270 0 300 450%27><rect width=%27300%27 height=%27450%27 fill=%27%23f3f4f6%27/><text x=%2750%25%27 y=%2750%25%27 dominant-baseline=%27middle%27 text-anchor=%27middle%27 fill=%27%239ca3af%27 font-family=%27sans-serif%27 font-size=%2720%27>No Image</text></svg>'">
                        <div class="movie-overlay">
                            <div class="movie-rating"><i class="fas fa-star"></i> ${movie.rating}</div>
                            <div class="movie-year">${movie.year}</div>
                        </div>
                    </div>
                    <h3 class="movie-title">${movie.title}</h3>
                </a>
            `;
            resultsContainer.appendChild(card);
        });

        const totalPages = Math.ceil(filteredMovies.length / MOVIES_PER_PAGE);
        renderPagination(totalPages);
    }

    function performSearch() {
        showLoader();
        const query = searchInput.value.trim().toLowerCase();
        const rating = parseFloat(ratingFilter.value);
        const genre = genreFilter.value;
        const year = yearFilter.value;
        const votes = parseInt(votesFilter.value);

        fetch('/all-movies')
            .then(res => res.json())
            .then(data => {
                filteredMovies = data.movies.filter(movie => {
                    if (query && !movie.title.toLowerCase().includes(query)) return false;
                    if (rating && parseFloat(movie.rating) < rating) return false;
                    if (genre && !movie.genre.includes(genre)) return false;
                    if (year && !movie.year.startsWith(year)) return false;
                    if (votes) {
                        const movieVotes = parseInt((movie.votes || '0').replace(/,/g, ''));
                        if (movieVotes < votes) return false;
                    }
                    return true;
                });

                if (!filteredMovies.length) {
                    resultsContainer.innerHTML = '<p class="no-results">No movies found matching your criteria.</p>';
                    paginationContainer.innerHTML = '';
                    return;
                }

                currentPage = 1;
                displayMovies();
            })
            .catch(err => {
                console.error(err);
                resultsContainer.innerHTML = '<p class="error-message">Failed to load movies.</p>';
            });
    }

    searchButton.addEventListener('click', performSearch);
    searchInput.addEventListener('keypress', e => e.key === 'Enter' && performSearch());
    [ratingFilter, genreFilter, yearFilter, votesFilter].forEach(el => el.addEventListener('change', performSearch));

    performSearch();
});
