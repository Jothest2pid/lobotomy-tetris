# 🧠 Lobotomy Tetris

A twisted take on the classic Tetris game that progressively loses its sanity with every Tetris (4-line clear) you achieve.

![Lobotomy Tetris Screenshot](lobotomy.jpg)

## 🎮 What is Lobotomy Tetris?

Lobotomy Tetris starts as a normal Tetris game, but each time you clear 4 lines at once, the game receives a "lobotomy" - gradually becoming more chaotic, glitched, and unpredictable. Think of it as Tetris with a progressive mental breakdown.

## 🧩 Features

### Core Gameplay
- **Classic Tetris mechanics** with modern features
- **Hold piece system** - Store a piece for later use
- **Ghost piece preview** - See where your piece will land
- **Next piece preview** - Plan your moves ahead
- **Progressive difficulty** - Speed increases with level

### Lobotomy Effects (Activated by Tetris clears)
- **Visual glitches** - Screen distortions, color mutations, and UI chaos
- **Piece mutations** - Tetris pieces randomly change shape
- **Color cycling** - Block colors shift unpredictably  
- **Forced piece locks** - Get stuck with the same piece type
- **Random board chaos** - Blocks appear and disappear randomly
- **Turkey sandwich videos** - Because why not?
- **Subway Surfers gameplay** - The ultimate brain rot experience
- **Audio distortions** - Sound effects get progressively more chaotic

## 🎯 Controls

| Key | Action |
|-----|--------|
| `←` `→` | Move piece left/right |
| `↑` | Rotate piece |
| `↓` | Soft drop (faster fall) |
| `Space` | Hard drop (instant fall) |
| `C` | Hold/swap piece |
| `Space` | Restart game (when game over) |

## 🚀 How to Play

### Option 1: Easy Launch (Recommended)
1. Double-click `launch-game.exe` 
2. The game will automatically open in your default browser
3. Start playing immediately!

### Option 2: Manual Launch
1. Open `index.html` in any modern web browser
2. Use keyboard controls to play
3. Try to survive the increasing chaos!

## 🎪 The Lobotomy Experience

The game tracks your "glitch level" (0-10) based on how many Tetris clears you achieve:

- **Level 0-2**: Normal Tetris with minor visual effects
- **Level 3-5**: Pieces start mutating, colors begin shifting
- **Level 6-8**: UI elements glitch, forced piece types appear
- **Level 9-10**: Complete chaos - random blocks, piece swapping, visual mayhem

## 🛠️ Technical Details

- **Pure HTML5/CSS3/JavaScript** - No external dependencies
- **Canvas-based rendering** - Smooth 60fps gameplay
- **Responsive design** - Works on different screen sizes
- **Modern browser support** - Chrome, Firefox, Safari, Edge

## 📁 Project Structure

```
lobotomy-tetris/
├── index.html          # Main game file
├── game.js            # Game logic and lobotomy effects
├── styles.css         # Styling and animations
├── lobotomy.jpg       # Overlay image for Tetris clears
├── lobotomy.wav       # Sound effect for line clears
├── turkey_sandwich.mp4 # Chaos video #1
├── Subway_Surfers_Gameplay.mp4 # Chaos video #2
├── launch-game.exe    # Easy launcher
└── README.md          # This file
```

## 🎨 Customization

Want to modify the chaos? Edit these variables in `game.js`:

- `MAX_GLITCH`: Maximum glitch level (default: 10)
- `FORCED_PIECE_DURATION`: How long piece locks last (default: 10)
- `OVERLAY_DURATION`: How long images stay on screen (default: 2000ms)

## 🐛 Known "Features"

- Pieces may randomly mutate into impossible shapes
- Colors might change mid-game
- UI elements will eventually start rotating and glitching
- Videos may play at random speeds and orientations
- The game becomes increasingly unplayable by design

## 🤝 Contributing

This is a chaotic art project, but feel free to:
- Add more glitch effects
- Include additional chaos videos
- Improve the visual distortions
- Make the lobotomy even more intense

## ⚠️ Warning

This game contains:
- Flashing lights and rapid color changes
- Intentionally disorienting visual effects
- Progressive difficulty that borders on impossible
- Content designed to be mildly frustrating

Play at your own risk of losing your sanity! 🧠💥

## 📜 License

See [LICENSE](LICENSE) file for details.

---

*"The only winning move is not to play... but you'll play anyway."*
