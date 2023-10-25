(function () {
  'use strict';

  var app = angular.module('cloudheatengineer');

  /**
   * Dashboard Controller
   */
  app.controller('PremiumManufacturersController', PremiumManufacturersController);
  app.controller('PremiumManufacturersModelController', PremiumManufacturersModelController);
  app.controller('AddPremiumModelsController', AddPremiumModelsController);
  app.controller('ModalAddController', ModalAddController);
  app.controller('ModalOutputPerformanceController', ModalOutputPerformanceController)

  PremiumManufacturersController.$inject = ['$rootScope', '$scope', 'userService', '_', 'taxamo', 'apiService', 'alertService', 'lodash', 'braintreeService', '$location','$window'];

  function PremiumManufacturersController ($rootScope, $scope, userService, _, taxamo, apiService, alertService, lodash, braintreeService, $location,$window) {
    $scope.manufactures = []
    $scope.field = false
    $rootScope.showHeader = false;
    $rootScope.showFooter = false;
    $rootScope.heatmanagerview = true;
    $scope.perPage = 12;
    $scope.currentPage = 1
    $scope.skip = parseInt($scope.perPage) * parseInt($scope.currentPage - 1);
    $scope.query = {}
    $scope.pageNos = []

    $window.document.title = 'Heat Engineer Subscribed Manufactures';


    function init () {

      getManufacturers();

    }

    function getManufacturers() {
      $scope.query = {
        limit: $scope.perPage,
        skip: $scope.skip,
      }

      apiService['manufacturerAll'].query($scope.query, function (response) {
        $scope.manufactures = response.users
        $scope.totalRecords = response.totalCount;
        $scope.pages = parseInt($scope.totalRecords) / $scope.perPage
        makePages();
      })
    }

  //   $scope.nextPage = function() {
  //     let requestPage = parseInt($scope.currentPage) + 1
  //     $scope.query.limit = $scope.perPage
  //     $scope.query.skip = $scope.skip
  //     $scope.currentPage = parseInt(currentPage)
  //     getManufacturers();
  // }

  function makePages () {
    $scope.pageNos = [];
    for (let i = 0; i < $scope.pages; i++) {
      $scope.pageNos.push(i)
    }
  }


  $scope.goToPage = function (page) {
    $scope.currentPage = page;
    $scope.skip = parseInt($scope.perPage) * parseInt($scope.currentPage - 1);
    getManufacturers();
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
      if (manufacture.isMerchant) {
        $location.path('/' + 'subscribed-page-merchant' + '/' + manufacture._id);
      } else {
        $location.path('/' + location + '/' + manufacture._id);
      }
    };
  }

  PremiumManufacturersModelController.$inject = ['$rootScope', '$scope', 'userService', '_', 'taxamo', 'apiService', 'alertService', 'lodash', 'braintreeService', '$location', '$routeParams', 'materialService', '$modal', 'multipartFormService']
  function PremiumManufacturersModelController ($rootScope, $scope, userService, _, taxamo, apiService, alertService, lodash, braintreeService, $location, $routeParams, materialService, $modal, multipartFormService) {

    $scope.user = JSON.parse(window.localStorage.getItem('user'))
    $scope.visibility = false
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

      apiService.get('manufacturesByUserId', { _id: $routeParams.id }).then(function (details) {
        $scope.selectedManufacture = details
        if ($scope.user._id == details._user_id) {
          $scope.visibility = true
        }

      });
      // apiService.get('merchantByUserId', { _id: $routeParams.id }).then(function (details1) {
      //   console.log(details1)
      //   // $scope.selectedManufacture = details1
      // });
    }

    init()

    $scope.back = function () {
      if (!$scope.user || !$scope.user.isManufacturer || $scope.user.isManufacturer == null) {
        $location.path('/subscribed-manufacturers');
      } else {
        $location.path('/dashboard');
      }
    }

    $scope.outputPerformance = function (index) {
      // console.log("index" , index)
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
              manufacture: $scope.selectedManufacture,
              index: index,
              visibility: $scope.visibility
            }
          }
        }
      });
      modalInstance.result.then(function (manufacture) {
        console.log(manufacture)
        init()
        // apiService
        // .update('manufactures',manufacture)
        // .then(function (response) {
        //   alertService('success', 'Model', response.message);
        //   var arr = _.map($rootScope.manufactures, function (manufacture) {
        //     if (manufacture._id == $scope.manufacture._id)
        //       manufacture = $scope.manufacture;
        //     return manufacture;
        //   });
        //   $rootScope.manufactures = arr;
        //   materialService.updateManufactures();

        // }, function (error) {
        //   alertService('danger', 'Something went wrong!', error.message);
        // });
      }, function () { });

    };

    $scope.modifyModel = function (index) {
      var modalOptions = {};
      modalOptions.templateUrl = '/partials/views/premium-page/components/_modal_add_madel';
      modalOptions.controller = 'ModalAddController';
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
      modalInstance.result.then(function (manufacture) {
        console.log(manufacture)
        if(!manufacture.company_name) {
          manufacture.company_name = $scope.user.company_name
        }
        //  var comments = {
        //   message : comment.msg,
        //   msgDate : new Date().toString(),
        //   user_id : $scope.user._id,
        //   step    : parseInt(comment.step)
        //  }

        apiService
          .update('manufactures', manufacture)
          .then(function (response) {
            alertService('success', 'Model', response.message);
            var arr = _.map($rootScope.manufactures, function (manufacture) {
              if (manufacture._id == $scope.manufacture._id)
                manufacture = $scope.manufacture;
              return manufacture;
            });
            $rootScope.manufactures = arr;
            materialService.updateManufactures();
            // $location.path('/premium-page/' + $scope.manufacture._user_id);
          }, function (error) {
            alertService('danger', 'Something went wrong!', error.message);
          });
      }, function () { });
      // $location.path('/add-premium-models/' + $scope.selectedManufacture._id + '/' + index);
    };

    $scope.removeModel = function (model) {
      var index = $scope.selectedManufacture.models.indexOf(model);
      $scope.selectedManufacture.models.splice(index, 1);
      apiService
        .update('manufactures', $scope.selectedManufacture)
        .then(function (response) {
          alertService('success', 'Models', 'Successfully removed!');
          var arr = _.map($rootScope.manufactures, function (manufacture) {
            if (manufacture._id == $scope.selectedManufacture._id)
              manufacture = $scope.selectedManufacture;
            return manufacture;
          });
          $rootScope.manufactures = arr;
          materialService.updateManufactures();
          $location.path('/subscribed-page/' + $scope.selectedManufacture._user_id);
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
      console.log(index)
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
        .update('manufactures', $scope.selectedManufacture)
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
          init()
          // $location.path('/premium-page/' + $scope.manufacture._user_id);
        }, function (error) {
          alertService('danger', 'Something went wrong!', error.message);
        });
    }
    $scope.uploadModelImg = function (index) {
      // console.log($scope.modelImage)
      var uploadUrl = '/api/modelFile';
      $scope.selectedManufacture.modelIndex = index
      multipartFormService.post(uploadUrl, $scope.selectedManufacture).then(function (response) {
        init()
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
      console.log($scope.userDetails)
      var uploadUrl = '/api/siteImage';
      // console.log($scope.userDetails)
      multipartFormService.post(uploadUrl, $scope.userDetails).then(function (response) {
        init()
        alertService('success', 'Updated!', 'Site Image updated successfully!');
      }, function () {
        alertService('warning', 'Opps!', 'Something went wrong!');
      });
    }
    $scope.updateFile = function (type) {
      console.log(type)
      if (type == "removeImg") {
        $scope.userDetails.siteLinks.mainWebsite.siteImage = null
      } else if (type == "removePdf") {
        $scope.userDetails.siteLinks.mainWebsite.siteDoc = null
      }
      apiService.users.update({ _id: $scope.userDetails._id }, $scope.userDetails, function (response) {
        alertService('success', 'File Removed');
      }, function (error) {
        console.log(error);
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
          // alertService('warning', 'Password', error.data.message);
        });
      } else {
        alertService('danger', 'Please Enter Valid URL');
      }

    }
  }

  AddPremiumModelsController.$inject = ['$rootScope', '$scope', '$location', '$routeParams', 'apiService', 'alertService', '_', 'materialService'];
  function AddPremiumModelsController ($rootScope, $scope, $location, $routeParams, apiService, alertService, _, materialService) {
    $scope.isUpdate = false;
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


    apiService.get('manufacturesByIdNoAuth', { _id: $routeParams.id }).then(function (manufacture) {

      $scope.manufacture = manufacture;
      if (!!$routeParams.model_id && $routeParams.model_id != 'add') {
        $scope.isUpdate = true;
        $scope.model = $scope.manufacture.models[$routeParams.model_id];
      }
    });

    $scope.saveModels = function () {

      if (!$scope.isUpdate)
        // $scope.manufacture={}
        $scope.manufacture.models.push($scope.model);

      apiService
        .update('manufactures', $scope.manufacture)
        .then(function (response) {
          alertService('success', 'Model', response.message);
          var arr = _.map($rootScope.manufactures, function (manufacture) {
            if (manufacture._id == $scope.manufacture._id)
              manufacture = $scope.manufacture;
            return manufacture;
          });
          $rootScope.manufactures = arr;
          materialService.updateManufactures();
          $location.path('/subscribed-page/' + $scope.manufacture._user_id);
        }, function (error) {
          alertService('danger', 'Something went wrong!', error.message);
        });
    };
  }

  ModalAddController.$inject = ['$rootScope', '$scope', '$location', '$routeParams', 'apiService', 'alertService', '_', 'materialService', 'data', '$modalInstance'];
  function ModalAddController ($rootScope, $scope, $location, $routeParams, apiService, alertService, _, materialService, data, $modalInstance) {

    $scope.manufacture = data.manufacture;
    $scope.isUpdate = false;


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
    $scope.ok = function () {
      if ($scope.model.fuel_type == 'Ground Source Heat pump' || $scope.model.fuel_type == 'Air Source Heat Pump') {
        $scope.model.likely_spf = 'No - use the new ErP values'
      }
      if (!$scope.isUpdate) {
        $scope.manufacture.models.push($scope.model);
      }
      $modalInstance.close($scope.manufacture)
      $modalInstance.dismiss('cancel')
      // if ($scope.comment.msg != null && $scope.comment.msg != '' && $scope.comment.msg != ' ' && $scope.comment.step != null && $scope.comment.step != '' && $scope.comment.step != ' ')
      //     $modalInstance.close($scope.manufacture);
      // else {
      //     alertService('danger', '', 'Something wrong');
      //     $modalInstance.dismiss('cancel');
      // }
    };

    $scope.cancel = function () {
      $modalInstance.dismiss('cancel');
    };

    // $scope.saveModels = function () {

    //   if (!$scope.isUpdate)
    //     // $scope.manufacture={}
    //     $scope.manufacture.models.push($scope.model);
    //   console.log($scope.manufacture)

    //   apiService
    //     .update('manufactures', $scope.manufacture)
    //     .then(function (response) {
    //       alertService('success', 'Model', response.message);
    //       var arr = _.map($rootScope.manufactures, function (manufacture) {
    //         if (manufacture._id == $scope.manufacture._id)
    //           manufacture = $scope.manufacture;
    //         return manufacture;
    //       });
    //       $rootScope.manufactures = arr;
    //       materialService.updateManufactures();
    //       $location.path('/premium-page/' + $scope.manufacture._user_id);
    //     }, function (error) {
    //       alertService('danger', 'Something went wrong!', error.message);
    //     });
    // };
  }

  ModalOutputPerformanceController.$inject = ['$rootScope', '$scope', '$location', '$routeParams', 'apiService', 'alertService', '_', 'materialService', 'data', '$modalInstance', 'multipartFormService'];
  function ModalOutputPerformanceController ($rootScope, $scope, $location, $routeParams, apiService, alertService, _, materialService, data, $modalInstance, multipartFormService) {
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
        .update('manufactures', $scope.manufacture)
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
      var uploadUrl = '/api/modelFile';
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
