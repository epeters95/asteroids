(function(root){
  var Asteroids = root.Asteroids = (root.Asteroids || {});
  
  var Bullet = Asteroids.Bullet = function(pos, vel, direction){
        var mag = Math.sqrt(Math.pow(vel[0], 2) + Math.pow(vel[1], 2));

    Asteroids.MovingObject.call(this, pos, [(mag + 5) * Math.cos(direction), (mag + 5) * Math.sin(direction)],
      2.5, "black");
    this.direction = direction;
  }
  Bullet.inherits(Asteroids.MovingObject);
  
  Bullet.prototype.hitAsteroids = function(game) {
    var asteroids = game.asteroids;
    for (var i = 0; i < asteroids.length; i++) {
      if (this.isCollidedWith(asteroids[i])) {
        return asteroids[i];
      }
    }
    return false;
  }
  
})(this);