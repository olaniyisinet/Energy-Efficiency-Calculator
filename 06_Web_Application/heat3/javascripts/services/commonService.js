(function () {
  'use strict';

  angular.module('cloudheatengineer').factory('commonService', commonService);

  commonService.$inject = ['alertService'];
  function commonService (alertService) {
    var service = {};

    service.onError = function (error) {
      alertService('danger', 'Something went wrong :(', error.message);
    };

    return service;
  }
})();