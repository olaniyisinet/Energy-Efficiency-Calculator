(function () {
  'use strict';

  /**
   * Material Service
   * @params $inject
   * @type Service
   * @desc Initialize default materials and store it to localstorage for caching
   */
  materialService.$inject = ['$rootScope', '$window', 'apiService', '_'];
  function materialService($rootScope, $window, apiService, _) {

    var storage = $window.localStorage;

    this.update = function () {
      storage.setItem('materials', JSON.stringify($rootScope.materials));
    };

    this.updateManufactures = function () {
      storage.setItem('manufactures', JSON.stringify($rootScope.manufactures));
    };

    this.set = function () {

      var onSuccess = function (response) {
        $rootScope.materials = {};
        $rootScope.materials.insulation_thermal_conductivity = null;
        $rootScope.materials.defaults = response;

        apiService['customsin'].query({trainee: $rootScope.isTraineeSelected},function (response) {
          $rootScope.materials.customs = response;
          storage.setItem('materials', JSON.stringify($rootScope.materials));
        }, onFailure);
      };

      var onFailure = function (error) {deferred.resolve(error);};

      apiService['materials'].query(onSuccess, onFailure);
    };

    this.setManufactures = function () {

      var onFailure = function (error) {
        if(error.data.message == 'No manufactures just yet.')
          $rootScope.manufactures = null;
      };

      apiService['manufactures'].query(function (response) {
        $rootScope.manufactures = response;
        storage.setItem('manufactures', JSON.stringify($rootScope.manufactures));
      }, onFailure);
    };

    this.init = function () {
      if(storage.getItem('materials'))
        $rootScope.materials = JSON.parse(storage.getItem('materials'));
      if(storage.getItem('manufactures'))
        $rootScope.manufactures = JSON.parse(storage.getItem('manufactures'));
    };
  }

  /**
   * Project module
   */
  angular
    .module('cloudheatengineer')
    .service('materialService', materialService);
})();
