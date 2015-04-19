var Game = function(stage) {
  var firstPop = {
    wolves: 1, 
    sheep: 1,
    grass: 5
  };
  var firstState = new Ecostate(firstPop);
  this.ecosystem = new Ecosystem(firstState);
  this.graphics = new PIXI.Graphics();
  this.graphics.position.set(10, 10);
  stage.addChild(this.graphics);
};

Game.prototype = Object.create(PIXI.DisplayObjectContainer);
Game.prototype.constructor = Game;

Game.prototype.update = function(dt) {
  this.ecosystem.iterate();
  this.draw();
};

Game.prototype.draw = function() {
  var colors = {
    wolves: 0xff0000,
    sheep: 0x0cccc00,
    grass: 0x00ff00
  };
  var height = 200;
  var width = 600;
  var displayCount = 1000;
  var numStates = this.ecosystem.states.length;
  var displayEnd = Math.max(numStates, displayCount);
  var displayStart = Math.max(0, displayEnd - displayCount);
  this.graphics.clear();
  for (var being in colors) {
    this.graphics.lineStyle(2, colors[being]);
    for (var i = 0; i < displayCount; i++) {
      if (i >= numStates) { continue; }
      var state = this.ecosystem.states[i + displayStart];
      this.graphics[i === 0 ? 'moveTo' : 'lineTo'](
        i * width / displayCount,
        height * (1 - (state.population[being] / this.ecosystem.maxpops[being])));
    }
  }
};
