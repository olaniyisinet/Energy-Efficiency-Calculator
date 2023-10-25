(function () {
  'use strict';

  var app = angular.module('cloudheatengineer');

  /**
   * Dashboard Controller
   */
  app.controller('PremiumMerchantController', PremiumMerchantController);
  app.controller('PremiumMerchantModelController', PremiumMerchantModelController);
  app.controller('MerchantModalAddController', MerchantModalAddController);
  app.controller('ModalOutputPerformanceMerchantController', ModalOutputPerformanceMerchantController)

  PremiumMerchantController.$inject = ['$rootScope', '$scope', 'data', 'userService', '_', 'taxamo', 'apiService', 'alertService', 'lodash', 'braintreeService', '$location'];

  function PremiumMerchantController ($rootScope, $scope, data, userService, _, taxamo, apiService, alertService, lodash, braintreeService, $location) {
    $scope.manufactures = []
    $scope.field = false
    function init () {

      let query = {
        limit: 100,
        skip: 0,
      }

      apiService['manufacturerAll'].query(query, function (response) {
        $scope.manufactures = response.users
      })
    }

    init()
    $scope.editDescription = function (data, index) {

      $scope.details = data
      $scope.index = index

    }

    $scope.update = function () {
      apiService.users.update({ _id: $scope.details._id }, $scope.details, function (response) {
        alertService('success', 'Account Details', response.message);
        $scope.index = null
      }, function (error) {
        console.log(error);
        // alertService('warning', 'Password', error.data.message);
      });
    }

    $scope.cancel = function () {
      $scope.index = null
      init();
    }
    $scope.moveTo = function (location, manufacture) {

      $location.path('/' + location + '/' + manufacture._id);

    };
  }
  PremiumMerchantModelController.$inject = ['$rootScope', '$scope', '_', 'apiService', 'alertService','$location', '$routeParams', 'materialService', '$modal', 'multipartFormService', '$timeout'];
  function PremiumMerchantModelController ($rootScope, $scope, _, apiService, alertService, $location, $routeParams, materialService, $modal, multipartFormService, $timeout) {

    $scope.user = JSON.parse(window.localStorage.getItem('user'))
    $rootScope.showHeader = false;
    $rootScope.showFooter = false;
    $rootScope.heatmanagerview = true;

    $scope.visibility = false
    $scope.merchantvisibility = false

    function init () {
      let query = {
        // filter: $scope.selectedSort,
        limit: 100,
        skip: 0,
      }
      apiService['manufacturerAll'].query(query, function (response) {
        var allManu = response.users
        var usersss = allManu.filter(function (val) { return val._id == $routeParams.id; });
        $scope.userDetails = usersss[0]
        if (!$scope.userDetails.siteLinks) {
          $scope.userDetails.siteLinks = {}
        }
        $scope.logo = usersss[0].logo
      })

      // apiService.get('manufacturesByUserId', { _id: $routeParams.id }).then(function (details) {
      //   $scope.selectedManufacture = details
      //   $scope.visibility = true
      // });
      $scope.user = JSON.parse(window.localStorage.getItem('user'))
      apiService.get('merchantByUserId', { _id: $routeParams.id }).then(function (details1) {
        $scope.merchantManufactures = details1.merchant
        if ($scope.user && $scope.user._id == details1.merchant[0]._user_id) {
          $scope.visibility = true
        }
      });

      if ($scope.user && ($scope.user.isMerchant || $scope.user.isMcsUmbrellaComp)) {
        $scope.visibility = true;
      }
    }

    init()

    $scope.manuDetails = function () {
      var details = JSON.parse($scope.manuForDetails)
      var data = $scope.merchantManufactures.filter(function (o) {
        return o._id == details._id;
      });
      $scope.selectedManufacture = data[0]
    }
    $scope.back = function () {
      if (!$scope.user || !$scope.user.isManufacturer || $scope.user.isManufacturer == null) {
        $location.path('/subscribed-manufacturers');
      } else {
        $location.path('/dashboard');
      }
    }

    $scope.outputPerformance = function (index) {
      var modalOptions = {};
      modalOptions.templateUrl = '/partials/views/premium-page-merchant/components/_modal_output_performance_merchant';
      modalOptions.controller = 'ModalOutputPerformanceMerchantController';
      modalOptions.size = 'md';

      var modalInstance = $modal.open({
        animation: true,
        templateUrl: modalOptions.templateUrl,
        controller: modalOptions.controller,
        size: modalOptions.size,
        resolve: {
          data: function () {
            return {
              manufacture: $scope.selectedManufacture,
              index: index,
              visibility: $scope.visibility
            }
          }
        }
      });
      modalInstance.result.then(function (manufacture) {
        init()
      }, function () { });

    };

    // Merchant
    $scope.modifyMerchantModel = function (index) {
      var modalOptions = {};
      modalOptions.templateUrl = '/partials/views/premium-page/components/_merchant_modal_add_madel';
      modalOptions.controller = 'MerchantModalAddController';
      modalOptions.size = 'md';

      var modalInstance = $modal.open({
        animation: true,
        templateUrl: modalOptions.templateUrl,
        controller: modalOptions.controller,
        size: modalOptions.size,
        resolve: {
          data: function () {
            return {
              manufacture: $scope.selectedManufacture,
              index: index
            }
          }
        }
      });
      modalInstance.result.then(function (manufacture, isUpdate) {
        if (index != "add") {
          apiService
            .update('merchant', manufacture)
            .then(function (response) {
              alertService('success', 'Model', response.message);
              init()
              $scope.manuDetails()
              // materialService.updateManufactures();
              // $location.path('/premium-page/' + $scope.manufacture._user_id);
            }, function (error) {
              alertService('danger', 'Something went wrong!', error.message);
            });
        } else {
          apiService
            .save('merchant', manufacture)
            .then(function (response) {
              alertService('success', 'Merchant', response.message);
              init()
              $scope.manuDetails()
            }, function (error) {
              console.log(error);
              alertService('danger', 'Something went wrong!', error.data.message);
            });
        }

      }, function () { });
      // $location.path('/add-premium-models/' + $scope.selectedManufacture._id + '/' + index);
    };

    $scope.removeModel = function (model) {
      var index = $scope.selectedManufacture.models.indexOf(model);

      $scope.selectedManufacture.models.splice(index, 1);

      apiService
        .update('merchant', $scope.selectedManufacture)
        .then(function (response) {
          alertService('success', 'Models', 'Successfully removed!');
          var arr = _.map($rootScope.manufactures, function (manufacture) {
            if (manufacture._id == $scope.selectedManufacture._id)
              manufacture = $scope.selectedManufacture;
            return manufacture;
          });
          $rootScope.manufactures = arr;
          materialService.updateManufactures();
          $location.path('/subscribed-page-merchant/' + $scope.selectedManufacture._user_id);
        }, function (error) {
          alertService('danger', 'Something went wrong!', error.message);
        });
    };

    $scope.editDescription = function (data) {
      $scope.userDetails.description = data
      $scope.index = true

    }

    $scope.editMainSite = function (data) {
      $scope.site = true

    }

    $scope.editPromotionalOffers = function (data) {
      $scope.offers = true
    }
    $scope.editJoinInstallers = function (data) {
      $scope.join = true
    }
    $scope.editTrainingProgrammes = function (data) {
      $scope.trainig = true
    }
    $scope.editTroubleshooting = function (data) {
      $scope.userDetails.troubleshooting = data
      $scope.trouble = true
    }
    $scope.imageSel = function (index, type) {
      $scope.modalIdx = index
      $scope.type = type
    }
    function isURL (str) {
      var res = str.match(/(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g);
      return (res !== null)
    }
    // $scope.modelImage = {}
    $scope.removeImageModel = function (index, type) {
      if (type == 'image') {
        $scope.selectedManufacture.models[index].image = null
      } else {
        $scope.selectedManufacture.models[index].pdf = null
      }

      apiService
        .update('merchant', $scope.selectedManufacture)
        .then(function (response) {
          init()
          alertService('success', 'Model', response.message);
          // var arr = _.map($rootScope.manufactures, function (manufacture) {
          //   if (manufacture._id == $scope.manufacture._id)
          //     manufacture = $scope.manufacture;
          //   return manufacture;
          // });
          // $rootScope.manufactures = arr;
          // materialService.updateManufactures();

          // $location.path('/premium-page/' + $scope.manufacture._user_id);
        }, function (error) {
          alertService('danger', 'Something went wrong!', error.message);
        });
    }
    $scope.uploadModelImg = function (index) {
      var uploadUrl = '/api/modelFileMerchant';
      $scope.selectedManufacture.modelIndex = index
      multipartFormService.post(uploadUrl, $scope.selectedManufacture).then(function (response) {
        init()
        $timeout(function () {
          $scope.manuDetails()
        }, 1000)

        alertService('success', 'Updated!', 'Site Image updated successfully!');
      }, function () {
        alertService('warning', 'Opps!', 'Something went wrong!');
      });
    }

    $scope.updateImg = false

    $scope.updateFile = function () {
      $scope.updateImg = true
    }

    $scope.addFile = function (type) {
      var uploadUrl = '/api/siteImage';
      multipartFormService.post(uploadUrl, $scope.userDetails).then(function (response) {
        init()
        alertService('success', 'Updated!', 'Site Image updated successfully!');
      }, function () {
        alertService('warning', 'Opps!', 'Something went wrong!');
      });
    }

    $scope.updateFile = function (type) {
      if (type == "removeImg") {
        $scope.userDetails.siteLinks.mainWebsite.siteImage = null
      } else if (type == "removePdf") {
        $scope.userDetails.siteLinks.mainWebsite.siteDoc = null
      }
      apiService.users.update({ _id: $scope.userDetails._id }, $scope.userDetails, function (response) {
        alertService('success', 'File Removed');
      }, function (error) {
        console.log(error);
        // alertService('warning', 'Password', error.data.message);
      });
    }

    $scope.cancel = function () {
      $scope.index = false
      $scope.site = false
      $scope.join = false
      $scope.offers = false
      $scope.trainig = false
      $scope.trouble = false

      init();
    }

    $scope.update = function (url) {
      if (url == 'desp') {
        apiService.users.update({ _id: $scope.userDetails._id }, $scope.userDetails, function (response) {
          alertService('success', 'Account Details', response.message);
          $scope.index = false
          $scope.site = false
          $scope.join = false
          $scope.offers = false
          $scope.trainig = false
          $scope.trouble = false
        }, function (error) {
          console.log(error);
          // alertService('warning', 'Password', error.data.message);
        });
      } else if (isURL(url)) {
        apiService.users.update({ _id: $scope.userDetails._id }, $scope.userDetails, function (response) {
          alertService('success', 'Account Details', response.message);
          $scope.index = false
          $scope.site = false
          $scope.join = false
          $scope.offers = false
          $scope.trainig = false
          $scope.trouble = false
        }, function (error) {
          console.log(error);
          // alertService('warning', 'Password', error.data.message);
        });
      } else {
        alertService('danger', 'Please Enter Valid URL');
      }

    }
  }




  MerchantModalAddController.$inject = ['$rootScope', '$scope', '$location', '$routeParams', 'apiService', 'alertService', '_', 'materialService', 'data', '$modalInstance'];
  function MerchantModalAddController ($rootScope, $scope, $location, $routeParams, apiService, alertService, _, materialService, data, $modalInstance) {

    $scope.manufacture = data.manufacture;
    $scope.isUpdate = false;
    $scope.manufactureList = []
    $scope.visibleList = false
    $scope.merchantModalList = data.manufacture
    $scope.modalList = []

    apiService['manufactures'].query(function (response) {
      $scope.manufactureList = response
    });
    $scope.filterManufacture = function () {
      // $scope.model = {}
      $scope.visibleList = true
      if ($scope.searchVal != "new") {
        $scope.selectedManu = JSON.parse($scope.searchVal)
        $scope.modalList = $scope.selectedManu.models
        // $scope.searchVal = $scope.searchVal.company_name
      } else {

      }
    }

    $scope.filterModal = function () {
      $scope.selectedModel = JSON.parse($scope.modal1)
      $scope.model = $scope.selectedModel
      // $scope.modal.manufacture_name = ''
      // $scope.modal.manufacture_name = $scope.selectedManu.company_name
    }

    $scope.merchentSelect = function (manufacture) {
      $scope.searchVal = manufacture.company_name
      $scope.visibleList = false

      for (let i = 0; i < manufacture.models.length; i++) {
        manufacture.models[i].manufacture_name = manufacture.company_name
        $scope.merchantModalList.models.push(manufacture.models[i])
      }
      $scope.manufacture = $scope.merchantModalList
      //   $scope.manufacture.models.concat($scope.merchantModalList)
    }

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
      { temp: 35, spf: null },
      { temp: 40, spf: null },
      { temp: 45, spf: null },
      { temp: 50, spf: null },
      { temp: 55, spf: null },
      { temp: 60, spf: null },
      { temp: 65, spf: null }
    ];

    if (data.index != 'add') {
      $scope.isUpdate = true;
      $scope.model = $scope.manufacture.models[data.index];
    }
    var existStatus = false

    function checkExistingModel (model, selectedManu, callback) {

      apiService.get('merchantByUserId', { _id: $routeParams.id }).then(function (details1) {
        // $scope.selectedManufacture = details1
        if (selectedManu) {
          var manucheck = details1.merchant.filter(function (o) {
            return o.manufacture_name == selectedManu.company_name;
          });
          if (manucheck.length == 0) {
            var modalCheck = []
          } else {
            var modalCheck = manucheck[0].models.filter(function (o) {
              return o.model_name == model.model_name
            })
          }
        } else {
          var manucheck = details1.merchant.filter(function (o) {
            return o.manufacture_name == $scope.model.manufacture_name;
          });
          if (manucheck.length == 0) {
            var modalCheck = []
          } else {
            var modalCheck = manucheck[0].models.filter(function (o) {
              return o.model_name == $scope.model.model_name
            })
          }
        }
        if (modalCheck.length == 0) {
          callback(true);
        } else {
          callback(false);
        }
      });
      setTimeout(() => {
        return existStatus
      }, 1000);
    }

    $scope.ok = function () {
      if ($scope.model.fuel_type == 'Ground Source Heat pump' || $scope.model.fuel_type == 'Air Source Heat Pump') {
        $scope.model.likely_spf = 'No - use the new ErP values'
      }
      if (!$scope.isUpdate) {

        var data = {
          _user_id: $routeParams.id,
          models: [],
          isMerchant: true
        }
        if ($scope.searchVal == 'new') {
          data.manufacture_name = $scope.model.manufacture_name
        } else {
          data.manufacture_name = $scope.selectedManu.company_name
          $scope.model.manufacture_name = $scope.selectedManu.company_name
        }
        // checkExistingModel($scope.model,$scope.selectedManu)
        checkExistingModel($scope.model, $scope.selectedManu, function (condition) {
          if (condition) {
            data.models.push($scope.model)
            $modalInstance.close(data)
          } else {
            alertService('danger', 'Model name is already exist');
          }
        })
      } else {
        let scop = [
          { temp: 35, spf: $scope.model.scop[0] && $scope.model.scop[0].spf != undefined ? $scope.model.scop[0].spf : null },
          { temp: 40, spf: $scope.model.scop[1] && $scope.model.scop[1].spf != undefined ? $scope.model.scop[1].spf : null },
          { temp: 45, spf: $scope.model.scop[2] && $scope.model.scop[2].spf != undefined ? $scope.model.scop[2].spf : null },
          { temp: 50, spf: $scope.model.scop[3] && $scope.model.scop[3].spf != undefined ? $scope.model.scop[3].spf : null },
          { temp: 55, spf: $scope.model.scop[4] && $scope.model.scop[4].spf != undefined ? $scope.model.scop[4].spf : null },
          { temp: 60, spf: $scope.model.scop[5] && $scope.model.scop[5].spf != undefined ? $scope.model.scop[5].spf : null },
          { temp: 65, spf: $scope.model.scop[6] && $scope.model.scop[6].spf != undefined ? $scope.model.scop[6].spf : null }
        ];
        $scope.manufacture.models.scop = scop;
        $modalInstance.close($scope.manufacture);
      }
    };

    $scope.cancel = function () {
      $modalInstance.dismiss('cancel');
    };

  }


  ModalOutputPerformanceMerchantController.$inject = ['$rootScope', '$scope', '$location', '$routeParams', 'apiService', 'alertService', '_', 'materialService', 'data', '$modalInstance', 'multipartFormService'];
  function ModalOutputPerformanceMerchantController ($rootScope, $scope, $location, $routeParams, apiService, alertService, _, materialService, data, $modalInstance, multipartFormService) {

    $scope.manufacture = data.manufacture;
    $scope.visibility = data.visibility
    $scope.model = $scope.manufacture.models[data.index]


    $scope.imageSel = function (index, type) {

      $scope.modalIdx = index
      $scope.type = type
    }

    $scope.removeImageModel = function (type) {
      $scope.removeType = type
      if (type == 'image') {
        $scope.manufacture.models[data.index].image = null
      } else {
        $scope.manufacture.models[data.index].pdf = null
      }

      apiService
        .update('merchant', $scope.manufacture)
        .then(function (response) {
          alertService('success', 'Model', response.message);
          if ($scope.removeType == 'image') {
            $scope.model.image = null
          } else {
            $scope.model.pdf = null
          }
        }, function (error) {
          alertService('danger', 'Something went wrong!', error.message);
        });
    }
    $scope.uploadModelImg = function (index) {
      var uploadUrl = '/api/modelFileMerchant';
      $scope.manufacture.modelIndex = data.index
      multipartFormService.post(uploadUrl, $scope.manufacture).then(function (response) {
        if (response.data.file.slice(-3) == "pdf") {
          $scope.model.pdf = response.data.file
          $scope.manufacture.modelImage = null
        } else {
          $scope.model.image = response.data.file
          $scope.manufacture.modelImage = null
        }
        alertService('success', 'Updated!', 'Site Image updated successfully!');
      }, function () {
        alertService('warning', 'Opps!', 'Something went wrong!');
      });
    }
    //   $scope.ok = function() {
    //     $modalInstance.close($scope.manufacture)
    //     $modalInstance.dismiss('cancel')
    // };

    $scope.cancel = function () {
      $modalInstance.dismiss('cancel');
    };
  }
})();
