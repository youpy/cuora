'use strict';

var EventEmitter = require('wolfy87-eventemitter'),
    util = require('util');

var Robot = function() {
  var that = this;

  this.angle = 90;
  this.penDown = true;

  function move(side) {
    that.emitEvent('move', [{ amount: side, angle: that.angle, penDown: that.penDown }]);
  }

  this.left = function(angle) {
    this.angle -= angle;
  };

  this.right = function(angle) {
    this.angle += angle;
  };

  this.forward = function(side) {
    move(- side);
  };

  this.back = function(side) {
    move(side);
  };

  this.penDown = function() {
    this.penDown = true;
  };

  this.penDown = function() {
    this.penDown = false;
  };
};

util.inherits(Robot, EventEmitter);

module.exports = Robot;

