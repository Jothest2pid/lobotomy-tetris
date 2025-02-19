const canvas = document.getElementById('tetris');
const ctx = canvas.getContext('2d');
const nextPieceCanvas = document.getElementById('nextPiece');
const nextPieceCtx = nextPieceCanvas.getContext('2d');
const holdPieceCanvas = document.getElementById('holdPiece');
const holdPieceCtx = holdPieceCanvas.getContext('2d');

const BLOCK_SIZE = 20;
const BOARD_WIDTH = 12;
const BOARD_HEIGHT = 20;
let glitchLevel = 0;
const MAX_GLITCH = 10;
const BASE_COLORS = [
    null,
    '#00f0f0',
    '#0000f0',
    '#f0a000',
    '#f0f000',
    '#00f000',
    '#a000f0',
    '#f00000'
];

let COLORS = [...BASE_COLORS];
let colorCycleIndex = 0;
let pieceQueue = [];

const clearSound = document.getElementById('clearSound');
const tetrisOverlay = document.getElementById('tetrisOverlay');
const gameOverMessage = document.getElementById('gameOverMessage');

const FLASH_DURATION = 100;
const FADE_DURATION = 300;
const OVERLAY_DURATION = 2000;
let animatingLines = new Set();

const PIECES = [
    [
        [0, 0, 0, 0],
        [1, 1, 1, 1],
        [0, 0, 0, 0],
        [0, 0, 0, 0]
    ],
    [
        [2, 0, 0],
        [2, 2, 2],
        [0, 0, 0]
    ],
    [
        [0, 0, 3],
        [3, 3, 3],
        [0, 0, 0]
    ],
    [
        [4, 4],
        [4, 4]
    ],
    [
        [0, 5, 5],
        [5, 5, 0],
        [0, 0, 0]
    ],
    [
        [0, 6, 0],
        [6, 6, 6],
        [0, 0, 0]
    ],
    [
        [7, 7, 0],
        [0, 7, 7],
        [0, 0, 0]
    ]
];

let dropCounter = 0;
let dropInterval = 1000;
let lastTime = 0;
let score = 0;
let level = 1;
let lines = 0;
let isGameOver = false;

let forcedPieceType = null;
let forcedPieceCount = 0;
const FORCED_PIECE_DURATION = 10;

const player = {
    pos: {x: 0, y: 0},
    matrix: null,
    score: 0
};

const nextPiece = {
    matrix: null
};

const holdPiece = {
    matrix: null,
    canSwap: true
};

let board = createBoard(BOARD_WIDTH, BOARD_HEIGHT);

function getRandomColor() {
    const r = Math.floor(Math.random() * 256);
    const g = Math.floor(Math.random() * 256);
    const b = Math.floor(Math.random() * 256);
    return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
}

function mutateMatrix(matrix) {
    if (!matrix) return null;
    
    const newMatrix = matrix.map(row => [...row]);
    const size = newMatrix.length;
    
    const blocks = [];
    matrix.forEach((row, y) => {
        row.forEach((value, x) => {
            if (value !== 0) {
                blocks.push({x, y, value});
            }
        });
    });
    
    blocks.forEach(block => {
        const directions = [
            [-1, 0], [1, 0], [0, -1], [0, 1],
            [-1, -1], [-1, 1], [1, -1], [1, 1]
        ];
        
        const numDirs = Math.floor(Math.random() * 3) + 1;
        for (let i = 0; i < numDirs; i++) {
            const dir = directions[Math.floor(Math.random() * directions.length)];
            const newX = block.x + dir[0];
            const newY = block.y + dir[1];
            
            if (newX >= 0 && newX < size && newY >= 0 && newY < size) {
                if (newMatrix[newY][newX] === 0) {
                    newMatrix[newY][newX] = block.value;
                }
            }
        }
    });
    
    return newMatrix;
}

function generateNewBag() {
    const bag = [0, 1, 2, 3, 4, 5, 6];
    for (let i = bag.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [bag[i], bag[j]] = [bag[j], bag[i]];
    }
    return bag;
}

