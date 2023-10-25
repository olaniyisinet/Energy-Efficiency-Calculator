(function () {
  'use strict';

  angular
    .module('cloudheatengineer')
    .controller('RegisterController', ['$routeParams', '$q', '$rootScope', '$scope', 'userService', 'alertService', '$location', 'data', 'authTokenService', 'dataService', 'apiService', 'taxamo', 'braintreeService', 'heatLossEstimatorService','$window', RegisterController])
    .controller('ActivateController', ['$rootScope', '$scope', 'apiService', 'alertService', ActivateController])

  function RegisterController ($routeParams, $q, $rootScope, $scope, userService, alertService, $location, data, authTokenService, dataService, apiService, taxamo, braintreeService, heatLossEstimatorService,$window) {

    $scope.iFrameHeight = $(document).height();
    $window.document.title = 'Heat Engineer Register';
    $scope.special = false;
    $scope.manufucturerRegister = false;
    $scope.user = {};
    $scope.isDisabled = false;
    $scope.heatLossEsti = false;
    $scope.mcsTerms = {};

    $rootScope.showHeader = false;
    $rootScope.showFooter = false;
    $rootScope.heatmanagerview = true;

    $scope.findList = [
      'Facebook advert',
      'Facebook Group',
      'Instragm advert',
      'Twitter',
      'Word of mouth (Friend / Colleague)',
      'An email from Heat Engineer',
      'A Google search',
      'LinkedIn Advert',
      'LinkedIn post',
      'The Heating Academy Northampton',
      'Heat Geek',
      'IMI-Hyronics',
      'A Manufacturer',
      'A Merchant',
      'Other'
    ]

    // $scope.planOptions = [
    //   { planId: 'singleSurvey', planDesc: '£10 + VAT - One Off Survey - Single Survey', price: '12', show: true },

    //   { planId: 'soleTrader', planDesc: '£10 + VAT - Monthly subscription - Sole Trader', price: '12', show: true },
    //   { planId: 'soleTraderYearly', planDesc: '£108 + VAT - Yearly subscription - Sole Trader (10% off)', price: '129.6', show: true },
    //   { planId: 'soleTraderWhiteLabeled', planDesc: '£20 + VAT - Monthly Subscription - Sole Trader White Labeled', price: '24', show: true },
    //   { planId: 'soleTraderWhiteLabeledYearly', planDesc: '£216 + VAT - Yearly Subscription - Sole Trader White Labeled (10% off)', price: '259.2', show: true },

    //   { planId: 'smeMonthly', planDesc: '£30 + VAT - Monthly Subscription - SME Monthly', price: '36', show: true, frequency: 'month' },
    //   { planId: 'smeYearly', planDesc: '£324 + VAT - Yearly Subscription - SME Yearly', price: '388.8', show: true, frequency: 'year' },
    //   { planId: 'smeWhiteLabeledMonthly', planDesc: '£60 + VAT - Monthly Subscription - SME White Labeled Monthly', price: '72', show: true, frequency: 'month' },
    //   { planId: 'smeWhiteLabeledYearly', planDesc: '£648 + VAT - Yearly Subscription - SME White Labeled Yearly', price: '777.6', show: true, frequency: 'year' },

    // ];

    function getPlans () {
      braintreeService.getPlans().then(function (response) {
        $scope.planOptions = response.plans;
        if ($routeParams.plan == 'ss') {
          $scope.user.planOption = $scope.planOptions[0].planId;
        } else if ($routeParams.plan == 'st') {
          $scope.user.planOption = $scope.planOptions[1].planId;
        } else if ($routeParams.plan == 'sty') {
          $scope.user.planOption = $scope.planOptions[2].planId;
        } else if ($routeParams.plan == 'stw') {
          $scope.user.planOption = $scope.planOptions[3].planId;
        } else if ($routeParams.plan == 'stwy') {
          $scope.user.planOption = $scope.planOptions[4].planId;
        } else if ($routeParams.plan == 'so') {
          $scope.user.planOption = $scope.planOptions[5].planId;
        } else if ($routeParams.plan == 'soy') {
          $scope.user.planOption = $scope.planOptions[6].planId;
        } else if ($routeParams.plan == 'sow') {
          $scope.user.planOption = $scope.planOptions[7].planId;
        } else if ($routeParams.plan == 'sowy') {
          $scope.user.planOption = $scope.planOptions[8].planId;
        } else if ($routeParams.plan == 'hle') {
          $scope.heatLossEsti = true
        }

      });

      if ($routeParams.plan == 'manu') {
        $scope.manufucturerRegister = true;
      }
    }

    getPlans();

    $scope.submit = function () {
      $scope.isDisabled = true;
      var plan = null;
      var user = {
        email: $scope.user.email.toLowerCase(),
        password: $scope.user.password,
        first_name: $scope.user.first_name,
        surname: $scope.user.surname,
        isManufacturer: false,
        isMerchant: false,
        isMcsUmbrellaComp: false,
        is_heatLossEstimator: false,
        others: {
          lang: $scope.language,
          profileInfo: {},
          survey_from: []
        }
      };

      plan = $scope.user.planOption

      if ($routeParams.plan == 'manu') {
        plan = "manufacturerYearly";
        user.isManufacturer = true;
        //user.isMerchant = $scope.user.isMerchant;
      }

      if($scope.user.isMerchant == 'merchMcs' || $scope.user.isMerchant == 'mcs'){
        if (!$scope.mcsTerms.agree1 ||
          !$scope.mcsTerms.agree2 ||
          !$scope.mcsTerms.agree3 ||
          !$scope.mcsTerms.agree4 ||
          !$scope.mcsTerms.agree5 ||
          !$scope.mcsTerms.agree6 ||
          !$scope.mcsTerms.agree7 ||
          !$scope.mcsTerms.agree8) {
          $scope.isDisabled = false;
          alertService('warning', 'Registration', 'You should agree to all the MCS options listed');
          return;
        }
      }

      if (!$scope.heatLossEsti) {
        if (!plan || plan == '') {
          $scope.isDisabled = false;
          alertService('warning', 'Registration', 'You should select a plan option to register');
          return;
        }
      }

      if ($scope.heatLossEsti) {
        user.is_heatLossEstimator = true;
      }

      // const geocoder = new google.maps.Geocoder();
      // if (user.address) {
      //   geocoder.geocode({ 'address': user.address + '-' + user.post_code }, (res, status) => {

      //     if (status == google.maps.GeocoderStatus.OK) {
      //       user.others.profileInfo.lat = JSON.stringify(res[0].geometry.location.lat())
      //       user.others.profileInfo.long = JSON.stringify(res[0].geometry.location.lng())
      //       newUserRegister(user, plan);
      //     } else {
      //       newUserRegister(user, plan);
      //     }
      //   });
      // }

      newUserRegister(user, plan);
    };

    function newUserRegister (user, plan) {
      userService.register(user).then(function (response) {
        window.dataLayer = window.dataLayer || [];
        window.dataLayer.push({
          'event': 'data_layer_signup'
        });
        var userData = {
          "email": response.user.email
        }
        userService.sendMail(userData, function (res) { });

        if ($scope.heatLossEsti) {

          let estimate_id = window.localStorage.getItem('heatLossEstimateId')
          let updateUserData = {
            "estimator_email": response.user.email,
            "estimator_name": response.user.first_name
          }
          window.localStorage.removeItem('heatLossEstimateId')
          heatLossEstimatorService.updateUserInfo(estimate_id, updateUserData).then(function (res, err) {

            if (err) alertService('warning', 'Account Create failed!');
            if (res) {
              alertService('success', 'Account Created!', 'Welcome ' + response.user.first_name + ' ' + response.user.surname + '!');
              $location.path('/activate');
            } else {
              alert("Something went wrong. Please try again Later");
            }
          });

        } else if (plan == 'manufacturerYearly') {
          var updateUser = response.user;
          updateUser.selectedPlan = {
            key: "",
            plan: plan,
            isSME: true
          }
          updateUser.isManufacturer = true

          if ($scope.user.isMerchant == 'manu') {
            updateUser.isManufacturer = true;
          }
          if ($scope.user.isMerchant == 'merch') {
            updateUser.isMerchant = true;
          }
          if ($scope.user.isMerchant == 'merchMcs') {
            updateUser.isMerchant = true;
            updateUser.isMcsUmbrellaComp = true;
          }
          if ($scope.user.isMerchant == 'mcs') {
            updateUser.isMerchant = false;
            updateUser.isMcsUmbrellaComp = true
          }
          updateUser.active = true

          apiService.usersupdate.update({ _id: updateUser._id }, updateUser, function (response) {
            userService.sendMail(userData, function (response) { });
            alertService('success', 'Account Created!', 'Welcome ' + updateUser.first_name + ' ' + updateUser.surname + '!');
            //$scope.$apply();
            $location.path('/login');
          }, function (error) {
            $scope.isDisabled = false;
          });
        } else {
          taxamo.doSubscriptionCheckout(
            plan,
            plan,
            'braintree',
            function (data) {
              if (data.success) {
                var user = response.user;
                var userData = {
                  "email": user.email
                }
                userService.sendMail(userData, function (response) { });
                $scope.isDisabled = false;

                window.dataLayer = window.dataLayer || [];
                window.dataLayer.push({
                  'event': 'data_layer_payment'
                });

                alertService('success', 'Account Created!', 'Welcome ' + user.first_name + ' ' + user.surname + '!');
                braintreeService.getSubscriptionDetails(user);
                $location.path('/activate');
              } else {
                $scope.isDisabled = false;
                delete $rootScope.user;
                authTokenService.removeToken();
                userService.removeUser();
                dataService.removeData();
                alertService('warning', 'Transaction', 'Cancelled!');
                $location.path('/register');
              }
            },
            {
              vat_number_field_hidden: false,
              email_field_hidden: true,
              email_field_optional: true,
              buyer_name_field_visible: true,
              buyer_name_field_required: true,
              buyer_email: user.email,
              custom_fields: [{ 'key': 'ciphe_number', 'value': '' }]
            });
        }
      }, function (error) {
        if (error) {
          $scope.isDisabled = false;
          alertService('warning', 'Opps!', 'There is an error occured! ' + error.message);

        }
      });
    }
  }

  function dateFormat (date) {
    var dateToday = date.getDate();
    var month = date.getMonth() + 1;

    var year = date.getFullYear();
    month = month < 10 ? '0' + month : month;
    dateToday = dateToday < 10 ? '0' + dateToday : dateToday;

    var strTime = year + '-' + month + '-' + dateToday;
    return strTime;
  }

  function ActivateController ($rootScope, $scope, apiService, alertService) {
    $scope.resend = function () {
      apiService.save('resend', { email: $rootScope.user.email }).then(function (response) {
        alertService('success', 'Email confirmation!', response.message);
      }, function (error) {
        alertService('warning', 'Opps!', 'There is an error occured! ' + error.message);
      });
    };
  }


}());
