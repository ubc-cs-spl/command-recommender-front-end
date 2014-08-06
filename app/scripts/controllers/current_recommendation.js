'use strict';

angular.module('frontEndApp')
  .controller('CurrentRecommendationsController', ['$scope', '$routeParams', 'RecommendationService', 'NavigationService',function ($scope, $routeParams, RecommendationService,NavigationService) {
        $scope.filterParams = {};
        $scope.validUser = {};
        $scope.initialized = false;
        $scope.algorithmTypes = {};
        $scope.chunkedRecommendations = [];

        NavigationService.updateNavigation($routeParams.userId, $routeParams.current);

        $scope.isValidUser = function(){
            RecommendationService.isValidUser($routeParams.userId).then(function(valid){
                $scope.validUser = valid;
            });
        };
        $scope.isValidUser();

        $scope.getAlgorithmTypes = function(){
            return RecommendationService.getAlgorithmTypes($routeParams.userId).then(function(data){
                $scope.algorithmTypes = data;
                $scope.currentAlgorithmType = data[0];
            });
        };

        function chunk(recommendations) {
            if(recommendations.length == 0){
                return [];
            }
            var chunked_recommendations = [];
            var current_row = 0;
            for(var i=0; i<recommendations.length/2; i++){
                chunked_recommendations[i] = recommendations.slice(current_row, current_row+2);
                current_row+=2;
            }
            return chunked_recommendations;
        }

        $scope.getRecommendations = function(){
            RecommendationService.getRecommendations($routeParams.userId, $routeParams.current,
                                                        $scope.currentAlgorithmType).then(function(data){
                $scope.chunkedRecommendations = chunk(data);
                $scope.initialized = true;
            });
        };


        $scope.getAlgorithmTypes().then(function(){
            $scope.getRecommendations();
        });

        $scope.markAsUseful = function(useful, recommendation){
            RecommendationService.markAsUseful(useful, recommendation).then();
        };

        $scope.saveRecommendation = function(saved, recommendation, parentIndex, index){
            RecommendationService.saveRecommendation(saved, recommendation).then(function(success){
                if(saved && success){
                    $scope.chunkedRecommendations[parentIndex].splice(index, 1);
                }
            });
        };

        $scope.isUsefulSelected = function(recommendation){
            if(recommendation == null){
                return false;
            }else{
                return recommendation;
            }
        };

        $scope.isNotUsefulSelected = function(recommendation){
            if(recommendation == null){
                return false;
            }else{
                return !recommendation;
            }
        };
  }]);
