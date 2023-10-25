(function () {
  'use strict';

  angular.module('cloudheatengineer')
    .controller('RegisterTraineeController', RegisterTraineeController)
    .controller('TraineeController', TraineeController);

  TraineeController.$inject = ['$scope', '$rootScope', '$routeParams', '$location', 'apiService'];

  function TraineeController ($scope, $rootScope, $routeParams, $location, apiService) {

    $rootScope.showHeader = false;
    $rootScope.showFooter = false;
    // nothing for now //
    $scope.trainees = [];
    $scope.user = $rootScope.user;
    $scope.showList = true;
    $scope.sharableLink = $location.absUrl() + "/register/" + $rootScope.user._id
    $scope.base64Content = ''

    $scope.showTab = function (page) {
      if (page == 'list') {
        $scope.showList = true
      } else {
        $scope.showList = false;
      }
    }

    function getTrainees () {
      //get trainers invited by this user from the trainers table.
      apiService.inviterTrainees.post({ _id: $rootScope.user._id, link: $scope.sharableLink }, function (response) {
        $scope.trainees = response.trainees
        $scope.base64Content = response.qrCode;
      })
    }

    $scope.reset = function () {
      if (confirm('Are you sure you want to reset and refresh? This will prepare the dashboard for your new class. It will remove all trainees, designers and survyes that are not completed. This action is not reversible.')) {
        apiService.resetTrinees.post({inviter_id: $rootScope.user._id}, function(response) {
          $rootScope.user = response.data;
          getTrainees();
        })
      }
    }

    getTrainees();
  }

  RegisterTraineeController.$inject = ['$rootScope', '$routeParams', '$scope', '$location', 'apiService', 'alertService']

  function RegisterTraineeController ($rootScope, $routeParams, $scope, $location, apiService, alertService) {

    $scope.trainee = {};
    $rootScope.showHeader = false;
    $rootScope.showFooter = false;

    $scope.traineeRegister = function () {
      var postData = {
        first_name: $scope.trainee.first_name,
        surname: $scope.trainee.surname,
        email: $scope.trainee.email,
        inviter_id: $routeParams.id
      }
      apiService.trainees.post(postData, function (res) {
        if (res.success) {
          alertService('success', 'Register Trainee : ', res.message);
          $location.path('/login')
        } else {
          alertService('warning', 'Register Trainee : ', res.message);
        }

      })
      // to add a trainer
    }
  }


}());
