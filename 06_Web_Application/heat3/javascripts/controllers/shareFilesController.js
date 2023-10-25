(function () {
    'use strict';
    angular.module('cloudheatengineer').controller('ShareFilesController', ShareFilesController);
    angular.module('cloudheatengineer').controller('HeatSourceController', HeatSourceController)

    ShareFilesController.$inject = ['$timeout', '$location', '$rootScope', '$scope', '$modal', '$filter', 'userService', 'sharedFolderService', 'apiService', 'summaryHelperService', 'report', 'calculationService', '_', 'alertService', 'commonService', 'multipartFormService'];

    function ShareFilesController ($timeout, $location, $rootScope, $scope, $modal, $filter, userService, sharedFolderService, apiService, summaryHelperService, r, calculationService, _, alertService, commonService, multipartFormService) {

        $rootScope.showHeader = false;
        $rootScope.showFooter = false;
        $rootScope.heatmanagerview = true;

        $scope.user = JSON.parse(window.localStorage.getItem('user'))
        $scope.searchVal = {};
        $scope.folder = null
        $scope.files = []
        $scope.fileInput = null;
        $scope.fileInputDef = null;
        $scope.isNameEdit = false;
        $scope.hasDefault = false;
        $scope.$watch('fileInput', function (newValue, oldValue) {
            if (newValue) {
                var uploadUrl = '/api/uploadSharedFolder';
                const data = {
                    '_id': $location.search().id,
                    'filename': newValue.name,
                    'sharedFile': newValue,
                    // 'type': 'mobile',
                    // 'person_type': "Property owner / Tenant",
                    // 'person_name': "John1",
                    // 'reason': "Pipe broken",
                    // 'description': "pipe broken living room"
                }
                multipartFormService.post(uploadUrl, data).then(function (response) {
                    loadFolder();
                }, function () {
                    alertService('warning', 'Opps!', 'Something went wrong!');
                });
            }
        });

        $scope.$watch('fileInputDef', function (newValue, oldValue) {
          if (newValue) {
              var uploadUrl = '/api/uploadSharedFolder';
              const data = {
                  '_id': $location.search().id,
                  'filename': newValue.name,
                  'sharedFile': newValue,
                  'isDefault': true,
              }
              multipartFormService.post(uploadUrl, data).then(function (response) {
                  loadFolder();
              }, function (error) {
                  console.log(error);
                  alertService('warning', 'Error: ', error.data.message);
              });
          }
      });


        function loadFolder () {
            $scope.folderId = $location.search().id
            if(!$scope.folderId) {
                return
            }

            sharedFolderService.getById({ _id: $location.search().id, search: $scope.searchVal.val }).then(function (folder) {
                $scope.folder = folder;
                $scope.files = folder?.files || [];
                $scope.mobileFiles = folder?.mobile_files || [];
                $scope.survey = folder?.survey || {};
                $scope.files.forEach(el => {
                    el.ext = (el.name || '').includes('.') ? el.name.split('.').pop().toUpperCase() : 'PDF';
                });
                $scope.mobileFiles.forEach(el => {
                  el.ext = (el.name || '').includes('.') ? el.name.split('.').pop().toUpperCase() : 'PDF';
                });
                $scope.files.filter(function(obj){
                  if(obj.isDefault) {
                    $scope.hasDefault = true;
                  }
                })
            });
        }

        $scope.viewFile = function () {
          if($scope.folder.new_files != undefined && $scope.folder.new_files > 0) {
            sharedFolderService.update({ _id: $location.search().id, new_files: 0 }).then(function () {
              loadFolder();
            });
          }
        }

        $scope.saveName = () => {
            $scope.isNameEdit = false;
            sharedFolderService.update({ _id: $location.search().id, name: $scope.folder.name }).then(function () {
                loadFolder();
            });
        }

        $scope.removeFile = (file) => {
          if (confirm('Are you sure you want to remove, action not reversible ?')) {
            sharedFolderService.destroyFile({ _id: $location.search().id, file }).then(function () {
                loadFolder();
            });
          }
        }

        $scope.removeMobileFile = (file) => {
          if (confirm('Are you sure you want to remove, action not reversible ?')) {
            sharedFolderService.destroyMobileFile({ _id: $location.search().id, file }).then(function () {
                loadFolder();
            });
          }
      }

        loadFolder();
        $scope.filterComplete = () => loadFolder()

        $scope.file=[{
            "Filename":"23123 image",
            "type":"jpeg",
            "uploaded":"01/10/2022",
            "person":"Property owner / Tenant",
            "name":"Terry Nutkins",
            "reason":"Leak on pipe",
            "description":"The photo shows where the leak is and dripping."
        },
        {
            "Filename":"323312 image",
            "type":"jpeg",
            "uploaded":"02/10/2022",
            "person":"Heating Engineer",
            "name":"John Stevens",
            "reason":"Fixed leak.",
            "description":"Shows a new elbow joint. Lagging has been added too."
        }
    ]
    $scope.editinfo = function () {
        var modalOptions = {};
        modalOptions.templateUrl = '/partials/views/share-files/_HeatSource';
        modalOptions.controller = 'HeatSourceController';
        modalOptions.size = 'md';

        var modalInstance = $modal.open({
          animation: true,
          templateUrl: modalOptions.templateUrl,
          controller: modalOptions.controller,
          backdrop: false,
          size: modalOptions.size = 'md',
          resolve: {
            data: function () {
              return {
                survey: $scope.survey,
              }
            }
          }
        });

        modalInstance.result.then(function (result) {
          $scope.valueChanged = true;
          $scope.survey = result;
          apiService.update('surveys', $scope.survey).then(function (response) {
          }, commonService.onError);
        }, function () { });
      };
    }

    HeatSourceController.$inject = ['_', '$scope', '$modalInstance', 'data'];

    function HeatSourceController (_, $scope, $modalInstance, data) {

      $scope.survey = data.survey;

      $scope.save = function (event) {
        if (event.keyCode == 13) {
          $scope.ok()
        }
      }

      $scope.ok = function () {
          $modalInstance.close($scope.survey);
      };

      $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
      };

    }

})();
