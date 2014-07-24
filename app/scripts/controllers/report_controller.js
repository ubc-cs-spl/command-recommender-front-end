'use strict';

angular.module('frontEndApp')
  .controller('ReportController', ['$scope', '$routeParams', 'NavigationService', 'ReportService', function ($scope, $routeParams, NavigationService, ReportService) {
        NavigationService.updateNavigation($routeParams.userId, 'report');

        $scope.reports = {};

        $scope.getReports = function(){
            ReportService.getReports($routeParams.userId).then(function(data){
                $scope.reports = data;
            });
        }

        $scope.getReports();
  }]);
