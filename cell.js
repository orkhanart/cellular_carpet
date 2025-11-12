// Cell Class

/**
 * Represents a single cell in the grid
 */
class Cell {
  /**
   * Create a cell
   * @param {number} x - X coordinate in grid
   * @param {number} y - Y coordinate in grid
   * @param {number} rez - Cell resolution (size)
   * @param {number} offsetx - X offset for rendering
   * @param {number} offsety - Y offset for rendering
   * @param {string} cl - Color value
   * @param {number} viz - Visibility (0 or 1)
   */
  constructor(x, y, rez, offsetx, offsety, cl, viz) {
    this.x = x;
    this.y = y;
    this.rez = rez;
    this.viz = viz;
    this.offsetx = offsetx;
    this.offsety = offsety;
    this.cl = cl;
  }

  /**
   * Render the cell on a graphics buffer
   * @param {p5.Graphics} pg - p5.js graphics buffer
   */
  show(pg) {
    if (this.viz === 1) {
      pg.push();
      pg.rectMode(CENTER);
      pg.noStroke();
      pg.fill(this.cl);
      pg.rect(
        this.x * this.rez + this.rez / 2 + this.offsetx,
        this.y * this.rez + this.rez / 2 + this.offsety,
        this.rez,
        this.rez
      );
      pg.pop();
    }
  }

  /**
   * Create a copy of this cell
   * @returns {Cell}
   */
  clone() {
    return new Cell(
      this.x,
      this.y,
      this.rez,
      this.offsetx,
      this.offsety,
      this.cl,
      this.viz
    );
  }

  /**
   * Check if this cell is at the same position as another
   * @param {Cell} other - Another cell
   * @returns {boolean}
   */
  equals(other) {
    return this.x === other.x && this.y === other.y;
  }
}
