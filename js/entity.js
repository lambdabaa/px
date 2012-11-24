
goog.provide('px.Entity');

goog.require('goog.ui.Component');



/**
 * @constructor
 * @extends {goog.ui.Component}
 */
px.Entity = function() {
  /**
   * @type {number}
   */
  this.row = 0;

  /**
   * @type {number}
   */
  this.col = 0;

  /**
   * @type {string}
   */
  this.rgb = 'rgb(255, 255, 255)';
};
goog.inherits(px.Entity, goog.ui.Component);
