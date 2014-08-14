(function(root) {
  var Asteroids = root.Asteroids = (root.Asteroids || {});
  
  var Particle = Asteroids.Particle = function(pos, vel, dir, type) {
    this.vel = vel.slice(0);
    this.pos = pos.slice(0);
    this.direction = dir;

    switch(type) {

    case "smoke":
      this.color1 = "rgb(205, 225, 218)";
      this.radius = 4;
      this.randomSmoke();
      break;

    case "chunk":
      this.color1 = "rgba(136, 27, 29, 0.5)"
      this.radius = 4;
      this.randomChunk();
      break;

    case "ship":
      this.color1 = Asteroids.Ship.COLOR;
      this.randomShip();
    }

    Asteroids.MovingObject.call(this, this.pos, this.vel, this.radius, this.color1);
  };
  
  Particle.RADIUS = 3;
  
  Particle.inherits(Asteroids.MovingObject);
  
  Particle.prototype.randomSmoke = function() {
    var direction = this.direction;
    direction += 0.6 * (Math.random() - 0.5);

    var speedFactor = 1.3 + 0.9 * Math.random();
    this.vel[0] = speedFactor * Math.cos(direction);
    this.vel[1] = speedFactor * Math.sin(direction);
    
    this.growFactor = 0.1 + 0.05 * Math.random();
    this.slowFactor = 0.97;
    
    this.life = 40;
    this.lifeFactor = 40 * (Math.random() - 0.5);
    this.life += this.lifeFactor;
  };

  Particle.prototype.randomChunk = function() {
    var direction = this.direction;
    direction += (3 * Math.PI / 6) * (Math.random() - 0.5);

    var speedFactor = 1 + 0.7 * Math.random();

    this.vel[0] = speedFactor * Math.cos(direction);
    this.vel[1] = speedFactor * Math.sin(direction);

    this.growFactor = 0;
    this.slowFactor = 1;

    this.life = 40;
    this.lifeFactor = 40 * (Math.random() - 0.5);
    this.life += this.lifeFactor;
  };

  Particle.prototype.randomShip = function() {
    var direction = (12 * Math.PI / 6) * (Math.random() - 0.5);

    var speedFactor = 0.7 * Math.random();
    this.vel[0] += 4 * Math.cos(direction);
    this.vel[1] += 4 * Math.sin(direction);

    this.vel[0] *= speedFactor;
    this.vel[1] *= speedFactor;

    this.life = 40;
    this.lifeFactor = 40 * (Math.random() - 0.5);
    this.life += this.lifeFactor;

    this.radius = 2 + 4 * Math.random();

    this.slowFactor = 0.99;
    this.growFactor = 0;
  }
  
  Particle.prototype.draw = function(ctx) {
    this.radius += this.growFactor;
    if (this.vel[0] && this.vel[1] > 0) {
      this.vel[0] *= this.slowFactor;
      this.vel[1] *= this.slowFactor;
    }
    this.life -= 1;
    ctx.beginPath();
    ctx.arc(
      this.pos[0],
      this.pos[1],
      this.radius,
      0,
      2 * Math.PI
    );
    ctx.strokeStyle = this.color1;
    ctx.stroke();
  };
  
})(this);