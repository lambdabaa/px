
goog.provide('px.App');

goog.require('goog.dom');
goog.require('px.Canvas');
goog.require('px.Entity');
goog.require('px.KeyEvent');
goog.require('px.KeyboardHandler');
goog.require('px.game.LogPositionGame');
goog.require('px.game.SimpleMoveGame');
goog.require('px.game.SnakeGame');



/**
 * @constructor
 * @export
 */
px.App = function() {
  /** Models */

  /**
   * @type {px.Grid}
   * @private
   */
  this.grid_ = new px.Grid();

  this.game_ = new px.game.SnakeGame(this.grid_);

  /** Views */

  /**
   * @type {px.Canvas}
   * @private
   */
  this.canvas_ = new px.Canvas(this.grid_);
  var element = goog.dom.createDom('div');
  goog.dom.classes.add(element, 'canvas-container');
  goog.dom.appendChild(document.body, element);
  this.canvas_.render(element);

  /**
   * @type {px.KeyboardHandler}
   * @private
   */
  this.keyboardHandler_ = px.KeyboardHandler.getInstance();
  goog.events.listen(this.keyboardHandler_, px.KeyEvent.LEFT,
      goog.bind(this.game_.onLeft, this.game_));
  goog.events.listen(this.keyboardHandler_, px.KeyEvent.UP,
      goog.bind(this.game_.onUp, this.game_));
  goog.events.listen(this.keyboardHandler_, px.KeyEvent.RIGHT,
      goog.bind(this.game_.onRight, this.game_));
  goog.events.listen(this.keyboardHandler_, px.KeyEvent.DOWN,
      goog.bind(this.game_.onDown, this.game_));
};
goog.addSingletonGetter(px.App);
goog.exportSymbol('px.App.getInstance', px.App.getInstance);
