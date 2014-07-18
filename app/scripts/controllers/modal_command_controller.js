'use strict';

angular.module('frontEndApp')
  .controller('ModalCommandController', ['$scope', '$modalInstance', 'CommandService', function ($scope, $modalInstance, CommandService) {
        $scope.currentCommand = CommandService.currentCommand;
        $scope.originalCommand = angular.copy($scope.currentCommand);
        $scope.saved = false;
        $scope.failedToSave = false;

        $scope.saveCommand = function(){
            CommandService.saveCommand($scope.currentCommand).then(function(saved){
                if(saved){
                    $scope.saved = true;
                    $scope.failedToSave = false;
                }else{
                    $scope.saved = false;
                    $scope.failedToSave = true;
                }
            });
        };

        $scope.cancel = function(){
            CommandService.command = {};
            if($scope.saved) {
                $modalInstance.close($scope.currentCommand);
            }else{
                $modalInstance.close($scope.originalCommand);
            }
        };

  }]);
