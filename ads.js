if (window.location.pathname === "/" || window.location.pathname === "/index.html") {
    let historyItems = [];  // Ensure this is needed, otherwise remove.
    let currentIndex = 0;   // Same as above.
    const MAX_ITEMS = 4;
    let autoSlideInterval;

    // API Key and Container Elements
    const apiKey = '47a1a7df542d3d483227f758a7317dff';
    const moviesContainer = document.getElementById('movies');
    const tvSeriesContainer = document.getElementById('tvSeries');
    const marvelContainer = document.getElementById('marvel');
    const animeContainer = document.getElementById('anime');
    const netflixContainer = document.getElementById('netflix');
    const vivamaxContainer = document.getElementById('vivamax');
    const searchInput = document.getElementById('search');
    const searchResultsContainer = document.getElementById('searchResults');
    const mediaSelect = document.getElementById('mediaSelect');
    const companyId = 0x24696;
    const horrorContainer = document.getElementById("horror");
    const warContainer = document.getElementById('war'); // war
    const koreanContainer = document.getElementById('korean');
    const chineseContainer = document.getElementById('chinese');

    // Fetch and display popular movies
    async function fetchMovies() {
        try {
            const response = await fetch(`https://api.themoviedb.org/3/trending/movie/week?api_key=${apiKey}`);
            const data = await response.json();
            displayMovies(data.results.slice(0, 10)); // Limit to 10 results
        } catch (error) {
            // No console.error, but you can display a message in the UI if needed
            displayError('Error fetching popular movies');
        }
    }

    // Fetch horror movies
    async function fetchHorrorMovies() {
        const trendingUrl = `https://api.themoviedb.org/3/discover/movie?api_key=${apiKey}&with_genres=27`;

        try {
            const response = await fetch(trendingUrl);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            const horrorMovies = data.results.filter(movie =>
                movie.genre_ids && movie.genre_ids.includes(27)
            );
            displayHorrorMovies(horrorMovies.slice(0, 10)); // Limit to 10 results
        } catch (error) {
            // Instead of console.error, you can show a friendly error message
            displayError('Error fetching horror movies');
        }
    }

    // Fetch and display popular TV series
    async function fetchTVSeries() {
        try {
            const response = await fetch(`https://api.themoviedb.org/3/tv/top_rated?api_key=${apiKey}&language=en-US&page=1`);
            const data = await response.json();
            displayTVSeries(data.results.slice(0, 10)); // Limit to 10 results
        } catch (error) {
            // Again, avoid console logs and show a message to users
            displayError('Error fetching popular TV series');
        }
    }



// Fetch anime TV shows
async function fetchAnimeTVShows() {
    const animeGenreId = 16;
    try {
        const response = await fetch(
            `https://api.themoviedb.org/3/keyword/210024/movies?api_key=${apiKey}&language=en-US&page=1`
        );
        const data = await response.json();
        displayAnime(data.results.slice(0, 10)); // Limit to 10 results
    } catch (error) {
        displayError('Error fetching anime TV shows');
    }
}

// Fetch Vivamax movies
async function fetchVivamaxMovies() {
    try {
        const response = await fetch(
            `https://api.themoviedb.org/3/company/${companyId}/movies?api_key=${apiKey}&language=en-US`
        );
        const data = await response.json();
        displayVivamax(data.results.slice(0, 10)); // Limit to 10 results
    } catch (error) {
        displayError('Error fetching Vivamax movies');
    }
}

// Fetch War movies
async function fetchWarMovies() {
    const warGenreId = 10752; // War
    try {
        const response = await fetch(
            `https://api.themoviedb.org/3/discover/movie?api_key=${apiKey}&with_genres=${warGenreId}&sort_by=popularity.desc&language=en-US&page=1`
        );

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        const warMovies = data.results.filter(movie => 
            movie.genre_ids && movie.genre_ids.includes(warGenreId)
        );
        displayWarMovies(warMovies.slice(0, 10)); // Limit to 10 results
    } catch (error) {
        displayError('Error fetching war movies');
    }
}

// Fetch Korean Movies/Shows
async function fetchKoreanContent() {
    try {
        const response = await fetch(
            `https://api.themoviedb.org/3/discover/movie?api_key=${apiKey}&with_original_language=ko&sort_by=popularity.desc&page=1&include_adult=false&vote_count.gte=100&vote_average.gte=6`
        );

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        // Additional filtering
        const filteredContent = data.results.filter(movie => {
            const title = (movie.title || movie.name || '').toLowerCase();
            const overview = (movie.overview || '').toLowerCase();

            const adultKeywords = [
                'adult', 
                'erotic', 
                'sex',
                'porn',
                'xxx',
                '18+',
                'mature'
            ];

            return !adultKeywords.some(keyword => 
                title.includes(keyword) || 
                overview.includes(keyword)
            );
        });
        displayKoreanContent(filteredContent.slice(0, 10)); // Limit to 10 results
    } catch (error) {
        displayError('Error fetching Korean content');
    }
}

// Fetch Chinese Movies/Shows
async function fetchChineseContent() {
    try {
        const response = await fetch(
            `https://api.themoviedb.org/3/discover/movie?api_key=${apiKey}&with_original_language=zh&sort_by=popularity.desc&page=1&include_adult=false&vote_count.gte=100&vote_average.gte=6`
        );

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        // Additional filtering
        const filteredContent = data.results.filter(movie => {
            const title = (movie.title || movie.name || '').toLowerCase();
            const overview = (movie.overview || '').toLowerCase();

            const adultKeywords = [
                'adult', 
                'erotic', 
                'sex',
                'porn',
                'xxx',
                '18+',
                'mature'
            ];

            return !adultKeywords.some(keyword => 
                title.includes(keyword) || 
                overview.includes(keyword)
            );
        });
        displayChineseContent(filteredContent.slice(0, 10)); // Limit to 10 results
    } catch (error) {
        displayError('Error fetching Chinese content');
    }
}


// Initialize Swiper for popular content
function initializeSwiper1() {
    const popularSwiper = new Swiper(".swiper-popular", {
        // Essential settings
        loop: false, // Enables looping
        speed: 1000, // Slide transition speed
        grabCursor: true, // Shows a cursor when dragging
        spaceBetween: 15, // Space between slides

        // Slide settings
        slidesPerView: 'auto', // Auto adjusts the number of visible slides
        centeredSlides: false, // Disables centered slides

        // Group settings
        loopFillGroupWithBlank: true, // Fill the group with blank slides if not enough slides are available

        // Autoplay configuration
        autoplay: {
            delay: 2000, // Time between slides
            disableOnInteraction: false, // Continues autoplay after user interaction
            pauseOnMouseEnter: true, // Pauses autoplay on hover
        },

        // Optional scrollbar
        scrollbar: {
            el: '.swiper-scrollbar', // Enable the scrollbar element
            hide: true, // Hides the scrollbar when not in use
            draggable: true, // Allows dragging the scrollbar
        },

        // Lazy loading settings for images
        lazy: {
            loadOnTransitionStart: true, // Load images when slide is transitioning
            loadPrevNext: true, // Load previous and next slide images
        },

        // Observer for updates in Swiper
        observer: true,
        observeParents: true,
    });

    // Return the instance for external control if needed
    return popularSwiper;
}

// Initialize Swiper for other content
function initializeSwiper2() {
    new Swiper(".swiper-2", {
        loop: false, // Enables looping
        speed: 1000, // Slide transition speed
        grabCursor: true, // Shows a cursor when dragging
        spaceBetween: 15, // Space between slides
        centeredSlides: false, // Disables centered slides
        freeMode: true, // Enables free mode (no snapping to slide edges)
        slidesPerView: "auto", // Auto adjusts the number of visible slides

        // Lazy loading settings for images
        lazy: {
            loadOnTransitionStart: true, // Load images when slide is transitioning
            loadPrevNext: true, // Load previous and next slide images
        },

        // Optional scrollbar
        scrollbar: {
            draggable: true, // Allows dragging the scrollbar
            hide: false, // Keeps scrollbar visible
        },

        // Observer for updates in Swiper
        observer: true,
        observeParents: true,

        // Event handling for initialization
        on: {
            init: function() {
                this.update(); // Ensures Swiper is properly initialized after content load
            },
        },
    });
}

// Initialize progress bars
function initializeProgressBars() {
    document.querySelectorAll(".circular-progress").forEach((progressBar) => {
        const ratingValue = parseFloat(progressBar.getAttribute("data-rating"));
        const progressColor = progressBar.getAttribute("data-progress-color");
        const bgColor = progressBar.getAttribute("data-bg-color");

        // Set the circular progress bar's background with conic gradient
        progressBar.style.background = `conic-gradient(
            ${progressColor} ${ratingValue * 36}deg, 
            ${bgColor} ${ratingValue * 36}deg
        )`;
    });
}


// Fetch movie images
async function fetchMovieImages(movieId) {
    const response = await fetch(
        `https://api.themoviedb.org/3/movie/${movieId}/images?api_key=${apiKey}&language=en`
    );
    const data = await response.json();

    if (data.backdrops.length > 0) {
        return data.backdrops[0].file_path;
    }

    const fallbackResponse = await fetch(
        `https://api.themoviedb.org/3/movie/${movieId}/images?api_key=${apiKey}`
    );
    const fallbackData = await fallbackResponse.json();
    return fallbackData.backdrops.length > 0 ? fallbackData.backdrops[0].file_path : null;
}

// Display movie details
async function displayDetails(card, movie, rating) {
    const backdropPath = await fetchMovieImages(movie.id);
    const imageUrl = backdropPath 
        ? `https://image.tmdb.org/t/p/w500${backdropPath}` // If image exists
        : 'https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEg-VLNDBGMO8xZGWlbLfDKXa2RCqhljShc38FN-h7tFSTRnBAdqvf-5m6GQp3dxhQozWbRAe7d2AHlBae3sII-p0w9tDHVY1_nvg45mAs6K9b-fNnmvGFyhOcTqxzuYxNEW1MoEbHdeNvNoTM4QG3XCe5S_QBhSLfjSXnl9EIL4Kns3t0B175ymTH6d/s1600/QQQ.jpg'; // Fallback image

    card.innerHTML = `
        <a href='/p/watchingonstreamlad.html?movieId=${movie.id}'>
            <div class='poster-wrapper'>
                <div class='play-hover'>
                    <div class='playBut'>
                        <svg enable-background='new 0 0 213.7 213.7' height='100%' version='1.1' viewBox='0 0 213.7 213.7' width='100%' x='0px' xml:space='preserve' xmlns='http://www.w3.org/2000/svg'>
                            <polygon class='triangle' fill='none' points='73.5,62.5 148.5,105.8 73.5,149.1' stroke-linecap='round' stroke-linejoin='round' stroke-miterlimit='10' stroke-width='7'></polygon>
                            <circle class='circle' cx='106.8' cy='106.8' fill='none' r='103.3' stroke-linecap='round' stroke-linejoin='round' stroke-miterlimit='10' stroke-width='7'></circle>
                        </svg>
                    </div>
                </div>
                <img alt='${movie.title}' class='lazy-load' data-src='${imageUrl}' loading='lazy'/>
            </div>
            <div class='circular-progress' data-bg-color='black' data-inner-circle-color='lightgrey' data-progress-color='#005a94' data-rating='${rating}'>
                <div class='inner-circle'></div>
                <p class='rating'>${rating.toFixed(1)}</p>
            </div>
            <div class='title-year-wrapper'>
                <h3>${movie.title}</h3>
                <p class='released-year'>${new Date(movie.release_date).getFullYear()}</p>
            </div>
        </a>`;
    initializeProgressBars();
    // Call lazyLoadImages to trigger image loading when they enter the viewport
    lazyLoadImages();
}

// Fetch TV images
async function fetchTVImages(tvId) {
    const response = await fetch(
        `https://api.themoviedb.org/3/tv/${tvId}/images?api_key=${apiKey}&language=en`
    );
    const data = await response.json();

    if (data.backdrops.length > 0) {
        return data.backdrops[0].file_path;
    }

    const fallbackResponse = await fetch(
        `https://api.themoviedb.org/3/tv/${tvId}/images?api_key=${apiKey}`
    );
    const fallbackData = await fallbackResponse.json();
    return fallbackData.backdrops.length > 0 ? fallbackData.backdrops[0].file_path : null;
}

// Display TV series details
async function displaytvDetails(card, tv, rating) {
    const backdropPath = await fetchTVImages(tv.id);
    const imageUrl = backdropPath 
        ? `https://image.tmdb.org/t/p/w500${backdropPath}` // If image exists
        : 'https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEg-VLNDBGMO8xZGWlbLfDKXa2RCqhljShc38FN-h7tFSTRnBAdqvf-5m6GQp3dxhQozWbRAe7d2AHlBae3sII-p0w9tDHVY1_nvg45mAs6K9b-fNnmvGFyhOcTqxzuYxNEW1MoEbHdeNvNoTM4QG3XCe5S_QBhSLfjSXnl9EIL4Kns3t0B175ymTH6d/s1600/QQQ.jpg'; // Fallback image

    card.innerHTML = `
        <a href='/p/watchingonstreamlad.html?tvId=${tv.id}'>
            <div class='poster-wrapper'>
                <div class='play-hover'>
                    <div class='playBut'>
                        <svg enable-background='new 0 0 213.7 213.7' height='100%' version='1.1' viewBox='0 0 213.7 213.7' width='100%' x='0px' xml:space='preserve' xmlns='http://www.w3.org/2000/svg'>
                            <polygon class='triangle' fill='none' points='73.5,62.5 148.5,105.8 73.5,149.1' stroke-linecap='round' stroke-linejoin='round' stroke-miterlimit='10' stroke-width='7'></polygon>
                            <circle class='circle' cx='106.8' cy='106.8' fill='none' r='103.3' stroke-linecap='round' stroke-linejoin='round' stroke-miterlimit='10' stroke-width='7'></circle>
                        </svg>
                    </div>
                </div>
                <img alt='${tv.name}' class='lazy-load' data-src='${imageUrl}' loading='lazy'/>
            </div>
            <div class='circular-progress' data-bg-color='black' data-inner-circle-color='lightgrey' data-progress-color='#005a94' data-rating='${rating}'>
                <div class='inner-circle'></div>
                <p class='rating'>${rating.toFixed(1)}</p>
            </div>
            <div class='title-year-wrapper'>
                <h3>${tv.name}</h3>
                <p class='released-year'>${new Date(tv.first_air_date).getFullYear()}</p>
            </div>
        </a>`;
    initializeProgressBars();
    // Call lazyLoadImages to trigger image loading when they enter the viewport
    lazyLoadImages();
}

// Lazy load images with IntersectionObserver
function lazyLoadImages() {
    const images = document.querySelectorAll('.lazy-load');
    const options = {
        root: null, // Use the viewport as the root
        rootMargin: '0px', // No margin
        threshold: 0.1 // Trigger when 10% of the image is in view
    };

    // Create a new IntersectionObserver
    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.getAttribute('data-src'); // Set the src to the data-src value
                img.classList.remove('lazy-load'); // Remove lazy-load class after image is loaded
                observer.unobserve(img); // Stop observing this image
            }
        });
    }, options);

    // Observe each lazy-load image
    images.forEach(image => {
        const width = 500;  // Set this dynamically based on your use case
        const height = Math.round(width * 9 / 16); // Assuming 16:9 aspect ratio
        image.setAttribute('width', width);
        image.setAttribute('height', height);
        observer.observe(image);
    });
}

