
goog.provide('px.game.SnakeGame');
goog.provide('px.game.SnakeGame.Direction');

goog.require('goog.events.Event');
goog.require('px.Entity');
goog.require('px.Grid');


/**
 * @constructor
 * @param {px.Grid} grid
 */
px.game.SnakeGame = function(grid) {
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

  /**
   * @type {px.game.SnakeGame.Direction}
   * @private
   */
  this.direction_ = px.game.SnakeGame.Direction.RIGHT;

  /**
   * @type {number}
   * @private
   */
  this.num_ = 1;

  this.dropFood_();

  this.move_();
};


/** @const */
px.game.SnakeGame.FOOD_COLOR = 'rgb(255, 0, 0)';

/** @const */
px.game.SnakeGame.SNAKE_COLOR = 'rgb(255, 255, 255)';


/**
 * @param {goog.events.Event} e
 */
px.game.SnakeGame.prototype.onLeft = function(e) {
  this.direction_ = px.game.SnakeGame.Direction.LEFT;
};


/**
 * @param {goog.events.Event} e
 */
px.game.SnakeGame.prototype.onUp = function(e) {
  this.direction_ = px.game.SnakeGame.Direction.UP;
};


/**
 * @param {goog.events.Event} e
 */
px.game.SnakeGame.prototype.onRight = function(e) {
  this.direction_ = px.game.SnakeGame.Direction.RIGHT;
};


/**
 * @param {goog.events.Event} e
 */
px.game.SnakeGame.prototype.onDown = function(e) {
  this.direction_ = px.game.SnakeGame.Direction.DOWN;
};


px.game.SnakeGame.prototype.move_ = function() {
  var row = this.activeEntity_.row;
  var col = this.activeEntity_.col;
  console.log(this.direction_);
  switch (this.direction_) {
    case px.game.SnakeGame.Direction.LEFT:
      col += px.Grid.WIDTH;
      col = (col - 1) % px.Grid.WIDTH;
      break;
    case px.game.SnakeGame.Direction.UP:
      row += px.Grid.HEIGHT;
      row = (row - 1) % px.Grid.HEIGHT;
      break;
    case px.game.SnakeGame.Direction.RIGHT:
      col = (col + 1) % px.Grid.WIDTH;
      break;
    case px.game.SnakeGame.Direction.DOWN:
      row = (row + 1) % px.Grid.HEIGHT;
      break;
  }

  console.log('From...');
  console.log(this.positionToString_(this.activeEntity_.row, this.activeEntity_.col));
  console.log('To...');
  console.log(this.positionToString_(row, col));

  var drop = false;
  if (this.grid_.at(row, col) == null) {
    drop = false;
  } else if (this.grid_.at(row, col).rgb = px.game.SnakeGame.SNAKE_COLOR) {
    console.log('Die!');
    return;
  } else if (this.grid_.at(row, col).rgb = px.game.SnakeGame.FOOD_COLOR) {
    this.num += 1;
    drop = true;
  }

  this.grid_.set(this.activeEntity_.row, this.activeEntity_.col, null);
  this.grid_.set(row, col, this.activeEntity_);
  this.activeEntity_.row = row;
  this.activeEntity_.col = col;
  if (drop) {
    this.dropFood_();
  }

  var game = this;
  setTimeout(function() {
    game.move_();
  }, 100);
};


/** @private */
px.game.SnakeGame.prototype.dropFood_ = function() {
  var row = 0;
  var col = 0;
  while (true) {
    row = Math.floor(px.Grid.HEIGHT * Math.random());
    col = Math.floor(px.Grid.WIDTH * Math.random());
    if (this.grid_.at(row, col) == null) {
      break;
    }
  }

  this.grid_.set(row, col, this.initFood_(row, col));
};


/**
 * @param {number} row
 * @param {number} col
 * @return {px.Entity}
 * @private
 */
px.game.SnakeGame.prototype.initFood_ = function(row, col) {
  var food = new px.Entity();
  food.row = row;
  food.col = col;
  food.rgb = px.game.SnakeGame.FOOD_COLOR;
  return food;
};


/**
 * @param {number} row
 * @param {number} col
 * @return {string}
 * @private
 */
px.game.SnakeGame.prototype.positionToString_ = function(row, col) {
  return '(' + row + ', ' + col + ')';
};


/** @enum {string} */
px.game.SnakeGame.Direction = {
    LEFT: 'left'
  , UP: 'up'
  , RIGHT: 'right'
  , DOWN: 'down'
};
