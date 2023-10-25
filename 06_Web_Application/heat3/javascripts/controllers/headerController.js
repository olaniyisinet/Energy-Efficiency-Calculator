(function () {
  'use strict';

  angular
    .module('cloudheatengineer')
    .controller('HeaderSupportController', HeaderSupportController)
    .controller('SmePricingController', SmePricingController)
    .controller('PricingController', PricingController)
    .controller('HeaderController', HeaderController);

  PricingController.$inject = ['$modal', '$scope', '$rootScope','$window'];

  function PricingController ($modal, $scope, $rootScope,$window) {

    $scope.message = 'Hello';
    $scope.iFrameHeight = '377';
    $scope.windowWidth = $(window).width();
    $window.document.title = 'Heat Engineer Price';
    $rootScope.heatmanagerview = true;

    if ($scope.windowWidth < 768) {
      $scope.iFrameHeight = '300';
    } else if ($scope.windowWidth < 480) {
      $scope.iFrameHeight = '200';
    }

    $rootScope.showHeader = false;
    $rootScope.showFooter = false;

    $scope.smePricingOpen = function () {
      var modalInstance = $modal.open({
        animation: true,
        templateUrl: '/partials/views/common/modal/sme-pricing_modal',
        controller: 'SmePricingController',
        size: 'md'
      });

      modalInstance.result.then(function () { });
    };

  };


  SmePricingController.$inject = ['$scope', '$modalInstance'];

  function SmePricingController ($scope, $modalInstance) {
    $scope.done = function () {
      $modalInstance.dismiss('cancel');
    };
  }

  HeaderController.$inject = ['$modal', '$scope', 'authTokenService', '$location', 'userService', '$rootScope', 'dataService', 'browserService', '$translate', 'apiService']

  function HeaderController ($modal, $scope, authTokenService, $location, userService, $rootScope, dataService, browserService, $translate, apiService) {

    $scope.isAuthenticated = authTokenService.isAuthenticated;
    $rootScope.isTraineeSelected = window.localStorage.getItem('isTraineeSelected');
    $scope.browser = browserService();
    $rootScope.heatmanagerview = true;
    $scope.loginUser = JSON.parse(window.localStorage.getItem('user'))
    if($scope.loginUser != null ) {
      $rootScope.heading_name = $scope.loginUser.first_name +' '+ $scope.loginUser.surname
      $rootScope.heading_company = $scope.loginUser.company_name
      if($rootScope.isTraineeSelected == '1' ) {
        $rootScope.heading_company = $scope.loginUser.traineeTo.company
      }
    }
    let routeName = $location.path();
    $scope.routeName = routeName;
    if (routeName == '/' || routeName == '/home') {
      $rootScope.showHeader = true;
      $rootScope.showFooter = true;
    } else {
      $rootScope.showHeader = false;
      $rootScope.showFooter = false;
    }
    // $rootScope.showHeader = false;

    $scope.modalSupportOpen = function () {
      $scope.menuToggle();
      var modalInstance = $modal.open({
        animation: true,
        templateUrl: '/partials/views/common/modal/footer_modal',
        controller: 'HeaderSupportController',
        size: 'md'
      });

      modalInstance.result.then(function () { });
    };

    $scope.checkMenu = function (path = '') {
      // $location.path(path)
      // let routeName = $location.path();
      //  console.log(routeName)
      // if (routeName == '/' || routeName == '/home') {
      //   $rootScope.showHeader = true;
      //   $rootScope.showFooter = true;
      // } else {
      //   $rootScope.showHeader = false;
      //   $rootScope.showFooter = false;
      // }
      $scope.menuToggle();

    }

    $scope.logout = function () {
      let userToken = window.localStorage.getItem('userToken');
      userService.logout(userToken).then(function (res){
        $scope.menuToggle();
        delete $rootScope.user;
        window.localStorage.removeItem('heatLossEstimateId');
        authTokenService.removeToken();
        userService.removeUser();
        dataService.removeData();
        $location.path('/');
      })
    };

    $scope.open = '';

    $scope.menuToggle = function () {
      if (angular.element('div#navbar-main').hasClass('in')) {
        angular.element('div#navbar-main').removeClass('in')
      }
    }

    $scope.language = {
      'lang_code': 'en'
    };

    $scope.languages = [{
      'lang_code': 'en',
      'lang_disp': 'English'
    },
    {
      'lang_code': 'es',
      'lang_disp': 'Spanish'
    },
    {
      'lang_code': 'de',
      'lang_disp': 'German'
    },
    {
      'lang_code': 'fr',
      'lang_disp': 'French'
    },
    {
      'lang_code': 'ru',
      'lang_disp': 'Russian'
    },
    {
      'lang_code': 'zh',
      'lang_disp': 'Chinese'
    },
    {
      'lang_code': 'pl',
      'lang_disp': 'Polish'
    },
    {
      'lang_code': 'ne',
      'lang_disp': 'Nepali'
    },
    {
      'lang_code': 'pt',
      'lang_disp': 'Portuguese'
    },
    ];

    $scope.updateLanguage = function () {
      $translate.use($scope.language.lang_code);
      if ($rootScope.user !== undefined) {
        $rootScope.user.others = {
          'lang': $scope.language.lang_code
        };
        apiService.users.update({ _id: $rootScope.user._id }, $rootScope.user, function (response) {
        }, function (error) {
          console.log(error);
        });
      }
    };

    $scope.checkMenu();
  }

  HeaderSupportController.$inject = ['$scope', '$modalInstance'];

  function HeaderSupportController ($scope, $modalInstance) {
    $scope.done = function () {
      $modalInstance.dismiss('cancel');
    };
  }

}());
