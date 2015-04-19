var BEINGS = {
  wolves: {
    eats: {sheep: 2},
    dies: 20
  },
  sheep: {
    eats: {grass: 1},
    dies: 1
  },
  grass: {
    temp: {ideal: 50, std: 10},
    spawns: 1,
    dies: 0
  }
};
