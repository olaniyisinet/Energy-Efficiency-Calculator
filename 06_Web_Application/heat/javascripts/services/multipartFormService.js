(function () {
  'use strict';

  angular.module('cloudheatengineer').service('multipartFormService', multipartFormService);

  multipartFormService.$inject = ['$http', '$q'];
  function multipartFormService($http, $q) {
    this.post = function (uploadUrl, data) {

      var deferred = $q.defer();
      var fd = new FormData();

      for(var key in data)
        fd.append(key, data[key]);

      $http.post(uploadUrl, fd, {
        transformRequest: angular.identity,
        headers: {'Content-Type': undefined}
      }).then(function(response) {
        deferred.resolve(response);
      },
      function(response) {
        deferred.reject(response);
      });

      return deferred.promise;
    };
  }
})();