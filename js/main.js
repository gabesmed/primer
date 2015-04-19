var renderer, stage, game, lastT = new Date();

function init() {
  stage = new PIXI.Stage(0xeeeeee);
  renderer = new PIXI.WebGLRenderer(
      window.innerWidth, 300);
  document.getElementById('game').appendChild(renderer.view);

  game = new Game(stage);

  requestAnimFrame(animate);
}


function animate() {
  var now = new Date();
  game.update(now - lastT);
  lastT = now;
  renderer.render(stage);
  requestAnimFrame(animate);
}

$(init);
