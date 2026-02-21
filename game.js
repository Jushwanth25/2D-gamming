// ========== GAME CONFIG ==========
const CONFIG = {
    CANVAS_WIDTH: 1000,
    CANVAS_HEIGHT: 600,
    GRAVITY: 0.6,
    FRICTION: 0.85,
    PLAYER_SPEED: 5,
    PLAYER_JUMP_POWER: 12,
    DASH_POWER: 15,
    DASH_COOLDOWN: 30,
};

// ========== DEFAULT KEYS CONFIG ==========
const DEFAULT_KEYS = {
    jump: 'w',
    left: 'a',
    right: 'd',
    dash: ' '
};

// ========== SETTINGS MANAGER ==========
class SettingsManager {
    constructor() {
        this.keys = this.loadKeys();
        this.listeningFor = null;
    }

    loadKeys() {
        const saved = localStorage.getItem('gameKeys');
        if (saved) {
            return JSON.parse(saved);
        }
        return { ...DEFAULT_KEYS };
    }

    saveKeys() {
        localStorage.setItem('gameKeys', JSON.stringify(this.keys));
    }

    resetKeys() {
        this.keys = { ...DEFAULT_KEYS };
        this.saveKeys();
    }

    setKey(action, key) {
        // Don't allow duplicate keys
        for (let action_check in this.keys) {
            if (action_check !== action && this.keys[action_check].toLowerCase() === key.toLowerCase()) {
                return false; // Key already in use
            }
        }
        this.keys[action] = key;
        this.saveKeys();
        return true;
    }

    getKeyDisplay(key) {
        if (key === ' ') return 'SPACE';
        if (key === 'Enter') return 'ENTER';
        if (key === 'ArrowUp') return 'UP';
        if (key === 'ArrowDown') return 'DOWN';
        if (key === 'ArrowLeft') return 'LEFT';
        if (key === 'ArrowRight') return 'RIGHT';
        if (key === 'Shift') return 'SHIFT';
        if (key === 'Control') return 'CTRL';
        if (key === 'Alt') return 'ALT';
        return key.toUpperCase();
    }

    isKeyBindable(key) {
        const bindable = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 
                         'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z',
                         ' ', 'Enter', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight',
                         'Shift', 'Control', 'Alt'];
        return bindable.includes(key);
    }

    updateKeyDisplay() {
        document.getElementById('jumpKeyBtn').textContent = this.getKeyDisplay(this.keys.jump);
        document.getElementById('leftKeyBtn').textContent = this.getKeyDisplay(this.keys.left);
        document.getElementById('rightKeyBtn').textContent = this.getKeyDisplay(this.keys.right);
        document.getElementById('dashKeyBtn').textContent = this.getKeyDisplay(this.keys.dash);
    }
}

// ========== PARTICLE SYSTEM ==========
class Particle {
    constructor(x, y, vx, vy, color, life) {
        this.x = x;
        this.y = y;
        this.vx = vx;
        this.vy = vy;
        this.color = color;
        this.life = life;
        this.maxLife = life;
        this.size = 4;
    }

    update() {
        this.x += this.vx;
        this.y += this.vy;
        this.vy += 0.3; // Gravity
        this.vx *= 0.98; // Air friction
        this.life--;
    }

    draw(ctx) {
        const alpha = this.life / this.maxLife;
        ctx.globalAlpha = alpha;
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size * alpha, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1;
    }

    isAlive() {
        return this.life > 0;
    }
}

class ParticleSystem {
    constructor() {
        this.particles = [];
    }

    emit(x, y, count, color, speedRange = 3) {
        for (let i = 0; i < count; i++) {
            const angle = (Math.random() * Math.PI * 2);
            const speed = Math.random() * speedRange;
            const vx = Math.cos(angle) * speed;
            const vy = Math.sin(angle) * speed - Math.random() * 2;
            this.particles.push(new Particle(x, y, vx, vy, color, 60));
        }
    }

    update() {
        this.particles = this.particles.filter(p => p.isAlive());
        this.particles.forEach(p => p.update());
    }

    draw(ctx) {
        this.particles.forEach(p => p.draw(ctx));
    }
}

// ========== AUDIO SYSTEM ==========
class AudioManager {
    constructor() {
        this.enabled = true;
        this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
    }

