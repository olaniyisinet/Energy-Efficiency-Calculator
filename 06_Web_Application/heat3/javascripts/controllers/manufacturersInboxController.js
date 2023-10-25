(function() {
  'use strict';

  angular.module('cloudheatengineer')
  .controller('ManufacturerInboxController', ManufacturerInboxController)
  .controller('ModalManufacturerCommentController', ModalManufacturerCommentController);

  ManufacturerInboxController.$inject = ['$location', '$rootScope', '$scope', '$modal', 'userService', 'surveyService', 'apiService', '_', 'alertService', 'commonService'];

  function ManufacturerInboxController($location, $rootScope, $scope, $modal, userService, surveyService, apiService, _, alertService, commonService) {

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
                survey: $scope.survey,

              }
            }
          }
      });
      modalInstance.result.then(function(comment) {
    //   $scope.survey.surveys.commentsManufacturerReply = true
    //   $scope.survey.surveys.commentsMemberReply = false

    //   apiService.surveysComments.save({
    //     message : comment.message,
    //     messageDate : new Date().toString(),
    //     user_id : $scope.user._id,
    //     step    : comment.step,
    //     survey_id : $scope.survey._id
    // }, function(response) {
    //     if (response.success) {
    //         alertService('success', 'Send', response.message);
    //       apiService.update('surveys', $scope.survey).then(function (response) {
    //     }, commonService.onError);
    //     }
    //   }, function(error) {});
      // apiService.surveysComments.save({
      //   message : comment.message,
      //   messageDate : new Date().toString(),
      //   user_id : $scope.user._id,
      //   step    : comment.step,
      //   survey_id : $scope.survey._id
      // }, function(response) {
      //     if (response.success) {
      //         alertService('success', 'Send', response.message);
      //       apiService.update('surveys', $scope.survey).then(function (response) {

      //     }, commonService.onError);

      //     }
      // }, function(error) {});

    }, function() {});

    }


    $scope.back = function (){
      $location.path('/dashboard');
    }
    $scope.sendBack = function(survey){

      survey.surveys.commentsManufacturerRead = true
      $scope.survey = survey
      if(!$scope.survey.surveys.editCount){
        $scope.survey.surveys.editCount = 0
      }
      // if($scope.survey.surveys.editState || $scope.survey.surveys.editState == undefined){
        $scope.survey.surveys.editState = false
        $scope.survey.surveys.editCount = parseInt($scope.survey.surveys.editCount) + 1
      // }
      $scope.survey.surveys.is_locked = false;

      apiService.update('surveys', $scope.survey).then(function (response) {
       alertService('success', 'comment', 'comment added successfully!');
     }, commonService.onError);
    }
    $scope.showSummary = function (survey) {
      $location.path('/summary/' + survey._id + '/1');
    };
    $scope.getAll = function(query){

      surveyService.getAllByManufacturer(query).then(function (res) {
        console.log($scope.user._id)
        console.log("surveys",res.surveys[0])
        $scope.searchVal = query.search
        if(res.surveys != 0){
            let surveyData = Object.keys(res.surveys).map(i => {
                return res.surveys[i]
            })
            $scope.surveys = surveyData;
            $scope.paginationPage = []
            let totalPage = Math.floor(parseInt(res.surveys)/query.limit)
            let obj = {}
            for(let i=0; i<totalPage; i++){
                obj[i] = i
                $scope.paginationPage.push(obj)
                obj={}
            }
            if(parseInt(res.surveys)%20){
                obj[totalPage] = totalPage + 1
                $scope.paginationPage.push(obj)
                obj={}
            }
        }
        else
            $scope.surveys = null;

        $scope.currentPaginationPage = 1
        // angular.forEach($scope.surveys, function (survey) {

        //   if(typeof survey.surveys.progress_percentage == 'undefined') {
        //     survey.surveys.progress_percentage = {};
        //     survey.surveys.progress_percentage.length = lists.length;
        //     survey.surveys.progress_percentage.count = 0;
        //   } else
        //     survey.surveys.progress_percentage.count = 0;

        //   if(!!survey.surveys.ground_loop) {
        //     if(survey.surveys.ground_loop.ground_type == 'Borehole')
        //       lists.push('ground_loop.bore_hole_depth');
        //   }

        //   angular.forEach(survey.surveys, function (item, idx) {

        //     for (var i in lists) {
        //       var split = lists[i].split('.');

        //       if (split.length > 1) {
        //         if (idx == split[0]) {
        //           if (item[split[1]] != '' || item[split[1]] != null || item[split[1]] != undefined)
        //             survey.surveys.progress_percentage.count = survey.surveys.progress_percentage.count + 1;
        //         }
        //       } else if (lists[i] == idx) {
        //         if (item != null || item != '' || item != undefined)
        //           survey.surveys.progress_percentage.count = survey.surveys.progress_percentage.count + 1;
        //       }
        //     }

        //     survey.surveys.progress_percentage.value
        //         = (parseInt(survey.surveys.progress_percentage.count / survey.surveys.progress_percentage.length
        //         * 100)).toString() + '%';
        //   });
        // });
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

    let q = {
      limit: 10,
      page: 1,
      email: $rootScope.user.email,
      search: '',
      surveyStatus:  'COMPLETED',
      manufacturerid : $scope.user._id
    };

    $scope.getAll(q);

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
  ModalManufacturerCommentController.$inject = ['$scope', '$modalInstance', 'alertService', 'apiService', 'commonService','data','$location'];

    function ModalManufacturerCommentController($scope, $modalInstance, alertService, apiService, commonService, data,$location) {
      $scope.loading = false
      $scope.inputVisible = false
      if($location.$$path != '/manufacturer-outbox'){
        $scope.inputVisible = true
      }
      // $scope.sendBtn = false
      // if()
      init()
      $scope.placeHolder = ""
      function init(){
        apiService.get('surveysComments', {_id: data.survey._id}).then(function (surveyff) {
          $scope.commentsList = surveyff
          commentlist($scope.commentsList)

        }, commonService.onError);
      }


      function commentlist(list) {
        // console.log("list",list)
        $scope.step1 = list?.filter(function(o){
            return o.step == "1";
          });

        $scope.step2 = list?.filter(function(o){
          return o.step == "2";
        });
        $scope.step3 = list?.filter(function(o){
            return o.step == "3";
          });
        $scope.step4 = list?.filter(function(o){
            return o.step == "4";
          });
        $scope.step5 = list?.filter(function(o){
            return o.step == "5";
          });
        $scope.step6 = list?.filter(function(o){
            return o.step == "6";
          });
        $scope.step7 = list?.filter(function(o){
            return o.step == "7";
          });
        $scope.step8 = list?.filter(function(o){
            return o.step == "8";
          });
        $scope.step9 = list?.filter(function(o){
            return o.step == "9";
          });
        $scope.stepDHW = list?.filter(function(o){
            return o.step == "domestic-hot-water";
          });
        $scope.stepEP = list?.filter(function(o){
            return o.step == "emitters-performance";
          });
        $scope.stepCR = list?.filter(function(o){
            return o.step == "current-radiators";
          });
        $scope.stepNR = list?.filter(function(o){
            return o.step == "new-radiators";
          });
        $scope.stepBivalent = list?.filter(function(o){
            return o.step == "bivalent";
          });
        $scope.stepFuelComp = list?.filter(function(o){
            return o.step == "fuel-comparison";
          });
        $scope.stepGround = list?.filter(function(o){
          return o.step == "ground-loop";
        });
        $scope.stepPipeCalc = list?.filter(function(o){
          return o.step == "pipe-calculator";
        });
      }
      $scope.user =   JSON.parse(window.localStorage.getItem('user'))
      $scope.survey = data.survey

      $scope.comment= {}

      $scope.editComment = function (comment,index,selectedStep){
        $scope.index = index
        $scope.isEditComment = true
        comment.msgDate = new Date().toString();
        $scope.comment.message = comment.message
        $scope.comments = comment
        $scope.comment.step = selectedStep
        $scope.selectedStep = selectedStep
        $scope.placeHolder = "Please update comments here... "
      }
      $scope.updateComment = function () {
        $scope.comments.message = $scope.comment.message
        $scope.comments.step = $scope.comment.step
        if(!$scope.comment.message || !$scope.comment.step) {
          alertService('danger', '', 'Please Enter All data!');
         }else{

            apiService.update('surveysComments', $scope.comments).then(function (response) {
            // $scope.comment = ""
            $scope.isEditComment = false
            $scope.comment= {}
            $scope.placeHolder = ""
            init()
            alertService('success', 'comment', 'comment Update successfully!');
          }, commonService.onError);
        }
       }

        $scope.ok = function() {
          $scope.loading = true
         if(!$scope.comment.message || !$scope.comment.step) {
          alertService('danger', '', 'Please Enter All data!');
          $scope.loading = false
         }else{
          if($scope.user.isManufacturer){
            $scope.survey.surveys.commentsManufacturerReply = true
            $scope.survey.surveys.commentsMemberReply = false
          }else{
            $scope.survey.surveys.commentsManufacturerRead = false
            $scope.survey.surveys.commentsManufacturerReply = false
            $scope.survey.surveys.commentsMemberReply = true
          }



          // $scope.survey.surveys.commentsManufacturerRead = false
          // $scope.survey.surveys.commentsManufacturerReply = false
          // $scope.survey.surveys.commentsMemberReply = true
          apiService.surveysComments.save({
            message : $scope.comment.message,
            messageDate : new Date().toString(),
            user_id : $scope.user._id,
            step    : $scope.comment.step,
            survey_id : $scope.survey._id
        }, function(response) {
            if (response.success) {
                alertService('success', 'Send', response.message);
              apiService.update('surveys', $scope.survey).then(function (response) {
              $scope.comment.message = ""
              $scope.comment.step = ""
                init()
                $scope.loading = false
            }, commonService.onError);
            }
          }, function(error) {});
         }

          // console.log($scope.comment)
          //   if ($scope.comment.message != null && $scope.comment.message != '' && $scope.comment.message != ' ' && $scope.comment.step != null && $scope.comment.step != '' && $scope.comment.step != ' ')
          //       $modalInstance.close($scope.comment);
          //   else {
          //       alertService('danger', '', 'Select Manufacturer for send!');
          //       $modalInstance.dismiss('cancel');
          //   }
        };

        $scope.cancel = function() {
            $modalInstance.dismiss('cancel');
        };
    }
})();
