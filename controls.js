// UI Controls for Region-based Protofield Cellular Automaton

// Control Panel State
let controlsInitialized = false;
let iterationsCount = 0;
let stepsPerFrame = 1;
let isRunning = false;
let animationId = null;
let targetFrameRate = 10;
let lastFrameTime = 0;

/**
 * Initialize UI controls after page load
 */
function initializeControls() {
  if (controlsInitialized) return;
  controlsInitialized = true;

  // Panel toggle - starts open by default
  const closeBtn = document.getElementById("closePanel");
  const panel = document.getElementById("controlPanel");

  // Panel starts open (no .closed class)

  closeBtn.addEventListener("click", () => {
    panel.classList.add("closed");
  });

  // Playback controls
  document.getElementById("startBtn").addEventListener("click", startAnimation);
  document.getElementById("stopBtn").addEventListener("click", stopAnimation);
  document
    .getElementById("resetBtn")
    .addEventListener("click", resetSimulation);
  document.getElementById("stepBtn").addEventListener("click", stepSimulation);

  document.getElementById("stepsPerFrame").addEventListener("change", (e) => {
    stepsPerFrame = parseInt(e.target.value);
  });

  document.getElementById("frameRate").addEventListener("change", (e) => {
    targetFrameRate = parseInt(e.target.value);
  });

  // Global configuration
  document
    .getElementById("canvasSize")
    .addEventListener("change", handleCanvasSizeChange);
  document
    .getElementById("cellSize")
    .addEventListener("change", handleCellSizeChange);

  // Region B0 controls
  document.getElementById("b0StartBtn").addEventListener("click", () => {
    startRegion("b0");
  });
  document.getElementById("b0StopBtn").addEventListener("click", () => {
    stopRegion("b0");
  });
  document.getElementById("b0StepBtn").addEventListener("click", () => {
    stepRegion("b0");
  });
  document.getElementById("b0ResetBtn").addEventListener("click", () => {
    resetRegion("b0");
  });
  document.getElementById("b0Enabled").addEventListener("change", (e) => {
    regions.b0.enabled = e.target.checked;
    redraw();
  });
  document.getElementById("b0Thickness").addEventListener("change", (e) => {
    regions.b0.thickness = parseInt(e.target.value);
    resetSimulation();
  });
  document.getElementById("b0SeedPoints").addEventListener("change", (e) => {
    regionParams.b0.seedPointsPerSide = parseInt(e.target.value);
    resetRegion("b0");
  });
  document.getElementById("b0Modulus").addEventListener("change", (e) => {
    regionParams.b0.modulus = parseInt(e.target.value);
  });
  document.getElementById("b0Kernel").addEventListener("change", (e) => {
    regionParams.b0.kernelType = e.target.value;
  });
  document.getElementById("b0Color").addEventListener("change", (e) => {
    regionParams.b0.color = e.target.value;
    redraw();
  });
  document.getElementById("b0MinThreshold").addEventListener("input", (e) => {
    regionParams.b0.minThreshold = parseInt(e.target.value);
    document.getElementById("b0MinThresholdValue").textContent = e.target.value;
    redraw();
  });
  document.getElementById("b0MaxThreshold").addEventListener("input", (e) => {
    regionParams.b0.maxThreshold = parseInt(e.target.value);
    document.getElementById("b0MaxThresholdValue").textContent = e.target.value;
    redraw();
  });

  // Region B1 controls
  document.getElementById("b1StartBtn").addEventListener("click", () => {
    startRegion("b1");
  });
  document.getElementById("b1StopBtn").addEventListener("click", () => {
    stopRegion("b1");
  });
  document.getElementById("b1StepBtn").addEventListener("click", () => {
    stepRegion("b1");
  });
  document.getElementById("b1ResetBtn").addEventListener("click", () => {
    resetRegion("b1");
  });
  document.getElementById("b1Enabled").addEventListener("change", (e) => {
    regions.b1.enabled = e.target.checked;
    redraw();
  });
  document.getElementById("b1Thickness").addEventListener("change", (e) => {
    regions.b1.thickness = parseInt(e.target.value);
    resetSimulation();
  });
  document.getElementById("b1SeedPoints").addEventListener("change", (e) => {
    regionParams.b1.seedPointsPerSide = parseInt(e.target.value);
    resetRegion("b1");
  });
  document.getElementById("b1Modulus").addEventListener("change", (e) => {
    regionParams.b1.modulus = parseInt(e.target.value);
  });
  document.getElementById("b1Kernel").addEventListener("change", (e) => {
    regionParams.b1.kernelType = e.target.value;
  });
  document.getElementById("b1Color").addEventListener("change", (e) => {
    regionParams.b1.color = e.target.value;
    redraw();
  });
  document.getElementById("b1MinThreshold").addEventListener("input", (e) => {
    regionParams.b1.minThreshold = parseInt(e.target.value);
    document.getElementById("b1MinThresholdValue").textContent = e.target.value;
    redraw();
  });
  document.getElementById("b1MaxThreshold").addEventListener("input", (e) => {
    regionParams.b1.maxThreshold = parseInt(e.target.value);
    document.getElementById("b1MaxThresholdValue").textContent = e.target.value;
    redraw();
  });

  // Region B2 controls
  document.getElementById("b2StartBtn").addEventListener("click", () => {
    startRegion("b2");
  });
  document.getElementById("b2StopBtn").addEventListener("click", () => {
    stopRegion("b2");
  });
  document.getElementById("b2StepBtn").addEventListener("click", () => {
    stepRegion("b2");
  });
  document.getElementById("b2ResetBtn").addEventListener("click", () => {
    resetRegion("b2");
  });
  document.getElementById("b2Enabled").addEventListener("change", (e) => {
    regions.b2.enabled = e.target.checked;
    redraw();
  });
  document.getElementById("b2Thickness").addEventListener("change", (e) => {
    regions.b2.thickness = parseInt(e.target.value);
    resetSimulation();
  });
  document.getElementById("b2SeedPoints").addEventListener("change", (e) => {
    regionParams.b2.seedPointsPerSide = parseInt(e.target.value);
    resetRegion("b2");
  });
  document.getElementById("b2Modulus").addEventListener("change", (e) => {
    regionParams.b2.modulus = parseInt(e.target.value);
  });
  document.getElementById("b2Kernel").addEventListener("change", (e) => {
    regionParams.b2.kernelType = e.target.value;
  });
  document.getElementById("b2Color").addEventListener("change", (e) => {
    regionParams.b2.color = e.target.value;
    redraw();
  });
  document.getElementById("b2MinThreshold").addEventListener("input", (e) => {
    regionParams.b2.minThreshold = parseInt(e.target.value);
    document.getElementById("b2MinThresholdValue").textContent = e.target.value;
    redraw();
  });
  document.getElementById("b2MaxThreshold").addEventListener("input", (e) => {
    regionParams.b2.maxThreshold = parseInt(e.target.value);
    document.getElementById("b2MaxThresholdValue").textContent = e.target.value;
    redraw();
  });

  // Region F0 controls
  document.getElementById("f0StartBtn").addEventListener("click", () => {
    startRegion("f0");
  });
  document.getElementById("f0StopBtn").addEventListener("click", () => {
    stopRegion("f0");
  });
  document.getElementById("f0StepBtn").addEventListener("click", () => {
    stepRegion("f0");
  });
  document.getElementById("f0ResetBtn").addEventListener("click", () => {
    resetRegion("f0");
  });
  document.getElementById("f0Enabled").addEventListener("change", (e) => {
    regions.f0.enabled = e.target.checked;
    redraw();
  });
  document.getElementById("f0SeedPoints").addEventListener("change", (e) => {
    regionParams.f0.seedPoints = parseInt(e.target.value);
    resetRegion("f0");
  });
  document.getElementById("f0Modulus").addEventListener("change", (e) => {
    regionParams.f0.modulus = parseInt(e.target.value);
  });
  document.getElementById("f0Kernel").addEventListener("change", (e) => {
    regionParams.f0.kernelType = e.target.value;
  });
  document.getElementById("f0Color").addEventListener("change", (e) => {
    regionParams.f0.color = e.target.value;
    redraw();
  });
  document.getElementById("f0MinThreshold").addEventListener("input", (e) => {
    regionParams.f0.minThreshold = parseInt(e.target.value);
    document.getElementById("f0MinThresholdValue").textContent = e.target.value;
    redraw();
  });
  document.getElementById("f0MaxThreshold").addEventListener("input", (e) => {
    regionParams.f0.maxThreshold = parseInt(e.target.value);
    document.getElementById("f0MaxThresholdValue").textContent = e.target.value;
    redraw();
  });

  // Initialize button states
  updateRegionButtons();

  console.log("Controls initialized");
}

