(function () {
  'use strict';

  function authInterceptor(authTokenService) {
    return {
      request: function (config) {
        var token = authTokenService.getToken();

        if(token) {
          config.headers.Authorization = 'Bearer ' + token; }
        return config;
      },
      response: function (response) {
        return response;
      }
    };
  }

  angular
    .module('cloudheatengineer')
    .factory('authInterceptor', ['authTokenService', authInterceptor]);
}());
