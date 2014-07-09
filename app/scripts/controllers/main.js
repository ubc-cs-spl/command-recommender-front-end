'use strict';

angular.module('frontEndApp')
  .controller('RecommendationController', ['$scope', '$http', '$routeParams', '$location', function ($scope, $http, $routeParams, $location) {
        $scope.recommendations = {};
        $scope.filterParams = {};
        function getRecommendations(){
                $http.get('/api/get_recommendations/' + $routeParams.userId + '/' + $routeParams.current)
                    .success(function(data){
                        $scope.recommendations = data;
                    })
                    .error(function(){
                        $location.url('/');
                    });
        }
        getRecommendations();

        $scope.markAsUseful = function(useful, index){
            var recommendation = $scope.recommendations[index];
            $http.get('/api/mark_recommendation/' + recommendation.id, {
                params: {useful: useful}
            }).success(function(){
               recommendation.useful = useful;
            });
        };

        $scope.saveRecommendation = function(saved, index){
            var recommendation = $scope.recommendations[index];
            $http.get('/api/save_recommendation/' + recommendation.id, {
                params: {saved :saved}
            }).success(function(){
               recommendation.saved = saved;
            });
        }

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