/**
 * Start animation loop
 */
function startAnimation() {
  if (isRunning) return;
  isRunning = true;
  // Start all regions
  for (let regionName in regions) {
    regions[regionName].running = true;
  }
  updateRegionButtons();
  animate();
}

/**
 * Stop animation loop
 */
function stopAnimation() {
  isRunning = false;
  // Stop all regions
  for (let regionName in regions) {
    regions[regionName].running = false;
  }
  updateRegionButtons();
  if (animationId) {
    cancelAnimationFrame(animationId);
    animationId = null;
  }
}

/**
 * Reset simulation to initial state
 */
function resetSimulation() {
  stopAnimation();
  iterationsCount = 0;
  document.getElementById("iterationsCount").value = iterationsCount;

  calculateRegionDimensions();
  initializeAllRegions();
  redraw();
}

/**
 * Perform single step for all regions
 */
function stepSimulation() {
  updateAllRegionsForce();
  iterationsCount++;
  document.getElementById("iterationsCount").value = iterationsCount;
  redraw();
}

/**
 * Start a single region
 */
function startRegion(regionName) {
  regions[regionName].running = true;
  updateRegionButtons();
  // If not globally running, start animation loop
  if (!isRunning) {
    isRunning = true;
    animate();
  }
}

/**
 * Stop a single region
 */
