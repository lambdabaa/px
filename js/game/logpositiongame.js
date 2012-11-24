
goog.provide('px.game.LogPositionGame');

goog.require('goog.events.Event');
goog.require('px.Grid');


/**
 * @constructor
 * @param {px.Grid} grid
 */
px.game.LogPositionGame = function(grid) {
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
px.game.LogPositionGame.prototype.onLeft = function(e) {
  var row = this.activeEntity_.row;
  var col = this.activeEntity_.col;
  row -= 1;
  this.activeEntity_.row = row;
  this.logPosition_(row, col);
};


/**
 * @param {goog.events.Event} e
 */
px.game.LogPositionGame.prototype.onUp = function(e) {
  var row = this.activeEntity_.row;
  var col = this.activeEntity_.col;
  col -= 1;
  this.activeEntity_.col = col;
  this.logPosition_(row, col);
};


/**
 * @param {goog.events.Event} e
 */
px.game.LogPositionGame.prototype.onRight = function(e) {
  var row = this.activeEntity_.row;
  var col = this.activeEntity_.col;
  row += 1;
  this.activeEntity_.row = row;
  this.logPosition_(row, col);
};


/**
 * @param {goog.events.Event} e
 */
px.game.LogPositionGame.prototype.onDown = function(e) {
  var row = this.activeEntity_.row;
  var col = this.activeEntity_.col;
  col += 1;
  this.activeEntity_.col = col;
  this.logPosition_(row, col);
};


/**
 * @param {number} row
 * @param {number} col
 * @private
 */
px.game.LogPositionGame.prototype.logPosition_ = function(row, col) {
  console.log('(' + row + ', ' + col + ')');
};
