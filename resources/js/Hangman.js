export default class Hangman {
    constructor(canvas) {
        if (!canvas) {
            throw new Error('Invalid canvas provided');
        }

        this.canvas = canvas;
        this.ctx = this.canvas.getContext('2d');
        this.word = '';
        this.guesses = [];
        this.isOver = false;
        this.didWin = false;
    }

    getRandomWord(difficulty) {
        return fetch(`https://it3049c-hangman.fly.dev?difficulty=${difficulty}`)
            .then(response => response.json())
            .then(data => data.word);
    }

    start(difficulty, callback) {
        this.getRandomWord(difficulty)
            .then(word => {
                this.word = word.toLowerCase();
                this.clearCanvas();
                this.drawBase();
                this.guesses = [];
                this.isOver = false;
                this.didWin = false;
                callback();
            })
            .catch(error => console.error('Error starting game:', error));
    }

    guess(letter) {
        if (!letter || !/^[a-zA-Z]$/.test(letter)) {
            throw new Error('Please enter a valid letter.');
        }

        letter = letter.toLowerCase();

        if (this.guesses.includes(letter)) {
            throw new Error('You have already guessed this letter.');
        }

        this.guesses.push(letter);

        if (this.word.includes(letter)) {
            this.checkWin();
        } else {
            this.onWrongGuess();
        }
    }

    checkWin() {
        for (const char of this.word) {
            if (!this.guesses.includes(char)) {
                return;
            }
        }
        this.didWin = true;
        this.isOver = true;
    }

    onWrongGuess() {
        switch (this.guesses.length) {
            case 1:
                this.drawHead();
                break;
            case 2:
                this.drawBody();
                break;
            case 3:
                this.drawLeftArm();
                break;
            case 4:
                this.drawRightArm();
                break;
            case 5:
                this.drawLeftLeg();
                break;
            case 6:
                this.drawRightLeg();
                this.isOver = true;
                break;
            default:
                break;
        }
    }

    getWordHolderText() {
        let displayWord = '';
        for (const char of this.word) {
            if (this.guesses.includes(char)) {
                displayWord += char + ' ';
            } else {
                displayWord += '_ ';
            }
        }
        return displayWord.trim();
    }

    getGuessesText() {
        return `Guesses: ${this.guesses.join(', ')}`;
    }

    clearCanvas() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }

    drawBase() {
        this.ctx.fillRect(95, 10, 150, 10); // Top
        this.ctx.fillRect(245, 10, 10, 50); // Noose
        this.ctx.fillRect(95, 10, 10, 400); // Main beam
        this.ctx.fillRect(10, 410, 175, 10); // Base
    }

    drawHead() {
        this.ctx.beginPath();
        this.ctx.arc(250, 80, 30, 0, Math.PI * 2); // Head
        this.ctx.stroke();
    }

    drawBody() {
        this.ctx.beginPath();
        this.ctx.moveTo(250, 110); // Body
        this.ctx.lineTo(250, 250);
        this.ctx.stroke();
    }

    drawLeftArm() {
        this.ctx.beginPath();
        this.ctx.moveTo(250, 130); // Left Arm
        this.ctx.lineTo(200, 170);
        this.ctx.stroke();
    }

    drawRightArm() {
        this.ctx.beginPath();
        this.ctx.moveTo(250, 130); // Right Arm
        this.ctx.lineTo(300, 170);
        this.ctx.stroke();
    }

    drawLeftLeg() {
        this.ctx.beginPath();
        this.ctx.moveTo(250, 250); // Left Leg
        this.ctx.lineTo(200, 300);
        this.ctx.stroke();
    }

    drawRightLeg() {
        this.ctx.beginPath();
        this.ctx.moveTo(250, 250); // Right Leg
        this.ctx.lineTo(300, 300);
        this.ctx.stroke();
    }
}
