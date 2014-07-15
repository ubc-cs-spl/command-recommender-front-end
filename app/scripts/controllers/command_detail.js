/**
 * Created by spencer on 10/07/14.
 */
'use strict';

angular.module('frontEndApp')
    .controller('CommandDetailController', ['$scope', '$http', '$modal', function ($scope, $http, $modal) {
        $scope.results = [];

        $scope.commandUnderEdit = {};
        $scope.searched = false;
        $scope.saved = false;
        $scope.failedToSave = false;
        $scope.filter = "no_details";
        $scope.currentPage = 0;
        $scope.itemsPerPage = 10;

        var modalOptions = {
            templateUrl: 'views/modals/edit-command.html',
            scope: $scope
        };

        var modalInstance;

        $scope.close = function(){
            modalInstance.dismiss();
        }
        $scope.search = function(){
            $http.get('api/command_details/filter/command_id',
                {
                    'params': {
                        'filter_value': $scope.searchValue,
                        'filter': $scope.filter
                    }
                })
                .success(function(data){
                    $scope.results = data;
                    $scope.currentPage = 0;
                    $scope.searched = true;
                })
                .error(function(){
                    $scope.searched = true;
                });

        };

        $scope.showCommand = function(command_id){
            $http.get('api/command_details/' +  command_id + '/show')
                .success(function(data){
                    $scope.commandUnderEdit = data;
                    $scope.saved = false;
                    $scope.failedToSave = false;
                });
            modalInstance = $modal.open(modalOptions);
        };

        $scope.saveCommand = function(){
            if(!$scope.commandUnderEdit){
                $scope.failedToSave = true;
                return;
            }
            $http.post('api/command_details/' + $scope.commandUnderEdit.id + '/update/',
                {
                    'command_name': $scope.commandUnderEdit.command_name,
                    'description': $scope.commandUnderEdit.description,
                    'shortcut': $scope.commandUnderEdit.shortcut
                }).success(function(){
                    $scope.saved = true;
                }).
                error(function(){
                   $scope.failedToSave = true;
                });
        };

        $scope.prevPage = function(){
            if($scope.currentPage > 0){
                $scope.currentPage--;
            }
        };

        $scope.prevPageDisabled = function(){
            return $scope.currentPage === 0 ? "disabled" : "";
        };

        $scope.pageCount = function(){
            return Math.ceil($scope.results.length/$scope.itemsPerPage)-1;
        };

        $scope.nextPage = function(){
            if($scope.currentPage < $scope.pageCount()){
                $scope.currentPage++;
            }
        };

        $scope.nextPageDisabled = function(){
            return $scope.currentPage === $scope.pageCount() ? "disabled" : "";
        };

        $scope.setPage = function(page){
            $scope.currentPage = page;
        }

        $scope.range = function() {
            var rangeSize = 10;
            var ret = [];
            var start = 0;
            var end = rangeSize;
            if($scope.currentPage-rangeSize/2 > 0){
                start = $scope.currentPage - rangeSize/2;
            }
            if($scope.currentPage+rangeSize/2 > rangeSize){
                end = $scope.currentPage+rangeSize/2;
            }
            if(end > $scope.pageCount()){
                end = $scope.pageCount
            }

            for (var i=start; i<end; i++) {
                ret.push(i);
            }
            return ret;
        };
}]);