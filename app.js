'use strict';

var width = window.innerWidth,
    height = window.innerHeight,
    robot = new cuora.Robot(),
    renderer = new cuora.renderer.Canvas(robot, 'cuora-canvas', width, height, width / 2, height / 2);

var Lsystem = function(robot, renderer) {
  this.robot = robot;
  this.renderer = renderer;

  this.start = 'X';
  this.x = renderer.canvas.width / 2;
  this.y = renderer.canvas.height / 2;
  this.initialAngle = 90;
  this.angle = 90;
  this.iterations = 14;
  this.side = 5;
  this.ruleX = '';
  this.ruleY = '';
  this.ruleF = 'F';

  this.savedX = [];
  this.savedY = [];
  this.savedAngle = [];

  this.initWorker();
};

Lsystem.prototype.initWorker = function() {
  this.worker = new Worker('task.js');
};

Lsystem.prototype.run = function() {
  var that = this,
      start = this.start,
      iterations = this.iterations,
      angle = this.angle,
      robot = this.robot,
      renderer = this.renderer;
  

  renderer.clear();
  robot.angle = this.initialAngle;
  renderer.x = this.x;
  renderer.y = this.y;

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
};

var ls = new Lsystem(robot, renderer);

ls.ruleX = 'X+YF';
ls.ruleY = 'FX-Y';

window.onload = function() {
  var gui = new dat.GUI(),
      listener = function() {
        ls.run();
      };

  gui.add(ls, 'start')
    .onFinishChange(listener);
  gui.add(ls, 'initialAngle', 0, 360)
    .onChange(listener);
  gui.add(ls, 'angle', 0, 360)
    .onChange(listener);
  gui.add(ls, 'side', 1, 20)
    .onChange(listener);
  gui.add(ls, 'iterations');
  gui.add(ls, 'ruleX');
  gui.add(ls, 'ruleY');
  gui.add(ls, 'ruleF');
  gui.add(ls, 'run');
};

window.onresize = function() {
  renderer.setSize(window.innerWidth, window.innerHeight);
};

renderer.canvas.onclick = function(e) {
  ls.x = e.x;
  ls.y = e.y;

  ls.run();
};

ls.run();