// General function to display any content (Movies, TV Series, etc.)
async function displayContent(container, contentList, isMovie = true) {
    container.innerHTML = ""; // Clear existing content
    const promises = contentList.map(async (content) => {
        const card = document.createElement("div");
        card.className = "swiper-slide";
        const rating = content.vote_average;
        
        // Display either movie or TV details based on the flag `isMovie`
        if (isMovie) {
            await displayDetails(card, content, rating); // For movies
        } else {
            await displaytvDetails(card, content, rating); // For TV series
        }
        container.appendChild(card);
    });
    
    // Wait for all the promises to resolve before initializing swiper
    await Promise.all(promises);

    // Initialize Swiper after all content has been added
    if (isMovie) {
        initializeSwiper1();
    } else {
        initializeSwiper2();
    }
}

// Display Movies
function displayMovies(movies) {
    displayContent(moviesContainer, movies, true); // Pass true for movies
}

// Display TV Series
function displayTVSeries(tvSeries) {
    displayContent(tvSeriesContainer, tvSeries, false); // Pass false for TV Series
}

// Display Horror Movies
function displayHorrorMovies(movies) {
    displayContent(horrorContainer, movies, true); // Pass true for movies
}

// Display Anime
function displayAnime(movies) {
    displayContent(animeContainer, movies, true); // Pass true for movies
}

