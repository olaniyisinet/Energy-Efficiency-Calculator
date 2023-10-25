(function () {
  'use strict';
  /**
  * Current pipe Controller
  */

  angular.module('cloudheatengineer').controller('CurrentPipeController', CurrentPipeController);

  CurrentPipeController.$inject = ['$location', '$scope', '$modal', '$routeParams', 'apiService', 'commonService', 'summaryHelperService', 'modalService', '_', '$rootScope', 'dataService', 'alertService', 'dijkstra'];

  function CurrentPipeController ($location, $scope, $modal, $routeParams, apiService, commonService, summaryHelperService, modalService, _, $rootScope, dataService, alertService, dijkstra) {

    dataService.pipeDataSetup();
    $scope.zoom = 100
    $scope.ZoomRender = $scope.zoom + '%'
    $scope.valueChanged = false;

    $scope.zooming = function (type) {
      if (type == 'add') {
        if ($scope.zoom < 175) {
          $scope.zoom = $scope.zoom + 25
        }
      } else {
        if ($scope.zoom > 25) {
          $scope.zoom = $scope.zoom - 25
        }
      }
      $scope.ZoomRender = $scope.zoom + '%'
    }
    $scope.copy = {
      status: false,
      collection: null
    };

    $scope.pipeRadsRadiodisabled = true;
    $scope.massFlowRate = '';
    $scope.pipeInfo = '';
    $scope.diameter = '';
    $scope.primaryFlowIndex = '';
    $scope.finalData = {};
    $scope.finalData.allowSubTotalPercent = 50
    $scope.miniVeloSel = 0.5;
    $scope.maxVeloSel = 1.0;
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

    $rootScope.showHeader = false;
    $rootScope.showFooter = false;
    $rootScope.heatmanagerview = true;

    //pipe network run
    $scope.canDeriveTable2 = false;
    $scope.visibleTree = false;
    $scope.visibleTreeContent = "Show Tree";
    $scope.alphaList = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R']
    $scope.numberList = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20']
    $scope.computePipeNetworkRun = false

    $scope.specificHeatCapacity = 4.190;
    $scope.pressureCollection = [100, 200, 300, 400]
    $scope.fluidCollection = ["Water", "Water & Glycol"]
    $scope.egCollection = [0, 10, 20, 30, 40, 50, 60]
    $scope.pipeCollection = ["COPPER (X)", "MEDIUM GRADE STEEL", "MLCP", "HEAVY GRADE STEEL"]
    $scope.maxFlowTemp = 0;
    var radiators = $rootScope.cloud_data.radiators;
    $scope.oldRooms = '';
    $scope.priFlowText = 'Heat Source';

    init();

    $scope.changeShowIndexTable = function () {
      $scope.showIndexTable = !$scope.showIndexTable
    }
    $scope.suppressRoom = function (index) {
      if ($scope.survey.surveys.rooms[index].pipeRoomIgnore) {
        $scope.survey.surveys.rooms[index].pipeRoomIgnore = false
      } else {
        $scope.survey.surveys.rooms[index].pipeRoomIgnore = true
        $scope.survey.surveys.rooms[index].realIndex = index
      }

      apiService.update('surveys', $scope.survey).then(function (response) {
        init()
      }, commonService.onError)
    }
    function dataToString (data, notValue, extValue) {
      var not = notValue || '0';
      var ext = extValue || '';
      var data = data || '';
      return data ? data.toString() + ext : not;
    }
    function disableRoom (room, data) {
      if (!!room.split_disable) {
        return {
          text: ' ',
          fillColor: 'gray'
        };
      } else {
        return data
      }
    }

    $scope.savePDF = function () {
      alertService('success', '', ' The download is in progress please wait...');
      var maxValue = Math.max(...$scope.survey.surveys.indexTableDataTotal)
      var maxIndex
      var indexTableDataTotalColumn = $scope.survey.surveys.indexTableDataTotal.map((data, idx) => {
        var newData = parseInt(data).toFixed(3)

        if (data == maxValue) {
          maxIndex = idx
        }
        return (
          {
            text: "Total - " + data.toFixed(3), color: data == maxValue ? '#2361AE' : '#000000',
            fontSize: 8,
            width: 70,
            alignment: 'right',

          }
        )
      })

      var indexTableDataArr = Object.entries($scope.survey.surveys.indexTableData)


      var indexTableDataArrColumn = indexTableDataArr.map(function (data, idx) {

        var r1 = data[1].map(function (data1) {

          return ({ text: data1.runId + ' - ' + data1.totPressure.toFixed(3), fontSize: 8, alignment: 'right', })
        }

        )
        return r1

      })

      var maxLength = Math.max.apply(Math, $.map(indexTableDataArrColumn, function (el) { return el.length }))

      var finalTableData = indexTableDataArrColumn.map((data, idx) => {
        return ({
          width: 70,

          stack: [
            {
              color: idx == maxIndex ? '#2361AE' : '#000000',

              type: 'none',
              ul: data
            }
          ]
        })
      })

      var contentFontsize = 8
      var radslist = []
      var maxFlowTemp = [
        [{
          text: 'Maximum Flow Temperature',
          fontSize: contentFontsize
        },
        {
          text: $scope.survey.surveys.primaryFlowIndex.maxFlowTemp ? $scope.survey.surveys.primaryFlowIndex.maxFlowTemp + '°C' : '-', fontSize: contentFontsize

        }
        ]
      ]
      var returnValue = [[{
        text: 'Primary Flow and Return from heat source to ID A1 or Tee',
        margin: [0, 8, 0, 0], fontSize: contentFontsize
      },
      {
        text: $scope.survey.surveys.primaryFlowIndex.roomHeatLoss ? dataToString($scope.survey.surveys.primaryFlowIndex.roomHeatLoss) : '0',
        margin: [0, 8, 0, 0], fontSize: contentFontsize
      },
      {
        text: $scope.survey.surveys.primaryFlowIndex.maxFlowTemp ? dataToString($scope.survey.surveys.primaryFlowIndex.maxFlowTemp) : '0',
        margin: [0, 8, 0, 0], fontSize: contentFontsize
      },
      {
        text: $scope.survey.surveys.primaryFlowIndex.returnTemp ? dataToString($scope.survey.surveys.primaryFlowIndex.returnTemp) : '0',
        margin: [0, 8, 0, 0], fontSize: contentFontsize
      },
      {
        text: $scope.survey.surveys.primaryFlowIndex.delta ? dataToString($scope.survey.surveys.primaryFlowIndex.delta) : '0',
        margin: [0, 8, 0, 0], fontSize: contentFontsize
      },
      {
        text: $scope.survey.surveys.primaryFlowIndex.pipeSelect ? dataToString($scope.survey.surveys.primaryFlowIndex.pipeSelect) : '0',
        margin: [0, 8, 0, 0], fontSize: contentFontsize
      },
      {
        text: $scope.survey.surveys.primaryFlowIndex.meanVelo ? dataToString(parseFloat($scope.survey.surveys.primaryFlowIndex.meanVelo).toFixed(3)) : '0',
        margin: [0, 8, 0, 0], fontSize: contentFontsize
      },
      {
        text: $scope.survey.surveys.primaryFlowIndex.veloCheck ? dataToString($scope.survey.surveys.primaryFlowIndex.veloCheck) : '0',
        margin: [0, 8, 0, 0], fontSize: contentFontsize
      },
      {
        text: $scope.survey.surveys.primaryFlowIndex.pressureL ? dataToString(parseFloat($scope.survey.surveys.primaryFlowIndex.pressureL).toFixed(3)) : '0',
        margin: [0, 8, 0, 0], fontSize: contentFontsize
      },
      {
        text: $scope.survey.surveys.primaryFlowIndex.pLoss ? dataToString(parseFloat($scope.survey.surveys.primaryFlowIndex.pLoss).toFixed(3)) : '0',
        margin: [0, 8, 0, 0], fontSize: contentFontsize
      },
      {
        text: $scope.survey.surveys.primaryFlowIndex.lengthFlow ? dataToString($scope.survey.surveys.primaryFlowIndex.lengthFlow) : '0',
        margin: [0, 8, 0, 0], fontSize: contentFontsize
      },
      {
        text: $scope.survey.surveys.primaryFlowIndex.totPreLoss ? dataToString(parseFloat($scope.survey.surveys.primaryFlowIndex.totPreLoss).toFixed(3)) : '0',
        margin: [0, 8, 0, 0], fontSize: contentFontsize
      },
      ]]

      var roomsWithTee = []
      var room = $scope.survey.surveys.rooms
      var roomData = [[{ text: "Room Names", rowSpan: 2, fontSize: contentFontsize, alignment: 'center' }, { text: 'Heat Loss kW', rowSpan: 2, alignment: 'center', fontSize: contentFontsize }, { text: 'Flow Temperature', rowSpan: 2, alignment: 'center', fontSize: contentFontsize }, { text: 'Return Temperature', rowSpan: 2, alignment: 'center', fontSize: contentFontsize }, { text: 'Delta T', rowSpan: 2, alignment: 'center', fontSize: contentFontsize }, { text: 'Pipe Selected', alignment: 'center', fontSize: contentFontsize }, { text: 'Mean Velocity', alignment: 'center', fontSize: contentFontsize }, { text: 'Velocity Check', rowSpan: 2, alignment: 'center', fontSize: contentFontsize }, { text: 'Pressure Loss', alignment: 'center', fontSize: contentFontsize }, { text: 'Pressure Loss', alignment: 'center', fontSize: contentFontsize }, { text: 'Pipe run Flow Length', alignment: 'center', fontSize: contentFontsize }, { text: 'Total Pressure Loss', alignment: 'center', fontSize: contentFontsize }], ['', '', '', '', '', { text: '(Diameter)mm', alignment: 'center', fontSize: contentFontsize }, { text: 'm/s', alignment: 'center', fontSize: contentFontsize }, '', { text: 'Pa/m', alignment: 'center', fontSize: contentFontsize }, { text: 'm(hd)/m', alignment: 'center', fontSize: contentFontsize }, { text: 'm', alignment: 'center', fontSize: contentFontsize }, { text: 'metres head', alignment: 'center', fontSize: contentFontsize }]]
      var radValues = []

      //for rooms
      for (let i = 0; i < room.length; i++) {

        radValues = [[
          { text: 'Heating Emitters', fontSize: contentFontsize },
          { text: 'Output KW', fontSize: contentFontsize },
          { text: 'Height(mm)', fontSize: contentFontsize },
          { text: 'Length(mm)', fontSize: contentFontsize },
          { text: 'Pipe Selected (Diameter) mm', fontSize: contentFontsize },
          { text: 'Mean Velocity m/s', fontSize: contentFontsize },
          { text: 'Velocity Check', fontSize: contentFontsize },
          { text: 'Pressure Loss Pa/m', fontSize: contentFontsize },
          { text: 'Pressure Loss m(hd)/m', fontSize: contentFontsize },
          { text: 'Flow Length To Emitter (m)', fontSize: contentFontsize },
          { text: 'Total Pressure Loss metres head', fontSize: contentFontsize }
        ]
        ]
        if (room[i]?.radiators?.one?.pipeRunAndOrderId != undefined || room[i]?.radiators?.one?.pipeRunAndOrderId != null) {
          var customValone
          if (room[i].radiators.one.type != "Custom") {
            customValone = room[i].radiators.one.outputKW ? (room[i].radiators.one.outputKW / 1000).toFixed(3) : '-'
          } else {
            customValone = room[i].radiators.one.watts ? (room[i].radiators.one.watts).toFixed(3) : '-'
          }
          var radone = [
            { text: dataToString(room[i].radiators.one.type ? room[i].radiators.one.type : '-'), fontSize: contentFontsize },
            { text: dataToString((parseFloat(customValone))), fontSize: contentFontsize },
            { text: dataToString(parseFloat(room[i].radiators.one.height ? room[i].radiators.one.height : '-')), fontSize: contentFontsize },
            { text: dataToString(parseFloat(room[i].radiators.one.length ? room[i].radiators.one.length : '-')), fontSize: contentFontsize },
            { text: dataToString(room[i].radiators.one.pipeSelected ? room[i].radiators.one.pipeSelected : '-'), fontSize: contentFontsize },
            { text: dataToString(room[i].radiators.one.radsMean > 0 ? room[i].radiators.one.radsMean.toFixed(3) : '0'), fontSize: contentFontsize },
            { text: dataToString(room[i].radiators.one.radspipeVolumeCheck ? room[i].radiators.one.radspipeVolumeCheck : '-'), fontSize: contentFontsize },
            { text: dataToString(room[i].radiators.one.radspressureLossPA ? room[i].radiators.one.radspressureLossPA.toFixed(3) : '-'), fontSize: contentFontsize },
            { text: dataToString(room[i].radiators.one.radspressureLossM ? room[i].radiators.one.radspressureLossM.toFixed(3) : '-'), fontSize: contentFontsize },

            { text: dataToString(room[i].radiators.one.radsFlowreturn ? room[i].radiators.one.radsFlowreturn : '-'), fontSize: contentFontsize },
            { text: dataToString(room[i].radiators.one.radsTotalPressureLoss ? room[i].radiators.one.radsTotalPressureLoss.toFixed(3) : '-'), fontSize: contentFontsize },
          ]
          radValues.push(radone)
        }
        if (room[i]?.radiators?.two?.pipeRunAndOrderId != undefined || room[i]?.radiators?.two?.pipeRunAndOrderId != null) {
          var customValtwo
          if (room[i].radiators.two.type != "Custom") {
            customValtwo = room[i].radiators.two.outputKW ? (room[i].radiators.two.outputKW / 1000).toFixed(3) : '-'
          } else {
            customValtwo = room[i].radiators.two.watts ? (room[i].radiators.two.watts).toFixed(3) : '-'
          }
          var radtwo = [
            { text: dataToString(room[i].radiators.two.type ? room[i].radiators.two.type : '-'), fontSize: contentFontsize },
            { text: dataToString((parseFloat(customValtwo))), fontSize: contentFontsize },
            { text: dataToString(parseFloat(room[i].radiators.two.height ? room[i].radiators.two.height : '-')), fontSize: contentFontsize },
            { text: dataToString(parseFloat(room[i].radiators.two.length ? room[i].radiators.two.length : '-')), fontSize: contentFontsize },
            { text: dataToString(room[i].radiators.two.pipeSelected ? room[i].radiators.two.pipeSelected : '-'), fontSize: contentFontsize },
            { text: dataToString(room[i].radiators.two.radsMean > 0 ? room[i].radiators.two.radsMean.toFixed(3) : '0'), fontSize: contentFontsize },
            { text: dataToString(room[i].radiators.two.radspipeVolumeCheck ? room[i].radiators.two.radspipeVolumeCheck : '-'), fontSize: contentFontsize },
            { text: dataToString(room[i].radiators.two.radspressureLossPA ? room[i].radiators.two.radspressureLossPA.toFixed(3) : '-'), fontSize: contentFontsize },
            { text: dataToString(room[i].radiators.two.radspressureLossM ? room[i].radiators.two.radspressureLossM.toFixed(3) : '-'), fontSize: contentFontsize },

            { text: dataToString(room[i].radiators.two.radsFlowreturn ? room[i].radiators.two.radsFlowreturn : '-'), fontSize: contentFontsize },
            { text: dataToString(room[i].radiators.two.radsTotalPressureLoss ? room[i].radiators.two.radsTotalPressureLoss.toFixed(3) : '-'), fontSize: contentFontsize },
          ]
          radValues.push(radtwo)
        }
        if (room[i]?.radiators?.three?.pipeRunAndOrderId != undefined || room[i]?.radiators?.three?.pipeRunAndOrderId != null) {
          var customValthree
          if (room[i].radiators.three.type != "Custom") {
            customValthree = room[i].radiators.three.outputKW ? (room[i].radiators.three.outputKW / 1000).toFixed(3) : '-'
          } else {
            customValthree = room[i].radiators.three.watts ? (room[i].radiators.three.watts).toFixed(3) : '-'
          }
          var radthree = [
            { text: dataToString(room[i].radiators.three.type ? room[i].radiators.three.type : '-'), fontSize: contentFontsize },
            { text: dataToString((parseFloat(customValthree))), fontSize: contentFontsize },
            { text: dataToString(parseFloat(room[i].radiators.three.height ? room[i].radiators.three.height : '-')), fontSize: contentFontsize },
            { text: dataToString(parseFloat(room[i].radiators.three.length ? room[i].radiators.three.length : '-')), fontSize: contentFontsize },
            { text: dataToString(room[i].radiators.three.pipeSelected ? room[i].radiators.three.pipeSelected : '-'), fontSize: contentFontsize },
            { text: dataToString(room[i].radiators.three.radsMean > 0 ? room[i].radiators.three.radsMean.toFixed(3) : '0'), fontSize: contentFontsize },
            { text: dataToString(room[i].radiators.three.radspipeVolumeCheck ? room[i].radiators.three.radspipeVolumeCheck : '-'), fontSize: contentFontsize },
            { text: dataToString(room[i].radiators.three.radspressureLossPA ? room[i].radiators.three.radspressureLossPA.toFixed(3) : '-'), fontSize: contentFontsize },
            { text: dataToString(room[i].radiators.three.radspressureLossM ? room[i].radiators.three.radspressureLossM.toFixed(3) : '-'), fontSize: contentFontsize },

            { text: dataToString(room[i].radiators.three.radsFlowreturn ? room[i].radiators.three.radsFlowreturn : '-'), fontSize: contentFontsize },
            { text: dataToString(room[i].radiators.three.radsTotalPressureLoss ? room[i].radiators.three.radsTotalPressureLoss.toFixed(3) : '-'), fontSize: contentFontsize },
          ]
          radValues.push(radthree)
        }
        if (room[i]?.radiators?.four?.pipeRunAndOrderId != undefined || room[i]?.radiators?.four?.pipeRunAndOrderId != null) {
          var customValfour
          if (room[i].radiators.four.type != "Custom") {
            customValfour = room[i].radiators.four.outputKW ? (room[i].radiators.four.outputKW / 1000).toFixed(3) : '-'
          } else {
            customValfour = room[i].radiators.four.watts ? (room[i].radiators.four.watts).toFixed(3) : '-'
          }
          var radfour = [
            { text: dataToString(room[i].radiators.four.type ? room[i].radiators.four.type : '-'), fontSize: contentFontsize },
            { text: dataToString((parseFloat(customValfour))), fontSize: contentFontsize },
            { text: dataToString(parseFloat(room[i].radiators.four.height ? room[i].radiators.four.height : '-')), fontSize: contentFontsize },
            { text: dataToString(parseFloat(room[i].radiators.four.length ? room[i].radiators.four.length : '-')), fontSize: contentFontsize },
            { text: dataToString(room[i].radiators.four.pipeSelected ? room[i].radiators.four.pipeSelected : '-'), fontSize: contentFontsize },
            { text: dataToString(room[i].radiators.four.radsMean > 0 ? room[i].radiators.four.radsMean.toFixed(3) : '0'), fontSize: contentFontsize },
            { text: dataToString(room[i].radiators.four.radspipeVolumeCheck ? room[i].radiators.four.radspipeVolumeCheck : '-'), fontSize: contentFontsize },
            { text: dataToString(room[i].radiators.four.radspressureLossPA ? room[i].radiators.four.radspressureLossPA.toFixed(3) : '-'), fontSize: contentFontsize },
            { text: dataToString(room[i].radiators.four.radspressureLossM ? room[i].radiators.four.radspressureLossM.toFixed(3) : '-'), fontSize: contentFontsize },

            { text: dataToString(room[i].radiators.four.radsFlowreturn ? room[i].radiators.four.radsFlowreturn : '-'), fontSize: contentFontsize },
            { text: dataToString(room[i].radiators.four.radsTotalPressureLoss ? room[i].radiators.four.radsTotalPressureLoss.toFixed(3) : '-'), fontSize: contentFontsize },
          ]
          radValues.push(radfour)
        }
        if (room[i]?.radiators?.five?.pipeRunAndOrderId != undefined || room[i]?.radiators?.five?.pipeRunAndOrderId != null) {
          var customValfive
          if (room[i].radiators.five.type != "Custom") {
            customValfive = room[i].radiators.five.outputKW ? (room[i].radiators.five.outputKW / 1000).toFixed(3) : '-'
          } else {
            customValfive = room[i].radiators.five.watts ? (room[i].radiators.five.watts).toFixed(3) : '-'
          }
          var radfive = [
            { text: dataToString(room[i].radiators.five.type ? room[i].radiators.five.type : '-'), fontSize: contentFontsize },
            { text: dataToString((parseFloat(customValfive))), fontSize: contentFontsize },
            { text: dataToString(parseFloat(room[i].radiators.five.height ? room[i].radiators.five.height : '-')), fontSize: contentFontsize },
            { text: dataToString(parseFloat(room[i].radiators.five.length ? room[i].radiators.five.length : '-')), fontSize: contentFontsize },
            { text: dataToString(room[i].radiators.five.pipeSelected ? room[i].radiators.five.pipeSelected : '-'), fontSize: contentFontsize },
            { text: dataToString(room[i].radiators.five.radsMean > 0 ? room[i].radiators.five.radsMean.toFixed(3) : '0'), fontSize: contentFontsize },
            { text: dataToString(room[i].radiators.five.radspipeVolumeCheck ? room[i].radiators.five.radspipeVolumeCheck : '-'), fontSize: contentFontsize },
            { text: dataToString(room[i].radiators.five.radspressureLossPA ? room[i].radiators.five.radspressureLossPA.toFixed(3) : '-'), fontSize: contentFontsize },
            { text: dataToString(room[i].radiators.five.radspressureLossM ? room[i].radiators.five.radspressureLossM.toFixed(3) : '-'), fontSize: contentFontsize },

            { text: dataToString(room[i].radiators.five.radsFlowreturn ? room[i].radiators.five.radsFlowreturn : '-'), fontSize: contentFontsize },
            { text: dataToString(room[i].radiators.five.radsTotalPressureLoss ? room[i].radiators.five.radsTotalPressureLoss.toFixed(3) : '-'), fontSize: contentFontsize },
          ]
          radValues.push(radfive)
        }
        if (room[i]?.radiators?.six?.pipeRunAndOrderId != undefined || room[i]?.radiators?.six?.pipeRunAndOrderId != null) {
          var customValsix
          if (room[i].radiators.six.type != "Custom") {
            customValsix = room[i].radiators.six.outputKW ? (room[i].radiators.six.outputKW / 1000).toFixed(3) : '-'
          } else {
            customValsix = room[i].radiators.six.watts ? (room[i].radiators.six.watts).toFixed(3) : '-'
          }
          var radsix = [
            { text: dataToString(room[i].radiators.six.type ? room[i].radiators.six.type : '-'), fontSize: contentFontsize },
            { text: dataToString((parseFloat(customValsix))), fontSize: contentFontsize },
            { text: dataToString(parseFloat(room[i].radiators.six.height ? room[i].radiators.six.height : '-')), fontSize: contentFontsize },
            { text: dataToString(parseFloat(room[i].radiators.six.length ? room[i].radiators.six.length : '-')), fontSize: contentFontsize },
            { text: dataToString(room[i].radiators.six.pipeSelected ? room[i].radiators.six.pipeSelected : '-'), fontSize: contentFontsize },
            { text: dataToString(room[i].radiators.six.radsMean > 0 ? room[i].radiators.six.radsMean.toFixed(3) : '0'), fontSize: contentFontsize },
            { text: dataToString(room[i].radiators.six.radspipeVolumeCheck ? room[i].radiators.six.radspipeVolumeCheck : '-'), fontSize: contentFontsize },
            { text: dataToString(room[i].radiators.six.radspressureLossPA ? room[i].radiators.six.radspressureLossPA.toFixed(3) : '-'), fontSize: contentFontsize },
            { text: dataToString(room[i].radiators.six.radspressureLossM ? room[i].radiators.six.radspressureLossM.toFixed(3) : '-'), fontSize: contentFontsize },

            { text: dataToString(room[i].radiators.six.radsFlowreturn ? room[i].radiators.six.radsFlowreturn : '-'), fontSize: contentFontsize },
            { text: dataToString(room[i].radiators.six.radsTotalPressureLoss ? room[i].radiators.six.radsTotalPressureLoss.toFixed(3) : '-'), fontSize: contentFontsize },
          ]
          radValues.push(radsix)
        }
        var roomArr1 = [
          { text: dataToString(room[i].room_name), fillColor: '#dedede', alignment: 'center', fontSize: contentFontsize },
          { text: dataToString(room[i]?.t_watts.toFixed(3)), fillColor: '#dedede', alignment: 'center', fontSize: contentFontsize }, // dataToString(room.emitter_type)
          { text: dataToString(room[i].flow_temperature, '-'), fillColor: '#dedede', alignment: 'center', fontSize: contentFontsize },
          { text: dataToString(room[i].return_temperature, '-'), fillColor: '#dedede', alignment: 'center', fontSize: contentFontsize },
          { text: disableRoom(room[i], dataToString(room[i].deltat, '-')), fillColor: '#dedede', alignment: 'center', fontSize: contentFontsize },
          { text: disableRoom(room[i], dataToString(room[i].pipe_nom_dia, '-')), fillColor: '#dedede', alignment: 'center', fontSize: contentFontsize },
          { text: room[i].pipe ? disableRoom(room[i], dataToString(parseFloat(room[i].pipe.meanVelosity).toFixed(3))) : '-', fillColor: '#dedede', alignment: 'center', fontSize: contentFontsize },
          { text: disableRoom(room[i], dataToString(room[i].pipeVolumeCheck, '-')), fillColor: '#dedede', alignment: 'center', fontSize: contentFontsize },
          { text: room[i].pipe ? disableRoom(room[i], dataToString(parseFloat(room[i].pipe.pressureLossPA).toFixed(3))) : '-', fillColor: '#dedede', alignment: 'center', fontSize: contentFontsize },
          { text: room[i].pipe ? disableRoom(room[i], dataToString(parseFloat(room[i].pipe.pressureLossM).toFixed(3))) : '-', fillColor: '#dedede', alignment: 'center', fontSize: contentFontsize },
          { text: disableRoom(room[i], dataToString(room[i].flowReturnPipes, '-')), fillColor: '#dedede', alignment: 'center', fontSize: contentFontsize },
          { text: room[i].pipe ? disableRoom(room[i], dataToString(parseFloat(room[i].pipe.totPressureLoss).toFixed(3))) : '-', fillColor: '#dedede', alignment: 'center', fontSize: contentFontsize }
        ]

        var roomrad = [
          {
            colSpan: 12,
            stack: [

              {
                table: {
                  body: radValues
                },
              }
            ]
          },

        ]





        roomData.push(roomArr1)

        if ((room[i].radiators?.one != null && room[i].radiators?.one?.type != undefined) || (room[i].radiators?.three != null && room[i].radiators?.three?.type != undefined) || (room[i].radiators?.three != null && room[i].radiators?.three?.type != undefined) || (room[i].radiators?.four != null && room[i].radiators?.four?.type != undefined) || (room[i].radiators?.five != null && room[i].radiators?.five?.type != undefined) || (room[i].radiators?.six != null && room[i].radiators?.six?.type != undefined)) {
          roomData.push(roomrad)
        }

        // if(room[i].radiators?.two != null && room[i].radiators?.two?.type != undefined){
        //   roomData.push(roomrad)
        //     }
        // if(room[i].radiators?.three != null && room[i].radiators?.three?.type != undefined){
        //   roomData.push(roomrad)
        //     }
        // if(room[i].radiators?.four != null && room[i].radiators?.four?.type != undefined){
        //   roomData.push(roomrad)
        //     }
        // if(room[i].radiators?.five != null && room[i].radiators?.five?.type != undefined){
        //   roomData.push(roomrad)
        //     }
        // if(room[i].radiators?.six != null && room[i].radiators?.six?.type != undefined){
        //   roomData.push(roomrad)
        //     }

      }
      // for rooms with rads

      for (let i = 0; i < room.length; i++) {

        if (room[i]?.radiators?.one?.pipeRunAndOrderId != undefined || room[i]?.radiators?.one?.pipeRunAndOrderId != null) {

          var one = [{ text: dataToString(room[i].radiators.one.predecessorId), fontSize: contentFontsize },
          { text: dataToString(room[i].radiators.one.pipeRunAndOrderId), fontSize: contentFontsize },
          { text: dataToString(room[i].radiators.one.type ? room[i].radiators.one.type : '-'), fontSize: contentFontsize },
          { text: dataToString((parseFloat(room[i].radiators.one.massFlowRate ? room[i].radiators.one.massFlowRate.toFixed(3) : '-'))), fontSize: contentFontsize },
          { text: dataToString(parseFloat(room[i].radiators.one.massFlowSubTotal.toFixed(3))), fontSize: contentFontsize },
          { text: dataToString(room[i].radiators.one.pipeSelected ? room[i].radiators.one.pipeSelected : '-'), fontSize: contentFontsize },
          { text: dataToString(parseFloat(room[i].radiators.one.radspressureLossPA ? room[i].radiators.one.radspressureLossPA.toFixed(3) : '-').toFixed(3)), fontSize: contentFontsize },
          { text: dataToString(room[i].radiators.one.radspressureLossM ? room[i].radiators.one.radspressureLossM.toFixed(4) : '-'), fontSize: contentFontsize },
          { text: dataToString(room[i].radiators.one.radsFlowreturn ? room[i].radiators.one.radsFlowreturn : '-'), fontSize: contentFontsize },
          { text: dataToString(parseFloat(room[i].radiators.one.radsTotalPressureLoss ? room[i].radiators.one.radsTotalPressureLoss.toFixed(3) : '-').toFixed(3)), fontSize: contentFontsize },
          ]

        }
        if (room[i]?.radiators?.two?.pipeRunAndOrderId != undefined || room[i]?.radiators?.two?.pipeRunAndOrderId != null) {

          var two = [{ text: dataToString(room[i].radiators.two.predecessorId), fontSize: contentFontsize },
          { text: dataToString(room[i].radiators.two.pipeRunAndOrderId), fontSize: contentFontsize },
          { text: dataToString(room[i].radiators.two.type ? room[i].radiators.two.type : '-'), fontSize: contentFontsize },
          { text: dataToString((parseFloat(room[i].radiators.two.massFlowRate ? room[i].radiators.two.massFlowRate.toFixed(3) : '-'))), fontSize: contentFontsize },
          { text: dataToString(parseFloat(room[i].radiators?.two?.massFlowSubTotal.toFixed(3))), fontSize: contentFontsize },
          { text: dataToString(room[i].radiators.two.pipeSelected ? room[i].radiators.two.pipeSelected : '-'), fontSize: contentFontsize },
          { text: dataToString(parseFloat(room[i].radiators.two.radspressureLossPA ? room[i].radiators.two.radspressureLossPA.toFixed(3) : '-').toFixed(3)), fontSize: contentFontsize },
          { text: dataToString(room[i].radiators.two.radspressureLossM ? room[i].radiators.two.radspressureLossM.toFixed(4) : '-'), fontSize: contentFontsize },
          { text: dataToString(room[i].radiators.two.radsFlowreturn ? room[i].radiators.two.radsFlowreturn : '-'), fontSize: contentFontsize },
          { text: dataToString(parseFloat(room[i].radiators.two.radsTotalPressureLoss ? room[i].radiators.two.radsTotalPressureLoss.toFixed(3) : '-').toFixed(3)), fontSize: contentFontsize },
          ]

        }
        if (room[i]?.radiators?.three?.pipeRunAndOrderId != undefined || room[i]?.radiators?.three?.pipeRunAndOrderId != null) {

          var three = [{ text: dataToString(room[i].radiators.three.predecessorId), fontSize: contentFontsize },
          { text: dataToString(room[i].radiators.three.pipeRunAndOrderId), fontSize: contentFontsize },
          { text: dataToString(room[i].radiators.three.type ? room[i].radiators.three.type : '-'), fontSize: contentFontsize },
          { text: dataToString((parseFloat(room[i].radiators.three.massFlowRate ? room[i].radiators.three.massFlowRate.toFixed(3) : '-'))), fontSize: contentFontsize },
          { text: dataToString(parseFloat(room[i].radiators.three.massFlowSubTotal.toFixed(3))), fontSize: contentFontsize },
          { text: dataToString(room[i].radiators.three.pipeSelected ? room[i].radiators.three.pipeSelected : '-'), fontSize: contentFontsize },
          { text: dataToString(parseFloat(room[i].radiators.three.radspressureLossPA ? room[i].radiators.three.radspressureLossPA.toFixed(3) : '-').toFixed(3)), fontSize: contentFontsize },
          { text: dataToString(room[i].radiators.three.radspressureLossM ? room[i].radiators.three.radspressureLossM.toFixed(4) : '-'), fontSize: contentFontsize },
          { text: dataToString(room[i].radiators.three.radsFlowreturn ? room[i].radiators.three.radsFlowreturn : '-'), fontSize: contentFontsize },
          { text: dataToString(parseFloat(room[i].radiators.three.radsTotalPressureLoss ? room[i].radiators.three.radsTotalPressureLoss.toFixed(3) : '-').toFixed(3)), fontSize: contentFontsize },
          ]

        }
        if (room[i]?.radiators?.four?.pipeRunAndOrderId != undefined || room[i]?.radiators?.four?.pipeRunAndOrderId != null) {

          var four = [{ text: dataToString(room[i].radiators.four.predecessorId), fontSize: contentFontsize },
          { text: dataToString(room[i].radiators.four.pipeRunAndOrderId), fontSize: contentFontsize },
          { text: dataToString(room[i].radiators.four.type ? room[i].radiators.four.type : '-'), fontSize: contentFontsize },
          { text: dataToString((parseFloat(room[i].radiators.four.massFlowRate ? room[i].radiators.four.massFlowRate.toFixed(3) : '-'))), fontSize: contentFontsize },
          { text: dataToString(parseFloat(room[i].radiators.four.massFlowSubTotal.toFixed(3))), fontSize: contentFontsize },
          { text: dataToString(room[i].radiators.four.pipeSelected ? room[i].radiators.four.pipeSelected : '-'), fontSize: contentFontsize },
          { text: dataToString(parseFloat(room[i].radiators.four.radspressureLossPA ? room[i].radiators.four.radspressureLossPA.toFixed(3) : '-').toFixed(3)), fontSize: contentFontsize },
          { text: dataToString(room[i].radiators.four.radspressureLossM ? room[i].radiators.four.radspressureLossM.toFixed(4) : '-'), fontSize: contentFontsize },
          { text: dataToString(room[i].radiators.four.radsFlowreturn ? room[i].radiators.four.radsFlowreturn : '-'), fontSize: contentFontsize },
          { text: dataToString(parseFloat(room[i].radiators.four.radsTotalPressureLoss ? room[i].radiators.four.radsTotalPressureLoss.toFixed(3) : '-').toFixed(3)), fontSize: contentFontsize },
          ]

        }
        if (room[i]?.radiators?.five?.pipeRunAndOrderId != undefined || room[i]?.radiators?.five?.pipeRunAndOrderId != null) {

          var five = [{ text: dataToString(room[i].radiators.five.predecessorId), fontSize: contentFontsize },
          { text: dataToString(room[i].radiators.five.pipeRunAndOrderId), fontSize: contentFontsize },
          { text: dataToString(room[i].radiators.five.type ? room[i].radiators.five.type : '-'), fontSize: contentFontsize },
          { text: dataToString((parseFloat(room[i].radiators.five.massFlowRate ? room[i].radiators.five.massFlowRate.toFixed(3) : '-'))), fontSize: contentFontsize },
          { text: dataToString(parseFloat(room[i].radiators.five.massFlowSubTotal.toFixed(3))), fontSize: contentFontsize },
          { text: dataToString(room[i].radiators.five.pipeSelected ? room[i].radiators.five.pipeSelected : '-'), fontSize: contentFontsize },
          { text: dataToString(parseFloat(room[i].radiators.five.radspressureLossPA ? room[i].radiators.five.radspressureLossPA.toFixed(3) : '-').toFixed(3)), fontSize: contentFontsize },
          { text: dataToString(room[i].radiators.five.radspressureLossM ? room[i].radiators.five.radspressureLossM.toFixed(4) : '-'), fontSize: contentFontsize },
          { text: dataToString(room[i].radiators.five.radsFlowreturn ? room[i].radiators.five.radsFlowreturn : '-'), fontSize: contentFontsize },
          { text: dataToString(parseFloat(room[i].radiators.five.radsTotalPressureLoss ? room[i].radiators.five.radsTotalPressureLoss.toFixed(3) : '-').toFixed(3)), fontSize: contentFontsize },
          ]
        }
        if (room[i]?.radiators?.six?.pipeRunAndOrderId != undefined || room[i]?.radiators?.six?.pipeRunAndOrderId != null) {

          var six = [{ text: dataToString(room[i].radiators.six.predecessorId), fontSize: contentFontsize },
          { text: dataToString(room[i].radiators.six.pipeRunAndOrderId), fontSize: contentFontsize },
          { text: dataToString(room[i].radiators.six.type ? room[i].radiators.six.type : '-'), fontSize: contentFontsize },
          { text: dataToString((parseFloat(room[i].radiators.six.massFlowRate ? room[i].radiators.six.massFlowRate.toFixed(3) : '-'))), fontSize: contentFontsize },
          { text: dataToString(parseFloat(room[i].radiators.six.massFlowSubTotal.toFixed(3))), fontSize: contentFontsize },
          { text: dataToString(room[i].radiators.six.pipeSelected ? room[i].radiators.six.pipeSelected : '-'), fontSize: contentFontsize },
          { text: dataToString(parseFloat(room[i].radiators.six.radspressureLossPA ? room[i].radiators.six.radspressureLossPA.toFixed(3) : '-').toFixed(3)), fontSize: contentFontsize },
          { text: dataToString(room[i].radiators.six.radspressureLossM ? room[i].radiators.six.radspressureLossM.toFixed(4) : '-'), fontSize: contentFontsize },
          { text: dataToString(room[i].radiators.six.radsFlowreturn ? room[i].radiators.six.radsFlowreturn : '-'), fontSize: contentFontsize },
          { text: dataToString(parseFloat(room[i].radiators.six.radsTotalPressureLoss ? room[i].radiators.six.radsTotalPressureLoss.toFixed(3) : '-').toFixed(3)), fontSize: contentFontsize },
          ]
        }

        var roomArr = [{ text: dataToString(room[i].pipeRunData.predecessorId), fontSize: contentFontsize, fillColor: '#dedede' },
        { text: dataToString(room[i].pipeRunData.pipeRunAndOrderId), fontSize: contentFontsize, fillColor: '#dedede' },
        { text: dataToString(room[i].room_name), fontSize: contentFontsize, fillColor: '#dedede' },
        { text: dataToString((parseFloat(room[i].pipe.massFlowRate.toFixed(3)))), fontSize: contentFontsize, fillColor: '#dedede' },
        // { text: dataToString(room.circuitfeedMassFlowRate.toFixed(3)) },
        { text: dataToString(parseFloat(room[i].massFlowSubTotal.toFixed(3))), fontSize: contentFontsize, fillColor: '#dedede' },
        { text: dataToString(room[i].pipe_nom_dia), fontSize: contentFontsize, fillColor: '#dedede' },
        { text: dataToString(parseFloat(room[i].pipe.pressureLossPA).toFixed(3)), fontSize: contentFontsize, fillColor: '#dedede' },
        { text: dataToString(parseFloat(room[i].pipe.pressureLossM).toFixed(3)), fontSize: contentFontsize, fillColor: '#dedede' },
        { text: dataToString(room[i].flowReturnPipes), fontSize: contentFontsize, fillColor: '#dedede' },
        { text: dataToString(parseFloat(room[i].pipe.totPressureLoss).toFixed(3)), fontSize: contentFontsize, fillColor: '#dedede' },
          // { text: room.pipe.subCircuitMaxPressureDrop  !== undefined || room.pipe.subCircuitMaxPressureDrop  !== null ? dataToString(parseFloat(room.pipe.subCircuitMaxPressureDrop ).toFixed(3)):0},
          // { text: room.pressureDropForTees !== undefined || room.pressureDropForTees !== null ? dataToString(parseFloat(room.pressureDropForTees ).toFixed(3)):0}]
        ]
        roomsWithTee.push(roomArr)

        if (room[i].radiators?.one != null && room[i].radiators?.one?.type != undefined) {
          roomsWithTee.push(one)
        }

        if (room[i].radiators?.two != null && room[i].radiators?.two?.type != undefined) {
          roomsWithTee.push(two)
        }
        if (room[i].radiators?.three != null && room[i].radiators?.three?.type != undefined) {
          roomsWithTee.push(three)
        }
        if (room[i].radiators?.four != null && room[i].radiators?.four?.type != undefined) {
          roomsWithTee.push(four)
        }
        if (room[i].radiators?.five != null && room[i].radiators?.five?.type != undefined) {
          roomsWithTee.push(five)
        }
        if (room[i].radiators?.six != null && room[i].radiators?.six?.type != undefined) {
          roomsWithTee.push(six)
        }


      }

      var tee = $scope.survey.surveys.tees.map(function (data, idx) {
        return (
          [
            { text: "Tee" + (idx + 1).toString(), fontSize: contentFontsize, alignment: "center" },
            { text: dataToString(data.preId), alignment: 'center', fontSize: contentFontsize },
            { text: dataToString(data.pipeRunIds[0].roomRunId), alignment: 'center', fontSize: contentFontsize },
            { text: dataToString(data.pipeRunIds[1].roomRunId), alignment: 'center', fontSize: contentFontsize },
            { text: dataToString((parseFloat(data.massFlowSubTotal).toFixed(3))), alignment: 'center', fontSize: contentFontsize },
            { text: dataToString(data.pipeSelect), alignment: 'center', fontSize: contentFontsize },
            { text: dataToString(parseFloat(data.meanVelosity).toFixed(3)), alignment: 'center', fontSize: contentFontsize },
            { text: dataToString(data.velosityCheck), alignment: 'center', fontSize: contentFontsize },
            { text: dataToString(parseFloat(data.pressureLossPA).toFixed(3)), alignment: 'center', fontSize: contentFontsize },
            { text: dataToString(parseFloat(data.pressureLossM).toFixed(3)), alignment: 'center', fontSize: contentFontsize },
            { text: dataToString(data.pipeRunFlowLength), alignment: 'center', fontSize: contentFontsize },
            { text: dataToString(data.pipeRunFlowLength) > 0 ? dataToString(parseFloat(data.pipeRunFlowLength * data.pressureLossM).toFixed(3)) : 0, alignment: 'center', fontSize: contentFontsize }
          ])
      })
      var survey = $scope.survey
      var finalResult = [[{
        text: 'Suggested Index Circuit', alignment: 'center', fontSize: contentFontsize, colSpan: 2
      }, {},
      {
        text: survey.surveys.pipeFinalData.roomName ? 'Primary pipes leading to ' + survey.surveys.pipeFinalData.roomName + ' with emitter  ' + survey.surveys.pipeFinalData.radName : '-', alignment: 'center', fontSize: contentFontsize,
      }

      ], [{
        text: 'Total Litres (Pipe work only)', alignment: 'right', fontSize: contentFontsize, colSpan: 2
      }, {},
      {
        text: survey.surveys.pipeFinalData.totalLitres ? dataToString(parseFloat(survey.surveys.pipeFinalData.totalLitres).toFixed(3)) : '-', alignment: 'center', fontSize: contentFontsize
      },
      ], [{
        text: 'Index Circuit Sub-Total (m/hd)', alignment: 'right', fontSize: contentFontsize, colSpan: 2
      }, {},
      {
        text: survey.surveys.pipeFinalData.icsubTotal ? dataToString(parseFloat(survey.surveys.pipeFinalData.icsubTotal).toFixed(3)) : '-', alignment: 'center', fontSize: contentFontsize
      },
      ], [{
        text: 'Allowance for fittings (Default 50%) of sub-total', alignment: 'center', fontSize: contentFontsize
      },
      {
        text: survey.surveys.pipeFinalData.allowSubTotalPercent ? survey.surveys.pipeFinalData.allowSubTotalPercent + '%' : '-', alignment: 'center', fontSize: contentFontsize
      },
      {
        text: survey.surveys.pipeFinalData.allowsubTotal ? dataToString(parseFloat(survey.surveys.pipeFinalData.allowsubTotal).toFixed(3)) : '-', alignment: 'center', fontSize: contentFontsize
      },
      ]];

      var pumpSection = [[{
        text: 'Total Mass Flow Rate (kg/s)', alignment: 'right', fontSize: contentFontsize, colSpan: 2
      }, {},
      {
        text: $scope.survey.surveys.primaryFlowIndex.massFlowRat.toFixed(3), alignment: 'center', fontSize: contentFontsize
      },
      ], [{
        text: 'Select pipe system', alignment: 'right', fontSize: contentFontsize, colSpan: 2
      }, {},
      {
        text: $scope.finalData.pipeSystem == "1" ? 'Single pipe system ' : 'Two pipe system', alignment: 'center', fontSize: contentFontsize
      },
      ], [{
        text: 'Index cicuit pressure loss (meters head)', alignment: 'right', fontSize: contentFontsize, colSpan: 2
      }, {},
      {
        text: $scope.finalData.totPreLoss.toFixed(3), alignment: 'center', fontSize: contentFontsize
      },
      ], [{
        text: 'Index Circuit ID', alignment: 'right', fontSize: contentFontsize, colSpan: 2
      }, {},
      {
        text: $scope.finalData.indexCircuitId, alignment: 'center', fontSize: contentFontsize
      },
      ]]

      // Create document template
      var doc = {
        pageSize: "A4",
        pageOrientation: "landscape",
        pageMargins: [30, 30, 30, 30],
        content: []
      };
      doc.content.push({
        columns: [{
          width: '*',
          stack: [
            { image: 'data:image/png;base64,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', width: 150 },
            { text: 'Heat Engineer Software Ltd', style: 'smallGray' }
          ]
        },
        {
          width: '*',
          text: ''
        }
        ],
      });
      doc.content.push({
        text: "CURRENT PIPE CALCULATION",
        bold: true,
        alignment: 'center',
        fontSize: 18,
        margin: [0, 30, 0, 5]
      });
      doc.content.push({
        text: "PIPE CALCULATION REPORT",
        bold: true,
        fontSize: 12,
        margin: [0, 10, 0, 5]
      });
      doc.content.push({
        style: 'table',
        table: {
          widths: ['*', '*', '*', '*', '*', '*', '*', '*', '*', '*', '*', '*'],
          body: roomData
        },
        // width:[500],
        margin: [0, 0, 0, 10]
      });

      doc.content.push({
        style: 'table',
        table: {
          widths: ['*', '*'],
          body: [

          ].concat(maxFlowTemp)

        },
        // width:[500],
        margin: [0, 0, 0, 10]
      });
      doc.content.push({
        style: 'table',
        table: {
          widths: ['*', '*', '*', '*', '*', '*', '*', '*', '*', '*', '*', '*'],
          body: [
            [{ text: "", rowSpan: 2, fontSize: contentFontsize, alignment: 'center' }, { text: 'Heat Loss kW', rowSpan: 2, alignment: 'center', fontSize: contentFontsize }, { text: 'Flow Temperature', rowSpan: 2, alignment: 'center', fontSize: contentFontsize }, { text: 'Return Temperature', rowSpan: 2, alignment: 'center', fontSize: contentFontsize }, { text: 'Delta T', rowSpan: 2, alignment: 'center', fontSize: contentFontsize }, { text: 'Pipe Selected', alignment: 'center', fontSize: contentFontsize }, { text: 'Mean Velocity', alignment: 'center', fontSize: contentFontsize }, { text: 'Velocity Check', rowSpan: 2, alignment: 'center', fontSize: contentFontsize }, { text: 'Pressure Loss', alignment: 'center', fontSize: contentFontsize }, { text: 'Pressure Loss', alignment: 'center', fontSize: contentFontsize }, { text: 'Pipe run Flow Length', alignment: 'center', fontSize: contentFontsize }, { text: 'Total Pressure Loss', alignment: 'center', fontSize: contentFontsize }],
            ['', '', '', '', '', { text: '(Diameter)mm', alignment: 'center', fontSize: contentFontsize }, { text: 'm/s', alignment: 'center', fontSize: contentFontsize }, '', { text: 'Pa/m', alignment: 'center', fontSize: contentFontsize }, { text: 'm(hd)/m', alignment: 'center', fontSize: contentFontsize }, { text: 'm', alignment: 'center', fontSize: contentFontsize }, { text: 'metres head', alignment: 'center', fontSize: contentFontsize }]
          ].concat(returnValue)

        },
        // width:[500],
        margin: [0, 0, 0, 10]
      });

      doc.content.push({
        pageBreak: 'before',
        text: "TEES BREAKDOWN",
        bold: true,
        fontSize: 12,
        margin: [0, 10, 0, 5]
      });

      doc.content.push({
        style: 'table',
        table: {
          widths: ['*', '*', '*', '*', '*', '*', '*', '*', '*', '*', '*', '*'],
          body: [
            [{ text: "", rowSpan: 2, fontSize: contentFontsize }, { text: 'Start ID', rowSpan: 2, alignment: 'center', fontSize: contentFontsize }, { text: 'Supplying ID', colSpan: 2, alignment: 'center', fontSize: contentFontsize }, {}, { text: 'MassFlowRate Subtotals', rowSpan: 2, alignment: 'center', fontSize: contentFontsize }, { text: 'Pipe Selected', alignment: 'center', fontSize: contentFontsize }, { text: 'Mean Velocity', alignment: 'center', fontSize: contentFontsize }, { text: 'Velocity Check', rowSpan: 2, alignment: 'center', fontSize: contentFontsize }, { text: 'Pressure Loss', alignment: 'center', fontSize: contentFontsize }, { text: 'Pressure Loss', alignment: 'center', fontSize: contentFontsize }, { text: 'Pipe run Flow Length', alignment: 'center', fontSize: contentFontsize }, { text: 'Total Pressure Loss', alignment: 'center', fontSize: contentFontsize }],
            ['', '', { text: 'ID1', alignment: 'center', fontSize: contentFontsize }, { text: 'ID2', alignment: 'center', fontSize: contentFontsize }, '', { text: '(Diameter)mm', alignment: 'center', fontSize: contentFontsize }, { text: 'm/s', alignment: 'center', fontSize: contentFontsize }, '', { text: 'Pa/m', alignment: 'center', fontSize: contentFontsize }, { text: 'm(hd)/m', alignment: 'center', fontSize: contentFontsize }, { text: 'm', alignment: 'center', fontSize: contentFontsize }, { text: 'metres head', alignment: 'center', fontSize: contentFontsize }]
          ].concat(tee)

        },
        // width:[500],
        margin: [0, 0, 0, 10]
      });

      doc.content.push({
        pageBreak: 'before',
        text: "PRESSURE LOSS",
        bold: true,
        fontSize: 12,
        margin: [0, 10, 0, 5]
      });

      doc.content.push({
        style: 'table',
        table: {
          widths: ['*', '*', '*', '*', '*', '*', '*', '*', '*', '*'],
          body: [
            [{ text: "Predecessor ID", fontSize: contentFontsize }, { text: 'Pipe Run and OrderID', alignment: 'center', fontSize: contentFontsize }, { text: 'Room or Emitter', alignment: 'center', fontSize: contentFontsize }, { text: 'MassFlowRate ', alignment: 'center', fontSize: contentFontsize }, { text: 'MassFlowRate SubTotals', alignment: 'center', fontSize: contentFontsize }, { text: 'Pipe Selected', alignment: 'center', fontSize: contentFontsize }, { text: 'Pressure Loss Pa/m', alignment: 'center', fontSize: contentFontsize }, { text: 'Pressure Loss m(hd)/m', alignment: 'center', fontSize: contentFontsize }, { text: 'Pipe run Flow Length m', alignment: 'center', fontSize: contentFontsize }, { text: 'Total Pressure Loss metres head', alignment: 'center', fontSize: contentFontsize }]
          ].concat(roomsWithTee)

        },
        // width:[500],
        margin: [0, 0, 0, 10]
      });

      doc.content.push({
        pageBreak: 'before',
        text: "FINAL RESULT",
        bold: true,
        fontSize: 12,
        margin: [0, 10, 0, 5]
      });

      doc.content.push({
        style: 'table',
        table: {
          widths: ['*', '*', '*'],
          body: [

          ].concat(finalResult)

        },
        // width:[500],
        margin: [0, 0, 0, 10]
      });

      doc.content.push({

        style: 'table',
        table: {
          widths: ['*', '*', '*'],
          body: [

          ].concat(pumpSection)

        },
        // width:[500],
        margin: [0, 0, 0, 10]
      });

      doc.content.push({

        text: "INDEX CIRCUIT",
        bold: true,
        fontSize: 12,
        margin: [0, 10, 0, 20]
      });
      doc.content.push({

        text: "Pressure Loss (Pa/m)",
        bold: true,
        fontSize: 10,
        margin: [0, 10, 0, 15]
      });
      doc.content.push({

        columns: finalTableData,

      });

      doc.content.push({

        columns: indexTableDataTotalColumn,

      });




      pdfMake.createPdf(doc).download("pipe-calculation-report.pdf");
    }

    $scope.modalEditPrimaryFlowIndex = function (survey, item, type, optionList = "none", idx = -1) {
      modalService.setTemplateUrl('/partials/views/summary/components/_modal');
      modalService.setController('ModalEditController');
      let itemArr = item.split('.')
      let indx = idx;
      modalService.showModal(survey.surveys, item, idx, optionList, type).then(function (result) {
        $scope.survey.surveys = result.scope;
        if (itemArr[0] == 'tees') {
          getTees(indx)
        }
        apiService.update('surveys', $scope.survey).then(function (response) {
          getIndexEdit()

        }, commonService.onError)
      })
    };

    $scope.modalEditPredecessor = function (idx, key, type, teeId = '') {
      var modalInstance = $modal.open({
        animation: true,
        templateUrl: '/partials/views/summary/current-pipe-calculation/modals/modalCustomPredecessor',
        controller: 'ModalPipePredecessorController',
        size: 'md',
        resolve: {
          data: function () {
            return {
              index: idx,
              survey: $scope.survey,
              key: key,
              type: type,
              teeId: teeId
            }
          }
        }
      });

      modalInstance.result.then(function (survey) {
        //on modal ok
        $scope.survey = survey;
        //summaryHelperService.switchAndUpdateSurvey(null, "current-pipe-calculation", $scope.survey).then(function (res) {
        //$location.path('/current-pipe-calculation/' + $scope.survey._id);
        apiService.update('surveys', $scope.survey).then(function (response) {
        }, commonService.onError)
        //CalculateValues();
        //});
      }, function () {
        //on modal dismiss
      });
    };

    $scope.modalEditTeeNo = function (idx) {
      var modalInstance = $modal.open({
        animation: true,
        templateUrl: '/partials/views/summary/current-pipe-calculation/modals/modalTeeNo',
        controller: 'ModalTeeNoController',
        size: 'md',
        resolve: {
          data: function () {
            return {
              index: idx,
              survey: $scope.survey
            }
          }
        }
      });

      modalInstance.result.then(function (survey) {
        //on modal ok
        $scope.survey = survey;
        //summaryHelperService.switchAndUpdateSurvey(null, "current-pipe-calculation", $scope.survey).then(function (res) {
        //$location.path('/current-pipe-calculation/' + $scope.survey._id);
        apiService.update('surveys', $scope.survey).then(function (response) {
        }, commonService.onError)
        //CalculateValues();
        //});
      }, function () {
        //on modal dismiss
      });
    };

    $scope.modalEditPipeRun = function (idx, key, type, teeId) {
      var modalInstance = $modal.open({
        animation: true,
        templateUrl: '/partials/views/summary/current-pipe-calculation/modals/_modalPipeRun',
        controller: 'ModalPipeRunEditController',
        size: 'md',
        resolve: {
          data: function () {
            return {
              index: idx,
              survey: $scope.survey,
              key: key,
              type: type,
              teeId: teeId,
              subTotals: $scope.indiSubTotal
            }
          }
        }
      });

      modalInstance.result.then(function (survey) {
        $scope.survey = survey;
        //summaryHelperService.switchAndUpdateSurvey(null, "current-pipe-calculation", $scope.survey).then(function (res) {
        //$scope.computePipeNetworkRun = true
        //$location.path('/current-pipe-calculation/' + $scope.survey._id);
        //CalculateValues();
        //});
        apiService.update('surveys', $scope.survey).then(function (response) {
          $scope.computePipeNetworkRun = true
        }, commonService.onError)
      }, function () {
        //on modal dismiss
      });
    };
    $scope.applyInformation = function () {
      apiService.update('surveys', $scope.survey).then(function (response) {
        $scope.computePipeNetworkRun = true
      }, commonService.onError)
    }
    $scope.currentPipeCalculation = true

    $scope.removeRad = function (room, number) {
      if (confirm('Are you sure you want to delete ' + room.room_name + ' radiator ' + number + '?')) {
        if (number) {
          room.radiators[number] = null;

          if (!room.radiators['one'] &&
            room.radiators['one'] == null &&
            !room.radiators['two'] &&
            room.radiators['two'] == null &&
            !room.radiators['three'] &&
            room.radiators['three'] == null &&
            !room.radiators['four'] &&
            room.radiators['four'] == null &&
            !room.radiators['five'] &&
            room.radiators['five'] == null &&
            !room.radiators['six'] &&
            room.radiators['six'] == null) {
            // alert("all are null")
            room.hasRads = false;
          } else {
            // alert("has Rad")
            room.hasRads = true;
          }
        }
        summaryHelperService.switchAndUpdateSurvey(null, "current-pipe-calculation", $scope.survey, null, true).then(function () {
          //$location.path('/current-pipe-calculation/' + $scope.survey._id);
          init();
        });
      }
    };

    $scope.moveTo = function (location) {
      apiService.update('surveys', $scope.survey).then(function (response) {
        $scope.survey = response;

        $location.path('/' + location + '/' + $scope.survey._id);
      }, commonService.onError);
    };

    $scope.copyAll = function (collection) {
      $scope.copy.status = !$scope.copy.status;
      $scope.copy.collection = !!$scope.copy.status ? collection : null;
    };

    $scope.updateRooms = function (result, idx, item) {

      var radsplit = item.split('.');
      var check = radsplit[0] ? radsplit[0] : '';

      if (check == 'radiators') {

        var itemsplit = radsplit[1];
        var selRad = result[idx].radiators[itemsplit];

        if (selRad.height && selRad.length) {
          getRadsOutputWatts(selRad, itemsplit, idx)
        }
      }
      $scope.survey.surveys.rooms = result;
      let watts = $scope.survey.surveys.rooms[idx].heat_loss && $scope.survey.surveys.rooms[idx].heat_loss.total_watts / 1000;
      let sHeatCapacity = $scope.pipeSpecificHeatCapacity || $scope.specificHeatCapacity;
      $scope.survey.surveys.rooms[idx].specificHeatCapacity = sHeatCapacity;

      getMaxFlowTemp()
      getIndexEdit();

      if ($scope.survey.surveys.rooms[idx].flow_temperature != 'undefined' && $scope.survey.surveys.rooms[idx].deltat != 'undefined') {
        let deltat = parseFloat($scope.survey.surveys.rooms[idx].deltat);

        $scope.survey.surveys.rooms[idx].return_temperature = parseFloat($scope.survey.surveys.rooms[idx].flow_temperature) - deltat;
        $scope.survey.surveys.rooms[idx].pipe = {};
        if (!$scope.survey.surveys.rooms[idx].pipe.massFlowRate) {
          $scope.massFlowRate = $scope.survey.surveys.rooms[idx].pipe.massFlowRate = getMassFlowRate(watts, sHeatCapacity, deltat);
        } else {
          $scope.massFlowRate = $scope.survey.surveys.rooms[idx].pipe.massFlowRate;
        }

        if ($scope.survey.surveys.rooms[idx].pipe_nom_dia) {
          calculatePipeCalc(idx)
        }
        getRadiatorsDelta(idx);
      }
      $scope.survey.surveys.miniVeloSel = $scope.miniVeloSel;
      if (!$scope.survey.surveys.maxVeloSel) {
        $scope.survey.surveys.maxVeloSel = $scope.maxVeloSel
      }
      $scope.survey.surveys.fluid = $scope.fluid;
      $scope.survey.surveys.egContent = $scope.egContent;
      if ($scope.maxFlowTemp > 0) {
        let denVisco = getDensitynViscosity($scope.fluid);
        $scope.survey.surveys.density = denVisco.density;
        $scope.survey.surveys.dynamViscosity = $scope.dynamViscosity;
        $scope.survey.surveys.maxPressureLoss = $scope.maxPressureLoss;
        $scope.survey.surveys.pipeSpecificHeatCapacity = sHeatCapacity;
        //Final Data
        $scope.survey.surveys.pipeFinalData = $scope.finalData
        $scope.survey.surveys.pipeType = $scope.pipeType;

        if ($scope.survey.surveys.rooms[idx].pipe.meanVelosity == 0) {
          $scope.survey.surveys.rooms[idx].pipeVolumeCheck = "See Rads"
        } else {
          if ($scope.survey.surveys.rooms[idx].pipe.meanVelosity >= $scope.miniVeloSel && $scope.survey.surveys.rooms[idx].pipe.meanVelosity <= $scope.maxVeloSel) {
            $scope.survey.surveys.rooms[idx].pipeVolumeCheck = "Accepted"
          } else if ($scope.survey.surveys.rooms[idx].pipe.meanVelosity > $scope.maxVeloSel) {
            $scope.survey.surveys.rooms[idx].pipeVolumeCheck = "Increase Dia"
          } else {
            $scope.survey.surveys.rooms[idx].pipeVolumeCheck = "Reduce Dia"
          }
        }
        $scope.computeFinalData = true;
        //radsIndexUpdate();
      }
    }

    $scope.applyChange = function () {
      var count = 0
      if ($scope.survey.surveys.includedReport.pipeRadiators == 'YES') {
        angular.forEach($scope.survey.surveys.rooms, function (value, idx) {
          if (!$scope.survey.surveys.rooms[idx].selectPipeDia)
            count++;
          if (!$scope.survey.surveys.rooms[idx].selectRadsPipeDia)
            count++;
        })
        if (count > 0) {
          $scope.survey.surveys.includedReport.pipeRadiators = 'NO';
          alertService('warning', 'Information required!', "Please Fill The Required Information")
        }
      }
    }

    function getRadsOutputWatts (selRad, itemsplit, idx) {

      var length = selRad.length;
      var radOutputWatts;

      $scope.survey.surveys.rooms[idx].hasRads = true;

      if (selRad.type != "Custom") {
        var radiator = _.find(radiators, function (rad) {
          return rad.type == selRad.type;
        });
        _.each(radiator.heights, function (rad_height, rad_idx) {
          if (rad_height == selRad.height)
            radOutputWatts = radiator.watts[rad_idx];
        });
        let flowTempArray = [35, 40, 45, 50, 55, 60];
        $scope.survey.surveys.rooms[idx].radiators[itemsplit].flow_output = [];
        $scope.survey.surveys.rooms[idx].total_flow = [0, 0, 0, 0, 0, 0];

        if (radiator.section_length == 'N/A')
          $scope.survey.surveys.rooms[idx].radiators[itemsplit].watts = Math.round((length / 100) * radOutputWatts);
        else
          $scope.survey.surveys.rooms[idx].radiators[itemsplit].watts = Math.round((length / radiator.section_length) * radOutputWatts);

        _.each(flowTempArray, function (temp, temp_idx) {
          var lessTemp = temp - ($scope.survey.surveys.rooms[idx].designed_temperature);
          var conversionFactor = Math.pow((lessTemp / 50), 1.3);
          $scope.survey.surveys.rooms[idx].radiators[itemsplit].flow_output[temp_idx] = Math.round($scope.survey.surveys.rooms[idx].radiators[itemsplit].watts * conversionFactor);
          $scope.survey.surveys.rooms[idx].total_flow[temp_idx] += $scope.survey.surveys.rooms[idx].radiators[itemsplit].flow_output[temp_idx];
        });

        var flowTemp = $scope.survey.surveys.rooms[idx].flow_temperature
        var retTemp = $scope.survey.surveys.rooms[idx].return_temperature
        var meanTemp = (flowTemp + retTemp) / 2;
        let meanTempKey = 0;
        flowTempArray.forEach(function (val, key) {
          if (val == meanTemp) {
            meanTempKey = key;
          }
        });

        let outKW = 0;
        if (flowTempArray.includes(meanTemp)) {
          outKW = $scope.survey.surveys.rooms[idx].radiators[itemsplit].flow_output[meanTempKey]
        } else if (meanTemp >= 35 && meanTemp <= 60) {
          let rndMeanvalue = Math.ceil(meanTemp / 5) * 5
          let rndMean = flowTempArray.indexOf(rndMeanvalue);
          outKW = $scope.survey.surveys.rooms[idx].radiators[itemsplit].flow_output[rndMean]
        } else if (meanTemp < 35) {
          outKW = $scope.survey.surveys.rooms[idx].radiators[itemsplit].flow_output[0]
        } else if (meanTemp > 60) {
          outKW = $scope.survey.surveys.rooms[idx].radiators[itemsplit].flow_output[5]
        } else {
          outKW = radOutputWatts
        }
        $scope.survey.surveys.rooms[idx].radiators[itemsplit].outputKW = outKW
        radOutputWatts = outKW
      } else {
        $scope.survey.surveys.rooms[idx].radiators[itemsplit].outputKW = selRad.watts
        radOutputWatts = parseFloat(selRad.watts);
      }
      if (radOutputWatts != 0) {
        $scope.survey.surveys.rooms[idx].radiators[itemsplit].index_circuit = "No";
        $scope.survey.surveys.rooms[idx].radiators[itemsplit].watts = radOutputWatts;
        let calcWats = radOutputWatts;
        if (selRad.type != "Custom") {
          calcWats = radOutputWatts / 1000;
        }
        var speheadcapa = $scope.survey.surveys.pipeSpecificHeatCapacity ? parseFloat($scope.survey.surveys.pipeSpecificHeatCapacity) : parseFloat($scope.specificHeatCapacity);
        if ($scope.survey.surveys.rooms[idx].deltat > 0) {
          var radsMass = parseFloat(calcWats) / (speheadcapa * parseFloat($scope.survey.surveys.rooms[idx].deltat));
          $scope.survey.surveys.rooms[idx].radiators[itemsplit].massFlowRate = parseFloat(radsMass)
          var radsPipe = $scope.survey.surveys.rooms[idx].radiators[itemsplit].pipeSelected = $scope.survey.surveys.rooms[idx].radiators[itemsplit].pipeSelected;

          $scope.survey.surveys.rooms[idx].radiators[itemsplit].selectPipeDia = false;
          $scope.survey.surveys.rooms[idx].selectRadsPipeDia = false;

          if (radsPipe > 0) {
            calculatePipeCalcRad(idx, itemsplit, true)
          }
        } else {
          alertService('danger', 'DeltaT value required for this room', 'Please enter a required value')
        }

      }
    }

    function calculatePipeCalc (idx) {
      $scope.densityViscosity = getDensitynViscosity($scope.fluid);
      $scope.survey.surveys.rooms[idx].pipe.meanVelosity = getMeanVelosity(idx);
      $scope.survey.surveys.rooms[idx].pipe.volumetricFlowRate = getVolumetricFlowRate(idx);
      $scope.survey.surveys.rooms[idx].pipe.reynoldsNumber = getReynoldsNumber(idx);
      $scope.frictionFactor = getFrictionFactor(idx);
      let pressureLoss = $scope.survey.surveys.rooms[idx].pipe.pressureLossPA = getPressureLoss(idx);
      let m = pressureLoss / 9804.139432;
      let pressureLossM = $scope.survey.surveys.rooms[idx].pipe.pressureLossM = m;
      if ($scope.survey.surveys.rooms[idx].flowReturnPipes >= 0) {
        $scope.survey.surveys.rooms[idx].selectPipeDia = true;
        if ($scope.survey.surveys.rooms[idx].hasRads) {
          $scope.survey.surveys.rooms[idx].selectPipeDia = false
        }
        let lengthFlowReturn = $scope.survey.surveys.rooms[idx].flowReturnPipes;
        let tot = pressureLossM * lengthFlowReturn;
        $scope.survey.surveys.rooms[idx].pipe.totPressureLoss = tot;
        if ($scope.diameter[0] != undefined) {
          $scope.survey.surveys.rooms[idx].pipe.waterVolInPipe = ($scope.diameter[0].Litres * lengthFlowReturn);
        }
      } else {
        $scope.survey.surveys.rooms[idx].selectPipeDia = false;
        if ($scope.survey.surveys.rooms[idx].hasRads) {
          $scope.survey.surveys.rooms[idx].selectPipeDia = true;
        }
      }

    }

    function calculatePipeCalcRad (idx, itemsplit, showAlert = false) {
      $scope.densityViscosity = getDensitynViscosity($scope.fluid);
      let meanrad = $scope.survey.surveys.rooms[idx].radiators[itemsplit].radsMean = getMeanVelosity(idx, itemsplit);
      $scope.survey.surveys.rooms[idx].radiators[itemsplit].radsVolumeFlow = getVolumetricFlowRate(idx, itemsplit);
      $scope.survey.surveys.rooms[idx].radiators[itemsplit].radsreynoldsNumber = getReynoldsNumber(idx, itemsplit);
      $scope.radsFrictionFactor = getFrictionFactor(idx, itemsplit);
      let radpressureLoss = $scope.survey.surveys.rooms[idx].radiators[itemsplit].radspressureLossPA = getPressureLoss(idx, itemsplit);
      let m = radpressureLoss / 9804.139432;
      let radpressureLossM = $scope.survey.surveys.rooms[idx].radiators[itemsplit].radspressureLossM = m;
      let radFlowReturn = $scope.survey.surveys.rooms[idx].radiators[itemsplit].radsFlowreturn;
      if (radFlowReturn != null) {
        let radTotal = radpressureLossM * radFlowReturn;
        let radTotalLoss;
        if ($scope.survey.surveys.rooms[idx].pipe.totPressureLoss >= 0) {
          radTotalLoss = parseFloat($scope.survey.surveys.rooms[idx].pipe.totPressureLoss) + radTotal
        } else {
          // if (showAlert == true) {
          //   $scope.survey.surveys.rooms[idx].radiators[itemsplit].radsFlowreturn = null
          //   alertService('danger', 'Room\'s Total pressure loss value is required', 'Please enter a required value')
          // }
          radTotalLoss = 0 + radTotal
        }
        $scope.survey.surveys.rooms[idx].radiators[itemsplit].radsTotalPressureLoss = radTotalLoss;
        if ($scope.diameter[0] != undefined) {
          $scope.survey.surveys.rooms[idx].radiators[itemsplit].radswaterVolInPipe = ($scope.diameter[0].Litres * radFlowReturn);
          $scope.survey.surveys.rooms[idx].selectRadsPipeDia = true;
        }
      } else {
        $scope.survey.surveys.rooms[idx].selectRadsPipeDia = false;
      }
      if (meanrad >= $scope.miniVeloSel && meanrad <= $scope.maxVeloSel) {
        $scope.survey.surveys.rooms[idx].radiators[itemsplit].radspipeVolumeCheck = "Accepted"
      } else if (meanrad > $scope.maxVeloSel) {
        $scope.survey.surveys.rooms[idx].radiators[itemsplit].radspipeVolumeCheck = "Increase Dia"
      } else {
        $scope.survey.surveys.rooms[idx].radiators[itemsplit].radspipeVolumeCheck = "Reduce Dia"
      }
    }


    $scope.modalEdit = function (item, idx, property, typ) {
      var split = item.split('.');
      var copiedValue;
      var rooms = $scope.survey.surveys.rooms;
      if (!!$scope.copy.status && item == $scope.copy.collection) {
        //get copied value
        copiedValue = rooms[idx];
        angular.forEach(split, function (i) {
          copiedValue = copiedValue[i];
        });
        //paste it to all rooms
        angular.forEach(rooms, function (rm, index) {
          $scope.survey.surveys.rooms[index][split[0]] = copiedValue;

          $scope.updateRooms($scope.survey.surveys.rooms, index, item)
        });
        $scope.copy.status = false;

      } else {
        $scope.copy.status = false;

        modalService.setTemplateUrl('/partials/views/summary/components/_modal');
        modalService.setController('ModalEditController');
        modalService.showModal($scope.survey.surveys.rooms, item, idx, property, typ).then(function (result) {
          $scope.updateRooms(result.scope, idx, item)
          //calculationService.initialize($scope.survey, idx);
          $scope.survey.surveys.rooms = result.scope;
          summaryHelperService.switchAndUpdateSurvey(null, "current-pipe-calculation", $scope.survey, null, true).then(function (res) {
            //$location.path('/current-pipe-calculation/' + $scope.survey._id);
            //CalculateValues();
          });

        });
      }
    };

    $scope.roomMax1 = [];
    function updateRoomsCalculations () {
      angular.forEach($scope.survey.surveys.rooms, function (value, idx) {
        // indexCircuit(idx);
        let watts = parseFloat((value.heat_loss && value.heat_loss.total_watts || 0) / 1000);
        $scope.survey.surveys.rooms[idx].t_watts = watts;

        if ($scope.survey.surveys.rooms[idx].flow_temperature != undefined && $scope.survey.surveys.rooms[idx].deltat != undefined) {
          $scope.survey.surveys.rooms[idx].return_temperature = $scope.return_temperature = $scope.survey.surveys.rooms[idx].flow_temperature - $scope.survey.surveys.rooms[idx].deltat;
          let wa = $scope.survey.surveys.rooms[idx].heat_loss.total_watts / 1000
          let sFluid = $scope.survey.surveys.fluid ? $scope.survey.surveys.fluid : $scope.fluid;
          $scope.pipeSpecificHeatCapacity = getSpecificHeatCapacity(sFluid)
          if ($scope.survey.surveys.rooms[idx].pipe == undefined) {
            $scope.survey.surveys.rooms[idx].pipe = {}
          }
          $scope.survey.surveys.rooms[idx].pipe.massFlowRate = getMassFlowRate(wa, $scope.pipeSpecificHeatCapacity, $scope.survey.surveys.rooms[idx].deltat);

          if ($scope.survey.surveys.rooms[idx].pipe_nom_dia) {
            calculatePipeCalc(idx)
          }
        } else {
          $scope.survey.surveys.rooms[idx].selectPipeDia = false;
          if ($scope.survey.surveys.rooms[idx].hasRads) {
            $scope.survey.surveys.rooms[idx].selectPipeDia = true;
          }
        }
        $scope.survey.surveys.rooms[idx].index_circuit = "No";

        let curRoom = $scope.survey.surveys.rooms[idx];
        getPredecessorId(curRoom)

        let radsList = $scope.survey.surveys.rooms[idx].radiators;
        // if(radsList){
        //   $scope.survey.surveys.rooms[idx].pipe.massFlowRate = 0;
        // }
        if ($scope.survey.surveys.rooms[idx].pipe) {
          if ($scope.survey.surveys.rooms[idx].pipe.waterVolInPipe > 0) {
            let ltrs = $scope.survey.surveys.rooms[idx].pipe.waterVolInPipe
            $scope.finalData.totalLitres = parseFloat($scope.finalData.totalLitres + ltrs)
          }
          if ($scope.survey.surveys.rooms[idx].pipe.massFlowRate) {
            let tMassFlow = $scope.survey.surveys.rooms[idx].pipe.massFlowRate;
            $scope.finalData.totalMassFlow.push(tMassFlow)
          }
        }
        $scope.survey.surveys.rooms[idx].hasRads = false
        if (radsList) {
          var keys = Object.keys(radsList);
          let radMax = null;
          //for (var j = 0; j < radsList.length; j++) {
          if (keys.length > 0) {
            angular.forEach(keys, function (val, j) {
              if (radsList[val] != null || radsList[val] != undefined) {
                $scope.survey.surveys.rooms[idx].hasRads = true
                var selRad = radsList[val];

                if (selRad.height && selRad.length) {
                  getRadsOutputWatts(selRad, val, idx)
                }

                if (radsList[val].type == "") {
                  $scope.survey.surveys.rooms[idx].selectRadsPipeDia = true;
                }
                if (radsList[val].type && radsList[val].pipeSelected && radsList[val].pipeSelected > 0 && radsList[val].radsFlowreturn && radsList[val].radsFlowreturn > 0) {
                  $scope.survey.surveys.rooms[idx].selectRadsPipeDia = true;
                }
                let speHeatCapa = $scope.survey.surveys.pipeSpecificHeatCapacity ? parseFloat($scope.survey.surveys.pipeSpecificHeatCapacity) : parseFloat($scope.specificHeatCapacity);
                let calcWats
                if ($scope.survey.surveys.rooms[idx].radiators[val].type != "Custom") {
                  calcWats = parseFloat($scope.survey.surveys.rooms[idx].radiators[val].outputKW) / 1000;
                } else {
                  calcWats = $scope.survey.surveys.rooms[idx].radiators[val].watts;
                }
                $scope.survey.surveys.rooms[idx].radiators[val].massFlowRate = parseFloat(calcWats) / (speHeatCapa * parseFloat($scope.survey.surveys.rooms[idx].deltat));
                if ($scope.survey.surveys.rooms[idx].radiators[val].radswaterVolInPipe) {
                  let radsltrs = $scope.survey.surveys.rooms[idx].radiators[val].radswaterVolInPipe;
                  $scope.finalData.totalLitres = $scope.finalData.totalLitres + radsltrs;
                }
                if ($scope.survey.surveys.rooms[idx].radiators[val].massFlowRate) {
                  let radMassFl = $scope.survey.surveys.rooms[idx].radiators[val].massFlowRate;
                  $scope.finalData.totalMassFlow.push(radMassFl)
                }

                if (radsList[val].hasOwnProperty('radsTotalPressureLoss')) {
                  if (parseFloat($scope.survey.surveys.rooms[idx].radiators[val].radsTotalPressureLoss) > 0) {
                    radsList[val].room_name = $scope.survey.surveys.rooms[idx].room_name;
                    radsList[val].index_circuit = "No";
                    if (radMax == null) {
                      radMax = radsList[val];
                    } else if (radsList[val].radsTotalPressureLoss > radMax.radsTotalPressureLoss) {

                      radMax = radsList[val];
                    }
                  }
                }
              } else {
                if ($scope.survey.surveys.rooms[idx].radiators[val] != null) {
                  $scope.survey.surveys.rooms[idx].selectRadsPipeDia = true;
                }
              }
            });
            if (radMax != null) {
              $scope.roomMax1.push(radMax);
            }
          }
        } else {
          $scope.survey.surveys.rooms[idx].selectRadsPipeDia = true;
        }
        $scope.survey.surveys.rooms[idx].index_circuit = "No";
        getComputeState(idx)
      });

    }

    function init () {

      $scope.user = $rootScope.user
      apiService.get('surveys', {
        _id: $routeParams.id
      }).then(function (survey) {
        $scope.survey = survey
        $scope.survey.surveys.page = 'pipe';
        $scope.egContent = $scope.survey.surveys.egContent ? $scope.survey.surveys.egContent : 0;
        $scope.survey.surveys.miniVeloSel ? $scope.survey.surveys.miniVeloSel : $scope.miniVeloSel
        if (!$scope.survey.surveys.maxVeloSel) {
          $scope.survey.surveys.maxVeloSel = $scope.maxVeloSel
        }
        $scope.maxPressureLoss = $scope.survey.surveys.maxPressureLoss ? $scope.survey.surveys.maxPressureLoss : 300;
        $scope.fluid = $scope.survey.surveys.fluid ? $scope.survey.surveys.fluid : "Water";

        if ($scope.fluid == 'Water') {
          $scope.contents = false;
        } else {
          $scope.contents = true;
        }

        $scope.pipeType = $scope.survey.surveys.pipeType ? $scope.survey.surveys.pipeType : $scope.pipeCollection[0];

        if ($scope.survey.surveys.includedReport.hasOwnProperty('pipeTemp')) {
          $scope.pipeTempSelect = $scope.survey.surveys.includedReport['pipeTemp']
        }

        $scope.finalData.totalLitres = 0
        $scope.finalData.totalMass = ''
        $scope.finalData.totalMassFlow = []
        //$scope.oldRooms = $scope.survey.surveys.rooms
        //get mass flow rate of all rooms
        getMaxFlowTemp();

        $scope.hideComputeButton = false
        $scope.computeFinalData = true
        if ($scope.survey.surveys.primaryFlowIndex) {
          $scope.primaryFlowIndex = $scope.survey.surveys.primaryFlowIndex;
        }

        $scope.canDeriveTable2 = true;

        updateRoomsCalculations();

        $scope.roomsForNetwork = $scope.survey.surveys.rooms;

        if ($scope.roomMax1.length > 0) {
          var selMax = $scope.roomMax1[0];
          for (let j = 1; j < $scope.roomMax1.length; j++) {
            if ($scope.roomMax1[j] != null || $scope.roomMax1[j] != undefined) {
              if ($scope.roomMax1[j].radsTotalPressureLoss > selMax.radsTotalPressureLoss) {
                selMax = $scope.roomMax1[j];
              }
            }
          }

          $scope.survey.surveys.rooms.filter(function (obj, i) {
            if (obj.room_name == selMax.room_name) {
              _.each(obj.radiators, function (val, index) {
                if (val != null) {
                  if (val.radsTotalPressureLoss == selMax.radsTotalPressureLoss) {
                    // $scope.finalData.roomName = obj.room_name;
                    // $scope.finalData.radName = selMax.type
                    if (selMax.radsTotalPressureLoss) {
                      selMax.index_circuit = "Yes";
                      $scope.finalData.radsTotalPressureLoss = selMax.radsTotalPressureLoss;
                    } else {
                      selMax.index_circuit = "No";
                      $scope.finalData.radsTotalPressureLoss = 0;
                    }
                  }
                }
              });
              obj.index_circuit = "Yes";
              return obj;
            }
          })
        }

        if ($scope.fluid == 'Water') {
          $scope.contents = false;
        } else {
          $scope.contents = true;
        }

        if ($scope.maxFlowTemp > 0) {
          let denVisco = getDensitynViscosity($scope.fluid);
          $scope.density = denVisco.density
          $scope.dynamViscosity = denVisco.viscosity

          let selFluid = $scope.survey.surveys.fluid ? $scope.survey.surveys.fluid : $scope.fluid;
          $scope.pipeSpecificHeatCapacity = getSpecificHeatCapacity(selFluid)
          //$scope.indexEdit();
          getIndexEdit()

          $scope.finalData.pipeSystem = "1";
          //$scope.computeFinalData = false;
          //let finalsubTotal = parseFloat($scope.finalData.radsTotalPressureLoss) + parseFloat($scope.finalData.totPreLoss);
          //$scope.finalData.icsubTotal = $scope.finalTotalPressure.value.toFixed(3)
          //$scope.finalData.allowsubTotal = (parseFloat($scope.finalTotalPressure.value) * (parseFloat($scope.finalData.allowSubTotalPercent) / 100)).toFixed(3)
          //$scope.finalData.totPresLoss = ((parseFloat(finalsubTotal) + parseFloat($scope.finalData.allowsubTotal)) * 2).toFixed(3)
          //let sums = parseFloat($scope.finalData.icsubTotal) + parseFloat($scope.finalData.allowsubTotal);
          //$scope.finalData.totPresLoss = (parseFloat(sums) * $scope.finalData.pipeSystem).toFixed(3)
          //$scope.finalData.totPreLoss = 0;
          //$scope.finalData.totalMass = Math.max(...$scope.finalData.totalMassFlow)
        }

        //create log
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

    $scope.updateNetworkRun = function () {
      updatePipeNetworkRun();
      // $scope.updateFinalData()
    }

    $scope.openVisualEditor = function () {
      const tees = $scope.tees && $scope.tees.length ? $scope.tees : (
        $scope.survey && $scope.survey.surveys && $scope.survey.surveys.tees || []
      );

      let diameters = $scope.pipeInfo && $scope.pipeInfo[0] && $scope.pipeInfo[0].dia;

      if (!diameters) {
        const pipe = $rootScope.pipe_data.pipes.find((obj) => {
          return obj.name === $scope.pipeType;
        });

        if (pipe) {
          diameters = pipe.dia;
        }
      }

      var modalInstance = $modal.open({
        animation: true,
        templateUrl: '/partials/views/summary/current-pipe-calculation/visual-editor/pipes-visual.editor.controller.jade',
        controller: 'ModalPipesVisualEditorController',
        size: 'xl',
        backdrop: 'static',
        resolve: {
          data: function () {
            return {
              rooms: $scope.survey.surveys.rooms || [],
              tees,
              diameters: diameters || [],
              priFlowText: $scope.priFlowText,
            }
          }
        }
      });

      modalInstance.result.then((data) => {
        $scope.survey.surveys.rooms = data.rooms;
        $scope.survey.surveys.tees = data.tees;
        apiService.update("surveys", $scope.survey).then(function (res) {
          $scope.computePipeNetworkRun = true;

          //updatePipeNetworkRun();
          updateRoomsCalculations();
          //init()
        }, commonService.onError);
        // apiService.update('surveys', $scope.survey).then(function (response) {

        // },);
      });
    }

    function strToObj (str) {
      let obj = {};
      let subStr = str.substring(1, str.length - 1)
      let mainSpl = subStr.split(',');
      let subSplOne = mainSpl[0].split(':');
      let subSplTwo = mainSpl[1].split(':');

      obj[subSplOne[0]] = subSplOne[1]
      obj[subSplTwo[0]] = parseFloat(subSplTwo[1])
      return obj;
    }
    function compare (a, b) {
      if (a.pipeRunData == undefined) {
        alertService('danger', 'Rooms and Rads "Pipe Run and OrderID" needs to be filled in', 'Please enter all required value')
        return false;
      }
      const bandA = a.pipeRunData.pipeRunAndOrderId.toUpperCase();
      const bandB = b.pipeRunData.pipeRunAndOrderId.toUpperCase();

      let comparison = 0;
      if (bandA > bandB) {
        comparison = 1;
      } else if (bandA < bandB) {
        comparison = -1;
      }
      return comparison;
    }
    $scope.veiwTree = function () {
      $scope.treeList = []
      if ($scope.visibleTree) {
        $scope.visibleTree = false
        $scope.visibleTreeContent = "View Tree";
      } else {

        $scope.visibleTree = true
        $scope.visibleTreeContent = "Hide Tree";
        updatePipeNetworkRun()
      }


    }
    $scope.treeChart = function (data) {
      var chart = am4core.create("treediv", am4plugins_forceDirected.ForceDirectedTree);

      // Create series
      // chart.exporting.menu = new am4core.ExportMenu();
      var series = chart.series.push(new am4plugins_forceDirected.ForceDirectedSeries())

      // Set data
      series.data = data

      series.dataFields.value = "massFlowSubTotal";
      series.dataFields.name = "pipeRunAndOrderId";
      series.dataFields.children = "children";

      // Add labels
      series.nodes.template.label.html = "<span>{name}</span><br><span style='color:green'>{massFlowSubTotal}</span><br><span style='color:red'>{massFlowRate}</span><br><span style='color:yellow'>{rads}</span>";
      // series.nodes.template.label.text = "{name}";
      series.fontSize = 10;
      series.minRadius = 40;
      series.maxRadius = 40;

      series.centerStrength = 0.5;
      series.events.on("inited", function () {
        series.animate({ property: "velocityDecay", to: 1 }, 3000);
      })
      //  var root = am5.Root.new("treediv");

      //             root.setThemes([
      //               am5themes_Animated.new(root)
      //             ]);
      //             var data = data


      //             var container = root.container.children.push(
      //               am5.Container.new(root, {
      //                 width: am5.percent(100),
      //                 height: am5.percent(100),
      //                 layout: root.verticalLayout
      //               })
      //             );

      //             var series = container.children.push(
      //               am5hierarchy.Tree.new(root, {
      //                 singleBranchOnly: false,
      //                 downDepth: 1,
      //                 initialDepth: 5,
      //                 topDepth: 0,
      //                 valueField: "massFlowSubTotal",
      //                 categoryField: "pipeRunAndOrderId",
      //                 childDataField: "children",
      //                 subField : "massFlowSubTotal"
      //               })
      //             );

      //             series.circles.template.setAll({
      //               radius: 40
      //             });

      //             series.outerCircles.template.setAll({
      //               radius: 40
      //             });
      //             series.nodes.template.html = "<i>{pipeRunAndOrderId}</i>"
      //             series.data.setAll(data);
      //             series.set("selectedDataItem", series.dataItems[0]);


    }

    /* Compute function */
    var ignoredRooms = []
    function updatePipeNetworkRun () {
      apiService.get('surveys', {
        _id: $routeParams.id
      }).then(function (survey) {
        // start of Thomas' code.
        /*
           We view the network as a set of nodes and edges.
           The nodes are the rooms, the tees, the radiators, the cylinder and the boiler.
           The edges are the pipes that connect the nodes.
        */
        $scope.survey = survey;

        var radslist = []
        var allRooms = $scope.survey.surveys.rooms
        var calRooms = $scope.survey.surveys.rooms.filter(function (val) { return !val.pipeRoomIgnore; });
        $scope.survey.surveys.rooms = calRooms
        $scope.treeData = $scope.survey.surveys.rooms.map(function (data) {
          var rads

          if (data?.radiators?.one?.pipeRunAndOrderId != undefined || data?.radiators?.one?.pipeRunAndOrderId != null) {
            // rads?.push(data?.radiators?.one?.pipeRunAndOrderId)
            rads = "#" + data?.radiators?.one?.pipeRunAndOrderId
            var one = {
              "predecessorId": data?.radiators?.one?.predecessorId,
              "pipeRunAndOrderId": data?.radiators?.one?.pipeRunAndOrderId,
              "massFlowSubTotal": data?.radiators?.one?.massFlowSubTotal?.toFixed(4),
              "massFlowRate": data?.radiators?.one?.massFlowRate?.toFixed(4),
              "rads": null,
              "children": [],
              "suffix": "#",
              "flowLength": data?.radiators?.one?.radsFlowreturn + "m"
            }
            radslist.push(one)
          }
          if (data?.radiators?.two?.pipeRunAndOrderId != undefined || data?.radiators?.two?.pipeRunAndOrderId != null) {
            // rads.push(data?.radiators['two']?.pipeRunAndOrderId)
            rads = rads + "," + "#" + data?.radiators?.two?.pipeRunAndOrderId
            var two = {
              "predecessorId": data?.radiators?.two?.predecessorId,
              "pipeRunAndOrderId": data?.radiators?.two?.pipeRunAndOrderId,
              "massFlowSubTotal": data?.radiators?.two?.massFlowSubTotal?.toFixed(4),
              "massFlowRate": data?.radiators?.two?.massFlowRate?.toFixed(4),
              "rads": null,
              "children": [],
              "suffix": "#",
              "flowLength": data?.radiators?.two?.radsFlowreturn + "m"
            }
            radslist.push(two)
          }
          if (data?.radiators?.three?.pipeRunAndOrderId != undefined || data?.radiators?.three?.pipeRunAndOrderId != null) {
            // rads.push(data?.radiators?.three?.pipeRunAndOrderId)
            rads = rads + "," + "#" + data?.radiators?.three?.pipeRunAndOrderId
            var three = {
              "predecessorId": data?.radiators?.three?.predecessorId,
              "pipeRunAndOrderId": data?.radiators?.three?.pipeRunAndOrderId,
              "massFlowSubTotal": data?.radiators?.three?.massFlowSubTotal?.toFixed(4),
              "massFlowRate": data?.radiators?.three?.massFlowRate?.toFixed(4),
              "rads": null,
              "children": [],
              "suffix": "#",
              "flowLength": data?.radiators?.three?.radsFlowreturn + "m"
            }
            radslist.push(three)
          }
          if (data?.radiators?.four?.pipeRunAndOrderId != undefined || data?.radiators?.four?.pipeRunAndOrderId != null) {
            // rads.push(data?.radiators?.four?.pipeRunAndOrderId)
            rads = rads + "," + "#" + data?.radiators?.four?.pipeRunAndOrderId
            var four = {
              "predecessorId": data?.radiators?.four?.predecessorId,
              "pipeRunAndOrderId": data?.radiators?.four?.pipeRunAndOrderId,
              "massFlowSubTotal": data?.radiators?.four?.massFlowSubTotal?.toFixed(4),
              "massFlowRate": data?.radiators?.four?.massFlowRate?.toFixed(4),
              "rads": null,
              "children": [],
              "suffix": "#",
              "flowLength": data?.radiators?.four?.radsFlowreturn + "m"
            }
            radslist.push(four)

          }
          if (data?.radiators?.five?.pipeRunAndOrderId != undefined || data?.radiators?.five?.pipeRunAndOrderId != null) {
            // rads.push(data.radiators?.five?.pipeRunAndOrderId)
            rads = rads + "," + "#" + data?.radiators?.five?.pipeRunAndOrderId
            var five = {
              "predecessorId": data?.radiators?.five?.predecessorId,
              "pipeRunAndOrderId": data?.radiators?.five?.pipeRunAndOrderId,
              "massFlowSubTotal": data?.radiators?.five?.massFlowSubTotal?.toFixed(4),
              "massFlowRate": data?.radiators?.five?.massFlowRate?.toFixed(4),
              "rads": null,
              "children": [],
              "suffix": "#",
              "flowLength": data?.radiators?.five?.radsFlowreturn + "m"
            }
            radslist.push(five)
          }
          if (data?.radiators?.six?.pipeRunAndOrderId != undefined || data?.radiators?.six?.pipeRunAndOrderId != null) {
            // rads.push(data?.radiators?.six?.pipeRunAndOrderId)
            rads = rads + "," + "#" + data?.radiators?.six?.pipeRunAndOrderId
            var six = {
              "predecessorId": data?.radiators?.six?.predecessorId,
              "pipeRunAndOrderId": data?.radiators?.six?.pipeRunAndOrderId,
              "massFlowSubTotal": data?.radiators?.six?.massFlowSubTotal?.toFixed(4),
              "massFlowRate": data?.radiators?.six?.massFlowRate?.toFixed(4),
              "rads": null,
              "children": [],
              "suffix": "#",
              "flowLength": data?.radiators?.six?.radsFlowreturn + "m"
            }
            radslist.push(six)
          }
          // $scope.treeData = $scope.treeData?.concat(radslist);
          return {
            "predecessorId": data.pipeRunData.predecessorId,
            "pipeRunAndOrderId": data.pipeRunData.pipeRunAndOrderId,
            "massFlowSubTotal": data.massFlowSubTotal?.toFixed(4),
            "massFlowRate": data.pipe.massFlowRate?.toFixed(4),
            "rads": rads,
            "children": [],
            "suffix": "",
            "flowLength": data?.flowReturnPipes ? data?.flowReturnPipes + "m" : null

          }
        })
        if ($scope.survey.surveys.tees) {
          if ($scope.survey.surveys.tees.length != 0) {
            var newTeeArray = $scope.survey.surveys.tees.map(function (data) {
              return {
                "predecessorId": data.preId,
                "pipeRunAndOrderId": "tee" + data.teeNo,
                "massFlowSubTotal": data.massFlowSubTotal?.toFixed(4),
                "massFlowRate": null,
                "rads": null,
                "children": [],
                "suffix": "",
                "flowLength": data?.pipeRunFlowLength + "m"
              }
            })
            $scope.treeData = $scope.treeData.concat(newTeeArray);
            $scope.treeData = $scope.treeData.concat(radslist);
          }
        }
        if (!$scope.survey.surveys.tees || $scope.survey.surveys.tees.length == 0) {
          $scope.treeData = $scope.treeData.concat(radslist);
        }
        var hsData = {
          "predecessorId": "start",
          "pipeRunAndOrderId": "Heat Source",
          "massFlowSubTotal": null,
          "massFlowRate": null,
          "rads": null,
          "children": [],
          "suffix": "",
          "flowLength": null
        }
        $scope.treeData.push(hsData)
        // Prevent changes to the original data

        const arrayCopy = $scope.treeData.map(item => ({ ...item }));

        const listToTree = list => {
          const map = {};
          const roots = [];

          list.forEach((v, i) => {
            map[v.pipeRunAndOrderId] = i;
            // list[i].children = [];
          });

          list.forEach(v => (v.predecessorId !== 'start' ? list[map[v.predecessorId]]?.children?.push(v) : roots.push(v)));

          return roots;
        };

        var root = listToTree(arrayCopy)

        $scope.treeList = root
        // $scope.treeChart(root)



        var numberOfTees = 0;

        if ($scope.survey.surveys.hasOwnProperty("tees") == true) {
          numberOfTees = $scope.survey.surveys.tees.length;
        }

        var numberOfRooms = $scope.survey.surveys.rooms.length;

        // Get sums of radiator MFRs and store them for each room.

        var numbers = ["one", "two", "three", "four", "five", "six", "seven", "eight", "nine", "ten", "eleven", "twelve", "thirteen", "fourteen", "fifteen"];

        for (var i = 0; i < numberOfRooms; i++) {
          $scope.survey.surveys.rooms[i].massFlowSubTotal = $scope.survey.surveys.rooms[i].pipe.massFlowRate;
          if ($scope.survey.surveys.rooms[i].hasRads == true) {
            var numberOfRadiators = Object.keys($scope.survey.surveys.rooms[i].radiators).length;
            var tmpMFR = 0;
            for (var j = 0; j < numberOfRadiators; j++) {
              if ($scope.survey.surveys.rooms[i].radiators[numbers[j]] != null) {
                tmpMFR += $scope.survey.surveys.rooms[i].radiators[numbers[j]].massFlowRate;
                $scope.survey.surveys.rooms[i].radiators[numbers[j]].massFlowSubTotal = $scope.survey.surveys.rooms[i].radiators[numbers[j]].massFlowRate;
              }
            }
            $scope.survey.surveys.rooms[i].massFlowSubTotal += tmpMFR;
          }
        }

        /*
           Compute shortest routes from the boiler to the leaves of the tree,
           using Dijkstra's algorithm.
           The leaves can only be rooms, radiators or the cylinder.
        */

        // Loop through tees, rooms and radiators to populate the sets of nodes and edges.

        var nodes = []; // Node names.
        var nodesID = [];

        for (var i = 0; i < numberOfRooms; i++) {
          nodes.push($scope.survey.surveys.rooms[i].room_name);
          if ($scope.survey.surveys.rooms[i].pipeRunData.pipeRunAndOrderId) {
            nodesID.push($scope.survey.surveys.rooms[i].pipeRunData.pipeRunAndOrderId);
            if ($scope.survey.surveys.rooms[i].hasRads == true) {
              for (var j = 0; j < Object.keys($scope.survey.surveys.rooms[i].radiators).length; j++) {
                if ($scope.survey.surveys.rooms[i].radiators[numbers[j]] != null) {
                  nodesID.push($scope.survey.surveys.rooms[i].radiators[numbers[j]].pipeRunAndOrderId);
                }
              }
            }
          }
        }

        if ($scope.survey.surveys.hasOwnProperty("tees") == true) {
          for (var i = 0; i < numberOfTees; i++) {
            nodesID.push("Tee " + (i + 1).toString());
          }
        }

        /*
        edges[i] is the collection of endpoints of edges leaving node nodes[i].
        It's a dictionary of the form {endpoint1[i]:1, ..., endpointN[i]:1},
        where 1 is the weight of each edge.
        */

        var edgesID = {};

        for (var i = 0; i < nodesID.length; i++) {

          var tmpRoom = -1; // tmp index of node in rooms.
          tmpRoom = isNodeRoom(nodesID[i], $scope.survey.surveys.rooms);
          var tmpTee = -1; // tmp index of node in tees.
          if (numberOfTees > 0) {
            tmpTee = isNodeTee(nodesID[i], numberOfTees);
          }
          if (tmpRoom > -1) { // Node is the room with index tmpRoom.
            // Function to get children of a node.
            if ($scope.survey.surveys.rooms[tmpRoom].hasRads == false) {
              edgesID[nodesID[i]] = getChildrenNodesID($scope.survey.surveys.rooms[tmpRoom].pipeRunData.pipeRunAndOrderId, $scope.survey.surveys, false, false, false, -1);
            } else { // hasRads is true.
              edgesID[nodesID[i]] = getChildrenNodesID($scope.survey.surveys.rooms[tmpRoom].pipeRunData.pipeRunAndOrderId, $scope.survey.surveys, false, true, false, -1);
              for (var j = 0; j < Object.keys($scope.survey.surveys.rooms[tmpRoom].radiators).length; j++) {
                if ($scope.survey.surveys.rooms[tmpRoom].radiators[numbers[j]] != null) {
                  edgesID[$scope.survey.surveys.rooms[tmpRoom].radiators[numbers[j]].pipeRunAndOrderId] = getChildrenNodesID($scope.survey.surveys.rooms[tmpRoom].room_name, $scope.survey.surveys, false, false, true, j);
                }
              }
            }
          } else { // Node is not a room.
            if (tmpTee > -1) { // Node is the tee with index tmpTee.
              edgesID[nodesID[i]] = getChildrenNodesID("Tee " + (tmpTee + 1).toString(), $scope.survey.surveys, true, false, false, -1);
            }
            var radIdx = isNodeRad(nodesID[i], $scope.survey.surveys); // array [room, rad].
            if (radIdx[0] > -1) {
              edgesID[nodesID[i]] = getChildrenNodesID($scope.survey.surveys.rooms[radIdx[0]].room_name, $scope.survey.surveys, false, false, true, radIdx[1]);
            }
          }
        }

        // Create Graph.

        //var mapping = {};
        var mappingID = {};

        for (var i = 0; i < nodesID.length; i++) {
          mappingID[nodesID[i]] = edgesID[nodesID[i]];
        }

        for (var i = 0; i < nodes.length; i++) {
          if (mappingID[nodesID[i]] == undefined) {
            mappingID[nodesID[i]] = {};
          }
        }

        // Identify leaves.

        var leavesID = [];

        for (var i = 0; i < nodesID.length; i++) {
          for (const key of Object.keys(mappingID[nodesID[i]])) {
            if (isLeaf(key, nodesID, mappingID)) {
              var isAlreadyIncluded = false;
              for (var j = 0; j < leavesID.length; j++) {
                if (leavesID[j] == key) {
                  isAlreadyIncluded = true;
                }
              }
              if (isAlreadyIncluded == false) {
                leavesID.push(key);
              }
            }
          }
        }

        // Finish the MFR computations starting from the leaves

        for (var i = 0; i < numberOfRooms; i++) {
          $scope.survey.surveys.rooms[i].isAlreadyCounted = false;
          if ($scope.survey.surveys.rooms[i].hasRads == true) {
            for (var j = 0; j < Object.keys($scope.survey.surveys.rooms[i].radiators).length; j++) {
              if ($scope.survey.surveys.rooms[i].radiators[numbers[j]] != null) {
                $scope.survey.surveys.rooms[i].radiators[numbers[j]].isAlreadyCounted = false;
              }
            }
          }
        }

        // Take care of the cases when a room is connected to a radiator in another room,
        // and when a room is connected to another room.
        for (var j = 0; j < leavesID.length; j++) {
          var i = getLeafID(leavesID[j], $scope.survey.surveys);
          var tmp = isNodeRadById($scope.survey.surveys.rooms[i[0]].pipeRunData.predecessorId, $scope.survey.surveys, 0, numberOfRooms);
          if (tmp[0] > -1) { // First predecessor is a radiator.
            if ($scope.survey.surveys.rooms[tmp[0]].radiators[numbers[tmp[1]]] != null) {
              $scope.survey.surveys.rooms[tmp[0]].radiators[numbers[tmp[1]]].circuitFeedingMassFlowRate = $scope.survey.surveys.rooms[i[0]].massFlowSubTotal;
            }
            for (var l = tmp[1]; l >= 0; l--) {
              if ($scope.survey.surveys.rooms[tmp[0]].radiators[numbers[l]] != null) {
                if (l == tmp[1] || $scope.survey.surveys.rooms[tmp[0]].radiators[numbers[l]].isAlreadyCounted == true) {
                  $scope.survey.surveys.rooms[tmp[0]].radiators[numbers[l]].massFlowSubTotal += $scope.survey.surveys.rooms[i[0]].massFlowSubTotal;
                } else {
                  $scope.survey.surveys.rooms[tmp[0]].radiators[numbers[l]].massFlowSubTotal += $scope.survey.surveys.rooms[tmp[0]].radiators[numbers[l + 1]].massFlowSubTotal;
                }
                $scope.survey.surveys.rooms[tmp[0]].radiators[numbers[l]].isAlreadyCounted = true;
              }
            }
            $scope.survey.surveys.rooms[tmp[0]].massFlowSubTotal += $scope.survey.surveys.rooms[i[0]].massFlowSubTotal;
            $scope.survey.surveys.rooms[i[0]].isAlreadyCounted = true;
            var isStillRoomOrRad = true;
            var predID = $scope.survey.surveys.rooms[tmp[0]].pipeRunData.predecessorId;
            var prevIdx = tmp;
            while (isStillRoomOrRad) {
              if ($scope.survey.surveys.rooms[prevIdx[0]].pipeRunData.predecessorId != "Heat Source") {
                var idx = getRoomByID(predID, $scope.survey.surveys.rooms, 0, $scope.survey.surveys.rooms.length);
                if (idx > -1) { // Predecessor is a room.
                  $scope.survey.surveys.rooms[idx].massFlowSubTotal += $scope.survey.surveys.rooms[prevIdx[0]].massFlowSubTotal;
                  $scope.survey.surveys.rooms[prevIdx[0]].isAlreadyCounted = true;
                  predID = $scope.survey.surveys.rooms[idx].pipeRunData.predecessorId;
                  prevIdx[0] = idx;
                } else { // Predecessor is not a room.
                  var idxRad = isNodeRadById(predID, $scope.survey.surveys, 0, numberOfRooms);
                  if (idxRad[0] > -1) { // Predecessor is a radiator.
                    $scope.survey.surveys.rooms[idxRad[0]].massFlowSubTotal += $scope.survey.surveys.rooms[prevIdx[0]].massFlowSubTotal;
                    $scope.survey.surveys.rooms[prevIdx[0]].isAlreadyCounted = true;
                    for (var l = idxRad[1]; l >= 0; l--) {
                      if (l == idxRad[1] || $scope.survey.surveys.rooms[idxRad[0]].radiators[numbers[l]].isAlreadyCounted == true) {
                        $scope.survey.surveys.rooms[idxRad[0]].radiators[numbers[l]].massFlowSubTotal += $scope.survey.surveys.rooms[prevIdx[0]].massFlowSubTotal;
                      } else {
                        $scope.survey.surveys.rooms[idxRad[0]].radiators[numbers[l]].massFlowSubTotal += $scope.survey.surveys.rooms[idxRad[0]].radiators[numbers[l + 1]].massFlowSubTotal;
                      }
                      $scope.survey.surveys.rooms[idxRad[0]].radiators[numbers[l]].isAlreadyCounted = true;
                    }
                    if ($scope.survey.surveys.rooms[idxRad[0]].radiators[numbers[idxRad[1]]] != null) {
                      $scope.survey.surveys.rooms[idxRad[0]].radiators[numbers[idxRad[1]]].circuitFeedingMassFlowRate = $scope.survey.surveys.rooms[prevIdx[0]].massFlowSubTotal;
                    }
                    predID = $scope.survey.surveys.rooms[idxRad[0]].pipeRunData.predecessorId;
                    prevIdx = idxRad;
                  } else { // Predecessor is neither a room nor a radiator.
                    isStillRoomOrRad = false;
                  }
                }
              } else {
                isStillRoomOrRad = false;
              }
            }
          } else { // First predecessor is not a radiator.
            var idxRoom = getRoomByID($scope.survey.surveys.rooms[i[0]].pipeRunData.predecessorId, $scope.survey.surveys.rooms, 0, numberOfRooms);
            if (idxRoom > -1) { // Predecessor is a room.
              $scope.survey.surveys.rooms[idxRoom].massFlowSubTotal += $scope.survey.surveys.rooms[i[0]].massFlowSubTotal;
              $scope.survey.surveys.rooms[i[0]].isAlreadyCounted = true;
              var isStillRoomOrRad = true;
              var predID = $scope.survey.surveys.rooms[idxRoom].pipeRunData.predecessorId;
              var prevIdx = idxRoom;
              while (isStillRoomOrRad) {
                if ($scope.survey.surveys.rooms[prevIdx].pipeRunData.predecessorId != "Heat Source") {
                  var idx = getRoomByID(predID, $scope.survey.surveys.rooms, 0, $scope.survey.surveys.rooms.length);
                  if (idx > -1) { // Predecessor is a room.
                    $scope.survey.surveys.rooms[idx].massFlowSubTotal += $scope.survey.surveys.rooms[prevIdx].massFlowSubTotal;
                    $scope.survey.surveys.rooms[prevIdx].isAlreadyCounted = true;
                    predID = $scope.survey.surveys.rooms[idx].pipeRunData.predecessorId;
                    prevIdx = idx;
                  } else { // Predecessor is not a room.
                    var idxRad = isNodeRadById(predID, $scope.survey.surveys, 0, numberOfRooms);
                    if (idxRad[0] > -1) { // Predecessor is a radiator.
                      if ($scope.survey.surveys.rooms[idxRad[0]].radiators[numbers[idxRad[1]]] != null) {
                        $scope.survey.surveys.rooms[idxRad[0]].radiators[numbers[idxRad[1]]].circuitFeedingMassFlowRate = $scope.survey.surveys.rooms[prevIdx].massFlowSubTotal;
                      }
                      $scope.survey.surveys.rooms[idxRad[0]].massFlowSubTotal += parseFloat($scope.survey.surveys.rooms[prevIdx[0]].massFlowSubTotal);
                      $scope.survey.surveys.rooms[prevIdx[0]].isAlreadyCounted = true;
                      for (var l = idxRad[1]; l >= 0; l--) {
                        if (l == idxRad[1]) {
                          $scope.survey.surveys.rooms[idxRad[0]].radiators[numbers[l]].massFlowSubTotal += $scope.survey.surveys.rooms[prevIdx[0]].massFlowSubTotal;
                        } else {
                          $scope.survey.surveys.rooms[idxRad[0]].radiators[numbers[l]].massFlowSubTotal += $scope.survey.surveys.rooms[idxRad[0]].radiators[numbers[l + 1]].massFlowSubTotal;
                        }
                        $scope.survey.surveys.rooms[idxRad[0]].radiators[numbers[l]].isAlreadyCounted = true;
                      }
                      predID = $scope.survey.surveys.rooms[idxRad[0]].pipeRunData.predecessorId;
                      prevIdx = idxRad[0];
                    } else { // Predecessor is neither a room nor a radiator.
                      isStillRoomOrRad = false;
                    }
                  }
                } else {
                  isStillRoomOrRad = false;
                }
              }
            }
          }
        }

        /*
        Compute mass flow rate subtotals for tees.
        The tees need to be in order of depth: the least deep first.
        */

        for (let i = numberOfTees - 1; i >= 0; i--) { // $scope.survey.surveys
          // if ID1 and ID2 are tees
          if ($scope.survey.surveys.tees[i].pipeRunIds[0].roomRunId.substring(0, 3) == "tee" && $scope.survey.surveys.tees[i].pipeRunIds[1].roomRunId.substring(0, 3) == "tee") {
            var ID1index = parseInt($scope.survey.surveys.tees[i].pipeRunIds[0].roomRunId.substring(3)) - 1;
            var ID2index = parseInt($scope.survey.surveys.tees[i].pipeRunIds[1].roomRunId.substring(3)) - 1;
            $scope.survey.surveys.tees[i].massFlowSubTotal = $scope.survey.surveys.tees[ID1index].massFlowSubTotal + $scope.survey.surveys.tees[ID2index].massFlowSubTotal;
          } // if ID1 is not a tee and ID2 is a tee
          else if ($scope.survey.surveys.tees[i].pipeRunIds[0].roomRunId.substring(0, 3) != "tee" && $scope.survey.surveys.tees[i].pipeRunIds[1].roomRunId.substring(0, 3) == "tee") {
            var ID1index = getRoomIndexByName($scope.survey.surveys.rooms, $scope.survey.surveys.tees[i].pipeRunIds[0].roomName);
            var ID2index = parseInt($scope.survey.surveys.tees[i].pipeRunIds[1].roomRunId.substring(3)) - 1;
            $scope.survey.surveys.tees[i].massFlowSubTotal = $scope.survey.surveys.rooms[ID1index].massFlowSubTotal + $scope.survey.surveys.tees[ID2index].massFlowSubTotal;
          } // if ID1 is a tee and ID2 is not a tee
          else if ($scope.survey.surveys.tees[i].pipeRunIds[0].roomRunId.substring(0, 3) == "tee" && $scope.survey.surveys.tees[i].pipeRunIds[1].roomRunId.substring(0, 3) != "tee") {
            var ID1index = parseInt($scope.survey.surveys.tees[i].pipeRunIds[0].roomRunId.substring(3)) - 1;
            var ID2index = getRoomIndexByName($scope.survey.surveys.rooms, $scope.survey.surveys.tees[i].pipeRunIds[1].roomName);
            $scope.survey.surveys.tees[i].massFlowSubTotal = $scope.survey.surveys.tees[ID1index].massFlowSubTotal + $scope.survey.surveys.rooms[ID2index].massFlowSubTotal;
          } // Neither ID1 nor ID2 is a tee
          else {
            var ID1index = getRoomIndexByName($scope.survey.surveys.rooms, $scope.survey.surveys.tees[i].pipeRunIds[0].roomName);
            var ID2index = getRoomIndexByName($scope.survey.surveys.rooms, $scope.survey.surveys.tees[i].pipeRunIds[1].roomName);
            $scope.survey.surveys.tees[i].massFlowSubTotal = $scope.survey.surveys.rooms[ID1index].massFlowSubTotal + $scope.survey.surveys.rooms[ID2index].massFlowSubTotal;
          }
          // Compute the mass flow rate subtotal for the predecessors of the tees.
          var isTeePredRad = isNodeRadById($scope.survey.surveys.tees[i].preId, $scope.survey.surveys, 0, numberOfRooms);
          if (isTeePredRad[0] > -1) { // Predecessor of tee is a radiator.
            if ($scope.survey.surveys.rooms[isTeePredRad[0]].radiators[numbers[isTeePredRad[1]]] != null) {
              $scope.survey.surveys.rooms[isTeePredRad[0]].radiators[numbers[isTeePredRad[1]]].circuitFeedingMassFlowRate = $scope.survey.surveys.tees[i].massFlowSubTotal;
            }
            for (var j = isTeePredRad[1]; j >= 0; j--) {
              if (j == isTeePredRad[1] || $scope.survey.surveys.rooms[isTeePredRad[0]].radiators[numbers[j]].isAlreadyCounted == true) {
                $scope.survey.surveys.rooms[isTeePredRad[0]].radiators[numbers[j]].massFlowSubTotal += $scope.survey.surveys.tees[i].massFlowSubTotal;
              } else {
                $scope.survey.surveys.rooms[isTeePredRad[0]].radiators[numbers[j]].massFlowSubTotal = $scope.survey.surveys.rooms[isTeePredRad[0]].radiators[numbers[j + 1]].massFlowSubTotal + $scope.survey.surveys.tees[i].massFlowSubTotal;
                $scope.survey.surveys.rooms[isTeePredRad[0]].radiators[numbers[j]].isAlreadyCounted = true;
              }
            }
            var val = $scope.survey.surveys.tees[i].massFlowSubTotal;
            if ($scope.survey.surveys.rooms[isTeePredRad[0]].isAlreadyCounted == false) {
              val += $scope.survey.surveys.rooms[isTeePredRad[0]].massFlowSubTotal;
            }
            $scope.survey.surveys.rooms[isTeePredRad[0]].massFlowSubTotal += $scope.survey.surveys.tees[i].massFlowSubTotal;
            $scope.survey.surveys.rooms[isTeePredRad[0]].isAlreadyCounted = true;
            var predID = $scope.survey.surveys.rooms[isTeePredRad[0]].pipeRunData.predecessorId;
            updateMFRsOfPreds(val, predID, $scope.survey.surveys, i);
          } else {
            var isTeePredRoom = getRoomByID($scope.survey.surveys.tees[i].preId, $scope.survey.surveys.rooms, 0, numberOfRooms);
            if (isTeePredRoom > -1) { // Predecessor of tee is a room.
              var val = $scope.survey.surveys.tees[i].massFlowSubTotal;
              if ($scope.survey.surveys.rooms[isTeePredRoom].isAlreadyCounted == false) {
                val += $scope.survey.surveys.rooms[isTeePredRoom].massFlowSubTotal;
              }
              $scope.survey.surveys.rooms[isTeePredRoom].massFlowSubTotal += $scope.survey.surveys.tees[i].massFlowSubTotal;
              $scope.survey.surveys.rooms[isTeePredRoom].isAlreadyCounted = true;
              var predID = $scope.survey.surveys.rooms[isTeePredRoom].pipeRunData.predecessorId;
              updateMFRsOfPreds(val, predID, $scope.survey.surveys, i);
            }
          }
        }

        // Compute MFR subtotals for radiators which aren't predecessors of any room or tee

        for (var i = 0; i < $scope.survey.surveys.rooms.length; i++) {
          if ($scope.survey.surveys.rooms[i].hasRads == true) {
            for (var j = Object.keys($scope.survey.surveys.rooms[i].radiators).length - 1; j >= 0; j--) {
              if (j > 0) {
                if ($scope.survey.surveys.rooms[i].radiators[numbers[j]] != null && $scope.survey.surveys.rooms[i].radiators[numbers[j - 1]] != null) {
                  //var tmpBool = isAncestor($scope.survey.surveys.rooms[i].radiators[numbers[j]].pipeRunAndOrderId, $scope.survey.surveys);
                  if ($scope.survey.surveys.rooms[i].radiators[numbers[j]].isAlreadyCounted == false && $scope.survey.surveys.rooms[i].radiators[numbers[j - 1]].isAlreadyCounted == false) {// && tmpBool) {
                    $scope.survey.surveys.rooms[i].radiators[numbers[j - 1]].massFlowSubTotal += $scope.survey.surveys.rooms[i].radiators[numbers[j]].massFlowSubTotal;
                  } else {
                    if ($scope.survey.surveys.rooms[i].radiators[numbers[j]].isAlreadyCounted == false && $scope.survey.surveys.rooms[i].radiators[numbers[j - 1]].isAlreadyCounted == true) { //&& tmpBool) {
                      for (var k = j - 1; k >= 0; k--) {
                        $scope.survey.surveys.rooms[i].radiators[numbers[k]].massFlowSubTotal += $scope.survey.surveys.rooms[i].radiators[numbers[j]].massFlowSubTotal;
                      }
                    }
                  }
                }
              }
            }
          }
        }

        // Identify the root using the "Heat Source" predecessor ID.

        var root_nameID = "";
        for (var i = 0; i < numberOfRooms; i++) {
          if ($scope.survey.surveys.rooms[i].pipeRunData.predecessorId == "Heat Source") {
            root_nameID = $scope.survey.surveys.rooms[i].pipeRunData.pipeRunAndOrderId;
          }
        }
        if (numberOfTees > 0) {
          for (var i = 0; i < numberOfTees; i++) {
            if ($scope.survey.surveys.tees[i].preId == 'Heat Source') {
              root_nameID = "Tee " + (i + 1).toString();
            }
          }
        }

        var pathsID = dijkstra.pathFinder(mappingID, leavesID, root_nameID);

        // Identify additional pathsID.
        for (var key in Object.keys(pathsID)) {
          if (pathsID[key].optionValue != null) {
            for (var i = 0; i < pathsID[key].optionValue.length; i++) {
              if (i > 0) {
                mappingID[pathsID[key].optionValue[i - 1]][pathsID[key].optionValue[i]] = 10000; // Temporarily increase weight to remove edge from path.
                var tmpPaths = dijkstra.pathFinder(mappingID, leavesID, root_nameID); // Get additional paths.
                mappingID[pathsID[key].optionValue[i - 1]][pathsID[key].optionValue[i]] = 1; // Revert to usual weight 1.
                for (var key2 in Object.keys(tmpPaths)) {
                  if (pathsID[key].id == tmpPaths[key2].id) {
                    var isValNotInPaths = true;
                    if (Array.isArray(tmpPaths[key2].optionValue)) {
                      if (Array.isArray(tmpPaths[key2].optionValue[0])) {
                        for (var k = 0; k < tmpPaths[key2].optionValue.length; k++) {
                          if (areArraysEqual(tmpPaths[key2].optionValue[k], pathsID[key].optionValue)) {
                            isValNotInPaths = false;
                          }
                        }
                      } else {
                        if (areArraysEqual(tmpPaths[key2].optionValue, pathsID[key].optionValue)) {
                          isValNotInPaths = false;
                        }
                      }
                    }
                    if (isValNotInPaths == true) {
                      var tmp = [];
                      tmp.push(pathsID[key].optionValue);
                      if (tmpPaths[key2].optionValue != null) {
                        tmp.push(tmpPaths[key2].optionValue);
                      }
                      pathsID[key2].optionValue = tmp;
                    }
                  }
                }
              }
            }
          }
        }

        /*
         Compute the total pressure loss along the routes identified in the previous step.
         */

        var totPressureAlongPaths = {};
        var counter = 0;
        $scope.indexTableData = {}
        $scope.indexTableDataTotal = [];

        for (key in Object.keys(pathsID)) {
          if (Array.isArray(pathsID[key].optionValue)) {
            if (Array.isArray(pathsID[key].optionValue[0])) {
              var tmpArray = [];
              for (var k = 0; k < pathsID[key].optionValue.length; k++) {
                $scope.indexTableData[counter] = [];
                var tmpTotPres = 0;
                for (var i = 0; i < pathsID[key].optionValue[k].length; i++) {
                  var tmpRad = isNodeRad(pathsID[key].optionValue[k][i], $scope.survey.surveys);
                  var tmpRoom = isNodeRoom(pathsID[key].optionValue[k][i], $scope.survey.surveys.rooms);
                  var tmpTee = isNodeTee(pathsID[key].optionValue[k][i], numberOfTees);
                  if (tmpRad[0] > -1) {
                    if ($scope.survey.surveys.rooms[tmpRad[0]].radiators[numbers[tmpRad[1]]] != null) {
                      calculatePipeCalcRad(tmpRad[0], numbers[tmpRad[1]]);
                      tmpTotPres += $scope.survey.surveys.rooms[tmpRad[0]].radiators[numbers[tmpRad[1]]].radsTotalPressureLoss;
                      var tmpObject = {};
                      tmpObject["runId"] = $scope.survey.surveys.rooms[tmpRad[0]].radiators[numbers[tmpRad[1]]].pipeRunAndOrderId;
                      tmpObject["totPressure"] = $scope.survey.surveys.rooms[tmpRad[0]].radiators[numbers[tmpRad[1]]].radsTotalPressureLoss;
                      $scope.indexTableData[counter].push(tmpObject);
                    }
                  } else if (tmpRoom > -1) {
                    calculatePipeCalc(tmpRoom);
                    tmpTotPres += $scope.survey.surveys.rooms[tmpRoom].pipe.totPressureLoss;
                    var tmpObject = {};
                    if ($scope.survey.surveys.rooms[tmpRoom].pipeRunData.predecessorId == "Heat Source" && $scope.survey.surveys.rooms[tmpRoom].pipeRunData.pipeRunAndOrderId != "tee1") {

                      var tmpObject1 = {};
                      tmpObject1["runId"] = "PF";
                      tmpObject1["totPressure"] = $scope.survey.surveys.primaryFlowIndex.totPreLoss;
                      $scope.indexTableData[counter].push(tmpObject1);
                    }
                    tmpObject["runId"] = $scope.survey.surveys.rooms[tmpRoom].pipeRunData.pipeRunAndOrderId;
                    tmpObject["totPressure"] = $scope.survey.surveys.rooms[tmpRoom].pipe.totPressureLoss;
                    $scope.indexTableData[counter].push(tmpObject);
                  } else {
                    if (tmpTee > -1) {
                      getTees(tmpTee);
                      tmpTotPres += $scope.survey.surveys.tees[tmpTee].totalPressureLoss;
                      var tmpObject = {};
                      tmpObject["runId"] = "Tee " + (tmpTee + 1).toString();
                      tmpObject["totPressure"] = $scope.survey.surveys.tees[tmpTee].totalPressureLoss;
                      $scope.indexTableData[counter].push(tmpObject);
                    }
                  }
                }
                var tmpObj = {};
                tmpObj[pathsID[key].optionValue[k]] = tmpTotPres;
                $scope.indexTableDataTotal.push(tmpTotPres);
                tmpArray.push(tmpObj);
                counter += 1;
              }
              totPressureAlongPaths[pathsID[key].id] = tmpArray;
            } else {
              $scope.indexTableData[counter] = [];
              var tmpArray = [];
              var tmpTotPres = 0;
              for (var i = 0; i < pathsID[key].optionValue.length; i++) {
                var tmpRad = isNodeRad(pathsID[key].optionValue[i], $scope.survey.surveys);
                var tmpRoom = isNodeRoom(pathsID[key].optionValue[i], $scope.survey.surveys.rooms);
                var tmpTee = isNodeTee(pathsID[key].optionValue[i], numberOfTees);
                if (tmpRad[0] > -1) {
                  if ($scope.survey.surveys.rooms[tmpRad[0]].radiators[numbers[tmpRad[1]]] != null) {
                    calculatePipeCalcRad(tmpRad[0], numbers[tmpRad[1]]);
                    tmpTotPres += $scope.survey.surveys.rooms[tmpRad[0]].radiators[numbers[tmpRad[1]]].radsTotalPressureLoss;
                    var tmpObject = {};
                    tmpObject["runId"] = $scope.survey.surveys.rooms[tmpRad[0]].radiators[numbers[tmpRad[1]]].pipeRunAndOrderId;
                    tmpObject["totPressure"] = $scope.survey.surveys.rooms[tmpRad[0]].radiators[numbers[tmpRad[1]]].radsTotalPressureLoss;
                    $scope.indexTableData[counter].push(tmpObject);
                  }
                } else if (tmpRoom > -1) {
                  calculatePipeCalc(tmpRoom);
                  let sumspre = $scope.survey.surveys.rooms[tmpRoom].hasRads ? 0 : $scope.survey.surveys.rooms[tmpRoom].pipe.totPressureLoss
                  tmpTotPres += sumspre;
                  var tmpObject = {};
                  if ($scope.survey.surveys.rooms[tmpRoom].pipeRunData.predecessorId == "Heat Source" && $scope.survey.surveys.rooms[tmpRoom].pipeRunData.pipeRunAndOrderId != "tee1") {

                    var tmpObject1 = {};
                    tmpObject1["runId"] = "PF";
                    tmpObject1["totPressure"] = $scope.survey.surveys.primaryFlowIndex.totPreLoss;
                    $scope.indexTableData[counter].push(tmpObject1);
                  }
                  tmpObject["runId"] = $scope.survey.surveys.rooms[tmpRoom].pipeRunData.pipeRunAndOrderId;
                  tmpObject["totPressure"] = $scope.survey.surveys.rooms[tmpRoom].hasRads ? 0 : $scope.survey.surveys.rooms[tmpRoom].pipe.totPressureLoss;
                  $scope.indexTableData[counter].push(tmpObject);
                } else {
                  if (tmpTee > -1) {
                    getTees(tmpTee);
                    tmpTotPres += $scope.survey.surveys.tees[tmpTee].totalPressureLoss;
                    var tmpObject = {};
                    tmpObject["runId"] = "Tee " + (tmpTee + 1).toString();
                    tmpObject["totPressure"] = $scope.survey.surveys.tees[tmpTee].totalPressureLoss;
                    $scope.indexTableData[counter].push(tmpObject);
                  }
                }
              }
              counter += 1;
              var tmpObj = {};
              tmpObj[pathsID[key].optionValue] = tmpTotPres;
              $scope.indexTableDataTotal.push(tmpTotPres);
              tmpArray.push(tmpObj);
              totPressureAlongPaths[pathsID[key].id] = tmpArray;
            }
          }
        }
        let maxX = Math.max(...$scope.indexTableDataTotal);
        $scope.maxOfPath = $scope.indexTableDataTotal.indexOf(maxX);

        // Select the route with the maximum pressure loss.

        var tmpArr = Object.keys(totPressureAlongPaths)

        var maxLeaf = tmpArr[0];
        var maxPathIdx = 0;
        var maxPath = Object.keys(totPressureAlongPaths[maxLeaf][maxPathIdx])[0];

        for (var i = 0; i < tmpArr.length; i++) {
          var tmpArr2 = Object.keys(totPressureAlongPaths[tmpArr[i]]);
          for (var j = 0; j < tmpArr2.length; j++) {
            var tmpArr3 = Object.keys(totPressureAlongPaths[tmpArr[i]][j]);
            for (var k = 0; k < tmpArr3.length; k++) {
              var tmpPath = Object.keys(totPressureAlongPaths[tmpArr[i]][j])[0];
              if (totPressureAlongPaths[tmpArr[i]][j][tmpPath] > totPressureAlongPaths[maxLeaf][maxPathIdx][maxPath]) {
                maxPathIdx = j;
                maxLeaf = tmpArr[i];
                maxPath = Object.keys(totPressureAlongPaths[maxLeaf][maxPathIdx])[0];
              }
            }
          }
        }

        $scope.maxLeafName = {};

        var maxLeafIdx = isNodeRadById(maxLeaf, $scope.survey.surveys, 0, numberOfRooms);
        if (maxLeafIdx[0] > -1) { // Then maxLeaf is a rad.
          $scope.maxLeafName["roomName"] = $scope.survey.surveys.rooms[maxLeafIdx[0]].room_name;
          $scope.maxLeafName["radName"] = $scope.survey.surveys.rooms[maxLeafIdx[0]].radiators[numbers[maxLeafIdx[1]]].type;
        } else {
          var maxLeafIdxRoom = isNodeRoom(maxLeaf, $scope.survey.surveys.rooms);
          if (maxLeafIdxRoom > -1) {
            $scope.maxLeafName["roomName"] = $scope.survey.surveys.rooms[maxLeafIdxRoom].room_name;
            $scope.maxLeafName["radName"] = null;
          }
        }

        $scope.finalData.roomName = $scope.maxLeafName["roomName"];
        $scope.finalData.radName = $scope.maxLeafName["radName"];
        $scope.finalData.indexCircuitId = $scope.maxLeafName["radName"]
        if ($scope.maxLeafName["radName"] == null) {
          $scope.finalData.indexCircuitId = $scope.maxLeafName["roomName"]
        }
        $scope.finalData.icsubTotal = totPressureAlongPaths[maxLeaf][maxPathIdx][maxPath].toFixed(4)
        $scope.survey.surveys.finalData = $scope.finalData
        $scope.survey.surveys.indexTableData = $scope.indexTableData
        $scope.survey.surveys.indexTableDataTotal = $scope.indexTableDataTotal
        ignoredRooms = allRooms.filter(function (val) { return val.pipeRoomIgnore; })
        apiService.update('surveys', $scope.survey).then(function (response) {
        }, commonService.onError)
        updateFinalData()
      });


    }

    // Helper functions.

    // Update MFR subtotals of predecessors of the predecessor of a tee
    function updateMFRsOfPreds (val, predID, surveys, idxTee) {
      var numbers = ["one", "two", "three", "four", "five", "six", "seven", "eight", "nine", "ten", "eleven", "twelve", "thirteen", "fourteen", "fifteen"];
      var isHS = false;
      while (!isHS) {
        var idx = getRoomByID(predID, surveys.rooms, 0, surveys.rooms.length);
        if (idx > -1) {
          if (surveys.rooms[idx].isAlreadyCounted == true) {
            surveys.rooms[idx].massFlowSubTotal += val;
          } else {
            var tmp = surveys.rooms[idx].massFlowSubTotal;
            surveys.rooms[idx].massFlowSubTotal += val;
            val += tmp;
          }
          predID = surveys.rooms[idx].pipeRunData.predecessorId;
        } else {
          if (predID != "Heat Source") {
            var idxRad = isNodeRadById(predID, $scope.survey.surveys, 0, surveys.rooms.length);
            if (idxRad[0] > -1) {
              if (getRoomByID(predID, surveys.rooms, 0, surveys.rooms.length) > -1) {
                if ($scope.survey.surveys.rooms[idxRad[0]].radiators[numbers[idxRad[1]]] != null) {
                  $scope.survey.surveys.rooms[idxRad[0]].radiators[numbers[idxRad[1]]].circuitFeedingMassFlowRate = $scope.survey.surveys.tees[idxTee].massFlowSubTotal;
                }
              }
              for (var l = idxRad[1]; l >= 0; l--) {
                if (l == idxRad[1] || surveys.rooms[idxRad[0]].radiators[numbers[l]].isAlreadyCounted == true) {
                  surveys.rooms[idxRad[0]].radiators[numbers[l]].massFlowSubTotal += val;
                } else {
                  surveys.rooms[idxRad[0]].radiators[numbers[l]].massFlowSubTotal = surveys.rooms[idxRad[0]].radiators[numbers[l + 1]].massFlowSubTotal + val;
                }
              }
              if (surveys.rooms[idxRad[0]].isAlreadyCounted == true) {
                surveys.rooms[idxRad[0]].massFlowSubTotal += val; // MFRs of rads have already been added up.
              } else {
                var tmp = surveys.rooms[idxRad[0]].massFlowSubTotal;
                surveys.rooms[idxRad[0]].massFlowSubTotal += val; // MFRs of rads have already been added up.
                val += tmp;
              }
              predID = surveys.rooms[idxRad[0]].pipeRunData.predecessorId;
            } else { // Predecessor is neither a radiator nor a room.
              isHS = true;
            }
          } else {
            isHS = true;
          }
        }
      }
    }

    // Check if key is a leaf of the tree, i.e. an endpoint.
    function isLeaf (key, nodes, mapping) {
      for (var i = 0; i < nodes.length; i++) {
        if (nodes[i] == key && Object.keys(mapping[nodes[i]]).length != 0) {
          return false;
        }
      }
      return true;
    }

    // Get room index by roomName
    function getRoomIndexByName (rooms, roomName) { // roomName corresponds to ID1 or ID2 of a tee
      var toRet = 0;
      for (var i = 0; i < rooms.length; i++) {
        if (rooms[i].room_name == roomName) {
          toRet = i;
          break;
        }
      }
      return toRet;
    }

    function getRoomByID (ID, rooms, start, max) {
      for (var i = start; i < max; i++) {
        if (rooms[i].pipeRunData.pipeRunAndOrderId == ID) {
          return i;
        }
      }
      return -1;
    }

    // Is a node a room?
    function isNodeRoom (node, rooms) {
      for (var i = 0; i < rooms.length; i++) {
        if (node == rooms[i].pipeRunData.pipeRunAndOrderId) {
          return i;
        }
      }
      return -1;
    }

    // Is a node a tee?
    function isNodeTee (node, numberOfTees) {
      for (var i = 0; i < numberOfTees; i++) {
        if (node == "Tee " + (i + 1).toString()) {
          return i;
        }
      }
      return -1;
    }

    // Is a node a radiator?
    function isNodeRadById (node, surveys, start, max) {
      var numbers = ["one", "two", "three", "four", "five", "six", "seven", "eight", "nine", "ten", "eleven", "twelve", "thirteen", "fourteen", "fifteen"];
      for (var i = start; i < max; i++) {
        if (surveys.rooms[i].hasRads == true) {
          for (var j = 0; j < Object.keys(surveys.rooms[i].radiators).length; j++) {
            if (surveys.rooms[i].radiators[numbers[j]] != null) {
              if (node == surveys.rooms[i].radiators[numbers[j]].pipeRunAndOrderId) {
                return [i, j]; // room, rad.
              }
            }
          }
        }
      }
      return [-1, -1];
    }

    // Get leaf ID
    function getLeafID (leaf, surveys) {
      var toRet = isNodeRad(leaf, surveys);
      if (toRet[0] > -1) {
        return toRet;
      } else {
        var toRet2 = isNodeRoom(leaf, surveys.rooms);
        if (toRet2 > -1) {
          return [toRet2, -1];
        } else {
          return [-1, -1];
        }
      }
    }

    // Is a node a radiator?
    function isNodeRad (node, surveys) {
      var numbers = ["one", "two", "three", "four", "five", "six", "seven", "eight", "nine", "ten", "eleven", "twelve", "thirteen", "fourteen", "fifteen"];
      for (var i = 0; i < surveys.rooms.length; i++) {
        if (surveys.rooms[i].hasRads == true) {
          for (var j = 0; j < Object.keys(surveys.rooms[i].radiators).length; j++) {
            if (surveys.rooms[i].radiators[numbers[j]] != null) {
              if (node == surveys.rooms[i].radiators[numbers[j]].pipeRunAndOrderId) {
                return [i, j]; // room, rad.
              }
            }
          }
        }
      }
      return [-1, -1];
    }

    // Return children IDs of node based on its ID
    function getChildrenNodesID (ID, surveys, isTee, hasRads, isRad, radIndex) {
      var numbers = ["one", "two", "three", "four", "five", "six", "seven", "eight", "nine", "ten", "eleven", "twelve", "thirteen", "fourteen", "fifteen"];
      var toRet = {};
      for (var i = 0; i < surveys.rooms.length; i++) {
        if (ID == surveys.rooms[i].pipeRunData.predecessorId) {
          toRet[surveys.rooms[i].pipeRunData.pipeRunAndOrderId] = 1;
        }
      }
      if (surveys.hasOwnProperty("tees") == true) {
        for (var i = 0; i < surveys.tees.length; i++) {
          if (ID == surveys.tees[i].preId) {
            toRet["Tee " + (i + 1).toString()] = 1;
          }
        }
      }
      if (isTee) {
        var tmpTee = isNodeTee(ID, surveys.tees.length);
        //parseInt(surveys.tees[tmpTee].pipeRunIds[0].roomRunId.charAt(surveys.tees[tmpTee].pipeRunIds[0].roomRunId.length-1));
        // Two outputs are tees.
        if (tmpTee > -1) {
          if ((surveys.tees[tmpTee].pipeRunIds[0].roomName == null || surveys.tees[tmpTee].pipeRunIds[0].roomName == "") && (surveys.tees[tmpTee].pipeRunIds[1].roomName == null || surveys.tees[tmpTee].pipeRunIds[1].roomName == "")) {
            if (surveys.tees[tmpTee].pipeRunIds[0].roomRunId.substring(3) == 'tee') {
              toRet["Tee " + parseInt(surveys.tees[tmpTee].pipeRunIds[0].roomRunId.substring(3)).toString()] = 1;
            } else {
              toRet["Tee " + parseInt(surveys.tees[tmpTee].pipeRunIds[0].roomRunId.charAt(surveys.tees[tmpTee].pipeRunIds[0].roomRunId.length - 1)).toString()] = 1;
            }
            if (surveys.tees[tmpTee].pipeRunIds[1].roomRunId.substring(3) == 'tee') {
              toRet["Tee " + parseInt(surveys.tees[tmpTee].pipeRunIds[1].roomRunId.substring(3)).toString()] = 1;
            } else {
              toRet["Tee " + parseInt(surveys.tees[tmpTee].pipeRunIds[1].roomRunId.charAt(surveys.tees[tmpTee].pipeRunIds[1].roomRunId.length - 1)).toString()] = 1;
            }
          } else if ((surveys.tees[tmpTee].pipeRunIds[0].roomName != null && surveys.tees[tmpTee].pipeRunIds[0].roomName != "") && (surveys.tees[tmpTee].pipeRunIds[1].roomName == null || surveys.tees[tmpTee].pipeRunIds[1].roomName == "")) {
            // Ouput 1 is a room and output 2 is a tee.
            toRet[surveys.tees[tmpTee].pipeRunIds[0].roomRunId] = 1;
            toRet["Tee " + parseInt(surveys.tees[tmpTee].pipeRunIds[1].roomRunId.substring(3)).toString()] = 1;
          } else if ((surveys.tees[tmpTee].pipeRunIds[0].roomName == null || surveys.tees[tmpTee].pipeRunIds[0].roomName == "") && (surveys.tees[tmpTee].pipeRunIds[1].roomName != null && surveys.tees[tmpTee].pipeRunIds[1].roomName != "")) {
            // Ouput 1 is a tee and output 2 is a room.
            toRet["Tee " + parseInt(surveys.tees[tmpTee].pipeRunIds[0].roomRunId.substring(3)).toString()] = 1;
            toRet[surveys.tees[tmpTee].pipeRunIds[1].roomRunId] = 1;
          } else { // Two outputs are rooms
            toRet[surveys.tees[tmpTee].pipeRunIds[0].roomRunId] = 1;
            toRet[surveys.tees[tmpTee].pipeRunIds[1].roomRunId] = 1;
          }
        }
      }
      if (hasRads) {
        var tmpRoom = -1;
        for (var i = 0; i < surveys.rooms.length; i++) {
          if (ID == surveys.rooms[i].pipeRunData.pipeRunAndOrderId) {
            tmpRoom = i;
          }
        }

        for (var i = 0; i < Object.keys(surveys.rooms[tmpRoom].radiators).length; i++) {
          if (surveys.rooms[tmpRoom].radiators[numbers[i]] != null) {
            if (surveys.rooms[tmpRoom].radiators[numbers[i]].predecessorId == surveys.rooms[tmpRoom].pipeRunData.pipeRunAndOrderId) {
              toRet[surveys.rooms[tmpRoom].radiators[numbers[i]].pipeRunAndOrderId] = 1;
            }
          }
        }
      }
      if (isRad) {
        var tmpRoom = -1;
        for (var i = 0; i < surveys.rooms.length; i++) {
          if (ID == surveys.rooms[i].room_name) {
            tmpRoom = i;
          }
        }
        var radFullID = "";
        if (tmpRoom > -1) {
          if (surveys.rooms[tmpRoom].radiators[numbers[radIndex]] != null) {
            radFullID = surveys.rooms[tmpRoom].radiators[numbers[radIndex]].pipeRunAndOrderId;
          }
        }
        loop1:
        for (var i = 0; i < surveys.rooms.length; i++) {
          if (radFullID == surveys.rooms[i].pipeRunData.predecessorId) {
            toRet[surveys.rooms[i].pipeRunData.pipeRunAndOrderId] = 1;
            break;
          }
          if (surveys.rooms[i].hasRads) {
            loop2:
            for (var j = 0; j < Object.keys(surveys.rooms[i].radiators).length; j++) {
              if (surveys.rooms[i].radiators[numbers[j]] != null) {
                if (radFullID == surveys.rooms[i].radiators[numbers[j]].predecessorId) {
                  toRet[surveys.rooms[i].radiators[numbers[j]].pipeRunAndOrderId] = 1;
                  break loop1;
                }
              }
            }
          }
        }
        if (surveys.tees) {
          for (var l = 0; l < surveys.tees.length; l++) {
            if (surveys.tees[l].preId == radFullID) {
              toRet["Tee " + (l + 1).toString()] = 1;
            }
          }
        }
      }
      return toRet;
    }

    function areArraysEqual (x, y) {
      if (x.length != y.length) {
        return false;
      } else {
        for (var i = 0; i < x.length; i++) {
          if (x[i] != y[i]) {
            return false;
          }
        }
        return true;
      }
    }

    function isAncestor (ID, survey) {
      for (var i = 0; i < survey.rooms.length; i++) {
        if (survey.rooms[i].pipeRunData.predecessorId == ID) {
          return true;
        }
      }
      for (var i = 0; i < survey.tees.length; i++) {
        if (survey.tees[i].preId == ID) {
          return true;
        }
      }
      return false;
    }

    // End of Thomas' code.

    // function calculateForTees (idx) {
    //   let initTees = {};
    //   if ($scope.survey.surveys.tees[idx].pipeSelect) {
    //     $scope.teesMeanVelosity = indexgetMeanVelosity(true, idx);
    //     initTees.meanVelosity = $scope.teesMeanVelosity
    //     if (initTees.meanVelosity >= $scope.miniVeloSel) {
    //       initTees.velosityCheck = "Accepted"
    //     } else {
    //       initTees.velosityCheck = "Reduce Dia"
    //     }
    //     $scope.survey.surveys.tees[idx].reynoldsNum = indexgetReynoldsNumber(true);
    //     $scope.teesfrictionFactor = indexgetFrictionFactor(true, idx);
    //     initTees.pressureLossPA = indexgetPressureLoss(true);
    //     initTees.pressureLossM = initTees.pressureLossPA / 9804.139432;
    //   }
    //   return initTees;
    // }

    $scope.addCustomTees = function () {

      let teeObj = {
        teeId: 0,
        preId: 0,
        pipeRunIds: [],
        massFlowSubTotal: 0,
        pipeSelect: 0,
        meanVelosity: 0,
        velosityCheck: '',
        pressureLossPA: 0,
        pressureLossM: 0,
        pipeRunFlowLength: 0,
        totalPressureLoss: 0,
        isCustom: true
      };
      if ($scope.survey.surveys.tees && $scope.survey.surveys.tees.length > 0) {
        teeObj.teeId = $scope.survey.surveys.tees.length + 1
      }

      if (!$scope.survey.surveys.tees) {
        $scope.survey.surveys.tees = []
      }
      $scope.canDeriveTable2 = true;
      $scope.survey.surveys.tees.push(teeObj)
      $scope.tees = $scope.survey.surveys.tees;

    }

    $scope.removeTee = function (k) {
      $scope.survey.surveys.tees.splice(k, 1);
      summaryHelperService.switchAndUpdateSurvey(null, "current-pipe-calculation", $scope.survey, null, true).then(function (res) {
        //$location.path('/current-pipe-calculation/' + $scope.survey._id);
        //CalculateValues();
      });
    }

    $scope.minimumVeloChanged = function () {
      angular.forEach($scope.survey.surveys.rooms, function (rm, index) {
        var item = "none"
        $scope.updateRooms($scope.survey.surveys.rooms, index, item)
      });
    }
    $scope.maxVeloChanged = function () {
      angular.forEach($scope.survey.surveys.rooms, function (rm, index) {
        var item = "none"
        $scope.updateRooms($scope.survey.surveys.rooms, index, item)
      });
    }

    $scope.changeAllowedSubTotal = function () {
      $scope.finalData.allowSubTotalPercent
      if (!$scope.finalData.allowSubTotalPercent) {
        $scope.finalData.allowSubTotalPercent = 0;
      }
      //$scope.finalData.icsubTotal = $scope.finalTotalPressure.value.toFixed(3)
      $scope.finalData.allowsubTotal = (parseFloat($scope.finalData.icsubTotal) * (parseFloat($scope.finalData.allowSubTotalPercent) / 100)).toFixed(4)
      let finalsubTotal = parseFloat($scope.finalData.radsTotalPressureLoss) + parseFloat($scope.finalData.totPreLoss);
      let sums = parseFloat($scope.finalData.icsubTotal) + parseFloat($scope.finalData.allowsubTotal);
      $scope.finalData.totPresLoss = (parseFloat(sums) * $scope.finalData.pipeSystem).toFixed(4)
      //$scope.finalData.totPresLoss = ((parseFloat(finalTotalPressure)) * 2).toFixed(3)
    }

    function getPredecessorId (rm) {
      if (rm.pipeRunData && rm.pipeRunData.pipeRunAndOrderId) {
        $scope.canDeriveTable2 = true
      } else {
        $scope.canDeriveTable2 = false
      }
      return;
    }

    function getMaxFlowTemp () {
      $scope.maxFlowTemp = 0;
      angular.forEach($scope.survey.surveys.rooms, function (value, idx) {
        if ($scope.survey.surveys.rooms[idx].flow_temperature != undefined) {
          //$scope.survey.surveys.rooms[idx].flow_temperature = $scope.survey.surveys.rooms[idx].flow_temperature
          if ($scope.survey.surveys.rooms[idx].flow_temperature > $scope.maxFlowTemp) {
            $scope.survey.surveys.maxFlowTemp = $scope.maxFlowTemp = $scope.survey.surveys.rooms[idx].flow_temperature;
          } else {
            $scope.survey.surveys.maxFlowTemp = $scope.maxFlowTemp;
          }
        }
      });
    }

    function getMassFlowRate (watts, sHeatCapacity, deltat) {
      return parseFloat((watts / (sHeatCapacity * deltat)));
    }

    function updateFinalData () {
      $scope.finalData.totalLitres = 0
      $scope.finalData.totalMass = ''
      $scope.finalData.totalMassFlow = []
      let roomMax = [];
      $scope.showAlert = false;

      angular.forEach($scope.survey.surveys.rooms, function (value, idx) {
        if ($scope.survey.surveys.rooms[idx].pipe) {
          if ($scope.survey.surveys.rooms[idx].pipe.waterVolInPipe > 0) {
            let ltrs = $scope.survey.surveys.rooms[idx].pipe.waterVolInPipe
            $scope.finalData.totalLitres = parseFloat($scope.finalData.totalLitres + ltrs)
          }
          if ($scope.survey.surveys.rooms[idx].pipe.massFlowRate) {
            let tMassFlow = $scope.survey.surveys.rooms[idx].pipe.massFlowRate;
            $scope.finalData.totalMassFlow.push(tMassFlow)
          }
        }

        let radsList = $scope.survey.surveys.rooms[idx].radiators;
        if (radsList) {
          var keys = Object.keys(radsList);
          let radMax = null;
          //for (var j = 0; j < radsList.length; j++) {
          if (keys.length > 0) {
            angular.forEach(keys, function (val, j) {
              if (radsList[val] != null || radsList[val] != undefined) {
                if ($scope.survey.surveys.rooms[idx].radiators[val].radswaterVolInPipe) {
                  let radsltrs = $scope.survey.surveys.rooms[idx].radiators[val].radswaterVolInPipe;
                  $scope.finalData.totalLitres = $scope.finalData.totalLitres + radsltrs;
                }
                if ($scope.survey.surveys.rooms[idx].radiators[val].massFlowRate) {
                  let radMassFl = $scope.survey.surveys.rooms[idx].radiators[val].massFlowRate;
                  $scope.finalData.totalMassFlow.push(radMassFl)
                }

                if (radsList[val].hasOwnProperty('radsTotalPressureLoss')) {
                  if (parseFloat($scope.survey.surveys.rooms[idx].radiators[val].radsTotalPressureLoss) > 0) {
                    radsList[val].room_name = $scope.survey.surveys.rooms[idx].room_name;
                    radsList[val].index_circuit = "No";
                    if (radMax == null) {
                      radMax = radsList[val];
                    } else if (radsList[val].radsTotalPressureLoss > radMax.radsTotalPressureLoss) {

                      radMax = radsList[val];
                    }
                  }
                }

              }
            });
            if (radMax != null) {
              roomMax.push(radMax);
            }
            $scope.showAlert = false;
          }
        }
      });
      if (roomMax.length > 0) {
        var selMax = roomMax[0];
        for (let j = 1; j < roomMax.length; j++) {
          if (roomMax[j] != null || roomMax[j] != undefined) {
            if (roomMax[j].radsTotalPressureLoss > selMax.radsTotalPressureLoss) {
              selMax = roomMax[j];
            }
          }
        }

        $scope.survey.surveys.rooms.filter(function (obj, i) {
          if (obj.room_name == selMax.room_name) {
            _.each(obj.radiators, function (val, index) {
              if (val != null) {
                if (val.radsTotalPressureLoss == selMax.radsTotalPressureLoss) {
                  // $scope.finalData.roomName = obj.room_name;
                  // $scope.finalData.radName = selMax.type
                  if (selMax.radsTotalPressureLoss) {
                    selMax.index_circuit = "Yes";
                    $scope.finalData.radsTotalPressureLoss = selMax.radsTotalPressureLoss;
                  } else {
                    selMax.index_circuit = "No";
                    $scope.finalData.radsTotalPressureLoss = 0;
                  }
                }
              }
            });
            obj.index_circuit = "Yes";
            return obj;
          }
        })
      }

      if ($scope.showAlert) {
        $scope.computeFinalData = true;
      } else {
        $scope.computeFinalData = false;
        let finalsubTotal = parseFloat($scope.finalData.radsTotalPressureLoss) + parseFloat($scope.finalData.totPreLoss);
        //$scope.finalData.icsubTotal = $scope.finalTotalPressure.value.toFixed(3)
        let comIcSubtotal = parseFloat($scope.finalData.icsubTotal);
        $scope.finalData.allowsubTotal = (comIcSubtotal * (parseFloat($scope.finalData.allowSubTotalPercent) / 100)).toFixed(4)
        let sums = comIcSubtotal + parseFloat($scope.finalData.allowsubTotal);
        $scope.finalData.totPresLoss = (parseFloat(sums) * $scope.finalData.pipeSystem).toFixed(4)
        $scope.finalData.totalMass = Math.max(...$scope.finalData.totalMassFlow)
        $scope.survey.surveys.pipeFinalData = $scope.finalData
        for (var i = 0; i < ignoredRooms.length; i++) {
          $scope.survey.surveys.rooms.splice(ignoredRooms[i].realIndex, 0, ignoredRooms[i])
        }
        apiService.update('surveys', $scope.survey).then(function (response) {
          $scope.survey = response;
        }, commonService.onError);
      }
    }

    $scope.fluidsChanged = function () {
      // var pipeCollec = $scope.pipeCollection;
      // var contentCollec = $scope.egCollection;
      // var collection = $scope.fluidCollection;
      $scope.pipeSpecificHeatCapacity = getSpecificHeatCapacity($scope.fluid)
      let denVisco = getDensitynViscosity($scope.fluid);
      if ($scope.fluid == 'Water') {
        $scope.contents = false;
      } else {
        $scope.contents = true;
      }
      $scope.density = denVisco.density
      $scope.dynamViscosity = denVisco.viscosity
      var rooms = $scope.survey.surveys.rooms;
      angular.forEach(rooms, function (rm, index) {
        var item = "none"
        $scope.updateRooms($scope.survey.surveys.rooms, index, item)

      });
      getIndexEdit()

    }
    // var a = [10, 12, 15]
    // var b = [1, 2, 3]
    $scope.onPipeTypeChange = function () {
      var rooms = $scope.survey.surveys.rooms;
      angular.forEach(rooms, function (rm, index) {
        var item = "none"
        $scope.updateRooms($scope.survey.surveys.rooms, index, item)
      });
      // if ($scope.pipeType == "COPPER (X)") {
      //     $scope.oldRooms = $scope.survey.surveys.rooms
      // }
      getIndexEdit()
    }

    $scope.onDefaultChange = function () {
      $scope.pipeType = "COPPER (X)"
      // $scope.survey.surveys.rooms = $scope.oldRooms;
      angular.forEach($scope.oldRooms, function (rm, index) {
        var item = "none"
        $scope.updateRooms($scope.survey.surveys.rooms, index, item)

      });

    }

    function getComputeState (idx) {
      if ($scope.survey.surveys.rooms[idx].selectPipeDia == false || $scope.survey.surveys.rooms[idx].selectRadsPipeDia == false) {
        $scope.hideComputeButton = true
      }
    }

    function radsIndexUpdate () {
      let maxRads = []
      $scope.hideComputeButton = false;
      $scope.computeFinalData = true;
      angular.forEach($scope.survey.surveys.rooms, function (value, idx) {
        let rads = $scope.survey.surveys.rooms[idx].radiators;
        if (rads) {
          var keys = Object.keys(rads);
          let radMax = null;
          if (keys.length > 0) {
            angular.forEach(keys, function (val, j) {
              if (rads[val] != null || rads[val] != undefined) {
                if (rads[val].hasOwnProperty('radsTotalPressureLoss')) {
                  if (parseFloat($scope.survey.surveys.rooms[idx].radiators[val].radsTotalPressureLoss) > 0) {
                    rads[val].room_name = $scope.survey.surveys.rooms[idx].room_name;
                    rads[val].index_circuit = "No";
                    if (radMax == null) {
                      radMax = rads[val];
                    } else if (rads[val].radsTotalPressureLoss > radMax.radsTotalPressureLoss) {

                      radMax = rads[val];
                    }
                  }
                }
              }
            });
            if (radMax != null) {
              maxRads.push(radMax);
            }
          }
        }
        $scope.survey.surveys.rooms[idx].index_circuit = "No"
        getComputeState(idx);
      });

      // if (maxRads.length > 0) {
      //   var selMax = maxRads[0];
      //   for (let j = 1; j < maxRads.length; j++) {
      //     if (maxRads[j] != null || maxRads[j] != undefined) {
      //       if (maxRads[j].radsTotalPressureLoss > selMax.radsTotalPressureLoss) {
      //         selMax = maxRads[j];
      //       }
      //     }
      //   }


      //   $scope.survey.surveys.rooms.filter(function (obj, i) {
      //     if (obj.room_name == selMax.room_name) {
      //       _.each(obj.radiators, function (val, index) {
      //         if (val != null) {
      //           if (val.radsTotalPressureLoss == selMax.radsTotalPressureLoss) {
      //             if (selMax.radsTotalPressureLoss) {
      //               selMax.index_circuit = "Yes";
      //             } else {
      //               selMax.index_circuit = "No";
      //             }
      //           }
      //         }
      //       });
      //       obj.index_circuit = "Yes";
      //       return obj;
      //     }
      //   })
      // }
    }

    function getDensitynViscosity (fluid) {
      let retObj = {
        density: '',
        viscosity: ''
      }
      if (fluid == 'Water') {
        var data = $rootScope.pipe_data.densityWater

        let denVisco = data.filter(function (obj) {
          if ($scope.maxFlowTemp == obj.deg) {
            return obj;
          }
        });

        $scope.survey.surveys.fluid = 'Water';
        retObj.density = denVisco[0].density
        retObj.viscosity = denVisco[0].visc

      } else {
        var data = $rootScope.pipe_data.densityWaterGlycol

        let denVisco = data.filter(function (obj) {
          if ($scope.maxFlowTemp == obj.temp) {
            return obj;
          }
        });

        let glucolPercent = $scope.egContent;

        //get density
        let waGlyDen = denVisco[0].density.filter(function (obj) {
          if (obj.percent == glucolPercent) {
            return obj;
          }
        })
        //get viscosity
        let waGlyVisc = denVisco[0].viscosity.filter(function (obj) {
          if (obj.percent == glucolPercent) {
            return obj;
          }
        })

        $scope.survey.surveys.fluid = 'Water & Glycol';
        retObj.density = waGlyDen[0].val
        retObj.viscosity = waGlyVisc[0].val * 1000
      }
      return retObj;
    }

    function getSpecificHeatCapacity (fluid) {
      let flowTemp = $scope.maxFlowTemp;
      if (fluid == 'Water') {
        let speData = $rootScope.pipe_data.speHeatCapaWater
        let heatCapaObj = speData.filter(function (obj) {
          if (flowTemp == obj.deg) {
            return obj;
          }
        })
        return heatCapaObj[0].val;

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
        return heatCapaObj[0].val;
      }
    }


    function getMeanVelosity (idx, itemsplit = '') {
      // $scope.pipeNomDiaArr = []

      $scope.pipeInfo = $rootScope.pipe_data.pipes.filter(function (obj) {
        if (obj.name == $scope.pipeType) return obj;
      })
      // var a = $scope.pipeInfo[0].dia.filter(function(obj) {
      //     $scope.pipeNomDiaArr.push(obj.norDia)
      // })
      // var closest = $scope.pipeNomDiaArr.reduce(function(prev, curr) {
      //     return (Math.abs(curr - $scope.survey.surveys.rooms[idx].pipe_nom_dia) < Math.abs(prev - $scope.survey.surveys.rooms[idx].pipe_nom_dia) ? curr : prev);
      // });
      $scope.diameter = $scope.pipeInfo[0].dia.filter(function (obj) {
        let nomDia
        if (itemsplit != '') {
          nomDia = $scope.survey.surveys.rooms[idx].radiators[itemsplit].pipeSelected
        } else {
          nomDia = $scope.survey.surveys.rooms[idx].pipe_nom_dia
        }
        if (obj.norDia == nomDia) {
          return obj;
        }
      })

      if ($scope.diameter[0] != undefined) {
        let mfr
        if (itemsplit != '') {
          $scope.survey.surveys.rooms[idx].radiators[itemsplit].selectPipeDia = true;
          let useMfr = parseFloat($scope.survey.surveys.rooms[idx].radiators[itemsplit].massFlowSubTotal) || parseFloat($scope.survey.surveys.rooms[idx].radiators[itemsplit].massFlowRate)
          mfr = useMfr || parseFloat($scope.massFlowRate);
        } else {
          $scope.survey.surveys.rooms[idx].selectPipeDia = true
          mfr = parseFloat($scope.survey.surveys.rooms[idx].massFlowSubTotal) || parseFloat($scope.massFlowRate);
        }
        if ($scope.survey.surveys.rooms[idx].hasRads) {
          $scope.survey.surveys.rooms[idx].selectPipeDia = true;
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
          $scope.survey.surveys.rooms[idx].radiators[itemsplit].selectPipeDia = false;
        } else {
          $scope.survey.surveys.rooms[idx].selectPipeDia = false;
          if ($scope.survey.surveys.rooms[idx].hasRads) {
            $scope.survey.surveys.rooms[idx].selectPipeDia = true;
          }
        }
      }
    }

    function getVolumetricFlowRate (idx, itemsplit = '') {
      let mv
      if (itemsplit != '') {
        mv = $scope.survey.surveys.rooms[idx].radiators[itemsplit].radsMean;
      } else {
        mv = $scope.survey.surveys.rooms[idx].pipe.meanVelosity;
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


    function getReynoldsNumber (idx, itemsplit = '') {
      if ($scope.diameter[0] != undefined) {
        let mv
        if (itemsplit != '') {
          mv = $scope.survey.surveys.rooms[idx].radiators[itemsplit].radsMean;
        } else {
          mv = $scope.survey.surveys.rooms[idx].pipe.meanVelosity;
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
          rnum = $scope.survey.surveys.rooms[idx].radiators[itemsplit].radsreynoldsNumber
        } else {
          rnum = $scope.survey.surveys.rooms[idx].pipe.reynoldsNumber
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
          y6 = $scope.radsFrictionFactor * 1;
          t6 = $scope.survey.surveys.rooms[idx].radiators[itemsplit].radsMean;
        } else {
          y6 = $scope.frictionFactor * 1;
          t6 = $scope.survey.surveys.rooms[idx].pipe.meanVelosity;
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

    function getIndexEdit () {

      var indexPriFlow = {
        roomHeatLoss: 0,
        speHeatCapacity: '',
        massFlowRat: '',
        returnTemp: '',
        delta: '',
        pipeSelect: '',
        meanVelo: '',
        veloCheck: '',
        volumetricFlow: '',
        pressureL: '',
        pLoss: '',
        lengthFlow: '',
        totPreLoss: '',
        waterVolume: ''
      }

      if ($scope.survey.surveys.primaryFlowIndex) {
        indexPriFlow.delta = $scope.survey.surveys.primaryFlowIndex.delta;
        indexPriFlow.lengthFlow = $scope.survey.surveys.primaryFlowIndex.lengthFlow;
        indexPriFlow.pipeSelect = $scope.survey.surveys.primaryFlowIndex.pipeSelect;
        indexPriFlow.maxFlowTemp = $scope.survey.surveys.maxFlowTemp;
      }

      _.each($scope.survey.surveys.rooms, function (obj) {
        indexPriFlow.roomHeatLoss += parseFloat(obj.t_watts);
        indexPriFlow.speHeatCapacity = $scope.pipeSpecificHeatCapacity;

      })
      indexPriFlow.roomHeatLoss = indexPriFlow.roomHeatLoss.toFixed(3);
      if (indexPriFlow.delta) {
        indexPriFlow.maxFlowTemp = $scope.maxFlowTemp;
        indexPriFlow.returnTemp = $scope.maxFlowTemp - indexPriFlow.delta;
        var multiply = $scope.pipeSpecificHeatCapacity * indexPriFlow.delta
        indexPriFlow.massFlowRat = $scope.indexMassFlow = indexPriFlow.roomHeatLoss / multiply;
        $scope.finalData.totalMassFlow.push(indexPriFlow.massFlowRat)
      }
      $scope.survey.surveys.primaryFlowIndex = indexPriFlow;
      $scope.primaryFlowIndex = indexPriFlow;
      if (indexPriFlow.pipeSelect) {
        $scope.densityViscosity = getDensitynViscosity($scope.fluid);
        indexPriFlow.meanVelo = $scope.indexMeanVelo = indexgetMeanVelosity();
        indexPriFlow.volumetricFlow = indexgetVolumetricFlowRate()
        // if (indexPriFlow.veloCheck = indexPriFlow.meanVelo >= $scope.miniVeloSel) {
        //   indexPriFlow.veloCheck = "Accepted"
        // } else {
        //   indexPriFlow.veloCheck = "Reduce Dia"
        // }
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
        indexPriFlow.pLoss = indexPriFlow.pLoss;
        indexPriFlow.totPreLoss = indexPriFlow.pLoss * indexPriFlow.lengthFlow;
        $scope.finalData.totPreLoss = indexPriFlow.totPreLoss;
        if ($scope.diameter[0] != undefined) {
          indexPriFlow.waterVolume = $scope.diameter[0].Litres * indexPriFlow.lengthFlow;
          $scope.finalData.totalLitres = $scope.finalData.totalLitres + indexPriFlow.waterVolume;
          $scope.primaryFlowIndex = indexPriFlow;
          $scope.survey.surveys.primaryFlowIndex = indexPriFlow;
        }
      }

    }

    function getTees (idx) {
      let initTees = {
        teeNo: $scope.survey.surveys.tees[idx].teeNo ? $scope.survey.surveys.tees[idx].teeNo : '',
        preId: $scope.survey.surveys.tees[idx].preId ? $scope.survey.surveys.tees[idx].preId : 0,
        pipeRunIds: $scope.survey.surveys.tees[idx].pipeRunIds ? $scope.survey.surveys.tees[idx].pipeRunIds : 0,
        massFlowSubTotal: $scope.survey.surveys.tees[idx].massFlowSubTotal ? $scope.survey.surveys.tees[idx].massFlowSubTotal : 0,
        pipeSelect: $scope.survey.surveys.tees[idx].pipeSelect ? $scope.survey.surveys.tees[idx].pipeSelect : 0,
        meanVelosity: $scope.survey.surveys.tees[idx].meanVelosity ? $scope.survey.surveys.tees[idx].meanVelosity : 0,
        velosityCheck: $scope.survey.surveys.tees[idx].velosityCheck ? $scope.survey.surveys.tees[idx].velosityCheck : "Accepted",
        pressureLossPA: $scope.survey.surveys.tees[idx].pressureLossPA ? $scope.survey.surveys.tees[idx].pressureLossPA : 0,
        pressureLossM: $scope.survey.surveys.tees[idx].pressureLossM ? $scope.survey.surveys.tees[idx].pressureLossM : 0,
        pipeRunFlowLength: $scope.survey.surveys.tees[idx].pipeRunFlowLength ? $scope.survey.surveys.tees[idx].pipeRunFlowLength : 0,
        totalPressureLoss: $scope.survey.surveys.tees[idx].totalPressureLoss ? $scope.survey.surveys.tees[idx].totalPressureLoss : 0,
        circuiteFeedingMassFlowRate: $scope.survey.surveys.tees[idx].circuiteFeedingMassFlowRate ? $scope.survey.surveys.tees[idx].circuiteFeedingMassFlowRate : $scope.survey.surveys.tees[idx].massFlowSubTotal,
        isCustom: $scope.survey.surveys.tees[idx].isCustom ? $scope.survey.surveys.tees[idx].isCustom : false
      }
      if ($scope.survey.surveys.tees) {
        initTees.pipeSelect = $scope.survey.surveys.tees[idx].pipeSelect;
      }
      if ($scope.survey.surveys.tees[idx].pipeSelect) {
        $scope.teesMeanVelosity = $scope.survey.surveys.tees[idx].meanVelosity = indexgetMeanVelosity(true, idx);
        initTees.meanVelosity = $scope.survey.surveys.tees[idx].meanVelosity
        // if (initTees.meanVelosity >= $scope.miniVeloSel) {
        //   initTees.velosityCheck = "Accepted"
        // } else {
        //   initTees.velosityCheck = "Reduce Dia"
        // }
        if (initTees.meanVelosity >= $scope.miniVeloSel && initTees.meanVelosity <= $scope.maxVeloSel) {
          initTees.velosityCheck = "Accepted"
        } else if (initTees.meanVelosity > $scope.maxVeloSel) {
          initTees.velosityCheck = "Increase Dia"
        } else {
          initTees.velosityCheck = "Reduce Dia"
        }
        $scope.survey.surveys.tees[idx].reynoldsNum = indexgetReynoldsNumber(true);
        $scope.teesfrictionFactor = indexgetFrictionFactor(true, idx);
        initTees.pressureLossPA = indexgetPressureLoss(true);
        initTees.pressureLossM = initTees.pressureLossPA / 9804.139432;
        initTees.pipeRunFlowLength = $scope.survey.surveys.tees[idx].pipeRunFlowLength ? $scope.survey.surveys.tees[idx].pipeRunFlowLength : 0;
        initTees.totalPressureLoss = $scope.survey.surveys.tees[idx].pressureLossM * $scope.survey.surveys.tees[idx].pipeRunFlowLength;
      }
      //$scope.tees[idx] = initTees
      $scope.survey.surveys.tees[idx] = initTees;
    }

    function getRadiatorsDelta (idx) {
      if ($scope.survey.surveys.rooms[idx].radiators) {
        _.each($scope.survey.surveys.rooms[idx].radiators, function (obj, key) {

          var itemsplit = key;
          var selRad = $scope.survey.surveys.rooms[idx].radiators[itemsplit];
          if (selRad != null) {

            if (selRad.type != "Custom") {
              var radiator = _.find(radiators, function (rad) {
                return rad.type == selRad.type;
              });
            }
            if (selRad.height && selRad.length) {
              if (selRad.type == "") {
                $scope.survey.surveys.rooms[idx].selectRadsPipeDia = true;
                $scope.survey.surveys.rooms[idx].radiators[itemsplit].selectPipeDia = true;
              } else if (selRad.type && selRad.pipeSelected && selRad.pipeSelected > 0 && selRad.radsFlowreturn && selRad.radsFlowreturn > 0) {
                $scope.survey.surveys.rooms[idx].selectRadsPipeDia = true;
                $scope.survey.surveys.rooms[idx].radiators[itemsplit].selectPipeDia = true;
              } else {
                $scope.survey.surveys.rooms[idx].selectRadsPipeDia = false;
                $scope.survey.surveys.rooms[idx].radiators[itemsplit].selectPipeDia = false;
              }

              var length = selRad.length || 100;
              var radOutputWatts;

              if (selRad.type != "Custom") {
                _.each(radiator.heights, function (rad_height, rad_idx) {
                  if (rad_height == selRad.height)
                    radOutputWatts = radiator.watts[rad_idx];
                });
                let flowTempArray = [35, 40, 45, 50, 55, 60];
                $scope.survey.surveys.rooms[idx].radiators[itemsplit].flow_output = [];
                $scope.survey.surveys.rooms[idx].total_flow = [0, 0, 0, 0, 0, 0];

                if (radiator.section_length == 'N/A')
                  $scope.survey.surveys.rooms[idx].radiators[itemsplit].watts = Math.round((length / 100) * radOutputWatts);
                else
                  $scope.survey.surveys.rooms[idx].radiators[itemsplit].watts = Math.round((length / radiator.section_length) * radOutputWatts);

                _.each(flowTempArray, function (temp, temp_idx) {
                  var lessTemp = temp - ($scope.survey.surveys.rooms[idx].designed_temperature);
                  var conversionFactor = Math.pow((lessTemp / 50), 1.3);
                  $scope.survey.surveys.rooms[idx].radiators[itemsplit].flow_output[temp_idx] = Math.round($scope.survey.surveys.rooms[idx].radiators[itemsplit].watts * conversionFactor);
                  $scope.survey.surveys.rooms[idx].total_flow[temp_idx] += $scope.survey.surveys.rooms[idx].radiators[itemsplit].flow_output[temp_idx];
                });

                var flowTemp = $scope.survey.surveys.rooms[idx].flow_temperature
                var retTemp = $scope.survey.surveys.rooms[idx].return_temperature
                var meanTemp = (flowTemp + retTemp) / 2;
                let meanTempKey = 0;
                flowTempArray.forEach(function (val, key) {
                  if (val == meanTemp) {
                    meanTempKey = key;
                  }
                });

                let outKW = 0;
                if (flowTempArray.includes(meanTemp)) {
                  outKW = $scope.survey.surveys.rooms[idx].radiators[itemsplit].flow_output[meanTempKey]
                } else if (meanTemp >= 35 && meanTemp <= 60) {
                  //let rndMean = (parseInt(meanTemp) + 4) / 5 * 5;
                  let rndMeanvalue = Math.ceil(meanTemp / 5) * 5
                  let rndMean = flowTempArray.indexOf(rndMeanvalue);
                  outKW = $scope.survey.surveys.rooms[idx].radiators[itemsplit].flow_output[rndMean]
                } else if (meanTemp < 35) {
                  outKW = $scope.survey.surveys.rooms[idx].radiators[itemsplit].flow_output[0]
                } else if (meanTemp > 60) {
                  outKW = $scope.survey.surveys.rooms[idx].radiators[itemsplit].flow_output[5]
                } else {
                  outKW = radOutputWatts
                }
                $scope.survey.surveys.rooms[idx].radiators[itemsplit].outputKW = outKW
                radOutputWatts = outKW;
              } else {
                radOutputWatts = parseFloat(selRad.watts);
              }

              if (radOutputWatts != 0) {
                $scope.survey.surveys.rooms[idx].radiators[itemsplit].index_circuit = "No";
                $scope.survey.surveys.rooms[idx].radiators[itemsplit].watts = radOutputWatts;
                let calcWats = radOutputWatts;
                if (selRad.type != "Custom") {
                  calcWats = radOutputWatts / 1000;
                }
                var speheadcapa = $scope.survey.surveys.pipeSpecificHeatCapacity ? parseFloat($scope.survey.surveys.pipeSpecificHeatCapacity) : parseFloat($scope.specificHeatCapacity);
                if ($scope.survey.surveys.rooms[idx].deltat > 0) {
                  var radsMass = parseFloat(calcWats) / (speheadcapa * parseFloat($scope.survey.surveys.rooms[idx].deltat));
                  $scope.survey.surveys.rooms[idx].radiators[itemsplit].massFlowRate = parseFloat(radsMass)

                  var radsPipe = $scope.survey.surveys.rooms[idx].radiators[itemsplit].pipeSelected;

                  if (radsPipe && radsPipe > 0 && length && selRad.height) {
                    calculatePipeCalcRad(idx, itemsplit, false)
                  } else {
                    $scope.survey.surveys.rooms[idx].selectRadsPipeDia = false;
                    $scope.survey.surveys.rooms[idx].radiators[itemsplit].selectPipeDia = true;
                  }
                }
              }
            } else if (selRad.type && selRad.type != "") {
              $scope.survey.surveys.rooms[idx].selectRadsPipeDia = false;
            } else {
              $scope.survey.surveys.rooms[idx].selectRadsPipeDia = true;
              $scope.survey.surveys.rooms[idx].radiators[itemsplit].selectPipeDia = true;
            }
          } else {
            $scope.survey.surveys.rooms[idx].selectRadsPipeDia = true;
            if ($scope.survey.surveys.rooms[idx].radiators[itemsplit] != null) {
              $scope.survey.surveys.rooms[idx].radiators[itemsplit].selectPipeDia = true;
            }
          }
        })
      }
    }

    //index
    function indexgetMeanVelosity (tee = false, idx = 0) {
      // $scope.indexArr = []
      $scope.pipeInfo = $rootScope.pipe_data.pipes.filter(function (obj) {
        if (obj.name == $scope.pipeType) return obj;
      })
      // var b = $scope.pipeInfo[0].dia.filter(function(obj) {
      //     $scope.indexArr.push(obj.norDia)
      // })
      // var closest = $scope.indexArr.reduce(function(prev, curr) {
      //     return (Math.abs(curr - $scope.survey.surveys.primaryFlowIndex.pipeSelect) < Math.abs(prev - $scope.survey.surveys.primaryFlowIndex.pipeSelect) ? curr : prev);
      // });
      let massFlowRateComputed
      $scope.diameter = $scope.pipeInfo[0].dia.filter(function (obj) {
        let nomDia
        if (tee == false) {
          nomDia = $scope.survey.surveys.primaryFlowIndex.pipeSelect
          massFlowRateComputed = $scope.indexMassFlow || parseFloat($scope.massFlowRate);
        } else {
          nomDia = $scope.survey.surveys.tees[idx].pipeSelect
          massFlowRateComputed = parseFloat($scope.survey.surveys.tees[idx].massFlowSubTotal)
        }
        if (obj.norDia == nomDia) {
          return obj;
        }
      })
      if ($scope.diameter[0] != undefined) {
        var x = 4 * massFlowRateComputed
        var u = $scope.diameter[0].intDia / 1000;
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

    var temparray1 = []

    function indexCircuit (idx) {
      $scope.arr = []
      $scope.mins = []
      var rads = $scope.survey.surveys.rooms[idx].radiators;
      _.each(rads, function (obj) {
        $scope.mins.push(obj)
        $scope.arr.push(obj.radsTotalPressureLoss)
      })
      temparray1.push(Math.max(parseFloat($scope.arr)))
      $scope.max = temparray1.reduce(function (a, b) {
        return Math.max(a, b);
      });
    }
  }

})();
