(function(root) {
  var Asteroids = root.Asteroids = (root.Asteroids || {});
  
  var Ship = Asteroids.Ship = function() {
    // Asteroids.MovingObject.call(this, [250, 250], [0, 0], Ship.RADIUS,
    // Ship.COLOR);
    this.pos = [450, 320];
    this.vel = [0, 0];
    this.radius = Ship.RADIUS_0 - 3;
    this.spawnRadius = new Asteroids.MovingObject(this.pos, [0, 0], 50, "#00CC00");
    this.color = Ship.COLOR;
    this.direction = -Math.PI / 2;

    this.blinked = true;
    this.blinks = 10;

    this.windowID = window.setInterval(this.blink.bind(this), 120);
  };
  
  Ship.RADIUS_0 = 15;
  Ship.RADIUS_1 = 10;
  Ship.ACCEL = 0.18;
  Ship.TURN = 0.18;
  
  Ship.COLOR = "rgb(0, 124, 51)";
  
  Ship.inherits(Asteroids.MovingObject);
  
  
  Ship.prototype.fireBullet = function() {
    // if (this.vel[0] === 0 && this.vel[1] === 0) {
//       return false;
//     }
    // var speed = Math.sqrt(Math.pow(this.vel[0], 2) + Math.pow(this.vel[1], 2));
    // var direction = [this.vel[0] / speed, this.vel[1]/ speed];

    return new Asteroids.Bullet(this.pos, this.vel, this.direction);    
  };
  
  Ship.prototype.fireSmoke = function() {
    var revDir = (this.direction + Math.PI) % (2 * Math.PI);
    var newX = this.pos[0] + Ship.RADIUS_1 * Math.cos(this.direction + Math.PI);
    var newY = this.pos[1] + Ship.RADIUS_1 * Math.sin(this.direction + Math.PI);
    return new Asteroids.Particle([newX, newY], this.vel, revDir, "smoke");
  };
  
  Ship.prototype.power = function(val) {
    if (Math.abs(this.vel[0]) <= 10) {
      this.vel[0] += val * Ship.ACCEL * Math.cos(this.direction);
    } else { this.vel[0] = 10 * this.vel[0] / Math.abs(this.vel[0]) }
    if (Math.abs(this.vel[1]) <= 10) {
      this.vel[1] += val * Ship.ACCEL * Math.sin(this.direction);
    } else { this.vel[1] = 10 * this.vel[1] / Math.abs(this.vel[1]) }
  };
  
  Ship.prototype.turn = function(val) {
    // val is either 1 or -1
    this.direction += val * Ship.TURN;
    this.direction = this.direction % (2 * Math.PI);
    if (this.direction < 0) {
      this.direction += (2 * Math.PI);
    }
  };
  
  Ship.prototype.draw = function(ctx) {
    if (!this.blinked) { return }

    var point;
    ctx.beginPath();
    
    point = this.pointCoords(0);
    ctx.moveTo(point[0], point[1]);
    
    point = this.pointCoords(1);
    ctx.lineTo(point[0], point[1]);
    
    point = this.pointCoords(2);
    ctx.lineTo(point[0], point[1]);
    
    ctx.closePath();
    ctx.strokeStyle = this.color;
    ctx.stroke();
  };
  
  Ship.prototype.pointCoords = function(pointNum) {
    var x = this.pos[0];
    var y = this.pos[1];
    switch(pointNum) {
    case 0:
      x += Ship.RADIUS_0 * Math.cos(this.direction);
      y += Ship.RADIUS_0 * Math.sin(this.direction);
      break;
    case 1:
      x += Ship.RADIUS_1 * Math.cos(this.direction + 3 * Math.PI / 4);
      y += Ship.RADIUS_1 * Math.sin(this.direction + 3 * Math.PI / 4);
      break;
    case 2:
      x += Ship.RADIUS_1 * Math.cos(this.direction - 3 * Math.PI / 4);
      y += Ship.RADIUS_1 * Math.sin(this.direction - 3 * Math.PI / 4);
      break;
    }
    return [x, y];
  };

  Ship.prototype.blink = function() {
    if (this.blinks > 0) {
      this.blinks -= 1;
      this.blinked = !this.blinked;  
    }
  };

  Ship.prototype.explode = function(particles) {
    for (var i = 0; i < 8; i++) {
      particles.push(new Asteroids.Particle(this.pos, this.vel, 0, "ship"));
    }
  }
  
})(this);











