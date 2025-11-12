// Protofield Cellular Automaton Class

/**
 * Protofield Cellular Automaton system using kernel convolution and modular arithmetic
 */
class CellularAutomaton {
  /**
   * Create a protofield cellular automaton
   * @param {number} rez - Cell resolution
   * @param {number} wid - Width in pixels
   * @param {number} hei - Height in pixels
   * @param {boolean} bMode - Border mode (fills interior if true)
   * @param {number} bWid - Border width in cells
   * @param {Array} spnX - Spawn X coordinates
   * @param {Array} spnY - Spawn Y coordinates
   * @param {Array} cols - Color palette
   * @param {Array} vizs - Visibility pattern
   * @param {Object} rule - CA rule (used for kernel selection)
   */
  constructor(rez, wid, hei, bMode, bWid, spnX, spnY, cols, vizs, rule) {
    this.rez = rez;
    this.diffx = (CONFIG.gWidth - wid) / 2;
    this.diffy = (CONFIG.gHeight - hei) / 2;
    this.cols = Math.round(wid / this.rez);
    this.rows = Math.round(hei / this.rez);
    this.cl = cols[0];
    this.viz = vizs[0];

    // Debug: Log grid dimensions
    console.log(
      `CA Grid: ${this.cols} × ${this.rows} = ${
        this.cols * this.rows
      } cells (${wid}×${hei}px @ ${rez}px/cell)`
    );

    // Protofield grids - store modular values (0 to modulus-1)
    this.currentGen = make2Darray(this.cols, this.rows);
    this.nextGen = make2Darray(this.cols, this.rows);
    this.cellColors = make2Darray(this.cols, this.rows);
    this.cellViz = make2Darray(this.cols, this.rows);

    this.showList = [];

    // Initialize spawn points
    this.spnX = spnX;
    this.spnY = spnY;
    this._initializeSpawnPoints();

    // Border mode fills interior
    if (bMode) {
      this._fillInterior(bWid);
    }

    this.colCount = cols.length;
    this.colors = cols;
    this.colCounter = 0;
    this.vizCount = vizs.length;
    this.vizs = vizs;

    // Protofield parameters
    this.rule = rule || CA_RULES.life;
    this.modulus = this._getModulusForRule(rule);
    this.kernel = this._getKernelForRule(rule);
    this.kernelSize = this.kernel.length;
    this.kernelRadius = Math.floor(this.kernelSize / 2);
  }

  /**
   * Get modulus based on rule type
   * @private
   * @param {Object} rule - CA rule
   * @returns {number} Modulus value
   */
  _getModulusForRule(rule) {
    // Map different rules to different moduli
    if (rule === CA_RULES.life) return 5;
    if (rule === CA_RULES.highLife) return 7;
    if (rule === CA_RULES.border) return 3;
    return 5; // Default
  }

  /**
   * Get kernel based on rule type
   * @private
   * @param {Object} rule - CA rule
   * @returns {Array} 2D kernel array
   */
  _getKernelForRule(rule) {
    // Custom kernel (5x5 with weighted center)
    const customKernel = [
      [1, 1, 1, 1, 1],
      [1, 2, 2, 2, 1],
      [1, 2, 0, 2, 1],
      [1, 2, 2, 2, 1],
      [1, 1, 1, 1, 1],
    ];

    // Moore neighborhood (3x3)
    const mooreKernel = [
      [1, 1, 1],
      [1, 0, 1],
      [1, 1, 1],
    ];

    // Von Neumann (3x3)
    const vonNeumannKernel = [
      [0, 1, 0],
      [1, 0, 1],
      [0, 1, 0],
    ];

    // Map rules to kernels
    if (rule === CA_RULES.life || rule === CA_RULES.highLife)
      return customKernel;
    if (rule === CA_RULES.border) return mooreKernel;
    return customKernel; // Default
  }

  /**
   * Initialize spawn points
   * @private
   */
  _initializeSpawnPoints() {
    for (let i = 0; i < this.spnX.length; i++) {
      this.currentGen[this.spnX[i]][this.spnY[i]] = 1;
      this.cellColors[this.spnX[i]][this.spnY[i]] = this.cl;
      this.cellViz[this.spnX[i]][this.spnY[i]] = this.viz;
    }
  }

  /**
   * Fill interior cells for border mode
   * @private
   * @param {number} bWid - Border width
   */
  _fillInterior(bWid) {
    for (let i = bWid; i < this.cols - bWid; i++) {
      for (let j = bWid; j < this.rows - bWid; j++) {
        this.currentGen[i][j] = 1;
        this.cellColors[i][j] = this.cl;
        this.cellViz[i][j] = this.viz;
      }
    }
  }

