(function () {
  'use strict';

  function userService ($http, $q, authTokenService, $window, $rootScope, apiService, _) {

    var deferred;
    var storage = $window.localStorage;



    function setUser (userData) {
      // TODO: needs refactor because of old user account doesn't have theme properties on database
      if (userData) {
        if (typeof userData.theme == 'undefined')
          userData.theme = 'orange';

        //userData.ui_theme = undefined;
        if (_.isUndefined(userData.ui_theme)) {
          userData.ui_theme = {};
          userData.ui_theme.panel = 'orange';
          userData.ui_theme.fontFamily = 'Source Sans Pro';
          userData.ui_theme.color = '#555';
          userData.ui_theme.opposite = '#555';
          userData.ui_theme.background = '#fff';
        } else {
          userData.ui_theme.opposite = '#555';
        }

        $rootScope.user = userData;

        storage.setItem('user', JSON.stringify($rootScope.user));
      } else {
        storage.removeItem('userToken');
        storage.removeItem('user');
      }
    }

    function registerSuccessful (response) {
      deferred.resolve(response);
    }

    function authSuccessful (response) {
      deferred.resolve(response);
      authTokenService.setToken(response.token);
      setUser(response.user);
    }

    function logoutSuccessful (response) {
      deferred.resolve(response);
    }

    function authError (error) {
      deferred.reject(error);
    }

    this.updateStorage = function (user) {
      storage.setItem('user', JSON.stringify(user));
      // Update the database as well. As upon the initialization, it is loading the theme from the database now...
      apiService.users.update({
        _id: $rootScope.user._id
      }, $rootScope.user, function (response) { }, function (error) {
        console.log(error);
      });
    };

    this.initialiseUser = function () {
      let user = storage.getItem('user')
      if (user != 'undefined') {
        $rootScope.user = JSON.parse(storage.getItem('user'));
      }
    };

    this.removeUser = function () {
      storage.removeItem('user');
      storage.removeItem('trainee');
      storage.removeItem('isTraineeSelected');
    };

    this.deleteUser = function (user) {
      var deferred = $q.defer();
      $http.delete('/api/users/' + user._id)
        .success(
          function (response) {
            deferred.resolve(response);
          }
        )
        .error(
          function (err) {
            deferred.reject(err);
          }
        );


      return deferred.promise;
    };

    this.register = function (user) {
      deferred = $q.defer();
      $http
        .post('/auth/register', user)
        .success(registerSuccessful)
        .error(authError);
      return deferred.promise;
    };

    this.createDummyUser = function (user) {
      deferred = $q.defer();
      $http
        .post('/auth/createDummyUser', user)
        .success(registerSuccessful)
        .error(authError);
      return deferred.promise;
    };

    this.sendMail = function (user) {
      deferred = $q.defer();
      $http
        .post('/auth/sendmail', user)
        .success(authSuccessful)
        .error(authError);
      return deferred.promise;
    };

    this.sendSubscriptionCancelledMail = function (user) {
      deferred = $q.defer();
      $http
        .post('/auth/sendSubscriptionCancelledMail', user)
        .success(authSuccessful)
        .error(authError);
      return deferred.promise;
    };
    this.sendSubscriptionWarningMail = function (user) {
      deferred = $q.defer();
      $http
        .post('/auth/sendSubscriptionWarningMail', user)
        .success(authSuccessful)
        .error(authError);
      return deferred.promise;
    };
    this.login = function (email, password) {
      deferred = $q.defer();
      return $http.post('/auth/cloudLogin', {
        email: email,
        password: password
      })
        .success(authSuccessful)
        .error(authError);
    };
    this.logout = function (token) {
      deferred = $q.defer();
      return $http.post('/auth/logout', {
        userToken: token,
      })
        .success(logoutSuccessful)
        .error(authError);
    };
    this.updatePassword = function (token, password) {
      deferred = $q.defer();
      return $http.post('/auth/reset/' + token, {
        password: password
      })
        .success(authSuccessful)
        .error(authError);
    };

    this.authorizedWithTokenAndActive = function () {
      if (authTokenService.isAuthenticated() && $rootScope.user.active === true)
        return true;
      else return $q.reject('authorized not active');
    };

    this.authorizedWithToken = function () {
      if (authTokenService.isAuthenticated() && $rootScope.user.active === false)
        return true;
      else return $q.reject('authorized but active');
    };

    this.authorizedNotRequired = function () {
      if (angular.isDefined($rootScope.user)) {
        if (!!authTokenService.isAuthenticated() && $rootScope.user.active === false)
          return true;
        else if (!authTokenService.isAuthenticated())
          return true;
        else return $q.reject('has authorization');
      }
      return true;
    };
  }

  angular
    .module('cloudheatengineer')
    .service('userService', ['$http', '$q', 'authTokenService', '$window', '$rootScope', 'apiService', '_', userService]);

}());
