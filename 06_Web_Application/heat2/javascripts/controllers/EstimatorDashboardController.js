(function () {
  'use strict';

  var app = angular.module('cloudheatengineer');

  /**
   * Dashboard Controller
   */
  app.controller('EstimatorDashboardController', EstimatorDashboardController);
  app.controller('ModelEstimatorCopyReportController', ModelEstimatorCopyReportController);

  EstimatorDashboardController.$inject = ['$rootScope', '$scope', '$modal', 'userService', '_', 'apiService', 'alertService', 'lodash', 'heatLossEstimatorReport', 'heatLossEstimatorService', '$location'];
  function EstimatorDashboardController ($rootScope, $scope, $modal, userService, _, apiService, alertService, lodash, r, heatLossEstimatorService, $location) {
    // data.$promise.then(function (response) {
    //   $scope.counts = response;
    //   $rootScope.user = response.userDetail
    //   window.localStorage.setItem('user', JSON.stringify($rootScope.user));
    // });

    $rootScope.user = JSON.parse(window.localStorage.getItem('user'));

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

    $scope.myHeatLossEstiResults = [];
    $scope.getUserReports = async function () {
      let user = JSON.parse(window.localStorage.getItem('user'))
      let obj = { "email": user.email }
      await heatLossEstimatorService.getDataByUser(obj).then(function (res, err) {
        if (err) {
        }
        $scope.myHeatLossEstiResults = res.data;
      });
    };

    $scope.review = function (id) {
      window.localStorage.setItem('heatLossEstimateId', id);
      $location.path('/heat-loss-estimator-user');
    }

    $scope.newEstimator = function () {
      window.localStorage.removeItem('heatLossEstimateId');
      $location.path('/heat-loss-estimator-user');
    }

    $scope.getDateFormat = function (value) {
      var dateValue = new Date(value);
      var dd = String(dateValue.getDate()).padStart(2, '0');
      var mm = String(dateValue.getMonth() + 1).padStart(2, '0'); //January is 0!
      var yyyy = dateValue.getFullYear();
      return mm + '/' + dd + '/' + yyyy;
    }

    $scope.deleteReport = function (id) {
      if (confirm('Are you sure you want to delete this report?, action not reversible.')) {
        heatLossEstimatorService.deleteReport(id).then(function (res, err) {
          if (err) {
            alertService('error', 'PDF Report', ' Report delete failed !');
          }
          if (res) {
            const index = $scope.myHeatLossEstiResults.map(function (o) { return o._id; }).indexOf(id);
            if (index !== -1) {
              $scope.myHeatLossEstiResults.splice(index, 1);
            }
            alertService('success', 'PDF Report', ' Report deleted !');
          }
        })
      };
    }

    $scope.copyReport = function (id) {
      let query = { estimateId: id, is_copied: true }
      heatLossEstimatorService.copyEstimateReport(query).then(function (res, err) {
        if (res.data.success) {
          alertService('success', 'Copy Report', 'Report Copied');
          $scope.getUserReports();
        }
      })
    }

    $scope.downloadPDF = function (id) {

      let whiteLabeled = false;
      if ($rootScope.user.selectedPlan.plan == 'manufacturerYearly' || $rootScope.user.selectedPlan.plan.includes('WhiteLabeled')) {
        whiteLabeled = true;
      }

      heatLossEstimatorService.getHeatLossEstimatorValueForPDF(id).then(function (res, err) {
        try {
          var report = JSON.parse(JSON.stringify(r));
          var dateValue = $scope.getDateFormat(res.data.heatlossestimates.date);
          if (whiteLabeled) {
            report.header = function () {
              return {
                columns: [
                  {
                    width: '*',
                    stack: [
                      {}
                    ]
                  },
                  {
                    width: '*',
                    text: ''
                  }
                ],
                margin: [40, 10, 40, 0]
              };
            };
            report.footer = function (page, pages) {
              return {
                columns: [{
                  width: 30,
                  text: ''
                },
                {
                  width: '*',
                  alignment: 'center',
                  text: [{
                    text: 'Heat Loss Estimator Report',
                    bold: true,
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
            };
          } else {
            report.header = function () {
              return {
                columns: [
                  {
                    width: '*',
                    stack: [
                      { image: 'data:image/png;base64,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', width: 150 },
                      { text: 'Heat Engineer Software Ltd', style: 'smallGray' }
                    ]
                  },
                  {
                    width: '*',
                    text: ''
                  }
                ],
                margin: [40, 10, 40, 0]
              };
            };
            report.footer = function (page, pages) {
              return {
                columns: [{
                  width: 30,
                  text: ''
                },
                {
                  width: '*',
                  alignment: 'center',
                  text: [{
                    text: 'Heat Loss Estimator Report: ',
                    bold: true,
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
            };
          }

          let logoContent = [
            { image: 'data:image/png;base64,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', width: 150, alignment: 'center', margin: [0, 20, 0, 0] }, // 11
            { text: 'Disclaimer: This heat loss estimator has been designed to provide heating estimations on Power kW and Energy kWh demands for domestic and commercial properties. The tool provides approximations to aid the quotation / tendering process before a project is accepted. It is very important to note that before a heating system is installed that a full room by room heat loss calculation should be completed meeting The Chartered Institution of Building Services Engineers (CIBSE) and Microgeneration Certification Scheme (MCS) standards.', italics: true, margin: [0, 20, 0, 0], fontSize: 10 }, // 12
            { text: 'It’s important for the relevant persons to read this report and notify ‘company name’ of any corrections that need to be made before the heating system is installed. ‘company name’ is not liable for any inaccurate calculations made due to incorrect information, therefore it’s important that the information provided is to the best knowledge available from the home owner, architect or builder.', italics: true, margin: [0, 20, 0, 0], fontSize: 10 } // 13
          ];
          if (whiteLabeled) {
            logoContent = [
              { image: gDataURI, width: 150, alignment: 'center', margin: [0, 20, 0, 0] }, // 11
              { text: 'Disclaimer: This heat loss estimator has been designed to provide heating estimations on Power kW and Energy kWh demands for domestic and commercial properties. The tool provides approximations to aid the quotation / tendering process before a project is accepted. It is very important to note that before a heating system is installed that a full room by room heat loss calculation should be completed meeting The Chartered Institution of Building Services Engineers (CIBSE) and Microgeneration Certification Scheme (MCS) standards.', italics: true, margin: [0, 20, 0, 0], fontSize: 10 }, // 12
              { text: 'It’s important for the relevant persons to read this report and notify ‘company name’ of any corrections that need to be made before the heating system is installed. ‘company name’ is not liable for any inaccurate calculations made due to incorrect information, therefore it’s important that the information provided is to the best knowledge available from the home owner, architect or builder.', italics: true, margin: [0, 20, 0, 0], fontSize: 10 } // 13
            ]
          }
          report.content = [
            { // 0
              stack: [
                '', //
                { text: 'Heat Loss Estimator Report', alignment: 'center', fontSize: 22, bold: true, margin: [0, 20, 0, 20] }, // 1
                '', //
                { text: 'Project Reference:  ' + res.data.heatlossestimates.projectRef, bold: true, alignment: 'center', fontSize: 20, margin: [0, 10, 0, 10] }, // 0
                { text: 'Customer Name:  ' + res.data.heatlossestimates.projectName, bold: true, alignment: 'center', fontSize: 19, margin: [0, 10, 0, 10] }, // 1
                { text: 'Address:  ' + res.data.heatlossestimates.addressLine1 + ",\n" + res.data.heatlossestimates.addressLine2 + ",\n" + res.data.heatlossestimates.addressLine3, bold: true, alignment: 'center', fontSize: 18, margin: [0, 10, 0, 10] }, // 2
                { text: 'Postal Code:  ' + res.data.heatlossestimates.postCode, bold: true, alignment: 'center', fontSize: 15, margin: [0, 10, 0, 10] }, // 5
                { text: 'Engineer:  ' + res.data.heatlossestimates.engineer, bold: true, alignment: 'center', fontSize: 14, margin: [0, 10, 0, 10] }, // 6
                { text: 'Date:  ' + dateValue, bold: true, alignment: 'center', fontSize: 13, margin: [0, 10, 0, 10] } // 7
              ],
              margin: [0, 30, 0, 30]
            },
            { // 1
              stack: logoContent
            },
            {   // 2
              pageBreak: 'before',
              pageOrientation: 'portrait',
              stack: [ // content stack
                { text: 'Estimator Property Type', alignment: 'center', fontSize: 20, bold: true, margin: [0, 50, 0, 10] }, // 0
                { // 1
                  columns: [
                    {
                      width: '*',
                      stack: [
                        { text: 'Type of property:  ', bold: true },
                      ],
                      alignment: 'right',
                      fontSize: 10,
                      text: 'Left: '
                    },
                    {
                      width: '*',
                      stack: [
                        { text: res.data.heatlossestimates.buildingType }
                      ],
                      margin: [10, 0, 0, 0],
                      alignment: 'left',
                      fontSize: 10,
                      text: 'Right'
                    }
                  ],
                  margin: [60, 0]
                },
                { text: 'Estimator Property Information', alignment: 'center', fontSize: 20, bold: true, margin: [0, 60, 0, 10] }, // 2
                { // 3
                  columns: [
                    {
                      width: '*',
                      stack: [
                        { text: 'Project Reference:  ', bold: true, margin: [0, 5, 0, 0] }, // 0
                        { text: 'Customer Name:  ', bold: true, margin: [0, 5, 0, 0] }, // 1
                        { text: 'Site address 1:  ', bold: true, margin: [0, 5, 0, 0] }, // 2
                        { text: 'Site address 2:  ', bold: true, margin: [0, 5, 0, 0] }, // 3
                        { text: 'Site address 3:  ', bold: true, margin: [0, 5, 0, 0] }, // 4
                        { text: 'Post Code:  ', bold: true, margin: [0, 5, 0, 0] }, // 5
                        { text: 'Engineer:  ', bold: true, margin: [0, 5, 0, 0] }, // 6
                        { text: 'Date:  ', bold: true, margin: [0, 5, 0, 0] }, // 7
                        { text: 'Region:  ', bold: true, margin: [0, 5, 0, 0] }, // 8
                        { text: 'Reference City:  ', bold: true, margin: [0, 5, 0, 0] }, // 9
                        { text: 'Has there been an extension to the property?  ', bold: true, margin: [0, 5, 0, 0] }, // 10
                      ],
                      alignment: 'right',
                      fontSize: 10,
                      text: 'Left: '
                    },
                    {
                      width: '*',
                      stack: [
                        { text: res.data.heatlossestimates.projectRef, margin: [0, 5, 0, 0] },
                        { text: res.data.heatlossestimates.projectName, margin: [0, 5, 0, 0] },
                        { text: res.data.heatlossestimates.addressLine1, margin: [0, 5, 0, 0] },
                        { text: res.data.heatlossestimates.addressLine2, margin: [0, 5, 0, 0] },
                        { text: res.data.heatlossestimates.addressLine3 ? res.data.heatlossestimates.addressLine3 : '', margin: [0, 5, 0, 0] },
                        { text: res.data.heatlossestimates.postCode, margin: [0, 5, 0, 0] },
                        { text: res.data.heatlossestimates.engineer, margin: [0, 5, 0, 0] },
                        { text: res.data.heatlossestimates.date, margin: [0, 5, 0, 0] },
                        { text: res.data.heatlossestimates.ukRegion.region ? res.data.heatlossestimates.ukRegion.region : res.data.heatlossestimates.ukRegion.regionName, margin: [0, 5, 0, 0] },
                        { text: res.data.heatlossestimates.referenceCity.location, margin: [0, 5, 0, 0] },
                        { text: res.data.heatlossestimates.isExtension, margin: [0, 5, 0, 0] },
                      ],
                      margin: [10, 0, 0, 0],
                      alignment: 'left',
                      fontSize: 10,
                      text: 'Right'
                    }
                  ],
                  margin: [60, 0]
                }
              ]
            }
          ];

          var mainBuilding = [
            { text: 'Main Building', alignment: 'center', fontSize: 20, bold: true, margin: [0, 20, 0, 10] }, // 4
            { // 5
              columns: [
                {
                  width: '*',
                  stack: [
                    { text: 'U Value Roof Glazing (W/m\u00B2K):  ', bold: true, margin: [0, 3, 0, 0] }, // 0
                    { text: 'U Value Roof (W/m\u00B2K):  ', bold: true, margin: [0, 3, 0, 0] }, // 1
                    { text: 'What is above Roof?:  ', bold: true, margin: [0, 3, 0, 0] }, // 2
                    { text: 'U Value Windows (W/m\u00B2K):  ', bold: true, margin: [0, 3, 0, 0] }, // 3
                    { text: 'U Value External Walls (W/m\u00B2K):  ', bold: true, margin: [0, 3, 0, 0] }, // 4
                    { text: 'U Value External Doors (W/m\u00B2K):  ', bold: true, margin: [0, 3, 0, 0] }, // 5
                    { text: 'Floor Type:  ', bold: true, margin: [0, 3, 0, 0] }, // 6
                    { text: 'U Value Floor (W/m\u00B2K):  ', bold: true, margin: [0, 3, 0, 0] }, // 7
                  ],
                  alignment: 'right',
                  fontSize: 10,
                  text: 'Left: '
                },
                {
                  width: '*',
                  stack: [
                    { text: res.data.heatlossestimates.mainBuilding.uValueRoofLights.name ? res.data.heatlossestimates.mainBuilding.uValueRoofLights.name : 'na', margin: [0, 3, 0, 0] },
                    { text: res.data.heatlossestimates.mainBuilding.uValueRoof.name, margin: [0, 3, 0, 0] },
                    { text: res.data.heatlossestimates.mainBuilding.aboveRoof, margin: [0, 3, 0, 0] },
                    { text: res.data.heatlossestimates.mainBuilding.uValueWindows.name, margin: [0, 3, 0, 0] },
                    { text: res.data.heatlossestimates.mainBuilding.uValueExternalWalls.name, margin: [0, 3, 0, 0] },
                    { text: res.data.heatlossestimates.mainBuilding.uValueExternalDoors.name, margin: [0, 3, 0, 0] },
                    { text: res.data.heatlossestimates.mainBuilding.groundFloorType, margin: [0, 3, 0, 0] },
                    { text: res.data.heatlossestimates.mainBuilding.uValueGroundFloor.name, margin: [0, 3, 0, 0] }
                  ],
                  margin: [10, 0, 0, 0],
                  alignment: 'left',
                  fontSize: 10,
                  text: 'Right'
                }
              ],
              margin: [60, 0]
            },
            { text: 'Dwelling Openings', alignment: 'center', fontSize: 16, bold: true, margin: [0, 30, 0, 10] }, // 6
            { // 7
              columns: [
                {
                  width: '*',
                  stack: [
                    { text: 'Glazing to Wall Ratio (%):  ', bold: true, margin: [0, 3, 0, 0] }, // 0
                    { text: 'No of Roof Glazing:  ', bold: true, margin: [0, 3, 0, 0] }, // 1
                    { text: 'No of External Doors:  ', bold: true, margin: [0, 3, 0, 0] }, // 2
                  ],
                  alignment: 'right',
                  fontSize: 10,
                  text: 'Left: '
                },
                {
                  width: '*',
                  stack: [
                    { text: res.data.heatlossestimates.mainBuilding.dwelling.glazingRatioPercent + ' %', margin: [0, 3, 0, 0] },
                    { text: res.data.heatlossestimates.mainBuilding.dwelling.noOfRoofLights, margin: [0, 3, 0, 0] },
                    { text: res.data.heatlossestimates.mainBuilding.dwelling.noOfExternalDoors, margin: [0, 3, 0, 0] },
                  ],
                  margin: [10, 0, 0, 0],
                  alignment: 'left',
                  fontSize: 10,
                  text: 'Right'
                }
              ],
              margin: [60, 0]
            },
            { text: 'Other Dwelling Info', alignment: 'center', fontSize: 16, bold: true, margin: [0, 30, 0, 10] }, // 8
            { // 9
              columns: [
                {
                  width: '*',
                  stack: [
                    { text: 'Average Indoor Temperature (\u00B0C):  ', bold: true, margin: [0, 3, 0, 0] }, // 0
                    { text: 'Average Ground Floor Area (m\u00B2):  ', bold: true, margin: [0, 3, 0, 0] }, // 1
                    { text: 'No of Floors:  ', bold: true, margin: [0, 3, 0, 0] }, // 2
                    { text: 'Total Floor Area (m\u00B2):  ', bold: true, margin: [0, 3, 0, 0] }, // 3
                    { text: 'Average Storey Height (m):  ', bold: true, margin: [0, 3, 0, 0] }, // 4
                    { text: 'Dwelling Volume (m\u00B3):  ', bold: true, margin: [0, 3, 0, 0] }, // 5
                    { text: 'propertyType:  ', bold: true, margin: [0, 3, 0, 0] }, // 6
                  ],
                  alignment: 'right',
                  fontSize: 10,
                  text: 'Left: '
                },
                {
                  width: '*',
                  stack: [
                    { text: res.data.heatlossestimates.mainBuilding.avgIndoorTemperature + ' \u00B0C', margin: [0, 3, 0, 0] },
                    { text: res.data.heatlossestimates.mainBuilding.avgGroundFloorArea + ' m\u00B2', margin: [0, 3, 0, 0] },
                    { text: res.data.heatlossestimates.mainBuilding.noOfFloors, margin: [0, 3, 0, 0] },
                    { text: res.data.heatlossestimates.mainBuilding.totalFloorArea + ' m\u00B2', margin: [0, 3, 0, 0] },
                    { text: res.data.heatlossestimates.mainBuilding.avgStoreyHeight + ' m', margin: [0, 3, 0, 0] },
                    { text: res.data.heatlossestimates.mainBuilding.dwellingVolume + ' m\u00B3', margin: [0, 3, 0, 0] },
                    { text: res.data.heatlossestimates.mainBuilding.propertyType, margin: [0, 3, 0, 0] }
                  ],
                  margin: [10, 0, 0, 0],
                  alignment: 'left',
                  fontSize: 10,
                  text: 'Right'
                }
              ],
              margin: [60, 0]
            }
          ]

          report.content.push({
            pageBreak: 'before',
            stack: mainBuilding
          });

          if (res.data.heatlossestimates.isExtension) {
            var extentionObj = [
              { text: 'Extension', alignment: 'center', fontSize: 20, bold: true, margin: [0, 20, 0, 10] },
              { // 11
                columns: [
                  {
                    width: '*',
                    stack: [
                      { text: 'U Value Roof Glazing (W/m\u00B2K):  ', bold: true, margin: [0, 3, 0, 0] }, // 0
                      { text: 'U Value Roof (W/m\u00B2K):  ', bold: true, margin: [0, 3, 0, 0] }, // 1
                      { text: 'What is above Roof?:  ', bold: true, margin: [0, 3, 0, 0] }, // 2
                      { text: 'U Value Windows (W/m\u00B2K):  ', bold: true, margin: [0, 3, 0, 0] }, // 3
                      { text: 'U Value External Walls (W/m\u00B2K):  ', bold: true, margin: [0, 3, 0, 0] }, // 4
                      { text: 'U Value External Doors (W/m\u00B2K):  ', bold: true, margin: [0, 3, 0, 0] }, // 5
                      { text: 'Floor Type:  ', bold: true, margin: [0, 3, 0, 0] }, // 6
                      { text: 'U Value Floor (W/m\u00B2K):  ', bold: true, margin: [0, 3, 0, 0] }, // 7
                    ],
                    alignment: 'right',
                    fontSize: 10,
                    text: 'Left: '
                  },
                  {
                    width: '*',
                    stack: [
                      { text: res.data.heatlossestimates.extension.uValueRoofLights.name ? res.data.heatlossestimates.extension.uValueRoofLights.name : 'na', margin: [0, 3, 0, 0] },
                      { text: res.data.heatlossestimates.extension.uValueRoof.name, margin: [0, 3, 0, 0] },
                      { text: res.data.heatlossestimates.extension.aboveRoof, margin: [0, 3, 0, 0] },
                      { text: res.data.heatlossestimates.extension.uValueWindows.name, margin: [0, 3, 0, 0] },
                      { text: res.data.heatlossestimates.extension.uValueExternalWalls.name, margin: [0, 3, 0, 0] },
                      { text: res.data.heatlossestimates.extension.uValueExternalDoors.name, margin: [0, 3, 0, 0] },
                      { text: res.data.heatlossestimates.extension.groundFloorType, margin: [0, 3, 0, 0] },
                      { text: res.data.heatlossestimates.extension.uValueGroundFloor.name, margin: [0, 3, 0, 0] }
                    ],
                    margin: [10, 0, 0, 0],
                    alignment: 'left',
                    fontSize: 10,
                    text: 'Right'
                  }
                ],
                margin: [60, 0]
              },
              { text: 'Dwelling Openings', alignment: 'center', fontSize: 16, bold: true, margin: [0, 30, 0, 10] },
              { // 13
                columns: [
                  {
                    width: '*',
                    stack: [
                      { text: 'Glazing to Wall Ratio (%):  ', bold: true, margin: [0, 3, 0, 0] }, // 0
                      { text: 'No of Roof Glazing:  ', bold: true, margin: [0, 3, 0, 0] }, // 1
                      { text: 'No of External Doors:  ', bold: true, margin: [0, 3, 0, 0] }, // 2
                    ],
                    alignment: 'right',
                    fontSize: 10,
                    text: 'Left: '
                  },
                  {
                    width: '*',
                    stack: [
                      { text: res.data.heatlossestimates.extension.dwelling.glazingRatioPercent + ' %', margin: [0, 3, 0, 0] },
                      { text: res.data.heatlossestimates.extension.dwelling.noOfRoofLights, margin: [0, 3, 0, 0] },
                      { text: res.data.heatlossestimates.extension.dwelling.noOfExternalDoors, margin: [0, 3, 0, 0] },
                    ],
                    margin: [10, 0, 0, 0],
                    alignment: 'left',
                    fontSize: 10,
                    text: 'Right'
                  }
                ],
                margin: [60, 0]
              },
              { text: 'Other Dwelling Info', alignment: 'center', fontSize: 16, bold: true, margin: [0, 30, 0, 10] },
              { // 15
                columns: [
                  {
                    width: '*',
                    stack: [
                      { text: 'Average Indoor Temperature (\u00B0C):  ', bold: true, margin: [0, 3, 0, 0] }, // 0
                      { text: 'Average Ground Floor Area m\u00B2:  ', bold: true, margin: [0, 3, 0, 0] }, // 1
                      { text: 'No of Floors:  ', bold: true, margin: [0, 3, 0, 0] }, // 2
                      { text: 'Total Floor Area (m\u00B2):  ', bold: true, margin: [0, 3, 0, 0] }, // 3
                      { text: 'Average Storey Height (m):  ', bold: true, margin: [0, 3, 0, 0] }, // 4
                      { text: 'Dwelling Volume (m\u00B3):  ', bold: true, margin: [0, 3, 0, 0] }, // 5
                    ],
                    alignment: 'right',
                    fontSize: 10,
                    text: 'Left: '
                  },
                  {
                    width: '*',
                    stack: [
                      { text: res.data.heatlossestimates.extension.avgIndoorTemperature + ' \u00B0C', margin: [0, 3, 0, 0] },
                      { text: res.data.heatlossestimates.extension.avgGroundFloorArea + ' m\u00B2', margin: [0, 3, 0, 0] },
                      { text: res.data.heatlossestimates.extension.noOfFloors, margin: [0, 3, 0, 0] },
                      { text: res.data.heatlossestimates.extension.totalFloorArea + ' m\u00B2', margin: [0, 3, 0, 0] },
                      { text: res.data.heatlossestimates.extension.avgStoreyHeight + ' m', margin: [0, 3, 0, 0] },
                      { text: res.data.heatlossestimates.extension.dwellingVolume + ' m\u00B3', margin: [0, 3, 0, 0] }
                    ],
                    margin: [10, 0, 0, 0],
                    alignment: 'left',
                    fontSize: 10,
                    text: 'Right'
                  }
                ],
                margin: [60, 0]
              }
            ];
            report.content.push({
              pageBreak: 'before',
              stack: extentionObj
            });
          };

          var finalFormInput = [
            { text: 'Final Parameters', alignment: 'center', fontSize: 20, bold: true, margin: [0, 20, 0, 10] },
            { // 11
              columns: [
                {
                  width: '*',
                  stack: [
                    { text: 'Total Floor Area (m\u00B2):  ', bold: true, margin: [0, 3, 0, 0] }, // 0
                    { text: 'Height above sea level (m):  ', bold: true, margin: [0, 3, 0, 0] }, // 1
                    { text: 'Adjustment for Altitude(\u00B0C):  ', bold: true, margin: [0, 3, 0, 0] }, // 2
                    { text: 'Outdoor Temperature(C):  ', bold: true, margin: [0, 3, 0, 0] }, // 3
                    { text: 'Dwelling in an Exposted Location:  ', bold: true, margin: [0, 3, 0, 0] }, // 4
                    { text: 'Indoor - Outdoor delta T:  ', bold: true, margin: [0, 3, 0, 0] }, // 5
                    { text: 'Degree Days:  ', bold: true, margin: [0, 3, 0, 0] }, // 6
                    { text: 'Average No. Air Change Per Hour:  ', bold: true, margin: [0, 3, 0, 0] }, // 7
                  ],
                  alignment: 'right',
                  fontSize: 10,
                  text: 'Left: '
                },
                {
                  width: '*',
                  stack: [
                    { text: res.data.heatlossestimates.totalFloorArea + ' m\u00B2', margin: [0, 3, 0, 0] },
                    { text: res.data.heatlossestimates.seaLevel + ' m', margin: [0, 3, 0, 0] },
                    { text: res.data.heatlossestimates.adjustmentAltitude + ' \u00B0C', margin: [0, 3, 0, 0] },
                    { text: res.data.heatlossestimates.outdoorTemperature + ' C', margin: [0, 3, 0, 0] },
                    { text: res.data.heatlossestimates.dwellingExpostedLocation, margin: [0, 3, 0, 0] },
                    { text: res.data.heatlossestimates.inOutDoorDeltat, margin: [0, 3, 0, 0] },
                    { text: res.data.heatlossestimates.degreeDays, margin: [0, 3, 0, 0] },
                    { text: res.data.heatlossestimates.avgAirChangePerHour, margin: [0, 3, 0, 0] }
                  ],
                  margin: [10, 0, 0, 0],
                  alignment: 'left',
                  fontSize: 10,
                  text: 'Right'
                }
              ],
              margin: [60, 0]
            }
          ];

          report.content.push({
            pageBreak: 'before',
            stack: finalFormInput
          });

          if (!res.data.heatlossestimates.domestic) {
            var commercialInputForm = [
              { text: 'Hot water for commercial use', alignment: 'center', fontSize: 20, bold: true, margin: [0, 30, 0, 10] },
              { // 11
                columns: [
                  {
                    width: '*',
                    stack: [
                      { text: 'Use this method instead of DHW?:  ', bold: true, margin: [0, 3, 0, 0] }, // 0
                      { text: 'No of Occupants:  ', bold: true, margin: [0, 3, 0, 0] }, // 1
                      { text: 'Type Of Use:  ', bold: true, margin: [0, 3, 0, 0] }, // 2,
                      { text: 'Day of User (p.a):  ', bold: true, margin: [0, 3, 0, 0] }, // 3
                      { text: 'Hot Water Estimate (kWh p.a):  ', bold: true, margin: [0, 3, 0, 0] }, // 4
                      { text: 'Additional Size for Hot Water (kW):  ', bold: true, margin: [0, 3, 0, 0] }, // 5
                      { text: 'Add additional size:  ', bold: true, margin: [0, 3, 0, 0] }, // 6
                    ],
                    alignment: 'right',
                    fontSize: 10,
                    text: 'Left: '
                  },
                  {
                    width: '*',
                    stack: [
                      { text: res.data.heatlossestimates.dwhCommmercial.useThis, margin: [0, 3, 0, 0] },
                      { text: res.data.heatlossestimates.dwhCommmercial.noOfOccupants, margin: [0, 3, 0, 0] },
                      { text: res.data.heatlossestimates.dwhCommmercial.typeOfUse.name, margin: [0, 3, 0, 0] },
                      { text: res.data.heatlossestimates.dwhCommmercial.daysOfUse, margin: [0, 3, 0, 0] },
                      { text: res.data.heatlossestimates.dwhCommmercial.hotWaterEstimate, margin: [0, 3, 0, 0] },
                      { text: res.data.heatlossestimates.dwhCommmercial.additionalSizeForHWKW, margin: [0, 3, 0, 0] },
                      { text: res.data.heatlossestimates.dwhCommmercial.additionalSize ? res.data.heatlossestimates.dwhCommmercial.additionalSize : "No Add", margin: [0, 3, 0, 0] }
                    ],
                    margin: [10, 0, 0, 0],
                    alignment: 'left',
                    fontSize: 10,
                    text: 'Right'
                  }
                ],
                margin: [40, 0]
              }
            ];
            report.content.push({
              stack: commercialInputForm
            });
          };

          if (res.data.heatlossestimates.domestic || res.data.heatlossestimates.dwhCommmercial.useThis === 'No') {
            var domestictInputForm = [
              { text: 'For DHW Calculation', alignment: 'center', fontSize: 20, bold: true, margin: [0, 30, 0, 10] },
              { // 11
                columns: [
                  {
                    width: '*',
                    stack: [
                      { text: 'No of Bedrooms:  ', bold: true, margin: [0, 3, 0, 0] }, // 0
                      { text: 'No of Bathrooms:  ', bold: true, margin: [0, 3, 0, 0] }, // 1
                      { text: 'No of Occupents Bedroom:  ', bold: true, margin: [0, 3, 0, 0] }, // 2
                    ],
                    alignment: 'right',
                    fontSize: 10,
                    text: 'Left: '
                  },
                  {
                    width: '*',
                    stack: [
                      { text: res.data.heatlossestimates.dwhDomestic.noOfBedrooms, margin: [0, 3, 0, 0] },
                      { text: res.data.heatlossestimates.dwhDomestic.noOfBathrooms, margin: [0, 3, 0, 0] },
                      { text: res.data.heatlossestimates.dwhDomestic.noOfOccupentsBedroom, margin: [0, 3, 0, 0] },
                    ],
                    margin: [10, 0, 0, 0],
                    alignment: 'left',
                    fontSize: 10,
                    text: 'Right'
                  }
                ],
                margin: [20, 0]
              }
            ];
            report.content.push({
              stack: domestictInputForm
            });
          }

          report.content.push({
            pageBreak: 'before',
            stack: [ // content stack
              { text: 'Estimator Calculations Results', alignment: 'center', fontSize: 20, bold: true, margin: [0, 60, 0, 20], },
              {
                table: {
                  widths: [150, 150, 150],
                  body: [
                    ['Total Heat Loss', 'Main Building', 'Extension'],
                    [
                      res.data.heatlossestimates.heatLossCalculations.exposedLocationAdjustmentKW ? res.data.heatlossestimates.heatLossCalculations.exposedLocationAdjustmentKW.toFixed(2) + ' kW' : 0,
                      res.data.heatlossestimates.heatLossCalculations.mainBuildingExposedLocationAdjustmnetKW ? res.data.heatlossestimates.heatLossCalculations.mainBuildingExposedLocationAdjustmnetKW.toFixed(2) + ' kW' : 0,
                      res.data.heatlossestimates.heatLossCalculations.extensionExposedLocationAdjustmentKW ? res.data.heatlossestimates.heatLossCalculations.extensionExposedLocationAdjustmentKW.toFixed(2) + ' kW' : '-'
                    ]
                  ]
                }
              },
              "\n",
              "\n",
              {
                table: {
                  widths: [150, 150, 150],
                  body: [
                    ['Total Energy Demand', 'Hot Water', 'Heating'],
                    [
                      res.data.heatlossestimates.heatLossCalculations.totalDHWAndHeatingEnergyKWh ? res.data.heatlossestimates.heatLossCalculations.totalDHWAndHeatingEnergyKWh.toFixed(2) + ' kWh' : 0,
                      res.data.heatlossestimates.heatLossCalculations.totalDHWOrComProportionKWh ? res.data.heatlossestimates.heatLossCalculations.totalDHWOrComProportionKWh.toFixed(2) + ' kWh' : 0,
                      res.data.heatlossestimates.heatLossCalculations.totalExposedLocationAdjustmentKWh ? res.data.heatlossestimates.heatLossCalculations.totalExposedLocationAdjustmentKWh.toFixed(2) + ' kWh' : 0
                    ],
                  ]
                }
              },
              "\n",
              "\n",
              {
                table: {
                  widths: [150, 150, 150],
                  body: [
                    ['Average W/m\u00B2', 'Main Building', 'Extension'],
                    [
                      res.data.heatlossestimates.heatLossCalculations.totalPropertyAverageWm2 ? res.data.heatlossestimates.heatLossCalculations.totalPropertyAverageWm2.toFixed(2) + ' W/m\u00B2' : 0,
                      res.data.heatlossestimates.heatLossCalculations.mainBuildingPropertyAverageWm2 ? res.data.heatlossestimates.heatLossCalculations.mainBuildingPropertyAverageWm2.toFixed(2) + ' W/m\u00B2' : 0,
                      res.data.heatlossestimates.heatLossCalculations.extensionPropertyAverageWm2 ? res.data.heatlossestimates.heatLossCalculations.extensionPropertyAverageWm2.toFixed(2) + ' W/m\u00B2' : 0
                    ]
                  ]
                }
              }
            ]
          });

          // styles
          report.styles = {
            smallGray: {
              fontSize: 9,
              color: '#CCC'
            },
            table: {
              fontSize: 8
            }
          };

          let a = Math.floor(Math.random() * 100000);
          alertService('success', 'PDF Report', ' is loading... It will be downloaded in seconds..');
          pdfMake.createPdf(report).download('heatLossEstimation-' + a);
        } catch (err) {
          alertService('warning', 'PDF Report', err);
        }
      });
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

    let gDataURI;

    $scope.init = function () {
      $scope.getUserReports();

      var url = $rootScope.user.logo != 'prof-logo.png' ? 'https://s3.amazonaws.com/heat-engineer-s3/' + $rootScope.user.logo : 'https://www.heat-engineer.com/images/prof-logo.png';
      convertImgToBase64URL(url, function (dataUri) {
        if (!!dataUri) {
          gDataURI = dataUri;
        }
      });
    };

    $scope.init();

    $scope.estimatorReport = function (id) {
      var modalOptions = {};
      modalOptions.templateUrl = '/partials/views/estimator-dashboard/_estimator_copy_report';
      modalOptions.controller = 'ModelEstimatorCopyReportController';
      modalOptions.size = 'md';

      var modalInstance = $modal.open({
        animation: true,
        templateUrl: modalOptions.templateUrl,
        controller: modalOptions.controller,
        size: modalOptions.size,
        resolve: {
          data: function () {
            return {
              id: id
            }
          }
        }
      });

      modalInstance.result.then(function (data) {
        $scope.valueChanged = true;
        let query = { estimateId: data.id, is_copied: true, projectName: data.projectName }
        heatLossEstimatorService.copyEstimateReport(query).then(function (res, err) {
          if (res.data.success) {
            alertService('success', 'Copy Report', 'Report Copied');
            $scope.getUserReports();
          }
        })
      }, function () { });
    }
  }


  ModelEstimatorCopyReportController.$inject = ['$scope', '$modalInstance', 'data'];
  function ModelEstimatorCopyReportController ($scope, $modalInstance, data) {
    $scope.projectname = ""

    $scope.ok = function () {
      let ret = {}
      ret.id = data.id;
      ret.projectName = $scope.projectname
      $modalInstance.close(ret)
    }

    $scope.cancel = function () {
      $modalInstance.dismiss('cancel')
    }

  }
})();


