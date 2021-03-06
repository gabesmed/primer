function createPrimer(name, rootElement, levels) {
  var Primer = Ember.Application.create({
    rootElement: rootElement
  });

  Primer.Router.map(function() {
    this.resource('level', {path: '/:name'}, function() {});
  });

  Primer.Router.reopen({
    location: 'none'
  });

  Primer.IndexRoute = Ember.Route.extend({
    setupController: function() {
      this.transitionTo('level', levels[0].name);
    }
  });
  Primer.LevelRoute = Ember.Route.extend({
    model: function(params) {
      return $.getJSON('levels/' + params.name + '.json');
    }
  });

  Primer.ApplicationController = Ember.Controller.extend({
    levels: levels
  });

  Primer.LevelView = Ember.View.extend({
    didInsertElement: function() {
      this._createGame();
      $(window).on('scroll.primer', this._onWindowScroll.bind(this)); 
      this._onWindowScroll();
    },

    willClearRender: function() {
      this._removeGame();
      $(window).off('scroll.primer');
    },

    _createGame: function() {
      if (this._game) { throw new Error('game exists'); }
      this._game = new Game(this.$('.game'),
        this.get('controller.model'));
      this._anim = requestAnimationFrame(this._animate.bind(this));    
      this.set('controller.game', this._game);
    },

    _removeGame: function() {
      if (!this._game) { throw new Error('game does not exist'); }
      cancelAnimationFrame(this._anim);
      this._game.destroy();
      this._game = null;
      this.set('controller.game', null);
    },

    _onWindowScroll: function() {
      var rect = this.$('canvas')[0].getBoundingClientRect();
      if (window.innerHeight - rect.top > 200) {
        // top of game is in view of window
        if (!this._game.isRunning) {
          this._game.isRunning = true;
        }
      }
    },

    _animate: function() {
      this._game.update();
      this._anim = requestAnimationFrame(this._animate.bind(this));
    },

    levelDidChange: function() {
      if (this.state !== 'inDOM') { return; }
      var isFirst = (!this._game);
      this._removeGame();
      this._createGame();
      if (!isFirst) { this._game.isRunning = true; }
    }.observes('controller.model')
  });

  Primer.LevelController = Ember.Controller.extend({
    needs: ['levelSpeciesArray'],
    speciesArray: Ember.computed.alias('controllers.levelSpeciesArray'),
    game: null,
    actions: {
      reset: function() {
        this.notifyPropertyChange('model');
        this.get('game').isRunning = true;
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

  return Primer;
}

createPrimer('game-1', '.game-container-1', [
  {title: 'Level 1', name: 'level1'}
]);

createPrimer('game-2', '.game-container-2', [
  {title: 'Level 2', name: 'level2'},
  {title: 'Level 3', name: 'level3'}
]);
