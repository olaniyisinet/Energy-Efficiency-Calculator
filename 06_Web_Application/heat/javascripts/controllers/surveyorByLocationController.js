(function () {
  'use strict';

  var app = angular.module('cloudheatengineer');

  /**
   * SurveyorByLocationController Controller
   */
  app.controller('SurveyorByLocationController', SurveyorByLocationController);

  SurveyorByLocationController.$inject = ['$rootScope', '$scope', '_', 'apiService', '$location','$window'];

  function SurveyorByLocationController ($rootScope, $scope, _, apiService, $location,$window) {

    $window.document.title = 'Heat Engineer Search Location';


    $rootScope.showHeader = false;
    $rootScope.showFooter = false;
    $rootScope.heatmanagerview = true;

    $scope.surveyorsList = []
    $scope.users = []
    $scope.paginationPage = []
    $scope.loader = false
    $scope.totalPage
    $scope.searchVal = ""
    $scope.searchType = 'postCode'
    $scope.searchResult = 'No users just yet'
    $scope.techList = [
      "GSHP",
      "ASHP",
      "Biomass",
      "Oil",
      "LPG",
      "Mains Gas",
      "Direct Electric"
    ]
    function init () {

      $scope.filterComplete();

    }

    $scope.filterComplete = async function () {
      $scope.searchResult = 'Searching...'
      $scope.loader = true
      let query = {
        limit: 10,
        skip: 1,
        searchTech: $scope.technology ? $scope.technology : ''
      }
      apiService['surveyorAll'].query(query, function (response) {
        $scope.users = response.users
        $scope.loader = false
        if ($scope.users == 0) {
          $scope.searchResult = 'No users just yet'
        } else {
          $scope.currentPaginationPage = 1
        }
        for (let i = 0; i < $scope.users.length; i++) {
            createHighlighter($scope.users[i]);
            if(i == $scope.users.length){
              $scope.gMap = new google.maps.Map(document.getElementById('googleMap'), googleMapOption);
            }

        }
      })
      $scope.gMap = await new google.maps.Map(document.getElementById('googleMap'), googleMapOption);
    }

    $scope.showDetail = function (user) {
      $location.path('/surveyor-details/' + user._id);
    };


    $scope.highlighters = [];
    $scope.gMap = null;

    var winInfo = new google.maps.InfoWindow();

    var googleMapOption = {
      zoom: 5,
      center: new google.maps.LatLng(52.1818835, 0.9997207),
      mapTypeId: google.maps.MapTypeId.TERRAIN
    };

    $scope.gMap = new google.maps.Map(document.getElementById('googleMap'), googleMapOption);

    var createHighlighter = async function (citi) {
      // console.log(searchLatAndLngByStreet(citi.city))
      const geocoder = new google.maps.Geocoder();
      var lat
      var long
      // await geocoder.geocode({ 'address': citi.address + '-' + citi.post_code }, (res, status) => {
      //   console.log(res, status)
      //   if (status == google.maps.GeocoderStatus.OK) {
      //     console.log(JSON.stringify(res[0].geometry.location.lat()))
      //     console.log(JSON.stringify(res[0].geometry.location.lng()))
      //     lat = JSON.stringify(res[0].geometry.location.lat())
      //     long = JSON.stringify(res[0].geometry.location.lng())
      //   }
      // });
      lat = citi.others.profileInfo.lat
      long = citi.others.profileInfo.long

      if(lat) {
        var citiesInfo = new google.maps.Marker({
          map: $scope.gMap,
          position: new google.maps.LatLng(lat, long),
          title: citi.first_name + " " + citi.surname , citi
        });

        citiesInfo.content = '<div>' + citi.address + '<br/><a href="/surveyor-details/'+citi._id+'" style="text-decoration: none; line-height: 30px;"> See More </a></div>';

        google.maps.event.addListener(citiesInfo, 'click', function () {
          winInfo.setContent('<h1>' + citiesInfo.title + '</h1>' + citiesInfo.content);
          winInfo.open($scope.gMap, citiesInfo);
        });
      }
      // $scope.highlighters.push(citiesInfo);
    };

    // updateDB = async function(citi) {
    //   const geocoder = new google.maps.Geocoder();
    //   var lat
    //   var long
    //   if(citi.address || citi.post_code) {
    //     await geocoder.geocode({ 'address': citi.address + '-' + citi.post_code }, (res, status) => {
    //       console.log(res, status)
    //       if (status == google.maps.GeocoderStatus.OK) {
    //         console.log(JSON.stringify(res[0].geometry.location.lat()))
    //         console.log(JSON.stringify(res[0].geometry.location.lng()))
    //         lat = JSON.stringify(res[0].geometry.location.lat())
    //         long = JSON.stringify(res[0].geometry.location.lng())
    //       }
    //     });
    //   }
    // }

    init();
  }


})();
