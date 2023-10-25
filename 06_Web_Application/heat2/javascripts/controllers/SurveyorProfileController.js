(function () {
  'use strict';

  var app = angular.module('cloudheatengineer');

  /**
   * Dashboard Controller
   */
  app.controller('SurveyorProfileController', SurveyorProfileController);

  SurveyorProfileController.$inject = ['$rootScope', '$scope', 'userService', '_', 'apiService', 'alertService', 'lodash', '$location'];
  function SurveyorProfileController ($rootScope, $scope, userService, _, apiService, alertService, lodash, $location) {

    //controller functions goes here

  }
})();


