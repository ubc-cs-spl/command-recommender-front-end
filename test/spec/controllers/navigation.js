'use strict';

describe('Controller: NavigationController', function () {
    var createController, $rootScope;
  // load the controller's module
  beforeEach(module('frontEndApp'));

  var NavigationController,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($injector) {
      $rootScope = $injector.get('$rootScope');

      var $controller = $injector.get('$controller');

      createController = function(){
          return NavigationController = $controller('NavigationController', {
              $scope: $rootScope,
              $routeParams: {userId: "abcdef", current: "current"}
          });
      };

  }));

  it('should have the correct userId', function () {
    var controller = createController();
    expect($rootScope.userId).toBe("abcdef");
  });

  it('should have the correct current', function(){
      var controller = createController();
      expect($rootScope.current).toBe("current");
  });
});
