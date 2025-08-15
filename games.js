const canvas = document.getElementById('gameBoard');
const ctx = canvas.getContext('2d');

let PLAYERS = [];
const PLAYER_STATS = {};

const AVAILABLE_COLORS = [
    { name: 'Onça', value: '🐆', color: '#A0522D' },    // Marrom mais escuro para onça
    { name: 'Arara Azul', value: '🦜', color: '#0077BE' },  // Azul para arara azul
    { name: 'Tuiuiú', value: '🦢', color: '#FF6B6B' },  // Vermelho claro para tuiuiú
    { name: 'Jacaré', value: '🐊', color: '#2D5A27' },  // Verde escuro para jacaré
    { name: 'Cobra', value: '🐍', color: '#8B4513' },   // Marrom para cobra
    { name: 'Capivara', value: '🦫', color: '#8D6E63' } // Marrom claro para capivara
];

const boardBackground = new Image();
boardBackground.src = 'imagens/tabuleiro.jpeg';

function initSetup() {
    const playerCountButtons = document.querySelectorAll('.player-count-buttons button');
    const playersSetup = document.getElementById('players-setup');
    const startGameButton = document.getElementById('start-game');
    
    // Selecionar 2 jogadores por padrão
    setTimeout(() => {
        const defaultButton = document.querySelector('[data-players="2"]');
        defaultButton.click();
    }, 100);

    function createPlayerSetupFields(count) {
        playersSetup.innerHTML = '';
        const usedColors = new Set();
        
        for (let i = 0; i < count; i++) {
            const playerSetup = document.createElement('div');
            playerSetup.className = 'player-setup-item';
            
            // Criar div para agrupar título e input na mesma linha
            const infoRow = document.createElement('div');
            infoRow.className = 'player-info-row';
            
            const playerTitle = document.createElement('h3');
            playerTitle.textContent = `Jogador ${i + 1}`;
            
            const input = document.createElement('input');
            input.type = 'text';
            input.placeholder = `Nome do Jogador ${i + 1}`;
            input.className = 'player-name';
            input.required = true;
            
            // Adicionar título e input na mesma linha
            infoRow.appendChild(playerTitle);
            infoRow.appendChild(input);
            
            const colorPicker = document.createElement('div');
            colorPicker.className = 'color-picker';
            
            // Criar opções de cores
            AVAILABLE_COLORS.forEach((color, index) => {
                const colorOption = document.createElement('div');
                colorOption.className = 'color-option';
                colorOption.innerHTML = color.value; // Adicionar o emoji
                colorOption.style.backgroundColor = color.color; // Cor de fundo suave
                colorOption.style.fontSize = '20px'; // Tamanho do emoji
                colorOption.style.display = 'flex';
                colorOption.style.alignItems = 'center';
                colorOption.style.justifyContent = 'center';
                colorOption.dataset.color = color.color;
                
                if (index === i && !usedColors.has(color.color)) {
                    colorOption.classList.add('selected');
                    usedColors.add(color.color);
                }
                
                colorOption.addEventListener('click', (e) => {
                    const selectedColor = e.target.dataset.color;
                    const currentSelected = playerSetup.querySelector('.color-option.selected');
                    
                    if (currentSelected) {
                        usedColors.delete(currentSelected.dataset.color);
                        currentSelected.classList.remove('selected');
                    }
                    
                    if (!usedColors.has(selectedColor)) {
                        e.target.classList.add('selected');
                        usedColors.add(selectedColor);
                    }
                    
                    playerSetup.querySelectorAll('.color-option').forEach(opt => {
                        opt.style.opacity = usedColors.has(opt.dataset.color) && 
                                          opt !== e.target ? '0.5' : '1';
                    });
                    
                    validateSetup();
                });
                
                if (usedColors.has(color.color)) {
                    colorOption.style.opacity = '0.5';
                }
                
                colorPicker.appendChild(colorOption);
            });
            
            // Adicionar elementos ao container do jogador
            playerSetup.appendChild(infoRow);
            playerSetup.appendChild(colorPicker);
            playersSetup.appendChild(playerSetup);
            
            input.addEventListener('input', validateSetup);
        }
        
        validateSetup();
    }
    
    function validateSetup() {
        const players = document.querySelectorAll('.player-setup-item');
        let isValid = true;
        
        players.forEach(player => {
            const name = player.querySelector('.player-name').value.trim();
            const color = player.querySelector('.color-option.selected');
            
            if (!name || !color) {
                isValid = false;
            }
        });
        
        startGameButton.disabled = !isValid;
        return isValid;
    }

    // Atualizar manipulador de clique dos botões de número de jogadores
    playerCountButtons.forEach(button => {
        button.addEventListener('click', () => {
            playerCountButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            createPlayerSetupFields(parseInt(button.dataset.players));
        });
    });
    
    startGameButton.addEventListener('click', () => {
        if (!validateSetup()) return;
        
        const players = document.querySelectorAll('.player-setup-item');
        PLAYERS = Array.from(players).map(player => {
            const selectedColor = player.querySelector('.color-option.selected');
            // Encontrar o animal selecionado pelo valor da cor
            const animalData = AVAILABLE_COLORS.find(c => c.color === selectedColor.dataset.color);
            
            return {
                name: player.querySelector('.player-name').value.trim(),
                color: selectedColor.dataset.color,
                value: animalData.value, // Adicionar o emoji do animal
                position: 0
            };
        });
        
        document.getElementById('setup-screen').classList.add('hidden');
        document.getElementById('game-container').classList.remove('hidden');
        initGame();
    });
}

