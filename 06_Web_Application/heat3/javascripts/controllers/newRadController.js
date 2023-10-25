(function () {
  'use strict';

  angular.module('cloudheatengineer')
    .controller('NewRadsController', NewRadsController)
    NewRadsController.$inject = ['$scope', '$routeParams', '$location', 'apiService', 'commonService', 'summaryHelperService', 'modalService','alertService', '_','$modal'];

    function NewRadsController ($scope, $routeParams, $location, apiService, commonService, summaryHelperService, modalService,alertService, _,$modal) {
      $scope.loading = true
      init()
      $scope.valueChanged = false;

      $scope.outputWatts = ["70°c","35°c","40°c","45°c","50°c","55°c","60°c"]
      $scope.deltaTList = [2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20]
      $scope.deltaT = 0
      $scope.deltaTCatalog = 0

      $scope.calculateMWT = function (){
        $scope.customMWT($scope.survey);
      }

      $scope.inputValueChanged = function() {
        $scope.valueChanged = true;
      }

      $scope.customMWT = function (survey){
        // apiService.get('surveys', {
        //   _id: $routeParams.id
        // }).then(function (survey) {
          $scope.survey = survey;

          if($scope.deltaT == 0 || !$scope.deltaT){
            $scope.deltaT = 5;
          }
          if($scope.deltaTCatalog == 0 || !$scope.deltaTCatalog){
            $scope.deltaTCatalog = 50
          }

          let deltaT =  parseInt($scope.deltaT)
          $scope.survey.surveys.new_rad_deltaT = deltaT
          let deltaTCatalog = parseInt($scope.deltaTCatalog)
          let maxFlowTemp = parseInt($scope.survey.surveys.maximum_designed_flow_temperature)
          let customMWTValue = (maxFlowTemp-(parseInt($scope.survey.surveys.new_rad_deltaT)/2))
          $scope.survey.surveys.custom_MWT = customMWTValue
          $scope.survey.surveys.new_rad_deltaT_catalogue = deltaTCatalog
          //summaryHelperService.switchAndUpdateSurvey(null, "new_radiators", $scope.survey).then(function () {
            //$location.path('/new-radiators/' + $scope.survey._id);
            calculateValues($scope.survey);
          //});

        //});
      }
      function calculateValues (survey) {
        // apiService.get('surveys', {
        //   _id: $routeParams.id
        // }).then(function (survey) {
          $scope.survey = survey
          angular.forEach($scope.survey.surveys.rooms, function (value, key) {
            $scope.survey = summaryHelperService.getNewRadWatts(key, value, $scope.survey);
          });
        //}, commonService.onError);
      }

      /**
       * @method
       * @desc It will allow the user/s to edit existing data from the tables.
       */
      $scope.modalEdit = function (item, idx, property, typ) {
        modalService.setTemplateUrl('/partials/views/summary/components/_modal');
        modalService.setController('ModalEditController');
        modalService.showModal($scope.survey.surveys.rooms, item, idx, property, typ).then(function (result) {
          // $scope.customMWT();
          // result.scope.rooms[idx].hasRads
          $scope.valueChanged = true;
          var rad = item.substr(14, 5)
          if(rad.includes("one")){
            result.scope[idx].new_radiators['one'].isCurrent = false
          }else
          if(rad.includes("two")){
            result.scope[idx].new_radiators['two'].isCurrent = false
          }else
          if(rad.includes("three")){
            result.scope[idx].new_radiators['three'].isCurrent = false
          }else
          if(rad.includes("four")){
            result.scope[idx].new_radiators['four'].isCurrent = false
          }else
          if(rad.includes("five")){
            result.scope[idx].new_radiators['five'].isCurrent = false
          }else
          if(rad.includes("six")){
            result.scope[idx].new_radiators['six'].isCurrent = false
          }
          result.scope[idx].hasRads

          if (!result.scope[idx].new_radiators['one'] &&
            result.scope[idx].new_radiators['one'] == null &&
            !result.scope[idx].new_radiators['two'] &&
            result.scope[idx].new_radiators['two'] == null &&
            !result.scope[idx].new_radiators['three'] &&
            result.scope[idx].new_radiators['three'] == null &&
            !result.scope[idx].new_radiators['four'] &&
            result.scope[idx].new_radiators['four'] == null &&
            !result.scope[idx].new_radiators['five'] &&
            result.scope[idx].new_radiators['five'] == null &&
            !result.scope[idx].new_radiators['six'] &&
            result.scope[idx].new_radiators['six'] == null) {

            result.scope[idx].hasNewRads = false

          } else {

            result.scope[idx].hasNewRads = true;
          }
          $scope.survey.surveys.rooms = result.scope;
          //summaryHelperService.switchAndUpdateSurvey(null, "new_radiators", $scope.survey, null, $scope.valueChanged).then(function () {
            //$location.path('/new-radiators/' + $scope.survey._id);
            //CalculateValues($scope.survey);
            $scope.customMWT($scope.survey);
          //});
        });
      };

      $scope.moveTo = function (location) {
          summaryHelperService.switchAndUpdateSurvey(null, location, $scope.survey, null, true).then(function () {
            $location.path('/' + location + '/' + $scope.survey._id);
          });
      };

      $scope.removeRad = function (room, number) {
        if (confirm('Are you sure you want to delete ' + room.room_name + ' radiator ' + number + '?')) {
          if (number) {
            room.new_radiators[number] = null;
          }
          $scope.valueChanged = true;
          //summaryHelperService.switchAndUpdateSurvey(null, "new_radiators", $scope.survey, null, $scope.valueChanged).then(function () {
            //$location.path('/new-radiators/' + $scope.survey._id);
            //CalculateValues($scope.survey);
            $scope.customMWT($scope.survey);
          //});
        }
      };

      $scope.newRad = function (room,radNum,idx){
        $scope.valueChanged = true;
        $scope.survey.surveys.rooms[idx].new_radiators == undefined ? $scope.survey.surveys.rooms[idx].new_radiators = {} : $scope.survey.surveys.rooms[idx].new_radiators = $scope.survey.surveys.rooms[idx].new_radiators

           $scope.survey.surveys.rooms[idx].new_radiators[radNum] = room.radiators[radNum]
           $scope.survey.surveys.rooms[idx].new_radiators[radNum].isCurrent = true

          // summaryHelperService.switchAndUpdateSurvey(null, "new_radiators", $scope.survey, null, $scope.valueChanged).then(function () {
          //   $location.path('/new-radiators/' + $scope.survey._id);
          //   CalculateValues($scope.survey);
          // });
          calculateValues($scope.survey);
      }

      function init(){
        apiService.get('surveys', {
          _id: $routeParams.id
        }).then(function (survey) {
          $scope.survey = survey;
          $scope.loading = false
          $scope.deltaTCatalog = $scope.survey.surveys.new_rad_deltaT_catalogue
          $scope.deltaT = $scope.survey.surveys.new_rad_deltaT

          for (let j = 0; j < $scope.survey.surveys.rooms.length; j++) {
            if(!$scope.survey.surveys.rooms[j].new_radiators &&  $scope.survey.surveys.rooms[j].radiators){

              $scope.survey.surveys.rooms[j].new_rad_output_for_mwt =  $scope.survey.surveys.rooms[j].output_for_mwt
              $scope.survey.surveys.rooms[j].new_rad_total_flow =  $scope.survey.surveys.rooms[j].total_flow

                $scope.survey.surveys.rooms[j].new_radiators = {}
                $scope.survey.surveys.rooms[j].new_radiators = JSON.parse(JSON.stringify($scope.survey.surveys.rooms[j].radiators))
                // $scope.survey.surveys.rooms[j].new_radiators = Object.assign({}, $scope.survey.surveys.rooms[j].radiators)
                // $scope.survey.surveys.rooms[j].new_radiators['one'] = {}
                // $scope.survey.surveys.rooms[j].new_radiators['two'] = {}
                // $scope.survey.surveys.rooms[j].new_radiators['three'] = {}
                // $scope.survey.surveys.rooms[j].new_radiators['four'] = {}
                // $scope.survey.surveys.rooms[j].new_radiators['five'] = {}
                // $scope.survey.surveys.rooms[j].new_radiators['six'] = {}
                // $scope.survey.surveys.rooms[j].new_radiators = $scope.survey.surveys.rooms[j].radiators
                if($scope.survey.surveys.rooms[j].new_radiators['one'] != null && $scope.survey.surveys.rooms[j].new_radiators['one'] !=undefined && $scope.survey.surveys.rooms[j].new_radiators['one']){
                  $scope.survey.surveys.rooms[j].new_radiators['one'].isCurrent = true
                }
                if($scope.survey.surveys.rooms[j].new_radiators['two']){
                  $scope.survey.surveys.rooms[j].new_radiators['two'].isCurrent = true
                }
                if($scope.survey.surveys.rooms[j].new_radiators['three']){
                  $scope.survey.surveys.rooms[j].new_radiators['three'].isCurrent = true
                }
                if($scope.survey.surveys.rooms[j].new_radiators['four'] ){
                  $scope.survey.surveys.rooms[j].new_radiators['four'].isCurrent = true
                }
                if($scope.survey.surveys.rooms[j].new_radiators['five']){
                  $scope.survey.surveys.rooms[j].new_radiators['five'].isCurrent = true
                }
                if($scope.survey.surveys.rooms[j].new_radiators['six']){
                  $scope.survey.surveys.rooms[j].new_radiators['six'].isCurrent = true
                }
            }

          }

          // summaryHelperService.switchAndUpdateSurvey(null, "new_radiators", $scope.survey, null, $scope.valueChanged).then(function () {
          //   //$location.path('/new-radiators/' + $scope.survey._id);
          //  //CalculateValues($scope.survey);
          //   $scope.customMWT($scope.survey)
          // });
          $scope.customMWT($scope.survey)

        }, commonService.onError);
      }

  //comment to manufacture start

  $scope.openComment = function(step){
    var selectedSurvay
    selectedSurvay = $scope.survey
    var modalOptions = {};
    modalOptions.templateUrl = '/partials/views/summary/components/_modal_comment';
    modalOptions.controller = 'ModalCommentController';
    modalOptions.size = 'md';
    var modalInstance = $modal.open({
        animation: true,
        templateUrl: modalOptions.templateUrl,
        controller: modalOptions.controller,
        size: modalOptions.size,
        resolve: {
                data: function () {
                    return {
                        step: step,
                        survey : $scope.survey
                    }
                }
            }
    });
    modalInstance.result.then(function(comment) {
      $scope.valueChanged = true;
  }, function() {});

  }
 //comment to manufacture end

    }
})()
