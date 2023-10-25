(function () {
  'use strict';
  angular.module('cloudheatengineer')
  .controller('SharedFolderQrController', SharedFolderQrController)
  .controller('AddressConfirmController', AddressConfirmController);

  SharedFolderQrController.$inject = ['$scope', '$rootScope', '$location', 'sharedFolderService', 'alertService'];

  function SharedFolderQrController ($scope, $rootScope, $location, sharedFolderService, alertService) {

    $rootScope.showHeader = false;
    $rootScope.showFooter = false;
    $rootScope.heatmanagerview = true;

    $scope.address = {};

    $scope.addressType = '';

    $scope.folder = null

    $scope.gotoCheckLabel = function () {
      $location.path('heat-manager/address-confirm?id='+$scope.folderId)
    }

    $scope.$watch('addressType', function (value, oldValue) {
      $rootScope.addressType = value;
      if (value && value === 'installer') {
        $scope.address = {
          name: `${$scope.folder._user_id.first_name} ${$scope.folder._user_id.surname}`,
          line1: $scope.folder._user_id.address,
          post: $scope.folder._user_id.post_code
        };
      } else if (value) {
        $scope.address = {};
      } else {
        setAddress()
      }
    });

    function setAddress () {
      const s = $scope.folder ? $scope.folder.survey.surveys : null;
      if (s != null) {
        $rootScope.address = $scope.address = {
          name: s.client_name,
          line1: s.address_one,
          line2: s.address_two,
          line3: s.address_three,
          post: s.post_code,
        }
      }
    }

    $scope.send = function () {
      var address = $scope.address
      $scope.folderId = $location.search().id;
      sharedFolderService.requestQr({ id: $location.search().id, address: address, addressType: $rootScope.addressType, link: `${window.location.origin}/heat-manager/installer?id=${$scope.folderId}` }).then(function (res) {
        if(res.success) alertService('success', 'Sent', res.message, 4000);
        else alertService('warning', 'Error', res.message, 4000);
      });
    };

    function init () {
      $scope.folderId = $location.search().id
      sharedFolderService.getById({ _id: $location.search().id }).then(function (folder) {
        $scope.folder = folder;
        if (!$scope.addressType) {
          setAddress();
        }
      });
    }
    init();
  }

  AddressConfirmController.$inject = ['$scope', '$rootScope', '$location', 'sharedFolderService', 'alertService'];

  function AddressConfirmController ($scope, $rootScope, $location, sharedFolderService, alertService) {

    $scope.folderId = null;
    $scope.addressType = $rootScope.addressType;
    $scope.confirms = {
      logo: false,
      installBy: false,
      commiBy: false,
      insAddress: false,
    }
    $scope.proceed = false;

    $scope.send = function () {
      var address = $scope.address
      var addressType = $scope.addressType

      $scope.folderId = $location.search().id;
      sharedFolderService.requestQr({ id: $location.search().id, address: address, addressType: addressType, link: `${window.location.origin}/heat-manager/installer?id=${$scope.folderId}` }).then(function () {
        alertService('success', 'Submitted', ' Request Submitted for QR', 4000);
      });
    };

    $scope.confirmAccept = function (type) {
      if(type == 'logo') {
        $scope.confirms.logo = true;
      }
      if(type == 'installedBy') {
        $scope.confirms.installBy = true;
      }
      if(type == 'commissioningBy') {
        $scope.confirms.commiBy = true;
      }
      if(type == 'installationAddress') {
        $scope.confirms.insAddress = true;
      }

      if($scope.confirms.logo == true &&
        $scope.confirms.installBy == true &&
        $scope.confirms.commiBy == true &&
        $scope.confirms.insAddress == true) {
          $scope.proceed = true
      }

    }


    function init () {
      $scope.folderId = $location.search().id
      sharedFolderService.getById({ _id: $location.search().id }).then(function (folder) {
        $scope.folder = folder;
        if (!$scope.addressType) {
          setAddress();
        }
      });
    }
    init();

    function setAddress () {
      const s = $scope.folder ? $scope.folder.survey.surveys : null;
      if (s != null) {
        $scope.address = {
          name: s.client_name,
          line1: s.address_one,
          line2: s.address_two,
          line3: s.address_three,
          post: s.post_code,
        }
      }
    }

    $scope.goBack = function () {
      $location.path('/shared-folder/qr?id='+$scope.folderId)
    }
  }

})();
