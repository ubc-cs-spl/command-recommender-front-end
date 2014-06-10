'use strict';

angular.module('frontEndApp')
  .controller('NavigationController', ['$scope', '$routeParams', function ($scope, $routeParams) {
        $scope.userId = $routeParams.userId;
        $scope.current = $routeParams.current;
  }]);
