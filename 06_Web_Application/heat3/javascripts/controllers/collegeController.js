(function () {
  'use strict';

  function CollegeController($scope, $rootScope, $location, $window) {

    $scope.message = 'Hello';
    $scope.iFrameHeight = '377';
    $scope.windowWidth = $(window).width();
    $window.document.title = 'Heat Engineer College';

    if ($scope.windowWidth < 768) {
      $scope.iFrameHeight = '300';
    } else if ($scope.windowWidth < 480) {
      $scope.iFrameHeight = '200';
    }
    $rootScope.heatmanagerview = true;

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



  angular.module('cloudheatengineer').controller('CollegeController', ['$scope','$rootScope','$location', '$window', CollegeController]);

}());
