(function () {
  'use strict';
  angular.module('cloudheatengineer')
    .controller('UploadedImageController', UploadedImageController)
    .controller('ModalSurveyImagesNewController', ModalSurveyImagesNewController)
    .controller('ModalImageView', ModalImageView)
    UploadedImageController.$inject = ['$scope', '$rootScope', 'apiService', 'alertService', '$location', '$routeParams','$modal','commonService','multipartFormService'];
  function UploadedImageController ($scope, $rootScope, apiService, alertService, $location,$routeParams,$modal,commonService,multipartFormService) {
    // console.log($routeParams.fromPage)

    $scope.description = {}
    $scope.enableSelect = true
    $scope.enableSelectDownload = false
    $rootScope.showHeader = false;
    $rootScope.showFooter = false;
    $rootScope.heatmanagerview = true;

    init()

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

    $scope.selectEnableDownload = function (){
      // console.log($scope.enableSelectDownload)
      $scope.enableSelectDownload = !$scope.enableSelectDownload
    }

    $scope.addRoomImage = function () {
      // var roomIndex =  $scope.survey.surveys.rooms.length - 1
      // tempMyObj = Object.assign({}, myObj);
      var room1 = JSON.parse(JSON.stringify($scope.survey.surveys.rooms[0]))
      // var room1 = Object.assign({}, $scope.survey.surveys.rooms[roomIndex]);
      var modalOptions = {};
      // console.log(index)
      modalOptions.templateUrl = '/partials/views/summary/components/_modal_room_image';
      modalOptions.controller = 'ModalSurveyImagesNewController';
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
          $scope.data = $scope.survey
          $scope.data.roomIndex = roomNname.roomIndex
          $scope.data.roomImage = roomNname.roomImage
          $scope.data.description = roomNname.description
          $scope.data.type = roomNname.type
          var uploadUrl = '/api/roomImage';
          // console.log($scope.userDetails)
          multipartFormService.post(uploadUrl, $scope.data).then(function (response) {
            init()
            alertService('success', 'Updated!', 'Site Image updated successfully!');
          }, function () {
            alertService('warning', 'Opps!', 'Something went wrong!');
          });
        //   apiService.update('surveys', $scope.survey).then(function (response) {
        //     console.log(response)
        //     init()
        //     alertService('success', 'Room Create', 'Rooms Created successfully!');
        // }, commonService.onError);



    //   if(!$scope.survey.surveys.roomCopied){
    //     $scope.survey.surveys.roomCopied = 1
    //     $scope.survey.surveys.rooms.push(roomNname)

    //   apiService.update('surveys', $scope.survey).then(function (response) {
    //     console.log(response)
    //     init()
    //     alertService('success', 'Room Create', 'Rooms Created successfully!');
    //  }, commonService.onError);
    //   }else if($scope.survey.surveys.roomCopied == 3){
    //     alertService('danger', 'Maximum rooms reached', 'You already create three rooms.');
    //   }else{
    //     $scope.survey.surveys.roomCopied = $scope.survey.surveys.roomCopied + 1
    //     $scope.survey.surveys.rooms.push(roomNname)

    //       apiService.update('surveys', $scope.survey).then(function (response) {
    //         console.log(response)
    //         init()
    //         alertService('success', 'Room Create', 'Rooms Created successfully!');
    //     }, commonService.onError);
    //   }
      }, function () {
      });
    }

    $scope.selectAll = function () {
      // $scope.enableSelect = true
      // for loop for rooms
      for (let i = 0; i < $scope.survey.surveys.rooms.length; i++) {

                 // for loop for survey image
            if(!!$scope.survey.surveys.rooms[i].images){
              for (let k = 0; k < $scope.survey.surveys.rooms[i].images.length; k++) {
                $scope.survey.surveys.rooms[i].images[k].selected = true
              }
            }

            }
             // for loop for plant image
            if(!!$scope.survey.surveys.plantRooms){
              for (let n = 0; n < $scope.survey.surveys.plantRooms.length; n++) {
                $scope.survey.surveys.plantRooms[n].selected = true
              }
            }
             // for loop for heat pump image
            if(!!$scope.survey.surveys.heatPumps){
              for (let m = 0; m < $scope.survey.surveys.heatPumps.length; m++) {
                $scope.survey.surveys.heatPumps[m].selected = true
              }
            }

      apiService.update('surveys', $scope.survey).then(function (response) {
     }, commonService.onError);
    }

    $scope.unSelectAll = function () {
      // $scope.enableSelect = true
      // for loop for rooms
      for (let i = 0; i < $scope.survey.surveys.rooms.length; i++) {
                 // for loop for image
            if(!!$scope.survey.surveys.rooms[i].images){
              for (let k = 0; k < $scope.survey.surveys.rooms[i].images.length; k++) {
                $scope.survey.surveys.rooms[i].images[k].selected = false
              }
            }
            if(!!$scope.survey.surveys.plantRooms){
              for (let n = 0; n < $scope.survey.surveys.plantRooms.length; n++) {
                $scope.survey.surveys.plantRooms[n].selected = false
              }
            }
            if(!!$scope.survey.surveys.heatPumps){
              for (let m = 0; m < $scope.survey.surveys.heatPumps.length; m++) {
                $scope.survey.surveys.heatPumps[m].selected = false
              }
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
        apiService.update('surveys', $scope.survey).then(function (response) {

      }, commonService.onError);

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
    apiService.update('surveys', $scope.survey).then(function (response) {

  }, commonService.onError);
    }

    $scope.imageAddPlantDownLoad = function (image,e,index,roomIndex) {

          var checked = e.target.checked
          if(checked){
            if(roomIndex == "plantRooms"){
              $scope.survey.surveys.plantRooms[index].download = true
            }else{
              $scope.survey.surveys.heatPumps[index].download = true
            }

        }else{
          if(roomIndex == "plantRooms"){
            $scope.survey.surveys.plantRooms[index].download = false
          }else{
            $scope.survey.surveys.heatPumps[index].download = false
          }
        }
    }

    // Download single image
    $scope.downloadImagesSingle = function (link) {
      var a = document.createElement("a");
           a.href = link;
           a.download = "";
           a.click();
    }
    // Download  selected  images
    $scope.downloadImages = async function () {
      var images = $scope.survey.surveys.plantRooms.filter(function(val){ return val.download == true; });
      // console.log(images)
      var images1 = images.map(function(data){
        return data.imageLink
      })
      $scope.selectedone = [];
      var uploadUrl = '/api/downloadImages';
      var details = {
        images:images1
      }
      $scope.imagelist = $scope.survey
      $scope.imagelist.imagelist = images1
      multipartFormService.post(uploadUrl, $scope.imagelist).then(function (response) {

        alertService('success', 'Updated!', 'Company logo updated successfully!');
      }, function () {
        alertService('warning', 'Opps!', 'Something went wrong!');
      });

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
      if($routeParams.fromPage == 'step3'){
        $location.path('/summary/'+$scope.survey._id+'/3');
      }else{
        $location.path('/optional/'+$scope.survey._id);
      }

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
    // bootstrap corousel Start
    // var slides = $scope.slides = [];
    // $scope.addSlide = function() {
    //   var newWidth = 800 + slides.length + 1;
    //   slides.push({
    //     image: 'http://placekitten.com/' + newWidth + '/300',
    //     text: ['More', 'Extra', 'Lots of', 'Surplus'][slides.length % 4]
    //   });
    // };
    // for (var i = 0; i < 4; i++) {
    //   $scope.addSlide();
    // }
    // bootstrap corousel End
  }

  ModalImageView.$inject = ['$scope', '$modalInstance', 'alertService','data','apiService','$routeParams','commonService'];

  function ModalImageView($scope, $modalInstance, alertService,data,apiService,$routeParams,commonService) {
    $scope.data = {}
     init()
     function init() {
       apiService.get('surveys', {
         _id: $routeParams.id
       }).then(function (survey) {
         $scope.survey = survey
       })
     }
     $scope.editInput = false
     $scope.imageList = data.index
     $scope.parentIndex = data.parentIndex
     $scope.room = data.room
     $scope.selectedImg = data.images
     $scope.image = $scope.selectedImg[$scope.imageList]


    $scope.editDesp = function(description){
      // console.log(description)
      $scope.editInput = true
      $scope.data.description = description


    }
    $scope.despSave= function(){

      $scope.survey.surveys.rooms[$scope.parentIndex].images[$scope.imageList].imageDesc = $scope.data.description
      apiService.update('surveys', $scope.survey).then(function (response) {
        $scope.room.images[$scope.imageList].imageDesc = $scope.data.description
        $scope.cancel1()
        init()
        alertService('success', 'Image', 'description Updated successfully!');
     }, commonService.onError);

    }
    $scope.cancel1 = function () {
      $scope.editInput = false
      init()
    }
    //  $scope.nextDisabled = false
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

  ModalSurveyImagesNewController.$inject = ['$scope', '$modalInstance','room','apiService','$routeParams','commonService','alertService','roomDetails'];

  function ModalSurveyImagesNewController ($scope, $modalInstance,room,apiService,$routeParams,commonService,alertService,roomDetails) {
    init()
    $scope.rooms = room
    var selectedIndex
    function init() {
      apiService.get('surveys', {
        _id: $routeParams.id
      }).then(function (survey) {
        // console.log(survey)
        $scope.survey = survey
      })
    }



    $scope.ok = function () {
      // console.log($scope.detail)
      var roomDetails = {}
      if($scope.detail.roomName == "plant_room"){
        if (!$scope.survey.surveys.plantRooms) {
          $scope.survey.surveys.plantRooms = []
        }
         if($scope.survey.surveys.plantRooms.length < 6){
          // roomDetails.roomIndex = ""
          roomDetails.roomImage = $scope.details.roomImage
          roomDetails.description = $scope.details.description
          roomDetails.type = "plant_room"
          $modalInstance.close(roomDetails);

         }else{
          alertService('danger', 'Exist', 'Maximum number image upload is reached for plant room');
         }
      }else if($scope.detail.roomName == "heat_pump"){
        if (!$scope.survey.surveys.heatPumps) {
          $scope.survey.surveys.heatPumps = []
        }
        if($scope.survey.surveys.heatPumps.length < 6){
        //  roomDetails.roomIndex = ""
         roomDetails.roomImage = $scope.details.roomImage
         roomDetails.description = $scope.details.description
         roomDetails.type = "heat_pump"
         $modalInstance.close(roomDetails);

        }else{
         alertService('danger', 'Exist', 'Maximum number image upload is reached for heat pump');
        }
     }else{
      var roomsCheck = room.filter(function(val){ return val.room_name.toLowerCase() == $scope.detail.roomName.toLowerCase(); })
      roomDetails = roomsCheck[0]
      if($scope.details?.roomImage == undefined || !$scope.details?.roomImage){
        alertService('danger', '', 'Please Select the Image');
      }else{
        if(!roomDetails.images){
          roomDetails.images = []
        }
        if(roomDetails.images.length < 7){
          for (var i = 0; i < room.length; i++) {
            if (room[i].room_name == $scope.detail.roomName) {
              selectedIndex = i;
            }
          }
        roomDetails.roomIndex = selectedIndex
        roomDetails.roomImage = $scope.details.roomImage
        roomDetails.description = $scope.details.description
        roomDetails.type = "room_image"
        $modalInstance.close(roomDetails);
        }else{
          alertService('danger', 'Exist', 'Maximum number image upload is reached for this room');
        }

      }
     }

    };
    $scope.cancel = function () {
      $modalInstance.dismiss('cancel');
    };

  }

}());