    playSound(type, duration = 0.2) {
        if (!this.enabled) return;
        
        try {
            const osc = this.audioContext.createOscillator();
            const gain = this.audioContext.createGain();
            
            osc.connect(gain);
            gain.connect(this.audioContext.destination);
            
            gain.gain.setValueAtTime(0.3, this.audioContext.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + duration);
            
            switch(type) {
                case 'jump':
                    osc.frequency.value = 400;
                    break;
                case 'dash':
                    osc.frequency.value = 600;
                    break;
                case 'collectible':
                    osc.frequency.value = 800;
                    break;
                case 'levelComplete':
                    osc.frequency.value = 1000;
                    break;
                case 'damage':
                    osc.frequency.value = 200;
                    break;
            }
            
            osc.start(this.audioContext.currentTime);
            osc.stop(this.audioContext.currentTime + duration);
        } catch(e) {
            console.log('Audio playback not available');
        }
    }

    toggle() {
        this.enabled = !this.enabled;
    }
}

// ========== PHYSICS ENGINE ==========
class Vector2 {
    constructor(x = 0, y = 0) {
        this.x = x;
        this.y = y;
    }

    add(v) {
        return new Vector2(this.x + v.x, this.y + v.y);
    }

    multiply(scalar) {
        return new Vector2(this.x * scalar, this.y * scalar);
    }

    clone() {
        return new Vector2(this.x, this.y);
    }
}

class GameObject {
    constructor(x, y, width, height) {
        this.position = new Vector2(x, y);
        this.velocity = new Vector2(0, 0);
        this.width = width;
        this.height = height;
        this.onGround = false;
    }

    getRect() {
        return {
            x: this.position.x,
            y: this.position.y,
            width: this.width,
            height: this.height
        };
    }

    getBounds() {
        return {
            left: this.position.x,
            right: this.position.x + this.width,
            top: this.position.y,
            bottom: this.position.y + this.height
        };
    }

    update() {
        this.velocity.y += CONFIG.GRAVITY;
        this.position.x += this.velocity.x;
        this.position.y += this.velocity.y;
    }

    collidingWith(other) {
        const bounds1 = this.getBounds();
        const bounds2 = other.getBounds();
        
        return bounds1.left < bounds2.right &&
               bounds1.right > bounds2.left &&
               bounds1.top < bounds2.bottom &&
               bounds1.bottom > bounds2.top;
    }
}

// ========== PLAYER CLASS WITH ANIMATION ==========
class Player extends GameObject {
    constructor(x, y) {
        super(x, y, 30, 40);
        this.score = 0;
        this.dashCooldown = 0;
        this.color = '#00d4ff';
        this.alive = true;
        this.checkpoints = [];
        
        // Animation states
        this.animationFrame = 0;
        this.isJumping = false;
        this.isDashing = false;
        this.direction = 1; // 1 for right, -1 for left
        this.animationSpeed = 0.1;
        this.spiralRotation = 0;
    }

    jump() {
        if (this.onGround) {
            this.velocity.y = -CONFIG.PLAYER_JUMP_POWER;
            this.onGround = false;
            this.isJumping = true;
        }
    }

    dash(directionX) {
        if (this.dashCooldown <= 0) {
            this.velocity.x = directionX * CONFIG.DASH_POWER;
            this.dashCooldown = CONFIG.DASH_COOLDOWN;
            this.isDashing = true;
        }
    }

    update() {
        super.update();
        this.onGround = false;
        this.dashCooldown--;
        this.velocity.x *= CONFIG.FRICTION;
        
        // Update animation
        this.animationFrame += this.animationSpeed;
        if (this.animationFrame > 2) this.animationFrame = 0;
        
        // Spiral rotation for visual effect
        this.spiralRotation += (this.isDashing ? 6 : 3);
        
        // Reset states
        if (this.onGround) this.isJumping = false;
        if (this.dashCooldown < 0) this.isDashing = false;
    }

