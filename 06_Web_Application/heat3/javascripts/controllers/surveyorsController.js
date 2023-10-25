(function () {
  'use strict';

  function SurveyorsController ($rootScope, $scope, surveyorService, alertService, data, apiService, log, userService) {

    $scope.userDetails = $rootScope.user;
    $rootScope.showHeader = false;
    $rootScope.showFooter = false;
    $rootScope.heatmanagerview = true;

    if (!$rootScope.user.is_admin) {
      $scope.showInvite = false;
      if ($scope.userDetails.selectedPlan.plan !== 'none'
        && $scope.userDetails.selectedPlan.plan !== 'singleSurvey'
        && $scope.userDetails.selectedPlan.plan !== 'soleTrader') {
        if ($scope.userDetails.selectedPlan.plan == 'MonthlyPaymentPlanStandard'
          || $scope.userDetails.selectedPlan.plan == 'MonthlyPaymentPlan20employees'
          || $scope.userDetails.selectedPlan.plan == 'smallOrgYearly'
          || $scope.userDetails.selectedPlan.plan == 'largeOrgYearly'
          || $scope.userDetails.selectedPlan.plan == 'smeMonthly'
          || $scope.userDetails.selectedPlan.plan == 'smeYearly'
          || $scope.userDetails.selectedPlan.plan == 'smeWhiteLabeledMonthly'
          || $scope.userDetails.selectedPlan.plan == 'smeWhiteLabeledYearly'
          || $scope.userDetails.selectedPlan.plan == 'manufacturerYearly') {
          $scope.showInvite = true;
        }
      }
    } else {
      $scope.showInvite = true;
    }

    $('#myModal').on('shown.bs.modal', function () {
      $('#myInput').focus();
    });

    data.$promise.then(function (data) {
      $scope.surveyors = data;
    });

    //invite surveyor checkup
    $scope.surveyorsCounts = 0;
    data.$promise.then(function (response) {
      $scope.surveyorsCounts = response;
    });

    var errorHandler = function (error) {
      console.log(error)
      alertService('danger', 'There is an error occured! ', error.data.message);
    };

    $scope.changeTheme = function (color) {
      $rootScope.user.theme = color;
      userService.updateStorage($rootScope.user);
    };

    $scope.changeFont = function (fontType) {
      $rootScope.user.ui_theme.fontFamily = fontType;
      userService.updateStorage($rootScope.user);
    };

    $scope.changeBackground = function (style) {
      $rootScope.user.ui_theme.background = style.background;
      $rootScope.user.ui_theme.color = style.color;
      userService.updateStorage($rootScope.user);
    };

    $scope.submit = function () {
      $('#myModal').modal('toggle');
      // TODO: refactor using apiService
      surveyorService.invite($scope.email).then(function (response) {
        $scope.surveyors = response.surveyors;
        alertService('success', 'Invited', response.message);
      }, errorHandler);
    };

    $scope.delete = function (surveyor) {
      // TODO: refactor using apiService
      surveyorService.destroy(surveyor._id).then(function (response) {
        alertService('success', 'Surveyor Removed', response.message);
        var index = $scope.surveyors.indexOf(surveyor);
        $scope.surveyors.splice(index, 1);
        if ($scope.surveyors.length === 0) {
          $scope.surveyors = null;
        }
      }, errorHandler);
    };

    $scope.resend = function (surveyor) {

      apiService.save('_resend', { _id: surveyor._id }).then(function (response) {
        alertService('success', 'Invitation re-sent', response.message);
      }, errorHandler);
    };

    $scope.reset = function (surveyor) {
      apiService.resetSurveyorPassword.update({ _id: surveyor._id }, {}, function (response) {
        alertService('success', 'Password has been Changed', response.message);
      }, errorHandler);
    };
  }

  function InviteController ($rootScope, $scope, log, $location, apiService, alertService) {

    $scope.inviter_name = $location.search().name;
    $scope.user = {};
    $rootScope.showHeader = false;
    $rootScope.showFooter = false;

    var errorHandler = function (error) {
      alertService('danger', 'There is an error occured! ', error.message);
    };

    $scope.submit = function () {
      var user = {
        company_name: $scope.user.company_name,
        password: $scope.user.password,
        title: $scope.user.title,
        first_name: $scope.user.first_name,
        surname: $scope.user.surname,
        code: $location.search().code
      };

      var surveyor = new apiService._register(user);
      surveyor.$save().then(function (response) {
        alertService('success', 'Account Created!', 'Thank you ' + response.user.first_name + ' ' + response.user.surname + ' for registering!');
        $location.path('/registered-surveyor');
      }, errorHandler);
    };
  }

  angular
    .module('cloudheatengineer')
    .controller('SurveyorsController', ['$rootScope', '$scope', 'surveyorService', 'alertService', 'data', 'apiService', 'log', 'userService', SurveyorsController])
    .controller('InviteController', ['$rootScope', '$scope', 'log', '$location', 'apiService', 'alertService', InviteController]);
}());
