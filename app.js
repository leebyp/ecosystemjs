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
    $scope.terranium = new LifeLikeTerrarium(lichenPlan);
    $scope.terranium.start();
  }
  $scope.stopSim = function(){
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