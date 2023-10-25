(function () {
    "use strict";

    angular
        .module("cloudheatengineer")
        .config([
            "$translateProvider",
            function ($translateProvider) {
                var language = (
                    window.navigator.userLanguage || window.navigator.language
                ).toLowerCase();

                $translateProvider.registerAvailableLanguageKeys(
                    [
                        "en_US",
                        "es_ES",
                        "de_DE",
                        "fr_FR",
                        "ru_RU",
                        "zh_TW",
                        "pl_PL",
                        "ne_NE",
                        "pt_PT"
                    ], {
                    en_US: "en_US",
                    en_UK: "en_US",
                    en: "en_US",
                    es: "es_ES",
                    de: "de_DE",
                    fr: "fr_FR",
                    ru: "ru_RU",
                    zh: "zh_TW",
                    pl: "pl_PL",
                    ne: "ne_NE",
                    pt: "pt_PT"
                }
                );

                $translateProvider.useStaticFilesLoader({
                    prefix: "/lang/lang_",
                    suffix: ".json"
                });

                $translateProvider.preferredLanguage("en_US");
                $translateProvider.fallbackLanguage("en_US");
                $translateProvider.useSanitizeValueStrategy('escape');
            }
        ])
        .config(function ($routeProvider, $locationProvider, $httpProvider) {

            function initializeData (apiService, query, params = {}) {
                return apiService[query].query(params);
            }

            var initialise = {
                dashboard: function (apiService) {
                    return  // initializeData(apiService, "counts", {trainee: 2});
                },
                surveyors: function (apiService) {
                    return initializeData(apiService, "surveyors");
                },
                register: function (apiService) {
                    return initializeData(apiService, "braintree");
                },
                surveys: function (apiService) {
                    return initializeData(apiService, "surveys");
                },
            };

            var authorization = {
                withTokenAndActive: function (userService) {
                    return userService.authorizedWithTokenAndActive();
                },
                withToken: function (userService) {
                    return userService.authorizedWithToken();
                },
                notRequired: function (userService) {
                    return userService.authorizedNotRequired();
                }
            };

            $locationProvider.html5Mode({
                enabled: true,
                requireBase: false
            });

            $routeProvider

                .when("/", {
                    templateUrl: "/partials/views/main",
                    controller: "MainController",
                    resolve: {
                        authorization: authorization.notRequired
                    }
                })

                .when("/home", {
                    templateUrl: "/partials/views/home",
                    controller: "HomeController",
                    resolve: {
                        authorization: authorization.notRequired
                    }
                })

                .when("/subscribed-manufacturers", {
                    templateUrl: "/partials/views/premium-manufacturers",
                    controller: "PremiumManufacturersController",
                    resolve: {
                    }
                })

                .when("/search-engineers", {
                    templateUrl: "/partials/views/surveyor-location",
                    controller: "SurveyorByLocationController",
                    resolve: {
                    }
                })

                .when("/surveyor-details-update/:id", {
                    templateUrl: "/partials/views/surveyor-update",
                    controller: "SurveyorDetailsUpdateController",
                    resolve: {
                    }
                })

                .when("/surveyor-details/:id", {
                    templateUrl: "/partials/views/surveyor-details",
                    controller: "SurveyorDetailsController",
                    resolve: {
                    }
                })
                .when("/subscribed-page/:id", {
                    templateUrl: "/partials/views/premium-page",
                    controller: "PremiumManufacturersModelController",
                    resolve: {
                    }
                })

                .when("/subscribed-page-merchant/:id", {
                    templateUrl: "/partials/views/premium-page-merchant",
                    controller: "PremiumMerchantModelController",
                    resolve: {
                    }
                })


                .when("/forgot", {
                    templateUrl: "/partials/views/forgot",
                    controller: "ForgotController",
                    resolve: {
                        authorization: authorization.notRequired
                    }
                })

                .when("/auth/reset/:token", {
                    templateUrl: "/partials/views/reset",
                    controller: "ResetPasswordController",
                    resolve: {
                        authorization: authorization.notRequired
                    }
                })

                .when("/invite", {
                    templateUrl: "/partials/views/invite",
                    controller: "InviteController"
                })

                .when("/register/special/:plan", {
                    templateUrl: "/partials/views/register",
                    controller: "RegisterController",
                    resolve: {
                        authorization: authorization.notRequired,
                        data: initialise.register
                    }
                })

                .when("/register/:plan", {
                    templateUrl: "/partials/views/register",
                    controller: "RegisterController",
                    resolve: {
                        authorization: authorization.notRequired,
                        data: initialise.register
                    }
                })

                .when("/signup", {
                    templateUrl: "/partials/views/signup",
                    controller: "SignupController",
                    resolve: {
                        authorization: authorization.notRequired
                    }
                })

                .when("/digital-supply-chain", {
                    templateUrl: "/partials/views/digital-supply-chain",
                    controller: "SupplyChainController"
                })

                .when("/applog", {
                    templateUrl: "/partials/views/applog",
                    controller: "applogController"
                })

                .when("/add-applog/:id", {
                    templateUrl: "/partials/views/applog/_add_form.jade",
                    controller: "AddApplogController",
                })

                .when("/activate", {
                    templateUrl: "/partials/views/activate",
                    controller: "ActivateController",
                    resolve: {
                        authorization: authorization.withToken
                    }
                })

                .when("/activated", {
                    templateUrl: "/partials/views/activated",
                    controller: "LoginController",
                    resolve: {
                        authorization: authorization.notRequired
                    }
                })

                .when("/login", {
                    templateUrl: "/partials/views/login",
                    controller: "LoginController",
                    resolve: {
                        authorization: authorization.notRequired
                    }
                })

                .when("/dashboard", {
                    templateUrl: "/partials/views/dashboard",
                    controller: "DashboardController",
                    resolve: {
                        data: initialise.dashboard,
                        authorization: authorization.withTokenAndActive
                    }
                })

                .when("/estimator-dashboard", {
                    templateUrl: "/partials/views/estimator-dashboard",
                    controller: "EstimatorDashboardController",
                    resolve: {
                        authorization: authorization.withTokenAndActive
                    }
                })

                .when("/surveyor-profile", {
                    templateUrl: "/partials/views/surveyor-profile",
                    controller: "SurveyorProfileController",
                    resolve: {
                        authorization: authorization.withTokenAndActive
                    }
                })

                .when("/manufacturer-dashboard", {
                    templateUrl: "/partials/views/manufacturer-dashboard",
                    controller: "ManufacturerDashboardController",
                    resolve: {
                        data: initialise.dashboard,
                        authorization: authorization.withTokenAndActive
                    }
                })

                .when("/manufacturer-inbox", {
                    templateUrl: "/partials/views/manufacturer-inbox",
                    controller: "ManufacturerInboxController",
                    resolve: {
                        authorization: authorization.withTokenAndActive
                    }
                })

                .when("/manufacturer-outbox", {
                    templateUrl: "/partials/views/manufacturer-outbox",
                    controller: "ManufacturerOutboxController",
                    resolve: {
                        authorization: authorization.withTokenAndActive
                    }
                })

                .when("/about-manufacturer", {
                    templateUrl: "/partials/views/about-manufacturer",
                    controller: "AboutManufacturerController",
                })

                .when("/subscription-upgrade", {
                    templateUrl: "/partials/views/upgrade",
                    controller: "UpgradeController",
                    resolve: {
                        authorization: authorization.withTokenAndActive
                    }
                })

                .when("/subscription-upgrade/:plan", {
                    templateUrl: "/partials/views/upgrade",
                    controller: "UpgradeController",
                    resolve: {
                        authorization: authorization.withTokenAndActive
                    }
                })

                .when("/dash", {
                    templateUrl: "/partials/views/dash",
                    controller: "DashController",
                    resolve: {
                        data: initialise.surveys,
                        authorization: authorization.withTokenAndActive
                    }
                })

                .when("/surveys/:type", {
                    templateUrl: "/partials/views/surveys",
                    controller: "SurveysController",
                    resolve: {
                        authorization: authorization.withTokenAndActive
                    }
                })



                .when("/compare", {
                    templateUrl: "/partials/views/compare",
                    controller: "ComparesController",
                    // resolve: {
                    //     data: initialise.surveys,
                    //     authorization: authorization.notRequired
                    // }
                })

                .when("/compare-estimator", {
                    templateUrl: "/partials/views/compare-estimator",
                    controller: "CompareEstimatorsController",
                    // resolve: {
                    //     data: initialise.surveys,
                    //     authorization: authorization.notRequired
                    // }
                })

                .when("/surveyors", {
                    templateUrl: "/partials/views/surveyors",
                    controller: "SurveyorsController",
                    resolve: {
                        data: initialise.surveyors,
                        authorization: authorization.withTokenAndActive
                    }
                })

                .when("/registered-surveyor", {
                    templateUrl: "/partials/views/surveyors/registered"
                })

                .when("/accept", {
                    templateUrl: "/partials/views/surveyors/accept"
                })

                .when("/users", {
                    templateUrl: "/partials/views/user",
                    controller: "UsersController",
                    resolve: {
                        authorization: authorization.withTokenAndActive
                    }
                })
                .when("/userdetail/:id", {
                    templateUrl: "/partials/views/user-detail",
                    controller: "UserDetailController",
                    resolve: {
                        authorization: authorization.withTokenAndActive
                    }
                })

                .when("/users/userbulkemail", {
                    templateUrl: "/partials/views/userbulkemail",
                    controller: "BulkEmailController",
                    resolve: {
                        authorization: authorization.withTokenAndActive
                    }
                })

                .when("/users/cancelSubscription", {
                    templateUrl: "/partials/views/cancel-subscription",
                    controller: "CancelSubscriptionController",
                    resolve: {
                        authorization: authorization.withTokenAndActive
                    }
                })

                .when("/materials", {
                    templateUrl: "/partials/views/materials",
                    controller: "MaterialsController",
                    resolve: {
                        authorization: authorization.withTokenAndActive
                    }
                })

                .when("/manufactures", {
                    templateUrl: "/partials/views/manufacture",
                    controller: "ManufacturesController",
                    resolve: {
                        authorization: authorization.withTokenAndActive
                    }
                })


                .when("/forum", {
                    templateUrl: "/partials/views/forum",
                    controller: "ForumController",
                    resolve: {
                        authorization: authorization.withTokenAndActive
                    }
                })


                .when("/forum/:id", {
                    templateUrl: "/partials/views/thread",
                    controller: "ThreadsController",
                    resolve: {
                        authorization: authorization.withTokenAndActive
                    }
                })

                .when("/events", {
                    templateUrl: "/partials/views/events",
                    controller: "EventsController",

                })

                .when("/oldevents", {
                    templateUrl: "/partials/views/events/oldevents.jade",
                    controller: "OldeventsController",

                })

                .when("/heat-demand/:id", {
                    templateUrl: "/partials/views/summary/heat-demand",
                    controller: "HeatDemandController",
                    resolve: {
                        authorization: authorization.withTokenAndActive
                    }
                })

                .when("/fuel-comparison/:id", {
                    templateUrl: "/partials/views/summary/fuel-comparison",
                    controller: "FuelCompareController",
                    resolve: {
                        authorization: authorization.withTokenAndActive
                    }
                })

                .when("/flow-temp/:id", {
                    templateUrl: "/partials/views/summary/flow-temp",
                    controller: "FlowTempController",
                    resolve: {
                        authorization: authorization.withTokenAndActive
                    }
                })

                .when("/add-manufacture/:id", {
                    templateUrl: "/partials/views/manufacture/components/add-manufacture.jade",
                    controller: "AddManufacturesController",
                    resolve: {
                        authorization: authorization.withTokenAndActive
                    }
                })

                .when("/models/:id", {
                    templateUrl: "/partials/views/model",
                    controller: "ModelsController",
                    resolve: {
                        authorization: authorization.withTokenAndActive
                    }
                })

                .when("/add-models/:id/:model_id", {
                    templateUrl: "/partials/views/model/components/add-models.jade",
                    controller: "AddModelsController",
                    resolve: {
                        authorization: authorization.withTokenAndActive
                    }
                })

                .when("/custom-materials/:type", {
                    templateUrl: "/partials/views/materials/custom",
                    controller: "CustomMaterialsController",
                    resolve: {
                        authorization: authorization.withTokenAndActive
                    }
                })

                .when("/progress", {
                    templateUrl: "/partials/views/progress",
                    controller: "ProgressController",
                    resolve: {
                        authorization: authorization.withTokenAndActive
                    }
                })

                .when("/completed", {
                    templateUrl: "/partials/views/completed",
                    controller: "CompletedController",
                    resolve: {
                        authorization: authorization.withTokenAndActive
                    }
                })

                .when("/shared-folder", {
                    templateUrl: "/partials/views/shared-folder",
                    controller: "SharedFolderController",
                    resolve: {
                        authorization: authorization.notRequired
                    }
                })

                .when("/shared-folder/qr", {
                    templateUrl: "/partials/views/shared-folder-qr",
                    controller: "SharedFolderQrController",
                    resolve: {
                        authorization: authorization.withTokenAndActive
                    }
                })

                .when("/shared-folders", {
                    templateUrl: "/partials/views/shared-folders",
                    controller: "SharedFoldersController",
                    resolve: {
                        authorization: authorization.withTokenAndActive
                    }
                })

                .when("/share-files", {
                    templateUrl: "/partials/views/share-files",
                    controller: "ShareFilesController",
                    resolve: {
                        authorization: authorization.withTokenAndActive
                    }
                })

                .when("/share-now", {
                    templateUrl: "/partials/views/share-now",
                    controller: "ShareNowController",
                    resolve: {
                        authorization: authorization.withTokenAndActive
                    }
                })

                .when("/account-details", {
                    templateUrl: "/partials/views/account",
                    controller: "AccountController",
                    resolve: {
                        authorization: authorization.withTokenAndActive
                    }
                })

                .when("/master-dashboard", {
                    templateUrl: "/partials/views/master",
                    resolve: {
                        authorization: authorization.withTokenAndActive
                    }
                })

                .when("/summary/:id/:page", {
                    templateUrl: "/partials/views/summary",
                    controller: "SummaryController",
                    resolve: {
                        authorization: authorization.withTokenAndActive
                    }
                })

                .when("/optional/:id", {
                    templateUrl: "/partials/views/summary/optional-page",
                    controller: "OptionalController",
                    resolve: {
                        authorization: authorization.withTokenAndActive
                    }
                })

                .when("/domestic-hot-water/:id", {
                    templateUrl: "/partials/views/summary/domestic-hot-water",
                    controller: "DHWController",
                    resolve: {
                        authorization: authorization.withTokenAndActive
                    }
                })

                .when("/emitters-performance/:id", {
                    templateUrl: "/partials/views/summary/emitters-performance",
                    controller: "EmittersController",
                    resolve: {
                        authorization: authorization.withTokenAndActive
                    }
                })

                .when("/current-radiators/:id", {
                    templateUrl: "/partials/views/summary/current-radiators",
                    controller: "CurrentRadsController",
                    resolve: {
                        authorization: authorization.withTokenAndActive
                    }
                })

                .when("/new-radiators/:id", {
                    templateUrl: "/partials/views/summary/new-radiators",
                    controller: "NewRadsController",
                    resolve: {
                        authorization: authorization.withTokenAndActive
                    }
                })
                .when("/bivalent-design/:id", {
                    templateUrl: "/partials/views/summary/bivalent-design",
                    controller: "BivalentController",
                    resolve: {
                        authorization: authorization.withTokenAndActive
                    }
                })

                .when("/fuel-comparison/:id", {
                    templateUrl: "/partials/views/summary/fuel-comparison",
                    controller: "FuelCompareController",
                    resolve: {
                        authorization: authorization.withTokenAndActive
                    }
                })

                .when("/heat-summary-review/:id", {
                    templateUrl: "/partials/views/summary/heat-summary-review",
                    controller: "HeatSummaryReviewController",
                    resolve: {
                        authorization: authorization.withTokenAndActive
                    }
                })

                .when("/pipe-temp-calculation/:id", {
                    templateUrl: "/partials/views/summary/pipe-temp-calculation",
                    controller: "PipeTempController",
                    resolve: {
                        authorization: authorization.withTokenAndActive
                    }
                })

                .when("/current-pipe-calculation/:id", {
                    templateUrl: "/partials/views/summary/current-pipe-calculation",
                    controller: "CurrentPipeController",
                    resolve: {
                        authorization: authorization.withTokenAndActive
                    }
                })

                .when("/pipesizing/:id", {
                    templateUrl: "/partials/views/summary/pipesizing",
                    controller: "PipesizingController",
                    resolve: {
                        authorization: authorization.withTokenAndActive
                    }
                })

                .when("/new-pipe-calculation/:id", {
                    templateUrl: "/partials/views/summary/new-pipe-calculation",
                    controller: "NewPipeController",
                    resolve: {
                        authorization: authorization.withTokenAndActive
                    }
                })


                .when("/uploaded-image/:id/:fromPage", {
                    templateUrl: "/partials/views/uploaded-image",
                    controller: "UploadedImageController",
                    resolve: {
                        authorization: authorization.withTokenAndActive
                    }
                })

                .when("/uploaded-image-plant/:id", {
                    templateUrl: "/partials/views/plant-room-pump-img",
                    controller: "UploadedImagePlantController",
                    resolve: {
                        authorization: authorization.withTokenAndActive
                    }
                })

                .when("/survey-image/:id", {
                    templateUrl: "/partials/views/survey-room-images",
                    controller: "SurveyImageController",
                    resolve: {
                        authorization: authorization.withTokenAndActive
                    }
                })

                .when("/summary-of-results/:id", {
                    templateUrl: "/partials/views/summary/summary-of-results",
                    controller: "SummaryResultsController",
                    resolve: {
                        authorization: authorization.withTokenAndActive
                    }
                })

                .when("/thermal-bridging/:id", {
                    templateUrl: "/partials/views/summary/thermal-bridging",
                    controller: "thermalBridgingController",
                    resolve: {
                        authorization: authorization.withTokenAndActive
                    }
                })

                .when("/ground-loop-design/:id", {
                    templateUrl: "/partials/views/summary/ground-loop-design",
                    controller: "GroundLoopController",
                    resolve: {
                        authorization: authorization.withTokenAndActive
                    }
                })

                //help guide pdf
                .when("/helpguide", {
                    templateUrl: "/partials/views/help",
                    controller: "MainController"
                })

                .when("/whitelabeled-example", {
                    templateUrl: "/partials/views/whitelabeled-example",
                    controller: "MainController"
                })

                .when("/thermal-conductivity", {
                    templateUrl: "/partials/views/thermal-conductivity",
                    controller: "MainController"
                })

                .when("/terms-and-conditions", {
                    templateUrl: "/partials/views/terms-and-conditions"
                })

                .when("/pricing", {
                    templateUrl: "/partials/views/pricing",
                    controller: "PricingController",
                })
                .when("/pricing-whitelabeled", {
                    templateUrl: "/partials/views/pricing-whitelabeled",
                    controller: "PricingController",
                })

                .when("/about", {
                    templateUrl: "/partials/views/about",
                    controller: "AboutController",
                })

                .when("/associates", {
                    templateUrl: "/partials/views/associates",
                    controller: "AssociatesController"
                })

                .when("/privacy-policy", {
                    templateUrl: "/partials/views/privacy",
                    controller: "MainController"
                })

                .when("/faq", {
                    templateUrl: "/partials/views/faq",
                    controller: "FaqController"
                })

                .when("/colleges", {
                    templateUrl: "/partials/views/colleges",
                    controller: "CollegeController"
                })

                .when("/training", {
                    templateUrl: "/partials/views/training",
                    controller: "TrainingController"
                })

                .when("/test", {
                    templateUrl: "/partials/views/test"
                })

                .when("/technology-summary/:id", {
                    templateUrl: "/partials/views/summary/technology-summary",
                    controller: "TechnologySummaryController",
                    resolve: {
                        authorization: authorization.withTokenAndActive
                    }
                })

                .when("/complete-report", {
                    templateUrl: "/partials/views/complete-report",
                    controller: "CompleteReportController",
                    resolve: {
                        authorization: authorization.withTokenAndActive
                    }
                })

                .when("/mcs-report/:id", {
                    templateUrl: "/partials/views/mcs",
                    controller: "MCSController",
                    resolve: {
                        authorization: authorization.withTokenAndActive
                    }
                })

                .when("/heat-loss-estimator", {
                    templateUrl: "/partials/views/heatLossEstimator",
                    controller: "HeatLossEstimatorController",
                    resolve: {
                        authorization: authorization.notRequired
                    }
                })

                .when("/heat-loss-estimator-user", {
                    templateUrl: "/partials/views/heatLossEstimator",
                    controller: "HeatLossEstimatorController",
                    resolve: {
                        data: initialise.dashboard,
                        authorization: authorization.withTokenAndActive
                    }
                })

                .when("/users/dummyuser", {
                    templateUrl: "/partials/views/dummyuser",
                    controller: "DummyUserController",
                    resolve: {
                        authorization: authorization.withTokenAndActive
                    }
                })

                .when("/heat-manager/home", {
                    templateUrl: "/partials/views/heat-manager/home",
                    controller: "HMhomeController",
                })

                .when("/heat-manager/owner", {
                    templateUrl: "/partials/views/heat-manager/owner",
                    controller: "HMownerController",
                })

                .when("/heat-manager/engineer", {
                    templateUrl: "/partials/views/heat-manager/engineer",
                    controller: "HMengineerController",
                })

                .when("/heat-manager/installer", {
                    templateUrl: "/partials/views/heat-manager/installer",
                    controller: "HMinstallerController",
                })

                .when("/heat-manager/contact", {
                    templateUrl: "/partials/views/heat-manager/installer/contact",
                    controller: "HMcontactController",
                })

                .when("/heat-manager/installer/advisory-link", {
                    templateUrl: "/partials/views/heat-manager/installer/advisory-link",
                    controller: "advisoryLinksController",
                })

                .when("/heat-manager/mobile-upload", {
                    templateUrl: "/partials/views/heat-manager/mobile-upload",
                    controller: "HMmobileuploadController",
                })

                .when("/heat-manager/mobile-upload/add", {
                    templateUrl: "/partials/views/heat-manager/mobile-upload/_add_upload.jade",
                    controller: "adduploadController",
                })

                .when("/heat-manager/heating-overview", {
                    templateUrl: "/partials/views/heat-manager/heating-overview",
                    controller: "overviewController",
                })

                .when("/heat-manager/address-confirm", {
                    templateUrl: "/partials/views/heat-manager/address-confirmation",
                    controller: "AddressConfirmController",
                })

                .when("/heat-manager/video", {
                    templateUrl: "/partials/views/heat-manager/video",
                    controller: "HMvideoController",
                })

                .when(
                    "/designers", {
                        templateUrl: "/partials/views/designers",
                        controller: "DesignerController",
                        resolve: {
                            authorization: authorization.withTokenAndActive
                        }
                    }
                )
                .when(
                    "/designers-credits", {
                        templateUrl: "/partials/views/designersCredits",
                        controller: "DesignerCreditsController",
                        resolve: {
                            authorization: authorization.withTokenAndActive
                        }
                    }
                )
                .when(
                    "/trainees", {
                        templateUrl: "/partials/views/trainee",
                        controller: "TraineeController",
                        resolve: {
                            authorization: authorization.withTokenAndActive
                        }
                    }
                )
                .when(
                    "/trainees/register/:id", {
                        templateUrl: "/partials/views/trainee/_register.jade",
                        controller: "RegisterTraineeController",
                    }
                )

                .otherwise({
                    redirectTo: "/"
                });

            $httpProvider.interceptors.push("authInterceptor");
        })

        .run(function ($rootScope, $location, userService, dataService) {
            if (typeof $rootScope.user === "undefined") userService.initialiseUser();

            if (typeof $rootScope.materials === "undefined") dataService.init();

            $rootScope.$on("$routeChangeSuccess", function () {
                $rootScope.isDashboard = $location.path() == "/dashboard";
            });

            $rootScope.$on("$routeChangeError", function (
                event,
                current,
                previous,
                rejection
            ) {
                event.preventDefault();
                if (rejection === "authorized not active") $location.path("/login");
                else if (rejection === "authorized but active") $location.path("/");
                else if (rejection === "has authorization")
                    $location.path("/dashboard");
            });
        })

        .constant("_", window.underscore)
        .constant("lodash", window.lodash)
        .constant("taxamo", window.Taxamo)
    // .constant("alasql", window.alasql)
    // .constant("API_URL", "http://localhost:3000");
})();
