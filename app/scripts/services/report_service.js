'use strict';

angular.module('frontEndApp')
  .service('ReportService', ['$http', function($http) {

    this.getReports = function(userId){
        return $http.get('/api/reports/' + userId).then(
          function(response){
              return response.data;
          },
          function(){
              return [];
          }
        );
    };

    this.getReport = function(userId, numDays) {
       return $http.get('/api/report/' + userId,
           {
               params: {num_days: numDays}
           }).then(
           function(response) {
               return response.data;
           },
           function(){
               return [];
           }
       )
    };

  }]);
