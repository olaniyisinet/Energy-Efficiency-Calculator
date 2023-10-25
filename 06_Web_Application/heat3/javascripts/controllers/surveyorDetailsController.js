(function () {
  'use strict';

  var app = angular.module('cloudheatengineer');

  /**
   * Dashboard Controller
   */
  app.controller('SurveyorDetailsController', SurveyorDetailsController);

  SurveyorDetailsController.$inject = ['$rootScope', '$scope', '_', 'apiService', '$location', '$routeParams'];

  function SurveyorDetailsController ($rootScope, $scope, _, apiService, $location, $routeParams) {

    $scope.surveyorsList = []
    $scope.searchVal = ""
    $rootScope.showHeader = false;
    $rootScope.showFooter = false;
    $rootScope.heatmanagerview = true;

    function init () {
      let user = JSON.parse(window.localStorage.getItem('user'));
      if(user) {
        $scope.userDetails = user;
      }
      apiService.get('surveyorByIdNoAuth', {
        _id: $routeParams.id
      }).then(function (surveyor) {
        $scope.userDetails = surveyor
      })

    }
    $scope.moveTo = function (page) {
      let loggedUser = JSON.parse(window.localStorage.getItem('user'))
      if (page == 'edit') {
        $location.path('/surveyor-details-update/' + $routeParams.id);
      } else {
        if (!loggedUser) {
          $location.path('/search-engineers');
        } else {
          if (loggedUser.is_surveyor)
            $location.path('/search-engineers');
          else
            $location.path('/dashboard');
        }
      }
    }

    init()
  }

})();
