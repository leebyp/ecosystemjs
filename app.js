var app = angular.module('app', ['ngRoute']);

app.controller('HomeController', function($scope, $http, $interval){
  $scope.plan = 
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
  $scope.terranium = new LifeLikeTerrarium($scope.plan);
  $scope.arr = []
  for (var i=0; i<$scope.plan.length; i++){
    var row = [];
    for (var j=0; j<$scope.plan[i].length; j++){
      row.push($scope.plan[i][j]);
    }
    $scope.arr.push(row);
  }

  // $scope.invalid = false;
  $scope.startSim = function(){
    Terrarium.prototype.start = function() {
      if (!this.running)
        this.running = $interval(bind(function(){
          this.step();
          var gridString = this.toString()
          var grid = gridString.split('\n');
          $scope.plan = grid;
          grid.pop();
          // console.log('hello world!')
          // console.log(grid);
          // console.log($scope.plan);
          $scope.arr = []
          for (var i=0; i<grid.length; i++){
            var row = [];
            for (var j=0; j<grid[i].length; j++){
              row.push(grid[i][j]);
            }
            $scope.arr.push(row);
          }
          // console.log(grid);
          // console.log($scope.arr);
        }
          , this), 1000);
    };

    $scope.terranium.start()
  }

  $scope.stopSim = function(){
    Terrarium.prototype.stop = function() {
      if (this.running) {
        $interval.cancel(this.running);
        this.running = null;
      }
    };
    $scope.terranium.stop();
  }

})

app.config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {
  $routeProvider
   .when('/', {
    templateUrl: 'home.html',
    controller: 'HomeController'
  })
  $locationProvider.html5Mode(true);
}]);