let currentPlayer = 0;

// Configuração do tabuleiro
const BOARD_CONFIG = {
    totalSpaces: 40,
    spacing: 60, // espaço entre as casas
    cellSize: 50, // tamanho de cada casa
    startCell: {
        color: '#4CAF50',
        text: 'INÍCIO',
        gradient: ['#81c784', '#4CAF50']
    },
    endCell: {
        color: '#f44336',
        text: 'FIM',
        gradient: ['#e57373', '#f44336']
    }
};

const BOARD_SECTIONS = [
    { color: '#2196F3', theme: 'pesca', end: 10 },      // Azul royal
    { color: '#e53e3e', theme: 'queimadas', end: 20 },  // Vermelho vibrante
    { color: '#38a169', theme: 'vegetacao', end: 30 },  // Verde esmeralda
    { color: '#ed8936', theme: 'residuos', end: 40 }    // Laranja queimado
];

// Mapa das casas especiais - distribuídas igualmente entre os temas
const SPECIAL_SPACES = {
    // Seção de Pesca (1-10)
    3: 'pesca',
    7: 'pesca',
    10: 'pesca',
    
    // Seção de Queimadas (11-20)
    13: 'queimadas',
    16: 'queimadas',
    19: 'queimadas',
    
    // Seção de Vegetação (21-30)
    23: 'vegetacao',
    26: 'vegetacao',
    29: 'vegetacao',
    
    // Seção de Resíduos (31-40)
    33: 'residuos',
    36: 'residuos',
    39: 'residuos'
};

function initGame() {
    // Ajustar dimensões do canvas mantendo proporção
    const containerWidth = Math.min(window.innerWidth * 0.6, 600);
    const dpr = window.devicePixelRatio || 1;
    
    // Configurar dimensões físicas do canvas
    canvas.width = containerWidth * dpr;
    canvas.height = containerWidth * dpr;
    
    // Configurar dimensões de exibição
    canvas.style.width = `${containerWidth}px`;
    canvas.style.height = `${containerWidth}px`;
    
    // Configurar contexto
    ctx.scale(dpr, dpr);
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';
    
    // Ajustar tamanho das células proporcionalmente
    BOARD_CONFIG.cellSize = (containerWidth / 12);
    BOARD_CONFIG.spacing = BOARD_CONFIG.cellSize * 1.2;
    
    initPlayerStats();
    drawBoard();
    updateCurrentPlayer();
}

