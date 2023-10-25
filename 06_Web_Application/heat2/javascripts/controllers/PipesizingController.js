(function () {
  'use strict';

  /**
  * Pipe sizing Controller and its modal
  */

  angular.module('cloudheatengineer')
    .controller('ShowImageModalController', ShowImageModalController)
    .controller('totalWattsModalController', totalWattsModalController)
    .controller('PipesizingController', PipesizingController);

  // ShowImageModalController

  ShowImageModalController.$inject = ['$scope', '$modalInstance', 'data'];

  function ShowImageModalController ($scope, $modalInstance, data) {

    $scope.type = data.type;
    $scope.url = "/images/" + data.type + ".jpg"

    $scope.ok = function () {
      $modalInstance.close();
    }

  }

  // total watts modal controller
  totalWattsModalController.$inject = ['$scope', '$modalInstance', 'data'];

  function totalWattsModalController ($scope, $modalInstance, data) {

    $scope.roomId = data.roomId
    $scope.survey = data.survey
    $scope.rooms = data.survey.surveys.rooms;
    $scope.branches = data.survey.surveys.branches
    $scope.totalWattsInput
    $scope.totalWatts = 0
    $scope.sectionId
    $scope.currentRads = false;
    $scope.hasaValue = false;
    $scope.selectedWatts = {};
    $scope.primaryFlowIndex = data.survey.surveys.primaryFlowIndex ? data.survey.surveys.primaryFlowIndex : {};
    $scope.radKeys = ['one', 'two', 'three', 'four', 'five', 'six'];
    $scope.showRoomsRads = false;

    // $scope.onShowRoomsRadsChange = function () {
    //   $scope.showRoomsRads = !$scope.showRoomsRads;
    // }
    function init () {
      if ($scope.roomId == 'primaryFlow') {
        $scope.selectedWatts = $scope.primaryFlowIndex.selectedWatts || {}
        $scope.sectionId = $scope.primaryFlowIndex.sectionId
      } else {
        $scope.totalWattsInput = $scope.branches[$scope.roomId].t_watts;
        $scope.selectedWatts = $scope.branches[$scope.roomId].selectedWatts || {}
        $scope.sectionId = $scope.branches[$scope.roomId].sectionId
      }

      angular.forEach($scope.rooms, function (room, index) {
        let rads = room.new_radiators;
        if ($scope.currentRads) {
          rads = room.radiators
        }
        if (rads) {
          if (rads.one != null ||
            rads.two != null ||
            rads.three != null ||
            rads.four != null ||
            rads.five != null ||
            rads.six != null) {
            $scope.hasaValue = true;
            room.hasRads = true;
          }
        }
      });

      angular.forEach($scope.selectedWatts, function (wts) {
        if (wts.addWatts && wts.watts) {
          if (wts.addWatts) $scope.totalWatts = $scope.totalWatts + parseFloat(wts.watts);
        }
        if (wts.one && wts.one.addWatts) {
          $scope.totalWatts = $scope.totalWatts + parseFloat(wts.one.watts);
        }
        if (wts.two && wts.two.addWatts) {
          $scope.totalWatts = $scope.totalWatts + parseFloat(wts.two.watts);
        }
        if (wts.three && wts.three.addWatts) {
          $scope.totalWatts = $scope.totalWatts + parseFloat(wts.three.watts);
        }
        if (wts.four && wts.four.addWatts) {
          $scope.totalWatts = $scope.totalWatts + parseFloat(wts.four.watts);
        }
        if (wts.five && wts.five.addWatts) {
          $scope.totalWatts = $scope.totalWatts + parseFloat(wts.five.watts);
        }
        if (wts.six && wts.six.addWatts) {
          $scope.totalWatts = $scope.totalWatts + parseFloat(wts.six.watts);
        }
      });
      if ($scope.roomId == 'primaryFlow') {
        var initPriFlowIndex = $scope.primaryFlowIndex.selectedWatts
        $scope.totalWattsInput = $scope.primaryFlowIndex.totalWattsInput;
        $scope.initPriFlowSelWatts = initPriFlowIndex;
        if (!$scope.primaryFlowIndex.totalHeatLossCylinder || parseFloat($scope.primaryFlowIndex.totalHeatLossCylinder) == NaN || parseFloat($scope.primaryFlowIndex.totalHeatLossCylinder) == 'NaN') {
          $scope.primaryFlowIndex.totalHeatLossCylinder = 0;
        }
        // let totHeatCyl = $scope.primaryFlowIndex.totalHeatLossCylinder ? parseFloat($scope.primaryFlowIndex.totalHeatLossCylinder) : 0;
        if ($scope.totalWattsInput) {
          $scope.primaryFlowIndex.totalHeatLossCylinder = parseFloat($scope.primaryFlowIndex.totalHeatLossCylinder) + $scope.totalWattsInput
        }
      }
    }

    init();

    function validateSelectAll () {
      let count = 0;
      angular.forEach($scope.selectedWatts, function (val, key) {
        if (val.addWatts == false) {
          count++;
        }
        angular.forEach($scope.radKeys, function (key) {
          if (val[key] && val[key].addWatts == false) {
            count++
          }
        })
      });
      if (count > 0) {
        return false;
      } else {
        return true;
      }
    }

    $scope.onCheckboxChange = function (roomRad, idx) {
      $scope.totalWattsInput = '';
      if (roomRad == 'room') {
        if ($scope.selectedWatts[$scope.rooms[idx].room_name].addWatts) {
          // room add
          if (!$scope.selectedWatts || $scope.selectedWatts.length == 0) $scope.selectedWatts = {};
          let wats = parseFloat($scope.rooms[idx].heat_loss.total_watts);

          let selObj = { roomId: $scope.rooms[idx].room_id, roomName: $scope.rooms[idx].room_name, watts: wats, addWatts: true };
          $scope.selectedWatts[$scope.rooms[idx].room_name] = selObj;


          $scope.totalWatts = parseFloat($scope.totalWatts + wats).toFixed(2)
          $scope.totalWatts = parseFloat($scope.totalWatts);
          if ($scope.roomId == 'primaryFlow') {
            if (!validateSelectAll()) {
              $scope.primaryFlowIndex.selectallWatts = false;
            } else {
              $scope.primaryFlowIndex.selectallWatts = true;
            }
          }
        } else {
          $scope.primaryFlowIndex.selectallWatts = false;
          // room remove
          let wats = parseFloat($scope.rooms[idx].heat_loss.total_watts);
          if ($scope.selectedWatts[$scope.rooms[idx].room_name]) {
            $scope.selectedWatts[$scope.rooms[idx].room_name] = { roomId: $scope.rooms[idx].room_id, roomName: $scope.rooms[idx].room_name, watts: wats, addWatts: false };
          }
          if ($scope.totalWatts > 0)
            $scope.totalWatts = parseFloat($scope.totalWatts - wats).toFixed(2);
          $scope.totalWatts = parseFloat($scope.totalWatts);
        }
      } else {
        //rads
        let key = roomRad;
        let selWatts = $scope.selectedWatts
        if (selWatts[$scope.rooms[idx].room_name][key]) {

          let cusDefMwt = parseFloat($scope.rooms[idx].new_radiators[key].custom_defined_MWT);
          if ($scope.currentRads) {
            cusDefMwt = parseFloat($scope.rooms[idx].radiators[key].custom_defined_MWT);
          }

          if (selWatts[$scope.rooms[idx].room_name][key].addWatts) {
            let selObj = { addWatts: true, watts: cusDefMwt }
            selWatts[$scope.rooms[idx].room_name][key] = selObj;
            $scope.totalWatts = $scope.totalWatts + cusDefMwt;
            if ($scope.roomId == 'primaryFlow') {
              if (!validateSelectAll()) {
                $scope.primaryFlowIndex.selectallWatts = false;
              } else {
                $scope.primaryFlowIndex.selectallWatts = true;
              }
            }
          } else {
            $scope.primaryFlowIndex.selectallWatts = false;
            selWatts[$scope.rooms[idx].room_name][key] = { addWatts: false, watts: cusDefMwt };
            if ($scope.totalWatts > 0)
              $scope.totalWatts = $scope.totalWatts - cusDefMwt;
          }
          $scope.selectedWatts = selWatts;
        }
      }
      if ($scope.roomId == 'primaryFlow') {
        let a = $scope.primaryFlowIndex.cylinderWatts ? parseFloat($scope.primaryFlowIndex.cylinderWatts) : 0;
        $scope.primaryFlowIndex.totalHeatLossCylinder = $scope.totalWatts + a
      }
    }

    $scope.onCylinderValueChanged = function () {
      let a = parseFloat($scope.primaryFlowIndex.cylinderWatts).toFixed(2);
      // $scope.primaryFlowIndex.cylinderWatts = 0;
      if ($scope.totalWattsInput != '') {
        $scope.totalWatts = $scope.totalWattsInput;
      }
      if (a == "NaN" || a == NaN) a = 0;
      $scope.primaryFlowIndex.totalHeatLossCylinder = parseFloat($scope.totalWatts) + parseFloat(a)
    }

    $scope.onSelectAllRoomsChange = function (val = true) {
      $scope.totalWatts = 0;
      if (val == true) {
        $scope.totalWattsInput = '';
      }

      if (val == false && $scope.totalWattsInput != '') {
        $scope.totalWatts = parseFloat($scope.totalWattsInput);
      }

      let addWattsToBranch = val
      if ($scope.roomId == 'primaryFlow' && $scope.primaryFlowIndex.selectallWatts) {
        if (!$scope.primaryFlowIndex.selectallWatts.rooms) addWattsToBranch = false;
      }

      let addRadWattsToBranch = true;
      if ($scope.primaryFlowIndex.selectallWatts && !$scope.primaryFlowIndex.selectallWatts.rads) {
        addRadWattsToBranch = false;
      }

      if ($scope.totalWattsInput == '') {
        angular.forEach($scope.rooms, function (room, idx) {
          // room
          let wats = parseFloat($scope.rooms[idx].heat_loss.total_watts);
          let selObj = { roomId: $scope.rooms[idx].room_id, roomName: $scope.rooms[idx].room_name, watts: wats, addWatts: addWattsToBranch };
          $scope.selectedWatts[$scope.rooms[idx].room_name] = selObj;

          if (addWattsToBranch) {
            $scope.totalWatts = parseFloat($scope.totalWatts + wats).toFixed(2)
            $scope.totalWatts = parseFloat($scope.totalWatts);
          }
        });
      }
      if ($scope.roomId == 'primaryFlow') {
        // if($scope.primaryFlowIndex.selectallWatts == false) {
        //   $scope.totalWatts = 0;
        // }
        let cylVal = $scope.primaryFlowIndex.cylinderWatts ? parseFloat($scope.primaryFlowIndex.cylinderWatts) : 0;
        $scope.primaryFlowIndex.totalHeatLossCylinder = $scope.totalWatts + cylVal;
      }
    }

    $scope.onSelectAllRadsChange = function (val = true) {
      $scope.totalWatts = 0;
      if (val == true) {
        $scope.totalWattsInput = '';
      }

      if (val == false && $scope.totalWattsInput != '') {
        $scope.totalWatts = parseFloat($scope.totalWattsInput);
      }

      let addRadWattsToBranch = val
      if ($scope.roomId == 'primaryFlow' && $scope.primaryFlowIndex.selectallWatts) {
        if ($scope.primaryFlowIndex.selectallWatts.rads == false) addRadWattsToBranch = false;
      }
      let addWattsToBranch = true
      if ($scope.roomId == 'primaryFlow' && $scope.primaryFlowIndex.selectallWatts) {
        if (!$scope.primaryFlowIndex.selectallWatts.rooms) addWattsToBranch = false;
      }

      if ($scope.totalWattsInput == '') {
        angular.forEach($scope.rooms, function (room, idx) {
          //rooms
          let wats = parseFloat($scope.rooms[idx].heat_loss.total_watts);
          let selObj = { roomId: $scope.rooms[idx].room_id, roomName: $scope.rooms[idx].room_name, watts: wats, addWatts: addWattsToBranch };
          $scope.selectedWatts[$scope.rooms[idx].room_name] = selObj;

          if (addWattsToBranch) {
            if ($scope.selectedWatts[$scope.rooms[idx].room_name] && $scope.selectedWatts[$scope.rooms[idx].room_name].addWatts == true) {
              $scope.totalWatts = parseFloat($scope.totalWatts) + wats
            }
          }
          // rads
          angular.forEach($scope.radKeys, function (key) {
            let rads = $scope.rooms[idx].new_radiators
            if ($scope.currentRads) {
              rads = $scope.rooms[idx].radiators
            }
            if (rads && rads[key] && rads[key].type != '') {
              let cusDefMwt = parseFloat(rads[key].custom_defined_MWT);
              let selObj = { addWatts: addRadWattsToBranch, watts: cusDefMwt }
              $scope.selectedWatts[$scope.rooms[idx].room_name][key] = selObj;
              if (addRadWattsToBranch) {
                $scope.totalWatts = $scope.totalWatts + cusDefMwt;
              }
            }
          });
        });
      }
      if ($scope.roomId == 'primaryFlow') {
        // if($scope.primaryFlowIndex.selectallWatts.rads == false) {
        //   $scope.totalWatts = 0;
        // }
        let cylVal = $scope.primaryFlowIndex.cylinderWatts ? parseFloat($scope.primaryFlowIndex.cylinderWatts) : 0;
        $scope.primaryFlowIndex.totalHeatLossCylinder = $scope.totalWatts + cylVal
      }


    }

    $scope.onTotalWattsInputChange = function () {
      if ($scope.roomId == 'primaryFlow') {
        let cyVal = $scope.primaryFlowIndex.cylinderWatts ? parseFloat($scope.primaryFlowIndex.cylinderWatts) : 0;
        $scope.primaryFlowIndex.totalHeatLossCylinder = parseFloat($scope.totalWattsInput) + cyVal
        // TODO: remove all rooms / rads selected.
        $scope.onSelectAllRoomsChange(false);
        $scope.onSelectAllRadsChange(false);
      }
    }

    $scope.ok = function () {
      if (parseFloat($scope.totalWattsInput) > 0) {
        if ($scope.roomId == 'primaryFlow') {
          $scope.primaryFlowIndex.sectionId = $scope.sectionId;
          let totWatsinp = $scope.totalWattsInput ? parseFloat($scope.totalWattsInput) : '';
          $scope.primaryFlowIndex.totalWattsInput = totWatsinp;
          let cylWatts = $scope.primaryFlowIndex.cylinderWatts ? parseFloat($scope.primaryFlowIndex.cylinderWatts) : 0
          $scope.primaryFlowIndex.totalHeatLossCylinder = parseFloat($scope.primaryFlowIndex.totalWattsInput) + cylWatts;
        } else {
          $scope.branches[$scope.roomId].sectionId = $scope.sectionId;
          $scope.branches[$scope.roomId].t_watts = parseFloat($scope.totalWattsInput)
        }
      } else {
        if ($scope.roomId == 'primaryFlow') {
          $scope.primaryFlowIndex.totalWattsInput = '';
          $scope.primaryFlowIndex.sectionId = $scope.sectionId;
          $scope.primaryFlowIndex.totalHeatLoss = parseFloat($scope.totalWatts)
          let cylWatts = $scope.primaryFlowIndex.cylinderWatts ? parseFloat($scope.primaryFlowIndex.cylinderWatts) : 0
          $scope.primaryFlowIndex.totalHeatLossCylinder = parseFloat($scope.totalWatts) + cylWatts
          $scope.primaryFlowIndex.selectedWatts = $scope.selectedWatts
        } else {
          $scope.branches[$scope.roomId].sectionId = $scope.sectionId;
          $scope.branches[$scope.roomId].t_watts = parseFloat($scope.totalWatts)
          $scope.branches[$scope.roomId].selectedWatts = $scope.selectedWatts
        }
      }
      var ret = {};
      ret.branches = $scope.branches
      ret.primaryFlowIndexData = $scope.primaryFlowIndex
      ret.roomId = $scope.roomId;
      $modalInstance.close(ret);
    }

    $scope.cancel = function () {
      $modalInstance.dismiss('cancel');
    }

  }

  PipesizingController.$inject = ['$location', '$scope', '$rootScope', '$modal', '$routeParams', 'apiService', 'commonService', 'summaryHelperService', 'modalService', '_', 'dataService', 'alertService', '$http', 'urlHelperService'];

  function PipesizingController ($location, $scope, $rootScope, $modal, $routeParams, apiService, commonService, summaryHelperService, modalService, _, dataService, alertService, $http, urlHelperService) {

    $scope.branchDefault = getNewBranch()

    $scope.branches;

    dataService.pipeDataSetup();

    $scope.maxVeloSel = 1.0;
    $scope.miniVeloSel = 0.5;
    $scope.maxPressureLoss
    $scope.fluid
    $scope.specificHeatCapacity = 4.190;
    $scope.pressureCollection = [100, 200, 300, 400]
    $scope.fluidCollection = ["Water", "Water & Glycol"]
    $scope.copy = {
      status: false,
      collection: null
    };
    $scope.pressureLossUnit;
    $scope.volumeFlowRateUnit;
    $scope.columns = false;

    $scope.pipeRadsRadiodisabled = true;
    $scope.massFlowRate = '';
    $scope.pipeInfo = '';
    $scope.diameter = '';
    $scope.primaryFlowIndex = '';
    $scope.finalData = {};
    $scope.finalData.allowSubTotalPercent = 50

    $scope.pipeTempSelect = 'YES'
    $scope.computeFinalData = true;
    $scope.hideComputeButton = false;
    $scope.thisRoom = {}
    $scope.roomsForNetwork = [];
    $scope.allNetRooms;
    $scope.tees = [];
    $scope.getTeeFromRooms = false;
    $scope.indiSubTotal = [];
    $scope.showIndexTable = false;
    $scope.newCircuits = [];
    $scope.pressureUnitForCircuit;
    $scope.pressureUnitForPumpSizing;
    $scope.flowRateUnitForPumpSizing;
    $scope.kpaFactor = 0.10199773339984;
    $scope.maxVolFlowRate;
    $scope.logos = {
      he: '',
      pipe: ''
    }

    $http
      .get(urlHelperService.getHostUrl() + '/javascripts/json/data-image.json')
      .then(function (response) {
        $scope.logos.he = response.data.heLogoBase64
        $scope.logos.pipe = response.data.pipeBase64
      });

    $rootScope.showHeader = false;
    $rootScope.showFooter = false;
    $rootScope.heatmanagerview = true;

    $scope.egCollection = [0, 10, 20, 30, 40, 50, 60]
    $scope.pipeCollection = ["COPPER (X)", "MEDIUM GRADE STEEL", "MLCP", "HEAVY GRADE STEEL"]
    $scope.maxFlowTempBranches = 0;
    $rootScope.cloud_data = JSON.parse(window.localStorage.getItem('cloud_data'))
    $scope.oldRooms = '';
    $scope.priFlowText = 'Heat Source';

    function convertImgToBase64URL (url, callback, outputFormat = 'image/png') {
      var canvas = document.createElement('CANVAS'),
        ctx = canvas.getContext('2d'),
        img = new Image;
      img.setAttribute('crossorigin', 'anonymous')
      img.onload = function () {
        var dataURL;
        canvas.height = img.height;
        canvas.width = img.width;
        ctx.drawImage(img, 0, 0);
        dataURL = canvas.toDataURL(outputFormat);
        callback(dataURL);
        canvas = null;
      }
      img.onerror = function () {
        callback(undefined)
      }
      img.src = url + '?' + new Date().getTime();
    }

    let img64s;



    init();

    $scope.onMinVelocityChanged = function () {
      angular.forEach($scope.survey.surveys.branches, function (rm, index) {
        var item = "none"
        $scope.updateBranches($scope.survey.surveys.branches, index, item)
      });
    }

    $scope.onMaxVelocityChanged = function () {
      angular.forEach($scope.survey.surveys.branches, function (rm, index) {
        var item = "none"
        $scope.updateBranches($scope.survey.surveys.branches, index, item)
      });
    }

    $scope.fluidChanged = function () {
      $scope.pipeSpecificHeatCapacity = getSpecificHeatCapacity($scope.fluid)
      let denVisco = getDensitynViscosity($scope.fluid, $scope.maxFlowTempBranches);
      if ($scope.fluid == 'Water') {
        $scope.contents = false;
      } else {
        $scope.contents = true;
      }
      $scope.density = denVisco.density
      $scope.dynamViscosity = denVisco.viscosity
      var branches = $scope.survey.surveys.branches;
      angular.forEach(branches, function (rm, index) {
        var item = "none"
        $scope.updateBranches($scope.survey.surveys.branches, index, item)

      });
      getIndexEdit()
    }

    $scope.onPipeTypeChange = function () {
      var branches = $scope.survey.surveys.branches;
      angular.forEach(branches, function (rm, index) {
        var item = "none"
        $scope.updateBranches($scope.survey.surveys.branches, index, item)
      });
      getIndexEdit()
    }

    $scope.onPreLossUnitChange = function () {
      // primary flow index
      $scope.survey.surveys.pressureLossUnit = $scope.pressureLossUnit;
      let priCalcSec = $scope.survey.surveys.primaryFlowIndex.totPreLoss
      if ($scope.pressureLossUnit == 'mm H20 / Meter') {
        priCalcSec = $scope.survey.surveys.primaryFlowIndex.totPreLossmm
      }
      let priFittings = $scope.survey.surveys.primaryFlowIndex.fittings ? parseFloat($scope.survey.surveys.primaryFlowIndex.fittings) : 50;
      let priTotpreLossSec = (priCalcSec * (priFittings / 100)) + priCalcSec
      $scope.survey.surveys.primaryFlowIndex.totPreLossSection = priTotpreLossSec

      // all branches
      angular.forEach($scope.survey.surveys.branches, function (obj, idx) {
        if (obj.pipe.totPressureLoss > 0) {
          let calcSec = obj.pipe.totPressureLoss
          if ($scope.pressureLossUnit == 'mm H20 / Meter') {
            calcSec = obj.pipe.totPressureLossmm
          }
          if (obj.fittings) {
            let totpreLossSec = (calcSec * (obj.fittings / 100)) + calcSec
            obj.pipe.totalPressureLossSection = totpreLossSec
          }
          $scope.survey.surveys.branches[idx] = obj;
        }
      })
    }

    $scope.onVolumeFlowRateUnitChange = function () {
      // primary flow index
      $scope.survey.surveys.volumeFlowRateUnit = $scope.volumeFlowRateUnit;
      let pipeIntDia = parseFloat($scope.diameter[0].intDia) / 1000;
      let powerTwo = (pipeIntDia / 2) * (pipeIntDia / 2)
      let volumetricFlow = $scope.survey.surveys.primaryFlowIndex.volumetricFlow * 60 * 60 // hour
      if ($scope.volumeFlowRateUnit == 'Litres / Minute') {
        volumetricFlow = $scope.survey.surveys.primaryFlowIndex.volumetricFlow * 60 //min
      }
      if ($scope.volumeFlowRateUnit == 'Litres / Second') {
        volumetricFlow = $scope.survey.surveys.primaryFlowIndex.volumetricFlow; //sec
      }
      $scope.survey.surveys.primaryFlowIndex.volFlowRateLitHour = volumetricFlow;

      // all branches
      angular.forEach($scope.survey.surveys.branches, function (obj, idx) {
        let roomVolFlow = $scope.survey.surveys.branches[idx].pipe.volumetricFlowRate * 60 * 60;
        if ($scope.volumeFlowRateUnit == 'Litres / Minute') {
          roomVolFlow = $scope.survey.surveys.branches[idx].pipe.volumetricFlowRate * 60
        }
        if ($scope.volumeFlowRateUnit == 'Litres / Second') {
          roomVolFlow = $scope.survey.surveys.branches[idx].pipe.volumetricFlowRate
        }
        $scope.survey.surveys.branches[idx].pipe.volFlowRateLitHour = roomVolFlow;
      });
    }

    $scope.copyAll = function (collection) {
      $scope.copy.status = !$scope.copy.status;
      $scope.copy.collection = !!$scope.copy.status ? collection : null;
    };

    function getSpecificHeatCapacity (fluid) {
      let flowTemp = $scope.maxFlowTempBranches;
      if (fluid == 'Water') {
        let speData = $rootScope.pipe_data.speHeatCapaWater
        let heatCapaObj = speData.filter(function (obj) {
          if (flowTemp == obj.deg) {
            return obj;
          }
        })
        if (heatCapaObj.length > 0) return heatCapaObj[0].val;

      } else {
        let speData = $rootScope.pipe_data.speHeatCapaWaterGlycol;
        let percent = $scope.egContent;
        let percentData = speData.filter(function (obj) {
          if (percent == obj.percent) {
            return obj;
          }
        })

        let heatCapaObj = percentData[0].hc.filter(function (obj) {
          if (flowTemp == obj.mft) {
            return obj;
          }
        })
        if (heatCapaObj.length > 0) return heatCapaObj[0].val;
      }
      return;
    }

    function getDensitynViscosity (fluid, flowTemp) {
      let retObj = {
        density: '',
        viscosity: ''
      }
      if (fluid == 'Water') {
        var data = $rootScope.pipe_data.densityWater

        let denVisco = data.filter(function (obj) {
          if (flowTemp == obj.deg) {
            return obj;
          }
        });

        $scope.survey.surveys.fluid = 'Water';
        if (denVisco.length > 0) {
          retObj.density = denVisco[0].density
          retObj.viscosity = denVisco[0].visc
        }

      } else {
        var data = $rootScope.pipe_data.densityWaterGlycol

        let denVisco = data.filter(function (obj) {
          if (flowTemp == obj.temp) {
            return obj;
          }
        });

        let glucolPercent = $scope.egContent;

        // get density
        if (denVisco.length > 0) {
          let waGlyDen = denVisco[0].density.filter(function (obj) {
            if (obj.percent == glucolPercent) {
              return obj;
            }
          })
          // get viscosity
          let waGlyVisc = denVisco[0].viscosity.filter(function (obj) {
            if (obj.percent == glucolPercent) {
              return obj;
            }
          })
          $scope.survey.surveys.fluid = 'Water & Glycol';
          retObj.density = waGlyDen[0].val
          retObj.viscosity = waGlyVisc[0].val * 1000
        }
      }
      return retObj;
    }

    function getIndexEdit () {

      var indexPriFlow = $scope.survey.surveys.primaryFlowIndex || {}

      if ($scope.survey.surveys.primaryFlowIndex) {
        indexPriFlow.delta = $scope.survey.surveys.primaryFlowIndex.delta;
        indexPriFlow.lengthFlow = $scope.survey.surveys.primaryFlowIndex.lengthFlow;
        indexPriFlow.pipeSelect = $scope.survey.surveys.primaryFlowIndex.pipeSelect;
        indexPriFlow.flow_temperature = $scope.survey.surveys.primaryFlowIndex.flow_temperature ? $scope.survey.surveys.primaryFlowIndex.flow_temperature : '-';
        indexPriFlow.roomHeatLoss = $scope.survey.surveys.primaryFlowIndex.totalHeatLossCylinder ? parseFloat($scope.survey.surveys.primaryFlowIndex.totalHeatLossCylinder) / 1000 : $scope.survey.surveys.primaryFlowIndex.roomHeatLoss;
      }

      indexPriFlow.speHeatCapacity = $scope.pipeSpecificHeatCapacity;

      if (indexPriFlow.delta) {
        indexPriFlow.returnTemp = indexPriFlow.flow_temperature - indexPriFlow.delta;
        var multiply = $scope.pipeSpecificHeatCapacity * indexPriFlow.delta
        indexPriFlow.massFlowRat = $scope.indexMassFlow = indexPriFlow.roomHeatLoss / multiply;
      }
      $scope.survey.surveys.primaryFlowIndex = indexPriFlow;
      $scope.primaryFlowIndex = indexPriFlow;
      if (indexPriFlow.pipeSelect) {
        $scope.densityViscosity = getDensitynViscosity($scope.fluid, indexPriFlow.flow_temperature);
        indexPriFlow.meanVelo = $scope.indexMeanVelo = indexgetMeanVelosity();
        indexPriFlow.volumetricFlow = indexgetVolumetricFlowRate()
        if (indexPriFlow.meanVelo >= $scope.miniVeloSel && indexPriFlow.meanVelo <= $scope.maxVeloSel) {
          indexPriFlow.veloCheck = "Accepted"
        } else if (indexPriFlow.meanVelo > $scope.maxVeloSel) {
          indexPriFlow.veloCheck = "Increase Dia"
        } else {
          indexPriFlow.veloCheck = "Reduce Dia"
        }
        $scope.survey.surveys.primaryFlowIndex.reynoldsNum = indexgetReynoldsNumber();
        $scope.indexfrictionFactor = indexgetFrictionFactor();
        indexPriFlow.pressureL = indexgetPressureLoss();
        indexPriFlow.pLoss = indexPriFlow.pressureL / 9804.139432;
        if (indexPriFlow.lengthFlow) {
          indexPriFlow.totPreLoss = indexPriFlow.pLoss * indexPriFlow.lengthFlow;
          indexPriFlow.totPreLossmm = indexPriFlow.totPreLoss * 1000
          $scope.survey.surveys.pressureLossUnit = $scope.pressureLossUnit;
          $scope.survey.surveys.volumeFlowRateUnit = $scope.volumeFlowRateUnit ? $scope.volumeFlowRateUnit : 'Litres / Hour' ;

          //pressure loss section
          let calcSec = indexPriFlow.totPreLoss
          if ($scope.pressureLossUnit == 'mm H20 / Meter') {
            calcSec = indexPriFlow.totPreLossmm
          }
          let fittPercent = indexPriFlow.fittings ? parseInt(indexPriFlow.fittings) : 50;
          let priFittings = fittPercent ? parseInt(fittPercent) : 50
          let totpreLossSec = (calcSec * (priFittings / 100)) + calcSec

          indexPriFlow.totPreLossSection = totpreLossSec
          if ($scope.diameter[0] != undefined) {

            let pipeIntDia = parseFloat($scope.diameter[0].intDia) / 1000;
            let powerTwo = (pipeIntDia / 2) * (pipeIntDia / 2)
            let volumetricFlow = indexPriFlow.volumetricFlow * 60 * 60 // hour
            if ($scope.volumeFlowRateUnit == 'Litres / Minute') {
              volumetricFlow = indexPriFlow.volumetricFlow * 60 //min
            }
            if ($scope.volumeFlowRateUnit == 'Litres / Second') {
              volumetricFlow = indexPriFlow.volumetricFlow; //sec
            }
            indexPriFlow.volFlowRateLitHour = volumetricFlow;
          }
          $scope.maxVolFlowRate = calcMaxVolFlowRate();

          indexPriFlow.waterVolume = parseFloat($scope.diameter[0].Litres) * indexPriFlow.lengthFlow;
          $scope.primaryFlowIndex = indexPriFlow;
          $scope.survey.surveys.primaryFlowIndex = indexPriFlow;
        }
      }

    }

    function getMaxFlowTemp () {
      $scope.maxFlowTempBranches = 0;
      $scope.maxFlowTempBranches = ($scope.survey.surveys.primaryFlowIndex && $scope.survey.surveys.primaryFlowIndex.flow_temperature) ? $scope.survey.surveys.primaryFlowIndex.flow_temperature : 0;
      angular.forEach($scope.survey.surveys.branches, function (value, idx) {
        if ($scope.survey.surveys.branches[idx].flow_temperature != undefined) {
          if ($scope.survey.surveys.branches[idx].flow_temperature > $scope.maxFlowTempBranches) {
            $scope.survey.surveys.maxFlowTempBranches = $scope.maxFlowTempBranches = $scope.survey.surveys.branches[idx].flow_temperature;
          } else {
            $scope.survey.surveys.maxFlowTempBranches = $scope.maxFlowTempBranches;
          }
        }
      });
    }

    function getMassFlowRate (watts, sHeatCapacity, deltat) {
      return parseFloat((watts / (sHeatCapacity * deltat)));
    }

    // Pipesizing Modals
    $scope.editWatts = function (id) {
      var modalInstance = $modal.open({
        animation: true,
        templateUrl: '/partials/views/summary/pipesizing/_modal_total_watts',
        controller: 'totalWattsModalController',
        size: 'md',
        resolve: {
          data: function () {
            return {
              roomId: id,
              survey: $scope.survey,
            }
          }
        }
      });

      modalInstance.result.then(function (ret) {
        $scope.survey.surveys.branches = ret.branches;
        $scope.survey.surveys.primaryFlowIndex = ret.primaryFlowIndexData;
        apiService.update('surveys', $scope.survey).then(function (response) {
          if (ret.roomId == 'primaryFlow') {
            getMaxFlowTemp();
            getIndexEdit()
          } else {
            getMaxFlowTemp();
            updateBranchCalculations();
          }
        }, commonService.onError)
      }, function () {
        // on modal dismiss
      });
    };

    $scope.modalEditPrimaryFlowIndex = function (survey, item, type, optionList = "none", idx = -1) {
      modalService.setTemplateUrl('/partials/views/summary/components/_modal');
      modalService.setController('ModalEditController');
      let itemArr = item.split('.')
      let indx = idx;
      modalService.showModal(survey.surveys, item, idx, optionList, type).then(function (result) {
        $scope.survey.surveys = result.scope;
        apiService.update('surveys', $scope.survey).then(function (response) {
          getMaxFlowTemp();
          getIndexEdit()
          updateCircuits();
        }, commonService.onError)
      })
    };

    $scope.saveCircuit = function () {
      let priObj = {
        sectionId: $scope.primaryFlowIndex.sectionId,
        totPressLoss: $scope.primaryFlowIndex.totPreLoss,
        totPressLossmm: $scope.primaryFlowIndex.totPreLossmm,
        fittings: $scope.primaryFlowIndex.fittings,
        totalPressureLossSection: $scope.primaryFlowIndex.totPreLossSection,
        volumetricFlowRatePerSec: $scope.primaryFlowIndex.volumetricFlow,
        toggleVal: true
      }
      let ncircuits = []
      ncircuits.push(priObj);
      let ptString = $scope.primaryFlowIndex.sectionId;

      // let calcSec = priObj.totPressLoss
      // if ($scope.pressureLossUnit == 'mm H20 / Meter') {
      //   calcSec = priObj.totPressLossmm
      // }
      // if (priObj.fittings) {
      //   let totpreLossSec = (calcSec * (priObj.fittings / 100)) + calcSec
      //   priObj.totalPressureLossSection = totpreLossSec
      // }
      priObj.totalPressureLossSection = getTotalPressureLossSection(priObj);

      $scope.maxVolFlowRate = calcMaxVolFlowRate();


      var totPressureLoss = parseFloat(priObj.totalPressureLossSection);
      angular.forEach($scope.newCircuits, function (cir, idx) {
        if (cir.toggleVal) {
          let obj = {
            sectionId: cir.sectionId,
            totPressLoss: cir.pipe.totPressureLoss,
            totPressLossmm: cir.pipe.totPressureLossmm,
            fittings: cir.fittings,
            totalPressureLossSection: cir.pipe.totalPressureLossSection,
            volumetricFlowRatePerSec: cir.pipe.volumetricFlowRate,
            toggleVal: cir.toggleVal
          };
          ncircuits.push(obj)
          ptString += ", " + cir.sectionId;

          // let calcSec = obj.totPressLoss
          // if ($scope.pressureLossUnit == 'mm H20 / Meter') {
          //   calcSec = obj.totPressLossmm
          // }
          // if (obj.fittings) {
          //   let totpreLossSec = (calcSec * (obj.fittings / 100)) + calcSec
          //   obj.totalPressureLossSection = totpreLossSec
          // }

          obj.totalPressureLossSection = getTotalPressureLossSection(obj)

          totPressureLoss = parseFloat(totPressureLoss) + parseFloat(obj.totalPressureLossSection)
        }
      });
      if (ncircuits.length == 1) {
        alertService('danger', '', 'Selection not valid.');
        return;
      }
      if (!$scope.survey.surveys.circuits) {
        $scope.survey.surveys.circuits = [];
      }
      $scope.survey.surveys.circuits.push({ path: [], pathString: ptString, totalPressureLoss: totPressureLoss, max: false })
      let len = $scope.survey.surveys.circuits.length;
      $scope.survey.surveys.circuits[len - 1].path = ncircuits;
      let maxIdx = getMaxId();
      $scope.survey.surveys.circuits[maxIdx].max = true;
      $scope.maxPressLoss = $scope.survey.surveys.circuits[maxIdx].totalPressureLoss
      apiService.update('surveys', $scope.survey).then(function (response) {
        resetCircuit();
      }, commonService.onError)
    }

    $scope.removeCircuit = function (idx) {
      $scope.survey.surveys.circuits.splice(idx, 1)
      apiService.update('surveys', $scope.survey).then(function (response) {
        resetCircuit();
        updateCircuits();
      }, commonService.onError)
    }

    function getMaxId () {
      let maxPress = 0;
      let maxIdx = 0
      angular.forEach($scope.survey.surveys.circuits, function (val, idx) {
        val.max = false;
        if (val.totalPressureLoss > maxPress) {
          maxPress = val.totalPressureLoss
          maxIdx = idx;
        }
      });
      return maxIdx;
    }

    function updateCircuits () {
      angular.forEach($scope.survey.surveys.circuits, function (val, idx) {
        let totPressureLoss = 0;
        angular.forEach(val.path, function (pval, pidx) {
          //primary
          if (pval.sectionId == $scope.primaryFlowIndex.sectionId) {
            pval.totPressLoss = $scope.primaryFlowIndex.totPreLoss
            pval.totPressLossmm = $scope.primaryFlowIndex.totPreLossmm
            pval.totalPressureLossSection = getTotalPressureLossSection(pval)
            totPressureLoss = totPressureLoss + pval.totalPressureLossSection
          } else {
            //branches
            let filterBranch = $scope.survey.surveys.branches.filter(function (fval) {
              if (fval.sectionId == pval.sectionId) {
                return fval;
              }
            });
            if (filterBranch.length > 0) {
              pval.totPressLoss = filterBranch[0].pipe.totPressureLoss
              pval.totPressLossmm = filterBranch[0].pipe.totPressureLossmm
              pval.totalPressureLossSection = getTotalPressureLossSection(pval)
              totPressureLoss = totPressureLoss + pval.totalPressureLossSection
            }
          }
        });

        val.totalPressureLoss = totPressureLoss;
      });
      // setMax
      let maxIdx = getMaxId();
      if ($scope.survey.surveys.circuits) {
        $scope.survey.surveys.circuits[maxIdx].max = true;
        $scope.maxPressLoss = $scope.survey.surveys.circuits[maxIdx].totalPressureLoss
      }
      $scope.onPressureUnitForCircuitChange($scope.pressureUnitForCircuit)
      $scope.onPressureUnitForCircuitChange($scope.pressureUnitForPumpSizing, 'pump')
    }

    function getTotalPressureLossSection (pval) {
      let calcSec = pval.totPressLoss
      if ($scope.pressureLossUnit == 'mm H20 / Meter') {
        calcSec = pval.totPressLossmm
      }
      let totpreLossSec = 0;
      if (pval.fittings) {
        totpreLossSec = (calcSec * (pval.fittings / 100)) + calcSec
      }
      return parseFloat(totpreLossSec);
    }

    $scope.onPressureUnitForCircuitChange = function (unit, forMod = 'circuit') {

      if (forMod == 'circuit') {

        $scope.pressureUnitForCircuit = $scope.survey.surveys.pressureUnitForCircuit = unit;
        angular.forEach($scope.survey.surveys.circuits, function (obj) {
          let calcTot = 0;
          angular.forEach(obj.path, function (pObj) {
            // if (unit == 'kpa') {
            //   calcTot = calcTot + pObj.totPressLossmm
            // } else {
            let calcSec = pObj.totPressLoss
            if (unit == 'meters head / meter') {
              calcSec = pObj.totPressLoss
            }

            if (unit == 'mm H20 / Meter') {
              calcSec = pObj.totPressLossmm
            }
            let totpreLossSec = (calcSec * (pObj.fittings / 100)) + calcSec
            calcTot = calcTot + totpreLossSec
            //}
          });
          if (unit == 'kpa') {
            obj.totalPressureLoss = calcTot / $scope.kpaFactor
          } else {
            obj.totalPressureLoss = calcTot;
          }
        });
      }

      if (forMod == 'pump') {
        $scope.pressureUnitForPumpSizing = $scope.survey.surveys.pressureUnitForPumpSizing = unit;
        if ($scope.survey.surveys.circuits) {
          let maxPump = $scope.survey.surveys.circuits.filter(function (val) {
            return val.max
          })
          let calcTot = 0;
          angular.forEach(maxPump[0].path, function (pObj) {
            // if (unit == 'kpa') {
            //   calcTot = calcTot + pObj.totPressLoss
            // } else {
            let calcSec = pObj.totPressLoss
            if (unit == 'meters head / meter') {
              calcSec = pObj.totPressLoss
            }
            if (unit == 'mm H20 / Meter') {
              calcSec = pObj.totPressLossmm
            }

            let totpreLossSec = (calcSec * (pObj.fittings / 100)) + calcSec
            calcTot = calcTot + totpreLossSec
            // }
          });
          if (unit == 'kpa') {
            $scope.maxPressLoss = calcTot / $scope.kpaFactor
          } else {
            $scope.maxPressLoss = calcTot;
          }
        }
      }
    }

    // $scope.onPressureUnitForPumpSizingChange = function(unit) {

    //   let maxPress = $scope.survey.surveys.circuits.filter(function(val){
    //     return val.max
    //   });

    //   if(unit == 'metershead') {
    //     $scope.pressureUnitForPumpSizing = 'meters head / meter';
    //     $scope.maxPressLoss = maxPress[0].totalPressureLoss / 1000
    //   }
    //   if(unit == 'mm H20 / Meter') {
    //     $scope.pressureUnitForPumpSizing = 'mm H20 / Meter';
    //     $scope.maxPressLoss = maxPress[0].totalPressureLoss;
    //   }
    //   if(unit == 'kpa') {
    //     $scope.pressureUnitForPumpSizing = 'kPa';
    //     $scope.maxPressLoss = maxPress[0].totalPressureLoss / $scope.kpaFactor
    //   }

    // }

    $scope.onFlowRateUnitForPumpSizingChange = function (unit) {

      $scope.survey.surveys.flowRateUnitForPumpSizing = $scope.flowRateUnitForPumpSizing = unit
      $scope.maxVolFlowRate = calcMaxVolFlowRate();
    }

    function resetCircuit () {
      angular.forEach($scope.newCircuits, function (val) {
        val.toggleVal = false;
      });
    }

    $scope.addCircults = function () {
      $scope.newCircuits = $scope.survey.surveys.branches;
      resetCircuit();
    }

    function calcMaxVolFlowRate () {
      let volFlowPerSec = $scope.primaryFlowIndex.volumetricFlow
      let ret;
      if ($scope.flowRateUnitForPumpSizing == 'Litres / Hour') {
        ret = volFlowPerSec * 60 * 60
      }
      if ($scope.flowRateUnitForPumpSizing == 'Litres / Minute') {
        ret = volFlowPerSec * 60
      }
      if ($scope.flowRateUnitForPumpSizing == 'Litres / Second') {
        ret = volFlowPerSec
      }
      if ($scope.flowRateUnitForPumpSizing == 'm3 / Hour') {
        ret = (volFlowPerSec * 60 * 60) / 1000;
      }
      return ret;
    }

    function getNewBranch () {
      let obj = {
        sectionId: '',
        t_watts: 0,
        flow_temperature: 0,
        return_temperature: 0,
        deltat: 0,
        pipeSelected: 0,
        pipeVolumeCheck: "",
        flowReturnPipes: 0,
        fittings: 50,
        pipe: {
          massFlowRate: 0,
          meanVelosity: 0,
          volumetricFlowRate: 0,
          reynoldsNumber: 0,
          pressureLossPA: 0,
          totPressureLoss: 0,
          totPressureLossmm: 0,
          totalPressureLossSection: 0,
          volFlowRateLitHour: 0,
          waterVolInPipe: 0,
        },
        canDelete: false
      }
      return obj;
    }

    $scope.addBranch = function () {
      $scope.branchDefault = getNewBranch();
      $scope.branchDefault.canDelete = true;
      $scope.survey.surveys.branches.push($scope.branchDefault)
    }

    $scope.removeBranch = function (idx) {
      if (window.confirm("Are you sure you want to delete this Circuit ?")) {
        if (idx == 0) {
          alertService('warning', 'You cannot delete this circuit')
        } else {
          $scope.survey.surveys.branches.splice(idx, 1)
        }
      }
    }

    $scope.moveTo = function (location) {
      apiService.update('surveys', $scope.survey).then(function (response) {
        $scope.survey = response;

        $location.path('/' + location + '/' + $scope.survey._id);
      }, commonService.onError);
    };

    $scope.updateBranches = function (result, idx, item) {

      var radsplit = item.split('.');
      var check = radsplit[0] ? radsplit[0] : '';

      // if (check == 'radiators') {

      //   var itemsplit = radsplit[1];
      //   var selRad = result[idx].radiators[itemsplit];

      //   if (selRad.height && selRad.length) {
      //     getRadsOutputWatts(selRad, itemsplit, idx)
      //   }
      // }
      $scope.survey.surveys.branches = result;
      let watts = $scope.survey.surveys.branches[idx].t_watts / 1000;
      let sHeatCapacity = $scope.pipeSpecificHeatCapacity || $scope.specificHeatCapacity;
      $scope.survey.surveys.branches[idx].specificHeatCapacity = sHeatCapacity;

      getMaxFlowTemp()
      // getIndexEdit();

      if ($scope.survey.surveys.branches[idx].flow_temperature != 'undefined' && $scope.survey.surveys.branches[idx].deltat != 'undefined') {
        let deltat = parseFloat($scope.survey.surveys.branches[idx].deltat);

        $scope.survey.surveys.branches[idx].return_temperature = parseFloat($scope.survey.surveys.branches[idx].flow_temperature) - deltat;
        $scope.survey.surveys.branches[idx].pipe = {};
        if (!$scope.survey.surveys.branches[idx].pipe.massFlowRate) {
          $scope.massFlowRate = $scope.survey.surveys.branches[idx].pipe.massFlowRate = getMassFlowRate(watts, sHeatCapacity, deltat);
        } else {
          $scope.massFlowRate = $scope.survey.surveys.branches[idx].pipe.massFlowRate;
        }

        if ($scope.survey.surveys.branches[idx].pipe_nom_dia) {
          calculatePipeCalc(idx)
        }
      }
      $scope.survey.surveys.miniVeloSel = $scope.miniVeloSel;
      if (!$scope.survey.surveys.maxVeloSel) {
        $scope.survey.surveys.maxVeloSel = $scope.maxVeloSel
      }
      $scope.survey.surveys.fluid = $scope.fluid;
      $scope.survey.surveys.egContent = $scope.egContent;
      if ($scope.maxFlowTempBranches > 0) {
        var roomFlowTemp = $scope.survey.surveys.branches[idx].flow_temperature
        let denVisco = getDensitynViscosity($scope.fluid, roomFlowTemp);
        $scope.survey.surveys.density = denVisco.density;
        $scope.survey.surveys.dynamViscosity = $scope.dynamViscosity;
        $scope.survey.surveys.maxPressureLoss = $scope.maxPressureLoss;
        $scope.survey.surveys.pipeSpecificHeatCapacity = sHeatCapacity;

        $scope.survey.surveys.pipeType = $scope.pipeType;

        if ($scope.survey.surveys.branches[idx].pipe.meanVelosity >= $scope.miniVeloSel && $scope.survey.surveys.branches[idx].pipe.meanVelosity <= $scope.maxVeloSel) {
          $scope.survey.surveys.branches[idx].pipeVolumeCheck = "Accepted"
        } else if ($scope.survey.surveys.branches[idx].pipe.meanVelosity > $scope.maxVeloSel) {
          $scope.survey.surveys.branches[idx].pipeVolumeCheck = "Increase Dia"
        } else {
          $scope.survey.surveys.branches[idx].pipeVolumeCheck = "Reduce Dia"
        }
      }
    }

    function calculatePipeCalc (idx) {
      $scope.densityViscosity = getDensitynViscosity($scope.fluid, $scope.survey.surveys.branches[idx].flow_temperature);
      $scope.survey.surveys.branches[idx].pipe.meanVelosity = getMeanVelosity(idx);
      $scope.survey.surveys.branches[idx].pipe.volumetricFlowRate = getVolumetricFlowRate(idx);
      $scope.survey.surveys.branches[idx].pipe.reynoldsNumber = getReynoldsNumber(idx);
      $scope.frictionFactor = getFrictionFactor(idx);
      let pressureLoss = $scope.survey.surveys.branches[idx].pipe.pressureLossPA = getPressureLoss(idx);
      let m = pressureLoss / 9804.139432;
      let pressureLossM = $scope.survey.surveys.branches[idx].pipe.pressureLossM = m;
      if ($scope.survey.surveys.branches[idx].flowReturnPipes >= 0) {
        $scope.survey.surveys.branches[idx].selectPipeDia = true;
        if ($scope.survey.surveys.branches[idx].hasRads) {
          $scope.survey.surveys.branches[idx].selectPipeDia = true
        }
        let lengthFlowReturn = $scope.survey.surveys.branches[idx].flowReturnPipes;
        let tot = pressureLossM * lengthFlowReturn;
        $scope.survey.surveys.branches[idx].pipe.totPressureLoss = tot;
        $scope.survey.surveys.branches[idx].pipe.totPressureLossmm = tot * 1000;
        // total perssure loss section
        let calcSec = $scope.survey.surveys.branches[idx].pipe.totPressureLoss
        if ($scope.pressureLossUnit == 'mm H20 / Meter') {
          calcSec = $scope.survey.surveys.branches[idx].pipe.totPressureLossmm
        }
        let totpreLossSec = (calcSec * ($scope.survey.surveys.branches[idx].fittings / 100)) + calcSec
        $scope.survey.surveys.branches[idx].pipe.totalPressureLossSection = totpreLossSec
        // volumetric flow rate
        $scope.pipeInfo = $rootScope.pipe_data.pipes.filter(function (obj) {
          if (obj.name == $scope.pipeType) return obj;
        })
        $scope.diaObj = $scope.pipeInfo[0].dia.filter(function (obj) {
          if (obj.norDia == $scope.survey.surveys.branches[idx].pipe_nom_dia) {
            return obj;
          }
        })
        let pipeIntDia = parseFloat($scope.diaObj[0].intDia) / 1000;
        let powerTwo = (pipeIntDia / 2) * (pipeIntDia / 2)
        let roomVolFlow = $scope.survey.surveys.branches[idx].pipe.volumetricFlowRate * 60 * 60;
        if ($scope.volumeFlowRateUnit == 'Litres / Minute') {
          roomVolFlow = $scope.survey.surveys.branches[idx].pipe.volumetricFlowRate * 60
        }
        if ($scope.volumeFlowRateUnit == 'Litres / Second') {
          roomVolFlow = $scope.survey.surveys.branches[idx].pipe.volumetricFlowRate
        }

        $scope.survey.surveys.branches[idx].pipe.volFlowRateLitHour = roomVolFlow;
        if ($scope.diameter[0] != undefined) {
          $scope.survey.surveys.branches[idx].pipe.waterVolInPipe = ($scope.diameter[0].Litres * lengthFlowReturn);
        }
      } else {
        $scope.survey.surveys.branches[idx].selectPipeDia = true;
        // if ($scope.survey.surveys.branches[idx].hasRads) {
        //   $scope.survey.surveys.branches[idx].selectPipeDia = true;
        // }
      }
      updateCircuits();
    }

    $scope.modalEdit = function (item, idx, property, typ) {
      var split = item.split('.');
      var copiedValue;
      var branches = $scope.survey.surveys.branches;
      if (!!$scope.copy.status && item == $scope.copy.collection) {
        // get copied value
        copiedValue = branches[idx];
        angular.forEach(split, function (i) {
          copiedValue = copiedValue[i];
        });
        // paste it to all branches
        angular.forEach(branches, function (rm, index) {
          $scope.survey.surveys.branches[index][split[0]] = copiedValue;

          $scope.updateBranches($scope.survey.surveys.branches, index, item)
        });
        $scope.copy.status = false;

      } else {
        $scope.copy.status = false;

        modalService.setTemplateUrl('/partials/views/summary/components/_modal');
        modalService.setController('ModalEditController');
        modalService.showModal($scope.survey.surveys.branches, item, idx, property, typ).then(function (result) {
          $scope.updateBranches(result.scope, idx, item)
          $scope.survey.surveys.branches = result.scope;
          summaryHelperService.switchAndUpdateSurvey(null, "current-pipe-calculation", $scope.survey, null, true).then(function (res) {
            // res after update here
          });

        });
      }
    };

    function updateBranchCalculations () {
      angular.forEach($scope.survey.surveys.branches, function (value, idx) {
        if ($scope.survey.surveys.branches[idx].flow_temperature != undefined && $scope.survey.surveys.branches[idx].deltat != undefined) {
          $scope.survey.surveys.branches[idx].return_temperature = $scope.survey.surveys.branches[idx].flow_temperature - $scope.survey.surveys.branches[idx].deltat;
          let wa = $scope.survey.surveys.branches[idx].t_watts ? $scope.survey.surveys.branches[idx].t_watts / 1000 : 0;
          let sFluid = $scope.survey.surveys.fluid ? $scope.survey.surveys.fluid : $scope.fluid;
          $scope.pipeSpecificHeatCapacity = getSpecificHeatCapacity(sFluid)
          if ($scope.survey.surveys.branches[idx].pipe == undefined) {
            $scope.survey.surveys.branches[idx].pipe = {}
          }
          $scope.survey.surveys.branches[idx].pipe.massFlowRate = getMassFlowRate(wa, $scope.pipeSpecificHeatCapacity, $scope.survey.surveys.branches[idx].deltat);

          if ($scope.survey.surveys.branches[idx].pipe_nom_dia) {
            calculatePipeCalc(idx)
          }
        } else {
          $scope.survey.surveys.branches[idx].selectPipeDia = true;
        }
        // $scope.survey.surveys.branches[idx].index_circuit = "No";

        // if ($scope.survey.surveys.branches[idx].pipe) {
        //   if ($scope.survey.surveys.branches[idx].pipe.waterVolInPipe > 0) {
        //     let ltrs = $scope.survey.surveys.branches[idx].pipe.waterVolInPipe
        //     $scope.finalData.totalLitres = parseFloat($scope.finalData.totalLitres + ltrs)
        //   }
        // }

        // $scope.survey.surveys.branches[idx].index_circuit = "No";

      });

    }

    $scope.openSection = function (type) {

      var modalOptions = {};
      modalOptions.templateUrl = '/partials/views/summary/pipesizing/_modal_show_image';
      modalOptions.controller = 'ShowImageModalController';
      modalOptions.size = 'lg';

      var modalInstance = $modal.open({
        animation: true,
        templateUrl: modalOptions.templateUrl,
        controller: modalOptions.controller,
        size: modalOptions.size = 'lg',
        resolve: {
          data: function () {
            return {
              type: type
            }
          }
        }
      });

      modalInstance.result.then(function (note) {
        // do nothing
      }, function () {
        // do nothing
      });
    };

    // initial function
    function init () {
      $scope.user = $rootScope.user
      apiService.get('surveys', {
        _id: $routeParams.id
      }).then(function (survey) {

        // convertImgToBase64URL('http://localhost:3000/images/a-pipe-home.png', function (dataUri) {
        //   console.log("base 64 image", dataUri)
        //   if (!!dataUri) {
        //     img64s = dataUri;
        //     console.log("base 64 image", img64s)
        //   }
        // });

        $scope.survey = survey
        $scope.survey.surveys.page = 'pipe';

        $scope.survey.surveys.branches = survey.surveys.branches || [];
        if ($scope.survey.surveys.branches.length == 0) {
          $scope.survey.surveys.branches.push($scope.branchDefault)
        }
        $scope.survey.surveys.branches[0].canDelete = false;

        // default data
        $scope.egContent = $scope.survey.surveys.egContent ? $scope.survey.surveys.egContent : 0;
        // minimum velocity default to 0.5
        $scope.miniVeloSel = $scope.survey.surveys.miniVeloSel ? $scope.survey.surveys.miniVeloSel : $scope.miniVeloSel
        // max velocity default to 1
        if (!$scope.survey.surveys.maxVeloSel) {
          $scope.survey.surveys.maxVeloSel = $scope.maxVeloSel
        }
        // max pressure loss default to 300
        $scope.maxPressureLoss = $scope.survey.surveys.maxPressureLoss ? $scope.survey.surveys.maxPressureLoss : 300;
        // fluid default to water
        $scope.fluid = $scope.survey.surveys.fluid ? $scope.survey.surveys.fluid : "Water";

        // table 1
        $scope.pressureLossUnit = $scope.survey.surveys.pressureLossUnit ? $scope.survey.surveys.pressureLossUnit : 'mm H20 / Meter';
        $scope.volumeFlowRateUnit = $scope.survey.surveys.volumeFlowRateUnit ? $scope.survey.surveys.volumeFlowRateUnit : 'Litres / Hour';

        // table 2
        $scope.pressureUnitForCircuit = $scope.survey.surveys.pressureUnitForCircuit ? $scope.survey.surveys.pressureUnitForCircuit : 'meters head / meter';
        $scope.pressureUnitForPumpSizing = $scope.survey.surveys.pressureUnitForPumpSizing ? $scope.survey.surveys.pressureUnitForPumpSizing : 'meters head / meter';

        // table 3
        $scope.flowRateUnitForPumpSizing = $scope.survey.surveys.flowRateUnitForPumpSizing ? $scope.survey.surveys.flowRateUnitForPumpSizing : 'Litres / Hour';
        $scope.survey.surveys.flowRateUnitForPumpSizing = $scope.flowRateUnitForPumpSizing;
        if ($scope.fluid == 'Water') {
          $scope.contents = false;
        } else {
          $scope.contents = true;
        }



        // pipe type default to copper
        $scope.pipeType = $scope.survey.surveys.pipeType ? $scope.survey.surveys.pipeType : $scope.pipeCollection[0];

        // include in report or no
        if ($scope.survey.surveys.includedReport.hasOwnProperty('pipeSizing')) {
          $scope.pipeSizingSelect = $scope.survey.surveys.includedReport['pipeSizing']
        }

        // get max flow temp
        getMaxFlowTemp();

        if ($scope.survey.surveys.primaryFlowIndex) {
          $scope.primaryFlowIndex = $scope.survey.surveys.primaryFlowIndex;
          $scope.maxVolFlowRate = calcMaxVolFlowRate();
        }

        updateBranchCalculations();

        angular.forEach($scope.survey.surveys.circuits, function (val, idx) {
          if (val.max) {
            $scope.maxPressLoss = val.totalPressureLoss
          } else {
            let maxIdx = getMaxId();
            $scope.survey.surveys.circuits[maxIdx].max = true;
          }
        });

        $scope.onPressureUnitForCircuitChange($scope.pressureUnitForCircuit);

        $scope.onPressureUnitForCircuitChange($scope.pressureUnitForCircuit, 'pump')

        if ($scope.maxFlowTempBranches > 0) {
          let denVisco = getDensitynViscosity($scope.fluid, $scope.maxFlowTempBranches);
          $scope.density = denVisco.density
          $scope.dynamViscosity = denVisco.viscosity

          let selFluid = $scope.survey.surveys.fluid ? $scope.survey.surveys.fluid : $scope.fluid;
          $scope.pipeSpecificHeatCapacity = getSpecificHeatCapacity(selFluid)
          getIndexEdit()

          $scope.finalData.pipeSystem = "1";

        }

        // create log
        let surLog = {
          "userId": $scope.user._id,
          "surveyId": $scope.survey._id,
          "type": $scope.survey.surveys.page,
          "log": "Survey Updated"
        }
        apiService.save('surveyLogs', surLog).then(function (response) {
          // do nothing;
        }, commonService.onError);

      }, commonService.onError);
    }

    function getMeanVelosity (idx, itemsplit = '') {
      $scope.pipeInfo = $rootScope.pipe_data.pipes.filter(function (obj) {
        if (obj.name == $scope.pipeType) return obj;
      })

      $scope.diameter = $scope.pipeInfo[0].dia.filter(function (obj) {
        let nomDia
        if (itemsplit != '') {
          // nomDia = $scope.survey.surveys.branches[idx].radiators[itemsplit].pipeSelected
        } else {
          nomDia = $scope.survey.surveys.branches[idx].pipe_nom_dia
        }
        if (obj.norDia == nomDia) {
          return obj;
        }
      })

      if ($scope.diameter[0] != undefined) {
        let mfr
        let heatLoss = $scope.survey.surveys.branches[idx].t_watts ? parseFloat($scope.survey.surveys.branches[idx].t_watts) / 1000 : 0;
        if (itemsplit != '') {
          // $scope.survey.surveys.branches[idx].radiators[itemsplit].selectPipeDia = true;
          // mfr = parseFloat($scope.survey.surveys.branches[idx].radiators[itemsplit].massFlowRate) || parseFloat($scope.massFlowRate);
        } else {
          $scope.survey.surveys.branches[idx].selectPipeDia = true
          mfr = heatLoss / (parseFloat($scope.survey.surveys.branches[idx].specificHeatCapacity) * parseFloat($scope.survey.surveys.branches[idx].deltat));
        }
        if ($scope.survey.surveys.branches[idx].hasRads) {
          $scope.survey.surveys.branches[idx].selectPipeDia = true;
        }
        var x = 4 * mfr
        var u = $scope.diameter[0].intDia / 1000;
        var r = u * u;
        var PI = 3.14159;
        let denVisco = $scope.densityViscosity
        var den = denVisco.density;
        var y = PI * den * r;
        let ret = x / y;
        return ret;
      } else {
        if (itemsplit != '') {
          // $scope.survey.surveys.branches[idx].radiators[itemsplit].selectPipeDia = false;
        } else {
          $scope.survey.surveys.branches[idx].selectPipeDia = false;
        }
      }
    }

    function getVolumetricFlowRate (idx, itemsplit = '') {
      let mv
      if (itemsplit != '') {
        // mv = $scope.survey.surveys.branches[idx].radiators[itemsplit].radsMean;
      } else {
        mv = $scope.survey.surveys.branches[idx].pipe.meanVelosity;
      }
      if ($scope.diameter[0] != undefined) {
        var PI = Math.PI;
        var p = $scope.diameter[0].intDia / 1000;
        var u = p / 2;
        var pipeselected = u * u;
        var volumetricflow = PI * pipeselected * mv;
        var rate = volumetricflow * 1000;
        return rate;
      }
    }


    function getReynoldsNumber (idx, itemsplit = '') {
      if ($scope.diameter[0] != undefined) {
        let mv
        if (itemsplit != '') {
          // mv = $scope.survey.surveys.branches[idx].radiators[itemsplit].radsMean;
        } else {
          mv = $scope.survey.surveys.branches[idx].pipe.meanVelosity;
        }
        var p = $scope.diameter[0].intDia / 1000;
        let denVisco = $scope.densityViscosity
        var den = denVisco.density;
        var r = den * mv * p;
        var vis = denVisco.viscosity;
        var e = vis / 1000000;
        var re = r / e;
        return re;
      }
    }

    function getFrictionFactor (idx, itemsplit = '') {
      if ($scope.diameter[0] != undefined) {
        let rnum
        if (itemsplit != '') {
          // rnum = $scope.survey.surveys.branches[idx].radiators[itemsplit].radsreynoldsNumber
        } else {
          rnum = $scope.survey.surveys.branches[idx].pipe.reynoldsNumber
        }
        if (rnum < 2000) {
          var y = 64 / rnum
          return y;
        } else {
          var x = -1.8;
          var a = 6.9 / rnum;
          var n6 = $scope.pipeInfo[0].roughness;
          var r6 = $scope.diameter[0].intDia / 1000;
          var o = r6 * 1000;
          var p = n6 / o;
          var b = p / 3.71;
          var c = b ** 1.11;
          var d = a + c;
          var y = Math.log10(d);
          var z = x * y;
          var f = 1 / z;
          var rate = f ** 2;
          return rate;
        }
      }
    }

    function getPressureLoss (idx, itemsplit = '') {
      if ($scope.diameter[0] != undefined) {
        let t6, y6
        if (itemsplit != '') {
          // y6 = $scope.radsFrictionFactor * 1;
          // t6 = $scope.survey.surveys.branches[idx].radiators[itemsplit].radsMean;
        } else {
          y6 = $scope.frictionFactor * 1;
          t6 = $scope.survey.surveys.branches[idx].pipe.meanVelosity;
        }

        var r6 = $scope.diameter[0].intDia / 1000;
        var a = y6 / r6;
        var x = 0.5;
        let denVisco = $scope.densityViscosity
        var k6 = denVisco.density;
        var y = t6 ** 2;
        var b = x * k6 * y;
        var c = a * b;
        return c;
      }
    }

    // index
    function indexgetMeanVelosity (tee = false, idx = 0) {
      $scope.pipeInfo = $rootScope.pipe_data.pipes.filter(function (obj) {
        if (obj.name == $scope.pipeType) return obj;
      })

      let massFlowRateComputed = $scope.primaryFlowIndex.roomHeatLoss / ($scope.primaryFlowIndex.speHeatCapacity * $scope.primaryFlowIndex.delta)
      $scope.diameter = $scope.pipeInfo[0].dia.filter(function (obj) {
        let nomDia = $scope.survey.surveys.primaryFlowIndex.pipeSelect
        if (obj.norDia == nomDia) {
          return obj;
        }
      })
      if ($scope.diameter[0] != undefined) {
        var x = 4 * massFlowRateComputed
        var u = parseFloat($scope.diameter[0].intDia) / 1000;
        var r = u * u;
        var PI = 3.14159;
        let denVisco = $scope.densityViscosity
        var den = denVisco.density;
        var y = PI * den * r;
        let ret = x / y;
        return ret;
      }
    }

    function indexgetVolumetricFlowRate (tee = false) {
      var mv
      if (tee == false) {
        mv = $scope.indexMeanVelo
      }
      else {
        mv = $scope.teesMeanVelosity
      }
      if ($scope.diameter[0] != undefined) {
        var PI = 3.14159;
        var p = $scope.diameter[0].intDia / 1000;
        var u = p / 2;
        var pipeselected = u * u;
        var volumetricflow = PI * pipeselected * mv;
        var rate = volumetricflow * 1000;
        return rate;
      }
    }

    function indexgetReynoldsNumber (tee = false) {
      var mv
      if (tee == false) {
        mv = $scope.indexMeanVelo
      } else {
        mv = $scope.teesMeanVelosity
      }
      if ($scope.diameter[0] != undefined) {
        var p = $scope.diameter[0].intDia / 1000;

        let denVisco = $scope.densityViscosity
        var den = denVisco.density;
        var r = den * mv * p;
        var vis = denVisco.viscosity;
        var e = vis / 1000000;
        var re = r / e;
        return re;
      }
    }

    function indexgetFrictionFactor (tee = false, idx = 0) {
      if ($scope.diameter[0] != undefined) {
        let rnum
        if (tee == false) {
          rnum = $scope.survey.surveys.primaryFlowIndex.reynoldsNum
        } else {
          rnum = $scope.survey.surveys.tees[idx].reynoldsNum
        }
        if (rnum < 2000) {
          var y = 64 / rnum
          return y;
        } else {
          var x = -1.8;
          var a = 6.9 / rnum;
          var n6 = $scope.pipeInfo[0].roughness;
          var r6 = $scope.diameter[0].intDia / 1000;
          var o = r6 * 1000;
          var p = n6 / o;
          var b = p / 3.71;
          var c = b ** 1.11;
          var d = a + c;
          var y = Math.log10(d);
          var z = x * y;
          var f = 1 / z;
          var rate = f ** 2;
          return rate;
        }
      }
    }

    function indexgetPressureLoss (tee = false) {
      if ($scope.diameter[0] != undefined) {
        let t6, y6
        if (tee == false) {
          y6 = $scope.indexfrictionFactor * 1;
          t6 = $scope.indexMeanVelo;
        } else {
          y6 = $scope.teesfrictionFactor * 1;
          t6 = $scope.teesMeanVelosity
        }
        var r6 = $scope.diameter[0].intDia / 1000;
        var a = y6 / r6;
        var x = 0.5;
        let denVisco = $scope.densityViscosity
        var k6 = denVisco.density;
        var y = t6 ** 2;
        var b = x * k6 * y;
        var c = a * b;
        return c;
      }
    }

    $scope.savePDF = function () {
      // left,top,right,bottom - margin
      var titleMargin = [0, 20, 0, 10];
      var tableMargin = [0, 0, 0, 10];
      var iniTblcontentMargin = [0, 4, 0, 4];
      var priContMargin = [0, 5, 0, 0];
      let whiteLabeled = false;

      if ($rootScope.user.selectedPlan.plan == 'manufacturerYearly' || $rootScope.user.selectedPlan.plan.includes('WhiteLabeled')) {
        whiteLabeled = true;
      }

      alertService('success', '', ' The download is in progress please wait...');
      // var maxValue = Math.max(...$scope.survey.surveys.indexTableDataTotal)
      // var maxIndex
      // var indexTableDataTotalColumn = $scope.survey.surveys.indexTableDataTotal.map((data, idx) => {
      //   var newData = parseInt(data).toFixed(2)

      //   if (data == maxValue) {
      //     maxIndex = idx
      //   }
      //   return (
      //     {
      //       text: "Total - " + data.toFixed(2), color: data == maxValue ? '#2361AE' : '#000000',
      //       fontSize: 8,
      //       width: 70,
      //       alignment: 'right',

      //     }
      //   )
      // })

      // var indexTableDataArr = Object.entries($scope.survey.surveys.indexTableData)


      // var indexTableDataArrColumn = indexTableDataArr.map(function (data, idx) {

      //   var r1 = data[1].map(function (data1) {

      //     return ({ text: data1.runId + ' - ' + data1.totPressure.toFixed(2), fontSize: 8, alignment: 'right', })
      //   }

      //   )
      //   return r1

      // })

      // var maxLength = Math.max.apply(Math, $.map(indexTableDataArrColumn, function (el) { return el.length }))

      // var finalTableData = indexTableDataArrColumn.map((data, idx) => {
      //   return ({
      //     width: 70,

      //     stack: [
      //       {
      //         color: idx == maxIndex ? '#2361AE' : '#000000',

      //         type: 'none',
      //         ul: data
      //       }
      //     ]
      //   })
      // })

      var contentFontsize = 8
      var unitContentFontsize = 7

      var initData = [
        [
          { text: "Maximum Velocity Selected", alignment: 'right', margin: iniTblcontentMargin, fontSize: contentFontsize },
          { text: dataToString($scope.survey.surveys.maxVeloSel), margin: iniTblcontentMargin, fontSize: contentFontsize }
        ],
        [
          { text: "Initial Miniimum Velocity Selected", alignment: 'right', margin: iniTblcontentMargin, fontSize: contentFontsize },
          { text: dataToString($scope.survey.surveys.miniVeloSel), margin: iniTblcontentMargin, fontSize: contentFontsize }
        ],
        [
          { text: "Maximum Pressure Loss", alignment: 'right', margin: iniTblcontentMargin, fontSize: contentFontsize },
          { text: dataToString($scope.survey.surveys.maxPressureLoss), margin: iniTblcontentMargin, fontSize: contentFontsize }
        ],
        [
          { text: "Fluid Selected", alignment: 'right', margin: iniTblcontentMargin, fontSize: contentFontsize },
          { text: dataToString($scope.survey.surveys.fluid), margin: iniTblcontentMargin, fontSize: contentFontsize }
        ],
        [
          { text: "Pipe Type", alignment: 'right', margin: iniTblcontentMargin, fontSize: contentFontsize },
          { text: dataToString($scope.survey.surveys.pipeType), margin: iniTblcontentMargin, fontSize: contentFontsize }
        ],
        [
          { text: "Pressure Loss Unit", alignment: 'right', margin: iniTblcontentMargin, fontSize: contentFontsize },
          { text: dataToString($scope.survey.surveys.pressureLossUnit), margin: iniTblcontentMargin, fontSize: contentFontsize }
        ],
        [
          { text: "volumetric Flow Rate", alignment: 'right', margin: iniTblcontentMargin, fontSize: contentFontsize },
          { text: dataToString($scope.survey.surveys.volumeFlowRateUnit), margin: iniTblcontentMargin, fontSize: contentFontsize }
        ],
        [
          { text: 'Maximum Flow Temperature', alignment: 'right', margin: iniTblcontentMargin, fontSize: contentFontsize },
          { text: $scope.survey.surveys.maxFlowTempBranches ? dataToString($scope.survey.surveys.maxFlowTempBranches) + '°C' : '-', margin: iniTblcontentMargin, fontSize: contentFontsize }
        ]
      ]

      var branchData = [];
      var branches = $scope.survey.surveys.branches
      var branchesHead1 = [
        { text: "Section ID", rowSpan: 2, fontSize: contentFontsize, alignment: 'center' },
        { text: 'Demand', alignment: 'center', fontSize: contentFontsize },
        { text: 'Flow Temperature', alignment: 'center', fontSize: contentFontsize },
        // { text: 'Return Temperature', alignment: 'center', fontSize: contentFontsize },
        { text: 'Delta T', alignment: 'center', fontSize: contentFontsize },
        { text: 'Mass Flow Rate', alignment: 'center', fontSize: contentFontsize },
        { text: 'Pipe Selected', alignment: 'center', fontSize: contentFontsize },
        { text: 'Mean Velocity', alignment: 'center', fontSize: contentFontsize },
        // { text: 'Velocity Check', rowSpan: 2, alignment: 'center', fontSize: contentFontsize },
        { text: 'Pressure Loss', alignment: 'center', fontSize: contentFontsize },
        { text: 'Pressure Loss', alignment: 'center', fontSize: contentFontsize },
        { text: 'Pipe Run Flow & Return', alignment: 'center', fontSize: contentFontsize },
        { text: 'Total Pressure Loss', alignment: 'center', fontSize: contentFontsize },
        { text: 'Fittings', alignment: 'center', fontSize: contentFontsize },
        { text: 'Total Pressure Loss', alignment: 'center', fontSize: contentFontsize },
        { text: 'Volume Flow Rate', alignment: 'center', fontSize: contentFontsize }
      ];

      var branchesHead2 = [
        '',
        { text: 'kW', alignment: 'center', fontSize: unitContentFontsize },
        { text: '°C', alignment: 'center', fontSize: unitContentFontsize },
        // { text: '°C', alignment: 'center', fontSize: contentFontsize },
        { text: '°C', alignment: 'center', fontSize: unitContentFontsize },
        { text: 'kg/s', alignment: 'center', fontSize: unitContentFontsize },
        { text: '(Diameter)mm', alignment: 'center', fontSize: unitContentFontsize },
        { text: 'm/s', alignment: 'center', fontSize: unitContentFontsize },
        // '',
        { text: 'Pa/m', alignment: 'center', fontSize: unitContentFontsize },
        { text: 'm(hd)/m', alignment: 'center', fontSize: unitContentFontsize },
        { text: 'm', alignment: 'center', fontSize: unitContentFontsize },
        { text: 'meters head', alignment: 'center', fontSize: unitContentFontsize },
        { text: '%', alignment: 'center', fontSize: unitContentFontsize },
        { text: dataToString($scope.survey.surveys.pressureLossUnit), alignment: 'center', fontSize: unitContentFontsize },
        { text: dataToString($scope.survey.surveys.volumeFlowRateUnit), alignment: 'center', fontSize: unitContentFontsize },
      ]

      // pressure loss calc for primary
      let priCalcSec = $scope.survey.surveys.primaryFlowIndex.totPreLoss
      if ($scope.pressureLossUnit == 'mm H20 / Meter') {
        priCalcSec = $scope.survey.surveys.primaryFlowIndex.totPreLossmm
      }
      let priFittings = $scope.survey.surveys.primaryFlowIndex.fittings ? parseFloat($scope.survey.surveys.primaryFlowIndex.fittings) : 50;
      let priTotpreLossSec = (priCalcSec * (priFittings / 100)) + priCalcSec
      $scope.survey.surveys.primaryFlowIndex.totPreLossSection = priTotpreLossSec

      var primaryData = [{
        text: 'Primary Flow and Return from heat source', alignment: 'center', margin: [0, 5, 0, 5], fontSize: contentFontsize
      },
      {
        text: $scope.survey.surveys.primaryFlowIndex.roomHeatLoss ? dataToString(parseFloat($scope.survey.surveys.primaryFlowIndex.roomHeatLoss).toFixed(2)) : '0',
        margin: priContMargin, alignment: 'center', fontSize: contentFontsize
      },
      {
        text: $scope.survey.surveys.primaryFlowIndex.maxFlowTemp ? dataToString($scope.survey.surveys.primaryFlowIndex.maxFlowTemp) : '0',
        margin: priContMargin, alignment: 'center', fontSize: contentFontsize
      },
      {
        text: $scope.survey.surveys.primaryFlowIndex.delta ? dataToString($scope.survey.surveys.primaryFlowIndex.delta) : '0',
        margin: priContMargin, alignment: 'center', fontSize: contentFontsize
      },
      {
        text: $scope.survey.surveys.primaryFlowIndex.massFlowRat ? dataToString(parseFloat($scope.survey.surveys.primaryFlowIndex.massFlowRat).toFixed(2)) : '0',
        margin: priContMargin, alignment: 'center', fontSize: contentFontsize
      },
      {
        text: $scope.survey.surveys.primaryFlowIndex.pipeSelect ? dataToString($scope.survey.surveys.primaryFlowIndex.pipeSelect) : '0',
        margin: priContMargin, alignment: 'center', fontSize: contentFontsize
      },
      {
        text: $scope.survey.surveys.primaryFlowIndex.meanVelo ? dataToString(parseFloat($scope.survey.surveys.primaryFlowIndex.meanVelo).toFixed(2)) : '0',
        margin: priContMargin, alignment: 'center', fontSize: contentFontsize
      },
      // {
      //   text: $scope.survey.surveys.primaryFlowIndex.veloCheck ? dataToString($scope.survey.surveys.primaryFlowIndex.veloCheck) : '0',
      //   margin: priContMargin, alignment: 'center', fontSize: contentFontsize
      // },
      {
        text: $scope.survey.surveys.primaryFlowIndex.pressureL ? dataToString(parseFloat($scope.survey.surveys.primaryFlowIndex.pressureL).toFixed(2)) : '0',
        margin: priContMargin, alignment: 'center', fontSize: contentFontsize
      },
      {
        text: $scope.survey.surveys.primaryFlowIndex.pLoss ? dataToString(parseFloat($scope.survey.surveys.primaryFlowIndex.pLoss).toFixed(2)) : '0',
        margin: priContMargin, alignment: 'center', fontSize: contentFontsize
      },
      {
        text: $scope.survey.surveys.primaryFlowIndex.lengthFlow ? dataToString($scope.survey.surveys.primaryFlowIndex.lengthFlow) : '0',
        margin: priContMargin, alignment: 'center', fontSize: contentFontsize
      },
      {
        text: $scope.survey.surveys.primaryFlowIndex.totPreLoss ? dataToString(parseFloat($scope.survey.surveys.primaryFlowIndex.totPreLoss).toFixed(2)) : '0',
        margin: priContMargin, alignment: 'center', fontSize: contentFontsize
      },
      {
        text: $scope.survey.surveys.primaryFlowIndex.fittings ? dataToString($scope.survey.surveys.primaryFlowIndex.fittings) : '0',
        margin: priContMargin, alignment: 'center', fontSize: contentFontsize
      },
      {
        text: $scope.survey.surveys.primaryFlowIndex.totPreLossSection ? dataToString(parseFloat($scope.survey.surveys.primaryFlowIndex.totPreLossSection).toFixed(2)) : '0',
        margin: priContMargin, alignment: 'center', fontSize: contentFontsize
      },
      {
        text: $scope.survey.surveys.primaryFlowIndex.volFlowRateLitHour ? dataToString(parseFloat($scope.survey.surveys.primaryFlowIndex.volFlowRateLitHour).toFixed(2)) : '0',
        margin: priContMargin, alignment: 'center', fontSize: contentFontsize
      }
      ];

      branchData.push(branchesHead1)
      branchData.push(branchesHead2)
      branchData.push(primaryData)

      //for branches
      for (let i = 0; i < branches.length; i++) {
        // pressure loss conversion
        let calcSec = branches[i].pipe.totPressureLoss
        if ($scope.pressureLossUnit == 'mm H20 / Meter') {
          calcSec = branches[i].pipe.totPressureLossmm
        }
        // volumetric flow conversion
        let volFlow = branches[i].pipe.volumetricFlowRate * 60 * 60;
        if ($scope.survey.surveys.volumeFlowRateUnit == 'Litres / Minute') {
          volFlow = branches[i].pipe.volumetricFlowRate * 60
        }
        if ($scope.survey.surveys.volumeFlowRateUnit == 'Litres / Second') {
          volFlow = branches[i].pipe.volumetricFlowRate
        }

        let totpreLossSec = (calcSec * (branches[i].fittings / 100)) + calcSec;
        var branchObject = [
          { text: dataToString(branches[i].sectionId), fillColor: '#dedede', alignment: 'center', fontSize: contentFontsize },
          { text: dataToString((branches[i]?.t_watts / 1000).toFixed(2)), fillColor: '#dedede', alignment: 'center', fontSize: contentFontsize },
          { text: dataToString(branches[i].flow_temperature, '-'), fillColor: '#dedede', alignment: 'center', fontSize: contentFontsize },
          // { text: dataToString(branches[i].return_temperature, '-'), fillColor: '#dedede', alignment: 'center', fontSize: contentFontsize },
          { text: dataToString(branches[i].deltat, '-'), fillColor: '#dedede', alignment: 'center', fontSize: contentFontsize },
          { text: branches[i].pipe ? dataToString(parseFloat(branches[i].pipe.massFlowRate).toFixed(2)) : '-', fillColor: '#dedede', alignment: 'center', fontSize: contentFontsize },
          { text: dataToString(branches[i].pipe_nom_dia, '-'), fillColor: '#dedede', alignment: 'center', fontSize: contentFontsize },
          { text: branches[i].pipe ? dataToString(parseFloat(branches[i].pipe.meanVelosity).toFixed(2)) : '-', fillColor: '#dedede', alignment: 'center', fontSize: contentFontsize },
          // { text: dataToString(branches[i].pipeVolumeCheck, '-'), fillColor: '#dedede', alignment: 'center', fontSize: contentFontsize },
          { text: branches[i].pipe ? dataToString(parseFloat(branches[i].pipe.pressureLossPA).toFixed(2)) : '-', fillColor: '#dedede', alignment: 'center', fontSize: contentFontsize },
          { text: branches[i].pipe ? dataToString(parseFloat(branches[i].pipe.pressureLossM).toFixed(2)) : '-', fillColor: '#dedede', alignment: 'center', fontSize: contentFontsize },
          { text: dataToString(branches[i].flowReturnPipes, '-'), fillColor: '#dedede', alignment: 'center', fontSize: contentFontsize },
          { text: branches[i].pipe ? dataToString(parseFloat(branches[i].pipe.totPressureLoss).toFixed(2)) : '-', fillColor: '#dedede', alignment: 'center', fontSize: contentFontsize },
          { text: dataToString(branches[i].fittings, '-'), fillColor: '#dedede', alignment: 'center', fontSize: contentFontsize },
          { text: branches[i].pipe ? dataToString(parseFloat(totpreLossSec).toFixed(2)) : '-', fillColor: '#dedede', alignment: 'center', fontSize: contentFontsize },
          { text: branches[i].pipe ? dataToString(parseFloat(volFlow).toFixed(2)) : '-', fillColor: '#dedede', alignment: 'center', fontSize: contentFontsize }

        ]

        branchData.push(branchObject)

      }

      //for circuits
      var circuitData = [];
      var circuits = $scope.survey.surveys.circuits
      var circuitHead1 = [
        { text: "Circuit ID", rowSpan: 2, alignment: 'center', fontSize: contentFontsize },
        { text: "Sections Selected", rowSpan: 2, alignment: 'center', fontSize: contentFontsize },
        { text: "Total Pressure Loss ", alignment: 'center', fontSize: contentFontsize },
      ];
      var circuitHead2 = [
        '',
        '',
        { text: dataToString($scope.survey.surveys.pressureUnitForCircuit), alignment: 'center', fontSize: contentFontsize },
      ];
      circuitData.push(circuitHead1);
      circuitData.push(circuitHead2);



      for (let i = 0; i < circuits.length; i++) {
        let filColor = '#ffffff';
        if (circuits[i].max) {
          filColor = '#92D050';
        }
        var circuitObject = [
          { text: dataToString(i + 1), fillColor: filColor, alignment: 'center', fontSize: contentFontsize },
          { text: dataToString(circuits[i].pathString), fillColor: filColor, alignment: 'center', fontSize: contentFontsize },
          { text: dataToString(parseFloat(circuits[i].totalPressureLoss, '-').toFixed(3)), fillColor: filColor, alignment: 'center', fontSize: contentFontsize },
        ]
        circuitData.push(circuitObject)
      }


      //pump
      var pumpData = [];
      var pumpHead1 = [
        { text: "Maximum Volume Flow Rate", alignment: 'center', fontSize: contentFontsize },
        { text: "Total Pressure Loss", alignment: 'center', fontSize: contentFontsize }
      ]
      var pumpHead2 = [
        { text: dataToString($scope.flowRateUnitForPumpSizing), alignment: 'center', fontSize: contentFontsize },
        { text: dataToString($scope.survey.surveys.pressureUnitForPumpSizing), alignment: 'center', fontSize: contentFontsize }
      ]
      let maxFlow = calcMaxVolFlowRate();
      var pumpContent = [
        { text: dataToString(parseFloat(maxFlow).toFixed(3)), alignment: 'center', fontSize: contentFontsize },
        { text: dataToString(parseFloat($scope.maxPressLoss).toFixed(3)), alignment: 'center', fontSize: contentFontsize }
      ]

      pumpData.push(pumpHead1);
      pumpData.push(pumpHead2);
      pumpData.push(pumpContent);

      // Create document template
      var doc = {
        pageSize: "A4",
        pageOrientation: "landscape",
        pageMargins: [30, 30, 30, 30],
        content: []
      };

      let header = [];
      let headText1;
      let headText2
      if (whiteLabeled) {
        headText1 = {
          width: '*',
          stack: [{ text: $rootScope.user.company_name, fontSize: 20 }
          ]
        }
        headText2 = { width: '*', text: '' }
      } else {
        headText1 = {
          width: '*',
          stack: [
            { image: $scope.logos.he, width: 150 },
            { text: 'Heat Engineer Software Ltd', style: 'smallGray' }
          ]
        }
        headText2 = { width: '*', text: '' }
      }

      header.push(headText1)
      header.push(headText2)

      doc.content.push({
        columns: header,
      });

      doc.content.push({
        text: "PIPE AND PUMP SIZING",
        bold: true,
        alignment: 'center',
        fontSize: 18,
        margin: [0, 30, 0, 5]
      });
      doc.content.push({
        text: 'Project: ' + $scope.survey.surveys.project_name,
        alignment: 'center',
        fontSize: 15,
        margin: [0, 5, 0, 10]
      })

      doc.content.push({
        text: "SETUP PARAMETERS",
        bold: true,
        fontSize: 12,
        margin: [0, 10, 0, 5]
      });
      // doc.content.push({
      //   columns: header,
      // });
      doc.content.push({
        columns: [{
          style: 'table',
          table: {
            widths: [200, 200],
            alignment: 'center',
            body: initData,
          },
          margin: [0, 10, 0, 10]
        },
        {
          style: 'table',
          table: {
            widths: [270],
            alignment: 'center',
            body: [[{
              image: $scope.logos.pipe,
              width: 230,
              alignment: 'center',
              margin: [0, 0, 0, 0]
            }
            ]],
          },
          margin: [40,10,10,10]
        }]
      });

      doc.content.push({
        text: "PRIMARY AND SECTIONS",
        bold: true,
        fontSize: 12,
        margin: titleMargin
      });

      doc.content.push({
        style: 'table',
        table: {
          widths: ['*', 40, 50, 30, '*', '*', '*', '*', '*', '*', '*', '*', '*', '*'],
          body: branchData
        },
        // width:[500],
        margin: tableMargin
      });

      doc.content.push({
        // pageBreak: 'before',
        text: "CIRCUITS",
        bold: true,
        fontSize: 12,
        margin: [0, 10, 0, 0]
      });
      doc.content.push({
        text: "The software will highlight which circuit has the largest pressure loss and therefore this is your index circuit.",
        bold: true,
        fontSize: contentFontsize,
        margin: [0, 5, 0, 5]
      });
      doc.content.push({
        style: 'table',
        table: {
          widths: [50, 100, 100],
          body: circuitData
        },
        margin: tableMargin
      });

      // pump sizing
      doc.content.push({
        text: "PUMP SIZING",
        bold: true,
        fontSize: 12,
        margin: [0, 10, 0, 0]
      });
      doc.content.push({
        text: "You should select a pump and speed setting which can achieve the following:",
        bold: true,
        fontSize: contentFontsize,
        margin: [0, 5, 0, 5]
      });
      doc.content.push({
        style: 'table',
        table: {
          widths: [150, 100],
          body: pumpData
        },
        width: [500],
        margin: tableMargin
      });

      // Notes
      doc.content.push({
        text: "WHAT'S YOUR NEXT STEP AS THE HEATING DESIGNER?",
        bold: true,
        fontSize: 12,
        margin: [0, 10, 0, 0]
      });
      doc.content.push(
        {
          text: "1. Knowing the index circuit you can then identify which has the maximum mass flow rate (kg/s) to use.",
          fontSize: contentFontsize,
          margin: [0, 5, 0, 0]
        },
        {
          text: "2. Then highlighting which rooms are part of the index circuit so you can add the Pressure loss per head for those rooms only.",
          fontSize: contentFontsize,
          margin: [0, 5, 0, 0]
        },
        {
          text: "3. As written within the CIBSE domestic heating design guide you can add 50% to the total pressure loss for fittings.",
          fontSize: contentFontsize,
          margin: [0, 5, 0, 0]
        },
        {
          text: "4. Concluding your total mass flow rate (kg/s) and the total pressure loss (meters head), you have the information to select a suitable circulation pump for the heating system.",
          fontSize: contentFontsize,
          margin: [0, 5, 0, 0]
        },

        {
          text: "Note 1",
          color: 'red',
          fontSize: contentFontsize,
          margin: [0, 5, 0, 0]
        },
        {
          text: "When sizing pipes for heating systems the water velocity should not exceed 1.0 m/s. (Except for large diameters - see CIBSE guide tables B1.17 & B1.18). Within CIBSE Water distribution systems code W:1993. it states for pipe ranges up to 50mm and below use 0.75 - 1.5 m/s, above 50mm pipe use 1.25 to 3 m/s. Within CIPHE 'Plumbing Engineering Services Design Guide' it notes that pipe velocities, ultimately are limited by either of the following; Noise, Erosion/corrosion and Cavitation. Noise is a major consideration, and velocities above 1.5 m/s in pipework passing through occupied areas should be avoided.",
          fontSize: contentFontsize,
          margin: [0, 5, 0, 0]
        },
        {
          text: "Note 2",
          color: 'red',
          fontSize: contentFontsize,
          margin: [0, 5, 0, 0]
        },
        {
          text: "To reduce air and dirt settlement CIBSE Guide B1 states within Section 1.A1.3.1: For heat network distribution flow (hot supply) pipes within buildings, a minimum peak velocity of 0.5 m/s should be achieved in all cases, see CIBSE Code of Practice CP1.",
          fontSize: contentFontsize,
          margin: [0, 5, 0, 0]
        },
        {
          text: "Note 3",
          color: 'red',
          fontSize: contentFontsize,
          margin: [0, 5, 0, 0]
        },
        {
          text: "According to CIBSE Guide C 2007, the pressure drop should not exceed 300 Pascals per metre run of pipework (or 0.03m head loss per metre) to keep circulating pumps down to a reasonable size. However in Scandinavian countries, maximum pressure drop of 100 Pa/m is sometimes used, accepting much lower velocities. Within Heat Engineer Software Ltd we have taken the rule that its more important to ensure an air and dirt settlement free system over pumping costs. Therefore smaller pipe work has been optimised to ensure the specified minimum velocity is met but the maximum pressure loss Pa/m may go over the specified maximum limit.",
          fontSize: contentFontsize,
          margin: [0, 5, 0, 0]
        },
        {
          text: "Note 4",
          color: 'red',
          fontSize: contentFontsize,
          margin: [0, 5, 0, 0]
        },
        {
          text: "The specific heat capacity used for the whole system is dictated by the highest flow temperature.",
          fontSize: contentFontsize,
          margin: [0, 5, 0, 0]
        },
        {
          text: "Note 5",
          color: 'red',
          fontSize: contentFontsize,
          margin: [0, 5, 0, 0]
        },
        {
          text: "This mass flow rate has been calculated by adding the total mass flow rates together for the whole heating circuit.",
          fontSize: contentFontsize,
          margin: [0, 5, 0, 0]
        },

      );


      pdfMake.createPdf(doc).download("pipe-calculation-report.pdf");
    }
  }

  function dataToString (data, notValue, extValue) {
    var not = notValue || '0';
    var ext = extValue || '';
    var data = data || '';
    return data ? data.toString() + ext : not;
  }

})();
