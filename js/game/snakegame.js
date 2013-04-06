
goog.provide('px.game.SnakeGame');
goog.provide('px.game.SnakeGame.Direction');

goog.require('goog.events');
goog.require('goog.events.Event');
goog.require('goog.soy');
goog.require('goog.userAgent');
goog.require('px.Entity');
goog.require('px.Grid');
goog.require('px.game.snakegameinfo');


/**
 * @constructor
 * @param {px.Grid} grid
 */
px.game.SnakeGame = function(grid) {
  /** 
   * @type {number}
   * @private
   */
  this.loadTime_ = new Date().getTime();

  /**
   * @type {px.Grid}
   * @private
   */
  this.grid_ = grid;

  /**
   * @type {number}
   * @private
   */
  this.gamesPlayed_ = 0;

  this.initGame_();
};


/** @const */
px.game.SnakeGame.FOOD_COLOR = 'rgb(255, 0, 0)';

/** @const */
px.game.SnakeGame.SNAKE_COLOR = 'rgb(255, 255, 255)';


/** @private */
px.game.SnakeGame.prototype.initGame_ = function() {
  this.grid_.resetContents();

  this.gamesPlayed_ += 1;

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

  /**
   * @type {Array}
   * @private
   */
  this.moveHistory_ = [];

  /**
   * @type {boolean}
   * @private
   */
  this.isPaused_ = false;

  /**
   * @type {number}
   * @private
   */
  this.highScore_ = 0;
  if (typeof(Storage) !== 'undefined') {
    var game = this;
    window.onbeforeunload = function(e) {
      localStorage['highScore_'] = game.highScore_;
      var leaveTime = new Date().getTime();
      mixpanel.track('snake', {
        'duration': Math.ceil((leaveTime - game.loadTime_) / 1000),
        'gamesPlayed': game.gamesPlayed_,
        'highScore': game.highScore_,
        'loadTime': game.loadTime_,
        'leaveTime': leaveTime,
        'userAgent': goog.userAgent.getUserAgentString()
      });
    };

    if (localStorage['highScore_'] && !isNaN(localStorage['highScore_'])) {
      this.highScore_ = localStorage['highScore_'];
    }
  }

  this.renderScore_();
  this.dropFood_();
  this.move_();
};


/**
 * @param {goog.events.Event} e
 */
px.game.SnakeGame.prototype.onSpace = function(e) {
  if (this.isPaused_) {
    this.onPlayButtonClick_(e);
  } else {
    this.onPauseButtonClick_(e);
  }
};


/**
 * @param {goog.events.Event} e
 */
px.game.SnakeGame.prototype.onLeft = function(e) {
  if (this.direction_ != px.game.SnakeGame.Direction.RIGHT) {
    this.direction_ = px.game.SnakeGame.Direction.LEFT;
  }

  if (this.isPaused_) {
    this.onPlayButtonClick_(null);
  }
};


/**
 * @param {goog.events.Event} e
 */
px.game.SnakeGame.prototype.onUp = function(e) {
  if (this.direction_ != px.game.SnakeGame.Direction.DOWN) {
    this.direction_ = px.game.SnakeGame.Direction.UP;
  }

  if (this.isPaused_) {
    this.onPlayButtonClick_(null);
  }
};


/**
 * @param {goog.events.Event} e
 */
px.game.SnakeGame.prototype.onRight = function(e) {
  if (this.direction_ != px.game.SnakeGame.Direction.LEFT) {
    this.direction_ = px.game.SnakeGame.Direction.RIGHT;
  }

  if (this.isPaused_) {
    this.onPlayButtonClick_(null);
  }
};


/**
 * @param {goog.events.Event} e
 */
px.game.SnakeGame.prototype.onDown = function(e) {
  if (this.direction_ != px.game.SnakeGame.Direction.UP) {
    this.direction_ = px.game.SnakeGame.Direction.DOWN;
  }

  if (this.isPaused_) {
    this.onPlayButtonClick_(null);
  }
};


