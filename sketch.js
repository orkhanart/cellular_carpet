// Main Sketch - Protofield Cellular Automaton

// Initialize token data
let tokenData = genTokenData(123);
console.log("Token Data:", tokenData);

// Initialize random number generator
let R;

// Canvas and rendering
let canvas;
let canvasWid, canvasHei;
let myScaledCanvas;
let currentScale = 1;

// Image saving modes
let imgSaveMode = false;
let twitterHead = false;

// Generation counter
let counter = 0;

// Cellular Automaton instances
let b0, b1, b2, f0;

// Runtime variables
const vars = { tokenData };

/**
 * p5.js setup function
 */
function setup() {
  pixelDensity(1);

  // Calculate canvas dimensions to fit window
  let w = window.innerWidth;
  let h = Math.floor((CONFIG.gHeight / CONFIG.gWidth) * window.innerWidth);

  if (h > window.innerHeight) {
    h = window.innerHeight;
    w = Math.floor((CONFIG.gWidth / CONFIG.gHeight) * window.innerHeight);
  }

  canvas = createCanvas(w, h);
  canvasWid = canvas.width;
  canvasHei = canvas.height;
  currentScale = canvas.width / CONFIG.gWidth;

  noStroke();

  // Initialize system
  R = new Random(tokenData);
  randomize();
  initializeAll();
  canvasInit();
}

/**
 * p5.js draw loop
 */
function draw() {
  myScaledCanvas.push();
  myScaledCanvas.scale(currentScale);

  // Update border 0
  if (counter <= vars.b0Frames) {
    b0.initialize();
    b0.symmetricShow(myScaledCanvas);
    b0.compute();
    b0.dump();
  }

  // Update border 1
  if (counter <= vars.b1Frames) {
    b1.initialize();
    b1.symmetricShow(myScaledCanvas);
    b1.compute();
    b1.dump();
  }

  // Update border 2
  if (counter <= vars.b2Frames) {
    b2.initialize();
    b2.symmetricShow(myScaledCanvas);
    b2.compute();
    b2.dump();
  }

  // Update field
  if (counter <= vars.f0Frames) {
    f0.initialize();
    f0.symmetricShow(myScaledCanvas);
    f0.compute();
    f0.dump();
  }

  myScaledCanvas.pop();

  // Handle image saving mode
  if (imgSaveMode) {
    fill(255);
    textSize(100);
    text("Saving Image....", 10, canvas.height / 2);
  } else {
    image(myScaledCanvas, 0, 0);
  }

  // Check if animation is complete
  if (counter > vars.totalFrames) {
    if (imgSaveMode) {
      save(myScaledCanvas, tokenData.hash + "_hires", "png");
      image(myScaledCanvas, 0, 0, canvas.width, canvas.height);
      twitterHead = false;
      imgSaveMode = false;
      currentScale = canvas.width / CONFIG.gWidth;
      noLoop();
    } else {
      noLoop();
    }
  }

  counter++;
}

/**
 * Handle keyboard input
 */
function keyPressed() {
  if (key == "r") reLoop();
  if (key == "h") saveImageRes(1716);
  if (key == "j") saveImageRes(3432);
}

/**
 * Randomize all generation parameters
 */
