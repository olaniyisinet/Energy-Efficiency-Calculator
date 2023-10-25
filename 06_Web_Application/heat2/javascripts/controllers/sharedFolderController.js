(function () {
  'use strict';
  angular.module('cloudheatengineer').controller('SharedFolderController', SharedFolderController);

  SharedFolderController.$inject = ['$scope', '$rootScope', '$location', 'sharedFolderService'];

  function SharedFolderController ($scope, $rootScope, $location, sharedFolderService) {

    $rootScope.showHeader = false;
    $rootScope.showFooter = false;
    $rootScope.heatmanagerview = true;

    $scope.folder = null;

    function init () {
      $scope.folderId = $location.search().id
      sharedFolderService.getByIdPub({ _id: $location.search().id }).then(function (folder) {
        $scope.folder = folder;
      });
    }
    init();
  }
})();
