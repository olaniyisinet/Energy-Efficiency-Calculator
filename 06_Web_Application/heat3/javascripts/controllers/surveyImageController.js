(function () {
  'use strict';
  angular.module('cloudheatengineer')
    .controller('SurveyImageController', SurveyImageController)
    .controller('ModalSurveyImagesController', ModalSurveyImagesController)

    SurveyImageController.$inject = ['$scope', '$rootScope', 'apiService', 'alertService', '$location', '$routeParams','$modal','commonService'];
  function SurveyImageController ($scope, $rootScope, apiService, alertService, $location,$routeParams,$modal,commonService) {
    // console.log($routeParams.fromPage)
    init()
    $scope.description = {}
    $scope.enableSelect = false
    // $scope.selectedRoom = []
    function init() {
      apiService.get('surveys', {
        _id: $routeParams.id
      }).then(function (survey) {
            //  console.log(survey)
            $scope.survey = survey
      })
    }
    $scope.selectEnable = function (){
      $scope.enableSelect = !$scope.enableSelect
    }


    $scope.addRoomImage = function () {
      var roomIndex =  $scope.survey.surveys.rooms.length - 1
      // tempMyObj = Object.assign({}, myObj);
      var room1 = JSON.parse(JSON.stringify($scope.survey.surveys.rooms[0]))
      // var room1 = Object.assign({}, $scope.survey.surveys.rooms[roomIndex]);
      var modalOptions = {};
      // console.log(index)
      modalOptions.templateUrl = '/partials/views/summary/components/_modal_room_image';
      modalOptions.controller = 'ModalSurveyImagesController';
      modalOptions.size = 'md';

      var modalInstance = $modal.open({
        animation: true,
        templateUrl: modalOptions.templateUrl,
        controller: modalOptions.controller,
        size: modalOptions.size = 'md',
        resolve: {
          room: function () {
            return $scope.survey.surveys.rooms;
          },
          roomDetails : room1
        }
      });

      modalInstance.result.then(function (roomNname) {
      if(!$scope.survey.surveys.roomCopied){
        $scope.survey.surveys.roomCopied = 1
        $scope.survey.surveys.rooms.push(roomNname)

      apiService.update('surveys', $scope.survey).then(function (response) {
        init()
        alertService('success', 'Room Create', 'Rooms Created successfully!');
     }, commonService.onError);
      }else if($scope.survey.surveys.roomCopied == 3){
        alertService('danger', 'Maximum rooms reached', 'You already create three rooms.');
      }else{
        $scope.survey.surveys.roomCopied = $scope.survey.surveys.roomCopied + 1
        $scope.survey.surveys.rooms.push(roomNname)

          apiService.update('surveys', $scope.survey).then(function (response) {
            init()
            alertService('success', 'Room Create', 'Rooms Created successfully!');
        }, commonService.onError);
      }
      }, function () {
      });
    }


    $scope.selectAll = function () {
      $scope.enableSelect = true
      // for loop for rooms
      for (let i = 0; i < $scope.survey.surveys.rooms.length; i++) {

                 // for loop for image
            for (let k = 0; k < $scope.survey.surveys.rooms[i].images.length; k++) {
              $scope.survey.surveys.rooms[i].images[k].selected = true

            }
            }
            for (let n = 0; n < $scope.survey.surveys.plantRooms.length; n++) {
              $scope.survey.surveys.plantRooms[n].selected = true

            }
            for (let m = 0; m < $scope.survey.surveys.heatPumps.length; m++) {
              $scope.survey.surveys.heatPumps[m].selected = true

            }
      apiService.update('surveys', $scope.survey).then(function (response) {

     }, commonService.onError);
    }

    $scope.unSelectAll = function () {
      $scope.enableSelect = true
      // for loop for rooms
      for (let i = 0; i < $scope.survey.surveys.rooms.length; i++) {

                 // for loop for image
            for (let k = 0; k < $scope.survey.surveys.rooms[i].images.length; k++) {
              $scope.survey.surveys.rooms[i].images[k].selected = false

            }

            for (let n = 0; n < $scope.survey.surveys.plantRooms.length; n++) {
              $scope.survey.surveys.plantRooms[n].selected = false

            }
            for (let m = 0; m < $scope.survey.surveys.heatPumps.length; m++) {
              $scope.survey.surveys.heatPumps[m].selected = false

            }
      }
      apiService.update('surveys', $scope.survey).then(function (response) {

     }, commonService.onError);
    }

    $scope.openImageplant = function(index,room){
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
    $scope.imageAdd = function (image,e,index,roomIndex) {

      var checked = e.target.checked
      if(checked){
        $scope.survey.surveys.rooms[roomIndex].images[index].selected = true
    }else{
      $scope.survey.surveys.rooms[roomIndex].images[index].selected = false
    }
    $scope.imageAddPlant = function (image,e,index,roomIndex) {

      var checked = e.target.checked
      if(checked){
        if(roomIndex == "plantRooms"){
          $scope.survey.surveys.plantRooms[index].selected = true
        }else{
          $scope.survey.surveys.heatPumps[index].selected = true
        }

    }else{
      if(roomIndex == "plantRooms"){
        $scope.survey.surveys.plantRooms[index].selected = false
      }else{
        $scope.survey.surveys.heatPumps[index].selected = false
      }
    }
    }

    apiService.update('surveys', $scope.survey).then(function (response) {

   }, commonService.onError);


    }
    $scope.despView = false
    $scope.editDesp = function (desp,index,roomName,parentIndex){
      $scope.index = index
      $scope.description.text = desp
      $scope.despView = true
      $scope.roomName = roomName
      $scope.parentIndex = parentIndex
    }
    $scope.cancel= function() {
      $scope.despView = false
      $scope.index = null
    }
    $scope.goBack = function() {
        $location.path('/summary/'+$scope.survey._id+'/3');
    }

    $scope.despSave = function(descr) {
      $scope.survey.surveys.rooms[$scope.parentIndex].images[$scope.index].imageDesc = $scope.description.text

        apiService.update('surveys', $scope.survey).then(function (response) {
          alertService('success', 'comment', 'description Updated successfully!');
          $scope.cancel()
          init()
        }, commonService.onError);
    }
    $scope.despSavePlant = function() {
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
    $scope.openImage = function(index,images,room,parentIndex){

      var modalOptions = {};
      modalOptions.templateUrl = '/partials/views/uploaded-image/components/_modal_view_image';
      modalOptions.controller = 'ModalImageView';
      modalOptions.size = 'lg';

      var modalInstance = $modal.open({
          animation: true,
          templateUrl: modalOptions.templateUrl,
          controller: modalOptions.controller,
          size: modalOptions.size,
          resolve: {
            data: function () {
              return {
                images: images,
                index: index,
                room:room,
                parentIndex:parentIndex
              }
            }
          }
      });
  }
  }


  ModalSurveyImagesController.$inject = ['$scope', '$modalInstance','room','apiService','$routeParams','commonService','alertService','roomDetails'];

  function ModalSurveyImagesController ($scope, $modalInstance,room,apiService,$routeParams,commonService,alertService,roomDetails) {
    init()
    function init() {
      apiService.get('surveys', {
        _id: $routeParams.id
      }).then(function (survey) {
        // console.log(survey)
        $scope.survey = survey
      })
    }



    $scope.ok = function () {

      if(!!$scope.detail.room_name && $scope.detail.room_name != "" &&  !!$scope.detail.voulted && $scope.detail.voulted != ""){
        var roomsCheck = room.filter(function(val){ return val.room_name.toLowerCase() == $scope.detail.room_name.toLowerCase(); })
        if(roomsCheck.length == 0){
          roomDetails.room_name = $scope.detail.room_name
          roomDetails.images = []
          roomDetails.room_notes = ""
          roomDetails.is_the_room_complex = $scope.detail.voulted
          $modalInstance.close(roomDetails);
        }else{
          alertService('danger', 'Exist', 'This room is already exist');
        }
      }else{
        alertService('danger', '', 'Please Fill all Fields');
      }


    };
    $scope.cancel = function () {
      $modalInstance.dismiss('cancel');
    };

  }

}());

