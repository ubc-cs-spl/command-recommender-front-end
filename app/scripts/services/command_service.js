'use strict';

angular.module('frontEndApp')
  .service('CommandService', ['$http', function($http) {
        this.currentCommand = {};
        var _this = this;
        this.retrieveCommand = function(command_id){
            return $http.get('api/command_details/' +  command_id + '/show')
                .then(function(response){
                    _this.currentCommand = response.data;
                    return response.data;
                }, function(response){
                    return null;
                });
        };

        this.saveCommand = function(command){
            return $http.post('api/command_details/' + command.id + '/update/',
                {
                    'command_name': command.command_name,
                    'description': command.description,
                    'shortcut': command.shortcut
                }).then(function(response){
                     return true;
                }, function(response){
                    return false;
                });
        };
  }]);
