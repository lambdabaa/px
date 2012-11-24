

goog.provide('px.game.SimpleMoveGame');

goog.require('goog.events.Event');
goog.require('px.Grid');


/**
 * @constructor
 * @param {px.Grid} grid
 */
px.game.SimpleMoveGame = function(grid) {
  /** Models */

  /**
   * @type {px.Grid}
   * @private
   */
  this.grid_ = grid;

  /**
   * @type {px.Entity}
   * @private
   */
  this.activeEntity_ = new px.Entity();
};


/**
 * @param {goog.events.Event} e
 */
px.game.SimpleMoveGame.prototype.onLeft = function(e) {
  var row = this.activeEntity_.row;
  var col = this.activeEntity_.col;

  if (this.grid_.at(row - 1, col) == null) {
    this.grid_.set(row, col, null);
    row -= 1;
    this.activeEntity_.row = row;
    this.grid_.set(row, col, this.activeEntity_);
  }
};


/**
 * @param {goog.events.Event} e
 */
px.game.SimpleMoveGame.prototype.onUp = function(e) {
  var row = this.activeEntity_.row;
  var col = this.activeEntity_.col;

  if (this.grid_.at(row, col - 1) == null) {
    this.grid_.set(row, col, null); 
    col -= 1;
    this.activeEntity_.col = col;
    this.grid_.set(row, col, this.activeEntity_);
  }
};


/**
 * @param {goog.events.Event} e
 */
px.game.SimpleMoveGame.prototype.onRight = function(e) {
  var row = this.activeEntity_.row;
  var col = this.activeEntity_.col;

  if (this.grid_.at(row + 1, col) == null) {
    this.grid_.set(row, col, null);
    row += 1;
    this.activeEntity_.row = row;
    this.grid_.set(row, col, this.activeEntity_);
  }
};


/**
 * @param {goog.events.Event} e
 */
px.game.SimpleMoveGame.prototype.onDown = function(e) {
  var row = this.activeEntity_.row;
  var col = this.activeEntity_.col;

  if (this.grid_.at(row, col + 1) == null) {
    this.grid_.set(row, col, null);
    col += 1;
    this.activeEntity_.col = col;
    this.grid_.set(row, col, this.activeEntity_);
  }
};
