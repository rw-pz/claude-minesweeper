// Claude's Minesweeper - Game Logic

class Minesweeper {
    constructor() {
        // Game configuration
        this.difficulties = {
            beginner: { width: 9, height: 9, mines: 10 },
            intermediate: { width: 16, height: 16, mines: 40 },
            expert: { width: 30, height: 16, mines: 99 }
        };
        
        // Game state
        this.currentDifficulty = 'beginner';
        this.board = [];
        this.gameState = 'ready'; // ready, playing, won, lost
        this.startTime = null;
        this.timer = null;
        this.flagCount = 0;
        this.revealedCount = 0;
        this.firstClick = true;
        
        // Current focus for keyboard navigation
        this.focusX = 0;
        this.focusY = 0;
        
        // DOM elements
        this.gameBoard = document.getElementById('game-board');
        this.difficultySelect = document.getElementById('difficulty');
        this.newGameBtn = document.getElementById('new-game-btn');
        this.mineCounter = document.getElementById('mine-counter');
        this.timerDisplay = document.getElementById('timer');
        this.smiley = document.getElementById('smiley');
        this.gameMessage = document.getElementById('game-message');
        this.clickSound = document.getElementById('click-sound');
        this.explosionSound = document.getElementById('explosion-sound');
        
        this.init();
    }
    
    init() {
        // Event listeners
        this.difficultySelect.addEventListener('change', (e) => {
            this.currentDifficulty = e.target.value;
            this.newGame();
        });
        
        this.newGameBtn.addEventListener('click', () => this.newGame());
        this.smiley.addEventListener('click', () => this.newGame());
        
        // Keyboard navigation
        document.addEventListener('keydown', (e) => this.handleKeyboard(e));
        
        // Prevent context menu on game board
        this.gameBoard.addEventListener('contextmenu', (e) => e.preventDefault());
        
        // Start new game
        this.newGame();
    }
    
    newGame() {
        // Reset game state
        this.gameState = 'ready';
        this.startTime = null;
        this.flagCount = 0;
        this.revealedCount = 0;
        this.firstClick = true;
        this.focusX = 0;
        this.focusY = 0;
        
        // Clear timer
        if (this.timer) {
            clearInterval(this.timer);
            this.timer = null;
        }
        
        // Get current difficulty settings
        const config = this.difficulties[this.currentDifficulty];
        
        // Ensure difficulty selector shows correct value
        this.difficultySelect.value = this.currentDifficulty;
        
        // Update UI
        this.mineCounter.textContent = config.mines.toString().padStart(3, '0');
        this.timerDisplay.textContent = '000';
        this.smiley.textContent = '↻';
        this.gameMessage.style.display = 'none';
        this.gameMessage.className = 'game-message';
        
        // Create board
        this.createBoard(config.width, config.height, config.mines);
        this.renderBoard();
    }
    
    createBoard(width, height, mineCount) {
        // Set dimensions first
        this.width = width;
        this.height = height;
        this.mineCount = mineCount;
        
        // Initialize empty board
        this.board = [];
        for (let y = 0; y < height; y++) {
            this.board[y] = [];
            for (let x = 0; x < width; x++) {
                this.board[y][x] = {
                    isMine: false,
                    isRevealed: false,
                    isFlagged: false,
                    neighborCount: 0
                };
            }
        }
        
        // Place mines randomly
        let minesPlaced = 0;
        while (minesPlaced < mineCount) {
            const x = Math.floor(Math.random() * width);
            const y = Math.floor(Math.random() * height);
            
            if (!this.board[y][x].isMine) {
                this.board[y][x].isMine = true;
                minesPlaced++;
                
                // Update neighbor counts
                this.updateNeighborCounts(x, y);
            }
        }
    }
    
    updateNeighborCounts(mineX, mineY) {
        // Check all 8 directions around the mine
        for (let dy = -1; dy <= 1; dy++) {
            for (let dx = -1; dx <= 1; dx++) {
                if (dx === 0 && dy === 0) continue;
                
                const x = mineX + dx;
                const y = mineY + dy;
                
                if (this.isValidCell(x, y) && !this.board[y][x].isMine) {
                    this.board[y][x].neighborCount++;
                }
            }
        }
    }
    
    isValidCell(x, y) {
        return x >= 0 && x < this.width && y >= 0 && y < this.height;
    }
    
