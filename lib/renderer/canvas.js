'use strict';

var CanvasRenderer = function(robot, domId, width, height, x, y) {
  var that = this,
      canvas = document.getElementById(domId),
      ctx = canvas.getContext('2d');

  canvas.width = width;
  canvas.height = height;

  robot.on('move', function(data) {
    var dx = Math.cos(data.angle / 180 * Math.PI) * data.amount,
        dy = Math.sin(data.angle / 180 * Math.PI) * data.amount;

    if(data.penDown) {
      that.ctx.beginPath();
      that.ctx.moveTo(that.x, that.y);
      that.ctx.lineTo(that.x + dx, that.y + dy);
      that.ctx.stroke();
    }

    that.x += dx;
    that.y += dy;
  });

  this.robot = robot;
  this.canvas = canvas;
  this.ctx = ctx;
  this.initialX = x;
  this.initialY = y;

  this.clear();
};

CanvasRenderer.prototype.setSize = function(width, height) {
  this.canvas.width = width;
  this.canvas.height = height;
};

CanvasRenderer.prototype.clear = function() {
  this.robot.angle = 90;

  this.x = this.initialX;
  this.y = this.initialY;
  this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
};

module.exports = CanvasRenderer;
