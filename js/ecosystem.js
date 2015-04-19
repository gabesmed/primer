/**
 * History of an ecosystem. Can only add states.
 */
var Ecosystem = function(state) {
  this.states = [state];
  this.maxpops = {};
  for (var being in state.population) {
    this.maxpops[being] = state.population[being];
  }
};

Ecosystem.prototype.constructor = Ecosystem;

Ecosystem.prototype.iterate = function() {
  var nextState = this.states[this.states.length - 1].next();
  for (var being in nextState.population) {
    this.maxpops[being] = Math.max(this.maxpops[being],
      nextState.population[being]);
  }
  this.states.push(nextState);
};

/**
 * State of an ecosystem. Immutable.
 */
var Ecostate = function(population) {
  this.population = population;
};

Ecostate.prototype.constructor = Ecostate;

Ecostate.prototype.next = function() {
  var nextPop = {};
  for (var being in this.population) {
    nextPop[being] = this.nextBeingPopulation(being);
  }
  return new Ecostate(nextPop);
};

Ecostate.prototype.nextBeingPopulation = function(being) {
  var type = BEINGS[being];
  var pop = this.population[being];
  var growthRate = this.beingGrowthRate(being);
  // console.log(being, growthRate);
  var delta = 0.1;
  return Math.max(0, pop + growthRate * delta);
};

Ecostate.prototype.beingGrowthRate = function(being) {
  var type = BEINGS[being];

  // Population change phase: increased base on population of the things
  // we eat.
  var growthRate = 0;
  for (var other in type.eats) {
    growthRate += type.eats[other] * this.population[other];
  }

  // Getting eaten rate.
  if (this.population[being] > 0) {
    for (other in this.population) {
      if (BEINGS[other].eats && BEINGS[other].eats[being]) {
        growthRate -= BEINGS[other].eats[being] *
          this.population[other] /
          // to turn into a decline rate not amt
          this.population[being];
      }
    }
  }

  // Spawn phase: increase if necessary.
  growthRate += (type.spawns || 0);

  // Die phase: decrease if necessary.
  growthRate -= (type.dies || 0);

  return growthRate;
};
