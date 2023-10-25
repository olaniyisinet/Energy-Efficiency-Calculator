(function () {
  'use strict';


  angular
    .module('cloudheatengineer')
    .controller('ComparesController', ComparesController);

  ComparesController.$inject = ['$rootScope', '$scope', 'surveyService', '$window'];

  function ComparesController($rootScope, $scope, surveyService, $window) {
    // alertService('success', 'Request submitted', 'You requested RDC to finish the report.');
    $window.document.title = 'Heat Engineer Compares';
    $scope.chartList = []
    $scope.heatPump = []
    $scope.heatPump2 = []
    $scope.chartListBar = []
    $scope.selectedSurveyData1={}
    $scope.selectedSurveyData2={}
    $scope.updatedBar1=[]
    $scope.updatedBar2=[]
    $scope.chartVisible = false
    $scope.barVisible = false
    $scope.pdfBtn = false
    $scope.noSameRooms = false
    $scope.chartType = "pie"
    // $scope.height = 50
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

    let query = {
        limit: 20,
        page: 1,
        email: $rootScope.user.email,
        search: '',
        surveyStatus: 'COMPLETED'
    }

    // Surveyer 1
    $scope.selectedSurvey1 = function(survey) {

      $scope.selectedSurveyData1 = survey
      $scope.visibleList1 = false
      $scope.heatPump2 = $scope.selectedSurveyData1.surveys.fuel_compare.heating_type
      $scope.selectedType2 = $scope.heatPump2.filter(function(data){
          var type2
        if(data.name == "Air Source Heat Pump"){
            type2 = "ASHP"
        }else if(data.name == 'Ground Source Heat Pump'){
            type2 = "GSHP"
        }else{
            type2 = data.name
        }
        return type2 == $scope.selectedSurveyData1.surveys.proposed_install_type
      })
      $scope.rooms1 = survey.surveys.rooms.map(function(data){
        if(data.heat_loss.watts_per_meter_squared=="MAX"){
            var chartData = {
                "room":data.room_name,
                "wpm2":0,
                "totalWatts":data.heat_loss.total_watts,
                "totalKWH":data.kilowatt_hours.total_kilowatt_hour
            }
        }else if(data.heat_loss.watts_per_meter_squared=="MIN"){
            var chartData = {
                "room":data.room_name,
                "wpm2":0,
                "totalWatts":data.heat_loss.total_watts,
                "totalKWH":data.kilowatt_hours.total_kilowatt_hour
            }
        }
        else{
            var chartData = {
                "room":data.room_name,
                "wpm2":data.heat_loss.linked_watts_per_meter_squared ? data.heat_loss.linked_watts_per_meter_squared : data.heat_loss.watts_per_meter_squared,
                "totalWatts":data.heat_loss.total_watts,
                "totalKWH":data.kilowatt_hours.total_kilowatt_hour
            }
        }

        return chartData
      })
      if(!$scope.rooms2){
        $scope.buttonShow = false
    }else{
       $scope.buttonShow = true
    }

  };

  //survey 2

  $scope.selectedSurvey2 = function(survey) {
    // $scope.submit()
    $scope.selectedSurveyData2 = survey
    $scope.visibleList2 = false
    $scope.heatPump = $scope.selectedSurveyData2.surveys.fuel_compare.heating_type
     $scope.selectedType = $scope.heatPump.filter(function(data){
         var type
       if(data.name == "Air Source Heat Pump"){
           type = "ASHP"
       }else if(data.name == 'Ground Source Heat Pump'){
           type = "GSHP"
       }else{
           type = data.name
       }
       return type == $scope.selectedSurveyData2.surveys.proposed_install_type
     })
    $scope.rooms2 = survey.surveys.rooms.map(function(data){
        if(data.heat_loss.watts_per_meter_squared=="MAX"){
            var chartData = {
                "room":data.room_name,
                "wpm2":0,
                "totalWatts":data.heat_loss.total_watts,
                "totalKWH":data.kilowatt_hours.total_kilowatt_hour,

            }
        }else if(data.heat_loss.watts_per_meter_squared=="MIN"){
            var chartData = {
                "room":data.room_name,
                "wpm2":0,
                "totalWatts":data.heat_loss.total_watts,
                "totalKWH":data.kilowatt_hours.total_kilowatt_hour,


            }
        }
        else{
            var chartData = {
                "room":data.room_name,
                "wpm2":data.heat_loss.linked_watts_per_meter_squared ? data.heat_loss.linked_watts_per_meter_squared : data.heat_loss.watts_per_meter_squared,
                "totalWatts":data.heat_loss.total_watts,
                "totalKWH":data.kilowatt_hours.total_kilowatt_hour,

            }
        }

        return chartData
      })
      if(!$scope.rooms1 ){
        $scope.buttonShow = false
    }else{
       $scope.buttonShow = true
    }

};


    surveyService.getAll(query).then(function(res) {
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
    $scope.newPage = function(page) {
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
        surveyService.getAll(query).then(function(res) {
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
    $scope.nextPage = function() {
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
        surveyService.getAll(query).then(function(res) {
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
    $scope.previousPage = function() {
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
        surveyService.getAll(query).then(function(res) {
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
    $scope.filterComplete = function() {
    //   $scope.visibleList1 = true
    if($scope.searchVal == ""){
        $scope.visibleList1 = false
      }else{
        $scope.visibleList1 = true
      }
        surveyService.getAll({
            limit: 20,
            page: 1,
            email: $rootScope.user.email,
            search: $scope.searchVal,
            surveyStatus: 'COMPLETED'
        }).then(function(res) {
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
// survey 2



    surveyService.getAll(query).then(function(res) {
        $scope.searchVal1 = ''
        if (res['count'] != 0) {
            let surveyData = Object.keys(res['surveys']).map(i => {
                return res['surveys'][i]
            })
            $scope.surveys1 = surveyData;
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
            $scope.surveys1 = null;
        $scope.currentPaginationPage = 1
    });
    $scope.newPage2 = function(page) {
        let searchValue1 = $scope.searchVal1
        let query = {}
        if (searchValue1) {
            query = {
                limit: 20,
                page: page,
                email: $rootScope.user.email,
                search: $scope.searchVal1,
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
        surveyService.getAll(query).then(function(res) {
            if (res['count'] != 0) {
                let surveyData = Object.keys(res['surveys']).map(i => {
                    return res['surveys'][i]
                })
                $scope.surveys1 = surveyData;
            } else
                $scope.survey = null
            $scope.currentPaginationPage = page
        })
    }
    $scope.nextPage2 = function() {
        let page = parseInt($scope.currentPaginationPage) + 1
        let searchValue1 = $scope.searchVal1
        let query = {}
        if (searchValue1) {
            query = {
                limit: 20,
                page: page,
                email: $rootScope.user.email,
                search: $scope.searchVal1,
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
        surveyService.getAll(query).then(function(res) {
            if (res['count'] != 0) {
                let surveyData = Object.keys(res['surveys']).map(i => {
                    return res['surveys'][i]
                })
                $scope.surveys1 = surveyData;
            } else
                $scope.survey = null
            $scope.currentPaginationPage = page
        })
    }
    $scope.previousPage2 = function() {
        let page = parseInt($scope.currentPaginationPage) - 1
        let searchValue1 = $scope.searchVal1
        let query = {}
        if (searchValue1) {
            query = {
                limit: 20,
                page: page,
                email: $rootScope.user.email,
                search: $scope.searchVal1,
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
        surveyService.getAll(query).then(function(res) {
            if (res['count'] != 0) {
                let surveyData = Object.keys(res['surveys']).map(i => {
                    return res['surveys'][i]
                })
                $scope.surveys1 = surveyData;
            } else
                $scope.survey = null
            $scope.currentPaginationPage = page
        })
    }
    $scope.filterComplete1 = function() {
        if($scope.searchVal1 == ""){
          $scope.visibleList2 = false
        }else{
          $scope.visibleList2 = true
        }
        surveyService.getAll({
            limit: 20,
            page: 1,
            email: $rootScope.user.email,
            search: $scope.searchVal1,
            surveyStatus: 'COMPLETED'
        }).then(function(res) {
            if (res['count'] != 0) {
                let surveyData = Object.keys(res['surveys']).map(i => {
                    return res['surveys'][i]
                })
                $scope.surveys1 = surveyData;
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
                $scope.surveys1 = null;
            $scope.currentPaginationPage = 1

        })
     }

     $scope.submit = function(){
                $scope.chartList = []
                $scope.chartListBar = []
                $scope.pdfBtn = true
            if($scope.chartType == "pie"){
                $scope.chartVisible = true
                $scope.barVisible = false

                setTimeout(() => {
                    $scope.compare($scope.rooms1,"room","wpm2","wattPerMeter","wpm2")
                    $scope.compare($scope.rooms1,"room","totalWatts","totalWatts","totalWatts")
                    $scope.compare($scope.rooms1,"room","totalKWH","totalKWH","totalKWH")
                    $scope.compare($scope.rooms2,"room","wpm2","wattPerMeter2","wpm2")
                    $scope.compare($scope.rooms2,"room","totalWatts","totalWatts2","totalWatts")
                    $scope.compare($scope.rooms2,"room","totalKWH","totalKWH2","totalKWH")
                }, 1000);
            }else{

                var bar1 = $scope.rooms1.map(function (data){
                    var result1
                    for(let i=0 ; i<$scope.rooms2.length; i++){
                        if( $scope.rooms2[i].room === data.room){
                        result1=data
                        }
                    }
                return result1
                })
                var bar2 = $scope.rooms2.map(function (data){
                    var result2
                    for(let i=0 ; i<$scope.rooms1.length; i++){
                        if( $scope.rooms1[i].room === data.room){
                        result2=data
                        }
                    }
                return result2
                })

            var newBar1
            var newBar2
            let field='room';
            newBar1 = bar1.filter(function(val){ return val!==undefined; });
            newBar2 = bar2.filter(function(val){ return val!==undefined; });
            $scope.updatedBar1 = newBar1.sort((a, b) => (a[field] || "").toString().localeCompare((b[field] || "").toString()));
            $scope.updatedBar2 = newBar2.sort((a, b) => (a[field] || "").toString().localeCompare((b[field] || "").toString()))

            $scope.chartStyle($scope.rooms1.length,$scope.rooms2.length,$scope.updatedBar1.length,$scope.updatedBar2.length)



                        // $scope.chartStyle()
                        if($scope.updatedBar1.length == 0){
                            $scope.noSameRooms = true
                            $scope.compareBar($scope.rooms1,"room","barChart1","w")
                            $scope.compareBar($scope.rooms1,"room","barChart1meter","wm")
                            $scope.compareBar($scope.rooms2,"room","barChart2","w")
                            $scope.compareBar($scope.rooms2,"room","barChart2meter","wm")
                        }else{
                            $scope.noSameRooms = false
                            setTimeout(() => {

                            $scope.compareBar($scope.updatedBar1,"room","barChart1","w")
                            $scope.compareBar($scope.updatedBar1,"room","barChart1meter","wm")
                            $scope.compareBar($scope.updatedBar2,"room","barChart2","w")
                            $scope.compareBar($scope.updatedBar2,"room","barChart2meter","wm")
                            }, 2000);
                        }




        }


      }
     $scope.chartStyle = function(room1,room2,updatedBar1,updatedBar2){
         if($scope.updatedBar1.length == 0){
            $scope.height1 = (room1*40)+100
            $scope.height2 = (room2*40)+100

        }else{
            $scope.height1 = (updatedBar1*40)+100
            $scope.height2 = (updatedBar2*40)+100

        }

        $scope.chartVisible = false
        $scope.barVisible = true

     }

     $scope.compare = function(data,category,value,chartName,unit){

        am4core.ready(function() {

            // Themes begin
            am4core.addLicense("CH292648124");
            am4core.useTheme(am4themes_spiritedaway);
            am4core.useTheme(am4themes_animated);


            // Themes end
            var chart = am4core.create(chartName, am4charts.PieChart3D);

            chart.exportedImage = true
            // $scope.savePDF(chart)

            chart.hiddenState.properties.opacity = 0; // this creates initial fade-in

            chart.data = data;
            var series = chart.series.push(new am4charts.PieSeries3D());
            series.dataFields.value = value;
            series.dataFields.category = category;
            if(unit == "wpm2"){
                series.labels.template.text = "{category} ({value} W/m2)";
            }
            if(unit == "totalWatts"){
                series.labels.template.text = "{category} ({value} Watts)";
            }
            if(unit == "totalKWH"){
                series.labels.template.text = "{category} ({value} kWh)";
            }


            var valueLabel = series.bullets.push(new am4charts.LabelBullet());
            $scope.chartList.push(series)
            });
     }
     function dateFormat(date){
        var newDate = new Date(date)
        var dateStr =
        newDate.getFullYear() +"-" +
        ("00" + (newDate.getMonth() + 1)).slice(-2) + "-" +
        ("00" + newDate.getDate()).slice(-2) +
        " " +
        ("00" + newDate.getHours()).slice(-2) + ":" +
        ("00" + newDate.getMinutes()).slice(-2) + ":" +
        ("00" + newDate.getSeconds()).slice(-2);

        return dateStr
     }
     $scope.savePDF = function(){
        if($scope.chartType == "pie"){
           $scope.pdfPie()
        }else{
           $scope.pdfBar()
        }

     }
     $scope.pdfBar = function(){
        var surveyDate1 =  dateFormat ($scope.selectedSurveyData1.date_sent);
        var surveyDate2 =  dateFormat ($scope.selectedSurveyData2.date_sent);

        Promise.all([
            $scope.chartListBar[0].exporting.pdfmake,
            $scope.chartListBar[0].exporting.getImage("png"),
            $scope.chartListBar[1].exporting.getImage("png"),
            $scope.chartListBar[2].exporting.getImage("png"),
            $scope.chartListBar[3].exporting.getImage("png"),
            $scope.chartListBar[4].exporting.getImage("png"),
            $scope.chartListBar[5].exporting.getImage("png"),


        ]).then(function(res) {

            var pdfMake = res[0];
            // Create document template
            var doc = {
                pageSize: "A4",
                pageOrientation: "portrait",
                pageMargins: [20, 20, 20, 10],
                content: []
            };

            let whiteLabeled = false;
            if ($rootScope.user.selectedPlan.plan == 'manufacturerYearly' || $rootScope.user.selectedPlan.plan.includes('WhiteLabeled')) {
                whiteLabeled = true;
            }
            if(whiteLabeled){
                doc.content.push({
                    columns: [{
                        width: '*',
                        stack: [
                            { image: gDataURI, width: 150 },
                            { text: $rootScope.user.company_name, style: 'smallGray' }
                        ]
                    },
                    {
                        width: '*',
                        text: ''
                    }
                    ],
                });
            } else {
                doc.content.push({
                    columns: [{
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
                });
            }
              doc.content.push({

                  columns: [{
                   text:"Report 1",
                   fontSize: 16,
                   margin: [0, 20, 0, 0]
                  }, {

                    text:"Report 2",
                    fontSize: 16,
                    margin: [0,20, 0, 0]
                  }],
                  columnGap: 30
                });
                doc.content.push({

                    columns: [{
                     text:$scope.selectedSurveyData1.surveys.project_name+" "+ surveyDate1+" "+" ("+$scope.selectedSurveyData1.surveys.proposed_install_type+")",
                     fontSize: 8,
                     margin: [0, 10, 0, 15]
                    }, {

                        text:$scope.selectedSurveyData2.surveys.project_name+" "+ surveyDate2+" "+" ("+$scope.selectedSurveyData2.surveys.proposed_install_type+")",
                        fontSize: 8,
                        margin: [0, 10, 0, 15]
                    }],
                    columnGap: 30
                  });
                  if($scope.updatedBar1.length == 0){
                      doc.content.push({
                        text: "No Rooms are same",
                        fontSize: 20,
                        bold: true,
                        alignment: 'center',
                        margin: [0, 20, 0, 15]
                      })
                }else{
                    doc.content.push({

                        columns: [{
                         text:"W/m2",
                         color:"#f56e00",
                         margin: [0, 0, 0, 5]
                        }, {

                          text:"W/m2",
                          color:"#f56e00",
                          margin: [0,0, 0, 5]
                        }],
                        columnGap: 30
                      });
                      doc.content.push({

                          columns: [{

                            image: res[3],
                            width: 250
                          }, {
                            image: res[6],
                            width: 250
                          }],
                          columnGap: 30
                        });

                      doc.content.push({
                          pageBreak: 'before',
                          columns: [{
                           text:"Total Watts And kWh",
                           color:"#f56e00",
                           margin: [0,30, 0, 15]
                          }, {

                            text:"Total Watts And kWh",
                            color:"#f56e00",
                            margin: [0,30, 0, 15]
                          }],
                          columnGap: 30
                        });
                        doc.content.push({

                          columns: [{

                            image: res[1],
                            width: 250
                          }, {

                            image: res[4],
                            width: 250
                          }],
                          columnGap: 30
                        });
                }




            pdfMake.createPdf(doc).download("report.pdf");

        });

     }
     $scope.pdfPie = function(){
        var surveyDate1 =  dateFormat ($scope.selectedSurveyData1.date_sent);
        var surveyDate2 =  dateFormat ($scope.selectedSurveyData2.date_sent);

        Promise.all([
            $scope.chartList[0].exporting.pdfmake,
            $scope.chartList[0].exporting.getImage("png"),
            $scope.chartList[1].exporting.getImage("png"),
            $scope.chartList[2].exporting.getImage("png"),
            $scope.chartList[3].exporting.getImage("png"),
            $scope.chartList[4].exporting.getImage("png"),
            $scope.chartList[5].exporting.getImage("png"),

        ]).then(function(res) {

            var pdfMake = res[0];
            // Create document template
            var doc = {
                pageSize: "A4",
                pageOrientation: "portrait",
                pageMargins: [30, 30, 30, 30],
                content: []
            };
            let whiteLabeled = false;
            if ($rootScope.user.selectedPlan.plan == 'manufacturerYearly' || $rootScope.user.selectedPlan.plan.includes('WhiteLabeled')) {
                whiteLabeled = true;
            }
            if(whiteLabeled) {
                doc.content.push({
                    columns: [{
                        width: '*',
                        stack: [
                            { image: gDataURI, width: 150 },
                            { text: $rootScope.user.company_name, style: 'smallGray' }
                        ]
                    },
                    {
                        width: '*',
                        text: ''
                    }
                    ],
                  });
            } else {
                doc.content.push({
                    columns: [{
                        width: '*',
                        stack: [
                            { image: 'data:image/png;base64,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', width: 150 },
                            { text: 'Heat Engineer Software Ltd'+whiteLabeled, style: 'smallGray' }
                        ]
                    },
                    {
                        width: '*',
                        text: ''
                    }
                    ],
                  });
            }

              doc.content.push({

                  columns: [{
                   text:"Report 1",
                   fontSize: 16,
                   margin: [0, 30, 0, 0]
                  }, {

                    text:"Report 2",
                    fontSize: 16,
                    margin: [0,30, 0, 0]
                  }],
                  columnGap: 30
                });
                doc.content.push({

                    columns: [{
                     text:$scope.selectedSurveyData1.surveys.project_name+" "+ surveyDate1+" "+" ("+$scope.selectedSurveyData1.surveys.proposed_install_type+")",
                     fontSize: 8,
                     margin: [0, 10, 0, 15]
                    }, {

                        text:$scope.selectedSurveyData2.surveys.project_name+" "+ surveyDate2+" "+" ("+$scope.selectedSurveyData2.surveys.proposed_install_type+")",
                        fontSize: 8,
                        margin: [0, 10, 0, 15]
                    }],
                    columnGap: 30
                  });

              doc.content.push({

                  columns: [{
                   text:"W/m2",
                   color:"#f56e00",
                   margin: [0, 30, 0, 15]
                  }, {

                    text:"W/m2",
                    color:"#f56e00",
                    margin: [0,30, 0, 15]
                  }],
                  columnGap: 30
                });
              doc.content.push({

                  columns: [{

                    image: res[1],
                    width: 250
                  }, {

                    image: res[4],
                    width: 250
                  }],
                  columnGap: 30
                });

                doc.content.push({

                    columns: [{

                     text:"Total Watts",
                     color:"#f56e00",
                     margin: [0,30, 0, 15]
                    }, {

                      text:"Total Watts",
                      color:"#f56e00",
                      margin: [0,30, 0, 15]
                    }],
                    columnGap: 30
                  });

              doc.content.push({
                columns: [{

                  image: res[2],
                  width: 250
                }, {
                  image: res[5],
                  width: 250
                }],
                columnGap: 30
              });
              doc.content.push({

                columns: [{
                 text:"Total kWh",
                 color:"#f56e00",
                 margin: [0,30, 0, 15]
                }, {

                  text:"Total kWh",
                  color:"#f56e00",
                  margin: [0,30, 0, 15]
                }],
                columnGap: 30
              });

              doc.content.push({
                columns: [{

                  image: res[3],
                  width: 250
                }, {
                  image: res[6],
                  width: 250
                }],
                columnGap: 30
              });
            pdfMake.createPdf(doc).download("report.pdf");

        });
     }

     $scope.compareBar = function(data,category,chartName,type){
        am4core.ready(function() {

        // Themes begin
        am4core.addLicense("CH292648124");
        am4core.useTheme(am4themes_kelly);
        am4core.useTheme(am4themes_animated);
        // Themes end

        // Create chart instance
        var chart = am4core.create(chartName, am4charts.XYChart);
        $scope.chart = chart
        // Add data
        chart.data = data;

        // Modify chart's colors
        chart.colors.list = [
            am4core.color("#f3c300"),
            am4core.color("#875692"),
        ];

        // Create axes
        var categoryAxis = chart.yAxes.push(new am4charts.CategoryAxis());
        categoryAxis.dataFields.category = category;
        categoryAxis.numberFormatter.numberFormat = "#.##";
        categoryAxis.renderer.inversed = true;
        categoryAxis.renderer.grid.template.location = 0;
        categoryAxis.renderer.cellStartLocation = 0.2;
        categoryAxis.renderer.cellEndLocation = 0.8;

        var  valueAxis = chart.xAxes.push(new am4charts.ValueAxis());
        valueAxis.renderer.opposite = true;

        // Create series
        function createSeries(field, name) {
        var series = chart.series.push(new am4charts.ColumnSeries());
        series.dataFields.valueX = field;
        series.dataFields.categoryY = category;
        series.name = name;
        series.columns.template.tooltipText = "{name}: [bold]{valueX}[/]";
        series.columns.template.height = am4core.percent(100);
        series.columns.template.width = 20
        series.sequencedInterpolation = true;

        var valueLabel = series.bullets.push(new am4charts.LabelBullet());
        valueLabel.label.text = "{valueX}"
        valueLabel.label.horizontalCenter = "left";
        valueLabel.label.dx = 10;
        valueLabel.label.hideOversized = false;
        valueLabel.label.truncate = false;

        var categoryLabel = series.bullets.push(new am4charts.LabelBullet());
        categoryLabel.label.text = "{name}";
        categoryLabel.label.horizontalCenter = "right";
        categoryLabel.label.dx = -10;
        categoryLabel.label.fill = am4core.color("#fff");
        categoryLabel.label.hideOversized = false;
        categoryLabel.label.truncate = false;
        $scope.chartListBar.push(series)

        }
        if(type == "wm"){
            createSeries("wpm2", "W/m2");
        }else{

            createSeries("totalWatts", "Watts");
            createSeries("totalKWH", "kWh");
        }

        }); // end am4core.ready()
    }

  }

}());
