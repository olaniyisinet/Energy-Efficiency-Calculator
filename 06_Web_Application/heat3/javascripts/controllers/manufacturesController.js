(function () {
  'use strict';

  angular.module('cloudheatengineer').controller('ManufacturesController', ManufacturesController);
  angular.module('cloudheatengineer').controller('AddManufacturesController', AddManufacturesController);
  angular.module('cloudheatengineer').controller('ModalManufactureInstanceController', ModalManufactureInstanceController);
  angular.module('cloudheatengineer').controller('ModelsController', ModelsController);
  angular.module('cloudheatengineer').controller('AddModelsController', AddModelsController);

  ManufacturesController.$inject = ['$rootScope', '$location', '$scope', '$modal', 'apiService', 'alertService', 'userService'];
  function ManufacturesController($rootScope, $location, $scope, $modal, apiService, alertService, userService) {

    $rootScope.isTraineeSelected = window.localStorage.getItem('isTraineeSelected')
    $scope.user = $rootScope.user
    init();

    $scope.changeTheme = function (color) {
      $rootScope.user.theme = color;
      userService.updateStorage($rootScope.user);
    };

    $scope.changeFont = function (fontType) {
      $rootScope.user.ui_theme.fontFamily = fontType;
      userService.updateStorage($rootScope.user);
    };

    $scope.changeBackground = function (style) {
      $rootScope.user.ui_theme.background = style.background;
      $rootScope.user.ui_theme.color = style.color;
      userService.updateStorage($rootScope.user);
    };

    $scope.showModels = function (manufacture) {
        $location.path('/models/' + manufacture._id);
    };

    $scope.modifyManufacture = function (manufacture) {
      if(!$rootScope.user.is_admin){
        if(manufacture._user_id != $rootScope.user._id) {
          alertService('warning', 'Failed', 'Unable to modify manufacture, you do not have admin rights');
          return
        }
      }
      $location.path('/add-manufacture/' + manufacture._id);
    };

    $scope.removeManufacture = function (manufacture) {
      if (!$rootScope.user.is_admin) {
        if (manufacture._user_id != $rootScope.user._id) {
          alertService('warning', 'Failed', 'Unable to delete manufacture, you do not have admin rights');
          return
        }
      }

      apiService.manufactures.destroy({ _id: manufacture._id }, function (response) {

        var index = $scope.manufactures.indexOf(manufacture);
        $scope.manufactures.splice(index, 1);
        if ($scope.manufactures.length === 0) {
          $scope.manufactures = null;
        }

        alertService('success', 'Manufacture', response.message);
      }, function (error) {
      });
    };

    $scope.showButtons = false;
    if($rootScope.user.is_admin) {
      $scope.showButtons = true;
    }

    function init () {

      apiService['getAllPremier'].query(function (response) {
        $scope.premiumManufactures = response
      })

      apiService['manufacturesin'].query({ trainee: $rootScope.isTraineeSelected }, function (response) {
        $scope.adminManufactures = response.adminManu
        $scope.myManufactures = response.myManu
      });
    }
  }

  AddManufacturesController.$inject = ['$routeParams', '$rootScope', '$scope', '$location', 'apiService', 'alertService','_', 'materialService'];
  function AddManufacturesController($routeParams, $rootScope, $scope, $location, apiService, alertService,_, materialService) {

    $scope.manufacture = {};

    if(!!$routeParams.id && $routeParams.id != 1) {
      $scope.isUpdate = true;
      apiService.get('manufactures', {_id: $routeParams.id}).then(function (manufacture) {
        $scope.manufacture = manufacture;
      });
    }

    $scope.updateManufacture = function () {
      apiService
        .update('manufactures', $scope.manufacture)
        .then(function (response) {
          alertService('success', 'Manufactures', 'Successfully updated!');
          var arr = _.map($rootScope.manufactures, function (manufacture) {
            if(manufacture._id == $scope.manufacture._id)
              manufacture = $scope.manufacture;
            return manufacture;
          });
          $rootScope.manufactures = arr;
          materialService.updateManufactures();
          $location.path('/manufactures');
        }, function (error) {
          alertService('danger', 'Something went wrong!', error.message);
        });
    };

    $scope.saveManufacture = function () {
      apiService
        .save('manufactures', $scope.manufacture)
        .then(function (response) {
          alertService('success', 'Manufactures', response.message);
          if(!$rootScope.manufactures)
            $rootScope.manufactures = [];
          $rootScope.manufactures.push($scope.manufacture);
          materialService.updateManufactures();
          $location.path('/manufactures');
        }, function (error) {
          alertService('danger', 'Something went wrong!', error.data.message);
        });
    };
  }

  ModalManufactureInstanceController.$inject = ['$scope', '$modalInstance'];
  function ModalManufactureInstanceController($scope, $modalInstance) {

    $scope.manufacture = {};

    $scope.ok = function () {
      $modalInstance.close($scope.manufacture);
    };

    $scope.cancel = function () {
      $modalInstance.dismiss('cancel');
    };
  }

  ModelsController.$inject = ['$rootScope', '$scope', '$routeParams', '$location', 'apiService', 'alertService', 'materialService','$modal'];
  function ModelsController($rootScope, $scope, $routeParams, $location, apiService, alertService, materialService,$modal) {
    // apiService.get('manufactures', {_id: $routeParams.id}).then(function (manufacture) {
    //   $scope.manufacture = manufacture;
    // });
    $scope.visibility = false
    apiService.get('models', {_id: $routeParams.id}).then(function (manufacture) {
    $scope.manufacture = manufacture;
    });
    $scope.modifyModel = function (index) {
      $location.path('/add-models/' + $scope.manufacture._id + '/' + index);
    };
    function init(){
      apiService.get('models', {_id: $routeParams.id}).then(function (manufacture) {
        $scope.manufacture = manufacture;
        });
        $scope.modifyModel = function (index) {
          $location.path('/add-models/' + $scope.manufacture._id + '/' + index);
        };
    }
    if($scope.user.is_admin || !$scope.user.isManufacture){
      $scope.visibility = true
    }
    $scope.outputPerformance = function (index) {
      var modalOptions = {};
      modalOptions.templateUrl = '/partials/views/premium-page/components/_modal_output_performance';
      modalOptions.controller = 'ModalOutputPerformanceController';
      modalOptions.size = 'md';

      var modalInstance = $modal.open({
        animation: true,
        templateUrl: modalOptions.templateUrl,
        controller: modalOptions.controller,
        size: modalOptions.size,
        resolve: {
          data: function () {
            return {
              manufacture: $scope.manufacture,
              index:index,
              visibility : true
            }
          }
        }
    });
    modalInstance.result.then(function(manufacture) {
      init()
    }, function() {});

    };
    $scope.removeModel = function (model) {
      var index = $scope.manufacture.models.indexOf(model);

      $scope.manufacture.models.splice(index, 1);

      apiService
        .update('manufactures', $scope.manufacture)
        .then(function (response) {
          alertService('success', 'Models', 'Successfully removed!');
          var arr = _.map($rootScope.manufactures, function (manufacture) {
            if(manufacture._id == $scope.manufacture._id)
              manufacture = $scope.manufacture;
            return manufacture;
          });
          $rootScope.manufactures = arr;
          materialService.updateManufactures();
          $location.path('/models/' + $scope.manufacture._id);
        }, function (error) {
          alertService('danger', 'Something went wrong!', error.message);
        });
    };
  }

  AddModelsController.$inject = ['$rootScope', '$scope', '$location', '$routeParams', 'apiService', 'alertService', '_', 'materialService'];
  function AddModelsController($rootScope, $scope, $location, $routeParams, apiService, alertService, _, materialService) {

    $scope.data = {
      fuelType: [
        'Ground Source Heat pump',
        'Air Source Heat Pump',
        'Biomass Chips',
        'Biomass Logs',
        'Biomass Wood Pellets',
        'Oil',
        'Mains Gas',
        'LPG',
        'Direct Electric'
      ],
      spf: [
        'Yes - Heat Engineer will use a likely SPF value',
        'No - use the new ErP values',
        'No - Please use website link to MCS website to search database'
      ],
      highModel: [
        'Yes',
        'No'
      ]
    };
    $scope.model = {};
    $scope.model.scop = [
      {temp: 35, spf: null},
      {temp: 40, spf: null},
      {temp: 45, spf: null},
      {temp: 50, spf: null},
      {temp: 55, spf: null},
      {temp: 60, spf: null},
      {temp: 65, spf: null}
    ];


    apiService.get('manufactures', {_id: $routeParams.id}).then(function (manufacture) {

      $scope.manufacture = manufacture;
      if(!!$routeParams.model_id && $routeParams.model_id != 'add') {
        $scope.isUpdate = true;
        $scope.model = $scope.manufacture.models[$routeParams.model_id];
      }
    });

    $scope.saveModels = function () {

      if($scope.model.fuel_type == 'Ground Source Heat pump' || $scope.model.fuel_type == 'Air Source Heat Pump'){
        $scope.model.likely_spf = 'No - use the new ErP values'
      }
      if(!$scope.isUpdate)
        $scope.manufacture.models.push($scope.model);

      apiService
        .update('manufactures', $scope.manufacture)
        .then(function (response) {
          alertService('success', 'Model', response.message);
          var arr = _.map($rootScope.manufactures, function (manufacture) {
            if(manufacture._id == $scope.manufacture._id)
              manufacture = $scope.manufacture;
            return manufacture;
          });
          $rootScope.manufactures = arr;
          materialService.updateManufactures();
          $location.path('/models/' + $scope.manufacture._id);
      }, function (error) {
        alertService('danger', 'Something went wrong!', error.message);
      });
    };
  }
})();