function randomize() {
  vars.totalFrames = 240;

  // Border 0 (outer thin border)
  vars.b0Frames = 240;
  vars.b0Width = CONFIG.gWidth;
  vars.b0Height = CONFIG.gHeight;
  vars.b0Thick = wtRandom(
    BORDER_CONFIG.subBorderThicknesses,
    BORDER_CONFIG.subBorder1Probabilities,
    R
  )[0];
  vars.b0Offset = 2;
  vars.b0SpawnX = [
    vars.b0Offset,
    Math.round(vars.b0Width / CONFIG.gRez) / 2,
    vars.b0Offset,
  ];
  vars.b0SpawnY = [
    vars.b0Offset,
    vars.b0Offset,
    Math.round(vars.b0Height / CONFIG.gRez) / 2,
  ];

  // Border 1 (main border)
  vars.b1Width = vars.b0Width - vars.b0Thick * CONFIG.gRez * 2;
  vars.b1Height = vars.b0Height - vars.b0Thick * CONFIG.gRez * 2;
  vars.b1Thick = wtRandom(
    BORDER_CONFIG.thicknesses,
    BORDER_CONFIG.thicknessProbabilities,
    R
  )[0];
  vars.b1Offset = Math.floor(
    vars.b1Thick *
      wtRandom(BORDER_CONFIG.placements, BORDER_CONFIG.placementProbabilities, R)[0]
  );

  const b1Cols = Math.round(vars.b1Width / CONFIG.gRez);
  const b1Rows = Math.round(vars.b1Height / CONFIG.gRez);
  vars.b1SpawnX = [vars.b1Offset, b1Cols / 2, vars.b1Offset];
  vars.b1SpawnY = [vars.b1Offset, vars.b1Offset, b1Rows / 2];

  const b1Cnt = wtRandom(BORDER_CONFIG.counts, BORDER_CONFIG.countProbabilities, R);
  const b1CntX = b1Cnt[0];
  const bFr = wtRandom(
    BORDER_CONFIG.progressions[b1Cnt[1]],
    BORDER_CONFIG.progressionProbabilities,
    R
  )[0];
  vars.b1Frames = R.r_int(bFr[0], bFr[1]);

  const b1StepX = (b1Cols / 2 - vars.b1Offset) / b1CntX;
  vars.b1Stgr = wtRandom(BORDER_CONFIG.staggers, BORDER_CONFIG.staggerProbabilities, R)[0];

  for (let i = 1; i < b1CntX; i++) {
    vars.b1SpawnX.push(Math.round(vars.b1Offset + b1StepX * i));
    vars.b1SpawnY.push(
      vars.b1Offset +
        Math.floor(
          R.r_int(-vars.b1Offset + 1, vars.b1Thick - vars.b1Offset) * vars.b1Stgr
        )
    );
  }

  const b1CntY = Math.floor((CONFIG.gHeight / CONFIG.gWidth) * b1CntX);
  const b1StepY = (b1Rows / 2 - vars.b1Offset) / b1CntY;

  for (let i = 1; i < b1CntY; i++) {
    vars.b1SpawnX.push(
      vars.b1Offset +
        Math.floor(
          R.r_int(-vars.b1Offset + 1, vars.b1Thick - vars.b1Offset) * vars.b1Stgr
        )
    );
    vars.b1SpawnY.push(Math.round(vars.b1Offset + b1StepY * i));
  }

  vars.b1Intr = wtRandom(INTERPOLATION.patterns, INTERPOLATION.probabilities, R)[0];

  // Border 2 (inner thin border)
  vars.b2Frames = 240;
  vars.b2Width = vars.b1Width - vars.b1Thick * CONFIG.gRez * 2;
  vars.b2Height = vars.b1Height - vars.b1Thick * CONFIG.gRez * 2;
  vars.b2Thick = wtRandom(
    BORDER_CONFIG.subBorderThicknesses,
    BORDER_CONFIG.subBorder2Probabilities,
    R
  )[0];
  vars.b2Offset = 2;
  vars.b2SpawnX = [
    vars.b2Offset,
    Math.round(vars.b2Width / CONFIG.gRez) / 2,
    vars.b2Offset,
  ];
  vars.b2SpawnY = [
    vars.b2Offset,
    vars.b2Offset,
    Math.round(vars.b2Height / CONFIG.gRez) / 2,
  ];

  // Field (main cellular automaton)
  vars.totalBorderThick = vars.b0Thick + vars.b1Thick + vars.b2Thick;

  const f0Cnt = wtRandom(FIELD_CONFIG.counts, FIELD_CONFIG.countProbabilities, R);
  vars.f0SpawnCount = f0Cnt[0];

  const fFr = wtRandom(
    FIELD_CONFIG.progressions[f0Cnt[1]],
    FIELD_CONFIG.progressionProbabilities,
    R
  )[0];
  vars.f0Frames = R.r_int(fFr[0], fFr[1]);

  vars.f0Width = CONFIG.gWidth - vars.totalBorderThick * CONFIG.gRez * 2;
  vars.f0Height = CONFIG.gHeight - vars.totalBorderThick * CONFIG.gRez * 2;
  vars.f0SpawnX = [];
  vars.f0SpawnY = [];

  const f0Cols = Math.round(vars.f0Width / CONFIG.gRez);
  const f0Rows = Math.round(vars.f0Height / CONFIG.gRez);

  // Center spawn point
  vars.f0SpawnX.push(f0Cols / 2);
  vars.f0SpawnY.push(f0Rows / 2);

  // Additional random spawn points
  while (vars.f0SpawnX.length < vars.f0SpawnCount) {
    const x = R.r_int(3, f0Cols / 2 - 11);
    const y = R.r_int(3, f0Rows / 2 - 11);
    let sum = 0;

    for (let i = 0; i < vars.f0SpawnX.length; i++) {
      if (dist(x, y, vars.f0SpawnX[i], vars.f0SpawnY[i]) < 40) sum++;
    }

    if (sum == 0) {
      vars.f0SpawnX.push(x);
      vars.f0SpawnY.push(y);
    }
  }

  vars.f0Intr = wtRandom(INTERPOLATION.patterns, INTERPOLATION.probabilities, R)[0];

  // Select color palette
  const colI = wtRandom(COLORS.backgrounds, COLORS.paletteProbabilities, R)[1];
  vars.bCol = COLORS.backgrounds[colI];
  vars.brdCol = COLORS.borders[colI];
  vars.fldCol = COLORS.fields[colI];

  console.log("Border Count:", b1CntX, "Frames:", vars.b1Frames);
  console.log("Field Spawns:", vars.f0SpawnCount, "Frames:", vars.f0Frames);
}

