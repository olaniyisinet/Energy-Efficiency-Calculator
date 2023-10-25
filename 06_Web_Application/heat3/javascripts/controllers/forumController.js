(function () {
    'use strict';

    angular.module('cloudheatengineer').controller('ForumController', ForumController);
    angular.module('cloudheatengineer').controller('ThreadsController', ThreadsController);

    /**
     * Forum Controller
     */
    ForumController.$inject = ['$rootScope', '$scope', 'apiService', 'alertService', '_', '$modal', '$routeParams', '$location', '$window'];
    function ForumController ($rootScope, $scope, apiService, alertService, _, $modal, $routeParams, $location, $window) {

        $scope.threads = [];
        $scope.showForm = false;
        $rootScope.showHeader = false;
        $rootScope.showFooter = false;

        init();

        $scope.showThread = function (forum) {
            $location.path('/forum/' + forum._id);
        };

        function init () {
            apiService.get('forum').then(function (res) {
                $scope.threads = res.data;
            })
        }

        $scope.createThread = function () {
            var storage = $window.localStorage;
            var userData = JSON.parse(storage.getItem('user'));
            $scope.showForm = true
            if ($scope.forumform.title && $scope.forumform.description) {

                let data = {
                    title: $scope.forumform.title,
                    description: $scope.forumform.description,
                    _user_id: userData._id,

                }
                apiService['forum'].save(data, function (res) {
                    if (res) {
                        alertService('success', 'Thread Created', 'Action was successfull')
                        $scope.forumform.title = '';
                        $scope.forumform.description = '';
                        // res.data._user_id = userData
                        $scope.threads.push(res.data);
                    } else {
                        alertService('error', 'Some error', 'Action was unsuccessfull')
                    }
                });
            } else {
                alertService('danger', '', 'Fill all field')
            }
        };

        $scope.resetCreateForm = function () {
            $scope.showForm = false;
        }
    }

    /**
     * ThreadsController
     */

    ThreadsController.$inject = ['$rootScope', '$scope', '$routeParams', '$location', 'apiService', 'alertService', 'materialService', '$window'];
    function ThreadsController ($rootScope, $scope, $routeParams, $location, apiService, alertService, materialService, $window) {

        $scope.threads = {}
        $scope.chats = []
        $scope.sendMessage = '';
        var socket;
        $rootScope.showHeader = false;
        $rootScope.showFooter = false;
        $rootScope.heatmanagerview = true;

        $scope.viewport_height = document.documentElement.clientHeight - 400;

        socket = io();
        var input = document.getElementById('input');
        var messages = document.getElementById('messages');

        init();

        $scope.sendMessage = function () {
            var storage = $window.localStorage;
            var userData = JSON.parse(storage.getItem('user'));
            var objValues = {
                msg: input.value,
                date: new Date(),
                name: userData.first_name,
                forum_id: $routeParams.id,
                user_id: userData._id

            }
            if (input.value) {
                socket.emit('chat message', objValues);

                var objMsg = {
                    'message': input.value,
                    '_user_id': userData._id,
                    '_forum_id': $routeParams.id,

                };

                apiService.save('chat', objMsg).then(function (forum) {
                });
                input.value = '';
                var messageBody = document.querySelector('.forumChatlist');
                messageBody.scrollTop = messageBody.scrollHeight;
            }
        }
        socket.on('chat message', function (msg) {
            var msgData = {
                date_created: msg.date,
                message: msg.msg,
                _forum_id: msg.forum_id,
                _user_id: {
                    first_name: msg.name,
                }
            }
            var chats = $scope.chats
            chats.push(msgData)
            chatUpdate(chats)
            if (msg.forum_id === $routeParams.id) {
                var storage = $window.localStorage;
                var userData = JSON.parse(storage.getItem('user'));
                var item = document.createElement('p');
                var user = document.createElement('p');
                user.textContent = msg.name + ' ' + msg.date;
                item.textContent = msg.msg;

                var messageBody = document.querySelector('.forumChatlist');
                messageBody.scrollTop = messageBody.scrollHeight;
            }
        });

        function chatUpdate (msgData) {
            apiService.get('chat', { forum_id: $routeParams.id }).then(function (chat) {
                var messageBody = document.querySelector('.forumChatlist');
                messageBody.scrollTop = messageBody.scrollHeight - $scope.viewport_height;
            });
        }

        function init() {
            apiService.get('chat', { forum_id: $routeParams.id }).then(function (chat) {
                $scope.chats = chat.data;
                apiService.get('forum', { _id: $routeParams.id }).then(function (forum) {
                    $scope.threads = forum;
                    var messageBody = document.querySelector('.forumChatlist');
                    messageBody.scrollTop = messageBody.scrollHeight - $scope.viewport_height;
                });
            });
        }

    }

})();