    draw(ctx) {
        if (!this.alive) return;
        
        ctx.save();
        ctx.translate(this.position.x + this.width / 2, this.position.y + this.height / 2);
        
        // Draw spiraling effect while dashing
        if (this.isDashing) {
            ctx.globalAlpha = 0.3;
            ctx.strokeStyle = this.color;
            ctx.lineWidth = 2;
            for (let i = 0; i < 3; i++) {
                ctx.beginPath();
                ctx.arc(0, 0, 20 + i * 10, this.spiralRotation + i, this.spiralRotation + i + Math.PI, false);
                ctx.stroke();
            }
            ctx.globalAlpha = 1;
        }
        
        // Draw main body
        ctx.fillStyle = this.color;
        ctx.globalAlpha = 0.9;
        ctx.fillRect(-this.width / 2, -this.height / 2, this.width, this.height);
        
        // Draw bouncing animation
        const bounceOffset = Math.sin(this.animationFrame * Math.PI) * 2;
        
        // Eyes
        ctx.fillStyle = '#fff';
        ctx.beginPath();
        ctx.arc(-8, -10 + bounceOffset, 5, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(8, -10 + bounceOffset, 5, 0, Math.PI * 2);
        ctx.fill();
        
        // Pupils
        ctx.fillStyle = '#000';
        ctx.beginPath();
        ctx.arc(-7, -10 + bounceOffset, 2, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(9, -10 + bounceOffset, 2, 0, Math.PI * 2);
        ctx.fill();
        
        // Mouth
        ctx.strokeStyle = '#fff';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(0, 5 + bounceOffset, 5, 0.2, Math.PI - 0.2);
        ctx.stroke();
        
        ctx.globalAlpha = 1;
        ctx.restore();
        
        // Score display above player
        ctx.fillStyle = this.color;
        ctx.font = 'bold 14px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(`${this.score}`, this.position.x + this.width / 2, this.position.y - 15);
    }
}

// ========== TREASURE/COLLECTIBLE CLASS ==========
class Collectible extends GameObject {
    constructor(x, y) {
        super(x, y, 15, 15);
        this.rotation = Math.random() * Math.PI * 2;
        this.rotationSpeed = 0.08;
        this.bobOffset = Math.random() * Math.PI * 2;
        this.bobSpeed = 0.05;
        this.collected = false;
    }

    update() {
        this.rotation += this.rotationSpeed;
        this.bobOffset += this.bobSpeed;
    }

    draw(ctx) {
        if (this.collected) return;
        
        ctx.save();
        
        // Bob up and down
        const bobY = this.position.y + Math.sin(this.bobOffset) * 3;
        
        ctx.translate(this.position.x + this.width / 2, bobY + this.height / 2);
        ctx.rotate(this.rotation);
        
        // Outer glow
        const glowGrad = ctx.createRadialGradient(0, 0, 0, 0, 0, 12);
        glowGrad.addColorStop(0, 'rgba(255, 255, 0, 0.4)');
        glowGrad.addColorStop(1, 'rgba(255, 255, 0, 0)');
        ctx.fillStyle = glowGrad;
        ctx.beginPath();
        ctx.arc(0, 0, 12, 0, Math.PI * 2);
        ctx.fill();
        
        // Main treasure gem
        ctx.fillStyle = '#ffff00';
        ctx.beginPath();
        ctx.moveTo(8, 0);
        ctx.lineTo(4, 7);
        ctx.lineTo(-4, 7);
        ctx.lineTo(-8, 0);
        ctx.lineTo(-4, -7);
        ctx.lineTo(4, -7);
        ctx.closePath();
        ctx.fill();
        
        // Shine effect
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 1.5;
        ctx.stroke();
        
        // Internal details
        ctx.fillStyle = '#ffff99';
        ctx.beginPath();
        ctx.arc(0, -2, 2, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.restore();
    }
}

class Platform extends GameObject {
    constructor(x, y, width, height, type = 'normal') {
        super(x, y, width, height);
        this.type = type;
        this.originalY = y;
        this.wobbleTime = Math.random() * Math.PI * 2;
    }

    update() {
        // Wobble animation
        this.wobbleTime += 0.02;
        if (this.type === 'spike') {
            this.position.y = this.originalY + Math.sin(this.wobbleTime) * 3;
        }
    }

    draw(ctx) {
        const colors = {
            'normal': '#667eea',
            'moving': '#ffaa00',
            'spike': '#ff0055',
            'goal': '#00ff88',
            'collectible': '#ffff00'
        };
        
        ctx.fillStyle = colors[this.type] || '#667eea';
        ctx.fillRect(this.position.x, this.position.y, this.width, this.height);
        
        // Gradient effect
        const grad = ctx.createLinearGradient(this.position.x, this.position.y, 
                                             this.position.x, this.position.y + this.height);
        grad.addColorStop(0, 'rgba(255, 255, 255, 0.2)');
        grad.addColorStop(1, 'rgba(0, 0, 0, 0.2)');
        ctx.fillStyle = grad;
        ctx.fillRect(this.position.x, this.position.y, this.width, this.height);
        
        // Border
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
        ctx.lineWidth = 2;
        ctx.strokeRect(this.position.x, this.position.y, this.width, this.height);
        
        // Draw small triangles for spikes
        if (this.type === 'spike') {
            ctx.fillStyle = '#ff0055';
            for (let i = 0; i < this.width; i += 15) {
                ctx.beginPath();
                ctx.moveTo(this.position.x + i, this.position.y);
                ctx.lineTo(this.position.x + i + 7, this.position.y - 8);
                ctx.lineTo(this.position.x + i + 14, this.position.y);
                ctx.fill();
            }
        }
    }
}

class Level {
    constructor(levelNumber) {
        this.levelNumber = levelNumber;
        this.platforms = [];
        this.collectibles = [];
        this.spikes = [];
        this.goalPosition = null;
        this.timeLimit = 60 + (levelNumber * 5);
        this.generateLevel();
    }

    generateLevel() {
        const level = this.levelNumber;
        
        // Ground
        this.platforms.push(new Platform(0, CONFIG.CANVAS_HEIGHT - 40, CONFIG.CANVAS_WIDTH, 40, 'normal'));
        
        // Level-specific layouts
        if (level === 1) {
            this.createLevel1();
        } else if (level === 2) {
            this.createLevel2();
        } else if (level === 3) {
            this.createLevel3();
        } else {
            this.createRandomLevel();
        }
        
        // Goal platform
        this.goalPosition = new Vector2(CONFIG.CANVAS_WIDTH - 100, CONFIG.CANVAS_HEIGHT - 120);
        this.platforms.push(new Platform(this.goalPosition.x, this.goalPosition.y, 80, 40, 'goal'));
    }

    createLevel1() {
        // Simple intro level
        this.platforms.push(new Platform(150, 480, 150, 30, 'normal'));
        this.platforms.push(new Platform(350, 420, 150, 30, 'normal'));
        this.platforms.push(new Platform(550, 360, 150, 30, 'normal'));
        this.platforms.push(new Platform(750, 300, 150, 30, 'normal'));
        
        // Add treasure on each platform
        this.collectibles.push(
            new Collectible(150 + 75, 480 - 20),
            new Collectible(350 + 75, 420 - 20),
            new Collectible(550 + 75, 360 - 20),
            new Collectible(750 + 75, 300 - 20)
        );
    }

    createLevel2() {
        // More challenging with moving elements
        this.platforms.push(new Platform(100, 450, 100, 30, 'normal'));
        this.platforms.push(new Platform(300, 380, 100, 30, 'normal'));
        this.platforms.push(new Platform(500, 320, 100, 30, 'normal'));
        this.platforms.push(new Platform(700, 380, 100, 30, 'normal'));
        this.platforms.push(new Platform(300, 200, 400, 30, 'normal'));
        
        // Spikes
        this.platforms.push(new Platform(450, 290, 100, 20, 'spike'));
        
        // Add treasure on platforms
        this.collectibles.push(
            new Collectible(100 + 50, 450 - 20),
            new Collectible(300 + 50, 380 - 20),
            new Collectible(500 + 50, 320 - 20),
            new Collectible(700 + 50, 380 - 20),
            new Collectible(300 + 200, 200 - 20),
            new Collectible(500, 200 - 20)
        );
    }

    createLevel3() {
        // Expert level
        this.platforms.push(new Platform(50, 500, 80, 30, 'normal'));
        this.platforms.push(new Platform(200, 420, 80, 30, 'normal'));
        this.platforms.push(new Platform(350, 340, 80, 30, 'normal'));
        this.platforms.push(new Platform(500, 260, 80, 30, 'normal'));
        this.platforms.push(new Platform(650, 330, 80, 30, 'normal'));
        this.platforms.push(new Platform(800, 240, 80, 30, 'normal'));
        
        // Spike challenge
        this.platforms.push(new Platform(400, 200, 200, 20, 'spike'));
        
        // Add treasure on each platform
        this.collectibles.push(
            new Collectible(50 + 40, 500 - 20),
            new Collectible(200 + 40, 420 - 20),
            new Collectible(350 + 40, 340 - 20),
            new Collectible(500 + 40, 260 - 20),
            new Collectible(650 + 40, 330 - 20),
            new Collectible(800 + 40, 240 - 20),
            new Collectible(450, 180 - 20),
            new Collectible(550, 180 - 20)
        );
    }

    createRandomLevel() {
        for (let i = 0; i < 10; i++) {
            const x = Math.random() * (CONFIG.CANVAS_WIDTH - 150);
            const y = CONFIG.CANVAS_HEIGHT - 150 - i * 80;
            this.platforms.push(new Platform(x, y, 120, 30, 'normal'));
        }
        this.createCollectibles(Array.from({length: 8}, (_, i) => Math.random() * CONFIG.CANVAS_WIDTH));
    }

    createCollectibles(positions) {
        // Legacy method for random levels
        positions.forEach(x => {
            this.collectibles.push(new Collectible(x, CONFIG.CANVAS_HEIGHT - 100));
        });
    }

    update() {
        this.platforms.forEach(p => p.update());
        this.collectibles.forEach(c => c.update());
    }

    draw(ctx) {
        this.platforms.forEach(p => p.draw(ctx));
    }
}

// ========== MAIN GAME CLASS ==========
class Game {
    constructor() {
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.canvas.width = CONFIG.CANVAS_WIDTH;
        this.canvas.height = CONFIG.CANVAS_HEIGHT;
        
        this.audioManager = new AudioManager();
        this.particleSystem = new ParticleSystem();
        this.settings = new SettingsManager();
        this.gameState = 'menu';
        this.currentLevel = 1;
        this.level = null;
        this.player = null;
        this.gameTime = 0;
        this.maxLevels = 3;
        this.backgroundColor = { r: 10, g: 31, b: 46 };
        this.starField = this.generateStarField();
        
        this.setupUI();
        this.setupControls();
        this.setupSettings();
    }

    generateStarField() {
        const stars = [];
        for (let i = 0; i < 50; i++) {
            stars.push({
                x: Math.random() * CONFIG.CANVAS_WIDTH,
                y: Math.random() * CONFIG.CANVAS_HEIGHT,
                size: Math.random() * 1.5,
                opacity: Math.random() * 0.5 + 0.5,
                twinkleSpeed: Math.random() * 0.02 + 0.005
            });
        }
        return stars;
    }

    setupUI() {
        document.getElementById('startBtn').addEventListener('click', () => this.startGame());
        document.getElementById('pauseBtn').addEventListener('click', () => this.togglePause());
        document.getElementById('restartBtn').addEventListener('click', () => this.restartLevel());
        document.getElementById('nextLevelBtn').addEventListener('click', () => this.nextLevel());
        document.getElementById('retryBtn').addEventListener('click', () => this.retryLevel());
        document.getElementById('resumeBtn').addEventListener('click', () => this.togglePause());
        document.getElementById('mainMenuBtn').addEventListener('click', () => this.goToMenu());
        document.getElementById('soundToggle').addEventListener('change', (e) => {
            this.audioManager.enabled = e.target.checked;
        });
        document.getElementById('settingsBtn').addEventListener('click', () => this.openSettings());
    }

    setupSettings() {
        // Initial key display
        this.settings.updateKeyDisplay();
        
        // Settings button listeners
        document.getElementById('closeSettingsBtn').addEventListener('click', () => this.closeSettings());
        document.getElementById('resetKeysBtn').addEventListener('click', () => this.resetKeys());
        
        // Key bind button listeners
        document.getElementById('jumpKeyBtn').addEventListener('click', () => this.startKeyBinding('jump', 'jumpKeyBtn', 'jumpStatus'));
        document.getElementById('leftKeyBtn').addEventListener('click', () => this.startKeyBinding('left', 'leftKeyBtn', 'leftStatus'));
        document.getElementById('rightKeyBtn').addEventListener('click', () => this.startKeyBinding('right', 'rightKeyBtn', 'rightStatus'));
        document.getElementById('dashKeyBtn').addEventListener('click', () => this.startKeyBinding('dash', 'dashKeyBtn', 'dashStatus'));
    }

    startKeyBinding(action, btnId, statusId) {
        const btn = document.getElementById(btnId);
        const status = document.getElementById(statusId);
        
        btn.classList.add('listening');
        status.classList.add('listening');
        status.textContent = 'Press any key...';
        
        this.settings.listeningFor = action;
        
        const listener = (e) => {
            if (!this.settings.isKeyBindable(e.key)) {
                status.textContent = 'Invalid key!';
                setTimeout(() => {
                    status.textContent = '';
                    btn.classList.remove('listening');
                    status.classList.remove('listening');
                    window.removeEventListener('keydown', listener);
                }, 1000);
                return;
            }
            
            if (this.settings.setKey(action, e.key)) {
                status.textContent = 'Key set!';
                btn.classList.remove('listening');
                setTimeout(() => {
                    this.settings.updateKeyDisplay();
                    status.textContent = '';
                    status.classList.remove('listening');
                }, 500);
            } else {
                status.textContent = 'Key in use!';
                setTimeout(() => {
                    status.textContent = '';
                    btn.classList.remove('listening');
                    status.classList.remove('listening');
                }, 1000);
            }
            
            this.settings.listeningFor = null;
            window.removeEventListener('keydown', listener);
        };
        
        window.addEventListener('keydown', listener);
    }

    openSettings() {
        document.getElementById('settingsOverlay').classList.remove('hidden');
        this.settings.updateKeyDisplay();
    }

    closeSettings() {
        document.getElementById('settingsOverlay').classList.add('hidden');
    }

    resetKeys() {
        this.settings.resetKeys();
        this.settings.updateKeyDisplay();
        const status = document.querySelector('.key-status');
        if (status) status.textContent = 'Keys reset!';
        setTimeout(() => {
            document.querySelectorAll('.key-status').forEach(s => s.textContent = '');
        }, 1000);
    }

    setupControls() {
        this.keys = {};
        window.addEventListener('keydown', (e) => {
            const key = e.key.toLowerCase();
            this.keys[key] = true;
            
            // Store original key for comparison
            this.keys['_raw:' + e.key] = true;
            
            // Check if this is the dash key
            const dashKey = this.settings.keys.dash;
            if (e.key === dashKey || key === dashKey.toLowerCase()) {
                this.handleDash();
                e.preventDefault();
            }
        });

        window.addEventListener('keyup', (e) => {
            const key = e.key.toLowerCase();
            this.keys[key] = false;
            this.keys['_raw:' + e.key] = false;
        });
    }

    startGame() {
        this.currentLevel = 1;
        this.createLevel();
        this.gameState = 'playing';
        this.gameTime = 0;
        document.getElementById('gameOverOverlay').classList.add('hidden');
    }

    createLevel() {
        this.level = new Level(this.currentLevel);
        this.player = new Player(50, CONFIG.CANVAS_HEIGHT - 100);
        this.gameTime = 0;
    }

    updateGame() {
        if (this.gameState !== 'playing') return;

        this.gameTime += 1/60;

        // Handle player input
        this.handlePlayerInput();

        // Update entities
        this.player.update();
        this.level.update();
        this.particleSystem.update();
        
        this.handleCollisions(this.player);
        this.checkCollectibles(this.player);

        // Check win condition
        if (this.player.alive && this.checkGoal(this.player)) {
            this.levelComplete(this.player);
        }

        // Check fail condition
        if (this.gameTime > this.level.timeLimit) {
            this.gameLose();
        }

        this.updateUI();
    }

    handlePlayerInput() {
        // Movement - using configurable keys
        const leftKey = this.settings.keys.left.toLowerCase();
        const rightKey = this.settings.keys.right.toLowerCase();
        const jumpKey = this.settings.keys.jump.toLowerCase();
        
        if (this.keys[leftKey]) {
            this.player.velocity.x = -CONFIG.PLAYER_SPEED;
            this.player.direction = -1;
        }
        if (this.keys[rightKey]) {
            this.player.velocity.x = CONFIG.PLAYER_SPEED;
            this.player.direction = 1;
        }

        // Jump
        if (this.keys[jumpKey]) {
            this.player.jump();
            if (this.player.isJumping) {
                this.audioManager.playSound('jump', 0.1);
            }
            this.keys[jumpKey] = false;
        }
    }

    handleDash() {
        const direction = this.player.direction;
        this.player.dash(direction);
        this.audioManager.playSound('dash', 0.1);
        
        // Emit particles on dash
        this.particleSystem.emit(
            this.player.position.x + this.player.width / 2,
            this.player.position.y + this.player.height / 2,
            15,
            this.player.color,
            4
        );
    }

    handleCollisions(player) {
        this.level.platforms.forEach(platform => {
            if (player.collidingWith(platform)) {
                const playerBounds = player.getBounds();
                const platformBounds = platform.getBounds();

                // Check collision type
                if (platform.type === 'spike') {
                    player.alive = false;
                    this.audioManager.playSound('damage', 0.3);
                    
                    // Emit particles on damage
                    this.particleSystem.emit(
                        player.position.x + player.width / 2,
                        player.position.y + player.height / 2,
                        20,
                        '#ff0055',
                        5
                    );
                    return;
                }

                // Top collision
                if (playerBounds.bottom - player.velocity.y <= platformBounds.top && player.velocity.y > 0) {
                    player.position.y = platform.position.y - player.height;
                    player.velocity.y = 0;
                    player.onGround = true;
                    
                    // Emit land particles
                    if (Math.abs(player.velocity.y) > 2) {
                        this.particleSystem.emit(
                            player.position.x + player.width / 2,
                            platform.position.y,
                            8,
                            '#667eea',
                            2
                        );
                    }
                } 
                // Bottom collision
                else if (playerBounds.top - player.velocity.y >= platformBounds.bottom && player.velocity.y < 0) {
                    player.position.y = platform.position.y + platform.height;
                    player.velocity.y = 0;
                }
                // Side collisions
                else if (playerBounds.right - player.velocity.x <= platformBounds.left) {
                    player.position.x = platform.position.x - player.width;
                } else if (playerBounds.left - player.velocity.x >= platformBounds.right) {
                    player.position.x = platform.position.x + platform.width;
                }
            }
        });

        // Boundary checks
        if (player.position.x < 0) player.position.x = 0;
        if (player.position.x + player.width > CONFIG.CANVAS_WIDTH) {
            player.position.x = CONFIG.CANVAS_WIDTH - player.width;
        }

        // Fall off level
        if (player.position.y > CONFIG.CANVAS_HEIGHT) {
            player.alive = false;
            this.particleSystem.emit(
                player.position.x + player.width / 2,
                CONFIG.CANVAS_HEIGHT,
                25,
                '#00d4ff',
                6
            );
        }
    }

    checkCollectibles(player) {
        this.level.collectibles = this.level.collectibles.filter(collectible => {
            if (player.alive && player.collidingWith(collectible)) {
                player.score += 100;
                this.audioManager.playSound('collectible', 0.2);
                
                // Emit collect particles
                this.particleSystem.emit(
                    collectible.position.x + collectible.width / 2,
                    collectible.position.y + collectible.height / 2,
                    15,
                    '#ffff00',
                    4
                );
                
                return false;
            }
            return true;
        });
    }

    checkGoal(player) {
        const goal = this.level.platforms.find(p => p.type === 'goal');
        return goal && player.collidingWith(goal);
    }

    levelComplete(player) {
        this.gameState = 'paused';
        const message = `Level ${this.currentLevel} Complete!<br>Score: ${player.score}<br>Time: ${Math.floor(this.gameTime)}s`;
        document.getElementById('gameOverTitle').textContent = 'Level Complete!';
        document.getElementById('gameOverMessage').innerHTML = message;
        
        if (this.currentLevel >= this.maxLevels) {
            document.getElementById('nextLevelBtn').style.display = 'none';
        } else {
            document.getElementById('nextLevelBtn').style.display = 'inline-block';
        }
        
        document.getElementById('gameOverOverlay').classList.remove('hidden');
        this.audioManager.playSound('levelComplete', 0.5);
    }

    gameLose() {
        this.gameState = 'paused';
        document.getElementById('gameOverTitle').textContent = 'Time\'s Up!';
        document.getElementById('gameOverMessage').innerHTML = 'You ran out of time!<br>Try again!';
        document.getElementById('nextLevelBtn').style.display = 'none';
        document.getElementById('retryBtn').style.display = 'inline-block';
        document.getElementById('gameOverOverlay').classList.remove('hidden');
        this.audioManager.playSound('damage', 0.3);
    }

    nextLevel() {
        if (this.currentLevel < this.maxLevels) {
            this.currentLevel++;
            this.createLevel();
            this.gameState = 'playing';
            document.getElementById('gameOverOverlay').classList.add('hidden');
        } else {
            this.gameWon();
        }
    }

    retryLevel() {
        this.createLevel();
        this.gameState = 'playing';
        document.getElementById('gameOverOverlay').classList.add('hidden');
    }

    restartLevel() {
        this.createLevel();
        this.gameState = 'playing';
    }

    togglePause() {
        if (this.gameState === 'playing') {
            this.gameState = 'paused';
            document.getElementById('pauseOverlay').classList.remove('hidden');
        } else if (this.gameState === 'paused') {
            this.gameState = 'playing';
            document.getElementById('pauseOverlay').classList.add('hidden');
        }
    }

    goToMenu() {
        this.gameState = 'menu';
        document.getElementById('pauseOverlay').classList.add('hidden');
        document.getElementById('gameOverOverlay').classList.add('hidden');
    }

    gameWon() {
        this.gameState = 'paused';
        document.getElementById('gameOverTitle').textContent = 'Game Won!';
        document.getElementById('gameOverMessage').innerHTML = 'Congratulations!<br>You completed all levels!';
        document.getElementById('nextLevelBtn').style.display = 'none';
        document.getElementById('gameOverOverlay').classList.remove('hidden');
    }

    updateUI() {
        document.getElementById('levelDisplay').textContent = `Level ${this.currentLevel}`;
        document.getElementById('timeDisplay').textContent = `Time: ${Math.floor(this.gameTime)}s / ${this.level.timeLimit}s`;
        document.getElementById('scoreDisplay').textContent = `Score: ${this.player.score}`;
    }

    drawStars() {
        this.starField.forEach(star => {
            star.opacity += Math.sin(this.gameTime * star.twinkleSpeed) * 0.1;
            star.opacity = Math.max(0.2, Math.min(1, star.opacity));
            
            this.ctx.globalAlpha = star.opacity;
            this.ctx.fillStyle = '#fff';
            this.ctx.beginPath();
            this.ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
            this.ctx.fill();
        });
        this.ctx.globalAlpha = 1;
    }

    drawGame() {
        // Background with gradient
        const grad = this.ctx.createLinearGradient(0, 0, 0, CONFIG.CANVAS_HEIGHT);
        grad.addColorStop(0, '#0a1f2e');
        grad.addColorStop(1, '#1a3a52');
        this.ctx.fillStyle = grad;
        this.ctx.fillRect(0, 0, CONFIG.CANVAS_WIDTH, CONFIG.CANVAS_HEIGHT);

        // Draw stars
        this.drawStars();

        // Grid pattern
        this.ctx.strokeStyle = 'rgba(102, 126, 234, 0.05)';
        this.ctx.lineWidth = 1;
        for (let x = 0; x < CONFIG.CANVAS_WIDTH; x += 50) {
            this.ctx.beginPath();
            this.ctx.moveTo(x, 0);
            this.ctx.lineTo(x, CONFIG.CANVAS_HEIGHT);
            this.ctx.stroke();
        }

        // Draw level
        if (this.level) {
            this.level.draw(this.ctx);
            
            // Draw collectibles
            this.level.collectibles.forEach(collectible => {
                collectible.draw(this.ctx);
            });
            
            // Draw player
            if (this.player) {
                this.player.draw(this.ctx);
            }
        }

        // Draw particles
        this.particleSystem.draw(this.ctx);
    }

    gameLoop() {
        this.updateGame();
        this.drawGame();
        requestAnimationFrame(() => this.gameLoop());
    }

    start() {
        this.gameLoop();
    }
}

// ========== INITIALIZATION ==========
let game;
window.addEventListener('DOMContentLoaded', () => {
    game = new Game();
    game.start();
});
