(function () {
  'use strict';

  var app = angular.module('cloudheatengineer');

  /**
   * Dashboard Controller
   */
  app.controller('ManufacturerDashboardController', ManufacturerDashboardController);
  app.controller('AboutManufacturerController', AboutManufacturerController);

  ManufacturerDashboardController.$inject = ['$rootScope','$window'];

  function ManufacturerDashboardController ($rootScope, $window) {

    $window.document.title = 'Heat Engineer Manufacturer';

    $rootScope.showHeader = false;
    $rootScope.showFooter = false;
    $rootScope.heatmanagerview = true;

  }

  AboutManufacturerController.$inject = ['$rootScope', '$window'];

  function AboutManufacturerController ($rootScope, $window) {

    $window.document.title = 'Heat Engineer About Manufacturer';

    $rootScope.showHeader = false;
    $rootScope.showFooter = false;
    $rootScope.heatmanagerview = true;

  }



})();
