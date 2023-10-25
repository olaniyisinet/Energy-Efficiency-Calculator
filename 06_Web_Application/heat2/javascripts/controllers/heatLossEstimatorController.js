(function () {
  "use strict";

  var app = angular.module("cloudheatengineer");

  /**
   * Heat Loss Estimator Controller
   */
  app.controller("HeatLossEstimatorController", [
    "$scope",
    "heatLossEstimatorService",
    "$location",
    'alertService',
    '$rootScope',
    '$window',

    function ($scope, heatLossEstimatorService, $location, alertService, $rootScope,$window) {

      $window.document.title = 'HeatLoss Estimator';

      $rootScope.showHeader = false;
      $rootScope.showFooter = false;
      $rootScope.heatmanagerview = true;

      /* Estimate Input Field and Final Report Obj Variables */
      $scope.estimateInputForm = {
        "estimate": {
          "estimates": {}
        }
      };
      $scope.estimateId = "";
      $scope.estimateReports = {};
      $scope.heatMainDistributionLossPercentage = 0;
      $scope.isLoggedInUser = false;
      $scope.heatLossEstimateId = "";

      /* Initial Variables */
      $scope.showWelcomeScreen = true;
      $scope.showInitialInputForm = false;
      $scope.showMainBuildingExtension = false;
      $scope.showMainBuilding = false;
      $scope.showFinalStep = false;
      $scope.showReports = false;
      $scope.commercialChecked = false;
      $scope.domesticChecked = false;
      $scope.selectEstimatorError = false;
      $scope.yesHomeExt = false;
      $scope.noHomeExt = true;
      $scope.extRequiredErr = false;
      $scope.seaLevelErr = false;
      $scope.useThisErr = false
      $scope.airChangesTp = false;
      $scope.showImgDomestic = false;
      $scope.showImgCommericial = false;
      $scope.airChangesCommercialTp = false;
      $scope.showDegreeDataTp = false;

      /* --- Tooltip OPEN and Close ---*/
      $scope.openTpCommercialOpen = function (event) {
        event.preventDefault();
        event.stopPropagation();
        if ($scope.commercialChecked && $scope.finalReportGenerateForm.dwhCommmercial.typeOfUse !== '') {
          $scope.airChangesCommercialTp = true;
        }
      };

      $scope.openDegreeDataTp = function(event) {
        event.preventDefault();
        event.stopPropagation();
        $scope.showDegreeDataTp = true;
      };

      $scope.closeDegreeDataTp = function(event) {
        event.preventDefault();
        event.stopPropagation();
        $scope.showDegreeDataTp = false;
      };

      $scope.closeTpCommercialPopup = function (event) {
        event.preventDefault();
        event.stopPropagation();
        $scope.airChangesCommercialTp = false;
      };

      /* Initialize form  Object */
      $scope.propertyType = {
        commercial: false,
        domestic: false
      }

      $scope.inputInitialForm = {
        projectRef: "",
        projectName: "",
        addressLine1: "",
        addressLine2: "",
        addressLine3: "",
        postCode: "",
        date: new Date(),
        engineer: "",
        ukRegion: "",
        referenceCity: "",
        isExtension: false,
        buildingType: ""
      };

      $scope.mainBuilding = {
        uValueRoofLights: "",
        uValueRoof: "",
        aboveRoof: "",
        uValueWindows: "",
        uValueExternalWalls: "",
        uValueExternalDoors: "",
        groundFloorType: "",
        uValueGroundFloor: "",
        dwelling: { glazingRatioPercent: 20, noOfRoofLights: 0, noOfExternalDoors: 0 },
        avgIndoorTemperature: "",
        avgGroundFloorArea: "",
        noOfFloors: "",
        totalFloorArea: "",
        avgStoreyHeight: "",
        dwellingVolume: "",
        propertyType: ""
      }

      $scope.extension = {
        uValueRoofLights: "",
        uValueRoof: "",
        aboveRoof: "",
        uValueWindows: "",
        uValueExternalWalls: "",
        uValueExternalDoors: "",
        groundFloorType: "",
        uValueGroundFloor: "",
        dwelling: { glazingRatioPercent: 20, noOfRoofLights: 0, noOfExternalDoors: 0 },
        avgIndoorTemperature: "",
        avgGroundFloorArea: "",
        noOfFloors: "",
        totalFloorArea: "",
        avgStoreyHeight: "",
        dwellingVolume: ""
      };

      $scope.finalReportGenerateForm = {
        totalFloorArea: 0,
        seaLevel: "",
        adjustmentAltitude: 0,
        outdoorTemperature: 0,
        dwellingExpostedLocation: "",
        inOutDoorDeltat: 0,
        degreeDays: 0,
        avgAirChangePerHour: "1",
        heatMainDistributionLossPercentage: 2,
        swimPoolKW: 0,
        dwhDomestic: {
          noOfBedrooms: "",
          noOfBathrooms: "",
          noOfOccupentsBedroom: ""
        },
        dwhCommmercial: {
          useThis: "",
          noOfOccupants: "",
          typeOfUse: "",
          daysOfUse: "",
          hotWaterEstimate: 0,
          additionalSizeForHWKW: 0,
          additionalSizeChecked: false,
          kwhPerPersonPerDay: "",
          kwPerPersonPerDay: 0,
          additionalSize: "No Add"
        }
      };

      /* Field Validation  Array */
      $scope.mainExtFields = [
        'uValueRoof',
        'aboveRoof',
        'uValueWindows',
        'uValueExternalWalls',
        'uValueExternalDoors',
        'groundFloorType',
        'uValueGroundFloor'
      ];

      /* Field Validation  Function  */
      $scope.checkInitialInputValid = function () {
        var fieldValid = false;
        if ($scope.inputInitialForm.ukRegion === '' || $scope.inputInitialForm.referenceCity === '' || $scope.inputInitialForm.ukRegion.value === '' || $scope.inputInitialForm.ukRegion.ground_temp === '' || $scope.inputInitialForm.referenceCity.location === '' || $scope.inputInitialForm.referenceCity.value === '') {
          fieldValid = true;
        }
        return fieldValid;
      };

      $scope.checkExtFieldValid = function () {
        var fieldValid = false;
        angular.forEach($scope.mainExtFields, function (value) {
          if ($scope.extension[value] === '') {
            fieldValid = true;
          }
        });
        if ($scope.extension.dwelling.noOfRoofLights > 0 && $scope.extension.uValueRoofLights === '') {
          fieldValid = true;
        }
        return fieldValid;
      };

      $scope.checkMainBuildingValid = function () {
        var fieldValid = false;
        angular.forEach($scope.mainExtFields, function (value) {
          if ($scope.mainBuilding[value] === '') {
            fieldValid = true;
          }
        });
        if ($scope.mainBuilding.dwelling.noOfRoofLights > 0 && $scope.mainBuilding.uValueRoofLights === '') {
          fieldValid = true;
        }
        return fieldValid;
      };

      $scope.checkMbPropTypeValid = function () {
        var fieldValid = false;
        if ($scope.inputInitialForm.isExtension && $scope.mainBuilding.propertyType === '') {
          fieldValid = true;
        }
        return fieldValid;
      };

      $scope.checkFinalFormValid = function () {
        var fieldValid = false;
        if ($scope.finalReportGenerateForm.seaLevel === '' || $scope.finalReportGenerateForm.dwellingExpostedLocation === '') {
          fieldValid = true;
        }
        return fieldValid;
      };

      $scope.checkCommericalFormValid = function () {
        var fieldValid = false;
        if ($scope.commercialChecked && ($scope.finalReportGenerateForm.dwhCommmercial.typeOfUse === '')) {
          fieldValid = true;
        }
        return fieldValid;
      };

      /* Each Step Form Submit Action */
      $scope.isReviewPage = function () {
        if($scope.isLoggedInUser && $scope.heatLossEstimateId) {
          return true;
        } else if (!$scope.isLoggedInUser && $scope.heatLossEstimateId) {
          return false;
        } else {
          return false;
        }
      };

      $scope.starOnboard = function () {
        if ($scope.commercialChecked || $scope.domesticChecked) {
          $scope.propertyType = {
            commercial: $scope.commercialChecked,
            domestic: $scope.domesticChecked
          }
          let userString = window.localStorage.getItem('user');
          if (userString) {
            let userObj = JSON.parse(userString);
            $scope.estimateInputForm.estimate.estimator_email = userObj.email
            $scope.estimateInputForm.estimate.estimator_name = userObj.first_name
          }
          if (!$scope.estimateId) {
            $scope.estimateInputForm.estimate.estimates = $scope.propertyType;
            heatLossEstimatorService.getEstimatorType($scope.estimateInputForm).then(function (res, err) {
              if (res && res.data && res.data && res.data._id) {
                $scope.estimateInputForm.estimate.estimate_id = res.data._id;
                $scope.estimateId = res.data._id;
                $scope.showWelcomeScreen = false;
                $scope.showInitialInputForm = true;
                //alertService('success', 'Created!', 'Property Type created successfully!');
              } else {
                alertService('warning', 'Opps!', 'Something went wrong!');
              };
            });
          } else {
            $scope.estimateInputForm.estimate.estimate_id = $scope.estimateId ? $scope.estimateId : $scope.heatLossEstimateId;
            $scope.showWelcomeScreen = false;
            $scope.showInitialInputForm = true;
          }
        } else {
          alertService('warning', 'Opps!', 'Please check the property type');
        };
      };

      $scope.submitAndSaveInputForm = function (isValid) {
        if (isValid && $scope.inputInitialForm.referenceCity.location && $scope.inputInitialForm.ukRegion.region && $scope.inputInitialForm.isExtension !== "") {
          $scope.inputInitialForm.buildingType = $scope.buildingType;
          $scope.showInitialInputForm = false;
          $scope.showMainBuilding = true;
        } else {
          alertService('warning', 'Opps!', 'Please fill the required fields');
        };
      };

      $scope.submitMainBuildingForm = function (isValid) {
        if (isValid) {
          $scope.showMainBuilding = false;
          if ($scope.inputInitialForm.isExtension) {
            $scope.extension.avgIndoorTemperature = $scope.mainBuilding.avgIndoorTemperature;
            $scope.showMainBuildingExtension = true;
          } else {
            $scope.finalReportGenerateForm.totalFloorArea = $scope.mainBuilding.totalFloorArea;
            $scope.finalReportGenerateForm.degreeDays = $scope.inputInitialForm.ukRegion.value;
            $scope.showFinalStep = true;
          }
        } else {
          alertService('warning', 'Opps!', 'Please fill the required fields');
        };
      };

      $scope.submitExtensionForm = function (isValid) {
        if (isValid) {
          $scope.showMainBuildingExtension = false;
          $scope.finalReportGenerateForm.totalFloorArea = $scope.mainBuilding.totalFloorArea + $scope.extension.totalFloorArea;
          $scope.finalReportGenerateForm.degreeDays = $scope.inputInitialForm.ukRegion.value;
          $scope.showFinalStep = true;
        } else {
          alertService('warning', 'Opps!', 'Please fill the required fields');
        };
      };

      $scope.subitAndGenerateFinalReports = function (isValid) {
        $scope.isLoggedInUser = JSON.parse(window.localStorage.getItem('user'))
        if (isValid) {
          if($scope.isReviewPage()) {
            $scope.estimateInputForm.estimate.estimates = angular.extend($scope.inputInitialForm, $scope.finalReportGenerateForm);
          } else {
            $scope.estimateInputForm.estimate.estimates = angular.extend($scope.propertyType, $scope.inputInitialForm, $scope.finalReportGenerateForm);
          }
          if($scope.propertyType.commercial) {
            $scope.finalReportGenerateForm.dwhCommmercial.useThis ="Yes";
          } else {
            $scope.finalReportGenerateForm.dwhCommmercial.useThis ="No";
          }
          $scope.estimateInputForm.estimate.estimates.dwhCommmercial = $scope.finalReportGenerateForm.dwhCommmercial;
          $scope.estimateInputForm.estimate.estimates.dwhDomestic = $scope.finalReportGenerateForm.dwhDomestic;
          $scope.estimateInputForm.estimate.estimates.dwhCommmercial.additionalSize = $scope.finalReportGenerateForm.dwhCommmercial.additionalSizeChecked ? "Add" : "No Add";
          $scope.estimateInputForm.estimate.estimates.kwPerPersonPerDay = $scope.finalReportGenerateForm.dwhCommmercial.typeOfUse.value / 100;
          $scope.estimateInputForm.estimate.estimates.mainBuilding = $scope.mainBuilding;
          if ($scope.inputInitialForm.isExtension) {
            $scope.estimateInputForm.estimate.estimates.extension = $scope.extension;
          }
          $scope.estimateInputForm.estimate.estimates.commercial = $scope.propertyType.commercial;
          $scope.estimateInputForm.estimate.estimates.domestic = $scope.propertyType.domestic;
          heatLossEstimatorService.updateFinalFormData($scope.estimateInputForm).then(function (res, err) {
            if (res && res.data && res.data && res.data._id) {
              window.localStorage.setItem('heatLossEstimateId', res.data._id)
              $scope.estimateReports = res.data.heatlossestimates;
              $scope.showFinalStep = false;
              $scope.showReports = true;
            } else {
              alertService('warning', 'Opps!', 'Something went wrong!');
            };
          });
        } else {
          alertService('warning', 'Opps!', 'Please fill the required fields');
        };
      };

      /*  Get Data Constant Json Value for Heat Loss Estimates */
      $scope.getDataConstantJson = function () {
        heatLossEstimatorService.getDataConstantJson().then(function (res, err) {
          if (!err) {
            $scope.ukRegionList = res.data.regions.high_weeks;
            $scope.referenceCityList = res.data.locations;
            $scope.uValueRoofLightList = res.data.u_values_windows;
            $scope.uValueRoofLightExtList = res.data.u_values_windows;
            $scope.uValueRoofList = res.data.u_values_roof;
            $scope.uValueRoofExtList = res.data.u_values_roof;
            $scope.aboveRoofList = res.data.above_roof;
            $scope.uValueWindowsList = res.data.u_values_windows;
            $scope.uValueWindowsExtList = res.data.u_values_windows;
            $scope.uValueExternalWallList = res.data.u_values_external_wall;
            $scope.uValueExternalWallExtList = res.data.u_values_external_wall;
            $scope.uValuesDoorsList = res.data.u_values_doors;
            $scope.uValuesDoorsExtList = res.data.u_values_doors;
            $scope.floorTypeList = res.data.floor_type;
            $scope.groundFloorList = res.data.u_value_floor;
            $scope.groundFloorExtList = res.data.u_value_floor;
            $scope.propertyTypeList = res.data.propertyType;
            $scope.propertyTypeExtList = res.data.propertyType;
            $scope.seaLevelList = res.data.height_above_sea_level;
            $scope.exposedLocationList = res.data.yes_no;
            $scope.useThisList = res.data.yes_no;
            $scope.typeOfUseList = res.data.type_of_use;
            $scope.avgIndoorTempList = res.data.mean_rad_temp;
          } else {
            console.error(err, "Fetching data json error");
          }
        })
      };

      /* Hot Water Estimate Calculation */
      $scope.getHotWaterEstimate = function () {
        if ($scope.finalReportGenerateForm.dwhCommmercial.noOfOccupants !== "" && $scope.finalReportGenerateForm.dwhCommmercial.daysOfUse !== "" && ($scope.finalReportGenerateForm.dwhCommmercial.typeOfUse !== "" && $scope.finalReportGenerateForm.dwhCommmercial.typeOfUse.value !== "")) {
          $scope.finalReportGenerateForm.dwhCommmercial.hotWaterEstimate = $scope.finalReportGenerateForm.dwhCommmercial.noOfOccupants * $scope.finalReportGenerateForm.dwhCommmercial.daysOfUse * $scope.finalReportGenerateForm.dwhCommmercial.typeOfUse.value;
          $scope.finalReportGenerateForm.dwhCommmercial.kwhPerPersonPerDay = $scope.finalReportGenerateForm.dwhCommmercial.hotWaterEstimate;
        } else {
          $scope.finalReportGenerateForm.dwhCommmercial.hotWaterEstimate = "";
          $scope.finalReportGenerateForm.dwhCommmercial.kwhPerPersonPerDay = "";
        }
      };

      /* Check Estimate Type */
      $scope.selectExpector = function (name, value) {
        $scope.selectEstimatorError = false;
        if (name === "domestic") {
          $scope.domesticChecked = true;
          $scope.commercialChecked = false;
          $scope.buildingType = "domestic";
        } else if (name === "commercial") {
          $scope.domesticChecked = false;
          $scope.commercialChecked = true;
          $scope.buildingType = "commercial";
        }
      };

      /* Dropdown and Input Form Value Change with Calculation */
      $scope.changeExposedLocationList = function (value) {
        $scope.finalReportGenerateForm.dwellingExpostedLocation = value;
      };

      $scope.goToDashboard = function(){
        window.localStorage.removeItem('heatLossEstimateId');
        $location.path('/estimator-dashboard');
      }

      $scope.changeSelectedUkRegion = function (item) {
        $scope.ukRegionErr = false;
        if ((item.region === "Custom Entry" && $scope.inputInitialForm.ukRegion && $scope.inputInitialForm.ukRegion.region && $scope.inputInitialForm.ukRegion.region !== "Custom Entry") || ($scope.inputInitialForm.ukRegion && $scope.inputInitialForm.ukRegion.region && $scope.inputInitialForm.ukRegion.region === "Custom Entry" && item.region !== "Custom Entry")) {
          $scope.inputInitialForm.referenceCity = "";
          $scope.ukRegionList.splice($scope.ukRegionList.length - 1, 1);
          $scope.ukRegionList.push({
            region: "Custom Entry",
            value: "1990",
            ground_temp: null
          });
          $scope.inputInitialForm.ukRegion = "";
        }
        $scope.inputInitialForm.ukRegion = item;
      };

      $scope.changeSelectedReferenceCity = function (item) {
        $scope.refCityErr = false;
        $scope.inputInitialForm.referenceCity = item;
      };

      $scope.changeHomeExtension = function (name, value) {
        $scope.extRequiredErr = false;
        if (name === "yes") {
          $scope.yesHomeExt = value;
          $scope.noHomeExt = false;
          $scope.inputInitialForm.isExtension = true;
        } else if (name === "no") {
          $scope.yesHomeExt = false;
          $scope.noHomeExt = value;
          $scope.inputInitialForm.isExtension = false;
        }
      };

      $scope.changeUValueGroundFloor = function (value, name) {
        if (name === "mbExt" && value.name === "Custom Entry") {
          $scope.groundFloorExtList.splice($scope.groundFloorExtList.length - 1, 1);
          $scope.groundFloorExtList.push({
            name: "Custom Entry",
            value: null
          });
          $scope.extension.uValueGroundFloor = "";
        } else if (name === "mb" && value.name === "Custom Entry") {
          $scope.groundFloorList.splice($scope.groundFloorList.length - 1, 1);
          $scope.groundFloorList.push({
            name: "Custom Entry",
            value: null
          });
          $scope.mainBuilding.uValueGroundFloor = "";
        }
        if (name === "mbExt") {
          $scope.extension.uValueGroundFloor = value;
        } else {
          $scope.mainBuilding.uValueGroundFloor = value;
        }
      };

      $scope.changeSeaLevel = function (value) {
        $scope.finalReportGenerateForm.seaLevel = value;
        $scope.finalReportGenerateForm.adjustmentAltitude = - ($scope.finalReportGenerateForm.seaLevel / 50) * 0.3;
        $scope.finalReportGenerateForm.outdoorTemperature = $scope.inputInitialForm.referenceCity.value + $scope.finalReportGenerateForm.adjustmentAltitude;
        $scope.finalReportGenerateForm.inOutDoorDeltat = $scope.mainBuilding.avgIndoorTemperature - $scope.finalReportGenerateForm.outdoorTemperature;
      };

      $scope.changeGroundFloorType = function (value, name) {
        if (name === "mbExt" && value.name === "Custom Entry") {
          $scope.floorTypeExtList.splice($scope.floorTypeExtList.length - 1, 1);
          $scope.floorTypeExtList.push({
            name: "Custom Entry",
            value: null
          });
          $scope.extension.groundFloorType = "";
        } else if (name === "mb" && value.name === "Custom Entry") {
          $scope.floorTypeList.splice($scope.floorTypeList.length - 1, 1);
          $scope.floorTypeList.push({
            name: "Custom Entry",
            value: null
          });
          $scope.mainBuilding.groundFloorType = "";
        }
        if (name === "mbExt") {
          $scope.extension.groundFloorType = value;
        } else {
          $scope.mainBuilding.groundFloorType = value;
        }
      };

      $scope.changeUValueExternalDoors = function (value, name) {
        if (name === "mbExt" && value.name === "Custom Entry") {
          $scope.uValuesDoorsExtList.splice($scope.uValuesDoorsExtList.length - 1, 1);
          $scope.uValuesDoorsExtList.push({
            name: "Custom Entry",
            value: null
          });
          $scope.extension.uValueExternalDoors = "";
        } else if (name === "mb" && value.name === "Custom Entry") {
          $scope.uValuesDoorsList.splice($scope.uValuesDoorsList.length - 1, 1);
          $scope.uValuesDoorsList.push({
            name: "Custom Entry",
            value: null
          });
          $scope.mainBuilding.uValueExternalDoors = "";
        }
        if (name === "mbExt") {
          if (value == 'none') {
            let a = {
              name: "None",
              value: 0
            }
            $scope.extension.uValueExternalDoors = a;
          } else {
            $scope.extension.uValueExternalDoors = value;
          }
        } else {
          $scope.mainBuilding.uValueExternalDoors = value;
        }
      };

      $scope.changeUValueExternalWall = function (value, name) {
        if (name === "mbExt" && value.name === "Custom Entry") {
          $scope.uValueExternalWallExtList.splice($scope.uValueExternalWallExtList.length - 1, 1);
          $scope.uValueExternalWallExtList.push({
            name: "Custom Entry",
            value: null
          });
          $scope.extension.uValueExternalWalls = "";
        } else if (name === "mb" && value.name === "Custom Entry") {
          $scope.uValueExternalWallList.splice($scope.uValueExternalWallList.length - 1, 1);
          $scope.uValueExternalWallList.push({
            name: "Custom Entry",
            value: null
          });
          $scope.mainBuilding.uValueExternalWalls = "";
        }
        if (name === "mbExt") {
          if (value == 'none') {
            let a = {
              name: "None",
              value: 0
            }
            $scope.extension.uValueExternalWalls = a;
          } else {
            $scope.extension.uValueExternalWalls = value;
          }
        } else {
          $scope.mainBuilding.uValueExternalWalls = value;
        }
      };

      $scope.changeUValueWindows = function (value, name) {
        if (name === "mbExt" && value.name === "Custom Entry") {
          $scope.uValueWindowsExtList.splice($scope.uValueWindowsExtList.length - 1, 1);
          $scope.uValueWindowsExtList.push({
            name: "Custom Entry",
            value: null
          });
          $scope.extension.uValueWindows = "";
        } else if (name === "mb" && value.name === "Custom Entry") {
          $scope.uValueWindowsList.splice($scope.uValueWindowsList.length - 1, 1);
          $scope.uValueWindowsList.push({
            name: "Custom Entry",
            value: null
          });
          $scope.mainBuilding.uValueWindows = "";
        }
        if (name === "mbExt") {
          if (value == 'none') {
            let a = {
              name: "None",
              value: 0
            }
            $scope.extension.uValueWindows = a;
          } else {
            $scope.extension.uValueWindows = value;
          }
        } else {
          $scope.mainBuilding.uValueWindows = value;
        }
      };

      $scope.changeUValueRoofLights = function (value, name) {
        if (name === "mbExt" && value.name === "Custom Entry") {
          $scope.uValueRoofLightExtList.splice($scope.uValueRoofLightExtList.length - 1, 1);
          $scope.uValueRoofLightExtList.push({
            name: "Custom Entry",
            value: null
          });
          $scope.extension.uValueRoofLights = "";
        } else if (name === "mb" && value.name === "Custom Entry") {
          $scope.uValueRoofLightList.splice($scope.uValueRoofLightList.length - 1, 1);
          $scope.uValueRoofLightList.push({
            name: "Custom Entry",
            value: null
          });
          $scope.mainBuilding.uValueRoofLights = "";
        }
        if (name === "mbExt") {
          $scope.extension.uValueRoofLights = value;
        } else {
          $scope.mainBuilding.uValueRoofLights = value;
        }
      };

      $scope.changeUValueRoof = function (value, name) {
        if (name === "mbExt" && value.name === "Custom Entry") {
          $scope.uValueRoofExtList.splice($scope.uValueRoofExtList.length - 1, 1);
          $scope.uValueRoofExtList.push({
            name: "Custom Entry",
            value: null
          });
          $scope.extension.uValueRoof = "";
        } else if (name === "mb" && value.name === "Custom Entry") {
          $scope.uValueRoofList.splice($scope.uValueRoofList.length - 1, 1);
          $scope.uValueRoofList.push({
            name: "Custom Entry",
            value: null
          });
          $scope.mainBuilding.uValueRoof = "";
        }
        if (name === "mbExt") {
          $scope.extension.uValueRoof = value;
        } else {
          $scope.mainBuilding.uValueRoof = value;
        }
      };

      $scope.changeAboveRoof = function (value, name) {
        if (name === "mbExt") {
          $scope.extension.aboveRoof = value;
        } else {
          $scope.mainBuilding.aboveRoof = value;
        }
      };

      $scope.changeAvgIndoorTemp = function (value, name) {
        if (name === "mbExt") {
          $scope.extension.avgIndoorTemperature = value;
        } else {
          $scope.mainBuilding.avgIndoorTemperature = value;
        }
      }

      $scope.changePropertyType = function (value, name) {
        if (name === "mbExt") {
          $scope.extension.propertyType = value;
        } else {
          $scope.mainBuilding.propertyType = value;
        }
      }

      $scope.changeTypeOfUse = function (item) {
        $scope.finalReportGenerateForm.dwhCommmercial.typeOfUse = item;
        $scope.getHotWaterEstimate();
      };

      /* Back to Steps */
      $scope.backToPropertyType = function () {
        $scope.showWelcomeScreen = true;
        $scope.showInitialInputForm = false;
      };

      $scope.backToPropertyInformation = function () {
        $scope.showInitialInputForm = true;
        $scope.showMainBuilding = false;
      };

      $scope.backToMainBuilding = function () {
        $scope.showMainBuilding = true;
        $scope.showMainBuildingExtension = false;
      };

      $scope.backToExtOrMainbuilding = function () {
        $scope.showFinalStep = false;
        if ($scope.inputInitialForm.isExtension) {
          $scope.showMainBuildingExtension = false;
        } else {
          $scope.showMainBuilding = true;
        }
      };

      $scope.backToFinalForm = function() {
        $scope.showReports = false;
        $scope.showFinalStep = true;
      }

      $scope.reviewEstimator = function (id) {
        heatLossEstimatorService.getHeatLossEstimatorValueForPDF(id).then(function (res, err) {
          if (!err) {
            $scope.estimateInputForm.estimate.estimate_id = res.data._id;
            $scope.estimateId = $scope.heatLossEstimateId;
            $scope.domesticChecked = res.data.heatlossestimates.domestic;
            if(res.data.heatlossestimates.domestic){
              $scope.buildingType = "domestic";
            }
            if(res.data.heatlossestimates.commercial) {
              $scope.buildingType = "commercial";
            }
            $scope.commercialChecked = res.data.heatlossestimates.commercial;
            $scope.propertyType.commercial = res.data.heatlossestimates.commercial;
            $scope.propertyType.domestic = res.data.heatlossestimates.domestic;
            $scope.inputInitialForm = res.data.heatlossestimates;
            $scope.inputInitialForm.date = new Date(res.data.heatlossestimates.date);
            $scope.mainBuilding = res.data.heatlossestimates.mainBuilding;
            if (res.data.heatlossestimates.isExtension) {
              $scope.yesHomeExt = true;
              $scope.noHomeExt = false;
              $scope.extension = res.data.heatlossestimates.extension;
            } else {
              $scope.yesHomeExt = false;
              $scope.noHomeExt = true;
            }
            $scope.finalReportGenerateForm = res.data.heatlossestimates;
            $scope.estimateReports = res.data.heatlossestimates;
          }
        });

      };

      /* Initialize Function*/
      $scope.init = function () {
        $scope.isLoggedInUser = window.localStorage.getItem('user');
        $scope.heatLossEstimateId = window.localStorage.getItem('heatLossEstimateId');
        $scope.getDataConstantJson();
        if ($scope.isReviewPage()) {
          $scope.reviewEstimator($scope.heatLossEstimateId);
        }
      };

      /* Initialize Function Calling to set Dropdown Value for Input Fields*/
      $scope.init();
    }
  ]);
})();
