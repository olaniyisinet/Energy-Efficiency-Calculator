(function () {
  'use strict';

  function FaqController($scope, $rootScope, $location, $window) {

    $scope.message = 'Hello';
    $scope.iFrameHeight = '377';
    $scope.windowWidth = $(window).width();
    $window.document.title = 'Heat Engineer FAQ';

    if ($scope.windowWidth < 768) {
      $scope.iFrameHeight = '300';
    } else if ($scope.windowWidth < 480) {
      $scope.iFrameHeight = '200';
    }

    $rootScope.showHeader = false;
    $rootScope.showFooter = false;
    $rootScope.heatmanagerview = true;

    let routeName = $location.path();
    if (routeName == '/' || routeName == '/home') {
      $rootScope.showHeader = true;
      $rootScope.showFooter = true;
    } else {
      $rootScope.showHeader = false;
      $rootScope.showFooter = false;
    }

  }



  angular.module('cloudheatengineer').controller('FaqController', ['$scope','$rootScope','$location', '$window', FaqController]);

}());