function getNextPiece() {
    if (forcedPieceType !== null && forcedPieceCount > 0) {
        forcedPieceCount--;
        if (forcedPieceCount === 0) {
            const piece = PIECES[forcedPieceType];
            forcedPieceType = null;
            return piece;
        }
        return PIECES[forcedPieceType];
    }

    if (pieceQueue.length <= 7) {
        pieceQueue.push(...generateNewBag());
    }
    const type = pieceQueue.shift();
    return createPiece(type);
}

function cycleColors() {
    colorCycleIndex = (colorCycleIndex + 1) % 7;
    COLORS = [...BASE_COLORS];
    const nonNullColors = COLORS.slice(1);
    const rotated = [
        ...nonNullColors.slice(colorCycleIndex),
        ...nonNullColors.slice(0, colorCycleIndex)
    ];
    COLORS = [null, ...rotated];
}

function drawCornerLights(context, width, height) {
    if (Math.random() < glitchLevel / MAX_GLITCH * 0.5) {
        const color = Math.random() < 0.5 ? '#ffffff' : '#000000';
        const size = Math.random() * 100 * (glitchLevel / MAX_GLITCH);
        const alpha = Math.random() * 0.5;
        
        context.save();
        context.globalAlpha = alpha;
        context.fillStyle = color;
        
        const corner = Math.floor(Math.random() * 4);
        switch(corner) {
            case 0:
                context.fillRect(0, 0, size, size);
                break;
            case 1:
                context.fillRect(width - size, 0, size, size);
                break;
            case 2:
                context.fillRect(0, height - size, size, size);
                break;
            case 3:
                context.fillRect(width - size, height - size, size, size);
                break;
        }
        context.restore();
    }
}

let appliedEffects = new Set();

const effects = [
    () => {
        const root = document.documentElement;
        const scale = 1 + (Math.random() - 0.5) * 0.2;
        root.style.setProperty('--scale', scale);
    },
    () => {
        const root = document.documentElement;
        const currentRotate = parseFloat(getComputedStyle(root).getPropertyValue('--rotate')) || 0;
        const rotateAdd = (Math.random() - 0.5) * Math.pow(2, glitchLevel);
        root.style.setProperty('--rotate', `${currentRotate + rotateAdd}deg`);
    },
    () => {
        const root = document.documentElement;
        const skew = (Math.random() - 0.5) * 5;
        root.style.setProperty('--skew', `${skew}deg`);
    },
    () => {
        document.querySelectorAll('.info-box, .controls, h3, li').forEach(el => {
            el.classList.add('glitch-text');
        });
    },
    () => {
        document.querySelectorAll('.info-box, .controls, .next-piece, .hold-piece').forEach(el => {
            el.classList.add('glitch-border');
        });
    },
    () => {
        document.querySelectorAll('.next-piece, .hold-piece').forEach(el => {
            el.classList.add('glitch-rotate');
        });
    },
    () => {
        document.querySelectorAll('.info-box, .controls').forEach(el => {
            el.classList.add('zoom-effect');
        });
    },
    () => {
        document.querySelectorAll('h3, li').forEach(el => {
            el.classList.add('wave-effect');
        });
    }
];

function applyVisualEffects() {
    const availableEffects = effects.filter((_, index) => !appliedEffects.has(index));
    if (availableEffects.length > 0) {
        const effectIndex = Math.floor(Math.random() * availableEffects.length);
        const actualIndex = effects.findIndex((effect) => effect === availableEffects[effectIndex]);
        appliedEffects.add(actualIndex);
        availableEffects[effectIndex]();
    }
}

function createBoard(width, height) {
    const board = [];
    while (height--) {
        board.push(new Array(width).fill(0));
    }
    return board;
}

function createPiece(type) {
    if (glitchLevel > 0) {
        if (Math.random() < glitchLevel / MAX_GLITCH * 0.3) {
            return mutateMatrix(PIECES[type]);
        }
        if (Math.random() < glitchLevel / MAX_GLITCH * 0.3) {
            COLORS[type] = getRandomColor();
        }
    }
    return PIECES[type];
}

