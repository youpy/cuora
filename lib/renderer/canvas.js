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
  this.ctx = ctx;
  this.x = x;
  this.y = y;
};

module.exports = CanvasRenderer;

