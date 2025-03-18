// Variables globales
let players = [];
let totalScores = [];
let eliminationScore = 30; // Puntaje de eliminación (puedes cambiarlo)
let round = 0;
let gameStarted = false;

// Función para inicializar los jugadores
function initializePlayers() {
  const numPlayers = document.getElementById('numPlayers').value;
  players = []; // Re-inicializar jugadores
  totalScores = []; // Reiniciar los totales
  round = 0; // Comenzar desde la ronda 0
  gameStarted = false; // El juego no ha comenzado aún

  // Limpiar los campos de entrada de nombres
  const nameInputs = document.getElementById('nameInputs');
  nameInputs.innerHTML = '';

  // Crear campos de nombre para los jugadores
  for (let i = 0; i < numPlayers; i++) {
    const inputDiv = document.createElement('div');
    inputDiv.innerHTML = `Jugador ${i + 1}: <input type="text" id="player${i + 1}" placeholder="Nombre jugador ${i + 1}" required>`;
    nameInputs.appendChild(inputDiv);

    // Crear un objeto jugador para cada entrada
    players.push({
      name: '', // Nombre aún no definido
      score: 0, // Puntaje inicial
      scores: [] // Historial de puntajes
    });
  }

  // Mostrar los campos de nombres de jugadores
  document.getElementById('playerNames').style.display = 'block';
}

// Función para agregar nombres de jugadores
function addPlayerNames() {
  const numPlayers = document.getElementById('numPlayers').value;

  // Asignar los nombres a los jugadores
  for (let i = 0; i < numPlayers; i++) {
    const playerName = document.getElementById(`player${i + 1}`).value.trim();
    if (playerName) {
      players[i].name = playerName; // Asignar el nombre al jugador correspondiente
    } else {
      alert(`Por favor, ingresa un nombre para el jugador ${i + 1}.`);
      return;
    }
  }

  // Iniciar el juego
  gameStarted = true;
  updateScoreTable();
}





// Iniciar el juego
function startGame() {
  const playerNames = [];
  const numPlayers = document.getElementById('numPlayers').value;
  
  // Obtener los nombres de los jugadores
  for (let i = 0; i < numPlayers; i++) {
    const name = document.getElementById(`player${i + 1}`).value;
    if (name.trim() === '') {
      alert('Por favor, ingresa un nombre para cada jugador.');
      return;
    }
    playerNames.push(name);
  }

  // Crear los jugadores con puntajes iniciales
  players = playerNames.map(name => ({
    name,
    score: 0
  }));

  // Inicializar la tabla de puntajes
  updateScoreTable();

  // Mostrar la sección de puntajes
  document.getElementById('scoreSection').style.display = 'block';
  document.getElementById('playerNames').style.display = 'none';
  gameStarted = true;

  // Preparar el formulario de puntajes
  generateScoreInputFields();
}


// Generar los campos de puntajes para cada jugador
function generateScoreInputFields() {
  const scoreInputsDiv = document.getElementById('scoreInputs');
  scoreInputsDiv.innerHTML = ''; // Limpiar entradas anteriores

  players.forEach((player, index) => {
    const inputDiv = document.createElement('div');
    inputDiv.innerHTML = `${player.name}: <input type="number" id="scorePlayer${index}" min="0" placeholder="Puntaje" required>`;
    scoreInputsDiv.appendChild(inputDiv);
  });
}

// Función para agregar puntajes
function addScore() {
  if (!gameStarted) return; // Asegurarse de que el juego haya comenzado

  // Obtener los puntajes ingresados
  const scores = [];
  const scoreInputs = document.querySelectorAll('[id^="scorePlayer"]');
  for (let i = 0; i < scoreInputs.length; i++) {
    const score = parseInt(scoreInputs[i].value);
    if (isNaN(score) || score < 0) {
      alert('Por favor, ingresa un puntaje válido.');
      return;
    }
    scores.push(score);
  }

  // Validar si solo un jugador tiene cero en esta ronda
  const zeroCount = scores.filter(score => score === 0).length;
  if (zeroCount > 1) {
    document.getElementById('errorMessage').innerText = 'Error: Solo un jugador puede tener cero en una partida.';
    document.getElementById('errorMessage').style.display = 'block';
    return;
  } else {
    document.getElementById('errorMessage').style.display = 'none';
  }

  // Sumar los puntajes a los jugadores
  for (let i = 0; i < scores.length; i++) {
    players[i].scores.push(scores[i]); // Agregar puntaje a la historia del jugador
    players[i].score += scores[i]; // Actualizar puntaje total
  }

  // Avanzar a la siguiente ronda
  round++;
  updateScoreTable();

  // Verificar si alguien ha alcanzado el puntaje de eliminación
  checkElimination();
}

// Función para actualizar la tabla con los puntajes
function updateScoreTable() {
  if (!players || players.length === 0) {
    console.error('Error: No se han inicializado los jugadores.');
    return;
  }

  const tableBody = document.getElementById('scoreTable').getElementsByTagName('tbody')[0];
  
  // Limpiar las filas actuales
  tableBody.innerHTML = '';

  // Agregar una nueva fila para cada ronda con puntajes
  players.forEach((player, index) => {
    let row = tableBody.insertRow();

    // Columna para el nombre del jugador
    row.insertCell(0).innerText = player.name;

    // Agregar una celda por cada puntaje en el historial de ese jugador
    player.scores.forEach(score => {
      let cell = row.insertCell();
      cell.innerText = score;

      // Si el jugador ha alcanzado el puntaje de eliminación, poner la celda en rojo
      if (player.score >= eliminationScore) {
        cell.style.color = 'red';
      }
    });

    // Columna para el total acumulado del jugador
    let totalCell = row.insertCell();
    totalCell.innerText = player.scores.reduce((acc, score) => acc + score, 0); // Total de los puntajes acumulados

    // Si el jugador ha alcanzado el puntaje de eliminación, resaltar toda la fila
    if (player.score >= eliminationScore) {
      row.style.backgroundColor = 'red';
    }
  });
  
  // Agregar fila de totales al final de la tabla
  let totalRow = tableBody.insertRow();
  totalRow.className = 'total';
  totalRow.insertCell(0).innerText = 'Total';
  
  // Agregar el total de cada jugador en la fila de totales
  players.forEach(player => {
    totalRow.insertCell().innerText = player.scores.reduce((acc, score) => acc + score, 0); // Total acumulado
  });
}





// Función para reiniciar el juego
function resetGame() {
  players = [];
  totalScores = [];
  round = 0;
  gameStarted = false;
  document.getElementById('scoreSection').style.display = 'none';
  document.getElementById('resetButton').style.display = 'none';
  initializePlayers();
}

// Función para verificar la eliminación de jugadores
function checkElimination() {
  const eliminatedPlayers = players.filter(player => player.score >= eliminationScore);
  if (eliminatedPlayers.length === players.length - 1) {
    const winner = players.find(player => player.score < eliminationScore);
    if (winner) {
      alert(`¡Felicidades! El ganador es ${winner.name} con ${winner.score} puntos.`);
      document.getElementById('resetButton').style.display = 'block';
    }
  }
}
