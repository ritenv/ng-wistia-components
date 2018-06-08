'use strict';

angular.module('myApp', [
  'ngRoute',
  'ngWistiaComponents'
])

.config(['$locationProvider', '$routeProvider', function($locationProvider, $routeProvider) {
  $locationProvider.hashPrefix('!');

  $routeProvider.otherwise({redirectTo: '/home'});

  $routeProvider.when('/home', {
    templateUrl: 'home/view.html'
  });

}]);