// Display Vivamax Movies
function displayVivamax(movies) {
    displayContent(vivamaxContainer, movies, true); // Pass true for movies
}

// Display War Movies
function displayWarMovies(movies) {
    displayContent(warContainer, movies, true); // Pass true for movies
}

// Display Korean Content
function displayKoreanContent(movies) {
    displayContent(koreanContainer, movies, true); // Pass true for movies
}

// Display Chinese Content
function displayChineseContent(movies) {
    displayContent(chineseContainer, movies, true); // Pass true for movies
}


// Toggle visibility of media sections based on search query
function toggleSectionsVisibility(isSearchActive) {
    const sections = [
        "PopularMovies", "Horror", "TVSeries", "Anime", "Vivamax", "War", "Korean", "Chinese"
    ];

    const bgWrapper = document.getElementById("backgroundWrapper");
    sections.forEach((sectionId) => {
        const section = document.getElementById(sectionId);
        section.style.display = isSearchActive ? "none" : "block";
    });
    
    bgWrapper.style.display = isSearchActive ? "none" : "block";
}

// Search media based on input and media type
async function searchMedia() {
    const query = searchInput.value.trim();
    const mediaType = mediaSelect.value;

    if (query.length < 1) {
        toggleSectionsVisibility(false);  // Show all sections
        searchResultsContainer.innerHTML = "";  // Clear search results
        return;
    } else {
        toggleSectionsVisibility(true);  // Hide all sections
    }

    try {
        const response = await fetch(
            `https://api.themoviedb.org/3/search/${mediaType}?api_key=${apiKey}&query=${query}&include_adult=false`
        );
        const data = await response.json();

        if (data.results && data.results.length > 0) {
            displaySearchResults(data.results, mediaType);
        } else {
            searchResultsContainer.innerHTML = "<p>No results found.</p>";
        }
    } catch (error) {
        console.error('Error fetching search results:', error);
        searchResultsContainer.innerHTML = "<p>Error fetching results. Please try again later.</p>";
    }
}

