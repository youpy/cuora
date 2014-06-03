'use strict';

var width = window.innerWidth,
    height = window.innerHeight,
    robot = new cuora.Robot(),
    renderer = new cuora.renderer.Canvas(robot, 'cuora-canvas', width, height, width / 2, height / 2);

var Lsystem = function(robot, renderer) {
  this.robot = robot;
  this.renderer = renderer;

  this.start = 'F';
  this.x = renderer.canvas.width / 2;
  this.y = renderer.canvas.height / 2;
  this.initialAngle = 90;
  this.angle = 15;
  this.iterations = 4;
  this.side = 10;
  this.ruleX = '';
  this.ruleY = '';
  this.ruleF = 'F[+F-F-F]F[--F+F+F]';

  this.savedX = [];
  this.savedY = [];
  this.savedAngle = [];

  this.initWorker();
};

Lsystem.prototype.initWorker = function() {
  this.worker = new Worker('task.js');
};

Lsystem.prototype.updateHash = function() {
  location.hash = encodeURIComponent([
    this.start,
    this.x,
    this.y,
    this.initialAngle,
    this.angle,
    this.side,
    this.iterations,
    this.ruleX,
    this.ruleY,
    this.ruleF
  ].join(','));
};

Lsystem.prototype.setFromHash = function() {
  var values = decodeURIComponent(location.hash).slice(1).split(','),
      that = this;

  if(values.length === 10) {
    this.start = values[0];
    this.x = parseFloat(values[1]);
    this.y = parseFloat(values[2]);
    this.initialAngle = parseFloat(values[3]);
    this.angle = parseFloat(values[4]);
    this.side = parseFloat(values[5]);
    this.iterations = parseInt(values[6]);
    this.ruleX = values[7];
    this.ruleY = values[8];
    this.ruleF = values[9];
  }
};

Lsystem.prototype.run = function() {
  var that = this,
      start = this.start,
      iterations = this.iterations,
      angle = this.angle,
      robot = this.robot,
      renderer = this.renderer;
  console.log('run');
  renderer.clear();
  robot.angle = this.initialAngle;
  renderer.x = this.x;
  renderer.y = this.y;
  renderer.ctx.strokeStyle = '#ffffff';

  this.worker.terminate();
  this.initWorker();
  this.runId = +new Date();

  this.worker.addEventListener('message', function(e) {
    var savedAngle = that.savedAngle,
        savedX = that.savedX,
        savedY = that.savedY,
        savedRunId = that.runId,
        result = e.data.start;

    result.split('').forEach(function(c) {
      setTimeout(function() {
        if(savedRunId !== that.runId) {
          return;
        }

        switch(c) {
         case 'F':
          robot.forward(that.side);
          break;
         case '+':
          robot.right(angle);
          break;
         case '-':
          robot.left(angle);
          break;
         case '[':
          savedAngle.push(robot.angle);
          savedX.push(renderer.x);
          savedY.push(renderer.y);
          break;
         case ']':
          robot.angle = savedAngle.pop();
          renderer.x = savedX.pop();
          renderer.y = savedY.pop();
          break;
        default:
          break;
        }
      }, 0);
    });
  });

  this.worker.postMessage({
    start: start,
    iterations: iterations,
    ruleX: that.ruleX,
    ruleY: that.ruleY,
    ruleF: that.ruleF
  });

  this.updateHash();
};

var ls = new Lsystem(robot, renderer);

window.onload = function() {
  var gui = new dat.GUI({ load: presets, preset: "Default" }),
      listener = function() {
        ls.run();
      };

  gui.remember(ls);

  gui.add(ls, 'start')
    .listen();
  gui.add(ls, 'x')
    .listen();
  gui.add(ls, 'y')
    .listen();
  gui.add(ls, 'initialAngle', 0, 360)
    .listen()
    .onChange(listener);
  gui.add(ls, 'angle', 0, 360)
    .listen()
    .onChange(listener);
  gui.add(ls, 'side', 1, 20)
    .listen()
    .onChange(listener);
  gui.add(ls, 'iterations');
  gui.add(ls, 'ruleX')
    .listen();
  gui.add(ls, 'ruleY')
    .listen();
  gui.add(ls, 'ruleF')
    .listen();
  gui.add(ls, 'run');

  // XXX
  document.getElementsByTagName('select')[0].onchange = function() {
    ls.run();
  };

  ls.setFromHash();
  ls.run();
};

window.onresize = function() {
  renderer.setSize(window.innerWidth, window.innerHeight);
};

renderer.canvas.onclick = function(e) {
  ls.x = e.x;
  ls.y = e.y;

  ls.run();
};
