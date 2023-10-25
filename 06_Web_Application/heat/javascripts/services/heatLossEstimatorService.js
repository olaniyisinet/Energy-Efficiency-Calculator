(function () {
  'use strict';

  var app = angular.module('cloudheatengineer');

  app.service("heatLossEstimatorService", ['$http', 'urlHelperService', function ($http, urlHelperService) {

    var baseUrl = urlHelperService.getHostUrl();
    var urls = {
      createEstimator: '/api/heatlossestimates'
    };

    this.getDataConstantJson = function () {
      return $http.get(baseUrl + '/javascripts/json/heatLossEstimator.json');
    };

    this.getEstimatorType = function (data) {
      return $http.post(urls.createEstimator, data)
    };

    this.copyEstimateReport = function (data) {
      return $http.post(urls.createEstimator, data)
    };

    this.updateEstimatorType = function (data) {
      return $http.put(urls.createEstimator, data)
    };

    this.updateBasicFormData = function (data) {
      return $http.put(urls.createEstimator, data)
    };

    this.updateMainbuilding = function (data) {
      return $http.put(urls.createEstimator, data)
    };

    this.updateMainbuildingExtension = function (data) {
      return $http.put(urls.createEstimator, data)
    };

    this.updateFinalFormData = function (data) {
      return $http.put(urls.createEstimator, data)
    };

    this.updateUserInfo = function (id, data) {
      return $http.put(urls.createEstimator + '/updateUser/'+ id, data)
    };

    this.deleteReport = function (id, data) {
      return $http.delete(urls.createEstimator +'/'+ id)
    };

    this.getHeatLossEstimatorValueForPDF = function (id) {
      return $http.post(urls.createEstimator + "/GetById", {
        "estimate": {
          "estimate_id": id
        }
      });
    }

    this.getDataByUser = function (data) {
      return $http.post(urls.createEstimator + '/GetByUser', {
        "estimate": {
          "estimator_email": data.email
        }
      });
    }

  }]);

})();
