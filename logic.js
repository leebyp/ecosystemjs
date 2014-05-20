function Dictionary(startValues) {
  this.values = startValues || {};
}
Dictionary.prototype.store = function(name, value) {
  this.values[name] = value;
};
Dictionary.prototype.lookup = function(name) {
  return this.values[name];
};
Dictionary.prototype.contains = function(name) {
  return Object.prototype.hasOwnProperty.call(this.values, name) &&
    Object.prototype.propertyIsEnumerable.call(this.values, name);
};
Dictionary.prototype.each = function(action) {
  forEachIn(this.values, action);
};

function bind(func, object) {
  return function(){
    return func.apply(object, arguments);
  };
}
function method(object, name) {
  return function() {
    return object[name].apply(object, arguments);
  };
}

function forEachIn(object, action) {
  for (var property in object) {
    if (Object.prototype.hasOwnProperty.call(object, property))
      action(property, object[property]);
  }
}

var creatureTypes = new Dictionary();

//==============================================

// var thePlan =
//   ["############################",
//    "#      #    #      o      ##",
//    "#                          #",
//    "#          #####           #",
//    "##         #   #    ##     #",
//    "###           ##     #     #",
//    "#           ###      #     #",
//    "#   ####                   #",
//    "#   ##       o             #",
//    "# o  #         o       ### #",
//    "#    #                     #",
//    "############################"];

//==============================================
function Point(x, y) {
  this.x = x;
  this.y = y;
}
Point.prototype.add = function(other) {
  return new Point(this.x + other.x, this.y + other.y);
};
Point.prototype.isEqualTo = function(other) {
  return this.x == other.x && this.y == other.y;
};

console.log((new Point(3, 1)).add(new Point(2, 4)));
//==============================================
function Grid(width, height) {
  this.width = width;
  this.height = height;
  this.cells = new Array(width * height);
}
Grid.prototype.valueAt = function(point) {
  return this.cells[point.y * this.width + point.x];
};
Grid.prototype.setValueAt = function(point, value) {
  this.cells[point.y * this.width + point.x] = value;
};
Grid.prototype.isInside = function(point) {
  return point.x >= 0 && point.y >= 0 &&
         point.x < this.width && point.y < this.height;
};
Grid.prototype.moveValue = function(from, to) {
  this.setValueAt(to, this.valueAt(from));
  this.setValueAt(from, undefined);
};
Grid.prototype.each = function(action) {
  for (var y = 0; y < this.height; y++) {
    for (var x = 0; x < this.width; x++) {
      var point = new Point(x, y);
      action(point, this.valueAt(point));
    }
  }
};
//==============================================
var directions = new Dictionary(
  {"n":  new Point( 0, -1),
   "ne": new Point( 1, -1),
   "e":  new Point( 1,  0),
   "se": new Point( 1,  1),
   "s":  new Point( 0,  1),
   "sw": new Point(-1,  1),
   "w":  new Point(-1,  0),
   "nw": new Point(-1, -1)});
//==============================================
function StupidBug() {};
StupidBug.prototype.act = function(surroundings) {
  return {type: "move", direction: "s"};
};
//==============================================
var wall = {};

function Terrarium(plan) {
  var grid = new Grid(plan[0].length, plan.length);
  for (var y = 0; y < plan.length; y++) {
    var line = plan[y];
    for (var x = 0; x < line.length; x++) {
      grid.setValueAt(new Point(x, y),
                      elementFromCharacter(line.charAt(x)));
    }
  }
  this.grid = grid;
}

function elementFromCharacter(character) {
  if (character == " ")
    return undefined;
  else if (character == "#")
    return wall;
  else if (character == "o")
    return new StupidBug();
}
//==============================================
wall.character = "#";
StupidBug.prototype.character = "o";

function characterFromElement(element) {
  if (element == undefined)
    return " ";
  else
    return element.character;
}
//==============================================
Terrarium.prototype.toString = function() {
  var characters = [];
  var endOfLine = this.grid.width - 1;
  this.grid.each(function(point, value) {
    characters.push(characterFromElement(value));
    if (point.x == endOfLine)
      characters.push("\n");
  });
  return characters.join("");
};
//==============================================
// var terrarium = new Terrarium(thePlan);
// console.log(terrarium.toString());
//==============================================

