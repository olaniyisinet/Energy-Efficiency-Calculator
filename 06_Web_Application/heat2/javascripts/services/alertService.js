(function () {
  'use strict';

  function alertService($rootScope, $timeout) {
    var alertTimeout;
    return function (type, title, message, timeout) {
      $rootScope.alert = {
        hasBeenShown: true,
        show: true,
        type: type,
        message: message,
        title: title
      };

      $rootScope.closeAlert = function () {
        $timeout.cancel(alertTimeout);
        $rootScope.alert = null;
      };

      $timeout.cancel(alertTimeout);
      alertTimeout = $timeout(function () {
        $rootScope.alert = null;
      }, timeout || 7000);
    };
  }

  angular
    .module('cloudheatengineer')
    .service('alertService', ['$rootScope', '$timeout', alertService]);
}());