// Display search results
function displaySearchResults(results, mediaType) {
    searchResultsContainer.innerHTML = ""; // Clear previous results

    results.forEach((item) => {
        if (item.vote_average > 0 && item.poster_path) {
            const card = document.createElement("div");
            card.className = "search-image";
            const rating = item.vote_average;

            // Create card content dynamically based on media type
            card.innerHTML = `
                <a href='/p/watchingonstreamlad.html?${mediaType}Id=${item.id}'>
                    <div class='search-poster-container'>
                        <div class='play-hover'>
                            <div class='playBut'>
                                <svg enable-background='new 0 0 213.7 213.7' height='100%' version='1.1' viewBox='0 0 213.7 213.7' width='100%' x='0px' xml:space='preserve' xmlns='http://www.w3.org/2000/svg'>
                                    <polygon class='triangle' fill='none' points='73.5,62.5 148.5,105.8 73.5,149.1' stroke-linecap='round' stroke-linejoin='round' stroke-miterlimit='10' stroke-width='7'></polygon>
                                    <circle class='circle' cx='106.8' cy='106.8' fill='none' r='103.3' stroke-linecap='round' stroke-linejoin='round' stroke-miterlimit='10' stroke-width='7'></circle>
                                </svg>
                            </div>
                        </div>
                        <img alt='${item.title || item.name}' src='https://image.tmdb.org/t/p/w500${item.poster_path}'/>
                    </div>
                    <div class='circular-progress' data-bg-color='black' data-inner-circle-color='lightgrey' data-progress-color='#005a94' data-rating='${rating}'>
                        <div class='inner-circle'>
                            <p class='rating'>${rating.toFixed(1)}</p>
                        </div>
                    </div>
                    <div class='search-title-year'>
                        <h3 class='search-title'>${item.title || item.name}</h3>
                        <h3 class='search-year'>${mediaType === "movie" 
                            ? new Date(item.release_date).getFullYear()
                            : new Date(item.first_air_date).getFullYear()}</h3>
                    </div>
                </a>`;
            
            searchResultsContainer.appendChild(card);
            initializeProgressBars();
        }
    });
}

