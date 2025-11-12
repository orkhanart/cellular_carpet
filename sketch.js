// Main Sketch - Protofield Cellular Automaton with Region System
// Multiple regions: b0 (outer border), b1 (main border), b2 (inner border), f0 (field)

// Region data structures
let regions = {
  b0: {
    grid: [],
    nextGrid: [],
    width: 0,
    height: 0,
    offsetX: 0,
    offsetY: 0,
    thickness: 10,
    enabled: true,
    running: false,
    bgColor: [240, 245, 255],
  }, // Very pale blue - thickness was 20@2px, now 10@4px
  b1: {
    grid: [],
    nextGrid: [],
    width: 0,
    height: 0,
    offsetX: 0,
    offsetY: 0,
    thickness: 30,
    enabled: true,
    running: false,
    bgColor: [245, 250, 255],
  }, // Very pale cyan - thickness was 60@2px, now 30@4px
  b2: {
    grid: [],
    nextGrid: [],
    width: 0,
    height: 0,
    offsetX: 0,
    offsetY: 0,
    thickness: 8,
    enabled: true,
    running: false,
    bgColor: [250, 252, 255],
  }, // Very pale ice - thickness was 15@2px, now 8@4px (rounds to ~16px)
  f0: {
    grid: [],
    nextGrid: [],
    width: 0,
    height: 0,
    offsetX: 0,
    offsetY: 0,
    thickness: 0,
    enabled: true,
    running: false,
    bgColor: [252, 253, 255],
  }, // Almost white blue
};

// Global parameters
let canvasWidth = 600;
let canvasHeight = 750;
let cellSize = 2; // One cell size for entire canvas

// Region-specific parameters
let regionParams = {
  b0: {
    modulus: 3,
    kernelType: "moore",
    color: "#0000FF",
    minThreshold: 0,
    maxThreshold: 0,
    seedPointsPerSide: 6,
  },
  b1: {
    modulus: 5,
    kernelType: "custom",
    color: "#FF0000",
    minThreshold: 0,
    maxThreshold: 0,
    seedPointsPerSide: 3,
  },
  b2: {
    modulus: 3,
    kernelType: "moore",
    color: "#00FF00",
    minThreshold: 0,
    maxThreshold: 0,
    seedPointsPerSide: 3,
  },
  f0: {
    modulus: 5,
    kernelType: "custom",
    color: "#000000",
    minThreshold: 0,
    maxThreshold: 0,
    seedPoints: 1, // Number of seed points (1-3), evenly spaced horizontally
  },
};

/**
 * p5.js setup function
 */
function setup() {
  pixelDensity(1);

  // Create canvas
  createCanvas(windowWidth, windowHeight);
  noStroke();
  noSmooth(); // Disable anti-aliasing for pixel-perfect rendering
  noLoop();

  // Set initial frame rate
  frameRate(60);

  // Calculate region dimensions
  calculateRegionDimensions();

  // Initialize all regions
  initializeAllRegions();

  // Initial draw
  redraw();

  console.log("Region system initialized");
  console.log("b0:", regions.b0.width, "×", regions.b0.height, "cells");
  console.log("b1:", regions.b1.width, "×", regions.b1.height, "cells");
  console.log("b2:", regions.b2.width, "×", regions.b2.height, "cells");
  console.log("f0:", regions.f0.width, "×", regions.f0.height, "cells");
}

/**
 * p5.js draw loop
 */
function draw() {
  background(255);

  // Center the canvas content
  push();
  translate((width - canvasWidth) / 2, (height - canvasHeight) / 2);

  // Draw a white background for the entire canvas area
  fill(255);
  rect(0, 0, canvasWidth, canvasHeight);

  // Draw each region in order (back to front)
  drawRegion("b0");
  drawRegion("b1");
  drawRegion("b2");
  drawRegion("f0");

  pop();
}

/**
 * Calculate dimensions for all regions based on canvas size
 */
function calculateRegionDimensions() {
  // All regions use the same cellSize for coherent look

  // b0 - Outer border (full canvas)
  regions.b0.width = Math.floor(canvasWidth / cellSize);
  regions.b0.height = Math.floor(canvasHeight / cellSize);
  regions.b0.offsetX = 0;
  regions.b0.offsetY = 0;

  // b1 - Main border (inside b0)
  const b0Thick = regions.b0.thickness;
  regions.b1.width = Math.floor(canvasWidth / cellSize - b0Thick * 2);
  regions.b1.height = Math.floor(canvasHeight / cellSize - b0Thick * 2);
  regions.b1.offsetX = b0Thick;
  regions.b1.offsetY = b0Thick;

  // b2 - Inner border (inside b1)
  const b1Thick = regions.b1.thickness;
  regions.b2.width = Math.floor(regions.b1.width - b1Thick * 2);
  regions.b2.height = Math.floor(regions.b1.height - b1Thick * 2);
  regions.b2.offsetX = b0Thick + b1Thick;
  regions.b2.offsetY = b0Thick + b1Thick;

  // f0 - Field (inside b2)
  const b2Thick = regions.b2.thickness;
  regions.f0.width = Math.floor(regions.b2.width - b2Thick * 2);
  regions.f0.height = Math.floor(regions.b2.height - b2Thick * 2);
  regions.f0.offsetX = b0Thick + b1Thick + b2Thick;
  regions.f0.offsetY = b0Thick + b1Thick + b2Thick;
}