function initPlayerStats() {
    PLAYERS.forEach(player => {
        PLAYER_STATS[player.name] = {
            correctAnswers: 0,
            totalAnswers: 0
        };
    });
}

function calculateBoardPositions() {
    const positions = [];
    const effectiveWidth = canvas.width / window.devicePixelRatio;
    const effectiveHeight = canvas.height / window.devicePixelRatio;
    
    // Definir margens proporcionais
    const margin = effectiveWidth * 0.12;
    const usableWidth = effectiveWidth - (margin * 2);
    const usableHeight = effectiveHeight - (margin * 2);
    
    const rows = 5;
    const cols = 8;
    const cellWidth = usableWidth / cols;
    const cellHeight = usableHeight / rows;
    
    // Ajustar posições para centralizar o tabuleiro
    for (let row = 0; row < rows; row++) {
        const isReversed = row % 2 === 1;
        for (let col = 0; col < cols; col++) {
            const actualCol = isReversed ? (cols - 1 - col) : col;
            positions.push({
                x: margin + (actualCol * cellWidth) + (cellWidth / 2),
                y: margin + (row * cellHeight) + (cellHeight / 2)
            });
        }
    }
    
    return positions.slice(0, BOARD_CONFIG.totalSpaces);
}

function drawBoard() {
    const effectiveWidth = canvas.width / window.devicePixelRatio;
    const effectiveHeight = canvas.height / window.devicePixelRatio;
    
    // Limpar o canvas
    ctx.clearRect(0, 0, effectiveWidth, effectiveHeight);
    
    // Desenhar imagem de fundo do tabuleiro
    if (boardBackground.complete) {
        ctx.drawImage(boardBackground, 0, 0, effectiveWidth, effectiveHeight);
    } else {
        // Fallback caso a imagem não esteja carregada
        ctx.fillStyle = '#f8f9fa';
        ctx.fillRect(0, 0, effectiveWidth, effectiveHeight);
        
        // Adicionar listener para quando a imagem carregar
        boardBackground.onload = () => {
            drawBoard();
        };
    }
    
    const positions = calculateBoardPositions();
    
    // Desenhar linhas de conexão entre as casas
    ctx.beginPath();
    ctx.strokeStyle = '#cbd5e0';
    ctx.lineWidth = 15;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    
    positions.forEach((pos, index) => {
        if (index === 0) {
            ctx.moveTo(pos.x, pos.y);
        } else {
            ctx.lineTo(pos.x, pos.y);
        }
    });
    ctx.stroke();
    
    // Desenhar linha de fundo (brilho)
    ctx.beginPath();
    ctx.strokeStyle = '#fff';
    ctx.lineWidth = 8;
    positions.forEach((pos, index) => {
        if (index === 0) {
            ctx.moveTo(pos.x, pos.y);
        } else {
            ctx.lineTo(pos.x, pos.y);
        }
    });
    ctx.stroke();
    
    // Desenhar células do tabuleiro
    positions.forEach((pos, index) => {
        const section = BOARD_SECTIONS.find(s => index < s.end);
        const cellSize = BOARD_CONFIG.cellSize;
        
        // Desenhar sombra da célula
        ctx.beginPath();
        ctx.fillStyle = 'rgba(0,0,0,0.1)';
        ctx.arc(pos.x + 2, pos.y + 4, cellSize/2, 0, Math.PI * 2);
        ctx.fill();
        
        // Configurar gradiente baseado no tipo de célula
        let gradient;
        let isSpecialCell = false;
        
        if (index === 0) { // Casa inicial
            gradient = ctx.createRadialGradient(
                pos.x - cellSize/4, pos.y - cellSize/4, 0,
                pos.x, pos.y, cellSize
            );
            gradient.addColorStop(0, BOARD_CONFIG.startCell.gradient[0]);
            gradient.addColorStop(1, BOARD_CONFIG.startCell.gradient[1]);
            ctx.shadowColor = BOARD_CONFIG.startCell.color;
            ctx.shadowBlur = 15;
            isSpecialCell = true;
        } else if (index === BOARD_CONFIG.totalSpaces - 1) { // Casa final
            gradient = ctx.createRadialGradient(
                pos.x - cellSize/4, pos.y - cellSize/4, 0,
                pos.x, pos.y, cellSize
            );
            gradient.addColorStop(0, BOARD_CONFIG.endCell.gradient[0]);
            gradient.addColorStop(1, BOARD_CONFIG.endCell.gradient[1]);
            ctx.shadowColor = BOARD_CONFIG.endCell.color;
            ctx.shadowBlur = 15;
            isSpecialCell = true;
        } else if (SPECIAL_SPACES[index]) {
            gradient = ctx.createRadialGradient(
                pos.x - cellSize/4, pos.y - cellSize/4, 0,
                pos.x, pos.y, cellSize
            );
            gradient.addColorStop(0, '#ffd700');
            gradient.addColorStop(0.7, '#daa520');
            gradient.addColorStop(1, '#b8860b');
            ctx.shadowColor = '#ffd700';
            ctx.shadowBlur = 15;
        } else {
            const baseColor = section.color;
            gradient = ctx.createRadialGradient(
                pos.x - cellSize/4, pos.y - cellSize/4, 0,
                pos.x, pos.y, cellSize
            );
            const lighterColor = lightenColor(baseColor, 30);
            gradient.addColorStop(0, lighterColor);
            gradient.addColorStop(1, baseColor);
            ctx.shadowBlur = 0;
        }
        
        // Desenhar célula
        ctx.beginPath();
        ctx.fillStyle = gradient;
        ctx.strokeStyle = '#fff';
        ctx.lineWidth = 2;
        ctx.arc(pos.x, pos.y, cellSize/2, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
        
        // Desenhar borda interna com efeito de brilho
        if (isSpecialCell) {
            ctx.beginPath();
            ctx.arc(pos.x, pos.y, cellSize/2 - 2, 0, Math.PI * 2);
            ctx.strokeStyle = 'rgba(255,255,255,0.8)';
            ctx.lineWidth = 3;
            ctx.stroke();
        }
        
        // Resetar sombra
        ctx.shadowBlur = 0;
        
        // Desenhar texto ou número
        ctx.fillStyle = '#fff';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.shadowColor = 'rgba(0,0,0,0.5)';
        ctx.shadowBlur = 4;
        
        if (index === 0) {
            const fontSize = Math.max(12, Math.floor(cellSize/4));
            ctx.font = `bold ${fontSize}px Arial`;
            ctx.fillText(BOARD_CONFIG.startCell.text, pos.x, pos.y);
        } else if (index === BOARD_CONFIG.totalSpaces - 1) {
            const fontSize = Math.max(12, Math.floor(cellSize/4));
            ctx.font = `bold ${fontSize}px Arial`;
            ctx.fillText(BOARD_CONFIG.endCell.text, pos.x, pos.y);
        } else {
            const fontSize = Math.max(12, Math.floor(cellSize/3));
            ctx.font = `bold ${fontSize}px Arial`;
            ctx.fillText(index, pos.x, pos.y); // Removido o +1 aqui para começar do 1
        }
        
        ctx.shadowBlur = 0;
    });
    
    drawPlayers(positions);
}

// Função auxiliar para clarear cores
function lightenColor(color, percent) {
    const num = parseInt(color.replace('#', ''), 16);
    const amt = Math.round(2.55 * percent);
    const R = (num >> 16) + amt;
    const G = (num >> 8 & 0x00FF) + amt;
    const B = (num & 0x0000FF) + amt;
    
    return '#' + (
        0x1000000 +
        (R < 255 ? R < 1 ? 0 : R : 255) * 0x10000 +
        (G < 255 ? G < 1 ? 0 : G : 255) * 0x100 +
        (B < 255 ? B < 1 ? 0 : B : 255)
    ).toString(16).slice(1);
}

function drawPlayers(positions) {
    // Primeiro, vamos agrupar jogadores por posição
    const playersInPosition = {};
    PLAYERS.forEach((player, index) => {
        if (player.position >= BOARD_CONFIG.totalSpaces) return;
        if (!playersInPosition[player.position]) {
            playersInPosition[player.position] = [];
        }
        playersInPosition[player.position].push({ player, index });
    });

    // Agora desenhar os jogadores em cada posição
    Object.entries(playersInPosition).forEach(([position, players]) => {
        const pos = positions[position];
        const totalPlayers = players.length;
        
        players.forEach((playerInfo, i) => {
            // Calcular posição em círculo quando há mais de um jogador
            const angle = (i * (2 * Math.PI) / totalPlayers) - Math.PI/2;
            const radius = totalPlayers > 1 ? BOARD_CONFIG.cellSize/3 : 0;
            const offsetX = Math.cos(angle) * radius;
            const offsetY = Math.sin(angle) * radius;
            
            // Desenhar sombra
            ctx.beginPath();
            ctx.fillStyle = 'rgba(0,0,0,0.2)';
            ctx.arc(
                Math.round(pos.x + offsetX),
                Math.round(pos.y + offsetY - 13),
                8,
                0,
                Math.PI * 2
            );
            ctx.fill();
            
            // Desenhar jogador
            ctx.beginPath();
            ctx.fillStyle = playerInfo.player.color; // Usar a cor de fundo do animal
            const glowSize = playerInfo.index === currentPlayer ? 12 : 8;
            
            if (playerInfo.index === currentPlayer) {
                ctx.shadowColor = playerInfo.player.color;
                ctx.shadowBlur = 10;
                ctx.shadowOffsetX = 0;
                ctx.shadowOffsetY = 0;
            }
            
            ctx.arc(
                Math.round(pos.x + offsetX),
                Math.round(pos.y + offsetY - 15),
                glowSize,
                0,
                Math.PI * 2
            );
            ctx.fill();
            
            // Adicionar texto do emoji
            ctx.font = `${glowSize * 2}px Arial`;
            ctx.fillText(playerInfo.player.value, // Valor do emoji
                Math.round(pos.x + offsetX),
                Math.round(pos.y + offsetY - 15));
            
            ctx.shadowColor = 'transparent';
            ctx.shadowBlur = 0;
        });
    });
}

// Adicionar variável de controle global
let isMoving = false;
let isDiceRolling = false;

function rollDice() {
    if (isDiceRolling || isMoving) return; // Evitar múltiplos cliques
    
    isDiceRolling = true;
    const result = Math.floor(Math.random() * 6) + 1;
    const diceResult = document.getElementById('diceResult');
    
    // Desabilitar botão durante a animação
    const rollButton = document.getElementById('rollDice');
    rollButton.disabled = true;
    
    // Animação simples do dado
    diceResult.style.transform = 'scale(1.2)';
    diceResult.innerHTML = `
        <h3>Dado</h3>
        <div class="number">${result}</div>
    `;
    
    setTimeout(() => {
        diceResult.style.transform = 'scale(1)';
        isDiceRolling = false;
        movePlayer(result);
    }, 200);
    
    return result;
}

function movePlayer(spaces) {
    if (isMoving) return; // Evitar movimento simultâneo
    isMoving = true;
    
    const oldPosition = PLAYERS[currentPlayer].position;
    let newPosition = oldPosition + spaces;
    
    // Verificar se ultrapassa o final do tabuleiro
    if (newPosition >= BOARD_CONFIG.totalSpaces - 1) {
        newPosition = BOARD_CONFIG.totalSpaces - 1;
        spaces = newPosition - oldPosition; // Ajustar número de passos
    }
    
    let currentStep = 0;
    const moveInterval = setInterval(() => {
        if (currentStep < spaces) {
            PLAYERS[currentPlayer].position = oldPosition + currentStep + 1;
            drawBoard();
            currentStep++;
        } else {
            clearInterval(moveInterval);
            
            if (SPECIAL_SPACES[PLAYERS[currentPlayer].position]) {
                highlightSpecialCell(PLAYERS[currentPlayer].position);
                setTimeout(() => {
                    showCard(SPECIAL_SPACES[PLAYERS[currentPlayer].position]);
                    isMoving = false;
                }, 1000);
            } else {
                if (PLAYERS[currentPlayer].position >= BOARD_CONFIG.totalSpaces - 1) {
                    showVictoryScreen(PLAYERS[currentPlayer]);
                } else {
                    currentPlayer = (currentPlayer + 1) % PLAYERS.length;
                    updateCurrentPlayer();
                }
                isMoving = false;
                const rollButton = document.getElementById('rollDice');
                rollButton.disabled = false;
            }
        }
    }, 300);
}

function highlightSpecialCell(position) {
    const positions = calculateBoardPositions();
    const pos = positions[position];
    
    // Parar animação anterior se existir
    if (window.pulseAnimation) {
        cancelAnimationFrame(window.pulseAnimation);
    }
    
    let startTime = null;
    const duration = 1500; // 1.5 segundos
    
    function pulse(timestamp) {
        if (!startTime) startTime = timestamp;
        const progress = timestamp - startTime;
        
        // Redesenhar o tabuleiro para manter a consistência
        drawBoard();
        
        // Calcular a escala baseada no tempo
        const wave = Math.sin(progress * 0.008);
        const scale = 1 + (wave * 0.2);
        const alpha = Math.max(0, 1 - (progress / duration));
        
        // Desenhar o highlight
        ctx.beginPath();
        ctx.fillStyle = `rgba(255, 235, 59, ${alpha * 0.5})`;
        ctx.strokeStyle = `rgba(255, 193, 7, ${alpha})`;
        ctx.lineWidth = 3;
        
        // Desenhar círculo pulsante
        ctx.arc(pos.x, pos.y, BOARD_CONFIG.cellSize * 0.8 * scale, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
        
        // Adicionar brilho
        ctx.shadowColor = '#FFD700';
        ctx.shadowBlur = 15 * scale;
        ctx.strokeStyle = `rgba(255, 215, 0, ${alpha})`;
        ctx.stroke();
        ctx.shadowBlur = 0;
        
        // Continuar animação se ainda estiver no tempo
        if (progress < duration) {
            window.pulseAnimation = requestAnimationFrame(pulse);
        }
    }
    
    // Iniciar animação
    window.pulseAnimation = requestAnimationFrame(pulse);
}

function showCard(type) {
    const modal = document.getElementById('cardModal');
    const title = document.getElementById('cardTitle');
    const question = document.getElementById('cardQuestion');
    const options = document.getElementById('cardOptions');
    
    // Limpar conteúdo anterior
    modal.querySelector('.modal-content').innerHTML = `
        <h2 id="cardTitle"></h2>
        <p id="cardQuestion"></p>
        <div class="consequences-container"></div>
        <div id="cardOptions"></div>
    `;
    
    const cardSet = cards[type];
    const randomCard = cardSet[Math.floor(Math.random() * cardSet.length)];
    
    // Adicionar ícone e título
    const typeIcons = {
        queimadas: '🔥',
        pesca: '🐟',
        vegetacao: '🌳',
        residuos: '♻️'
    };
    
    document.getElementById('cardTitle').innerHTML = `${typeIcons[type]} ${type.toUpperCase()}`;
    document.getElementById('cardQuestion').textContent = randomCard.pergunta;
    
    // Adicionar consequências
    const consequencesContainer = modal.querySelector('.consequences-container');
    consequencesContainer.innerHTML = `
        <div class="consequence-info correct">
            ✅ Acerto: +${randomCard.consequencia.acerto}
        </div>
        <div class="consequence-info incorrect">
            ❌ Erro: ${randomCard.consequencia.erro}
        </div>
    `;
    
    // Adicionar opções
    const optionsContainer = document.getElementById('cardOptions');
    randomCard.opcoes.forEach((opcao, index) => {
        const button = document.createElement('button');
        button.textContent = opcao;
        button.onclick = () => checkAnswer(index === randomCard.resposta, randomCard.consequencia);
        optionsContainer.appendChild(button);
    });
    
    modal.style.display = 'block';
}

function checkAnswer(correct, consequencia) {
    const modal = document.getElementById('cardModal');
    const spaces = correct ? consequencia.acerto : consequencia.erro;
    
    // Atualizar estatísticas
    PLAYER_STATS[PLAYERS[currentPlayer].name].totalAnswers++;
    if (correct) {
        PLAYER_STATS[PLAYERS[currentPlayer].name].correctAnswers++;
    }
    
    // Desabilitar botões
    const buttons = modal.querySelectorAll('button');
    buttons.forEach(button => {
        button.disabled = true;
        button.style.opacity = '0.7';
    });
    
    // Feedback visual
    const feedback = document.createElement('div');
    feedback.className = `consequence-info ${correct ? 'correct' : 'incorrect'}`;
    feedback.innerHTML = correct ? 
        `✨ Correto! (+${spaces})` : 
        `😔 Incorreto! (${spaces})`;
    
    const existingFeedback = modal.querySelector('.feedback');
    if (existingFeedback) {
        existingFeedback.remove();
    }
    
    feedback.classList.add('feedback');
    modal.querySelector('.modal-content').appendChild(feedback);
    
    setTimeout(() => {
        modal.style.display = 'none';
        let newPosition = PLAYERS[currentPlayer].position + spaces;
        
        // Garantir que a posição está dentro dos limites
        if (newPosition < 0) newPosition = 0;
        if (newPosition >= BOARD_CONFIG.totalSpaces - 1) {
            newPosition = BOARD_CONFIG.totalSpaces - 1;
        }
        
        // Animar o movimento do jogador
        animateMove(PLAYERS[currentPlayer].position, newPosition, () => {
            if (newPosition >= BOARD_CONFIG.totalSpaces - 1) {
                showVictoryScreen(PLAYERS[currentPlayer]);
            } else {
                currentPlayer = (currentPlayer + 1) % PLAYERS.length;
                updateCurrentPlayer();
                // Reabilitar botão de dado
                const rollButton = document.getElementById('rollDice');
                rollButton.disabled = false;
            }
        });
        
    }, 1500);
}

function animateMove(fromPos, toPos, callback) {
    isMoving = true;
    const steps = Math.abs(toPos - fromPos);
    const isMovingForward = toPos > fromPos;
    let currentStep = 0;
    
    const moveInterval = setInterval(() => {
        if (currentStep < steps) {
            PLAYERS[currentPlayer].position = fromPos + (isMovingForward ? currentStep + 1 : -(currentStep + 1));
            drawBoard();
            currentStep++;
        } else {
            clearInterval(moveInterval);
            PLAYERS[currentPlayer].position = toPos;
            drawBoard();
            isMoving = false;
            if (callback) callback();
        }
    }, 300);
}

function showVictoryScreen(winner) {
    const stats = PLAYER_STATS[winner.name];
    const victoryScreen = document.getElementById('victory-screen');
    
    // Atualizar informações
    document.getElementById('winner-name').textContent = winner.name;
    document.getElementById('correct-answers').textContent = stats.correctAnswers;
    document.getElementById('questions-answered').textContent = stats.totalAnswers;
    
    // Mostrar tela
    victoryScreen.style.display = 'block';
    
    // Criar efeito de confete
    createConfetti();
    
    // Esconder tabuleiro
    document.getElementById('game-container').classList.add('hidden');
}

function createConfetti() {
    const confettiCount = 150; // Aumentado a quantidade
    const colors = ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff', '#00ffff'];
    
    for (let i = 0; i < confettiCount; i++) {
        const confetti = document.createElement('div');
        confetti.className = 'confetti';
        confetti.style.left = Math.random() * 100 + 'vw';
        confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        confetti.style.top = -20 + 'px';
        confetti.style.width = Math.random() * 10 + 5 + 'px';
        confetti.style.height = Math.random() * 10 + 5 + 'px';
        confetti.style.opacity = Math.random();
        confetti.style.transform = `rotate(${Math.random() * 360}deg)`;
        
        // Adicionar animação
        confetti.animate([
            { transform: 'translateY(-10vh) rotate(0deg)', opacity: 1 },
            { transform: 'translateY(100vh) rotate(960deg)', opacity: 0 }
        ], {
            duration: 2000 + Math.random() * 3000,
            iterations: Infinity
        });
        
        document.getElementById('victory-screen').appendChild(confetti);
    }
}

function restartGame() {
    // Limpar estatísticas
    PLAYERS.forEach(player => {
        player.position = 0;
    });
    
    // Resetar stats
    initPlayerStats();
    
    // Esconder tela de vitória
    document.getElementById('victory-screen').style.display = 'none';
    
    // Mostrar tela do jogo
    document.getElementById('game-container').classList.remove('hidden');
    
    // Limpar confetes
    const confetti = document.querySelectorAll('.confetti');
    confetti.forEach(c => c.remove());
    
    // Reiniciar jogo
    currentPlayer = 0;
    isMoving = false;
    isDiceRolling = false;
    
    // Reativar botão do dado
    const rollButton = document.getElementById('rollDice');
    rollButton.disabled = false;
    
    // Redesenhar tabuleiro e atualizar interface
    drawBoard();
    updateCurrentPlayer();
}

function backToMenu() {
    // Limpar estatísticas
    PLAYERS = [];
    Object.keys(PLAYER_STATS).forEach(key => delete PLAYER_STATS[key]);
    currentPlayer = 0;
    isMoving = false;
    isDiceRolling = false;
    
    // Limpar confetes
    const confetti = document.querySelectorAll('.confetti');
    confetti.forEach(c => c.remove());
    
    // Esconder todas as telas
    document.getElementById('victory-screen').style.display = 'none';
    document.getElementById('game-container').classList.add('hidden');
    
    // Mostrar tela inicial
    const setupScreen = document.getElementById('setup-screen');
    setupScreen.classList.remove('hidden');
    
    // Resetar campos do setup
    document.getElementById('players-setup').innerHTML = '';
    
    // Resetar botões de seleção de jogadores
    const buttons = document.querySelectorAll('.player-count-buttons button');
    buttons.forEach(btn => btn.classList.remove('active'));
    
    // Resetar setup e selecionar 2 jogadores por padrão
    setTimeout(() => {
        const defaultButton = document.querySelector('[data-players="2"]');
        if (defaultButton) {
            defaultButton.click();
        }
    }, 100);
}

document.getElementById('rollDice').addEventListener('click', () => {
    if (!isMoving && !isDiceRolling) {
        rollDice();
    }
});

function updateCurrentPlayer() {
    const playerInfo = document.getElementById('currentPlayer');
    const currentPlayerData = PLAYERS[currentPlayer];
    
    playerInfo.innerHTML = `
        <h3>Jogador Atual</h3>
        <div class="player-info">
            <div class="player-color" style="background-color: ${currentPlayerData.color}"></div>
            <strong>${currentPlayerData.name}</strong>
        </div>
    `;

    // Atualizar lista de jogadores
    const playersList = document.getElementById('players-list');
    playersList.innerHTML = PLAYERS.map((player, index) => `
        <div class="player-info" style="opacity: ${index === currentPlayer ? '1' : '0.5'}">
            <div class="player-color" style="background-color: ${player.color}"></div>
            <span>${player.name} - Casa ${player.position + 1}</span>
        </div>
    `).join('');
}

window.onload = initSetup;
