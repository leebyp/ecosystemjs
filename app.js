var app = angular.module('app', ['ngRoute']);

app.controller('HomeController', function($scope, $http){
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
  $scope.arr = []
  for (var i=0; i<$scope.plan.length; i++){
    var row = [];
    for (var j=0; j<$scope.plan[i].length; j++){
      row.push($scope.plan[i][j]);
    }
    $scope.arr.push(row);
  }

  // $scope.invalid = false;
  $scope.submit = function(){
    Terrarium.prototype.start = function() {
      if (!this.running)
        this.running = setInterval(bind(function(){
          this.step();
          console.log(this.toString())
          console.log('hello world!')
        }
          , this), 500);
    };

    $scope.terranium = new LifeLikeTerrarium($scope.plan);
    $scope.terranium.start();
  }

  $scope.stopSim = function(){
    Terrarium.prototype.stop = function() {
      if (this.running) {
        clearInterval(this.running);
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