'use strict';

var Robot = require('./lib/robot'),
    CanvasRenderer = require('./lib/renderer/canvas');

global.cuora = {
  Robot: Robot,
  renderer: {
    Canvas: CanvasRenderer
  }
};
