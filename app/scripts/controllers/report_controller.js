'use strict';

angular.module('frontEndApp')
    .controller('ReportController',
    ['$scope', '$routeParams', 'NavigationService', 'ReportService', 'RecommendationService',
        function ($scope, $routeParams, NavigationService, ReportService, RecommendationService) {
            //TODO: refactor
            NavigationService.updateNavigation($routeParams.userId, 'report');

            $scope.reports = [];
            $scope.newlyLearnedCommands = [];
            $scope.commandStatChartData = [];
            $scope.colors = [];
            $scope.recommendations = [];
            $scope.barchartData = {
                labels : [],
                datasets : [
                    {
                        label: "Total Command Invocations",
                        fillColor: "rgba(220,220,220,0.5)",
                        strokeColor: "rgba(220,220,220,0.8)",
                        highlightFill: "rgba(220,220,220,0.75)",
                        highlightStroke: "rgba(220,220,220,1)",
                        data: []
                    },
                    {
                        label: "Command Invocations through Shortcuts",
                        fillColor: "rgba(151,187,205,0.5)",
                        strokeColor: "rgba(151,187,205,0.8)",
                        highlightFill: "rgba(151,187,205,0.75)",
                        highlightStroke: "rgba(151,187,205,1)",
                        data: []
                    }
                ]
            };
            $scope.radarchartData = {
                labels: [],
                datasets: [
                    {
                        label: "My First dataset",
                        fillColor: "rgba(220,220,220,0.2)",
                        strokeColor: "rgba(220,220,220,1)",
                        pointColor: "rgba(220,220,220,1)",
                        pointStrokeColor: "#fff",
                        pointHighlightFill: "#fff",
                        pointHighlightStroke: "rgba(220,220,220,1)",
                        data: []
                    },
                    {
                        label: "My Second dataset",
                        fillColor: "rgba(151,187,205,0.2)",
                        strokeColor: "rgba(151,187,205,1)",
                        pointColor: "rgba(151,187,205,1)",
                        pointStrokeColor: "#fff",
                        pointHighlightFill: "#fff",
                        pointHighlightStroke: "rgba(151,187,205,1)",
                        data: []
                    }
                ]
            };

            $scope.getReports = function(){
                ReportService.getReports($routeParams.userId).then(function(data){
                    if (data != null) {
                        $scope.reports = data;
                    }
                    if ($scope.reports.length > 0) {
                        $scope.processCmdStats($scope.reports[0].command_stats,
                            $scope.reports[0].total_invocation);
                        $scope.newlyLearnedCommands = $scope.reports[0].newly_learned_commands;
                        //$scope.processNewlyLearnedCmds($scope.reports[0].newly_learned_commands);
                    }
                });
            };

            $scope.getHslColor = function(h, s, l){
                return "hsl(" + h + "," + s + "%," + l + "%)";
            };

            $scope.processCmdStats = function(commandStats, totalCount){
                var hue = 0;

                for(var i=0; i<commandStats.length; i++){
                    var name;
                    var shortcut;
                    var useCount = commandStats[i].use_count;
                    var hotkeyCount = commandStats[i].hotkey_count;
                    var commandDetail = commandStats[i].command_detail;
                    if (i != 0)
                        hue += 360/totalCount*useCount;
                    if(angular.isUndefined(commandDetail)){
                        name = "Missing";
                        shortcut = "";
                    }else{
                        name = commandDetail.command_name;
                        shortcut = angular.isUndefined(commandDetail.shortcut) ? "" : " (" + commandDetail.shortcut + ")";
                    }

                    $scope.barchartData.labels.push(name + shortcut);
                    $scope.barchartData.datasets[0].data.push(useCount);
                    $scope.barchartData.datasets[1].data.push(hotkeyCount);
                    if (hotkeyCount < useCount) {
                        $scope.radarchartData.labels.push(name + shortcut);
                        $scope.radarchartData.datasets[0].data.push(useCount);
                        $scope.radarchartData.datasets[1].data.push(hotkeyCount);
                    }
                    $scope.commandStatChartData.push({
                        value: useCount,
                        color: $scope.getHslColor(hue, 90, 57),
                        highlight: $scope.getHslColor(hue, 100, 50),
                        label: name
                    });
                }
            };

            $scope.options = {

                responsive : true,
                //Boolean - Whether we should show a stroke on each segment
                segmentShowStroke : true,

                //String - The colour of each segment stroke
                segmentStrokeColor : "#fff",

                //Number - The width of each segment stroke
                segmentStrokeWidth : 0,

                //Number - The percentage of the chart that we cut out of the middle
                percentageInnerCutout : 99, // This is 0 for Pie charts

                //Number - Amount of animation steps
                animationSteps : 100,

                //String - Animation easing effect
                animationEasing : "easeOutBounce",

                //Boolean - Whether we animate the rotation of the Doughnut
                animateRotate : true,

                //Boolean - Whether we animate scaling the Doughnut from the centre
                animateScale : false

            };

            $scope.getRecommendations = function() {
                RecommendationService
                    .getRecommendations($routeParams.userId, "current",
                    "MOST_WIDELY_USED").then(function(data) {
                        if (data != null) {
                            $scope.recommendations = data;
                        }
                    });
            };

            $scope.getReports();
            $scope.getRecommendations();

        }]);
