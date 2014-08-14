(function(root){
  var Asteroids = root.Asteroids = (root.Asteroids || {});
  
  var Game = Asteroids.Game = function(ctx) {
    this.ctx = ctx;
    this.best = 100000;
    this.reset();
  };

  Game.prototype.reset = function() {
    this.ship = undefined;
    this.asteroids = [];
    this.bullets = [];
    this.particles = [];
    
    this.addAsteroids(25);
    this.firing = false;

    this.titleFade = 1;
    this.textFade = 0.6;

    this.dead = false;
    this.win = false;

    this.startTime;
    this.time = 0;
    window.clearInterval(this.endID);
  };
 
  Game.DIM_X = 900;
  Game.DIM_Y = 500;
  
  Game.prototype.addAsteroids = function(numAsteroids) {
    while (numAsteroids > 0) {
      var asteroid = Asteroids.Asteroid.randomAsteroid(Game.DIM_X, Game.DIM_Y);
      while (this.ship && asteroid.isCollidedWith(this.ship.spawnRadius)) {
        asteroid = Asteroids.Asteroid.randomAsteroid(Game.DIM_X, Game.DIM_Y);
      }
      this.asteroids.push(asteroid);
      numAsteroids -= 1;
    }
  };
  
  Game.prototype.fireBullet = function() {

    var bullet = this.ship.fireBullet();
    if (bullet) {
      this.bullets.push(bullet);
    }
  };
  
  Game.prototype.checkKeys = function() {
    // key('a', function() { this.ship.power([-1,0])} );
//     key('d', function() { this.ship.power([1,0])} );
//     key('s', function() { this.ship.power([0,1])} );
//     key('w', function() { this.ship.power([0,-1]) });
    if (key.isPressed('w')) {
      this.ship.power(1);
      this.particles.push(this.ship.fireSmoke());
    }
    if (key.isPressed('a')) {
      this.ship.turn(-1);
    }
    if (key.isPressed('d')) {
      this.ship.turn(1);
    }
    if (key.isPressed('space') && !this.firing) {
      this.fireBullet();
      this.firing = true;
    } else if (!key.isPressed('space')) {
      this.firing = false;
    }
  };
  
  
  Game.prototype.draw = function() {
    this.ctx.clearRect(0, 0, Game.DIM_X, Game.DIM_Y);

    for (var i = 0; i < this.asteroids.length; i++) {
      this.asteroids[i].draw(this.ctx);
    }

    if (this.ship) {
      this.ship.draw(this.ctx);
      if (!this.win) {
        if (this.titleFade > 0) {
          this.titleFade -= 0.11;
        }
        if (this.textFade > 0) {
          this.textFade -= 0.11;
        }
        this.ctx.font = "20px Comfortaa, sans-serif";
        this.ctx.fillStyle = "rgba(53, 143, 90, 0.6 )";
        var timeValue = parseFloat((new Date().getTime() - this.startTime) / 1000).toFixed(2);
        this.ctx.fillText("time: " + timeValue, 30, 30);
      }
    }
    if (this.titleFade > 0) {
      this.ctx.font = "60px Comfortaa, sans-serif";
      this.ctx.fillStyle = "rgba(53, 143, 90, " + this.titleFade + ")";
      this.ctx.fillText("asteroids", 320, 250);
    }
    if (this.textFade > 0) {
      this.ctx.font = "20px Comfortaa, sans-serif";
      this.ctx.fillStyle = "rgba(53, 143, 90, " + this.textFade + ")";
      this.ctx.fillText("use 'W A S D' keys to move and Space to fire", 250, 400);
      this.ctx.fillText("press Space to start", 360, 450);
    }

    for (var i = 0; i < this.bullets.length; i++) {
      this.bullets[i].draw(this.ctx);
    }

    for (var i = 0; i < this.particles.length; i++) {
      this.particles[i].draw(this.ctx);
    }

    this.ctx.font = "20px Comfortaa, sans-serif";
    this.ctx.fillStyle = "rgba(53, 143, 90, 0.6)";
    var timeValue;
    if (this.best === 100000 ) { timeValue = "--.--" }
    else { timeValue = this.best }
    this.ctx.fillText("session best: " + timeValue, 700, 30);

    if (this.dead && !this.win) {
      this.ctx.font = "30px Comfortaa, sans-serif";
      this.ctx.fillStyle = "rgba(53, 143, 90, 0.6)";
      this.ctx.fillText("game over", 390, 450);
    }

    if (this.win) {
      this.ctx.font = "30px Comfortaa, sans-serif";
      this.ctx.fillStyle = "rgba(53, 143, 90, 0.6)";
      var timeString = "your time: ";
      if (this.time < this.best) {
        this.best = this.time;
      }
      this.ctx.fillText(timeString + this.time, 390, 450);
    }
    
  };
  
  Game.prototype.move = function() {
    for (var i = 0; i < this.asteroids.length; i++) {
      this.asteroids[i].move();
    }

    if (this.ship) { this.ship.move() }

    for (var i = 0; i < this.bullets.length; i++) {
      this.bullets[i].move();
    }

    for (var i = 0; i < this.particles.length; i++) {
      this.particles[i].move();
    }
  };
  
  Game.prototype.checkCollisions = function() {
    for (var i = 0; i < this.asteroids.length; i++) {
      if (this.ship.blinks <= 0 && this.ship.isCollidedWith(this.asteroids[i])) {
        this.dead = true;
        this.ship.explode(this.particles);
        this.ship = undefined;
        this.stop();
      }
    }
  };

  Math.norm2d = function(val1, val2) {
    var mag = Math.sqrt(Math.pow(val1, 2) + Math.pow(val2, 2));
    return [val1 / mag, val2 / mag];
  }

  Math.atanBetter = function(y, x) {
    var value = 0;
    if (y >= 0 && x === 0) {
      value = Math.PI / 2;
    } else if ( y < 0 && x === 0) {
      value = 3 * Math.PI / 2;
    } else if (y < 0 && x < 0) {
      value = Math.atan(y / x) + Math.PI;
    } else if (y > 0 && x < 0) {
      value = Math.atan(y / x) + Math.PI;
    } else if (y < 0 && x > 0) {
      value = Math.atan(y / x) + 2 * Math.PI;
    } else if (y === 0 && x < 0) {
      value = Math.PI;
    } else {
      value = Math.atan(y / x);
    }
    return value;
  };

  Game.generateNorm = function(norm) {
    
  };

  Game.prototype.checkAsteroids = function() {
    for (var i = 0; i < this.asteroids.length; i++) {
      for (var j = i + 1; j < this.asteroids.length; j++) {
        var a1 = this.asteroids[i];
        var a2 = this.asteroids[j];
        if (a1.isCollidedWith(a2) &&
           (!(a1.mostRecent && a2.mostRecent) ||
           ((a1.mostRecent && a2.mostRecent) && a1.mostRecent.pos[0] !== a2.pos[0])))
        {
          var angle = Math.atanBetter((a2.pos[1] - a1.pos[1]), (a2.pos[0] - a1.pos[0]));

          var b1 = Math.norm2d(a2.pos[0] - a1.pos[0], a2.pos[1] - a1.pos[1]);
          var b2 = [-b1[1], b1[0]];


          // First asteroid in collision

          var dir1 = Math.atanBetter(a1.vel[1], a1.vel[0]);
          var theta1 = dir1 - angle;
          var mag1 = Math.sqrt(Math.pow(a1.vel[0], 2) + Math.pow(a1.vel[1], 2));

          var a1proj = [mag1 * Math.cos(theta1) * b1[0], mag1 * Math.cos(theta1) * b1[1]];

          var a1norm = [mag1 * Math.sin(theta1) * b2[0], mag1 * Math.sin(theta1) * b2[1]];
          var normDir1 = Math.atanBetter(a1norm[1], a1norm[0]);

          var a1norm2 = [-a1norm[0], -a1norm[1]];
          var normDir2 = Math.atanBetter(a1norm2[1], a1norm2[0]);

          // check smallest angle difference for correct reflecting direction
          var compare1 = dir1 - normDir1;
          if (compare1 > Math.PI) { compare1 -= 2 * Math.PI }

          var compare2 = dir1 - normDir2;
          if (compare2 > Math.PI) { compare2 -= 2 * Math.PI }

          if (Math.abs(compare1) > Math.abs(compare2)) {
            a1norm = a1norm2;
          }


          // Second asteroid in collision

          var dir2 = Math.atanBetter(a2.vel[1], a2.vel[0]);
          var theta2 = dir2 - angle;
          var mag2 = Math.sqrt(Math.pow(a2.vel[0], 2) + Math.pow(a2.vel[1], 2));
          
          var a2proj = [mag2 * Math.cos(theta2) * b1[0], mag2 * Math.cos(theta2) * b1[1]];

          var a2norm = [-mag2 * Math.sin(theta2) * b2[0], -mag2 * Math.sin(theta2) * b2[1]];
          var normDir1 = Math.atanBetter(a2norm[1], a2norm[0]);

          var a2norm2 = [-a2norm[0], -a2norm[1]];
          var normDir2 = Math.atanBetter(a2norm2[1], a2norm2[0]);
          
          var compare1 = dir2 - normDir1;
          if (compare1 > Math.PI) { compare1 -= 2 * Math.PI }

          var compare2 = dir2 - normDir2;
          if (compare2 > Math.PI) { compare2 -= 2 * Math.PI }

          if (Math.abs(compare1) > Math.abs(compare2)) {
            a2norm = a2norm2;
          }


          var m1 = a1.mass;
          var m2 = a2.mass;

          var a1projFinal = [];
          var a2projFinal = [];

          a1projFinal[0] = ((m1 - m2)/(m2 + m1)) * a1proj[0] + (2 * m2 / (m2 + m1)) * a2proj[0];
          a1projFinal[1] = ((m1 - m2)/(m2 + m1)) * a1proj[1] + (2 * m2 / (m2 + m1)) * a2proj[1];

          a2projFinal[0] = (2 * m1 / (m2 + m1)) * a1proj[0] + ((m2 - m1)/(m2 + m1)) * a2proj[0];
          a2projFinal[1] = (2 * m1 / (m2 + m1)) * a1proj[1] + ((m2 - m1)/(m2 + m1)) * a2proj[1];

          a1.vel = [a1projFinal[0] + a1norm[0], a1projFinal[1] + a1norm[1]];
          a2.vel = [a2projFinal[0] + a2norm[0], a2projFinal[1] + a2norm[1]];

          a1.mostRecent = a2;
          a2.mostRecent = a1;
        }
      }
    }
  }
  
  Game.prototype.stop = function() {
    this.endID = window.setInterval(this.reset.bind(this), 3000);
  };
  
  Game.prototype.step = function() {
    if (!this.ship) {
      if (!this.dead && key.isPressed('space')) {
        this.initialize();

      }
    } else {
      this.checkKeys();
      this.checkCollisions();

      this.ship.pos[0] = this.ship.pos[0] % 900;
      this.ship.pos[1] = this.ship.pos[1] % 500;
      if (this.ship.pos[0] < 0) {
        this.ship.pos[0] += 900;
      }
      if (this.ship.pos[1] < 0) {
        this.ship.pos[1] += 500;
      }
    }
    
    this.draw();
    this.move();
    this.checkAsteroids();
    for (var i = 0; i < this.bullets.length; i++) {
      var asteroid = this.bullets[i].hitAsteroids(this);
      if (asteroid) {
        this.removeAsteroid(asteroid, this.bullets[i]);
        this.removeBullet(this.bullets[i]);
      }
      if (this.bullets[i] && this.isOutOfBounds(this.bullets[i])) {
        this.removeBullet(this.bullets[i]);
      }
    }
    for (var i = 0; i < this.asteroids.length; i++) {
      var asteroid = this.asteroids[i];
      asteroid.pos[0] = asteroid.pos[0] % 900;
      asteroid.pos[1] = asteroid.pos[1] % 500;
      if (asteroid.pos[0] < 0) {
        asteroid.pos[0] += 900;
      }
      if (asteroid.pos[1] < 0) {
        asteroid.pos[1] += 500;
      }
    }
    
    for (var i = 0; i < this.particles.length; i++) {
      if (this.particles[i].life <= 0) {
        this.particles.splice(this.particles.indexOf(this.particles[i]), 1);
      }
    }
    if (this.asteroids.length === 0 && !this.win && !this.dead) {
      this.time = parseFloat((new Date().getTime() - this.startTime) / 1000).toFixed(2);
      this.win = true;
      this.stop();
    }
  };
  
  Game.prototype.removeAsteroid = function(asteroid, bullet) {
    var bulletDir = Math.atan(bullet.vel[1]/bullet.vel[0]);
    if (bulletDir < 0) {
      bulletDir += 2 * Math.PI;
    }
    for (var i = 0; i < 3; i++) {
      this.particles.push(new Asteroids.Particle(asteroid.pos, bullet.vel, bullet.direction, "chunk"));
    };
    this.asteroids.splice(this.asteroids.indexOf(asteroid), 1);
  };
  
  Game.prototype.removeBullet = function(bullet) {
    this.bullets.splice(this.bullets.indexOf(bullet), 1);
  };
  
  Game.prototype.isOutOfBounds = function(object) {
    if ((object.pos[0] < 0 || object.pos[0] > 900) || 
      (object.pos[1] < 0 || object.pos[1] > 500) ) {
      return true;
    }
    return false
  };

  Game.prototype.start = function() {
    this.windowID = window.setInterval(this.step.bind(this), 25);
  };

  Game.prototype.initialize = function() {
    this.startTime = new Date().getTime();
    this.ship = new Asteroids.Ship();
    for (var i = 0; i < this.asteroids.length; i++) {
      if (this.ship.spawnRadius.isCollidedWith(this.asteroids[i])) {
        this.asteroids.splice(this.asteroids.indexOf(this.asteroids[i]), 1);
      }
    }
  };
  
}(this));