  /**
   * Initialize show list from current generation
   */
  initialize() {
    this.showList = [];
    for (let i = 0; i < this.cols; i++) {
      for (let j = 0; j < this.rows; j++) {
        if (this.currentGen[i][j] > 0) {
          this.showList.push(
            new Cell(
              i,
              j,
              this.rez,
              this.diffx,
              this.diffy,
              this.cellColors[i][j],
              this.cellViz[i][j]
            )
          );
        }
      }
    }
  }

  /**
   * Render cells with 4-way symmetry
   * @param {p5.Graphics} pg - Graphics buffer
   */
  symmetricShow(pg) {
    // Filter to only show first quadrant
    this._filterQuadrant();

    // Create symmetric reflections
    const tempList = this._createReflections();

    // Render all cells
    for (let c of tempList) {
      c.show(pg);
    }
    for (let c of this.showList) {
      c.show(pg);
    }
  }

  /**
   * Filter cells to first quadrant only
   * @private
   */
  _filterQuadrant() {
    for (let i = this.showList.length - 1; i >= 0; i--) {
      let c = this.showList[i];
      if (c.x > this.cols / 2 || c.y > this.rows / 2) {
        this.showList.splice(i, 1);
      }
    }
  }

  /**
   * Create 3 symmetric reflections of each cell
   * @private
   * @returns {Array} Array of reflected cells
   */
  _createReflections() {
    const tempList = [];
    for (let i = 0; i < this.showList.length; i++) {
      const c = this.showList[i];

      // Right reflection
      tempList.push(
        new Cell(
          this.cols - c.x,
          c.y,
          this.rez,
          this.diffx,
          this.diffy,
          c.cl,
          c.viz
        )
      );

      // Bottom reflection
      tempList.push(
        new Cell(
          c.x,
          this.rows - c.y,
          this.rez,
          this.diffx,
          this.diffy,
          c.cl,
          c.viz
        )
      );

      // Diagonal reflection
      tempList.push(
        new Cell(
          this.cols - c.x,
          this.rows - c.y,
          this.rez,
          this.diffx,
          this.diffy,
          c.cl,
          c.viz
        )
      );
    }
    return tempList;
  }

  /**
   * Compute next generation using protofield convolution
   */
  compute() {
    // Update color and visibility for new generation
    this.cl = this.colors[this.colCounter % this.colCount];
    this.viz = this.vizs[this.colCounter % this.vizCount];

    // Apply protofield convolution to all cells
    for (let x = 0; x < this.cols; x++) {
      for (let y = 0; y < this.rows; y++) {
        this._applyConvolution(x, y);
      }
    }

    this.colCounter++;
  }

  /**
   * Apply kernel convolution with modular arithmetic to a single cell
   * @private
   * @param {number} x - Cell X coordinate
   * @param {number} y - Cell Y coordinate
   */
  _applyConvolution(x, y) {
    let sum = 0;

    // Apply convolution with kernel
    for (let i = -this.kernelRadius; i <= this.kernelRadius; i++) {
      for (let j = -this.kernelRadius; j <= this.kernelRadius; j++) {
        // Wrap around edges (toroidal topology)
        const nx = (x + i + this.cols) % this.cols;
        const ny = (y + j + this.rows) % this.rows;
        const ki = i + this.kernelRadius;
        const kj = j + this.kernelRadius;

        sum += this.currentGen[nx][ny] * this.kernel[ki][kj];
      }
    }

    // Apply modulus
    const newValue = sum % this.modulus;
    this.nextGen[x][y] = newValue;

    // Update color and visibility for newly activated cells
    if (newValue > 0 && this.currentGen[x][y] === 0) {
      this.cellColors[x][y] = this.cl;
      this.cellViz[x][y] = this.viz;
    }
  }

  /**
   * Swap current and next generation
   */
  dump() {
    // Swap generations
    let temp = this.currentGen;
    this.currentGen = this.nextGen;
    this.nextGen = temp;

    // Clear next generation
    for (let i = 0; i < this.cols; i++) {
      for (let j = 0; j < this.rows; j++) {
        this.nextGen[i][j] = 0;
      }
    }
  }

  /**
   * Get current state as a string (for debugging)
   * @returns {string}
   */
  getStateString() {
    let activeCells = 0;
    let totalValue = 0;
    for (let i = 0; i < this.cols; i++) {
      for (let j = 0; j < this.rows; j++) {
        if (this.currentGen[i][j] > 0) {
          activeCells++;
          totalValue += this.currentGen[i][j];
        }
      }
    }
    return `Generation: ${this.colCounter}, Active: ${activeCells}, Total Value: ${totalValue}`;
  }
}
