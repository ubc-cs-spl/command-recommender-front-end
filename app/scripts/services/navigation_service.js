'use strict';

angular.module('frontEndApp')
  .service('NavigationService', ['$rootScope', function($rootScope) {
        this.userId = {};
        this.current = {};

        this.updateNavigation = function(userId, current){
            this.userId = userId;
            this.current = current;
            $rootScope.$broadcast('navigationUpdated');
        }
  }]);
