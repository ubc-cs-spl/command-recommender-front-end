'use strict';

angular
  .module('frontEndApp', [
        'ngCookies',
        'ngResource',
        'ngSanitize',
        'ngRoute',
        'ui.bootstrap',
        'angles'
    ])
  .config(['$routeProvider', function ($routeProvider) {
    $routeProvider
        .when('/command_detail/:userId',{
            templateUrl: '../views/command-detail.html',
            controller: 'CommandDetailController'
        })
        .when('/reports/:userId', {
            templateUrl: '../views/report.html',
            controller: 'ReportController'
        })
        .when('/recommendations/all/:userId',{
            templateUrl: '../views/all-recommendations.html',
            controller: 'AllRecommendationsController'
        })
        .when('/:userId', {
            redirectTo: '/recommendations/current/:userId'
        })
        .when('/recommendations/:current/:userId', {
            templateUrl: '../views/current-recommendations.html',
            controller: 'CurrentRecommendationsController'
        })
      .when('/', {
            templateUrl: '../views/invalid-route.html'
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
