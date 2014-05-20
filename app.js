var app = angular.module('app', ['ngRoute']);

app.service('CellService', function(){
  this.plan = 
    ["############################",
     "#.....................######",
     "#....***................**##",
     "#...*##**.........**..c..*##",
     "#....***.....c....##**....*#",
     "#.......c.........##***...*#",
     "#.................##**....*#",
     "#...c.......#*............*#",
     "#*..........#**.......c...*#",
     "#***....##**....c........**#",
     "#*****.....###***.......*###",
     "############################"];
  this.terranium = new LifeLikeTerrarium(this.plan);
  this.arr = []
  for (var i=0; i<this.plan.length; i++){
    var row = [];
    for (var j=0; j<this.plan[i].length; j++){
      row.push(this.plan[i][j]);
    }
    this.arr.push(row);
  }
});

app.controller('HomeController', function($scope, $http, $interval, CellService){
  $scope.CellService = CellService

  // $scope.invalid = false;
  $scope.startSim = function(){
    Terrarium.prototype.start = function() {
      console.log('start function being run')
      if (!this.running)
        this.running = $interval(bind(function(){
          this.step();
          var gridString = this.toString()
          var grid = gridString.split('\n');
          CellService.plan = grid;
          grid.pop();
          // console.log('hello world!')
          // console.log(grid);
          // console.log($scope.plan);
          CellService.arr = []
          for (var i=0; i<grid.length; i++){
            var row = [];
            for (var j=0; j<grid[i].length; j++){
              row.push(grid[i][j]);
            }
            CellService.arr.push(row);
          }
          // console.log(grid);
          // console.log($scope.arr);
        }
          , this), 1000);
    };
    console.log('hello');
    CellService.terranium.start()
  }

  $scope.stopSim = function(){
    Terrarium.prototype.stop = function() {
      if (this.running) {
        $interval.cancel(this.running);
        this.running = null;
      }
    };
    CellService.terranium.stop();
  }

  // $scope.loadMap = function(){
  //   console.log($scope.terranium.toString())
  // }

})

app.config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {
  $routeProvider
   .when('/', {
    templateUrl: 'home.html',
    controller: 'HomeController'
  });
  $locationProvider.html5Mode(true);
}]);