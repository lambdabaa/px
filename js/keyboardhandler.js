
goog.provide('px.AppleKey');
goog.provide('px.KeyEvent');
goog.provide('px.KeyboardHandler');

goog.require('goog.events');



/**
 * @constructor
 * @extends {goog.events.EventTarget}
 */
px.KeyboardHandler = function() {
  // TODO(gareth): Switch the key based on user agent
  /** @private */
  this.key_ = px.AppleKey;

  goog.events.listen(document, goog.events.EventType.KEYDOWN,
      goog.bind(this.onKeyDown_, this));
  goog.events.listen(document, goog.events.EventType.KEYUP,
      goog.bind(this.onKeyUp_, this));
};
goog.addSingletonGetter(px.KeyboardHandler);
goog.inherits(px.KeyboardHandler, goog.events.EventTarget);


/**
 * @param {goog.events.Event} e
 * @private
 */
px.KeyboardHandler.prototype.onKeyUp_ = function(e) {
  // TODO(gareth): Any reason for this?
};


/**
 * @param {goog.events.Event} e
 * @private
 */
px.KeyboardHandler.prototype.onKeyDown_ = function(e) {
  var eventType = null;
  switch (e.keyCode) {
    case this.key_.SPACE:
      eventType = px.KeyEvent.SPACE;
      break;
    case this.key_.LEFT:
      eventType = px.KeyEvent.LEFT;
      break;
    case this.key_.UP:
      eventType = px.KeyEvent.UP;
      break;
    case this.key_.RIGHT:
      eventType = px.KeyEvent.RIGHT;
      break;
    case this.key_.DOWN:
      eventType = px.KeyEvent.DOWN;
      break;
  }

  this.dispatchEvent({ type: eventType });
};


/** @enum {string} */
px.KeyEvent = {
  SPACE: 'space',
  LEFT: 'left',
  UP: 'up',
  RIGHT: 'right',
  DOWN: 'down'
};


/** @enum {number} */
px.AppleKey = {
  SPACE: 32,
  LEFT: 37,
  UP: 38,
  RIGHT: 39,
  DOWN: 40
};
