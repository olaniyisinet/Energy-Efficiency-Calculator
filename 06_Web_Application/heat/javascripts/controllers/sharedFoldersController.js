(function () {
  'use strict';
  angular.module('cloudheatengineer').controller('SharedFoldersController', SharedFoldersController);

  SharedFoldersController.$inject = ['$scope', '$rootScope', 'sharedFolderService'];

  function SharedFoldersController ($scope, $rootScope, sharedFolderService) {

    $rootScope.showHeader = false;
    $rootScope.showFooter = false;
    $rootScope.heatmanagerview = true;

    $scope.folders = [];
    $scope.search = {};

    function init () {
      const query = {
        limit: 10,
        page: 1,
        search: $scope.search.val,
      }
      sharedFolderService.getAll(query).then(function (folders) {
        if (folders[1] != 0) {
          let folderData = Object.keys(folders[0]).map(i => {
            return folders[0][i]
          })
          $scope.folders = folderData;
          $scope.paginationPage = []
          let totalPage = Math.floor(parseInt(folders[1]) / query.limit)
          let obj = {}
          for (let i = 0; i < totalPage; i++) {
            obj[i] = i
            $scope.paginationPage.push(obj)
            obj = {}
          }
          if (parseInt(folders[1]) % 20) {
            obj[totalPage] = totalPage + 1
            $scope.paginationPage.push(obj)
            obj = {}
          }
        } else
          $scope.folders = null;
        $scope.currentPaginationPage = 1;
      }).catch(err => {
        console.log('error', err)
      });
    }
    $scope.newPage = function (page) {
      let query = {
        limit: 10,
        page: page,
        search: $scope.search.val,
      }
      sharedFolderService.getAll(query).then(function (folders) {
        if (folders[1] != 0) {
          let folderData = Object.keys(folders[0]).map(i => {
            return folders[0][i]
          })
          $scope.folders = folderData;
        } else
          $scope.folder = null
        $scope.currentPaginationPage = page
      })
    }
    $scope.nextPage = function () {
      let page = parseInt($scope.currentPaginationPage) + 1
      let query = {
        limit: 10,
        page: page,
        search: $scope.search.val,
      }
      sharedFolderService.getAll(query).then(function (folders) {
        if (folders[1] != 0) {
          let folderData = Object.keys(folders[0]).map(i => {
            return folders[0][i]
          })
          $scope.folders = folderData;
        } else
          $scope.folder = null
        $scope.currentPaginationPage = page
      })
    }
    $scope.previousPage = function () {
      let page = parseInt($scope.currentPaginationPage) - 1
      let query = {
        limit: 10,
        page: page,
        search: $scope.search.val,
      }
      sharedFolderService.getAll(query).then(function (folders) {
        if (folders[1] != 0) {
          let folderData = Object.keys(folders[0]).map(i => {
            return folders[0][i]
          })
          $scope.folders = folderData;
        } else
          $scope.folder = null
        $scope.currentPaginationPage = page
      })
    }
    $scope.filterComplete2 = () => {
      init();
    }
    init();
  }
})();