//==============================================
Terrarium.prototype.listActingCreatures = function() {
  var found = [];
  this.grid.each(function(point, value) {
    if (value != undefined && value.act)
      found.push({object: value, point: point});
  });
  return found;
};
//==============================================
Terrarium.prototype.listSurroundings = function(center) {
  var result = {};
  var grid = this.grid;
  directions.each(function(name, direction) {
    var place = center.add(direction);
    if (grid.isInside(place))
      result[name] = characterFromElement(grid.valueAt(place));
    else
      result[name] = "#";
  });
  return result;
};
//==============================================
Terrarium.prototype.processCreature = function(creature) {
  var surroundings = this.listSurroundings(creature.point);
  var action = creature.object.act(surroundings);
  if (action.type == "move" && directions.contains(action.direction)) {
    var to = creature.point.add(directions.lookup(action.direction));
    if (this.grid.isInside(to) && this.grid.valueAt(to) == undefined)
      this.grid.moveValue(creature.point, to);
  }
  else {
    throw new Error("Unsupported action: " + action.type);
  }
};
//==============================================
Terrarium.prototype.step = function() {
  this.listActingCreatures().forEach(
          bind(this.processCreature, this));
  if (this.onStep)
    this.onStep();
};
//==============================================
// var terrarium = new Terrarium(thePlan);
// console.log(terrarium.toString());
// terrarium.step();
// console.log(terrarium.toString());
//==============================================
Point.prototype.toString = function() {
  return "(" + this.x + "," + this.y + ")";
};
//==============================================
Terrarium.prototype.start = function() {
  if (!this.running)
    this.running = setInterval(bind(function(){
      this.step();
      console.log(this.toString())
    }
      , this), 500);
};

Terrarium.prototype.stop = function() {
  if (this.running) {
    clearInterval(this.running);
    this.running = null;
  }
};
//==============================================
// var terrarium = new Terrarium(thePlan);
// // terrarium.onStep = partial(inPlacePrinter(), terrarium);
// terrarium.start();
// terrarium.stop();
//==============================================
// function elementFromCharacter(character) {
//   if (character == " ")
//     return undefined;
//   else if (character == "#")
//     return wall;
//   else if (character == "o")
//     return new StupidBug();
// }
//==============================================

creatureTypes.register = function(constructor) {
  this.store(constructor.prototype.character, constructor);
};

function elementFromCharacter(character) {
  if (character == " ")
    return undefined;
  else if (character == "#")
    return wall;
  else if (creatureTypes.contains(character))
    return new (creatureTypes.lookup(character))();
  else
    throw new Error("Unknown character: " + character);
}
//==============================================
// function BouncingBug() {
//   this.direction = "ne";
// }
// BouncingBug.prototype.act = function(surroundings) {
//   if (surroundings[this.direction] != " ")
//     this.direction = (this.direction == "ne" ? "sw" : "ne");
//   return {type: "move", direction: this.direction};
// };
// BouncingBug.prototype.character = "%";

// creatureTypes.register(BouncingBug);
//==============================================
Dictionary.prototype.names = function() {
  var names = [];
  this.each(function(name, value) {names.push(name);});
  return names;
};
function randomElement(array) {
  if (array.length == 0)
    throw new Error("The array is empty.");
  return array[Math.floor(Math.random() * array.length)];
}
//==============================================
// function DrunkBug() {};
// DrunkBug.prototype.act = function(surroundings) {
//   return {type: "move",
//           direction: randomElement(directions.names())};
// };
// DrunkBug.prototype.character = "~";

// creatureTypes.register(DrunkBug);
// ==============================================
// var newPlan =
//   ["############################",
//    "#                      #####",
//    "#    ##                 ####",
//    "#   ####     ~ ~          ##",
//    "#    ##       ~            #",
//    "#                          #",
//    "#                ###       #",
//    "#               #####      #",
//    "#                ###       #",
//    "# %        ###        %    #",
//    "#        #######           #",
//    "############################"];

