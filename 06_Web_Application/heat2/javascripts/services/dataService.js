(function () {
  'use strict';

  angular
    .module('cloudheatengineer')
    .factory('dataService', dataService);
  /**
   * @service dataService
   * @type factory
   * @params $inject
   * @desc initialize data on rootScope
   */
  dataService.$inject = ['$http', '$rootScope', '$window', 'materialService', 'urlHelperService'];

  function dataService($http, $rootScope, $window, materialService, urlHelperService) {
    var service = {};
    var storage = $window.localStorage;

    service.dataSetup = function () {
      $http
        .get(urlHelperService.getHostUrl() + '/javascripts/json/data.json')
        .then(function (response) {
          $rootScope.cloud_data = response.data;
          storage.setItem('cloud_data', JSON.stringify($rootScope.cloud_data));
        }, function (error) {});
    };

    service.pipeDataSetup = function () {
      $http
        .get(urlHelperService.getHostUrl() + '/javascripts/json/data-pipes.json')
        .then(function (response) {
          $rootScope.pipe_data = response.data;
          //storage.setItem('pipe_data', JSON.stringify($rootScope.cloud_data));
        }, function (error) {
          console.log('error :::', error);
        });
    };

    service.dataInit = function () {
      if (storage.getItem('cloud_data'))
        $rootScope.cloud_data = JSON.parse(storage.getItem('cloud_data'));
    };

    service.setupAll = function () {
      this.dataSetup();
      materialService.set();
      materialService.setManufactures();
    };

    service.init = function () {
      this.dataSetup();
      materialService.init();
    };

    service.removeData = function () {
      storage.removeItem('materials');
      storage.removeItem('cloud_data');
      storage.removeItem('manufactures');
      storage.removeItem('merchManufactures');
      //storage.removeItem('pipe_data');
    };

    return service;
  }

})();
