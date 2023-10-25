(function() {
    'use strict';

    angular.module('cloudheatengineer')
        .controller('UsersController', UsersController)
        .controller('CancelSubscriptionController', CancelSubscriptionController)
        .controller('BulkEmailController', BulkEmailController)
        .controller('DummyUserController', DummyUserController)
        .controller('ModalNewsletterInstanceController', ModalNewsletterInstanceController)
        .controller('UserDetailController', UserDetailController)

    UsersController.$inject = ['$rootScope', '$scope', 'apiService', 'userService', 'alertService', '_'];

    function UsersController($rootScope, $scope, apiService, userService, alertService, _) {

        $scope.changeTheme = function(color) {
            $rootScope.user.theme = color;
            userService.updateStorage($rootScope.user);
        };

        $scope.changeFont = function(fontType) {
            $rootScope.user.ui_theme.fontFamily = fontType;
            userService.updateStorage($rootScope.user);
        };

        $scope.changeBackground = function(style) {
            $rootScope.user.ui_theme.background = style.background;
            $rootScope.user.ui_theme.color = style.color;
            userService.updateStorage($rootScope.user);
        };

        $scope.deleteUser = function(user) {

            userService
                .deleteUser(user)
                .then(
                    function(res) {
                        alertService('success', res.message);

                        var index = $scope.users.indexOf(user);
                        $scope.users.splice(index, 1);
                    },
                    function(err) {

                    }
                );



        };

        $scope.searchType = 'username',
        $scope.userType = 'member'
        $scope.filterUser = function() {
            let query = {
                limit: 10,
                skip: 0,
                search: $scope.search,
                searchType: $scope.searchType,
                userType: $scope.userType
            }
            apiService['users'].query(query, function(response) {
                var counts = response.counts;
                $scope.limit = 10
                $scope.skip = 0
                $scope.paginationPage = []
                let totalPage = Math.floor(parseInt(response.totalCount) / 10)
                if (parseInt(response.totalCount) % 10 > 0) {
                    $scope.totalPage = totalPage + 1
                } else {
                    $scope.totalPage = totalPage
                }

                for (let i = 0; i < totalPage && $scope.paginationPage.length < 10; i++) {
                    $scope.paginationPage.push(i)
                }
                if (parseInt(response.totalCount) % 20 && $scope.totalPage < 10) {
                    $scope.paginationPage.push($scope.paginationPage.length)
                }
                $scope.currentPaginationPage = 1
                if (response.users.length > 0) {
                    $scope.users = _.map(response.users, function(user, index) {
                        _.each(counts, function(count) {
                            if (count.email == user.email) {
                                user.completed = count.completed;
                                user.submitted = count.submitted;
                            }
                        });

                        return user;
                    });
                } else {
                    $scope.users = []
                }
            })
        }

        $scope.previousPage = function() {
            let requestPage = parseInt($scope.currentPaginationPage) - 1
            $scope.skip = (requestPage - 1) * 10
            apiService['users'].query({
                limit: 10,
                skip: $scope.skip,
                search: $scope.search,
                searchType: $scope.searchType,
                userType: $scope.userType
            }, function(response) {
                var counts = response.counts;
                $scope.limit = 10
                let totalPage = Math.floor(parseInt(response.totalCount) / 10)
                let totalCount = parseInt(response.totalCount)
                if (parseInt(response.totalCount) % 10 > 0) {
                    $scope.totalPage = totalPage + 1
                } else {
                    $scope.totalPage = totalPage
                }
                $scope.paginationPage = []
                let startPage = 0
                if (requestPage > 5) {
                    startPage = requestPage - 5
                }
                for (let i = startPage; i < totalPage && $scope.paginationPage.length < 10; i++) {
                    $scope.paginationPage.push(i)
                }
                if (parseInt(totalCount) % 20 && totalPage < 10) {
                    $scope.paginationPage.push(startPage + $scope.paginationPage.length)
                }
                $scope.currentPaginationPage = requestPage
                $scope.users = _.map(response.users, function(user, index) {
                    _.each(counts, function(count) {
                        if (count.email == user.email) {
                            user.completed = count.completed;
                            user.submitted = count.submitted;
                        }
                    });

                    return user;
                });
            })
        }

        $scope.nextPage = function() {
            let requestPage = parseInt($scope.currentPaginationPage) + 1
            $scope.skip = (requestPage - 1) * 10
            apiService['users'].query({
                limit: 10,
                skip: $scope.skip,
                search: $scope.search,
                searchType: $scope.searchType,
                userType: $scope.userType
            }, function(response) {
                var counts = response.counts;
                $scope.limit = 10
                let totalPage = Math.floor(parseInt(response.totalCount) / 10)
                let totalCount = parseInt(response.totalCount)
                if (parseInt(response.totalCount) % 10 > 0) {
                    $scope.totalPage = totalPage + 1
                } else {
                    $scope.totalPage = totalPage
                }
                $scope.paginationPage = []
                let startPage = 0
                if (requestPage > 5) {
                    startPage = requestPage - 5
                }
                for (let i = startPage; i < totalPage && $scope.paginationPage.length < 10; i++) {
                    $scope.paginationPage.push(i)
                }
                if (parseInt(totalCount) % 20 && totalPage < 10) {
                    $scope.paginationPage.push(startPage + $scope.paginationPage.length)
                }
                $scope.currentPaginationPage = requestPage
                $scope.users = _.map(response.users, function(user, index) {
                    _.each(counts, function(count) {
                        if (count.email == user.email) {
                            user.completed = count.completed;
                            user.submitted = count.submitted;
                        }
                    });

                    return user;
                });
            })
        }

        $scope.newPage = function(page) {
            $scope.skip = (parseInt(page) - 1) * 10
            apiService['users'].query({
                limit: 10,
                skip: $scope.skip,
                search: $scope.search,
                searchType: $scope.searchType,
                userType: $scope.userType
            }, function(response) {
                var counts = response.counts;
                $scope.limit = 10
                let totalPage = Math.floor(parseInt(response.totalCount) / 10)
                let totalCount = parseInt(response.totalCount)
                if (parseInt(response.totalCount) % 10 > 0) {
                    $scope.totalPage = totalPage + 1
                } else {
                    $scope.totalPage = totalPage
                }
                $scope.paginationPage = []
                let requestPage = parseInt(page)
                let startPage = 0
                if (requestPage > 5) {
                    startPage = requestPage - 5
                }
                for (let i = startPage; i < totalPage && $scope.paginationPage.length < 10; i++) {
                    $scope.paginationPage.push(i)
                }
                if (parseInt(totalCount) % 20 && $scope.paginationPage.length < 10) {
                    $scope.paginationPage.push(startPage + $scope.paginationPage.length)
                }
                $scope.currentPaginationPage = requestPage
                $scope.users = _.map(response.users, function(user, index) {
                    _.each(counts, function(count) {
                        if (count.email == user.email) {
                            user.completed = count.completed;
                            user.submitted = count.submitted;
                        }
                    });

                    return user;
                });
            })
        }

        $scope.addUserFilter = function() {
            apiService['users'].query({
                limit: 10,
                skip: $scope.skip,
                search: $scope.search,
                searchType: $scope.searchType,
                userType:$scope.userType,
            }, function(response) {
            var counts = response.counts;
            $scope.search = ''
            $scope.limit = 10
            $scope.skip = 0
            $scope.paginationPage = []
            let totalPage = Math.floor(parseInt(response.totalCount) / 10)
            if (parseInt(response.totalCount) % 10 > 0) {
                $scope.totalPage = totalPage + 1
            } else {
                $scope.totalPage = totalPage
            }

            for (let i = 0; i < totalPage && $scope.paginationPage.length < 10; i++) {
                $scope.paginationPage.push(i)
            }
            if (parseInt(response.totalCount) % 20 && $scope.totalPage < 10) {
                $scope.paginationPage.push($scope.paginationPage.length)
            }
            $scope.currentPaginationPage = 1
            $scope.users = _.map(response.users, function(user, index) {
                _.each(counts, function(count) {
                    if (count.email == user.email) {
                        user.completed = count.completed;
                        user.submitted = count.submitted;
                    }
                });

                return user;
            });
            // console.log("1",response);
        });

        // console.log(userType);
    }


        /**
         *
         * Function to cancel subscription
         * @param {user}
         *
         */

        $scope.cancelUserSubscription = function(user){
            if (confirm('Are you sure you want to cancel this user\'s subscription ? WARNING: Action not reversible.')) {
                apiService.get('cancelBySubId', { key: user.selectedPlan.key }).then(function (response) {
                    if(response.response.errors){
                        alertService('warning', 'Already actioned', response.response.message);
                    } else {
                        user.selectedPlan.key = '';
                        alertService('success', 'Warning User', 'User\' subscription has been cancelled successfully');
                    }

                });
            }
        }

        /**
         * Method for getting post code
         */

        $scope.getPostCode = function(event) {
            event.preventDefault();
            event.stopPropagation();
            apiService.getPostCode.get('users', {}, function(response) {
                var anchor = angular.element('<a/>');
                let a = Math.floor(Math.random() * 100000)
                anchor.attr({
                    href: 'data:attachment/csv;charset=utf-8,' + encodeURI(response.data),
                    target: '_blank',
                    download: 'statisticaldata'+a+'.csv'
                })[0].click();
            });
        };

        $scope.DownloadUsersByType = function(event) {
            event.preventDefault();
            event.stopPropagation();
            apiService.get('downloadUsersByType', {type: $scope.userType}).then(function(response) {
                var anchor = angular.element('<a/>');
                let a = Math.floor(Math.random() * 100000)
                anchor.attr({
                    href: 'data:attachment/csv;charset=utf-8,' + encodeURI(response.data),
                    target: '_blank',
                    download: $scope.userType+'-emails-'+response.count+'.csv'
                })[0].click();
            });
        };
        function init() {
            $scope.addUserFilter("member");
          }
          init()
    }

    CancelSubscriptionController.$inject = ['$rootScope', '$scope', 'apiService', 'userService', 'alertService', '_'];

    function CancelSubscriptionController($rootScope, $scope, apiService, userService, alertService, _) {

        $scope.user = $rootScope.user;

        $scope.stopUnbilledUsers = function() {
            let postData = $scope.emails.split(/[\s,]+/)
            apiService['subscriptionBlockByadmin'].update({}, {
                email: postData
            }, function(response) {
                if (response.success) {
                    userService.sendSubscriptionCancelledMail({
                        email: postData
                    }, function(res) {})
                    alertService('success', 'Stopped User Access', 'User Access stopped successfully')
                } else {
                    alertService('error', 'Some error', 'Action was unsuccessfull')
                }
            })
        }

        $scope.warnUnbilledUsers = function() {
            let postData = $scope.emails.split(/[\s,]+/)
            apiService['subscriptionWarnedByadmin'].update({}, {
                email: postData
            }, function(response) {
                if (response.success) {
                    userService.sendSubscriptionWarningMail({
                        email: postData
                    }, function(res) {})
                    alertService('success', 'Warning User', 'User Warned successfully')
                } else {
                    alertService('error', 'Some error', 'Action was unsuccessfull')
                }
            })
        }
    }

    /**
     * Bulk email sender
     */

    ModalNewsletterInstanceController.$inject = ['$scope', '$modalInstance', 'message'];

    function ModalNewsletterInstanceController ($scope, $modalInstance, message) {
        let a = message.split('<br />');
        let b = [];
        let c;
        for(let i=0; i < a.length; i++){
            if(a[i] != "") {
                c = a[i].replace(/<\s*div\/*>/g, "");
                c = c.replace(/<\s*\/div\/*>/g, "");
                b.push(c);
            }
        }

        $scope.message = b;
        $scope.isEdit = false;

        $scope.done = function () {
            $modalInstance.dismiss('cancel');
        };
    }

    BulkEmailController.$inject = ['$rootScope', '$scope', 'apiService', 'userService', 'alertService', '_', '$modal'];

    function BulkEmailController ($rootScope, $scope, apiService, userService, alertService, _, $modal) {

        $scope.user = $rootScope.user;
        $scope.emailForm = {};


        $scope.contentInputs = [{}];

        $scope.removeInputField = function(value) {
            if ($scope.contentInputs.length > 1) {
                var index = $scope.contentInputs.indexOf(value);
                $scope.contentInputs.splice(index, 1);
            }
        };

        $scope.addInputField = function() {
            $scope.contentInputs.push({});
        };

        $scope.isMessageBodyValid = function() {
            if ($scope.contentInputs && $scope.contentInputs.length > 0) {
                for (let i = 0; i < $scope.contentInputs.length; i++) {
                    if ($scope.contentInputs[i] && (Object.keys($scope.contentInputs[i]).length < 1 || $scope.contentInputs[i].value === "")) {
                        return true;
                    }
                }
            }
        };

        $scope.formContentMessageBody = function() {
            let msg = "";
            if ($scope.contentInputs && $scope.contentInputs.length > 0) {
                for (let i = 0; i < $scope.contentInputs.length; i++) {
                    if ($scope.contentInputs[i] && $scope.contentInputs[i].value && $scope.contentInputs[i].value !== "") {
                        msg = msg + '<div>' + $scope.contentInputs[i].value + '</div><br />';
                    }
                }
            }
            return msg;
        };

        $scope.sendBulkEmail = function() {
            $scope.emailForm.message = $scope.formContentMessageBody();
            let data = {
                subject: $scope.emailForm.subject,
                message: $scope.emailForm.message
            }
            apiService.save('sendBulkEmail',data).then(function(res) {
                if (res) {
                    alertService('success', 'Bulk Email', res.message)
                    $scope.emailForm.subject = '';
                    $scope.emailForm.message = '';
                    $scope.contentInputs = [{}];
                    $scope.newsletters.push(res.data);
                } else {
                    alertService('error', 'Some error', 'Action was unsuccessfull')
                }
            });
        };

        $scope.newsletters = [];
        apiService['getNewsletters'].query(function (res) {
            $scope.newsletters = res.data;
        })

        $scope.showFullMessage = function (obj) {
            var modalOptions = {};
            modalOptions.templateUrl = '/partials/views/userbulkemail/_modal_newsletter';
            modalOptions.controller = 'ModalNewsletterInstanceController';
            modalOptions.size = 'md';

            var modalInstance = $modal.open({
                animation: true,
                templateUrl: modalOptions.templateUrl,
                controller: modalOptions.controller,
                size: modalOptions.size = 'md',
                resolve: {
                    message: function () {
                        return obj.message;
                    }
                }
            });

            modalInstance.result.then(function (obj) {
              message = obj;
            }, function () {

            });
        };
    }

    DummyUserController.$inject = ['$rootScope', '$scope', 'apiService', 'userService', 'alertService', '_'];

    function DummyUserController ($rootScope, $scope, apiService, userService, alertService, _) {

        $scope.dummyUser = {};
        var opt = [

            { planId: 'soleTrader', planDesc: '£10 + VAT - Monthly subscription - Sole Trader', price: '12', show: true },
            { planId: 'soleTraderYearly', planDesc: '£108 + VAT - Yearly subscription - Sole Trader (10% off)', price: '129.6', show: true },
            // { planId: 'soleTraderWhiteLabeled', planDesc: '£20 + VAT - Monthly Subscription - Sole Trader White Labeled', price:'24', show: true}, //
            // { planId: 'soleTraderYearlyWhiteLabeled', planDesc: '£216 + VAT - Yearly Subscription - Sole Trader White Labeled (10% off)', price:'259.2', show: true},

            { planId: 'smeMonthly', planDesc: '£30 + VAT - Monthly Subscription - SME Monthly', price: '36', show: true, frequency: 'month' },
            { planId: 'smeYearly', planDesc: '£324 + VAT - Yearly Subscription - SME Yearly', price: '388.8', show: true, frequency: 'year' },
            // { planId: 'smeWhiteLabeledMonthly', planDesc: '£60 + VAT - Monthly Subscription - SME White Labeled Monthly', price: '72', show: true, frequency: 'month' },
            // { planId: 'smeWhiteLabeledYearly', planDesc: '£648 + VAT - Yearly Subscription - SME White Labeled Yearly', price: '777.6', show: true, frequency: 'year' },

          ];
        $scope.planOptions = opt;

        $scope.heatLossEsti = false;

        $scope.userSave = function(user) {
            userService.createDummyUser(user).then(function (response) {
                $scope.dummyUser = {};
                alertService('success', 'Updated!', response.message);
            })
        }
    }

    UserDetailController.$inject = ['$rootScope', '$scope', '$routeParams', 'apiService', 'userService', 'alertService', '_'];
    function UserDetailController($rootScope, $scope, $routeParams, apiService, userService, alertService, _) {

        var userId = $routeParams.id
        $scope.userDetail;

        initUserDetail()

        function initUserDetail() {
            apiService.getUserById.get({_id: userId}, function(res) {
                console.log(res);
                $scope.userDetail = res.data
            });
        }
    }

}());