/**
 * Initialize all regions
 */
function initializeAllRegions() {
  for (let regionName in regions) {
    initializeRegion(regionName);
  }
}

/**
 * Initialize a single region
 */
function initializeRegion(regionName) {
  const region = regions[regionName];
  const w = region.width;
  const h = region.height;

  // Allocate grids
  region.grid = new Array(w);
  region.nextGrid = new Array(w);

  for (let x = 0; x < w; x++) {
    region.grid[x] = new Array(h);
    region.nextGrid[x] = new Array(h);
    for (let y = 0; y < h; y++) {
      region.grid[x][y] = 0;
      region.nextGrid[x][y] = 0;
    }
  }

  // Set initial seed pattern with randomization for 666+ unique outcomes
  const params = regionParams[regionName];

  if (regionName === "f0") {
    // Field: Randomized seed placement in first quadrant
    // Strategy: 6×6 grid (36 positions) with 2-3 random seeds
    // Outcomes: C(36,2) = 630 + variation from seed count = 666+ total outcomes

    // Define grid in first quadrant only (symmetry will be applied during rendering)
    const gridCols = 6;
    const gridRows = 6;
    const quadrantW = Math.floor(w / 2);
    const quadrantH = Math.floor(h / 2);

    // Create possible positions (exclude edges to avoid collision with borders)
    const positions = [];
    for (let gx = 0; gx < gridCols; gx++) {
      for (let gy = 0; gy < gridRows; gy++) {
        const x = Math.floor((quadrantW / (gridCols + 1)) * (gx + 1));
        const y = Math.floor((quadrantH / (gridRows + 1)) * (gy + 1));
        positions.push({ x, y });
      }
    }

    // Randomly select 2-3 seeds
    const seedCount = random() > 0.5 ? 2 : 3;
    const selectedPositions = shuffleArray(positions).slice(0, seedCount);

    // Place seeds with symmetry
    for (let pos of selectedPositions) {
      // First quadrant
      region.grid[pos.x][pos.y] = 1;
      // Mirror to other quadrants
      region.grid[w - pos.x - 1][pos.y] = 1; // Right reflection
      region.grid[pos.x][h - pos.y - 1] = 1; // Bottom reflection
      region.grid[w - pos.x - 1][h - pos.y - 1] = 1; // Diagonal reflection
    }
  } else {
    // Borders: Randomized seed placement along edges in first quadrant
    // This adds additional variation while maintaining border structure
    const thick = region.thickness;
    const midThickness = Math.floor(thick / 2);

    // Define possible seed positions along edges in first quadrant
    const topEdgePositions = [];
    const leftEdgePositions = [];

    // Top edge (first half only due to symmetry)
    const halfW = Math.floor(w / 2);
    for (let i = 0; i < params.seedPointsPerSide; i++) {
      const x = Math.floor((i * halfW) / params.seedPointsPerSide) + midThickness;
      const y = midThickness;
      if (x >= 0 && x < halfW && y >= 0 && y < h) {
        topEdgePositions.push({ x, y });
      }
    }

    // Left edge (first half only due to symmetry)
    const halfH = Math.floor(h / 2);
    for (let i = 0; i < params.seedPointsPerSide; i++) {
      const x = midThickness;
      const y = Math.floor((i * halfH) / params.seedPointsPerSide) + midThickness;
      if (x >= 0 && x < w && y >= 0 && y < halfH) {
        leftEdgePositions.push({ x, y });
      }
    }

    // Place seeds with 4-way symmetry
    for (let pos of topEdgePositions) {
      // Top edge
      region.grid[pos.x][pos.y] = 1;
      region.grid[w - pos.x - 1][pos.y] = 1; // Mirror horizontally
      // Bottom edge
      region.grid[pos.x][h - pos.y - 1] = 1;
      region.grid[w - pos.x - 1][h - pos.y - 1] = 1;
    }

    for (let pos of leftEdgePositions) {
      // Left edge
      region.grid[pos.x][pos.y] = 1;
      region.grid[pos.x][h - pos.y - 1] = 1; // Mirror vertically
      // Right edge
      region.grid[w - pos.x - 1][pos.y] = 1;
      region.grid[w - pos.x - 1][h - pos.y - 1] = 1;
    }
  }
}

