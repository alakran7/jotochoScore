let players = [];
let numPlayers = 0;
let eliminationScore = 50; // Definimos un puntaje de eliminación inicial

function setupPlayers() {
  numPlayers = document.getElementById('numPlayers').value;
  if (numPlayers < 2 || numPlayers > 6) {
    alert('Por favor selecciona entre 2 y 6 jugadores.');
    return;
  }
  
  // Ocultamos la sección de número de jugadores
  document.getElementById('playerForm').style.display = 'none';
  // Mostramos los inputs para registrar los nombres
  document.getElementById('playerNames').style.display = 'block';
  
  let nameInputs = '';
  for (let i = 0; i < numPlayers; i++) {
    nameInputs += `
      <input type="text" id="playerName${i}" placeholder="Nombre del jugador ${i + 1}" required>
    `;
  }
  document.getElementById('nameInputs').innerHTML = nameInputs;
}

function startGame() {
  // Registramos los jugadores
  for (let i = 0; i < numPlayers; i++) {
    let playerName = document.getElementById(`playerName${i}`).value;
    if (playerName) {
      players.push({ name: playerName, score: 0, active: true });
    } else {
      alert('Por favor ingresa todos los nombres de los jugadores.');
      return;
    }
  }
  
  // Ocultamos la sección de nombres y mostramos el área del juego
  document.getElementById('playerNames').style.display = 'none';
  document.getElementById('gameArea').style.display = 'block';
  
  displayScores();
}

function displayScores() {
  let scoreDisplay = '';
  players.forEach((player, index) => {
    scoreDisplay += `
      <div id="scorePlayer${index}">
        <p>${player.name}: <span id="score${index}">${player.score}</span> puntos</p>
      </div>
    `;
  });
  document.getElementById('scores').innerHTML = scoreDisplay;
}

// Función para actualizar el puntaje
function updateScore(playerIndex, points) {
  if (!players[playerIndex].active) return;
  
  players[playerIndex].score += points;
  document.getElementById(`score${playerIndex}`).innerText = players[playerIndex].score;

  checkElimination(playerIndex);
}

function checkElimination(playerIndex) {
  if (players[playerIndex].score >= eliminationScore && players[playerIndex].active) {
    players[playerIndex].active = false;
    document.getElementById(`scorePlayer${playerIndex}`).innerHTML += ` (Eliminado)`;
    alert(`${players[playerIndex].name} ha sido eliminado.`);
  }
}


if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/service-worker.js')
    .then(registration => {
      console.log('Service Worker registrado con éxito: ', registration);
    })
    .catch(error => {
      console.log('Error al registrar el Service Worker: ', error);
    });
}
