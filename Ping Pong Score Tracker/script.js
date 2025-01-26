const playerOneScoreElement = document.createElement('p');
const playerTwoScoreElement = document.createElement('p');
const displayCurrentScore = document.createElement('p');
const winnerText = document.createElement('p');

const maxScoreSelection = document.querySelector('select');
const currentScoreSection = document.querySelector('section.currentScore');
const playerOneUpButton = document.querySelector('#playerOneUp');
const playerOneDownButton = document.querySelector('#playerOneDown');
const playerTwoUpButton = document.querySelector('#playerTwoUp');
const playerTwoDownButton = document.querySelector('#playerTwoDown');
const resetButton = document.querySelector('#reset');
const colorChangerButton = document.querySelector('#colorChanger');
const playerOneScoreElementSelect = document.querySelector('section.currentScore p:nth-of-type(1)');
const playerTwoScoreElementSelect = document.querySelector('section.currentScore p:nth-of-type(2)');

let maxScore = 5;

const disabled = document.createAttribute('disabled');

playerOneScoreElement.style.display = 'inline';
playerTwoScoreElement.style.display = 'inline';
playerOneScoreElement.textContent = 0;
playerTwoScoreElement.textContent = 0;  

currentScoreSection.append(playerOneScoreElement, ' to ',  playerTwoScoreElement);
currentScoreSection.style.fontSize = '5em';
winnerText.style.fontSize = '10em';

function scoreUp(player) {
    if (player === 'player1') {
        if (parseInt(playerOneScoreElement.textContent) < maxScore - 1) {
            playerOneScoreElement.textContent = parseInt(playerOneScoreElement.textContent) + 1;
        } else {
            winnerText.textContent = 'Player 1 wins! Congratulations!!!';
            playerOneScoreElement.textContent = maxScore;
            playerOneScoreElement.style.color = 'green';
            playerTwoScoreElement.style.color = 'red';
            currentScoreSection.insertAdjacentElement('beforebegin', winnerText);
            disableButtons();
        }
    } else {
        if (parseInt(playerTwoScoreElement.textContent) < maxScore - 1) {
            playerTwoScoreElement.textContent = parseInt(playerTwoScoreElement.textContent) + 1;
        } else {
            winnerText.textContent = 'Player 2 wins! Congratulations!!!';
            playerTwoScoreElement.textContent = maxScore;
            playerOneScoreElement.style.color = 'red';
            playerTwoScoreElement.style.color = 'green';
            currentScoreSection.insertAdjacentElement('beforebegin', winnerText);
            disableButtons();
        }
    }
}

function scoreDown(player) {
    if (player === 'player1') {
        if (parseInt(playerOneScoreElement.textContent) !== 0){
            playerOneScoreElement.textContent = parseInt(playerOneScoreElement.textContent) - 1;
        }
        else{
            alert ('Player 1 already has a score of 0!');
        }
        
    } else {
        if (parseInt(playerTwoScoreElement.textContent) !== 0){
            playerTwoScoreElement.textContent = parseInt(playerTwoScoreElement.textContent) - 1;
        }
        else{
            alert ('Player 2 already has a score of 0!');
        }
    }
}

function disableButtons(){
    playerOneUpButton.setAttribute('disabled', '');
    playerOneDownButton.setAttribute('disabled', '');
    playerTwoUpButton.setAttribute('disabled', '');
    playerTwoDownButton.setAttribute('disabled', '');
} 

function enableButtons(){
    playerOneUpButton.removeAttribute('disabled');
    playerOneDownButton.removeAttribute('disabled');
    playerTwoUpButton.removeAttribute('disabled');
    playerTwoDownButton.removeAttribute('disabled');
}

function reset(){
    playerOneScoreElement.textContent = '0';
    playerTwoScoreElement.textContent = '0';
    playerOneScoreElement.style.color = 'black';
    playerTwoScoreElement.style.color = 'black';
    winnerText.remove();
    enableButtons();
}

function setMaxScore(value) {
    maxScore = value;
}

function updateCurrentScore(){
    displayCurrentScore.textContent = `${playerOneScoreElement.textContent} to ${playerTwoScoreElement.textContent}`;
}

playerOneUpButton.addEventListener('click', function () {
    scoreUp('player1');
    updateCurrentScore();
});

playerOneDownButton.addEventListener('click', function () {
    scoreDown('player1');
    updateCurrentScore();
});

playerTwoUpButton.addEventListener('click', function () {
    scoreUp('player2');
    updateCurrentScore();
});

playerTwoDownButton.addEventListener('click', function () {
    scoreDown('player2');
    updateCurrentScore();
});

resetButton.addEventListener('click', reset);

maxScoreSelection.addEventListener('change', function () {
    setMaxScore(maxScoreSelection.value);
});