function stopRegion(regionName) {
  regions[regionName].running = false;
  updateRegionButtons();
  // Check if any regions are still running
  let anyRunning = false;
  for (let rName in regions) {
    if (regions[rName].running) {
      anyRunning = true;
      break;
    }
  }
  // If no regions running, stop global animation
  if (!anyRunning) {
    isRunning = false;
    if (animationId) {
      cancelAnimationFrame(animationId);
      animationId = null;
    }
  }
}

/**
 * Step a single region
 */
function stepRegion(regionName) {
  if (regions[regionName].enabled) {
    updateRegion(regionName);
    iterationsCount++;
    document.getElementById("iterationsCount").value = iterationsCount;
    redraw();
  }
}

/**
 * Reset a single region
 */
function resetRegion(regionName) {
  // Stop the region if running
  regions[regionName].running = false;

  // Reinitialize just this region
  initializeRegion(regionName);

  // Update button states
  updateRegionButtons();

  // Redraw
  redraw();
}

/**
 * Update button states for all regions
 */
function updateRegionButtons() {
  for (let regionName in regions) {
    const startBtn = document.getElementById(`${regionName}StartBtn`);
    const stopBtn = document.getElementById(`${regionName}StopBtn`);
    if (startBtn && stopBtn) {
      if (regions[regionName].running) {
        startBtn.disabled = true;
        stopBtn.disabled = false;
      } else {
        startBtn.disabled = false;
        stopBtn.disabled = true;
      }
    }
  }
}

/**
 * Animation loop with frame rate limiting
 */
function animate() {
  if (!isRunning) return;

  const currentTime = Date.now();
  const frameDelay = 1000 / targetFrameRate; // milliseconds per frame

  if (currentTime - lastFrameTime >= frameDelay) {
    // Update CA
    for (let i = 0; i < stepsPerFrame; i++) {
      updateAllRegions();
      iterationsCount++;
    }

    document.getElementById("iterationsCount").value = iterationsCount;
    redraw();

    lastFrameTime = currentTime;
  }

  animationId = requestAnimationFrame(animate);
}

/**
 * Handle canvas size change
 */
function handleCanvasSizeChange(e) {
  const [w, h] = e.target.value.split("x").map(Number);
  canvasWidth = w;
  canvasHeight = h;
  resetSimulation();
}

/**
 * Handle cell size change
 */
function handleCellSizeChange(e) {
  cellSize = parseInt(e.target.value);
  resetSimulation();
}

// Initialize controls when DOM is ready
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initializeControls);
} else {
  initializeControls();
}
