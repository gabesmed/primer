var Game = function(sel, data) {

  this.stage = new PIXI.Container();
  this.renderer = new PIXI.WebGLRenderer($(sel).width(), $(sel).height(), {
    backgroundColor: 0xeeeeee
  });
  $(sel).append(this.renderer.view);

  this.ecosystem = new Ecosystem(data.species, data.start);
  this.graphics = new PIXI.Graphics();
  this.graphics.position.set(10, 10);
  this.stage.addChild(this.graphics);
  this._labels = {};
};

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
  // Calculate heights
  var height = 200;
  var width = 600;
  var displayCount = 1000;
  var numStates = this.ecosystem.states.length;
  var displayEnd = Math.max(numStates, displayCount);
  var displayStart = Math.max(0, displayEnd - displayCount);
  this.graphics.clear();

  // Draw lines
  var maxPop = _.max(_.values(this.ecosystem.maxpops));
  for (var species in colors) {
    this.graphics.lineStyle(5, colors[species]);
    for (var i = 0; i < displayCount; i++) {
      if (i >= numStates) { continue; }
      var state = this.ecosystem.states[i + displayStart];
      this.graphics[i === 0 ? 'moveTo' : 'lineTo'](
        i * width / displayCount,
        height * (1 - (state.population[species] / maxPop)));
    }
  }

  // Print text
  var lastState = this.ecosystem.states[numStates - 1];
  for (species in colors) {
    var label = this._labels[species];
    if (!label) {
      label = new PIXI.Text(species);
      var color = colors[species].toString(16);
      while (color.length < 6) { color = '0' + color; }
      label.style = {fill: '#' + color};
      this.stage.addChild(label);
      this._labels[species] = label;
    }
    label.text = species + ': ' + lastState.population[species].toFixed(1);
    label.position.set(
      Math.min(numStates, displayCount) * width / displayCount + 20,
      height * (1 - (lastState.population[species] / maxPop)));
  }
};
