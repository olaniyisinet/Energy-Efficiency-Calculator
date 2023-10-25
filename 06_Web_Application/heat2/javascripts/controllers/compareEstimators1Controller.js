(function () {
  'use strict';

  function CompareEstimatorsController($rootScope, $routeParams, $scope, $location, surveyService, userService, apiService, commonService, alertService,heatLossEstimatorService,$window) {

    $window.document.title = 'Heat Engineer Estimators';

    $scope.selectedSurveyData1={}
    $scope.selectedSurveyData2={}
    $scope.buttonShow = false
    $scope.chartVisible= false
    $scope.detail1= false
    $scope.detail2= false
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

    $scope.myHeatLossEstiResults = [];
    $scope.searchVal = ''
    $scope.searchVal1 = ''
    $scope.getUserReports = async function () {
      let user = JSON.parse(window.localStorage.getItem('user'))
      let obj = { "email": user.email }
      await heatLossEstimatorService.getDataByUser(obj).then(function (res, err) {
        if (err) {
          console.log("error::: ", err);
        }
        $scope.myHeatLossEstiResults = res.data;
      });
    };

    function convertImgToBase64URL(url, callback, outputFormat) {
        var canvas = document.createElement('CANVAS'),
            ctx = canvas.getContext('2d'),
            img = new Image;
        img.setAttribute('crossorigin', 'anonymous')
        img.onload = function() {
            var dataURL;
            canvas.height = img.height;
            canvas.width = img.width;
            ctx.drawImage(img, 0, 0);
            dataURL = canvas.toDataURL(outputFormat);
            callback(dataURL);
            canvas = null;
        }
        img.onerror = function() {
            callback(undefined)
        }
        img.src = url + '?' + new Date().getTime();
    }
    var url = $rootScope.user.logo != 'prof-logo.png' ? 'https://s3.amazonaws.com/heat-engineer-s3/' + $rootScope.user.logo : 'https://www.heat-engineer.com/images/prof-logo.png';
    init()

    function init() {
        $scope.getUserReports()
        convertImgToBase64URL(url, function(dataUri) {
            if (!!dataUri) {
                gDataURI = dataUri;
            }
            if (!dataUri) {
                convertImgToBase64URL("https://www.heat-engineer.com/images/prof-logo.png", function(data) {
                    gDataURI = data
                })
            }
        });
    }


   // Surveyer 1
    $scope.selectedSurvey1 = function(survey) {

      $scope.selectedSurveyData1 = survey
      $scope.visibleList1 = false


      if(survey.heatlossestimates.dwellingExpostedLocation ==="Yes"){
        $scope.totalHeatLoss = survey.heatlossestimates.heatLossCalculations.exposedLocationAdjustmentKW.toFixed(2) ? survey.heatlossestimates.heatLossCalculations.exposedLocationAdjustmentKW.toFixed(2) : 0
      }else{
        $scope.totalHeatLoss = survey.heatlossestimates.heatLossCalculations.totalHealLossKW.toFixed(2) ? survey.heatlossestimates.heatLossCalculations.totalHealLossKW.toFixed(2) : 0
      }

      // $scope.totalHeatLoss = survey.heatlossestimates.heatLossCalculations.totalHealLossKW
      $scope.totalDemand = survey.heatlossestimates.heatLossCalculations.totalDHWAndHeatingEnergyKWh
      $scope.AvgW = survey.heatlossestimates.heatLossCalculations.totalPropertyAverageWm2
     if(!$scope.totalHeatLoss2){
         $scope.buttonShow = false
     }else{
        $scope.buttonShow = true
     }
$scope.searchVal=""
$scope.detail1=true

  };

  //survey 2

  $scope.selectedSurvey2 = function(survey) {

    $scope.selectedSurveyData2 = survey
    $scope.visibleList2 = false


    if(survey.heatlossestimates.dwellingExpostedLocation ==="Yes"){
      $scope.totalHeatLoss2 = survey.heatlossestimates.heatLossCalculations.exposedLocationAdjustmentKW.toFixed(2) ? survey.heatlossestimates.heatLossCalculations.exposedLocationAdjustmentKW.toFixed(2) : 0
    }else{
      $scope.totalHeatLoss2 = survey.heatlossestimates.heatLossCalculations.totalHealLossKW.toFixed(2) ? survey.heatlossestimates.heatLossCalculations.totalHealLossKW.toFixed(2) : 0
    }
      // $scope.totalHeatLoss2 = survey.heatlossestimates.heatLossCalculations.totalHealLossKW
      $scope.totalDemand2 = survey.heatlossestimates.heatLossCalculations.totalDHWAndHeatingEnergyKWh
      $scope.AvgW2 = survey.heatlossestimates.heatLossCalculations.totalPropertyAverageWm2
      if(!$scope.totalHeatLoss){
        $scope.buttonShow = false
    }else{
       $scope.buttonShow = true
    }
    $scope.searchVal1 = ""
    $scope.detail2 = true

};



    $scope.filterComplete = function() {
        // console.log($scope.searchVal.toLowerCase)
        let newChar
        if ($scope.searchVal === " ") {
          newChar = " "
        } else if ($scope.searchVal === $scope.searchVal.toUpperCase()) {
          newChar = $scope.searchVal.toLowerCase()
        } else {
          newChar = $scope.searchVal.toLowerCase()
        }
        if($scope.searchVal == ""){
          $scope.visibleList1 = false
        }else{
          $scope.visibleList1 = true
        }
      // $scope.visibleList1 = true
           $scope.estimation = $scope.myHeatLossEstiResults.filter(function (obj) {
            let estimationResult
            if (obj.heatlossestimates.projectRef === " ") {
              estimationResult = " "
            } else if (obj.heatlossestimates.projectRef === obj.heatlossestimates.projectRef.toUpperCase()) {
              estimationResult = obj.heatlossestimates.projectRef.toLowerCase()
            } else {
              estimationResult = obj.heatlossestimates.projectRef.toLowerCase()
            }

            if(estimationResult.includes(newChar)){
                 return obj
            }

      })
      if($scope.searchVal == ''){
        $scope.estimation = $scope.myHeatLossEstiResults
      }
     }

    $scope.filterComplete1 = function() {
        // $scope.visibleList2 = true
        if($scope.searchVal1 == ""){
          $scope.visibleList2 = false
        }else{
          $scope.visibleList2 = true
        }
        let newChar2
        if ($scope.searchVal1 === " ") {
          newChar2 = " "
        } else if ($scope.searchVal1 === $scope.searchVal1.toUpperCase()) {
          newChar2 = $scope.searchVal1.toLowerCase()
        } else {
          newChar2 = $scope.searchVal1.toLowerCase()
        }
        $scope.estimation1 = $scope.myHeatLossEstiResults.filter(function (obj) {
          let estimationResult1
          if (obj.heatlossestimates.projectRef === " ") {
            estimationResult1 = " "
          } else if (obj.heatlossestimates.projectRef === obj.heatlossestimates.projectRef.toUpperCase()) {
            estimationResult1 = obj.heatlossestimates.projectRef.toLowerCase()
          } else {
            estimationResult1 = obj.heatlossestimates.projectRef.toLowerCase()
          }
         if(estimationResult1.includes(newChar2)){
              return obj
         }

            })
                if($scope.searchVal1 == ''){
                    $scope.estimation1= $scope.myHeatLossEstiResults
                }
         }

    // compare
    $scope.compare = function(){
      $scope.chartVisible=true
      var totalHeatLossData=[
      {
        "TotalHeatLoss": $scope.totalHeatLoss,
        "CustomerName" : $scope.selectedSurveyData1.heatlossestimates.projectRef
      },{
        "TotalHeatLoss": $scope.totalHeatLoss2,
        "CustomerName" : $scope.selectedSurveyData2.heatlossestimates.projectRef
      },
    ]
    var totalDemand=[
      {
        "totalDemand": $scope.totalDemand,
        "CustomerName" : $scope.selectedSurveyData1.heatlossestimates.projectRef
      },{
        "totalDemand": $scope.totalDemand2,
        "CustomerName" : $scope.selectedSurveyData2.heatlossestimates.projectRef
      },
    ]

    var AvgWatt=[
      {
        "avgW": $scope.AvgW,
        "CustomerName" : $scope.selectedSurveyData1.heatlossestimates.projectRef
      },{
        "avgW": $scope.AvgW2,
        "CustomerName" : $scope.selectedSurveyData2.heatlossestimates.projectRef
      },
    ]
    $scope.amchart(totalHeatLossData,"EstimatorsDiv","CustomerName","TotalHeatLoss","Total Heat Loss")
    $scope.amchart(totalDemand,"DemandDiv","CustomerName","totalDemand","Total Demand")
    $scope.amchart(AvgWatt,"AvgWattDiv","CustomerName","avgW","Average Watt per meter square")

    }
    $scope.amchart = function(data,chartName,xAxis,yAxis,lable){
      am4core.ready(function() {

        // Themes begin
        am4core.addLicense("CH292648124");
        am4core.useTheme(am4themes_kelly);
        am4core.useTheme(am4themes_animated);
        // Themes end

        // Create chart instance
        var chart = am4core.create(chartName, am4charts.XYChart3D);

        // Add data
        chart.data = data;

        // Create axes
        let categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());
        categoryAxis.dataFields.category = xAxis;
        categoryAxis.renderer.labels.template.rotation = 0;
        categoryAxis.renderer.labels.template.hideOversized = false;
        categoryAxis.renderer.minGridDistance = 20;
        categoryAxis.renderer.labels.template.horizontalCenter = "right";
        categoryAxis.renderer.labels.template.verticalCenter = "middle";
        categoryAxis.tooltip.label.rotation = 0;
        categoryAxis.tooltip.label.horizontalCenter = "right";
        categoryAxis.tooltip.label.verticalCenter = "middle";


        let valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
        valueAxis.title.text = lable;
        valueAxis.title.fontWeight = "bold";
        valueAxis.min = 0;
        // Create series
        var series = chart.series.push(new am4charts.ColumnSeries3D());
        series.dataFields.valueY = yAxis;
        series.dataFields.categoryX = xAxis;
        series.name = yAxis;
        series.tooltipText = "{categoryX}: [bold]{valueY}[/]";
        series.columns.template.fillOpacity = .8;

        var columnTemplate = series.columns.template;
        columnTemplate.strokeWidth = 2;
        columnTemplate.strokeOpacity = 1;
        columnTemplate.stroke = am4core.color("#FFFFFF");

        columnTemplate.adapter.add("fill", function(fill, target) {
          return chart.colors.getIndex(target.dataItem.index);
        })

        columnTemplate.adapter.add("stroke", function(stroke, target) {
          return chart.colors.getIndex(target.dataItem.index);
        })

        chart.cursor = new am4charts.XYCursor();
        chart.cursor.lineX.strokeOpacity = 0;
        chart.cursor.lineY.strokeOpacity = 0;

        });


    }

  }


  angular
    .module('cloudheatengineer')
    .controller('CompareEstimatorsController', ['$rootScope', '$routeParams', '$scope', '$location', 'surveyService', 'userService', 'apiService', 'commonService', 'alertService','heatLossEstimatorService','$window', CompareEstimatorsController]);

}());
