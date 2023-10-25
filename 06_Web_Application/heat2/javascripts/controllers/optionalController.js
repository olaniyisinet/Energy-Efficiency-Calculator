(function () {
  'use strict';

  angular.module('cloudheatengineer').service('dijkstra', [function () {
    this.pathFinder = function (mapping, leaves, root) {

      // Graph data structure and shortest path algorithm
      var Graph = (function (undefined) {

        var extractKeys = function (obj) {
          var keys = [], key;
          for (key in obj) {
            Object.prototype.hasOwnProperty.call(obj, key) && keys.push(key);
          }
          return keys;
        }

        var sorter = function (a, b) {
          return parseFloat(a) - parseFloat(b);
        }

        var findPaths = function (map, start, end, infinity) {
          infinity = infinity || Infinity;

          var costs = {},
            open = { '0': [start] },
            predecessors = {},
            keys;

          var addToOpen = function (cost, vertex) {
            var key = "" + cost;
            if (!open[key]) open[key] = [];
            open[key].push(vertex);
          }

          costs[start] = 0;

          while (open) {
            if (!(keys = extractKeys(open)).length) break;

            keys.sort(sorter);

            var key = keys[0],
              bucket = open[key],
              node = bucket.shift(),
              currentCost = parseFloat(key),
              adjacentNodes = map[node] || {};

            if (!bucket.length) delete open[key];

            for (var vertex in adjacentNodes) {
              if (Object.prototype.hasOwnProperty.call(adjacentNodes, vertex)) {
                var cost = adjacentNodes[vertex],
                  totalCost = cost + currentCost,
                  vertexCost = costs[vertex];

                if ((vertexCost === undefined) || (vertexCost > totalCost)) {
                  costs[vertex] = totalCost;
                  addToOpen(totalCost, vertex);
                  predecessors[vertex] = node;
                }
              }
            }
          }

          if (costs[end] === undefined) {
            return null;
          } else {
            return predecessors;
          }

        }

        var extractShortest = function (predecessors, end) {
          var nodes = [],
            u = end;

          while (u !== undefined) {
            nodes.push(u);
            u = predecessors[u];
          }

          nodes.reverse();
          return nodes;
        }

        var findShortestPath = function (map, nodes) {
          var start = nodes.shift(),
            end,
            predecessors,
            path = [],
            shortest;

          while (nodes.length) {
            end = nodes.shift();
            predecessors = findPaths(map, start, end);

            if (predecessors) {
              shortest = extractShortest(predecessors, end);
              if (nodes.length) {
                path.push.apply(path, shortest.slice(0, -1));
              } else {
                return path.concat(shortest);
              }
            } else {
              return null;
            }

            start = end;
          }
        }

        var toArray = function (list, offset) {
          try {
            return Array.prototype.slice.call(list, offset);
          } catch (e) {
            var a = [];
            for (var i = offset || 0, l = list.length; i < l; ++i) {
              a.push(list[i]);
            }
            return a;
          }
        }

        var Graph = function (map) {
          this.map = map;
        }

        Graph.prototype.findShortestPath = function (start, end) {
          if (Object.prototype.toString.call(start) === '[object Array]') {
            return findShortestPath(this.map, start);
          } else if (arguments.length === 2) {
            return findShortestPath(this.map, [start, end]);
          } else {
            return findShortestPath(this.map, toArray(arguments));
          }
        }

        Graph.findShortestPath = function (map, start, end) {
          if (Object.prototype.toString.call(start) === '[object Array]') {
            return findShortestPath(map, start);
          } else if (arguments.length === 3) {
            return findShortestPath(map, [start, end]);
          } else {
            return findShortestPath(map, toArray(arguments, 1));
          }
        }

        return Graph;

      })();

      var graph = new Graph(mapping);

      var shortestpaths = [];

      for (var i = 0; i < leaves.length; i++) {
        shortestpaths.push({
          id: leaves[i],
          optionValue: graph.findShortestPath(root, leaves[i])
        });
      }
      return shortestpaths;
    }
  }]);
})();


