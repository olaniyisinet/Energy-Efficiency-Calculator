(function() {
    'use strict';

    /**
     * angular module
     * @type factory
     * @service modalService
     * @desc use to show modal to edit and allow user to type in items and select options.
     */
    angular.module('cloudheatengineer').factory('modalService', modalService);

    modalService.$inject = ['$modal', '$rootScope', '$q', '_', 'surveyService'];

    function modalService($modal, $rootScope, $q, _, surveyService) {
        var service = {};
        var templateUrl, controller;

        var getTemplateUrl = function() {
            return templateUrl;
        };

        var getController = function() {
            return controller;
        };

        /**
         * @method setters
         * @desc setting both template url and controller
         */
        service.setTemplateUrl = function(template) {
            templateUrl = template;
        };

        service.setController = function(ctrl) {
            controller = ctrl;
        };

        /**
         * @method showModal
         * @desc method that opens modal whenever user clicks the table.
         */
        service.showModal = function(scope, item, idx, property, typ, customMaterial) {

            var items = {};
            var deferred = $q.defer();
            var units = {
                'flow_temperature': {title: "Flow Temperature" , unit: '℃'},
                'deltat': {title: "Delta T", unit: '℃'},
                'delta': {title: "Delta T", unit: '℃'},
                'pipe_nom_dia': {title: "Pipe Selected", unit: "mm"},
                'pipeSelect': {title: "Pipe Selected", unit: "mm"},
                'flowReturnPipes': {title: "Pipe Run Flow and Return", unit: "m"},
                'lengthFlow': {title: "Pipe Run Flow and Return", unit: "m"},
                'fittings': {title: "Fittings", unit: "%"}
            }

            var title = title === 'select' ? 'Select an option below.' : 'Modify the input below.';
            var split = item.split('.');
            var subTitle = split[0];
            if(split.length == 2){
                subTitle = split[1];
            }
            var type = !!typ ? typ : 'select';
            var item_property = property != '' && !!property ? property : 'asked';
            var default_value;
            var modal_result = {};
            var collections = {
                emitter_type: [
                    'Underfloor Heating',
                    'Standard Radiators',
                    'Fan Coil Unit',
                    'Fan Convector / Rad'
                ],
                room_names: [
                    "None",
                    "Suspended FL",
                    "Lounge",
                    "Living Room",
                    "Sitting Room",
                    "Dining Room",
                    "Snug",
                    "Kitchen",
                    "Entrance Hall",
                    "Hall",
                    "Study",
                    "Office",
                    "Gallery",
                    "Games",
                    "Basement",
                    "Utility Room",
                    "Store Room",
                    "Landing",
                    "Master Bedroom",
                    "Bedroom 1",
                    "Bedroom 2",
                    "Bedroom 3",
                    "Bedroom 4",
                    "Bedroom 5",
                    "Bedroom 6",
                    "Bedroom 7",
                    "Bedroom 8",
                    "Bedroom 9",
                    "Bathroom 1",
                    "Bathroom 2",
                    "Toilet 1",
                    "Toilet 2",
                    "Extension",
                    "Garage",
                    "Drawing Room",
                    "Breakfast Room",
                    "Family Room",
                    "Hall 1",
                    "Hall 2",
                    "Hall 3",
                    "Master En Suite",
                    "En Suite",
                    "En Suite 2",
                    "En Suite 3",
                    "En Suite 4",
                    "En Suite 5",
                    "Shower Room",
                    "Landing 1",
                    "Landing 2",
                    "Landing 3",
                    "Garden Room",
                    "Conservatory",
                    "Link",
                    "Other",
                    "Lobby",
                    "Plant room",
                    "Boot",
                    "Dressing Room",
                    "Bedsitting Room",
                    "Porch",
                    "Room at 18C",
                    "Room at 21C",
                    "Room at 22C",
                    "Neighbouring Property"
                ],
                asked: [
                    "YES",
                    "NO"
                ],
                vaulted_room_type: [
                    'Type 1',
                    'Type 2',
                    'Type 3',
                    'Type 4',
                    'Type 5',
                    'Type 6',
                    'Type 7',
                    'Type 8'
                ],
                walls: [
                    'None',
                    'External wall',
                    'Internal wall',
                    'Party wall',
                    'Roof'
                ],
                none: [''],
                indexes: [
                    'Yes',
                    'No'
                ],
                flow_temperature: [
                    35,
                    40,
                    45,
                    50,
                    55,
                    60,
                    65,
                    70,
                    75,
                    80
                ],
                pipe_select_copper: [
                    8,
                    10,
                    12,
                    15,
                    22,
                    28,
                    35,
                    42,
                    54,
                    67,
                    76,
                    108,
                    133,
                    159
                ],
                pipe_select_gradesteel: [
                    10,
                    15,
                    20,
                    25,
                    32,
                    40,
                    50,
                    65,
                    80,
                    100,
                    125,
                    150

                ],
                pipe_select_mlcp: [
                    12,
                    16,
                    20,
                    25,
                    32,
                    40,
                    50,
                    63,
                    75,
                    90,
                    110
                ],
                flow_length: [
                    1,
                    2,
                    3,
                    4,
                    5,
                    6,
                    7,
                    8,
                    9,
                    10
                ],
                floor_type: [
                    'Screed',
                    'Aluminum Plates',
                    'N/A'
                ],
                floor_surface: [
                    'with tiles',
                    'with wood',
                    'with carpet',
                    'N/A'
                ],
                radiators: [
                    { "type": "Custom", "heights": [300, 450, 600, 700, 750], "watts": [37, 0, 53, 0, 69, 72, 83], "section_length": "N/A" },
                    { "type": "P1", "heights": [300, 450, 600, 700, 750], "watts": [37, 0, 53, 0, 69, 72, 83], "section_length": "N/A" },
                    { "type": "K1", "heights": [300, 400, 450, 500, 600, 700, 750], "watts": [51, 71, 74, 86, 96, 111, 117], "section_length": "N/A" },
                    { "type": "P+", "heights": [300, 400, 450, 500, 600, 700, 750], "watts": [78, 97, 113, 116, 145, 153, 176], "section_length": "N/A" },
                    { "type": "K2", "heights": [300, 400, 450, 500, 600, 700, 750], "watts": [94, 123, 136, 148, 176, 196, 214], "section_length": "N/A" },
                    { "type": "K3", "heights": [300, 500, 600, 700], "watts": [135, 0, 0, 205, 238, 271, 0], "section_length": "N/A" },
                    { "type": "Double panel no fins", "heights": [300, 440, 590, 740], "watts": [60, 83, 107, 131], "section_length": "N/A" },
                    { "type": "Beeston Cast Iron Radiator New Royal 2-Column Sectional 18\" High, 3.5\" deep", "heights": [406], "watts": [47], "section_length": 57 },
                    { "type": "Beeston Cast Iron Radiator New Royal 2-Column Sectional 24\" High, 3.5\" deep", "heights": [559], "watts": [62], "section_length": 57 },
                    { "type": "Beeston Cast Iron Radiator New Royal 2-Column Sectional 30\" High, 3.5\" deep", "heights": [771], "watts": [80], "section_length": 57 },
                    { "type": "Beeston Cast Iron Radiator New Royal 3-Column Sectional 18\" High, 5.5\" deep", "heights": [406], "watts": [69], "section_length": 57 },
                    { "type": "Beeston Cast Iron Radiator New Royal 3-Column Sectional 24\" High, 5.5\" deep", "heights": [559], "watts": [91], "section_length": 57 },
                    { "type": "Beeston Cast Iron Radiator New Royal 3-Column Sectional 30\" High, 5.5\" deep", "heights": [711], "watts": [112], "section_length": 57 },
                    { "type": "Beeston Cast Iron Radiator New Royal 3-Column Sectional 36\" High, 5.5\" deep", "heights": [864], "watts": [136], "section_length": 57 },
                    { "type": "Beeston Cast Iron Radiator New Royal 4-Column Sectional 18\" High, 7.5\" deep", "heights": [406], "watts": [83], "section_length": 57 },
                    { "type": "Beeston Cast Iron Radiator New Royal 4-Column Sectional 24\" High, 7.5\" deep", "heights": [559], "watts": [113], "section_length": 57 },
                    { "type": "Beeston Cast Iron Radiator New Royal 4-Column Sectional 30\" High, 7.5\" deep", "heights": [711], "watts": [138], "section_length": 57 },
                    { "type": "Beeston Cast Iron Radiator New Royal 4-Column Sectional 36\" High, 7.5\" deep", "heights": [864], "watts": [165], "section_length": 57 },
                    { "type": "Beeston Cast Iron Radiator New Royal 5-Column Sectional 13\" High, 9.5\" deep", "heights": [298], "watts": [80], "section_length": 57 },
                    { "type": "Beeston Cast Iron Radiator New Royal 5-Column Sectional 18\" High, 9.5\" deep", "heights": [419], "watts": [102], "section_length": 57 },
                    { "type": "Beeston Cast Iron Radiator New Royal 5-Column Sectional 24\" High, 9.5\" deep", "heights": [562], "watts": [133], "section_length": 57 },
                    { "type": "Beeston Cast Iron Radiator New Royal 5-Column Sectional 30\" High, 9.5\" deep", "heights": [714], "watts": [165], "section_length": 57 },
                    { "type": "Beeston Cast Iron Radiator New Royal 5-Column Sectional 36\" High, 9.5\" deep", "heights": [867], "watts": [198], "section_length": 57 },
                    { "type": "Beeston Cast Iron Radiator New Royal 7-Column Sectional 13.5\" High, 13.25\" deep", "heights": [343], "watts": [105], "section_length": 57 },
                    { "type": "Beeston Cast Iron Radiator Hospital Easy Clean 3.5\" Sectional 18\" High, 3.5\" deep", "heights": [406], "watts": [47], "section_length": 57 },
                    { "type": "Beeston Cast Iron Radiator Hospital Easy Clean 3.5\" Sectional 24\" High, 3.5\" deep", "heights": [559], "watts": [59], "section_length": 57 },
                    { "type": "Beeston Cast Iron Radiator Hospital Easy Clean 3.5\" Sectional 30\" High, 3.5\" deep", "heights": [711], "watts": [75], "section_length": 57 },
                    { "type": "Beeston Cast Iron Radiator Hospital Easy Clean 5\" Sectional 18\" High, 5\" deep", "heights": [394], "watts": [55], "section_length": 57 },
                    { "type": "Beeston Cast Iron Radiator Hospital Easy Clean 5\" Sectional 24\" High, 5\" deep", "heights": [546], "watts": [70], "section_length": 57 },
                    { "type": "Beeston Cast Iron Radiator Hospital Easy Clean 5\" Sectional 30\" High, 5\" deep", "heights": [699], "watts": [88], "section_length": 57 },
                    { "type": "Beeston Cast Iron Radiator Hospital Easy Clean 5\" Sectional 36\" High, 5\" deep", "heights": [851], "watts": [104], "section_length": 57 },
                    { "type": "Beeston Cast Iron Radiator Hospital Easy Clean 7\" Sectional 18\" High, 7\" deep", "heights": [394], "watts": [68], "section_length": 64 },
                    { "type": "Beeston Cast Iron Radiator Hospital Easy Clean 7\" Sectional 24\" High, 7\" deep", "heights": [546], "watts": [87], "section_length": 64 },
                    { "type": "Beeston Cast Iron Radiator Hospital Easy Clean 7\" Sectional 30\" High, 7\" deep", "heights": [699], "watts": [115], "section_length": 64 },
                    { "type": "Beeston Cast Iron Radiator Hospital Easy Clean 7\" Sectional 36\" High, 7\" deep", "heights": [851], "watts": [136], "section_length": 64 },
                    { "type": "Beeston Cast Iron Radiator Royal School 5.5\" Sectional 18\" High, 5.5\" deep", "heights": [397], "watts": [56], "section_length": 57 },
                    { "type": "Beeston Cast Iron Radiator Royal School 5.5\" Sectional 24\" High, 5.5\" deep", "heights": [549], "watts": [77], "section_length": 57 },
                    { "type": "Beeston Cast Iron Radiator Royal School 5.5\" Sectional 30\" High, 5.5\" deep", "heights": [702], "watts": [96], "section_length": 57 },
                    { "type": "Beeston Cast Iron Radiator Royal School 5.5\" Sectional 36\" High, 5.5\" deep", "heights": [778], "watts": [110], "section_length": 57 },
                    { "type": "Beeston Cast Iron Radiator New Royal Wall Panel  18\" High, 16\" Panel", "heights": [457], "watts": [232], "section_length": 406 },
                    { "type": "Beeston Cast Iron Radiator New Royal Wall Panel  24\" High, 16\" Panel", "heights": [610], "watts": [315], "section_length": 406 },
                    { "type": "Beeston Cast Iron Radiator New Royal Wall Panel  30\" High, 16\" Panel", "heights": [762], "watts": [406], "section_length": 406 },
                    { "type": "Beeston Cast Iron Radiator Wall Column 14.5\" High, 22.75\" Section", "heights": [368], "watts": [345], "section_length": [578] },
                    { "type": "Beeston Cast Iron Radiator Wall Column 22.5\" High, 14.13\" Section", "heights": [572], "watts": [337], "section_length": [359] },
                    { "type": "Crane Cast Iron Radiator Pall Mall 2-Column Sectional 18\" High, 3.5\" deep", "heights": [387], "watts": [35], "section_length": 57 },
                    { "type": "Crane Cast Iron Radiator Pall Mall 2-Column Sectional 24\" High, 3.5\" deep", "heights": [540], "watts": [47], "section_length": 57 },
                    { "type": "Crane Cast Iron Radiator Pall Mall 2-Column Sectional 30\" High, 3.5\" deep", "heights": [702], "watts": [63], "section_length": 57 },
                    { "type": "Crane Cast Iron Radiator Pall Mall 4-Column Sectional 18\" High, 5.625\" deep", "heights": [387], "watts": [65], "section_length": 57 },
                    { "type": "Crane Cast Iron Radiator Pall Mall 4-Column Sectional 24\" High, 5.625\" deep", "heights": [540], "watts": [96], "section_length": 57 },
                    { "type": "Crane Cast Iron Radiator Pall Mall 4-Column Sectional 30\" High, 5.625\" deep", "heights": [692], "watts": [117], "section_length": 57 },
                    { "type": "Crane Cast Iron Radiator Pall Mall 4-Column Sectional 36\" High, 5.625\" deep", "heights": [778], "watts": [143], "section_length": 57 },
                    { "type": "Crane Cast Iron Radiator Pall Mall 6-Column Sectional 18\" High, 8.625\" deep", "heights": [387], "watts": [94], "section_length": 57 },
                    { "type": "Crane Cast Iron Radiator Pall Mall 6-Column Sectional 24\" High, 8.625\" deep", "heights": [540], "watts": [131], "section_length": 57 },
                    { "type": "Crane Cast Iron Radiator Pall Mall 6-Column Sectional 30\" High, 8.625\" deep", "heights": [692], "watts": [168], "section_length": 57 },
                    { "type": "Crane Cast Iron Radiator Pall Mall 6-Column Sectional 36\" High, 8.625\" deep", "heights": [778], "watts": [204], "section_length": 57 },
                    { "type": "Crane Cast Iron Radiator Pall Mall 9-Column Sectional 13\" High, 13.25\" deep", "heights": [330], "watts": [105], "section_length": 57 },
                    { "type": "Crane Cast Iron Radiator Hospital Easy Clean 3\" Sectional 18\" High, 3\" deep", "heights": [384], "watts": [35], "section_length": 51 },
                    { "type": "Crane Cast Iron Radiator Hospital Easy Clean 3\" Sectional 24\" High, 3\" deep", "heights": [537], "watts": [47], "section_length": 51 },
                    { "type": "Crane Cast Iron Radiator Hospital Easy Clean 3\" Sectional 24\" High, 3\" deep", "heights": [689], "watts": [61], "section_length": 51 },
                    { "type": "Crane Cast Iron Radiator Hospital Easy Clean 5.75\" Sectional 18\" High, 5.75\" deep", "heights": [384], "watts": [61], "section_length": 67 },
                    { "type": "Crane Cast Iron Radiator Hospital Easy Clean 5.75\" Sectional 24\" High, 5.75\" deep", "heights": [537], "watts": [81], "section_length": 67 },
                    { "type": "Crane Cast Iron Radiator Hospital Easy Clean 5.75\" Sectional 30\" High, 5.75\" deep", "heights": [689], "watts": [101], "section_length": 67 },
                    { "type": "Crane Cast Iron Radiator Hospital Easy Clean 5.75\" Sectional 36\" High, 5.75\" deep", "heights": [841], "watts": [121], "section_length": 67 },
                    { "type": "Crane Cast Iron Radiator Hospital Easy Clean 7.125\" Sectional 18\" High, 7.125\" deep", "heights": [384], "watts": [69], "section_length": 67 },
                    { "type": "Crane Cast Iron Radiator Hospital Easy Clean 7.125\" Sectional 24\" High, 7.125\" deep", "heights": [537], "watts": [93], "section_length": 67 },
                    { "type": "Crane Cast Iron Radiator Hospital Easy Clean 7.125\" Sectional 30\" High, 7.125\" deep", "heights": [689], "watts": [120], "section_length": 67 },
                    { "type": "Crane Cast Iron Radiator Hospital Easy Clean 7.125\" Sectional 36\" High, 7.125\" deep", "heights": [841], "watts": [143], "section_length": 67 },
                    { "type": "Crane Cast Iron Radiator Wall Panel 18\" High, 16\" Panel", "heights": [457], "watts": [218], "section_length": 406 },
                    { "type": "Crane Cast Iron Radiator Wall Panel 24\" High, 16\" Panel", "heights": [610], "watts": [291], "section_length": 406 },
                    { "type": "Crane Cast Iron Radiator Wall Panel 30\" High, 16\" Panel", "heights": [762], "watts": [359], "section_length": 406 },
                    { "type": "Crane Cast Iron Radiator Skirting Heating 6\" High,(Radiant) Type R", "heights": [173], "watts": [47], "section_length": 305 },
                    { "type": "Crane Cast Iron Radiator Skirting Heating 9\" High,(Radiant) Type R", "heights": [251], "watts": [69], "section_length": 305 },
                    { "type": "Crane Cast Iron Radiator Skirting Heating 9\" High,(Radiant/Convector) RC", "heights": [251], "watts": [120], "section_length": 305 },
                ],
                new_radiators: [
                    { "type": "Custom", "heights": [300, 450, 600, 700, 750], "watts": [37, 0, 53, 0, 69, 72, 83], "section_length": "N/A" },
                    { "type": "P1", "heights": [300, 450, 600, 700, 750], "watts": [37, 0, 53, 0, 69, 72, 83], "section_length": "N/A" },
                    { "type": "K1", "heights": [300, 400, 450, 500, 600, 700, 750], "watts": [51, 71, 74, 86, 96, 111, 117], "section_length": "N/A" },
                    { "type": "P+", "heights": [300, 400, 450, 500, 600, 700, 750], "watts": [78, 97, 113, 116, 145, 153, 176], "section_length": "N/A" },
                    { "type": "K2", "heights": [300, 400, 450, 500, 600, 700, 750], "watts": [94, 123, 136, 148, 176, 196, 214], "section_length": "N/A" },
                    { "type": "K3", "heights": [300, 500, 600, 700], "watts": [135, 0, 0, 205, 238, 271, 0], "section_length": "N/A" },
                    { "type": "Double panel no fins", "heights": [300, 440, 590, 740], "watts": [60, 83, 107, 131], "section_length": "N/A" },
                    { "type": "Beeston Cast Iron Radiator New Royal 2-Column Sectional 18\" High, 3.5\" deep", "heights": [406], "watts": [47], "section_length": 57 },
                    { "type": "Beeston Cast Iron Radiator New Royal 2-Column Sectional 24\" High, 3.5\" deep", "heights": [559], "watts": [62], "section_length": 57 },
                    { "type": "Beeston Cast Iron Radiator New Royal 2-Column Sectional 30\" High, 3.5\" deep", "heights": [771], "watts": [80], "section_length": 57 },
                    { "type": "Beeston Cast Iron Radiator New Royal 3-Column Sectional 18\" High, 5.5\" deep", "heights": [406], "watts": [69], "section_length": 57 },
                    { "type": "Beeston Cast Iron Radiator New Royal 3-Column Sectional 24\" High, 5.5\" deep", "heights": [559], "watts": [91], "section_length": 57 },
                    { "type": "Beeston Cast Iron Radiator New Royal 3-Column Sectional 30\" High, 5.5\" deep", "heights": [711], "watts": [112], "section_length": 57 },
                    { "type": "Beeston Cast Iron Radiator New Royal 3-Column Sectional 36\" High, 5.5\" deep", "heights": [864], "watts": [136], "section_length": 57 },
                    { "type": "Beeston Cast Iron Radiator New Royal 4-Column Sectional 18\" High, 7.5\" deep", "heights": [406], "watts": [83], "section_length": 57 },
                    { "type": "Beeston Cast Iron Radiator New Royal 4-Column Sectional 24\" High, 7.5\" deep", "heights": [559], "watts": [113], "section_length": 57 },
                    { "type": "Beeston Cast Iron Radiator New Royal 4-Column Sectional 30\" High, 7.5\" deep", "heights": [711], "watts": [138], "section_length": 57 },
                    { "type": "Beeston Cast Iron Radiator New Royal 4-Column Sectional 36\" High, 7.5\" deep", "heights": [864], "watts": [165], "section_length": 57 },
                    { "type": "Beeston Cast Iron Radiator New Royal 5-Column Sectional 13\" High, 9.5\" deep", "heights": [298], "watts": [80], "section_length": 57 },
                    { "type": "Beeston Cast Iron Radiator New Royal 5-Column Sectional 18\" High, 9.5\" deep", "heights": [419], "watts": [102], "section_length": 57 },
                    { "type": "Beeston Cast Iron Radiator New Royal 5-Column Sectional 24\" High, 9.5\" deep", "heights": [562], "watts": [133], "section_length": 57 },
                    { "type": "Beeston Cast Iron Radiator New Royal 5-Column Sectional 30\" High, 9.5\" deep", "heights": [714], "watts": [165], "section_length": 57 },
                    { "type": "Beeston Cast Iron Radiator New Royal 5-Column Sectional 36\" High, 9.5\" deep", "heights": [867], "watts": [198], "section_length": 57 },
                    { "type": "Beeston Cast Iron Radiator New Royal 7-Column Sectional 13.5\" High, 13.25\" deep", "heights": [343], "watts": [105], "section_length": 57 },
                    { "type": "Beeston Cast Iron Radiator Hospital Easy Clean 3.5\" Sectional 18\" High, 3.5\" deep", "heights": [406], "watts": [47], "section_length": 57 },
                    { "type": "Beeston Cast Iron Radiator Hospital Easy Clean 3.5\" Sectional 24\" High, 3.5\" deep", "heights": [559], "watts": [59], "section_length": 57 },
                    { "type": "Beeston Cast Iron Radiator Hospital Easy Clean 3.5\" Sectional 30\" High, 3.5\" deep", "heights": [711], "watts": [75], "section_length": 57 },
                    { "type": "Beeston Cast Iron Radiator Hospital Easy Clean 5\" Sectional 18\" High, 5\" deep", "heights": [394], "watts": [55], "section_length": 57 },
                    { "type": "Beeston Cast Iron Radiator Hospital Easy Clean 5\" Sectional 24\" High, 5\" deep", "heights": [546], "watts": [70], "section_length": 57 },
                    { "type": "Beeston Cast Iron Radiator Hospital Easy Clean 5\" Sectional 30\" High, 5\" deep", "heights": [699], "watts": [88], "section_length": 57 },
                    { "type": "Beeston Cast Iron Radiator Hospital Easy Clean 5\" Sectional 36\" High, 5\" deep", "heights": [851], "watts": [104], "section_length": 57 },
                    { "type": "Beeston Cast Iron Radiator Hospital Easy Clean 7\" Sectional 18\" High, 7\" deep", "heights": [394], "watts": [68], "section_length": 64 },
                    { "type": "Beeston Cast Iron Radiator Hospital Easy Clean 7\" Sectional 24\" High, 7\" deep", "heights": [546], "watts": [87], "section_length": 64 },
                    { "type": "Beeston Cast Iron Radiator Hospital Easy Clean 7\" Sectional 30\" High, 7\" deep", "heights": [699], "watts": [115], "section_length": 64 },
                    { "type": "Beeston Cast Iron Radiator Hospital Easy Clean 7\" Sectional 36\" High, 7\" deep", "heights": [851], "watts": [136], "section_length": 64 },
                    { "type": "Beeston Cast Iron Radiator Royal School 5.5\" Sectional 18\" High, 5.5\" deep", "heights": [397], "watts": [56], "section_length": 57 },
                    { "type": "Beeston Cast Iron Radiator Royal School 5.5\" Sectional 24\" High, 5.5\" deep", "heights": [549], "watts": [77], "section_length": 57 },
                    { "type": "Beeston Cast Iron Radiator Royal School 5.5\" Sectional 30\" High, 5.5\" deep", "heights": [702], "watts": [96], "section_length": 57 },
                    { "type": "Beeston Cast Iron Radiator Royal School 5.5\" Sectional 36\" High, 5.5\" deep", "heights": [778], "watts": [110], "section_length": 57 },
                    { "type": "Beeston Cast Iron Radiator New Royal Wall Panel  18\" High, 16\" Panel", "heights": [457], "watts": [232], "section_length": 406 },
                    { "type": "Beeston Cast Iron Radiator New Royal Wall Panel  24\" High, 16\" Panel", "heights": [610], "watts": [315], "section_length": 406 },
                    { "type": "Beeston Cast Iron Radiator New Royal Wall Panel  30\" High, 16\" Panel", "heights": [762], "watts": [406], "section_length": 406 },
                    { "type": "Beeston Cast Iron Radiator Wall Column 14.5\" High, 22.75\" Section", "heights": [368], "watts": [345], "section_length": [578] },
                    { "type": "Beeston Cast Iron Radiator Wall Column 22.5\" High, 14.13\" Section", "heights": [572], "watts": [337], "section_length": [359] },
                    { "type": "Crane Cast Iron Radiator Pall Mall 2-Column Sectional 18\" High, 3.5\" deep", "heights": [387], "watts": [35], "section_length": 57 },
                    { "type": "Crane Cast Iron Radiator Pall Mall 2-Column Sectional 24\" High, 3.5\" deep", "heights": [540], "watts": [47], "section_length": 57 },
                    { "type": "Crane Cast Iron Radiator Pall Mall 2-Column Sectional 30\" High, 3.5\" deep", "heights": [702], "watts": [63], "section_length": 57 },
                    { "type": "Crane Cast Iron Radiator Pall Mall 4-Column Sectional 18\" High, 5.625\" deep", "heights": [387], "watts": [65], "section_length": 57 },
                    { "type": "Crane Cast Iron Radiator Pall Mall 4-Column Sectional 24\" High, 5.625\" deep", "heights": [540], "watts": [96], "section_length": 57 },
                    { "type": "Crane Cast Iron Radiator Pall Mall 4-Column Sectional 30\" High, 5.625\" deep", "heights": [692], "watts": [117], "section_length": 57 },
                    { "type": "Crane Cast Iron Radiator Pall Mall 4-Column Sectional 36\" High, 5.625\" deep", "heights": [778], "watts": [143], "section_length": 57 },
                    { "type": "Crane Cast Iron Radiator Pall Mall 6-Column Sectional 18\" High, 8.625\" deep", "heights": [387], "watts": [94], "section_length": 57 },
                    { "type": "Crane Cast Iron Radiator Pall Mall 6-Column Sectional 24\" High, 8.625\" deep", "heights": [540], "watts": [131], "section_length": 57 },
                    { "type": "Crane Cast Iron Radiator Pall Mall 6-Column Sectional 30\" High, 8.625\" deep", "heights": [692], "watts": [168], "section_length": 57 },
                    { "type": "Crane Cast Iron Radiator Pall Mall 6-Column Sectional 36\" High, 8.625\" deep", "heights": [778], "watts": [204], "section_length": 57 },
                    { "type": "Crane Cast Iron Radiator Pall Mall 9-Column Sectional 13\" High, 13.25\" deep", "heights": [330], "watts": [105], "section_length": 57 },
                    { "type": "Crane Cast Iron Radiator Hospital Easy Clean 3\" Sectional 18\" High, 3\" deep", "heights": [384], "watts": [35], "section_length": 51 },
                    { "type": "Crane Cast Iron Radiator Hospital Easy Clean 3\" Sectional 24\" High, 3\" deep", "heights": [537], "watts": [47], "section_length": 51 },
                    { "type": "Crane Cast Iron Radiator Hospital Easy Clean 3\" Sectional 24\" High, 3\" deep", "heights": [689], "watts": [61], "section_length": 51 },
                    { "type": "Crane Cast Iron Radiator Hospital Easy Clean 5.75\" Sectional 18\" High, 5.75\" deep", "heights": [384], "watts": [61], "section_length": 67 },
                    { "type": "Crane Cast Iron Radiator Hospital Easy Clean 5.75\" Sectional 24\" High, 5.75\" deep", "heights": [537], "watts": [81], "section_length": 67 },
                    { "type": "Crane Cast Iron Radiator Hospital Easy Clean 5.75\" Sectional 30\" High, 5.75\" deep", "heights": [689], "watts": [101], "section_length": 67 },
                    { "type": "Crane Cast Iron Radiator Hospital Easy Clean 5.75\" Sectional 36\" High, 5.75\" deep", "heights": [841], "watts": [121], "section_length": 67 },
                    { "type": "Crane Cast Iron Radiator Hospital Easy Clean 7.125\" Sectional 18\" High, 7.125\" deep", "heights": [384], "watts": [69], "section_length": 67 },
                    { "type": "Crane Cast Iron Radiator Hospital Easy Clean 7.125\" Sectional 24\" High, 7.125\" deep", "heights": [537], "watts": [93], "section_length": 67 },
                    { "type": "Crane Cast Iron Radiator Hospital Easy Clean 7.125\" Sectional 30\" High, 7.125\" deep", "heights": [689], "watts": [120], "section_length": 67 },
                    { "type": "Crane Cast Iron Radiator Hospital Easy Clean 7.125\" Sectional 36\" High, 7.125\" deep", "heights": [841], "watts": [143], "section_length": 67 },
                    { "type": "Crane Cast Iron Radiator Wall Panel 18\" High, 16\" Panel", "heights": [457], "watts": [218], "section_length": 406 },
                    { "type": "Crane Cast Iron Radiator Wall Panel 24\" High, 16\" Panel", "heights": [610], "watts": [291], "section_length": 406 },
                    { "type": "Crane Cast Iron Radiator Wall Panel 30\" High, 16\" Panel", "heights": [762], "watts": [359], "section_length": 406 },
                    { "type": "Crane Cast Iron Radiator Skirting Heating 6\" High,(Radiant) Type R", "heights": [173], "watts": [47], "section_length": 305 },
                    { "type": "Crane Cast Iron Radiator Skirting Heating 9\" High,(Radiant) Type R", "heights": [251], "watts": [69], "section_length": 305 },
                    { "type": "Crane Cast Iron Radiator Skirting Heating 9\" High,(Radiant/Convector) RC", "heights": [251], "watts": [120], "section_length": 305 },
                ],
                radiators_heights: [],
                radiators_watts: [],
                radiators_types: []
            };

            if(item_property == 'room_names'){
                collections[item_property] = [];
                angular.forEach($rootScope.cloud_data.uf_heating_temps, function(value, key){
                    collections[item_property].push(key);
                })
            }

            angular.forEach($rootScope.materials.defaults, function(value) {
                if (!collections[value.type])
                    collections[value.type] = [];
                collections[value.type].push(value.material);
            });

            if (!!$rootScope.materials.customs) {
                angular.forEach($rootScope.materials.customs, function(value) {
                    collections[value.type].push(value.material);
                });
            }

            if (split.length > 1) {
                if (split[0] === 'complex_room_materials' && split[1] === 'wall') {
                    try {
                        if (scope[idx].complex_room_details.wall.type[split[2]] == 'Roof')
                            item_property = 'roof';
                    } catch (error) {
                        return true;
                    }
                } else if ((split[0] === 'radiators') && (split[2] === 'type')) {
                    angular.forEach(collections[item_property], function(value) {
                        collections['radiators_types'].push(value.type)
                    });

                    item_property = "radiators_types";
                } else if ((split[0] === 'radiators') && (split[2] === 'height') && (type === 'select')) {
                    var selectedtype = scope[idx][split[0]][split[1]]["type"];
                    var newCollection = collections[item_property].filter(function(el) {
                        return el.type == selectedtype;
                    });

                    angular.forEach(newCollection[0].heights, function(value) {
                        collections['radiators_heights'].push(value)
                    });

                    item_property = "radiators_heights";
                }else if ((split[0] === 'new_radiators') && (split[2] === 'type')) {
                    angular.forEach(collections[item_property], function(value) {
                        collections['radiators_types'].push(value.type)
                    });

                    item_property = "radiators_types";
                } else if ((split[0] === 'new_radiators') && (split[2] === 'height') && (type === 'select')) {
                    var selectedtype = scope[idx][split[0]][split[1]]["type"];
                    var newCollection = collections[item_property].filter(function(el) {
                        return el.type == selectedtype;
                    });

                    angular.forEach(newCollection[0].heights, function(value) {
                        collections['radiators_heights'].push(value)
                    });

                    item_property = "radiators_heights";
                } else if (split[0] == 'primaryFlowIndex') {
                    // console.log('primaryFlowIndex', split)
                }else if(split[0] == 'tees'){
                    // console.log('tees', split)
                }

                if (idx >= 0) {
                    if(split[0] == 'tees'){
                        if (!scope.tees[idx][split[1]]){
                            scope.tees[idx][split[1]] = '';
                        }
                    } else {
                        if (!scope[idx][split[0]])
                            setPropertiesByArray(idx, split);
                        else if (scope[idx][split[0]] && !scope[idx][split[0]][split[1]])
                            setPropertiesByArray(idx, split, true);
                        default_value = scope[idx];
                        for (var i = 0; i < split.length; i++)
                            default_value = default_value[split[i]];
                    }
                } else {
                    if (scope[split[0]]) {
                        default_value = scope[split[0]][split[1]];
                    }
                }
            } else
                default_value = scope[idx][item];

            items.title = title;
            items.type = type;
            items.unit = units[subTitle] && units[subTitle].unit ? units[subTitle].unit : '';
            items.subTitle = units[subTitle] && units[subTitle].title ? units[subTitle].title: '';

            items.collections = collections[item_property];
            items.default_value = default_value;
            items.isCustomMaterials = customMaterial ? true : false;

            if (items.isCustomMaterials) {
                items.idx = idx;
                items.item = item;
                items.property = customMaterial.property;
                items.survey = customMaterial.survey;
                items.page = customMaterial.page;
            }

            var modalInstance = $modal.open({
                animation: true,
                templateUrl: getTemplateUrl(),
                controller: getController(),
                size: 'md',
                resolve: {
                    items: function() {
                        return items;
                    }
                }
            });

            modalInstance.result.then(function(selectedItem) {
                if (items.isCustomMaterials) {

                    var u_value = '';
                    if (!!selectedItem.u_value) {
                        u_value = ' (' + selectedItem.u_value + ')';
                    } else {
                        _.each($rootScope.materials.defaults, function(material) {
                            if (material.material == selectedItem.item)
                                selectedItem.u_value = material.u_value;
                        });
                        if (!selectedItem.u_value) {
                            _.each($rootScope.materials.customs, function(material) {
                                if (material.material == selectedItem.item)
                                    selectedItem.u_value = material.u_value;
                            });
                        }

                        if (!selectedItem.u_value) {
                            selectedItem.u_value = 0;
                        }

                        var str = selectedItem.item.search("\\(");
                        u_value = ' (' + selectedItem.u_value + ')';

                        if (str != -1)
                            selectedItem.item = selectedItem.item.substr(0, str - 1);
                        else
                            u_value = '';
                    }



                    modal_result = {
                        "material": selectedItem.item += u_value,
                        "u_value": parseFloat(selectedItem.u_value),
                        "type": '',
                        "isOptionSelect": selectedItem.isOptionSelect || null,
                        "old": selectedItem.old
                    };
                } else {
                    if (idx >= 0) {
                        if (split.length > 1) {
                            getPropertyByArray(idx, split, selectedItem);
                        } else {
                            scope[idx][item] = selectedItem;
                            if (item == "is_there_a_roof") {
                                scope[idx]['Which_room_is_above'] = 'None'
                            }
                            if (item === 'flow_temperature')
                            {
                                _.each(scope, function(proom, idx1) {
                                    if (proom.room_id === scope[idx].room_partner_id)
                                    {
                                        scope[idx1][item] = selectedItem;
                                    }
                                })

                                if(selectedItem > $rootScope.maximumFlowTemp) {
                                    alert('Flow temperature should be less than the maximum design flow temperature '+ $rootScope.maximumFlowTemp)
                                    scope[idx][item] = $rootScope.maximumFlowTemp
                                } else {
                                    scope[idx][item] = selectedItem;
                                }

                            }
                        }

                        let step4Array = [
                            'floor_area',
                            'room_height',
                            'external_wall',
                            'internal_wall_length',
                            'party_wall_length',
                            'external_door_area',
                            'roof_glazing_area'
                        ];

                        if(step4Array.includes(split[0])) {
                            let m = surveyService.highlightMinMax(scope);
                            modal_result.minMax = m.minMax;
                            modal_result.scope = m.rooms;
                        } else {
                            modal_result.scope = scope;
                        }
                        modal_result.idx = idx;
                    } else {
                        scope[split[0]][split[1]] = selectedItem
                        modal_result.scope = scope;
                    }
                }
                deferred.resolve(modal_result);
            }, function() {
                deferred.reject();
            });

            function setPropertiesByArray(idx, item, isPropertyAlready) {
                for (var i = 0; i < item.length; i++) {
                    if (i == 0) {
                        if (!isPropertyAlready)
                            scope[idx][item[i]] = i == item.length - 1 ? '' : {};
                    } else if (i == 1)
                        scope[idx][item[i - 1]][item[i]] = i == item.length - 1 ? '' : {};
                    else if (i == 2)
                        scope[idx][item[i - 2]][item[i - 1]][item[i]] = i == item.length - 1 ? '' : {};
                    else if (i == 3)
                        scope[idx][item[i - 3]][item[i - 2]][item[i - 1]][item[i]] = i == item.length - 1 ? '' : {};
                }
            }

            function getPropertyByArray(idx, item, value) {
                if(item[0] == 'tees'){
                    scope.tees[idx][item[1]] = value;
                } else {
                    if (item.length == 1)
                        scope[idx][item[0]] = value;
                    else if (item.length == 2)
                        scope[idx][item[0]][item[1]] = value;
                    else if (item.length == 3)
                        scope[idx][item[0]][item[1]][item[2]] = value;
                    else if (item.length == 4)
                        scope[idx][item[0]][item[1]][item[2]][item[3]] = value;
                }
            }

            return deferred.promise;
        };

        /**
         * return modal service
         */
        return service;
    }
})();
