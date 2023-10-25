(function () {
    'use strict';

    var app = angular.module('cloudheatengineer');

    app.filter('survey', function () {
        return function (survey, isInstalledTypeRequired) {

            if(typeof survey == 'undefined')
                return;

            var proposedInstallType = ' (' + survey.surveys.proposed_install_type + ')'
                , projectName = survey.surveys.project_name
                , dateTime
                , suffix = !isInstalledTypeRequired ? ' survey' : proposedInstallType
                , split;


            split = survey.date_sent.split('T');
            dateTime = split[0];
            split = split[1].split('.');
            dateTime = ' ' + dateTime + ' ' + split[0];

            return projectName + dateTime + suffix;
        }
    });

    app.filter('groupBy', function() {
//       return _.memoize(function(items, field) {
//         return _.groupBy(items, field);
//     }
// );
        return function(data, key) {
          if (!(data && key)) return
          var result = {}
          for (var i = 0; i < data.length; i++) {
            if (!result[data[i][key]]) result[data[i][key]] = []
            result[data[i][key]].push(data[i])
          }
          return result
        }
      })
})();
