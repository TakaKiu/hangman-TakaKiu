import Hangman from './Hangman.js';

// DOM Elements
const startWrapper = document.getElementById('startWrapper');
const difficultySelectForm = document.getElementById('difficultySelect');
const difficultySelect = document.getElementById('difficulty');

const gameWrapper = document.getElementById('gameWrapper');
const guessesText = document.getElementById('guesses');
const wordHolderText = document.getElementById('wordHolder');

const guessForm = document.getElementById('guessForm');
const guessInput = document.getElementById('guessInput');

const resetGameButton = document.getElementById('resetGame');
const canvas = document.getElementById('hangmanCanvas');

const geoWeatherWrapper = document.getElementById('geo-weather');
const locationInfo = document.getElementById('location-info');
const weatherInfo = document.getElementById('weather-info');

// Initialize Hangman game instance
const hangman = new Hangman(canvas);

// Function to get GeoLocation and display city name and weather
function displayGeoLocationAndWeather() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(position => {
            const { latitude, longitude } = position.coords;
            const geoApiUrl = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=YOUR_GOOGLE_API_KEY`;

            fetch(geoApiUrl)
                .then(response => response.json())
                .then(data => {
                    const city = data.results[0].address_components.find(component => component.types.includes('locality')).long_name;
                    locationInfo.textContent = `Your city: ${city}`;

                    const weatherApiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=YOUR_OPENWEATHERMAP_API_KEY&units=metric`;

                    fetch(weatherApiUrl)
                        .then(response => response.json())
                        .then(weatherData => {
                            const temperature = weatherData.main.temp;
                            const description = weatherData.weather[0].description;
                            weatherInfo.textContent = `Current Temperature: ${temperature}°C, Weather: ${description}`;
                        })
                        .catch(error => {
                            console.error('Error fetching weather data:', error);
                        });
                })
                .catch(error => {
                    console.error('Error fetching GeoLocation data:', error);
                });
        }, error => {
            console.error('Error getting GeoLocation:', error);
        });
    } else {
        console.error('GeoLocation is not supported by this browser.');
    }
}

// Event listener for difficulty selection form submission
difficultySelectForm.addEventListener('submit', function (event) {
    event.preventDefault();
    const difficulty = difficultySelect.value;
    hangman.start(difficulty, () => {
        startWrapper.classList.add('hidden');
        gameWrapper.classList.remove('hidden');
        wordHolderText.textContent = hangman.getWordHolderText();
        guessesText.textContent = hangman.getGuessesText();
        displayGeoLocationAndWeather(); // Call function to display GeoLocation and weather
    });
});

// Event listener for guess form submission
guessForm.addEventListener('submit', function (event) {
    event.preventDefault();
    const letter = guessInput.value.trim();
    try {
        hangman.guess(letter);
        wordHolderText.textContent = hangman.getWordHolderText();
        guessesText.textContent = hangman.getGuessesText();
        if (hangman.isOver) {
            endGame();
        }
    } catch (error) {
        alert(error.message);
    }
    guessInput.value = '';
});

// Event listener for reset game button click
resetGameButton.addEventListener('click', function () {
    resetGame();
});

// Function to handle end of game
function endGame() {
    if (hangman.didWin) {
        alert('Congratulations! You guessed the word.');
    } else {
        alert(`Game Over! The word was "${hangman.word}".`);
    }
    resetGame();
}

// Function to reset the game state
function resetGame() {
    startWrapper.classList.remove('hidden');
    gameWrapper.classList.add('hidden');
    hangman.clearCanvas();
    guessInput.value = '';
    locationInfo.textContent = '';
    weatherInfo.textContent = '';
}

