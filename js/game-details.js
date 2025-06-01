const RAWG_API_KEY = '3f8c88dd32804bbabf6f07f93c8e0109';
const RAWG_API_URL = 'https://api.rawg.io/api/games';

// DOM Elements
const loadingSpinner = document.getElementById('loadingSpinner');
const gameContent = document.getElementById('gameContent');
const gameImage = document.getElementById('gameImage');
const gameName = document.getElementById('gameName');
const gameRating = document.getElementById('gameRating');
const releaseDate = document.getElementById('releaseDate');
const platforms = document.getElementById('platforms');
const gameDescription = document.getElementById('gameDescription');
const minRequirements = document.getElementById('minRequirements');
const recRequirements = document.getElementById('recRequirements');
const screenshots = document.getElementById('screenshots');
const recommendations = document.getElementById('recommendations');
const reviews = document.getElementById('reviews');
const reviewForm = document.getElementById('reviewForm');
const themeToggle = document.getElementById('themeToggle');

// Get game ID from URL
const urlParams = new URLSearchParams(window.location.search);
const gameId = urlParams.get('id');

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

// Fetch Game Details
async function fetchGameDetails() {
    try {
        showLoading();
        const response = await fetch(`/api/game/${gameId}`);
        const data = await response.json();
        displayGameDetails(data);
        fetchRecommendations();
    } catch (error) {
        console.error('Error fetching game details:', error);
        gameContent.innerHTML = '<p class="error">Error loading game details. Please try again.</p>';
    } finally {
        hideLoading();
    }
}

// Display Game Details
function displayGameDetails(game) {
    // Set basic info
    document.title = `${game.name} - GameScope`;
    gameImage.src = game.background_image;
    gameImage.alt = game.name;
    gameName.textContent = game.name;
    gameRating.textContent = game.rating.toFixed(1);
    releaseDate.textContent = game.released || 'TBA';

    // Display platforms
    platforms.innerHTML = game.platforms
        .map(platform => `<span>${platform.platform.name}</span>`)
        .join('');

    // Display description
    gameDescription.innerHTML = game.description;

    // Display requirements if available
    if (game.platforms) {
        const pcPlatform = game.platforms.find(p => p.platform.name === 'PC');
        if (pcPlatform && pcPlatform.requirements) {
            const reqs = pcPlatform.requirements;
            minRequirements.innerHTML = formatRequirements(reqs.minimum);
            recRequirements.innerHTML = formatRequirements(reqs.recommended);
        } else {
            minRequirements.innerHTML = '<p>No minimum requirements specified</p>';
            recRequirements.innerHTML = '<p>No recommended requirements specified</p>';
        }
    }

    // Display screenshots
    fetchScreenshots(game.id);

    // Show content
    gameContent.classList.remove('hidden');
}

// Format Requirements
function formatRequirements(requirements) {
    if (!requirements) return '<p>Not specified</p>';
    
    // Common requirement categories and their English translations
    const categories = {
        'OS': 'Operating System',
        'Processor': 'CPU',
        'Memory': 'RAM',
        'Graphics': 'GPU',
        'DirectX': 'DirectX Version',
        'Storage': 'Storage Space',
        'Sound Card': 'Sound Card',
        'Additional Notes': 'Additional Notes',
        'Network': 'Network',
        'Resolution': 'Resolution'
    };

    // Split requirements into lines and format each line
    const lines = requirements.split('\n').filter(line => line.trim());
    return lines.map(line => {
        // Check if line contains a colon (likely a requirement category)
        if (line.includes(':')) {
            const [category, value] = line.split(':');
            const englishCategory = categories[category.trim()] || category.trim();
            return `
                <div class="requirement-item">
                    <strong>${englishCategory}:</strong>
                    <span>${value.trim()}</span>
                </div>
            `;
        }
        return `<p>${line.trim()}</p>`;
    }).join('');
}

// Fetch Screenshots
async function fetchScreenshots(gameId) {
    try {
        const response = await fetch(`/api/game/${gameId}/screenshots`);
        const data = await response.json();
        displayScreenshots(data.results);
    } catch (error) {
        console.error('Error fetching screenshots:', error);
    }
}

// Display Screenshots
function displayScreenshots(screenshots) {
    const screenshotsHTML = screenshots
        .map(screenshot => `
            <img src="${screenshot.image}" alt="Game Screenshot" onclick="openImage('${screenshot.image}')">
        `)
        .join('');
    document.getElementById('screenshots').innerHTML = screenshotsHTML;
}

// Fetch Recommendations
async function fetchRecommendations() {
    try {
        const response = await fetch(`/api/game/${gameId}/recommendations`);
        const data = await response.json();
        displayRecommendations(data.results);
    } catch (error) {
        console.error('Error fetching recommendations:', error);
    }
}

// Display Recommendations
function displayRecommendations(recommendedGames) {
    if (!recommendedGames || recommendedGames.length === 0) {
        recommendations.innerHTML = '<p>No recommendations available</p>';
        return;
    }

    const recommendationsHTML = recommendedGames
        .map(game => `
            <a href="game?id=${game.id}" class="recommendation-card">
                <img src="${game.background_image}" alt="${game.name}">
                <div class="recommendation-card-content">
                    <h3>${game.name}</h3>
                    <div class="rating">
                        <span>⭐</span>
                        <span>${game.rating?.toFixed(1) || 'N/A'}</span>
                    </div>
                </div>
            </a>
        `)
        .join('');

    recommendations.innerHTML = recommendationsHTML;
}

// Open Screenshot in Full Size
function openImage(url) {
    window.open(url, '_blank');
}

// Handle Review Submission
reviewForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const rating = document.querySelector('.star-rating span.active')?.dataset.rating;
    const reviewText = document.getElementById('reviewText').value;

    if (!rating || !reviewText) {
        alert('Please provide both a rating and review text');
        return;
    }

    // Here you would typically send the review to your backend
    // For now, we'll just add it to the page
    const review = {
        rating,
        text: reviewText,
        date: new Date().toLocaleDateString()
    };

    addReview(review);
    reviewForm.reset();
    document.querySelectorAll('.star-rating span').forEach(star => star.classList.remove('active'));
});

// Add Review to Page
function addReview(review) {
    const reviewHTML = `
        <div class="review-card">
            <div class="review-header">
                <div class="review-rating">
                    ${'⭐'.repeat(review.rating)}
                </div>
                <div class="review-date">${review.date}</div>
            </div>
            <div class="review-text">${review.text}</div>
        </div>
    `;
    reviews.insertAdjacentHTML('afterbegin', reviewHTML);
}

// Star Rating Interaction
document.querySelectorAll('.star-rating span').forEach(star => {
    star.addEventListener('click', () => {
        const rating = star.dataset.rating;
        document.querySelectorAll('.star-rating span').forEach(s => {
            s.classList.toggle('active', s.dataset.rating <= rating);
        });
    });
});

// Loading State
function showLoading() {
    loadingSpinner.classList.remove('hidden');
}

function hideLoading() {
    loadingSpinner.classList.add('hidden');
}

// Initialize
if (gameId) {
    fetchGameDetails();
} else {
    gameContent.innerHTML = '<p class="error">No game ID provided</p>';
} 