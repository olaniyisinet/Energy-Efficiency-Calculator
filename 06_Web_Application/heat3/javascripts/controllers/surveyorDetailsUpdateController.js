(function () {
  'use strict';

  var app = angular.module('cloudheatengineer');

  /**
   * Dashboard Controller
   */
  app.controller('SurveyorDetailsUpdateController', SurveyorDetailsUpdateController);

  SurveyorDetailsUpdateController.$inject = ['$rootScope', '$scope', 'userService', '_', 'taxamo', 'apiService', 'alertService', 'lodash', 'braintreeService', '$location', '$routeParams','multipartFormService'];

  function SurveyorDetailsUpdateController ($rootScope, $scope, userService, _, taxamo, apiService, alertService, lodash, braintreeService, $location, $routeParams,multipartFormService) {

    $scope.surveyorsList = []
    $scope.searchVal = ""
    $scope.editVal = ""
    $scope.openEdit = false
    $scope.techList = [
      "GSHP",
      "ASHP",
      "Biomass",
      "Oil",
      "LPG",
      "Mains Gas",
      "Direct Electric"
    ]
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
        $scope.logoImage = surveyor
      })

    }

  //  $scope.edit = function (val) {
  //    console.log(val)
  //    $scope.editVal = val
  //    $scope.openEdit = !$scope.openEdit

  //  }
   $scope.publicAccount = function (togPublic) {

    if ($scope.userDetails.address) {

      const geocoder = new google.maps.Geocoder();

      geocoder.geocode({ 'address': $scope.userDetails.address + '-' + $scope.userDetails.post_code }, (res, status) => {
        if (status == google.maps.GeocoderStatus.OK) {
          $scope.userDetails.others.profileInfo.lat = JSON.stringify(res[0].geometry.location.lat())
          $scope.userDetails.others.profileInfo.long = JSON.stringify(res[0].geometry.location.lng())

          if (!togPublic) {
            $scope.userDetails.others.profileInfo.public = true
          } else {
            $scope.userDetails.others.profileInfo.public = false
          }

          apiService.usersupdate.update({ _id: $scope.userDetails._id }, $scope.userDetails, function (res) {
            init()
            alertService('success', 'Updated!', 'User updated successfully!');
            return;
          }, function (error) {
            console.log(error);
            return;
          });
        }
      });
    }
   }

   $scope.update = function () {
    const geocoder = new google.maps.Geocoder();

    geocoder.geocode({ 'address': $scope.userDetails.address + '-' + $scope.userDetails.post_code }, (res, status) => {
      if (status == google.maps.GeocoderStatus.OK) {
        $scope.userDetails.others.profileInfo.lat = JSON.stringify(res[0].geometry.location.lat())
        $scope.userDetails.others.profileInfo.long = JSON.stringify(res[0].geometry.location.lng())

        // if (!data) {
        //   $scope.userDetails.others.profileInfo.public = true
        // } else {
        //   $scope.userDetails.others.profileInfo.public = false
        // }

        apiService.usersupdate.update({ _id: $scope.userDetails._id }, $scope.userDetails, function (res) {
          init()
          alertService('success', 'Updated!', 'User updated successfully!');
          return;
        }, function (error) {
          console.log(error);
          return;
        });
      }
    });
   }
   $scope.logoImage


   $scope.updateImage = function () {

    var uploadUrl = '/user/uploadSurveyorImage';

    multipartFormService.post(uploadUrl, $scope.userDetails).then(function (response) {
      // $rootScope.user = response.data;
      // userService.updateStorage($rootScope.user);
      alertService('success', 'Updated!', 'Image updated successfully!');
      image()
    }, function () {
      alertService('warning', 'Opps!', 'Something went wrong!');
    });
  };

  function image(){
    apiService.get('surveyorByIdNoAuth', {
      _id: $routeParams.id
    }).then(function (surveyor) {
      $scope.logoImage = surveyor
    })

  }

   $scope.back = function () {
    $location.path('/surveyor-details/' + $routeParams.id);
  }
   $scope.cancel = function () {
    init()
   }
   $scope.addSkill = function () {
    if(!$scope.userDetails.others.profileInfo){
      $scope.userDetails.others.profileInfo = {}
      $scope.userDetails.others.profileInfo.skills = []
    }else if(!$scope.userDetails.others.profileInfo.skills){
      $scope.userDetails.others.profileInfo.skills = []
    }
    if($scope.skill){
      $scope.userDetails.others.profileInfo.skills.push($scope.skill)
      $scope.skill = ""
    }

   }
   $scope.cancelSkill = function (index) {

     $scope.userDetails.others.profileInfo.skills.splice(index, 1)
   }

   $scope.addQualification = function () {

    if(!$scope.userDetails.others.profileInfo){
      $scope.userDetails.others.profileInfo = {}
      $scope.userDetails.others.profileInfo.qualification = []
    }else if(!$scope.userDetails.others.profileInfo.qualification){
      $scope.userDetails.others.profileInfo.qualification = []
    }
    if($scope.qualification){
      $scope.userDetails.others.profileInfo.qualification.push($scope.qualification)
      $scope.qualification = ""
    }

   }
   $scope.cancelQualification = function (index) {

     $scope.userDetails.others.profileInfo.qualification.splice(index, 1)
   }

   $scope.addTech = function () {

    if(!$scope.userDetails.others.profileInfo){
      $scope.userDetails.others.profileInfo = {}
      $scope.userDetails.others.profileInfo.technology = []
    }else if(!$scope.userDetails.others.profileInfo.technology){
      $scope.userDetails.others.profileInfo.technology = []
    }
    if($scope.technology){
      var techCheck = $scope.userDetails.others.profileInfo.technology.filter(function(val){ return val == $scope.technology; })
      if(techCheck.length == 0){
        $scope.userDetails.others.profileInfo.technology.push($scope.technology)
        $scope.technology = ""
      }

    }

   }
   $scope.cancelTech = function (index) {
     $scope.userDetails.others.profileInfo.technology.splice(index, 1)
   }
   // Initiate data
    init()



  }

}());