function drawBlock(x, y, color, context, blockSize = BLOCK_SIZE, alpha = 1) {
    if (!color) color = '#ffffff';

    const gradient = context.createLinearGradient(
        x * blockSize, y * blockSize,
        (x + 1) * blockSize, (y + 1) * blockSize
    );
    
    if (Math.random() < glitchLevel / MAX_GLITCH * 0.5) {
        color = getRandomColor();
    }
    
    let lighterColor = color;
    try {
        if (color.startsWith('#')) {
            const r = parseInt(color.slice(1, 3), 16);
            const g = parseInt(color.slice(3, 5), 16);
            const b = parseInt(color.slice(5, 7), 16);
            if (!isNaN(r) && !isNaN(g) && !isNaN(b)) {
                const lr = Math.min(255, r + 40);
                const lg = Math.min(255, g + 40);
                const lb = Math.min(255, b + 40);
                lighterColor = `#${lr.toString(16).padStart(2, '0')}${lg.toString(16).padStart(2, '0')}${lb.toString(16).padStart(2, '0')}`;
            }
        }
    } catch (e) {
        lighterColor = '#ffffff';
    }
    
    gradient.addColorStop(0, lighterColor);
    gradient.addColorStop(1, color);
    
    context.globalAlpha = alpha;
    context.fillStyle = gradient;
    context.fillRect(x * blockSize, y * blockSize, blockSize, blockSize);
    
    context.globalAlpha = 0.1 * alpha;
    context.fillStyle = '#fff';
    context.fillRect(x * blockSize, y * blockSize, blockSize, blockSize/4);
    context.fillRect(x * blockSize, y * blockSize, blockSize/4, blockSize);
    
    context.globalAlpha = alpha;
    context.strokeStyle = Math.random() < glitchLevel / MAX_GLITCH * 0.5 ? 
        getRandomColor() : '#000';
    context.lineWidth = Math.random() < glitchLevel / MAX_GLITCH * 0.3 ? 
        Math.random() * 5 : 1;
    
    const offset = Math.random() < glitchLevel / MAX_GLITCH * 0.3 ? 
        (Math.random() - 0.5) * 4 : 0;
    context.strokeRect(
        x * blockSize + offset, 
        y * blockSize + offset, 
        blockSize, 
        blockSize
    );
    
    context.globalAlpha = 1;
}

function drawGhost(piece, position) {
    const ghostPos = {...position};
    while (!collide(board, {matrix: piece, pos: ghostPos})) {
        ghostPos.y++;
    }
    ghostPos.y--;
    
    piece.forEach((row, y) => {
        row.forEach((value, x) => {
            if (value !== 0) {
                drawBlock(
                    x + ghostPos.x,
                    y + ghostPos.y,
                    '#fff',
                    ctx,
                    BLOCK_SIZE,
                    0.2
                );
            }
        });
    });
}

function draw() {
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    drawCornerLights(ctx, canvas.width, canvas.height);

    board.forEach((row, y) => {
        row.forEach((value, x) => {
            if (value !== 0) {
                if (animatingLines.has(y)) {
                    drawBlock(x, y, '#fff', ctx);
                } else {
                    drawBlock(x, y, COLORS[value], ctx);
                }
            }
        });
    });
    
    if (player.matrix && !isGameOver) {
        drawGhost(player.matrix, player.pos);
    }
    
    if (player.matrix) {
        drawMatrix(player.matrix, player.pos, ctx);
    }

    drawNextPiece();
    drawHoldPiece();
}

function drawMatrix(matrix, offset, context, blockSize = BLOCK_SIZE) {
    matrix.forEach((row, y) => {
        row.forEach((value, x) => {
            if (value !== 0) {
                drawBlock(
                    x + offset.x,
                    y + offset.y,
                    COLORS[value],
                    context,
                    blockSize
                );
            }
        });
    });
}

function drawNextPiece() {
    nextPieceCtx.fillStyle = '#000';
    nextPieceCtx.fillRect(0, 0, nextPieceCanvas.width, nextPieceCanvas.height);

    if (nextPiece.matrix) {
        const offset = {
            x: (nextPieceCanvas.width / BLOCK_SIZE - nextPiece.matrix.length) / 2,
            y: (nextPieceCanvas.height / BLOCK_SIZE - nextPiece.matrix.length) / 2
        };
        drawMatrix(nextPiece.matrix, offset, nextPieceCtx);
    }
}

