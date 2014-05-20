var app = angular.module('app', ['ngRoute']);

app.controller('HomeController', function($scope, $http){
  console.log('looking for the home controller');
})

app.config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {
  $routeProvider
   .when('/', {
    templateUrl: 'home.html',
    controller: 'HomeController'
  })
  $locationProvider.html5Mode(true);
}]);