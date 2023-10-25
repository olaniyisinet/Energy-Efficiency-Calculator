(function () {
  'use strict';

  angular.module('cloudheatengineer')
    .controller('AccountController', AccountController);

  AccountController.$inject = ['$rootScope', '$scope', 'multipartFormService', 'userService', 'alertService', 'apiService', '$window'];
  function AccountController ($rootScope, $scope, multipartFormService, userService, alertService, apiService, $window) {

    $window.document.title = 'Heat Engineer Account';

    $scope.numSup = '';
    $scope.details = $rootScope.user;
    $scope.showForm = true;
    $scope.newCard = {
      card_holder_name: '',
      card_number: '',
      expires_on: '',
      cvv: '',
      cardToken: ''
    };
    $scope.regex = '/\d+/';

    const nth = function (d) {
      if (d > 3 && d < 21) return 'th';
      switch (d % 10) {
        case 1: return "st";
        case 2: return "nd";
        case 3: return "rd";
        default: return "th";
      }
    }


  function init() {
    if ($scope.details.selectedPlan.plan != 'none' && $scope.details.selectedPlan.plan != 'singleSurvey') {
      if ($scope.details.selectedPlan.subscription) {
        let dt = $scope.details.selectedPlan.subscription.nextBillingDate ? $scope.details.selectedPlan.subscription.nextBillingDate : '';
        let dtSp = dt.split('-')
        $scope.numSup = nth(dtSp[2])
      }
    }
  }

  init();

    $scope.validateExpiryDate = function (dt) {
      var d = new Date();
      let curDate = {
        month: d.getMonth() + 1,
        year: d.getFullYear()
      }
      let spDt = dt.split('/');
      let card = {
        month: parseInt(spDt[0]),
        year: parseInt(spDt[1])
      }
      if (card.month > 0 && card.month <= 12 && card.year >= curDate.year) {
        if (card.year == curDate.year) {
          if (card.month > curDate.month) {
            return true
          } else {
            return false
          }
        } else {
          return true
        }
      } else {
        return false
      }
    }

    //TODO: Just refactor

    $scope.update = function () {

      var uploadUrl = '/user/upload';

      multipartFormService.post(uploadUrl, $scope.details).then(function (response) {
        $rootScope.user = response.data;
        userService.updateStorage($rootScope.user);
        alertService('success', 'Updated!', 'Company logo updated successfully!');
      }, function () {
        alertService('warning', 'Opps!', 'Something went wrong!');
      });
    };

    $scope.latLong = function () {
      let query = {
        limit: 10,
        skip: 1,
        searchTech: ''
      }
      apiService['surveyorAll'].query(query, async function (response) {
        $scope.usersList = response.users

        for (let i = 0; i < $scope.usersList.length; i++) {
          if (!$scope.usersList[i].others.profileInfo) {
            $scope.usersList[i].others.profileInfo = {}
          }

          if (!$scope.usersList[i].others.profileInfo.lat && $scope.usersList[i].address != undefined && $scope.usersList[i].address != "") {
            const geocoder = new google.maps.Geocoder();

            await geocoder.geocode({ 'address': $scope.usersList[i].address + '-' + $scope.usersList[i].post_code }, (res, status) => {
              if (status == google.maps.GeocoderStatus.OK) {

                $scope.usersList[i].others.profileInfo.lat = JSON.stringify(res[0].geometry.location.lat())
                $scope.usersList[i].others.profileInfo.long = JSON.stringify(res[0].geometry.location.lng())
              }
            });
            await apiService.users.update({ _id: $scope.usersList[i]._id }, $scope.usersList[i], function (response) {

            }, function (error) {

            });


          }
        }
      })
    }

    $scope.updateDetails = async function () {
      const geocoder = new google.maps.Geocoder();
      await geocoder.geocode({ 'address': $scope.details.address + '-' + $scope.details.post_code }, (res, status) => {
        if (status == google.maps.GeocoderStatus.OK) {
          if (!$scope.details.others.profileInfo) {
            $scope.details.others.profileInfo = {}
          }
          $scope.details.others.profileInfo.lat = JSON.stringify(res[0].geometry.location.lat())
          $scope.details.others.profileInfo.long = JSON.stringify(res[0].geometry.location.lng())
        }
      });
      if ($scope.details.company_name) {
        $scope.details.inviters[0].company = $scope.details.company_name
      }
      await apiService.users.update({ _id: $scope.details._id }, $scope.details, function (response) {
        alertService('success', 'Account Details', response.message);
        //localStorage.setItem('user', JSON.stringify($scope.details));
        $scope.details.old = $scope.details.new = $scope.details.confirm = null;
        //userService.updateStorage($scope.details);
        window.localStorage.setItem('user', JSON.stringify($scope.details));
      }, function (error) {
        alertService('warning', 'Password', error.data.message);
      });
    };

    $scope.changeCreditCard = function () {
      if ($scope.validateExpiryDate($scope.newCard.expires_on)) {
        let userData = $rootScope.user;
        if (userData.selectedPlan.subscription && (userData.selectedPlan.subscription.transactions.length > 0)) {
          let cardToken = userData.selectedPlan.subscription.transactions[0].creditCard.token;
          $scope.newCard.cardToken = cardToken;
          apiService.save('changeCardInfo', $scope.newCard).then(function (res) {
            let alertBox = 'success';
            if (res.response.success == false) {
              alertBox = 'warning'
              alertService(alertBox, 'Card Change : ', res.response.message);
            } else {
              alertBox = 'success'
              alertService(alertBox, 'Card Change : ', 'Your Card has been updated successfully.');
              $scope.showForm = true;
              $scope.newCard = {
                card_holder_name: '',
                card_number: '',
                expires_on: '',
                cvv: '',
                cardToken: ''
              };
            }

          }, function (error) {
            alertService('warning', 'Card Change : ', error.data.message);
          });
        } else {
          alertService('warning', 'Card Change : ', 'Customer ID not found, please contact Admin.');
        }
      } else {
        alert('Please enter a valid card details and a future valid expiry date in mm/yyyy');
      }

    }

    $scope.showCreditCardChangeForm = function () {
      $scope.showForm = !$scope.showForm;
    }

  }

})();
