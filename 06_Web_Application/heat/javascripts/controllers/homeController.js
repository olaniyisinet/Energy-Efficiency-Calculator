(function () {
  'use strict';

  function HomeController($modal, $scope, $window) {
    $window.document.title = 'Heat Engineer Software';
    $scope.iFrameHeight = '377';
    $scope.windowWidth = $(window).width();
    if ($scope.windowWidth < 768) {
      $scope.iFrameHeight = '300';
    } else if ($scope.windowWidth < 480) {
      $scope.iFrameHeight = '200';
    }

    $scope.smePricingOpen = function () {
      var modalInstance = $modal.open({
        animation: true,
        templateUrl: '/partials/views/common/modal/sme-pricing_modal',
        controller: 'SmePricingController',
        size: 'md'
      });

      modalInstance.result.then(function () {});
    };

  }

  angular.module('cloudheatengineer').controller('HomeController', ['$modal', '$scope','$window', HomeController],);

}());
