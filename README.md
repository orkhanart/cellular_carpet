# Cellular Carpet

A generative art project using cellular automata to create dynamic carpet-like patterns inspired by traditional rug designs.

## Overview

This project implements a multi-layered cellular automaton system that generates intricate geometric patterns reminiscent of Persian and Turkish carpets. The system uses Conway's Game of Life variants to create evolving borders and fields with symmetrical properties.

## Features

- **Protofield Cellular Automaton**: Uses kernel convolution with modular arithmetic
- **Interactive UI Controls**: Full-featured control panel for real-time parameter adjustment
- **Multiple Kernels**: Single point, Moore, Von Neumann, Cross, and Custom 5×5 weighted kernel
- **Configurable Modulus**: Choose from 2, 3, 5, 7, 11, or 13 for different pattern behaviors
- **Color Schemes**: Blue/White, Grayscale, Rainbow, and Fire color palettes
- **Threshold Filters**: Min/max thresholds for selective pattern visualization
- **Export Functions**: Save PNG images and import/export settings as JSON
- **Seed Patterns**: Fractal seed and random seed initialization options
- **Optimized Performance**: Direct pixel manipulation for fast rendering

## Technical Details

### Components

- **sketch.js**: Main p5.js sketch with protofield algorithm implementation
- **controls.js**: UI control panel and event handlers
- **index.html**: Main HTML page with control panel UI
- **style.css**: Styling for the control panel interface

### Protofield Algorithm

The system uses kernel convolution with modular arithmetic:
1. For each cell, apply a weighted kernel to its neighborhood
2. Sum the weighted values
3. Apply modulus operation to get the new cell value
4. This creates complex, self-organizing patterns based on mathematical principles

## Setup

1. Open `index.html` in a modern web browser
2. Click the ⚙️ Settings button to open the control panel
3. Adjust parameters:
   - **Grid Size**: Choose from 200×250 to 800×1000 cells
   - **Cell Size**: 1px to 8px per cell
   - **Modulus**: 2-13 for different pattern behaviors
   - **Kernel Type**: Select convolution kernel shape
   - **Color Scheme**: Choose visualization colors
4. Use playback controls:
   - **Start**: Begin animation
   - **Pause**: Stop animation
   - **Reset**: Reset to initial state
   - **Step**: Advance one generation
5. Try different seeds:
   - **Fractal Seed**: Complex initial pattern
   - **Random Seed**: 10% random fill
6. Export your work:
   - **Export PNG**: Save current image
   - **Save Settings**: Export configuration as JSON
   - **Load Settings**: Import previous configuration

## Dependencies

- p5.js v1.4.0 (loaded via CDN)

## License

This project is part of the Protofield Carpets series.
