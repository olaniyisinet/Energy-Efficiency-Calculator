(function () {
  'use strict';

  function sharedFolderService (apiService, $q, log) {

    var getById = async function (query) {
      var deferred = $q.defer();
      await apiService.get('sharedFolder', query).then(function (response) {
        deferred.resolve(response);
      }, function (error) {
        deferred.reject(error);
      });
      return deferred.promise;
    };

    var getByIdPub = async function (query) {
      var deferred = $q.defer();
      await apiService.get('sharedFolderpub', query).then(function (response) {
        deferred.resolve(response);
      }, function (error) {
        deferred.reject(error);
      });
      return deferred.promise;
    };

    var getAll = async function (query) {
      var deferred = $q.defer();
      await apiService.getAll('sharedFolders', query).then(function (response) {
        deferred.resolve(response);
      }, function (error) {
        deferred.reject(error);
      });
      return deferred.promise;
    };

    var update = async function (query) {
      var deferred = $q.defer();
      await apiService.update('sharedFolder', query).then(function (response) {
        deferred.resolve(response);
      }, function (error) {
        deferred.reject(error);
      });
      return deferred.promise;
    };
    var requestQr = async function (query) {
      var deferred = $q.defer();
      await apiService.save('sharedFolderQr', query).then(function (response) {
        deferred.resolve(response);
      }, function (error) {
        deferred.reject(error);
      });
      return deferred.promise;
    };
    var destroyFile = async function (query) {
      var deferred = $q.defer();
      await apiService.destroy('sharedFolderFile', query).then(function (response) {
        deferred.resolve(response);
      }, function (error) {
        deferred.reject(error);
      });
      return deferred.promise;
    };
    var emailToUsers = async function (query) {
      var deferred = $q.defer();
      await apiService.save('sharedFolderEmailToUsers', query).then(function (response) {
        deferred.resolve(response);
      }, function (error) {
        deferred.reject(error);
      });
      return deferred.promise;
    };

    var destroyMobileFile = async function (query) {
      var deferred = $q.defer();
      await apiService.destroy('sharedFolderMobileFile', query).then(function (response) {
        deferred.resolve(response);
      }, function (error) {
        deferred.reject(error);
      });
      return deferred.promise;
    };
    return {
      update,
      getAll,
      getById,
      requestQr,
      destroyFile,
      destroyMobileFile,
      emailToUsers,
      getByIdPub
    }
  }

  angular.module('cloudheatengineer').factory('sharedFolderService', ['apiService', '$q', 'log', sharedFolderService]);
}());
