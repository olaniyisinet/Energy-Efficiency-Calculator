(function () {
    'use strict';

    angular
        .module('cloudheatengineer')
        .factory('calculationHelperService', calculationHelperService);

    calculationHelperService.$inject = [];
    function calculationHelperService () {
        return {
            dataParseFloat: function (value, decimals) {
                return parseFloat((value).toFixed(decimals));
            },
            ifUndefinedDefaultString: function (item) {
                return item ? item : '';
            }
        }
    }
}());