'use strict';

const canvas = document.getElementById('field');
const ctx = canvas.getContext('2d');
const addPlayerBtn = document.getElementById('addPlayer');
const drawRouteBtn = document.getElementById('drawRoute');
const playerNameInput = document.getElementById('playerName');
const renamePlayerBtn = document.getElementById('renamePlayer');

const players = [];
let playerId = 1;
let selectedPlayer = null;
let draggingPlayer = null;
let offsetX = 0;
let offsetY = 0;
let routeMode = false;

function drawField() {
  ctx.fillStyle = '#0a662e';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.strokeStyle = '#fff';
  ctx.lineWidth = 2;
  ctx.strokeRect(0, 0, canvas.width, canvas.height);

  for (let i = 0; i <= 12; i++) {
    const y = (canvas.height / 12) * i;
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(canvas.width, y);
    ctx.stroke();
  }
}

function drawPlayers() {
  players.forEach((p) => {
    if (p.route.length) {
      ctx.strokeStyle = 'yellow';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(p.x, p.y);
      p.route.forEach((pt) => {
        ctx.lineTo(pt.x, pt.y);
      });
      ctx.stroke();
    }

    ctx.beginPath();
    ctx.fillStyle = p === selectedPlayer ? '#ff9800' : '#fff';
    ctx.arc(p.x, p.y, 12, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#000';
    ctx.stroke();

    ctx.fillStyle = '#000';
    ctx.font = '12px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(p.label, p.x, p.y);
  });
}

function render() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawField();
  drawPlayers();
}

addPlayerBtn.addEventListener('click', () => {
  const label = playerNameInput.value.trim() || `P${playerId}`;
  players.push({ x: canvas.width / 2, y: canvas.height / 2, label, route: [] });
  playerId++;
  playerNameInput.value = '';
  render();
});

canvas.addEventListener('mousedown', (e) => {
  const { offsetX: mx, offsetY: my } = e;
  for (const p of players) {
    const dist = Math.hypot(p.x - mx, p.y - my);
    if (dist < 12) {
      if (!routeMode) {
        selectedPlayer = p;
        drawRouteBtn.disabled = false;
        renamePlayerBtn.disabled = false;
        playerNameInput.value = p.label;
        draggingPlayer = p;
        offsetX = mx - p.x;
        offsetY = my - p.y;
      }
      render();
      return;
    }
  }

  if (routeMode && selectedPlayer) {
    selectedPlayer.route.push({ x: mx, y: my });
    render();
  } else {
    selectedPlayer = null;
    drawRouteBtn.disabled = true;
    renamePlayerBtn.disabled = true;
    playerNameInput.value = '';
    render();
  }
});

canvas.addEventListener('mousemove', (e) => {
  if (draggingPlayer && !routeMode) {
    draggingPlayer.x = e.offsetX - offsetX;
    draggingPlayer.y = e.offsetY - offsetY;
    render();
  }
});

canvas.addEventListener('mouseup', () => {
  draggingPlayer = null;
});

drawRouteBtn.addEventListener('click', () => {
  if (!selectedPlayer) return;
  routeMode = !routeMode;
  drawRouteBtn.textContent = routeMode ? 'Finish Route' : 'Draw Route';
});

renamePlayerBtn.addEventListener('click', () => {
  if (!selectedPlayer) return;
  const newLabel = playerNameInput.value.trim();
  if (newLabel) {
    selectedPlayer.label = newLabel;
    render();
  }
});

render();