/**
 * Initialize all cellular automaton instances
 */
function initializeAll() {
  b0 = new CellularAutomaton(
    CONFIG.gRez,
    vars.b0Width,
    vars.b0Height,
    true,
    vars.b0Thick,
    vars.b0SpawnX,
    vars.b0SpawnY,
    vars.fldCol,
    [1],
    CA_RULES.border
  );

  b1 = new CellularAutomaton(
    CONFIG.gRez,
    vars.b1Width,
    vars.b1Height,
    true,
    vars.b1Thick,
    vars.b1SpawnX,
    vars.b1SpawnY,
    vars.brdCol,
    vars.b1Intr,
    CA_RULES.highLife
  );

  b2 = new CellularAutomaton(
    CONFIG.gRez,
    vars.b2Width,
    vars.b2Height,
    true,
    vars.b2Thick,
    vars.b2SpawnX,
    vars.b2SpawnY,
    vars.brdCol,
    [1],
    CA_RULES.border
  );

  f0 = new CellularAutomaton(
    CONFIG.gRez,
    vars.f0Width,
    vars.f0Height,
    false,
    0,
    vars.f0SpawnX,
    vars.f0SpawnY,
    vars.fldCol,
    vars.f0Intr,
    CA_RULES.life
  );
}

/**
 * Restart animation loop
 */
function reLoop() {
  initializeAll();
  canvasInit();
  counter = 0;
  loop();
  background(vars.bCol);
}

/**
 * Initialize canvas graphics buffer
 */
function canvasInit() {
  myScaledCanvas = createGraphics(
    CONFIG.gWidth * currentScale,
    CONFIG.gHeight * currentScale
  );
  myScaledCanvas.clear();
  myScaledCanvas.push();
  myScaledCanvas.scale(currentScale);
  myScaledCanvas.background(vars.bCol);
  myScaledCanvas.pop();
}

/**
 * Save image at specified resolution
 * @param {number} resW - Desired width in pixels
 */
function saveImageRes(resW) {
  imgSaveMode = true;
  currentScale = resW / CONFIG.gWidth;
  reLoop();
}
