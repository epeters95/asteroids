(function (root) {
  var Asteroids = root.Asteroids = (root.Asteroids || {});
  
  Function.prototype.inherits = function(SuperClass) {
    function Surrogate() {}
    Surrogate.prototype = SuperClass.prototype;
    this.prototype = new Surrogate();
  };
  
  var Asteroid = Asteroids.Asteroid = function(pos, vel) {
    var radius = 5 + Math.random() * 6;
    Asteroids.MovingObject.call(this, pos, vel, radius,
       Asteroid.COLOR);
    this.mostRecent;
  };
  
  Asteroid.RADIUS = 5;
  Asteroid.COLOR = "rgb(136, 27, 29)";
  
  Asteroid.randomAsteroid = function(dimX, dimY) {
    var startX = dimX * Math.random();
    var startY = dimY * Math.random();
    return new Asteroid([startX, startY], Asteroid.randomVec());
  };
    
  Asteroid.randomVec = function(){
    var velx = 4 * (Math.random() - 0.5);
    var vely = 4 * (Math.random() - 0.5);
    return [velx, vely];
  };
    
  
  Asteroid.inherits(Asteroids.MovingObject);
  
})(this);