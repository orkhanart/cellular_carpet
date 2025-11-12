// Cellular Automaton Class

/**
 * Cellular Automaton system with configurable rules
 */
class CellularAutomaton {
  /**
   * Create a cellular automaton
   * @param {number} rez - Cell resolution
   * @param {number} wid - Width in pixels
   * @param {number} hei - Height in pixels
   * @param {boolean} bMode - Border mode (fills interior if true)
   * @param {number} bWid - Border width in cells
   * @param {Array} spnX - Spawn X coordinates
   * @param {Array} spnY - Spawn Y coordinates
   * @param {Array} cols - Color palette
   * @param {Array} vizs - Visibility pattern
   * @param {Object} rule - CA rule {birth: [], survive: []}
   */
  constructor(rez, wid, hei, bMode, bWid, spnX, spnY, cols, vizs, rule) {
    this.rez = rez;
    this.diffx = (CONFIG.gWidth - wid) / 2;
    this.diffy = (CONFIG.gHeight - hei) / 2;
    this.cols = Math.round(wid / this.rez);
    this.rows = Math.round(hei / this.rez);
    this.cl = cols[0];
    this.viz = vizs[0];

    // Cellular automaton grids
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

    // CA rule (default: Conway's Life)
    this.rule = rule || CA_RULES.life;
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
        if (this.currentGen[i][j] === 1) {
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
   * Compute next generation using CA rules
   */
  compute() {
    // Update color and visibility for new generation
    this.cl = this.colors[this.colCounter % this.colCount];
    this.viz = this.vizs[this.colCounter % this.vizCount];

    // Apply cellular automaton rules to all cells
    for (let x = 1; x < this.cols - 1; x++) {
      for (let y = 1; y < this.rows - 1; y++) {
        this._applyRuleToCell(x, y);
      }
    }

    this.colCounter++;
  }

  /**
   * Apply CA rule to a single cell
   * @private
   * @param {number} x - Cell X coordinate
   * @param {number} y - Cell Y coordinate
   */
  _applyRuleToCell(x, y) {
    const neighbors = this._countNeighbors(x, y);
    const isAlive = this.currentGen[x][y] === 1;

    if (isAlive) {
      // Cell is alive - check survive conditions
      if (this.rule.survive.includes(neighbors)) {
        this.nextGen[x][y] = 1;
        // Keep existing color and viz
      } else {
        this.nextGen[x][y] = 0;
      }
    } else {
      // Cell is dead - check birth conditions
      if (this.rule.birth.includes(neighbors)) {
        this.nextGen[x][y] = 1;
        this.cellColors[x][y] = this.cl;
        this.cellViz[x][y] = this.viz;
      } else {
        this.nextGen[x][y] = 0;
      }
    }
  }

  /**
   * Count living neighbors (Moore neighborhood - 8 cells)
   * @private
   * @param {number} x - Cell X coordinate
   * @param {number} y - Cell Y coordinate
   * @returns {number} Number of living neighbors
   */
  _countNeighbors(x, y) {
    let neighbors = 0;
    for (let i = -1; i <= 1; i++) {
      for (let j = -1; j <= 1; j++) {
        if (i === 0 && j === 0) continue;
        if (this.currentGen[x + i][y + j] === 1) neighbors++;
      }
    }
    return neighbors;
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
    let aliveCells = 0;
    for (let i = 0; i < this.cols; i++) {
      for (let j = 0; j < this.rows; j++) {
        if (this.currentGen[i][j] === 1) aliveCells++;
      }
    }
    return `Generation: ${this.colCounter}, Alive: ${aliveCells}`;
  }
}
