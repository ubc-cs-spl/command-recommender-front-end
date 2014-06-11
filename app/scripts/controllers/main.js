'use strict';

angular.module('frontEndApp')
  .controller('RecommendationController', ['$scope', '$http', '$routeParams', '$location', function ($scope, $http, $routeParams, $location) {
        $scope.recommendations = {};
        $scope.filterParams = {};
        function getRecommendations(){
                $http.get('/api/get_recommendations/' + $routeParams.userId + '/' + $routeParams.current).success(function(data){
                    if(data.length === 0){
                        $location.url('/');
                    }

                    $scope.recommendations = data;

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
