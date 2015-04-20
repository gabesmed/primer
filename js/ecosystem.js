/**
 * History of an ecosystem. Can only add states.
 */
var Ecosystem = function(speciesArray, initialStateData) {
  this.speciesArray = {};
  speciesArray.forEach(function(species) {
    this.speciesArray[species.name] = species;
  }, this);
  var state = new Ecostate(this, $.extend(true, {}, initialStateData));
  this.states = [state];
  this.maxpops = {};
  for (var species in state.population) {
    this.maxpops[species] = state.population[species];
  }
};

Ecosystem.prototype.constructor = Ecosystem;

Ecosystem.prototype.iterate = function() {
  var nextState = this.states[this.states.length - 1].next();
  for (var species in nextState.population) {
    this.maxpops[species] = Math.max(this.maxpops[species],
      nextState.population[species]);
  }
  this.states.push(nextState);
};

/**
 * State of an ecosystem. Immutable.
 */
var Ecostate = function(ecosystem, data) {
  this.ecosystem = ecosystem;
  this.population = data.population;
};

Ecostate.prototype.constructor = Ecostate;

Ecostate.prototype.next = function() {
  var nextPop = {};
  for (var species in this.population) {
    nextPop[species] = this.nextBeingPopulation(species);
  }
  return new Ecostate(this.ecosystem, {population: nextPop});
};

Ecostate.prototype.nextBeingPopulation = function(speciesName) {
  var type = this.ecosystem.speciesArray[speciesName];
  var pop = this.population[speciesName];
  var growthRate = this.speciesGrowthRate(speciesName);
  // console.log(speciesName, growthRate);
  var delta = 0.01;
  return Math.max(0, pop + growthRate * delta);
};

Ecostate.prototype.speciesGrowthRate = function(speciesName) {
  var type = this.ecosystem.speciesArray[speciesName];

  if (this.population[speciesName] === 0) { return 0; }

  // Eating
  var growthRate = 0;
  var other;
  var proportion;

  for (other in (type.eats || {})) {
    proportion = this.population[other] /
      this.population[speciesName];
    growthRate += type.eats[other] * proportion;
  }
  for (other in (type.eatenBy || {})) {
    proportion = this.population[other] /
      this.population[speciesName];
    growthRate -= type.eatenBy[other] * proportion;
  }

  // Spawn phase: increase if necessary.
  growthRate += (type.growth || 0);
  return growthRate;
};
