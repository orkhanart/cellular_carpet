// Configuration and Constants

// Canvas settings
const CONFIG = {
  gRez: 2,
  gWidth: 1144,
  gHeight: 1600,
};

// Color palettes
const COLORS = {
  paletteProbabilities: [5, 5, 5, 5, 1, 5, 1],

  backgrounds: [
    "#0D1131",
    "#29221F",
    "#2F1433",
    "#172729",
    "#C4C8E2",
    "#000000",
    "#FFFFFF"
  ],

  borders: [
    ["#1BA887", "#1B22A8", "#911BA8", "#A81B2E", "#A8721B"],
    ["#6c698d", "#d4d2d5", "#bfafa6", "#aa968a", "#6e6a6f"],
    ["#00916e", "#feefe5", "#ffcf00", "#ee6123", "#fa003f"],
    ["#f1e0c5", "#c9b79c", "#71816d", "#342a21", "#da667b"],
    ["#8f0543", "#3c0560", "#1e0654", "#0e2692", "#0c7798"],
    ["#878787", "#373737", "#a0a0a0", "#515151", "#868686"],
    ["#747474", "#000000", "#3c3c3c", "#5d5d5d", "#000000"]
  ],

  fields: [
    [
      "#CC4E8A", "#CC854E", "#A1CC4E", "#4ECC50", "#4EC7CC",
      "#5284A3", "#7D52A3", "#A35294", "#A35C52", "#9CA352"
    ],
    ["#3c91e6", "#342e37", "#a2d729", "#fafffd", "#fa824c"],
    ["#820263", "#d90368", "#eadeda", "#2e294e", "#ffd400"],
    ["#0d3b66", "#faf0ca", "#f4d35e", "#ee964b", "#f95738"],
    ["#0a080a", "#0f252a", "#85880d", "#7b3509", "#15060e"],
    ["#c6c6c6", "#ebebeb", "#c4c4c4", "#797979", "#525252"],
    ["#000000", "#4c4c4c", "#666666", "#000000", "#4c4c4c"]
  ]
};

// Interpolation patterns
const INTERPOLATION = {
  patterns: [
    [1],
    [1, 0, 1],
    [0, 1, 1, 0, 0],
    [1, 0, 0, 1, 1, 0],
    [0, 1, 1, 0, 0, 1, 1],
    [0, 0, 1, 1, 0, 0, 0, 0, 1],
  ],
  probabilities: [1, 1, 1, 1, 1, 1]
};

// Border configuration
const BORDER_CONFIG = {
  thicknesses: [40, 60, 80, 100, 120],
  thicknessProbabilities: [20, 50, 20, 10, 1],

  placements: [0.05, 0.2, 0.4, 0.6, 0.8, 0.95],
  placementProbabilities: [5, 10, 50, 50, 20, 5],

  staggers: [0, 0.5, 1],
  staggerProbabilities: [10, 10, 10],

  counts: [2, 3, 4, 5, 6],
  countProbabilities: [1, 1, 1, 1, 1],

  progressions: [
    [[70, 90], [91, 110], [111, 130]],
    [[40, 60], [61, 80], [81, 100]],
    [[50, 70], [71, 90], [91, 110]],
    [[30, 50], [51, 70], [71, 90]],
    [[25, 45], [46, 65], [66, 85]],
  ],
  progressionProbabilities: [1, 1, 1],

  subBorderThicknesses: [10, 15, 20, 25],
  subBorder1Probabilities: [1, 1, 1, 1],
  subBorder2Probabilities: [1, 1, 1, 1]
};

// Field configuration
const FIELD_CONFIG = {
  counts: [2, 3, 4, 5, 6, 7, 8, 9, 10],
  countProbabilities: [1, 1, 1, 1, 1, 1, 1, 1, 1],

  progressions: [
    [[120, 150], [151, 180], [181, 210], [211, 240]],
    [[110, 140], [141, 170], [171, 200], [201, 230]],
    [[100, 125], [126, 155], [156, 180], [181, 210]],
    [[80, 110], [111, 140], [141, 170], [171, 200]],
    [[70, 100], [101, 130], [131, 160], [161, 190]],
    [[60, 90], [91, 120], [121, 150], [151, 180]],
    [[60, 85], [86, 110], [111, 135], [136, 160]],
    [[60, 80], [81, 105], [106, 125], [126, 150]],
    [[60, 80], [81, 105], [106, 125], [126, 150]],
  ],
  progressionProbabilities: [1, 1, 1, 1]
};

// Cellular Automaton Rules
const CA_RULES = {
  life: { birth: [3], survive: [2, 3] },
  highLife: { birth: [3, 6], survive: [2, 3] },
  dayNight: { birth: [3, 6, 7, 8], survive: [3, 4, 6, 7, 8] },
  seeds: { birth: [2], survive: [] },
  border: { birth: [3, 4], survive: [2, 3, 4] },
  maze: { birth: [3], survive: [1, 2, 3, 4, 5] },
  mazectric: { birth: [3], survive: [1, 2, 3, 4] },
  coral: { birth: [3], survive: [4, 5, 6, 7, 8] }
};