/**
 * Draw a single region
 */
function drawRegion(regionName) {
  const region = regions[regionName];
  if (!region.enabled) return;

  const params = regionParams[regionName];
  const w = region.width;
  const h = region.height;
  const offsetX = region.offsetX * cellSize; // Convert cell offset to pixels
  const offsetY = region.offsetY * cellSize;

  // First, draw background for debugging (entire region at once)
  fill(region.bgColor[0], region.bgColor[1], region.bgColor[2]);
  rect(offsetX, offsetY, w * cellSize, h * cellSize);

  // Parse region color
  const regionColor = hexToRgb(params.color);

  // Draw only non-zero cells that pass threshold
  for (let x = 0; x < w; x++) {
    for (let y = 0; y < h; y++) {
      const value = region.grid[x][y];

      // Skip empty cells
      if (value === 0) continue;

      // Apply threshold filters
      let shouldDraw = true;

      // Min threshold: hide cells with values less than threshold
      if (params.minThreshold > 0 && value < params.minThreshold) {
        shouldDraw = false;
      }

      // Max threshold: hide cells with values greater than threshold
      if (params.maxThreshold > 0 && value > params.maxThreshold) {
        shouldDraw = false;
      }

      if (shouldDraw) {
        // Create gradient based on cell value and modulus
        // Like html_old.html: intensity increases with value
        const intensity = Math.floor(255 * (value / (params.modulus - 1)));
        const r = Math.floor((regionColor.r * (255 - intensity)) / 255);
        const g = Math.floor((regionColor.g * (255 - intensity)) / 255);
        const b = Math.floor((regionColor.b * (255 - intensity)) / 255);

        fill(r, g, b);
        rect(
          offsetX + x * cellSize,
          offsetY + y * cellSize,
          cellSize,
          cellSize
        );
      }
    }
  }
}

/**
 * Update a single region (one generation)
 */
function updateRegion(regionName) {
  const region = regions[regionName];
  const params = regionParams[regionName];
  const w = region.width;
  const h = region.height;

  const kernel = getKernel(params.kernelType);
  const kernelSize = kernel.length;
  const kernelRadius = Math.floor(kernelSize / 2);

  // Compute next state for each cell
  for (let x = 0; x < w; x++) {
    for (let y = 0; y < h; y++) {
      let sum = 0;

      // Apply convolution with kernel
      for (let i = -kernelRadius; i <= kernelRadius; i++) {
        for (let j = -kernelRadius; j <= kernelRadius; j++) {
          // Wrap around edges (toroidal topology)
          const nx = (x + i + w) % w;
          const ny = (y + j + h) % h;
          const ki = i + kernelRadius;
          const kj = j + kernelRadius;

          sum += region.grid[nx][ny] * kernel[ki][kj];
        }
      }

      // Apply modulus (protofield algorithm)
      region.nextGrid[x][y] = sum % params.modulus;
    }
  }

  // Swap grids
  const temp = region.grid;
  region.grid = region.nextGrid;
  region.nextGrid = temp;
}

/**
 * Update all enabled and running regions
 */
function updateAllRegions() {
  for (let regionName in regions) {
    if (regions[regionName].enabled && regions[regionName].running) {
      updateRegion(regionName);
    }
  }
}

/**
 * Update all enabled regions (ignores running state - used for step)
 */
function updateAllRegionsForce() {
  for (let regionName in regions) {
    if (regions[regionName].enabled) {
      updateRegion(regionName);
    }
  }
}

/**
 * Get kernel based on type
 */
function getKernel(type) {
  const kernels = {
    point: [
      [0, 0, 0],
      [0, 1, 0],
      [0, 0, 0],
    ],
    moore: [
      [1, 1, 1],
      [1, 0, 1],
      [1, 1, 1],
    ],
    vonNeumann: [
      [0, 1, 0],
      [1, 0, 1],
      [0, 1, 0],
    ],
    cross: [
      [0, 1, 0],
      [1, 1, 1],
      [0, 1, 0],
    ],
    custom: [
      [1, 1, 1, 1, 1],
      [1, 2, 2, 2, 1],
      [1, 2, 0, 2, 1],
      [1, 2, 2, 2, 1],
      [1, 1, 1, 1, 1],
    ],
  };

  return kernels[type] || kernels.custom;
}

/**
 * Convert hex color to RGB
 */
function hexToRgb(hex) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : { r: 0, g: 0, b: 0 };
}

/**
 * Handle window resize
 */
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  redraw();
}
