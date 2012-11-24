
goog.provide('px.Canvas');

goog.require('goog.ui.Component');
goog.require('px.Grid');



/**
 * @constructor
 * @extends {goog.ui.Component}
 * @param {px.Grid} grid
 */
px.Canvas = function(grid) {
  goog.base(this);

  this.grid_ = grid;
};
goog.inherits(px.Canvas, goog.ui.Component);


/** @inheritDoc */
px.Canvas.prototype.createDom = function() {
  this.decorateInternal(this.dom_.createElement('canvas'));
};


/** @inheritDoc */
px.Canvas.prototype.enterDocument = function() {
  goog.dom.classes.add(this.element_, 'canvas');
  var canvas = this;
  setInterval(function() {
    canvas.draw();
  }, 40);
};


/** Repaint the canvas */
px.Canvas.prototype.draw = function() {
  var context = this.element_.getContext('2d');

  for (var row = 0; row < px.Grid.HEIGHT; row++) {
    for (var col = 0; col < px.Grid.WIDTH; col++) {
      var entity = this.grid_.at(row, col);
      context.fillStyle = entity ? entity.rgb : 'rgb(0, 0, 0)';
      context.fillRect(5 * col, 5 * row, 5 * (col + 1), 5 * (row + 1));
    }
  }
};
