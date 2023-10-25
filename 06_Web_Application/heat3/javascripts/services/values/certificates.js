(function () {
    'use strict';

    angular
        .module('cloudheatengineer')
        .value('mcs', {
            heat_pump: {
                content: [
                    {
                        text: ['MCS Compliance Certificate\n', 'Heat Pump'],
                        style: ['header', 'center']
                    },
                    {
                        image: null,
                        width: 90,
                        alignment: 'right'
                    },
                    {
                        style: 'tableExample',
                        table: {
                            widths: [315, 180],
                            body: [
                                [{ text: '1. General information', style: ['bold', 'th'] }, ''], // 0
                                ['1.1    Name of the owner', '=""&Start!G7&" "&Start!G8&""'], // 1
                                ['1.2    Address of the owner', '=""&Start!G10&", "&Start!G11&", " &Start!G12&""'], // 2
                                ['1.3    Address at which the heating system is installed, if different to above', ''], // 3
                                ['1.4    MCS certification number of installation company', '=Start!J5'], // 4
                                ['1.5    Name of MCS installation company', '=Start!J6'], // 5
                                ['1.6    Address of MCS installation company', '=""&Start!J7&", "&Start!J8&", "&Start!J9&", " &Start!J10&"  "'], // 6
                                ['1.7    Commissioning date of the installation', ''], // 7
                                [{ text: '2. Purpose of installation', style: ['bold', 'th'] }, ''], // 8
                                ['2.1    Does the installation provide:', ''], // 9
                                ['2.1    i. Space heating', 'Yes'], // 10
                                ['2.1    ii. Domestic hot water', 'Yes'], // 11
                                ['2.1    iii. Other (please state)', ''], // 12
                                ['2.2    Is the installation designed for intermittent or continuous heating?', 'Continuous'], // 13
                                ['2.3    Are the heating services to the building bivalent/multivalent?', ''], // 14
                                [{ text: '3. Regulations and approvals', style: ['bold', 'th'] }, ''], // 15
                                ['3.     i. Have all regulations been met and approvals obtained (including planning approval as required)?', 'Yes'], // 16
                                ['3.     ii. If installed in England, does the installation comply with MCS 020 where permitted development is required (ASHP only)? ', ''], // 17
                                [{ text: '4. Heating calculations', style: ['bold', 'th'] }, ''], // 18
                                ['4.1    i. Has a heat loss calculation been carried out for every heated room?', 'Yes'], // 19
                                ['4.1    ii. Heat loss calculator used (name and version)', 'CIBSE Domestic Heating Design Guide 2014 (Heat Engineer Software v1.0)'], // 20
                                ['4.1    iii. Design external temperature (\xB0C)', '=Start!G20'], // 21
                                ['4.1    iv. Design ground temperature (\xB0C) (for solid floor losses only)', '=Start!G21'], // 22
                                ['4.1    v. Design internal temperatures (\xB0C)', '21'], // 23
                                ['4.1    vi. Total building heat loss in kW', '=Rooms!BI44'], //24
                                ['4.2    If the installation has been designed for intermittent heating, what uplift factor has been applied to the building heat loss when sizing the:', ''], // 25
                                ['4.2    i. Heat source', ''], // 26
                                ['4.2    ii. Heat emitters', ''], // 27
                                ['4.3    i. Has the Domestic Hot Water (DHW) system been designed by considering the number and types of points of use and anticipated consumption within the property?', 'Yes'], // 28
                                ['4.3    ii. Has the reheat time of the hot water storage vessel been estimated and agreed with the customer?', 'Yes'], // 29
                                ['4.4    Have the implications of the system design on the costs associated with providing space heating and domestic hot water to the building been explained in writing to the owner?', 'Yes'], // 30
                                [{ text: '5. Heat emitter design', style: ['bold', 'th'] }, ''], // 31
                                ['5.1    i. Lowest of the oversize factors or pipe spacing (as appropriate) for the heat emitters that are to be used', ''], // 32
                                ['5.1    ii. What heat emitters are installed?\n(List all that apply using Heat Emitter Guide (HEG))', ''], // 33
                                ['5.1    iii. Floor covering (If underfloor heating)', ''], // 34
                                ['5.1    iv. All Room heat losses in watts (W) (or w/m2 together with floor areas)', 'See heat loss report'], // 35
                                ['5.1    v. Has a blending valve been installed to reduce the water temperature in the heat emitters?', ''], // 36
                                ['5.1    vi. Temperature (\xB0C) of the water leaving the heat pump when supplying space heating at the design external temperature?', '=Summary!E25'], // 37
                                ['5.1    vii. What is the Temperature Star Rating for the whole heating system?', null], // 38
                                ['5.1    viii. Has the customer been provided with a copy of the calculations carried out for the HEG?', 'Yes'], // 39
                                [{ text: '6. Hot water system', style: ['bold', 'th'] }, ''], // 40
                                ['6.1    i. Is hot water heating provided by the heat pump?', 'Yes'], // 41
                                ['6.1    ii. Maximum flow temperature (\xB0C) of the heat pump while providing hot water', '55'], // 42
                                ['6.1    iii. Fraction of hot water supplied by the heat pump, excluding the immersion heater', 'Fully'], // 43
                                ['6.1    iv. Volume of the cylinder in litres and note evidence for the choice', '0'], // 44
                                ['6.1    v. Is the cylinder including the heat exchanger designed to operate with a heat pump?', 'Yes'], // 45
                                [{ text: '7. Heat pump selection', style: ['bold', 'th'] }, ''], // 46
                                ['7.1    i. Make and model name of the installed heat pump', '=""&Start!G27&"   "  &Start!G28&""'], // 47
                                ['7.1    ii. MCS product certification number for the heat pump', ''], // 48
                                ['7.1    iii. Heat output from the heat pump in kW (excluding heat from any supplementary heaters) at the design external and design flow temperatures', '=Start!G29'], // 49
                                ['7.1    iv. Does the heat pump provide a full or partial heating service?', 'Full'], // 50
                                ['7.1    v. If partial, what is the percentage of annual space heating requirements met by the heat pump (excluding supplementary heaters)?', ''], // 51
                                ['7.1    vi. Does the heat pump provide full or partial hot water heating?', 'Full'], // 52
                                ['7.1    vii. If partial, what is the percentage of annual hot water requirements met by the heat pump (excluding supplementary heaters)?', ''], // 53
                                [{ text: '8. Design of ground heat exchanger', style: ['bold', 'th'] }, ''], // 54
                                ['8.1    i. Has the customer been provided with a completed copy of Table 3 from MIS 3005?', ''], // 55
                                ['8.1    ii. Annual energy (kWh/yr) assumed for the ground heat exchanger design', '=SUM("Heat Pump summary"!C14+"Heat Pump summary"!C37)'], // 56
                                ['8.1    iii. Confirm that:', ''], // 57
                                ['8.1    a. the flow of thermal transfer fluid is turbulent in the ground heat exchanger active elements', ''], // 58
                                ['8.1    b. the closed-loop ground collector system pumping power at the lowest operating temperature is less than 3% of the heat pump heating capacity', ''], // 59
                                ['8.1    c. the method used is location specific taking account of UK average ground temperatures', ''], // 60
                                ['8.1    d. the temperature of the thermal transfer fluid entering the heat pump been designed to be not less than 0\xB0C at all times for 20 years', ''], // 61
                                ['8.1    iv. Type of ground heat exchanger', ''], // 62
                                [{ text: '9. System performance calculations and annual energy figures', style: ['bold', 'th'] }, ''], // 63
                                ['9.1    i. Annual space heating demand (kWh/yr)', '=SUM("Heat Pump summary"!C13)'], // 64
                                ['9.1    ii. Annual water heating demand (kWh/yr)', '=SUM("Heat Pump summary"!C36)'], // 65
                                ['9.1    iii. Percentage of space heating and water heating demand provided by the heat pump (excluding auxiliary and immersion heaters)', '=SUM("Heat Pump summary"!C53)'], // 66
                                ['9.1    iv. Annual electricity consumption of the heat pump (excluding auxiliary and immersion heaters) (kWh/yr)', '=SUM("Heat Pump summary"!C55)'], // 67
                                ['9.1    v. Annual electricity consumption of auxiliary and immersion heaters (kWh/yr)', '=SUM("Heat Pump summary"!C56)'], // 68
                                ['9.1    vi. Annual energy consumption of other heat sources (kWh/yr)', ''], // 69 =SUM("Heat Pump summary"!C57)
                                ['9.1    vii. SPF or SPER of the heat pump', '=Summary!E27'], // 70
                                ['9.2    i. (Optional) If intended as domestic RHI installation, maximum qualifying renewable heat (kWh/yr) from the Energy Performance Certificate (EPC) where available', ''], // 71
                                [{ text: '10. Installation', style: ['bold', 'th'] }, ''], // 72
                                ['10.1    i. Does the installation conform to the design?', ''], // 73
                                ['10.1    ii. Have all manufacturers’ instructions been followed including installation location and condensate drainage (as appropriate)?', ''], // 74
                                ['10.1    iii. Where the requirements of MIS 3005 exceed those of the manufacturer, have the requirements of MIS 3005 been met?', ''], // 75
                                ['10.2    If intended as a domestic RHI installation:', ''], // 76
                                ['10.2    i. Does the installation conform to the MCS Domestic RHI Metering Guidance?', ''], // 77
                                ['10.2    ii. What is the outcome of Procedure A in the MCS Domestic RHI Metering Guidance?', ''], // 78
                                ['10.2    iii. Is the installation meter ready? If not, please state why.', ''], // 79
                                ['10.3    For ground source heat pumps:', ''], // 80
                                ['10.3    i. Has the system been flushed, purged, filled and pressure tested according to MIS 3005?', ''], // 81
                                ['10.3    ii. What make and type of antifreeze has been added to make up the thermal transfer fluid?', ''], // 82
                                ['10.3    iii. Is the antifreeze mixed to at least -10 \xB0C and has it been tested twice with a refractometer?', ''], // 83
                                ['10.3    iv. Has the recommended biocide been added in the quantity specified?', ''], // 84
                                [{ text: '11. Commissioning and handover', style: ['bold', 'th'] }, ''], // 85
                                ['11.1    i. Explain how the controls have been set to ensure that the system operating temperature is no higher than TFSH at the design external temperature', ''], // 86
                                ['11.1    ii. Record the control settings', ''], // 87
                                ["11.2    i. Has the heat pump and other components of the system been commissioned according to the manufacturers' instructions and system design parameters?", ''], // 88
                                ['11.2    ii. Has a label been attached to the system in accordance with MIS 3005?', ''], // 89
                                ['11.3    i. Have you given the customer a handover pack?', ''], // 90
                                ['11.3    ii. State the issue number of MIS 3005 used', ''], // 91
                                ['11.3    iii. Have you informed the customer that they will receive an MCS installation certificate that they should keep with their handover pack?', ''], // 92
                                [{ text: '12. Confirmation', style: ['bold', 'th'] }, ''], // 93
                                [{ text: '12.1	I am authorised to sign this certificate on behalf of the MCS installation company named above and I confirm that:\n(i) the heating installation at the premises whose address is shown above has been designed and installed in accordance with MIS 3005;\n(ii) the design included a heat loss calculation for every room of the building that is heated by the installation;\n(iii) the installation conforms to the design;\n(iv) controls to ensure TFSH have been installed and set correctly.', colSpan: 2}, {}], // 94
                                [{text: 'Full name:', bold: true}, ''], // 95
                                [{text: 'Job title:', bold: true}, ''], // 96
                                [{text: 'Date:', bold: true}, ''] // 97
                            ]
                        }
                    }
                ],
                styles: {
                    header: {
                        fontSize: 18,
                        bold: true
                    },
                    center: {
                        alignment: 'center'
                    },
                    tableExample: {
                        margin: [0, 10, 0, 0],
                        fontSize: 9
                    },
                    bold: {
                        bold: true
                    },
                    quote: {
                        italics: true
                    },
                    th: {
                        fontSize: 10
                    }
                }
            },
            biomass: {
                content: [
                    {
                        text: ['MCS Compliance Certificate\n', 'Biomass'],
                        style: ['header', 'center']
                    },
                    {
                        image: null,
                        width: 90,
                        alignment: 'right'
                    },
                    {
                        style: 'tableExample',
                        table: {
                            widths: [180, 180, 120],
                            body: [
                                [{ text: '1. General information', style: ['bold', 'th'] }, '', 'Guidance'], // 0
                                ['1.1    Name of the owner', '=""&Start!G7&" "&Start!G8&""', ''], // 1
                                ['1.2    Address of installation', '=""&Start!G10&", "&Start!G11&", " &Start!G12&""', ''], // 2
                                ['           Line 1', '', ''], // 3
                                ['           Line 2', '', ''], // 4
                                ['           Town', '', ''], // 5
                                ['           Country', '', ''], // 6
                                ['           Postcode', '', ''], // 7
                                ['1.3    Address of owner (if different to address of installation otherwise enter N/A):', '', ''], // 8
                                ['           Line 1', '', ''], // 9
                                ['           Line 2', '', ''], // 10
                                ['           Town', '', ''], // 11
                                ['           Country', '', ''], // 12
                                ['           Postcode', '', ''], // 13
                                ['1.4    MCS certification number of installation company', '', ''], // 14
                                ['1.5    Name of MCS installation company', '', ''], // 15
                                ['1.6    Address of MCS installation company', '', ''], // 16
                                ['1.7    Commissioning date of the installation', '', ''], // 17
                                [{ text: '2. Purpose of installation', style: ['bold', 'th'] }, '', ''], // 18
                                ['2.1	 i. Is the installation designed and installed:', '', ''], // 19
                                ['         a. to provide space heating to multiple rooms', '', ''], // 20
                                ['         b. to provide water heating for indoor use', '', ''], // 21
                                ['         c. for another purpose (please state)', '', ''], // 22
                                ['2.2	 i. Is the installation designed for intermittent or continuous heating?', '', ''], // 23
                                [{ text: '3. Regulations and approvals', style: ['bold', 'th'] }, '', ''], // 24
                                ['3.1	 Have all regulations been met and approvals obtained (including planning approval as required)?', '', ''], // 25
                                [{ text: '4. System performance', style: ['bold', 'th'] }, '', ''], // 26
                                ['4.1    i. Heat loss calculator used (name and version)?', '', ''], // 27
                                ['       ii. Design external temperature in degrees celsius?', '', ''], // 28
                                ['       iii. Design internal temperature(s) in degrees celsius?', '', 'Figure displayed is chosen temperatiure for living room. If different temperatures are used then each design temperature should be inputted.'], // 29
                                ['       iv. Total building heat loss in kW?', '', ''], // 30
                                ['4.2    If the installation has been designed for intermittent heating, what uplift factor as a percentage (%) has been applied to the building heat loss when sizing the:', '', ''], // 31
                                ['       i. Heat generator', '', 'If continuous this value will be 0%. If intermittent then calculation assumes a 20% uplift factor as per 4.5.1 b note 2 of MIS 3004'], // 32
                                ['       ii. Heat emitters', '', 'If continuous this value will be 0%. If intermittent then calculation assumes a 20% uplift factor as per 4.5.1 b note 2 of MIS 3004'], // 33
                                ['4.3	 What is the nominal heat output rating (Rn) of the installed product in kW?', '', ''], // 34
                                ['4.4	 Annual water heating demand:', '', ''], // 35
                                ['         i. Enter value in kWh/yr', '', ''], // 36
                                ['         ii. Method used', '', ''], // 37
                                ['       Annual water heating demand:', '', ''], // 38
                                ['         iii. Enter value in kWh/yr', '', ''], // 39
                                ['         iv. Method used', '', ''], // 40
                                ['4.5	 i. Percentage (%)  of space heating demand provided by the biofuel heating system', '', ''], // 41
                                ['       ii. Percentage (%) of water heating demand provided by the biofuel heating system', '', ''], //  42
                                ['4.6	 i. Declare the intended fuel specification complies with the relevant part of EN 14961', '', 'See clause 4.5.1 h of MIS 3004'], // 43
                                ['       ii. If other, please specify (state reference to specification)', '', 'See clause 4.5.1 h of MIS 3004'], // 44
                                ['       iii. Confirm that the specification for the intended fuel is included in the document pack', '', 'See clause 4.5.1 h of MIS 3004'], // 45
                                ['       iv. Gross calorific value (HM) of the intended fuel in kWh/kg', '', ''], // 46
                                ['       v. Bulk density (ρB) of the intended fuel in kg/m3', '', ''], // 47
                                ['4.7	 i. Seasonal efficiency of the heating system (ηS) as a %', '', ''], // 48
                                ['       ii. Estimated mass of fuel required in a year (Ma) in kg/yr', '', ''], // 49
                                ['       iii. Estimated volume of fuel required in a year (Va) in m3/yr', '', ''], // 50
                                ['4.8	 i. Manufacturer\'s specified efficiency at nominal output (ηK) as a %', '', ''], // 51
                                ['       ii. Estimated rate of fuel consumption (Mh) in kg/hr', '', ''], // 52
                                ['       iii. Estimated volume of this quantity of fuel (Vh) in m3/hr', '', ''], // 53
                                ['4.9	 i. Confirm that evidence has been provided for compliance with the requirements of the building’s space heating system (and hot water system if applicable) regarding specification and performance to ensure the correct and efficient operation of the heating system as a whole.', '', ''], // 54
                                ['4.10	 If intended as a domestic RHI installation:', '', ''], // 55
                                ['       i. Does the installation conform to the MCS Domestic RHI Metering Guidance?', '', ''], // 56
                                ['       ii. What is the outcome of Procedure A in the MCS Domestic RHI Metering Guidance?', '', ''], // 57
                                ['       iii. Is the installation meter ready?', '', ''], // 58
                                ['       iv. If not meter ready, please explain why.', '', ''], // 59
                                [{ text: '5. Annual energy figures', style: ['bold', 'th'] }, '', ''], // 60
                                ['5.1	 i. Percentage of space heating and water heating demand provided by the Biofuel Heating System (BHS).', '', ''], // 61
                                ['       ii. Heat supplied by the BHS (kWh/yr).', '', ''], // 62
                                ['       iii. Seasonal efficiency of the BHS (%).', '', ''], // 63
                                ['       iv. Annual fuel requirement (mass) for the BHS (kg/yr).', '', ''], // 64
                                ['       v. Annual fuel requirement (volume) for the BHS (m3/yr).', '', ''], // 65
                                ['       vi. Fuel consumed by other heat sources (kWh/yr).', '', ''], // 66
                                ['5.2	 i. Is the installation intended for the domestic RHI?', '', ''], // 67
                                ['       ii. Reference number of Energy Performance Certificate', '', ''], // 68
                                ['       iii. Date of Energy Performance Certificate', '', ''], // 69
                                ['       iv. Annual space heating demand (kWh/yr), as shown on the Energy Performance Certificate (EPC) for the building.', '', ''], // 70
                                ['       v. Annual water heating demand (kWh/yr), as shown on the EPC for the building.', '', ''], // 71
                                ['       vi. Maximum qualifying heat supplied by the BHS (kWh/yr).', '', ''], // 72
                                [{ text: '6. Equipment', style: ['bold', 'th'] }, '', ''], // 73
                                ['6.1	 i. Manufacturer of the installed biomass appliance', '', ''], // 74
                                ['       ii. Model of the installed biomass appliance', '', ''], // 75
                                ['       iii. MCS product certification number for the biomass appliance', '', ''], // 76
                                [{ text: '7. Commissioning and handover', style: ['bold', 'th'] }, '', ''], // 77
                                ['7.1	i. Confirm that the controls and system performance of the whole heating and hot water systems have been adjusted to achieve the designed performance.', '', ''], // 78
                                ['7.2	i. Confirm that the document pack includes all the items specified in MIS 3004 6.3 & 6.4.', '', ''], // 79
                                ['7.3	i. Confirm that the all commissioning and handover requirements have been completed', '', ''], // 80
                                [{text: '8. Confirmation', style: ['bold', 'th'] }, '', ''], // 81
                                [{text: '8.1	I confirm that I am authorised to complete this certificate on behalf of the MCS installation company named above and I confirm that:\n(i) the heating installation at the premises whose address is shown above has been designed in accordance with MIS 3004;\n(ii) the design included a heat loss calculation for every room of the building that is heated by the installation;\n(iii) the installation conforms to the design;\n(iv) the installation is in accordance with the guidance given in relevant building regulations and HSE guidance;\n(v) for all system components, the manufacturers’ instructions have been followed.'}, '', ''], // 82
                                [{text: '8.2    Full name:', bold: true}, '', ''], // 83
                                [{text: '8.3    Job title:', bold: true}, '', ''], // 84
                                [{text: '8.4    Date:', bold: true}, '', ''] // 85
                            ]
                        }
                    }
                ],
                styles: {
                    header: {
                        fontSize: 18,
                        bold: true
                    },
                    center: {
                        alignment: 'center'
                    },
                    tableExample: {
                        margin: [0, 10, 0, 0],
                        fontSize: 9
                    },
                    bold: {
                        bold: true
                    },
                    quote: {
                        italics: true
                    },
                    th: {
                        fontSize: 10
                    }
                }
            }
        });
}());