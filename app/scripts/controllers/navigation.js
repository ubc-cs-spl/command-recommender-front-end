'use strict';

angular.module('frontEndApp')
  .controller('NavigationController', ['$scope', 'NavigationService', function ($scope, NavigationService) {
        $scope.userId = {};
        $scope.current = {};

        $scope.$on('navigationUpdated', function(){
            $scope.current = NavigationService.current;
            $scope.userId = NavigationService.userId;
        });
  }]);