// Event listeners
searchInput.addEventListener("input", searchMedia);
mediaSelect.addEventListener("change", () => {
    searchInput.value = "";
    searchResultsContainer.innerHTML = "";
});

// Security measures
document.addEventListener("contextmenu", event => event.preventDefault());
document.addEventListener("keydown", event => {
    if (event.key === "F12" || (event.ctrlKey && event.shiftKey && event.key === "I")) {
        event.preventDefault();
    }
});


// Initialize content when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
    fetchMovies();
    fetchHorrorMovies();
    fetchTVSeries();
    fetchAnimeTVShows();
    fetchVivamaxMovies();
    fetchWarMovies(); // Add War
    fetchKoreanContent();  // Add this line
    fetchChineseContent(); // Add this line
});


// Fetch random trending media
async function getRandomTrending() {
    const trendingUrl = `https://api.themoviedb.org/3/trending/all/day?api_key=${apiKey}`;
    
    try {
        const response = await fetch(trendingUrl);
        const data = await response.json();
        
        // Get 4 random items from the results
        const randomItems = [];
        const usedIndices = new Set();
        
        while (randomItems.length < MAX_ITEMS && usedIndices.size < data.results.length) {
            const randomIndex = Math.floor(Math.random() * data.results.length);
            if (!usedIndices.has(randomIndex)) {
                usedIndices.add(randomIndex);
                randomItems.push(data.results[randomIndex]);
            }
        }
        
        // Get details for each random item
        const itemsWithDetails = await Promise.all(
            randomItems.map(async (item) => {
                const mediaType = item.media_type;
                const detailsUrl = `https://api.themoviedb.org/3/${mediaType}/${item.id}?api_key=${apiKey}`;
                const detailsResponse = await fetch(detailsUrl);
                const details = await detailsResponse.json();
                return { ...item, ...details };
            })
        );
        
        return itemsWithDetails;
    } catch (error) {
        console.error('Error fetching trending content:', error);
        return null;
    }
}

