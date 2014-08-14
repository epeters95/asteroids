(function (root) {
  var Asteroids = root.Asteroids = (root.Asteroids || {});
  
  var MovingObject = Asteroids.MovingObject = function(pos, vel, radius, color){
    this.pos = pos;
    this.vel = vel;
    this.radius = radius;
    this.mass = radius;
    this.color = color;
  };

  MovingObject.prototype.move = function(){
    this.pos = [(this.pos[0] + this.vel[0]), (this.pos[1] + this.vel[1])];
    // this.pos[0] = this.pos[0] % 500;
 //    this.pos[1] = this.pos[1] % 500;
 //    if (this.pos[0] < 0) {
 //      this.pos[0] += 500;
 //    }
 //    if (this.pos[1] < 0) {
 //      this.pos[1] += 500;
 //    }
  };

  MovingObject.prototype.draw = function(ctx) {
    ctx.beginPath()
    ctx.arc(
      this.pos[0],
      this.pos[1],
      this.radius,
      0,
      2 * Math.PI
    );
    ctx.strokeStyle = this.color;
    ctx.stroke();
  };

  MovingObject.prototype.isCollidedWith = function(otherObject) {
    var x1 = this.pos[0];
    var y1 = this.pos[1];
    var x2 = otherObject.pos[0];
    var y2 = otherObject.pos[1];
    var distance = Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2));
    if (distance < this.radius + otherObject.radius) {
      return true;
    } else {
      return false;
    }
  };
 
})(this);