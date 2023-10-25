(function () {
  'use strict';

  function LoginController ($scope, $rootScope, userService, alertService, $location, dataService, braintreeService, heatLossEstimatorService, apiService, $window) {

    $rootScope.showHeader = false;
    $rootScope.showFooter = false;
    $rootScope.heatmanagerview = true;
    $rootScope.isTraineeSelected = 0;
    $scope.user = {}
    $scope.formShow = true;
    $scope.res;

    $window.document.title = 'Login';

    $scope.submit = function () {

      userService.login($scope.user.email, $scope.user.password).then(function (res) {

        var user = res.data.user;
        $scope.user = user;
        $scope.res = res;
        $scope.noOfSessions = user.others.loginSessions ? user.others.loginSessions : [0, 1];
        $rootScope.trainee = null;
        if (res.data.trainee) {
          $rootScope.trainee = res.data.trainee
          window.localStorage.setItem('trainee', JSON.stringify(res.data.trainee));
          if ($rootScope.trainee != null) {
            $rootScope.isTraineeSelected = 0
            if (user.others.trainee) {
              //member trainee
              //show page here
              $scope.formShow = false;
            } else {
              //trainee
              $scope.gotoDashboard('trainee')
            }
          } else {
            //admins, members, other types
            $rootScope.isTraineeSelected = 0
            $scope.gotoDashboard('other')
          }
        } else {
          $rootScope.isTraineeSelected = 0
          $scope.gotoDashboard('other')
        }
      }, function (err) {
        if (err.data != null) {
          alertService('warning', 'Something went wrong :(', err.data.message);
        } else {
          alertService('warning', 'Something went wrong :(')
        }
      });
    };


    $scope.gotoDashboard = function (type) {

      if (type == 'training') {
        $rootScope.isTraineeSelected = 1
      } else if (type == 'my') {
        $rootScope.isTraineeSelected = 2
      } else {
        $rootScope.isTraineeSelected = 0
      }
      window.localStorage.setItem('isTraineeSelected', $rootScope.isTraineeSelected)
      afterLogin();
    }

    function afterLogin () {
      var res = $scope.res;
      var user = res.data.user;
      const geocoder = new google.maps.Geocoder();

      if (user.others.profileInfo == undefined || (user.others.profileInfo && !user.others.profileInfo.lat)) {
        apiService.users.update({ _id: user._id }, user, function (response) {
          window.localStorage.setItem('user', JSON.stringify(user));
        }, function (error) {
          console.log(error);
          alertService('warning', 'update error:', error.data.message);
        });
        // to do update is not happening here

        geocoder.geocode({ 'address': user.address + '-' + user.post_code }, (res, status) => {

          if (status == google.maps.GeocoderStatus.OK) {
            if (!user.others.profileInfo) {
              user.others.profileInfo = {}
            }

            user.others.profileInfo.lat = JSON.stringify(res[0].geometry.location.lat())
            user.others.profileInfo.long = JSON.stringify(res[0].geometry.location.lng())

            apiService.users.update({ _id: user._id }, user, function (response) {
              window.localStorage.setItem('user', JSON.stringify(user));
            }, function (error) {
              console.log(error);
              alertService('warning', 'update error:', error.data.message);
            });
          }
        });
      }
      let goToHEDashboard = false;
      if (user.is_surveyor) {
        goToHEDashboard = false;
      } else {
        goToHEDashboard = true;
      }
      if (user.isDesigner) {
        goToHEDashboard = true;
      }

      if (goToHEDashboard) {
        dataService.setupAll();
        if (user.is_admin == undefined || !user.is_admin) {
          if (user.selectedPlan.key != undefined && user.selectedPlan.key != "") {
            braintreeService.getSubscriptionOnlogin(user)
          } else {
            $location.path('/dashboard');
          }
        }
        var selLang = 'en';
        if (user.others !== undefined) {
          selLang = user.others.lang
        } else {
          user.others = {
            'lang': selLang
          };
        }
        userService.updateStorage(user);
        $scope.language = selLang;
        alertService('success', 'Welcome', 'Thanks for coming back ' + res.data.user.first_name + ' ' + res.data.user.surname + '!');
        if (res.data.user.is_heatLossEstimator) {
          let estimate_id = window.localStorage.getItem('heatLossEstimateId')
          if (estimate_id) {
            let updateUserData = {
              "estimator_email": res.data.user.email,
              "estimator_name": res.data.user.first_name
            }
            window.localStorage.removeItem('heatLossEstimateId')
            heatLossEstimatorService.updateUserInfo(estimate_id, updateUserData).then(function (res, err) {
              $location.path('/estimator-dashboard');
            });
          } else {
            $location.path('/estimator-dashboard');
          }
        } else {
          $location.path('/dashboard');
        }
      } else {
        $location.path('/surveyor-details/' + user._id);
      }
    }
  }

  angular
    .module('cloudheatengineer')
    .controller('LoginController', ['$scope', '$rootScope', 'userService', 'alertService', '$location', 'dataService', 'braintreeService', 'heatLossEstimatorService','apiService', '$window', LoginController]);

}());
