(function() {
    'use strict';

    angular
        .module('cloudheatengineer')
        .factory('summaryHelperService', summaryHelperService);

    /**
     * @module cloudheatengineer
     * @service summary helper service
     * @type factory
     * @dependencies $inject
     */
    summaryHelperService.$inject = ['$rootScope', '$q', 'apiService', 'alertService', '_'];

    function summaryHelperService($rootScope, $q, apiService, alertService, _) {
        var service = {};
        var deferred;

        /**
         * @function error handler
         * @param json
         */
        var onError = function(error) {
            alertService('danger', 'Something went wrong :(', error.message);
            deferred.reject(error);
        };


        /** Public methods */

        /***
         * @method switch and update survey
         * @desc this method will switch pages and updating data.
         * @param direction
         * @param location
         * @param survey
         * @param page
         * @returns {*}
         */
        service.switchAndUpdateSurvey = function(direction, location, survey, page, valueChanged) {
            var resolved = {};
            deferred = $q.defer();
            if(valueChanged) {
            apiService.update('surveys', survey).then(function(response) {
                if (!!location)
                    deferred.resolve(response);
                else {
                    if (!!direction) {
                        if (direction === 'forward')
                            page = page + 1;
                        else
                            page = page - 1;
                    }
                }

                resolved.survey = response;
                resolved.page = page;

                deferred.resolve(resolved);
            }, onError);
        } else {
            if (!!direction) {
                if (direction === 'forward')
                    page = page + 1;
                else
                    page = page - 1;
            }
            resolved.page = page;
            resolved.survey = survey;
            deferred.resolve(resolved);
        }

            return deferred.promise;
        };



        service.populateAirChangesPerHour = function(idx, room, survey) {

            var mvhr_value = survey.surveys.mvhr_value;
            var has_mvhr = survey.surveys.has_mvhr;

            var mvhr = 0;

            if (has_mvhr == 'YES')
                mvhr = (1 - (mvhr_value / 100));
            else
                mvhr = 1;

            if (room.isAdjust) {
                // just ignore
            } else if (room.is_there_a_fireplace == 'YES' && room.has_throat_restrictor == 'YES' && room.floor_area < 55)
                survey.surveys.rooms[idx].air_changes_per_hour = parseFloat((3 * mvhr).toFixed(2));
            else if (room.is_there_a_fireplace == 'YES' && room.has_throat_restrictor == 'NO' && room.floor_area < 55)
                survey.surveys.rooms[idx].air_changes_per_hour = parseFloat((5 * mvhr).toFixed(2));
            else if (room.is_there_a_fireplace == 'YES' && room.has_throat_restrictor == 'YES' && room.floor_area > 55)
                survey.surveys.rooms[idx].air_changes_per_hour = parseFloat((2 * mvhr).toFixed(2));
            else if (room.is_there_a_fireplace == 'YES' && room.has_throat_restrictor == 'NO' && room.floor_area > 55)
                survey.surveys.rooms[idx].air_changes_per_hour = parseFloat((4 * mvhr).toFixed(2));
            else {
                if (!!room.is_custom_room_defined && !!room.given_air_changes_per_hour) {
                    var uf_item = {};

                    // if (!!survey.surveys.rooms[idx].is_custom_values_defined) {
                    //     // do nothing
                    // } else {

                        angular.forEach($rootScope.cloud_data.custom_uf_heating_temps, function(item, idx2) {
                            if (survey.surveys.rooms[idx].room_type == idx2)
                                uf_item = item;
                        });

                        if(!room.isAdjustCustomTemp) {
                            if (survey.surveys.rooms[idx].room_built >= 2000)
                                survey.surveys.rooms[idx].designed_temperature = uf_item.temp[0];
                            else if (survey.surveys.rooms[idx].room_built < 2000)
                                survey.surveys.rooms[idx].designed_temperature = uf_item.temp[1];
                        }

                        if (survey.surveys.rooms[idx].room_built >= 2006)
                            survey.surveys.rooms[idx].given_air_changes_per_hour = uf_item.air[0];
                        else if (survey.surveys.rooms[idx].room_built >= 2000 && survey.surveys.rooms[idx].room_built < 2006)
                            survey.surveys.rooms[idx].given_air_changes_per_hour = uf_item.air[1];
                        else if (survey.surveys.rooms[idx].room_built < 2000)
                            survey.surveys.rooms[idx].given_air_changes_per_hour = uf_item.air[2];
                    //}
                    survey.surveys.rooms[idx].air_changes_per_hour = parseFloat((survey.surveys.rooms[idx].given_air_changes_per_hour * mvhr).toFixed(2));
                } else if (room.room_built >= 2000 && room.room_built <= 2005)
                    survey.surveys.rooms[idx].air_changes_per_hour = parseFloat(($rootScope.cloud_data.uf_heating_temps[room.room_name].air[2] * mvhr).toFixed(2));
                else if (room.room_built >= 2006)
                    survey.surveys.rooms[idx].air_changes_per_hour = parseFloat(($rootScope.cloud_data.uf_heating_temps[room.room_name].air[1] * mvhr).toFixed(2));
                else
                    survey.surveys.rooms[idx].air_changes_per_hour = parseFloat(($rootScope.cloud_data.uf_heating_temps[room.room_name].air[0] * mvhr).toFixed(2));
            }

            return survey;
        };

        service.populateDesignTemperature = function(idx, room, survey) {

            // if (room.isAdjust) {
            //   // just ignore
            // }
            // else
            if (room.isAdjustCustomTemp) {
                // do nothing
            } else if (!!room.is_custom_room_defined && !!room.designed_temperature) {
                // do nothing
            } else if (room.room_built >= 2000)
                survey.surveys.rooms[idx].designed_temperature = $rootScope.cloud_data.uf_heating_temps[room.room_name].temp[2];
            else {
                if (survey.surveys.rooms[idx].emitter_type) {
                    if (survey.surveys.rooms[idx].emitter_type === 'Underfloor Heating')
                        survey.surveys.rooms[idx].designed_temperature = $rootScope.cloud_data.uf_heating_temps[room.room_name].temp[1];
                    else
                        survey.surveys.rooms[idx].designed_temperature = $rootScope.cloud_data.uf_heating_temps[room.room_name].temp[0];
                }
            }

            return survey;
        };

        service.computeAverageDesignTemperature = function(survey) {
            angular.forEach(survey.surveys.rooms, function(room) {
                survey.surveys.average_designed_temperature += parseInt(room.designed_temperature);
            });
            survey.surveys.average_designed_temperature = survey.surveys.average_designed_temperature / survey.surveys.rooms.length;
            return survey;
        };

        service.getCurrentRadWatts = function(idx, room, survey) {
            if (!!room.radiators) {
                survey.surveys.rooms[idx].hasRads = true;
                survey.surveys.rooms[idx].output_for_mwt = 0;
                survey.surveys.rooms[idx].total_flow = [0, 0, 0, 0, 0, 0];
                _.each(room.radiators, function(item, key) {

                    if (!!item) {
                        if (item.type && item.height && item.length) {
                            var flowTemperature = [35, 40, 45, 50, 55, 60];
                            var lessTemp = 0;
                            var conversionFactor = 0;
                            var outputWatts = 0;
                            var radiators = $rootScope.cloud_data.radiators;
                            var height = item.height;
                            var length = item.length;
                            var type = item.type;

                            // temp
                            //if (room.room_name == 'Dressing Room')
                            //  room.designed_temperature = 18;
                            //else if (room.room_name == 'En Suite')
                            //  room.designed_temperature = 21;

                            var radiator = _.find(radiators, function(rad) {
                                return rad.type == type;
                            });

                            survey.surveys.rooms[idx].radiators[key].flow_output = [];

                            if (radiator) {
                                _.each(radiator.heights, function(rad_height, rad_idx) {
                                    if (rad_height == height)
                                        outputWatts = radiator.watts[rad_idx];
                                });

                                if (radiator.section_length == 'N/A')
                                    survey.surveys.rooms[idx].radiators[key].watts = Math.round((length / 100) * outputWatts);
                                else
                                    survey.surveys.rooms[idx].radiators[key].watts = Math.round((length / radiator.section_length) * outputWatts);

                                _.each(flowTemperature, function(temp, temp_idx) {

                                    lessTemp = temp - (room.designed_temperature);
                                    conversionFactor = Math.pow((lessTemp / 50), 1.3);
                                    survey.surveys.rooms[idx].radiators[key].flow_output[temp_idx] = Math.round(survey.surveys.rooms[idx].radiators[key].watts * conversionFactor);
                                    survey.surveys.rooms[idx].total_flow[temp_idx] += survey.surveys.rooms[idx].radiators[key].flow_output[temp_idx];
                                });

                                survey.surveys.rooms[idx].output_for_mwt += survey.surveys.rooms[idx].radiators[key].watts;
                                _.each(survey.surveys.rooms, function(proom, idx1){
                                    if (proom.room_id === survey.surveys.rooms[idx].room_partner_id)
                                    {
                                        proom.partner_output_for_mwt = survey.surveys.rooms[idx].output_for_mwt;
                                    }
                                });
                            } else {

                                _.each(flowTemperature, function(temp, temp_idx) {

                                    lessTemp = temp - (room.designed_temperature);
                                    conversionFactor = Math.pow((lessTemp / 50), 1.3);
                                    survey.surveys.rooms[idx].radiators[key].flow_output[temp_idx] = Math.round(survey.surveys.rooms[idx].radiators[key].watts * conversionFactor);
                                    survey.surveys.rooms[idx].total_flow[temp_idx] += survey.surveys.rooms[idx].radiators[key].flow_output[temp_idx];
                                });

                                survey.surveys.rooms[idx].output_for_mwt += survey.surveys.rooms[idx].radiators[key].watts;
                                _.each(survey.surveys.rooms, function(proom, idx1){
                                    if (proom.room_id === survey.surveys.rooms[idx].room_partner_id)
                                    {
                                        proom.partner_output_for_mwt = survey.surveys.rooms[idx].output_for_mwt;
                                    }
                                });
                            }
                        }
                    }


                });

                calculateCustomMWT(survey);
            }

            return survey;
        };

        service.getNewRadWatts = function(idx, room, survey) {
            if (!!room.new_radiators) {
                survey.surveys.rooms[idx].new_rad_output_for_mwt = 0;
                survey.surveys.rooms[idx].new_rad_total_flow = [0, 0, 0, 0, 0, 0];
                _.each(room.new_radiators, function(item, key) {

                    if (!!item) {
                        if (item.type && item.height && item.length) {
                            var flowTemperature = [35, 40, 45, 50, 55, 60];
                            var lessTemp = 0;
                            var conversionFactor = 0;
                            var outputWatts = 0;
                            var new_radiators = $rootScope.cloud_data.radiators;
                            var height = item.height;
                            var length = item.length;
                            var type = item.type;
                            var radiator = _.find(new_radiators, function(rad) {
                                return rad.type == type;
                            });

                            survey.surveys.rooms[idx].new_radiators[key].flow_output = [];

                            if (radiator) {
                                _.each(radiator.heights, function(rad_height, rad_idx) {
                                    if (rad_height == height)
                                        outputWatts = radiator.watts[rad_idx];
                                });

                                if (radiator.section_length == 'N/A')
                                    survey.surveys.rooms[idx].new_radiators[key].watts = Math.round((length / 100) * outputWatts);
                                else
                                    survey.surveys.rooms[idx].new_radiators[key].watts = Math.round((length / radiator.section_length) * outputWatts);

                                _.each(flowTemperature, function(temp, temp_idx) {

                                    lessTemp = temp - (room.designed_temperature);
                                    conversionFactor = Math.pow((lessTemp / 50), 1.3);
                                    survey.surveys.rooms[idx].new_radiators[key].flow_output[temp_idx] = Math.round(survey.surveys.rooms[idx].new_radiators[key].watts * conversionFactor);
                                    survey.surveys.rooms[idx].new_rad_total_flow[temp_idx] += survey.surveys.rooms[idx].new_radiators[key].flow_output[temp_idx];
                                });

                                survey.surveys.rooms[idx].new_rad_output_for_mwt += survey.surveys.rooms[idx].new_radiators[key].watts;
                                _.each(survey.surveys.rooms, function(proom, idx1){
                                    if (proom.room_id === survey.surveys.rooms[idx].room_partner_id)
                                    {
                                        proom.partner_output_for_mwt = survey.surveys.rooms[idx].new_rad_output_for_mwt;
                                    }
                                });
                            } else {

                                _.each(flowTemperature, function(temp, temp_idx) {

                                    lessTemp = temp - (room.designed_temperature);
                                    conversionFactor = Math.pow((lessTemp / 50), 1.3);
                                    survey.surveys.rooms[idx].new_radiators[key].flow_output[temp_idx] = Math.round(survey.surveys.rooms[idx].new_radiators[key].watts * conversionFactor);
                                    survey.surveys.rooms[idx].new_rad_total_flow[temp_idx] += survey.surveys.rooms[idx].new_radiators[key].flow_output[temp_idx];
                                });

                                survey.surveys.rooms[idx].new_rad_output_for_mwt += survey.surveys.rooms[idx].new_radiators[key].watts;
                                _.each(survey.surveys.rooms, function(proom, idx1){
                                    if (proom.room_id === survey.surveys.rooms[idx].room_partner_id)
                                    {
                                        proom.partner_output_for_mwt = survey.surveys.rooms[idx].new_rad_output_for_mwt;
                                    }
                                });
                            }
                        }
                    }
                });
                calculateCustomMWTForNewRads(survey)
            }
            return survey;
        };
       function calculateCustomMWT(survey){

          for (let a = 0; a < survey.surveys.rooms.length; a++) {
            var mwt_at = survey.surveys.custom_MWT-survey.surveys.rooms[a].designed_temperature
            var conversion_factor = Math.pow((mwt_at/survey.surveys.new_rad_deltaT_catalogue), 1.3);
            var custom_MWT_total = 0
            survey.surveys.rooms[a].MWT_AT = mwt_at
            survey.surveys.rooms[a].rad_conversion_factor = conversion_factor.toFixed(3)

            if(survey.surveys.rooms[a].radiators?.one && survey.surveys.rooms[a].radiators?.one.watts){
              survey.surveys.rooms[a].radiators['one'].custom_defined_MWT = (survey.surveys.rooms[a].radiators['one'].watts * conversion_factor).toFixed(0)
              custom_MWT_total += parseInt(survey.surveys.rooms[a].radiators['one'].custom_defined_MWT)
            }
            if(survey.surveys.rooms[a].radiators?.two && survey.surveys.rooms[a].radiators?.two.watts){
              survey.surveys.rooms[a].radiators['two'].custom_defined_MWT = (survey.surveys.rooms[a].radiators['two'].watts * conversion_factor).toFixed(0)
              custom_MWT_total += parseInt(survey.surveys.rooms[a].radiators['two'].custom_defined_MWT)
            }
            if(survey.surveys.rooms[a].radiators?.three && survey.surveys.rooms[a].radiators?.three.watts){
              survey.surveys.rooms[a].radiators['three'].custom_defined_MWT = (survey.surveys.rooms[a].radiators['three'].watts * conversion_factor).toFixed(0)
              custom_MWT_total += parseInt(survey.surveys.rooms[a].radiators['three'].custom_defined_MWT)
            }
            if(survey.surveys.rooms[a].radiators?.four && survey.surveys.rooms[a].radiators?.four.watts){
                survey.surveys.rooms[a].radiators['four'].custom_defined_MWT = (survey.surveys.rooms[a].radiators['four'].watts * conversion_factor).toFixed(0)
                custom_MWT_total += parseInt(survey.surveys.rooms[a].radiators['four'].custom_defined_MWT)
            }
            if(survey.surveys.rooms[a].radiators?.five && survey.surveys.rooms[a].radiators?.five.watts){
                survey.surveys.rooms[a].radiators['five'].custom_defined_MWT = (survey.surveys.rooms[a].radiators['five'].watts * conversion_factor).toFixed(0)
                custom_MWT_total += parseInt(survey.surveys.rooms[a].radiators['five'].custom_defined_MWT)
            }
            if(survey.surveys.rooms[a].radiators?.six && survey.surveys.rooms[a].radiators?.six.watts){
                survey.surveys.rooms[a].radiators['six'].custom_defined_MWT = (survey.surveys.rooms[a].radiators['six'].watts * conversion_factor).toFixed(0)
                custom_MWT_total += parseInt(survey.surveys.rooms[a].radiators['six'].custom_defined_MWT)
            }
             survey.surveys.rooms[a].custom_MWT_total = custom_MWT_total
          }

       }

       function calculateCustomMWTForNewRads(survey){

        for (let a = 0; a < survey.surveys.rooms.length; a++) {
          var mwt_at = survey.surveys.custom_MWT-survey.surveys.rooms[a].designed_temperature
          var conversion_factor = Math.pow((mwt_at/survey.surveys.new_rad_deltaT_catalogue), 1.3);
          var custom_MWT_total = 0
          survey.surveys.rooms[a].new_MWT_AT = mwt_at
          survey.surveys.rooms[a].new_rad_conversion_factor = conversion_factor.toFixed(3)

          if(survey.surveys.rooms[a].new_radiators?.one && survey.surveys.rooms[a].new_radiators?.one.watts){
            survey.surveys.rooms[a].new_radiators['one'].custom_defined_MWT = (survey.surveys.rooms[a].new_radiators['one'].watts * conversion_factor).toFixed(0)
            custom_MWT_total += parseInt(survey.surveys.rooms[a].new_radiators['one'].custom_defined_MWT)
          }
          if(survey.surveys.rooms[a].new_radiators?.two && survey.surveys.rooms[a].new_radiators?.two.watts){
            survey.surveys.rooms[a].new_radiators['two'].custom_defined_MWT = (survey.surveys.rooms[a].new_radiators['two'].watts * conversion_factor).toFixed(0)
            custom_MWT_total += parseInt(survey.surveys.rooms[a].new_radiators['two'].custom_defined_MWT)
          }
          if(survey.surveys.rooms[a].new_radiators?.three && survey.surveys.rooms[a].new_radiators?.three.watts){
            survey.surveys.rooms[a].new_radiators['three'].custom_defined_MWT = (survey.surveys.rooms[a].new_radiators['three'].watts * conversion_factor).toFixed(0)
            custom_MWT_total += parseInt(survey.surveys.rooms[a].new_radiators['three'].custom_defined_MWT)
          }
          if(survey.surveys.rooms[a].new_radiators?.four && survey.surveys.rooms[a].new_radiators?.four.watts){
              survey.surveys.rooms[a].new_radiators['four'].custom_defined_MWT = (survey.surveys.rooms[a].new_radiators['four'].watts * conversion_factor).toFixed(0)
              custom_MWT_total += parseInt(survey.surveys.rooms[a].new_radiators['four'].custom_defined_MWT)
          }
          if(survey.surveys.rooms[a].new_radiators?.five && survey.surveys.rooms[a].new_radiators?.five.watts){
              survey.surveys.rooms[a].new_radiators['five'].custom_defined_MWT = (survey.surveys.rooms[a].new_radiators['five'].watts * conversion_factor).toFixed(0)
              custom_MWT_total += parseInt(survey.surveys.rooms[a].new_radiators['five'].custom_defined_MWT)
          }
          if(survey.surveys.rooms[a].new_radiators?.six && survey.surveys.rooms[a].new_radiators?.six.watts){
              survey.surveys.rooms[a].new_radiators['six'].custom_defined_MWT = (survey.surveys.rooms[a].new_radiators['six'].watts * conversion_factor).toFixed(0)
              custom_MWT_total += parseInt(survey.surveys.rooms[a].new_radiators['six'].custom_defined_MWT)
          }
           survey.surveys.rooms[a].new_custom_MWT_total = custom_MWT_total
        }

     }

        service.consoidateOutPutForMVTForSplitRoom = function(survey) {
            _.each(survey.surveys.rooms, function(room, idx){
                if (room.partner_output_for_mwt > 0)
                {
                    room.output_for_mwt = room.output_for_mwt + room.partner_output_for_mwt
                }
            });
            return survey;
        };

        service.resetCurrentRadWatts = function(survey) {
            _.each(survey.surveys.rooms, function(room, idx){
                room.output_for_mwt = 0;
                room.partner_output_for_mwt = 0;
            });
            return survey;
        };

        service.currentRadWatts = function(idx, room, survey) {

            if (!!room.radiators) {
                survey.surveys.rooms[idx].output_for_mwt = 0;
                survey.surveys.rooms[idx].total_flow = [0, 0, 0, 0, 0, 0];
                _.each(room.radiators, function(item, key) {

                    if (!!item) {
                        if (item.type && item.height && item.length) {
                            var flowTemperature = [35, 40, 45, 50, 55, 60];
                            var lessTemp = 0;
                            var conversionFactor = 0;
                            var outputWatts = 0;
                            var radiators = $rootScope.cloud_data.radiators;
                            var height = item.height;
                            var length = item.length;
                            var type = item.type;

                            // temp
                            //if (room.room_name == 'Dressing Room')
                            //  room.designed_temperature = 18;
                            //else if (room.room_name == 'En Suite')
                            //  room.designed_temperature = 21;

                            var radiator = _.find(radiators, function(rad) {
                                return rad.type == type;
                            });

                            survey.surveys.rooms[idx].radiators[key].flow_output = [];

                            if (radiator) {
                                _.each(radiator.heights, function(rad_height, rad_idx) {
                                    if (rad_height == height)
                                        outputWatts = radiator.watts[rad_idx];
                                });
                                if (outputWatts != 0) {
                                    if (radiator.section_length == 'N/A')
                                        survey.surveys.rooms[idx].radiators[key].watts = (((length / 100) * outputWatts) / 1000);
                                    else
                                        survey.surveys.rooms[idx].radiators[key].watts = (((length / radiator.section_length) * outputWatts) / 1000);
                                }



                                // survey.surveys.rooms[idx].radiators[key].massFlowRate = (parseFloat(survey.surveys.rooms[idx].radiators[key].watts / (parseFloat(survey.surveys.pipeSpecificHeatCapacity) * parseFloat(survey.surveys.rooms[idx].deltat)))).toFixed(3);
                                // survey.surveys.rooms[idx].radiators[key].pipeSelected = survey.surveys.rooms[idx].radiators[key].pipeSelected;





                                //     _.each(flowTemperature, function(temp, temp_idx) {

                                //         lessTemp = temp - (room.designed_temperature);
                                //         conversionFactor = Math.pow((lessTemp / 50), 1.3);
                                //         survey.surveys.rooms[idx].radiators[key].flow_output[temp_idx] = Math.round(survey.surveys.rooms[idx].radiators[key].watts * conversionFactor);
                                //         survey.surveys.rooms[idx].total_flow[temp_idx] += survey.surveys.rooms[idx].radiators[key].flow_output[temp_idx];
                                //     });

                                //     survey.surveys.rooms[idx].output_for_mwt += survey.surveys.rooms[idx].radiators[key].watts;
                                // } else {

                                //     _.each(flowTemperature, function(temp, temp_idx) {

                                //         lessTemp = temp - (room.designed_temperature);
                                //         conversionFactor = Math.pow((lessTemp / 50), 1.3);
                                //         survey.surveys.rooms[idx].radiators[key].flow_output[temp_idx] = Math.round(survey.surveys.rooms[idx].radiators[key].watts * conversionFactor);
                                //         survey.surveys.rooms[idx].total_flow[temp_idx] += survey.surveys.rooms[idx].radiators[key].flow_output[temp_idx];
                                //     });

                                //     survey.surveys.rooms[idx].output_for_mwt += survey.surveys.rooms[idx].radiators[key].watts;
                            }
                        }
                    }
                });
            }

            return survey;
        };

        service.moveAndUpdateSurvey = function(survey, location) {

        };

        return service;
    }
})();
