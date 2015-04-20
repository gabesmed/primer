var Primer = Ember.Application.create({
  rootElement: '.app-container'
});

Primer.Router.map(function() {
  this.resource('level', {path: '/:name'}, function() {
  });
});

Primer.IndexRoute = Ember.Route.extend({});
Primer.LevelRoute = Ember.Route.extend({
  model: function(params) {
    return $.getJSON('levels/' + params.name + '.json');
  }
});

Primer.LevelView = Ember.View.extend({
  didInsertElement: function() {
    this._createGame();
  },
  willClearRender: function() {
    this._removeGame();
  },
  _createGame: function() {
    if (this._game) { throw new Error('game exists'); }
    this._game = new Game(this.$('.game'),
      this.get('controller.model'));
    this._anim = requestAnimationFrame(this._animate.bind(this));    
  },
  _removeGame: function() {
    if (!this._game) { throw new Error('game does not exist'); }
    cancelAnimationFrame(this._anim);
    this._game.destroy();
    this._game = null;
  },
  _animate: function() {
    this._game.update();
    this._anim = requestAnimationFrame(this._animate.bind(this));
  },
  levelDidChange: function() {
    if (this.state !== 'inDOM') { return; }
    this._removeGame();
    this._createGame();
  }.observes('controller.model')
});

Primer.LevelController = Ember.Controller.extend({
  needs: ['levelSpeciesArray'],
  speciesArray: Ember.computed.alias('controllers.levelSpeciesArray'),
  actions: {
    reset: function() {
      this.notifyPropertyChange('model');
    }
  }
});

Primer.LevelSpeciesArrayController = Ember.ArrayController.extend({
  needs: ['level'],
  content: Ember.computed.alias('controllers.level.model.species'),
  itemController: 'levelSpecies'
});

Primer.LevelSpeciesController = Ember.Controller.extend({
  needs: ['level'],
  start: Ember.computed.alias('controllers.level.model.start'),
  name: Ember.computed.alias('content.name'),
  startingPopulation: function(key, value) {
    if (arguments.length === 1) {
      return this.get('start.population')[this.get('name')];
    } else {
      if (!isNaN(parseInt(value, 10))) {
        this.get('start.population')[this.get('name')] =
          parseInt(value, 10);
      }
      return value;
    }
  }.property('content'),
  actions: {
    reset: function() {
      this.get('controllers.level').send('reset');
    }
  }
});
