
goog.provide('px.Grid');



/**
 * @constructor
 */
px.Grid = function() {
  /**
   * @type {Array.<Array.<px.Entity>>}
   * @private
   */
  this.contents_ = [];

  this.resetContents();
};


/** @const */
px.Grid.WIDTH = 60;

/** @const */
px.Grid.HEIGHT = 30;


/** Make a new grid */
px.Grid.prototype.resetContents = function() {
  for (var row = 0; row < px.Grid.HEIGHT; row++) {
    this.contents_[row] = [];

    for (var col = 0; col < px.Grid.WIDTH; col++) {
      this.contents_[row][col] = null;
    }
  }
}


/**
 * @param {number} row
 * @param {number} col
 * @return {px.Entity}
 */
px.Grid.prototype.at = function(row, col) {
  return this.contents_[row][col];
};


/**
 * @param {number} row
 * @param {number} col
 * @param {px.Entity} entity
 */
px.Grid.prototype.set = function(row, col, entity) {
  this.contents_[row][col] = entity;
};
