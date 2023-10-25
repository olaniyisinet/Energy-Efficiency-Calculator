(function () {
  'use strict';

  function surveyService (apiService, $q, log) {

    var get = function () {
      var deferred = $q.defer();

      apiService.surveys.query(function (response) {
        deferred.resolve(response);
      }, function (error) {
        deferred.reject(error);
      });
      return deferred.promise;
    };

    var getAll = async function (query) {
      var deferred = $q.defer();
      await apiService.getAll('surveysAll', query).then(function (response) {
        deferred.resolve(response);
      }, function (error) {
        deferred.reject(error);
      });
      return deferred.promise;
    };

    var getById = async function (query) {
      var deferred = $q.defer();
      await apiService.get('surveys', query).then(function (response) {
        deferred.resolve(response);
      }, function (error) {
        deferred.reject(error);
      });
      return deferred.promise;
    };
    var getAllByManufacturer = async function (query) {
      var deferred = $q.defer();
      await apiService.getAll('surveysByManufacturer', query).then(function (response) {
        deferred.resolve(response);
      }, function (error) {
        deferred.reject(error);
      });
      return deferred.promise;
    };


    var getSendBackByManufacturer = async function (query) {
      var deferred = $q.defer();
      await apiService.getAll('surveyBySendBack', query).then(function (response) {
        deferred.resolve(response);
      }, function (error) {
        deferred.reject(error);
      });
      return deferred.promise;
    };

    var getComment = async function (query) {
      var deferred = $q.defer();

      await apiService.getAll('surveysComments', query).then(function (response) {
        deferred.resolve(response);
      }, function (error) {
        deferred.reject(error);
      });
      return deferred.promise;
    };

    var deleteEmptyRoom = function (surveyId, surveys, idx) {
      //get id
      // surveys.update({_id:surveyId}, { $unset: { 'surveys.rooms': idx } },
      //   function (response) {
      //     console.log("response:",response);
      //   },
      //   function (error) {
      //     console.log("error:",error);
      //   }
      // );
      // return deferred.promise;
      surveys.surveys.rooms.splice(idx, 1);

      apiService.update('surveys', surveys)
        .then(function (response) {
          console.log("RESPONSE", response);
        }, function (error) {
          console.log("RES ERROR", error);
        });

    }

    var highlightMinMax = function (rooms) {

      // floor Area
      let floorArea_minMax = { minIdx: -1, maxIdx: -1 }
      let floorArea_maxValue = 0;
      let floorArea_initValIdx = getInitialMinValue(rooms, 'floor_area')
      let floorArea_minValue = floorArea_initValIdx.value;

      // room height
      let roomHeight_minMax = { minIdx: -1, maxIdx: -1 }
      let roomHeight_maxValue = 0;
      let roomHeight_initValIdx = getInitialMinValue(rooms, 'room_height');
      let roomHeight_minValue = roomHeight_initValIdx.value;

      // external wall type A
      let exWallA_minMax = { minIdx: -1, maxIdx: -1 }
      let exWallA_maxValue = 0;
      let exWallA_initValIdx = getInitialMinValue(rooms, 'external_wall.type.a.length');
      let exWallA_minValue = exWallA_initValIdx.value;

      // external wall type B
      let exWallB_minMax = { minIdx: -1, maxIdx: -1 }
      let exWallB_maxValue = 0;
      let exWallB_initValIdx = getInitialMinValue(rooms, 'external_wall.type.b.length');
      let exWallB_minValue = exWallB_initValIdx.value;

      // window type A
      let winA_minMax = { minIdx: -1, maxIdx: -1 }
      let winA_maxValue = 0;
      let winA_initValIdx = getInitialMinValue(rooms, 'external_wall.type.a.window_area');
      let winA_minValue = winA_initValIdx.value;

      // window type B
      let winB_minMax = { minIdx: -1, maxIdx: -1 }
      let winB_maxValue = 0;
      let winB_initValIdx = getInitialMinValue(rooms, 'external_wall.type.b.window_area');
      let winB_minValue = winB_initValIdx.value;

      // internal wall
      let intWall_minMax = { minIdx: -1, maxIdx: -1 }
      let intWall_maxValue = 0;
      let intWall_initValIdx = getInitialMinValue(rooms, 'internal_wall_length');
      let intWall_minValue = intWall_initValIdx.value;

      // party wall
      let partyWall_minMax = { minIdx: -1, maxIdx: -1 }
      let partyWall_maxValue = 0;
      let partyWall_initValIdx = getInitialMinValue(rooms, 'party_wall_length');
      let partyWall_minValue = partyWall_initValIdx.value;

      // door
      let exdoor_minMax = { minIdx: -1, maxIdx: -1 }
      let exdoor_maxValue = 0;
      let exdoor_initValIdx = getInitialMinValue(rooms, 'external_door_area');
      let exdoor_minValue = exdoor_initValIdx.value;

      // roof
      let roof_minMax = { minIdx: -1, maxIdx: -1 }
      let roof_maxValue = 0;
      let roof_initValIdx = getInitialMinValue(rooms, 'roof_glazing_area');
      let roof_minValue = roof_initValIdx.value;

      rooms.forEach((room, idx) => {
        // floor area
        // floor area min
        //if(room.is_the_room_complex != 'YES') {
        //initializing highlights
        rooms[idx].floorAreaMin = false;
        rooms[idx].floorAreaMax = false;
        rooms[idx].roomHeightMin = false;
        rooms[idx].roomHeightMax = false;
        rooms[idx].exWallAMin = false;
        rooms[idx].exWallAMax = false;
        rooms[idx].exWallBMin = false;
        rooms[idx].exWallBMax = false;
        rooms[idx].winAMin = false;
        rooms[idx].winAMax = false;
        rooms[idx].winBMin = false;
        rooms[idx].winBMax = false;
        rooms[idx].intWallMin = false;
        rooms[idx].intWallMax = false;
        rooms[idx].partyWallMin = false;
        rooms[idx].partyWallMax = false;
        rooms[idx].exdoorMin = false;
        rooms[idx].exdoorMax = false;
        rooms[idx].roofMin = false;
        rooms[idx].roofMax = false;

        // floor area
        // floor area min
        if (room.floor_area != null && room.floor_area != 0 && room.floor_area < floorArea_minValue) {
          floorArea_minMax.minIdx = idx;
          floorArea_minValue = room.floor_area;
        } else {
          if (floorArea_initValIdx.idx == idx) {
            floorArea_minMax.minIdx = idx;
          }
          rooms[idx].floorAreaMin = false;
        }
        // floorarea max
        if (room.floor_area > floorArea_maxValue) {
          floorArea_minMax.maxIdx = idx
          floorArea_maxValue = room.floor_area;
        } else {
          rooms[idx].floorAreaMax = false;
        }


        // room height
        // room height min
        if (room.room_height != null && room.room_height != 0 && room.room_height < roomHeight_minValue) {
          roomHeight_minMax.minIdx = idx;
          roomHeight_minValue = room.room_height;
        } else {
          if (roomHeight_initValIdx.idx == idx) {
            roomHeight_minMax.minIdx = idx;
          }
          rooms[idx].roomHeightMin = false;
        }

        // room height max
        if (room.room_height > roomHeight_maxValue) {
          roomHeight_minMax.maxIdx = idx
          roomHeight_maxValue = room.room_height;
        } else {
          rooms[idx].roomHeightMax = false;
        }


        // external wall type A
        // ex wallA min
        if (room.external_wall.type.a.length != null && room.external_wall.type.a.length != 0 && room.external_wall.type.a.length < exWallA_minValue) {
          exWallA_minMax.minIdx = idx;
          exWallA_minValue = room.external_wall.type.a.length;
        } else {
          if (exWallA_initValIdx.idx == idx) {
            exWallA_minMax.minIdx = idx;
          }
          rooms[idx].exWallAMin = false;
        }
        // ex wallA max
        if (room.external_wall.type.a.length > exWallA_maxValue) {
          exWallA_minMax.maxIdx = idx
          exWallA_maxValue = room.external_wall.type.a.length;
        } else {
          rooms[idx].exWallAMax = false;
        }


        // external wall type B
        // ex wallB min
        if (room.external_wall.type.b.length != null && room.external_wall.type.b.length != 0 && room.external_wall.type.b.length < exWallB_minValue) {
          exWallB_minMax.minIdx = idx;
          exWallB_minValue = room.external_wall.type.b.length;
        } else {
          if (exWallB_initValIdx.idx == idx) {
            exWallB_minMax.minIdx = idx;
          }
          rooms[idx].exWallBMin = false;
        }
        // ex wallB max
        if (room.external_wall.type.b.length > exWallB_maxValue) {
          exWallB_minMax.maxIdx = idx
          exWallB_maxValue = room.external_wall.type.b.length;
        } else {
          rooms[idx].exWallBMax = false;
        }

        // window type A
        // ex window A min
        if (room.external_wall.type.a.window_area != null && room.external_wall.type.a.window_area != 0 && room.external_wall.type.a.window_area < winA_minValue) {
          winA_minMax.minIdx = idx;
          winA_minValue = room.external_wall.type.a.window_area;
        } else {
          if (winA_initValIdx.idx == idx) {
            winA_minMax.minIdx = idx;
          }
          rooms[idx].winAMin = false;
        }
        // ex window A max
        if (room.external_wall.type.a.window_area > winA_maxValue) {
          winA_minMax.maxIdx = idx
          winA_maxValue = room.external_wall.type.a.window_area;
        } else {
          rooms[idx].winAMax = false;
        }

        // window type B
        // ex window B min
        if (room.external_wall.type.b.window_area != null && room.external_wall.type.b.window_area != 0 && room.external_wall.type.b.window_area < winB_minValue) {
          winB_minMax.minIdx = idx;
          winB_minValue = room.external_wall.type.b.window_area;
        } else {
          if (winB_initValIdx.idx == idx) {
            winB_minMax.minIdx = idx;
          }
          rooms[idx].winBMin = false;
        }
        // ex window B max
        if (room.external_wall.type.b.window_area > winB_maxValue) {
          winB_minMax.maxIdx = idx
          winB_maxValue = room.external_wall.type.b.window_area;
        } else {
          rooms[idx].winBMax = false;
        }

        // internal wall
        // internal wall min
        if (room.internal_wall_length != null && room.internal_wall_length != 0 && room.internal_wall_length < intWall_minValue) {
          intWall_minMax.minIdx = idx;
          intWall_minValue = room.internal_wall_length;
        } else {
          if (intWall_initValIdx.idx == idx) {
            intWall_minMax.minIdx = idx;
          }
          rooms[idx].intWallMin = false;
        }
        // internal wall max
        if (room.internal_wall_length > intWall_maxValue) {
          intWall_minMax.maxIdx = idx
          intWall_maxValue = room.internal_wall_length;
        } else {
          rooms[idx].intWallMax = false;
        }

        // party wall
        // party wall min
        if (room.party_wall_length != null && room.party_wall_length != 0 && room.party_wall_length < partyWall_minValue) {
          partyWall_minMax.minIdx = idx;
          partyWall_minValue = room.party_wall_length;
        } else {
          if (partyWall_initValIdx.idx == idx) {
            partyWall_minMax.minIdx = idx;
          }
          rooms[idx].partyWallMin = false;
        }
        // party wall max
        if (room.party_wall_length > partyWall_maxValue) {
          partyWall_minMax.maxIdx = idx
          partyWall_maxValue = room.party_wall_length;
        } else {
          rooms[idx].partyWallMax = false;
        }

        // door
        // door min
        if (room.external_door_area != null && room.external_door_area != 0 && room.external_door_area < exdoor_minValue) {
          exdoor_minMax.minIdx = idx;
          exdoor_minValue = room.external_door_area;
        } else {
          if (exdoor_initValIdx.idx == idx) {
            exdoor_minMax.minIdx = idx;
          }
          rooms[idx].exdoorMin = false;
        }
        // door max
        if (room.external_door_area > exdoor_maxValue) {
          exdoor_minMax.maxIdx = idx
          exdoor_maxValue = room.external_door_area;
        } else {
          rooms[idx].exDoorMax = false;
        }

        // roof
        // roof min
        if (room.roof_glazing_area != null && room.roof_glazing_area != 0 && room.roof_glazing_area < roof_minValue) {
          roof_minMax.minIdx = idx;
          roof_minValue = room.roof_glazing_area;
        } else {
          if (roof_initValIdx.idx == idx) {
            roof_minMax.minIdx = idx;
          }
          rooms[idx].roofMin = false;
        }
        // roof max
        if (room.roof_glazing_area > roof_maxValue) {
          roof_minMax.maxIdx = idx
          roof_maxValue = room.roof_glazing_area;
        } else {
          rooms[idx].roofMax = false;
        }

      });

      let minMax = [];
      // floor area
      //floorArea_minMax.minIdx > 0 ? rooms[floorArea_initValIdx.idx].floorAreaMin = false : '';
      floorArea_minMax.minIdx > -1 ? rooms[floorArea_minMax.minIdx].floorAreaMin = true : '';
      floorArea_minMax.maxIdx > -1 ? rooms[floorArea_minMax.maxIdx].floorAreaMax = true : '';
      minMax.push({ field: 'floor_area', minMax: floorArea_minMax });

      // room height
      //roomHeight_minMax.minIdx > 0 ? rooms[roomHeight_initValIdx.idx].roomHeightMin = false: '';
      roomHeight_minMax.minIdx > -1 ? rooms[roomHeight_minMax.minIdx].roomHeightMin = true : '';
      roomHeight_minMax.maxIdx > -1 ? rooms[roomHeight_minMax.maxIdx].roomHeightMax = true : '';
      minMax.push({ field: 'room_height', minMax: roomHeight_minMax });

      // external wall type a
      exWallA_minMax.minIdx > -1 ? rooms[exWallA_minMax.minIdx].exWallAMin = true : '';
      exWallA_minMax.maxIdx > -1 ? rooms[exWallA_minMax.maxIdx].exWallAMax = true : '';
      minMax.push({ field: 'external_wall.type.a.length', minMax: exWallA_minMax });

      // external wall type b
      exWallB_minMax.minIdx > -1 ? rooms[exWallB_minMax.minIdx].exWallBMin = true : '';
      exWallB_minMax.maxIdx > -1 ? rooms[exWallB_minMax.maxIdx].exWallBMax = true : '';
      minMax.push({ field: 'external_wall.type.b.length', minMax: exWallB_minMax });

      // window type a
      winA_minMax.minIdx > -1 ? rooms[winA_minMax.minIdx].winAMin = true : '';
      winA_minMax.maxIdx > -1 ? rooms[winA_minMax.maxIdx].winAMax = true : '';
      minMax.push({ field: 'external_wall.type.a.window_area', minMax: winA_minMax });

      // window type b
      winB_minMax.minIdx > -1 ? rooms[winB_minMax.minIdx].winBMin = true : '';
      winB_minMax.maxIdx > -1 ? rooms[winB_minMax.maxIdx].winBMax = true : '';
      minMax.push({ field: 'external_wall.type.b.window_area', minMax: winB_minMax });

      // internal wall
      intWall_minMax.minIdx > -1 ? rooms[intWall_minMax.minIdx].intWallMin = true : '';
      intWall_minMax.maxIdx > -1 ? rooms[intWall_minMax.maxIdx].intWallMax = true : '';
      minMax.push({ field: 'internal_wall_length', minMax: intWall_minMax });

      // party wall
      partyWall_minMax.minIdx > -1 ? rooms[partyWall_minMax.minIdx].partyWallMin = true : '';
      partyWall_minMax.maxIdx > -1 ? rooms[partyWall_minMax.maxIdx].partyWallMax = true : '';
      minMax.push({ field: 'party_wall_length', minMax: partyWall_minMax });

      // door
      exdoor_minMax.minIdx > -1 ? rooms[exdoor_minMax.minIdx].exdoorMin = true : '';
      exdoor_minMax.maxIdx > -1 ? rooms[exdoor_minMax.maxIdx].exdoorMax = true : '';
      minMax.push({ field: 'external_door_area', minMax: exdoor_minMax });

      // roof
      roof_minMax.minIdx > -1 ? rooms[roof_minMax.minIdx].roofMin = true : '';
      roof_minMax.maxIdx > -1 ? rooms[roof_minMax.maxIdx].roofMax = true : '';
      minMax.push({ field: 'roof_glazing_area', minMax: roof_minMax });

      let obj = { rooms: rooms, minMax: minMax };
      return obj;

    }

    function getInitialMinValue (rooms, field) {
      let f = field.split('.');
      let a = rooms.findIndex(function (room) {
        if (f.length == 1) return room[f[0]] != 0;
        if (f.length == 4) return room[f[0]][f[1]][f[2]][f[3]] != 0;
      });
      if (a > -1) {
        let obj = {
          value: 0,
          idx: -1
        };
        if (f.length == 1) {
          obj.value = rooms[a][f[0]];
          obj.idx = a;
        }
        if (f.length == 4) {

          obj.value = rooms[a][f[0]][f[1]][f[2]][f[3]];
          obj.idx = a;
        }
        return obj;
      }
      let obj = { value: 0, idx: -1 }
      return obj
    }

    return {
      get: get,
      deleteEmptyRoom: deleteEmptyRoom,
      getAll: getAll,
      getAllByManufacturer: getAllByManufacturer,
      getSendBackByManufacturer: getSendBackByManufacturer,
      getComment: getComment,
      highlightMinMax: highlightMinMax,
      getById,
    }
  }

  angular.module('cloudheatengineer').factory('surveyService', ['apiService', '$q', 'log', surveyService]);
}());
