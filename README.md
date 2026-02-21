# APEX PLATFORMER - Animated Game

A high-performance, beautifully animated 2D platformer game built with pure HTML5 Canvas, featuring smooth character animations, particle effects, physics engine, progressive difficulty levels, and professional audio integration.
<img width="1875" height="920" alt="image" src="https://github.com/user-attachments/assets/897926ae-d157-49b0-8d5d-397eeec5a8fb" />

## 🎮 Game Features

### Core Gameplay
- **Physics-Based Movement**: Realistic gravity, friction, and collision detection
- **Progressive Difficulty**: 3+ levels with increasing challenge
- **Smooth Animations**: Character sprite animations, rotating collectibles, wobbling platforms
- **Particle Effects System**: Visual feedback for every action (jumping, dashing, collecting)
- **Collectibles System**: Coins to collect for bonus points with spinning animation
- **Time-Based Challenges**: Each level has a time limit
- **Professional Audio**: Web Audio API integration for dynamic sound effects

### Visual Effects & Animations
- **Sprite Animations**: Character bouncing, eye movement, mouth animation
- **Dash Effect**: Spiral animation while dashing
- **Particle Emission**: Jump trails, dash particles, collectible bursts, damage effects
- **Rotating Collectibles**: Spinning coins with pulsing glow
- **Twinkling Starfield**: Animated background stars
- **Platform Wobble**: Spike platforms wobble for visual feedback
- **Gradient Backgrounds**: Smooth color transitions
- **Animated UI**: Bouncing numbers, shimmering text, smooth transitions

### Player Mechanics
- **Jump Physics**: Variable jump height with smooth animation
- **Dash Ability**: High-speed short burst with spiral effect
- **Wall Awareness**: Smart collision detection for various platform types
- **Score Tracking**: Real-time score display with bounce animation

### Level Design
- **3 Handcrafted Levels**: Each with unique layout and difficulty curve
- **Multiple Platform Types**: Normal, spike hazards, and goal platforms
- **Dynamic Challenges**: Time limits, obstacles, and precision jumps

## 🎮 Game Controls

### Player Controls
- **W** - Jump
- **A/D** - Move Left/Right
- **SPACE** - Dash (uses cooldown, creates particles)
- **Mouse** - Look Around (UI effect)

## 🚀 Getting Started

### Installation
1. No installation required! This is a pure web-based game
2. Extract all files to a directory
3. Open `index.html` in a modern web browser

### Running the Game
1. Open `index.html` in Chrome, Firefox, Edge, or Safari
2. Click "Start Game" button
3. Navigate the platformer using W/A/D keys
4. Use SPACE to dash for special moves
5. Reach the green platform (goal) before time runs out!

## 🏗️ Architecture

### Project Structure
- **index.html**: Main HTML file with game canvas and UI
- **styles.css**: Professional styling with CSS animations
- **game.js**: Complete animated game engine with 1000+ lines of code
- **README.md**: Full documentation (this file)

## ✨ Animation Features Implemented

✅ Sprite character animations (bouncing, eyes, mouth)
✅ Dash spiral effect with rotation
✅ Rotating collectibles with pulsing glow
✅ Twinkling starfield background
✅ Platform wobble animations
✅ Particle system for all interactions
✅ Smooth transitions and UI animations
✅ Gradient backgrounds
✅ Glowing effects on UI elements
✅ Smooth camera/viewport rendering

## Technical Stack

- **HTML5**: Semantic canvas-based game setup
- **CSS3**: Modern animations with keyframes, gradients, and effects
- **JavaScript (ES6+)**: Object-oriented game engine with animation systems
- **Canvas API**: High-performance 2D rendering with transforms
- **Web Audio API**: Dynamic audio generation
- **RequestAnimationFrame**: Smooth 60 FPS animation loop

## Game Architecture

### Core Classes
- **Particle**: Individual particle with physics and fade animation
- **ParticleSystem**: Manages all particle emissions and updates
- **Vector2**: 2D vector math operations
- **GameObject**: Base physics object with collision
- **Player**: Character with sprite animations, movement, and abilities
- **Platform**: Interactive level elements with animations
- **Level**: Level data and layout management
- **Game**: Main controller with animation state management
- **AudioManager**: Web Audio API sound effects

### Animation Systems
1. **Sprite Animation**: Character bouncing, eye blinking, mouth movement
2. **Particle System**: Emits particles on dash, jump, collect, damage
3. **Platform Animation**: Wobbling spikes, gradient effects
4. **Collectible Animation**: Rotating coins with pulsing alpha
5. **Background Animation**: Twinkling stars, depth effect
6. **UI Animation**: Bouncing numbers, shimmer effects
7. **Transition Effects**: Smooth slide-ins, fades