function updateBackgroundWrapper(item) {
    const backgroundWrapper = document.getElementById('backgroundWrapper');
    
    const runtime = item.runtime || item.episode_run_time?.[0] || 0;
    const hours = Math.floor(runtime / 60);
    const minutes = runtime % 60;
    const durationString = `${hours}h ${minutes}m`;
    
    const genre = item.genres?.[0]?.name || 'N/A';
    const year = new Date(item.release_date || item.first_air_date).getFullYear();
    
    const tagline = item.tagline || '';  // Directly use the tagline, no fallback
    
    const maxOverviewLength = window.innerWidth <= 768 ? 150 : 550; 
    let overviewText = item.overview || 'No overview available.';
    if (overviewText.length > maxOverviewLength) {
        overviewText = overviewText.substring(0, maxOverviewLength) + '...';
    }

    const imageSize = window.innerWidth <= 768 ? 'w500' : 'w780'; 
    const imageUrl = `https://image.tmdb.org/t/p/${imageSize}${item.backdrop_path || '/default-backdrop.jpg'}`;
    
    const html = `
        <div class='background'>
            <button class='nav-btn prev-btn'>‹</button>
            <button class='nav-btn next-btn'>›</button>
            <div class='movie-intro'>
                <h1>${item.title || item.name}</h1>
                ${tagline ? `<div class="tagline">${tagline}</div>` : ''}
                <div class="movie-labels">
                    <span class="label">${year}</span>
                    <div class="vertical-line"></div>
                    <span class="label">${durationString}</span>
                    <div class="vertical-line"></div>
                    <span class="label">${genre}</span>
                </div>
                <p>${overviewText}</p>
            </div>
            <div class='dark'></div>
            <div class='bg-image'>
                <img alt='' class='back' data-src='${imageUrl}' />
                <div class='shade'></div>
            </div>
        </div>
    `;
    
    backgroundWrapper.innerHTML = html;

    // Lazy load the background image when it enters the viewport
    const imgElement = backgroundWrapper.querySelector('.back');
    
    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Set the src attribute to the data-src value to load the image
                entry.target.src = entry.target.dataset.src;
                observer.unobserve(entry.target); // Stop observing once the image is loaded
            }
        });
    }, { threshold: 0.1 }); // Trigger when 10% of the image is in the viewport
    
    observer.observe(imgElement);

    // Add event listeners to navigation buttons
    const prevBtn = backgroundWrapper.querySelector('.prev-btn');
    const nextBtn = backgroundWrapper.querySelector('.next-btn');
    
    prevBtn.addEventListener('click', showPrevious);
    nextBtn.addEventListener('click', showNext);

    // Add transition class after a small delay
    setTimeout(() => {
        const background = backgroundWrapper.querySelector('.background');
        background.classList.add('active');
    }, 50);
}


