/**
 * Created by spencer on 10/07/14.
 */
'use strict';

angular.module('frontEndApp')
    .controller('CommandDetailController',
    [
        '$scope',
        '$http',
        '$modal',
        '$routeParams',
        'CommandService',
        'NavigationService',
    function ($scope, $http, $modal, $routeParams, CommandService, NavigationService) {
        $scope.results = [];

        $scope.commandUnderEdit = {};
        $scope.searched = false;
        $scope.filter = "no_details";
        $scope.currentPage = 0;
        $scope.itemsPerPage = 10;

        NavigationService.updateNavigation($routeParams.userId, 'command_detail');
        var modalOptions = {
            templateUrl: 'views/modals/edit-command.html',
            controller: 'ModalCommandController'
        };

        var modalInstance;

        $scope.search = function() {
            $http.get('api/command_details/filter/command_id',
                {
                    'params': {
                        'filter_value': $scope.searchValue,
                        'filter': $scope.filter
                    }
                })
                .success(function (data) {
                    $scope.results = data;
                    $scope.currentPage = 0;
                    $scope.searched = true;
                })
                .error(function () {
                    $scope.searched = true;
                });
        };

        $scope.showCommand = function(command_id, index){
            CommandService.retrieveCommand(command_id).then(function(){
                modalInstance = $modal.open(modalOptions);
                modalInstance.result.then(function(commandUnderEdit){
                    $scope.results[index] = commandUnderEdit;
                })
            });
        };


}]);