(function () {
  'use strict';

  angular.module('cloudheatengineer')
    .controller('OptionalController', OptionalController)
    .controller('DHWController', DHWController)
    .controller('EmittersController', EmittersController)
    .controller('BivalentController', BivalentController)
    .controller('GroundLoopController', GroundLoopController)
    .controller('thermalBridgingController', thermalBridgingController)
    .controller('CurrentRadsController', CurrentRadsController)
    .controller('FuelCompareController', FuelCompareController)
    .controller('PipeTempController', PipeTempController)
    .controller('ModalPipeRunEditController', ModalPipeRunEditController)
    .controller('ModalTeeNoController', ModalTeeNoController)
    .controller('ModalPipePredecessorController', ModalPipePredecessorController)
    .controller('ModalPrimaryFlowInstanceController', ModalPrimaryFlowInstanceController)
    .controller('HeatDemandController', HeatDemandController)


  /**
   *  Optional Controller
   */
  OptionalController.$inject = ['$scope', '$rootScope', '$routeParams', '$location', 'apiService', 'commonService', 'calculationService', 'summaryHelperService'];

  function OptionalController ($scope, $rootScope, $routeParams, $location, apiService, commonService, calculationService, summaryHelperService) {


    $rootScope.showHeader = false;
    $rootScope.showFooter = false;
    $rootScope.heatmanagerview = true;

    $scope.valueChanged = false;
    $scope.isSummary = true;
    $scope.isHeatPump = false;
    $scope.pipeRadsRadiodisabled = true;

    init();

    $scope.informationLabel = {
      dhw: {
        label: 'information required',
        color: '3px solid orange'
      },
      emitters: {
        label: 'information required',
        color: '3px solid orange'
      },
      radiators: {
        label: 'information OK',
        color: '3px solid green'
      },
      new_radiators: {
        label: 'information OK',
        color: '3px solid green'
      },
      pipeRadiators: {
        label: 'information OK',
        color: '3px solid green'
      },
      bivalent: {
        label: 'information OK',
        color: '3px solid green'
      },
      fuel: {
        label: 'information OK',
        color: '3px solid green'
      },
      ground_loop: {
        label: 'information required',
        color: '3px solid orange'
      },
      photos_notes: {
        label: 'information OK',
        color: '3px solid green'
      },
      heat_demand: {
        label: 'information OK',
        color: '3px solid green'
      }
    };

    $scope.moveTo = function (location, page) {
      if($scope.valueChanged){
        summaryHelperService.switchAndUpdateSurvey(null, location, $scope.survey, '', $scope.valueChanged).then(function () {
          if (page)
            $location.path('/' + location + '/' + $scope.survey._id + '/' + page);
          else
            $location.path('/' + location + '/' + $scope.survey._id);
        });
      }
    };

    $scope.applyInformation = function () {
      $scope.valueChanged = true;
      var count;
      // DHW
      if (!!$scope.survey.surveys.includedReport.dhw) {
        count = 0;
        angular.forEach($scope.survey.surveys.domestic_hot_water, function (value, key) {
          if (key == 'number_of_bed_rooms' || key == 'number_of_occupants_per_bedroom' || key == 'flow_temperature_for_hot_water') {
            if (value == 0)
              count++;
          }

        });
        if($scope.survey.surveys.domestic_hot_water.flow_temperature_for_hot_water == undefined) {
          count++
        } else {
          if($scope.survey.surveys.domestic_hot_water.flow_temperature_for_hot_water.temp == undefined || $scope.survey.surveys.domestic_hot_water.flow_temperature_for_hot_water.value == null) {
            count++;
          }
        }


        if (!!count && $scope.survey.surveys.includedReport.dhw == 'YES') {
          $scope.informationLabel.dhw.label = 'information required';
          $scope.informationLabel.dhw.color = '3px solid orange';
        } else if ($scope.survey.surveys.includedReport.dhw == 'NO') {
          $scope.informationLabel.dhw.label = 'not selected, no information required';
          $scope.informationLabel.dhw.color = '3px solid grey';
        } else {
          $scope.informationLabel.dhw.label = 'information OK';
          $scope.informationLabel.dhw.color = '3px solid green';
        }
      }

      if (!!$scope.survey.surveys.proposed_install_type) {
        $scope.isHeatPump = ($scope.survey.surveys.proposed_install_type.toLowerCase() == 'ashp' || $scope.survey.surveys.proposed_install_type.toLowerCase() == 'gshp')
      }

      // Emitters & Performance
      if (!!$scope.survey.surveys.includedReport.emitters) {
        count = 0;
        var hasOneMax = false;
        let errCount = 0;
        angular.forEach($scope.survey.surveys.rooms, function (room) {
          if (!room.flow_temperature && room.is_the_room_split == 0)
            count++;
          if (room.flow_temperature > parseInt($scope.survey.surveys.maximum_designed_flow_temperature) && room.room_partner_id == null)
            count++;
          if(room.flow_temperature == parseInt($scope.survey.surveys.maximum_designed_flow_temperature)){
            hasOneMax = true
          }

          if($scope.survey.surveys.proposed_install_type.toLowerCase() == 'ashp' || $scope.survey.surveys.proposed_install_type.toLowerCase() == 'gshp') {
            if(room.emitters.space_heating_likely_spf == null || room.emitters.space_heating_likely_spf == 0) {
              errCount++
            }
          }
        });
        if (!!count && $scope.survey.surveys.includedReport.emitters == 'YES') {
          $scope.informationLabel.emitters.label = 'information required';
          $scope.informationLabel.emitters.color = '3px solid orange';
        } else if (!hasOneMax && $scope.survey.surveys.includedReport.emitters == 'YES') {
          $scope.informationLabel.emitters.label = 'information required';
          $scope.informationLabel.emitters.color = '3px solid orange';
        } else if ($scope.survey.surveys.includedReport.emitters == 'NO') {
          $scope.informationLabel.emitters.label = 'not selected, no information required';
          $scope.informationLabel.emitters.color = '3px solid grey';
        } else {
          $scope.informationLabel.emitters.label = 'information OK';
          $scope.informationLabel.emitters.color = '3px solid green';
        }
        if(errCount > 0) {
          $scope.informationLabel.emitters.label = 'information required';
          $scope.informationLabel.emitters.color = '3px solid orange';
        }
      }

      // Current Radiators
      if (!!$scope.survey.surveys.includedReport.radiators) {
        if ($scope.survey.surveys.includedReport.radiators == 'YES') {
          $scope.informationLabel.radiators.label = 'information OK';
          $scope.informationLabel.radiators.color = '3px solid green';
        } else if ($scope.survey.surveys.includedReport.radiators == 'NO') {
          $scope.informationLabel.radiators.label = 'not selected, no information required';
          $scope.informationLabel.radiators.color = '3px solid grey';
        }
      }

      $scope.gotoPhotoNotes = function () {
        apiService.update('surveys', $scope.survey).then(function (response) {
          $scope.survey = response;
          $location.path('/uploaded-image/' + $scope.survey._id + '/' + "optional")
        }, commonService.onError);
      }

      // goto heat
      $scope.gotoHeatDemand = function () {
        apiService.update('surveys', $scope.survey).then(function (response) {
          $scope.survey = response;
          $location.path('/heat-demand/' + $scope.survey._id)
        }, commonService.onError);
      }

      // new Radiators
      if (!!$scope.survey.surveys.includedReport.newradiators) {
        if ($scope.survey.surveys.includedReport.newradiators == 'YES') {
          if ($scope.survey.surveys.new_rad_deltaT) {
            $scope.informationLabel.new_radiators.label = 'information OK';
            $scope.informationLabel.new_radiators.color = '3px solid green';
          } else {
            $scope.informationLabel.new_radiators.label = 'information required';
            $scope.informationLabel.new_radiators.color = '3px solid orange';
          }
        } else if ($scope.survey.surveys.includedReport.newradiators == 'NO') {
          $scope.informationLabel.new_radiators.label = 'not selected, no information required';
          $scope.informationLabel.new_radiators.color = '3px solid grey';
        }
      }

      // if ($scope.survey.surveys.includedReport.newradiators == 'YES') {
      //   $scope.informationLabel.radiators.label = 'information OK';
      //   $scope.informationLabel.radiators.color = '3px solid green';
      // } else if ($scope.survey.surveys.includedReport.radiators == 'NO') {
      //   $scope.informationLabel.radiators.label = 'not selected, no information required';
      //   $scope.informationLabel.radiators.color = '3px solid grey';
      // }

      // Current Pipe Radiators
      if (!!$scope.survey.surveys.includedReport.pipeRadiators) {
        count = 0;
        angular.forEach($scope.survey.surveys.rooms, function (value, idx) {
          if (value.selectPipeDia == false)
            count++;

          if (value.radiators) {
            let radKeys = Object.keys(value.radiators)
            angular.forEach(radKeys, function (key) {
              if (value.radiators[key]) {
                if (value.radiators[key].selectPipeDia == false) {
                  count++
                }
              }
            })
          }
        });
        if (count > 0 && $scope.survey.surveys.includedReport.pipeRadiators == 'YES') {
          $scope.informationLabel.pipeRadiators.label = 'information required';
          $scope.informationLabel.pipeRadiators.color = '3px solid orange';
        } else if ($scope.survey.surveys.includedReport.pipeRadiators == 'YES') {
          $scope.informationLabel.pipeRadiators.label = 'information OK';
          $scope.informationLabel.pipeRadiators.color = '3px solid green';
        } else if ($scope.survey.surveys.includedReport.pipeRadiators == 'NO') {
          $scope.informationLabel.pipeRadiators.label = 'not selected, no information required';
          $scope.informationLabel.pipeRadiators.color = '3px solid grey';
        }
        $scope.survey.surveys.includedReport.pipeRadiators = 'NO';
      }

      // Bivalent
      if (!!$scope.survey.surveys.includedReport.bivalent) {
        if ((!$scope.survey.surveys.is_bivalent_required || !$scope.survey.surveys.bivalent_fuel_type || !$scope.survey.surveys.bivalent.point) && $scope.survey.surveys.includedReport.bivalent == 'YES') {
          $scope.informationLabel.bivalent.label = 'information required';
          $scope.informationLabel.bivalent.color = '3px solid orange';
        } else if ($scope.survey.surveys.includedReport.bivalent == 'NO') {
          $scope.informationLabel.bivalent.label = 'not selected, no information required';
          $scope.informationLabel.bivalent.color = '3px solid grey';
        } else {
          $scope.informationLabel.bivalent.label = 'information OK';
          $scope.informationLabel.bivalent.color = '3px solid green';
        }
      }

      // Fuel Comparison
      if (!!$scope.survey.surveys.includedReport.fuel) {
        if ($scope.survey.surveys.includedReport.fuel == 'YES') {
          $scope.informationLabel.fuel.label = 'information OK';
          $scope.informationLabel.fuel.color = '3px solid green';
        } else if ($scope.survey.surveys.includedReport.fuel == 'NO') {
          $scope.informationLabel.fuel.label = 'not selected, no information required';
          $scope.informationLabel.fuel.color = '3px solid grey';
        }
      }

      // Ground Loop
      if ($scope.survey.surveys.includedReport.ground_loop) {
        let count = 2;
        angular.forEach($scope.survey.surveys.ground_loop, function (value, key) {
          if (key == 'ground_loop_type' || key == 'ground_type')
            if (!!value)
              count--;
        });
        if ($scope.survey.surveys.includedReport.ground_loop == 'NO') {
          $scope.informationLabel.ground_loop.label = 'not selected, no information required';
          $scope.informationLabel.ground_loop.color = '3px solid grey';
        } else if (!!count && $scope.survey.surveys.includedReport.ground_loop == 'YES') {
          $scope.informationLabel.ground_loop.label = 'information required';
          $scope.informationLabel.ground_loop.color = '3px solid orange';
        } else {
          $scope.informationLabel.ground_loop.label = 'information OK';
          $scope.informationLabel.ground_loop.color = '3px solid green';
        }
      }

      // photos_notes
      if ($scope.survey.surveys.includedReport.photos_notes) {

        var countImg = 0
        for (let i = 0; i < $scope.survey.surveys.rooms.length; i++) {
          $scope.survey.surveys.rooms[i]
          if ($scope.survey.surveys.rooms[i].images) {
            for (let j = 0; j < $scope.survey.surveys.rooms[i].images.length; j++) {
              if ($scope.survey.surveys.rooms[i].images[j].selected) {
                countImg++
              }
            }
          }
        }
        if ($scope.survey.surveys.plantRooms && $scope.survey.surveys.plantRooms.length > 0) {
          for (let i = 0; i < $scope.survey.surveys.plantRooms.length; i++) {
            if ($scope.survey.surveys.plantRooms[i].selected) {
              countImg++
            }
          }
        }
        if ($scope.survey.surveys.heatPumps && $scope.survey.surveys.heatPumps.length > 0) {
          for (let i = 0; i < $scope.survey.surveys.heatPumps.length; i++) {
            if ($scope.survey.surveys.heatPumps[i].selected) {
              countImg++
            }
          }
        }
        if ($scope.survey.surveys.includedReport.photos_notes == 'NO') {
          $scope.informationLabel.photos_notes.label = 'not selected, no information required';
          $scope.informationLabel.photos_notes.color = '3px solid grey';
        } else if ($scope.survey.surveys.includedReport.photos_notes == 'YES' && countImg == 0) {
          $scope.informationLabel.photos_notes.label = 'information required';
          $scope.informationLabel.photos_notes.color = '3px solid orange';
        } else {
          $scope.informationLabel.photos_notes.label = 'information OK';
          $scope.informationLabel.photos_notes.color = '3px solid green';
        }
      }

      // heat_demand
      $scope.survey.surveys.includedReport.heat_demand = 'NO';
      if ($scope.survey.surveys.includedReport.heat_demand) {
        // add some logics here.
        // if yes and if no photos seleted show 'information required'
        // if no
        // var selectedImages = []

        if ($scope.survey.surveys.includedReport.heat_demand == 'NO') {
          $scope.informationLabel.heat_demand.label = 'not selected, no information required';
          $scope.informationLabel.heat_demand.color = '3px solid grey';
        } else if ($scope.survey.surveys.includedReport.heat_demand == 'YES') {
          $scope.informationLabel.heat_demand.label = 'information OK';
          $scope.informationLabel.heat_demand.color = '3px solid green';
        }
      }

      count = 0;
      angular.forEach($scope.informationLabel, function (value, key) {
        if (key == "flowTemp") {
          //do nothing
        } else if (key == "pipeTemp") {
          //do nothing
        } else {
          if (value.label === 'information required')
            count++;
        }
      });
      if (count == 0)
        $scope.isSummary = false;
      else
        $scope.isSummary = true;
    };

    $scope.viewPhotosAndNotes = function () {
      apiService.update('surveys', $scope.survey).then(function (response) {
        $scope.survey = response;
        $location.path('/uploaded-image/' + $scope.survey._id + '/' + "optional")
      }, commonService.onError);
    }

    function init () {
      apiService.get('surveys', {
        _id: $routeParams.id
      }).then(function (survey) {

        $scope.survey = survey;
        $scope.survey.surveys.page = 'Optional Page';
        if(!survey.surveys.fuel_compare) {
          survey.surveys.fuel_compare = {};
          survey.surveys.fuel_compare.heating_type = $rootScope.cloud_data.heating_type
        }
        try {
          angular.forEach(survey.surveys.rooms, function (value, idx) {

            calculationService.initialize(survey, idx);
            calculationService.calculateAll();
          });

          $scope.survey = calculationService.getAll().survey;

        } catch (e) {
          console.error(e);
        }

        // calculationService.initialize(survey);
        // calculationService.calculate_summary_results();
        //
        // $scope.survey = calculationService.getAll().survey;

        if ($scope.survey.surveys.proposed_install_type.toLowerCase() == 'ashp' && $scope.survey.surveys.proposed_install_type.toLowerCase() == 'gshp') {
          angular.forEach($scope.survey.surveys.rooms, function (rm, index) {

            calculationService.initialize($scope.survey, index);
            calculationService.calculate_emitters();

            $scope.survey = calculationService.getAll().survey;
            calculationService.calculate_spf();
            $scope.survey = calculationService.helpers.emitters.get_worst_performing_room($scope.survey);
          });
        }

        if (typeof $scope.survey.surveys.includedReport == 'undefined') {
          $scope.survey.surveys.includedReport = {
            dhw: 'YES',
            emitters: 'YES',
            radiators: 'YES',
            newradiators: 'NO',
            pipeRadiators: 'NO',
            bivalent: 'YES',
            fuel: 'YES',
            ground_loop: 'YES',
            photos_notes: 'NO',
            heat_demand: 'NO',
          };
        }

        if (typeof $scope.survey.surveys.includedReport.dhw == 'undefined') {
          $scope.survey.surveys.includedReport.dhw = "YES"
        }
        //mandatory
        $scope.survey.surveys.includedReport.emitters = "YES"

        if (typeof $scope.survey.surveys.includedReport.radiators == 'undefined') {
          $scope.survey.surveys.includedReport.radiators = "YES"
        }
        if (typeof $scope.survey.surveys.includedReport.newradiators == 'undefined') {
          $scope.survey.surveys.includedReport.newradiators = "NO"
        }
        if (typeof $scope.survey.surveys.includedReport.pipeRadiators == 'undefined') {
          $scope.survey.surveys.includedReport.pipeRadiators = "NO"
        }
        if (typeof $scope.survey.surveys.includedReport.bivalent == 'undefined') {
          $scope.survey.surveys.includedReport.bivalent = "YES"
        }
        if (typeof $scope.survey.surveys.includedReport.fuel == 'undefined') {
          $scope.survey.surveys.includedReport.fuel = "YES"
        }
        if (typeof $scope.survey.surveys.includedReport.ground_loop == 'undefined') {
          $scope.survey.surveys.includedReport.ground_loop = "NO"
        }
        if (typeof $scope.survey.surveys.includedReport.photos_notes == 'undefined') {
          $scope.survey.surveys.includedReport.photos_notes = "NO"
        }
        if (typeof $scope.survey.surveys.includedReport.heat_demand == 'undefined') {
          $scope.survey.surveys.includedReport.heat_demand = "NO"
        }

        $scope.applyInformation();
      }, commonService.onError);
    }
  }

  /**
   * DHW Controller (Domestic Hot Water)
   */
  DHWController.$inject = ['$location', '$scope', '$routeParams', 'apiService', 'commonService', 'calculationService', '_', '$rootScope', 'alertService', '$modal'];

  function DHWController ($location, $scope, $routeParams, apiService, commonService, calculationService, _, $rootScope, alertService, $modal) {

    $scope.loading = true
    $rootScope.showHeader = false;
    $rootScope.showFooter = false;
    $rootScope.heatmanagerview = true;
    $scope.valueChanged = false;

    $scope.userDetails = $rootScope.user;

    init();

    $scope.calculateDHW = function (temp) {
      $scope.valueChanged = true;
      $scope.survey.surveys.domestic_hot_water.flow_temperature_for_hot_water = {temp: parseInt(temp), value: 0};
      _.each($scope.survey.surveys.domestic_hot_water.flow_temperature_collection, function (item) {
        if($scope.survey.surveys.proposed_install_type.toLowerCase() == 'ashp' || $scope.survey.surveys.proposed_install_type.toLowerCase() == 'gshp') {
          if (item.temp == temp) {
            if(item.spf) item.value = item.spf;
            if (item.value == null) {
              alertService('warning', 'Invalid Selection', "Please ensure Heat Pump has a SPF for the given flow temperature")
            } else {
              $scope.survey.surveys.domestic_hot_water.flow_temperature_for_hot_water = item;
            }
          }
        }
      });
      calculate();
    };

    $scope.electricityPriceChanged = function (price) {
      $scope.survey.surveys.fuel_compare.heating_type[3]['price_per_unit'] = price
      $scope.survey.surveys.fuel_compare.heating_type[7]['price_per_unit'] = price
      $scope.survey.surveys.fuel_compare.heating_type[8]['price_per_unit'] = price
    }

    $scope.moveTo = function (location) {
      if($scope.valueChanged){
        apiService.update('surveys', $scope.survey).then(function (response) {
          $scope.survey = response;
          $rootScope.cloud_data.heating_type = response.surveys.fuel_compare.heating_type
          $location.path('/' + location + '/' + $scope.survey._id);
        }, commonService.onError);
      } else {
        $location.path('/' + location + '/' + $scope.survey._id);
      }
    };


    $scope.updatePricePerUnit = function (value) {
      $scope.survey.surveys.fuel_compare.heating_type[3]['price_per_unit'] = value
      $scope.survey.surveys.fuel_compare.heating_type[7]['price_per_unit'] = value
      $scope.survey.surveys.fuel_compare.heating_type[8]['price_per_unit'] = value
    }

    function init () {
      apiService.get('surveys', {
        _id: $routeParams.id
      }).then(function (survey) {
        $scope.loading = false
        $rootScope.cloud_data.heating_type = survey.surveys.fuel_compare.heating_type
        calculationService.initialize(survey);

        calculate();
        $scope.survey.surveys.page = 'Opt/DHW';
        if (!$scope.survey.surveys.domestic_hot_water.flow_temperature_for_hot_water && ($scope.survey.surveys.proposed_install_type.toLowerCase() == 'ashp' || $scope.survey.surveys.proposed_install_type.toLowerCase() == 'gshp')) {
          $scope.survey.surveys.domestic_hot_water.flow_temperature_for_hot_water = {
            temp: 55,
            value: 2.4
          };
        } else if (!$scope.survey.surveys.domestic_hot_water.flow_temperature_for_hot_water && ($scope.survey.surveys.proposed_install_type.toLowerCase() != 'ashp' || $scope.survey.surveys.proposed_install_type.toLowerCase() != 'gshp')) {
          $scope.survey.surveys.domestic_hot_water.flow_temperature_for_hot_water = {
            temp: 70,
            value: 0
          };
        }

        $scope.tempCollection = [];
        if($scope.survey.surveys.proposed_install_type.toLowerCase() == 'ashp' || $scope.survey.surveys.proposed_install_type.toLowerCase() == 'gshp') {
          _.each($scope.survey.surveys.domestic_hot_water.flow_temperature_collection, function (temp) {
            $scope.tempCollection.push(temp.temp)
          });
        } else {
          $scope.tempCollection = [35, 40, 45, 50, 55, 60, 65, 70, 75, 80]
        }
        console.log($scope.tempCollection)
        $scope.currentTemp = $scope.survey.surveys.domestic_hot_water.flow_temperature_for_hot_water.temp ? $scope.survey.surveys.domestic_hot_water.flow_temperature_for_hot_water.temp.toString() : '';
        // $scope.calculateDHW($scope.currentTemp);

          _.each($scope.survey.surveys.domestic_hot_water.flow_temperature_collection, function (item) {
            if($scope.survey.surveys.proposed_install_type.toLowerCase() == 'ashp' || $scope.survey.surveys.proposed_install_type.toLowerCase() == 'gshp') {
              if (item.temp == $scope.currentTemp) {
                if(item.spf) item.value = item.spf;
                if (item.value == null) {
                  alertService('warning', 'Invalid Selection', "Please ensure Heat Pump has a SPF for the given flow temperature")
                } else {
                  $scope.survey.surveys.domestic_hot_water.flow_temperature_for_hot_water = item;
                }
              }
            }
          });


        // apiService['manufacturerAll'].query({}, function (response) {
        //   let dataList = response.users
        //   $scope.ManufactureList = dataList.filter(function (val) { return val.isManufacturer && !val.isMerchant });
        //   $scope.merchantList = dataList.filter(function (val) { return val.isMerchant && !val.isMcsUmbrellaComp });
        //   $scope.mcsCompList = dataList.filter(function (val) { return val.isMcsUmbrellaComp });
        //   $scope.merchantInputDisable = false;
        //   var merchantSelected = dataList.filter(function (val) { return val.company_name == $scope.survey.surveys.preferred_merchant; });
        //   if (merchantSelected.length > 0) {
        //     $scope.userDetails = merchantSelected[0]
        //     if ($scope.survey.surveys.preferred_merchant != 'none' || !$scope.survey.surveys.preferred_merchant) {
        //       apiService.get('merchantByUserId', { _id: $scope.userDetails._id }).then(async function (details1) {
        //         $scope.premiumMerchantManufacturers = details1.merchant.map(function (data) {
        //           data.company_name = data.manufacture_name
        //           return data
        //         });
        //       });
        //     }
        //   }
        // });
        // console.log('adfasdf ', $scope.premiumMerchantManufacturers)

        // var details = $scope.merchantList.filter(function (val) { return val.company_name == $scope.survey.surveys.preferred_merchant });
        // if (details.length == 0) {
        //   var details = $scope.mcsCompList.filter(function (val) { return val.company_name == $scope.survey.surveys.preferred_merchant });
        // }
        // if ($scope.survey.surveys.preferred_merchant != 'none' || !$scope.survey.surveys.preferred_merchant) {
        //   apiService.get('merchantByUserId', { _id: details[0]._id }).then(async function (details1) {
        //     $scope.premiumMerchantManufacturers = details1.merchant.map(function (data) {
        //       data.company_name = data.manufacture_name
        //       return data
        //     })
        //   });

        // }
        calculate();
      }, commonService.onError);
    }

    function calculate () {
      calculationService.calculate_domestic_hot_water();
      $scope.survey = calculationService.getAll().survey;
    }

    //comment to manufacture start


    $scope.openComment = function (step) {
      var selectedSurvay
      selectedSurvay = $scope.survey
      var modalOptions = {};
      modalOptions.templateUrl = '/partials/views/summary/components/_modal_comment';
      modalOptions.controller = 'ModalCommentController';
      modalOptions.size = 'md';
      var modalInstance = $modal.open({
        animation: true,
        templateUrl: modalOptions.templateUrl,
        controller: modalOptions.controller,
        size: modalOptions.size,
        resolve: {
          data: function () {
            return {
              step: step,
              survey: $scope.survey
            }
          }
        }
      });
      modalInstance.result.then(function (comment) {

      }, function () { });

    }
    //comment to manufacture end
  }

  /**
   * Emitters Controller
   */
  EmittersController.$inject = ['$scope', '$rootScope', '$routeParams', '$location', 'apiService', 'modalService', 'commonService', 'calculationService', '$modal'];

  function EmittersController ($scope, $rootScope, $routeParams, $location, apiService, modalService, commonService, calculationService, $modal) {

    $scope.loading = true
    $rootScope.showHeader = false;
    $rootScope.showFooter = false;
    $rootScope.heatmanagerview = true;
    $scope.valueChanged = false;
    $scope.scopError = false;

    init();

    $scope.copy = {
      status: false,
      collection: null
    };

    $scope.starRating = function (num) {
      return new Array(num);
    };

    //comment to manufacture start

    $scope.openComment = function (step) {
      var selectedSurvay
      selectedSurvay = $scope.survey
      var modalOptions = {};
      modalOptions.templateUrl = '/partials/views/summary/components/_modal_comment';
      modalOptions.controller = 'ModalCommentController';
      modalOptions.size = 'md';
      var modalInstance = $modal.open({
        animation: true,
        templateUrl: modalOptions.templateUrl,
        controller: modalOptions.controller,
        size: modalOptions.size,
        resolve: {
          data: function () {
            return {
              step: step,
              survey: $scope.survey
            }
          }
        }
      });
      modalInstance.result.then(function (comment) {
        $scope.valueChanged = true;
      }, function () { });

    }
    //comment to manufacture end
    $scope.copyAll = function (collection) {
      $scope.valueChanged = true;
      $scope.copy.status = !$scope.copy.status;
      $scope.copy.collection = !!$scope.copy.status ? collection : null;
    };

    $scope.moveTo = function (location) {
      if($scope.valueChanged){
        apiService.update('surveys', $scope.survey).then(function (response) {
          $scope.survey = response;
          $location.path('/' + location + '/' + $scope.survey._id);
        }, commonService.onError);
      } else {
        $location.path('/' + location + '/' + $scope.survey._id);
      }
    };

    $scope.modalEdit = function (item, idx, property, typ) {
      var copiedValue;

      var rooms = $scope.survey.surveys.rooms;
      var split = item.split('.');

      if (!!$scope.copy.status && item == $scope.copy.collection) {
        copiedValue = rooms[idx];
        angular.forEach(split, function (item) {
          copiedValue = copiedValue[item];
        });

        angular.forEach(rooms, function (rm, index) {
          if (split.length == 4)
            $scope.survey.surveys.rooms[index][split[0]][split[1]][split[2]][split[3]] = copiedValue;
          else if (split.length == 3)
            $scope.survey.surveys.rooms[index][split[0]][split[1]][split[2]] = copiedValue;
          else if (split.length == 2)
            $scope.survey.surveys.rooms[index][split[0]][split[1]] = copiedValue;
          else if (split.length == 1)
            $scope.survey.surveys.rooms[index][split[0]] = copiedValue;

          calculationService.initialize($scope.survey, index);
          calculationService.calculate_emitters();

          $scope.survey = calculationService.getAll().survey;
          calculationService.calculate_spf();
          $scope.survey = calculationService.helpers.emitters.get_worst_performing_room($scope.survey);
        });

        $scope.copy.status = !$scope.copy.status;
      } else {

        if (!!$scope.copy.status)
          $scope.copy.status = false;

        modalService.setTemplateUrl('/partials/views/summary/components/_modal');
        modalService.setController('ModalEditController');
        modalService.showModal($scope.survey.surveys.rooms, item, idx, property, typ).then(function (result) {
          $scope.valueChanged = true;
          $scope.survey.surveys.rooms = result.scope;

          calculationService.initialize($scope.survey, idx);
          calculationService.calculate_emitters();

          $scope.survey = calculationService.getAll().survey;
          calculationService.calculate_spf();
          $scope.survey = calculationService.helpers.emitters.get_worst_performing_room($scope.survey);
        }, function (scope, idx) {

        });
      }
    };

    function init () {
      apiService.get('surveys', {
        _id: $routeParams.id
      }).then(function (survey) {
        $scope.survey = survey;
        $rootScope.maximumFlowTemp = parseInt($scope.survey.surveys.maximum_designed_flow_temperature)
        $scope.loading = false
        $scope.survey.surveys.page = 'Opt/Emitters';
        let errCount = 0
        angular.forEach($scope.survey.surveys.rooms, function (room, idx) {
          calculationService.initialize($scope.survey, idx);
          calculationService.calculate_emitters();

          $scope.survey = calculationService.getAll().survey;
          if($scope.survey.surveys.proposed_install_type.toLowerCase() == 'ashp' || $scope.survey.surveys.proposed_install_type.toLowerCase() == 'gshp') {
            if(room.emitters.space_heating_likely_spf == null || room.emitters.space_heating_likely_spf == 0) {
              errCount++
            }
          }
        });
        calculationService.calculate_spf();
        if(errCount > 0) {
          $scope.scopError = true;
        }
        if($scope.survey.surveys.worst_performing_room == undefined){
          $scope.valueChanged = true;
        }
        $scope.survey = calculationService.helpers.emitters.get_worst_performing_room($scope.survey);
      }, commonService.onError);
    }
  }

  /**
     * Bivalent Controller
     */
  BivalentController.$inject = ['$timeout', '$location', '$rootScope', '$scope', '$routeParams', 'apiService', 'commonService', 'calculationService', '$modal'];

  function BivalentController ($timeout, $location, $rootScope, $scope, $routeParams, apiService, commonService, calculationService, $modal) {



    $scope.valueChanged = false;
    $scope.loading = true

    $rootScope.showHeader = false;
    $rootScope.showFooter = false;
    $rootScope.heatmanagerview = true;

    init();

    //comment to manufacture start
    $scope.openComment = function (step) {
      var selectedSurvay
      selectedSurvay = $scope.survey
      var modalOptions = {};
      modalOptions.templateUrl = '/partials/views/summary/components/_modal_comment';
      modalOptions.controller = 'ModalCommentController';
      modalOptions.size = 'md';
      var modalInstance = $modal.open({
        animation: true,
        templateUrl: modalOptions.templateUrl,
        controller: modalOptions.controller,
        size: modalOptions.size,
        resolve: {
          data: function () {
            return {
              step: step,
              survey: $scope.survey
            }
          }
        }
      });
      modalInstance.result.then(function (comment) {
        $scope.valueChanged = true;
      }, function () { });

    }
    //comment to manufacture end


    function init () {

      $scope.point = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
      $scope.question = $rootScope.cloud_data.question;
      $scope.fuel_type = [];
      //$scope.current_region.ground_temp = 10;

      angular.forEach($rootScope.cloud_data.proposed_install_type, function (item, idx) {
        if (idx > 2)
          $scope.fuel_type.push(item);
      });
    }

    $scope.moveTo = function (location) {
      if($scope.valueChanged) {
        apiService.update('surveys', $scope.survey).then(function (response) {
          $scope.survey = response;
          $location.path('/' + location + '/' + $scope.survey._id);
        }, commonService.onError);
      } else {
        $location.path('/' + location + '/' + $scope.survey._id);
      }
    };

    // Converts canvas to an image
    function convertCanvasToImage (canvas, callback) {
      var image = new Image();
      image.onload = function () {
        callback(image);
        $timeout(function () {
          window.open(image.src);
        }, 3000)
      }
      image.onerror = function () { }
      image.src = canvas.toDataURL("image/jpeg", 0.2);
    }

    $scope.toDataUrl = function () {

      var selector = document.querySelector('.line-svg>svg');
      var svgString = new XMLSerializer().serializeToString(selector);

      var canvas = document.createElement('CANVAS');
      var ctx = canvas.getContext("2d");
      var DOMURL = self.URL || self.webkitURL || self;
      var img = new Image();
      var svg = new Blob([svgString], {
        type: "image/svg+xml;charset=utf-8"
      });
      var url = DOMURL.createObjectURL(svg);
      img.onload = function () {
        ctx.drawImage(img, 0, 0);
        var png = canvas.toDataURL("image/png");
        document.querySelector('#png-container').innerHTML = '<img src="' + png + '"/>';
        DOMURL.revokeObjectURL(png);
      };
      img.src = url;
    };

    $scope.computeBivalent = function () {
      $scope.valueChanged = true;
      var total_energy_kilowatts = $scope.survey.surveys.total_energy_kilowatts;
      var heating_demand = $scope.survey.surveys.bivalent.heating_demand;
      var energy_demand;
      var point = $scope.survey.surveys.bivalent.point - 1;
      var percentage_of_heating_season = 0;
      if ($scope.survey.surveys.region.region == 'Custom Entry') {
        percentage_of_heating_season = $scope.survey.surveys.bivalent_degree_data[point].percentage;
      } else {
        percentage_of_heating_season = $scope.degree_data[point].percentage;
      }


      calculate_bivalent();

      $scope.survey.surveys.bivalent.percentage_of_heating_season = $scope.degree_data[point].percentage;
      $scope.survey.surveys.bivalent.output_requirement = heating_demand.kw[point];

      energy_demand = parseFloat((((100 - percentage_of_heating_season) * total_energy_kilowatts) / 100).toFixed(3));
      $scope.survey.surveys.bivalent.energy_demand = energy_demand;
    };

    $scope.toggleShow = function () {
      $scope.showValues = false;
    }

    $scope.showlist = function () {
      $scope.showValues = true;
    }

    $scope.submitDegreeData = function () {
      $scope.survey.surveys.bivalent_degree_data = $scope.survey.surveys.bivalent_degree_data.map(o => {
        let total = o["total"];
        let degreeDayData = $scope.survey.surveys.region.value;
        let percent = (1 - (total / degreeDayData)) * 100;
        if (!o["total"] && o["total"] != 0) {
          o["total"] = 0
        }
        o['total'] = total;
        o['percentage'] = percent.toFixed(3);
        o["decimal"] = (percent / 100).toFixed(3)
        return o
      })
      apiService.update('surveys', $scope.survey).then(function (response) {
        $scope.survey = response;
        $scope.showValues = true
        initCalculation()
      }, commonService.onError)
    }

    //comment to manufacture end
    init();
    $scope.loading = true
    function init () {

      $scope.point = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
      $scope.question = $rootScope.cloud_data.question;
      $scope.fuel_type = [];
      //$scope.current_region.ground_temp = 10;

      angular.forEach($rootScope.cloud_data.proposed_install_type, function (item, idx) {
        if (idx > 2)
          $scope.fuel_type.push(item);
      });

      apiService.get('surveys', {
        _id: $routeParams.id
      }).then(function (res) {
        $scope.survey = res;
        $scope.loading = false
        $scope.survey.surveys.page = 'Opt/Bivalent';
        let desTemp = parseFloat($scope.survey.surveys.external_design_temperature);
        $scope.survey.surveys.external_design_temperature = desTemp.toFixed(2);
        $scope.survey.surveys.average_designed_temperature = $scope.survey.surveys.average_designed_temperature.toFixed(2);
        if ($scope.survey.surveys.region.region == 'Custom Entry') {
          if (!$scope.survey.surveys.hasOwnProperty('bivalent_degree_data')) {
            $scope.survey.surveys["bivalent_degree_data"] = [{
              "total": 0,
              "percentage": 0,
              "decimal": 0
            },
            {
              "total": 0,
              "percentage": 0,
              "decimal": 0
            },
            {
              "total": 0,
              "percentage": 0,
              "decimal": 0
            },
            {
              "total": 0,
              "percentage": 0,
              "decimal": 0
            },
            {
              "total": 0,
              "percentage": 0,
              "decimal": 0
            },
            {
              "total": 0,
              "percentage": 0,
              "decimal": 0
            },
            {
              "total": 0,
              "percentage": 0,
              "decimal": 0
            },
            {
              "total": 0,
              "percentage": 0,
              "decimal": 0
            },
            {
              "total": 0,
              "percentage": 0,
              "decimal": 0
            },
            {
              "total": 0,
              "percentage": 0,
              "decimal": 0
            },
            {
              "total": 0,
              "percentage": 0,
              "decimal": 0
            },
            {
              "total": 0,
              "percentage": 0,
              "decimal": 0
            }
            ];
            $scope.showValues = false
          } else {
            $scope.showValues = true
          }

        } else {
          $scope.showValues = true
          initCalculation()
        }

      }, commonService.onError);
    }

    function initCalculation () {

      var total_energy_kilowatts;

      var percentage_of_heating_season;
      var average_designed_temperature;
      var heating_demand;
      var energy_demand;
      var point;
      calculate_bivalent();

      // TODO: move to bivalent property
      if (typeof $scope.survey.surveys.average_designed_temperature == 'undefined') {
        $scope.survey.surveys.average_designed_temperature = 0;
      }

      $scope.degree_data = getDegreeData($scope.survey.surveys.region.region);

      total_energy_kilowatts = $scope.survey.surveys.total_energy_kilowatts;
      heating_demand = $scope.survey.surveys.bivalent.heating_demand;
      point = $scope.survey.surveys.bivalent.point - 1;

      if ($scope.degree_data) {
        $scope.survey.surveys.bivalent.percentage_of_heating_season =
          percentage_of_heating_season = $scope.degree_data[point].percentage;
      }

      $scope.survey.surveys.bivalent.output_requirement = heating_demand.kw[point];

      energy_demand = parseFloat((((100 - percentage_of_heating_season) * total_energy_kilowatts) / 100).toFixed(3));
      $scope.survey.surveys.bivalent.energy_demand = energy_demand;
    }

    function calculate_bivalent () {
      calculationService.initialize($scope.survey);
      calculationService.calculate_bivalent();
      $scope.survey = calculationService.getAll().survey;
    }

    function getDegreeData (string) {

      var series2 = [];
      var series = [];
      var result = 0;
      var kw = $scope.survey.surveys.bivalent.heating_demand.kw;

      if (typeof string == 'undefined')
        return;

      if (string != 'Custom Entry') {
        angular.forEach($rootScope.cloud_data.degree_day_data, function (value, key) {
          if (string.search(key) > -1)
            result = value;
        });
      } else {
        result = $scope.survey.surveys.bivalent_degree_data
      }
      angular.forEach(result, function (value) {
        var percentage = parseFloat(value.percentage).toFixed(3);

        series.push(percentage);
      });

      $scope.labels = ['1℃', '2℃', '3℃', '4℃', '5℃', '6℃', '7℃', '8℃', '9℃', '10℃', '11℃', '12℃'];
      $scope.series = ['Renewable Energy Proportion', 'Heating Demand'];

      $scope.lineData = {
        labels: ['1℃', '2℃', '3℃', '4℃', '5℃', '6℃', '7℃', '8℃', '9℃', '10℃', '11℃', '12℃'],
        series: [series]
      };

      angular.forEach(kw, function (item, idx) {
        series2.push(item);
      });

      $scope.chartOptions = {
        fillColor: "rgba(220,220,220,0.2)"
      }

      $scope.data = [
        series,
      ];

      $scope.lineData2 = {
        labels: ['1℃', '2℃', '3℃', '4℃', '5℃', '6℃', '7℃', '8℃', '9℃', '10℃', '11℃', '12℃'],
        series: [
          [0],
          [0],
          [0],
          [0],
          [0], series2
        ]
      };

      $scope.lineOptions = {
        high: 100,
        low: series[series.length - 1] - 5,
        axisX: {
          labelInterpolationFnc: function (value) {
            return value;
          }
        }
      };

      $scope.lineOptions2 = {
        high: 9,
        low: 0,
        axisY: {
          position: 'end'
        }
      };

      return result;
    }
  }


  /**
  * HeatDemandController
  */
  HeatDemandController.$inject = ['$location', '$rootScope', '$scope', '$routeParams', 'apiService', 'commonService'];

  function HeatDemandController ($location, $rootScope, $scope, $routeParams, apiService, commonService) {


    $scope.loading = true
    $rootScope.showHeader = false;
    $rootScope.showFooter = false;
    $rootScope.heatmanagerview = true;
    $scope.survey = {}
    $scope.average_designed_temperature;


    function init () {

      apiService.get('surveys', {
        _id: $routeParams.id
      }).then(function (res) {
        $scope.survey = res;
        $scope.loading = false
        heatdata();
      }, commonService.onError);
    }

    $scope.moveTo = function (location) {
      apiService.update('surveys', $scope.survey).then(function (response) {
        $scope.survey = response;
        $rootScope.cloud_data.heating_type = response.surveys.fuel_compare.heating_type
        $location.path('/' + location + '/' + $scope.survey._id);
      }, commonService.onError);
    };

    $scope.avg_room_temp = function () {
      heatdata();
    };

    function heatdata () {
      $scope.average_designed_temperature = $scope.survey.surveys.average_designed_temperature.toFixed(2)
      $scope.average
      $scope.ext_temp = [-8, -7, -6, -5, -4, -3, -2, -1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20];
      $scope.propotion = [0.005, 0.01, 0.02, 0.04, 0.09, 0.18, 0.35, 0.65, 1, 2, 3, 5, 7, 9, 12, 17, 22, 28, 35, 43, 52, 63, 74, 87, 100];
      $scope.ext_temp.push(parseInt($scope.average_designed_temperature))
      $scope.dataList = [];
      for (var i = 0; i < $scope.ext_temp.length; i++) {
        let dt = parseInt($scope.average_designed_temperature) - ($scope.ext_temp[i]);
        let wm = dt * $scope.survey.surveys.bivalent.heat_transfer_coefficient;
        let wattshd = $scope.survey.surveys.floorArea * wm;
        let kwhd = wattshd / 1000;
        dt = dt < 0 ? 0 : dt
        wm = wm < 0 ? 0 : wm
        wattshd = wattshd < 0 ? 0 : wattshd
        kwhd = kwhd < 0 ? 0 : kwhd
        var obj = {
          prop: $scope.propotion[i],
          ext_temp: $scope.ext_temp[i],
          deltat: dt.toFixed(2),
          wm2: wm.toFixed(2),
          hdwatts: wattshd.toFixed(2),
          hdkw: kwhd.toFixed(2)
        }
        // $scope.ext_temp[i]+ $scope.average;
        $scope.dataList.push(obj)
      }
      createChart();
    }

    function createChart () {
      let ext_des_temp = $scope.survey.surveys.external_design_temperature
      var series2 = [];
      var series = [];
      var result = 0;

      angular.forEach($scope.dataList, function (item, idx) {
        //var percentage = parseFloat(value.prop).toFixed(3);
        series.push(item.prop);
      });

      $scope.labels = ['-10', '-9', '-8', '-7', '-6', '-5', '-4', '-3', '-2', '-1', '0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23'];
      $scope.series = ['Proportion of Heating Demand', 'Heating Demand'];

      $scope.lineData = {
        labels: $scope.labels,
        //labels: [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15],
        series: [series]
      };

      angular.forEach($scope.dataList, function (value) {
        var hdkw = parseFloat(value.hdkw).toFixed(3);
        series2.push(hdkw);
      });

      let chart3Spot = $scope.dataList.filter(function(obj){
        return obj.ext_temp == parseInt(ext_des_temp)
      });
        $scope.survey.surveys.external_design_temperature = parseInt(ext_des_temp).toFixed(2);
      let indexOfdata = $scope.dataList.findIndex(i => i.ext_temp === parseInt(ext_des_temp));
      let serArray = []
      for(let j = 0; j <= indexOfdata; j++){
        if(j == indexOfdata) {
          serArray.push(chart3Spot[0].hdkw)
        } else {
          serArray.push('')
        }
      }

      $scope.chartOptions = {
        fillColor: "rgba(220,220,220,0.2)"
      }

      $scope.data = [
        series,
      ];

      $scope.lineData2 = {
        labels: $scope.labels,
        series: [
          [0],
          [0],
          [0],
          [0],
          [0], series2
        ]
      };

      $scope.lineData3 = {
        labels: $scope.labels,
        series: [
          [],
          [],
          [],
          serArray,
        ]
      };

      $scope.heatDemandlineOptions = {
        high: 100,
        low: series[series.length - 1] - 5,
        showPoint: false,
        axisX: {
          labelInterpolationFnc: function (value) {
            return value;
          },
          showLabel: true,
        },
        axisY: {
          showLabel: false,
        }
      };
      // This to calculate the max value in Y axis for Heat Loss in KW
      var x = series2[0];
      var y = Number(x);
      var max_value = Math.ceil(y);

      $scope.heatDemandlineOptions2 = {
        showPoint: false,
        high: max_value,
        low: 0,
        axisX: {
          showLabel: false,
        },
        axisY: {
          showLabel: true,
          position: "start"
        }
      };

      $scope.heatDemandlineOptions3 = {
        showPoint: true,
        high: max_value,
        low: 0,
        axisX: {
          showLabel: false,
        },
        axisY: {
          showLabel: false,
        }
      };

      return result;
    }

    init();
  }


  /**
   * GroundLoopController
   */
  GroundLoopController.$inject = ['$location', '$scope', '$rootScope', '$routeParams', 'apiService', 'commonService', 'calculationService', '$modal'];

  function GroundLoopController ($location, $scope, $rootScope, $routeParams, apiService, commonService, calculationService, $modal) {

    //comment to manufacture start
    $scope.valueChanged = false;

    $scope.openComment = function (step) {
      var selectedSurvay
      selectedSurvay = $scope.survey
      var modalOptions = {};
      modalOptions.templateUrl = '/partials/views/summary/components/_modal_comment';
      modalOptions.controller = 'ModalCommentController';
      modalOptions.size = 'md';
      var modalInstance = $modal.open({
        animation: true,
        templateUrl: modalOptions.templateUrl,
        controller: modalOptions.controller,
        size: modalOptions.size,
        resolve: {
          data: function () {
            return {
              step: step,
              survey: $scope.survey
            }
          }
        }
      });
      modalInstance.result.then(function (comment) {

      }, function () { });

    }
    //comment to manufacture end
    init();
    $scope.loading = true
    $rootScope.showHeader = false;
    $rootScope.showFooter = false;
    $rootScope.heatmanagerview = true;

    $scope.calculate = function () {
      $scope.valueChanged = true;
      var collection = $scope.survey.surveys.ground_loop.ground_type_collection;
      angular.forEach(collection, function (items) {
        if (items.rock_type == $scope.selectedGroundType)
          $scope.survey.surveys.ground_loop.ground_type = items;
      });

      apiService.update('surveys', $scope.survey).then(function (response) {
        $scope.survey = response;
        calculationService.initialize($scope.survey);
        $scope.survey = calculationService.calculate_ground_loop();
      }, commonService.onError);

    };

    $scope.depthChange = function () {
      $scope.survey.surveys.ground_loop.number_of_boreholes = Math.ceil($scope.survey.surveys.ground_loop.length_of_heat_ground_exchanger /
        $scope.survey.surveys.ground_loop.bore_hole_depth);
    };

    $scope.update = function () {
      $scope.valueChanged = true;
      calculationService.initialize($scope.survey);
      $scope.survey = calculationService.calculate_ground_loop();
      $scope.depthChange();
    };

    $scope.moveTo = function (location) {
      if($scope.valueChanged) {
        apiService.update('surveys', $scope.survey).then(function (response) {
          $scope.survey = response;
          $location.path('/' + location + '/' + $scope.survey._id);
        }, commonService.onError);
      } else {
        $location.path('/' + location + '/' + $scope.survey._id);
      }
    };

    function init () {
      apiService.get('surveys', {
        _id: $routeParams.id
      }).then(function (survey) {
        $scope.loading = false
        var room_index;

        calculationService.initialize(survey);
        $scope.survey = calculationService.calculate_ground_loop();
        $scope.survey.surveys.page = 'Opt/Groundloop';

        $scope.selectedGroundType = $scope.survey.surveys.ground_loop.ground_type.rock_type;

        room_index = $scope.survey.surveys.worst_performing_room;

        $scope.worst_performing_room = $scope.survey.surveys.rooms[room_index];
      }, commonService.onError);
    }
  }


  /**
   * Thermal Bridging Controller
   * TODO: Might remove this in the future
   */
  thermalBridgingController.$inject = ['$rootScope', '$scope', '$routeParams', '$location', 'apiService', 'modalService', 'commonService'];

  function thermalBridgingController ($rootScope, $scope, $routeParams, $location, apiService, modalService, commonService) {

    $scope.disabled = true;
    $scope.loading = true
    $rootScope.showHeader = false;
    $rootScope.showFooter = false;
    $rootScope.heatmanagerview = true;
    init();

    $scope.modalEdit = function (item, idx, property, typ) {
      modalService.setTemplateUrl('/partials/views/summary/components/_modal');
      modalService.setController('ModalEditController');
      modalService.showModal($scope.survey.surveys.rooms, item, idx, property, typ).then(function (result) {
        $scope.survey.surveys.rooms = result.scope;
        getThermalBridgingValue(result.idx);
      });
    };

    $scope.moveTo = function (location) {
      apiService.update('surveys', $scope.survey).then(function (response) {
        $scope.survey = response;
        $location.path('/' + location + '/' + $scope.survey._id);
      }, commonService.onError);
    };

    function getThermalBridgingValue (idx) {

      var thermal_bridges_insulated = $scope.survey.surveys.thermal_bridges_insulated;

      if ($scope.survey.surveys.rooms[idx].directly_to_exterior.asked == 'YES')
        $scope.survey.surveys.rooms[idx].directly_to_exterior.value = 1;
      else if ($scope.survey.surveys.rooms[idx].directly_to_exterior.asked == 'NO')
        $scope.survey.surveys.rooms[idx].directly_to_exterior.value = 1.4;

      if (thermal_bridges_insulated === 'NO')
        $scope.survey.surveys.rooms[idx].through_the_ground.value = 1;
      else if ($scope.survey.surveys.rooms[idx].through_the_ground.asked == 'YES')
        $scope.survey.surveys.rooms[idx].through_the_ground.value = 0.3;
      else if ($scope.survey.surveys.rooms[idx].through_the_ground.asked == 'NO')
        $scope.survey.surveys.rooms[idx].through_the_ground.value = 0.42;

      if ($scope.survey.surveys.rooms[idx].through_the_roof_space.asked == 'YES')
        $scope.survey.surveys.rooms[idx].through_the_roof_space.value = 0.9;
      else if ($scope.survey.surveys.rooms[idx].through_the_roof_space.asked == 'NO')
        $scope.survey.surveys.rooms[idx].through_the_roof_space.value = 1.26;

      if ($scope.survey.surveys.rooms[idx].suspended_floor.asked == 'YES')
        $scope.survey.surveys.rooms[idx].suspended_floor.value = 0.9;
      else if ($scope.survey.surveys.rooms[idx].suspended_floor.asked == 'NO')
        $scope.survey.surveys.rooms[idx].suspended_floor.value = 1.26;

      if (thermal_bridges_insulated === 'NO')
        $scope.survey.surveys.rooms[idx].to_an_adjacent_building.value = 1;
      else if ($scope.survey.surveys.rooms[idx].to_an_adjacent_building.asked == 'YES')
        $scope.survey.surveys.rooms[idx].to_an_adjacent_building.value = 0.5;
      else if ($scope.survey.surveys.rooms[idx].to_an_adjacent_building.asked == 'NO')
        $scope.survey.surveys.rooms[idx].to_an_adjacent_building.value = 0.7;

      setButtonEnabled();
    }

    function setButtonEnabled () {
      angular.forEach($scope.survey.surveys.rooms, function (value, key) {
        for (var i = 0; i < $rootScope.cloud_data.thermal_bridging_data.length; i++) {
          if (typeof $scope.survey.surveys.rooms[key][$rootScope.cloud_data.thermal_bridging_data[i]].value !== 'undefined')
            $scope.disabled = false;
          else {
            $scope.disabled = true;
            break;
          }
        }
      });
    }

    function init () {
      apiService.get('surveys', {
        _id: $routeParams.id
      }).then(function (survey) {
        $scope.loading = false
        $scope.survey = survey;
        angular.forEach($scope.survey.surveys.rooms, function (value, idx) {
          getThermalBridgingValue(idx);
          angular.forEach($rootScope.cloud_data.thermal_bridging_data, function (value, key) {
            if (typeof $scope.survey.surveys.rooms[idx][value] == 'undefined')
              $scope.survey.surveys.rooms[idx][value] = {};
          });
        });
        setButtonEnabled();
      }, commonService.onError);
    }
  }

  /**
   * Current Radiators Controller
   */
  CurrentRadsController.$inject = ['$scope', '$rootScope', '$routeParams', '$location', 'apiService', 'commonService', 'summaryHelperService', 'modalService', '_', '$modal'];

  function CurrentRadsController ($scope, $rootScope, $routeParams, $location, apiService, commonService, summaryHelperService, modalService, _, $modal) {

    $scope.loading = true
    $rootScope.showHeader = false;
    $rootScope.showFooter = false;
    $rootScope.heatmanagerview = true;
    $scope.valueChanged = false;

    function init () {
      apiService.get('surveys', {
        _id: $routeParams.id
      }).then(function (survey) {
        $scope.survey = survey;
        $scope.loading = false
        $scope.survey.surveys.page = 'Opt/Current Radiators';
        $scope.surveyCopy = survey;
        angular.forEach($scope.survey.surveys.rooms, function (value, key) {

          $scope.survey = summaryHelperService.getCurrentRadWatts(key, value, $scope.survey);

        });
      }, commonService.onError);
    }
    init();

    // CalculateValues();

    // // zeshan block begin

    // function CalculateValues () {
    //   apiService.get('surveys', {
    //     _id: $routeParams.id
    //   }).then(function (survey) {
    //     $scope.survey = survey;
    //     $scope.loading = false


    //   }, commonService.onError);
    // }

    // // zeshan block end

    /**
     * @method
     * @desc It will allow the user/s to edit existing data from the tables.
     */
    $scope.modalEdit = function (item, idx, property, typ) {
      modalService.setTemplateUrl('/partials/views/summary/components/_modal');
      modalService.setController('ModalEditController');
      modalService.showModal($scope.survey.surveys.rooms, item, idx, property, typ).then(function (result) {
        // result.scope.rooms[idx].hasRads
        $scope.valueChanged = true;
        result.scope[idx].hasRads

        $scope.survey.surveys.rooms = result.scope;
        if (!result.scope[idx].radiators['one'] &&
          result.scope[idx].radiators['one'] == null &&
          !result.scope[idx].radiators['two'] &&
          result.scope[idx].radiators['two'] == null &&
          !result.scope[idx].radiators['three'] &&
          result.scope[idx].radiators['three'] == null &&
          !result.scope[idx].radiators['four'] &&
          result.scope[idx].radiators['four'] == null &&
          !result.scope[idx].radiators['five'] &&
          result.scope[idx].radiators['five'] == null &&
          !result.scope[idx].radiators['six'] &&
          result.scope[idx].radiators['six'] == null) {

          result.scope[idx].hasRads = false

        } else {

          result.scope[idx].hasRads = true;
        }
        $scope.survey = summaryHelperService.getCurrentRadWatts(idx, result.scope[idx], $scope.survey);
        //summaryHelperService.switchAndUpdateSurvey(null, "current-radiators", $scope.survey, null, $scope.valueChanged).then(function () {
          //$location.path('/current-radiators/' + $scope.survey._id);
          //CalculateValues();
        //});
      });
    };

    $scope.moveTo = function (location) {
      if($scope.valueChanged) {
        summaryHelperService.switchAndUpdateSurvey(null, location, $scope.survey, null, $scope.valueChanged).then(function () {
          $location.path('/' + location + '/' + $scope.survey._id);
        });
      } else {
        $location.path('/' + location + '/' + $scope.survey._id);
      }
    };

    $scope.removeRad = function (room, number) {

      if (confirm('Are you sure you want to delete ' + room.room_name + ' radiator ' + number + '?')) {
        $scope.valueChanged = true;
        if (number) {
          room.radiators[number] = null;
        }
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

          room.hasRads = false

        } else {

          room.hasRads = true;
        }
        //summaryHelperService.switchAndUpdateSurvey(null, "current-radiators", $scope.survey, null, $scope.valueChanged).then(function () {
          //$location.path('/current-radiators/' + $scope.survey._id);
          //CalculateValues();
        //});
      }
    };

    //comment to manufacture start


    $scope.openComment = function (step) {
      var selectedSurvay
      selectedSurvay = $scope.survey
      var modalOptions = {};
      modalOptions.templateUrl = '/partials/views/summary/components/_modal_comment';
      modalOptions.controller = 'ModalCommentController';
      modalOptions.size = 'md';
      var modalInstance = $modal.open({
        animation: true,
        templateUrl: modalOptions.templateUrl,
        controller: modalOptions.controller,
        size: modalOptions.size,
        resolve: {
          data: function () {
            return {
              step: step,
              survey: $scope.survey
            }
          }
        }
      });
      modalInstance.result.then(function (comment) {
        $scope.valueChanged = true;
      }, function () { });

    }
    //comment to manufacture end
  }

  /**
     * Fuel Compare Controller
     */
  FuelCompareController.$inject = ['$timeout', '$location', '$scope', '$modal', '$routeParams', 'apiService', 'commonService', 'calculationService', '$rootScope'];

  function FuelCompareController ($timeout, $location, $scope, $modal, $routeParams, apiService, commonService, calculationService, $rootScope) {

    //comment to manufacture start

    $scope.valueChanged = false;
    $scope.loading = true
    $rootScope.showHeader = false;
    $rootScope.showFooter = false;
    $rootScope.heatmanagerview = true;

    $scope.openComment = function (step) {
      var selectedSurvay
      selectedSurvay = $scope.survey
      var modalOptions = {};
      modalOptions.templateUrl = '/partials/views/summary/components/_modal_comment';
      modalOptions.controller = 'ModalCommentController';
      modalOptions.size = 'md';
      var modalInstance = $modal.open({
        animation: true,
        templateUrl: modalOptions.templateUrl,
        controller: modalOptions.controller,
        size: modalOptions.size,
        resolve: {
          data: function () {
            return {
              step: step,
              survey: $scope.survey
            }
          }
        }
      });
      modalInstance.result.then(function (comment) {
      }, function () { });

    }
    //comment to manufacture end
    init();

    $scope.moveTo = function (location) {
      if($scope.valueChanged) {
        apiService.update('surveys', $scope.survey).then(function (response) {
          $scope.survey = response;
          $rootScope.cloud_data.heating_type = response.surveys.fuel_compare.heating_type
          $location.path('/' + location + '/' + $scope.survey._id);
        }, commonService.onError);
      } else {
        $location.path('/' + location + '/' + $scope.survey._id);
      }
    };

    $scope.isIncluded = function () {
      $scope.valueChanged = true;
      displayGraph();
    };

    $scope.modelOpen = function (idx, value, type, is_ignore) {
      if (typeof is_ignore != 'number' && typeof is_ignore != 'undefined')
        return;

      var items = {};

      items.value = assemble(idx, value);
      items.title = 'Input';
      items.type = type;

      var modalInstance = $modal.open({
        animation: true,
        templateUrl: '/partials/views/summary/fuel-comparison/components/_modal',
        controller: 'ModalSurveysController',
        size: 'md',
        resolve: {
          items: function () {
            return items;
          }
        }
      });

      modalInstance.result.then(function (selectedItem) {
        $scope.valueChanged = true;
        var split = value.split('.');
        if (split.length == 3)
          $scope.heating_type[idx][split[0]][split[1]][split[2]] = selectedItem;
        else if (split.length == 2)
          $scope.heating_type[idx][split[0]][split[1]] = selectedItem;
        else if (split.length == 1)
          $scope.heating_type[idx][split[0]] = selectedItem;

        if ((idx == 3 || idx == 7 || idx == 8) && value == 'price_per_unit') {
          $scope.heating_type[3][value] = selectedItem
          $scope.heating_type[7][value] = selectedItem
          $scope.heating_type[8][value] = selectedItem
          $scope.survey.surveys.domestic_hot_water.electricity_cost = selectedItem
        }
        $scope.survey.surveys.fuel_compare.heating_type = $scope.heating_type;
        calculationService.initialize($scope.survey);
        calculationService.calculate_fuel_compare();
        $scope.survey = calculationService.getAll().survey;

        $scope.heating_type = $scope.survey.surveys.fuel_compare.heating_type;
        displayGraph();
      }, function () {

      });
    };

    function convertCanvasToImage (canvas) {
      var canvas = document.getElementById("arc-chart");
      var ctx = canvas.getContext('2d');
      var image = new Image();
      image.onload = function () {
        ctx.fillStyle = "#FFFFFF";
        ctx.fill();
        $timeout(function () {
          window.open(image.src);
        }, 3000)
      };
      image.src = canvas.toDataURL("image/jpeg", 1.0);
    }

    $scope.press = function () {
      convertCanvasToImage();
    };

    function displayGraph () {

      var heating_type = $scope.heating_type;
      var data_name = [];
      var data_value = [];
      var data_value_emission = [];

      $scope.survey.surveys.fuel_compare.heating_type = $scope.heating_type;

      angular.forEach(heating_type, function (item) {
        if (item.is_included == true) {
          data_name.push(item.name);
          data_value.push(item.annual_running_cost);
          data_value_emission.push(item.total_kg);
        }
      });

      $scope.bar_data = {
        labels: data_name,
        series: [data_value]
      };
      $scope.emission_data = {
        labels: data_name,
        series: [data_value_emission]
      };
      $scope.bar_options = {
        seriesBarDistance: 15,
        axisY: {
          labelInterpolationFnc: function (value) {
            return '£' + value + '.00';
          }
        }
      };
    }

    function assemble (idx, value) {

      var combined;
      var split;

      split = value.split(".");
      combined = $scope.heating_type[idx];

      angular.forEach(split, function (val) {
        combined = combined[val];
      });
      return combined;
    }

    function init () {

      apiService.get('surveys', {
        _id: $routeParams.id
      }).then(function (survey) {
        $scope.loading = false
        $rootScope.cloud_data.heating_type = survey.surveys.fuel_compare.heating_type
        calculationService.initialize(survey);
        calculationService.calculate_fuel_compare();
        $scope.survey = calculationService.getAll().survey;
        $scope.survey.surveys.page = 'Opt/Fuel Comparison';

        for (let i = 0; i < $scope.survey.surveys.fuel_compare.heating_type.length; i++) {
          $scope.survey.surveys.fuel_compare.heating_type[i]['index'] = i
        }
        $scope.heating_type = $scope.survey.surveys.fuel_compare.heating_type;
        displayGraph();
      }, commonService.onError);
    }
  }

  /**
   * pipeTemp Controller
   */

  PipeTempController.$inject = ['$location', '$scope', '$rootScope', '$routeParams', 'apiService', 'commonService', '_', '$modal'];

  function PipeTempController ($location, $scope, $rootScope, $routeParams, apiService, commonService, _, $modal) {

    $scope.loading = true
    $rootScope.showHeader = false;
    $rootScope.showFooter = false;
    $rootScope.heatmanagerview = true;

    $scope.moveTo = function (location) {
      let a = $routeParams.id;
      $location.path('/' + location + '/' + a);
    };

    apiService.get('surveys', {
      _id: $routeParams.id
    }).then(function (survey) {
      $scope.survey = survey;
      $scope.loading = false
    }, commonService.onError);

    //comment to manufacture start

    $scope.openComment = function (step) {
      var selectedSurvay
      selectedSurvay = $scope.survey
      var modalOptions = {};
      modalOptions.templateUrl = '/partials/views/summary/components/_modal_comment';
      modalOptions.controller = 'ModalCommentController';
      modalOptions.size = 'md';
      var modalInstance = $modal.open({
        animation: true,
        templateUrl: modalOptions.templateUrl,
        controller: modalOptions.controller,
        size: modalOptions.size,
        resolve: {
          data: function () {
            return {
              step: step,
              survey: $scope.survey
            }
          }
        }
      });
      modalInstance.result.then(function (comment) {

      }, function () { });

    }
    //comment to manufacture end
  }

  /**
    * Modal Pipe Predecessor Edit Controller
    * @params ModalPipePredecessorController.$inject
    * @type Controller
    * @desc shows modal for editing and creating new pipe run and orderId
    */

  ModalPipePredecessorController.$inject = ['$scope', '$modalInstance', 'data'];
  function ModalPipePredecessorController ($scope, $modalInstance, data) {

    var survey = data.survey
    var idx = data.index
    var key = data.key
    var type = $scope.type = data.type
    var teeId = data.teeId
    $scope.alphaList = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R']
    $scope.numberList = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20']

    $scope.room = survey.surveys.rooms[idx];
    $scope.save = function (event) {
      if (event.keyCode == 13) {
        $scope.ok()
      }
    }
    if (type == "rad") {

      var rad = key.split('.')
      key = rad[1]
      $scope.room.radiators[key].pipeRun = $scope.room.radiators[key].pipeRun ? $scope.room.radiators[key].pipeRun : '';
      $scope.room.radiators[key].pipeRunOrderId = $scope.room.radiators[key].pipeRunOrderId ? $scope.room.radiators[key].pipeRunOrderId : '';
      $scope.selected = {};
      if ($scope.room.radiators[key].pipeRun) {
        $scope.selected.pipeRun = $scope.room.radiators[key].pipeRun;
        $scope.selected.pipeRunOrderId = $scope.room.radiators[key].pipeRunOrderId;
      }

      $scope.ok = function () {
        let filPredecesor = []
        let predId
        if ($scope.selected.primary) {
          $scope.room.radiators[key].predecessorId = "Heat Source"
        } else {
          predId = $scope.selected.pipeRun + $scope.selected.pipeRunOrderId;
          filPredecesor = survey.surveys.rooms.filter(function (obj, i) {
            if (obj.radiators) {
              let radKeys = Object.keys(obj.radiators)
              let radHasPreId = [];
              angular.forEach(radKeys, function (ob, k) {
                if (obj.radiators[ob] && obj.radiators[ob].predecessorId == predId) {
                  radHasPreId.push(ob);
                }
              });
              if (radHasPreId.length > 0) {
                return obj;
              }
            }
            if (obj.pipeRunData && obj.pipeRunData.predecessorId == predId) {
              return obj;
            }
          });
        }
        if (filPredecesor.length >= 2) {
          alert('Invalid Predecesor selected, as its been already selected in 2 other occations(rooms/rads)');
        } else {
          $scope.room.radiators[key].predecessorId = predId
          survey.surveys.rooms[idx] = $scope.room
          $modalInstance.close(survey);
        }
      };

      $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
      };
    } else if (type == "tees") {
      if (!$scope.tees) {
        $scope.tees = survey.surveys.tees;
      }
      if (!$scope.tees[idx]) {
        //for custom tees
        $scope.tees[idx] = {
          teeNo: 0,
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
      }

      //$scope.tees[idx].pipeRunIds[teeId].pipeRun ? $scope.tees[idx].pipeRunIds[teeId].pipeRun : '';
      //$scope.tees[idx].pipeRunIds[teeId].pipeRunOrderId ? $scope.tees[idx].pipeRunIds[teeId].pipeRunOrderId : '';
      $scope.selected = {};
      // if (teeId && $scope.tees[idx].pipeRunIds[teeId].roomRunId) {
      //   let aPipeLetter = $scope.tees[idx].pipeRunIds[teeId].roomRunId.substr(0,1)
      //   let aPipeNo = $scope.tees[idx].pipeRunIds[teeId].roomRunId.substr(1,2)
      //   $scope.selected.pipeRun = aPipeLetter;
      //   $scope.selected.pipeRunOrderId = aPipeNo;
      // } else {

      // }

      $scope.ok = function () {
        if (teeId) {
          $scope.tees[idx].pipeRunIds[teeId].roomRunId = $scope.selected.pipeRun + $scope.selected.pipeRunOrderId
        } else {
          if ($scope.selected.primary) {
            $scope.tees[idx].preId = "Heat Source"
          } else {
            $scope.tees[idx].preId = $scope.selected.pipeRun + $scope.selected.pipeRunOrderId
          }
        }

        survey.surveys.tees[idx] = $scope.tees[idx]
        $modalInstance.close(survey);
      };

      $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
      };
    } else {
      //form initialize
      //here key = pipeRunData

      $scope.room[key] = $scope.room[key] ? $scope.room[key] : {};
      $scope.selected = {};

      if ($scope.room[key].predecessorId) {
        let oneth = ''
        let twoth = ''
        if ($scope.room[key].predecessorId != 'Heat Source') {
          if ($scope.room[key].predecessorId.includes("tee")) {
            oneth = $scope.room[key].predecessorId.substr(0, 3)
            twoth = $scope.room[key].predecessorId.substr(3, 1)
          } else {
            oneth = $scope.room[key].predecessorId.substr(0, 1)
            twoth = $scope.room[key].predecessorId.substr(1, 1)
          }

        } else {
          $scope.selected.primary = true
        }
        $scope.selected.pipeRun = oneth;
        $scope.selected.pipeRunOrderId = twoth;
      }

      $scope.ok = function () {
        let filPredecesor = [];
        if ((!$scope.selected.pipeRun || !$scope.selected.pipeRunOrderId) && !$scope.selected.primary) {
          $scope.cancel()
        } else {
          if ($scope.selected.primary) {
            $scope.room[key].predecessorId = "Heat Source"
          } else {
            let predId = $scope.selected.pipeRun + $scope.selected.pipeRunOrderId;
            filPredecesor = survey.surveys.rooms.filter(function (obj, i) {
              if (obj.radiators) {
                let radKeys = Object.keys(obj.radiators)
                let radHasPreId = angular.forEach(radKeys, function (obj) {
                  if (obj.predecessorId == predId) {
                    return obj;
                  }
                })
                //return radHasPreId;
              }

              if (obj.pipeRunData && obj.pipeRunData.predecessorId == predId) {
                return obj;
              }
            })
            $scope.room[key].predecessorId = predId
          }
          if (filPredecesor.length >= 2) {
            alert('Invalid Predecesor, as its been already selected in 2 other occations(rooms/rads)');
          } else {
            survey.surveys.rooms[idx] = $scope.room
            $modalInstance.close(survey);
          }
        }

      };

      $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
      };
    }

  }


  /**
   * Modal tee no
   */

  ModalTeeNoController.$inject = ['$scope', '$modalInstance', 'data'];
  function ModalTeeNoController ($scope, $modalInstance, data) {

    var survey = data.survey;
    var idx = data.index;
    $scope.numberList = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20']

    $scope.selected = {};

    //let a = data.pipeRunData;
    //$scope.selected = {pipeRun: a.pipeRun, pipeRunOrderId: a.pipeRunOrderId }

    $scope.ok = function () {
      if (!$scope.tees) {
        $scope.tees = survey.surveys.tees;
      }
      let selRrid = $scope.selected.teeNo;
      $scope.tees[idx].teeNo = selRrid;
      survey.surveys.tees[idx] = $scope.tees[idx];
      $modalInstance.close(survey);
    };

    $scope.cancel = function () {
      $modalInstance.dismiss('cancel');
    };
  }
  /**
   *
   * Modal PipeRun and OrderId Edit Controller
   * @params ModalPipeRunEditController.$inject
   * @type Controller
   * @desc shows modal for editing and creating new pipe run and orderId
   */
  ModalPipeRunEditController.$inject = ['$scope', '$modalInstance', 'data'];
  function ModalPipeRunEditController ($scope, $modalInstance, data) {

    var survey = data.survey;
    var idx = data.index;
    var key1 = data.key
    var type = data.type
    var teeId = data.teeId
    var subTotals = data.subTotals
    $scope.alphaList = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R']
    $scope.numberList = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20']

    $scope.room = survey.surveys.rooms[idx];
    $scope.save = function (event) {
      if (event.keyCode == 13) {
        $scope.ok()
      }
    }
    if (type == "rad") {
      $scope.selected = {};
      if ($scope.room.radiators) {
        var radNo = key1.split('.')
        var key = radNo[1]
        let radInfo = $scope.room.radiators[key] ? $scope.room.radiators[key] : {};
        $scope.room.radiators[key].pipeRun = radInfo.pipeRun ? radInfo.pipeRun : '';
        $scope.room.radiators[key].pipeRunOrderId = radInfo.pipeRunOrderId ? radInfo.pipeRunOrderId : '';
        if ($scope.room.radiators[key].pipeRun) {
          $scope.selected.pipeRun = $scope.room.radiators[key].pipeRun;
          $scope.selected.pipeRunOrderId = $scope.room.radiators[key].pipeRunOrderId;
        }
      } else {
        $scope.room.radiators = {};
      }

      //let a = data.pipeRunData;
      //$scope.selected = {pipeRun: a.pipeRun, pipeRunOrderId: a.pipeRunOrderId }

      $scope.ok = function () {
        var radNo = key1.split('.')
        var key = radNo[1]

        if (!$scope.room.radiators) {
          $scope.room.radiators = {};
        }
        $scope.room.radiators[key] ? $scope.room.radiators[key] : {}
        $scope.room.radiators[key].pipeRunAndOrderId = $scope.selected.pipeRun + $scope.selected.pipeRunOrderId;
        $scope.room.radiators[key].pipeRun = $scope.selected.pipeRun;
        $scope.room.radiators[key].pipeRunOrderId = $scope.selected.pipeRunOrderId;

        if ($scope.selected.pipeRunOrderId == '1') {
          $scope.room.radiators[key].predecessorId = ""
        } else {
          let aId = parseInt($scope.selected.pipeRunOrderId) - 1
          $scope.room.radiators[key].predecessorId = $scope.selected.pipeRun + aId.toString()
        }
        survey.surveys.rooms[idx] = $scope.room
        $modalInstance.close(survey);
      };
    } else if (type == "tees") {
      $scope.selected = {};

      //let a = data.pipeRunData;
      //$scope.selected = {pipeRun: a.pipeRun, pipeRunOrderId: a.pipeRunOrderId }

      $scope.ok = function () {
        if (!$scope.tees) {
          $scope.tees = survey.surveys.tees;
        }
        $scope.tees[idx].pipeRunIds[teeId] = {};
        let selRrid = $scope.selected.pipeRun + $scope.selected.pipeRunOrderId;
        $scope.tees[idx].pipeRunIds[teeId].roomRunId = selRrid;
        if ($scope.selected.pipeRun == 'tee') {
          $scope.tees[idx].pipeRunIds[teeId].room_name = '';
        } else {
          //its a room.
          let getRoom = survey.surveys.rooms.filter(function (ob) {
            if (ob.pipeRunData.pipeRunAndOrderId == selRrid) {
              return ob
            }
          });
          $scope.tees[idx].pipeRunIds[teeId].roomName = getRoom[0].room_name;
        }
        if (teeId == 1) {
          let k0 = $scope.tees[idx].pipeRunIds[0].roomRunId;
          let k0Char = $scope.tees[idx].pipeRunIds[0].roomRunId.substr(0, 1)
          let k1 = $scope.tees[idx].pipeRunIds[1].roomRunId
          let k1Char = $scope.tees[idx].pipeRunIds[1].roomRunId.substr(0, 1)
          $scope.tees[idx].massFlowSubTotal = subTotals[k0Char] + subTotals[k1Char]
        }

        survey.surveys.tees[idx] = $scope.tees[idx];
        $modalInstance.close(survey);
      };
    } else {
      //form initialize
      let key = key1;
      $scope.room[key] ? $scope.room[key] : {}
      $scope.selected = {};

      if ($scope.room[key]) {
        $scope.selected.pipeRun = $scope.room[key].pipeRun;
        $scope.selected.pipeRunOrderId = $scope.room[key].pipeRunOrderId;
      }

      $scope.room[key] && $scope.room[key].pipeRun ? $scope.room[key].pipeRun : '';
      $scope.room[key] && $scope.room[key].pipeRunOrderId ? $scope.room[key].pipeRunOrderId : '';

      //let a = data.pipeRunData;
      //$scope.selected = {pipeRun: a.pipeRun, pipeRunOrderId: a.pipeRunOrderId }

      $scope.ok = function () {
        if (!$scope.selected.pipeRun || !$scope.selected.pipeRunOrderId) {
          $scope.cancel()
        } else {
          if (!$scope.room[key]) {
            $scope.room[key] = {}
          }
          $scope.room[key].pipeRunAndOrderId = $scope.selected.pipeRun + $scope.selected.pipeRunOrderId;
          $scope.room[key].pipeRun = $scope.selected.pipeRun;
          $scope.room[key].pipeRunOrderId = $scope.selected.pipeRunOrderId;

          if ($scope.selected.pipeRunOrderId == '1') {
            $scope.room[key].predecessorId = ""
          } else {
            let aId = parseInt($scope.selected.pipeRunOrderId) - 1
            $scope.room[key].predecessorId = $scope.selected.pipeRun + aId.toString()
          }
          survey.surveys.rooms[idx] = $scope.room
          $modalInstance.close(survey);
        }

      };

    }


    $scope.cancel = function () {
      $modalInstance.dismiss('cancel');
    };
  }

  /**
   * Modal Heat Source Instance Controller
   */
  ModalPrimaryFlowInstanceController.$inject = ['$scope', '$modalInstance'];

  function ModalPrimaryFlowInstanceController ($scope, $modalInstance) {

    $scope.ok = function () {
      if ($scope.primaryFlowIndex)
        $modalInstance.close($scope.reportName);
    };

    $scope.cancel = function () {
      $modalInstance.dismiss('cancel');
    };
  }


})();
