(function () {
  'use strict';

  angular.module('cloudheatengineer').controller('applogController', applogController);
  angular.module('cloudheatengineer').controller('AddApplogController', AddApplogController);


  applogController.$inject = ['$scope', 'apiService', 'alertService', '$rootScope', '$location'];

  function applogController ($scope, apiService, alertService, $rootScope, $location) {


    $rootScope.showHeader = false;
    $rootScope.showFooter = false;
    $scope.showButtons = false;
    if ($rootScope.user.is_admin) {
      $scope.showButtons = true;
    }
    $scope.applog = []

    $scope.modifyapplog = function (applogs) {

      if (!$rootScope.user.is_admin) {
        if (applogs._user_id != $rootScope.user._id) {
          alertService('warning', 'Failed', 'Unable to modify applog, you do not have admin rights');
          return
        }
      }
      $location.path('/add-applog/' + applogs._id);
    };

    function initApplog() {
      apiService.getAll("applog", {}).then(function (data) {
        $scope.applog = data;
      });
    }

    initApplog()

    $scope.deleteApplog = function (log) {
      if (confirm('Are you sure you want to remove, action not reversible ?')) {
        apiService
        .destroy('applog', {_id: log._id})
        .then(function (data) {
          alertService('success', 'applog', data.message);
          initApplog();
        }, function (error) {
          alertService('danger', 'Something went wrong!', error.data.message);
        });
      }
    }
  }

  AddApplogController.$inject = ['$routeParams', '$rootScope', '$scope', '$location', 'apiService', 'alertService', '_', 'materialService'];
  function AddApplogController ($routeParams, $rootScope, $scope, $location, apiService, alertService, _, materialService) {

    $scope.applog = {};

    function initAppLogAdd () {
      if (!!$routeParams.id && $routeParams.id != 1) {
        $scope.isUpdate = true;
        apiService.get('applog', { _id: $routeParams.id }).then(function (app) {
          $scope.applog = app.data;
          let spDt = app.data.date_created.split("T");
          $scope.applog.date_created = spDt[0];
        });
      }
    }

    $scope.updateapplog = function () {
      apiService.update('applog', $scope.applog).then(function (response) {
        alertService('success', 'Applog', 'Successfully updated!');
        $location.path('/applog');
      }, function (error) {
        alertService('danger', 'Something went wrong!', error.message);
      });
    };

    $scope.saveapplog = function () {
      apiService
        .save('applog', $scope.applog)
        .then(function (data) {
          alertService('success', 'applog', data.message);
          $location.path('/applog');
        }, function (error) {
          console.log(error);
          alertService('danger', 'Something went wrong!', error.data.message);
        });
    };

    initAppLogAdd()

  }
})();
