(function () {
  'use strict';

  function logService() {
    return {
      console: function (pre, data) {
      },

      alert: function (pre, data) {
      }
    }
  }

  angular
    .module('cloudheatengineer')
    .factory('log', logService);
}());