(function () {
  'use strict';

  function apiService ($resource, $q) {

    var deferred;
    var urls = {
      _resend: '/auth/_resend',
      _register: '/auth/_register',
      resend: '/auth/resend',
      counts: '/api/counts/:trainee',
      users: '/api/users/:_id',
      surveyors: '/api/surveyors/:_id',
      sharedFolder: '/api/sharedFolder/:_id',
      sharedFolderFile: '/api/sharedFolder/:_id/file/:file',
      sharedFolderMobileFile: '/api/sharedFolder/:_id/file/:file/mobile',
      sharedFolderQr: '/api/sharedFolder/qr/:_id',
      sharedFolderEmailToUsers: '/api/sharedFolder/:_id/emailToUsers',
      sharedFolders: '/api/sharedFolder',
      surveys: '/api/surveys/:_id',
      surveysComments: '/api/comments/:_id',
      surveysMulti: '/api/surveys/saveMultiSurvey/:_id',
      surveysAll: '/api/surveys/getAll',
      surveysByManufacturer: '/api/surveys/getAllByManufacturer',
      surveyUpdateByManufacturer: '/api/surveys/manufacturerSurvey',
      surveyBySendBack: '/api/surveys/getSendBackByManufacturer',
      manufacturerAll: '/users/allManufacturer',
      materials: '/api/materials',
      braintree: '/api/bttoken',
      checkCustom: "/api/customs/check-custom",
      customs: '/api/customs/:_id',
      customsin: '/api/customs/getin/:trainee',
      manufacturesin: '/api/manufactures/getin/:trainee',
      manufactures: '/api/manufactures/:_id',
      merchant: '/api/merchant/:_id',
      models: '/api/manufactures/models/:_id',
      modelsMerchant: '/api/merchant/models/:_id',
      getAllPremier: '/api/manufactures/getAllPremier/:_id',
      surveyorByIdNoAuth: '/users/surveyorById/:_id',
      // manufacturesByUserId: '/api/manufactures/getByUserId/:_id',
      requestToComplete: '/api/request-to-complete',
      createEstimator: '/api/heatlossestimates/',
      forum: '/api/forum/:_id',
      chat: '/api/forum/chat/:forum_id',
      events: '/api/events/:_id',
      // events: '/api/events/getnewevents',
      oldevents: '/api/events/getoldevents',
      eventsAll: '/api/events/getAll',
      surveyLogs: '/api/surveylogs/:_id',
      applog: '/api/applog/:_id',
      trainee: '/api/trainee/:_id',
      getAddressFromPostcode: '/api/get-address/address/:postcode',
      getDetailsFromId: '/api/get-address/detail/:id',
    };

    var onSuccess = function (response) {
      deferred.resolve(response);
    };
    var onError = function (error) {
      deferred.reject(error);
    };

    return {
      // APIs
      getAddressFromPostcode: $resource(urls.getAddressFromPostcode, {
        postcode: '@postcode'
      }, {
        get: {
          method: 'GET',
        },
      }),

      getDetailsFromId: $resource(urls.getDetailsFromId, {
        id: '@id'
      }, {
        get: {
          method: 'GET',
        },
      }),

      _resend: $resource(urls._resend, {}, {
        save: {
          method: 'POST'
        }
      }),
      _register: $resource(urls._register, {}, {
        save: {
          method: 'POST'
        }
      }),
      resend: $resource(urls.resend, {}, {
        save: {
          method: 'POST'
        }
      }),
      counts: $resource(urls.counts, {trainee: '@trainee'}, {
        query: {
          method: 'GET',
          isArray: false
        }
      }),
      users: $resource(urls.users, {
        _id: '@id'
      }, {
        query: {
          method: 'GET',
        },
        destroy: {
          method: 'DELETE'
        },
        update: {
          method: 'PUT'
        }
      }),
      getUserById: $resource('/api/users/getById/:_id', {
        _id: '@id'
      }, {
        get: {
          method: 'GET',
        },
      }),
      surveyors: $resource(urls.surveyors, {
        _id: '@id'
      }, {
        save: {
          method: 'POST'
        },
        query: {
          method: 'GET',
          isArray: true
        },
        destroy: {
          method: 'DELETE'
        }
      }),
      sharedFolder: $resource(urls.sharedFolder, {
        _id: '@id'
      }, {
        get: {
          method: 'GET'
        },
        update: {
          method: 'PUT'
        },
        query: {
          method: 'GET',
          isArray: true,
        },
      }),
      sharedFolderpub: $resource("../api/sharedFolder/pub/:_id", {
        _id: '@id'
      }, {
        get: {
          method: 'GET',
        },
      }),
      sharedFolderFile: $resource(urls.sharedFolderFile, {
        _id: '@id',
        file: '@file',
      }, {
        destroy: {
          method: 'DELETE'
        }
      }),
      sharedFolderMobileFile: $resource(urls.sharedFolderMobileFile, {
        _id: '@id',
        file: '@file',
      }, {
        destroy: {
          method: 'DELETE'
        }
      }),

      sharedFolderQr: $resource(urls.sharedFolderQr, {
        _id: '@id'
      }, {
        save: {
          method: 'POST',
        },
      }),

      sharedFolderEmailToUsers: $resource(urls.sharedFolderEmailToUsers, {
        _id: '@id'
      }, {
        save: {
          method: 'POST',
        },
      }),

      sharedFolders: $resource(urls.sharedFolders, {}, {
        query: {
          method: 'GET',
          isArray: true,
        },
      }),

      surveys: $resource(urls.surveys, {
        _id: '@id'
      }, {
        save: {
          method: 'POST'
        },
        get: {
          method: 'GET'
        },
        query: {
          method: 'GET',
          isArray: true
        },
        update: {
          method: 'PUT'
        },
        destroy: {
          method: 'DELETE'
        }
      }),
      surveysComments: $resource(urls.surveysComments, {
        _id: '@id'
      }, {
        save: {
          method: 'POST'
        },
        get: {
          method: 'GET',
          isArray: true
        },
        query: {
          method: 'GET',
          isArray: true
        },
        update: {
          method: 'PUT'
        },
        destroy: {
          method: 'DELETE'
        }
      }),
      surveysMulti: $resource(urls.surveysMulti, {
        _id: '@id'
      }, {
        save: {
          method: 'POST'
        },
        get: {
          method: 'GET'
        },
        query: {
          method: 'GET',
          isArray: true
        },
        update: {
          method: 'PUT'
        },
        destroy: {
          method: 'DELETE'
        }
      }),

      surveysAll: $resource(urls.surveysAll, {
        _id: '@id'
      }, {
        save: {
          method: 'POST'
        },
        get: {
          method: 'GET'
        },
        query: {
          method: 'GET'
        },
        update: {
          method: 'PUT'
        },
        destroy: {
          method: 'DELETE'
        },
        getAll: {
          method: 'GET'
        }
      }),
      surveysByManufacturer: $resource(urls.surveysByManufacturer, {
        _id: '@id'
      }, {
        save: {
          method: 'POST'
        },
        get: {
          method: 'GET'
        },
        query: {
          method: 'GET'
        },
        update: {
          method: 'PUT'
        },
        destroy: {
          method: 'DELETE'
        },
        getAll: {
          method: 'GET',
          isArray: true
        }
      }),

      surveyBySendBack: $resource(urls.surveyBySendBack, {
        _id: '@id'
      }, {
        save: {
          method: 'POST'
        },
        get: {
          method: 'GET'
        },
        query: {
          method: 'GET',
          isArray: true
        },
        update: {
          method: 'PUT'
        },
        destroy: {
          method: 'DELETE'
        },
        getAll: {
          method: 'GET',
          isArray: true
        }
      }),

      surveyUpdateByManufacturer: $resource(urls.surveyUpdateByManufacturer, {

      }, {
        save: {
          method: 'POST'
        },
        get: {
          method: 'GET'
        },
        query: {
          method: 'GET',
          isArray: true
        },
        update: {
          method: 'PUT'
        },
        destroy: {
          method: 'DELETE'
        },
        getAll: {
          method: 'GET',
          isArray: true
        }
      }),
      requestToComplete: $resource(urls.requestToComplete, {
        _id: 'id'
      }, {
        query: {
          method: 'GET',
          isArray: true
        }
      }),
      materials: $resource(urls.materials, {}, {
        query: {
          method: 'GET',
          isArray: true
        }
      }),
      braintree: $resource(urls.braintree, {}, {
        query: {
          method: 'GET'
        }
      }),
      getBySubId: $resource('/api/bttoken/subscription/:key', {}, {
        query: {
          method: 'GET'
        }
      }),
      cancelBySubId: $resource('/api/bttoken/cancelSubscription/:key', {}, {
        query: {
          method: 'GET'
        }
      }),
      updateSubscription: $resource('/api/bttoken/updateSubscription/:key', {}, {
        query: {
          method: 'GET'
        }
      }),
      changeCardInfo: $resource('/api/bttoken/changeCreditCart', {}, {
        query: {
          method: 'POST'
        }
      }),
      manufacturerAll: $resource(urls.manufacturerAll, {}, {
        query: {
          method: 'GET'
        },
      }),
      manufacturesin: $resource(urls.manufacturesin, {}, {
        query: {
          method: 'GET'
        },
      }),
      surveyorAll: $resource('/users/allSurveyor', {}, {
        query: {
          method: 'GET'
        },
      }),
      manufacturesByUserId: $resource('/manufactures/getByUserId/:_id', {}, {
        query: {
          method: 'GET'
        },
      }),
      manufacturesByIdNoAuth: $resource('/manufactures/getByIdNoAuth/:_id', {}, {
        query: {
          method: 'GET'
        },
      }),
      merchantByUserId: $resource('/merchant/getByUserId/:_id', {}, {
        query: {
          method: 'GET'
        },
      }),

      merchantByIdNoAuth: $resource('/merchant/getByIdNoAuth/:_id', {}, {
        query: {
          method: 'GET'
        },
      }),
      usersupdate: $resource('/api/users/usersupdate/:_id', {}, {
        update: {
          method: 'PUT'
        },
      }),
      usersupdateNoAuth: $resource('/api/users/usersupdateNoAuth/:_id', {}, {
        update: {
          method: 'PUT'
        },
      }),
      subscriptionBlockByadmin: $resource('/api/users/blockUnpaidUser', {}, {
        update: {
          method: 'POST'
        },
      }),
      sendBulkEmail: $resource('/api/users/sendbulkemail', {}, {
        save: {
          method: 'POST'
        },
      }),
      sendContactEmail: $resource('/api/users/sendContactemail', {}, {
        save: {
          method: 'POST'
        },
      }),
      getNewsletters: $resource('/api/users/getNewsletters', {}, {
        query: {
          method: 'GET'
        },
      }),
      subscriptionWarnedByadmin: $resource('/api/users/warnUnpaidUser', {}, {
        update: {
          method: 'POST'
        },
      }),
      resetSurveyorPassword: $resource('/api/surveyors/updatePass/:_id', {}, {
        update: {
          method: 'PUT'
        },
      }),
      getPostCode: $resource('/api/users/getPostCode', {}, {
        get: {
          method: 'GET'
        },
      }),
      getSurveyers: $resource('/api/users/getSurveyers', {}, {
        get: {
          method: 'GET'
        },
      }),
      downloadUsersByType: $resource('/api/users/downloadUsersByType/:type', { type: '@type' }, {
        get: {
          method: 'GET'
        },
      }),
      getDesigners: $resource('/api/designer/getDesigners', {}, {
        query: {
          method: 'POST'
        },
      }),
      createDesigner: $resource('/api/designer/create', {}, {
        query: {
          method: 'POST'
        },
      }),
      blockDesigner: $resource('/api/designer/block', {}, {
        query: {
          method: 'POST'
        },
      }),
      updateDesigner: $resource('/api/designer/update', {}, {
        query: {
          method: 'POST'
        }
      }),
      getDesignerById: $resource('/api/designer/getById/:_id', {
        _id: '@id'
      },
      {
        get: {
          method: 'get'
        }
      }),
      updateDesignerCredit: $resource('/api/users/updateDesignerCredit', {}, {
        post: {
          method: 'POST'
        },
      }),
      getDesignerCredit: $resource('/api/users/getDesignerCredit', {}, {
        save: {
          method: 'GET'
        },
      }),
      useCredit: $resource('/api/users/useCredit', {},{
        post: {
          method: 'POST'
        }
      }),
      downloadmcs: $resource('/api/users/downloadmcs',{},{
        post: {
          method: 'POST'
        }
      }),

      // getSurveyLogs: $resource('/api/surveylogs/getLogs/:_id', { _id: '@id' }, {
      //   get: {
      //     method: 'GET'
      //   },
      // }),
      customs: $resource(urls.customs, {
        _id: '@id'
      }, {
        save: {
          method: 'POST'
        },
        query: {
          method: 'GET',
          isArray: true
        },
        destroy: {
          method: 'DELETE'
        },
      }),
      customsin: $resource(urls.customsin, {
        trainee: '@trainee'
      }, {
        query: {
          method: 'GET',
          isArray: true
        },
      }),
      checkCustom: $resource(urls.checkCustom, {
        _id: '@id'
      }, {
        get: {
          method: 'GET'
        },
      }),
      manufactures: $resource(urls.manufactures, {
        _id: '@id'
      }, {
        get: {
          method: 'GET'
        },
        save: {
          method: 'POST'
        },
        query: {
          method: 'GET',
          isArray: true
        },
        update: {
          method: 'PUT'
        },
        destroy: {
          method: 'DELETE'
        }
      }),

      merchant: $resource(urls.merchant, {
        _id: '@id'
      }, {
        get: {
          method: 'GET'
        },
        save: {
          method: 'POST'
        },
        query: {
          method: 'GET',
          isArray: true
        },
        update: {
          method: 'PUT'
        },
        destroy: {
          method: 'DELETE'
        }
      }),
      models: $resource(urls.models, {
        _id: '@id'
      }, {
        get: {
          method: 'GET'
        },
        save: {
          method: 'POST'
        },
        query: {
          method: 'GET',
          isArray: true
        },
        update: {
          method: 'PUT'
        },
        destroy: {
          method: 'DELETE'
        }
      }),
      getAllPremier: $resource(urls.getAllPremier, {
        _id: '@id'
      }, {
        get: {
          method: 'GET'
        },
        save: {
          method: 'POST'
        },
        query: {
          method: 'GET',
          isArray: true
        },
        update: {
          method: 'PUT'
        },
        destroy: {
          method: 'DELETE'
        }
      }),


      surveyorByIdNoAuth: $resource(urls.surveyorByIdNoAuth, {
        _id: '@id'
      }, {
        get: {
          method: 'GET'
        },
        save: {
          method: 'POST'
        },
        query: {
          method: 'GET',
          isArray: true
        },
        update: {
          method: 'PUT'
        },
        destroy: {
          method: 'DELETE'
        }
      }),

      events: $resource(urls.events, {
        _id: '@id'
      }, {
        get: {
          method: 'GET'
        },
        save: {
          method: 'POST'
        },
        query: {
          method: 'GET',
          isArray: true
        },
        update: {
          method: 'PUT'
        },
        destroy: {
          method: 'DELETE'
        }
      }),

      oldevents: $resource(urls.oldevents, {},
        {
          getoldevents: {
            method: 'GET'
          }
        }),

      eventsAll: $resource(urls.eventsAll, {
        _id: '@id'
      }, {
        save: {
          method: 'POST'
        },
        get: {
          method: 'GET'
        },
        query: {
          method: 'GET',
          isArray: true
        },
        update: {
          method: 'PUT'
        },
        destroy: {
          method: 'DELETE'
        },
        getAll: {
          method: 'GET',
          isArray: true
        }
      }),
      forum: $resource(urls.forum, {
        _id: '@id'
      }, {
        get: {
          method: 'GET'
        },
        save: {
          method: 'POST'
        },
        query: {
          method: 'GET',
          isArray: true
        },

      }),
      chat: $resource(urls.chat, {
        _id: '@id'
      }, {
        get: {
          method: 'GET'
        },
        save: {
          method: 'POST'
        },
        query: {
          method: 'GET',
          isArray: true
        },

        // methods
        // save: function (resource, params) {
        //   deferred = $q.defer();
        //   this[resource].save(params, onSuccess, onError);
        //   return deferred.promise;
        // },

      }),
      surveyLogs: $resource(urls.surveyLogs, {
        _id: '@id'
      }, {
        get: {
          method: 'GET'
        },
        save: {
          method: 'POST'
        },
      }),

      applog: $resource(urls.applog, {
        _id: '@id'
      }, {
        save: {
          method: 'POST'
        },
        get: {
          method: 'GET'
        },
        query: {
          method: 'GET',
          isArray: true
        },
        update: {
          method: 'PUT'
        },
        destroy: {
          method: 'DELETE'
        },
        getAll: {
          method: 'GET',
          isArray: true
        }
      }),
      inviterTrainees: $resource('/api/trainee/inviter/:_id', {
        _id: '@id'
      }, {
        post: {
          method: 'POST'
        }
      }),
      copySurvey: $resource('/api/trainee/copysurvey', {}, {
        post: {
          method: 'POST'
        }
      }),
      trainees: $resource('/api/trainee/create', {}, {
        post: {
          method: 'POST'
        },
      }),
      resetTrinees: $resource('/api/trainee/reset', {}, {
        post: {
          method: 'POST'
        },
      }),
      // methods
      save: function (resource, params) {
        deferred = $q.defer();
        this[resource].save(params, onSuccess, onError);
        return deferred.promise;
      },

      get: function (resource, params) {
        deferred = $q.defer();
        this[resource].get(params, onSuccess, onError);
        return deferred.promise;
      },

      query: function (resource) {
        deferred = $q.defer();
        this[resource].query(onSuccess, onError);
        return deferred.promise;
      },

      getAll: function (resource, params) {
        deferred = $q.defer();
        this[resource].query(params, onSuccess, onError);
        return deferred.promise;
      },
      update: function (resource, params) {
        deferred = $q.defer();
        this[resource].update({
          _id: params._id
        }, params, onSuccess, onError);
        return deferred.promise;
      },

      destroy: function (resource, params) {
        deferred = $q.defer();
        this[resource].destroy(params, onSuccess, onError);
        return deferred.promise;
      }
    };
  }

  angular.module('cloudheatengineer').factory('apiService', ['$resource', '$q', apiService]);
}());
