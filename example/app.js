'use strict';

var width = 600,
    height = 600,
    robot = new cuora.Robot(),
    renderer = new cuora.renderer.Canvas(robot, 'cuora-canvas', width, height, width / 2, height / 2);

function inspi(side, angle, inc, step) {
  if(typeof step === 'undefined') {
    step = 0;
  }

  if(step > 1000) {
    return;
  }

  setTimeout(function() {
    robot.forward(side);
    robot.right(angle);
    inspi(side, angle + inc, inc, step + 1);
  }, 0);
}

inspi(20, 0, 7);
