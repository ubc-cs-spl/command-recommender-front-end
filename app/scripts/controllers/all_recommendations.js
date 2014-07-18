'use strict';

angular.module('frontEndApp')
  .controller('AllRecommendationsController',
    ['$scope',
        '$routeParams',
        '$modal',
        'NavigationService',
        'RecommendationService',
        'CommandService',
    function ($scope, $routeParams, $modal, NavigationService, RecommendationService, CommandService) {
        $scope.currentAlgorithmType = "MOST_WIDELY_USED";
        $scope.validUser = {};
        $scope.initialized = false;
        $scope.algorithmTypes = {};
        $scope.currentPage = 0;
        $scope.itemsPerPage = 10;
        $scope.recommendations = [];

        var modalOptions = {
            templateUrl: 'views/modals/edit-command.html',
            controller: 'ModalCommandController'
        };

        var modalInstance;

        NavigationService.updateNavigation($routeParams.userId, 'all');

        $scope.isValidUser = function(){
            RecommendationService.isValidUser($routeParams.userId).then(function(valid){
                $scope.validUser = valid;
            });
        };

        $scope.getAlgorithmTypes = function(){
            return RecommendationService.getAlgorithmTypes($routeParams.userId).then(function(data){
                $scope.algorithmTypes = data;
                $scope.currentAlgorithmType = data[0];
            });
        };

        $scope.getRecommendations = function(){
            RecommendationService.getRecommendations($routeParams.userId, 'all',
                $scope.currentAlgorithmType).then(function(data){
                    $scope.recommendations = data;
                    $scope.initialized = true;
                });
        };

        $scope.isValidUser();

        $scope.getAlgorithmTypes().then(function(){
            $scope.getRecommendations();
        });

        $scope.showCommand = function(command_id, index){
            CommandService.retrieveCommand(command_id).then(function(){
                modalInstance = $modal.open(modalOptions);
                modalInstance.result.then(function(commandUnderEdit){
                    $scope.recommendations[index].command_detail = commandUnderEdit;
                })
            });
        };
  }]);
