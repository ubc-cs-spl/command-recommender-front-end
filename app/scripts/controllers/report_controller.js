'use strict';

angular.module('frontEndApp')
    .controller('ReportController',
    ['$scope', '$routeParams', 'NavigationService', 'ReportService', 'RecommendationService',
        function ($scope, $routeParams, NavigationService, ReportService, RecommendationService) {
            //TODO: refactor
            NavigationService.updateNavigation($routeParams.userId, 'report');

            $scope.validUser = {};
            $scope.period = 7;

            $scope.options = {
                responsive : true
            };
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

            var init = function() {
                $scope.initialized = false;
                $scope.isStatsAvailable = false;
                $scope.reports = [];
                $scope.newlyLearnedCommands = [];
                $scope.commandStatChartData = [];
                $scope.colors = [];
                $scope.recommendations = [];
                $scope.report = [];
                $scope.barchartData.labels =[];
                $scope.barchartData.datasets[0].data = [];
                $scope.barchartData.datasets[1].data = [];
            }

            //TODO refactor this logic as it's repeated a lot in the code base
            $scope.isValidUser = function(){
                RecommendationService.isValidUser($routeParams.userId).then(function(valid){
                    $scope.validUser = valid;
                });
            };
            $scope.isValidUser();

            $scope.getReport = function() {
                init();
                ReportService.getReport($routeParams.userId, $scope.period).then(function(data) {
                    var stats = data.stats;
                    if (stats.length > 0) {
                        $scope.isStatsAvailable = true;
                    }
                    var totalCount = data.total_invocation;
                    var hue = 0;
                    for(var i=0; i<stats.length; i += 1){
                        var cmd = stats[i];
                        var name = cmd.name || 'Missing';
                        var shortcut = cmd.shortcut;
                        var useCount = cmd.use_count;
                        var hotkeyCount = cmd.hotkey_count;
                        if (cmd.new) {
                            $scope.newlyLearnedCommands.push({
                                name: name,
                                shortcut: shortcut
                            })
                        }
                        $scope.commandStatChartData.push({
                            value: useCount,
                            color: $scope.getHslColor(hue, 90, 57),
                            highlight: $scope.getHslColor(hue, 100, 50),
                            label: name
                        });
                        hue += 360 / totalCount * useCount;
                        if (hotkeyCount < useCount) {
                            $scope.barchartData.labels.push(name + (shortcut ? " (" + shortcut + ")" : ""));
                            $scope.barchartData.datasets[0].data.push(useCount);
                            $scope.barchartData.datasets[1].data.push(hotkeyCount);
                        }
                    }
                    $scope.initialized = true;
                })
            };
            $scope.getReport();

            $scope.getHslColor = function(h, s, l){
                return "hsl(" + h + "," + s + "%," + l + "%)";
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
            $scope.getRecommendations();

        }]);
