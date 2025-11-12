// Utility Functions

/**
 * Generate token data for testing
 * @param {number} projectNum - Project number
 * @returns {Object} Token data with hash and tokenId
 */
function genTokenData(projectNum) {
  let data = {};
  let hash = "0x";
  for (let i = 0; i < 64; i++) {
    hash += Math.floor(Math.random() * 16).toString(16);
  }
  data.hash = hash;
  data.tokenId = (projectNum * 1000000 + Math.floor(Math.random() * 1000)).toString();
  return data;
}

/**
 * Seeded random number generator class
 */
class Random {
  constructor(tokenData) {
    this.useA = false;
    let sfc32 = function (uint128Hex) {
      let a = parseInt(uint128Hex.substr(0, 8), 16);
      let b = parseInt(uint128Hex.substr(8, 8), 16);
      let c = parseInt(uint128Hex.substr(16, 8), 16);
      let d = parseInt(uint128Hex.substr(24, 8), 16);
      return function () {
        a |= 0;
        b |= 0;
        c |= 0;
        d |= 0;
        let t = (((a + b) | 0) + d) | 0;
        d = (d + 1) | 0;
        a = b ^ (b >>> 9);
        b = (c + (c << 3)) | 0;
        c = (c << 21) | (c >>> 11);
        c = (c + t) | 0;
        return (t >>> 0) / 4294967296;
      };
    };
    this.prngA = new sfc32(tokenData.hash.substr(2, 32));
    this.prngB = new sfc32(tokenData.hash.substr(34, 32));
    for (let i = 0; i < 1e6; i += 2) {
      this.prngA();
      this.prngB();
    }
  }

  /**
   * Generate random decimal between 0 and 1
   * @returns {number}
   */
  r_dec() {
    this.useA = !this.useA;
    return this.useA ? this.prngA() : this.prngB();
  }

  /**
   * Generate random number between a and b
   * @param {number} a - Min value
   * @param {number} b - Max value
   * @returns {number}
   */
  r_num(a, b) {
    return a + (b - a) * this.r_dec();
  }

  /**
   * Generate random integer between a and b (inclusive)
   * @param {number} a - Min value
   * @param {number} b - Max value
   * @returns {number}
   */
  r_int(a, b) {
    return Math.floor(this.r_num(a, b + 1));
  }
}

/**
 * Weighted random selection
 * @param {Array} items - Array of items to choose from
 * @param {Array} weights - Array of weights corresponding to items
 * @param {Random} rng - Random number generator instance
 * @returns {Array} [selected item, index]
 */
function wtRandom(items, weights, rng) {
  let sum = 0;
  let cumulativeWeights = [];
  let index = 0;

  for (let i = 0; i < weights.length; i++) {
    sum += weights[i];
    cumulativeWeights.push(sum);
  }

  const r = rng.r_int(0, cumulativeWeights[cumulativeWeights.length - 1]);

  for (let i = 0; i < cumulativeWeights.length; i++) {
    if (cumulativeWeights[i] >= r) {
      index = i;
      break;
    }
  }

  return [items[index], index];
}

/**
 * Create a 2D array initialized with zeros
 * @param {number} cols - Number of columns
 * @param {number} rows - Number of rows
 * @returns {Array} 2D array
 */
function make2Darray(cols, rows) {
  let arr = new Array(cols);
  for (let i = 0; i < cols; i++) {
    arr[i] = new Array(rows);
  }
  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {
      arr[i][j] = 0;
    }
  }
  return arr;
}

/**
 * Shuffle array using Fisher-Yates algorithm (uses p5.js random())
 * @param {Array} array - Array to shuffle (will not modify original)
 * @returns {Array} Shuffled copy of array
 */
function shuffleArray(array) {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

/**
 * Calculate features for token (placeholder)
 * @param {Object} tokenData - Token data
 * @returns {Object} Features object
 */
function calculateFeatures(tokenData) {
  // Implement feature calculation logic here
  return {};
}
