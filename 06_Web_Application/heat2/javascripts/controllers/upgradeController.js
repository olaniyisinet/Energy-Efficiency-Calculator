(function () {
  'use strict';

  angular
    .module('cloudheatengineer')
    .controller('UpgradeController', UpgradeController);

  UpgradeController.$inject = ['$routeParams', '$scope', '$rootScope', 'apiService', 'taxamo', 'alertService', '$location', '$window', 'braintreeService']

  function UpgradeController ($routeParams, $scope, $rootScope, apiService, taxamo, alertService, $location, $window, braintreeService) {
    // test data //
    $scope.upgrade = {};
    var user1 = $rootScope.user;
    var storage = $window.localStorage;
    var options
    $scope.isDisabled = false;

    function init () {
      // get braintree plans
      braintreeService.getPlans().then(function (response) {
        options = response.plans
        if (!user1.selectedPlan.isPaymentDue) {
          if (user1.selectedPlan.plan != '') {
            for (var x = 0; x < options.length; x++) {
              if (options[x].planId == user1.selectedPlan.plan) {
                options[x].show = false;
              }
            }
          }
        }

        $scope.planOptions = options;

        if ($routeParams.plan) {

          let newList = $scope.planOptions.map(function (data) {
            data.show = false;
            if ($routeParams.plan.includes('Month')) {
              if (data.planId.substring(0, 3) == 'sme' && data.frequency == 'month') {
                data.show = true;

              }
            }
            if ($routeParams.plan.includes('Year')) {
              if (data.planId.substring(0, 3) == 'sme' && data.frequency == 'year') {
                data.show = true;
              }
            }
            if ($routeParams.plan.includes('white')) {
              if (data.planId.includes('White')) {
                data.show = true;
              }
            }
            return data;
          });

          $scope.planOptions = newList;
        }
      });
    }

    init();


    $scope.showText = true;
    if(
      user1.selectedPlan.plan == 'MonthlyPaymentPlanStandard'
      || user1.selectedPlan.plan == 'smallOrgYearly'
      || user1.selectedPlan.plan == 'MonthlyPaymentPlan20employees'
      || user1.selectedPlan.plan == 'largeOrgYearly' ) {
      $scope.showText = false;
    }

    $scope.warningMessage = 'Please do not subscribe to a new plan until your current subscription is about to expire!'

    $scope.planUpgrade = function () {
      $scope.isDisabled = true;
      var plan = $scope.upgrade.planOption;

      if (!plan || plan == '') {
        alertService('warning', 'Upgrade Plan', 'You should select a plan option to upgrade to');
        return;
      }

      taxamo.doSubscriptionCheckout(
        plan,
        plan,
        'braintree',
        function (data) {
          if (data.success) {
            var paymentResult = data.payment_result;
            // var subscription_data = new Array();
            // subscription_data.push(paymentResult);

            if (paymentResult.key != '') {
              apiService.get('getBySubId', { key: paymentResult.key }).then(function (subscriptionData) {

                // var user2 = user1;
                var oldKey = user1.selectedPlan.key;
                // user2.selectedPlan.key = paymentResult.key
                // user2.selectedPlan.plan = subscriptionData.response.planId
                // user2.selectedPlan.subscription = subscriptionData.response
                // user2.selectedPlan.isPaymentDue = false
                // if (user2.selectedPlan.plan == 'singleSurvey') {
                //   //var sub_data = user1.selectedPlan.details;
                //   //sub_data.push(paymentResult);
                //   //user2.selectedPlan.details = sub_data;
                //   user2.selectedPlan.singleCredits = 1;
                //   user2.selectedPlan.singleSurveys = 0;
                // }
                // $scope.isDisabled = false;

                // user2.selectedPlan.isSME = false
                // if (subscriptionData.response.planId.substring(0,3) == 'sme'){
                //   user2.selectedPlan.isSME = true
                // }
                // apiService.users.update({ _id: user2._id }, user2, function (response) {

                  // console.log('root after update user1', user2);
                  // window.localStorage.setItem('user', JSON.stringify(user2));
                  // $rootScope.user = user2;
                  $scope.cancelSubscription(oldKey);
                // }, function (error) {
                //   console.log(error);
                // });
                alertService('success', 'Upgrade Plan', 'Plan upgraded successfully.');
                $location.path('/dashboard');
              });

            }
          } else {
            $scope.isDisabled = false;
          }
        },
        {
          vat_number_field_hidden: false,
          email_field_hidden: true,
          email_field_optional: true,
          buyer_name_field_visible: true,
          buyer_name_field_required: true,
          buyer_email: user1.email,
          custom_fields: [{ 'key': 'ciphe_number', 'value': user1.ciphe_number }]
        }
      );
    };

    // $scope.getSubscriptionData = function(subKey){
    //   if(subKey != ''){
    //       apiService.get('getBySubId',{key: subKey}).then(function (subscriptionData) {
    //         console.log('subscriptionData',subscriptionData);
    //           return subscriptionData.response;
    //           }, function (error) {
    //               return error;
    //           });
    //   }
    // }

    $scope.cancelSubscription = function (sId) {
      apiService.get('cancelBySubId', { key: sId }).then(function (subscriptionData) {
      });
    }
  }

}());

