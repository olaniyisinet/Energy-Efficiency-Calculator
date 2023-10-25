(function () {
  'use strict';
  angular.module('cloudheatengineer')
    .controller('UploadedImagePlantController', UploadedImagePlantController)
    .controller('ModalImagePlantView', ModalImagePlantView)
    UploadedImagePlantController.$inject = ['$scope', '$rootScope', 'apiService', 'alertService', '$location', '$routeParams','$modal','commonService'];
  function UploadedImagePlantController ($scope, $rootScope, apiService, alertService, $location,$routeParams,$modal,commonService) {
    init()
    function init() {
      apiService.get('surveys', {
        _id: $routeParams.id
      }).then(function (survey) {
            $scope.survey = survey
      })
    }
    $scope.description = {}
    $scope.despView = false
    $scope.editDesp = function (desp,index,roomName,room){
      $scope.index = index
      $scope.description.text = desp
      $scope.despView = true
      $scope.roomName = roomName

    }

    $scope.goBack = function() {
      $location.path('/summary/'+$scope.survey._id+'/1');
    }

    $scope.cancel= function() {
      $scope.despView = false
      $scope.index = null
      init()
    }

    $scope.despSave = function() {
      if($scope.roomName == 'heatPumps'){
        $scope.survey.surveys.heatPumps[$scope.index].imageDesc = $scope.description.text
      }else{
        $scope.survey.surveys.plantRooms[$scope.index].imageDesc = $scope.description.text
      }

        apiService.update('surveys', $scope.survey).then(function (response) {
          alertService('success', 'comment', 'description Updated successfully!');
          $scope.cancel()
          init()
        }, commonService.onError);
    }
    $scope.openImage = function(index,room){
      var modalOptions = {};
      modalOptions.templateUrl = '/partials/views/plant-room-pump-img/components/_modal_view_plant_image';
      modalOptions.controller = 'ModalImagePlantView';
      modalOptions.size = 'lg';
      var imageList =[]
      if(room == "plantRooms"){
        imageList = $scope.survey.surveys.plantRooms
      }else{
        imageList = $scope.survey.surveys.heatPumps
      }
      var modalInstance = $modal.open({
          animation: true,
          templateUrl: modalOptions.templateUrl,
          controller: modalOptions.controller,
          size: modalOptions.size,
          resolve: {
            data: function () {
              return {
                images: imageList,
                index: index,
                room:room
              }
            }
          }
      });
  }

  }

  ModalImagePlantView.$inject = ['$scope', '$modalInstance', 'alertService','data','apiService','$routeParams','commonService'];

  function ModalImagePlantView($scope, $modalInstance, alertService,data,apiService,$routeParams,commonService ) {

     $scope.editInput = false
     $scope.imageList = data.index
     $scope.room = data.room
     $scope.selectedImg = data.images
     $scope.image = $scope.selectedImg[$scope.imageList]

     $scope.data = {}
    init()
    function init() {
      apiService.get('surveys', {
        _id: $routeParams.id
      }).then(function (survey) {
        $scope.survey = survey
      })
    }
    $scope.editDesp = function(description){
      $scope.data.description = description
      $scope.editInput = true
    }

    $scope.cancel1 = function () {
      $scope.editInput = false
      init()
    }
    $scope.despSave= function(){
      if($scope.room == "plantRooms"){
        $scope.survey.surveys.plantRooms[$scope.imageList].imageDesc = $scope.data.description
      }else{
        $scope.survey.surveys.heatPumps[$scope.imageList].imageDesc = $scope.data.description
      }


      apiService.update('surveys', $scope.survey).then(function (response) {

        $scope.image.imageDesc =  $scope.data.description
        $scope.cancel1()
        init()
        alertService('success', 'Image', 'description Updated successfully!');
     }, commonService.onError);

    }
     $scope.move = function (move) {
       if(move=="next"){
        if($scope.imageList+1 != $scope.selectedImg.length){
          $scope.imageList++
          $scope.image = $scope.selectedImg[$scope.imageList]
        }
       }else{
        if($scope.imageList != 0){
        $scope.imageList--
        $scope.image = $scope.selectedImg[$scope.imageList]
        }
       }
     }


      $scope.cancel = function() {
          $modalInstance.dismiss('cancel');
      };
  }


}());

