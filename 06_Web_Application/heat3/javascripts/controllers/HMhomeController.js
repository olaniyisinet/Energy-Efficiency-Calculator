
(function () {
  'use strict';

  angular.module('cloudheatengineer')
  .controller('HMownerController', HMownerController)
  .controller('HMengineerController', HMengineerController)
  .controller('HMinstallerController',HMinstallerController)
  .controller('advisoryLinksController',advisoryLinksController)
  .controller('HMcontactController',HMcontactController)
  .controller('HMmobileuploadController',HMmobileuploadController)
  .controller('HMvideoController', HMvideoController)
  .controller('adduploadController',adduploadController)
  .controller('overviewController',overviewController)
  .controller('HMhomeController', HMhomeController);

  HMhomeController.$inject = ['$scope', '$location', '$timeout'];
  function HMhomeController ( $scope, $location, $timeout) {

    $scope.heatmanagerview = false;

    function init() {
      var thisUrl = $location.absUrl();
      console.log("url rul rul", thisUrl);

      if(thisUrl.toLowerCase().includes('heat-manager')){
        $scope.heatmanagerview =  true
      }
    }

    init();

    $scope.gotopage = function (page) {
      $location.path("/heat-manager/" + page)
    }

  }


  HMownerController.$inject = ['$scope', '$rootScope'];
  function HMownerController ($scope, $rootScope) {



  }

  HMengineerController.$inject = ['$scope', '$rootScope',];
  function HMengineerController ($scope, $rootScope) {



  }

  HMvideoController.$inject = ['$scope', '$timeout'];
  function HMvideoController ($scope, $timeout) {


  }

  HMinstallerController.$inject = ['$scope', '$timeout', '$location', 'sharedFolderService'];
  function HMinstallerController ($scope, $timeout, $location, sharedFolderService) {

    $scope.heatmanagerview = false;
    $scope.logoloader = true;

    $timeout(function () {
      $scope.logoloader = false;
    }, 5000);

    $scope.urlId = $location.search().id
    sharedFolderService.getByIdPub({ _id: $scope.urlId }).then(function (folder) {
      $scope.folder = folder;
    });

  }

  HMcontactController.$inject = ['$scope', '$rootScope', 'sharedFolderService', '$location'];
  function HMcontactController ($scope, $rootScope, sharedFolderService, $location) {

    $scope.urlId = $location.search().id
    sharedFolderService.getByIdPub({ _id: $scope.urlId }).then(function (folder) {
      $scope.folder = folder;
    });


  }

  advisoryLinksController.$inject = ['$scope', '$rootScope',];
  function advisoryLinksController ($scope, $rootScope) {



  }

  HMmobileuploadController.$inject = ['$scope', '$location', 'sharedFolderService'];
  function HMmobileuploadController ($scope, $location, sharedFolderService) {

    $scope.urlId = $location.search().id
    $scope.folder = null;

    function init () {
      sharedFolderService.getByIdPub({ _id: $scope.urlId }).then(function (folder) {
        $scope.folder = folder;
      });
    }
    init();

  }

  adduploadController.$inject = ['$scope', '$location', 'multipartFormService'];
  function adduploadController ($scope, $location, multipartFormService) {

    $scope.urlId = $location.search().id;
    $scope.fileInput = '';
    $scope.name = '';
    $scope.reason = '';
    $scope.optionsRadios = '';
    $scope.reasonList = [
      {name: "Installation document"},
      {name: "Installation photos"},
      {name: "Commissioning document"},
      {name: "Commissioning photos"},
      {name: "Servicing document"},
      {name: "Servicing photos"},
      {name: "Photos of issues"},
      {name: "Photos of fixes"}
    ]

    $scope.saveUpload = function () {
      $scope.urlId = $location.search().id;

      //$scope.$watch('fileInput', function (newValue, oldValue) {
        //if (newValue) {
            var uploadUrl = '/api/uploadSharedFolder';
            const data = {
                '_id': $location.search().id,
                'filename': $scope.fileInput.name,
                'sharedFile': $scope.fileInput,
                'type': 'mobile',
                'person_type': $scope.optionsRadios,
                'person_name': $scope.name,
                'reason': $scope.reason,
                'description': $scope.description
            }
            multipartFormService.post(uploadUrl, data).then(function (response) {
              $location.path("/heat-manager/mobile-upload")
            }, function () {
                alertService('warning', 'Opps!', 'Something went wrong!');
            });
          //}
        //});
      //$location.path("/heat-manager/mobile-upload")
    }

  }

  overviewController.$inject = ['$scope', '$location', 'sharedFolderService'];
  function overviewController ($scope, $location, sharedFolderService) {

    $scope.urlId = $location.search().id;

    function init () {
      sharedFolderService.getByIdPub({ _id: $scope.urlId }).then(function (res) {
        $scope.folder = res;
        $scope.survey = res.survey
      });
    }
    init();

  }


})()