## 🎯 Gameplay

### How to Win
- Reach the green goal platform at the end of each level
- Complete the level before time runs out
- Progress through all 3 levels to beat the game

### Strategy Tips
- Time your jumps carefully for precision platforming
- Use dash ability wisely (30 frame cooldown)
- Collect coins for bonus points
- Avoid spike obstacles at all costs
- Watch particle effects for feedback on your actions

### Difficulty Levels
- **Level 1**: Introduction - Learn the controls and animations
- **Level 2**: Intermediate - Avoid spike obstacles with wobble animation
- **Level 3**: Expert - Complex platforming sequences

## 🎨 Animation Design

### Color Scheme
- **Primary**: Purple (#667eea) - Main UI and platforms
- **Player**: Cyan (#00d4ff) - Main character
- **Collectibles**: Yellow (#ffff00) - Rotating coins
- **Success**: Lime Green (#00ff88) - Goal markers
- **Danger**: Red (#ff0055) - Wobbling spike traps
- **Background**: Dark blue gradient - Animated stars

### Visual Effects
- Particle emitters for impact feedback
- Smooth sprite animations without frame skipping
- Gradient overlays for depth
- Glow effects on interactive elements
- Trail particles on dash and landing
- Damage burst on collision

## 🔊 Audio System

### Sound Effects (Synthesized)
- **Jump Sound**: 400Hz tone with smooth fade
- **Dash Sound**: 600Hz tone with quicker envelope
- **Collectible Sound**: 800Hz tone for pickup feedback
- **Level Complete**: 1000Hz tone for success
- **Damage Sound**: 200Hz tone for collision

### Audio Control
- Toggle sound on/off with the UI checkbox
- All sounds generated dynamically (no external files)
- Professional frequency and duration tuning

## 🖥️ Technical Details

### Browser Compatibility
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

### Performance
- 60 FPS smooth gameplay
- Optimized particle rendering
- Efficient animation frame updates
- Smooth canvas transforms
- RequestAnimationFrame-based loop

### Responsive Design
- Adapts to different screen sizes
- Maintains aspect ratio
- Mobile-friendly considerations

## 🎓 Animation Implementation Details

### Sprite Animation System
```javascript
// Character animates with bouncing offset
const bounceOffset = Math.sin(animationFrame * Math.PI) * 2;
// Eyes move up and down smoothly
// Mouth curves with animation frame
```

### Particle System
```javascript
// Particles emit on actions with physics
emit(x, y, count, color, speedRange);
// Each particle has velocity, life, and fade animation
// Updated with gravity each frame
```

### Rotation Animation
```javascript
// Collectibles rotate continuously
const rotation = (gameTime * 3 + idx) % (Math.PI * 2);
ctx.rotate(rotation);
// Combined with pulsing alpha for glow effect
```

## Customization

### Change Animation Speed
Edit animation frame speed in Player class:
```javascript
this.animationSpeed = 0.1; // Increase for faster animation
```

### Adjust Particle Emission
Modify particle count and speed in handleDash/handleCollisions:
```javascript
this.particleSystem.emit(x, y, 15, color, 4); // 15 particles, speed range 4
```

### Customize Colors
Modify color values throughout the code for different aesthetics

## 🔄 Future Enhancement Ideas

- [ ] Additional animated obstacles
- [ ] Boss level with animated enemy
- [ ] Environmental animations (moving clouds, scrolling background)
- [ ] Trail effects for movement
- [ ] Screen shake on large impacts
- [ ] Checkpoint animations
- [ ] Victory animation sequence
- [ ] Power-up visual effects
- [ ] Mobile touch controls with haptic feedback

## Browser DevTools Debugging

Open DevTools (F12) and check:
- **Console**: Game state and debug info
- **Performance**: FPS and animation smoothness
- **Elements**: Canvas rendering verification

## Credits

Professional animated 2D platformer game engine built with vanilla JavaScript and HTML5 Canvas.
Features smooth sprite animations, particle effects, and physics-based gameplay.

---

**APEX PLATFORMER - Animated Edition** - A beautiful, production-ready platformer game.

Enjoy smooth, fluid gameplay with gorgeous animations! 🎮✨

## 🎮 Game Features

### Core Gameplay
- **Physics-Based Movement**: Realistic gravity, friction, and collision detection
- **Progressive Difficulty**: 3+ levels with increasing challenge
- **Multiplayer Competitive Mode**: Two players racing on the same screen
- **Collectibles System**: Coins to collect for bonus points
- **Time-Based Challenges**: Each level has a time limit
- **Professional Audio**: Web Audio API integration for sound effects

### Player Mechanics
- **Jump Physics**: Variable jump height based on button hold duration
- **Dash Ability**: High-speed short burst for tactical movement
- **Wall Awareness**: Smart collision detection for various platform types
- **Score Tracking**: Real-time score and performance metrics

### Level Design
- **3 Handcrafted Levels**: Each with unique layout and difficulty curve
- **Multiple Platform Types**: Normal, moving, spike hazards, and goal platforms
- **Dynamic Challenges**: Time limits, obstacles, and precision jumps

## Game Controls

### Player Controls
- **W** - Jump
- **A/D** - Move Left/Right
- **SPACE** - Dash (uses cooldown, creates particles)
- **Mouse** - Look Around (UI effect)

## 🚀 Getting Started

### Installation
1. No installation required! This is a pure web-based game
2. Extract all files to a directory
3. Open `index.html` in a modern web browser

### Running the Game
1. Open `index.html` in Chrome, Firefox, Edge, or Safari
2. Click "Start Game" button
3. Navigate the platformer using W/A/D keys
4. Use SPACE to dash for special moves
5. Reach the green platform (goal) before time runs out!

## Architecture

### Project Structure
- **index.html**: Main HTML file with game canvas and UI
- **styles.css**: Professional styling with responsive design
- **game.js**: Complete game engine with 1000+ lines of code
- **README.md**: Full documentation (this file)

## Features Implemented

✅ Physics-based 2D platformer engine
✅ Dual-player competitive mechanics
✅ 3 progressively difficult levels
✅ Collision detection system
✅ Time-based challenges
✅ Collectibles and scoring system
✅ Web Audio API sound effects
✅ Modern UI with overlay menus
✅ Responsive design
✅ Professional code architecture

## Technical Stack

- **HTML5**: Semantic canvas-based game setup
- **CSS3**: Modern styling with gradients and animations
- **JavaScript (ES6+)**: Object-oriented game engine
- **Canvas API**: High-performance 2D rendering
- **Web Audio API**: Dynamic audio generation

## Game Architecture

### Core Classes
- **Vector2**: 2D vector math operations
- **GameObject**: Base physics object with velocity and position
- **Player**: Character with movement, jumping, and dashing
- **Platform**: Interactive level elements (normal, spike, goal, collectible)
- **Level**: Level data and layout management
- **Game**: Main game controller and state machine
- **AudioManager**: Web Audio API sound effects

### Game Systems
1. **Physics Engine**: Gravity, friction, acceleration
2. **Input System**: Multi-player keyboard handling
3. **Audio System**: Frequency-based sound generation
4. **Collision Detection**: AABB-based collision system
5. **Score Tracking**: Real-time player statistics
6. **Level Management**: Progressive difficulty system

## Gameplay

### How to Win
- Reach the green goal platform at the end of each level
- Complete the level before time runs out
- Progress through all 3 levels

### Strategy Tips
- Time your jumps carefully for precision platforming
- Use dash ability wisely (30 frame cooldown)
- Collect coins for bonus points
- Avoid spike obstacles at all costs
- Manage your time on each level

## Customization

You can easily modify the game:

### Adjust Physics
Edit the CONFIG object in game.js:
```javascript
const CONFIG = {
    GRAVITY: 0.6,
    PLAYER_SPEED: 5,
    PLAYER_JUMP_POWER: 12,
    DASH_POWER: 15,
    DASH_COOLDOWN: 30,
};
```

### Add New Levels
Add methods to the Level class:
```javascript
createLevel4() {
    // Add your platform configuration
}
```

### Change Colors
Modify the color values in styles.css and game.js

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Performance

- 60 FPS gameplay
- Optimized collision detection
- Efficient canvas rendering
- Responsive input handling

## Audio

All sound effects are generated dynamically using Web Audio API:
- Jump: 400Hz tone
- Dash: 600Hz tone
- Collectible: 800Hz tone
- Level Complete: 1000Hz tone
- Damage: 200Hz tone

Toggle audio on/off with the UI checkbox.

## Future Enhancements

- Save/load system
- Additional levels
- Power-up items
- Particle effects
- Mobile touch controls
- AI opponents
- High score leaderboard

## Credits

Professional game engine built with vanilla JavaScript and HTML5 Canvas.

---

**APEX PLATFORMER** - A complete, production-ready 2D platformer game.

Enjoy the game! 🎮
