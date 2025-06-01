const RAWG_API_KEY = '3f8c88dd32804bbabf6f07f93c8e0109';
const RAWG_API_URL = 'https://api.rawg.io/api/games';

// DOM Elements
const searchInput = document.getElementById('searchInput');
const searchButton = document.getElementById('searchButton');
const searchResults = document.getElementById('searchResults');
const trendingGames = document.getElementById('trendingGames');
const loadingSpinner = document.getElementById('loadingSpinner');
const themeToggle = document.getElementById('themeToggle');
const sortSelect = document.getElementById('sortSelect');
const platformSelect = document.getElementById('platformSelect');
const genreSelect = document.getElementById('genreSelect');
const yearSelect = document.getElementById('yearSelect');
const applyFilters = document.getElementById('applyFilters');

// Theme Toggle
themeToggle.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
    const isDarkMode = document.body.classList.contains('dark-mode');
    localStorage.setItem('darkMode', isDarkMode);
});

// Load saved theme preference
if (localStorage.getItem('darkMode') === 'true') {
    document.body.classList.add('dark-mode');
}

// Initialize Filters
async function initializeFilters() {
    try {
        // Fetch platforms
        const platformsResponse = await fetch('/api/platforms');
        const platformsData = await platformsResponse.json();
        platformSelect.innerHTML = '<option value="">All Platforms</option>' +
            platformsData.results.map(platform => 
                `<option value="${platform.id}">${platform.name}</option>`
            ).join('');

        // Fetch genres
        const genresResponse = await fetch('/api/genres');
        const genresData = await genresResponse.json();
        genreSelect.innerHTML = '<option value="">All Genres</option>' +
            genresData.results.map(genre => 
                `<option value="${genre.id}">${genre.name}</option>`
            ).join('');

        // Add years (last 10 years)
        const currentYear = new Date().getFullYear();
        yearSelect.innerHTML = '<option value="">All Years</option>' +
            Array.from({length: 10}, (_, i) => currentYear - i)
                .map(year => `<option value="${year}">${year}</option>`)
                .join('');
    } catch (error) {
        console.error('Error initializing filters:', error);
    }
}

// Search Function
async function searchGames(query) {
    try {
        showLoading();
        const response = await fetch(`/api/search?query=${encodeURIComponent(query)}`);
        const data = await response.json();
        displayGames(data.results, searchResults.querySelector('.games-container'));
        searchResults.classList.remove('hidden');
        trendingGames.classList.add('hidden');
    } catch (error) {
        console.error('Error searching games:', error);
        searchResults.innerHTML = '<p class="error">Error searching games. Please try again.</p>';
    } finally {
        hideLoading();
    }
}

// Fetch Games with Filters
async function fetchFilteredGames() {
    try {
        showLoading();
        const params = new URLSearchParams({
            ordering: sortSelect.value,
            platform: platformSelect.value,
            genre: genreSelect.value,
            year: yearSelect.value
        });

        const response = await fetch(`/api/games?${params}`);
        const data = await response.json();
        displayGames(data.results, searchResults.querySelector('.games-container'));
        searchResults.classList.remove('hidden');
        trendingGames.classList.add('hidden');
    } catch (error) {
        console.error('Error fetching filtered games:', error);
        searchResults.innerHTML = '<p class="error">Error loading games. Please try again.</p>';
    } finally {
        hideLoading();
    }
}

// Fetch Trending Games
async function fetchTrendingGames() {
    try {
        const response = await fetch('/api/trending');
        const data = await response.json();
        displayGames(data.results, trendingGames.querySelector('.games-container'));
    } catch (error) {
        console.error('Error fetching trending games:', error);
        trendingGames.innerHTML = '<p class="error">Error loading trending games. Please refresh the page.</p>';
    }
}

// Display Games
function displayGames(games, container) {
    if (!games || games.length === 0) {
        container.innerHTML = '<p>No games found.</p>';
        return;
    }

    const gamesHTML = games.map(game => `
        <a href="game?id=${game.id}" class="game-card">
            <img src="${game.background_image || 'placeholder.jpg'}" alt="${game.name}">
            <div class="game-card-content">
                <h3>${game.name}</h3>
                <p>Released: ${game.released || 'TBA'}</p>
                <div class="rating">
                    <span>⭐</span>
                    <span>${game.rating?.toFixed(1) || 'N/A'}</span>
                </div>
            </div>
        </a>
    `).join('');

    container.innerHTML = gamesHTML;
}

// Loading State
function showLoading() {
    loadingSpinner.classList.remove('hidden');
}

function hideLoading() {
    loadingSpinner.classList.add('hidden');
}

// Event Listeners
searchButton.addEventListener('click', () => {
    const query = searchInput.value.trim();
    if (query) {
        searchGames(query);
    }
});

searchInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        const query = searchInput.value.trim();
        if (query) {
            searchGames(query);
        }
    }
});

applyFilters.addEventListener('click', fetchFilteredGames);

// Initialize
initializeFilters();
fetchTrendingGames(); 