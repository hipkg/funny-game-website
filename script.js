// App State
const state = {
    currentPage: 'registration',
    user: null,
    gameScore: 0,
    leaderboard: JSON.parse(localStorage.getItem('leaderboard')) || []
};

const avatars = ['😀', '😎', '🤪', '😍', '🥳', '🚀', '🎮', '⚡'];
const celebrationEmojis = ['🎉', '🎊', '✨', '🌟', '💫', '🎈', '🏆', '👏'];

// Initialize App
function init() {
    renderApp();
    setupEventListeners();
}

// Render App
function renderApp() {
    const app = document.getElementById('app');
    
    if (state.currentPage === 'registration') {
        app.innerHTML = renderRegistrationPage();
    } else if (state.currentPage === 'game') {
        app.innerHTML = renderGamePage();
    } else if (state.currentPage === 'leaderboard') {
        app.innerHTML = renderLeaderboardPage();
    }
    
    setupEventListeners();
}

// Celebration Effect
function celebrate() {
    for (let i = 0; i < 20; i++) {
        const emoji = celebrationEmojis[Math.floor(Math.random() * celebrationEmojis.length)];
        const emojiRain = document.createElement('div');
        emojiRain.className = 'emoji-rain';
        emojiRain.textContent = emoji;
        emojiRain.style.left = Math.random() * window.innerWidth + 'px';
        emojiRain.style.animationDuration = (2 + Math.random()) + 's';
        document.body.appendChild(emojiRain);
        
        setTimeout(() => emojiRain.remove(), 3000);
    }
}

// Registration Page
function renderRegistrationPage() {
    let avatarHTML = avatars.map((avatar, index) => 
        `<div class="avatar-option" data-avatar="${index}" title="${avatar}">
            ${avatar}
        </div>`
    ).join('');
    
    return `
        <div class="page active">
            <div class="container floating">
                <h1>🎮 Register to Play</h1>
                <form id="registrationForm">
                    <div class="form-group">
                        <label for="name">👤 Your Name</label>
                        <input type="text" id="name" name="name" required placeholder="Enter your funny name" maxlength="30">
                    </div>
                    
                    <div class="form-group">
                        <label for="email">📧 Your Email</label>
                        <input type="email" id="email" name="email" required placeholder="Enter your email address">
                    </div>
                    
                    <div class="form-group avatar-selection">
                        <label>😄 Select Your Avatar</label>
                        <div class="avatar-options">
                            ${avatarHTML}
                        </div>
                    </div>
                    
                    <div class="form-group checkbox-group">
                        <input type="checkbox" id="tnc" name="tnc" checked required>
                        <label for="tnc">✅ I agree to have a funny time & Terms</label>
                    </div>
                    
                    <button type="submit">🚀 Start Playing Now!</button>
                </form>
            </div>
        </div>
    `;
}

// Game Page
function renderGamePage() {
    return `
        <div class="page active">
            <div class="container">
                <div class="game-container">
                    <h1>🎯 Catch the Numbers!</h1>
                    <div class="game-info">
                        <div>👤<span id="playerName">${state.user.name}</span></div>
                        <div>⭐<span id="score">${state.gameScore}</span></div>
                        <div>⏱️<span id="timer">30</span></div>
                    </div>
                    <div id="gameMessage" class="game-message">🖱️ Click on the correct number!</div>
                    <div class="game-board" id="gameBoard"></div>
                    <button id="submitGame" style="display:none;">📊 View Leaderboard</button>
                </div>
            </div>
        </div>
    `;
}

// Leaderboard Page
function renderLeaderboardPage() {
    const sortedLeaderboard = [...state.leaderboard].sort((a, b) => b.score - a.score).slice(0, 10);
    
    let tableRows = sortedLeaderboard.map((entry, index) => {
        let medal = '';
        if (index === 0) medal = '🥇';
        else if (index === 1) medal = '🥈';
        else if (index === 2) medal = '🥉';
        else medal = '✨';
        
        return `
            <tr>
                <td class="rank">${medal} #${index + 1}</td>
                <td>${entry.avatar} <strong>${entry.name}</strong></td>
                <td><strong style="color: #667eea;">${entry.score}</strong></td>
            </tr>
        `;
    }).join('');
    
    if (sortedLeaderboard.length === 0) {
        tableRows = '<tr><td colspan="3" style="text-align: center;">🎮 No scores yet. Be the first!</td></tr>';
    }
    
    return `
        <div class="page active">
            <div class="container floating">
                <h1>🏆 Leaderboard</h1>
                <table class="leaderboard-table">
                    <thead>
                        <tr>
                            <th>🎖️ Rank</th>
                            <th>👤 Player</th>
                            <th>⭐ Score</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${tableRows}
                    </tbody>
                </table>
                <button class="play-again-btn" id="playAgainBtn">🔄 Play Again</button>
            </div>
        </div>
    `;
}

