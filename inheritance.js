Function.prototype.inherits = function(SuperClass) {
  function Surrogate() {}
  Surrogate.prototype = SuperClass.prototype;
  this.prototype = new Surrogate();  
};


function Ship(name){
  MovingObject.call(this, 5)
  this.name
}

function MovingObject(speed){
  this.speed = speed;
}

MovingObject.prototype.print = function() {
  console.log("hello" + this.speed);
}



Ship.inherits(MovingObject);
Ship.prototype.sail = function() {
  this.speed += 1;
}
var ship1 = new Ship("ship1");
ship1.print();

var movingObject1 = new MovingObject(10);
movingObject1.sail();
console.log(movingObject1.speed);
