(function () {
    'use strict';

    angular
        .module('cloudheatengineer')
        .controller('ModalUpdateCompanyController', ModalUpdateCompanyController)
        .controller('DashboardController', DashboardController)
        .controller('CompleteReportController', CompleteReportController)
        .controller('ModalBuyReportController', ModalBuyReportController);

    /**
     * Dashboard Controller
     */
    DashboardController.$inject = ['$rootScope', '$scope', 'data', 'userService', '_', 'taxamo', 'apiService', 'alertService', 'lodash', 'braintreeService', '$location', 'surveyService', '$modal','$window'];

    function DashboardController ($rootScope, $scope, data, userService, _, taxamo, apiService, alertService, lodash, braintreeService, $location, surveyService, $modal,$window) {

        $window.document.title = 'Heat Engineer Dashboard';

        $scope.showSmeBtn = false;
        $scope.showWhtlblBtn = false;
        $scope.showDesignerPanel = false;
        $rootScope.showHeader = false;
        $rootScope.showFooter = false;
        $rootScope.heatmanagerview = true;


        $scope.openUpdateCompanyModal = function () {

            var modalOptions = {};
            modalOptions.templateUrl = '/partials/views/dashboard/components/_modal_update_company';
            modalOptions.controller = 'ModalUpdateCompanyController';
            modalOptions.size = 'md';

            var modalInstance = $modal.open({
                animation: true,
                templateUrl: modalOptions.templateUrl,
                controller: modalOptions.controller,
                size: modalOptions.size,
                backdrop: false,
                resolve: {
                    data: function () {
                        return {
                            user: $scope.loginUser
                        }
                    }
                }
            });

            modalInstance.result.then(function (response) {
                console.log('result is ', response);
                $rootScope.user = response
                $scope.loginUser = response;
                userService.updateStorage(response);
            });

        }

        dataInit()

        function dataInit () {

            $scope.loginUser = JSON.parse(window.localStorage.getItem('user'))

            if($scope.loginUser && $scope.loginUser.is_surveyor){
                if(!$scope.loginUser.isDesigner) {
                    $location.path('/surveyor-details/'+$scope.loginUser._id)
                }
            }

            if (!$scope.loginUser.is_admin && !$scope.loginUser.isDummy) {
                if ($scope.loginUser.selectedPlan.plan == 'soleTrader'
                    || $scope.loginUser.selectedPlan.plan == 'soleTraderYearly') {
                    $scope.showSmeBtn = false;
                    $scope.showWhtlblBtn = true;
                    $scope.showDesignerPanel = false;
                } else if (
                    $scope.loginUser.selectedPlan.plan == 'soleTraderWhiteLabeled'
                    || $scope.loginUser.selectedPlan.plan == 'soleTraderYearlyWhiteLabeled'
                ) {
                    $scope.showSmeBtn = false;
                    $scope.showWhtlblBtn = false;
                    $scope.showDesignerPanel = false;
                } else if ($scope.loginUser.selectedPlan.plan == 'singleSurvey'
                    || $scope.loginUser.selectedPlan.plan == 'MonthlyPaymentPlanStandard'
                    || $scope.loginUser.selectedPlan.plan == 'smallOrgYearly') {
                    $scope.showSmeBtn = true;
                    $scope.showWhtlblBtn = true;
                    $scope.showDesignerPanel = false;
                } else if ($scope.loginUser.selectedPlan.plan == 'smeMonthly'
                    || $scope.loginUser.selectedPlan.plan == 'smeYearly') {
                    $scope.showSmeBtn = false;
                    $scope.showWhtlblBtn = true;
                    $scope.showDesignerPanel = true;
                } else if ($scope.loginUser.selectedPlan.plan == 'smeWhiteLabeledMonthly'
                    || $scope.loginUser.selectedPlan.plan == 'smeWhiteLabeledYearly') {
                    $scope.showSmeBtn = false;
                    $scope.showWhtlblBtn = false;
                    $scope.showDesignerPanel = true;
                } else if($scope.loginUser.selectedPlan.plan == 'manufacturerYearly'){
                    $scope.showDesignerPanel = true;
                }
            } else {
                $scope.showDesignerPanel = true;
            }

            $scope.usedCredit = $scope.loginUser.selectedPlan.UsedCreditDetails.length
            $scope.remaining = $scope.loginUser.selectedPlan.availableDownloadCredits
            $scope.creditCount = $scope.loginUser.selectedPlan.totalDownloadCredits

            /**
             * 0 - normal dashbord
             * 1 - educational users dashboard
             * 2 - current logged in users dashboard only
             * */
             $rootScope.isTraineeSelected = window.localStorage.getItem('isTraineeSelected')
             $rootScope.heading_name
             $rootScope.heading_company


            apiService.counts.query({trainee: $rootScope.isTraineeSelected}, function(response) {
                $scope.counts = response;
                $rootScope.heading_name = response.userDetail.first_name +' '+ response.userDetail.surname
                $rootScope.heading_company = response.userDetail.company_name
                if($rootScope.isTraineeSelected == '1' ) {
                    $rootScope.heading_company = response.userDetail.traineeTo.company
                }
                $rootScope.user = response.userDetail;
            });

            if($scope.loginUser.company_name == undefined || $scope.loginUser.company_name == '') {
                $scope.openUpdateCompanyModal();
            }

        }


    function dateFormat (date) {
        var dateToday = date.getDate();
        var month = date.getMonth() + 1;

        var year = date.getFullYear();
        // var ampm = hours >= 12 ? 'pm' : 'am';
        // hours = hours % 12;
        // hours = hours ? hours : 12; // the hour '0' should be '12'
        month = month < 10 ? '0' + month : month;
        dateToday = dateToday < 10 ? '0' + dateToday : dateToday;

        var strTime = year + '-' + month + '-' + dateToday;
        return strTime;
    }

    $scope.buyReport = function () {

        var modalOptions = {};
        modalOptions.templateUrl = '/partials/views/dashboard/components/_modal_buy_report';
        modalOptions.controller = 'ModalBuyReportController';
        modalOptions.size = 'md';

        var modalInstance = $modal.open({
            animation: true,
            templateUrl: modalOptions.templateUrl,
            controller: modalOptions.controller,
            size: modalOptions.size,
            resolve: {
                data: function () {
                    return {
                        survey: $scope.survey
                    }
                }
            }
        });

        modalInstance.result.then(function (reportBuy) {

            var today = dateFormat(new Date())

            var creditDetails = {
                date_paid: today,
                paid_amount: reportBuy.price,
                credits: reportBuy.credit,
                planId: reportBuy.planId,
                key: ''
            }
            var user1 = $rootScope.user;
            if (!user1.selectedPlan.downloadCreditsDetails) {
                user1.selectedPlan.downloadCreditsDetails = []
            }
            var avail = $scope.loginUser.selectedPlan.availableDownloadCredits && $scope.loginUser.selectedPlan.availableDownloadCredits != null ? $scope.loginUser.selectedPlan.availableDownloadCredits : 0;
            var total = $scope.loginUser.selectedPlan.totalDownloadCredits && $scope.loginUser.selectedPlan.totalDownloadCredits != null ? $scope.loginUser.selectedPlan.totalDownloadCredits : 0;
            user1.selectedPlan.availableDownloadCredits = parseInt(avail) + parseInt(reportBuy.credit)
            user1.selectedPlan.totalDownloadCredits = parseInt(total) + parseInt(reportBuy.credit)

            // taxamo start
            var plan = reportBuy.planId;

            taxamo.doSubscriptionCheckout(
                plan,
                plan,
                'braintree',
                function (data) {
                    if (data.success) {
                        var paymentResult = data.payment_result;

                        if (paymentResult.key != '') {
                            if(reportBuy.planId.includes('credits')) {
                                // do nothing
                                creditDetails.key = paymentResult.key;
                                user1.selectedPlan.downloadCreditsDetails.push(creditDetails)
                                apiService.users.update({ _id: user1._id }, user1, function (response) {
                                    window.localStorage.setItem('user', JSON.stringify(user1));
                                    alertService('success', 'Upgrade Plan', 'Credits updated successfully.');
                                }, function (error) {
                                });
                            } else {
                                // apiService.get('getBySubId', { key: paymentResult.key }).then(function (subscriptionData) {

                                //     var user2 = user1;
                                //     var oldKey = user1.selectedPlan.key;
                                //     user2.selectedPlan.key = paymentResult.key
                                //     user2.selectedPlan.plan = subscriptionData.response.planId
                                //     user2.selectedPlan.subscription = subscriptionData.response


                                //     user2.selectedPlan.isPaymentDue = false
                                //     if (user2.selectedPlan.plan == 'singleSurvey') {
                                //         //var sub_data = user1.selectedPlan.details;
                                //         //sub_data.push(paymentResult);
                                //         //user2.selectedPlan.details = sub_data;
                                //         user2.selectedPlan.singleCredits = 1;
                                //         user2.selectedPlan.singleSurveys = 0;
                                //     }
                                //     $scope.isDisabled = false;
                                //     apiService.users.update({ _id: user2._id }, user2, function (response) {
                                //         window.localStorage.setItem('user', JSON.stringify(user2));
                                //         $scope.cancelSubscription(oldKey);
                                //     }, function (error) {
                                //         console.log("error :::", error);
                                //     });
                                //     alertService('success', 'Upgrade Plan', 'Plan upgraded successfully.');
                                //     // $location.path('/dashboard');
                                // });
                            }
                        }
                    } else {
                        alertService('warning', 'Buying Credits failed', 'You have cancelled the payment.');
                        alert('You have cancelled the payment.');
                        $scope.isDisabled = false;
                    }
                },
                {
                    vat_number_field_hidden: false,
                    email_field_hidden: true,
                    email_field_optional: true,
                    buyer_name_field_visible: true,
                    buyer_name_field_required: true,
                    buyer_email: user1.email,
                    custom_fields: [{ 'key': 'ciphe_number', 'value': user1.ciphe_number }]
                }
            );
         }, function () {});
    }

    $scope.smeUpgrade = function () {
        // to upgrade page
        $location.path('/subscription-upgrade/smeMonthly');
    }

    $scope.whtlblUpgrade = function () {
        // to upgrade page
        $location.path('/subscription-upgrade/white');
    }

    $scope.showPlanUpgrade = function () {
        var boolShow = false;
        if ($rootScope.user && $rootScope.user.selectedPlan.plan == "none") {
            boolShow = true;
        }
        if ($rootScope.user && $rootScope.user.is_admin) {
            boolShow = false;
        }
        if ($rootScope.user && $rootScope.user.isDummy) {
            boolShow = false;
        }
        if($rootScope.user && $rootScope.user.isDesigner) {
            boolShow = false;
        }
        if($rootScope.user && $rootScope.user.isDesigner && $rootScope.user.isDummy) {
            boolShow = true;
        }
        if($rootScope.user && $rootScope.user.others.trainee) {
            boolShow = false;
        }
        return boolShow
    }

    $scope.showPastDueMessage = function () {
        let boolShow1 = false;
        if (!!$rootScope.user && !!$rootScope.user.selectedPlan.isPaymentDue && $rootScope.user.selectedPlan.plan != 'none') {
            boolShow1 = true;
        }
        return boolShow1
    }

    $scope.changeTheme = function (color) {
        $rootScope.user.theme = color;
        userService.updateStorage($rootScope.user);
    };

    $scope.changeFont = function (fontType) {
        $rootScope.user.ui_theme.fontFamily = fontType;
        userService.updateStorage($rootScope.user);
    };

    $scope.changeBackground = function (style) {
        $rootScope.user.ui_theme.background = style.background;
        $rootScope.user.ui_theme.color = style.color;
        $rootScope.user.ui_theme.opposite = style.opposite;
        userService.updateStorage($rootScope.user);
    };

    $scope.showBuyButton = function () {
        if ($rootScope.user && $rootScope.user.selectedPlan.plan === 'singleSurvey') {
            return true;
        }
        return false;
    }

    $scope.buySingleSurvey = function () {
        var user1 = $rootScope.user;
        taxamo.doSubscriptionCheckout(
            'singleSurvey',
            'singleSurvey',
            'braintree',
            function (data) {
                if (data.success) {
                    // TODO: Still need to attach transaction_key
                    //user.transaction_key = data.payment_result.key;
                    var subscription_data = user1.selectedPlan.details;
                    subscription_data.push(data.payment_result);

                    user1.is_subscribed = true;
                    var oneUp = 1
                    if (user1.selectedPlan.singleCredits != undefined) {
                        var credit = user1.selectedPlan.singleCredits;
                        oneUp = parseInt(credit) + 1
                    }
                    user1.selectedPlan = {
                        key: data.payment_result.key,
                        plan: 'singleSurvey',
                        singleCredits: oneUp,
                        singleSurveys: user1.selectedPlan.singleSurveys
                    };
                    $rootScope.user = user1
                    alertService('success', 'Payment success!', 'Single Survey Created!');
                    braintreeService.getSubscriptionDetails(user1);
                } else {
                    alertService('warning', 'Transaction', 'Cancelled!');
                }
            }, {
            vat_number_field_hidden: false,
            email_field_hidden: true,
            email_field_optional: true,
            buyer_name_field_visible: true,
            buyer_name_field_required: true,
            buyer_email: user1.email,
            custom_fields: [{
                'key': 'ciphe_number',
                'value': user1.ciphe_number
            }]
        }
        );
    }

    $scope.moveTo = function (manufacture) {
        if (manufacture.isMerchant || manufacture.isMcsUmbrellaComp) {
            $location.path('/subscribed-page-merchant/' + manufacture._id);
        } else {
            $location.path('/subscribed-page/' + manufacture._id);
        }
    };

    $scope.subscriptionNotFoundMessage = 'You have no subscription or your old subscription plan has now expired. Please re-engage your subscription or choose your new preferred plan before continuing to use the software.';
    $scope.subscriptionPastDue = 'Your card payment method has expired. Please go to your accounts tab and enter your active card details to continue to use the software'

    }

    ModalUpdateCompanyController.$inject = ['$scope', '$modalInstance', 'data', 'apiService'];

    function ModalUpdateCompanyController ($scope, $modalInstance, data, apiService) {

        $scope.user = data.user
        $scope.name = $scope.user.first_name + ' '+ $scope.user.surname;
        $scope.findList = [
            'Facebook advert',
            'Facebook Group',
            'Instragm advert',
            'Twitter',
            'Word of mouth (Friend / Colleague)',
            'An email from Heat Engineer',
            'A Google search',
            'LinkedIn Advert',
            'LinkedIn post',
            'The Heating Academy Northampton',
            'Heat Geek',
            'IMI-Hyronics',
            'A Manufacturer',
            'A Merchant',
            'Other'
          ]

        $scope.ok = function () {
            $scope.user.company_name
            $scope.user.inviters[0].company = $scope.user.company_name
            console.log($scope.user);
            apiService.users.update({ _id: $scope.user._id }, $scope.user, function (response) {
                $modalInstance.close($scope.user);
            }, function (error) {
                console.log('error::: ', error);
            });
        };

        $scope.cancel = function () {
            $modalInstance.dismiss('cancel');
        };
    }


    /**
     * Complete Report Controller
     */

    CompleteReportController.$inject = ['$rootScope', '$scope', '$location', 'apiService', 'userService', 'commonService', 'alertService'];

    function CompleteReportController ($rootScope, $scope, $location, apiService, userService, commonService, alertService) {

        $scope.showSummary = function (survey) {
            $location.path('/summary/' + survey._id + '/1');
        };

        $scope.changeTheme = function (color) {
            $rootScope.user.theme = color;
            userService.updateStorage($rootScope.user);
        };

        $scope.changeFont = function (fontType) {
            $rootScope.user.ui_theme.fontFamily = fontType;
            userService.updateStorage($rootScope.user);
        };

        $scope.changeBackground = function (style) {
            $rootScope.user.ui_theme.background = style.background;
            $rootScope.user.ui_theme.color = style.color;
            userService.updateStorage($rootScope.user);
        };

        $scope.sendBack = function (survey) {
            survey.surveys.request_company = undefined;
            survey.surveys.is_request_to_complete = false;
            apiService.update('surveys', survey).then(function (response) {

                var index = $scope.surveys.indexOf(survey);
                $scope.surveys.splice(index, 1);

                if ($scope.surveys.length === 0)
                    $scope.surveys = null;

                alertService('success', 'Sent back', 'Survey sent back successfully!');
            }, commonService.onError);
        };

        apiService.requestToComplete.query(function (response) {
            $scope.surveys = response;
            response.$promise.then(function (res) { });
        }, function (error) { });
    }

    /**
     * Buy more credit controller
     */

    ModalBuyReportController.$inject = ['$scope', '$modalInstance'];

    function ModalBuyReportController ($scope, $modalInstance) {

        $scope.reportType = [
            { planId: 'credits-10', planDesc: '£50 + VAT - 10 credits', price: '60', show: true, credit: "10" },
            { planId: 'credits-20', planDesc: '£95 + VAT - 20 credits (save 5%)', price: '114', show: true, credit: "20" },
            { planId: 'credits-30', planDesc: '£127.5 + VAT - 30 credits (save 15%)', price: '153', show: true, credit: "30" },
            { planId: 'credits-40', planDesc: '£160 + VAT - 40 credits (save 20%)', price: '192', show: true, credit: "40" },
            { planId: 'credits-50', planDesc: '£187.5 + VAT - 50 credits (save 25%)', price: '225', show: true, credit: "50" }
        ]

        $scope.reportBuy = {}
        $scope.ok = function () {
            var reportValue = JSON.parse($scope.reportBuy)
            $modalInstance.close(reportValue);
        };

        $scope.cancel = function () {
            $modalInstance.dismiss('cancel');
        };
    }
})();
