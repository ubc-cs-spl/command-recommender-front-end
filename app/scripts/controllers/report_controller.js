'use strict';

angular.module('frontEndApp')
  .controller('ReportController', ['$scope', '$routeParams', 'NavigationService', 'ReportService', function ($scope, $routeParams, NavigationService, ReportService) {
        NavigationService.updateNavigation($routeParams.userId, 'report');

        $scope.reports = {};
        $scope.commandStatChartData = [];
        $scope.colors = ["#F7464A", "#E2EAE9", "#D4CCC5", "#949FB1", "#949FB1"];

        $scope.getReports = function(){
            ReportService.getReports($routeParams.userId).then(function(data){
                $scope.reports = data;
                $scope.createCommandStatChart($scope.reports[0].command_stats);
            });
        };

        $scope.createCommandStatChart = function(command_stat){

            var i;
            for(i=0; i<command_stat.length; i++){
                var name;
                if(angular.isUndefined(command_stat[i].command_detail)){
                    name = "Mising";
                }else{
                    name = command_stat[i].command_detail.name;
                }
                $scope.commandStatChartData.push({
                    value: command_stat[i].use_count,
                    color: $scope.colors[i % command_stat.length],
                    label: name
                });
            }
        };
        $scope.getReports();



        $scope.options = {
            //Boolean - Whether we should show a stroke on each segment
            segmentShowStroke : false,

            //String - The colour of each segment stroke
            segmentStrokeColor : "#fff",

            //The percentage of the chart that we cut out of the middle.
            percentageInnerCutout : 50,

            //Boolean - Whether we should animate the chart
            animation : false,

            showTooltips: true,
            tooltipTemplate: "<%if (label){%><%=label%>: <%}%><%= value %>"
        };
  }]);