function drawHoldPiece() {
    holdPieceCtx.fillStyle = '#000';
    holdPieceCtx.fillRect(0, 0, holdPieceCanvas.width, holdPieceCanvas.height);

    if (holdPiece.matrix) {
        const offset = {
            x: (holdPieceCanvas.width / BLOCK_SIZE - holdPiece.matrix.length) / 2,
            y: (holdPieceCanvas.height / BLOCK_SIZE - holdPiece.matrix.length) / 2
        };
        drawMatrix(holdPiece.matrix, offset, holdPieceCtx);
    }
}

function holdCurrentPiece() {
    if (!holdPiece.canSwap) return;

    const currentPiece = player.matrix;
    
    const shouldMutate = glitchLevel > 0 && Math.random() < glitchLevel / MAX_GLITCH * 0.5;
    
    if (holdPiece.matrix === null) {
        holdPiece.matrix = shouldMutate ? mutateMatrix(currentPiece) : currentPiece;
        playerReset();
    } else {
        const temp = holdPiece.matrix;
        holdPiece.matrix = shouldMutate ? mutateMatrix(currentPiece) : currentPiece;
        player.matrix = shouldMutate ? mutateMatrix(temp) : temp;
        player.pos.y = 0;
        player.pos.x = Math.floor(board[0].length / 2) - Math.floor(player.matrix[0].length / 2);
    }
    
    holdPiece.canSwap = false;
    drawHoldPiece();
}

function collide(board, player) {
    const [m, o] = [player.matrix, player.pos];
    for (let y = 0; y < m.length; ++y) {
        for (let x = 0; x < m[y].length; ++x) {
            if (m[y][x] !== 0 &&
                (board[y + o.y] &&
                board[y + o.y][x + o.x]) !== 0) {
                return true;
            }
        }
    }
    return false;
}

function playerDrop() {
    if (isGameOver) return;

    player.pos.y++;
    if (collide(board, player)) {
        player.pos.y--;
        merge(board, player);
        arenaSweep();
    }
    dropCounter = 0;
}

function playerMove(dir) {
    if (isGameOver) return;
    
    player.pos.x += dir;
    if (collide(board, player)) {
        player.pos.x -= dir;
    }
}

function playerRotate() {
    if (isGameOver) return;
    
    const originalX = player.pos.x;
    const originalY = player.pos.y;
    
    rotate(player.matrix);
    
    const kicks = [
        {x: 0, y: 0},
        {x: 1, y: 0},
        {x: -1, y: 0},
        {x: 0, y: -1},
        {x: 1, y: -1},
        {x: -1, y: -1},
        {x: 0, y: 1},
        {x: 1, y: 1},
        {x: -1, y: 1}
    ];
    
    let validKickFound = false;
    
    for (const kick of kicks) {
        player.pos.x = originalX + kick.x;
        player.pos.y = originalY + kick.y;
        
        if (!collide(board, player)) {
            validKickFound = true;
            break;
        }
    }
    
    if (!validKickFound) {
        rotate(player.matrix);
        rotate(player.matrix);
        rotate(player.matrix);
        player.pos.x = originalX;
        player.pos.y = originalY;
        return;
    }
}

function rotate(matrix) {
    for (let y = 0; y < matrix.length; ++y) {
        for (let x = 0; x < y; ++x) {
            [
                matrix[x][y],
                matrix[y][x],
            ] = [
                matrix[y][x],
                matrix[x][y],
            ];
        }
    }
    matrix.reverse();
}

function merge(board, player) {
    player.matrix.forEach((row, y) => {
        row.forEach((value, x) => {
            if (value !== 0) {
                board[y + player.pos.y][x + player.pos.x] = value;
            }
        });
    });
}

const turkeySandwich = document.getElementById('turkeySandwich');
turkeySandwich.onended = () => {
    turkeySandwich.style.display = 'none';
    turkeySandwich.style.transform = '';
    turkeySandwich.playbackRate = 1;
};

function playTurkeySandwich() {
    turkeySandwich.currentTime = 0;
    turkeySandwich.style.display = 'block';
    
    const speedMultiplier = Math.pow(1.2, glitchLevel);
    turkeySandwich.playbackRate = speedMultiplier;
    
    const rotationAmount = Math.random() * 360 * (glitchLevel / MAX_GLITCH);
    const scaleAmount = 1 + (Math.random() * glitchLevel / 2);
    turkeySandwich.style.transform = `rotate(${rotationAmount}deg) scale(${scaleAmount})`;
    
    turkeySandwich.play();
}

