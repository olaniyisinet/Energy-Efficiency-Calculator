(function () {
  'use strict';

  angular.module('cloudheatengineer')
    .controller('DesignerController', DesignerController)
    .controller('DesignerCreditsController', DesignerCreditsController)
    .controller('ModalDesignerAddController', ModalDesignerAddController)
    .controller('DesignerPermissionController', DesignerPermissionController);


  DesignerController.$inject = ['$rootScope', '$scope', 'apiService', 'alertService', '$modal'];

  function DesignerController ($rootScope, $scope, apiService, alertService, $modal) {

    //rootscope vars
    $rootScope.showHeader = false;
    $rootScope.showFooter = false;
    $rootScope.heatmanagerview = true;

    //scope vars
    $scope.userDetails = $rootScope.user;
    $scope.designers = [];

    getDesigners();
    let d = new Date();
    let dt = d.toISOString();
    let spDt = dt.split('T');

    if ($scope.userDetails.is_admin || $scope.userDetails.isDummy) {
      $scope.removeDesigner = true;
      $scope.billingDate = ""
    } else {
      if (!$scope.userDetails.isManufacturer) {
        $scope.billingDate = $scope.userDetails.selectedPlan.subscription?.nextBillingDate ? $scope.userDetails.selectedPlan.subscription?.nextBillingDate : '';

        $scope.removeDesigner = false;
        if (spDt[0] == $scope.userDetails.selectedPlan.subscription?.billingPeriodStartDate || spDt[0] == $scope.userDetails.selectedPlan.subscription?.nextBillingDate) {
          $scope.removeDesigner = true;
        }
      } else {

        $scope.removeDesigner = false;
        $scope.billingDate = "first of every month."
        if (isFirstDayOfMonth(new Date())) {
          $scope.removeDesigner = true;
        }
      }
    }
    //scope functions

    function isFirstDayOfMonth (date = new Date()) {
      return date.getDate() === 1;
    }

    //private functions
    function getDesigners () {
      apiService.getDesigners.query('designer', { id: $scope.userDetails._id }, function (response) {
        $scope.designers = response.data;
      })
    }

    $scope.openaddDesignerModal = function () {
      var modalOptions = {};
      modalOptions.templateUrl = '/partials/views/designers/_modal_add_designer.jade';
      modalOptions.controller = 'ModalDesignerAddController';
      modalOptions.size = 'md';

      var modalInstance = $modal.open({
        animation: true,
        templateUrl: modalOptions.templateUrl,
        controller: modalOptions.controller,
        size: modalOptions.size = 'md',
        resolve: {
          data: function () {
            return {
              add: "designer"
            }
          }
        }
      });

      modalInstance.result.then(function (newUser) {
        $scope.newUser = newUser;
        let newDesigner = {
          "email": newUser.email,
          "first_name": newUser.fname,
          "surname": newUser.sname,
          "password": "123456",
          "company_name": $scope.userDetails.company_name,
          "post_code": "",
          "company_website": $scope.userDetails.company_website,
          "designerTo": {
            "name": $scope.userDetails.first_name,
            "company": $scope.userDetails.company_name,
            "email": $scope.userDetails.email,
            "admin_id": $scope.userDetails._id
          }
        }
        apiService.createDesigner.query('designer', newDesigner, function (response) {
          if (!response.success) {
            alertService('danger', 'Error!', response.message);
            getDesigners();
          } else {
            alertService('success', 'Created!', 'New designer Created');
            $scope.newUser = {};
            getDesigners();
          }
        });
      }, function () {

      });
    };

    $scope.designerPermission = function (id) {
      var modalOptions = {};
      modalOptions.templateUrl = '/partials/views/designers/designer_popup.jade';
      modalOptions.controller = 'DesignerPermissionController';
      modalOptions.size = 'md';

      var modalInstance = $modal.open({
        animation: true,
        templateUrl: modalOptions.templateUrl,
        controller: modalOptions.controller,
        size: modalOptions.size = 'md',
        resolve: {
          data: function () {
            return {
              add: "designer",
              id: id
            }
          }
        }
      });

      modalInstance.result.then(function (retData) {
        if(retData) {
          apiService.updateDesigner.query(retData, function (res) {
            if(res.success) {
              alertService('info', 'success', res.message)
              getDesigners();
            } else {
              alertService('warning', 'error', res.message)
            }
          });
        }
      }, function () {

      });
    };

    $scope.blockDesigner = function (data, type) {
      let designer = { id: data.designerId, adminId: $scope.userDetails._id, type: type }
      apiService.blockDesigner.query('designer', designer, function (response) {
        if (!response.success) {
          alertService('danger', 'Error!', response.message);
        } else {
          alertService('success', 'Blocked!', response.message);
          getDesigners();
        }
      });
    }

  }


  ModalDesignerAddController.$inject = ['$scope', '$modalInstance', 'data'];
  function ModalDesignerAddController ($scope, $modalInstance, data) {

    $scope.newUser;

    $scope.ok = function () {
      let newDesigner = $scope.newUser
      $modalInstance.close(newDesigner);
    };

    $scope.cancel = function () {
      $modalInstance.dismiss('cancel');
    };
  }


  DesignerCreditsController.$inject = ['$rootScope', '$scope', 'apiService', 'alertService'];

  function DesignerCreditsController ($rootScope, $scope, apiService, alertService) {

    $rootScope.showHeader = false;
    $rootScope.showFooter = false;
    $scope.manuList = [];
    $scope.creditDetails = [];
    $scope.userDetails = JSON.parse(window.localStorage.getItem('user'))

    $scope.applyCredits = function () {
      if ($scope.userDetails.is_admin) {
        apiService.save('updateDesignerCredit', {}, function (response) {
          console.log(response);
          if (response) {
            alertService('success', 'Updated', 'Designer credits applied successfully')
          } else {
            alertService('warning', 'error', 'Something went wrong')
          }
          init();
        });
      }
    }

    $scope.showCreditDetails = function (idx) {
      console.log($scope.creditDetails)
      $scope.creditDetails = $scope.manuList[idx].selectedPlan.UsedCreditDetails.filter(function (obj) {
        return obj.surveyId == '';
      });
      console.log($scope.creditDetails)
    }

    function init () {
      if ($scope.userDetails.is_admin) {
        apiService.get('getDesignerCredit').then(function (response) {
          $scope.manuList = response.data;
          console.log($scope.manuList);
        });
      } else {
        $scope.manuList = [];
        $scope.manuList[0] = $scope.userDetails
        console.log($scope.manuList);
      }

    }

    init()
  }

  DesignerPermissionController.$inject = ['$scope', '$rootScope', '$modalInstance', 'apiService', 'data', 'alertService'];
  function DesignerPermissionController ($scope, $rootScope, $modalInstance, apiService, data, alertService) {

    let id = data.id;

    function init () {
      apiService.getDesignerById.get({ _id: id }, function (res) {
        // if(!res.success){
        //   alertService('warning', 'error', res.message);
        //   $modalInstance.dismiss('cancel');
        // }
        $scope.permissions = res.data.designerPermissions;
      });
    }

    $scope.changePermission = function (val, idx) {
      $scope.permissions[idx].value = val;
    }

    $scope.ok = function () {
      let body = {
        _id: id,
        designerPermissions: $scope.permissions
      }
      $modalInstance.close(body);
    };

    $scope.cancel = function () {
      $modalInstance.dismiss('cancel');
    };

    init()

  }

}());
