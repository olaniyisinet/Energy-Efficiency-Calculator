(function () {
  'use strict';
  angular.module('cloudheatengineer').controller('ShareNowController', ShareNowController);

  ShareNowController.$inject = ['$location', '$rootScope', '$scope', '$modal', 'sharedFolderService', '$window'];

  function ShareNowController ($location, $rootScope, $scope, $modal, sharedFolderService, $window) {

    $rootScope.showHeader = false;
    $rootScope.showFooter = false;
    $rootScope.heatmanagerview = true;

    $scope.searchVal = {};

    $scope.folder = null;
    $scope.permissionOptions = [
      {
        id: 0,
        label: 'Viewer',
      },
      {
        id: 1,
        label: 'Editor',
      },
    ];

    function init () {
      $scope.folderId = $location.search().id
      sharedFolderService.getById({ _id: $location.search().id }).then(function (folder) {
        $scope.folder = folder;
      });
    }
    init()

    // $scope.$watch('folder.permissions', function (permissions, oldValue) {
    //   sharedFolderService.update({ _id: $location.search().id, permissions }).then(function () {
    //     init();
    //   });
    // });

    $scope.openAddUser = function (user = {}) {

      var modalOptions = {};
      modalOptions.templateUrl = '/partials/views/share-now/components/_modal_add_user';
      modalOptions.controller = 'ModalAddUserController';
      modalOptions.size = 'md';

      var modalInstance = $modal.open({
        animation: true,
        templateUrl: modalOptions.templateUrl,
        controller: modalOptions.controller,
        size: modalOptions.size,
        resolve: {
          data: function () {
            return {
              user: user,
              folder: $scope.folder
            }
          }
        }
      });

      modalInstance.result.then(function (res) {
        let shared_with = $scope.folder.shared_with || [];
        if (res._id) {
          shared_with = shared_with.map(user => {
            if (user._id === res._id) {
              return res;
            }
            return user;
          })
        } else {
          shared_with.push(res)
        }
        sharedFolderService.update({ _id: $location.search().id, shared_with }).then(function () {
          init();
        });
      }, function () { });

    }
    $scope.openLink = function () {

      var modalOptions = {};
      modalOptions.templateUrl = '/partials/views/share-now/components/_modal_copy_link';
      modalOptions.controller = 'ModalCopyLinkController';
      modalOptions.size = 'md';

      var modalInstance = $modal.open({
        animation: true,
        templateUrl: modalOptions.templateUrl,
        controller: modalOptions.controller,
        size: modalOptions.size,
        resolve: {
          data: function () {
            return {
              id: $location.search().id
            }
          }
        }
      });

    }
  }


  angular.module('cloudheatengineer').controller('ModalAddUserController', ModalAddUserController);

  ModalAddUserController.$inject = ['$modalInstance', '$scope', 'data'];

  function ModalAddUserController ($modalInstance, $scope, data) {

    $scope.user = data.user || {};
    $scope.folder = data.folder;
    $scope.cancel = function () {
      $modalInstance.dismiss('cancel');
    };
    $scope.save = function () {
      $modalInstance.close($scope.user);
    };
  }

  angular.module('cloudheatengineer').controller('ModalCopyLinkController', ModalCopyLinkController);

  ModalCopyLinkController.$inject = ['$modalInstance', '$scope', 'data', 'sharedFolderService', 'alertService'];

  function ModalCopyLinkController ($modalInstance, $scope, data, sharedFolderService, alertService) {

    $scope.id = data.id || {};
    $scope.link = `${window.location.origin}/heat-manager/installer?id=${data.id}`;
    $scope.cancel = function () {
      $modalInstance.dismiss('cancel');
    };
    $scope.emailToUsers = function () {
      sharedFolderService.emailToUsers({ id: $scope.id, link: $scope.link }).then(() => {
        alertService('success', 'Submitted', ' Email send to invited users', 4000);
      });
    };
    $scope.copy = function () {
      console.log(JSON.parse(window.localStorage.getItem('user')))
      navigator.clipboard.writeText($scope.link)
    };
  }
})();
