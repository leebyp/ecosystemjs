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
  // $scope.invalid = false;
  // $scope.submit = function(){
  //   for (var i=0; i<$scope.plan.length; i++){
  //     if ($scope.plan[i].length !== $scope.width){
  //       $scope.invalid = true;
  //       return;
  //     }
  //     if (!$scope.plan[i].match(/^[#.c]/)){
  //       $scope.invalid = true;
  //       return
  //     }
  //   }
  // }
  $scope.arr = []
  for (var i=0; i<$scope.plan.length; i++){
    var row = [];
    for (var j=0; j<$scope.plan[i].length; j++){
      row.push($scope.plan[i][j]);
    }
    $scope.arr.push(row);
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