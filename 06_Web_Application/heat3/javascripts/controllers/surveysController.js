(function () {
  'use strict';

  function SurveysController ($rootScope, $routeParams, $scope, $location, surveyService, userService, apiService, commonService, alertService) {
    // nothing for now //

    $scope.surveys;
    $scope.isArchived = false;
    $rootScope.isTraineeSelected = window.localStorage.getItem('isTraineeSelected')
    $rootScope.showHeader = false;
    $rootScope.showFooter = false;
    $scope.model =
    {
      numberOfCopy : '2'
    }
    $scope.start = 0;
    $scope.user = JSON.parse(window.localStorage.getItem('user'))
    $rootScope.heading_name = $scope.user.first_name +" "+$scope.user.surname
    $rootScope.heading_company = $scope.user.company_name

    function getSurveys () {
      let query = {
        limit: 200,
        page: 1,
        email: $rootScope.user.email,
        surveyStatus: $routeParams.type == 'submitted' ? undefined : 'ARCHIVED',
        isTrainee: false
    }

    if($routeParams.type == 'submitted') {
      $scope.isArchived = false;
    } else {
      $scope.isArchived = true;
    }
    if($rootScope.isTraineeSelected == '1') {
      query.isTrainee = true
      if($rootScope.user.traineeTo){
        query.email = $rootScope.user.traineeTo.email
      }
    }
    // if($rootScope.isTraineeSelected == '2') {
    //   query.isTrainee = false
    //   if($rootScope.user.designerTo){
    //     query.email = $rootScope.user.designerTo.email
    //   }
    // }
      surveyService.getAll(query).then(function (res) {
        $scope.surveys = res.surveys;
        $scope.start = res.count;
      });
    }

    getSurveys();

    $scope.delete = function (survey) {

      apiService.surveys.destroy({ _id: survey._id }, function (response) {

        var index = $scope.surveys.indexOf(survey);
        $scope.surveys.splice(index, 1);

        if ($scope.surveys.length === 0)
          $scope.surveys = null;

        alertService('success', 'Surveys', response.message);
      }, function (error) {
      });
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

    $scope.showSummary = function (survey) {
      $location.path('/summary/' + survey._id + '/1');
    };

    $scope.unarchive = function (survey) {
      let a = 'PROGRESS';
      if (survey.surveys.status == 'COMPLETED') {
        a = 'COMPLETED'
      }

      survey.surveys.status = a;

      apiService.update('surveys', survey).then(function (response) {
        var index = $scope.surveys.indexOf(survey);
        $scope.surveys.splice(index, 1);

        if ($scope.surveys.length === 0)
          $scope.surveys = null;

        alertService('success', 'Survey', 'Survey is unarchived successfully!');
      }, commonService.onError);
    };

    $scope.archive = function (survey) {
      survey.surveys.status = 'ARCHIVED';

      apiService.update('surveys', survey).then(function (response) {

        var index = $scope.surveys.indexOf(survey);
        $scope.surveys.splice(index, 1);

        if ($scope.surveys.length === 0)
          $scope.surveys = null;

        alertService('success', 'Survey', 'Survey is archived successfully!');
      }, commonService.onError);
    };

    $scope.copySampleSurvey = function () {
      let st = $scope.start
      let postData = {
        email: $rootScope.user.email,
        name: $rootScope.user.first_name + ' ' + $rootScope.user.surname,
        noOfCopy: parseInt($scope.model.numberOfCopy),
        start: st,
      }

      apiService.copySurvey.post(postData, function (res) {
        if (res.success) {
          $scope.start = st + parseInt($scope.model.numberOfCopy);
          alertService('success', 'Copy', res.message);
          getSurveys();
        } else {
          alertService('warning', 'Error while Copy', res.message);
        }
      })

    }

  }

  angular
    .module('cloudheatengineer')
    .controller('SurveysController', ['$rootScope', '$routeParams', '$scope', '$location', 'surveyService', 'userService', 'apiService', 'commonService', 'alertService', SurveysController]);

}());