function forceLobotomy() {
    clearSound.currentTime = 0;
    clearSound.play();
    cycleColors();
    glitchLevel = Math.min(glitchLevel + 1, MAX_GLITCH);
    
    playTurkeySandwich();
    
    const subwayChance = Math.pow(glitchLevel / MAX_GLITCH, 2);
    if (Math.random() < subwayChance) {
        const subwaySurfers = document.getElementById('subwaySurfers');
        document.body.classList.add('subway-active');
        subwaySurfers.currentTime = 0;
        subwaySurfers.style.display = 'block';
        
        const speedMultiplier = Math.pow(1.2, glitchLevel);
        subwaySurfers.style.transform = 'scale(0.5)';
        subwaySurfers.style.right = '0';
        subwaySurfers.style.position = 'fixed';
        subwaySurfers.playbackRate = speedMultiplier;
        
        subwaySurfers.play();
        
        const duration = 600000 / speedMultiplier;
        setTimeout(() => {
            subwaySurfers.style.display = 'none';
            subwaySurfers.pause();
            subwaySurfers.style.transform = '';
            document.body.classList.remove('subway-active');
        }, duration);
    }
    
    if (forcedPieceType === null && Math.random() < 0.1) {
        forcedPieceType = Math.floor(Math.random() * 7);
        forcedPieceCount = FORCED_PIECE_DURATION;
        pieceQueue = [];
        const message = document.createElement('div');
        message.textContent = 'PIECE LOCK ACTIVATED';
        message.style.position = 'absolute';
        message.style.top = '50%';
        message.style.left = '50%';
        message.style.transform = 'translate(-50%, -50%)';
        message.style.color = '#ff0000';
        message.style.fontSize = '36px';
        message.style.fontFamily = 'Press Start 2P';
        message.style.textShadow = '2px 2px #000';
        message.style.zIndex = '1000';
        message.style.animation = 'flash 0.5s infinite';
        
        const style = document.createElement('style');
        style.textContent = `
            @keyframes flash {
                0% { opacity: 1; }
                50% { opacity: 0; }
                100% { opacity: 1; }
            }
        `;
        document.head.appendChild(style);
        document.body.appendChild(message);
        
        setTimeout(() => {
            message.remove();
            style.remove();
        }, 2000);
        return;
    }
    
    if (forcedPieceType === null) {
        const mutated = mutateMatrix(player.matrix);
        if (mutated) {
            player.matrix = mutated;
        }
        
        if (holdPiece.matrix && Math.random() < 0.5) {
            const mutatedHold = mutateMatrix(holdPiece.matrix);
            if (mutatedHold) {
                holdPiece.matrix = mutatedHold;
            }
        }
    }
    
    applyVisualEffects();
    
    tetrisOverlay.classList.add('show');
    setTimeout(() => {
        tetrisOverlay.classList.remove('show');
    }, OVERLAY_DURATION);
}

function playerReset() {
    if (!nextPiece.matrix) {
        nextPiece.matrix = getNextPiece();
    }
    
    player.matrix = nextPiece.matrix;
    nextPiece.matrix = getNextPiece();
    
    player.pos.y = 0;
    player.pos.x = Math.floor(board[0].length / 2) - Math.floor(player.matrix[0].length / 2);

    if (collide(board, player)) {
        if (!isGameOver) {
            isGameOver = true;
            gameOverMessage.classList.add('show');
        }
        return;
    }

    holdPiece.canSwap = true;
}

function resetGame() {
    isGameOver = false;
    glitchLevel = 0;
    gameOverMessage.classList.remove('show');
    board.forEach(row => row.fill(0));
    score = 0;
    level = 1;
    lines = 0;
    pieceQueue = [];
    forcedPieceType = null;
    forcedPieceCount = 0;
    updateScore();
    holdPiece.matrix = null;
    holdPiece.canSwap = true;
    playerReset();
    
    turkeySandwich.pause();
    turkeySandwich.style.display = 'none';
    turkeySandwich.style.transform = '';
    turkeySandwich.playbackRate = 1;
    const subwaySurfers = document.getElementById('subwaySurfers');
    subwaySurfers.pause();
    subwaySurfers.style.display = 'none';
    subwaySurfers.style.transform = '';
    document.body.classList.remove('subway-active');
}

