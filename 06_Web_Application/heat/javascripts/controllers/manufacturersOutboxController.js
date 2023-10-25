(function() {
  'use strict';
  angular.module('cloudheatengineer')
  .controller('ManufacturerOutboxController', ManufacturerOutboxController)
  .controller('ModalManufacturerOutCommentController', ModalManufacturerOutCommentController);

  ManufacturerOutboxController.$inject = ['$timeout', '$location', '$rootScope', '$scope', '$modal', '$filter', 'userService', 'surveyService', 'apiService', 'summaryHelperService', 'report', '_', 'alertService','commonService'];

  function ManufacturerOutboxController($timeout, $location, $rootScope, $scope, $modal, $filter, userService, surveyService, apiService, summaryHelperService, r, _, alertService,commonService) {

    $scope.user =   JSON.parse(window.localStorage.getItem('user'))

    $scope.openComment = function(step,survey){
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

      modalInstance.result.then(function(comment) {
       var comments = {
        message : comment.msg,
        msgDate : new Date().toString(),
        user_id : $scope.user._id,
        step    : parseInt(comment.step)
       }

      if(!$scope.survey.surveys.comments){
      $scope.survey.surveys.comments=[]
      }
      $scope.survey.surveys.comments.push(comments)

       apiService.update('surveys', $scope.survey).then(function (response) {
       alertService('success', 'comment', 'comment added successfully!');
     }, commonService.onError);

    }, function() {});

    }

    $scope.back = function (){
      $location.path('/dashboard');
    }

    $scope.showSummary = function (survey) {
      $location.path('/summary/' + survey._id + '/1');
    };
    $scope.sendBack = function(survey){

      // if(!$scope.survey.surveys.commentsManufacturerRead){
      //   $scope.survey.surveys.commentsManufacturerRead=false
      //   }
      survey.surveys.commentsManufacturerRead=true
      $scope.survey = survey
      apiService.update('surveys', $scope.survey).then(function (response) {
       alertService('success', 'comment', 'comment added successfully!');
     }, commonService.onError);
    }

    $scope.getAll = function(query){

      surveyService.getSendBackByManufacturer(query).then(function (surveys) {
        $scope.searchVal = query.search
        if(surveys[1]!=0){
            let surveyData = Object.keys(surveys[0]).map(i => {
                return surveys[0][i]
            })
            $scope.surveys = surveyData;
            $scope.paginationPage = []
            let totalPage = Math.floor(parseInt(surveys[1])/query.limit)
            let obj = {}
            for(let i=0; i<totalPage; i++){
                obj[i] = i
                $scope.paginationPage.push(obj)
                obj={}
            }
            if(parseInt(surveys[1])%20){
                obj[totalPage] = totalPage + 1
                $scope.paginationPage.push(obj)
                obj={}
            }
        }
        else
            $scope.surveys = null;

        $scope.currentPaginationPage = 1

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

    $scope.getAll({
      limit: 10,
      page: 1,
      email: $rootScope.user.email,
      search: '',
      surveyStatus:  'COMPLETED',
      manufacturerid : $scope.user._id
    })

    $scope.nextPage= function (){
      let page = parseInt($scope.currentPaginationPage)+1
      let query = {
        limit: 10,
        page: page,
        email: $rootScope.user.email,
        search: $scope.searchVal,
        surveyStatus:  'COMPLETED',
        manufacturerid : $scope.user._id
      }
      $scope.getAll(query)
    }

    $scope.previousPage= function (){
      let page = parseInt($scope.currentPaginationPage)-1
      let query = {
        limit: 10,
        page: page,
        email: $rootScope.user.email,
        search: $scope.searchVal,
        surveyStatus:  'COMPLETED',
        manufacturerid : $scope.user._id
      }
      $scope.getAll(query)
    }

    $scope.newPage= function (page){
      let query = {
        limit: 10,
        page: page,
        email: $rootScope.user.email,
        search: $scope.searchVal,
        surveyStatus:  'COMPLETED',
        manufacturerid : $scope.user._id
      }
      $scope.getAll(query)
    }

    $scope.filterComplete = function (){
      let query = {
        limit: 10,
        page: 1,
        email: $rootScope.user.email,
        search: $scope.searchVal,
        surveyStatus:  'COMPLETED',
        manufacturerid : $scope.user._id
      }
      $scope.getAll(query)
    }

  }
  ModalManufacturerOutCommentController.$inject = ['$scope', '$modalInstance', 'alertService','apiService','$routeParams','commonService','calculationService','data'];

    function ModalManufacturerOutCommentController($scope, $modalInstance, alertService,apiService,$routeParams,commonService,calculationService,data) {
      $scope.user =   JSON.parse(window.localStorage.getItem('user'))
      $scope.survey = data.survey
         $scope.step1 = $scope.survey.surveys.comments.filter(function(o){
          return o.step == 1;
        });

        $scope.step2 = $scope.survey.surveys.comments.filter(function(o){
          return o.step == 2;
        });

        $scope.step3 = $scope.survey.surveys.comments.filter(function(o){
          return o.step == 3;
        });

        $scope.step4 = $scope.survey.surveys.comments.filter(function(o){
          return o.step == 4;
        });

        $scope.step5 = $scope.survey.surveys.comments.filter(function(o){
          return o.step == 5;
        });

        $scope.step6 = $scope.survey.surveys.comments.filter(function(o){
          return o.step == 6;
        });

        $scope.step7 = $scope.survey.surveys.comments.filter(function(o){
          return o.step == 7;
        });

        $scope.step8 = $scope.survey.surveys.comments.filter(function(o){
          return o.step == 8;
        });

        $scope.step9 = $scope.survey.surveys.comments.filter(function(o){
          return o.step == 9;
        });
         $scope.comment = {}
        $scope.ok = function() {
            if ($scope.comment.msg != null && $scope.comment.msg != '' && $scope.comment.msg != ' ' && $scope.comment.step != null && $scope.comment.step != '' && $scope.comment.step != ' ')
                $modalInstance.close($scope.comment);
            else {
                alertService('danger', '', 'Type message and select step for send!');
                $modalInstance.dismiss('cancel');
            }
        };

        $scope.cancel = function() {
            $modalInstance.dismiss('cancel');
        };
    }
})();
