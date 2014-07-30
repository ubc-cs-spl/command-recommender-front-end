'use strict';

angular.module('frontEndApp')
    .service('RecommendationService', ['$http', function($http) {
        this.getRecommendations = function(userId, recommendationType, algorithmType){
            var promise = $http.get('/api/get_recommendations/' + userId + '/' + recommendationType,
                {
                    'params': {
                        "algorithm_type": algorithmType
                    }
                }).then(function(response){
                    return response.data;
                });
            return promise;
        };

        this.markAsUseful = function(useful, recommendation){
            return $http.get('/api/mark_recommendation/' + recommendation.id, {
                params: {useful: useful}
            }).then(function(response){
                recommendation.useful = useful;
                return recommendation;
            });
        };

        this.saveRecommendation = function(saved, recommendation){
            return $http.get('/api/save_recommendation/' + recommendation.id, {
                params: {saved :saved}
            }).then(function(response){
                recommendation.saved = saved;
                return true;
            }, function(response){
                return false;
            })
        };

        this.isValidUser = function(userId){
            return $http.get('/api/users/is_valid/' + userId)
                .then(function(response){
                    return response.data.valid;
                }, function(){
                    return false;
                });
        };

        this.getAlgorithmTypes = function(userId){
            return $http.get('api/recommendations/' + userId + '/algorithm_types')
                .then(function(response){
                    return response.data;
                }, function(){
                    return [];
                })
        }
    }]);
