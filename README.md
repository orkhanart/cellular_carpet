# Cellular Carpet

A generative art project using cellular automata to create dynamic carpet-like patterns inspired by traditional rug designs.

## Overview

This project implements a multi-layered cellular automaton system that generates intricate geometric patterns reminiscent of Persian and Turkish carpets. The system uses Conway's Game of Life variants to create evolving borders and fields with symmetrical properties.

## Features

- **Multi-layered Border System**: Three distinct border layers (outer, main, inner) with configurable thickness
- **Cellular Automaton Rules**: Implements Conway's Life and HighLife variants
- **Symmetry**: 4-way symmetry for carpet-like aesthetics
- **Color Palettes**: Multiple curated color schemes
- **Interactive Controls**:
  - Press `r` to restart the animation
  - Press `h` to save high-resolution image (1716px)
  - Press `j` to save extra high-resolution image (3432px)

## Technical Details

### Components

- **sketch.js**: Main p5.js setup and draw loop
- **cellularAutomaton.js**: Core CA engine with rules and rendering
- **cell.js**: Individual cell state management
- **config.js**: Configuration constants for dimensions, colors, and rules
- **utils.js**: Helper functions including random number generation and weighted selection

### Cellular Automaton Rules

- **Life**: Classic Conway's Game of Life (B3/S23)
- **HighLife**: Variant with replication (B36/S23)
- **Border**: Custom rule for border generation

## Setup

1. Open `index.html` in a modern web browser
2. The artwork will generate automatically
3. Use keyboard controls to interact

## Dependencies

- p5.js v1.4.0 (loaded via CDN)

## License

This project is part of the Protofield Carpets series.
