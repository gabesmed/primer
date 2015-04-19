var Game = function(sel, data) {

  this.stage = new PIXI.Stage(0xeeeeee);
  this.renderer = new PIXI.WebGLRenderer(
    $(sel).width(), $(sel).height());
  $(sel).append(this.renderer.view);

  this.ecosystem = new Ecosystem(data.species, data.start);
  this.graphics = new PIXI.Graphics();
  this.graphics.position.set(10, 10);
  this.stage.addChild(this.graphics);
};

Game.prototype = Object.create(PIXI.DisplayObjectContainer);
Game.prototype.constructor = Game;

Game.prototype.update = function() {
  this.ecosystem.iterate();
  this.draw();
  this.renderer.render(this.stage);
};

Game.prototype.destroy = function() {
  this.renderer.view.parentElement.removeChild(this.renderer.view);
  this.renderer.destroy();
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
  for (var species in colors) {
    this.graphics.lineStyle(2, colors[species]);
    for (var i = 0; i < displayCount; i++) {
      if (i >= numStates) { continue; }
      var state = this.ecosystem.states[i + displayStart];
      this.graphics[i === 0 ? 'moveTo' : 'lineTo'](
        i * width / displayCount,
        height * (1 - (state.population[species] / this.ecosystem.maxpops[species])));
    }
  }

  var debugString = '';
  var lastState = this.ecosystem.states[numStates - 1];
  for (species in lastState.population) {
    debugString += species + ': ' +
      lastState.population[species].toFixed(3) + ', ';
  }
  console.log(debugString);
};
