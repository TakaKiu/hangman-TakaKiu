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

// Initialize Hangman game instance
const hangman = new Hangman(canvas);

// Event listeners

// Event listener for difficulty selection form submission
difficultySelectForm.addEventListener('submit', function (event) {
    event.preventDefault();
    const difficulty = difficultySelect.value;
    hangman.start(difficulty, () => {
        startWrapper.classList.add('hidden');
        gameWrapper.classList.remove('hidden');
        wordHolderText.textContent = hangman.getWordHolderText();
        guessesText.textContent = hangman.getGuessesText();
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
}

