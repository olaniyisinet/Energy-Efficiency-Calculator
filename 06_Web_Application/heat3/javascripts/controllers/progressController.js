(function () {
  'use strict';

  ProgressController.$inject = ['$location', '$rootScope', '$scope', 'userService', 'surveyService', 'apiService', 'commonService', 'alertService', '$modal'];
  function ProgressController ($location, $rootScope, $scope, userService, surveyService, apiService, commonService, alertService, $modal) {

    var lists = [
      'project_name',
      'reference',
      'title',
      'client_name',
      'address_one',
      'post_code',
      'region.region',
      'external_temperature.location',
      'altitude_adjustment.meter',
      'external_design_temperature',
      'proposed_install_type',
      'is_ashp_high_temp_model',
      'preferred_manufacture',
      'preferred_model',
      'is_bivalent_required',

      'domestic_hot_water.number_of_bed_rooms',
      'domestic_hot_water.number_of_occupants_per_bedroom',
      'domestic_hot_water.flow_temperature_for_hot_water.temp',
      'domestic_hot_water.hot_water_per_occupant',

      'bivalent.point',
      'ground_loop.ground_type',
      'ground_loop.ground_loop_type'
    ];
    $rootScope.isTraineeSelected = window.localStorage.getItem('isTraineeSelected')
    $scope.user = JSON.parse(window.localStorage.getItem('user'))
    $rootScope.heading_name = $scope.user.first_name +' '+ $scope.user.surname
    $rootScope.heading_company = $scope.user.company_name
    if($rootScope.isTraineeSelected == '1' ) {
      $rootScope.heading_company = $scope.user.traineeTo.company
  }

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

    $scope.sendReport = function (survey) {
      console.log(survey)
      // var newSurvey = survey
      apiService.get('surveysComments', {_id: survey._id}).then(function (surveyff) {
        $scope.commentsList = surveyff
        console.log($scope.commentsList)

      }, commonService.onError);
      var modalOptions = {};
      modalOptions.templateUrl = '/partials/views/completed/components/_modal_send_report';
      modalOptions.controller = 'ModalSendReportInstanceController';
      modalOptions.size = 'md';

      var modalInstance = $modal.open({
        animation: true,
        templateUrl: modalOptions.templateUrl,
        controller: modalOptions.controller,
        size: modalOptions.size,
        resolve: {
          data: function () {
            return {
              survey: survey

            }
          }
        }
      });

      modalInstance.result.then(function (selectedList) {
        // console.log(selectedList)
        apiService.surveysMulti.save({
          survey: survey,
          name: survey.surveys.project_name,
          is_copied: true,
          manufacturers: selectedList
        }, function (response) {
          if (response.success) {
            alertService('success', 'Survey Sent to selected manufacturers', response.message);
            // $scope.surveys.push(response.survey);
            surveyInit()
          }
        }, function (error) { });
      }, function () { });
    };

    $scope.showLogs = async function (survey) {
      $scope.logs = [];
      await apiService.get('surveyLogs', { _id: survey._id }).then(function (response) {
        $scope.logs = response.data
      });
      var modalOptions = {};
      modalOptions.templateUrl = '/partials/views/completed/components/_survey_logs';
      modalOptions.controller = 'ModalSurveyLogsController';
      modalOptions.size = 'md';

      var modalInstance = $modal.open({
        animation: true,
        templateUrl: modalOptions.templateUrl,
        controller: modalOptions.controller,
        size: modalOptions.size,
        resolve: {
          data: function () {
            return {
              logs: $scope.logs
            }
          }
        }
      });

      modalInstance.result.then(function () {

      }, function () { });
    }

    $scope.openComment = function (survey) {
      $scope.survey = survey

      var modalOptions = {};
      modalOptions.templateUrl = '/partials/views/summary/components/_modal_manufacturer_comment';
      modalOptions.controller = 'ModalManufacturerCommentController';
      modalOptions.size = 'md';

      var modalInstance = $modal.open({
        animation: true,
        templateUrl: modalOptions.templateUrl,
        controller: modalOptions.controller,
        size: modalOptions.size,
        resolve: {
          data: function () {
            return {
              survey: $scope.survey
            }
          }
        }
      });

      modalInstance.result.then(function (comment) {
        $scope.survey.surveys.commentsMemberReply = true
        apiService.surveysComments.save({
          message: comment.message,
          msgDate: new Date().toString(),
          user_id: $scope.user._id,
          step: comment.step,
          survey_id: $scope.survey._id
        }, function (response) {
          if (response.success) {
            alertService('success', 'Send', response.message);
            apiService.update('surveys', $scope.survey).then(function (response) {

            }, commonService.onError);

          }
        }, function (error) { });
      }, function () { });

    }


    $scope.resend = function (survey) {
      // survey.surveys.comments.push(comments)
      survey.surveys.commentsManufacturerRead = false
      survey.surveys.commentsMemberReply = false
      apiService.update('surveys', survey).then(function (response) {
        console.log(response)

        alertService('success', 'comment', 'comment Resend successfully!');
      }, commonService.onError);
    }
    $scope.getAll = function (query) {
      surveyService.getAll(query).then(function (res) {
        $scope.searchVal = query.search
        if (res['count'] != 0) {
          let surveyData = Object.keys(res['surveys']).map(i => {
            return res['surveys'][i]
          })
          $scope.surveys = surveyData;
          $scope.paginationPage = []
          let totalPage = Math.floor(parseInt(res['count']) / query.limit)
          let obj = {}
          for (let i = 0; i < totalPage; i++) {
            obj[i] = i
            $scope.paginationPage.push(obj)
            obj = {}
          }
          if (parseInt(res['count']) % 20) {
            obj[totalPage] = totalPage + 1
            $scope.paginationPage.push(obj)
            obj = {}
          }
        }
        else
          $scope.surveys = null;

        $scope.currentPaginationPage = 1
        angular.forEach($scope.surveys, function (survey) {

          if (typeof survey.surveys.progress_percentage == 'undefined') {
            survey.surveys.progress_percentage = {};
            survey.surveys.progress_percentage.length = lists.length;
            survey.surveys.progress_percentage.count = 0;
          } else
            survey.surveys.progress_percentage.count = 0;

          if (!!survey.surveys.ground_loop) {
            if (survey.surveys.ground_loop.ground_type == 'Borehole')
              lists.push('ground_loop.bore_hole_depth');
          }

          angular.forEach(survey.surveys, function (item, idx) {

            for (var i in lists) {
              var split = lists[i].split('.');

              if (split.length > 1) {
                if (idx == split[0]) {
                  if (item[split[1]] != '' || item[split[1]] != null || item[split[1]] != undefined)
                    survey.surveys.progress_percentage.count = survey.surveys.progress_percentage.count + 1;
                }
              } else if (lists[i] == idx) {
                if (item != null || item != '' || item != undefined)
                  survey.surveys.progress_percentage.count = survey.surveys.progress_percentage.count + 1;
              }
            }

            survey.surveys.progress_percentage.value
              = (parseInt(survey.surveys.progress_percentage.count / survey.surveys.progress_percentage.length
                * 100)).toString() + '%';
          });
        });
      });
    }

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

    let q1 = {
      limit: 10,
      page: 1,
      email: $rootScope.user.email,
      search: '',
      surveyStatus: 'PROGRESS',
      isTrainee: false
    }
    if($rootScope.isTraineeSelected == '1') {
      q1.isTrainee = true
      if($rootScope.user.traineeTo){
        q1.email = $rootScope.user.traineeTo.email
      }
    }
    // if($rootScope.isTraineeSelected == '2') {
    //   q1.isTrainee = false
    //   if($rootScope.user.DesignerTo){
    //     q1.email = $rootScope.user.DesignerTo.email
    //   }
    // }
    $scope.getAll(q1)

    $scope.nextPage = function () {
      let page = parseInt($scope.currentPaginationPage) + 1
      let query = {
        limit: 10,
        page: page,
        email: $rootScope.user.email,
        search: $scope.searchVal,
        surveyStatus: 'PROGRESS'
      }
      $scope.getAll(query)
    }

    $scope.previousPage = function () {
      let page = parseInt($scope.currentPaginationPage) - 1
      let query = {
        limit: 10,
        page: page,
        email: $rootScope.user.email,
        search: $scope.searchVal,
        surveyStatus: 'PROGRESS'
      }
      $scope.getAll(query)
    }

    $scope.newPage = function (page) {
      let query = {
        limit: 10,
        page: page,
        email: $rootScope.user.email,
        search: $scope.searchVal,
        surveyStatus: 'PROGRESS'
      }
      $scope.getAll(query)
    }

    $scope.filterComplete = function () {
      let query = {
        limit: 10,
        page: 1,
        email: $rootScope.user.email,
        search: $scope.searchVal,
        surveyStatus: 'PROGRESS'
      }
      $scope.getAll(query)
    }

    $scope.showSummary = function (survey) {
      $location.path('/summary/' + survey._id + '/1');
    };

    $scope.unLockSurvey = function (survey) {
      console.log("survey :::", survey);
      survey.surveys.is_locked = false;
      apiService.update('surveys', survey).then(function (response) {
      });
    }
  }

  angular
    .module('cloudheatengineer')
    .controller('ProgressController', ProgressController);
}());