    renderBoard() {
        // Clear existing board
        this.gameBoard.innerHTML = '';
        
        // Set CSS class for difficulty
        this.gameBoard.className = `game-board ${this.currentDifficulty}`;
        
        // Create cells
        for (let y = 0; y < this.height; y++) {
            for (let x = 0; x < this.width; x++) {
                const cell = document.createElement('button');
                cell.className = 'cell';
                cell.setAttribute('data-x', x);
                cell.setAttribute('data-y', y);
                cell.setAttribute('role', 'gridcell');
                cell.setAttribute('aria-label', `Cell ${x + 1}, ${y + 1}`);
                
                // Event listeners
                cell.addEventListener('click', (e) => this.handleCellClick(e, x, y));
                cell.addEventListener('contextmenu', (e) => {
                    e.preventDefault();
                    this.handleCellRightClick(x, y);
                });
                
                // Touch events for mobile
                let touchTimer;
                cell.addEventListener('touchstart', (e) => {
                    touchTimer = setTimeout(() => {
                        this.handleCellRightClick(x, y);
                        e.preventDefault();
                    }, 500);
                });
                
                cell.addEventListener('touchend', () => {
                    clearTimeout(touchTimer);
                });
                
                cell.addEventListener('touchmove', () => {
                    clearTimeout(touchTimer);
                });
                
                this.gameBoard.appendChild(cell);
                this.updateCellDisplay(x, y);
            }
        }
        
        // Set initial focus
        this.updateFocus();
    }
    
    updateCellDisplay(x, y) {
        const cell = this.gameBoard.children[y * this.width + x];
        const cellData = this.board[y][x];
        
        // Preserve cascade animation classes
        const cascadeClasses = Array.from(cell.classList).filter(cls => cls.startsWith('cascade-delay-'));
        
        // Reset classes but keep cascade animations
        cell.className = 'cell';
        cascadeClasses.forEach(cls => cell.classList.add(cls));
        cell.textContent = '';
        
        if (cellData.isFlagged) {
            cell.classList.add('flagged');
        } else if (cellData.isRevealed) {
            cell.classList.add('revealed');
            
            if (cellData.isMine) {
                cell.classList.add('mine');
            } else if (cellData.neighborCount > 0) {
                cell.classList.add(`num-${cellData.neighborCount}`);
                // Add number with count-up animation
                this.animateNumber(cell, cellData.neighborCount);
            }
        }
        
        // Add focus class if this is the focused cell
        if (x === this.focusX && y === this.focusY) {
            cell.classList.add('focused');
        }
    }
    
    animateNumber(cell, targetNumber) {
        // Create a span for the number with animation
        const numberSpan = document.createElement('span');
        numberSpan.className = 'number-animate';
        numberSpan.textContent = targetNumber;
        cell.appendChild(numberSpan);
        
        // Remove animation class after animation completes
        setTimeout(() => {
            if (numberSpan.parentNode) {
                numberSpan.className = '';
            }
        }, 400);
    }
    
    handleCellClick(event, x, y) {
        if (this.gameState === 'won' || this.gameState === 'lost') return;
        if (this.board[y][x].isFlagged || this.board[y][x].isRevealed) return;
        
        // Start timer on first click
        if (this.firstClick) {
            this.startTimer();
            this.gameState = 'playing';
            this.firstClick = false;
        }
        
        this.playSound('click');
        this.revealCell(x, y);
    }
    
    handleCellRightClick(x, y) {
        if (this.gameState === 'won' || this.gameState === 'lost') return;
        if (this.board[y][x].isRevealed) return;
        
        this.flagCell(x, y);
    }
    
    revealCell(x, y, cascadeDepth = 0) {
        if (!this.isValidCell(x, y) || this.board[y][x].isRevealed || this.board[y][x].isFlagged) {
            return;
        }
        
        this.board[y][x].isRevealed = true;
        this.revealedCount++;
        
        if (this.board[y][x].isMine) {
            this.gameOver(false);
            return;
        }
        
        // Add cascade animation class based on depth
        const cell = this.gameBoard.children[y * this.width + x];
        if (cascadeDepth > 0 && cascadeDepth <= 5) {
            cell.classList.add(`cascade-delay-${cascadeDepth}`);
        }
        
        this.updateCellDisplay(x, y);
        
        // If cell has no neighboring mines, reveal neighbors recursively with cascade delay
        if (this.board[y][x].neighborCount === 0) {
            setTimeout(() => {
                for (let dy = -1; dy <= 1; dy++) {
                    for (let dx = -1; dx <= 1; dx++) {
                        if (dx === 0 && dy === 0) continue;
                        this.revealCell(x + dx, y + dy, cascadeDepth + 1);
                    }
                }
            }, cascadeDepth * 15); // Small delay for cascade effect
        }
        
        this.checkWinCondition();
    }
    
