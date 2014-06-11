'use strict';

function createControllerAndTestGetData($httpBackend, createController, $rootScope, returnedCommand) {
    $httpBackend.expectGET('/api/get_recommendations/abcde/current');
    var controller = createController();
    $httpBackend.flush();
    expect($rootScope.recommendations).toEqual(returnedCommand);
}
describe('Controller: RecommendationController', function () {
    var $httpBackend, $rootScope, createController;
  // load the controller's module
  beforeEach(module('frontEndApp'));

  var RecommendationController,
    scope;
    var returnedCommand =  [{
        "command_detail_id":"53924ce24804dd6a9d000063",
        "created_on": "2014-06-06",
        "id":"53924ce24804dd6a9d000064",
        "new_recommendation":true,
        "reason":"Dicta adipisci sunt odit qui sint voluptatem.",
        "useful":false,
        "user_id":"abcdef",
        "command_detail":{
            "command_id":"com.eclipse.Dooley-Prohaska",
            "command_name":"Dooley-Prohaska",
            "description":"Repellendus aliquam illo. Aspernatur cupiditate rerum corporis magnam enim. Eum error enim ducimus. Sit non libero quia itaque delectus esse. Rerum molestiae quia aut corporis possimus consequuntur dolores. Minus et at. Officia assumenda perspiciatis sed voluptas error quasi.",
            "id":"53924ce24804dd6a9d000063",
            "shortcut":"Shift + Ctrl+5"
        }
    }];

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($injector) {
      $httpBackend = $injector.get('$httpBackend');
      $httpBackend.when('GET', '/api/get_recommendations/abcde/current').respond(returnedCommand);
      $httpBackend.when('GET', '/api/mark_recommendation/53924ce24804dd6a9d000064?useful=false').respond(200);
      $rootScope = $injector.get('$rootScope');
      var $controller = $injector.get('$controller');
      createController = function() {
         return  $controller('RecommendationController', {
             $scope: $rootScope,
             $routeParams: {'userId': 'abcde', 'current': 'current'}
          });
      };
  }));



  it('should get data from the server',function(){
      createControllerAndTestGetData($httpBackend, createController, $rootScope, returnedCommand);
  });

  it('should mark item as useful', function(){
      createControllerAndTestGetData($httpBackend, createController, $rootScope, returnedCommand);
      $httpBackend.expectGET('/api/mark_recommendation/53924ce24804dd6a9d000064?useful=false');
      $rootScope.markAsUseful(false, 0);
      $httpBackend.flush();
      expect($rootScope.recommendations[0].useful).toBe(false);
  });

  it('isUsefulSelected returns the correct usefulness when passed null, true or false', function(){
      createControllerAndTestGetData($httpBackend, createController, $rootScope, returnedCommand);
      expect($rootScope.isUsefulSelected(null)).toBe(false);
      expect($rootScope.isUsefulSelected(true)).toBe(true);
      expect($rootScope.isUsefulSelected(false)).toBe(false);
  });

  it('should return the correct boolean when isNotUseful is passed null, true or false', function(){
      createControllerAndTestGetData($httpBackend, createController, $rootScope, returnedCommand);
      expect($rootScope.isNotUsefulSelected(null)).toBe(false);
      expect($rootScope.isNotUsefulSelected(false)).toBe(true);
      expect($rootScope.isNotUsefulSelected(true)).toBe(false);
  });
});
