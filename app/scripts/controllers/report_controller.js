'use strict';

angular.module('frontEndApp')
    .controller('ReportController',
    ['$scope',
        '$routeParams',
        '$modal',
        'CommandService',
        'NavigationService',
        'ReportService',
        'RecommendationService',
        function ($scope,
                  $routeParams,
                  $modal,
                  CommandService,
                  NavigationService,
                  ReportService,
                  RecommendationService) {
            
            var ALGORITHM = 'MOST_WIDELY_USED'; //'mixed'  for supporting recommendations from different algorithms

            var modalOptions = {
                templateUrl: 'views/modals/edit-command.html',
                controller: 'ModalCommandController'
            };

            var modalInstance;
            //TODO: refactor
            NavigationService.updateNavigation($routeParams.userId, 'report');

            var getHslColor = function(h, s, l){
                return 'hsl(' + h + ',' + s + '%,' + l + '%)';
            };

            $scope.validUser = {};
            $scope.period = 7;

            $scope.options = {
                responsive : true,
                dblclickAction : function(segment) {
                    if (segment.id === 'other') {
                        $scope.showOther = true;
                        $scope.$apply();
                    } else {
                        CommandService.retrieveCommand(segment.id).then(function () {
                            modalInstance = $modal.open(modalOptions);
                            modalInstance.result.then(function (commandUnderEdit) {

                            })
                        });
                    }
                }
            };

            $scope.barchartData = {
                labels : [],
                datasets : [
                    {
                        label: 'Command invocation not using shortcuts',
                        fillColor: 'rgba(220,220,220,0.5)',
                        strokeColor: 'rgba(220,220,220,0.8)',
                        highlightFill: 'rgba(220,220,220,0.75)',
                        highlightStroke: 'rgba(220,220,220,1)',
                        data: []
                    },
                    {
                        label: 'Command invocations using shortcuts',
                        fillColor: 'rgba(151,187,205,0.5)',
                        strokeColor: 'rgba(151,187,205,0.8)',
                        highlightFill: 'rgba(151,187,205,0.75)',
                        highlightStroke: 'rgba(151,187,205,1)',
                        data: []
                    }
                ]
            };

            var init = function() {
                $scope.initialized = false;
                $scope.showOther = false;
                $scope.reports = [];
                $scope.newlyLearnedCommands = [];
                $scope.commandStatChartData = [];
                $scope.otherCommandStatChartData = [];
                $scope.colors = [];
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
                    $scope.isStatsAvailable = stats.length > 0;
                    var totalCount = data.total_invocation;
                    var otherCount = 0;
                    var hue = 0;
                    var topCommandsCount = 0;
                    for(var i=0; i<stats.length; i += 1){
                        var cmd = stats[i];
                        var name = cmd.name || 'Missing';
                        var shortcut = cmd.shortcut;
                        var useCount = cmd.use_count;
                        var hotkeyCount = cmd.hotkey_count;
                        var sectionData = {
                            value: useCount,
                            critical: hotkeyCount,
                            color: getHslColor(hue, 90, 50),
                            highlight: getHslColor(hue, 100, 65),
                            label: name,
                            id : cmd._id
                        };
                        if (useCount/totalCount < 0.01) {
                            otherCount = totalCount - topCommandsCount;
                            $scope.otherCommandStatChartData.push(sectionData);
                        } else {
                            topCommandsCount += useCount;
                            $scope.commandStatChartData.push(sectionData);
                        }
                        if (cmd.new) {
                            $scope.newlyLearnedCommands.push({
                                name: name,
                                shortcut: shortcut
                            })
                        }
                        hue += 360 / totalCount * useCount;
                        $scope.barchartData.labels.push(name + (shortcut ? ' (' + shortcut + ')' : ''));
                        $scope.barchartData.datasets[0].data.push(useCount - hotkeyCount);
                        $scope.barchartData.datasets[1].data.push(hotkeyCount);
                    }
                    $scope.commandStatChartData.push({
                        value: otherCount,
                        critical: otherCount,
                        color: getHslColor(0, 0, 50),
                        highlight: getHslColor(0, 0, 65),
                        label: 'Other',
                        id : 'other'
                    })
                    $scope.initialized = true;
                })
            };
            $scope.getReport();

            $scope.getRecommendations = function() {
                RecommendationService
                    .getRecommendations($routeParams.userId, 'current',
                    ALGORITHM).then(function(data) {
                        if (data != null) {
                            $scope.recommendations = data;
                            $scope.rec = data[0];
                        }
                    });
            };
            $scope.getRecommendations();
            $scope.setRec = function(recommendation) {
                $scope.rec = recommendation;
            };
        }]);
