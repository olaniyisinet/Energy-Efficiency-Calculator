(function () {
  'use strict';

  function SupplyChainController($scope, $rootScope,$window) {
    $window.document.title = 'Suppy Chain';
    $rootScope.showHeader = false;
    $rootScope.showFooter = false;
    $rootScope.heatmanagerview = true;

  }

  angular.module('cloudheatengineer').controller('SupplyChainController', ['$scope','$rootScope','$window', SupplyChainController]);

}());
