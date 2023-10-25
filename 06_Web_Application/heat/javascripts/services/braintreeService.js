(function () {
  'use strict';

  function braintreeService ($http, $q, apiService, $rootScope, $window, $location, urlHelperService) {

    return {
      getToken: function () {
        var deferred = $q.defer();

        $http
          .get('/api/bttoken')
          .success(function (res) {
            deferred.resolve(res);
          })
          .error(function (err) {
            deferred.reject(res);
          });
        return deferred.promise;
      },

      /**
       * Used only for login and redirected to dashboard.
       * @param {*} user
       * @returns
       */
      getSubscriptionOnlogin: async function (user) {
        if (user.selectedPlan.key == undefined) {
          console.log('subscription key not found');
          return;
        }
        if (user.selectedPlan.key != '') {
          var subKey = user.selectedPlan.key;

          await apiService.get('getBySubId', { key: subKey }).then(async function (subscriptionData) {
            user.selectedPlan.plan = subscriptionData.response.planId;
            user.selectedPlan.subscription = subscriptionData.response;
            await apiService.usersupdate.update({ _id: user._id }, user, function (res) {
              $rootScope.$broadcast('user', user);
              window.localStorage.setItem('user', JSON.stringify(user));
              $location.path('/dashboard');
            }, function (error) {
              console.log(error);
              alertService('Warning', 'Failed', 'Something went wrong please contact support.');
              return false;
            });
          });
        }
      },

      getSubscriptionDetails: async function (user) {
        if (user.selectedPlan.key == undefined) {
          console.log('subscription key not found');
          return;
        }
        if (user.selectedPlan.key != '') {
          var subKey = user.selectedPlan.key;

          apiService.get('getBySubId', { key: subKey }).then(async function (subscriptionData) {
            user.selectedPlan.plan = subscriptionData.response.planId;
            user.selectedPlan.subscription = subscriptionData.response;
            await apiService.usersupdate.update({ _id: user._id }, user, function (res) {
              $rootScope.$broadcast('user', user);
              window.localStorage.setItem('user', JSON.stringify(user));
              return;
            }, function (error) {
              console.log(error);
              return;
            });
          });
        }
      },

      /**
       * get braintree plans
       */
      getPlans: async function() {
        var deferred = $q.defer();
        $http
          .get(urlHelperService.getHostUrl() + '/javascripts/json/plans.json')
          .success(function (res) {
            deferred.resolve(res);
          })
          .error(function (err) {
            deferred.reject(res);
          });
        return deferred.promise;
      }

    }
  }

  angular
    .module('cloudheatengineer')
    .factory('braintreeService', ['$http', '$q', 'apiService', '$rootScope', '$window', '$location','urlHelperService', braintreeService]);
}());
