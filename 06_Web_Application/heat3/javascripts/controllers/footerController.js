(function () {
  'use strict';

  var app = angular.module('cloudheatengineer');

  app.controller('FooterController', FooterController);
  app.controller('FooterSupportController', FooterSupportController);

  FooterController.$inject = ['$scope', '$rootScope', '$location', '$modal', 'apiService', 'alertService'];

  function FooterController ($scope, $rootScope, $location, $modal, apiService, alertService) {
    $scope.name = ''
    $scope.email = ''
    $scope.message = ''
    $scope.subject = ''

    $scope.sendContactEmail = function () {
      // $scope.emailForm.message = $scope.formContentMessageBody();
      let data = {
        subject: 'Contact Form - ' + $scope.subject,
        message: $scope.message,
        name: $scope.name,
        email: $scope.email
      }
      apiService.save('sendContactEmail', data).then(function (res) {
        if (res) {
          alertService('success', 'Email', res.message)

        } else {
          alertService('error', 'Some error', 'Action was unsuccessfull')
        }
      });
    };

    $scope.checkMenu = function (path = '') {
      // $location.path(path)
      // let routeName = $location.path();
      //  console.log(routeName)
      // if (routeName == '/' || routeName == '/home') {
      //   $rootScope.showHeader = true;
      //   $rootScope.showFooter = true;
      // } else {
      //   $rootScope.showHeader = false;
      //   $rootScope.showFooter = false;
      // }
    }

    $scope.modalSupportOpen = function () {
      var modalInstance = $modal.open({
        animation: true,
        templateUrl: '/partials/views/common/modal/footer_modal',
        controller: 'FooterSupportController',
        size: 'md'
      });

      modalInstance.result.then(function () {
      });
    };
  }

  FooterSupportController.$inject = ['$scope', '$modalInstance'];
  function FooterSupportController ($scope, $modalInstance) {
    $scope.done = function () {
      $modalInstance.dismiss('cancel');
    };
  }
})();
