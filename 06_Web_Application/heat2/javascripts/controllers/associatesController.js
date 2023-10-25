(function () {
  'use strict';

  function AssociatesController($scope, $rootScope, $location, $window) {

    $window.document.title = 'Heat Engineer Associates';

    $scope.message = 'Hello';
    $scope.iFrameHeight = '377';
    $scope.windowWidth = $(window).width();
    $rootScope.heatmanagerview = true;

    if ($scope.windowWidth < 768) {
      $scope.iFrameHeight = '300';
    } else if ($scope.windowWidth < 480) {
      $scope.iFrameHeight = '200';
    }

    $rootScope.showHeader = false;
    $rootScope.showFooter = false;

    let routeName = $location.path();
    if (routeName == '/' || routeName == '/home') {
      $rootScope.showHeader = true;
      $rootScope.showFooter = true;
    } else {
      $rootScope.showHeader = false;
      $rootScope.showFooter = false;
    }

  }



  angular.module('cloudheatengineer').controller('AssociatesController', ['$scope','$rootScope','$location', '$window', AssociatesController]);

}());