    flagCell(x, y) {
        const cell = this.board[y][x];
        
        if (cell.isFlagged) {
            cell.isFlagged = false;
            this.flagCount--;
        } else {
            cell.isFlagged = true;
            this.flagCount++;
        }
        
        // Update mine counter
        const remaining = this.mineCount - this.flagCount;
        this.mineCounter.textContent = Math.max(0, remaining).toString().padStart(3, '0');
        
        this.updateCellDisplay(x, y);
    }
    
    checkWinCondition() {
        const totalCells = this.width * this.height;
        const nonMineCells = totalCells - this.mineCount;
        
        if (this.revealedCount === nonMineCells) {
            this.gameOver(true);
        }
    }
    
    gameOver(won) {
        this.gameState = won ? 'won' : 'lost';
        
        // Stop timer
        if (this.timer) {
            clearInterval(this.timer);
            this.timer = null;
        }
        
        if (won) {
            this.smiley.textContent = '✓';
            this.gameMessage.textContent = 'Game completed successfully';
            this.gameMessage.className = 'game-message win';
            this.flagCount = this.mineCount;
            this.mineCounter.textContent = '000';
        } else {
            this.smiley.textContent = '×';
            this.gameMessage.textContent = 'Game over – Click to restart';
            this.gameMessage.className = 'game-message lose';
            this.playSound('explosion');
            
            // Reveal all mines with ripple effect
            this.revealMinesWithRipple();
        }
        
        this.gameMessage.style.display = 'block';
    }
    
    revealMinesWithRipple() {
        // Find all mine positions
        const mines = [];
        for (let y = 0; y < this.height; y++) {
            for (let x = 0; x < this.width; x++) {
                if (this.board[y][x].isMine) {
                    mines.push({ x, y });
                }
            }
        }
        
        // Reveal mines with staggered timing for ripple effect
        mines.forEach((mine, index) => {
            setTimeout(() => {
                this.board[mine.y][mine.x].isRevealed = true;
                this.updateCellDisplay(mine.x, mine.y);
                
                const cell = this.gameBoard.children[mine.y * this.width + mine.x];
                if (!this.board[mine.y][mine.x].isFlagged) {
                    cell.classList.add('exploded');
                }
            }, index * 50); // 50ms delay between each mine reveal
        });
    }
    
    startTimer() {
        this.startTime = Date.now();
        this.timer = setInterval(() => {
            const elapsed = Math.floor((Date.now() - this.startTime) / 1000);
            this.timerDisplay.textContent = Math.min(999, elapsed).toString().padStart(3, '0');
        }, 1000);
    }
    
    playSound(type) {
        try {
            const sound = type === 'explosion' ? this.explosionSound : this.clickSound;
            sound.currentTime = 0;
            sound.play().catch(() => {
                // Sound play failed, ignore
            });
        } catch (e) {
            // Sound not supported, ignore
        }
    }
    
    // Keyboard navigation
    handleKeyboard(event) {
        if (this.gameState === 'won' || this.gameState === 'lost') {
            if (event.key === 'r' || event.key === 'R') {
                this.newGame();
            }
            return;
        }
        
        let moved = false;
        
        switch (event.key.toLowerCase()) {
            case 'arrowup':
            case 'w':
                if (this.focusY > 0) {
                    this.focusY--;
                    moved = true;
                }
                break;
            case 'arrowdown':
            case 's':
                if (this.focusY < this.height - 1) {
                    this.focusY++;
                    moved = true;
                }
                break;
            case 'arrowleft':
            case 'a':
                if (this.focusX > 0) {
                    this.focusX--;
                    moved = true;
                }
                break;
            case 'arrowright':
            case 'd':
                if (this.focusX < this.width - 1) {
                    this.focusX++;
                    moved = true;
                }
                break;
            case ' ':
            case 'enter':
                event.preventDefault();
                this.handleCellClick(event, this.focusX, this.focusY);
                return;
            case 'f':
                event.preventDefault();
                this.handleCellRightClick(this.focusX, this.focusY);
                return;
            case 'r':
                this.newGame();
                return;
        }
        
        if (moved) {
            event.preventDefault();
            this.updateFocus();
        }
    }
    
    updateFocus() {
        // Remove focus from all cells
        const cells = this.gameBoard.querySelectorAll('.cell');
        cells.forEach(cell => cell.classList.remove('focused'));
        
        // Add focus to current cell
        if (this.isValidCell(this.focusX, this.focusY)) {
            const focusedCell = this.gameBoard.children[this.focusY * this.width + this.focusX];
            focusedCell.classList.add('focused');
            focusedCell.focus();
        }
    }
}

// Initialize game when page loads
document.addEventListener('DOMContentLoaded', () => {
    new Minesweeper();
});