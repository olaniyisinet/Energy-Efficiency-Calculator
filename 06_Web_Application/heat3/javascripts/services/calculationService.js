(function () {
  'use strict';

  angular.module('cloudheatengineer').factory('calculationService', calculationService);

  calculationService.$inject = ['$rootScope', '_', 'urlHelperService', '$http', '$window'];

  function calculationService ($rootScope, _, urlHelperService, $http, $window) {
    var spfData = {}

    $http
      .get(urlHelperService.getHostUrl() + '/javascripts/json/data.json')
      .then(function (response) {
        spfData = response.data.spf
      });
    var storage = $window.localStorage;

    var service = {
      default_materials: $rootScope.materials.defaults,
      custom_materials: $rootScope.materials.customs,
      uf_heating_temps: $rootScope.cloud_data && $rootScope.cloud_data.hasOwnProperty('uf_heating_temps') ? $rootScope.cloud_data.uf_heating_temps : '',

      survey: null,
      idx: null,

      initialize: function (survey, idx) {
        this.survey = survey;
        this.idx = idx;
      },

      getAll: function () {
        return this;
      },

      helpers: {
        emitters: {
          get_oversize_factor: function (root, room) {

            if (typeof root.survey.surveys.rooms[root.idx].emitters == 'undefined')
              root.survey.surveys.rooms[root.idx].emitters = {};

            if (root.survey.surveys.rooms[root.idx].emitter_type == 'Fan Coil Unit') {
              if (room.flow_temperature == '35')
                root.survey.surveys.rooms[root.idx].emitters.oversize_factor = 5;
              else if (room.flow_temperature == '40')
                root.survey.surveys.rooms[root.idx].emitters.oversize_factor = 3.5;
              else if (room.flow_temperature == '45')
                root.survey.surveys.rooms[root.idx].emitters.oversize_factor = 2.8;
              else if (room.flow_temperature == '50')
                root.survey.surveys.rooms[root.idx].emitters.oversize_factor = 2.1;
              else if (room.flow_temperature == '55')
                root.survey.surveys.rooms[root.idx].emitters.oversize_factor = 1.7;
              else if (room.flow_temperature == '60')
                root.survey.surveys.rooms[root.idx].emitters.oversize_factor = 1.5;
              else if (room.flow_temperature == '65')
                root.survey.surveys.rooms[root.idx].emitters.oversize_factor = 1.4;
              else if (room.flow_temperature >= '70')
                root.survey.surveys.rooms[root.idx].emitters.oversize_factor = 1;
            } else if (root.survey.surveys.rooms[root.idx].emitter_type == 'Fan Convector / Rad') {
              if (room.flow_temperature == '35')
                root.survey.surveys.rooms[root.idx].emitters.oversize_factor = 4.3;
              else if (room.flow_temperature == '40')
                root.survey.surveys.rooms[root.idx].emitters.oversize_factor = 3.1;
              else if (room.flow_temperature == '45')
                root.survey.surveys.rooms[root.idx].emitters.oversize_factor = 2.4;
              else if (room.flow_temperature == '50')
                root.survey.surveys.rooms[root.idx].emitters.oversize_factor = 2;
              else if (room.flow_temperature == '55')
                root.survey.surveys.rooms[root.idx].emitters.oversize_factor = 1.7;
              else if (room.flow_temperature == '60')
                root.survey.surveys.rooms[root.idx].emitters.oversize_factor = 1.4;
              else if (room.flow_temperature == '65')
                root.survey.surveys.rooms[root.idx].emitters.oversize_factor = 1.2;
              else if (room.flow_temperature >= '70')
                root.survey.surveys.rooms[root.idx].emitters.oversize_factor = 1;
            } else {
              if (room.flow_temperature == '35')
                root.survey.surveys.rooms[root.idx].emitters.oversize_factor = 6.8;
              else if (room.flow_temperature == '40')
                root.survey.surveys.rooms[root.idx].emitters.oversize_factor = 4.3;
              else if (room.flow_temperature == '45')
                root.survey.surveys.rooms[root.idx].emitters.oversize_factor = 3.1;
              else if (room.flow_temperature == '50')
                root.survey.surveys.rooms[root.idx].emitters.oversize_factor = 2.4;
              else if (room.flow_temperature == '55')
                root.survey.surveys.rooms[root.idx].emitters.oversize_factor = 1.9;
              else if (room.flow_temperature == '60')
                root.survey.surveys.rooms[root.idx].emitters.oversize_factor = 1.6;
              else if (room.flow_temperature == '65')
                root.survey.surveys.rooms[root.idx].emitters.oversize_factor = 1.3;
              else if (room.flow_temperature >= '70')
                root.survey.surveys.rooms[root.idx].emitters.oversize_factor = 1;
            }
          },

          get_worst_performing_room: function (survey) {

            var rooms = survey.surveys.rooms;

            var index = 0;
            var min = 0;

            angular.forEach(rooms, function (item, idx) {
              if (min == 0) {
                index = idx;
                min = item.heat_loss.watts_per_meter_squared;
              } else {
                if (min < item.heat_loss.watts_per_meter_squared) {
                  min = item.heat_loss.watts_per_meter_squared;
                  index = idx;
                }
              }
            });

            survey.surveys.worst_performing_room = index;
            return survey;
          }
        },

        get_u_value: function (root, material) {
          var cusMat = JSON.parse(storage.getItem('materials'));
          $rootScope.materials.customs = cusMat.customs;
          var u_value = 0;

          angular.forEach(cusMat.defaults, function (item) {
            if (item.material == material)
              u_value = item.u_value;
          });
          angular.forEach(cusMat.customs, function (item) {
            if (item.material == material)
              u_value = item.u_value;
          });

          return u_value;
        },

        get_u_value_and_temps: function (root, room) {

          if (typeof room.u_value_and_temps == 'undefined')
            root.survey.surveys.rooms[root.idx].u_value_and_temps = {};

          root.survey.surveys.rooms[root.idx].u_value_and_temps.floor = parseFloat((root.heat_loss.floor.floor_u_values_temperature(root, room)).toFixed(2));
          root.survey.surveys.rooms[root.idx].u_value_and_temps.wall_type_a = root.helpers.get_u_value(root, room.external_type.wall.a);
          root.survey.surveys.rooms[root.idx].u_value_and_temps.wall_type_b = root.helpers.get_u_value(root, room.external_type.wall.b);
          let roomTypeMaterialA = ''
          let roomTypeMaterialB = ''
          if (room.windows) {
            roomTypeMaterialA = room.windows.type.a;
            roomTypeMaterialB = room.windows.type.b
          }
          root.survey.surveys.rooms[root.idx].u_value_and_temps.window_type_a = root.helpers.get_u_value(root, roomTypeMaterialA);
          root.survey.surveys.rooms[root.idx].u_value_and_temps.window_type_b = root.helpers.get_u_value(root, roomTypeMaterialB);
          root.survey.surveys.rooms[root.idx].u_value_and_temps.internal_wall = root.helpers.get_u_value(root, room.internal_wall);
          root.survey.surveys.rooms[root.idx].u_value_and_temps.party_wall = root.helpers.get_u_value(root, room.party_wall);
          root.survey.surveys.rooms[root.idx].u_value_and_temps.external_door = root.helpers.get_u_value(root, room.external_door);
          root.survey.surveys.rooms[root.idx].u_value_and_temps.roof_glazing = root.helpers.get_u_value(root, room.roof_glazing);
          root.survey.surveys.rooms[root.idx].u_value_and_temps.ceiling_or_roof = root.helpers.get_u_value(root, room.ceiling_or_roof);
          root.survey.surveys.rooms[root.idx].u_value_and_temps.exposed_location_value = room.exposed_location_value * 100;
          root.survey.surveys.rooms[root.idx].u_value_and_temps.intermittent_heating_value = room.intermittent_heating_value * 100;
          root.survey.surveys.rooms[root.idx].u_value_and_temps.thermal_bridges = root.survey.surveys.thermal_bridges_value;

          if (room.which_room_is_below === 'Suspended FL') {
            root.survey.surveys.rooms[root.idx].u_value_and_temps.room_temp_below = root.survey.surveys.external_design_temperature;
          } else {
            if (room.which_room_is_below != "None" && root.survey.surveys.custom_names.hasOwnProperty(room.which_room_is_below)) {
              root.survey.surveys.rooms[root.idx].u_value_and_temps.room_temp_below = parseFloat(root.survey.surveys.custom_names[room.which_room_is_below].temp[0]);
            } else {
              let roomBelow = root.survey.surveys.rooms.filter(function (obj) {
                if (obj.room_name == room.which_room_is_below) {
                  return obj
                }
              })
              if (roomBelow.length > 0) {
                //if(roomBelow[0].isAdjustCustomTemp !== undefined) {
                // if(roomBelow[0].isAdjustCustomTemp) {
                root.survey.surveys.rooms[root.idx].u_value_and_temps.room_temp_below = roomBelow[0].designed_temperature;
                // } else {
                //   root.survey.surveys.rooms[root.idx].u_value_and_temps.room_temp_below = parseFloat($rootScope.cloud_data.uf_heating_temps[room.which_room_is_below].temp[0]);
                // }
                // } else {
                //   root.survey.surveys.rooms[root.idx].u_value_and_temps.room_temp_below = parseFloat($rootScope.cloud_data.uf_heating_temps[room.which_room_is_below].temp[0]);
                // }
                //root.survey.surveys.rooms[root.idx].u_value_and_temps.room_temp_below = parseFloat($rootScope.cloud_data.uf_heating_temps[room.which_room_is_below].temp[0]);
              } else {
                // root.survey.surveys.rooms[root.idx].u_value_and_temps.room_temp_below = parseFloat($rootScope.cloud_data.uf_heating_temps[room.which_room_is_below].temp[0]);
                root.survey.surveys.rooms[root.idx].u_value_and_temps.room_temp_below = parseFloat(root.survey.surveys.region.ground_temp);
              }
            }
          }

          if (room.Which_room_is_above === 'Suspended FL') {
            root.survey.surveys.rooms[root.idx].u_value_and_temps.room_temp_above = root.survey.surveys.external_design_temperature;
          } else {
            if (room.is_there_a_roof == 'NO') {
              if (root.survey.surveys.custom_names.hasOwnProperty(room.Which_room_is_above)) {
                root.survey.surveys.rooms[root.idx].u_value_and_temps.room_temp_above = parseFloat(root.survey.surveys.custom_names[room.Which_room_is_above].temp[0]);
              } else {
                let roomAbove = root.survey.surveys.rooms.filter(function (obj) {
                  if (obj.room_name == room.Which_room_is_above) {
                    return obj
                  }
                })
                if (roomAbove.length > 0) {
                  // if(roomAbove[0].isAdjustCustomTemp !== undefined) {
                  //custom design temp NOT custom room
                  // if(roomAbove[0].isAdjustCustomTemp) {
                  root.survey.surveys.rooms[root.idx].u_value_and_temps.room_temp_above = roomAbove[0].designed_temperature;
                  // } else {
                  //   root.survey.surveys.rooms[root.idx].u_value_and_temps.room_temp_above = parseFloat($rootScope.cloud_data.uf_heating_temps[room.Which_room_is_above].temp[0]);
                  // }
                  // } else {
                  //   root.survey.surveys.rooms[root.idx].u_value_and_temps.room_temp_above = parseFloat($rootScope.cloud_data.uf_heating_temps[room.Which_room_is_above].temp[0]);
                  // }
                } else {
                  root.survey.surveys.rooms[root.idx].u_value_and_temps.room_temp_above = parseFloat($rootScope.cloud_data.uf_heating_temps[room.Which_room_is_above].temp[0]);
                }
              }
            } else
              root.survey.surveys.rooms[root.idx].u_value_and_temps.room_temp_above = root.survey.surveys.external_design_temperature;
          }

        },

        get_complex_value: function (root, room, type, is_roof, is_volume) {

          var complex_room_details = room.complex_room_details;
          var room_type = complex_room_details.room_type;

          var dimension_squared = [];
          var complex_wall_type = [];
          var dimensions = {};
          var result = 0;

          angular.forEach(complex_room_details.dim, function (value, key) {
            if (value == null)
              value = 0;
            dimensions[key] = value;
          });
          if (room_type == 'Type 1') {
            dimension_squared[0] = dimension_squared[2] = (dimensions.four * dimensions.one) + ((dimensions.one / 2) * (dimensions.three - dimensions.four));
            dimension_squared[1] = dimension_squared[3] = (dimensions.four * dimensions.two);
          } else if (room_type == 'Type 2') {
            dimension_squared[0] = dimension_squared[2] = 0.5 * (dimensions.three * dimensions.one);
            dimension_squared[1] = dimension_squared[3] = 0;
          } else if (room_type == 'Type 3') {
            dimension_squared[0] = dimension_squared[2] = (dimensions.four * dimensions.one) +
              (((dimensions.one - dimensions.six) / 2) * (dimensions.three - dimensions.four)) +
              (dimensions.six * (dimensions.three - dimensions.four));
            dimension_squared[1] = dimension_squared[3] = (dimensions.four * dimensions.two);
          } else if (room_type == 'Type 4') {
            dimension_squared[0] = dimension_squared[2] = (((dimensions.one - dimensions.five) / 2) *
              dimensions.three) + (dimensions.three * dimensions.five);
            dimension_squared[1] = dimension_squared[3] = 0;
          } else if (room_type == 'Type 5') {
            dimension_squared[0] = dimension_squared[2] = ((dimensions.four * dimensions.one) +
              ((dimensions.one * (dimensions.three - dimensions.four)) / 2));
            dimension_squared[1] = (dimensions.four * dimensions.two);
            dimension_squared[3] = (dimensions.three * dimensions.two);
          } else if (room_type == 'Type 6') {
            dimension_squared[0] = dimension_squared[2] = 0.5 * (dimensions.three * dimensions.one);
            let wb = (Math.sqrt((Math.pow(dimensions.one, 2)) + (Math.pow(dimensions.three, 2)))) * dimensions.two;
            dimension_squared[1] = wb;
            dimension_squared[3] = dimensions.three * dimensions.two;
          } else if (room_type == 'Type 7') {
            dimension_squared[0] = dimension_squared[2] = (dimensions.four * dimensions.one) +
              (((dimensions.one - dimensions.six) * (dimensions.three - dimensions.four)) / 2) +
              (dimensions.six * (dimensions.three - dimensions.four));
            dimension_squared[1] = (dimensions.four * dimensions.two);
            dimension_squared[3] = (dimensions.three * dimensions.two);
          } else if (room_type == 'Type 8') {
            dimension_squared[0] = dimension_squared[2] = ((((dimensions.one - dimensions.five)) *
              dimensions.three) / 2) + (dimensions.three * dimensions.five);
            dimension_squared[1] = 0;
            dimension_squared[3] = (dimensions.two * dimensions.three);
          }

          complex_wall_type[0] = complex_room_details.wall.type.a == type ? dimension_squared[0] : 0;
          complex_wall_type[1] = complex_room_details.wall.type.b == type ? dimension_squared[1] : 0;
          complex_wall_type[2] = complex_room_details.wall.type.c == type ? dimension_squared[2] : 0;
          complex_wall_type[3] = complex_room_details.wall.type.d == type ? dimension_squared[3] : 0;

          for (var i = 0; i < complex_wall_type.length; i++)
            result += complex_wall_type[i];

          if (!!is_roof) {
            if (room_type == 'Type 1')
              result = result + ((Math.sqrt((Math.pow(dimensions.one / 2, 2)) + (Math.pow(dimensions.three -
                dimensions.four, 2)))) * 2) * dimensions.two;
            else if (room_type == 'Type 2')
              result = ((Math.sqrt((Math.pow(dimensions.one / 2, 2)) + (Math.pow(dimensions.three, 2)))) * 2) *
                dimensions.two;
            else if (room_type == 'Type 3')
              result = result + (((Math.sqrt((Math.pow(dimensions.three - dimensions.four, 2)) +
                (Math.pow((dimensions.one - dimensions.six) / 2, 2)))) * 2) + dimensions.six) * dimensions.two;
            else if (room_type == 'Type 4')
              result = (((Math.sqrt((Math.pow((dimensions.one - dimensions.five) / 2, 2)) +
                (Math.pow(dimensions.three, 2)))) * 2) + dimensions.five) * dimensions.two;
            else if (room_type == 'Type 5')
              result = result + ((Math.sqrt((Math.pow(dimensions.one, 2)) + (Math.pow(dimensions.three -
                dimensions.four, 2)))) * dimensions.two);
            else if (room_type == 'Type 6')
              result = result;
            else if (room_type == 'Type 7')
              result = result + (((Math.sqrt((Math.pow(dimensions.three - dimensions.four, 2)) +
                (Math.pow((dimensions.one - dimensions.six), 2))))) + dimensions.six) * dimensions.two;
            else if (room_type == 'Type 8')
              result = (((Math.sqrt((Math.pow((dimensions.one - dimensions.five), 2)) +
                (Math.pow(dimensions.three, 2))))) + dimensions.five) * dimensions.two;
          } else if (is_volume) {
            result = dimensions.two * dimension_squared[0];
          }

          return parseFloat((result.toFixed(2)));
        },

        calculate: function (root, property, value) {

          var split = property.split('.');


          if (typeof root.survey.surveys.rooms[root.idx][split[0]] == 'undefined' ||
            root.survey.surveys.rooms[root.idx][split[0]] == null)
            root.survey.surveys.rooms[root.idx][split[0]] = {};
          root.survey.surveys.rooms[root.idx][split[0]][split[1]] = value;
        }
      },

      domestic_hot_water: {
        hot_water_energy_demand_per_day: function (root) {

          var efficiency_pipework_loss_to_cylinder = root.survey.surveys.domestic_hot_water.efficiency_pipework_loss_to_cylinder;
          var number_of_occupants_per_bedroom = root.survey.surveys.domestic_hot_water.number_of_occupants_per_bedroom;

          if(parseFloat(number_of_occupants_per_bedroom) > 0) {
            root.survey.surveys.domestic_hot_water.number_of_occupants_per_bedroom = number_of_occupants_per_bedroom;
          } else {
            number_of_occupants_per_bedroom = 0;
          }

          if(root.survey.surveys.domestic_hot_water.flow_temperature_for_hot_water) {
            let temp = root.survey.surveys.domestic_hot_water.flow_temperature_for_hot_water.temp;
            if (root.survey.surveys.domestic_hot_water.flow_temperature_collection &&root.survey.surveys.domestic_hot_water.flow_temperature_collection.length > 0) {
              _.each(root.survey.surveys.domestic_hot_water.flow_temperature_collection, function (item) {
                if (root.survey.surveys.proposed_install_type.toLowerCase() == 'ashp' || root.survey.surveys.proposed_install_type.toLowerCase() == 'gshp') {
                  if (item.temp == temp) {
                    if(item.spf) item.value = item.spf;
                    if (item.value == null) {
                      // do nothing
                    } else {
                      root.survey.surveys.domestic_hot_water.flow_temperature_for_hot_water = item;
                    }
                  }
                }
              });
            }
            var flow_temperature_for_hot_water = root.survey.surveys.domestic_hot_water.flow_temperature_for_hot_water = root.survey.surveys.domestic_hot_water.flow_temperature_for_hot_water ? root.survey.surveys.domestic_hot_water.flow_temperature_for_hot_water : {
              temp: 0,
              value: 0
            };
            var number_of_bed_rooms = root.survey.surveys.domestic_hot_water.number_of_bed_rooms = root.survey.surveys.domestic_hot_water.number_of_bed_rooms ? root.survey.surveys.domestic_hot_water.number_of_bed_rooms : 0;

            var water_mains_input_temp = $rootScope.cloud_data.water_mains_input_temp;
            var litres_per_person = root.survey.surveys.domestic_hot_water.hot_water_per_occupant;
            var shc_water = $rootScope.cloud_data.shc_water;
            var j_to_kwh = $rootScope.cloud_data.j_to_kwh;

            var result;
            result = (number_of_bed_rooms + 1) * number_of_occupants_per_bedroom * litres_per_person *
              (flow_temperature_for_hot_water.temp - water_mains_input_temp) *
              (shc_water / (j_to_kwh * (efficiency_pipework_loss_to_cylinder / 100)));
            root.survey.surveys.domestic_hot_water.hot_water_energy = Math.round(result);
          }
        },

        final_secondary_hw_temperature: function (root) {

          if(root.survey.surveys.domestic_hot_water.flow_temperature_for_hot_water) {
            var flow_temperature_for_hot_water;
            flow_temperature_for_hot_water = root.survey.surveys.domestic_hot_water.flow_temperature_for_hot_water.temp - 5;
            root.survey.surveys.domestic_hot_water.final_secondary_hw_temperature = flow_temperature_for_hot_water;
          }
        },

        hot_water_energy_heat_pump_compressor_per_day: function (root) {

          var efficiency_pipework_loss_to_cylinder = root.survey.surveys.domestic_hot_water.efficiency_pipework_loss_to_cylinder;
          var number_of_occupants_per_bedroom = root.survey.surveys.domestic_hot_water.number_of_occupants_per_bedroom;
          var flow_temperature_for_hot_water = root.survey.surveys.domestic_hot_water.flow_temperature_for_hot_water || {temp: 0, value: 0};
          var hot_water_per_occupant = root.survey.surveys.domestic_hot_water.hot_water_per_occupant;
          var number_of_bed_rooms = root.survey.surveys.domestic_hot_water.number_of_bed_rooms;

          var water_mains_input_temp = $rootScope.cloud_data.water_mains_input_temp;
          var shc_water = $rootScope.cloud_data.shc_water;
          var j_to_kwh = $rootScope.cloud_data.j_to_kwh;
          var result = (number_of_bed_rooms + 1) * number_of_occupants_per_bedroom * hot_water_per_occupant *
            (flow_temperature_for_hot_water.temp - water_mains_input_temp) *
            (shc_water / (j_to_kwh * flow_temperature_for_hot_water.value * (efficiency_pipework_loss_to_cylinder / 100)));
          root.survey.surveys.domestic_hot_water.hot_water_energy_heat_pump_compressor = parseFloat(result.toFixed(1));
        },

        immersion_hw_electrical_energy_per_day: function (root) {

          var domestic_hot_water = root.survey.surveys.domestic_hot_water,
            number_of_occupants_per_bedroom = domestic_hot_water.number_of_occupants_per_bedroom,
            final_secondary_hw_temperature = domestic_hot_water.final_secondary_hw_temperature,
            hot_water_per_occupant = domestic_hot_water.hot_water_per_occupant,
            number_of_bed_rooms = domestic_hot_water.number_of_bed_rooms

            ,
            shc_water = $rootScope.cloud_data.shc_water,
            j_to_kwh = $rootScope.cloud_data.j_to_kwh

            ,
            result = ((number_of_bed_rooms + 1) *
              number_of_occupants_per_bedroom *
              hot_water_per_occupant *
              (60 - final_secondary_hw_temperature) *
              shc_water / j_to_kwh) / 7;

          root.survey.surveys.domestic_hot_water.immersion_hw_electrical_energy_per_day = parseFloat(result.toFixed(2));
        },

        total_hot_water_energy_demand_per_day: function (root) {

          var domestic_hot_water = root.survey.surveys.domestic_hot_water,
            immersion_hw_electrical_energy_per_day = domestic_hot_water.immersion_hw_electrical_energy_per_day,
            hot_water_energy_heat_pump_compressor = domestic_hot_water.hot_water_energy_heat_pump_compressor

            ,
            result = hot_water_energy_heat_pump_compressor + immersion_hw_electrical_energy_per_day;
          root.survey.surveys.domestic_hot_water.total_hot_water_energy_demand_per_day = parseFloat(result.toFixed(2));
        },

        annual_demand: function (root) {

          var immersion_hw_electrical_energy_per_day = root.survey.surveys.domestic_hot_water.immersion_hw_electrical_energy_per_day;
          var hot_water_energy = root.survey.surveys.domestic_hot_water.hot_water_energy;



          //var result = (hot_water_energy * 365) + (immersion_hw_electrical_energy_per_day * 365);
          var totaldemand = hot_water_energy + immersion_hw_electrical_energy_per_day
          var result = (totaldemand * 365)

          root.survey.surveys.domestic_hot_water.annual_demand = parseFloat(result.toFixed(2));
        },

        heat_supplied_by_hp: function (root) {

          var hot_water_energy = root.survey.surveys.domestic_hot_water.hot_water_energy;

          var result = hot_water_energy * 365;

          root.survey.surveys.domestic_hot_water.heat_supplied_by_hp = result;
        },

        hot_water_demand_per_day: function (root) {

          var efficiency_pipework_loss_to_cylinder = root.survey.surveys.domestic_hot_water.efficiency_pipework_loss_to_cylinder;
          var number_of_occupants_per_bedroom = root.survey.surveys.domestic_hot_water.number_of_occupants_per_bedroom;
          var number_of_bed_rooms = root.survey.surveys.domestic_hot_water.number_of_bed_rooms;

          var litres_per_person_hot_water = root.survey.surveys.domestic_hot_water.hot_water_per_occupant;
          var water_mains_input_temp = $rootScope.cloud_data.water_mains_input_temp;
          var shc_water = $rootScope.cloud_data.shc_water;
          var j_to_kwh = $rootScope.cloud_data.j_to_kwh;

          var result = (number_of_bed_rooms + 1) * number_of_occupants_per_bedroom * litres_per_person_hot_water *
            (70 - water_mains_input_temp) * (shc_water / (j_to_kwh * (efficiency_pipework_loss_to_cylinder / 100)));
          root.survey.surveys.domestic_hot_water.hot_water_demand_per_day = Math.round(result);
        },

        hot_water_annual_demand: function (root) {



          var hot_water_demand_per_day = root.survey.surveys.domestic_hot_water.hot_water_demand_per_day;



          var result = hot_water_demand_per_day * 365;

          root.survey.surveys.domestic_hot_water.hot_water_annual_demand = result;
        }
      },

      emitters: {
        current_rad_oversize_percentage: {
          calculate: function (root, room) {
            //=IF(Rooms!F24="","",(IF(D26=0,"-", SUM(D26/J26)-1)))

            var heat_emitter_watts = room.emitters.heat_emitter_watts;
            var output_for_mwt = room.output_for_mwt;
            var room_name = room.room_name;

            var result = null;

            if (room_name === '' || room_name === null)
              return 0;
            else {
              if (output_for_mwt == 0 || output_for_mwt == '0')
                root.helpers.calculate(root, 'emitters.current_rad_oversize_percentage', '-');
              else {
                result = ((output_for_mwt / heat_emitter_watts) - 1) * 100;
                result = parseFloat(result.toFixed(2));
                root.helpers.calculate(root, 'emitters.current_rad_oversize_percentage', result);
              }
            }
          }
        },

        heat_emitter_watts: {
          calculate: function (root, room) {

            var oversize_factor = room.emitters.oversize_factor;
            var emitter_type = room.emitter_type;
            var total_watts = room.heat_loss.total_watts;
            var room_name = room.room_name;

            var result = 0;

            if (room_name === '' || room_name === null)
              return 0;
            else {
              if (!!room.is_the_room_split && room.is_the_room_split == "1") {
                if (emitter_type == 'Underfloor Heating') {
                  root.helpers.calculate(root, 'emitters.heat_emitter_watts', 'Select UF Heating');
                } else {
                  // Main Room
                  result = oversize_factor * total_watts;

                  // Partner Room
                  var partnerresult = 0;

                  _.each(root.survey.surveys.rooms, function (proom, idx) {
                    if (proom.room_id === room.room_partner_id) {
                      var partnerRoom = proom;
                      // Important -  Using the 1st part of the split room to obtain the oversize factor.
                      var partnerOverSizeFactor = room.emitters.oversize_factor;
                      var partnerTotalWatts = partnerRoom.heat_loss.total_watts;
                      partnerresult = partnerOverSizeFactor * partnerTotalWatts;
                      result = result + partnerresult;
                    }
                  })
                  result = parseFloat(result.toFixed(2));
                  root.helpers.calculate(root, 'emitters.heat_emitter_watts', result);
                }
              }
              else {
                if (emitter_type == 'Underfloor Heating') {
                  root.helpers.calculate(root, 'emitters.heat_emitter_watts', 'Select UF Heating');
                } else {
                  result = oversize_factor * total_watts;
                  result = parseFloat(result.toFixed(2));
                  root.helpers.calculate(root, 'emitters.heat_emitter_watts', result);
                }
              }
            }
          }
        },

        max_pipe_spacing: {
          calculate: function (root, room) {

            var max_heat_loss_per_floor = room.emitters.max_heat_loss_per_floor;
            var watts_per_meter_squared = room.heat_loss.watts_per_meter_squared;
            var max_pipe_spacing = $rootScope.cloud_data.max_pipe_spacing;
            var flow_temperature = room.flow_temperature;
            var floor_surface = room.emitters.underfloor_heating_details.floor_surface;
            var emitter_type = room.emitter_type;
            var floor_type = room.emitters.underfloor_heating_details.floor_type;
            var room_name = room.room_name;

            var result;

            if (room_name === '' || room_name === null)
              return 0;
            else {
              if (emitter_type == 'Underfloor Heating') {
                if (watts_per_meter_squared > 100)
                  root.helpers.calculate(root, 'emitters.max_pipe_spacing', "Improve insulation");
                else {
                  if ((!!floor_type && floor_type != 'N/A') && !!floor_surface && !!flow_temperature) {
                    result = max_pipe_spacing[floor_type][max_heat_loss_per_floor][flow_temperature][floor_surface];
                    root.helpers.calculate(root, 'emitters.max_pipe_spacing', result);
                  }
                }
              } else
                root.helpers.calculate(root, 'emitters.max_pipe_spacing', 'N/A');
            }
          }
        }
      },

      bivalent: {

        delta: {
          calculate: function (root) {
            var average_designed_temperature = parseFloat(root.survey.surveys.average_designed_temperature);
            var external_design_temperature = parseFloat(root.survey.surveys.external_design_temperature);
            var external_temperature = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
            var total_power_watts = root.survey.surveys.total_power_watts;
            var total_area = root.survey.surveys.floorArea;

            var heat_transfer_coefficient;
            var watts_per_meter_squared;
            var delta_t;

            delta_t = parseFloat(average_designed_temperature + (-(external_design_temperature))).toFixed(1);
            watts_per_meter_squared = parseFloat((total_power_watts / total_area).toFixed(2));
            heat_transfer_coefficient = parseFloat((watts_per_meter_squared / delta_t).toFixed(2));

            root.survey.surveys.bivalent.delta_t = delta_t;
            root.survey.surveys.bivalent.watts_per_meter_squared = watts_per_meter_squared;
            root.survey.surveys.bivalent.heat_transfer_coefficient = heat_transfer_coefficient;

            angular.forEach(external_temperature, function (value, idx) {
              var delta = average_designed_temperature - value;
              var watts;
              root.survey.surveys.bivalent.delta[idx] = parseFloat(delta.toFixed(1));

              watts = root.survey.surveys.bivalent.delta[idx] * heat_transfer_coefficient;
              root.survey.surveys.bivalent.watts[idx] = parseFloat(watts.toFixed(1));
              watts = root.survey.surveys.bivalent.watts[idx];

              if (typeof root.survey.surveys.bivalent.heating_demand == 'undefined') {
                root.survey.surveys.bivalent.heating_demand = {};
                root.survey.surveys.bivalent.heating_demand.watts = [];
                root.survey.surveys.bivalent.heating_demand.kw = [];
              }

              root.survey.surveys.bivalent.heating_demand.watts[idx] = parseInt(total_area * watts);
              root.survey.surveys.bivalent.heating_demand.kw[idx] = parseFloat(((total_area * watts) / 1000).toFixed(2));
            });
          }
        }
      },


      heat_demand: {

        delta: {
          calculate: function (root) {
            var average_designed_temperature = root.survey.surveys.average_designed_temperature;
            var external_design_temperature = parseFloat(root.survey.surveys.external_design_temperature);
            var external_temperature = [-8, -7, -6, -5, -4, -3, -2, -1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 20.6];
            var propotion_heat_demand = [0.005, 0.01, 0.02, 0.4, 0.09, 0.18, 0.35, 0.65, 1, 2, 3, 5, 7, 9, 12, 17, 22, 28, 35, 43, 52, 63, 74, 87, 100];
            var total_power_watts = root.survey.surveys.total_power_watts;
            var total_area = root.survey.surveys.floorArea;

            var heat_transfer_coefficient;
            var watts_per_meter_squared;
            var delta_t;

            delta_t = parseFloat((average_designed_temperature + (-(external_design_temperature))).toFixed(1));
            watts_per_meter_squared = parseFloat((total_power_watts / total_area).toFixed(2));
            heat_transfer_coefficient = parseFloat((watts_per_meter_squared / delta_t).toFixed(2));

            root.survey.surveys.heat_demand.delta_t = delta_t;
            root.survey.surveys.heat_demand.watts_per_meter_squared = watts_per_meter_squared;
            root.survey.surveys.heat_demand.heat_transfer_coefficient = heat_transfer_coefficient;

            angular.forEach(external_temperature, propotion_heat_demand, function (value, idx) {
              var delta = average_designed_temperature - value;
              var watts;
              root.survey.surveys.heat_demand.delta[idx] = parseFloat(delta.toFixed(1));

              watts = root.survey.surveys.heat_demand.delta[idx] * heat_transfer_coefficient;
              root.survey.surveys.heat_demand.watts[idx] = parseFloat(watts.toFixed(1));
              watts = root.survey.surveys.heat_demand.watts[idx];

              if (typeof root.survey.surveys.heat_demand.heating_demand == 'undefined') {
                root.survey.surveys.heat_demand.heating_demand = {};
                root.survey.surveys.heat_demand.heating_demand.watts = [];
                root.survey.surveys.heat_demand.heating_demand.kw = [];
              }

              root.survey.surveys.heat_demand.heating_demand.watts[idx] = parseInt(total_area * watts);
              root.survey.surveys.heat_demand.heating_demand.kw[idx] = parseFloat(((total_area * watts) / 1000).toFixed(2));
            });
          }
        }
      },


      fuel_compare: {

        calculate: function (root) {

          var hot_water_annual_demand = 0;
          var total_energy_kilowatts = 0;
          var total_annual_demand = 0;
          var number_kwh_in_unit = 0;
          var price_per_unit = 0;
          var pence_per_kwh = 0;
          var pound_per_kwh = 0;
          var heating_type = root.survey.surveys.fuel_compare.heating_type;
          var spf_heating = 2.65;
          var spf_dhw = 2.71;
          var cost = 0;
          angular.forEach(heating_type, function (value, idx) {

            hot_water_annual_demand = value.annual_demand.hot_water;
            total_energy_kilowatts = value.annual_demand.heating;
            number_kwh_in_unit = value.number_kwh_in_unit;
            spf_heating = (isNaN(value.spf.heating) || !value.spf.heating) ? (value.name == "Air Source Heat Pump") ? 2.65 : 3.7 : value.spf.heating;
            spf_dhw = (isNaN(value.spf.dhw) || !value.spf.dhw) ? 2.71 : value.spf.dhw;
            if (value.name == 'Biomass Wood Pellets' || value.name == 'Biomass Logs' || value.name == 'Biomass Chips')
              price_per_unit = (value.price_per_tone / 10);
            else
              price_per_unit = value.price_per_unit;

            heating_type[idx].annual_demand.total = parseFloat((hot_water_annual_demand + total_energy_kilowatts).toFixed(2));

            if (value.name == 'Air Source Heat Pump' || value.name == 'Ground Source Heat Pump') {
              heating_type[idx].pence_per_kwh = price_per_unit;
              value.spf.dhw = spf_dhw
              value.spf.heating = spf_heating
            } else
              heating_type[idx].pence_per_kwh = parseFloat((price_per_unit / number_kwh_in_unit).toFixed(2));


            if (heating_type[idx].pence_per_kwh == Number.POSITIVE_INFINITY || heating_type[idx].pence_per_kwh == Number.NEGATIVE_INFINITY)
              heating_type[idx].pence_per_kwh = 0;

            pence_per_kwh = heating_type[idx].pence_per_kwh;
            heating_type[idx].pound_per_kwh = parseFloat((pence_per_kwh / 100).toFixed(2));

            total_annual_demand = heating_type[idx].annual_demand.total;
            pound_per_kwh = heating_type[idx].pound_per_kwh;

            if (value.name == 'Air Source Heat Pump' || value.name == 'Ground Source Heat Pump') {
              cost = ((hot_water_annual_demand / spf_dhw) + (total_energy_kilowatts / spf_heating)) * pound_per_kwh;
              heating_type[idx].cost = parseFloat(cost.toFixed(2));
            } else
              heating_type[idx].cost = parseFloat((pound_per_kwh * total_annual_demand).toFixed(2));

            heating_type[idx].less_efficiency = 100 - heating_type[idx].efficiency;

            heating_type[idx].less_factor_cost = parseFloat((heating_type[idx].cost * (heating_type[idx].less_efficiency / 100)).toFixed(2));

            if (value.name == 'Air Source Heat Pump' || value.name == 'Ground Source Heat Pump') {
              heating_type[idx].annual_running_cost = heating_type[idx].cost;
            } else
              heating_type[idx].annual_running_cost = parseFloat((heating_type[idx].less_factor_cost + heating_type[idx].cost).toFixed(2));

            if (value.name == 'Air Source Heat Pump' || value.name == 'Ground Source Heat Pump') {
              var kg = ((hot_water_annual_demand / spf_dhw) + (total_energy_kilowatts / spf_heating)) * heating_type[idx].factor;
              heating_type[idx].total_kg = parseFloat(kg.toFixed(2));
            } else
              heating_type[idx].total_kg = parseFloat((heating_type[idx].annual_demand.total * heating_type[idx].factor).toFixed(2));

          });

          root.survey.surveys.fuel_compare.heating_type = heating_type;
        }
      },

      ground_loop: {
        estimate_of_total_heating_energy_consumption: {
          calculate: function (root) {
            var heat_supplied_by_hp_excluding_auxiliary_heaters = root.survey.surveys.summary_results.heat_supplied_by_hp_excluding_auxiliary_heaters;
            var heat_supplied_by_hp = root.survey.surveys.domestic_hot_water ? root.survey.surveys.domestic_hot_water.heat_supplied_by_hp : 0;

            if (isNaN(heat_supplied_by_hp) || !heat_supplied_by_hp)
              heat_supplied_by_hp = 0;


            var estimate_of_total_heating_energy_consumption;

            estimate_of_total_heating_energy_consumption = parseFloat((heat_supplied_by_hp_excluding_auxiliary_heaters + heat_supplied_by_hp).toFixed(2));

            root.survey.surveys.ground_loop.estimate_of_total_heating_energy_consumption = estimate_of_total_heating_energy_consumption;

          }
        },

        fleq_run_hours: {
          calculate: function (root) {
            var estimate_of_total_heating_energy_consumption = root.survey.surveys.ground_loop.estimate_of_total_heating_energy_consumption;
            var hp_heating_at_ground_temp = root.survey.surveys.hp_heating_at_ground_temp;



            var fleq_run_hours;
            fleq_run_hours = parseFloat((estimate_of_total_heating_energy_consumption / hp_heating_at_ground_temp).toFixed(2));

            root.survey.surveys.ground_loop.fleq_run_hours = fleq_run_hours;

          }
        },

        maximum_power_extracted_on_the_ground: {
          calculate: function (root) {

            var hp_heating_at_ground_temp = root.survey.surveys.hp_heating_at_ground_temp;
            var room_index = root.survey.surveys.worst_performing_room;

            if (room_index == null || room_index == undefined)
              return;

            var worst_performing_room = root.survey.surveys.rooms[room_index];



            var maximum_power_extracted_on_the_ground = parseFloat((hp_heating_at_ground_temp * 1000 * (1 - (1 / worst_performing_room.emitters.space_heating_likely_spf))).toFixed(2));

            root.survey.surveys.ground_loop.maximum_power_extracted_on_the_ground = maximum_power_extracted_on_the_ground;

          }
        },

        length_of_heat_ground_exchanger: {
          calculate: function (root) {
            var maximum_power_extracted_on_the_ground = root.survey.surveys.ground_loop.maximum_power_extracted_on_the_ground ? root.survey.surveys.ground_loop.maximum_power_extracted_on_the_ground : 0;
            var calculated_watts_per_meter = root.survey.surveys.ground_loop.calculated_watts_per_meter ? root.survey.surveys.ground_loop.calculated_watts_per_meter : 0;

            var length_of_heat_ground_exchanger;

            length_of_heat_ground_exchanger = parseFloat((maximum_power_extracted_on_the_ground / calculated_watts_per_meter).toFixed(2));

            root.survey.surveys.ground_loop.length_of_heat_ground_exchanger = length_of_heat_ground_exchanger;
          }
        },

        total_length_of_ground_heat_exchanger: {
          calculate: function (root) {
            var length_of_heat_ground_exchanger = root.survey.surveys.ground_loop.length_of_heat_ground_exchanger;
            var ground_loop_type = root.survey.surveys.ground_loop.ground_loop_type;
            var rpt = root.survey.surveys.ground_loop.rpt;

            var total_length_of_ground_heat_exchanger;

            total_length_of_ground_heat_exchanger = parseFloat((length_of_heat_ground_exchanger * rpt[ground_loop_type]).toFixed(2));

            root.survey.surveys.ground_loop.total_length_of_ground_heat_exchanger = total_length_of_ground_heat_exchanger;
            root.survey.surveys.ground_loop.total_length_of_ground_heat_exchanger_round = Math.round(total_length_of_ground_heat_exchanger);
          }
        },

        total_area_or_total_area_of_trench: {
          calculate: function (root) {

            var length_of_heat_ground_exchanger = root.survey.surveys.ground_loop.length_of_heat_ground_exchanger;
            var ground_loop_type = root.survey.surveys.ground_loop.ground_loop_type;

            var slinky_spacing = 1;
            var spacing = 1.2;
            var result;

            if (ground_loop_type == 'Horizontal')
              result = parseFloat((length_of_heat_ground_exchanger * spacing).toFixed(2));
            else if (ground_loop_type == 'Slinky')
              result = parseFloat((length_of_heat_ground_exchanger * slinky_spacing).toFixed(2));
            else
              result = 0;

            root.survey.surveys.ground_loop.total_area_or_total_area_of_trench = result;

          }
        },

        number_of_boreholes: {
          calculate: function (root) {

            var length_of_heat_ground_exchanger = root.survey.surveys.ground_loop.length_of_heat_ground_exchanger;
            var ground_loop_type = root.survey.surveys.ground_loop.ground_loop_type;

            var result = 0;
            var depth = root.survey.surveys.ground_loop.bore_hole_depth ? root.survey.surveys.ground_loop.bore_hole_depth : 90;


            if (ground_loop_type == 'Borehole')
              result = parseFloat((length_of_heat_ground_exchanger / depth).toFixed(2));
            else
              result = 0;

            root.survey.surveys.ground_loop.number_of_boreholes = Math.round(result);

          }
        }
      },

      heat_loss: {
        floor: {
          watts: function (root, room) {

            var designed_temperature = room.designed_temperature;
            var uf_heating_temps = root.uf_heating_temps;

            var room_below = room.which_room_is_below;
            var floor_area = room.floor_area;
            var room_name = room.room_name;

            var floor_u_values_temperature = this.floor_u_values_temperature(root, room);
            var room_temperature_below = 0;
            var result = 0;

            if (room_name === '' || room_name === null)
              return result;
            else {
              //filter code here
              let roomBelow = root.survey.surveys.rooms.filter(function (o) {
                return o.room_name == room_below;
              });
              if (roomBelow.length > 0) {
                room_temperature_below = roomBelow[0].designed_temperature;
              } else {
                room_temperature_below = (root.survey.surveys.custom_names[room_below]) ? root.survey.surveys.custom_names[room_below].temp[0] : uf_heating_temps[room_below].temp[0];
              }

              result = (designed_temperature - room_temperature_below) * floor_area * floor_u_values_temperature;
            }
            return result;
          },

          floor_u_values_temperature: function (root, room) {

            var floor = room.floor;
            var value = 0;
            var find = "insulation R value";

            if (floor === '' || floor === null)
              return 0;
            else {
              if (floor === "uninsulated floor using BRE IP 3/90 formula")
                return this.u_value_of_uninsulated_floor_using_bre(root, room);
              else {
                if (floor.search(find) > -1)
                  return this.u_value_of_uninsulated_floor_using_bre_and_insular_r_value(root, room);
                else
                  return root.helpers.get_u_value(root, floor);
              }
            }
          },

          u_value_of_uninsulated_floor_using_bre: function (root, room) {

            var complex_room_details = room.complex_room_details;
            var is_the_room_complex = room.is_the_room_complex;
            var totalExtWallLength = root.survey.surveys.totalExtWallLength;
            var dimensions = complex_room_details ? complex_room_details.dim : null;
            var floor_area = room.floor_area;
            var floorArea = root.survey.surveys.floorArea;
            var wall_type = complex_room_details ? (complex_room_details.wall ? complex_room_details.wall.type : null) : null;
            var length = room.external_wall.type;

            var total_external_wall_length = 0;
            var u_value_for_no_walls = 0;
            var wall_length = {};
            var counter = 0;
            var result = 0;
            var a = 0.05;
            var b = 1.65;
            var c = 0.60;

            if (is_the_room_complex == 'YES') {

              angular.forEach(wall_type, function (value, key) {
                if (value == 'External wall' && (counter == 0 || counter == 2))
                  wall_length[key] = dimensions.one;
                else if (value == 'External wall' && (counter == 1 || counter == 3))
                  wall_length[key] = dimensions.two;
                counter = counter + 1;
              });

              angular.forEach(wall_length, function (value) {
                total_external_wall_length += value;
              });

              b = b * (total_external_wall_length / floor_area);
              c = c * Math.pow(total_external_wall_length / floor_area, 2);
            } else {
              if (typeof length.b == 'undefined' || null)
                length.b.length = 0;

              b = b * ((length.a.length + length.b.length) / floor_area);
              c = c * Math.pow((length.a.length + length.b.length) / floor_area, 2);
            }

            result = a + b - c;

            if (result == 0.05)
              result = (0.05 + (1.65 * (totalExtWallLength / floorArea)) - (0.6 * (Math.pow(totalExtWallLength / floorArea, 2))));

            return result;
          },

          u_value_of_uninsulated_floor_using_bre_and_insular_r_value: function (root, room) {

            var u_value_of_uninsulated_floor_using_bre = this.u_value_of_uninsulated_floor_using_bre(root, room);
            var default_materials = root.default_materials;
            var floor = room.floor;

            var u_value_result = 0;

            angular.forEach(default_materials, function (material) {
              if (material.material == floor)
                u_value_result = (1 / ((1 / u_value_of_uninsulated_floor_using_bre) + material.u_value));
            });
            return u_value_result;
          },

          calculate: function (root, room) {

            var value = parseFloat(this.watts(root, room).toFixed(2));

            root.helpers.calculate(root, 'heat_loss.floor', value);
          }
        },
        external_wall_a: {
          watts: function (root, room) {
            var external_designed_temperature = root.survey.surveys.external_design_temperature;
            var wall_type_a_window_area = room.external_wall.type.a.window_area;
            var designed_temperature = room.designed_temperature;
            var external_wall_type_a = room.external_type.wall.a;
            var is_the_room_complex = room.is_the_room_complex;
            var wall_type_a_length = room.external_wall.type.a.length;
            var external_door_area = room.external_door_area;
            var room_height = room.room_height;
            var room_name = room.room_name;

            var multiplier = 0;
            var u_value = null;
            var result = 0;

            if (room_name === '' || room_name === null)
              result = 0;
            else {
              if (is_the_room_complex == 'YES') {
                multiplier = root.helpers.get_complex_value(root, room, 'External wall');
              } else
                multiplier = (room_height * wall_type_a_length);

              multiplier = multiplier - wall_type_a_window_area - external_door_area;
              u_value = root.helpers.get_u_value(root, external_wall_type_a);

              result = (designed_temperature - external_designed_temperature) * multiplier * u_value;
            }
            return result;
          },

          calculate: function (root, room) {

            var value = parseFloat(this.watts(root, room).toFixed(2));

            root.helpers.calculate(root, 'heat_loss.external_wall_type_a', value);
          }
        },
        external_wall_b: {
          watts: function (root, room) {
            var external_design_temperature = root.survey.surveys.external_design_temperature;
            var wall_type_b_window_area = room.external_wall.type.b.window_area;
            var external_wall_type_b = room.external_type.wall.b;
            var designed_temperature = room.designed_temperature;
            var is_the_room_complex = room.is_the_room_complex;
            var wall_type_b_length = room.external_wall.type.b.length;
            var room_height = room.room_height;
            var room_name = room.room_name;

            var multiplier;
            var u_value;
            var result;

            if (room_name === '' || room_name === null)
              result = 0;
            else {

              if (is_the_room_complex == 'YES')
                multiplier = 0;
              else
                multiplier = (room_height * wall_type_b_length) - wall_type_b_window_area;

              if (external_wall_type_b == '' || external_wall_type_b == null)
                u_value = 0;
              else
                u_value = root.helpers.get_u_value(root, external_wall_type_b);

              result = (designed_temperature - external_design_temperature) * multiplier * u_value;
            }
            return result;
          },

          calculate: function (root, room) {

            var value = parseFloat(this.watts(root, room).toFixed(2));

            root.helpers.calculate(root, 'heat_loss.external_wall_type_b', value);
          }
        },
        window: {
          watts: function (root, room, type) {

            var external_design_temperature = root.survey.surveys.external_design_temperature;
            var designed_temperature = room.designed_temperature;
            var window_area = room.external_wall.type[type].window_area;
            var room_name = room.room_name;
            var window = room.windows ? room.windows.type[type] : '';

            var u_value = null;
            var result;

            if (window == '' || window == null)
              u_value = 0;
            else
              u_value = root.helpers.get_u_value(root, window);

            if (room_name == '' || null)
              result = 0;
            else {
              result = (designed_temperature - external_design_temperature) * window_area * u_value;
            }
            return result;
          },

          calculate: function (root, room) {

            var a = parseFloat(this.watts(root, room, 'a').toFixed(2));
            var b = parseFloat(this.watts(root, room, 'b').toFixed(2));

            root.helpers.calculate(root, 'heat_loss.window_a', a);
            root.helpers.calculate(root, 'heat_loss.window_b', b);
          }
        },
        internal_wall: {
          watts: function (root, room) {

            var lowest_parallel_room_temp = room.lowest_parallel_room_temp;
            var designed_temperature = room.designed_temperature;
            var internal_wall_length = room.internal_wall_length;
            var internal_wall = room.internal_wall;
            var room_complex = room.is_the_room_complex;
            var room_height = room.room_height;
            var room_name = room.room_name;

            var multiplier = 0;
            var u_value;
            var result;

            if (room_name === '' || room_name === null)
              result = 0;
            else {
              if (room_complex == 'YES') {
                multiplier = root.helpers.get_complex_value(root, room, 'Internal wall');
              } else
                multiplier = (internal_wall_length * room_height);

              if (internal_wall == '' || internal_wall == null)
                u_value = 0;
              else {
                u_value = root.helpers.get_u_value(root, internal_wall);
              }
              result = multiplier * (designed_temperature - lowest_parallel_room_temp) * u_value;
            }
            return result;
          },

          calculate: function (root, room) {

            var value = parseFloat(this.watts(root, room).toFixed(2));

            root.helpers.calculate(root, 'heat_loss.internal_wall', value);
          }
        },
        party_wall: {
          watts: function (root, room) {

            var designed_temperature = room.designed_temperature;
            var party_wall_length = room.party_wall_length;
            var room_complex = room.is_the_room_complex;
            var room_height = room.room_height;
            var party_wall = room.party_wall;
            var room_name = room.room_name;

            var multiplier = 0;
            var u_value = 0;
            var result;

            if (room_name === '' || null)
              result = 0;
            else {

              if (room_complex == 'YES') {
                multiplier = root.helpers.get_complex_value(root, room, 'Party wall');
              } else
                multiplier = party_wall_length * room_height;

              if (party_wall == '' || party_wall == null)
                u_value = 0;
              else {
                u_value = root.helpers.get_u_value(root, party_wall);
              }
              result = multiplier * (designed_temperature - 10) * u_value;
            }

            return result;
          },

          calculate: function (root, room) {

            var value = parseFloat(this.watts(root, room).toFixed(2));

            root.helpers.calculate(root, 'heat_loss.party_wall', value);
          }
        },
        external_door: {
          watts: function (root, room) {

            var external_design_temperature = root.survey.surveys.external_design_temperature;
            var designed_temperature = room.designed_temperature;
            var external_door_area = room.external_door_area;
            var external_door = room.external_door;
            var room_name = room.room_name;

            var u_value = null;
            var result;

            if (room_name === '' || room_name === null)
              result = 0;
            else {
              if (external_door == '' || external_door == null)
                u_value = 0;
              else
                u_value = root.helpers.get_u_value(root, external_door);
              result = external_door_area * u_value * (designed_temperature - external_design_temperature);
            }
            return result;
          },

          calculate: function (root, room) {

            var value = parseFloat(this.watts(root, room).toFixed(2));

            root.helpers.calculate(root, 'heat_loss.external_door', value);
          }
        },
        roof_glazing: {
          watts: function (root, room) {

            var external_design_temperature = root.survey.surveys.external_design_temperature;
            var designed_temperature = room.designed_temperature;
            var roof_glazing_area = room.roof_glazing_area;
            var roof_glazing = room.roof_glazing;
            var room_name = room.room_name;

            var u_value = 0;
            var result;

            if (room_name == '' || room_name == null)
              result = 0;
            else {

              if (roof_glazing == '' || roof_glazing == null)
                u_value = 0;
              else
                u_value = root.helpers.get_u_value(root, roof_glazing);
              result = (roof_glazing_area * u_value * (designed_temperature - external_design_temperature));
            }
            return result;
          },

          calculate: function (root, room) {

            var value = parseFloat(this.watts(root, room).toFixed(2));

            root.helpers.calculate(root, 'heat_loss.roof_glazing', value);
          }
        },
        roof_ceiling: {
          watts: function (root, room) {

            var external_design_temperature = root.survey.surveys.external_design_temperature;
            var designed_temperature = room.designed_temperature;
            var which_room_is_above = room.Which_room_is_above;
            var is_the_room_complex = room.is_the_room_complex;
            var roof_glazing_area = room.roof_glazing_area;
            var uf_heating_temps = root.uf_heating_temps;
            var ceiling_or_roof = room.ceiling_or_roof;
            var is_there_a_roof = room.is_there_a_roof;
            var floor_area = room.floor_area;
            var room_name = room.room_name;

            var multiplier2 = 0;
            var multiplier = 0;
            var u_value = 0;
            var result = 0;

            if (room_name === '' || room_name === null)
              result = 0;
            else {

              if (is_the_room_complex === 'YES')
                multiplier = room.room_dimensions.roof;
              else
                multiplier = floor_area;
              multiplier = multiplier - roof_glazing_area;

              if (ceiling_or_roof === '' || ceiling_or_roof === null)
                u_value = 0;
              else
                u_value = root.helpers.get_u_value(root, ceiling_or_roof);

              if (is_there_a_roof == 'YES')
                multiplier2 = external_design_temperature;
              else {
                //filter code here
                let roomAbove = root.survey.surveys.rooms.filter(function (o) {
                  return o.room_name == which_room_is_above;
                });
                if (roomAbove.length > 0) {
                  multiplier2 = roomAbove[0].designed_temperature
                } else {
                  multiplier2 = root.survey.surveys.custom_names.hasOwnProperty(which_room_is_above) ? root.survey.surveys.custom_names[which_room_is_above].temp[0] : uf_heating_temps[which_room_is_above].temp[0];
                }
                // if (uf_heating_temps[which_room_is_above].temp != undefined) {
                //   multiplier2 = uf_heating_temps[which_room_is_above].temp[0];
                // }
              }

              result = multiplier * u_value * (designed_temperature - multiplier2);
            }

            return result;
          },

          calculate: function (root, room) {

            var value = parseFloat(this.watts(root, room).toFixed(2));

            root.helpers.calculate(root, 'heat_loss.roof_ceiling', value);
          }
        },
        amount_heated_per_hour: {

          calculate: function (root, room) {

            var air_changes_per_hour = room.air_changes_per_hour;
            var complex_room_details = room.complex_room_details;
            var is_the_room_complex = root.survey.surveys.rooms[root.idx].is_the_room_complex;
            var room_height = room.room_height;
            var floor_area = room.floor_area;
            var room_name = room.room_type;

            var dimension_squared = 0;
            var room_type = null;
            var multiplier = 0;
            var dimensions = {};
            var result = 0;

            if (room_name === '' || room_name === null)
              result = 0;
            else {

              if (is_the_room_complex === 'YES') {
                room_type = complex_room_details.room_type;
                angular.forEach(complex_room_details.dim, function (value, key) {
                  if (value == null)
                    value = 0;
                  dimensions[key] = value;
                });

                if (room_type == 'Type 1') {
                  dimension_squared = (dimensions.four * dimensions.one) + ((dimensions.one / 2) *
                    (dimensions.three - dimensions.four));
                } else if (room_type == 'Type 2') {
                  dimension_squared = 0.5 * (dimensions.three * dimensions.one);
                } else if (room_type == 'Type 3') {
                  dimension_squared = (dimensions.four * dimensions.one) + (((dimensions.one - dimensions.six) / 2) *
                    (dimensions.three - dimensions.four)) + (dimensions.six * (dimensions.three - dimensions.four));
                } else if (room_type == 'Type 4') {
                  dimension_squared = (((dimensions.one - dimensions.five) / 2) * dimensions.three) +
                    (dimensions.three * dimensions.five);
                } else if (room_type == 'Type 5') {
                  dimension_squared = ((dimensions.four * dimensions.one) +
                    ((dimensions.one * (dimensions.three - dimensions.four)) / 2));
                } else if (room_type == 'Type 6') {
                  dimension_squared = 0.5 * (dimensions.three * dimensions.one);
                } else if (room_type == 'Type 7') {
                  dimension_squared = (dimensions.four * dimensions.one) +
                    (((dimensions.one - dimensions.six) * (dimensions.three - dimensions.four)) / 2) +
                    (dimensions.six * (dimensions.three - dimensions.four));
                } else if (room_type == 'Type 8') {
                  dimension_squared = ((((dimensions.one - dimensions.five)) *
                    dimensions.three) / 2) + (dimensions.three * dimensions.five);
                }

                multiplier = dimension_squared * dimensions.two;
              } else
                multiplier = floor_area * room_height;

              result = multiplier * air_changes_per_hour;
            }

            root.helpers.calculate(root, 'heat_loss.amount_heated_per_hour', parseFloat(result.toFixed(2)));
          }
        },
        ventilation: {
          calculate: function (root, room) {

            var external_design_temperature = root.survey.surveys.external_design_temperature;
            var designed_temperature = room.designed_temperature;
            var room_name = room.room_name;

            var result = 0;

            if (room_name === '' || room_name === null)
              result = 0;
            else
              result = (room.heat_loss.amount_heated_per_hour * 0.33 * (designed_temperature - external_design_temperature));

            root.helpers.calculate(root, 'heat_loss.ventilation', parseFloat(result.toFixed(2)));
          }
        },
        high_ceiling_increases: {
          calculate: function (root, room) {

            var high_ceiling_percentage = (room.high_ceiling_percentage / 100);
            var external_wall_type_a = room.heat_loss.external_wall_type_a;
            var internal_wall = room.heat_loss.internal_wall;
            var external_door = room.heat_loss.external_door;
            var roof_ceiling = room.heat_loss.roof_ceiling;
            var ventilation = room.heat_loss.ventilation;
            var party_wall = room.heat_loss.party_wall;
            var room_name = room.heat_loss.room_name;
            var window_a = room.heat_loss.window_a;
            var floor = room.heat_loss.floor;

            var result = 0;
            if (room_name === '' || room_name === null)
              result = 0;
            else
              result = ((floor + external_wall_type_a + window_a + internal_wall + party_wall + external_door +
                roof_ceiling + ventilation) * high_ceiling_percentage);

            root.helpers.calculate(root, 'heat_loss.high_ceiling_increases', parseFloat(result.toFixed(2)));
          }
        },
        exposed_location: {

          calculate: function (root, room) {

            var high_ceiling_increases = room.heat_loss.high_ceiling_increases;
            var exposed_location_value = room.exposed_location_value;
            var exposed_location = room.exposed_location;
            var external_wall_a = room.heat_loss.external_wall_type_a;
            var external_wall_b = room.heat_loss.external_wall_type_b;
            var external_door = room.heat_loss.external_door;
            var internal_wall = room.heat_loss.internal_wall;
            var roof_glazing = room.heat_loss.roof_glazing;
            var roof_ceiling = room.heat_loss.roof_ceiling;
            var ventilation = room.heat_loss.ventilation;
            var party_wall = room.heat_loss.party_wall;
            var room_name = room.room_name;
            var window_a = room.heat_loss.window_a;
            var window_b = room.heat_loss.window_b;
            var floor = room.heat_loss.floor;

            var result = 0;

            if (room_name === '' || room_name === null)
              result = 0;
            else {
              if (exposed_location === 'YES') {
                if (room.exposed_location == 'YES')
                  room.exposed_location_value = 0.1;
                else
                  room.exposed_location_value = 0;
                result = (floor + external_wall_a + window_a + internal_wall + party_wall + external_door +
                  roof_glazing + roof_ceiling + high_ceiling_increases + ventilation + external_wall_b + window_b) *
                  room.exposed_location_value;
              } else {
                result = 0;
              }
            }
            root.helpers.calculate(root, 'heat_loss.exposed_location', parseFloat(result.toFixed(2)));
          }
        },
        intermitted_heating: {

          calculate: function (root, room) {

            var intermittent_heating_required = room.intermittent_heating_required;
            var intermittent_heating_value = room.intermittent_heating_value;
            var high_ceiling_increases = room.heat_loss.high_ceiling_increases;
            var external_wall_a = room.heat_loss.external_wall_type_a;
            var external_wall_b = room.heat_loss.external_wall_type_b;
            var external_door = room.heat_loss.external_door;
            var internal_wall = room.heat_loss.internal_wall;
            var roof_glazing = room.heat_loss.roof_glazing;
            var roof_ceiling = room.heat_loss.roof_ceiling;
            var ventilation = room.heat_loss.ventilation;
            var party_wall = room.heat_loss.party_wall;
            var room_name = room.room_name;
            var window_a = room.heat_loss.window_a;
            var window_b = room.heat_loss.window_b;
            var floor = room.heat_loss.floor;

            var result = 0;

            if (room_name === '' || room_name === null)
              result = 0;
            else {
              if (intermittent_heating_required === 'YES') {
                if (room.room_built >= 2006)
                  room.intermittent_heating_value = 0.2;
                else
                  room.intermittent_heating_value = 0.1;

                result = (floor + external_wall_a + window_a + internal_wall + party_wall + external_door + roof_glazing +
                  roof_ceiling + high_ceiling_increases + ventilation + external_wall_b + window_b) * room.intermittent_heating_value;
              } else
                result = 0;
            }
            root.helpers.calculate(root, 'heat_loss.intermitted_heating', parseFloat(result.toFixed(2)));
          }
        },
        thermal_bridges: {
          calculate: function (root, room) {

            var thermal_bridges_insulated = root.survey.surveys.thermal_bridges_insulated;
            var external_wall_type_a = room.heat_loss.external_wall_type_a;
            var external_wall_type_b = room.heat_loss.external_wall_type_b;
            var is_property_greater = root.survey.surveys.is_property_greater;
            var thermal_bridges = (root.survey.surveys.thermal_bridges_value / 100);
            var external_door = room.heat_loss.external_door;
            var roof_glazing = room.heat_loss.roof_glazing;
            var roof_ceiling = room.heat_loss.roof_ceiling;
            var party_wall = room.heat_loss.party_wall;
            var room_name = room.room_name;
            var window_a = room.heat_loss.window_a;
            var window_b = room.heat_loss.window_b;
            var floor = room.heat_loss.floor;

            var result = 0;

            if (room_name === '' || room_name === null)
              return result;
            else {

              if (is_property_greater == 'YES') {
                if (thermal_bridges_insulated == 'YES') {
                  result = ((floor + external_wall_type_a + external_wall_type_b + window_a + window_b + party_wall +
                    external_door + roof_glazing + roof_ceiling) * thermal_bridges);
                }
              }
            }
            root.helpers.calculate(root, 'heat_loss.thermal_bridges', parseFloat(result.toFixed(2)));
          }
        },
        total_watts: {
          calculate: function (root, room) {

            var high_ceiling_increases = room.heat_loss.high_ceiling_increases;
            var intermitted_heating = room.heat_loss.intermitted_heating;
            var exposed_location = room.heat_loss.exposed_location;
            var thermal_bridges = room.heat_loss.thermal_bridges;
            var external_wall_a = room.heat_loss.external_wall_type_a;
            var external_wall_b = room.heat_loss.external_wall_type_b;
            var internal_wall = room.heat_loss.internal_wall;
            var external_door = room.heat_loss.external_door;
            var roof_glazing = room.heat_loss.roof_glazing;
            var roof_ceiling = room.heat_loss.roof_ceiling;
            var ventilation = room.heat_loss.ventilation;
            var party_wall = room.heat_loss.party_wall;
            var window_a = room.heat_loss.window_a;
            var window_b = room.heat_loss.window_b;
            var floor = room.heat_loss.floor;

            var room_name = room.room_name;

            var result = 0;

            if (room_name === '' || room_name === null)
              return result;
            else {
              result = (floor + external_wall_a + window_a + internal_wall + party_wall + external_door + roof_glazing +
                roof_ceiling + high_ceiling_increases + ventilation + external_wall_b + window_b + exposed_location +
                intermitted_heating + thermal_bridges);
            }
            result = parseFloat(result.toFixed(2))
            root.helpers.calculate(root, 'heat_loss.total_watts', result);
          }
        },
        watts_per_meter_squared: {
          calculate: function (root, room) {
            var total_watts = room.heat_loss.total_watts;
            var floor_area = room.floor_area;
            var room_name = room.room_name;

            var result = 0;

            if (room_name === '' || room_name === null)
              return result;
            else
              result = total_watts / floor_area;

            root.helpers.calculate(root, 'heat_loss.watts_per_meter_squared', parseFloat(result.toFixed(2)));
          }
        },
        total_power_watts: {
          calculate: function (root) {

            var max_watts_per_meter_squared = 0;
            var min_watts_per_meter_squared = 0;
            var max_total_watts_percentage = 0;
            var total_watts_per_meter_squared_percentage;
            var total_watts_percentage;
            var max_total_watts = 0;
            var result = 0;

            angular.forEach(root.survey.surveys.rooms, function (room) {

              if (max_total_watts == 0)
                max_total_watts = room.heat_loss.total_watts;
              else if (max_total_watts < room.heat_loss.total_watts)
                max_total_watts = room.heat_loss.total_watts;

              if (max_watts_per_meter_squared == 0)
                max_watts_per_meter_squared = room.heat_loss.watts_per_meter_squared;
              else if (max_watts_per_meter_squared < room.heat_loss.watts_per_meter_squared)
                max_watts_per_meter_squared = room.heat_loss.watts_per_meter_squared;

              if (min_watts_per_meter_squared == 0)
                min_watts_per_meter_squared = room.heat_loss.watts_per_meter_squared;
              else if (min_watts_per_meter_squared > room.heat_loss.watts_per_meter_squared)
                min_watts_per_meter_squared = room.heat_loss.watts_per_meter_squared;

              result += room.heat_loss.total_watts;
            });

            angular.forEach(root.survey.surveys.rooms, function (room, idx) {

              if (max_watts_per_meter_squared == room.heat_loss.watts_per_meter_squared)
                total_watts_per_meter_squared_percentage = 'MAX';
              else if (min_watts_per_meter_squared == room.heat_loss.watts_per_meter_squared)
                total_watts_per_meter_squared_percentage = 'MIN';
              else
                total_watts_per_meter_squared_percentage = parseFloat((room.heat_loss.watts_per_meter_squared / max_watts_per_meter_squared).toFixed(2)) * 100;

              total_watts_percentage = parseFloat((room.heat_loss.total_watts / max_total_watts).toFixed(2)) * 100;
              root.survey.surveys.rooms[idx].heat_loss.total_watts_per_meter_squared_percentage = total_watts_per_meter_squared_percentage;
              root.survey.surveys.rooms[idx].heat_loss.total_watts_percentage = total_watts_percentage;

              if (max_total_watts_percentage == 0)
                max_total_watts_percentage = root.survey.surveys.rooms[idx].heat_loss.total_watts_percentage;
              else if (max_total_watts_percentage < root.survey.surveys.rooms[idx].heat_loss.total_watts_percentage)
                max_total_watts_percentage = root.survey.surveys.rooms[idx].heat_loss.total_watts_percentage;

            });

            angular.forEach(root.survey.surveys.rooms, function (room, idx) {
              if (max_total_watts_percentage == root.survey.surveys.rooms[idx].heat_loss.total_watts_percentage) {
                root.survey.surveys.rooms[idx].heat_loss.max_total_watts_percentage = true;

              }

            });

            root.survey.surveys.total_power_watts = parseFloat(result.toFixed(2));
          }
        }
      },

      kilowatt_hours: {
        floor: {
          energy: function (root, room) {

            var floor_u_values_temperature = root.heat_loss.floor.floor_u_values_temperature(root, room);
            var which_room_is_below = room.which_room_is_below.toString();
            var degree_data_used = root.survey.surveys.region.value;
            var floor_area = room.floor_area;
            var result = 0;

            if (which_room_is_below.toUpperCase() === 'NONE')
              return floor_area * degree_data_used * floor_u_values_temperature * 24 / 1000;
            else
              return result;
          },

          calculate: function (root, room) {

            var value = parseFloat(this.energy(root, room).toFixed(2));

            root.helpers.calculate(root, 'kilowatt_hours.floor', value);
          }
        },
        external_wall_a: {
          energy: function (root, room) {

            var is_the_room_complex = room.is_the_room_complex;
            var degree_data_used = root.survey.surveys.region.value;
            var window_area = room.external_wall.type.a.window_area;
            var wall_length = room.external_wall.type.a.length;
            var room_height = room.room_height;
            var wall_a = room.external_type.wall.a;

            var multiplier = 0;
            var u_value = root.helpers.get_u_value(root, wall_a);

            if (is_the_room_complex.toUpperCase() === 'YES')
              multiplier = root.helpers.get_complex_value(root, room, 'External wall');
            else
              multiplier = (room_height * wall_length);

            return (multiplier - window_area) * degree_data_used * u_value * 24 / 1000;
          },

          calculate: function (root, room) {

            var value = parseFloat(this.energy(root, room).toFixed(2));

            root.helpers.calculate(root, 'kilowatt_hours.external_wall_a', value);
          }
        },
        external_wall_b: {
          energy: function (root, room) {

            // TODO: refactor with wall a
            var is_the_room_complex = room.is_the_room_complex;
            var degree_data_used = root.survey.surveys.region.value;
            var window_area = room.external_wall.type.b.window_area;
            var wall_length = room.external_wall.type.b.length;
            var room_height = room.room_height;
            var wall_b = room.external_type.wall.b;

            var multiplier = 0;
            var u_value = root.helpers.get_u_value(root, wall_b);

            if (is_the_room_complex.toUpperCase() === 'YES')
              multiplier = 0;
            else
              multiplier = (room_height * wall_length);

            return (multiplier - window_area) * degree_data_used * u_value * 24 / 1000;
          },

          calculate: function (root, room) {

            var value = parseFloat(this.energy(root, room).toFixed(2));

            root.helpers.calculate(root, 'kilowatt_hours.external_wall_b', value);
          }
        },
        window: {
          energy: function (root, room, type) {

            var degree_data_used = root.survey.surveys.region.value;
            var window_area = room.external_wall.type[type].window_area;
            var wall = room.windows ? room.windows.type[type] : '';

            var u_value = root.helpers.get_u_value(root, wall);

            return window_area * degree_data_used * u_value * 24 / 1000;
          },

          calculate: function (root, room) {

            var a = parseFloat(this.energy(root, room, 'a').toFixed(2));
            var b = parseFloat(this.energy(root, room, 'b').toFixed(2));

            root.helpers.calculate(root, 'kilowatt_hours.window_a', a);
            root.helpers.calculate(root, 'kilowatt_hours.window_b', b);
          }
        },
        external_door: {
          energy: function (root, room) {

            var external_door_area = room.external_door_area;
            var degree_data_used = root.survey.surveys.region.value;
            var door = room.external_door;

            var u_value = root.helpers.get_u_value(root, door);

            return external_door_area * degree_data_used * u_value * 24 / 1000;
          },

          calculate: function (root, room) {

            var value = parseFloat(this.energy(root, room).toFixed(2));

            root.helpers.calculate(root, 'kilowatt_hours.external_door', value);
          }
        },
        roof_glazing: {
          energy: function (root, room) {

            var roof_glazing_area = room.roof_glazing_area;
            var degree_data_used = root.survey.surveys.region.value;
            var roof_glazing = room.roof_glazing;

            var u_value = root.helpers.get_u_value(root, roof_glazing);

            return roof_glazing_area * degree_data_used * u_value * 24 / 1000;
          },

          calculate: function (root, room) {

            var value = parseFloat(this.energy(root, room).toFixed(2));

            root.helpers.calculate(root, 'kilowatt_hours.roof_glazing', value);
          }
        },

        roof_ceiling: {
          energy: function (root, room) {

            var is_the_room_complex = room.is_the_room_complex;
            var roof_glazing_area = room.roof_glazing_area;
            var degree_data_used = root.survey.surveys.region.value;
            var is_there_a_roof = room.is_there_a_roof;
            var ceiling_or_roof = room.ceiling_or_roof;
            var floor_area = room.floor_area;

            var multiplier = 0;
            var u_value = root.helpers.get_u_value(root, ceiling_or_roof);
            var result = 0;

            if (is_there_a_roof.toUpperCase() === 'NO')
              return result;
            else {
              if (is_the_room_complex.toUpperCase() === 'YES') {
                multiplier = room.room_dimensions.roof;
              } else
                multiplier = floor_area;

              multiplier = multiplier - roof_glazing_area;

              return multiplier * degree_data_used * u_value * 24 / 1000;
            }
          },

          calculate: function (root, room) {

            var value = parseFloat(this.energy(root, room).toFixed(2));

            root.helpers.calculate(root, 'kilowatt_hours.roof_ceiling', value);
          }
        },

        ventilation: {
          energy: function (root, room) {

            var amount_heated_per_hour = room.heat_loss.amount_heated_per_hour;
            var degree_data_used = root.survey.surveys.region.value;
            var room_name = room.room_name;

            var result = 0;

            if (room_name === '' || room_name === null)
              return result;
            else
              return amount_heated_per_hour * degree_data_used * 0.33 * 24 / 1000;
          },

          calculate: function (root, room) {

            var value = parseFloat(this.energy(root, room).toFixed(2));

            root.helpers.calculate(root, 'kilowatt_hours.ventilation', value);
          }
        },

        exposed_location: {
          energy: function (root, room) {

            var exposed_location_value = room.exposed_location_value;
            var exposed_location = room.exposed_location;
            var external_wall_a = room.kilowatt_hours.external_wall_a;
            var external_wall_b = room.kilowatt_hours.external_wall_b;
            var external_door = room.kilowatt_hours.external_door;
            var roof_glazing = room.kilowatt_hours.roof_glazing;
            var roof_ceiling = room.kilowatt_hours.roof_ceiling;
            var ventilation = room.kilowatt_hours.ventilation;
            var window_a = room.kilowatt_hours.window_a;
            var window_b = room.kilowatt_hours.window_b;
            var floor = room.kilowatt_hours.floor;

            if (exposed_location.toUpperCase() === 'YES')
              return (floor + external_wall_a + external_wall_b + window_a + window_b + external_door + roof_glazing +
                roof_ceiling + ventilation) * exposed_location_value;
            else
              return 0;
          },

          calculate: function (root, room) {

            var value = parseFloat(this.energy(root, room).toFixed(2));
            root.helpers.calculate(root, 'kilowatt_hours.exposed_location', value);
          }
        },

        intermitted_heating: {
          energy: function (root, room) {

            var intermittent_heating_required = room.intermittent_heating_required;
            var intermittent_heating_value = room.intermittent_heating_value;
            var external_wall_a = room.kilowatt_hours.external_wall_a;
            var external_wall_b = room.kilowatt_hours.external_wall_b;
            var external_door = room.kilowatt_hours.external_door;
            var roof_glazing = room.kilowatt_hours.roof_glazing;
            var roof_ceiling = room.kilowatt_hours.roof_ceiling;
            var ventilation = room.kilowatt_hours.ventilation;
            var window_a = room.kilowatt_hours.window_a;
            var window_b = room.kilowatt_hours.window_b;
            var floor = room.kilowatt_hours.floor;

            var result = 0;

            if (intermittent_heating_required.toUpperCase() === 'YES')
              return (floor + external_wall_a + external_wall_b + window_a + window_b + external_door + roof_glazing +
                roof_ceiling + ventilation) * intermittent_heating_value;
            else
              return result;
          },

          calculate: function (root, room) {

            var value = parseFloat(this.energy(root, room).toFixed(2));

            root.helpers.calculate(root, 'kilowatt_hours.intermitted_heating', value);
          }
        },

        total_kilowatt_hour: {
          calculate: function (root, room) {

            var intermitted_heating = room.kilowatt_hours.intermitted_heating;
            var exposed_location = room.kilowatt_hours.exposed_location;
            var external_wall_a = room.kilowatt_hours.external_wall_a;
            var external_wall_b = room.kilowatt_hours.external_wall_b;
            var external_door = room.kilowatt_hours.external_door;
            var roof_glazing = room.kilowatt_hours.roof_glazing;
            var roof_ceiling = room.kilowatt_hours.roof_ceiling;
            var ventilation = room.kilowatt_hours.ventilation;
            var window_a = room.kilowatt_hours.window_a;
            var window_b = room.kilowatt_hours.window_b;
            var floor = room.kilowatt_hours.floor;

            var result;

            result = (floor + window_a + window_b + ventilation + roof_ceiling + roof_glazing + external_door +
              external_wall_b + external_wall_a + exposed_location + intermitted_heating);

            root.helpers.calculate(root, 'kilowatt_hours.total_kilowatt_hour', parseFloat(result.toFixed(2)));
          }
        },

        total_energy_kilowatts: {
          calculate: function (root) {

            var result = 0;

            angular.forEach(root.survey.surveys.rooms, function (room) {
              result += room.kilowatt_hours.total_kilowatt_hour;
            });
            root.survey.surveys.total_energy_kilowatts = parseFloat(result.toFixed(2));
          }
        }
      },

      summary_result: {

        // For ASHP and GSHP
        electricity_consumed_by_hp: {
          calculate: function (root) {
            var room_index = root.survey.surveys.worst_performing_room;

            if (typeof room_index == 'undefined')
              return;

            var space_heating_likely_spf = root.survey.surveys.rooms[room_index].emitters.space_heating_likely_spf;
            var heat_supplied_by_hp_excluding_auxiliary_heaters = root.survey.surveys.summary_results.heat_supplied_by_hp_excluding_auxiliary_heaters;

            var electricity_consumed_by_hp = parseFloat((heat_supplied_by_hp_excluding_auxiliary_heaters / space_heating_likely_spf).toFixed(2));

            root.survey.surveys.summary_results.electricity_consumed_by_hp = electricity_consumed_by_hp;
          }
        },

        heat_supplied_by_hp_excluding_auxiliary_heaters: {
          calculate: function (root) {
            var total_energy_kilowatts = root.survey.surveys.total_energy_kilowatts;
            var remaining_heat_supplied_by_other_heat_sources = root.survey.surveys.summary_results.remaining_heat_supplied_by_other_heat_sources;

            var heat_supplied_by_hp_excluding_auxiliary_heaters;

            heat_supplied_by_hp_excluding_auxiliary_heaters = parseFloat((total_energy_kilowatts - remaining_heat_supplied_by_other_heat_sources).toFixed(2));

            root.survey.surveys.summary_results.heat_supplied_by_hp_excluding_auxiliary_heaters = heat_supplied_by_hp_excluding_auxiliary_heaters;
          }
        },

        renewable_heat_supplied_by_hp: {
          calculate: function (root) {
            var electricity_consumed_by_hp = root.survey.surveys.summary_results.electricity_consumed_by_hp;
            var heat_supplied_by_hp_excluding_auxiliary_heaters = root.survey.surveys.summary_results.heat_supplied_by_hp_excluding_auxiliary_heaters;


            var renewable_heat_supplied_by_hp = parseFloat((heat_supplied_by_hp_excluding_auxiliary_heaters - electricity_consumed_by_hp).toFixed(2));

            root.survey.surveys.summary_results.renewable_heat_supplied_by_hp = renewable_heat_supplied_by_hp;
          }
        },

        remaining_heat_to_be_supplied_by_auxiliary_heaters_and_other_heat_sources: {
          calculate: function (root) {

            var renewable_heat_supplied_by_hp = root.survey.surveys.summary_results.renewable_heat_supplied_by_hp;
            var electricity_consumed_by_hp = root.survey.surveys.summary_results.electricity_consumed_by_hp;
            var total_energy_kilowatts = root.survey.surveys.total_energy_kilowatts;

            var remaining_heat_to_be_supplied_by_auxiliary_heaters_and_other_heat_sources;

            remaining_heat_to_be_supplied_by_auxiliary_heaters_and_other_heat_sources = parseFloat((total_energy_kilowatts - electricity_consumed_by_hp - renewable_heat_supplied_by_hp).toFixed(2));

            root.survey.surveys.summary_results.remaining_heat_to_be_supplied_by_auxiliary_heaters_and_other_heat_sources = remaining_heat_to_be_supplied_by_auxiliary_heaters_and_other_heat_sources;
          }
        },

        remaining_heat_supplied_by_other_heat_sources: {
          calculate: function (root) {

            var is_bivalent_required = root.survey.surveys.is_bivalent_required;

            var remaining_heat_supplied_by_other_heat_sources;

            if (is_bivalent_required == 'YES') {
              remaining_heat_supplied_by_other_heat_sources = root.survey.surveys.bivalent.energy_demand;
            } else
              remaining_heat_supplied_by_other_heat_sources = 0;

            root.survey.surveys.summary_results.remaining_heat_supplied_by_other_heat_sources = remaining_heat_supplied_by_other_heat_sources;
          }
        },

        remaining_heat_supplied_by_auxiliary_heaters: {
          calculate: function (root) {
            var remaining_heat_to_be_supplied_by_auxiliary_heaters_and_other_heat_sources = root.survey.surveys.summary_results.remaining_heat_to_be_supplied_by_auxiliary_heaters_and_other_heat_sources;
            var remaining_heat_supplied_by_other_heat_sources = root.survey.surveys.summary_results.remaining_heat_supplied_by_other_heat_sources;

            var remaining_heat_supplied_by_auxiliary_heaters;

            remaining_heat_supplied_by_auxiliary_heaters = parseFloat((remaining_heat_to_be_supplied_by_auxiliary_heaters_and_other_heat_sources - remaining_heat_supplied_by_other_heat_sources).toFixed(2));

            root.survey.surveys.summary_results.remaining_heat_supplied_by_auxiliary_heaters = remaining_heat_supplied_by_auxiliary_heaters;
          }
        },

        electricity_consumed_by_hp_including_auxiliary_heaters: {
          calculate: function (root) {

            var remaining_heat_supplied_by_auxiliary_heaters = root.survey.surveys.summary_results.remaining_heat_supplied_by_auxiliary_heaters;
            var electricity_consumed_by_hp = root.survey.surveys.summary_results.electricity_consumed_by_hp;


            var electricity_consumed_by_hp_including_auxiliary_heaters;

            electricity_consumed_by_hp_including_auxiliary_heaters = parseFloat((remaining_heat_supplied_by_auxiliary_heaters + electricity_consumed_by_hp).toFixed(2));

            root.survey.surveys.summary_results.electricity_consumed_by_hp_including_auxiliary_heaters = electricity_consumed_by_hp_including_auxiliary_heaters;
          }
        },

        consumed_by_other_heat_sources: {
          calculate: function (root) {

            if (typeof root.survey.surveys.fuel_compare == 'undefined')
              return;

            var remaining_heat_supplied_by_other_heat_sources = root.survey.surveys.summary_results.remaining_heat_supplied_by_other_heat_sources;
            var heating_type = root.survey.surveys.fuel_compare.heating_type;
            var efficiency = 0;

            angular.forEach(heating_type, function (items) {
              if (root.survey.surveys.proposed_install_type.toLowerCase() == 'ashp' || root.survey.surveys.proposed_install_type.toLowerCase() == 'gshp') {
                if (items.name == root.survey.surveys.bivalent_fuel_type)
                  efficiency = (items.efficiency / 100);
              }
            });

            if (efficiency != 0) {
              root.survey.surveys.summary_results.consumed_by_other_heat_sources = parseFloat((remaining_heat_supplied_by_other_heat_sources / efficiency).toFixed(2));
            } else {
              root.survey.surveys.summary_results.consumed_by_other_heat_sources = 0;
            }
          }
        },

        domestic_hot_water_electricity_consumed_by_hp: {
          calculate: function (root) {

            if (typeof root.survey.surveys.domestic_hot_water == 'undefined')
              return;

            var heat_supplied_by_hp = root.survey.surveys.domestic_hot_water.heat_supplied_by_hp;
            var spf = root.survey.surveys.domestic_hot_water.flow_temperature_for_hot_water ? root.survey.surveys.domestic_hot_water.flow_temperature_for_hot_water.value : 0;

            var domestic_hot_water_electricity_consumed_by_hp;

            domestic_hot_water_electricity_consumed_by_hp = parseFloat((heat_supplied_by_hp / spf).toFixed(2));



            if (isNaN(domestic_hot_water_electricity_consumed_by_hp)) {
              domestic_hot_water_electricity_consumed_by_hp = 0;
            }

            root.survey.surveys.summary_results.domestic_hot_water_electricity_consumed_by_hp = domestic_hot_water_electricity_consumed_by_hp;
          }
        },

        domestic_renewable_heat_supplied_by_hp: {
          calculate: function (root) {

            if (typeof root.survey.surveys.domestic_hot_water == 'undefined')
              return;

            var domestic_hot_water_electricity_consumed_by_hp = root.survey.surveys.summary_results.domestic_hot_water_electricity_consumed_by_hp;
            var heat_supplied_by_hp = root.survey.surveys.domestic_hot_water.heat_supplied_by_hp;


            var domestic_renewable_heat_supplied_by_hp;

            domestic_renewable_heat_supplied_by_hp = parseFloat((heat_supplied_by_hp - domestic_hot_water_electricity_consumed_by_hp).toFixed(2));

            root.survey.surveys.summary_results.domestic_renewable_heat_supplied_by_hp = domestic_renewable_heat_supplied_by_hp;
          }
        },

        remaining_heat_to_be_supplied: {
          calculate: function (root) {

            if (typeof root.survey.surveys.domestic_hot_water == 'undefined')
              return;

            var domestic_hot_water_electricity_consumed_by_hp = root.survey.surveys.summary_results.domestic_hot_water_electricity_consumed_by_hp;
            var domestic_renewable_heat_supplied_by_hp = isNaN(root.survey.surveys.summary_results.domestic_renewable_heat_supplied_by_hp) ? 0 : root.survey.surveys.summary_results.domestic_renewable_heat_supplied_by_hp;
            var annual_demand = isNaN(root.survey.surveys.domestic_hot_water.annual_demand) ? 0 : root.survey.surveys.domestic_hot_water.annual_demand;

            var remaining_heat_to_be_supplied;

            remaining_heat_to_be_supplied = parseFloat((annual_demand) - (domestic_hot_water_electricity_consumed_by_hp + domestic_renewable_heat_supplied_by_hp).toFixed(2));

            root.survey.surveys.summary_results.remaining_heat_to_be_supplied = remaining_heat_to_be_supplied.toFixed(2);
          }
        },

        domestic_hot_water_electricity_consumed_by_hp_including: {
          calculate: function (root) {
            var domestic_hot_water_electricity_consumed_by_hp = root.survey.surveys.summary_results.domestic_hot_water_electricity_consumed_by_hp;
            var remaining_heat_to_be_supplied = parseFloat(root.survey.surveys.summary_results.remaining_heat_to_be_supplied);

            var domestic_hot_water_electricity_consumed_by_hp_including;

            domestic_hot_water_electricity_consumed_by_hp_including = parseFloat((domestic_hot_water_electricity_consumed_by_hp + remaining_heat_to_be_supplied).toFixed(2));

            root.survey.surveys.summary_results.domestic_hot_water_electricity_consumed_by_hp_including = domestic_hot_water_electricity_consumed_by_hp_including;
          }
        },

        proportion_of_space_heating_and_water_heating_demand: {
          calculate: function (root) {

            if (typeof root.survey.surveys.domestic_hot_water == 'undefined')
              return;

            var total_energy_kilowatts = root.survey.surveys.total_energy_kilowatts;
            var heat_supplied_by_hp = root.survey.surveys.domestic_hot_water.heat_supplied_by_hp;
            var heat_supplied_by_hp_excluding_auxiliary_heaters = root.survey.surveys.summary_results.heat_supplied_by_hp_excluding_auxiliary_heaters;
            var annual_demand = root.survey.surveys.domestic_hot_water.annual_demand;

            var proportion_of_space_heating_and_water_heating_demand;

            proportion_of_space_heating_and_water_heating_demand = parseFloat(((heat_supplied_by_hp_excluding_auxiliary_heaters + heat_supplied_by_hp) / (total_energy_kilowatts + annual_demand)).toFixed(2)) * 100;

            root.survey.surveys.summary_results.proportion_of_space_heating_and_water_heating_demand = proportion_of_space_heating_and_water_heating_demand;
          }
        },

        renewable_heat: {
          calculate: function (root) {

            var domestic_renewable_heat_supplied_by_hp = root.survey.surveys.summary_results.domestic_renewable_heat_supplied_by_hp;
            var renewable_heat_supplied_by_hp = root.survey.surveys.summary_results.renewable_heat_supplied_by_hp;

            var renewable_heat;

            renewable_heat = parseFloat((renewable_heat_supplied_by_hp + domestic_renewable_heat_supplied_by_hp).toFixed(2));

            root.survey.surveys.summary_results.renewable_heat = renewable_heat;
          }
        },

        proportions_electricity_consumed_by_hp: {
          calculate: function (root) {

            var domestic_hot_water_electricity_consumed_by_hp = root.survey.surveys.summary_results.domestic_hot_water_electricity_consumed_by_hp;
            var electricity_consumed_by_hp = root.survey.surveys.summary_results.electricity_consumed_by_hp;


            var proportions_electricity_consumed_by_hp;

            proportions_electricity_consumed_by_hp = parseFloat((electricity_consumed_by_hp + domestic_hot_water_electricity_consumed_by_hp).toFixed(2));

            root.survey.surveys.summary_results.proportions_electricity_consumed_by_hp = proportions_electricity_consumed_by_hp;
          }
        },

        electricity_consumed_by_auxiliary_or_immersion_heaters: {
          calculate: function (root) {
            var remaining_heat_supplied_by_auxiliary_heaters = root.survey.surveys.summary_results.remaining_heat_supplied_by_auxiliary_heaters;
            var remaining_heat_to_be_supplied = parseFloat(root.survey.surveys.summary_results.remaining_heat_to_be_supplied);


            var electricity_consumed_by_auxiliary_or_immersion_heaters;

            electricity_consumed_by_auxiliary_or_immersion_heaters = parseFloat((remaining_heat_supplied_by_auxiliary_heaters + remaining_heat_to_be_supplied).toFixed(2));

            root.survey.surveys.summary_results.electricity_consumed_by_auxiliary_or_immersion_heaters = electricity_consumed_by_auxiliary_or_immersion_heaters;
          }
        },

        hp_combined_performance_spf: {
          calculate: function (root) {

            if (typeof root.survey.surveys.domestic_hot_water == 'undefined')
              return;

            var heat_supplied_by_hp_excluding_auxiliary_heaters = root.survey.surveys.summary_results.heat_supplied_by_hp_excluding_auxiliary_heaters;
            var heat_supplied_by_hp = root.survey.surveys.domestic_hot_water.heat_supplied_by_hp;
            var remaining_heat_supplied_by_auxiliary_heaters = root.survey.surveys.summary_results.remaining_heat_supplied_by_auxiliary_heaters;
            var remaining_heat_to_be_supplied = root.survey.surveys.summary_results.remaining_heat_to_be_supplied;
            var electricity_consumed_by_hp_including_auxiliary_heaters = root.survey.surveys.summary_results.electricity_consumed_by_hp_including_auxiliary_heaters;
            var domestic_hot_water_electricity_consumed_by_hp_including = root.survey.surveys.summary_results.domestic_hot_water_electricity_consumed_by_hp_including;

            var hp_combined_performance_spf;

            hp_combined_performance_spf = parseFloat(((heat_supplied_by_hp_excluding_auxiliary_heaters + heat_supplied_by_hp + remaining_heat_supplied_by_auxiliary_heaters + remaining_heat_to_be_supplied) / (electricity_consumed_by_hp_including_auxiliary_heaters + domestic_hot_water_electricity_consumed_by_hp_including)).toFixed(2));

            root.survey.surveys.summary_results.hp_combined_performance_spf = hp_combined_performance_spf;
          }
        },

        cost_of_electricity_for_hp: {
          calculate: function (root) {

            // refactor it shoudn't be here
            if (typeof root.survey.surveys.fuel_compare == 'undefined')
              root.survey.surveys.fuel_compare = {};

            var heating_type = root.survey.surveys.fuel_compare.heating_type ? root.survey.surveys.fuel_compare.heating_type : 0;
            var c55 = root.survey.surveys.summary_results.proportions_electricity_consumed_by_hp;
            var c56 = root.survey.surveys.summary_results.electricity_consumed_by_auxiliary_or_immersion_heaters;
            var c62 = 0;


            angular.forEach(heating_type, function (items) {
              if (items.name == 'Direct Electric')
                c62 = items.price_per_unit;
            });

            if (isNaN(c55) || isNaN(c56)) {
              c55 = c56 = 0;
            }

            root.survey.surveys.summary_results.cost_of_electricity_for_hp = parseFloat((((c55 + c56) * c62) / 100).toFixed(2));
          }
        },

        ashp_cost_of_fuel_for_other_heat_sources: {
          calculate: function (root) {
            var consumed_by_other_heat_sources = root.survey.surveys.summary_results.consumed_by_other_heat_sources;
            var heating_type = root.survey.surveys.fuel_compare.heating_type;
            var pence = 0;

            angular.forEach(heating_type, function (items) {
              if (root.survey.surveys.proposed_install_type.toLowerCase() == 'ashp' || root.survey.surveys.proposed_install_type.toLowerCase() == 'gshp') {
                if (items.name == root.survey.surveys.bivalent_fuel_type)
                  pence = (items.pence_per_kwh / 100);
              }
            });

            root.survey.surveys.summary_results.ashp_cost_of_fuel_for_other_heat_sources = parseFloat((consumed_by_other_heat_sources * pence).toFixed(2));
          }
        },

        // For Biomass
        estimated_rate: {
          calculate: function (root) {
            var d6 = root.survey.surveys.output_at_designed_external_temperature;
            var d8 = root.survey.surveys.summary_results.manufactures_specified_efficiency;
            var d4 = $rootScope.cloud_data.biomass_type_details[root.survey.surveys.biomass_type].gross_calorific_value;

            root.survey.surveys.summary_results.estimated_rate = parseFloat((d6 * (100 / d8) * (1 / d4)).toFixed(2));
          }
        },

        estimated_volume: {
          calculate: function (root) {
            var d9 = root.survey.surveys.summary_results.estimated_rate;
            var d5 = $rootScope.cloud_data.biomass_type_details[root.survey.surveys.biomass_type].bulk_density;

            root.survey.surveys.summary_results.estimated_volume = parseFloat((d9 / d5).toFixed(5));
          }
        },

        heat_supplied_by_bhs: {
          calculate: function (root) {

            var c11 = root.survey.surveys.total_energy_kilowatts;
            var c12 = 100 / 100;

            root.survey.surveys.summary_results.heat_supplied_by_bhs = c11 * c12;
          }
        },

        annual_fuel_requirement_mass_of_bhs: {
          calculate: function (root) {

            var c11 = root.survey.surveys.total_energy_kilowatts;
            var c12 = 100 / 100;
            var c14 = 85;
            var d4 = $rootScope.cloud_data.biomass_type_details[root.survey.surveys.biomass_type].gross_calorific_value;

            root.survey.surveys.summary_results.annual_fuel_requirement_mass_of_bhs = parseFloat((c11 * c12 * (100 / c14) * (1 / d4)).toFixed(2));
          }
        },

        annual_fuel_requirement_volume_of_bhs: {
          calculate: function (root) {

            var c15 = root.survey.surveys.summary_results.annual_fuel_requirement_mass_of_bhs;
            var d5 = $rootScope.cloud_data.biomass_type_details[root.survey.surveys.biomass_type].bulk_density;

            root.survey.surveys.summary_results.annual_fuel_requirement_volume_of_bhs = parseFloat((c15 / d5).toFixed(2));
          }
        },

        remaining_heat_to_be_supplied_by_other_heat_sources: {
          calculate: function (root) {

            var c11 = root.survey.surveys.total_energy_kilowatts;
            var c13 = root.survey.surveys.summary_results.heat_supplied_by_bhs;

            root.survey.surveys.summary_results.remaining_heat_to_be_supplied_by_other_heat_sources = parseFloat((c11 - c13).toFixed(2));
          }
        },

        dhw_heat_supplied_by_bhs: {
          calculate: function (root) {

            var c33 = root.survey.surveys.domestic_hot_water ? root.survey.surveys.domestic_hot_water.hot_water_annual_demand : 0;
            var c34 = 100 / 100;

            root.survey.surveys.summary_results.dhw_heat_supplied_by_bhs = parseFloat((c33 * c34).toFixed(2));
          }
        },

        dhw_annual_fuel_requirement_mass_of_bhs: {
          calculate: function (root) {

            if (!root.survey.surveys.domestic_hot_water) {
              return;
            }

            var c33 = root.survey.surveys.domestic_hot_water.hot_water_annual_demand ? root.survey.surveys.domestic_hot_water.hot_water_annual_demand : 0;
            var c34 = 100 / 100;
            var c36 = 85;
            var d4 = $rootScope.cloud_data.biomass_type_details[root.survey.surveys.biomass_type].gross_calorific_value;

            root.survey.surveys.summary_results.dhw_annual_fuel_requirement_mass_of_bhs = parseFloat((c33 * c34 * (100 / c36) * (1 / d4)).toFixed(2));
          }
        },

        dhw_annual_fuel_requirement_volume_of_bhs: {
          calculate: function (root) {

            var c37 = root.survey.surveys.summary_results.dhw_annual_fuel_requirement_mass_of_bhs;
            var d5 = $rootScope.cloud_data.biomass_type_details[root.survey.surveys.biomass_type].bulk_density;

            root.survey.surveys.summary_results.dhw_annual_fuel_requirement_volume_of_bhs = parseFloat((c37 / d5).toFixed(2));
          }
        },

        dhw_remaining_heat_to_be_supplied_by_other_heat_sources: {
          calculate: function (root) {

            if (!root.survey.surveys.domestic_hot_water) {
              return;
            }

            var c33 = root.survey.surveys.domestic_hot_water.hot_water_annual_demand;
            var c35 = root.survey.surveys.summary_results.dhw_heat_supplied_by_bhs;

            root.survey.surveys.summary_results.dhw_remaining_heat_to_be_supplied_by_other_heat_sources = parseFloat((c33 - c35).toFixed(2));
          }
        },

        space_heating_and_water_heating_demand_provided_by_bhs: {
          calculate: function (root) {

            if (!root.survey.surveys.domestic_hot_water) {
              return;
            }

            var c13 = root.survey.surveys.summary_results.heat_supplied_by_bhs;
            var c35 = root.survey.surveys.summary_results.dhw_heat_supplied_by_bhs;
            var c11 = root.survey.surveys.total_energy_kilowatts;
            var c33 = root.survey.surveys.domestic_hot_water.hot_water_annual_demand;

            root.survey.surveys.summary_results.space_heating_and_water_heating_demand_provided_by_bhs = parseFloat(((c13 + c35) / (c11 + c33) * 100).toFixed(2));
          }
        },

        proportions_heat_supplied_by_bhs: {
          calculate: function (root) {

            var c13 = root.survey.surveys.summary_results.heat_supplied_by_bhs;
            var c35 = root.survey.surveys.summary_results.dhw_heat_supplied_by_bhs;

            root.survey.surveys.summary_results.proportions_heat_supplied_by_bhs = parseFloat((c13 + c35).toFixed(2));
          }
        },

        proportions_annual_fuel_requirement_mass_of_bhs: {
          calculate: function (root) {

            var c15 = root.survey.surveys.summary_results.annual_fuel_requirement_mass_of_bhs;
            var c37 = root.survey.surveys.summary_results.dhw_annual_fuel_requirement_mass_of_bhs;
            root.survey.surveys.summary_results.proportions_annual_fuel_requirement_mass_of_bhs = parseFloat((c15 + c37).toFixed(2));
          }
        },

        proportions_annual_fuel_requirement_volume_of_bhs: {
          calculate: function (root) {

            var c16 = root.survey.surveys.summary_results.annual_fuel_requirement_volume_of_bhs;
            var c38 = root.survey.surveys.summary_results.dhw_annual_fuel_requirement_volume_of_bhs;

            root.survey.surveys.summary_results.proportions_annual_fuel_requirement_volume_of_bhs = parseFloat((c16 + c38).toFixed(2));
          }
        },

        fuel_consumed_by_other_heat_sources: {
          calculate: function (root) {

          }
        },

        cost_of_biofuel_for_bhs: {
          calculate: function (root) {

            if (!root.survey.surveys.fuel_compare)
              return;

            var heating_type = root.survey.surveys.fuel_compare.heating_type;
            var cost_per_unit = 0;

            angular.forEach(heating_type, function (items) {
              if (items.name == root.survey.surveys.if_biomass_which_fuel_type)
                cost_per_unit = items.pence_per_kwh;
            });

            var c50 = root.survey.surveys.summary_results.proportions_heat_supplied_by_bhs;
            var c51 = 85 / 100;
            var c58 = cost_per_unit;

            root.survey.surveys.summary_results.cost_of_biofuel_for_bhs = parseFloat(((((c50 / c51) * c58)) / 100).toFixed(2));
          }
        },

        cost_of_fuel_for_other_heat_sources: {
          calculate: function (root) {


            // =SUM(C54*C59)/100
          }
        }
      },

      calculate_domestic_hot_water: function () {

        var spf
        // if(service.survey.surveys.domestic_hot_water) {
        //   spf = (typeof service.survey.surveys.domestic_hot_water.calculate_domestic_hot_water == 'object' && ) ? service.survey.surveys.domestic_hot_water.flow_temperature_collection : '';
        // } else {
          if (typeof service.survey.surveys.domestic_hot_water == 'undefined') {
            service.survey.surveys.domestic_hot_water = {};

            service.survey.surveys.domestic_hot_water.efficiency_pipework_loss_to_cylinder = 70;
            service.survey.surveys.domestic_hot_water.number_of_occupants_per_bedroom = 0;
            service.survey.surveys.domestic_hot_water.flow_temperature_for_hot_water = 35;
            service.survey.surveys.domestic_hot_water.hot_water_per_occupant = 45;
            service.survey.surveys.domestic_hot_water.number_of_bed_rooms = 0;
            service.survey.surveys.domestic_hot_water.electricity_cost = 14;
            service.survey.surveys.domestic_hot_water.immersion_hw_electrical_energy_per_day = 0;
            service.survey.surveys.domestic_hot_water.total_hot_water_energy_demand_per_day = 0;
            service.survey.surveys.domestic_hot_water.hot_water_energy_heat_pump_compressor = 0;
            service.survey.surveys.domestic_hot_water.final_secondary_hw_temperature = 0;

            service.survey.surveys.domestic_hot_water.heat_supplied_by_hp = 0;
            service.survey.surveys.domestic_hot_water.hot_water_demand_per_day = 0;
            service.survey.surveys.domestic_hot_water.hot_water_annual_demand = 0;
            service.survey.surveys.domestic_hot_water.hot_water_energy = 0;
            service.survey.surveys.domestic_hot_water.annual_demand = 0;
          }
        //}
        if(!service.survey.surveys.domestic_hot_water.efficiency_pipework_loss_to_cylinder) {
          service.survey.surveys.domestic_hot_water.efficiency_pipework_loss_to_cylinder = 95;
        }
        if(!service.survey.surveys.domestic_hot_water.electricity_cost) {
          service.survey.surveys.domestic_hot_water.electricity_cost = 37;
        }
        var proposed_install_type = service.survey.surveys.proposed_install_type.toLowerCase();

        if(service.survey.surveys.domestic_hot_water && (typeof service.survey.surveys.domestic_hot_water.flow_temperature_collection == 'object')) {
          spf = service.survey.surveys.domestic_hot_water.flow_temperature_collection;
        } else {
          spf = $rootScope.cloud_data.spf[proposed_install_type];
          if (service.survey.surveys.is_ashp_high_temp_model == 'YES' && proposed_install_type == 'ashp')
            spf = $rootScope.cloud_data.spf['high_ashp'];

          if (proposed_install_type != 'ashp' || proposed_install_type != 'gshp' || proposed_install_type != 'biomass') {
            spf = $rootScope.cloud_data.spf['ashp'];
          }
        }

        // check "to be confirm" text
        var filterData1
        if ((!!service.survey.surveys.preferred_manufacture && service.survey.surveys.preferred_manufacture != '') &&
          (!!service.survey.surveys.preferred_model && service.survey.surveys.preferred_model != '')) {
          // condition for "to be confirmed"
          if (service.survey.surveys.preferred_manufacture == "To be confirmed") {
            spf = $rootScope.cloud_data.spf[proposed_install_type];
            if (service.survey.surveys.is_ashp_high_temp_model == 'YES' && proposed_install_type == 'ashp')
              spf = $rootScope.cloud_data.spf['high_ashp'];

            if (proposed_install_type != 'ashp' || proposed_install_type != 'gshp' || proposed_install_type != 'biomass') {
              spf = $rootScope.cloud_data.spf['ashp'];
            }
            if (service.survey.surveys.proposed_install_type == 'ASHP') {
              let getList = spfData.ashp.filter(function (val) { return val.temp == service.survey.surveys.maximum_designed_flow_temperature; })
              filterData1 = getList[0]
              spf.map((function (data, idx) {
                if (data.temp == filterData1.temp) {
                  spf[idx] = filterData1
                }
              }))
            } else if (service.survey.surveys.proposed_install_type == 'GSHP') {
              let getList = spfData.gshp.filter(function (val) { return val.temp == service.survey.surveys.maximum_designed_flow_temperature; })
              filterData1 = getList[0]
              spf.map((function (data, idx) {
                if (data.temp == filterData1.temp) {
                  spf[idx] = filterData1
                }
              }))
            }

          } else {
            // admin/my manufacturers
            // _.each($rootScope.manufactures, function (manufacture) {
            //   if (manufacture.company_name == service.survey.surveys.preferred_manufacture) {
            //     _.each(manufacture.models, function (model) {
            //       if (model.model_name == service.survey.surveys.preferred_model[0]) {
            //         _.each(model.scop, function (s, idx) {
            //           spf[idx].value = s.spf;
            //         });
            //       }
            //     });
            //   }
            // });
            // premium manufacturers
            // _.each($rootScope.premiumManufactures, function (preManu) {
            //   if (preManu.company_name == service.survey.surveys.preferred_manufacture) {
            //     _.each(preManu.models, function (model) {
            //       if (model.model_name == service.survey.surveys.preferred_model[0]) {
            //         _.each(model.scop, function (s, idx) {
            //           spf[idx].value = s.spf;
            //         });
            //       }
            //     });
            //   }
            // });


          }

        }

        service.survey.surveys.domestic_hot_water.flow_temperature_collection = spf;
        this.domestic_hot_water.hot_water_energy_demand_per_day(service);
        this.domestic_hot_water.final_secondary_hw_temperature(service);
        this.domestic_hot_water.hot_water_energy_heat_pump_compressor_per_day(service);
        this.domestic_hot_water.immersion_hw_electrical_energy_per_day(service);
        this.domestic_hot_water.total_hot_water_energy_demand_per_day(service);
        this.domestic_hot_water.annual_demand(service);
        this.domestic_hot_water.heat_supplied_by_hp(service);
        this.domestic_hot_water.hot_water_demand_per_day(service);
        this.domestic_hot_water.hot_water_annual_demand(service);
      },

      calculate_bivalent: function () {

        if (typeof service.survey.surveys.bivalent == 'undefined') {
          service.survey.surveys.bivalent = {};

          service.survey.surveys.bivalent.point = 1;
          service.survey.surveys.bivalent.delta = [];
          service.survey.surveys.bivalent.watts = [];
        }

        this.bivalent.delta.calculate(service);
      },

      calculate_ground_loop: function () {

        var ground_loop_type = $rootScope.cloud_data.ground_loop_type;
        var ground_type = $rootScope.cloud_data.ground_type;
        var spacing = $rootScope.cloud_data.spacing;
        var surveys = service.survey.surveys;
        var rpt = $rootScope.cloud_data.rpt;

        if (typeof surveys.ground_loop == 'undefined')
          surveys.ground_loop = {};

        if (typeof surveys.ground_loop.ground_type == 'undefined')
          surveys.ground_loop.ground_type = {};

        surveys.ground_loop.ground_loop_type_collection = ground_loop_type;
        surveys.ground_loop.ground_type_collection = ground_type;
        surveys.ground_loop.spacing = spacing;
        surveys.ground_loop.rpt = rpt;

        service.survey.surveys = surveys;

        this.ground_loop.estimate_of_total_heating_energy_consumption.calculate(service);
        this.ground_loop.fleq_run_hours.calculate(service);
        this.ground_loop.maximum_power_extracted_on_the_ground.calculate(service);
        this.ground_loop.length_of_heat_ground_exchanger.calculate(service);
        this.ground_loop.total_length_of_ground_heat_exchanger.calculate(service);
        this.ground_loop.total_area_or_total_area_of_trench.calculate(service);
        this.ground_loop.number_of_boreholes.calculate(service);

        return service.survey;
      },

      calculate_fuel_compare: function () {
        var domestic_hot_water = service.survey.surveys.domestic_hot_water;

        var hot_water_annual_demand = domestic_hot_water.hot_water_annual_demand ?
          domestic_hot_water.hot_water_annual_demand : 0;

        var total_energy_kilowatts = service.survey.surveys.total_energy_kilowatts ?
          service.survey.surveys.total_energy_kilowatts : 0;

        var heat_supplied_by_hp = service.survey.surveys.domestic_hot_water.heat_supplied_by_hp ?
          service.survey.surveys.domestic_hot_water.heat_supplied_by_hp : 0;

        var maximum_designed_flow_temperature = parseInt(service.survey.surveys.maximum_designed_flow_temperature);
        var proposed_install_type = service.survey.surveys.proposed_install_type.toLowerCase();
        var heating_type = $rootScope.cloud_data.heating_type;
        if (service.survey.surveys.fuel_compare && service.survey.surveys.fuel_compare.heating_type) {
          heating_type = service.survey.surveys.fuel_compare.heating_type;
        }

        var temp = domestic_hot_water.flow_temperature_for_hot_water ? domestic_hot_water.flow_temperature_for_hot_water.temp: 0;
        var price_per_tone_array = [250, 150, 100];
        var price_per_tone_idx = 0;
        var spf = $rootScope.cloud_data.space_heating_likely_spf;
        var dhw_spf = ['', '', '', '', '', '', '', 'ashp', 'gshp'];

        if (service.survey.surveys.is_ashp_high_temp_model == 'YES')
          dhw_spf[7] = 'high_ashp';
        else
          dhw_spf[7] = 'ashp';
        var filterData2
        if ((!!service.survey.surveys.preferred_manufacture && service.survey.surveys.preferred_manufacture != '') &&
          (!!service.survey.surveys.preferred_model && service.survey.surveys.preferred_model != '')) {
          // condition for "to be confirmed"
          if (service.survey.surveys.preferred_manufacture == "To be confirmed") {
            if (service.survey.surveys.proposed_install_type == 'ASHP') {
              let getList = spfData.ashp.filter(function (val) { return val.temp == service.survey.surveys.maximum_designed_flow_temperature; })
              filterData2 = getList[0]
              //spf.map((function(data,idx){
              //if(data.temp == filterData2.temp){
              // spf[idx] = filterData
              spf.ashp[filterData2.temp].value = filterData2.value;
              spf.gshp[filterData2.temp].value = filterData2.value;
              spf.high_ashp[filterData2.temp].value = filterData2.value;
              //}
              // }))
            } else if (service.survey.surveys.proposed_install_type == 'GSHP') {
              let getList = spfData.gshp.filter(function (val) { return val.temp == service.survey.surveys.maximum_designed_flow_temperature; })
              filterData2 = getList[0]
              //spf.map((function(data,idx){
              //if(data.temp == filterData2.temp){
              // spf[idx] = filterData
              spf.ashp[filterData2.temp].value = filterData2.value;
              spf.gshp[filterData2.temp].value = filterData2.value;
              spf.high_ashp[filterData2.temp].value = filterData2.value;
              //}
              //}))
            }

          } else {
            // admin/my manufacturers
            _.each($rootScope.manufactures, function (manufacture) {
              if (manufacture.company_name == service.survey.surveys.preferred_manufacture) {
                _.each(manufacture.models, function (model) {
                  if (model.model_name == service.survey.surveys.preferred_model) {
                    _.each(model.scop, function (s, idx) {
                      spf.ashp[s.temp].value = s.spf;
                      spf.gshp[s.temp].value = s.spf;
                      spf.high_ashp[s.temp].value = s.spf;
                    });
                  }
                });
              }
            });
            // premium manufacturers
            _.each($rootScope.premiumManufactures, function (preManu) {
              if (preManu.company_name == service.survey.surveys.preferred_manufacture) {
                _.each(preManu.models, function (model) {
                  if (model.model_name == service.survey.surveys.preferred_model[0]) {
                    _.each(model.scop, function (s, idx) {
                      spf.ashp[s.temp].value = s.spf;
                      spf.gshp[s.temp].value = s.spf;
                      spf.high_ashp[s.temp].value = s.spf;
                    });
                  }
                });
              }
            });
          }
        }

        // service.survey.surveys.fuel_compare = undefined;

        if (typeof service.survey.surveys.fuel_compare == 'undefined')
          service.survey.surveys.fuel_compare = {};

        angular.forEach(heating_type, function (value, idx) {

          heating_type[idx].annual_demand = {};
          heating_type[idx].spf = {};

          if (value.name == 'Air Source Heat Pump' || value.name == 'Ground Source Heat Pump')
            heating_type[idx].number_kwh_in_unit = 'see SPF';
          else
            heating_type[idx].number_kwh_in_unit = heating_type[idx].number_kwh_in_unit ? heating_type[idx].number_kwh_in_unit : 0;

          if (value.name == 'Biomass Wood Pellets' || value.name == 'Biomass Logs' || value.name == 'Biomass Chips') {
            heating_type[idx].price_per_tone = heating_type[idx].price_per_tone ? heating_type[idx].price_per_tone : price_per_tone_array[price_per_tone_idx];
            price_per_tone_idx = price_per_tone_idx + 1;
          } else
            heating_type[idx].price_per_tone = null;

          if (value.name == 'Air Source Heat Pump' || value.name == 'Ground Source Heat Pump')
            heating_type[idx].annual_demand.hot_water = heat_supplied_by_hp;
          else
            heating_type[idx].annual_demand.hot_water = hot_water_annual_demand;

          heating_type[idx].annual_demand.heating = total_energy_kilowatts;

          if (value.name == 'Biomass Chips') {
            heating_type[idx].spf.dhw = 'DHW SPF';
            heating_type[idx].spf.heating = 'Heating SPF';
          } else if (value.name == 'Air Source Heat Pump' || value.name == 'Ground Source Heat Pump') {

            if (idx == 7 || idx == 8) {

              if (!!spf[dhw_spf[idx]][temp]) {
                if (idx == 7) {
                  if ((proposed_install_type == 'ashp' || proposed_install_type == 'oil' || proposed_install_type == 'lpg' || proposed_install_type == 'mains gas' || proposed_install_type == 'direct electric') && idx == 7 && spf[dhw_spf[idx]][temp].value == 0) {
                    heating_type[idx].spf.dhw = 2.4;
                  } else
                    heating_type[idx].spf.dhw = spf[dhw_spf[idx]][temp].value;
                }
                if (idx == 8) {
                  if ((proposed_install_type == 'gshp' || proposed_install_type == 'oil' || proposed_install_type == 'lpg' || proposed_install_type == 'mains gas' || proposed_install_type == 'direct electric') && idx == 8 && spf[dhw_spf[idx]][temp].value == 0) {
                    heating_type[idx].spf.dhw = 3.1;
                  } else
                    heating_type[idx].spf.dhw = spf[dhw_spf[idx]][temp].value;
                }
              }

              if (proposed_install_type == 'ashp' && idx == 7) {
                heating_type[idx].spf.heating = spf[dhw_spf[idx]][maximum_designed_flow_temperature].value;
              } else if (proposed_install_type != 'ashp' && idx == 7)
                heating_type[idx].spf.heating = 3;
              else if (proposed_install_type == 'gshp' && idx == 8) {
                heating_type[idx].spf.heating = spf[dhw_spf[idx]][maximum_designed_flow_temperature].value;
              } else if (proposed_install_type != 'gshp' && idx == 8)
                heating_type[idx].spf.heating = 3.7;
            }
          }

          heating_type[idx].price_per_unit = heating_type[idx].price_per_unit;
          heating_type[idx].pence_per_kwh = heating_type[idx].pence_per_kwh ? heating_type[idx].pence_per_kwh : 0;

          //if(typeof heating_type[idx].is_included == 'undefined')
          //  heating_type[idx].is_included = true;
        });

        _.each(service.survey.surveys.fuel_compare.heating_type, function (type, idx) {
          if (typeof type.is_included == 'undefined')
            heating_type[idx].is_included = true;
          else
            heating_type[idx].is_included = type.is_included;
        });

        service.survey.surveys.fuel_compare.heating_type = heating_type;

        this.fuel_compare.calculate(service);
      },

      calculate_emitters: function () {

        var room = service.survey.surveys.rooms[service.idx];
        var proposed_install_type = service.survey.surveys.proposed_install_type.toLowerCase();

        var spf = $rootScope.cloud_data.spf[proposed_install_type];
        var space_heating_likely_spf = $rootScope.cloud_data.space_heating_likely_spf;

        var flow_temperature = room.flow_temperature ? room.flow_temperature : "60";
        var proposed_type;
        var star_rating;
        var filterData3
        if ((!!service.survey.surveys.preferred_manufacture && service.survey.surveys.preferred_manufacture != '') &&
          (!!service.survey.surveys.preferred_model && service.survey.surveys.preferred_model != '')) {
          if (service.survey.surveys.preferred_manufacture == "To be confirmed") {
            if (service.survey.surveys.proposed_install_type == 'ASHP') {
              let getList = spfData.ashp.filter(function (val) { return val.temp == service.survey.surveys.maximum_designed_flow_temperature; })
              filterData3 = getList[0]
              spf.map((function (data, idx) {
                if (data.temp == filterData3.temp) {
                  // spf[idx] = filterData
                  space_heating_likely_spf.ashp[data.temp].value = filterData3.value;
                  space_heating_likely_spf.gshp[data.temp].value = filterData3.value;
                  space_heating_likely_spf.high_ashp[data.temp].value = filterData3.value;
                }
              }))
            } else if (service.survey.surveys.proposed_install_type == 'GSHP') {
              let getList = spfData.gshp.filter(function (val) { return val.temp == service.survey.surveys.maximum_designed_flow_temperature; })
              filterData3 = getList[0]
              spf.map((function (data, idx) {
                if (data.temp == filterData3.temp) {
                  // spf[idx] = filterData
                  space_heating_likely_spf.ashp[data.temp].value = filterData3.value;
                  space_heating_likely_spf.gshp[data.temp].value = filterData3.value;
                  space_heating_likely_spf.high_ashp[data.temp].value = filterData3.value;
                }
              }))
            }
          } else {
            // admin/my manufacturers
            _.each($rootScope.manufactures, function (manufacture) {
              if (manufacture.company_name == service.survey.surveys.preferred_manufacture) {
                _.each(manufacture.models, function (model) {
                  if (model.model_name == service.survey.surveys.preferred_model[0]) {
                    _.each(model.scop, function (s, idx) {
                      space_heating_likely_spf.ashp[s.temp].value = s.spf;
                      space_heating_likely_spf.gshp[s.temp].value = s.spf;
                      space_heating_likely_spf.high_ashp[s.temp].value = s.spf;
                    });
                  }
                });
              }
            });
            // premium manufacturers
            _.each($rootScope.premiumManufactures, function (preManu) {
              if (preManu.company_name == service.survey.surveys.preferred_manufacture) {
                _.each(preManu.models, function (model) {
                  if (model.model_name == service.survey.surveys.preferred_model[0]) {
                    _.each(model.scop, function (s, idx) {
                      space_heating_likely_spf.ashp[s.temp].value = s.spf;
                      space_heating_likely_spf.gshp[s.temp].value = s.spf;
                      space_heating_likely_spf.high_ashp[s.temp].value = s.spf;
                    });
                  }
                });
              }
            });
          }
        }

        if (service.survey.surveys.is_ashp_high_temp_model == 'YES')
          proposed_type = 'high_ashp';
        else
          proposed_type = proposed_install_type.toLowerCase();

        if (typeof room.emitters == 'undefined')
          room.emitters = {};

        if (typeof room.emitters.underfloor_heating_details == 'undefined') {
          room.emitters.underfloor_heating_details = {};
          room.emitters.underfloor_heating_details.floor_surface = null;
          room.emitters.underfloor_heating_details.max_pipe_spacing = null;
          room.emitters.underfloor_heating_details.floor_type = null;
        }

        if (room.heat_loss.watts_per_meter_squared < 0)
          room.emitters.max_heat_loss_per_floor = "30";
        else if (room.heat_loss.watts_per_meter_squared > 0 && room.heat_loss.watts_per_meter_squared <= 30)
          room.emitters.max_heat_loss_per_floor = "30";
        else if (room.heat_loss.watts_per_meter_squared >= 30 && room.heat_loss.watts_per_meter_squared <= 50)
          room.emitters.max_heat_loss_per_floor = "50";
        else if (room.heat_loss.watts_per_meter_squared >= 50 && room.heat_loss.watts_per_meter_squared <= 80)
          room.emitters.max_heat_loss_per_floor = "80";
        else if (room.heat_loss.watts_per_meter_squared > 80)
          room.emitters.max_heat_loss_per_floor = "100";

        if (proposed_install_type == 'ashp' || proposed_install_type == 'gshp' || proposed_install_type == 'biomass') {
          if (proposed_install_type != 'biomass') {
            if (typeof space_heating_likely_spf[proposed_type][flow_temperature].star == 'undefined')
              star_rating = 1;
            else {
              star_rating = space_heating_likely_spf[proposed_type][flow_temperature].star;

              space_heating_likely_spf = space_heating_likely_spf[proposed_type][flow_temperature].value;

              room.emitters.space_heating_likely_spf = space_heating_likely_spf;
              room.emitters.star_rating = star_rating;
            }
          }
        } else {
          space_heating_likely_spf = space_heating_likely_spf['ashp'][flow_temperature].value;
          room.emitters.space_heating_likely_spf = space_heating_likely_spf;
        }

        this.helpers.emitters.get_oversize_factor(service, room);
        this.emitters.heat_emitter_watts.calculate(service, room);
        this.emitters.current_rad_oversize_percentage.calculate(service, room);
        this.emitters.max_pipe_spacing.calculate(service, room);
      },

      calculate_heat_loss: function () {

        var room = service.survey.surveys.rooms[service.idx];

        this.heat_loss.floor.calculate(service, room);
        this.heat_loss.external_wall_a.calculate(service, room);
        this.heat_loss.external_wall_b.calculate(service, room);
        this.heat_loss.window.calculate(service, room);
        this.heat_loss.internal_wall.calculate(service, room);
        this.heat_loss.party_wall.calculate(service, room);
        this.heat_loss.external_door.calculate(service, room);
        this.heat_loss.roof_glazing.calculate(service, room);
        this.heat_loss.roof_ceiling.calculate(service, room);
        this.heat_loss.amount_heated_per_hour.calculate(service, room);
        this.heat_loss.ventilation.calculate(service, room);
        this.heat_loss.high_ceiling_increases.calculate(service, room);
        this.heat_loss.exposed_location.calculate(service, room);
        this.heat_loss.intermitted_heating.calculate(service, room);
        this.heat_loss.thermal_bridges.calculate(service, room);
        this.heat_loss.total_watts.calculate(service, room);
        this.heat_loss.watts_per_meter_squared.calculate(service, room);
        this.helpers.get_u_value_and_temps(service, room);
      },

      calculate_kilowatt_hours: function () {

        var room = service.survey.surveys.rooms[service.idx];

        this.kilowatt_hours.floor.calculate(service, room);
        this.kilowatt_hours.external_wall_a.calculate(service, room);
        this.kilowatt_hours.external_wall_b.calculate(service, room);
        this.kilowatt_hours.window.calculate(service, room);
        this.kilowatt_hours.external_door.calculate(service, room);
        this.kilowatt_hours.roof_glazing.calculate(service, room);
        this.kilowatt_hours.roof_ceiling.calculate(service, room);
        this.kilowatt_hours.ventilation.calculate(service, room);
        this.kilowatt_hours.exposed_location.calculate(service, room);
        this.kilowatt_hours.intermitted_heating.calculate(service, room);
        this.kilowatt_hours.total_kilowatt_hour.calculate(service, room);
      },

      calculate_total_power_watts: function () {
        this.heat_loss.total_power_watts.calculate(service);
      },

      calculate_total_energy_kilowatts: function () {
        this.kilowatt_hours.total_energy_kilowatts.calculate(service);
      },

      calculate_spf: function () {

        var rooms = service.survey.surveys.rooms;
        var min = 0;

        service.survey.surveys.average_spf = 0;

        angular.forEach(rooms, function (item) {
          if (!item.emitters)
            return;

          service.survey.surveys.average_spf += item.emitters.space_heating_likely_spf;

          if (min == 0)
            min = item.emitters.space_heating_likely_spf;
          else {
            if (min > item.emitters.space_heating_likely_spf)
              min = item.emitters.space_heating_likely_spf;
          }
        });
        service.survey.surveys.average_spf = parseFloat((service.survey.surveys.average_spf / rooms.length).toFixed(1));
        service.survey.surveys.min_spf = min;
      },

      calculate_summary_results: function () {

        //service.survey.surveys.summary_results = undefined;

        if (typeof service.survey.surveys.summary_results == 'undefined') {
          service.survey.surveys.summary_results = {};

          service.survey.surveys.summary_results.annual_space_heating_demand = 0;
          service.survey.surveys.summary_results.annual_water_heating_demand = 0;
          service.survey.surveys.summary_results.spacing_heating_supplied_by_hp = 'NO';
          service.survey.surveys.summary_results.water_heating_supplied_by_hp = 'NO';
          service.survey.surveys.summary_results.maximum_qualifying_heat_supplied_by_the_hp = 0;
          service.survey.surveys.summary_results.maximum_qualifying_renewable_heat = 0;

          service.survey.surveys.summary_results.maximum_qualifying_renewable_heat = 0;
          service.survey.surveys.summary_results.manufactures_specified_efficiency = 94;
        }

        if (service.survey.surveys.proposed_install_type.toLowerCase() == 'biomass') {
          this.summary_result.estimated_rate.calculate(service);
          this.summary_result.estimated_volume.calculate(service);
          this.summary_result.heat_supplied_by_bhs.calculate(service);
          this.summary_result.annual_fuel_requirement_mass_of_bhs.calculate(service);
          this.summary_result.annual_fuel_requirement_volume_of_bhs.calculate(service);
          this.summary_result.remaining_heat_to_be_supplied_by_other_heat_sources.calculate(service);
          this.summary_result.dhw_heat_supplied_by_bhs.calculate(service);
          this.summary_result.dhw_annual_fuel_requirement_mass_of_bhs.calculate(service);
          this.summary_result.dhw_annual_fuel_requirement_volume_of_bhs.calculate(service);
          this.summary_result.dhw_remaining_heat_to_be_supplied_by_other_heat_sources.calculate(service);
          this.summary_result.space_heating_and_water_heating_demand_provided_by_bhs.calculate(service);
          this.summary_result.proportions_heat_supplied_by_bhs.calculate(service);
          this.summary_result.proportions_annual_fuel_requirement_mass_of_bhs.calculate(service);
          this.summary_result.proportions_annual_fuel_requirement_volume_of_bhs.calculate(service);
          this.summary_result.cost_of_biofuel_for_bhs.calculate(service);
        } else {
          this.summary_result.remaining_heat_supplied_by_other_heat_sources.calculate(service);
          this.summary_result.heat_supplied_by_hp_excluding_auxiliary_heaters.calculate(service);
          this.summary_result.electricity_consumed_by_hp.calculate(service);
          this.summary_result.renewable_heat_supplied_by_hp.calculate(service);
          this.summary_result.remaining_heat_to_be_supplied_by_auxiliary_heaters_and_other_heat_sources.calculate(service);
          this.summary_result.remaining_heat_supplied_by_auxiliary_heaters.calculate(service);
          this.summary_result.electricity_consumed_by_hp_including_auxiliary_heaters.calculate(service);
          this.summary_result.consumed_by_other_heat_sources.calculate(service);
          this.summary_result.domestic_hot_water_electricity_consumed_by_hp.calculate(service);
          this.summary_result.domestic_renewable_heat_supplied_by_hp.calculate(service);
          this.summary_result.remaining_heat_to_be_supplied.calculate(service);
          this.summary_result.domestic_hot_water_electricity_consumed_by_hp_including.calculate(service);
          this.summary_result.proportion_of_space_heating_and_water_heating_demand.calculate(service);
          this.summary_result.renewable_heat.calculate(service);
          this.summary_result.proportions_electricity_consumed_by_hp.calculate(service);
          this.summary_result.electricity_consumed_by_auxiliary_or_immersion_heaters.calculate(service);
          this.summary_result.hp_combined_performance_spf.calculate(service);
          this.summary_result.cost_of_electricity_for_hp.calculate(service);
          this.summary_result.ashp_cost_of_fuel_for_other_heat_sources.calculate(service);
        }
      },

      calculateAll: function () {
        this.calculate_domestic_hot_water();
        this.calculate_bivalent();
        this.calculate_ground_loop();
        this.calculate_fuel_compare();
        this.calculate_emitters();
        this.calculate_heat_loss();
        this.calculate_kilowatt_hours();
        this.calculate_total_power_watts();
        this.calculate_total_energy_kilowatts();
        this.calculate_spf();
        this.calculate_summary_results();
      }
    };

    return service;
  }
})();

// =AND(
// ISNUMBER('Software view'!calcRadiatorsCharsOutput),
// ISNUMBER('Software view'!calcRadiatorsWordsOutput),
// ISNUMBER('Software view'!calcCastIronRadiatorsOutput)
// ) 'Software view'!calcRadiatorsCharsOutput 'Software view'!calcRadiatorsWordsOutput

// =ISNUMBER('Software view'!calcRadiatorsWordsTypeMatch) 'Software view'!calcRadiatorsWordsTypeMatch>0 ISNUMBER(INDEX(tblRadiatorsWords,'Software view'!calcRadiatorsWordsTypeMatch+1,MATCH('Software view'!$D10,INDEX(tblRadiatorsWords,1,),FALSE)))

// =IF(TRIM('Software view'!$C10)="","",IFERROR(MATCH('Software view'!$C10,arrRadiatorsWords,FALSE),0))

// ='Radiator data'!$A$14