/** @private */
px.game.SnakeGame.prototype.move_ = function() {
  this.moveHistory_.unshift(this.direction_);
  var row = this.activeEntity_.row;
  var col = this.activeEntity_.col;
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

  var food = false;
  if (this.grid_.at(row, col) == null) {
    food = false;
  } else if (this.grid_.at(row, col).rgb == px.game.SnakeGame.SNAKE_COLOR) {
    this.highScore_ = Math.max(this.highScore_, this.num_ - 1);
    this.renderScore_();
    return;
  } else if (this.grid_.at(row, col).rgb == px.game.SnakeGame.FOOD_COLOR) {
    this.num_ += 1;
    this.renderScore_();

    food = true;
    this.dropFood_();
  }

  var i = this.activeEntity_.row;
  var j = this.activeEntity_.col;
  this.grid_.set(i, j, null);
  for (var k = 1; k < this.num_; k++) {
    var move = this.moveHistory_[k];
    switch (this.oppositeOf_(move)) {
      case px.game.SnakeGame.Direction.LEFT:
        j += px.Grid.WIDTH;
        j = (j - 1) % px.Grid.WIDTH;
        break;
      case px.game.SnakeGame.Direction.UP:
        i += px.Grid.HEIGHT;
        i = (i - 1) % px.Grid.HEIGHT;
        break;
      case px.game.SnakeGame.Direction.RIGHT:
        j = (j + 1) % px.Grid.WIDTH;
        break;
      case px.game.SnakeGame.Direction.DOWN:
        i = (i + 1) % px.Grid.HEIGHT;
        break;
    }

    this.grid_.set(i, j, null);
  }

  this.activeEntity_.row = row;
  this.activeEntity_.col = col;
  for (var k = 0; k < this.num_; k++) {
    this.grid_.set(row, col, this.activeEntity_);
    var move = this.moveHistory_[k];
    switch (this.oppositeOf_(move)) {
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
  }

  if (!this.isPaused_) {
    var game = this;
    setTimeout(function() {
      game.move_();
    }, Math.max(40, 100 - (this.num_ * 5)));
  }
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


/**
 * @param {px.game.SnakeGame.Direction} dir
 * @return {px.game.SnakeGame.Direction}
 * @private
 */
px.game.SnakeGame.prototype.oppositeOf_ = function(dir) {
  var result = px.game.SnakeGame.Direction.LEFT;
  switch (dir) {
    case px.game.SnakeGame.Direction.LEFT:
      result = px.game.SnakeGame.Direction.RIGHT;
      break;
    case px.game.SnakeGame.Direction.UP:
      result = px.game.SnakeGame.Direction.DOWN;
      break;
    case px.game.SnakeGame.Direction.RIGHT:
      result = px.game.SnakeGame.Direction.LEFT;
      break;
    case px.game.SnakeGame.Direction.DOWN:
      result = px.game.SnakeGame.Direction.UP;
      break;
  }

  return result;
};


/**
 * @private
 */
px.game.SnakeGame.prototype.renderScore_ = function() {
  var element = goog.dom.getElementByClass('snakegameinfo');
  if (!element) {
    element = goog.dom.createDom('div');
    goog.dom.classes.add(element, 'snakegameinfo');
    goog.dom.appendChild(
        goog.dom.getElementByClass('canvas-container'), element);
  }

  goog.soy.renderElement(element, px.game.snakegameinfo.main, {
    score: this.num_ - 1,
    highScore: this.highScore_
  });

  // Start listening for play, pause, and restart clicks again
  goog.events.unlisten(
      goog.dom.getElementByClass('btn-play'), goog.events.EventType.CLICK,
      this.onPlayButtonClick_, false, this);
  goog.events.listen(
      goog.dom.getElementByClass('btn-play'), goog.events.EventType.CLICK,
      this.onPlayButtonClick_, false, this);
  goog.events.unlisten(
      goog.dom.getElementByClass('btn-pause'), goog.events.EventType.CLICK,
      this.onPauseButtonClick_, false, this);
  goog.events.listen(
      goog.dom.getElementByClass('btn-pause'), goog.events.EventType.CLICK,
      this.onPauseButtonClick_, false, this);
  goog.events.unlisten(
      goog.dom.getElementByClass('btn-restart'), goog.events.EventType.CLICK,
      this.onRestartButtonClick_, false, this);
  goog.events.listen(
      goog.dom.getElementByClass('btn-restart'), goog.events.EventType.CLICK,
      this.onRestartButtonClick_, false, this);
};


/**
 * @param {goog.events.Event} e
 * @private
 */
px.game.SnakeGame.prototype.onPlayButtonClick_ = function(e) {
  if (this.isPaused_) {
    this.isPaused_ = false;
    var game = this;
    setTimeout(function() {
      game.move_();
    }, Math.max(40, 100 - (this.num_ * 5)));
  }
};


/**
 * @param {goog.events.Event} e
 * @private
 */
px.game.SnakeGame.prototype.onPauseButtonClick_ = function(e) {
  this.isPaused_ = true;
};


/**
 * @param {goog.events.Event} e
 * @private
 */
px.game.SnakeGame.prototype.onRestartButtonClick_ = function(e) {
  this.isPaused_ = true;
  var game = this;
  if (typeof(Storage) !== 'undefined') {
    localStorage['highScore_'] = game.highScore_;
  }

  setTimeout(function() {
    game.initGame_();
  }, 500);
};


/** @enum {string} */
px.game.SnakeGame.Direction = {
  LEFT: 'left',
  UP: 'up',
  RIGHT: 'right',
  DOWN: 'down'
};
