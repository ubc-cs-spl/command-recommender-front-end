'use strict';

angular
  .module('frontEndApp', [
    'ngCookies',
    'ngResource',
    'ngSanitize',
    'ngRoute'
  ])
  .config(['$routeProvider', function ($routeProvider) {
    $routeProvider
      .when('/:userId/:current', {
        templateUrl: 'views/main.html',
        controller: 'RecommendationController'
      })
        .when('/:userId', {
            redirectTo: '/:userId/current'
        })
      .when('/', {
            templateUrl: 'views/invalid-user.html'
        })
      .otherwise({
        redirectTo: '/'
      });
  }]);