// Setup Event Listeners
function setupEventListeners() {
    if (state.currentPage === 'registration') {
        setupRegistrationListeners();
    } else if (state.currentPage === 'game') {
        setupGameListeners();
    } else if (state.currentPage === 'leaderboard') {
        setupLeaderboardListeners();
    }
}

// Registration Listeners
function setupRegistrationListeners() {
    const form = document.getElementById('registrationForm');
    let selectedAvatar = 0;
    
    // Set first avatar as selected by default
    setTimeout(() => {
        document.querySelector('.avatar-option').classList.add('selected');
    }, 100);
    
    document.querySelectorAll('.avatar-option').forEach(option => {
        option.addEventListener('click', (e) => {
            document.querySelectorAll('.avatar-option').forEach(o => o.classList.remove('selected'));
            e.currentTarget.classList.add('selected');
            selectedAvatar = parseInt(e.currentTarget.dataset.avatar);
        });
    });
    
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const name = document.getElementById('name').value.trim();
        const email = document.getElementById('email').value.trim();
        const tnc = document.getElementById('tnc').checked;
        
        if (!name) {
            alert('🤔 Please enter your name!');
            return;
        }
        
        if (!tnc) {
            alert('✅ Please agree to have a funny time!');
            return;
        }
        
        state.user = {
            name,
            email,
            avatar: avatars[selectedAvatar]
        };
        
        state.currentPage = 'game';
        state.gameScore = 0;
        renderApp();
    });
}

// Game Listeners
function setupGameListeners() {
    startGame();
}

function startGame() {
    const gameBoard = document.getElementById('gameBoard');
    let gameActive = true;
    let timeLeft = 30;
    let correctNumber = Math.floor(Math.random() * 9) + 1;
    let displayedNumber = correctNumber;
    
    // Draw game board
    function drawBoard() {
        gameBoard.innerHTML = '';
        const numbers = Array.from({length: 9}, (_, i) => i + 1).sort(() => Math.random() - 0.5);
        
        numbers.forEach((num, index) => {
            setTimeout(() => {
                const cell = document.createElement('div');
                cell.className = 'game-cell';
                cell.textContent = num;
                
                cell.addEventListener('click', () => {
                    if (gameActive && num === correctNumber) {
                        state.gameScore++;
                        celebrate();
                        document.getElementById('score').textContent = state.gameScore;
                        cell.classList.add('correct');
                        correctNumber = Math.floor(Math.random() * 9) + 1;
                        displayedNumber = correctNumber;
                        
                        setTimeout(() => {
                            drawBoard();
                        }, 300);
                    }
                });
                gameBoard.appendChild(cell);
            }, index * 50);
        });
    }
    
    drawBoard();
    
    // Timer
    const timerInterval = setInterval(() => {
        timeLeft--;
        document.getElementById('timer').textContent = timeLeft;
        
        if (timeLeft <= 5) {
            document.getElementById('timer').style.color = '#e73c7e';
            document.getElementById('timer').style.animation = 'bounce 0.5s ease infinite';
        }
        
        if (timeLeft <= 0) {
            clearInterval(timerInterval);
            gameActive = false;
            gameBoard.innerHTML = '';
            document.getElementById('gameMessage').textContent = '⏰ Time\'s up! Game Over! 🎬';
            
            // Big celebration
            for (let i = 0; i < 50; i++) {
                celebrate();
            }
            
            // Save score to leaderboard
            const leaderboardEntry = {
                name: state.user.name,
                avatar: state.user.avatar,
                score: state.gameScore,
                timestamp: new Date().toLocaleString()
            };
            
            state.leaderboard.push(leaderboardEntry);
            localStorage.setItem('leaderboard', JSON.stringify(state.leaderboard));
            
            // Show submit button
            setTimeout(() => {
                document.getElementById('submitGame').style.display = 'block';
                document.getElementById('submitGame').addEventListener('click', () => {
                    state.currentPage = 'leaderboard';
                    renderApp();
                });
            }, 1500);
        }
    }, 1000);
}

// Leaderboard Listeners
function setupLeaderboardListeners() {
    celebrate();
    document.getElementById('playAgainBtn').addEventListener('click', () => {
        state.currentPage = 'registration';
        state.user = null;
        state.gameScore = 0;
        renderApp();
    });
}

// Start the app
init();