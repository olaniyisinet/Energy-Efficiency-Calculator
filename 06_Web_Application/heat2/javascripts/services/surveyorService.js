(function () {
  'use strict';

  function surveyorService(apiService, $q, log) {

    var invite = function (email) {
      var deferred = $q.defer();
      apiService.surveyors.save({email: email}, function (response) {
        deferred.resolve(response);
      }, function (error) {
        deferred.reject(error);
      });

      return deferred.promise;
    };

    var get = function () {
      var deferred = $q.defer();
      apiService.surveyors.query(function (response) {
        deferred.resolve(response);
      }, function (error) {
        deferred.reject(error);
      });
      return deferred.promise;
    };

    var destroy = function (id) {
      var deferred = $q.defer();
      apiService.surveyors.destroy({_id: id}, function (response) {
        deferred.resolve(response);
      }, function (error) {
        deferred.reject(error);
      });
      return deferred.promise;
    };

    return {
      invite: invite,
      get: get,
      destroy: destroy
    }
  }

  angular.module('cloudheatengineer').factory('surveyorService', ['apiService', '$q', 'log', surveyorService]);
}());