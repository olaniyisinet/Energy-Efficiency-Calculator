(function () {
  'use strict';

  angular.module('cloudheatengineer')
    .controller('TrainingController', TrainingController)
    .controller('EventsController', EventsController)
    .controller('OldeventsController', OldeventsController);




  TrainingController.$inject = ['$scope', '$rootScope', '$location', '$window' ];

  function TrainingController ($scope, $rootScope, $location, $window) {

    $scope.message = 'Hello';
    $scope.iFrameHeight = '377';
    $scope.windowWidth = $(window).width();
    $window.document.title = 'Heat Engineer Training';
    $rootScope.heatmanagerview = true;

    if ($scope.windowWidth < 768) {
      $scope.iFrameHeight = '300';
    } else if ($scope.windowWidth < 480) {
      $scope.iFrameHeight = '200';
    }

    $rootScope.showHeader = false;
    $rootScope.showFooter = false;

    let routeName = $location.path();
    if (routeName == '/' || routeName == '/home') {
      $rootScope.showHeader = true;
      $rootScope.showFooter = true;
    } else {
      $rootScope.showHeader = false;
      $rootScope.showFooter = false;
    }

  }




  EventsController.$inject = ['$scope', 'apiService', 'alertService', '$rootScope', '$window', '$location'];

  function EventsController ($scope, apiService, alertService, $rootScope, $window, $location) {

    $scope.message = 'Hello';
    $scope.iFrameHeight = '377';
    $scope.windowWidth = $(window).width();
    $window.document.title = 'Heat Engineer Events';
    $rootScope.heatmanagerview = true;

    if ($scope.windowWidth < 768) {
      $scope.iFrameHeight = '300';
    } else if ($scope.windowWidth < 480) {
      $scope.iFrameHeight = '200';
    }

    $rootScope.showHeader = false;
    $rootScope.showFooter = false;

    let routeName = $location.path();
    if (routeName == '/' || routeName == '/home') {
      $rootScope.showHeader = true;
      $rootScope.showFooter = true;
    } else {
      $rootScope.showHeader = false;
      $rootScope.showFooter = false;
    }

    $scope.events = [];
    $scope.details = {};
    $scope.data = {}
    $scope.formVisible = false
    $scope.isArchived = false;
    $scope.type = "";
    $scope.showAddButton = false;

    if ($rootScope.user && $rootScope.user.is_admin) {
      $scope.showAddButton = true;
    }

    $scope.getEvents = function () {
      apiService['events'].get(function (response) {
        $scope.events = response.data;
      });
    }

    $scope.add = function (data, type) {
      $scope.type = type
      if (type == "update") {
        // event get by id
        apiService.get('events', { _id: data._id }).then(function (details) {
          $scope.details = details.data[0]
          $scope.details.eventdate = new Date(details.data[0].eventdate)
        });
      }
      $scope.formVisible = true
    }

    $scope.addDetails = function () {
      if ($scope.type == "add") {
        apiService
          // add event
          .save('events', $scope.details)
          .then(function (response) {
            alertService('success', 'Event', response.message);
            $scope.formVisible = false
            $scope.details = {}
            $scope.getEvents()
          }, function (error) {
            alertService('danger', 'Something went wrong!', error.data.message);
          });
      } else {
        $scope.data.venue = $scope.details.venue
        $scope.data.description = $scope.details.description
        $scope.data.eventdate = $scope.details.eventdate
        $scope.data.link = $scope.details.link
        $scope.data._id = $scope.details._id
        // edit event
        apiService.update('events', $scope.data).then(function (response) {
          $scope.formVisible = false
          $scope.details = {}
          $scope.getEvents()
          alertService('success', 'Events', 'is updated successfully!');
        });
      }
    }

    $scope.cancel = function () {
      $scope.details = {}
      $scope.formVisible = false
    }

    function init () {
      $scope.getEvents();
    }
    init();

  }


  OldeventsController.$inject = ['$scope', 'apiService', 'alertService', '$rootScope', '$window', '$location' ];

  function OldeventsController ($scope, apiService, alertService, $rootScope, $window, $location) {

    $scope.message = 'Hello';
    $scope.iFrameHeight = '377';
    $scope.windowWidth = $(window).width();
    $window.document.title = 'Heat Engineer Events';
    $rootScope.heatmanagerview = true;

    if ($scope.windowWidth < 768) {
      $scope.iFrameHeight = '300';
    } else if ($scope.windowWidth < 480) {
      $scope.iFrameHeight = '200';
    }

    $rootScope.showHeader = false;
    $rootScope.showFooter = false;

    let routeName = $location.path();
    if (routeName == '/' || routeName == '/home') {
      $rootScope.showHeader = true;
      $rootScope.showFooter = true;
    } else {
      $rootScope.showHeader = false;
      $rootScope.showFooter = false;
    }

    $scope.events = [];
    $scope.details = {};
    $scope.data = {}
    $scope.formVisible = false
    $scope.isArchived = false;
    $scope.type = "";

    $scope.oldEvents = function () {
      apiService['oldevents'].get(function (response) {
        $scope.events = response.data;
      });
    }

    function init () {
      $scope.oldEvents();
    }
    init();

    $scope.addDetails = function () {
      if ($scope.type == "add") {
        apiService
          // add event
          .save('events', $scope.details)
          .then(function (response) {
            alertService('success', 'Event', response.message);
            $scope.formVisible = false
            $scope.details = {}
            $scope.oldEvents()
          }, function (error) {
            alertService('danger', 'Something went wrong!', error.data.message);
          });
      } else {
        $scope.data.venue = $scope.details.venue
        $scope.data.description = $scope.details.description
        $scope.data.eventdate = $scope.details.eventdate
        $scope.data.link = $scope.details.link
        $scope.data._id = $scope.details._id
        // edit event
        apiService.update('events', $scope.data).then(function (response) {
          $scope.formVisible = false
          $scope.details = {}
          $scope.oldEvents()
          alertService('success', 'Events', 'is updated successfully!');
        });
      }
    }


    $scope.add = function (data, type) {
      $scope.type = type
      if (type == "update") {
        // event get by id
        apiService.get('events', { _id: data._id }).then(function (details) {
          $scope.details = details.data[0]
          $scope.details.eventdate = new Date(details.data[0].eventdate)
        });
      }
      $scope.formVisible = true
    }

    $scope.cancel = function () {
      $scope.details = {}
      $scope.formVisible = false
    }

    $scope.showRemoveButton = false;
    if ($rootScope.user && $rootScope.user.is_admin) {
      $scope.showRemoveButton = true;
    }

    $scope.removeEvent = function (a) {
      if (confirm('Are you sure you want to remove the event ?')) {
        apiService.events.destroy({ _id: a._id }, function (response) {
          alertService('success', 'events', response.message);
          $scope.oldEvents();
        }, function (error) {
        });
      }
    };
  }


}());
