# Minesweeper

A classic Minesweeper game built entirely with **HTML, CSS, and JavaScript**. Features an ultra-minimalistic dark mode design with subtle animations - ready to deploy on GitHub Pages!

## 🎮 How to Play

**Goal:** Uncover all tiles that don't contain mines without triggering any mines.

### Controls:

- **Left Click / Space:** Reveal a cell
- **Right Click / F key:** Flag/unflag a suspected mine
- **Arrow Keys / WASD:** Navigate the board (keyboard mode)
- **R key:** Start a new game
- **Long Press (Mobile):** Flag a cell

### Game Rules:

- Numbers show how many mines are adjacent to that cell (including diagonally)
- If you click on a mine, you lose!
- Flag cells you suspect contain mines
- Win by revealing all non-mine cells

## 🎯 Difficulty Levels

| Difficulty   | Grid Size | Mines | Description          |
| ------------ | --------- | ----- | -------------------- |
| Beginner     | 9×9       | 10    | Perfect for learning |
| Intermediate | 16×16     | 40    | Moderate challenge   |
| Expert       | 30×16     | 99    | For seasoned players |

## 🚀 Running Locally

1. **Clone or Download** this repository
2. **Open** `docs/index.html` in your web browser
3. **Play!** No installation or build process needed

```bash
# If using a local server (optional)
cd docs
python -m http.server 8000
# Then visit http://localhost:8000
```

## 🌐 Deploy to GitHub Pages

1. **Fork** this repository
2. Go to **Settings** → **Pages**
3. Set source to **Deploy from a branch**
4. Select **main branch** and **/docs folder**
5. Click **Save**
6. Your game will be live at `https://yourusername.github.io/claudes-minesweeper/`

## ✨ Features

### 🎨 Ultra-Minimalistic Design

- **Dark mode interface** with geometric, clean layouts
- **Monochromatic color palette** using gray-scale variations
- **System font typography** with light weights (300-400)
- **Perfect square cells** with minimal 1px gaps
- **Flat design** with subtle state changes

### 🎬 Subtle Animations

- **Smooth cascading reveals** with staggered timing across the board
- **Number count-up animation** with scale and opacity effects
- **Gentle pulse on hover** for unrevealed cells
- **Mine explosion ripple effect** revealing mines sequentially
- **Touch-optimized** with animations disabled on mobile for performance

### ♿ Accessibility

- Full keyboard navigation support (Arrow keys, WASD, Space, F, R)
- Screen reader friendly with ARIA labels and semantic HTML
- Clean focus indicators for keyboard users
- High contrast design for readability

### 📱 Mobile Optimized

- Touch-friendly controls with long-press flagging
- Responsive grid sizing for all screen sizes
- Optimized cell dimensions for mobile interaction
- Performance-optimized animations

### 🎯 Game Features

- **Three difficulty levels** with configurable mine counts
- **Timer and mine counter** with monospace font styling
- **Geometric symbols**: Simple bullet (●) for mines, flag (⚑) for flagged cells
- **Smart game logic** with recursive reveal and win detection
- **Audio feedback** with click and explosion sounds

## 🛠️ Technical Details

### File Structure

```
docs/
├── index.html      # Main HTML structure
├── style.css       # All styling and responsive design
└── minesweeper.js  # Complete game logic
```

### Key Functions

- `createBoard()` - Generates game grid and places mines
- `revealCell()` - Handles cell revelation with cascading animations
- `flagCell()` - Manages mine flagging with visual feedback
- `checkWinCondition()` - Determines game completion
- `handleKeyboard()` - Full keyboard navigation support
- `animateNumber()` - Creates count-up animation for revealed numbers
- `revealMinesWithRipple()` - Sequential mine revelation on game over

### Browser Compatibility

- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+
- Mobile browsers (iOS Safari, Chrome Mobile)

## 🎨 Customization

Want to modify the game? Here are some easy customizations:

### Change Dark Mode Colors

Edit the color variables in `style.css`:

```css
/* Dark mode color palette */
body {
  background: #111827;
  color: #f9fafb;
}
.game-container {
  background: #1f2937;
  border: 1px solid #374151;
}
.cell {
  background: #374151;
  border: 1px solid #6b7280;
}
.cell.revealed {
  background: #1f2937;
}
```

### Customize Animations

Modify animation timing and effects:

```css
/* Adjust animation speeds */
@keyframes cell-reveal {
  /* 0.3s duration */
}
@keyframes gentle-pulse {
  /* 2s infinite */
}
@keyframes mine-explosion {
  /* 0.6s duration */
}
```

### Add New Difficulty

In `minesweeper.js`, add to the difficulties object:

```javascript
this.difficulties = {
  // existing difficulties...
  custom: { width: 20, height: 20, mines: 50 },
};
```

### Disable Animations

For users who prefer reduced motion:

```css
@media (prefers-reduced-motion: reduce) {
  * {
    animation: none !important;
    transition: none !important;
  }
}
```

## 📸 Screenshots

![image](https://github.com/user-attachments/assets/d6019265-942b-4b6b-b9eb-cdf4c13ada20)

## 🤝 Contributing

Found a bug or want to add a feature?

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📜 License

This project is open source and available under the [MIT License](LICENSE).

## 🏆 Credits

**Built entirely by Claude Code**

- No external frameworks or libraries
- Pure HTML, CSS, and JavaScript
- Ultra-minimalistic geometric design
- Smooth animations with 60fps performance
- Optimized for accessibility and mobile use
- Ready for GitHub Pages deployment

---

### 🎮 Ready to Play?

**Experience the ultra-minimalistic minesweeper with beautiful dark mode and subtle animations.**

[**🚀 Play Now on GitHub Pages**](https://rw-pz.github.io/claude-minesweeper/)

---

## 🎯 Design Philosophy

This implementation follows an **ultra-minimalistic, geometric approach**:

- **Ultra-Limited Color Palette**: Gray-900 for text, Gray-50/100/200 for backgrounds
- **Geometric Layout**: Perfect squares with minimal gaps and clean typography
- **Minimalistic UI**: Simple states with subtle hover effects and monospace counters
- **Refined Interactions**: Smooth transitions without flashy animations
- **Dark Mode First**: Designed primarily for dark environments

The game embraces the "less is more" philosophy, using only essential elements with perfect typography, spacing, and a monochromatic color scheme.