// Show previous item
function showPrevious() {
    currentIndex = (currentIndex - 1 + MAX_ITEMS) % MAX_ITEMS;
    const background = document.querySelector('.background');
    background.classList.remove('active');
    setTimeout(() => {
        updateBackgroundWrapper(historyItems[currentIndex]);
    }, 300);
    resetAutoSlide(); // Reset the timer when manually navigating
}

// Show next item
function showNext() {
    currentIndex = (currentIndex + 1) % MAX_ITEMS;
    const background = document.querySelector('.background');
    background.classList.remove('active');
    setTimeout(() => {
        updateBackgroundWrapper(historyItems[currentIndex]);
    }, 300);
    resetAutoSlide(); // Reset the timer when manually navigating
}

// Start auto-slide
function startAutoSlide() {
    if (autoSlideInterval) {
        clearInterval(autoSlideInterval);
    }
    
    autoSlideInterval = setInterval(() => {
        showNext();
    }, 8000); // 8 seconds
}

// Reset auto-slide when user navigates manually
function resetAutoSlide() {
    if (autoSlideInterval) {
        clearInterval(autoSlideInterval);
    }
    startAutoSlide();
}

// Initialize random background
async function initializeRandomBackground() {
    const trendingItems = await getRandomTrending();
    if (trendingItems) {
        historyItems = trendingItems;
        currentIndex = 0;
        updateBackgroundWrapper(historyItems[currentIndex]);
        startAutoSlide(); // Start auto-sliding
    }
    
    // Update every 5 minutes (300000 milliseconds)
    setInterval(async () => {
        const newTrendingItems = await getRandomTrending();
        if (newTrendingItems) {
            historyItems = newTrendingItems;
            currentIndex = 0;
            updateBackgroundWrapper(historyItems[currentIndex]);
            resetAutoSlide(); // Reset auto-slide timer when new items are loaded
        }
    }, 300000);
}

// Initialize the background
initializeRandomBackground();

  document.getElementById('brand').addEventListener('click', function() {
    var navLinks = document.getElementById('nav-links');
    var streamText = document.querySelector('.branding-letter .stream');
    
    navLinks.classList.toggle('active');
    
    // Toggle the hidden class on the stream text based on the nav links' active state
    if (navLinks.classList.contains('active')) {
      streamText.classList.add('hidden');
    } else {
      streamText.classList.remove('hidden');
    }
  });
}
