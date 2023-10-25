(function () {
  'use strict';

  /**
   * Angular module
   * @desc handles all controller
   */
  angular
    .module('cloudheatengineer')
    .controller('MaterialsController', MaterialsController)
    .controller('CustomMaterialsController', CustomMaterialsController)
    .controller('ModalKnownUValueController', ModalKnownUValueController)
    .controller('ModalMaterialEditController', ModalMaterialEditController);

  /**
   * Materials Controller
   * @params MaterialsController.$inject
   * @type Controller
   * @desc handles default materials
   */
  MaterialsController.$inject = ['$location', '$rootScope', '$scope', '$modal', 'userService', 'alertService', 'apiService', 'materialService'];
  function MaterialsController($location, $rootScope, $scope, $modal, userService, alertService, apiService, materialService) {

    var data;

    var modalOptions = {
      templateUrl: '/partials/views/materials/components/_modal_known_u_value',
      controller: 'ModalKnownUValueController',
      size: 'md'
    };

    $rootScope.showHeader = false;
    $rootScope.showFooter = false;

    $scope.insulationConductivity = $rootScope.materials.insulation_thermal_conductivity || 0.025;
    var tabNum = $rootScope.materials.tab
    $scope.backPrevious = function () {
      $location.path('/' + $rootScope.materials.route + '/' + $rootScope.materials.id + '/'+ tabNum);
    };

    $scope.change = function (insulationConductivity) {
      if (insulationConductivity) {
        $rootScope.materials.insulation_thermal_conductivity = insulationConductivity;
        var depths = [0.025, 0.05, 0.075, 0.1, 0.12, 0.15];
        var i = 0;

        var mapped = _.map($rootScope.materials.defaults, function (material) {
          if (material.value_type == 'r_value') {
            material.u_value = parseFloat((depths[i] / $rootScope.materials.insulation_thermal_conductivity).toFixed(1));
            i = i + 1;
          }
          return material;
        });

        $rootScope.materials.defaults = mapped;
        materialService.update();
        alertService('success', 'Updated', 'R values are successfully updated!');
      } else
        alertService('danger', 'Not defined', 'You must input an insulation conductivity');
    };

    $scope.delete = function (custom) {
      custom['email'] = $rootScope.user.email
      apiService.save('checkCustom', custom).then(function (response) {
        if (response.count) {
          alertService('danger', 'Cannot Delete!', " Material in use on other reports.")
        }
        else {
          apiService.customs.destroy({ _id: custom._id }, function (response) {
            var index = $rootScope.materials.customs.indexOf(custom);
            $rootScope.materials.customs.splice(index, 1);
            if ($rootScope.materials.customs.length === 0) {
              $rootScope.materials.customs = null;
            }
            materialService.update();
            alertService('success', 'Custom Materials', response.message);
          }, function (error) {

          });
        }
      })
    };

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

    $scope.addKnownUValue = function (materialType) {

      var modalInstance = $modal.open({
        animation: true,
        templateUrl: modalOptions.templateUrl,
        controller: modalOptions.controller,
        size: modalOptions.size,
        resolve: {
          data: function () {
              return {
                  type: materialType
              }
          }
      }
      });

      modalInstance.result.then(function (material) {

        material.type = materialType;

        if (!!material.name && !!material.u_value && !!material.type) {

          data = {
            "material": material.name + ' (' + material.u_value + ')',
            "u_value": material.u_value,
            "type": material.type
          };

          apiService
            .save('customs', data)
            .then(function (response) {
              alertService('success', 'Custom material', response.message);
              $rootScope.materials.customs.push(response.data);
            }, function (error) {
              alertService('danger', 'Something went wrong!', error.message);
            });
        } else
          alertService('warning', 'Saved unsuccessful!', 'You must fill up the material description and the U value');
      }, function () {
      });
    };
  }

  ModalKnownUValueController.$inject = ['$scope', '$modalInstance'];
  function ModalKnownUValueController($scope, $modalInstance) {
    $scope.material = {};
    $scope.save = function (event) {
      //  console.log(event.keyCode)
      if (event.keyCode == 13) {
        $scope.ok()
      }
     }
    $scope.ok = function () {
      $modalInstance.close($scope.material);
    };

    $scope.cancel = function () {
      $modalInstance.dismiss('cancel');
    };
  }

  /**
   * Custom Materials Controller
   * @params CustomMaterialsController.$inject
   * @desc handles modal view and custom materials
   */
  CustomMaterialsController.$inject = [
    '$scope',
    '$routeParams',
    '$modal',
    '$location',
    '$rootScope',
    'apiService',
    'alertService',
    'userService',
    'commonService',
    '_'
  ];
  function CustomMaterialsController($scope, $routeParams, $modal, $location, $rootScope, apiService, alertService, userService, commonService, _) {

    //TODO: Work on thermal resistance modifying of data
    $scope.custom_material = {};
    $scope.custom_material.heat_flow = {};
    $scope.custom_material.internal_laminar_layer = {};
    $scope.custom_material.materials = [];
    $scope.custom_material.element_type = null;

    $scope.custom_material.heat_flow.top = null;
    $scope.custom_material.heat_flow.bottom = null;

    $scope.custom_material.internal_laminar_layer.name = null;
    $scope.custom_material.internal_laminar_layer.thickness = 0;
    $scope.custom_material.internal_laminar_layer.thermal_conductivity = 0;
    $scope.custom_material.internal_laminar_layer.thermal_resistance = 0;

    $scope.custom_material.total_thickness = 0;
    $scope.custom_material.total_thermal_resistance = 0;
    $scope.custom_material.name = '';
    $scope.custom_material.u_value = 0;
    $scope.custom_material.type = $routeParams.type;

    if (!!$rootScope.reference) {

      var split = $rootScope.reference.item.split('.');

      $scope.reference = Object.assign({}, $rootScope.reference);
      // $rootScope.reference = undefined;

      if (split.length > 1)
        $scope.reference.name = getPropertyByArray($scope.reference.idx, split);
      else
        $scope.reference.name = $scope.reference.survey.surveys.rooms[$scope.reference.idx][$scope.reference.item];

      $rootScope.reference.name = $scope.reference.name;

    }

    function getPropertyByArray(idx, item) {
      if (item.length == 1)
        return $scope.reference.survey.surveys.rooms[idx][item[0]];
      else if (item.length == 2)
        return $scope.reference.survey.surveys.rooms[idx][item[0]][item[1]];
      else if (item.length == 3)
        return $scope.reference.survey.surveys.rooms[idx][item[0]][item[1]][item[2]];
      else if (item.length == 4)
        return $scope.reference.survey.surveys.rooms[idx][item[0]][item[1]][item[2]][item[3]];
    }

    $scope.changeTheme = function (color) {
      $rootScope.user.theme = color;
      userService.updateStorage($rootScope.user);
    };

    $scope.save = function () {
      var data;
      var split = null;

      if (!!$scope.custom_material.name && !!$scope.custom_material.u_value && !!$scope.custom_material.type) {

        data = {
          "material": $scope.custom_material.name,
          "u_value": $scope.custom_material.u_value,
          "type": $scope.custom_material.type
        };


        apiService
          .save('customs', data)
          .then(function (response) {
            alertService('success', 'Custom material', response.message);
            $rootScope.materials.customs.push(response.data);

            if (!!$scope.reference) {
              // TODO: continue working here
              split = $scope.reference.item.split('.');

              if (split.length > 1) {
                if (split.length == 2)
                  $scope.reference.survey.surveys.rooms[$scope.reference.idx][split[0]][split[1]] = data.material;
                else if (split.length == 3)
                  $scope.reference.survey.surveys.rooms[$scope.reference.idx][split[0]][split[1]][split[2]] = data.material;
                else if (split.length == 4)
                  $scope.reference.survey.surveys.rooms[$scope.reference.idx][split[0]][split[1]][split[2]][split[3]] = data.material;
              } else
                $scope.reference.survey.surveys.rooms[$scope.reference.idx][$scope.reference.item] = data.material;

              $rootScope.reference.newValue = data.material;

              apiService.update('surveys', $scope.reference.survey).then(function (response) {
                $scope.survey = response;

                $location.path('/summary/' + $scope.reference.survey._id + '/' + $scope.reference.page);
              }, commonService.onError);
            }

            $location.path('/materials');
          }, function (error) {
            alertService('danger', 'Something went wrong!', error.message);
          });
      } else
        alertService('warning', 'Fill up', 'You must atleast create an internal laminar layer');
    };

    $scope.modalEdit = function (type, idx, isOverride) {
      showModal(type, idx, isOverride);
    };

    $scope.remove = function (type, idx) {
      if (type === 'materials')
        $scope.custom_material.materials.splice(idx, 1);
      computeAll();
    };

    showModal('internal_laminar_layer');

    /**
     * Function compute all
     */
    function computeAll() {

      if ($scope.custom_material.element_type === 'external_wall')
        $scope.custom_material.heat_flow = { top: 0.13, bottom: 0.04 };
      else if ($scope.custom_material.element_type === 'internal_wall')
        $scope.custom_material.heat_flow = { top: 0.13, bottom: 0.13 };
      else if ($scope.custom_material.element_type === 'roof')
        $scope.custom_material.heat_flow = { top: 0.1, bottom: 0 };
      else if ($scope.custom_material.element_type === 'floor_ground')
        $scope.custom_material.heat_flow = { top: 0.17, bottom: 0 };
      else if ($scope.custom_material.element_type === 'floor_intermediate')
        $scope.custom_material.heat_flow = { top: 0.17, bottom: 0.17 };

      $scope.custom_material.internal_laminar_layer.thermal_resistance =
        computeThermalResistance($scope.custom_material.internal_laminar_layer);

      $scope.custom_material.internal_laminar_layer.thermal_resistance =
        isInfinity($scope.custom_material.internal_laminar_layer.thermal_resistance);

      var total_thickness = $scope.custom_material.internal_laminar_layer.thickness;
      var total_thermal_resistance = $scope.custom_material.internal_laminar_layer.thermal_resistance;

      angular.forEach($scope.custom_material.materials, function (value, key) {

        $scope.custom_material.materials[key].thermal_resistance =
          computeThermalResistance($scope.custom_material.materials[key]);

        $scope.custom_material.materials[key].thermal_resistance =
          isInfinity($scope.custom_material.materials[key].thermal_resistance);

        total_thickness = total_thickness + value.thickness;
        total_thermal_resistance = total_thermal_resistance + $scope.custom_material.materials[key].thermal_resistance;
      });

      $scope.custom_material.total_thickness = parseFloat(total_thickness.toFixed(4));
      total_thermal_resistance = total_thermal_resistance +
        $scope.custom_material.heat_flow.top +
        $scope.custom_material.heat_flow.bottom;
      $scope.custom_material.total_thermal_resistance = parseFloat(total_thermal_resistance.toFixed(4));
      $scope.custom_material.u_value = 1 / $scope.custom_material.total_thermal_resistance;
      $scope.custom_material.u_value = parseFloat($scope.custom_material.u_value.toFixed(2));

      $scope.custom_material.name = $scope.custom_material.internal_laminar_layer.name + ' ' +
        ($scope.custom_material.internal_laminar_layer.thickness * 1000) + 'mm';

      var name_concat = '';
      angular.forEach($scope.custom_material.materials, function (value) {
        name_concat = ', ' + value.name + ' ' + (value.thickness * 1000) + 'mm';
        $scope.custom_material.name += name_concat;
      });
      $scope.custom_material.name += ', (' + $scope.custom_material.u_value + ')';
    }

    function isInfinity(result) {
      return result == Number.POSITIVE_INFINITY || result == Number.NEGATIVE_INFINITY ? 0 : parseFloat(result.toFixed(3));
    }

    function computeThermalResistance(result) {
      return !result.thermal_resistance ?
        result.thickness /
        result.thermal_conductivity :
        result.thermal_resistance;
    }

    /**
     * function show modal
     */
    function showModal(item, idx, isOverride) {

      var custom_material;
      var reference = $scope.reference ? $scope.reference.name : null;
      isOverride = isOverride ? isOverride : false;

      if (item === 'internal_laminar_layer' && !idx) {
        custom_material = $scope.custom_material[item];
      } else if (item === 'materials' && typeof idx === 'undefined') {
        $scope.custom_material[item].push({
          name: null,
          thickness: 0,
          thermal_conductivity: 0,
          thermal_resistance: 0
        });
        idx = $scope.custom_material[item].length - 1;
        custom_material = $scope.custom_material[item][idx];
      } else if (item === 'materials' && idx >= 0)
        custom_material = $scope.custom_material[item][idx];


      var modalInstance = $modal.open({
        animation: true,
        templateUrl: '/partials/views/materials/components/_modal',
        controller: 'ModalMaterialEditController',
        size: 'md',
        resolve: {
          item: function () {
            return {
              custom_material: custom_material,
              element_type: $scope.custom_material.type,
              isOverride: isOverride,
              reference: reference
            };
          }
        }
      });

      modalInstance.result.then(function (data) {
        $scope.custom_material.element_type = data.element_type;
        if (item === 'internal_laminar_layer' && !idx)
          $scope.custom_material[item] = data.item;
        else
          $scope.custom_material[item][idx] = data.item;
        computeAll();
      }, function () {
        if (item === 'materials' && idx >= 0) {
          $scope.custom_material[item].pop();
        }
      });
    }
  }

  /**
   * Modal Material Edit Controller
   * @params CustomMaterialsController.$inject
   * @type Controller
   * @desc shows modal for editing and creating new materials
   */
  ModalMaterialEditController.$inject = ['$scope', '$modalInstance', 'item'];
  function ModalMaterialEditController($scope, $modalInstance, item) {

    $scope.selected = { item: item.custom_material, element_type: item.element_type };
    $scope.has_known_value = false;
    $scope.isOverride = item.isOverride;
    $scope.reference = item.reference;

    $scope.known_value = function () {
      $scope.has_known_value = !$scope.has_known_value;
    };
    $scope.save = function (event) {
      //  console.log(event.keyCode)
      if (event.keyCode == 13) {
        $scope.ok()
      }
     }
    $scope.ok = function () {
      $modalInstance.close($scope.selected);
    };

    $scope.cancel = function () {
      $modalInstance.dismiss('cancel');
    };
  }
})();
