'use strict';

angular
  .module('frontEndApp', [
    'ngCookies',
    'ngResource',
    'ngSanitize',
    'ngRoute',
    'ui.bootstrap'
  ])
  .config(['$routeProvider', function ($routeProvider) {
    $routeProvider
        .when('/command_detail/:userId',{
            templateUrl: 'views/command_detail.html',
            controller: 'CommandDetailController'
        })
        .when('/:userId', {
            redirectTo: '/recommendations/:userId/current'
        })
        .when('/recommendations/:userId/:current', {
            templateUrl: 'views/main.html',
            controller: 'RecommendationController'
        })
      .when('/', {
            templateUrl: 'views/invalid-user.html'
        })
      .otherwise({
        redirectTo: '/'
      });
  }])
    .filter('offset', function() {
        return function(input, start) {
            start = parseInt(start, 10);
            return input.slice(start);
        };
    });
