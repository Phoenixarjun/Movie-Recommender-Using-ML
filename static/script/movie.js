document.addEventListener('DOMContentLoaded', function () {
    const movieTitle = decodeURIComponent(window.location.pathname.split('/').pop());
    const container = document.getElementById('recommendations-container');

    container.innerHTML = `
        <div class="loader-container">
            <div class="loader"></div>
            <p>Loading recommendations...</p>
        </div>
    `;

    fetch(`/api/movies/${movieTitle}/recommendations`)
        .then(res => res.json())
        .then(data => {
            container.innerHTML = '';
            if (data.error || !data.recommendations.length) {
                container.innerHTML = `<p class="no-results">${data.error || 'No recommendations found.'}</p>`;
                return;
            }

            data.recommendations.forEach(movie => {
                const movieCard = document.createElement('div');
                movieCard.className = 'movie-card';
                movieCard.innerHTML = `
                    <a href="/movie/${encodeURIComponent(movie.title)}">
                        <div class="movie-poster-container">
<img 
    src="${movie.poster || 'data:image/svg+xml;utf8,<svg xmlns=%27http://www.w3.org/2000/svg%27 width=%27300%27 height=%27450%27 viewBox=%270 0 300 450%27><rect width=%27300%27 height=%27450%27 fill=%27%23f3f4f6%27/><text x=%2750%25%27 y=%2750%25%27 dominant-baseline=%27middle%27 text-anchor=%27middle%27 fill=%27%239ca3af%27 font-family=%27sans-serif%27 font-size=%2720%27>Image Not Found</text></svg>'}" 
    alt="${movie.title}" 
    class="movie-poster" 
    onerror="this.onerror=null; this.src='data:image/svg+xml;utf8,<svg xmlns=%27http://www.w3.org/2000/svg%27 width=%27300%27 height=%27450%27 viewBox=%270 0 300 450%27><rect width=%27300%27 height=%27450%27 fill=%27%23f3f4f6%27/><text x=%2750%25%27 y=%2750%25%27 dominant-baseline=%27middle%27 text-anchor=%27middle%27 fill=%27%239ca3af%27 font-family=%27sans-serif%27 font-size=%2720%27>No Image</text></svg>'">
                            <div class="movie-overlay">
                                <div class="movie-rating">
                                    <i class="fas fa-star"></i> ${movie.rating}
                                </div>
                                <div class="movie-year">${movie.year}</div>
                            </div>
                        </div>
                        <h3 class="movie-title">${movie.title}</h3>
                    </a>
                `;
                container.appendChild(movieCard);
            }); 
        })
        .catch(err => {
            console.error(err);
            container.innerHTML = '<p class="error-message">Failed to load recommendations.</p>';
        });
});
