'use strict';

angular.module('frontEndApp')
  .service('ReportService', ['$http', function($http) {
    this.getReports = function(userId){
        return $http.get('/api/reports/'+userId).then(
          function(response){
              return response.data;
          },
          function(){
              return null;
          }
        );
    };
  }
    ]);