function arenaSweep() {
    let rowCount = 1;
    let clearedLines = [];
    let newBoard = [];
    
    for (let y = board.length - 1; y >= 0; y--) {
        let rowFull = true;
        for (let x = 0; x < board[y].length; x++) {
            if (board[y][x] === 0) {
                rowFull = false;
                break;
            }
        }
        
        if (rowFull) {
            clearedLines.push(y);
        } else {
            newBoard.unshift([...board[y]]);
        }
    }
    
    if (clearedLines.length > 0) {
        while (newBoard.length < BOARD_HEIGHT) {
            newBoard.unshift(new Array(BOARD_WIDTH).fill(0));
        }
        
        clearedLines.forEach(y => {
            animatingLines.add(y);
        });
        
        setTimeout(() => {
            board = newBoard;
            
            animatingLines.clear();
            
            lines += clearedLines.length;
            score += rowCount * 100 * level * clearedLines.length;
            
            if (lines % 10 === 0) {
                level++;
                dropInterval = Math.max(100, 1000 - (level - 1) * 100);
            }
            
            updateScore();
            
            if (clearedLines.length === 4) {
                clearSound.currentTime = 0;
                clearSound.play();
                cycleColors();
                glitchLevel = Math.min(glitchLevel + 1, MAX_GLITCH);
                
                playTurkeySandwich();
                
                tetrisOverlay.classList.add('show');
                setTimeout(() => {
                    tetrisOverlay.classList.remove('show');
                }, OVERLAY_DURATION);
            }
            
            playerReset();
        }, FLASH_DURATION);
    } else {
        playerReset();
    }
}

function updateScore() {
    document.getElementById('score').textContent = score;
    document.getElementById('level').textContent = level;
    document.getElementById('lines').textContent = lines;
}

function update(time = 0) {
    const deltaTime = time - lastTime;
    lastTime = time;

    dropCounter += deltaTime;
    if (dropCounter > dropInterval) {
        playerDrop();
    }

    if (glitchLevel >= 10) {
        if (Math.random() < 0.1) {
            const y = Math.floor(Math.random() * BOARD_HEIGHT);
            const x = Math.floor(Math.random() * BOARD_WIDTH);
            if (board[y][x] === 0) {
                board[y][x] = Math.floor(Math.random() * 7) + 1;
            } else {
                board[y][x] = 0;
            }
        }

        if (Math.random() < 0.05) {
            if (holdPiece.matrix && player.matrix) {
                const temp = holdPiece.matrix;
                holdPiece.matrix = player.matrix;
                player.matrix = temp;
                player.pos.y = 0;
                player.pos.x = Math.floor(board[0].length / 2) - Math.floor(player.matrix[0].length / 2);
            }
        }

        if (Math.random() < 0.03) {
            const y = Math.floor(Math.random() * BOARD_HEIGHT);
            const row = board[y];
            if (row.some(cell => cell !== 0)) {
                board.splice(y, 1);
                board.unshift(new Array(BOARD_WIDTH).fill(0));
                score += 100 * level;
                updateScore();
            }
        }
    }

    draw();
    requestAnimationFrame(update);
}

document.addEventListener('keydown', event => {
    if (isGameOver && event.keyCode === 32) {
        resetGame();
        return;
    }
    
    if (isGameOver) return;

    switch (event.keyCode) {
        case 37:
            playerMove(-1);
            break;
        case 39:
            playerMove(1);
            break;
        case 40:
            player.pos.y++;
            if (collide(board, player)) {
                player.pos.y--;
            }
            dropCounter = 0;
            break;
        case 38:
            playerRotate();
            break;
        case 32:
            while (!collide(board, player)) {
                player.pos.y++;
            }
            player.pos.y--;
            merge(board, player);
            arenaSweep();
            break;
        case 67:
            holdCurrentPiece();
            break;
    }
});

playerReset();
update();
