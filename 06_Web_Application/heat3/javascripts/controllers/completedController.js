(function () {
    'use strict';
    angular.module('cloudheatengineer').controller('CompletedController', CompletedController);
    angular.module('cloudheatengineer').controller('ModalCopyReportInstanceController', ModalCopyReportInstanceController);
    angular.module('cloudheatengineer').controller('ModalSendReportInstanceController', ModalSendReportInstanceController);
    angular.module('cloudheatengineer').controller('MCSController', MCSController);
    angular.module('cloudheatengineer').controller('ModalSurveyLogsController', ModalSurveyLogsController);

    MCSController.$inject = ['$rootScope', '$scope', '$routeParams', 'apiService', 'commonService', 'userService', 'calculationHelperService', 'mcs', '_', 'calculationService', '$location'];

    function MCSController ($rootScope, $scope, $routeParams, apiService, commonService, userService, calculationHelperService, mcs, _, calculationService, $location) {

        $rootScope.heatmanagerview = true;
        $scope.calculateAll = function (temp) {
            _.each($scope.survey.surveys.domestic_hot_water.flow_temperature_collection, function (item) {
                if (item.temp == temp) {
                    $scope.survey.surveys.domestic_hot_water.flow_temperature_for_hot_water = item;
                }
            });
            calculate();
        };
        var defaultArrays = [],
            environment = 'production' // development, staging or production
            ,
            star = '',
            url = '';

        var technology = null;
        var titleRowArray = [];

        if (environment === 'development')
            url = 'http://localhost:3000/images/mcs2.png';
        else if (environment === 'staging')
            url = 'http://heat-engineer-staging.herokuapp.com/images/mcs2.png';
        else if (environment === 'production')
            url = 'https://www.heat-engineer.com/images/mcs2.png';

        function getDataUri (url, callback) {
            var image = new Image();
            image.onload = function () {

                var canvas = document.createElement('canvas');
                canvas.width = this.naturalWidth;
                canvas.height = this.naturalHeight;

                canvas.getContext('2d').drawImage(this, 0, 0);

                callback(canvas.toDataURL('image/png').replace(/^data:image\/(png|jpg);base64,/, ''));
                callback(canvas.toDataURL('image/png'));
            };
            image.src = url;
        }

        function calculate () {
            calculationService.calculate_domestic_hot_water();
            $scope.survey = calculationService.getAll().survey;
        }

        init();
        $scope.formatDate = function (date) {

            if (isNaN(date[date.length - 1]) && date[date.length - 1] != '-' && date.length > 0) {
                $scope.survey.surveys.mcs.heat_pump[38] = date.slice(0, date.length - 1)
                return
            }

            if ($scope.survey.surveys.mcs.heat_pump[38].length > 9) {
                $scope.dateValid = true
            } else {
                $scope.dateValid = false
            }
            let dateSplit = date.split('-')
            for (let i = 0; i < dateSplit.length; i++) {
                let changeDate
                dateSplit[i] = parseInt(dateSplit[i])
                if (i == 0 && dateSplit[0] > 31) {
                    changeDate = (dateSplit[0] / 10).toString()

                    dateSplit[1] = dateSplit[0] % 10
                    if (parseInt(changeDate.split('.')[0]) < 10) {
                        dateSplit[0] = '0' + changeDate.split('.')[0]
                    } else {
                        dateSplit[0] = changeDate.split('.')[0]
                    }
                    if (dateSplit[1] > 1) {
                        dateSplit[1] = '0' + dateSplit[1]
                        dateSplit[2] = ''
                    }
                    $scope.survey.surveys.mcs.heat_pump[38] = dateSplit.join('-')
                    break
                }
                if (i == 1 && dateSplit[1] > 12) {
                    changeDate = (dateSplit[1] / 10).toString()
                    dateSplit[2] = dateSplit[1] % 10
                    if (parseInt(changeDate.split('.')[1]) < 10) {
                        dateSplit[1] = '0' + changeDate.split('.')[0]
                    } else {
                        dateSplit[1] = changeDate.split('.')[0]
                    }
                    $scope.survey.surveys.mcs.heat_pump[38] = dateSplit.join('-')
                    break
                }
            }

        }

        function init () {
            var room_index;

            apiService.get('surveys', {
                _id: $routeParams.id
            }).then(function (survey) {
                $scope.survey = survey;
                calculationService.initialize(survey);
                $scope.tempCollection = [];
                _.each($scope.survey.surveys.domestic_hot_water.flow_temperature_collection, function (temp) {
                    $scope.tempCollection.push(temp.temp)
                });
                if ($scope.survey.surveys.proposed_install_type.toLowerCase() == 'biomass') {
                    technology = mcs.biomass;
                    titleRowArray = [0, 18, 24, 26, 60, 73, 77, 81];
                } else {
                    titleRowArray = [0, 8, 15, 18, 31, 35, 40, 46, 54, 63, 72, 85, 93, 94];
                    technology = mcs.heat_pump;
                }
                getDataUri(url, function (dataUri) {
                    technology.content[1].image = dataUri;
                });

                room_index = $scope.survey.surveys.worst_performing_room;
                if (!!room_index) {
                    $scope.worst_performing_room = $scope.survey.surveys.rooms[room_index];
                    for (var i = 0; i < $scope.worst_performing_room.emitters.star_rating; i++)
                        star += '*';
                }

                var _dhwHeatSuppliedHp = $scope.survey.surveys.domestic_hot_water.heat_supplied_by_hp,
                    _heatSuppliedHp = $scope.survey.surveys.summary_results.heat_supplied_by_hp_excluding_auxiliary_heaters,
                    _annualEnergy = _heatSuppliedHp + _dhwHeatSuppliedHp;

                $scope.annual_energy = calculationHelperService.dataParseFloat(_annualEnergy, 2);

                var address_one = calculationHelperService.ifUndefinedDefaultString($scope.survey.surveys.address_one),
                    address_two = $scope.survey.surveys.address_two ? ', ' + $scope.survey.surveys.address_two : '',
                    address_three = $scope.survey.surveys.address_three ? ', ' + $scope.survey.surveys.address_three : '';

                $scope.survey.surveys.mcs = undefined;
                if ($scope.survey.surveys.proposed_install_type.toLowerCase() != 'biomass') {
                    defaultArrays = [{
                        count: 1,
                        default: dataToString($scope.survey.surveys.client_name)
                    },
                    {
                        count: 3,
                        default: address_one
                    },
                    {
                        count: 4,
                        default: address_two
                    },
                    {
                        count: 5,
                        default: address_three
                    },
                    {
                        count: 6,
                        default: ''
                    },
                    {
                        count: 7,
                        default: $scope.survey.surveys.post_code
                    },
                    {
                        count: 9,
                        default: ''
                    },
                    {
                        count: 10,
                        default: ''
                    },
                    {
                        count: 11,
                        default: ''
                    },
                    {
                        count: 12,
                        default: ''
                    },
                    {
                        count: 13,
                        default: ''
                    },
                    {
                        count: 15,
                        default: 'Continuous'
                    },
                    {
                        count: 16,
                        default: dataToString($scope.survey.surveys.external_design_temperature)
                    },
                    {
                        count: 17,
                        default: $scope.survey.surveys.total_power_watts ? (($scope.survey.surveys.total_power_watts / 1000).toFixed(2)).toString() : ''
                    },
                    {
                        count: 19,
                        default: ''
                    },
                    {
                        count: 20,
                        default: dataToString($scope.survey.surveys.maximum_designed_flow_temperature ? $scope.survey.surveys.maximum_designed_flow_temperature : '')
                    },
                    {
                        count: 21,
                        default: 'YES'
                    },
                    {
                        count: 23,
                        default: $scope.survey.surveys.domestic_hot_water.flow_temperature_for_hot_water.temp ? $scope.survey.surveys.domestic_hot_water.flow_temperature_for_hot_water.temp.toString() : ''
                    },
                    {
                        count: 24,
                        default: 'YES'
                    },
                    {
                        count: 26,
                        default: ''
                    },
                    {
                        count: 27,
                        default: ''
                    },
                    {
                        count: 29,
                        default: ''
                    },
                    {
                        count: 30,
                        default: ''
                    },
                    {
                        count: 31,
                        default: ''
                    },
                    {
                        count: 34,
                        default: 'YES'
                    },
                    {
                        count: 36,
                        default: ''
                    },
                    {
                        count: 37,
                        default: ''
                    },
                    {
                        count: 38,
                        default: ''
                    },
                    ];
                    $scope.dateValid = false
                    if (_.isUndefined($scope.survey.surveys.mcs))
                        $scope.survey.surveys.mcs = {};
                    if (!_.isUndefined($scope.survey.surveys.mcs.biomass))
                        $scope.survey.surveys.mcs.biomass = undefined;

                    $scope.survey.surveys.mcs.heat_pump = [];

                    _.each(defaultArrays, function (a) {
                        $scope.survey.surveys.mcs.heat_pump[a.count] = $scope.survey.surveys.mcs.heat_pump[a.count] ?
                            $scope.survey.surveys.mcs.heat_pump[a.count] :
                            a.default;
                    })
                } else {

                    var clientName = $scope.survey.surveys.client_name,
                        title = !$scope.survey.surveys.title || $scope.survey.surveys.title == '' ? $scope.survey.surveys.title : $scope.survey.surveys.title + ', ';
                    clientName = title + clientName;

                    defaultArrays = [{
                        count: 1,
                        default: dataToString(clientName)
                    },
                    {
                        count: 3,
                        default: dataToString(address_one)
                    },
                    {
                        count: 4,
                        default: dataToString(address_two)
                    },
                    {
                        count: 7,
                        default: dataToString($scope.survey.surveys.post_code)
                    },
                    {
                        count: 20,
                        default: 'YES'
                    },
                    {
                        count: 21,
                        default: 'YES'
                    },
                    {
                        count: 22,
                        default: 'YES'
                    },
                    {
                        count: 23,
                        default: 'Continuous'
                    },
                    {
                        count: 27,
                        default: 'CIBSE Domestic Heating Design Guide 2014 (Heat Engineer Software v1.0)'
                    },
                    {
                        count: 28,
                        default: dataToString($scope.survey.surveys.external_design_temperature)
                    },
                    {
                        count: 29,
                        default: '21'
                    },
                    {
                        count: 30,
                        default: $scope.survey.surveys.total_power_watts ? (($scope.survey.surveys.total_power_watts / 1000).toFixed(2)).toString() : ''
                    },
                    {
                        count: 32,
                        default: '0'
                    },
                    {
                        count: 33,
                        default: '0'
                    },
                    {
                        count: 36,
                        default: dataToString($scope.survey.surveys.total_energy_kilowatts)
                    },
                    {
                        count: 37,
                        default: 'Degree Day Data'
                    },
                    {
                        count: 39,
                        default: dataToString($scope.survey.surveys.domestic_hot_water.hot_water_annual_demand)
                    },
                    {
                        count: 40,
                        default: 'MCS calculation'
                    },
                    {
                        count: 41,
                        default: '100'
                    },
                    {
                        count: 42,
                        default: '100'
                    },
                    {
                        count: 46,
                        default: dataToString($rootScope.cloud_data.biomass_type_details[$scope.survey.surveys.biomass_type].gross_calorific_value)
                    },
                    {
                        count: 47,
                        default: dataToString($rootScope.cloud_data.biomass_type_details[$scope.survey.surveys.biomass_type].bulk_density)
                    },
                    {
                        count: 48,
                        default: '85.00'
                    },
                    {
                        count: 49,
                        default: dataToString($scope.survey.surveys.summary_results.proportions_annual_fuel_requirement_mass_of_bhs)
                    },
                    {
                        count: 50,
                        default: dataToString($scope.survey.surveys.summary_results.proportions_annual_fuel_requirement_volume_of_bhs)
                    },
                    {
                        count: 51,
                        default: '94'
                    },
                    {
                        count: 52,
                        default: '2.64'
                    }, // biomass summary to be changed
                    {
                        count: 53,
                        default: '0.0041'
                    }, // biomass summary to be changed
                    {
                        count: 61,
                        default: dataToString($scope.survey.surveys.summary_results.space_heating_and_water_heating_demand_provided_by_bhs)
                    },
                    {
                        count: 62,
                        default: dataToString($scope.survey.surveys.summary_results.proportions_heat_supplied_by_bhs)
                    },
                    {
                        count: 63,
                        default: '85.00'
                    },
                    {
                        count: 64,
                        default: dataToString($scope.survey.surveys.summary_results.proportions_annual_fuel_requirement_mass_of_bhs)
                    },
                    {
                        count: 65,
                        default: dataToString($scope.survey.surveys.summary_results.proportions_annual_fuel_requirement_volume_of_bhs)
                    },
                    {
                        count: 66,
                        default: '0'
                    }
                    ];
                    if (_.isUndefined($scope.survey.surveys.mcs))
                        $scope.survey.surveys.mcs = {};
                    if (!_.isUndefined($scope.survey.surveys.mcs.heat_pump))
                        $scope.survey.surveys.mcs.heat_pump = undefined;

                    $scope.survey.surveys.mcs.biomass = [];

                    _.each(defaultArrays, function (a) {
                        $scope.survey.surveys.mcs.biomass[a.count] = $scope.survey.surveys.mcs.biomass[a.count] ?
                            $scope.survey.surveys.mcs.biomass[a.count] :
                            a.default;
                    });
                }

            }, commonService.onError);
        }
        $scope.starRating = function (num) {
            return new Array(num);
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

        $scope.action = function (survey, act) {
            var mcs;
            var surveys = survey.surveys,
                technology_body = technology.content[2].table.body;
            if (act === 'export') {
                _.each(survey.surveys.mcs.heat_pump, function (data, index) {
                    if (index == 9 && data != '') {
                        survey.surveys.address_one = data
                    } else if (index == 10 && data != '') {
                        survey.surveys.address_two = data
                    } else if (index == 11 && data != '') {
                        survey.surveys.address_three = data
                    } else if (index == 17) {
                        survey.surveys.total_power_watts = data * 1000
                    } else if (index == 13 && data != '') {
                        survey.surveys.post_code = data
                    } else if (index == 20) {
                        survey.surveys.maximum_designed_flow_temperature = parseInt(data)
                    }
                })
            } else {

                if (surveys.proposed_install_type.toLowerCase() == 'biomass')
                    mcs = surveys.mcs.biomass;
                else
                    mcs = surveys.mcs.heat_pump;

                _.each(technology_body, function (heatElement, heatIndex) {
                    if (heatIndex == 38 && surveys.proposed_install_type.toLowerCase() != 'biomass') {
                        technology_body[heatIndex][1] = star;
                    } else if (_.contains(titleRowArray, heatIndex)) {
                        // do nothing
                    } else if (!!_.find(defaultArrays, {
                        count: heatIndex
                    })) {
                        technology_body[heatIndex][1] = mcs[heatIndex];
                    } else {
                        technology_body[heatIndex][1] = calculationHelperService.ifUndefinedDefaultString(mcs[heatIndex]);
                    }
                });
            }
            let requestData = $scope.survey
            $scope.survey.surveys.page = 'mcs';
            if (act == 'export') {
                requestData = {
                    _id: $scope.survey._id,
                    survey: $scope.survey,
                    act: 'export'
                }
            }
            apiService.update('surveys', requestData).then(function (res) {
                if (act == 'download') {
                    pdfMake.createPdf(technology).download(survey.surveys.project_name + '(' + survey.surveys.proposed_install_type + ')' + ' - MCS-Compliance-Certificate');
                } else if (act == 'export') {

                    let fileName = $scope.survey.surveys.project_name + '(' + $scope.survey.surveys.proposed_install_type + ')' + 'MCS-Compliance-Certificate';
                    let fileNameDashed = fileName.replace(/\s+/g, '-').toLowerCase();
                    apiService.downloadmcs.post({file: fileNameDashed}, function (res) {
                        // let leftDiv = document.getElementById("downloadLink");
                        // let a = document.createElement('a');
                        // a.setAttribute('href', window.location.origin + '/files/' + fileNameDashed + '.xlsx');
                        // a.appendChild(document.createTextNode("Download file"));
                        // leftDiv.appendChild(a);
                        if(res) {
                            window.open(window.location.origin + '/files/' + fileNameDashed + ".xlsx", '_blank');
                        }
                    });
                }
            }, commonService.onError);

        };

        function dataToString (data, notValue, extValue) {
            var not = notValue || '0';
            var ext = extValue || '';
            var data = data || '';
            return data ? data.toString() + ext : not;
        }
    }

    CompletedController.$inject = ['$timeout', '$location', '$rootScope', '$scope', '$modal', '$filter', 'userService', 'surveyService', 'apiService', 'summaryHelperService', 'report', 'calculationService', '_', 'alertService', 'commonService', 'multipartFormService', '$window'];

    function CompletedController ($timeout, $location, $rootScope, $scope, $modal, $filter, userService, surveyService, apiService, summaryHelperService, r, calculationService, _, alertService, commonService, multipartFormService, $window) {

        $rootScope.showHeader = false;
        $rootScope.showFooter = false;
        $rootScope.heatmanagerview = true;
        $scope.trainee = JSON.parse(window.localStorage.getItem('trainee'))
        $rootScope.isTraineeSelected = window.localStorage.getItem('isTraineeSelected')
        $scope.canUseCredit = true;

        $scope.user = JSON.parse(window.localStorage.getItem('user'))
        $rootScope.heading_name = $scope.user.first_name +' '+ $scope.user.surname
        $rootScope.heading_company = $scope.user.company_name
        if($rootScope.isTraineeSelected == '1' ) {
            $rootScope.heading_company = $scope.user.traineeTo.company
        }

        $scope.sme = false

        // if($scope.user.designerPermissions && $scope.user.designerPermissions.length > 0) {
        //     let useCreditpermission = $scope.user.designerPermissions.filter(function(d) {
        //         return d.access == 'useCredit';
        //     })
        //     if(useCreditpermission[0].value == 'yes') {
        //         $scope.canUseCredit = true;
        //     }
        // }

        //    fetch('https://s3.amazonaws.com/heat-engineer-s3/5614BE05-F9FF-4042-AD0D-D5976E3EE43E.jpg', {}).then(function(res){
        //        console.log(res);
        //    });

        dataInit()

        var today = new Date();
        var dd = today.getDate();
        var mm = today.getMonth() + 1; //January is 0!
        var gDataURI;

        var yyyy = today.getFullYear();
        if (dd < 10) {
            dd = '0' + dd;
        }
        if (mm < 10) {
            mm = '0' + mm;
        }
        today = dd + '/' + mm + '/' + yyyy;
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
        function dataInit () {

            let plan = $scope.user.selectedPlan.plan;

            if (plan == 'MonthlyPaymentPlanStandard'
                || plan == 'smallOrgYearly'
                || plan == 'manufacturerYearly') {
                $scope.sme = true;
            }

            if (plan.includes('sme')) {
                $scope.sme = true;
            }
            $scope.user = JSON.parse(window.localStorage.getItem('user'))
            $scope.usedCredit = $scope.user.selectedPlan.UsedCreditDetails.length
            $scope.remaining = $scope.user.selectedPlan.availableDownloadCredits
            $scope.creditCount = $scope.user.selectedPlan.totalDownloadCredits
        }

        $scope.useCredit = function (survey, idx) {
            apiService.useCredit.post({userId: $scope.user._id, surveyId: survey._id}, function (response) {
                if(response.success) {
                    window.localStorage.setItem('user', JSON.stringify(response.data));
                    $rootScope.user = response.data;
                    $scope.surveys[idx].surveys.useCredit = true;
                    alertService('success', 'Credit', response.message)
                } else {
                    alertService('warning', 'Credit', response.message)
                }
            }, commonService.onError);
        }

        $scope.openComment = function (survey) {
            $scope.survey = survey

            var modalOptions = {};
            modalOptions.templateUrl = '/partials/views/summary/components/_modal_manufacturer_comment';
            modalOptions.controller = 'ModalManufacturerCommentController';
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

            modalInstance.result.then(function (comment) {

                $scope.survey.surveys.commentsMemberReply = true

                apiService.surveysComments.save({
                    message: comment.message,
                    msgDate: new Date().toString(),
                    user_id: $scope.user._id,
                    step: comment.step,
                    survey_id: $scope.survey._id
                }, function (response) {
                    if (response.success) {
                        alertService('success', 'Comments Sent.', response.message);
                        apiService.update('surveys', $scope.survey).then(function (response) {

                        }, commonService.onError);

                    }
                }, function (error) {
                });
            }, function () { });

        }

        $scope.showLogs = async function (survey) {
            $scope.logs = [];
            await apiService.get('surveyLogs', { _id: survey._id }).then(function (response) {
                console.log('res ::::', response);
                $scope.logs = response.data
            });
            var modalOptions = {};
            modalOptions.templateUrl = '/partials/views/completed/components/_survey_logs';
            modalOptions.controller = 'ModalSurveyLogsController';
            modalOptions.size = 'md';

            var modalInstance = $modal.open({
                animation: true,
                templateUrl: modalOptions.templateUrl,
                controller: modalOptions.controller,
                size: modalOptions.size,
                resolve: {
                    data: function () {
                        return {
                            logs: $scope.logs
                        }
                    }
                }
            });

            modalInstance.result.then(function () {

            }, function () { });

        }

        $scope.resend = function (survey) {
            // survey.surveys.comments.push(comments)
            if (!$rootScope.user.isManufacturer) {
                survey.surveys.editState = true
            }

            survey.surveys.commentsManufacturerRead = false
            survey.surveys.commentsMemberReply = false
            apiService.update('surveys', survey).then(function (response) {
                init()
                alertService('success', 'Comment', 'Comments Resent successfully!');
            }, commonService.onError);
        }

        $scope.archive = function (survey) {
            survey.surveys.status = 'ARCHIVED';

            apiService.update('surveys', survey).then(function (response) {

                var index = $scope.surveys.indexOf(survey);
                $scope.surveys.splice(index, 1);

                if ($scope.surveys.length === 0)
                    $scope.surveys = null;

                alertService('success', 'Survey', 'Survey is archived successfully!');
            }, commonService.onError);
        };

        function convertImgToBase64URL (url, callback, outputFormat) {
            var canvas = document.createElement('CANVAS'),
                ctx = canvas.getContext('2d'),
                img = new Image;
            img.setAttribute('crossorigin', 'anonymous')
            img.onload = function () {
                var dataURL;
                canvas.height = img.height;
                canvas.width = img.width;
                ctx.drawImage(img, 0, 0);
                dataURL = canvas.toDataURL(outputFormat);
                callback(dataURL);
                canvas = null;
            }
            img.onerror = function () {
                callback(undefined)
            }
            img.src = url + '?' + new Date().getTime();
        }
        var url = $rootScope.user.logo != 'prof-logo.png' ? 'https://s3.amazonaws.com/heat-engineer-s3/' + $rootScope.user.logo : 'https://www.heat-engineer.com/images/prof-logo.png';
        init()

        function init () {
            convertImgToBase64URL(url, function (dataUri) {
                if (!!dataUri) {
                    gDataURI = dataUri;
                }
                if (!dataUri) {
                    convertImgToBase64URL("https://www.heat-engineer.com/images/prof-logo.png", function (data) {
                        gDataURI = data
                    })
                }
            });
        }

        let query = {
            limit: 20,
            page: 1,
            email: $rootScope.user.email,
            search: '',
            surveyStatus: 'COMPLETED',
            isTrainee: false
        }

        function surveyInit () {
            if ($rootScope.isTraineeSelected == '1') {
                query.isTrainee = true
                if ($rootScope.user.traineeTo) {
                    query.email = $rootScope.user.traineeTo.email
                }
            }
            // if ($rootScope.isTraineeSelected == '2') {
            //     query.isTrainee = false
            //     if ($rootScope.user.designerTo) {
            //         query.email = $rootScope.user.designerTo.email
            //     }
            // }
            surveyService.getAll(query).then(function (res) {
                $scope.searchVal = ''
                if (res['count'] != 0) {
                    let surveyData = Object.keys(res['surveys']).map(i => {
                        return res['surveys'][i]
                    })
                    $scope.surveys = surveyData;
                    $scope.paginationPage = []
                    let totalPage = Math.floor(parseInt(res['count']) / query.limit)
                    let obj = {}
                    for (let i = 0; i < totalPage; i++) {
                        obj[i] = i
                        $scope.paginationPage.push(obj)
                        obj = {}
                    }
                    if (parseInt(res['count']) % 20) {
                        obj[totalPage] = totalPage + 1
                        $scope.paginationPage.push(obj)
                        obj = {}
                    }
                } else
                    $scope.surveys = null;
                $scope.currentPaginationPage = 1
            });
        }

        surveyInit();

        // surveyService.getAll(query).then(function(res) {
        //     $scope.searchVal = ''
        //     if (res['count'] != 0) {
        //         let surveyData = Object.keys(res['surveys']).map(i => {
        //             return res['surveys'][i]
        //         })
        //         $scope.surveys = surveyData;
        //         $scope.paginationPage = []
        //         let totalPage = Math.floor(parseInt(res['count']) / query.limit)
        //         let obj = {}
        //         for (let i = 0; i < totalPage; i++) {
        //             obj[i] = i
        //             $scope.paginationPage.push(obj)
        //             obj = {}
        //         }
        //         if (parseInt(res['count']) % 20) {
        //             obj[totalPage] = totalPage + 1
        //             $scope.paginationPage.push(obj)
        //             obj = {}
        //         }
        //     } else
        //         $scope.surveys = null;
        //     $scope.currentPaginationPage = 1
        // });

        $scope.newPage = function (page) {
            let searchValue = $scope.searchVal
            let query = {}
            if (searchValue) {
                query = {
                    limit: 20,
                    page: page,
                    email: $rootScope.user.email,
                    search: $scope.searchVal,
                    surveyStatus: 'COMPLETED'
                }
            } else {
                query = {
                    limit: 20,
                    page: page,
                    email: $rootScope.user.email,
                    search: '',
                    surveyStatus: 'COMPLETED'
                }
            }
            surveyService.getAll(query).then(function (res) {
                if (res['count'] != 0) {
                    let surveyData = Object.keys(res['surveys']).map(i => {
                        return res['surveys'][i]
                    })
                    $scope.surveys = surveyData;
                } else
                    $scope.survey = null
                $scope.currentPaginationPage = page
            })
        }
        $scope.nextPage = function () {
            let page = parseInt($scope.currentPaginationPage) + 1
            let searchValue = $scope.searchVal
            let query = {}
            if (searchValue) {
                query = {
                    limit: 20,
                    page: page,
                    email: $rootScope.user.email,
                    search: $scope.searchVal,
                    surveyStatus: 'COMPLETED'
                }
            } else {
                query = {
                    limit: 20,
                    page: page,
                    email: $rootScope.user.email,
                    search: '',
                    surveyStatus: 'COMPLETED'
                }
            }
            surveyService.getAll(query).then(function (res) {
                if (res['count'] != 0) {
                    let surveyData = Object.keys(res['surveys']).map(i => {
                        return res['surveys'][i]
                    })
                    $scope.surveys = surveyData;
                } else
                    $scope.survey = null
                $scope.currentPaginationPage = page
            })
        }
        $scope.previousPage = function () {
            let page = parseInt($scope.currentPaginationPage) - 1
            let searchValue = $scope.searchVal
            let query = {}
            if (searchValue) {
                query = {
                    limit: 20,
                    page: page,
                    email: $rootScope.user.email,
                    search: $scope.searchVal,
                    surveyStatus: 'COMPLETED'
                }
            } else {
                query = {
                    limit: 20,
                    page: page,
                    email: $rootScope.user.email,
                    search: '',
                    surveyStatus: 'COMPLETED'
                }
            }
            surveyService.getAll(query).then(function (res) {
                if (res['count'] != 0) {
                    let surveyData = Object.keys(res['surveys']).map(i => {
                        return res['surveys'][i]
                    })
                    $scope.surveys = surveyData;
                } else
                    $scope.survey = null
                $scope.currentPaginationPage = page
            })
        }
        $scope.filterComplete = function () {
            surveyService.getAll({
                limit: 20,
                page: 1,
                email: $rootScope.user.email,
                search: $scope.searchVal,
                surveyStatus: 'COMPLETED'
            }).then(function (res) {
                if (res['count'] != 0) {
                    let surveyData = Object.keys(res['surveys']).map(i => {
                        return res['surveys'][i]
                    })
                    $scope.surveys = surveyData;
                    $scope.paginationPage = []
                    let totalPage = Math.floor(parseInt(res['count']) / 20)
                    let obj = {}
                    for (let i = 0; i < totalPage; i++) {
                        obj[i] = i
                        $scope.paginationPage.push(obj)
                        obj = {}
                    }
                    if (parseInt(res['count']) % 20) {
                        obj[totalPage] = totalPage + 1
                        $scope.paginationPage.push(obj)
                        obj = {}
                    }
                } else
                    $scope.surveys = null;
                $scope.currentPaginationPage = 1

            })
        }
        $scope.moveTo = function (location, survey) {
            summaryHelperService.switchAndUpdateSurvey(null, location, survey).then(function () {
                $location.path('/' + location + '/' + survey._id);
            });
        };

        $scope.copyReport = function (survey) {

            var modalOptions = {};
            modalOptions.templateUrl = '/partials/views/completed/components/_modal_copy_report';
            modalOptions.controller = 'ModalCopyReportInstanceController';
            modalOptions.size = 'md';

            var modalInstance = $modal.open({
                animation: true,
                templateUrl: modalOptions.templateUrl,
                controller: modalOptions.controller,
                size: modalOptions.size
            });

            modalInstance.result.then(function (reportName) {
                apiService.surveys.save({
                    survey: survey,
                    name: reportName,
                    is_copied: true
                }, function (response) {
                    if (response.success) {
                        alertService('success', 'Survey Copied', response.message);
                        $scope.surveys.push(response.survey);
                    }
                }, function (error) { });
            }, function () { });
        };

        $scope.sendReport = function (survey) {
            apiService.get('surveysComments', {_id: survey._id}).then(function (surveyff) {
                $scope.commentsList = surveyff
            }, commonService.onError);
            var modalOptions = {};
            modalOptions.templateUrl = '/partials/views/completed/components/_modal_send_report';
            modalOptions.controller = 'ModalSendReportInstanceController';
            modalOptions.size = 'md';

            var modalInstance = $modal.open({
                animation: true,
                templateUrl: modalOptions.templateUrl,
                controller: modalOptions.controller,
                size: modalOptions.size,
                resolve: {
                    data: function () {
                        return {
                            survey: survey

                        }
                    }
                }
            });

            modalInstance.result.then(function (selectedList) {
                apiService.surveysMulti.save({
                    survey: survey,
                    name: survey.surveys.project_name,
                    is_copied: true,
                    manufacturers: selectedList
                }, function (response) {

                    if (response.success) {

                        alertService('success', 'Survey Sent to selected manufacturers', response.message);
                        // $scope.surveys.push(response.survey);
                        surveyInit()

                    }
                }, function (error) { });



            }, function () { });
        };
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
        $scope.loading = false
        $scope.downloadPDF = async function (survey, index, isShare = false) {
            var canDownPdf = true;
            var stepNo = '';

            if(!$scope.trainee){
                if($rootScope.user.isDesigner && !survey.surveys.useCredit) {
                    alertService('warning', 'Error ', 'Report cannot be downloaded until a credit used by the Admin');
                    return;
                }

                if($rootScope.user.selectedPlan.plan == 'manufacturerYearly') {
                    if(survey.surveys.useCredit == undefined || survey.surveys.useCredit == false) {
                        alertService('warning', 'Error ', 'Report cannot be downloaded until a credit used');
                        return;
                    }
                }
            }

            for (var i in survey.surveys.hasError) {
                if (survey.surveys.hasError[i] == true) {
                    canDownPdf = false;
                    stepNo = i
                    break;
                }
            }
            if (!canDownPdf) {
                alertService('warning', 'Error ', 'Report has error at ' + stepNo + ', please correct it and try again.');
                return;
            }
            $scope.loading = true
            $scope.index = index
            var room_index = survey.surveys.worst_performing_room;
            var heating_type;
            var worst_performing_room = survey.surveys.rooms[room_index];
            var star = '';
            var temp;
            var report = JSON.parse(JSON.stringify(r));
            $rootScope.isTraineeSelected = window.localStorage.getItem('isTraineeSelected');
            var watermarkText = {text: 'Education Use Only', color: 'grey', opacity: 0.2, bold: true, italics: false}
            if($rootScope.user.isDummy){
                report.watermark = watermarkText;
            } else if($rootScope.isTraineeSelected == '1'){
                report.watermark = watermarkText;
            }

            report.content[0].stack[11].image = gDataURI;
            report.content[0].stack[11].width = 150;
            report.content[0].stack[11].alignment = 'center';


            if (!!room_index && !!survey.surveys.rooms[room_index].linked_colors)
                worst_performing_room = survey.surveys.rooms[room_index - 1];
            else
                worst_performing_room = survey.surveys.rooms[room_index];

            if (!!worst_performing_room) {
                for (var i = 0; i < worst_performing_room.emitters.star_rating; i++)
                    star += '*';
            }

            var proposed_install_type = survey.surveys.proposed_install_type.toLowerCase();

            if (proposed_install_type.toLowerCase() == 'ashp' || proposed_install_type.toLowerCase() == 'gshp') {
                $scope.total_energy_required = parseFloat((survey.surveys.total_energy_kilowatts + survey.surveys.domestic_hot_water.annual_demand).toFixed(2));
                $scope.total_estimated_running_cost = survey.surveys.summary_results.cost_of_electricity_for_hp;
            } else if (proposed_install_type.toLowerCase() == 'biomass') {
                $scope.total_energy_required = parseFloat((survey.surveys.total_energy_kilowatts + survey.surveys.domestic_hot_water.hot_water_annual_demand).toFixed(2));
                $scope.total_estimated_running_cost = survey.surveys.summary_results.cost_of_biofuel_for_bhs;
            } else {
                $scope.total_energy_required = parseFloat((survey.surveys.total_energy_kilowatts + survey.surveys.domestic_hot_water.hot_water_annual_demand).toFixed(2));

                var htype = survey.surveys.fuel_compare.heating_type;

                _.each(htype, function (items) {
                    if (proposed_install_type.toLowerCase() == items.name.toLowerCase()) {
                        $scope.total_estimated_running_cost = items.annual_running_cost;
                    }
                });
            }

            let whiteLabeled = false;

            if ($rootScope.user.selectedPlan.plan == 'manufacturerYearly' || $rootScope.user.selectedPlan.plan.includes('WhiteLabeled')) {
                whiteLabeled = true;
            }

            report.header = function () {
                let dummyText = ''
                if ($rootScope.user.isDummy || $rootScope.isTraineeSelected == '1') {
                    dummyText = 'For Education purpose only.'
                }
                if (!whiteLabeled) {
                    return {
                        columns: [{
                            width: '*',
                            stack: [{
                                image: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAQYAAAAoCAYAAAAc5FTOAAAAAXNSR0IArs4c6QAAAAlwSFlzAAAXEgAAFxIBZ5/SUgAAGHlJREFUeAHtXQmYVNWVPrX1vkGzNDuIyiIqiBsaJLKIOmCiYlyiiWYSx2UWnWjGScYxE6MziaNfVmOSL5BonMmXmGAUXEGiE0RcUQREdkH2pZvea53/v9Wv6r1X91XVq66iC+ijTb3l3HP3c889y32eGEB6obcFelugtwVMLeA1Xfde9rZAbwv0toBqAb/RDtFgm8RC7cat9tfjLxFvabV6lxW+D/hlcXwminY2Sywc1NLO9NBjo2XgRztbQLPTuM3q11tSKZ5AmRU3FpVIe5MIfvMDHlV3jy+Qkdyh1jYJhSPiyYhpRaCoV1lWKpWlJepFZygsTW3tKXQMkbCuskJK/D4LkdbOoLR2dGrTeDwe6YM0fl/m9ePTg42ydvsu2bR7v7SAXgz/VaBcI/rXyylDG2RIfZ+UvC0F6bppD4akub0jpTwGLutSGvBLbUW58Ugy1aFvVYX4vNY6MA/mZW9z0iduH6Txov4Eo115bcfnMyfQ0WpsbZdgOOyKDumTFtuzCv1NCEeiwnFDgd+pTEzDPmT/efBfGdqtrCTzeCT9BGM4tPyXcnD5z8Xjt00YYgE4+arGz5ZBVzyi7uP4vwB+vKDqoekf4leOmSGDr/pR4ume574jLWuec0yTQLRdkJlUjpluoWWg7Fn079Ky7sWsacbCHdJ36m1SP+3vDRLqN9LeKNsXXCvhpt0iXuvksSBmc8PdGQbX4Gt/LhXDz0ybIhyJyDWPzJfXP9ooAX+iO9KmMV6GQiH51lV/I/dcfpF6tOid1XLTTx7HQEgtfwhM49vXzpWvz51hJFe/P33+Vbn/94skELAOmCjqUI1BuOhbt8vpI4ZY0hg3LPufVq6SXy97Q1Zu2CqHMdnCmGwS7WKuGJQ+DEQO6AnDBsm8KWfIDdPOkf41VQaJlN8nXlspX5//FMqjbwvW+bJzJsqT/3RTIu2Pn/uLPPCHxSl1IEIUZZl/+5fkinMnJvB5cc9vn5bHl61IScMJN6J/X1n2nTulX3WlSsN2/cpPn0CXcoJlDxHkPQwMkbRYZw4L9s+SD9bl1Nd3fX623PeFS1UB1n26Sy6+/yeKKRoMTFcyMjm2vw99UY8yDKytlgH4GwdmfcW5k2T0wH66ZEnGEIt0qhXdE0HHaoATPRbqSLxJ4uslADs+EzI9pQZPRJ8mQdx2Qcagk2ZioBM69IlEg61Z02S5gvs32XJg4WIoW5sqX34YAyZnNJKaj+ZJa2entGBS+VwyhggmYScmigEhDGquhD4NY4iAMTzz1gfyD5dMw8qdnHRMr/KGxGIGMgauRtEo151U2LbvoNyx4A/y9Mr3FSPwYSJzVQrYViROhjZIJSvWb5YVazfJYy/9n3wXDOoL501OJYonwVCkqzzJMpoRIyhvO+iZwakOxGEbPfPW+ymMoT0YlJY2tFWJtd4RtiElHha8C9iuZHq5MAY7LbZFrn3dYepr9gvLRGkpHWNgFQ62tKqabNl7AOMcTJt9Ckbx0NMvyzc+f5HcMWd6ilRoan3wQg/ELf7pQL0z80u3+CCKwqTNQ5cvn6XkHUeMdrRIpO1gfIV3KredptcvocbtEgMDTBHzcy2fPQ8KftmWh9VT+WLrwV8XEAG+StuVhql5r6WDibtqy3ZZs32nTBo1PJFLury1dJCSW4ZrHvmVrAa9AFYjCN8JevYLVTUwDC+ZEf7fsHOvfPEHC2Tznv3yLxiU5vIzrWoCpzrgvb3O8TQcV/p6R5Hva+s2yt6mZrVSEp/gVO+ohg7blW3BPzc9FNPRwjOnsqqCOfyjq7dRJqd+SpBinoD4jjDZVwfAMO7+zR+lqb1d7r9mbgKdFw5cwIJTtDfhtgPQCzSinV1UA7jh5n0SRbrjCTh4DmN/+9L7H3Wr2gdb2uQrj/5WVm81mII7cgHoOLga/9uTz8hvXl3pLnEO2D7Mhk8g3az4eHMOqY/tJNxm+NAf//3nJfLK6vWWyrqYUZZ0RXETadmPbURb1zKTXZG4UlDJGG6FWHW8ARaO599bq5RfuVb9V0uXy8qPNmHLEFd46uhQDxCCiBuCDkIHFMkjEGkf/OMLsv9wiw4lb8+4VkawTVr8zod5o3m0EOJmiEpt6oKcgAtGR0eH/HLJcqXgNPCOEsaQ3O8ZBedv+PDuLitHXFQyv3O8RkPEwEzCh/c4ohTrC7aC+c9tOal7eG8ztxO73CZV+Bxki99Zk5ER33HZTPnd3TfL+WNHS8RhUPoh4m/atU/+svbjnMriJpEHq+LS1R+r7YSbdG5xzX1jvnZLh/jm9Lx2C0xTgv4++6SRMmbwQIk46IpI14O+eHPDFjDp5kQ2xckYMHm5D0v+sZipkz/UuCOuTElUx36ha1IwBigtgwe32pFxb86z61qDpX1kKa/LtFqC1oesvXlPyWtKP3yeLcS3E63y0qp12Sax4O1vbpFt+w5AN6MfNtToj4R58j+uniNXnz9Z/vHSz1pWITMxljsKs93KDdvMjwtyTY38NijelkPSKSTY+8e4d5tnPvqa1ph6WFUWffM2ef0/75ZbZ0+F9BDWFoXl3NPUItsPJLfXUAcVD3DC1kycJ/VTb7EWCvPbWxo3HZlfhJt2mm+t1zA5emFKpcVCy1QObbfg+8rrZNiXH4fS1tp4h1Y+Lo1vPo7JoBedqcSsGHWuDJxzv4Ue8/TXDrI9y+2WmvKHb7xSLp50ioUA9+rpTH8WZOMGg+D599bInXOnW6wTxut0vweaW6URtnNONB2wPH0xGEupaAQ01NWoPGi2sysZFQK2FBt37aVBSK0B6lkB/mHeYWxvaHa8HKbOfANF9cmjR8Aser0EfOYpFcO9T03QbPMkrQeu+1xKOdm2/dKYeXX0uSxyO8cxcsMFZ8uCV17HNhL+Mrb+Y2/St2IfmIMB5loYz3ruF5X3VcARpt/ozGUAbojbAVsl4wlj4g2US6B2sHTsXgcDQVITq94jTajxU2sewAn0HWF9hjtfZT2kEjaxA+AdmVZWZXYgkekxcx/Wr4+MHTIwE2rG99xOrNq6A5aF3TJx1NCM+GYEOufQKUjf5sBEW9DZynCIov28BNYQmui0rAT9sOtQk3RiUNL5ppDgQb1fXbsRg79Z+sOOn0/gpI37agxOmXRu8yGtIfV1eelrc950jCqDXqgznOoAx/4k8z7cDn1dF+hlQuNtT/xm6XlISSDcvBcl1FQBlfSW12KynuCw1YBl4vAuSBPpPT1V9bMpDzqz0MCOywdQbGyCmerFVWtdk1MOTBnKUUIvO+RBoL+EH1KBExDP8EB0wsnXczKrrXuwnVhfmO0EJ7STstVtHfLV1+Z8sxmhZjWEc6+ZqRbhdaSjWfkweDQDj+64vvI+EqjTr4hKtARTibQdKsKaHYkieeQFbCc4mI1JnE2uXNmZJh2Y35qvndIYjlRO7/P5PBIJx5WniqhWhslndkcVLbZGwDSXXDIGU2N2rQo9VfsoHJsYJ8G9fArA4zBQM1D8NQ369/BliHYclkjrvpSkx8MD2q7fgx/CejgbGWJ/NvXWtHTaZGQMXP2c/mJ419YZSmtOS5uBy5fcUr66ZoPyBPR53dbGZWZFhk4PSXpOamsNZs8tZl1VUo/nYmNHbX4nJlPc/q/8B/TZdKtJPBbljTOpUNdWQCcxMJW/eoD4qvpDv0DexyFqahIwtSjcs2nulCGnE73oocwWy9CdAqvtRHO7vPz+2pTgou7QtacNQHwfCAUkA710kgk153WV5Y5u13Z63b2nQ8+WvfvljY+3aONJukOftM2u5t2hxSCxfADb3Aiwo0s6Xcl1cTScHRXQPwzqU5PINusSMLKybdNy2fLjWSoxLQh8lk/wwF25FXlEg/dZyUICqJ00T8qGJjXKoUZYJGhB8OrLQMbgB2OAOQG0NPtzpA0e2GLNp0jvvFjdHn3xNegFkmZGbpfILO763EwZ3KfWfcnBJxe/u0bOOWmkszLRPVVLinGDG+Tdh/7V8sx+Q3ZNxd2RAAq5DCZ75u3V6RXKLgtDpkDryq2/+F+YlJNCOH04LjjlJLlu6llZUySt+Utfl+Xrkp6a7OtSSHl3IgBueL++WdEi86en6x0LnpLDiAlZ8sFHjosAHcBGDqgH7T4J2lkzBqaIYYLGEASlgK1sXoXjT7v3L0S9zt1rpWPHKgudGPaGZApmxhCmD4OSBCyo8Rt0jr+6AXqGWsW8VPAXi2uD4MFttifFectOfhGTGN5CyQJC/Asg9Pim6VNyYgzcTqzaskOqy0tVcFCScP6uyNCMMOH8Ue0eJVonXlu7IR5ViEmYD6An505YVx5bvMxKDhacIPrMDWMgraVwW1/K/jaAoj6kruumnp01Y6C0wOC8X7/8V8X4/ZBC7FIb1UVhzC3CV2ecB+kiGSntijEoCiaOqO7z/A+lBk+JtVhkDHxuhnCzs+cicSkx8CwIL85diKhzJuycAbZthljT6lDgOpnLneu1CkM2iZhU2lFMJNPIBZiO8fz0kecqlW+gXiGTojKeZ/y8gHzn70SPVpLNsE7saTwsfjDHfAHbkJPXDCE8y2Vb4NjXLvUiZATxIDdzqeLXjFnh1mdEvwa5ZfYF8rWZ51uQrLPN8qp4b+hUpCa1blJgwvCMCC/8D7wlOGwjUAG/fERg2ucPOi3cvFs5QBmHzxRvjQtTMk5cipn2laRbuaFPyHTuemKhLHz9XeFK5QRkbv1rqmXhN/4Ouoj8+hY45cnn1G3kvd7pMiyydwzZpl/MjZ+doiROntFgB+des2MW0b3yYWjdj8mu4/hxhyN/RV2cQUBqiEEqwJEhlhowIjOMIKxI68HEqVQWhGPwBvMQTMBasbwyBRPp3ViRN+/cA+nPegCMCQXCGs+PgEIbv4UEVDtlXShUvQtZD7e0We8w3aDR6fTANIBbPIa/3/e7Z+X3y9+Wb8OF/bKzTjNeq9/8y5AW8oW5of9BPNzaNsqRHZmAt7QK0gKOb8OxavSkxMPUgqCxaO4M0TJxlABrYf/LtuhkCAH/ketutT3BYKQW3OnPq94VtkyUXmgdORKQa9/oymanxXs3QPx4ENUoGT90EM5msVJg/5AdM6iO52OYFdvMx32LcYTxr5Bg5GH+NeVHj0fHcGs0gK+MSkfu9yAnVFCLa22UOCmYX3GaU9juGm3Kp5gu2eIc5Pa/bMrI2tOH/zPjToSiscB911UgpV+wDcZsyppPHJahpqJMzj15lIQLLJWw3Pa+oVSSS2t3p6+N9jMHUa148C4oF89PCaJiPtRn8ESpeyE90AvVgKy3EjRPVp40TQZcfK9Ke2jFfGl8+38cg4uMDNz8pgui8tcMSJCiRUKZS20KSYWAweCFlGAEPfmqEOvgBJAueDRcsYM+iAr1xHaI5xNmBLQJB8rMU8fKmk92IpKuWQ3ijOm6gVAOu3hVeZmEmDf+egKYK9uIwWf0XQiFGcyV/5I4BVGRMfFQWTegD6JiX3tkeDZ9bcqM9TeCqOadN0nmI4iKz+xNQAsVx8XHMLlOPmG4opA1Y6A4ThHdCBZSK3G+Oxz0sgmiUo5JPE9RxxhQdT+ZQdcIcHKLNtrvaDBZsjO7G0TFFXMMgrB4sOvzMIV50ygFjbbJ6Rd9SEbw0Jcux9Fts2TOg4/Kuk93W/a4OdHNMREn2pmIfBwB+/966Dx0Dj45kk4kIwMo9iCquooKdUK0CmizcUcyCjKQA83JIKrsGQObAQ2QAJr5CgFZ0A0e2uGYMz0n6Qex+8/3KJzg/s1K16BNgNUkhNBt7fmP2gQ997C7CjoOXvoUXAip4fkjcJpRDaQFmgYLYQp10wsR1JsefedgO/ERD6gxKeHc0MmEy/bl5MqH92N3+1pXVkavmhWQVhzo21D+Nvg9GOCOMRipevQ3BmuCsw8DuIB07tuowq1ZTOUX4fRtBzCGSMs+daKTB85QxzrQTDXztDFSgUmrvm1gWznyXf9CDHDXZcSA54SYPXEcjot/w3Xy4yIBRIYYxgaD5Axwr3w0UvbQL70Yw008hyFpfrEXhcyA5zHwL+UkaBMylUO0cIRbGL597AO3E9RQ86gvnrbkFkzyotukPYrPup4/9kQZgLiNomBWPdoazpmbdQ9HHWOIItw62oGTofOhXQdjiHa2QgG53bm1jqE3UWzT6IlH/31oI13XjOYv8+DREShG5kFmwDiAyaOH41MfJrdyXQV6n6kWKDrGYHd9tvdTGKJ/BCHT0DzaX+Vwz4hRnGicRmeRA9GCJMnH3tWw2s46bawyU0HKdgU0/aXVGYDRtnYEE9IIJRROykzMxFUhckA2rCIzTx2TQ+rsktBqkJc+Qnb2zwhmV4L8YhWVjoFif8v6JVoTIgO46qfeqvwX6H+QdrRhZaSjUxxgS7Yf7WZuQ+CpQ2XNz4rsmmcHfG/hS/LEq29aSsaou3JEWH4fFoAhfess79LdnHXiSBmBaDp+Z9LNeQz1VVUqhJonOWk9B8EBaAunJYCDm27HjMfQ4qYrYIHeXTjhZKmtrJQWKNk4kfMFPMuAlpcrvo9PPEJvZYZIOCRzz54of4sgpbRjtisRaf1g0TL50xv4wpcJVIQlpL0Hrr1MTnD4rJwJvduXRcUYGMwUPLBVgns3pFSMh7TWTrxcif5xK4I+VJfv6G/R78I7FA2e7bjn2W+qdKSfAhggwSL3ZeDEeoMfTIGCyAJY8kthabj3qkssjzPdDKitkinQ0m+E+Q4iQCb0xPtBfWvUAa88EJZei3ZQAUo47+CvOI2Zk3AhvmvJL0CllTLsRAp4P3Zog4zHNzR5NoE3jwFUZDI8KHfhivdSSw8mNLQfzOczUl/pnpDW2xu3ydvwu7AA+tqPoLm7cDT/kYDiYgyosVrddSu8Or0Zh7jShTkhDWiaCO94qGtZ1wEsgdoh+LI1nEygS9ACmAW9HymFOH2gV5vuCD/UffCWInI5YhFyWZFnnT5OnnzNKoFkqhK/fP2ZcaNl3Sefas1+LAcPi+Xn63gy8Q4cR57PlTlT+TK95/kV08GwVuCTdahAJnRX71lPryYuhA5ejGR0A3F8axqjr49Ue2a/XLipWYFwGX4dUmcopBcD6RKdADAZWieSW4vEG3XBE57COCaOX6c6noATvH+tey39zbOmSl11laN2nwOXW40N8KI7EiZRt302EwyxrKykx7wx3Za3p/CPLsYQRbg1z2HQbQkSLYj4iMqkmzBPmWL4tcU5K4HLi/j5j1RqHk8wHOLtmUpLb+hisqs90/AkIWr3DaWePSWZAz0MDUmGCkgnXHvaQt9PHDlERjf0Vy7ihc7raKZ/1DAGKnX4dWuGSqdlDBiUPCHaAMZM0JUbnMF4ZP2F8MFj5MNNEI+PI6BC86KJ43Oq8T2Xz5Y7sddl2DQ/W5cOQthaTBw1TG7GQSC5+E6ko53Luzpshy4YfyKsUe4YYi55Hc1pEjoGBiXxnAMPYxA0wD24sgZ0vUviJ72lzMni+MloLb7js3ge+jTm9Lprxkjw61OxUJvE0kgNvvLkoZZ0kabUwBBrJx0CyxXct0lkbGqumesZRL2s9Uylkv5JWzAoOKlTQgF92zumxv6V52QbqzGtATHSse9pgUewT0xOEEbXhdrwfQ1sqSxg0LYrPIFEi8PDN86TM04YJt996gVZvwOuxsTDcyUl4DJGfwHQmACmMP+265U1g1+3buNHbI28wFhaOzCuusrH/BWjYR2YXgdoK/XRG9M7blkE25eQfbIbdTDRZ7IZcAv/2bOvSKgdeWAhsQACrXiisrlMbNcoyhk1ym1JkOEG6TpxzqQBquy59jXqQe9VAn9bWCaUNWKvQxzB0rYcI8SP8M8Bn/U0IMEYqsbMiovgnsQjAyf+G4MJyvSFqDg+g5WsSpJEIuAH6kclbnlRO+kqKR82yTmNBdt2g8qUNYwXX3V/TERMJCcAwyhtGGd665G6s2/AZ+SmOOcb45mSKJcGqk6ejjBuMJp09ew7UpMyu0c84++f58yQHVPOwKffbJMzAwmasDhJjRN46MDzva9drSIKzUmJR5gwfLD5MbwgG+RnN18LjXqLNg1pD+2nN4NyOl1/wTkyZ/Kp+PTbh7Lsw/Xy1sZPpAlMhko+av8vgURy5ZRJ6hNt3E48hrz45SnjwFQYlaUK5wzW4qRoA+h89V83X+NoyYhg4RozpMFAV7+XTJog1bDO+GxKa6N97IflTp8wRn54yxcxYXmcupUxcALV4ixN81mVql2/erXCtWJbiqG94YGwZ500Ur1j2tsvmSaXTj4lp76ma/fQrgNb+bWqh798pWKg9jowM7Yt24R1IbANGNhGJmXH5+hgW53RFVlJfA84Y3zU8K4XelugGy3A7yIyvJtSQy5nHXYj696keW6BXsaQ5wbtJdfbAsdCC/w/yNeAQwKXwXYAAAAASUVORK5CYII=',
                                width: 150
                            },
                            {
                                text: 'Heat Engineer Software Ltd',
                                style: 'smallGray'
                            }
                            ]
                        },
                        {
                            width: '*',
                            stack: [{
                                text: 'Project reference: ' + survey.surveys.project_name,
                                style: 'smallGray',
                                alignment: 'right'
                            },
                            {
                                text: dummyText,
                                style: 'smallGray',
                                alignment: 'right'
                            }
                            ]
                        }
                        ],
                        margin: [40, 10, 40, 0]
                    };
                } else {
                    return {
                        columns: [{},
                        {
                            width: '*',
                            stack: [{
                                text: 'Project reference: ' + survey.surveys.project_name,
                                style: 'smallGray',
                                alignment: 'right'
                            }
                            ]
                        }
                        ],
                        margin: [40, 10, 40, 0]
                    };
                }
            };

            report.footer = function (page, pages) {
                if (!whiteLabeled) {
                    return {
                        columns: [{
                            width: 30,
                            text: ''
                        },
                        {
                            width: '*',
                            alignment: 'center',
                            text: [{
                                text: 'Survey reference: ',
                                bold: true,
                                style: "smallGray"
                            },
                            {
                                text: $filter('survey')(survey, true) + '\n',
                                style: "smallGray"
                            },
                            {
                                text: 'www.Heat-Engineer.com',
                                style: "smallGray"
                            }
                            ],
                            fontSize: 8
                        },
                        {
                            width: 30,
                            alignment: 'right',
                            text: [{
                                text: page.toString(),
                                italics: true
                            },
                                ' of ',
                            {
                                text: pages.toString(),
                                italics: true
                            }
                            ],
                            fontSize: 8
                        }
                        ],
                        margin: [40, 0]
                    };
                } else {
                    return {
                        columns: [{
                            width: 30,
                            text: ''
                        },
                        {
                            width: '*',
                            alignment: 'center',
                            text: [{
                                text: 'Survey reference: ',
                                bold: true,
                                style: "smallGray"
                            },
                            {
                                text: $filter('survey')(survey, true) + '\n',
                                style: "smallGray"
                            },
                            {
                                text: $rootScope.user.company_website ? $rootScope.user.company_website : '',
                                style: "smallGray"
                            }
                            ],
                            fontSize: 8
                        },
                        {
                            width: 30,
                            alignment: 'right',
                            text: [{
                                text: page.toString(),
                                italics: true
                            },
                                ' of ',
                            {
                                text: pages.toString(),
                                italics: true
                            }
                            ],
                            fontSize: 8
                        }
                        ],
                        margin: [40, 0]
                    };
                }
            };

            if(typeof survey.surveys.external_design_temperature == 'string') {
                survey.surveys.external_design_temperature = parseFloat(survey.surveys.external_design_temperature)
            }

            // PAGE 2
            report.content[0].stack[0] = today;
            report.content[0].stack[2].text[1].text = survey.surveys.project_name;
            report.content[0].stack[3].text[1].text = survey.surveys.proposed_install_type;

            report.content[0].stack[5].text = survey.surveys.title + ', ' + survey.surveys.client_name;
            report.content[0].stack[6].text = survey.surveys.address_one;
            report.content[0].stack[7].text = survey.surveys.address_two;
            report.content[0].stack[8].text = survey.surveys.address_three;
            report.content[0].stack[9].text = survey.surveys.post_code.toString();

            var address = $rootScope.user.address ? ', ' + $rootScope.user.address : '';
            var office_telephone = $rootScope.user.office_telephone ? ', ' + $rootScope.user.office_telephone : '';
            report.content[0].stack[10].text = 'This report has been completed by ' + $rootScope.user.company_name + address + office_telephone;
            report.content[0].stack[13].text = 'It’s important for the relevant persons to read this report and notify ' + $rootScope.user.company_name + ' of any corrections that need to be made before the heating system is installed. ' + $rootScope.user.company_name + ' is not liable for any inaccurate calculations made due to incorrect information, therefore it’s important that the information provided is to the best knowledge available from the home owner, architect or builder.';

            report.content[1].stack[0] = today;
            // PAGE 4
            report.content[2].stack[2].text = 'When the external temperature is ' + (survey.surveys.external_design_temperature).toFixed(1).toString() + '\u00B0C';
            report.content[2].stack[3].text = 'The total heat source required to heat the building must provide an output of ' + (survey.surveys.total_power_watts / 1000).toFixed(2).toString() + ' kW';

            report.content[2].stack[4].table.body[0][0].text[1] = survey.surveys.proposed_install_type;
            report.content[2].stack[4].table.body[0][0].text[4] = survey.surveys.preferred_manufacture;
            if (typeof (survey.surveys.preferred_model) == 'string') {
                report.content[2].stack[4].table.body[0][0].text[7] = survey.surveys.preferred_model;
            } else {
                report.content[2].stack[4].table.body[0][0].text[7] = ''
                for (let i = 0; i < survey.surveys.preferred_model.length; i++) {
                    if (i != (survey.surveys.preferred_model.length - 1)) {
                        report.content[2].stack[4].table.body[0][0].text[7] += survey.surveys.preferred_model[i] + ', '
                    } else {
                        report.content[2].stack[4].table.body[0][0].text[7] += survey.surveys.preferred_model[i]
                    }
                }
            }
            report.content[2].stack[4].table.body[0][0].text[10] = survey.surveys.output_at_designed_external_temperature + ' kW';
            report.content[2].stack[4].table.body[0][0].text[13] = survey.surveys.maximum_designed_flow_temperature + '\u00B0C';
            report.content[2].stack[4].table.body[0][0].text[16] = survey.surveys.output_at_designed_external_temperature + ' kW';
            if (survey.surveys.proposed_install_type.toLowerCase() != 'gshp') {
                report.content[2].stack[4].table.body[0][0].text[15] = ' ';
                report.content[2].stack[4].table.body[0][0].text[16] = ' ';
                report.content[2].stack[4].table.body[0][0].text[18] = ' ';
                report.content[2].stack[4].table.body[0][0].text[19] = ' ';
            }
            if (survey.surveys.is_bivalent_required == 'YES' && (survey.surveys.proposed_install_type.toLowerCase() == 'biomass' || survey.surveys.proposed_install_type.toLowerCase() == 'ashp' || survey.surveys.proposed_install_type.toLowerCase() == 'gshp')) {
                report.content[2].stack[3].text += '\n\nThis system has been designed as Bivalent ' + survey.surveys.bivalent_fuel_type + '\n\nOnce the temperature falls below this point the fossil fuel boiler will operate ' + survey.surveys.bivalent.point + '\u00B0C\n\n';
                if (survey.surveys.proposed_install_type.toLowerCase() == 'biomass')
                    report.content[2].stack[3].text += 'The Biomass must provide at least this output to reach the bivalent point ' + survey.surveys.bivalent.output_requirement + ' kW';
                else if (survey.surveys.proposed_install_type.toLowerCase() == 'ashp' || survey.surveys.proposed_install_type.toLowerCase() == 'gshp')
                    report.content[2].stack[3].text += 'The heat pump must provide at least this output to reach the bivalent point ' + survey.surveys.bivalent.output_requirement + ' kW';
                report.content[2].stack[2].fontSize = 8;
                report.content[2].stack[2].margin = [0, 10, 0, 0];
                report.content[2].stack[3].fontSize = 8;
            }
            temp = report.content[2].stack[7];
            if (survey.surveys.proposed_install_type.toLowerCase() == 'ashp' || survey.surveys.proposed_install_type.toLowerCase() == 'gshp') {
                if (temp)
                    report.content[2].stack[7] = temp;
                if (!_.isUndefined(report.content[2].stack[7].columns)) {
                    var total_watts;
                    var watts_per_meter_squared;
                    if (!!worst_performing_room && !!worst_performing_room.linked_colors) {
                        total_watts = worst_performing_room.heat_loss.linked_total_watts;
                        watts_per_meter_squared = worst_performing_room.heat_loss.linked_watts_per_meter_squared;
                    } else {
                        total_watts = worst_performing_room ? worst_performing_room.heat_loss.total_watts : 0;
                        watts_per_meter_squared = worst_performing_room ? worst_performing_room.heat_loss.watts_per_meter_squared : 0;
                    }
                    report.content[2].stack[7].columns[1].stack[0].text[1].text = worst_performing_room ? worst_performing_room.room_name : '';
                    report.content[2].stack[7].columns[1].stack[1].text[2].text = worst_performing_room ? worst_performing_room.floor_area + ' m\u00B2' : '';
                    report.content[2].stack[7].columns[1].stack[2].text[2].text = worst_performing_room ? total_watts + ' watts' : '';
                    report.content[2].stack[7].columns[1].stack[3].text[2].text = worst_performing_room ? watts_per_meter_squared + ' W/m\u00B2' : '';
                    report.content[2].stack[7].columns[1].stack[4].text[2].text = worst_performing_room ? worst_performing_room.emitter_type : '';
                    report.content[2].stack[7].columns[1].stack[5].text[2].text = worst_performing_room ? worst_performing_room.emitters.space_heating_likely_spf.toString() : '';
                    report.content[2].stack[7].columns[1].stack[6].text[2].text = worst_performing_room ? star : '';
                }
            } else {
                report.content[2].stack[6] = {};
                report.content[2].stack[7] = {};
            }

            if (survey.surveys.proposed_install_type.toLowerCase() == 'oil' ||
                survey.surveys.proposed_install_type.toLowerCase() == 'lpg' ||
                survey.surveys.proposed_install_type.toLowerCase() == 'mains gas' ||
                survey.surveys.proposed_install_type.toLowerCase() == 'direct electric') {
                report.content[2].stack[9] = report.content[2].stack[8];
                report.content[2].stack[8] = 'Total energy required to provide heating and hot water for a year ' + $scope.total_energy_required + ' kWh\n\n' + 'Total estimated running cost for heating and hot water £' + $scope.total_estimated_running_cost + ' per year';
            }

            $scope.degree_data = getDegreeData(survey.surveys.region.region, survey);

            function getDegreeData (string, survey) {
                var result = 0;
                if (typeof string == 'undefined')
                    return;
                if (string != 'Custom Entry') {
                    angular.forEach($rootScope.cloud_data.degree_day_data, function (value, key) {
                        if (string.search(key) > -1)
                            result = value;
                    });
                } else {
                    result = survey.surveys.bivalent_degree_data
                }
                return result;
            }

            // Created a new array of room sorted by the linked colors.
            var rooms_sorted_by_link_colours = _.sortBy(survey.surveys.rooms, 'linked_colors');

            // Create a new array to hold the original rooms.
            var rooms_temp_default = survey.surveys.rooms;

            // Change original array on temparary baisis
            survey.surveys.rooms = rooms_sorted_by_link_colours;
            var selectedImageCount = 0
            $scope.selectedImageCount = 0
            $scope.totalImage = 0
            var load2 = []
            var load3 = []
            if (survey.surveys.plantRooms) {
                load2 = survey.surveys.plantRooms.filter(function (val) { return val.selected == true; })
                selectedImageCount = selectedImageCount + load2.length

            }
            if (survey.surveys.heatPumps) {
                load3 = survey.surveys.heatPumps.filter(function (val) { return val.selected == true; })
                selectedImageCount = selectedImageCount + load3.length

            }
            _.each(survey.surveys.rooms, function (room, idx) {
                var load1 = []


                if (room.images) {
                    load1 = room.images.filter(function (val) { return val.selected == true; });
                    selectedImageCount = selectedImageCount + load1.length

                }

                // STEP 3
                report.content[3].stack[2].text = 'Number of rooms: ' + survey.surveys.rooms.length + ' and total floor area: ' + survey.surveys.floorArea + ' m\u00B2';
                let regionName = survey.surveys.region.region != 'Custom Entry' ? survey.surveys.region.region : survey.surveys.region.region_name
                report.content[3].stack[3].text = 'Approx location (Degree Day): ' + regionName;
                report.content[3].stack[4].text = 'Approx City (Ext Temp): ' + survey.surveys.external_temperature.location + ' ' + survey.surveys.external_temperature.value + 'C';
                report.content[3].stack[5].text = 'Altitude adjustment ' + survey.surveys.altitude_adjustment.meter + ' meters';
                report.content[3].stack[6].text = 'Ground Temperature ' + survey.surveys.region.ground_temp + 'C';
                report.content[3].stack[7].text = 'Outside Temperature ' + (survey.surveys.external_design_temperature).toFixed(2) + 'C';
                report.content[3].stack[8].text = 'Degree Day Data ' + survey.surveys.region.value;
                report.content[3].stack[9].text = 'Is property > 2006? ' + survey.surveys.is_property_greater;
                report.content[3].stack[10].text = 'If property has thermal bridging? ' + survey.surveys.thermal_bridges_insulated;
                report.content[3].stack[11].text = 'Does the building have MVHR?  ' + survey.surveys.has_mvhr;
                report.content[3].stack[13].table.body.push([
                    dataToString(room.room_name),
                    dataToString(room.designed_temperature),
                    dataToString(room.is_there_a_fireplace),
                    dataToString(room.has_throat_restrictor),
                    dataToString(room.room_built),
                    dataToString(room.air_changes_per_hour),
                    dataToString(room.exposed_location),
                    dataToString(room.intermittent_heating_required),
                    dataToString(room.is_the_room_complex),
                    room.is_the_room_complex == 'YES' ? room.complex_room_details.room_type : '-',
                    dataToString(room.which_room_is_below),
                    dataToString(room.Which_room_is_above),
                    dataToString(room.emitter_type)
                ]);
                // STEP 4
                report.content[4].stack[2].table.body.push([
                    dataToString(room.room_name),
                    dataToString(room.floor_area),
                    dataToString(room.room_height),
                    dataToString(room.external_wall.type.a.length),
                    dataToString(room.external_wall.type.b.length),
                    dataToString(room.external_wall.type.a.window_area),
                    dataToString(room.external_wall.type.b.window_area),
                    dataToString(room.internal_wall_length),
                    dataToString(room.party_wall_length),
                    dataToString(room.external_door_area),
                    dataToString(room.roof_glazing_area),
                    dataToString(room.lowest_parallel_room_temp, false, '\u00B0C'),
                    dataToString(room.high_ceiling_percentage, false, '%')
                ]);
                // STEP 5
                report.content[5].stack[2].table.body.push([
                    room.room_name ? room.room_name : '',
                    room.is_the_room_complex == 'YES' ? room.complex_room_details.room_type : '-',
                    room.is_the_room_complex == 'YES' && !!room.complex_room_details.dim.one ? room.complex_room_details.dim.one.toString() : '0',
                    room.is_the_room_complex == 'YES' && !!room.complex_room_details.dim.two ? room.complex_room_details.dim.two.toString() : '0',
                    room.is_the_room_complex == 'YES' && !!room.complex_room_details.dim.three ? room.complex_room_details.dim.three.toString() : '0',
                    room.is_the_room_complex == 'YES' && !!room.complex_room_details.dim.four ? room.complex_room_details.dim.four.toString() : '0',
                    room.is_the_room_complex == 'YES' && !!room.complex_room_details.dim.five ? room.complex_room_details.dim.five.toString() : '0',
                    room.is_the_room_complex == 'YES' && !!room.complex_room_details.dim.six ? room.complex_room_details.dim.six.toString() : '0',
                    room.is_the_room_complex == 'YES' && !!room.complex_room_details.wall && !!room.complex_room_details.wall.type.a ? room.complex_room_details.wall.type.a.toString() : '-',
                    room.is_the_room_complex == 'YES' && !!room.complex_room_details.wall && !!room.complex_room_details.wall.type.b ? room.complex_room_details.wall.type.b.toString() : '-',
                    room.is_the_room_complex == 'YES' && !!room.complex_room_details.wall && !!room.complex_room_details.wall.type.c ? room.complex_room_details.wall.type.c.toString() : '-',
                    room.is_the_room_complex == 'YES' && !!room.complex_room_details.wall && !!room.complex_room_details.wall.type.d ? room.complex_room_details.wall.type.d.toString() : '-'
                ]);
                // STEP 6
                report.content[6].stack[2].table.body.push([
                    dataToString(room.room_name),
                    dataToString(room.external_type.wall.a, '-'),
                    dataToString(room.external_type.wall.b, '-'),
                    dataToString(room.internal_wall, '-'),
                    dataToString(room.party_wall, '-')
                ]);
                // STEP 7
                report.content[7].stack[2].table.body.push([
                    dataToString(room.room_name),
                    dataToString(room.windows.type.a, '-'),
                    dataToString(room.windows.type.b, '-'),
                    dataToString(room.roof_glazing, '-'),
                    dataToString(room.external_door, '-')
                ]);
                // STEP 8
                report.content[8].stack[2].table.body.push([
                    dataToString(room.room_name),
                    dataToString(room.floor, '-'),
                    dataToString(room.ceiling_or_roof, '-')
                ]);
                // STEP 9
                report.content[9].stack[2].table.body.push([
                    dataToString(room.room_name),
                    linkedRooms(room, 'other'),
                    dataToString(room.heat_loss.floor),
                    dataToString(room.heat_loss.external_wall_type_a),
                    dataToString(room.heat_loss.external_wall_type_b),
                    dataToString(room.heat_loss.window_a),
                    dataToString(room.heat_loss.window_b),
                    dataToString(room.heat_loss.internal_wall),
                    dataToString(room.heat_loss.party_wall),
                    dataToString(room.heat_loss.external_door),
                    dataToString(room.heat_loss.roof_glazing),
                    dataToString(room.heat_loss.roof_ceiling)
                ]);
                // STEP 9 PART II
                report.content[10].stack[1].table.body.push([
                    dataToString(room.room_name),
                    dataToString(room.heat_loss.high_ceiling_increases),
                    dataToString(room.heat_loss.amount_heated_per_hour),
                    dataToString(room.heat_loss.ventilation),
                    dataToString(room.heat_loss.exposed_location),
                    dataToString(room.heat_loss.intermitted_heating),
                    dataToString(room.heat_loss.thermal_bridges),
                    linkedRooms(room, 'total_watts'),
                    dataToString(room.kilowatt_hours.total_kilowatt_hour)
                ]);
                // STEP 9 2ND TABLE
                report.content[11].stack[2].table.body.push([
                    dataToString(room.room_name),
                    dataToString(room.u_value_and_temps.floor),
                    dataToString(room.u_value_and_temps.wall_type_a),
                    dataToString(room.u_value_and_temps.wall_type_b),
                    dataToString(room.u_value_and_temps.window_type_a),
                    dataToString(room.u_value_and_temps.window_type_b),
                    dataToString(room.u_value_and_temps.internal_wall),
                    dataToString(room.u_value_and_temps.party_wall),
                    dataToString(room.u_value_and_temps.external_door)
                ]);
                // STEP 9 2ND TABLE PART II
                report.content[12].stack[1].table.body.push([
                    dataToString(room.room_name),
                    dataToString(room.u_value_and_temps.roof_glazing),
                    dataToString(room.u_value_and_temps.ceiling_or_roof),
                    dataToString(room.u_value_and_temps.exposed_location_value, false, '%'),
                    dataToString(room.u_value_and_temps.intermittent_heating_value, false, '%'),
                    dataToString(room.u_value_and_temps.thermal_bridges, false, '%'),
                    dataToString(room.u_value_and_temps.room_temp_below),
                    dataToString(parseFloat((room.u_value_and_temps.room_temp_above)).toFixed(2))
                ]);
                if (survey.surveys.includedReport.emitters == 'YES' && !_.isUndefined(report.content[14].stack)) {
                    // EMITTERS AND PERFORMANCE
                    report.content[14].stack[2].table.body.push([

                        dataToString(room.room_name),
                        disableRoom(room, dataToString(room.emitter_type)), // dataToString(room.emitter_type)
                        disableRoom(room, dataToString(room.output_for_mwt)),
                        disableRoom(room, dataToString(room.emitters.current_rad_oversize_percentage, '-', '%')),
                        disableRoom(room, dataToString(room.flow_temperature, '-')),
                        linkedRooms(room, 'other'),
                        linkedRooms(room, 'total_watts'),
                        spanDouble(room, room.emitter_type === 'Underfloor Heating' ? '0' : room.emitters.oversize_factor ? room.emitters.oversize_factor.toString() : '0'),
                        spanDouble(room, dataToString(room.emitters.heat_emitter_watts)),
                        disableRoom(room, dataToString(room.emitters.underfloor_heating_details.floor_type)),
                        disableRoom(room, dataToString(room.emitters.underfloor_heating_details.floor_surface)),
                        disableRoom(room, dataToString(room.emitters.max_pipe_spacing, 'N/A')),
                        disableRoom(room, dataToString(room.emitters.space_heating_likely_spf, 'N/A')),
                        disableRoom(room, displayStarRating(room.emitters.star_rating))
                    ]);
                } else {
                    report.content[1].stack[13] = {};
                    report.content[14] = {};
                }




                if (survey.surveys.includedReport.pipeRadiators == 'YES' && !_.isUndefined(report.content[15].stack)) {
                    // CURRENT PIPE CALCULATION
                    report.content[15].stack[2].table.body.push([

                        { text: room.index_circuit == "Yes" ? dataToString(room.index_circuit) : '-', fillColor: '#dedede' },
                        { text: dataToString(room.room_name), fillColor: '#dedede' },
                        { text: dataToString(room.t_watts.toFixed(3)), fillColor: '#dedede' }, // dataToString(room.emitter_type)
                        { text: dataToString(room.flow_temperature, '-'), fillColor: '#dedede' },
                        { text: dataToString(room.return_temperature, '-'), fillColor: '#dedede' },
                        { text: disableRoom(room, dataToString(room.deltat, '-')), fillColor: '#dedede' },
                        { text: disableRoom(room, dataToString(room.pipe_nom_dia, '-')), fillColor: '#dedede' },
                        { text: room.pipe ? disableRoom(room, dataToString(parseFloat(room.pipe.meanVelosity).toFixed(2))) : '-', fillColor: '#dedede' },
                        { text: disableRoom(room, dataToString(room.pipeVolumeCheck, '-')), fillColor: '#dedede' },
                        { text: room.pipe ? disableRoom(room, dataToString(parseFloat(room.pipe.pressureLossPA).toFixed(2))) : '-', fillColor: '#dedede' },
                        { text: room.pipe ? disableRoom(room, dataToString(parseFloat(room.pipe.pressureLossM).toFixed(2))) : '-', fillColor: '#dedede' },
                        { text: disableRoom(room, dataToString(room.flowReturnPipes, '-')), fillColor: '#dedede' },
                        { text: room.pipe ? disableRoom(room, dataToString(parseFloat(room.pipe.totPressureLoss).toFixed(2))) : '-', fillColor: '#dedede' }

                    ]);
                } else {
                    report.content[1].stack[14] = {};
                    report.content[15] = {};
                }
                if (survey.surveys.includedReport.pipeRadiators == 'YES' && !_.isUndefined(report.content[15].stack)) {

                    if (room.radiators) {
                        let displayHeaderRad = 0;
                        _.each(room.radiators, function (rad, idx) {
                            if (rad != null) {
                                if (rad.type != "") {
                                    if (displayHeaderRad == 0) {
                                        report.content[15].stack[2].table.body.push([
                                            { text: 'Index Circuit' },
                                            { text: 'Heating Emitters' },
                                            { text: 'Output KW' },
                                            { text: 'Height' },
                                            { text: 'Length' },
                                            { text: '' },
                                            { text: 'PipeSelcted' },
                                            { text: 'Mean Velocity' },
                                            { text: 'Velocity Check' },
                                            { text: 'PressureLoss' },
                                            { text: 'PressureLoss' },
                                            { text: 'Flow Return ' },
                                            { text: 'TotalPressure Loss' }
                                        ]);
                                    }
                                    displayHeaderRad++;
                                    report.content[15].stack[2].table.body.push([

                                        rad.index_circuit == "Yes" ? dataToString(rad.index_circuit) : '-',
                                        rad ? dataToString(rad.type) : '-',
                                        rad.type != "Custom" ? dataToString((rad.outputKW / 1000).toFixed(3)) : dataToString(rad.watts), // dataToString(room.emitter_type)
                                        rad ? dataToString(rad.height) : '-',
                                        rad ? dataToString(rad.length) : '-',
                                        '',
                                        rad ? dataToString(rad.pipeSelected) : '-',
                                        rad ? dataToString(parseFloat(rad.radsMean).toFixed(3)) : '-',
                                        rad ? dataToString(rad.radspipeVolumeCheck) : '-',
                                        rad ? dataToString(parseFloat(rad.radspressureLossPA).toFixed(3)) : '-',
                                        rad ? dataToString(parseFloat(rad.radspressureLossM).toFixed(3)) : '-',
                                        rad ? dataToString(rad.radsFlowReturn) : '-',
                                        rad ? dataToString(parseFloat(rad.radsTotalPressureLoss).toFixed(3)) : '-',
                                    ])
                                }
                            }
                        })
                    }
                }

                let newRadKeys = ['two', 'three', 'four', 'five', 'six']
                if (survey.surveys.includedReport.radiators == 'YES' && !_.isUndefined(report.content[16].stack)) {
                    if (!!room.radiators) {
                        var span = Object.keys(room.radiators).length + 1;
                        report.content[16].stack[2].table.body.push([
                            { text: dataToString(room.designed_temperature), margin: [0, 8, 0, 0], fillColor: '#dedede' },
                            { text: dataToString(room.room_name), margin: [0, 8, 0, 0], fillColor: '#dedede' },
                            { text: room.radiators.one ? dataToString(room.radiators.one.type) : '-', fillColor: '#dedede' },
                            { text: room.radiators.one ? dataToString(room.radiators.one.height) : '-', fillColor: '#dedede' },
                            { text: room.radiators.one ? dataToString(room.radiators.one.length) : '-', fillColor: '#dedede' },
                            { text: room.radiators.one ? dataToString(room.radiators.one.watts) : '-', fillColor: '#dedede' },
                            { text: room.radiators.one ? dataToString(room.radiators.one.flow_output ? room.radiators.one.flow_output[0] : '-') : '-', fillColor: '#dedede' },
                            { text: room.radiators.one ? dataToString(room.radiators.one.flow_output ? room.radiators.one.flow_output[1] : '-') : '-', fillColor: '#dedede' },
                            { text: room.radiators.one ? dataToString(room.radiators.one.flow_output ? room.radiators.one.flow_output[2] : '-') : '-', fillColor: '#dedede' },
                            { text: room.radiators.one ? dataToString(room.radiators.one.flow_output ? room.radiators.one.flow_output[3] : '-') : '-', fillColor: '#dedede' },
                            { text: room.radiators.one ? dataToString(room.radiators.one.flow_output ? room.radiators.one.flow_output[4] : '-') : '-', fillColor: '#dedede' },
                            { text: room.radiators.one ? dataToString(room.radiators.one.flow_output ? room.radiators.one.flow_output[5] : '-') : '-', fillColor: '#dedede' }
                        ]);
                        _.each(newRadKeys, function (idx) {
                            if (room.radiators[idx]) {
                                report.content[16].stack[2].table.body.push([
                                    { text: '' },
                                    { text: '' },
                                    { text: room.radiators[idx].type ? dataToString(room.radiators[idx].type) : '-', fillColor: '#ffffff' },
                                    { text: room.radiators[idx].height ? dataToString(room.radiators[idx].height) : '-', fillColor: '#ffffff' },
                                    { text: room.radiators[idx].length ? dataToString(room.radiators[idx].length) : '-', fillColor: '#ffffff' },
                                    { text: room.radiators[idx].watts ? dataToString(room.radiators[idx].watts) : '-', fillColor: '#ffffff' },
                                    { text: room.radiators[idx].flow_output ? dataToString(room.radiators[idx].flow_output ? room.radiators[idx].flow_output[0] : '-') : '-', fillColor: '#ffffff' },
                                    { text: room.radiators[idx].flow_output ? dataToString(room.radiators[idx].flow_output ? room.radiators[idx].flow_output[1] : '-') : '-', fillColor: '#ffffff' },
                                    { text: room.radiators[idx].flow_output ? dataToString(room.radiators[idx].flow_output ? room.radiators[idx].flow_output[2] : '-') : '-', fillColor: '#ffffff' },
                                    { text: room.radiators[idx].flow_output ? dataToString(room.radiators[idx].flow_output ? room.radiators[idx].flow_output[3] : '-') : '-', fillColor: '#ffffff' },
                                    { text: room.radiators[idx].flow_output ? dataToString(room.radiators[idx].flow_output ? room.radiators[idx].flow_output[4] : '-') : '-', fillColor: '#ffffff' },
                                    { text: room.radiators[idx].flow_output ? dataToString(room.radiators[idx].flow_output ? room.radiators[idx].flow_output[5] : '-') : '-', fillColor: '#ffffff' }
                                ]);
                            }
                        });

                        report.content[16].stack[2].table.body.push([
                            '', '', '', '',
                            'Total Output:',
                            dataToString(room.output_for_mwt, '-'),
                            dataToString(room.total_flow ? room.total_flow[0] : '-'),
                            dataToString(room.total_flow ? room.total_flow[1] : '-'),
                            dataToString(room.total_flow ? room.total_flow[2] : '-'),
                            dataToString(room.total_flow ? room.total_flow[3] : '-'),
                            dataToString(room.total_flow ? room.total_flow[4] : '-'),
                            dataToString(room.total_flow ? room.total_flow[5] : '-')
                        ]);

                    } else {
                        report.content[16].stack[2].table.body.push([
                            { text: dataToString(room.designed_temperature), fillColor: '#dedede' },
                            { text: dataToString(room.room_name), fillColor: '#dedede' },
                            { text: '-', fillColor: '#dedede' },
                            { text: '-', fillColor: '#dedede' },
                            { text: '-', fillColor: '#dedede' },
                            { text: '-', fillColor: '#dedede' },
                            { text: '-', fillColor: '#dedede' },
                            { text: '-', fillColor: '#dedede' },
                            { text: '-', fillColor: '#dedede' },
                            { text: '-', fillColor: '#dedede' },
                            { text: '-', fillColor: '#dedede' },
                            { text: '-', fillColor: '#dedede' }
                        ]);

                        report.content[16].stack[2].table.body.push([
                            '',
                            '',
                            '',
                            '',
                            'Total Output:',
                            '-',
                            '-',
                            '-',
                            '-',
                            '-',
                            '-',
                            '-'
                        ]);
                    }
                } else {
                    report.content[1].stack[15] = {};
                    report.content[16] = {};
                }

                //New radiators

                if (survey.surveys.includedReport.newradiators == 'YES' && !_.isUndefined(report.content[22].stack)) {
                    if (!!room.new_radiators) {
                        report.content[22].stack[2].table.body[1][7] = dataToString(survey.surveys.custom_MWT) + "\u00B0C Output Watts";
                        var span = Object.keys(room.new_radiators).length + 1;
                        if (!!room.radiators) {
                            report.content[22].stack[2].table.body.push([
                                { text: dataToString(room.designed_temperature), margin: [0, 8, 0, 0], fillColor: '#dedede' },
                                { text: dataToString(room.room_name), margin: [0, 8, 0, 0], fillColor: '#dedede' },
                                { text: dataToString(room.heat_loss.total_watts), margin: [0, 8, 0, 0], fillColor: '#dedede' },
                                { text: room.radiators.one ? dataToString(room.radiators.one.type) : '-', fillColor: '#dedede' },
                                { text: room.radiators.one ? dataToString(room.radiators.one.height) : '-', fillColor: '#dedede' },
                                { text: room.radiators.one ? dataToString(room.radiators.one.length) : '-', fillColor: '#dedede' },
                                { text: room.radiators.one ? dataToString(room.radiators.one.watts) : '-', fillColor: '#dedede' },
                                { text: '', fillColor: '#dedede' },
                                { text: room.radiators.one ? dataToString(room.radiators.one.flow_output ? room.radiators.one.flow_output[0] : '-') : '-', fillColor: '#dedede' },
                                { text: room.radiators.one ? dataToString(room.radiators.one.flow_output ? room.radiators.one.flow_output[1] : '-') : '-', fillColor: '#dedede' },
                                { text: room.radiators.one ? dataToString(room.radiators.one.flow_output ? room.radiators.one.flow_output[2] : '-') : '-', fillColor: '#dedede' },
                                { text: room.radiators.one ? dataToString(room.radiators.one.flow_output ? room.radiators.one.flow_output[3] : '-') : '-', fillColor: '#dedede' },
                                { text: room.radiators.one ? dataToString(room.radiators.one.flow_output ? room.radiators.one.flow_output[4] : '-') : '-', fillColor: '#dedede' },
                                { text: room.radiators.one ? dataToString(room.radiators.one.flow_output ? room.radiators.one.flow_output[5] : '-') : '-', fillColor: '#dedede' }
                            ]);

                            _.each(newRadKeys, function (idx) {
                                if (room.radiators[idx]) {
                                    report.content[22].stack[2].table.body.push([
                                        { text: '', fillColor: '#dedede' },
                                        { text: '', fillColor: '#dedede' },
                                        { text: '', fillColor: '#dedede' },
                                        { text: room.radiators[idx] ? dataToString(room.radiators[idx].type) : '-', fillColor: '#dedede' },
                                        { text: room.radiators[idx] ? dataToString(room.radiators[idx].height) : '-', fillColor: '#dedede' },
                                        { text: room.radiators[idx] ? dataToString(room.radiators[idx].length) : '-', fillColor: '#dedede' },
                                        { text: room.radiators[idx] ? dataToString(room.radiators[idx].watts) : '-', fillColor: '#dedede' },
                                        { text: '', fillColor: '#dedede' },
                                        { text: room.radiators[idx] ? dataToString(room.radiators[idx].flow_output ? room.radiators[idx].flow_output[0] : '-') : '-', fillColor: '#dedede' },
                                        { text: room.radiators[idx] ? dataToString(room.radiators[idx].flow_output ? room.radiators[idx].flow_output[1] : '-') : '-', fillColor: '#dedede' },
                                        { text: room.radiators[idx] ? dataToString(room.radiators[idx].flow_output ? room.radiators[idx].flow_output[2] : '-') : '-', fillColor: '#dedede' },
                                        { text: room.radiators[idx] ? dataToString(room.radiators[idx].flow_output ? room.radiators[idx].flow_output[3] : '-') : '-', fillColor: '#dedede' },
                                        { text: room.radiators[idx] ? dataToString(room.radiators[idx].flow_output ? room.radiators[idx].flow_output[4] : '-') : '-', fillColor: '#dedede' },
                                        { text: room.radiators[idx] ? dataToString(room.radiators[idx].flow_output ? room.radiators[idx].flow_output[5] : '-') : '-', fillColor: '#dedede' },
                                    ]);
                                }
                            });
                        }

                        if (!room.radiators) {
                            report.content[22].stack[2].table.body.push([
                                { text: dataToString(room.designed_temperature), margin: [0, 8, 0, 0], fillColor: '#dedede' },
                                { text: dataToString(room.room_name), margin: [0, 8, 0, 0], fillColor: '#dedede' },
                                { text: dataToString(room.heat_loss.total_watts), margin: [0, 8, 0, 0], fillColor: '#dedede' },
                                { text: '-', fillColor: '#dedede' },
                                { text: '-', fillColor: '#dedede' },
                                { text: '-', fillColor: '#dedede' },
                                { text: '-', fillColor: '#dedede' },
                                { text: '', fillColor: '#dedede' },
                                { text: '-', fillColor: '#dedede' },
                                { text: '-', fillColor: '#dedede' },
                                { text: '-', fillColor: '#dedede' },
                                { text: '-', fillColor: '#dedede' },
                                { text: '-', fillColor: '#dedede' },
                                { text: '-', fillColor: '#dedede' }
                            ]);
                        }


                        report.content[22].stack[2].table.body.push([
                            { text: '', fillColor: '#dedede' },
                            { text: '', fillColor: '#dedede' },
                            { text: '', fillColor: '#dedede' },
                            { text: '', fillColor: '#dedede' },
                            { text: '', fillColor: '#dedede' },
                            { text: 'Total Output:', fillColor: '#dedede' },
                            { text: dataToString(room.output_for_mwt, '-'), fillColor: '#dedede' },
                            { text: '', fillColor: '#dedede' },
                            { text: dataToString(room.total_flow ? room.total_flow[0] : '-'), fillColor: '#dedede' },
                            { text: dataToString(room.total_flow ? room.total_flow[1] : '-'), fillColor: '#dedede' },
                            { text: dataToString(room.total_flow ? room.total_flow[2] : '-'), fillColor: '#dedede' },
                            { text: dataToString(room.total_flow ? room.total_flow[3] : '-'), fillColor: '#dedede' },
                            { text: dataToString(room.total_flow ? room.total_flow[4] : '-'), fillColor: '#dedede' },
                            { text: dataToString(room.total_flow ? room.total_flow[5] : '-'), fillColor: '#dedede' }
                        ]);
                        report.content[22].stack[2].table.body.push([
                            { text: dataToString(room.designed_temperature), margin: [0, 8, 0, 0], fillColor: '#c7fafa' },
                            { text: dataToString(room.room_name), margin: [0, 8, 0, 0], fillColor: '#c7fafa' },
                            { text: dataToString(room.heat_loss.total_watts), margin: [0, 8, 0, 0], fillColor: '#c7fafa' },
                            { text: room.new_radiators.one ? dataToString(room.new_radiators.one.type) : '-', fillColor: '#c7fafa' },
                            { text: room.new_radiators.one ? dataToString(room.new_radiators.one.height) : '-', fillColor: '#c7fafa' },
                            { text: room.new_radiators.one ? dataToString(room.new_radiators.one.length) : '-', fillColor: '#c7fafa' },
                            { text: room.new_radiators.one ? dataToString(room.new_radiators.one.watts) : '-', fillColor: '#c7fafa' },
                            { text: room.new_radiators.one ? dataToString(room.new_radiators.one.custom_defined_MWT) : '-', fillColor: '#c7fafa' },
                            { text: room.new_radiators.one ? dataToString(room.new_radiators.one.flow_output ? room.new_radiators.one.flow_output[0] : '-') : '-', fillColor: '#c7fafa' },
                            { text: room.new_radiators.one ? dataToString(room.new_radiators.one.flow_output ? room.new_radiators.one.flow_output[1] : '-') : '-', fillColor: '#c7fafa' },
                            { text: room.new_radiators.one ? dataToString(room.new_radiators.one.flow_output ? room.new_radiators.one.flow_output[2] : '-') : '-', fillColor: '#c7fafa' },
                            { text: room.new_radiators.one ? dataToString(room.new_radiators.one.flow_output ? room.new_radiators.one.flow_output[3] : '-') : '-', fillColor: '#c7fafa' },
                            { text: room.new_radiators.one ? dataToString(room.new_radiators.one.flow_output ? room.new_radiators.one.flow_output[4] : '-') : '-', fillColor: '#c7fafa' },
                            { text: room.new_radiators.one ? dataToString(room.new_radiators.one.flow_output ? room.new_radiators.one.flow_output[5] : '-') : '-', fillColor: '#c7fafa' }
                        ]);
                        _.each(newRadKeys, function (idx) {
                            if (room.new_radiators[idx]) {
                                report.content[22].stack[2].table.body.push([

                                    { text: '', fillColor: '#c7fafa' },
                                    { text: '', fillColor: '#c7fafa' },
                                    { text: '', fillColor: '#c7fafa' },
                                    { text: room.new_radiators[idx].type ? dataToString(room.new_radiators[idx].type) : '-', fillColor: '#c7fafa' },
                                    { text: room.new_radiators[idx].height ? dataToString(room.new_radiators[idx].height) : '-', fillColor: '#c7fafa' },
                                    { text: room.new_radiators[idx].length ? dataToString(room.new_radiators[idx].length) : '-', fillColor: '#c7fafa' },
                                    { text: room.new_radiators[idx].watts ? dataToString(room.new_radiators[idx].watts) : '-', fillColor: '#c7fafa' },
                                    { text: room.new_radiators[idx].custom_defined_MWT ? dataToString(room.new_radiators[idx].custom_defined_MWT ? room.new_radiators[idx].custom_defined_MWT : '-') : '-', fillColor: '#c7fafa' },
                                    { text: room.new_radiators[idx].flow_output ? dataToString(room.new_radiators[idx].flow_output ? room.new_radiators[idx].flow_output[0] : '-') : '-', fillColor: '#c7fafa' },
                                    { text: room.new_radiators[idx].flow_output ? dataToString(room.new_radiators[idx].flow_output ? room.new_radiators[idx].flow_output[1] : '-') : '-', fillColor: '#c7fafa' },
                                    { text: room.new_radiators[idx].flow_output ? dataToString(room.new_radiators[idx].flow_output ? room.new_radiators[idx].flow_output[2] : '-') : '-', fillColor: '#c7fafa' },
                                    { text: room.new_radiators[idx].flow_output ? dataToString(room.new_radiators[idx].flow_output ? room.new_radiators[idx].flow_output[3] : '-') : '-', fillColor: '#c7fafa' },
                                    { text: room.new_radiators[idx].flow_output ? dataToString(room.new_radiators[idx].flow_output ? room.new_radiators[idx].flow_output[4] : '-') : '-', fillColor: '#c7fafa' },
                                    { text: room.new_radiators[idx].flow_output ? dataToString(room.new_radiators[idx].flow_output ? room.new_radiators[idx].flow_output[5] : '-') : '-', fillColor: '#c7fafa' }
                                ]);
                            }
                        });

                        let fillCustomTotalColor = 'red';
                        if (room.heat_loss.linked_total_watts) {
                            if (room.heat_loss.linked_total_watts <= room.new_custom_MWT_total) {
                                fillCustomTotalColor = 'green'
                            } else fillCustomTotalColor = 'red';
                        } else if (room.heat_loss.total_watts <= room.new_custom_MWT_total) {
                            fillCustomTotalColor = 'green'
                        } else fillCustomTotalColor = 'red';

                        report.content[22].stack[2].table.body.push([
                            { text: '', fillColor: '#c7fafa' },
                            { text: '', fillColor: '#c7fafa' },
                            { text: '', fillColor: '#c7fafa' },
                            { text: '', fillColor: '#c7fafa' },
                            { text: '', fillColor: '#c7fafa' },
                            { text: 'Total Output:', fillColor: '#c7fafa' },
                            { text: dataToString(room.new_rad_output_for_mwt, '-'), fillColor: '#c7fafa' },
                            { text: dataToString(room.new_custom_MWT_total ? room.new_custom_MWT_total : '-'), fillColor: fillCustomTotalColor },
                            { text: dataToString(room.new_rad_total_flow ? room.new_rad_total_flow[0] : '-'), fillColor: '#c7fafa' },
                            { text: dataToString(room.new_rad_total_flow ? room.new_rad_total_flow[1] : '-'), fillColor: '#c7fafa' },
                            { text: dataToString(room.new_rad_total_flow ? room.new_rad_total_flow[2] : '-'), fillColor: '#c7fafa' },
                            { text: dataToString(room.new_rad_total_flow ? room.new_rad_total_flow[3] : '-'), fillColor: '#c7fafa' },
                            { text: dataToString(room.new_rad_total_flow ? room.new_rad_total_flow[4] : '-'), fillColor: '#c7fafa' },
                            { text: dataToString(room.new_rad_total_flow ? room.new_rad_total_flow[5] : '-'), fillColor: '#c7fafa' }
                        ]);
                        report.content[22].stack[2].table.body.push([

                            { text: '', fillColor: '#c7fafa', colSpan: 14, fillColor: "#3287e3" },

                        ]);

                    }
                } else {
                    report.content[1].stack[15] = {};
                    report.content[22] = {};
                }


                //survey images

                if (survey.surveys.includedReport.photos_notes == 'YES' && !_.isUndefined(report.content[23].stack)) {

                    var tableHeight = 140
                    var tableWidth = 250
                    var imageHeight = 140
                    var imageWidth = 250
                    dataToPdf()
                    function convertImgToBase64 (url, callback, outputFormat) {
                        var canvas = document.createElement('CANVAS');
                        var ctx = canvas.getContext('2d');
                        var img = new Image;
                        img.crossOrigin = 'Anonymous';
                        img.setAttribute('crossOrigin', 'anonymous');
                        img.onload = function () {
                            canvas.height = img.height;
                            canvas.width = img.width;
                            ctx.drawImage(img, 0, 0);
                            var dataURL = canvas.toDataURL(outputFormat || 'image/png');
                            callback.call(this, dataURL);
                            $scope.selectedImageCount++
                            canvas = null;
                        };
                        img.src = url;
                    }
                    function dataToPdf () {
                        var selectedImages = []
                        if (room.images && room.images != null && room.images != undefined) {
                            selectedImages = room.images.filter(function (val) { return val.selected == true; });
                        }
                        imageRender(selectedImages)
                    }
                    // for loop for survey image

                    function imageRender (selectedImages) {
                        if (selectedImages.length != 0) {
                            var imageList = []
                            var despList = []
                            var widthList = []
                            var heightList = []
                            if (selectedImages.length < 3) {
                                for (let j = 0; j < selectedImages.length; j++) {
                                    var headers = {
                                        'Access-Control-Allow-Origin': '*',
                                        'Access-Control-Allow-Methods': 'GET, POST, HEAD, PUT, PATCH, DELETE',
                                        'Cache-Control': 'no-cache'
                                    }
                                    var noCors = {
                                        'Access-Control-Allow-Origin': '*',
                                        'Access-Control-Allow-Methods': 'GET, POST, HEAD, PUT, PATCH, DELETE'
                                    }
                                    fetch(selectedImages[j].imageLink, noCors)
                                        .then((response) => {
                                            convertImgToBase64(response.url, function (dataUri) {
                                                var image = {
                                                    image: dataUri, fit: [250, 250],
                                                    border: [false, false, false, false],
                                                };
                                                var decp = {
                                                    text: "Description" + " : " + selectedImages[j].imageDesc, width: 200,
                                                    border: [false, false, false, false],
                                                };
                                                var width = 250
                                                var height = 200

                                                imageList.push(image)
                                                despList.push(decp)
                                                widthList.push(width)
                                                heightList.push(height)
                                            });
                                        })



                                }
                                var table = {
                                    pageBreak: 'after',
                                    style: 'tableExample',
                                    table: {
                                        widths: widthList,
                                        heights: heightList,
                                        body: [
                                            imageList,
                                            despList
                                        ]
                                    }
                                }
                                var text = {
                                    text: room.room_name, fontSize: 15, margin: 20
                                }
                                var text1 = {
                                    text: room.room_notes, fontSize: 11, margin: 20
                                }
                                report.content[23].stack.push(text)
                                report.content[23].stack.push(text1)
                                report.content[23].stack.push(table)
                                //  plantImageRender()


                            } else if (selectedImages.length < 6) {
                                var imageList1 = []
                                var despList1 = []
                                var widthList1 = []
                                var heightList1 = []
                                for (let j = 0; j < 3; j++) {
                                    fetch(selectedImages[j].imageLink, noCors)
                                        .then((response) => {
                                            convertImgToBase64(response.url, function (dataUri) {
                                                var image = {
                                                    image: dataUri, fit: [250, 250],
                                                    border: [false, false, false, false],
                                                };

                                                var decp = {
                                                    text: "Description" + " : " + selectedImages[j].imageDesc, width: 200, margin: [0, 0, 0, 30],
                                                    border: [false, false, false, false],
                                                };
                                                var width = 250
                                                var height = 200
                                                imageList1.push(image)
                                                despList1.push(decp)
                                                widthList1.push(width)
                                                heightList1.push(height)

                                                var description = []
                                                description.push(selectedImages[j].imageDesc)

                                            });
                                        })
                                }

                                var text = {
                                    text: room.room_name, fontSize: 20
                                }
                                var text1 = {
                                    text: room.room_notes, fontSize: 14
                                }


                                var imageList2 = []
                                var despList2 = []
                                var widthList2 = []
                                var heightList2 = []
                                for (let j = 3; j < selectedImages.length; j++) {
                                    fetch(selectedImages[j].imageLink, noCors)
                                        .then((response) => {
                                            convertImgToBase64(response.url, function (dataUri) {
                                                var image = {
                                                    image: dataUri, fit: [250, 250],
                                                    border: [false, false, false, false],
                                                };

                                                var decp = {
                                                    text: "Description" + " : " + selectedImages[j].imageDesc, width: 200,
                                                    border: [false, false, false, false],
                                                    // alignment: 'center'
                                                };

                                                var width = 250
                                                var height = 200
                                                imageList2.push(image)
                                                despList2.push(decp)
                                                widthList2.push(width)
                                                heightList2.push(height)

                                                var description = []
                                                description.push(selectedImages[j].imageDesc)

                                            });
                                        })
                                }
                                var table1 = {
                                    style: 'tableExample',
                                    table: {
                                        widths: widthList1,
                                        heights: heightList1,
                                        body: [
                                            imageList1,
                                            despList1
                                        ]
                                    }
                                }
                                var table2 = {
                                    pageBreak: 'after',
                                    style: 'tableExample',
                                    table: {
                                        widths: widthList2,
                                        heights: heightList2,
                                        body: [
                                            imageList2,
                                            despList2
                                        ]
                                    }
                                }

                                // await report.content[23].stack.push(text)
                                report.content[23].stack.push(text)
                                report.content[23].stack.push(text1)
                                report.content[23].stack.push(table1)
                                report.content[23].stack.push(table2)
                                //  plantImageRender()
                            } else {
                                var imageList1 = []
                                var despList1 = []
                                var widthList1 = []
                                var heightList1 = []
                                for (let j = 0; j < 3; j++) {
                                    fetch(selectedImages[j].imageLink, noCors)
                                        .then((response) => {
                                            convertImgToBase64(response.url, function (dataUri) {
                                                var image = {
                                                    image: dataUri, fit: [250, 250],
                                                    border: [false, false, false, false],
                                                };

                                                var decp = {
                                                    text: "Description" + " : " + selectedImages[j].imageDesc, width: 200, margin: [0, 0, 0, 30],
                                                    border: [false, false, false, false],
                                                };
                                                var width = 250
                                                var height = 200
                                                imageList1.push(image)
                                                despList1.push(decp)
                                                widthList1.push(width)
                                                heightList1.push(height)

                                                var description = []
                                                description.push(selectedImages[j].imageDesc)

                                            });
                                        })
                                }

                                var text = {
                                    text: room.room_name, fontSize: 20
                                }
                                var text1 = {
                                    text: room.room_notes, fontSize: 14
                                }

                                var imageList2 = []
                                var despList2 = []
                                var widthList2 = []
                                var heightList2 = []
                                for (let j = 3; j < 6; j++) {
                                    fetch(selectedImages[j].imageLink, noCors)
                                        .then((response) => {
                                            convertImgToBase64(response.url, function (dataUri) {
                                                var image = {
                                                    image: dataUri, fit: [250, 250],
                                                    border: [false, false, false, false],
                                                };

                                                var decp = {
                                                    text: "Description" + " : " + selectedImages[j].imageDesc, width: 200,
                                                    border: [false, false, false, false],
                                                    // alignment: 'center'
                                                };

                                                var width = 250
                                                var height = 200
                                                imageList2.push(image)
                                                despList2.push(decp)
                                                widthList2.push(width)
                                                heightList2.push(height)

                                                var description = []
                                                description.push(selectedImages[j].imageDesc)

                                            });
                                        })
                                }


                                var imageList3 = []
                                var despList3 = []
                                var widthList3 = []
                                var heightList3 = []
                                for (let j = 6; j < selectedImages.length; j++) {
                                    fetch(selectedImages[j].imageLink, noCors)
                                        .then((response) => {
                                            convertImgToBase64(response.url, function (dataUri) {
                                                var image = {
                                                    image: dataUri, fit: [250, 250],
                                                    border: [false, false, false, false],
                                                };

                                                var decp = {
                                                    text: "Description" + " : " + selectedImages[j].imageDesc, width: 200,
                                                    border: [false, false, false, false],
                                                    // alignment: 'center'
                                                };

                                                var width = 250
                                                var height = 200
                                                imageList3.push(image)
                                                despList3.push(decp)
                                                widthList3.push(width)
                                                heightList3.push(height)

                                                var description = []
                                                description.push(selectedImages[j].imageDesc)

                                            });
                                        })
                                }

                                var table1 = {
                                    style: 'tableExample',
                                    table: {
                                        widths: widthList1,
                                        heights: heightList1,
                                        body: [
                                            imageList1,
                                            despList1
                                        ]
                                    }
                                }
                                var table2 = {
                                    pageBreak: 'after',
                                    style: 'tableExample',
                                    table: {
                                        widths: widthList2,
                                        heights: heightList2,
                                        body: [
                                            imageList2,
                                            despList2
                                        ]
                                    }
                                }
                                var table3 = {
                                    pageBreak: 'after',
                                    style: 'tableExample',
                                    table: {
                                        widths: widthList3,
                                        heights: heightList3,
                                        body: [
                                            imageList3,
                                            despList3
                                        ]
                                    }
                                }

                                // await report.content[23].stack.push(text)
                                report.content[23].stack.push(text)
                                report.content[23].stack.push(text1)
                                report.content[23].stack.push(table1)
                                report.content[23].stack.push(table2)
                                report.content[23].stack.push(table3)
                                //  plantImageRender()
                            }
                        }
                        if (idx == 0) {
                            setTimeout(() => {
                                plantImageRender()
                            }, 1000);
                        }


                    }
                    // for loop for plant image
                    function plantImageRender () {
                        let img = []
                        if (survey.surveys.plantRooms) {

                            img = survey.surveys.plantRooms.filter(function (val) { return val.selected == true; })

                        }

                        if (survey.surveys.plantRooms && survey.surveys.plantRooms != null && survey.surveys.plantRooms != undefined && img.length > 0) {
                            var text = {
                                text: "PLANT ROOM / CYLINDER LOCATION SURVEY PHOTOS AND NOTES", fontSize: 25, margin: 20, alignment: 'center'
                            }
                            report.content[23].stack.push(text)
                            var imageList = []
                            var despList = []
                            var widthList = []
                            var heightList = []
                            var selectedImages = []
                            // var plantRooms = []

                            var headers = {
                                'Access-Control-Allow-Origin': '*',
                                'Access-Control-Allow-Methods': 'GET, POST, HEAD, PUT, PATCH, DELETE',
                            }
                            var noCors = {
                                'Access-Control-Allow-Origin': '*',
                                'Access-Control-Allow-Methods': 'GET, POST, HEAD, PUT, PATCH, DELETE'
                            }
                            selectedImages = survey.surveys.plantRooms.filter(function (val) { return val.selected == true; });
                            if (selectedImages.length < 3) {
                                for (let j = 0; j < selectedImages.length; j++) {
                                    fetch(selectedImages[j].imageLink, noCors)
                                        .then((response) => {
                                            convertImgToBase64(response.url, function (dataUri) {
                                                var image = {
                                                    image: dataUri, fit: [250, 250],
                                                    border: [false, false, false, false],
                                                };
                                                var decp = {
                                                    text: "Description" + " : " + selectedImages[j].imageDesc, width: 200,
                                                    border: [false, false, false, false],
                                                };
                                                var width = 250
                                                var height = 200
                                                imageList.push(image)
                                                despList.push(decp)
                                                widthList.push(width)
                                                heightList.push(height)

                                            });
                                        })
                                }
                                var table = {
                                    pageBreak: 'after',
                                    style: 'tableExample',
                                    table: {
                                        widths: widthList,
                                        heights: heightList,
                                        body: [
                                            imageList,
                                            despList
                                        ]
                                    }
                                }

                                report.content[23].stack.push(table)
                            } else if (selectedImages.length < 6) {
                                var imageList1 = []
                                var despList1 = []
                                var widthList1 = []
                                var heightList1 = []
                                for (let j = 0; j < 3; j++) {
                                    fetch(selectedImages[j].imageLink, noCors)
                                        .then((response) => {
                                            convertImgToBase64(response.url, function (dataUri) {
                                                var image = {
                                                    image: dataUri, fit: [250, 250],
                                                    border: [false, false, false, false],
                                                };
                                                var decp = {
                                                    text: "Description" + " : " + selectedImages[j].imageDesc, width: 200, margin: [0, 0, 0, 50],
                                                    border: [false, false, false, false],
                                                };
                                                var width = 250
                                                var height = 200
                                                imageList1.push(image)
                                                despList1.push(decp)
                                                widthList1.push(width)
                                                heightList1.push(height)

                                            });
                                        })

                                }
                                var imageList2 = []
                                var despList2 = []
                                var widthList2 = []
                                var heightList2 = []
                                for (let j = 3; j < selectedImages.length; j++) {
                                    fetch(selectedImages[j].imageLink, noCors)
                                        .then((response) => {
                                            convertImgToBase64(response.url, function (dataUri) {
                                                var image = {
                                                    image: dataUri, fit: [250, 250],
                                                    border: [false, false, false, false],
                                                };

                                                var decp = {
                                                    text: "Description" + " : " + selectedImages[j].imageDesc, width: 200,
                                                    border: [false, false, false, false],
                                                    //alignment: 'center'
                                                };
                                                var width = 250
                                                var height = 200
                                                imageList2.push(image)
                                                despList2.push(decp)
                                                widthList2.push(width)
                                                heightList2.push(height)
                                            });
                                        })

                                }
                                var table1 = {
                                    style: 'tableExample',
                                    table: {
                                        widths: widthList1,
                                        heights: heightList1,
                                        body: [
                                            imageList1,
                                            despList1
                                        ]
                                    }
                                }
                                var table2 = {
                                    pageBreak: 'after',
                                    style: 'tableExample',
                                    table: {
                                        widths: widthList2,
                                        heights: heightList2,
                                        body: [
                                            imageList2,
                                            despList2
                                        ]
                                    }
                                }
                                report.content[23].stack.push(table1)
                                report.content[23].stack.push(table2)
                            } else {
                                var imageList1 = []
                                var despList1 = []
                                var widthList1 = []
                                var heightList1 = []
                                for (let j = 0; j < 3; j++) {
                                    fetch(selectedImages[j].imageLink, noCors)
                                        .then((response) => {
                                            convertImgToBase64(response.url, function (dataUri) {
                                                var image = {
                                                    image: dataUri, fit: [250, 250],
                                                    border: [false, false, false, false],
                                                };
                                                var decp = {
                                                    text: "Description" + " : " + selectedImages[j].imageDesc, width: 200, margin: [0, 0, 0, 50],
                                                    border: [false, false, false, false],
                                                };
                                                var width = 250
                                                var height = 200
                                                imageList1.push(image)
                                                despList1.push(decp)
                                                widthList1.push(width)
                                                heightList1.push(height)

                                            });
                                        })

                                }
                                var imageList2 = []
                                var despList2 = []
                                var widthList2 = []
                                var heightList2 = []
                                for (let j = 3; j < 6; j++) {
                                    fetch(selectedImages[j].imageLink, noCors)
                                        .then((response) => {
                                            convertImgToBase64(response.url, function (dataUri) {
                                                var image = {
                                                    image: dataUri, fit: [250, 250],
                                                    border: [false, false, false, false],
                                                };

                                                var decp = {
                                                    text: "Description" + " : " + selectedImages[j].imageDesc, width: 200,
                                                    border: [false, false, false, false],
                                                    //alignment: 'center'
                                                };
                                                var width = 250
                                                var height = 200
                                                imageList2.push(image)
                                                despList2.push(decp)
                                                widthList2.push(width)
                                                heightList2.push(height)
                                            });
                                        })

                                }

                                var imageList3 = []
                                var despList3 = []
                                var widthList3 = []
                                var heightList3 = []
                                for (let j = 6; j < selectedImages.length; j++) {
                                    fetch(selectedImages[j].imageLink, noCors)
                                        .then((response) => {
                                            convertImgToBase64(response.url, function (dataUri) {
                                                var image = {
                                                    image: dataUri, fit: [250, 250],
                                                    border: [false, false, false, false],
                                                };

                                                var decp = {
                                                    text: "Description" + " : " + selectedImages[j].imageDesc, width: 200,
                                                    border: [false, false, false, false],
                                                    //alignment: 'center'
                                                };
                                                var width = 250
                                                var height = 200
                                                imageList3.push(image)
                                                despList3.push(decp)
                                                widthList3.push(width)
                                                heightList3.push(height)
                                            });
                                        })

                                }
                                var table1 = {
                                    style: 'tableExample',
                                    table: {
                                        widths: widthList1,
                                        heights: heightList1,
                                        body: [
                                            imageList1,
                                            despList1
                                        ]
                                    }
                                }
                                var table2 = {
                                    pageBreak: 'after',
                                    style: 'tableExample',
                                    table: {
                                        widths: widthList2,
                                        heights: heightList2,
                                        body: [
                                            imageList2,
                                            despList2
                                        ]
                                    }
                                }
                                var table3 = {
                                    pageBreak: 'after',
                                    style: 'tableExample',
                                    table: {
                                        widths: widthList3,
                                        heights: heightList3,
                                        body: [
                                            imageList3,
                                            despList3
                                        ]
                                    }
                                }
                                report.content[23].stack.push(table1)
                                report.content[23].stack.push(table2)
                                report.content[23].stack.push(table3)
                            }

                        }

                        heatPumpsImageRender()

                    }
                    // for loop for plant image
                    function heatPumpsImageRender () {
                        let img = []
                        if (survey.surveys.heatPumps) {

                            img = survey.surveys.heatPumps.filter(function (val) { return val.selected == true; })

                        }

                        if (survey.surveys.heatPumps && survey.surveys.heatPumps != null && survey.surveys.heatPumps != undefined && img.length != 0) {

                            var text = {
                                text: "HEAT PUMP / OUTSIDE LOCATION SURVEY PHOTOS AND NOTES", fontSize: 25, margin: 20, alignment: 'center'
                            }
                            report.content[23].stack.push(text)
                            var imageList = []
                            var despList = []
                            var widthList = []
                            var heightList = []
                            var selectedImages = []
                            // var plantRooms = []

                            var headers = {
                                'Access-Control-Allow-Origin': '*',
                                'Access-Control-Allow-Methods': 'GET, POST, HEAD, PUT, PATCH, DELETE',
                            }
                            var noCors = {
                                'Access-Control-Allow-Origin': '*',
                                'Access-Control-Allow-Methods': 'GET, POST, HEAD, PUT, PATCH, DELETE'
                            }
                            selectedImages = survey.surveys.heatPumps.filter(function (val) { return val.selected == true; });
                            if (selectedImages.length < 3) {
                                for (let j = 0; j < selectedImages.length; j++) {
                                    fetch(selectedImages[j].imageLink, noCors)
                                        .then((response) => {
                                            convertImgToBase64(response.url, function (dataUri) {
                                                var image = {
                                                    image: dataUri, fit: [250, 250],
                                                    border: [false, false, false, false],
                                                };
                                                var decp = {
                                                    text: "Description" + " : " + selectedImages[j].imageDesc, width: 200, margin: [0, 0, 0, 50],
                                                    border: [false, false, false, false],
                                                };
                                                var width = 250
                                                var height = 200
                                                imageList.push(image)
                                                despList.push(decp)
                                                widthList.push(width)
                                                heightList.push(height)
                                            });
                                        })
                                }
                                var table = {
                                    pageBreak: 'after',
                                    style: 'tableExample',
                                    table: {
                                        widths: widthList,
                                        heights: heightList,
                                        body: [
                                            imageList,
                                            despList
                                        ]
                                    }
                                }

                                report.content[23].stack.push(table)
                            } else if (selectedImages.length < 6) {

                                var imageList1 = []
                                var despList1 = []
                                var widthList1 = []
                                var heightList1 = []
                                for (let j = 0; j < 3; j++) {
                                    fetch(selectedImages[j].imageLink, noCors)
                                        .then((response) => {


                                            convertImgToBase64(response.url, function (dataUri) {
                                                var image = {
                                                    image: dataUri, fit: [250, 250],
                                                    border: [false, false, false, false],
                                                };
                                                var decp = {
                                                    text: "Description" + " : " + selectedImages[j].imageDesc, width: 200, margin: [0, 0, 0, 50],
                                                    border: [false, false, false, false],
                                                };
                                                var width = 250
                                                var height = 200
                                                widthList1.push(width)
                                                imageList1.push(image)
                                                despList1.push(decp)
                                                heightList1.push(height)

                                            });
                                        })
                                }
                                var imageList2 = []
                                var despList2 = []
                                var widthList2 = []
                                var heightList2 = []
                                for (let j = 3; j < selectedImages.length; j++) {
                                    fetch(selectedImages[j].imageLink, noCors)
                                        .then((response) => {
                                            convertImgToBase64(response.url, function (dataUri) {
                                                var image = {
                                                    image: dataUri, fit: [250, 250],
                                                    border: [false, false, false, false],
                                                };

                                                var decp = {
                                                    text: "Description" + " : " + selectedImages[j].imageDesc, width: 200, margin: [0, 0, 0, 50],
                                                    border: [false, false, false, false],
                                                    //alignment: 'center'
                                                };
                                                var width = 250
                                                var height = 200
                                                imageList2.push(image)
                                                despList2.push(decp)
                                                widthList2.push(width)
                                                heightList2.push(height)
                                            });
                                        })
                                }
                                var table1 = {
                                    style: 'tableExample',
                                    table: {
                                        widths: widthList1,
                                        heights: heightList1,
                                        body: [
                                            imageList1,
                                            despList1
                                        ]
                                    }
                                }
                                var table2 = {
                                    pageBreak: 'after',
                                    style: 'tableExample',
                                    widths: widthList2,
                                    heights: heightList2,
                                    table: {
                                        body: [
                                            imageList2,
                                            despList2
                                        ]
                                    }
                                }
                                report.content[23].stack.push(table1)
                                report.content[23].stack.push(table2)
                            } else {
                                var imageList1 = []
                                var despList1 = []
                                var widthList1 = []
                                var heightList1 = []
                                for (let j = 0; j < 3; j++) {
                                    fetch(selectedImages[j].imageLink, noCors)
                                        .then((response) => {


                                            convertImgToBase64(response.url, function (dataUri) {
                                                var image = {
                                                    image: dataUri, fit: [250, 250],
                                                    border: [false, false, false, false],
                                                };
                                                var decp = {
                                                    text: "Description" + " : " + selectedImages[j].imageDesc, width: 200, margin: [0, 0, 0, 50],
                                                    border: [false, false, false, false],
                                                };
                                                var width = 250
                                                var height = 200
                                                widthList1.push(width)
                                                imageList1.push(image)
                                                despList1.push(decp)
                                                heightList1.push(height)

                                            });
                                        })
                                }
                                var imageList2 = []
                                var despList2 = []
                                var widthList2 = []
                                var heightList2 = []
                                for (let j = 3; j < 6; j++) {
                                    fetch(selectedImages[j].imageLink, noCors)
                                        .then((response) => {
                                            convertImgToBase64(response.url, function (dataUri) {
                                                var image = {
                                                    image: dataUri, fit: [250, 250],
                                                    border: [false, false, false, false],
                                                };

                                                var decp = {
                                                    text: "Description" + " : " + selectedImages[j].imageDesc, width: 200, margin: [0, 0, 0, 50],
                                                    border: [false, false, false, false],
                                                    //alignment: 'center'
                                                };
                                                var width = 250
                                                var height = 200
                                                imageList2.push(image)
                                                despList2.push(decp)
                                                widthList2.push(width)
                                                heightList2.push(height)
                                            });
                                        })
                                }

                                var imageList3 = []
                                var despList3 = []
                                var widthList3 = []
                                var heightList3 = []
                                for (let j = 6; j < selectedImages.length; j++) {
                                    fetch(selectedImages[j].imageLink, noCors)
                                        .then((response) => {
                                            convertImgToBase64(response.url, function (dataUri) {
                                                var image = {
                                                    image: dataUri, fit: [250, 250],
                                                    border: [false, false, false, false],
                                                };

                                                var decp = {
                                                    text: "Description" + " : " + selectedImages[j].imageDesc, width: 200, margin: [0, 0, 0, 50],
                                                    border: [false, false, false, false],
                                                    //alignment: 'center'
                                                };
                                                var width = 250
                                                var height = 200
                                                imageList3.push(image)
                                                despList3.push(decp)
                                                widthList3.push(width)
                                                heightList3.push(height)
                                            });
                                        })
                                }
                                var table1 = {
                                    style: 'tableExample',
                                    table: {
                                        widths: widthList1,
                                        heights: heightList1,
                                        body: [
                                            imageList1,
                                            despList1
                                        ]
                                    }
                                }
                                var table2 = {
                                    pageBreak: 'after',
                                    style: 'tableExample',
                                    widths: widthList2,
                                    heights: heightList2,
                                    table: {
                                        body: [
                                            imageList2,
                                            despList2
                                        ]
                                    }
                                }
                                var table3 = {
                                    pageBreak: 'after',
                                    style: 'tableExample',
                                    widths: widthList3,
                                    heights: heightList3,
                                    table: {
                                        body: [
                                            imageList3,
                                            despList3
                                        ]
                                    }
                                }
                                report.content[23].stack.push(table1)
                                report.content[23].stack.push(table2)
                                report.content[23].stack.push(table3)
                            }
                        }
                    }
                } else {
                    report.content[1].stack[15] = {};
                    report.content[23] = {};
                }

                if (survey.surveys.includedReport.pipeRadiators == 'YES' && !_.isUndefined(report.content[15].stack)) {

                    if (survey.surveys.tees) {
                        {
                            report.content[15].stack[6].table.body.push([

                                { text: dataToString(room.pipeRunData.predecessorId) },
                                { text: dataToString(room.pipeRunData.pipeRunAndOrderId) },
                                { text: dataToString(room.room_name) },
                                { text: dataToString((parseFloat(room.pipe.massFlowRate.toFixed(3)))) },
                                { text: dataToString(parseFloat(room.massFlowSubTotal.toFixed(3))) },
                                { text: dataToString(room.pipe_nom_dia) },
                                { text: dataToString(parseFloat(room.pipe.pressureLossPA).toFixed(2)) },
                                { text: dataToString(parseFloat(room.pipe.pressureLossM).toFixed(2)) },
                                { text: dataToString(room.flowReturnPipes) },
                                { text: dataToString(parseFloat(room.pipe.totPressureLoss).toFixed(2)) },
                            ]);
                        }
                        if (survey.surveys.includedReport.pipeRadiators == 'YES' && !_.isUndefined(report.content[15].stack)) {

                            if (room.radiators) {
                                let displayHeaderRad = 0;
                                _.each(room.radiators, function (rad, idx) {
                                    if (rad != null) {
                                        if (rad.type != "") {
                                            report.content[15].stack[6].table.body.push([

                                                dataToString(rad.predecessorId),
                                                dataToString(rad.pipeRunAndOrderId),
                                                dataToString(rad.type),
                                                dataToString(parseFloat(rad.massFlowRate).toFixed(3)),
                                                rad.massFlowSubTotal !== undefined ? dataToString(parseFloat(rad.massFlowSubTotal).toFixed(3)) : 0.000,
                                                rad ? dataToString(rad.pipeSelected) : '-',
                                                rad ? dataToString(parseFloat(rad.radspressureLossPA).toFixed(3)) : '-',
                                                rad ? dataToString(parseFloat(rad.radspressureLossM).toFixed(3)) : '-',
                                                rad ? dataToString(rad.radsFlowReturn) : '-',
                                                rad.radsTotalPressureLoss !== undefined ? dataToString(parseFloat(rad.radsTotalPressureLoss).toFixed(3)) : 0,

                                            ])
                                        }
                                    }
                                })
                            }
                        }
                    }
                }
            });
            if (survey.surveys.includedReport.pipeRadiators == 'YES' && !_.isUndefined(report.content[15].stack)) {
                report.content[15].stack[3].table.body.push([{
                    text: 'Maximum Flow Temperature',
                },
                {
                    text: survey.surveys.primaryFlowIndex.maxFlowTemp ? survey.surveys.primaryFlowIndex.maxFlowTemp : '-',

                }
                ]);
            }

            if (survey.surveys.includedReport.pipeRadiators == 'YES' && !_.isUndefined(report.content[15].stack)) {
                report.content[15].stack[4].table.body.push([{
                    text: 'Index Heat Source And Return',
                    margin: [0, 8, 0, 0]
                },
                {
                    text: survey.surveys.primaryFlowIndex.roomHeatLoss ? dataToString(survey.surveys.primaryFlowIndex.roomHeatLoss) : '0',
                    margin: [0, 8, 0, 0]
                },
                {
                    text: survey.surveys.primaryFlowIndex.maxFlowTemp ? dataToString(survey.surveys.primaryFlowIndex.maxFlowTemp) : '0',
                    margin: [0, 8, 0, 0]
                },
                {
                    text: survey.surveys.primaryFlowIndex.returnTemp ? dataToString(survey.surveys.primaryFlowIndex.returnTemp) : '0',
                    margin: [0, 8, 0, 0]
                },
                {
                    text: survey.surveys.primaryFlowIndex.delta ? dataToString(survey.surveys.primaryFlowIndex.delta) : '0',
                    margin: [0, 8, 0, 0]
                },
                {
                    text: survey.surveys.primaryFlowIndex.pipeSelect ? dataToString(survey.surveys.primaryFlowIndex.pipeSelect) : '0',
                    margin: [0, 8, 0, 0]
                },
                {
                    text: survey.surveys.primaryFlowIndex.meanVelo ? dataToString(parseFloat(survey.surveys.primaryFlowIndex.meanVelo).toFixed(2)) : '0',
                    margin: [0, 8, 0, 0]
                },
                {
                    text: survey.surveys.primaryFlowIndex.veloCheck ? dataToString(survey.surveys.primaryFlowIndex.veloCheck) : '0',
                    margin: [0, 8, 0, 0]
                },
                {
                    text: survey.surveys.primaryFlowIndex.pressureL ? dataToString(parseFloat(survey.surveys.primaryFlowIndex.pressureL).toFixed(2)) : '0',
                    margin: [0, 8, 0, 0]
                },
                {
                    text: survey.surveys.primaryFlowIndex.pLoss ? dataToString(parseFloat(survey.surveys.primaryFlowIndex.pLoss).toFixed(2)) : '0',
                    margin: [0, 8, 0, 0]
                },
                {
                    text: survey.surveys.primaryFlowIndex.lengthFlow ? dataToString(survey.surveys.primaryFlowIndex.lengthFlow) : '0',
                    margin: [0, 8, 0, 0]
                },
                {
                    text: survey.surveys.primaryFlowIndex.totPreLoss ? dataToString(parseFloat(survey.surveys.primaryFlowIndex.totPreLoss).toFixed(2)) : '0',
                    margin: [0, 8, 0, 0]
                },
                ]);
            }
            //todo

            if (survey.surveys.includedReport.pipeRadiators == 'YES' && !_.isUndefined(report.content[15].stack)) {
                // CURRENT PIPE CALCULATION
                var t = survey.surveys.tees
                if (survey.surveys.tees) {
                    angular.forEach(t, function (val, idx) {
                        if (val != null) {
                            report.content[15].stack[5].table.body.push([

                                { text: "Tee" + (idx + 1).toString() },
                                { text: dataToString(val.preId) },
                                { text: dataToString(val.pipeRunIds[0].roomRunId) },
                                { text: dataToString(val.pipeRunIds[1].roomRunId) },
                                { text: dataToString((parseFloat(val.massFlowSubTotal).toFixed(2))) },
                                { text: dataToString(val.pipeSelect) },
                                { text: dataToString(parseFloat(val.meanVelosity).toFixed(2)) },
                                { text: dataToString(val.velosityCheck) },
                                { text: dataToString(parseFloat(val.pressureLossPA).toFixed(2)) },
                                { text: dataToString(parseFloat(val.pressureLossM).toFixed(2)) },
                                { text: dataToString(val.pipeRunFlowLength) },
                                { text: dataToString(val.pipeRunFlowLength) > 0 ? dataToString(parseFloat(val.pipeRunFlowLength * val.pressureLossM).toFixed(2)) : 0 }

                            ]);
                        }
                    });
                }
            }


            // Change original array to default again
            survey.surveys.rooms = rooms_temp_default;

            if (survey.surveys.includedReport.dhw == 'YES' && !_.isUndefined(report.content[13].stack)) {
                if (survey.surveys.proposed_install_type.toLowerCase() == 'ashp' || survey.surveys.proposed_install_type.toLowerCase() == 'gshp') {
                    // DOMESTIC HOT WATER
                    report.content[13].stack[2].columns[1].stack[0].text = dataToString(survey.surveys.domestic_hot_water.number_of_bed_rooms);
                    report.content[13].stack[2].columns[1].stack[1].text = dataToString(survey.surveys.domestic_hot_water.number_of_occupants_per_bedroom);
                    report.content[13].stack[2].columns[1].stack[2].text = dataToString(survey.surveys.domestic_hot_water.flow_temperature_for_hot_water.temp, false, ' \u00B0C (55 for heat pump others 70)');
                    report.content[13].stack[2].columns[1].stack[3].text = dataToString(survey.surveys.domestic_hot_water.hot_water_per_occupant, false, ' litres (if heat pump use 45, if other use 35)');
                    report.content[13].stack[2].columns[1].stack[4].text = dataToString(survey.surveys.domestic_hot_water.efficiency_pipework_loss_to_cylinder, false, ' %');
                    report.content[13].stack[2].columns[1].stack[5].text = dataToString(survey.surveys.domestic_hot_water.electricity_cost, false, ' pence per kWh');
                    report.content[13].stack[2].columns[1].stack[10].text = dataToString(survey.surveys.domestic_hot_water.hot_water_energy, false, ' kWh');

                    report.content[13].stack[2].columns[1].stack[12].text = dataToString(survey.surveys.domestic_hot_water.hot_water_demand_per_day, false, ' kWh');
                    report.content[13].stack[2].columns[1].stack[13].text = dataToString(survey.surveys.domestic_hot_water.hot_water_annual_demand, false, ' kWh');
                    report.content[13].stack[2].columns[1].stack[15].text = dataToString(survey.surveys.domestic_hot_water.hot_water_demand_per_day, false, ' kWh');
                    report.content[13].stack[2].columns[1].stack[16].text = dataToString(survey.surveys.domestic_hot_water.hot_water_annual_demand, false, ' kWh');
                    report.content[13].stack[2].columns[1].stack[18].text = dataToString(survey.surveys.domestic_hot_water.hot_water_demand_per_day, false, ' kWh');
                    report.content[13].stack[2].columns[1].stack[19].text = dataToString(survey.surveys.domestic_hot_water.hot_water_annual_demand, false, ' kWh');
                    report.content[13].stack[2].columns[1].stack[21].text = dataToString(survey.surveys.domestic_hot_water.hot_water_demand_per_day, false, ' kWh');
                    report.content[13].stack[2].columns[1].stack[22].text = dataToString(survey.surveys.domestic_hot_water.hot_water_annual_demand, false, ' kWh');

                } else {


                    report.content[13].stack[2].columns[1].stack[0].text = dataToString(survey.surveys.domestic_hot_water.number_of_bed_rooms);
                    report.content[13].stack[2].columns[1].stack[1].text = dataToString(survey.surveys.domestic_hot_water.number_of_occupants_per_bedroom);
                    report.content[13].stack[2].columns[1].stack[2].text = dataToString(survey.surveys.domestic_hot_water.flow_temperature_for_hot_water.temp, false, ' \u00B0C (55 for heat pump others 70)');
                    report.content[13].stack[2].columns[1].stack[3].text = dataToString(survey.surveys.domestic_hot_water.hot_water_per_occupant, false, ' litres (if heat pump use 45, if other use 35)');
                    report.content[13].stack[2].columns[1].stack[4].text = dataToString(survey.surveys.domestic_hot_water.efficiency_pipework_loss_to_cylinder, false, ' %');
                    report.content[13].stack[2].columns[1].stack[5].text = dataToString(survey.surveys.domestic_hot_water.electricity_cost, false, ' pence per kWh');
                    report.content[13].stack[2].columns[1].stack[10].text = dataToString(survey.surveys.domestic_hot_water.hot_water_energy, false, ' kWh');


                    report.content[13].stack[2].columns[1].stack[12].text = dataToString(survey.surveys.domestic_hot_water.hot_water_demand_per_day, false, ' kWh');
                    report.content[13].stack[2].columns[1].stack[13].text = dataToString(survey.surveys.domestic_hot_water.hot_water_annual_demand, false, ' kWh');
                    report.content[13].stack[2].columns[1].stack[15].text = dataToString(survey.surveys.domestic_hot_water.hot_water_demand_per_day, false, ' kWh');
                    report.content[13].stack[2].columns[1].stack[16].text = dataToString(survey.surveys.domestic_hot_water.hot_water_annual_demand, false, ' kWh');
                    report.content[13].stack[2].columns[1].stack[18].text = dataToString(survey.surveys.domestic_hot_water.hot_water_demand_per_day, false, ' kWh');
                    report.content[13].stack[2].columns[1].stack[19].text = dataToString(survey.surveys.domestic_hot_water.hot_water_annual_demand, false, ' kWh');
                    report.content[13].stack[2].columns[1].stack[21].text = dataToString(survey.surveys.domestic_hot_water.hot_water_demand_per_day, false, ' kWh');
                    report.content[13].stack[2].columns[1].stack[22].text = dataToString(survey.surveys.domestic_hot_water.hot_water_annual_demand, false, ' kWh');
                }
            } else {
                report.content[1].stack[12] = {};
                report.content[13] = {};
            }

            if (survey.surveys.includedReport.bivalent == 'YES' && !_.isUndefined(report.content[17].stack)) {
                // BIVALENT DESIGN
                report.content[17].stack[2].columns[1].stack[0].text = dataToString(survey.surveys.is_bivalent_required);
                report.content[17].stack[2].columns[1].stack[1].text = dataToString(survey.surveys.bivalent_fuel_type);
                report.content[17].stack[2].columns[1].stack[2].text = dataToString(survey.surveys.bivalent.point, false, ' \u00B0C');
                report.content[17].stack[2].columns[1].stack[3].text = dataToString(survey.surveys.bivalent.output_requirement, false, ' kW');
                report.content[17].stack[2].columns[1].stack[4].text = dataToString(survey.surveys.bivalent.percentage_of_heating_season, false, '% of Heating Season');
                report.content[17].stack[2].columns[1].stack[5].text = dataToString(survey.surveys.region.region != 'Custom Entry' ? survey.surveys.region.region : survey.surveys.region.region_name);
                report.content[17].stack[2].columns[1].stack[6].text = dataToString(survey.surveys.region.value, false, ' @ 15.5 C');
                report.content[17].stack[2].columns[1].stack[7].text = dataToString(survey.surveys.bivalent.energy_demand, false, ' kWh');
                report.content[17].stack[2].columns[1].stack[8].text = dataToString(survey.surveys.external_design_temperature, false, '\u00B0C');
                report.content[17].stack[2].columns[1].stack[9].text = dataToString(survey.surveys.average_designed_temperature.toFixed(2), false, '\u00B0C');
                report.content[17].stack[2].columns[1].stack[10].text = dataToString(survey.surveys.bivalent.delta_t);
                report.content[17].stack[2].columns[1].stack[11].text = dataToString(survey.surveys.total_power_watts, false, ' watts');
                report.content[17].stack[2].columns[1].stack[12].text = dataToString(survey.surveys.floorArea, false, ' m²');
                report.content[17].stack[2].columns[1].stack[13].text = dataToString(survey.surveys.bivalent.watts_per_meter_squared, false, ' W/m²');
                report.content[17].stack[2].columns[1].stack[14].text = dataToString(survey.surveys.bivalent.heat_transfer_coefficient, false, ' W/(m²*K)');

                // need to display emitters and performance star ratings here
                var idx = 0;
                _.each($scope.degree_data, function (data) {
                    report.content[17].stack[4].table.body.push([
                        (idx + 1).toString(),
                        dataToString(survey.surveys.bivalent.delta[idx]),
                        dataToString(survey.surveys.bivalent.watts[idx]),
                        dataToString(survey.surveys.bivalent.heating_demand.watts[idx]),
                        dataToString(survey.surveys.bivalent.heating_demand.kw[idx]),
                        dataToString(data.percentage, false, '%')
                    ]);
                    idx++;
                });
            } else {
                report.content[1].stack[16] = {};
                report.content[17] = {};
            }

            if (survey.surveys.includedReport.fuel == 'YES' && !_.isUndefined(report.content[18].stack)) {
                calculationService.initialize(survey);
                calculationService.calculate_fuel_compare();
                heating_type = survey.surveys.fuel_compare.heating_type;
                // FUEL COMPARE
                _.each(heating_type, function (type) {
                    if (type.is_included == true) {
                        report.content[18].stack[2].table.body.push([
                            dataToString(type.name, false),
                            dataToString(type.efficiency, 'see SCOP', '%'),
                            dataToString(type.annual_demand.hot_water),
                            dataToString(type.annual_demand.heating),
                            dataToString(type.annual_demand.total),
                            dataToString(type.number_kwh_in_unit),
                            type.spf.dhw != null ? type.spf.dhw.toString() : '',
                            type.spf.heating != null ? type.spf.heating.toString() : '',
                            dataToString(type.price_per_tone),
                            type.price_per_unit ? type.price_per_unit.toString() : (type.price_per_tone / 10).toString(),
                            dataToString(type.unit, 'No unit'),
                            dataToString(type.pence_per_kwh),
                            dataToString(type.pound_per_kwh),
                            type.annual_running_cost ? '£' + type.annual_running_cost.toString() : '0',
                            dataToString(type.factor),
                            dataToString(type.total_kg)
                        ]);
                    }
                });
            } else {
                report.content[1].stack[17] = {};
                report.content[18] = {};
            }

            if (survey.surveys.includedReport.ground_loop == 'YES' && !_.isUndefined(report.content[19].stack)) {
                // GROUND LOOP DESIGN
                report.content[19].stack[2].columns[1].stack[0].text = dataToString(survey.surveys.ground_loop.ground_type.rock_type); // 0,1,2,3,4,5,6,11,13,14,15,16,19,20,22,24,25,27,29,30,31
                report.content[19].stack[2].columns[1].stack[1].text = dataToString(survey.surveys.ground_loop.ground_type.thermal_conductivity);
                report.content[19].stack[2].columns[1].stack[2].text = dataToString(survey.surveys.ground_loop.fleq_run_hours);
                report.content[19].stack[2].columns[1].stack[3].text = dataToString(survey.surveys.region.region != 'Custom Entry' ? survey.surveys.region.region : survey.surveys.region.region_name);
                report.content[19].stack[2].columns[1].stack[4].text = dataToString(survey.surveys.region.ground_temp);
                report.content[19].stack[2].columns[1].stack[5].text = dataToString(survey.surveys.ground_loop.ground_loop_type);
                report.content[19].stack[2].columns[0].stack[7].text = dataToString(survey.surveys.ground_loop.ground_loop_type);
                report.content[19].stack[2].columns[1].stack[6].text = dataToString(survey.surveys.ground_loop.calculated_watts_per_meter);
                report.content[19].stack[2].columns[1].stack[11].text = dataToString(survey.surveys.ground_loop.estimate_of_total_heating_energy_consumption, false, ' kWh');
                report.content[19].stack[2].columns[1].stack[13].text = dataToString(survey.surveys.hp_heating_at_ground_temp, false, ' kW');
                report.content[19].stack[2].columns[1].stack[14].text = dataToString(survey.surveys.ground_loop.fleq_run_hours, false, ' hrs');
                report.content[19].stack[2].columns[1].stack[15].text = dataToString(survey.surveys.region.ground_temp, false, ' \u00B0C');
                report.content[19].stack[2].columns[1].stack[16].text = dataToString(survey.surveys.ground_loop.ground_type.thermal_conductivity, false, ' W/mK');
                report.content[19].stack[2].columns[1].stack[19].text = dataToString(survey.surveys.ground_loop.calculated_watts_per_meter, false, ' W/m');
                report.content[19].stack[2].columns[1].stack[20].text = dataToString(worst_performing_room.emitters ? worst_performing_room.emitters.space_heating_likely_spf : 0);
                report.content[19].stack[2].columns[1].stack[22].text = dataToString(survey.surveys.ground_loop.maximum_power_extracted_on_the_ground, false, ' W');
                report.content[19].stack[2].columns[1].stack[24].text = dataToString(survey.surveys.ground_loop.length_of_heat_ground_exchanger, false, ' m');
                report.content[19].stack[2].columns[1].stack[25].text = dataToString(survey.surveys.ground_loop.spacing[survey.surveys.ground_loop.ground_loop_type], false, ' m');
                report.content[19].stack[2].columns[1].stack[27].text = dataToString(survey.surveys.ground_loop.total_length_of_ground_heat_exchanger);

                report.content[19].stack[2].columns[1].stack[29].text = dataToString(survey.surveys.ground_loop.total_length_of_ground_heat_exchanger_round, false, ' m');
                report.content[19].stack[2].columns[1].stack[30].text = dataToString(survey.surveys.ground_loop.bore_hole_depth, false, ' m');
                report.content[19].stack[2].columns[1].stack[31].text = dataToString(survey.surveys.ground_loop.number_of_boreholes, false, 'm');

                // 17
                report.content[19].stack[2].columns[0].stack[17].text = survey.surveys.ground_loop.ground_loop_type + ' , d';

                if (survey.surveys.ground_loop.ground_loop_type != 'Borehole') {
                    report.content[19].stack[2].columns[0].stack[20] = {};
                    report.content[19].stack[2].columns[0].stack[21] = {};

                    report.content[19].stack[2].columns[1].stack[30] = {};
                    report.content[19].stack[2].columns[1].stack[31] = {};
                }


            } else {
                report.content[1].stack[18] = {};
                report.content[19] = {};
            }

            heating_type = survey.surveys.fuel_compare.heating_type;
            _.each(heating_type, function (items) {
                if (survey.surveys.proposed_install_type.toLowerCase() == 'ashp' || survey.surveys.proposed_install_type.toLowerCase() == 'gshp') {
                    if (items.name == 'Direct Electric')
                        $scope.cost_per_unit = items.price_per_unit;

                    if (items.name == survey.surveys.bivalent_fuel_type) {
                        $scope.efficiency = items.efficiency + '%';
                        $scope.pence_per_kw = items.pence_per_kwh;
                    }
                } else {
                    if (items.name == survey.surveys.if_biomass_which_fuel_type) {
                        $scope.cost_per_unit = items.pence_per_kwh;
                    }
                }
            });

            if (survey.surveys.proposed_install_type.toLowerCase() == 'ashp' || survey.surveys.proposed_install_type.toLowerCase() == 'gshp')
                report.content[21] = {};
            else if (survey.surveys.proposed_install_type.toLowerCase() == 'biomass')
                report.content[20] = {};
            else {
                report.content[1].stack[19] = {};
                report.content[20] = {};
                report.content[21] = {};
            }

            // MIS
            if (!_.isUndefined(report.content[20].stack) && !_.isEmpty(report.content[20]) && (survey.surveys.proposed_install_type.toLowerCase() == 'ashp' || survey.surveys.proposed_install_type.toLowerCase() == 'gshp')) {
                report.content[20].stack[2].columns[2].stack[3].text = dataToString(survey.surveys.total_energy_kilowatts, false, ' kWh/yr');
                report.content[20].stack[2].columns[2].stack[4].text = dataToString(survey.surveys.summary_results.heat_supplied_by_hp_excluding_auxiliary_heaters, false, ' kWh/yr');
                report.content[20].stack[2].columns[2].stack[5].text = dataToString(worst_performing_room ? worst_performing_room.emitters.space_heating_likely_spf : 0);
                report.content[20].stack[2].columns[2].stack[7].text = dataToString(survey.surveys.summary_results.electricity_consumed_by_hp, false, ' kWh/yr');
                report.content[20].stack[2].columns[2].stack[8].text = dataToString(survey.surveys.summary_results.renewable_heat_supplied_by_hp, false, ' kWh/yr');
                report.content[20].stack[2].columns[2].stack[10].text = dataToString(survey.surveys.summary_results.remaining_heat_to_be_supplied_by_auxiliary_heaters_and_other_heat_sources, false, ' kWh/yr');
                report.content[20].stack[2].columns[2].stack[11].text = dataToString(survey.surveys.summary_results.remaining_heat_supplied_by_other_heat_sources, false, ' kWh/yr');
                report.content[20].stack[2].columns[2].stack[12].text = dataToString(survey.surveys.summary_results.remaining_heat_supplied_by_auxiliary_heaters, false, ' kWh/yr');
                report.content[20].stack[2].columns[2].stack[14].text = dataToString(survey.surveys.summary_results.electricity_consumed_by_hp_including_auxiliary_heaters, false, ' kWh/yr');
                report.content[20].stack[2].columns[2].stack[17].text = dataToString(survey.surveys.bivalent_fuel_type);
                report.content[20].stack[2].columns[2].stack[18].text = dataToString($scope.efficiency, 'N/A');
                report.content[20].stack[2].columns[2].stack[19].text = dataToString(survey.surveys.summary_results.consumed_by_other_heat_sources, 'N/A', ' kWh/yr');
                report.content[20].stack[2].columns[2].stack[23].text = dataToString(survey.surveys.domestic_hot_water.number_of_bed_rooms, false, ' Rooms');
                report.content[20].stack[2].columns[2].stack[24].text = dataToString(survey.surveys.domestic_hot_water.number_of_occupants_per_bedroom, false, ' Person/s');
                report.content[20].stack[2].columns[2].stack[25].text = dataToString(survey.surveys.domestic_hot_water.flow_temperature_for_hot_water.temp, false, '\u00B0C');
                report.content[20].stack[2].columns[2].stack[26].text = dataToString(survey.surveys.domestic_hot_water.hot_water_per_occupant, false, ' Litres/day');
                report.content[20].stack[2].columns[2].stack[27].text = dataToString(survey.surveys.domestic_hot_water.final_secondary_hw_temperature, false, '\u00B0C');
                report.content[20].stack[2].columns[2].stack[28].text = dataToString(survey.surveys.domestic_hot_water.annual_demand, false, ' kWh/yr');
                report.content[20].stack[2].columns[2].stack[29].text = dataToString(survey.surveys.domestic_hot_water.heat_supplied_by_hp, false, ' kWh/yr');
                report.content[20].stack[2].columns[2].stack[30].text = dataToString(survey.surveys.domestic_hot_water.flow_temperature_for_hot_water.value);
                report.content[20].stack[2].columns[2].stack[32].text = dataToString(survey.surveys.summary_results.domestic_hot_water_electricity_consumed_by_hp, false, ' kWh/yr');
                report.content[20].stack[2].columns[2].stack[33].text = dataToString(survey.surveys.summary_results.domestic_renewable_heat_supplied_by_hp, false, ' kWh/yr');
                report.content[20].stack[2].columns[2].stack[35].text = dataToString(survey.surveys.summary_results.remaining_heat_to_be_supplied, false, ' kWh/yr');
                report.content[20].stack[2].columns[2].stack[36].text = '0';
                report.content[20].stack[2].columns[2].stack[37].text = dataToString(survey.surveys.summary_results.remaining_heat_to_be_supplied, false, ' kWh/yr');
                report.content[20].stack[2].columns[2].stack[39].text = dataToString(survey.surveys.summary_results.domestic_hot_water_electricity_consumed_by_hp_including, false, ' kWh/yr');
                report.content[20].stack[2].columns[2].stack[49].text = dataToString(survey.surveys.summary_results.proportion_of_space_heating_and_water_heating_demand, false, '%');
                report.content[20].stack[2].columns[2].stack[50].text = dataToString(survey.surveys.summary_results.renewable_heat, false, ' kWh/yr');
                report.content[20].stack[2].columns[2].stack[52].text = dataToString(survey.surveys.summary_results.proportions_electricity_consumed_by_hp, false, ' kWh/yr');
                report.content[20].stack[2].columns[2].stack[54].text = dataToString(survey.surveys.summary_results.electricity_consumed_by_auxiliary_or_immersion_heaters, false, ' kWh/yr');
                report.content[20].stack[2].columns[2].stack[55].text = dataToString(survey.surveys.summary_results.consumed_by_other_heat_sources, 'N/A', ' kWh/yr');
                report.content[20].stack[2].columns[2].stack[56].text = dataToString(survey.surveys.summary_results.hp_combined_performance_spf, 'N/A', ' kWh/yr');
                report.content[20].stack[2].columns[2].stack[58].text = dataToString($scope.cost_per_unit, false, ' pence/kWh');
                report.content[20].stack[2].columns[2].stack[59].text = dataToString($scope.pence_per_kw, 'N/A', ' pence/kWh');
                report.content[20].stack[2].columns[2].stack[61].text = dataToString(survey.surveys.summary_results.cost_of_electricity_for_hp, false, ' £ / year');
                report.content[20].stack[2].columns[2].stack[62].text = dataToString(survey.surveys.summary_results.ashp_cost_of_fuel_for_other_heat_sources, 'N/A');
            }
            if (!_.isUndefined(report.content[21].stack) && !_.isEmpty(report.content[21]) && survey.surveys.proposed_install_type.toLowerCase() == 'biomass') {
                report.content[21].stack[2].columns[2].stack[3].text = dataToString(survey.surveys.biomass_type);
                report.content[21].stack[2].columns[2].stack[4].text = dataToString($rootScope.cloud_data.biomass_type_details[survey.surveys.biomass_type].moisture_content, false, ' %');
                report.content[21].stack[2].columns[2].stack[5].text = dataToString($rootScope.cloud_data.biomass_type_details[survey.surveys.biomass_type].gross_calorific_value, false, ' kWh/kg');
                report.content[21].stack[2].columns[2].stack[6].text = dataToString($rootScope.cloud_data.biomass_type_details[survey.surveys.biomass_type].bulk_density, false, ' kg/m³');
                report.content[21].stack[2].columns[2].stack[7].text = dataToString(survey.surveys.output_at_designed_external_temperature, false, ' kW');
                //
                report.content[21].stack[2].columns[2].stack[11].text = dataToString(survey.surveys.summary_results.manufactures_specified_efficiency, false, ' %');
                report.content[21].stack[2].columns[2].stack[12].text = dataToString(survey.surveys.summary_results.estimated_rate, false, ' kg/hr');
                report.content[21].stack[2].columns[2].stack[13].text = dataToString(survey.surveys.summary_results.estimated_volume, false, ' m³/hr');
                //
                report.content[21].stack[2].columns[2].stack[15].text = dataToString(survey.surveys.total_energy_kilowatts, false, ' kWh/year');
                report.content[21].stack[2].columns[2].stack[17].text = dataToString(survey.surveys.summary_results.heat_supplied_by_bhs, false, ' kWh/year');
                report.content[21].stack[2].columns[2].stack[19].text = dataToString(survey.surveys.summary_results.annual_fuel_requirement_mass_of_bhs, false, ' kWh/year');
                report.content[21].stack[2].columns[2].stack[20].text = dataToString(survey.surveys.summary_results.annual_fuel_requirement_volume_of_bhs, false, ' m³/Yr');
                report.content[21].stack[2].columns[2].stack[21].text = dataToString(survey.surveys.summary_results.remaining_heat_to_be_supplied_by_other_heat_sources, false);
                //
                report.content[21].stack[2].columns[2].stack[31].text = dataToString(survey.surveys.domestic_hot_water.number_of_bed_rooms, false, ' Rooms');
                report.content[21].stack[2].columns[2].stack[32].text = dataToString(survey.surveys.domestic_hot_water.number_of_occupants_per_bedroom, false, ' Persons');
                report.content[21].stack[2].columns[2].stack[34].text = dataToString(survey.surveys.domestic_hot_water.hot_water_per_occupant, false, ' Litres/day');
                report.content[21].stack[2].columns[2].stack[36].text = dataToString(survey.surveys.domestic_hot_water.hot_water_annual_demand, false, ' kWh/yr');
                report.content[21].stack[2].columns[2].stack[38].text = dataToString(survey.surveys.summary_results.dhw_heat_supplied_by_bhs, false, ' kWh/yr');
                report.content[21].stack[2].columns[2].stack[40].text = dataToString(survey.surveys.summary_results.dhw_annual_fuel_requirement_mass_of_bhs, false, ' Kg/Yr');
                report.content[21].stack[2].columns[2].stack[41].text = dataToString(survey.surveys.summary_results.dhw_annual_fuel_requirement_volume_of_bhs, false, ' m³/Yr');
                report.content[21].stack[2].columns[2].stack[42].text = dataToString(survey.surveys.summary_results.dhw_remaining_heat_to_be_supplied_by_other_heat_sources, false, ' kWh/yr');
                //
                report.content[21].stack[2].columns[2].stack[50].text = dataToString(survey.surveys.summary_results.space_heating_and_water_heating_demand_provided_by_bhs, false, '%');
                report.content[21].stack[2].columns[2].stack[51].text = dataToString(survey.surveys.summary_results.proportions_heat_supplied_by_bhs, false, ' kWh/yr');
                report.content[21].stack[2].columns[2].stack[53].text = dataToString(survey.surveys.summary_results.proportions_annual_fuel_requirement_mass_of_bhs, false, ' Kg/Yr');
                report.content[21].stack[2].columns[2].stack[54].text = dataToString(survey.surveys.summary_results.proportions_annual_fuel_requirement_volume_of_bhs, false, ' m³/Yr');

                report.content[21].stack[2].columns[2].stack[55].text = '0';
                report.content[21].stack[2].columns[2].stack[56].text = ' ';
                report.content[21].stack[2].columns[2].stack[57].text = ' ';
                report.content[21].stack[2].columns[2].stack[58].text = ' ';
                report.content[21].stack[2].columns[2].stack[59].text = dataToString($scope.cost_per_unit, false, ' pence / kWh');
                report.content[21].stack[2].columns[2].stack[60].text = '0';
                report.content[21].stack[2].columns[2].stack[61].text = dataToString(survey.surveys.summary_results.cost_of_biofuel_for_bhs, false, ' £/year');
                report.content[21].stack[2].columns[2].stack[62].text = '0';
            }

            //var start_page = 15; // stack 12 - 18
            var start_page = ['J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q']; // stack 12 - 18
            var included = [];
            var included2 = [];

            _.each(report.content[1].stack, function (stack, idx) {
                if (idx > 11) {
                    if (!_.isEmpty(stack)) {
                        included.push(idx);
                    }
                }
            });
            _.each(report.content, function (content, idx) {
                if (idx > 12) {
                    if (!_.isEmpty(content)) {
                        included2.push(idx);
                    }
                }
            });
            _.each(included, function (num, idx) {
                var split = report.content[1].stack[num].text.split(' ');
                split[1] = start_page[idx];
                var formed = '';
                _.each(split, function (spl) {
                    formed += spl + ' ';
                });
                report.content[1].stack[num].text = formed;
            });
            start_page = ['J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q']; // stack 12 - 18

            _.each(included2, function (num, idx) {
                var split = report.content[num].stack[0].text.split(' ');
                //split[1] = start_page;
                split[1] = start_page[idx];
                var formed = '';
                _.each(split, function (spl) {
                    formed += spl + ' ';
                });
                report.content[num].stack[0].text = formed;
            });
            if (survey.surveys.includedReport.photos_notes == 'YES') {
                isShare || alertService('success', 'PDF Report', ' is loading... It will be downloaded in few seconds..', 14000);
                $scope.totalImage = selectedImageCount
                $timeout(function () {
                    if (isShare) {
                        pdfUpload(report, survey, selectedImageCount)
                    } else {
                        pdfPrint(report, survey, selectedImageCount)
                    }
                }, selectedImageCount * 3000);
            } else {
                isShare || alertService('success', 'PDF Report', ' is loading... It will be downloaded in few seconds..', 14000);
                if (isShare) {
                    pdfUpload(report, survey, 1000)
                } else {
                    pdfPrint(report, survey, 1000)
                }
            }

        };
        function pdfPrint (report, survey, selectedImageCount) {
            pdfMake.createPdf(report).download(survey.surveys.project_name + ' ' + '(' + survey.surveys.proposed_install_type + ')');
            $timeout(function () {
                $scope.loading = false
            }, selectedImageCount);
        }
        function pdfUpload (report, survey, selectedImageCount) {
            pdfMake.createPdf(report).getBlob(function (pdf) {
                var uploadUrl = '/api/uploadSharedFolder';
                const data = {
                    'name': survey.surveys.project_name,
                    'survey': survey._id,
                    'filename': survey.surveys.project_name + ' ' + '(' + survey.surveys.proposed_install_type + ').pdf',
                    'sharedFile': pdf,
                    '_user_id': $scope.user._id
                }
                multipartFormService.post(uploadUrl, data).then(function (response) {
                    // $rootScope.user = response.data;
                    // userService.updateStorage($rootScope.user);
                    $window.location.href = '/share-files?id=' + response.data.sharedFolder._id;
                }, function () {
                    alertService('warning', 'Opps!', 'Something went wrong!');
                });
            });
            $timeout(function () {
                $scope.loading = false
            }, selectedImageCount);
        }

        function dataToString (data, notValue, extValue) {
            var not = notValue || '0';
            var ext = extValue || '';
            var data = data || '';
            return data ? data.toString() + ext : not;
        }

        function displayStarRating (star_rating) {
            var star = ' ';
            if (!!star_rating && star_rating != '') {
                for (var i = 0; i < star_rating; i++)
                    star += '*';
            }
            return star;
        }

        function linkedRooms (room, type, isEmitter) {
            var linkedType;
            var color;
            if (type == 'total_watts')
                linkedType = room.heat_loss.linked_total_watts;
            else
                linkedType = room.heat_loss.linked_watts_per_meter_squared;

            if (type == 'other') {
                if (room.heat_loss.total_watts_per_meter_squared_percentage == 'MIN')
                    color = '#66c581';
                else if (room.heat_loss.total_watts_per_meter_squared_percentage == 'MAX')
                    color = '#f56a67';
                else if (room.heat_loss.total_watts_per_meter_squared_percentage > 0 && room.heat_loss.total_watts_per_meter_squared_percentage < 13)
                    color = '#69c072';
                else if (room.heat_loss.total_watts_per_meter_squared_percentage > 12 && room.heat_loss.total_watts_per_meter_squared_percentage < 25)
                    color = '#98cd7d';
                else if (room.heat_loss.total_watts_per_meter_squared_percentage > 24 && room.heat_loss.total_watts_per_meter_squared_percentage < 37)
                    color = '#d1e079';
                else if (room.heat_loss.total_watts_per_meter_squared_percentage > 36 && room.heat_loss.total_watts_per_meter_squared_percentage < 49)
                    color = '#dee283';
                else if (room.heat_loss.total_watts_per_meter_squared_percentage > 48 && room.heat_loss.total_watts_per_meter_squared_percentage < 61)
                    color = '#ffe083';
                else if (room.heat_loss.total_watts_per_meter_squared_percentage > 60 && room.heat_loss.total_watts_per_meter_squared_percentage < 73)
                    color = '#fed47e';
                else if (room.heat_loss.total_watts_per_meter_squared_percentage > 72 && room.heat_loss.total_watts_per_meter_squared_percentage < 85)
                    color = '#fbae78';
                else if (room.heat_loss.total_watts_per_meter_squared_percentage > 84 && room.heat_loss.total_watts_per_meter_squared_percentage < 100)
                    color = '#fca377';
            } else if (type == 'total_watts') {
                let per = room.heat_loss.total_watts_percentage;
                if (room.heat_loss.linked_total_watts_percentage != undefined) {
                    per = room.heat_loss.linked_total_watts_percentage;
                }

                if (typeof room.heat_loss.max_total_watts_percentage != 'undefined')
                    color = '#f56a67';
                else if (per > 0 && per < 13) color = '#69c072';
                else if (per > 12 && per < 25) color = '#98cd7d';
                else if (per > 24 && per < 37) color = '#d1e079';
                else if (per > 36 && per < 49) color = '#dee283';
                else if (per > 48 && per < 61) color = '#ffe083';
                else if (per > 60 && per < 73) color = '#fed47e';
                else if (per > 72 && per < 85) color = '#fbae78';
                else if (per > 84 && per < 100) color = '#fca377';
            }

            if (!!room.linked_colors && !room.split_disable) {
                return {
                    text: dataToString(linkedType),
                    rowSpan: 2,
                    fillColor: color
                };
            } else if (!!room.split_disable)
                return {
                    text: ' ',
                    fillColor: 'yellow'
                };
            else {
                if (type == 'total_watts') {
                    return {
                        text: dataToString(room.heat_loss.total_watts),
                        fillColor: color
                    };
                } else
                    return {
                        text: dataToString(room.heat_loss.watts_per_meter_squared),
                        fillColor: color
                    };
            }

        }

        function disableRoom (room, data) {
            if (!!room.split_disable) {
                return {
                    text: ' ',
                    fillColor: 'gray'
                };
            } else {
                return data
            }
        }

        function spanDouble (room, data) {
            if (!!room.linked_colors && !room.split_disable) {
                return {
                    text: dataToString(data),
                    rowSpan: 2
                };
            }
            else {
                return data
            }
        }

        function displayGraph (htype, callback) {

            // chart setup here
            var arc_canvas = document.getElementById("arc-chart");
            var arc_ctx = document.getElementById("arc-chart").getContext('2d');

            var ae_canvas = document.getElementById("ae-chart");
            var ae_ctx = document.getElementById("ae-chart").getContext('2d');

            var arc_result, ae_result = null;

            var heating_type = htype;
            var data_name = [];
            var data_value = [];
            var data_value_emission = [];

            angular.forEach(heating_type, function (item) {
                if (item.is_included == true) {
                    data_name.push(item.name);
                    data_value.push(item.annual_running_cost);
                    data_value_emission.push(item.total_kg);
                }
            });

            var arc_data = {
                labels: data_name,
                datasets: [{
                    label: "Annual Running Cost",
                    fillColor: "rgba(215, 2, 6, 1)",
                    strokeColor: "rgba(215, 2, 6, 1)",
                    highlightFill: "rgba(215, 2, 6, 0.7)",
                    highlightStroke: "rgba(220,220,220,1)",
                    data: data_value
                }]
            };
            //
            var arc_chart = new Chart(arc_ctx).Bar(arc_data, {
                barStrokeWidth: 1,
                barValueSpacing: 32,
                scaleLabel: "<%= '£' + value + '.00' %>",
                responsive: true,
                onAnimationComplete: function () {
                    var tcanvas = document.createElement('canvas');
                    var tctx = tcanvas.getContext('2d');
                    tcanvas.width = arc_ctx.canvas.width / 2.5;
                    tcanvas.height = arc_ctx.canvas.height / 2.5;
                    tctx.fillStyle = 'white';
                    tctx.fillRect(0, 0, tcanvas.width, tcanvas.height);
                    tctx.drawImage(arc_canvas, 0, 0, tcanvas.width, tcanvas.height);
                    var img = new Image();
                    img.onload = function () {
                        //window.open(tctx.canvas.toDataURL('image/jpeg', 0.8));
                        arc_result = tctx.canvas.toDataURL('image/jpeg', 0.8);
                        callback(arc_result, ae_result);
                    };
                    img.src = tctx.canvas.toDataURL();
                }
            });
            //
            var ae_data = {
                labels: data_name,
                datasets: [{
                    label: "Annual Running Cost",
                    fillColor: "rgba(215, 2, 6, 1)",
                    strokeColor: "rgba(220,220,220,0.8)",
                    highlightFill: "rgba(215, 2, 6, 0.7)",
                    highlightStroke: "rgba(220,220,220,1)",
                    data: data_value_emission
                }]
            };
            //
            var ae_chart = new Chart(ae_ctx).Bar(ae_data, {
                barStrokeWidth: 1,
                barValueSpacing: 32,
                scaleLabel: "<%= '£' + value + '.00' %>",
                responsive: true,
                onAnimationComplete: function () {
                    var tcanvas = document.createElement('canvas');
                    var tctx = tcanvas.getContext('2d');
                    tcanvas.width = ae_ctx.canvas.width / 2.5;
                    tcanvas.height = ae_ctx.canvas.height / 2.5;
                    tctx.fillStyle = 'white';
                    tctx.fillRect(0, 0, tcanvas.width, tcanvas.height);
                    tctx.drawImage(ae_canvas, 0, 0, tcanvas.width, tcanvas.height);
                    var img = new Image();
                    img.onload = function () {
                        //window.open(tctx.canvas.toDataURL('image/jpeg', 0.8));
                        ae_result = tctx.canvas.toDataURL('image/jpeg', 0.8);
                        callback(arc_result, ae_result);
                    };
                    img.src = tctx.canvas.toDataURL();
                }
            });
        }

        $scope.unLockSurvey = function (survey) {
            console.log("survey :::", survey);
            survey.surveys.is_locked = false;
            apiService.update('surveys', survey).then(function (response) {
                console.log('res ::::', response);
            });
        }

        // $scope.getSurveyLogs = function (survey) {
        //     apiService.get('getSurveyLogs', {_id: survey._id}).then(function (response) {
        //         console.log('res ::::', response);
        //     });
        // }

    }

    ModalSurveyLogsController.$inject = ['$scope', '$modalInstance', 'data'];

    function ModalSurveyLogsController ($scope, $modalInstance, data) {

        $scope.logs = data.logs;
        console.log('logggggs', $scope.logs);

        $scope.onOk = function () {
            $modalInstance.close();
        }
    }

    ModalCopyReportInstanceController.$inject = ['$scope', '$modalInstance', 'alertService'];

    function ModalCopyReportInstanceController ($scope, $modalInstance, alertService) {

        $scope.reportName = null;
        $scope.save = function (event) {
            if (event.keyCode == 13) {
                $scope.ok()
            }
        }
        $scope.ok = function () {
            if ($scope.reportName != null && $scope.reportName != '' && $scope.reportName != ' ')
                $modalInstance.close($scope.reportName);
            else {
                alertService('danger', 'A report name should be required', 'You need to type in a report name to continue!');
                $modalInstance.dismiss('cancel');
            }
        };

        $scope.cancel = function () {
            $modalInstance.dismiss('cancel');
        };
    }

    ModalSendReportInstanceController.$inject = ['$scope', '$modalInstance', 'alertService', 'apiService', 'data'];

    function ModalSendReportInstanceController ($scope, $modalInstance, alertService, apiService, data) {

        $scope.survey = data.survey
        $scope.selectedUser = false
        $scope.usersList = []
        let query = {
            // filter: $scope.selectedSort,
            limit: 100,
            skip: 0,

        }
        apiService['manufacturerAll'].query(query, function (response) {
            $scope.users = response.users

        })
        $scope.chackSurvey = function (userDetail) {
            var userCheck = userDetail.others.survey_from.filter(function (o) {
                return o == $scope.survey._id;
            });
            if (userCheck.length != 0) {
                return true
            } else {
                return false
            }
        }
        $scope.manufacturerAdd = function (user, event, idx) {
            var checked = event.target.checked
            if (checked) {
                var data = {
                    id: user._id,
                    name: user.company_name,
                    email: user.email,
                    website: user.company_website,
                    description: user.description,
                    first_name: user.first_name,
                    surname: user.surname,
                    mobile: user.mobile
                }
                $scope.usersList.push(data)
            } else {

                for (let i = 0; i < $scope.usersList.length; i++) {

                    if ($scope.usersList[i].id == user._id) {
                        $scope.usersList.splice(i, 1);
                    }

                }

            }

        }
        $scope.reportName = null;

        $scope.ok = function () {
            if ($scope.usersList.length != 0)
                $modalInstance.close($scope.usersList);
            else {
                alertService('danger', '', 'Select Manufacturer for send!');
                $modalInstance.dismiss('cancel');
            }
        };

        $scope.cancel = function () {
            $modalInstance.dismiss('cancel');
        };
    }
})();
