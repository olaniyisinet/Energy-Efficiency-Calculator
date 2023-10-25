(function () {
  'use strict';

  angular
    .module('cloudheatengineer')
    .factory('urlHelperService', urlHelperService);

  function urlHelperService() {

    var service = {};

    service.getHostUrl = function () {

      var http = location.protocol;
      var slashes = http.concat("//");
      var host = slashes.concat(window.location.host);

      return host;
    };

    return service;
  }
})();