// var terrarium = new Terrarium(newPlan);
// terrarium.start();
//==============================================
function clone(object) {
  function OneShotConstructor(){}
  OneShotConstructor.prototype = object;
  return new OneShotConstructor();
}
//==============================================
function LifeLikeTerrarium(plan) {
  Terrarium.call(this, plan);
}
LifeLikeTerrarium.prototype = clone(Terrarium.prototype);
LifeLikeTerrarium.prototype.constructor = LifeLikeTerrarium;
//==============================================
LifeLikeTerrarium.prototype.processCreature = function(creature) {
  if (creature.object.energy <= 0) return;
  var surroundings = this.listSurroundings(creature.point);
  var action = creature.object.act(surroundings);

  var target = undefined;
  var valueAtTarget = undefined;
  if (action.direction && directions.contains(action.direction)) {
    var direction = directions.lookup(action.direction);
    var maybe = creature.point.add(direction);
    if (this.grid.isInside(maybe)) {
      target = maybe;
      valueAtTarget = this.grid.valueAt(target);
    }
  }

  if (action.type == "move") {
    if (target && !valueAtTarget) {
      this.grid.moveValue(creature.point, target);
      creature.point = target;
      creature.object.energy -= 1;
    }
  }
  else if (action.type == "eat") {
    if (valueAtTarget && valueAtTarget.energy) {
      this.grid.setValueAt(target, undefined);
      creature.object.energy += valueAtTarget.energy;
      valueAtTarget.energy = 0;
    }
  }
  else if (action.type == "photosynthese") {
    creature.object.energy += 1;
  }
  else if (action.type == "reproduce") {
    if (target && !valueAtTarget) {
      var species = characterFromElement(creature.object);
      var baby = elementFromCharacter(species);
      creature.object.energy -= baby.energy * 2;
      if (creature.object.energy > 0)
        this.grid.setValueAt(target, baby);
    }
  }
  else if (action.type == "wait") {
    creature.object.energy -= 0.2;
  }
  else {
    throw new Error("Unsupported action: " + action.type);
  }

  if (creature.object.energy <= 0)
    this.grid.setValueAt(creature.point, undefined);
};
//==============================================
function Lichen() {
  this.energy = 5;
}
Lichen.prototype.act = function(surroundings) {
  var emptySpace = findDirections(surroundings, " ");
  if (this.energy >= 13 && emptySpace.length > 0)
    return {type: "reproduce", direction: randomElement(emptySpace)};
  else if (this.energy < 20)
    return {type: "photosynthese"};
  else
    return {type: "wait"};
};
Lichen.prototype.character = "*";

creatureTypes.register(Lichen);

function findDirections(surroundings, wanted) {
  var found = [];
  directions.each(function(name) {
    if (surroundings[name] == wanted)
      found.push(name);
  });
  return found;
}
//==============================================
function LichenEater() {
  this.energy = 10;
}
LichenEater.prototype.act = function(surroundings) {
  var emptySpace = findDirections(surroundings, " ");
  var lichen = findDirections(surroundings, "*");

  if (this.energy >= 30 && emptySpace.length > 0)
    return {type: "reproduce", direction: randomElement(emptySpace)};
  else if (lichen.length > 0)
    return {type: "eat", direction: randomElement(lichen)};
  else if (emptySpace.length > 0)
    return {type: "move", direction: randomElement(emptySpace)};
  else
    return {type: "wait"};
};
LichenEater.prototype.character = "c";

creatureTypes.register(LichenEater);
//==============================================
var lichenPlan =
  ["############################",
   "#                     ######",
   "#    ***                **##",
   "#   *##**         **  c  *##",
   "#    ***     c    ##**    *#",
   "#       c         ##***   *#",
   "#                 ##**    *#",
   "#   c       #*            *#",
   "#*          #**       c   *#",
   "#***        ##**    c    **#",
   "#*****     ###***       *###",
   "############################"];

var terrarium = new LifeLikeTerrarium(lichenPlan);
terrarium.start();
terrarium.stop();
//==============================================

//==============================================
//==============================================
