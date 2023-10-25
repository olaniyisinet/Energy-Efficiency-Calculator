
(function () {
  'use strict';
  const degreeDayHash = {
    "AB": {
        "39": 2534.6,
        "52": 2668,
        "postcode": "AB",
        "regionKey": "NE Scotland (Dyce)",
        "AdditionalTemp": -4.2
    },
    "AL": {
        "39": 1931.35,
        "52": 2033,
        "postcode": "AL",
        "regionKey": "Thames Valley (Heathrow)",
        "AdditionalTemp": -2
    },
    "B": {
        "39": 2303.75,
        "52": 2425,
        "postcode": "B",
        "regionKey": "Midland (Elmdon)",
        "AdditionalTemp": -3.4
    },
    "BA": {
        "39": 1743.25,
        "52": 1835,
        "postcode": "BA",
        "regionKey": "Severn Valley (Filton)",
        "AdditionalTemp": -1.7
    },
    "BB": {
        "39": 2116.6,
        "52": 2228,
        "postcode": "BB",
        "regionKey": "W Pennines (Ringway)",
        "AdditionalTemp": -2.2
    },
    "BD": {
        "39": 2191.65,
        "52": 2307,
        "postcode": "BD",
        "regionKey": "E Pennines (Finningley)",
        "AdditionalTemp": -2.5
    },
    "BH": {
        "39": 2112.7999999999997,
        "52": 2224,
        "postcode": "BH",
        "regionKey": "Southern (Hurn)",
        "AdditionalTemp": -1.5
    },
    "BL": {
        "39": 2116.6,
        "52": 2228,
        "postcode": "BL",
        "regionKey": "W Pennines (Ringway)",
        "AdditionalTemp": -2.2
    },
    "BN": {
        "39": 2112.7999999999997,
        "52": 2224,
        "postcode": "BN",
        "regionKey": "Southern (Hurn)",
        "AdditionalTemp": -2.1
    },
    "BR": {
        "39": 2142.25,
        "52": 2255,
        "postcode": "BR",
        "regionKey": "South-eastern (Gatwick)",
        "AdditionalTemp": -3.2
    },
    "BS": {
        "39": 1743.25,
        "52": 1835,
        "postcode": "BS",
        "regionKey": "Severn Valley (Filton)",
        "AdditionalTemp": -1.7
    },
    "BT": {
        "39": 2242,
        "52": 2360,
        "postcode": "BT",
        "regionKey": "Northern Ireland (Belfast)",
        "AdditionalTemp": -1.2
    },
    "CA": {
        "39": 2268.6,
        "52": 2388,
        "postcode": "CA",
        "regionKey": "North-western (Carlisle)",
        "AdditionalTemp": -3.7
    },
    "CB": {
        "39": 1931.35,
        "52": 2033,
        "postcode": "CB",
        "regionKey": "Thames Valley (Heathrow)",
        "AdditionalTemp": -2.5
    },
    "CF": {
        "39": 1743.25,
        "52": 1835,
        "postcode": "CF",
        "regionKey": "Severn Valley (Filton)",
        "AdditionalTemp": -1.6
    },
    "CH": {
        "39": 2116.6,
        "52": 2228,
        "postcode": "CH",
        "regionKey": "W Pennines (Ringway)",
        "AdditionalTemp": -2.2
    },
    "CM": {
        "39": 1931.35,
        "52": 2033,
        "postcode": "CM",
        "regionKey": "Thames Valley (Heathrow)",
        "AdditionalTemp": -2.3
    },
    "CO": {
        "39": 2141.2999999999997,
        "52": 2254,
        "postcode": "CO",
        "regionKey": "E Anglia (Honington)",
        "AdditionalTemp": -2.3
    },
    "CR": {
        "39": 2112.7999999999997,
        "52": 2224,
        "postcode": "CR",
        "regionKey": "Southern (Hurn)",
        "AdditionalTemp": -2
    },
    "CT": {
        "39": 2142.25,
        "52": 2255,
        "postcode": "CT",
        "regionKey": "South-eastern (Gatwick)",
        "AdditionalTemp": -3.2
    },
    "CV": {
        "39": 2303.75,
        "52": 2425,
        "postcode": "CV",
        "regionKey": "Midland (Elmdon)",
        "AdditionalTemp": -3.4
    },
    "CW": {
        "39": 2116.6,
        "52": 2228,
        "postcode": "CW",
        "regionKey": "W Pennines (Ringway)",
        "AdditionalTemp": -2.7
    },
    "DA": {
        "39": 2142.25,
        "52": 2255,
        "postcode": "DA",
        "regionKey": "South-eastern (Gatwick)",
        "AdditionalTemp": -3.2
    },
    "DD": {
        "39": 2448.15,
        "52": 2577,
        "postcode": "DD",
        "regionKey": "E Scotland (Leuchars)",
        "AdditionalTemp": -3.8
    },
    "DE": {
        "39": 2116.6,
        "52": 2228,
        "postcode": "DE",
        "regionKey": "W Pennines (Ringway)",
        "AdditionalTemp": -2.2
    },
    "DG": {
        "39": 2358.85,
        "52": 2483,
        "postcode": "DG",
        "regionKey": "Borders (Boulmer)",
        "AdditionalTemp": -3.8
    },
    "DH": {
        "39": 2251.5,
        "52": 2370,
        "postcode": "DH",
        "regionKey": "North-eastern (Leeming)",
        "AdditionalTemp": -3.7
    },
    "DL": {
        "39": 2268.6,
        "52": 2388,
        "postcode": "DL",
        "regionKey": "North-western (Carlisle)",
        "AdditionalTemp": -3.7
    },
    "DN": {
        "39": 2191.65,
        "52": 2307,
        "postcode": "DN",
        "regionKey": "E Pennines (Finningley)",
        "AdditionalTemp": -3.4
    },
    "DT": {
        "39": 2112.7999999999997,
        "52": 2224,
        "postcode": "DT",
        "regionKey": "Southern (Hurn)",
        "AdditionalTemp": -1.7
    },
    "DY": {
        "39": 2303.75,
        "52": 2425,
        "postcode": "DY",
        "regionKey": "Midland (Elmdon)",
        "AdditionalTemp": -3.4
    },
    "E": {
        "39": 1931.35,
        "52": 2033,
        "postcode": "E",
        "regionKey": "Thames Valley (Heathrow)",
        "AdditionalTemp": -1.8
    },
    "EC": {
        "39": 1931.35,
        "52": 2033,
        "postcode": "EC",
        "regionKey": "Thames Valley (Heathrow)",
        "AdditionalTemp": -1.8
    },
    "EH": {
        "39": 2448.15,
        "52": 2577,
        "postcode": "EH",
        "regionKey": "E Scotland (Leuchars)",
        "AdditionalTemp": -3.4
    },
    "EN": {
        "39": 2142.25,
        "52": 2255,
        "postcode": "EN",
        "regionKey": "South-eastern (Gatwick)",
        "AdditionalTemp": -2.1
    },
    "EX": {
        "39": 1765.1,
        "52": 1858,
        "postcode": "EX",
        "regionKey": "South-western (Plymouth)",
        "AdditionalTemp": -1.5
    },
    "FK": {
        "39": 2448.15,
        "52": 2577,
        "postcode": "FK",
        "regionKey": "E Scotland (Leuchars)",
        "AdditionalTemp": -3.7
    },
    "FY": {
        "39": 2268.6,
        "52": 2388,
        "postcode": "FY",
        "regionKey": "North-western (Carlisle)",
        "AdditionalTemp": -2.2
    },
    "G": {
        "39": 2369.2999999999997,
        "52": 2494,
        "postcode": "G",
        "regionKey": "W Scotland (Abbotsinch)",
        "AdditionalTemp": -3.9
    },
    "GL": {
        "39": 2303.75,
        "52": 2425,
        "postcode": "GL",
        "regionKey": "Midland (Elmdon)",
        "AdditionalTemp": -3.3
    },
    "GU": {
        "39": 1931.35,
        "52": 2033,
        "postcode": "GU",
        "regionKey": "Thames Valley (Heathrow)",
        "AdditionalTemp": -2.2
    },
    "GY": {
        "39": 1710,
        "52": 1800,
        "postcode": "GY",
        "regionKey": "South-eastern (Gatwick)",
        "AdditionalTemp": -1
    },
    "HA": {
        "39": 1931.35,
        "52": 2033,
        "postcode": "HA",
        "regionKey": "Thames Valley (Heathrow)",
        "AdditionalTemp": -1.8
    },
    "HD": {
        "39": 2191.65,
        "52": 2307,
        "postcode": "HD",
        "regionKey": "E Pennines (Finningley)",
        "AdditionalTemp": -3.5
    },
    "HG": {
        "39": 2191.65,
        "52": 2307,
        "postcode": "HG",
        "regionKey": "E Pennines (Finningley)",
        "AdditionalTemp": -3.5
    },
    "HP": {
        "39": 1931.35,
        "52": 2033,
        "postcode": "HP",
        "regionKey": "Thames Valley (Heathrow)",
        "AdditionalTemp": -2
    },
    "HR": {
        "39": 2303.75,
        "52": 2425,
        "postcode": "HR",
        "regionKey": "Midland (Elmdon)",
        "AdditionalTemp": -2
    },
    "HS": {
        "39": 1710,
        "52": 1800,
        "postcode": "HS",
        "regionKey": "NW Scotland (Stornoway)",
        "AdditionalTemp": -1
    },
    "HU": {
        "39": 2191.65,
        "52": 2307,
        "postcode": "HU",
        "regionKey": "E Pennines (Finningley)",
        "AdditionalTemp": -3
    },
    "HX": {
        "39": 2116.6,
        "52": 2228,
        "postcode": "HX",
        "regionKey": "W Pennines (Ringway)",
        "AdditionalTemp": -2.5
    },
    "IG": {
        "39": 1931.35,
        "52": 2033,
        "postcode": "IG",
        "regionKey": "Thames Valley (Heathrow)",
        "AdditionalTemp": -1.8
    },
    "IM": {
        "39": 2116.6,
        "52": 2228,
        "postcode": "IM",
        "regionKey": "W Pennines (Ringway)",
        "AdditionalTemp": -2.5
    },
    "IP": {
        "39": 2141.2999999999997,
        "52": 2254,
        "postcode": "IP",
        "regionKey": "E Anglia (Honington)",
        "AdditionalTemp": -2.3
    },
    "IV": {
        "39": 2534.6,
        "52": 2668,
        "postcode": "IV",
        "regionKey": "NE Scotland (Dyce)",
        "AdditionalTemp": -4
    },
    "JE": {
        "39": 1710,
        "52": 1800,
        "postcode": "JE",
        "regionKey": "South-eastern (Gatwick)",
        "AdditionalTemp": -1
    },
    "KA": {
        "39": 2369.2999999999997,
        "52": 2494,
        "postcode": "KA",
        "regionKey": "W Scotland (Abbotsinch)",
        "AdditionalTemp": -3.7
    },
    "KT": {
        "39": 1931.35,
        "52": 2033,
        "postcode": "KT",
        "regionKey": "Thames Valley (Heathrow)",
        "AdditionalTemp": -1.8
    },
    "KW": {
        "39": 2534.6,
        "52": 2668,
        "postcode": "KW",
        "regionKey": "NE Scotland (Dyce)",
        "AdditionalTemp": -4.2
    },
    "KY": {
        "39": 2448.15,
        "52": 2577,
        "postcode": "KY",
        "regionKey": "E Scotland (Leuchars)",
        "AdditionalTemp": -3.4
    },
    "L": {
        "39": 2116.6,
        "52": 2228,
        "postcode": "L",
        "regionKey": "W Pennines (Ringway)",
        "AdditionalTemp": -2.4
    },
    "LA": {
        "39": 2268.6,
        "52": 2388,
        "postcode": "LA",
        "regionKey": "North-western (Carlisle)",
        "AdditionalTemp": -2.2
    },
    "LD": {
        "39": 2052.95,
        "52": 2161,
        "postcode": "LD",
        "regionKey": "Wales (Aberporth)",
        "AdditionalTemp": -2.9
    },
    "LE": {
        "39": 2303.75,
        "52": 2425,
        "postcode": "LE",
        "regionKey": "Midland (Elmdon)",
        "AdditionalTemp": -3
    },
    "LL": {
        "39": 2116.6,
        "52": 2228,
        "postcode": "LL",
        "regionKey": "W Pennines (Ringway)",
        "AdditionalTemp": -3
    },
    "LN": {
        "39": 2191.65,
        "52": 2307,
        "postcode": "LN",
        "regionKey": "E Pennines (Finningley)",
        "AdditionalTemp": -3
    },
    "LS": {
        "39": 2191.65,
        "52": 2307,
        "postcode": "LS",
        "regionKey": "E Pennines (Finningley)",
        "AdditionalTemp": -2.5
    },
    "LU": {
        "39": 1931.35,
        "52": 2033,
        "postcode": "LU",
        "regionKey": "Thames Valley (Heathrow)",
        "AdditionalTemp": -2.4
    },
    "M": {
        "39": 2116.6,
        "52": 2228,
        "postcode": "M",
        "regionKey": "W Pennines (Ringway)",
        "AdditionalTemp": -2.2
    },
    "ME": {
        "39": 1931.35,
        "52": 2033,
        "postcode": "ME",
        "regionKey": "Thames Valley (Heathrow)",
        "AdditionalTemp": -1.8
    },
    "MK": {
        "39": 2303.75,
        "52": 2425,
        "postcode": "MK",
        "regionKey": "Midland (Elmdon)",
        "AdditionalTemp": -3.4
    },
    "ML": {
        "39": 2369.2999999999997,
        "52": 2494,
        "postcode": "ML",
        "regionKey": "W Scotland (Abbotsinch)",
        "AdditionalTemp": -3.9
    },
    "N": {
        "39": 1931.35,
        "52": 2033,
        "postcode": "N",
        "regionKey": "Thames Valley (Heathrow)",
        "AdditionalTemp": -1.8
    },
    "NE": {
        "39": 2251.5,
        "52": 2370,
        "postcode": "NE",
        "regionKey": "North-eastern (Leeming)",
        "AdditionalTemp": -3.4
    },
    "NG": {
        "39": 2141.2999999999997,
        "52": 2254,
        "postcode": "NG",
        "regionKey": "E Anglia (Honington)",
        "AdditionalTemp": -3.2
    },
    "NN": {
        "39": 2303.75,
        "52": 2425,
        "postcode": "NN",
        "regionKey": "Midland (Elmdon)",
        "AdditionalTemp": -3
    },
    "NP": {
        "39": 2303.75,
        "52": 2425,
        "postcode": "NP",
        "regionKey": "Midland (Elmdon)",
        "AdditionalTemp": -1.6
    },
    "NR": {
        "39": 2141.2999999999997,
        "52": 2254,
        "postcode": "NR",
        "regionKey": "E Anglia (Honington)",
        "AdditionalTemp": -2.4
    },
    "NW": {
        "39": 1931.35,
        "52": 2033,
        "postcode": "NW",
        "regionKey": "Thames Valley (Heathrow)",
        "AdditionalTemp": -1.8
    },
    "OL": {
        "39": 2116.6,
        "52": 2228,
        "postcode": "OL",
        "regionKey": "W Pennines (Ringway)",
        "AdditionalTemp": -3.2
    },
    "OX": {
        "39": 2303.75,
        "52": 2425,
        "postcode": "OX",
        "regionKey": "Midland (Elmdon)",
        "AdditionalTemp": -2.4
    },
    "PA": {
        "39": 2369.2999999999997,
        "52": 2494,
        "postcode": "PA",
        "regionKey": "W Scotland (Abbotsinch)",
        "AdditionalTemp": -4
    },
    "PE": {
        "39": 2141.2999999999997,
        "52": 2254,
        "postcode": "PE",
        "regionKey": "E Anglia (Honington)",
        "AdditionalTemp": -3
    },
    "PH": {
        "39": 2534.6,
        "52": 2668,
        "postcode": "PH",
        "regionKey": "NE Scotland (Dyce)",
        "AdditionalTemp": -3.8
    },
    "PL": {
        "39": 1765.1,
        "52": 1858,
        "postcode": "PL",
        "regionKey": "South-western (Plymouth)",
        "AdditionalTemp": -0.2
    },
    "PO": {
        "39": 2112.7999999999997,
        "52": 2224,
        "postcode": "PO",
        "regionKey": "Southern (Hurn)",
        "AdditionalTemp": -1.8
    },
    "PR": {
        "39": 2268.6,
        "52": 2388,
        "postcode": "PR",
        "regionKey": "North-western (Carlisle)",
        "AdditionalTemp": -3.2
    },
    "RG": {
        "39": 1931.35,
        "52": 2033,
        "postcode": "RG",
        "regionKey": "Thames Valley (Heathrow)",
        "AdditionalTemp": -2.2
    },
    "RH": {
        "39": 1931.35,
        "52": 2033,
        "postcode": "RH",
        "regionKey": "Thames Valley (Heathrow)",
        "AdditionalTemp": -1.9
    },
    "RM": {
        "39": 1931.35,
        "52": 2033,
        "postcode": "RM",
        "regionKey": "Thames Valley (Heathrow)",
        "AdditionalTemp": -1.8
    },
    "S": {
        "39": 2116.6,
        "52": 2228,
        "postcode": "S",
        "regionKey": "W Pennines (Ringway)",
        "AdditionalTemp": -2.8
    },
    "SA": {
        "39": 2052.95,
        "52": 2161,
        "postcode": "SA",
        "regionKey": "Wales (Aberporth)",
        "AdditionalTemp": -1.6
    },
    "SE": {
        "39": 1931.35,
        "52": 2033,
        "postcode": "SE",
        "regionKey": "Thames Valley (Heathrow)",
        "AdditionalTemp": -1.8
    },
    "SG": {
        "39": 1931.35,
        "52": 2033,
        "postcode": "SG",
        "regionKey": "Thames Valley (Heathrow)",
        "AdditionalTemp": -2
    },
    "SK": {
        "39": 2116.6,
        "52": 2228,
        "postcode": "SK",
        "regionKey": "W Pennines (Ringway)",
        "AdditionalTemp": -2.9
    },
    "SL": {
        "39": 1931.35,
        "52": 2033,
        "postcode": "SL",
        "regionKey": "Thames Valley (Heathrow)",
        "AdditionalTemp": -2
    },
    "SM": {
        "39": 1931.35,
        "52": 2033,
        "postcode": "SM",
        "regionKey": "Thames Valley (Heathrow)",
        "AdditionalTemp": -1.8
    },
    "SN": {
        "39": 2303.75,
        "52": 2425,
        "postcode": "SN",
        "regionKey": "Midland (Elmdon)",
        "AdditionalTemp": -2.2
    },
    "SO": {
        "39": 2112.7999999999997,
        "52": 2224,
        "postcode": "SO",
        "regionKey": "Southern (Hurn)",
        "AdditionalTemp": -1.8
    },
    "SP": {
        "39": 2112.7999999999997,
        "52": 2224,
        "postcode": "SP",
        "regionKey": "Southern (Hurn)",
        "AdditionalTemp": -1.8
    },
    "SR": {
        "39": 2251.5,
        "52": 2370,
        "postcode": "SR",
        "regionKey": "North-eastern (Leeming)",
        "AdditionalTemp": -3.7
    },
    "SS": {
        "39": 1931.35,
        "52": 2033,
        "postcode": "SS",
        "regionKey": "Thames Valley (Heathrow)",
        "AdditionalTemp": -2.3
    },
    "ST": {
        "39": 2116.6,
        "52": 2228,
        "postcode": "ST",
        "regionKey": "W Pennines (Ringway)",
        "AdditionalTemp": -3
    },
    "SW": {
        "39": 1931.35,
        "52": 2033,
        "postcode": "SW",
        "regionKey": "Thames Valley (Heathrow)",
        "AdditionalTemp": -1.8
    },
    "SY": {
        "39": 2052.95,
        "52": 2161,
        "postcode": "SY",
        "regionKey": "Wales (Aberporth)",
        "AdditionalTemp": -3.3
    },
    "TA": {
        "39": 1743.25,
        "52": 1835,
        "postcode": "TA",
        "regionKey": "Severn Valley (Filton)",
        "AdditionalTemp": -2.1
    },
    "TD": {
        "39": 2358.85,
        "52": 2483,
        "postcode": "TD",
        "regionKey": "Borders (Boulmer)",
        "AdditionalTemp": -3.8
    },
    "TF": {
        "39": 2303.75,
        "52": 2425,
        "postcode": "TF",
        "regionKey": "Midland (Elmdon)",
        "AdditionalTemp": -3.4
    },
    "TN": {
        "39": 2142.25,
        "52": 2255,
        "postcode": "TN",
        "regionKey": "South-eastern (Gatwick)",
        "AdditionalTemp": -3.2
    },
    "TQ": {
        "39": 1765.1,
        "52": 1858,
        "postcode": "TQ",
        "regionKey": "South-western (Plymouth)",
        "AdditionalTemp": -1.3
    },
    "TR": {
        "39": 1765.1,
        "52": 1858,
        "postcode": "TR",
        "regionKey": "South-western (Plymouth)",
        "AdditionalTemp": -1.4
    },
    "TS": {
        "39": 2251.5,
        "52": 2370,
        "postcode": "TS",
        "regionKey": "North-eastern (Leeming)",
        "AdditionalTemp": -2.9
    },
    "TW": {
        "39": 2092.85,
        "52": 2203,
        "postcode": "TW",
        "regionKey": "Thames Valley (Heathrow)",
        "AdditionalTemp": -1.8
    },
    "UB": {
        "39": 2092.85,
        "52": 2203,
        "postcode": "UB",
        "regionKey": "Thames Valley (Heathrow)",
        "AdditionalTemp": -1.8
    },
    "W": {
        "39": 2092.85,
        "52": 2203,
        "postcode": "W",
        "regionKey": "Thames Valley (Heathrow)",
        "AdditionalTemp": -1.8
    },
    "WA": {
        "39": 2116.6,
        "52": 2228,
        "postcode": "WA",
        "regionKey": "W Pennines (Ringway)",
        "AdditionalTemp": -2.1
    },
    "WC": {
        "39": 2092.85,
        "52": 2203,
        "postcode": "WC",
        "regionKey": "Thames Valley (Heathrow)",
        "AdditionalTemp": -1.8
    },
    "WD": {
        "39": 2092.85,
        "52": 2203,
        "postcode": "WD",
        "regionKey": "Thames Valley (Heathrow)",
        "AdditionalTemp": -2
    },
    "WF": {
        "39": 2191.65,
        "52": 2307,
        "postcode": "WF",
        "regionKey": "E Pennines (Finningley)",
        "AdditionalTemp": -2.5
    },
    "WN": {
        "39": 2116.6,
        "52": 2228,
        "postcode": "WN",
        "regionKey": "W Pennines (Ringway)",
        "AdditionalTemp": -2.1
    },
    "WR": {
        "39": 2303.75,
        "52": 2425,
        "postcode": "WR",
        "regionKey": "Midland (Elmdon)",
        "AdditionalTemp": -3.3
    },
    "WS": {
        "39": 2303.75,
        "52": 2425,
        "postcode": "WS",
        "regionKey": "Midland (Elmdon)",
        "AdditionalTemp": -3.4
    },
    "WV": {
        "39": 2303.75,
        "52": 2425,
        "postcode": "WV",
        "regionKey": "Midland (Elmdon)",
        "AdditionalTemp": -3.4
    },
    "YO": {
        "39": 2191.65,
        "52": 2307,
        "postcode": "YO",
        "regionKey": "E Pennines (Finningley)",
        "AdditionalTemp": -3.7
    },
    "ZE": {
        "39": 2534.6,
        "52": 2668,
        "postcode": "ZE",
        "regionKey": "NE Scotland (Dyce)",
        "AdditionalTemp": -3
    }
}
  angular.module('cloudheatengineer')
    .controller('SummaryController', SummaryController)
    .controller('ModalSummaryController', ModalSummaryController)
    .controller('ModalSurveysController', ModalSurveysController)
    .controller('ModalEditController', ModalEditController)
    .controller('ModalEditTypeController', ModalEditTypeController)
    .controller('ModalCommentController', ModalCommentController)
    .controller('ModalDegreeDataController', ModalDegreeDataController)
    .controller('ModalCustomNameController', ModalCustomNameController)
    .controller('ModalAdjustController', ModalAdjustController)
    .controller('ModalNotesInstanceController', ModalNotesInstanceController)
    .controller('ModalNewRoomController', ModalNewRoomController)
    .controller('ModalConsultantController', ModalConsultantController)
    .controller('ModalHeatSourceInstanceController', ModalHeatSourceInstanceController)
    .controller('ModalValueCheckerInstanceController', ModalValueCheckerInstanceController)
    .controller('HeatSummaryReviewController', HeatSummaryReviewController)
    .controller('SummaryResultsController', SummaryResultsController)
    .controller('TechnologySummaryController', TechnologySummaryController)
    .controller("ModalEditTemperatureController", ModalEditTemperatureController)
    .controller('ModalEditDegreeDayController', ModalEditDegreeDayController);

  /**
   * Function for Summary Controller
   */
  var selectedSurvay
  SummaryController.$inject = ['lodash', '_', '$scope', '$rootScope', '$routeParams', '$location', '$modal', 'apiService', 'modalService', 'summaryHelperService', 'commonService', 'alertService', 'materialService', 'calculationService', 'surveyService', '$window'];

  function SummaryController (lodash, _, $scope, $rootScope, $routeParams, $location, $modal, apiService, modalService, summaryHelperService, commonService, alertService, materialService, calculationService, surveyService, $window) {
    $window.document.title = 'Summary';
    var tabClasses;
    var currentPostcode;
    var regexForUkPostcode = /^([A-Za-z][A-Ha-hJ-Yj-y]?[0-9][A-Za-z0-9]?[ ]?[0-9][A-Za-z]{2}|[Gg][Ii][Rr] 0[Aa]{2})$/;

    var regexForUkPostCodeLetters = /^[A-Za-z]{1,2}/;
    var cachedAddressList = [];
    $scope.suggestedAddressList = [];

    $scope.postcodeInputFocus = false;

    $scope.showTable = false;
    $scope.loading = false
    $scope.valueChanged = false;
    $scope.runCalculation;
    $scope.user = JSON.parse(window.localStorage.getItem('user'))
    $scope.pageSelect = false
    if ($routeParams == 3) {
      $scope.pageSelect = true
    }
    $rootScope.showHeader = false;
    $rootScope.showFooter = false;
    $rootScope.heatmanagerview = true;


    $scope.maxFlowTempList = ["35", "40", "45"]
    $scope.tabNum
    $scope.nextBtn = true
    $scope.step1Validation = true
    $scope.step2Validation = true
    $scope.step3Validation = true
    $scope.step4Validation = true
    $scope.step5Validation = false
    $scope.step6Validation = true
    $scope.step7Validation = false
    $scope.step8Validation = false
    $scope.step9Validation = false
    $scope.step10Validation = false



    $scope.step2Disable = false
    $scope.step3Disable = false
    $scope.step4Disable = false
    $scope.step5Disable = false
    $scope.step6Disable = false
    $scope.step7Disable = false
    $scope.step8Disable = false
    $scope.step9Disable = false
    $scope.step10Disable = false

    function initTabs () {
      tabClasses = ["", "", "", ""];
    }
    function roundTO2Decimal (value) {
      if(typeof value === "string") value = Number(value)
      return Math.round(value * 100) / 100;
    }

    $scope.disableDay = {
      value: true
    }
    $scope.editedDay = {
      value: ""
    }

    $scope.editedTemp = {
      value: ""
    }
    $scope.disabled = {
      value: true
    }
    $scope.onBlurInput = () =>{
      $scope.suggestedAddressList = [];
    }

    $scope.getCachedList = () => {
      $scope.suggestedAddressList = cachedAddressList;
    }

    $scope.getSuggestionList = function (postcode, inputValueChanged) {
      if(!postcode) return;
      const removedSpaces = postcode.replace(/\s/g, '');
      if(postcode.length < 7 && !regexForUkPostcode.test(postcode)) {
        alertService('warning', 'Not a valid UK postcode');
        return;
      }

      apiService.get("getAddressFromPostcode", { postcode: removedSpaces }).then(function (response) {
       if(response.data.suggestions.length == 0){
        alertService('warning', 'Address list not found');
       }
        $scope.suggestedAddressList = response.data.suggestions;

      }, commonService.onError);
      if(inputValueChanged) inputValueChanged();
    }

    $scope.inputValueChanged = function () {
      $scope.valueChanged = true;
    }

    function getGroundTemp (postCodeLetter) {
      var groudTempList = $rootScope.cloud_data.ground_temp;
      var filGroundTemp = groudTempList.filter(function (val) {
        return val.post_code == postCodeLetter;
      });
      return filGroundTemp;
    }

    $scope.selectAddress = function (addressId) {

      apiService.get("getDetailsFromId", { id: addressId }).then(function (response) {
        if(!response?.data) return alertService.error("Address not found");

        const {line_1, line_2, line_3, locality, postcode, elevation, town_or_city, county} = response.data;

        let addLine2 = line_2 ? line_2: '';
        addLine2 +=  line_3 ? ', ' + line_3: '';
        let addLine3 = town_or_city ? town_or_city: '';
        addLine3 += county ? ', ' + county : '';

        $scope.survey.surveys.address_one = line_1;
        $scope.survey.surveys.address_two = addLine2;
        $scope.survey.surveys.address_three = addLine3;

        let addressLoc = addLine3 ? addLine3 : line_1;


        const postcodeLetters = postcode.match(regexForUkPostCodeLetters)[0];
        const degreeDayObj = degreeDayHash[postcodeLetters.toUpperCase()]
        $scope.degreeDayObj = degreeDayObj;
        const weekType = $scope.survey.surveys.weeks === 'low_weeks' ? '39' : '52'

        const externalTemperature = degreeDayObj.AdditionalTemp;
        const additionalTemp = roundTO2Decimal(elevation * (-0.3 / 50));
        const externalDesignTemperature = roundTO2Decimal(externalTemperature + additionalTemp);

        $scope.survey.surveys.external_temperature = {location: addressLoc, value: externalTemperature};
        $scope.survey.surveys.altitude_adjustment = {meter: (roundTO2Decimal(elevation)).toString(), value: additionalTemp}
        $scope.survey.surveys.external_design_temperature = externalDesignTemperature;

        if(!$scope.survey.surveys.region || $scope.survey.surveys.region == '') {
          $scope.survey.surveys.region = {};
        }
        $scope.survey.surveys.region.value = degreeDayObj[weekType];
        $scope.survey.surveys.region.region = degreeDayObj.regionKey;
        $scope.survey.surveys.region.region_name = degreeDayObj.regionKey;

        // ground Temp
        const ground_temp = getGroundTemp(postcodeLetters.toUpperCase());
        if(ground_temp.length > 0) {
          $scope.survey.surveys.region.ground_temp = ground_temp[0].ground_temp
        } else {
          alertService('warning', 'Ground Temperature for postcode not found');
        }

        $scope.disableDay.value = false
        $scope.editedDay.value = ""
        $scope.disableDay.value = true

        $scope.suggestedAddressList = [];
        $scope.valueChanged = true;
      }, commonService.onError);
    }

    $scope.openEditTempModal = function () {
      selectedSurvay = $scope.survey
      var modalOptions = {};
      modalOptions.templateUrl = '/partials/views/summary/components/_modal_edit_temperature';
      modalOptions.controller = 'ModalEditTemperatureController';
      modalOptions.size = 'md';
      var modalInstance = $modal.open({
        animation: true,
        templateUrl: modalOptions.templateUrl,
        controller: modalOptions.controller,
        size: modalOptions.size,
        resolve: {
          data: function () {
            return {
              survey: $scope.survey,
              editedTemp: $scope.editedTemp,
              disabled: $scope.disabled
            }

          }
        }
      });
      modalInstance.result.then(function (comment) {
        // TODO: api save code should be moved here
      }, function () { });

    }

    $scope.openDegreeDayModal = function (){
      selectedSurvay = $scope.survey
      var modalOptions = {};
      modalOptions.templateUrl = '/partials/views/summary/components/_modal_edit_degree_data';
      modalOptions.controller = 'ModalEditDegreeDayController';
      modalOptions.size = 'md';
      var modalInstance = $modal.open({
        animation: true,
        templateUrl: modalOptions.templateUrl,
        controller: modalOptions.controller,
        size: modalOptions.size,
        resolve: {
          data: function () {
            return {
              survey: $scope.survey,
              disableDay: $scope.disableDay,
              editedDay: $scope.editedDay,


            }
          }
        }
      });
      modalInstance.result.then(function (comment) {
        // TODO: api save code should be moved here
      }, function () { });

    }

    $scope.setValueChanged = function () {
      $scope.valueChanged = true;
    }
    $scope.setValueRunCalculation = function() {
      $scope.runCalculation = true;
    }

    $scope.openComment = function (step) {
      selectedSurvay = $scope.survey
      var modalOptions = {};
      modalOptions.templateUrl = '/partials/views/summary/components/_modal_comment';
      modalOptions.controller = 'ModalCommentController';
      modalOptions.size = 'md';
      var modalInstance = $modal.open({
        animation: true,
        templateUrl: modalOptions.templateUrl,
        controller: modalOptions.controller,
        size: modalOptions.size,
        resolve: {
          data: function () {
            return {
              step: step,
              survey: $scope.survey
            }
          }
        }
      });
      modalInstance.result.then(function (comment) {
        // TODO: api save code should be moved here
      }, function () { });

    }
    $scope.nextTab = function (tabNum) {
      var errAlertContent = "Please fill all the required fields/Data";
      var errAlertRoomHeightCannotZero = "Room Height cannot be 0";
      $scope.page = tabNum + 1;
      if ($scope.tabNum == 1) {
        $scope.survey.surveys.page = 'Step 1';
        if ($scope.survey.surveys.region.region == 'Custom Entry') {
          //getground
          // var postcodeLetters = $scope.survey.surveys.post_code.match(regexForUkPostCodeLetters);
          // if(postcodeLetters) {
          //   var ground_temp = getGroundTemp(postcodeLetters[0].toUpperCase());
          //   if(ground_temp.length > 0) {
          //     $scope.survey.surveys.region.ground_temp = ground_temp[0].ground_temp
          //   }
          // }
          if (!$scope.survey.surveys.region.value || !$scope.survey.surveys.region.ground_temp) {
            alertService('danger', errAlertContent, '')
            $scope.step1Validation = true
            $scope.step2Disable = true
            $scope.step3Disable = true
            $scope.step4Disable = true
            $scope.step5Disable = true
            $scope.step6Disable = true
            $scope.step7Disable = true
            $scope.step8Disable = true
            $scope.step9Disable = true
            $scope.step10Disable = true
            return
          } else {
            $scope.step1Validation = false
            $scope.step2Disable = false
            $scope.setActiveTab(tabNum + 1)
          }
        } else if ($scope.survey.surveys.region.region == '' || $scope.survey.surveys.region.region == undefined || $scope.survey.surveys.region.region == null || $scope.location_name == '' || $scope.location_name == undefined || $scope.location_name == null || $scope.meter_name == '' || $scope.meter_name == undefined || $scope.meter_name == null) {

          if (!$scope.survey.surveys.region.region_name || !$scope.survey.surveys.region.value || !$scope.survey.surveys.region.ground_temp) {
            alertService('danger', errAlertContent, '')
            $scope.step1Validation = true
            $scope.step2Disable = true
            $scope.step3Disable = true
            $scope.step4Disable = true
            $scope.step5Disable = true
            $scope.step6Disable = true
            $scope.step7Disable = true
            $scope.step8Disable = true
            $scope.step9Disable = true
            $scope.step10Disable = true
            return
          } else {
            $scope.step1Validation = false
            $scope.step2Disable = false
            $scope.setActiveTab(tabNum + 1)
          }
        } else if (!$scope.survey.surveys.project_name || !$scope.survey.surveys.title || !$scope.survey.surveys.client_name || !$scope.survey.surveys.address_one || !$scope.survey.surveys.post_code) {
          alertService('danger', errAlertContent, '')
          $scope.step1Validation = true
          $scope.step2Disable = true
          $scope.step3Disable = true
          $scope.step4Disable = true
          $scope.step5Disable = true
          $scope.step6Disable = true
          $scope.step7Disable = true
          $scope.step8Disable = true
          $scope.step9Disable = true
          $scope.step10Disable = true

        } else if ($scope.location_name == 'Custom Entry') {
          if (!$scope.custom_locations.custom_location_name || !$scope.custom_locations.custom_location) {
            alertService('danger', errAlertContent, '')
            $scope.step1Validation = true
            $scope.step2Disable = true
            $scope.step3Disable = true
            $scope.step4Disable = true
            $scope.step5Disable = true
            $scope.step6Disable = true
            $scope.step7Disable = true
            $scope.step8Disable = true
            $scope.step9Disable = true
            $scope.step10Disable = true
            return
          } else {
            $scope.step1Validation = false
            $scope.step2Disable = false
            $scope.setActiveTab(tabNum + 1)

          }
        }
        else {
          $scope.step1Validation = false
          $scope.step2Disable = false
          $scope.setActiveTab(tabNum + 1)
        }
      } else if (tabNum == 2) {
        $scope.survey.surveys.page = 'Step 2';

        if ($scope.survey.surveys.proposed_install_type.toLowerCase() == "biomass") {
          if (!$scope.survey.surveys.biomass_type) {
            $scope.step2Validation = true
            $scope.step3Disable = true
            $scope.step4Disable = true
            $scope.step5Disable = true
            $scope.step6Disable = true
            $scope.step7Disable = true
            $scope.step8Disable = true
            $scope.step9Disable = true
            $scope.step10Disable = true
            alertService('danger', errAlertContent, '')
          } else {
            $scope.step2Validation = false
            $scope.step3Disable = false
            $scope.setActiveTab(tabNum + 1)
          }
        } else {
          $scope.setActiveTab(tabNum + 1)
          $scope.step2Validation = false
          $scope.step3Disable = false
        }
      } else if (tabNum == 3) {
        $scope.survey.surveys.page = 'Step 3';
        if ($scope.validateCustom.hasUndefinedCustomRoomName) {
          alertService('danger', errAlertContent, '')
          $scope.step3Validation = true
          $scope.step4Disable = true
          $scope.step5Disable = true
          $scope.step6Disable = true
          $scope.step7Disable = true
          $scope.step8Disable = true
          $scope.step9Disable = true
          $scope.step10Disable = true
        } else if (!ValidateRooms(false)) {
          alertService('danger', errAlertContent, '')
          $scope.step3Validation = true
          $scope.step4Disable = true
        } else if (!ValidateRoomsAbove(false)) {
          alertService('danger', errAlertContent, '')
          $scope.step3Validation = true
          $scope.step4Disable = true
        } else if (!ValidateRoomsBelow(false)) {
          alertService('danger', errAlertContent, '')
          $scope.step3Validation = true
          $scope.step4Disable = true
        } else {
          $scope.step3Validation = false
          $scope.step4Disable = false
          $scope.setActiveTab(tabNum + 1)
        }
      } else if (tabNum == 4) {
        $scope.survey.surveys.page = 'Step 4';
        var count = 0
        for (let i = 0; i < $scope.survey.surveys.rooms.length; i++) {
          let room = $scope.survey.surveys.rooms[i]

          if (room.floor_area == 0) {

            $scope.step4Validation = true
            $scope.step5Disable = true
            $scope.step6Disable = true
            $scope.step7Disable = true
            $scope.step8Disable = true
            $scope.step9Disable = true
            $scope.step10Disable = true
            alertService('danger', errAlertContent, '')
            count++
          } else if (room.is_the_room_complex != 'YES') {
            if ((!room.external_wall.type.b.length && room.external_wall.type.b.window_area) || (!room.external_wall.type.a.length && room.external_wall.type.a.window_area)) {
              $scope.step4Validation = true
              $scope.step5Disable = true
              $scope.step6Disable = true
              $scope.step7Disable = true
              $scope.step8Disable = true
              $scope.step9Disable = true
              $scope.step10Disable = true

              alertService('danger', errAlertContent, '')
              count++
              return;
            }
            if (room.room_height == 0) {
              alertService('danger', errAlertRoomHeightCannotZero, '')
              count++
            }
          }
        }
        // $scope.initValueChecker();
        if (count == 0) {
          $scope.step5Disable = false
          $scope.step4Validation = false
          $scope.setActiveTab(tabNum + 1)
        } else {
          $scope.step4Validation = true
          $scope.step5Disable = true
          $scope.step6Disable = true
          $scope.step7Disable = true
          $scope.step8Disable = true
          $scope.step9Disable = true
          $scope.step10Disable = true
        }
      } else if (tabNum == 5) {
        $scope.survey.surveys.page = 'Step 5';
        var count_5 = validateStep5();

        if (count_5 == 0) {
          $scope.step5Validation = false
          $scope.step6Disable = false
          //calculateVaultedCeilingsDimentions();
          $scope.setActiveTab(tabNum + 1)
        } else {
          $scope.step5Validation = true
          $scope.step6Disable = true
          $scope.step7Disable = true
          $scope.step8Disable = true
          $scope.step9Disable = true
          $scope.step10Disable = true
          alertService('danger', errAlertContent, '')
        }
        // $scope.step6Disable = false
        // $scope.setActiveTab(tabNum+1)

      } else if (tabNum == 6) {
        $scope.survey.surveys.page = 'Step 6';
        // var isMaterialValidated = ValidateMaterials1(false);
        // var isMaterialMandatoryValidated = ValidateMaterialsMandatory1(false);
        // if (!isMaterialValidated){
        //       alertService('danger', errAlertContent, '')

        //     }
        // else if (!isMaterialMandatoryValidated ){
        //   alertService('danger', errAlertContent, '')

        // }else{
        //   $scope.setActiveTab(tabNum+1)
        //   $scope.step7Disable = false
        // }
        var count_6mm = 0
        angular.forEach($scope.survey.surveys.rooms, function (room) {

          if (room.external_wall.type.a.length && !room.external_type.wall.a) {
            count_6mm++;
          } else if (room.external_wall.type.b.length && !room.external_type.wall.b) {
            count_6mm++;
          } else if ((room.internal_wall_length || room?.room_dimensions?.internal_wall) && !room.internal_wall) {
            count_6mm++;
          }
          if (room.party_wall_length && !room.party_wall) {
            count_6mm++;
          }
          if (!room.validateMaterials.externalTypeWallA ||
            !room.validateMaterials.externalTypeWallB ||
            !room.validateMaterials.internalWall ||
            !room.validateMaterials.partyWall) {
            count_6mm++;
          }
        });
        if (count_6mm == 0) {
          $scope.step6Validation = false
          $scope.setActiveTab(tabNum + 1)
          $scope.step7Disable = false
        } else {
          $scope.step6Validation = true
          $scope.step7Disable = true
          $scope.step8Disable = true
          $scope.step9Disable = true
          $scope.step10Disable = true
          alertService('danger', errAlertContent, '')
        }

      } else if (tabNum == 7) {
        $scope.survey.surveys.page = 'Step 7';
        // var isMaterialValidated = ValidateMaterials1(false);
        // var isMaterialMandatoryValidated = ValidateMaterialsMandatory1(false);
        // if (!isMaterialValidated){
        //       alertService('danger', errAlertContent, '')
        //       $scope.step8Disable = true
        //       $scope.step9Disable = true
        //       $scope.step10Disable = true
        //     }
        // else if (!isMaterialMandatoryValidated ){
        //   alertService('danger', errAlertContent, '')
        //   $scope.step8Disable = true
        //   $scope.step9Disable = true
        //   $scope.step10Disable = true

        // }else{
        //   $scope.setActiveTab(tabNum+1)
        //   $scope.step8Disable = false

        // }

        var count_7mm = 0
        angular.forEach($scope.survey.surveys.rooms, function (room) {

          if (room.external_wall.type.a.window_area && !room.windows.type.a) {
            count_7mm++;
          } else if (room.external_wall.type.b.window_area && !room.windows.type.b) {
            count_7mm++;
          } else if (room.roof_glazing_area && !room.roof_glazing) {
            count_7mm++;
          } else if (room.external_door_area && !room.external_door) {
            count_7mm++;
          } else if (!room.validateMaterials.internalWall || !room.validateMaterials.partyWall || !room.validateMaterials.windowsTypeA || !room.validateMaterials.windowsTypeB || !room.validateMaterials.roofGlazing || !room.validateMaterials.externalDoor) {
            count_7mm++;
          }

        });

        if (count_7mm == 0) {
          $scope.step7Validation = false
          $scope.setActiveTab(tabNum + 1)
          $scope.step8Disable = false
        } else {
          $scope.step7Validation = true
          $scope.step8Disable = true
          $scope.step9Disable = true
          $scope.step10Disable = true
          alertService('danger', errAlertContent, '')
        }
      } else if (tabNum == 8) {
        $scope.survey.surveys.page = 'Step 8';
        var isMaterialValidated = ValidateMaterials1(false);
        var isMaterialMandatoryValidated = ValidateMaterialsMandatory1(false);
        if (!isMaterialValidated) {
          alertService('danger', errAlertContent, '')
          $scope.step9Disable = true
          $scope.step10Disable = true

        }
        else if (!isMaterialMandatoryValidated) {
          alertService('danger', errAlertContent, '')
          $scope.step9Disable = true
          $scope.step10Disable = true
        } else {
          $scope.setActiveTab(tabNum + 1)
          $scope.step8Validation = false
          $scope.step9Disable = false
        }

      } else if (tabNum == 9) {
        $scope.survey.surveys.page = 'Step 9';
        $scope.step10Disable = false
        $scope.runCalculation = false;
        $scope.setActiveTab(tabNum + 1)
      }
      else { $scope.setActiveTab(tabNum + 1) }


    }
    $scope.backTab = function (tabNum) {
      $scope.setActiveTab(tabNum - 1)
    }
    $scope.getTabClass = function (tabNum) {
      return tabClasses[tabNum];
    };

    $scope.getTabPaneClass = function (tabNum) {
      return "tab-pane " + tabClasses[tabNum];
    }

    $scope.viewAllImage = function (survey) {
      $location.path('/uploaded-image-plant/' + survey._id)
    }
    //Initialize
    initTabs();


    $scope.page = $routeParams.page ? parseInt($routeParams.page) : 1;
    $scope.locations = $rootScope.cloud_data.locations;
    $scope.meters = $rootScope.cloud_data.meters;
    $scope.copy = {
      status: false,
      collection: null
    };

    $scope.pages = [{
      label: '1',
      value: 1
    },
    {
      label: '2',
      value: 2
    },
    {
      label: '3',
      value: 3
    },
    {
      label: '4',
      value: 4
    },
    {
      label: '5',
      value: 5
    },
    {
      label: '6',
      value: 6
    },
    {
      label: '7',
      value: 7
    },
    {
      label: '8',
      value: 8
    },
    ];

    $scope.selectedPage = String($scope.page);

    $scope.loadSelectedPage = function (step) {
      $scope.selectedPage = step;
      $scope.page = parseInt(step) + 1;
      summaryHelperService.switchAndUpdateSurvey(step, null, $scope.survey, $scope.page).then(function (resolved) {
        $scope.survey = resolved.survey;
        $scope.page = resolved.page;
        $rootScope['summary'] = {
          'page': resolved.page
        }
        //$scope.selectedPage = String($scope.page);
      });
    };

    $scope.titles = [
      'Property Details',
      'Heating Type',
      'Room Features',
      'Room Dimensions',
      'Vaulted Rooms',
      'External & Vaulted Walls',
      'Internal & Party Walls, Windows & Doors',
      'Floors, Ceiling & Roof'
    ];

    $scope.validateCustom = {
      count: 0
    };

    $scope.validateMaterials = {};

    //init();

    $scope.showCustomLoc = false;
    $scope.custom_locations = {}

    //TODO: isPropertyGreater, mvhrSystem and thermalBridgesInsulated can be simplified
    //
    $scope.isPropertyGreater = function () {
      $scope.setValueChanged()
      $scope.setValueRunCalculation()
      var is_property_greater = $scope.survey.surveys.is_property_greater;
      if (is_property_greater == 'NO')
        $scope.survey.surveys.is_property_greater = 'YES';
      else if (is_property_greater == 'YES') {
        if ($scope.survey.surveys.thermal_bridges_insulated == 'YES') {
          $scope.survey.surveys.thermal_bridges_insulated = 'NO';
        }
        $scope.survey.surveys.is_property_greater = 'NO';
      }
      //assignPropertyValue();
    };

    $scope.toMaterials = function () {
      $rootScope.materials.id = $scope.survey._id;
      $rootScope.materials.route = 'summary';
      $rootScope.materials.page = $scope.page;
      $rootScope.materials.tab = $scope.tabNum;
      $location.path('/materials')
    };

    $scope.mvhrSystem = function () {
      $scope.premiumManufactures = []
      var has_mvhr = $scope.survey.surveys.has_mvhr;
      $scope.setValueChanged()
      $scope.setValueRunCalculation()
      if (has_mvhr == 'NO') {
        $scope.survey.surveys.has_mvhr = 'YES';
        modalOpen('has_mvhr');
      } else if (has_mvhr == 'YES') {
        $scope.survey.surveys.has_mvhr = 'NO';
        $scope.survey.surveys.mvhr_value = 50;
        angular.forEach($scope.survey.surveys.rooms, function (value, key) {
          try {
            $scope.survey = summaryHelperService.populateAirChangesPerHour(key, value, $scope.survey);
          } catch (e) { }
        });
      }
    };

    $scope.openHeatSourceModal = function () {
      var modalOptions = {};
      modalOptions.templateUrl = '/partials/views/summary/heat-summary-review/components/_modal_heat_source_type';
      modalOptions.controller = 'ModalHeatSourceInstanceController';
      modalOptions.size = 'md';

      var modalInstance = $modal.open({
        animation: true,
        templateUrl: modalOptions.templateUrl,
        controller: modalOptions.controller,
        backdrop: false,
        size: modalOptions.size = 'md',
        resolve: {
          data: function () {
            return {
              survey: $scope.survey,
              maxFlowTemp: $scope.maxFlowTemp,
              premiumManufactures: $scope.premiumManufactures

            }
          }
        }
      });

      modalInstance.result.then(function (result) {
        $scope.setValueChanged()
        $scope.setValueRunCalculation()
        $scope.survey = result;
        angular.forEach($scope.survey.surveys.rooms, function (value, idx) {
          calculationService.initialize($scope.survey, idx);
          calculationService.calculateAll();
        });
        $scope.survey = calculationService.helpers.emitters.get_worst_performing_room($scope.survey);
        apiService.update('surveys', $scope.survey).then(function (response) {

        }, commonService.onError);
      }, function () { });

      modalInstance.result.finally(function () {
        for (let i = 0; i < $scope.survey.surveys.preferred_model.length; i++) {
          if (!$scope.survey.surveys.preferred_model[i]) {
            $scope.survey.surveys.preferred_model.splice(i, 1)
          }
        }
      })
    };

    $scope.initStep9 = function () {
      $scope.setValueChanged();
      /**
       * to get all premier manufacturers
       */
      apiService['getAllPremier'].query(function (response) {
        $scope.premiumManufactures = response
        $rootScope.premiumManufactures = response;
      })

      // $rootScope.adminManu = $rootScope.manufactures.filter(function (o) {
      //   return o._user_id != $rootScope.user._id;
      // });
      // $rootScope.myManu = $rootScope.manufactures.filter(function (o) {
      //   return o._user_id == $rootScope.user._id;
      // })
      // get comment start
      // apiService.getComment('surveysComments', {
      //   _id: $routeParams.id
      // }).then(function (survey) {
      //   // $scope.survey = survey;

      // }, commonService.onError);
      // get comment end
      apiService.get('surveys', {
        _id: $routeParams.id
      }).then(function (survey) {
        $scope.survey = survey;
        $scope.calculateStep9()
      }, commonService.onError);
    }

    $scope.removeRoom = function (room) {
      if (confirm('Are you sure you want to delete ' + room.room_name + '?')) {
        var index = $scope.survey.surveys.rooms.indexOf(room);
        var surveyId = $scope.survey._id;
        surveyService.deleteEmptyRoom(surveyId, $scope.survey, index);
        $scope.validateCustom.count = $scope.validateCustom.count - 1;
        if ($scope.validateCustom.count === 0) {
          $scope.validateCustom.hasUndefinedCustomRoomName = false;
        }
      }
    };

    $scope.addRoom = function () {
      var totalRooms = $scope.survey.surveys.rooms.length;
      // tempMyObj = Object.assign({}, myObj);
      var room1 = JSON.parse(JSON.stringify($scope.survey.surveys.rooms[0]))
      // var room1 = Object.assign({}, $scope.survey.surveys.rooms[roomIndex]);
      var modalOptions = {};
      modalOptions.templateUrl = '/partials/views/summary/components/_modal_new_room';
      modalOptions.controller = 'ModalNewRoomController';
      modalOptions.size = 'md';

      var modalInstance = $modal.open({
        animation: true,
        templateUrl: modalOptions.templateUrl,
        controller: modalOptions.controller,
        size: modalOptions.size,
        resolve: {
          data: function () {
            return {
              rooms: $scope.survey.surveys.rooms,
              roomDetails: room1,
              totalRooms: totalRooms
            }
          }
        }
      });

      modalInstance.result.then(function (roomName) {
        if (!$scope.survey.surveys.roomCopied) {
          $scope.survey.surveys.roomCopied = 1
          $scope.survey.surveys.rooms.push(roomName)

          apiService.update('surveys', $scope.survey).then(function (response) {
            init()
            alertService('success', 'Room Create', 'Rooms Created successfully!');
          }, commonService.onError);
        } else if ($scope.survey.surveys.roomCopied == 3) {
          alertService('danger', 'Maximum rooms reached', 'You already create three rooms.');
        } else {
          $scope.survey.surveys.roomCopied = $scope.survey.surveys.roomCopied + 1
          $scope.survey.surveys.rooms.push(roomName)

          apiService.update('surveys', $scope.survey).then(function (response) {
            init()
            alertService('success', 'Room Create', 'Rooms Created successfully!');
          }, commonService.onError);
        }
      }, function () {
      });
    }


    $scope.requestToComplete = function () {
      var modalOptions = {};
      modalOptions.templateUrl = '/partials/views/summary/components/_modal_consultant';
      modalOptions.controller = 'ModalConsultantController';
      modalOptions.size = 'md';

      var modalInstance = $modal.open({
        templateUrl: modalOptions.templateUrl,
        controller: modalOptions.controller,
        animation: true,
        size: modalOptions.size,
        resolve: {
          items: function () {
            return ''
          }
        }
      });

      modalInstance.result.then(function (isTicked) {
        if (isTicked) {
          if (typeof $scope.survey.surveys.is_request_to_complete == 'undefined')
            $scope.survey.surveys.is_request_to_complete = false;

          $scope.survey.surveys.is_request_to_complete = !$scope.survey.surveys.is_request_to_complete;
          $scope.survey.surveys.request_company = $rootScope.user.company_name;

          if (!!$scope.survey.surveys.is_request_to_complete)
            alertService('success', 'Request submitted', 'You requested RDC to finish the report. As soon as the report is finished it will then go to completed reports.');
        }
      }, function () { });
    };

    $scope.copyAll = function (collection) {
      $scope.copy.status = !$scope.copy.status;
      $scope.copy.collection = !!$scope.copy.status ? collection : null;
    };
    $scope.viewAll = function (survey) {
      $location.path('/survey-image/' + survey._id)
    }

    $scope.openNotes = function (room, index) {

      var modalOptions = {};
      modalOptions.templateUrl = '/partials/views/summary/components/_modal_notes';
      modalOptions.controller = 'ModalNotesInstanceController';
      modalOptions.size = 'md';

      var modalInstance = $modal.open({
        animation: true,
        templateUrl: modalOptions.templateUrl,
        controller: modalOptions.controller,
        size: modalOptions.size = 'md',
        resolve: {
          notes: function () {
            return room.room_notes;
          },
          room: function () {
            return room;
          },
          parentIndex: index,

        }
      });

      modalInstance.result.then(function (note) {
        // init()
        room.room_notes = note;
        $scope.survey.surveys.rooms[index].room_notes = note
      }, function () {

      });
    };

    $scope.thermalBridgesInsulated = function () {

      var thermal_bridges_insulated = $scope.survey.surveys.thermal_bridges_insulated;

      if (thermal_bridges_insulated == 'NO') {
        if (confirm("Are you sure the building was built after 2006?")) {
          $scope.survey.surveys.thermal_bridges_insulated = 'YES';
          assignPropertyValue();
          modalOpen('thermal_bridges_insulated');
        }
      } else if (thermal_bridges_insulated == 'YES') {
        $scope.survey.surveys.thermal_bridges_insulated = 'NO';
        if ($scope.survey.surveys.is_property_greater == 'YES') {
          $scope.survey.surveys.is_property_greater = "YES";
        }
        assignPropertyValue();
      }

    };

    // $scope.selected = function (model, collection_name) {
    //   var collections = $scope[collection_name];
    //   var str_length = collection_name.length;
    //   collection_name = collection_name.substr(0, str_length - 1);
    //   angular.forEach(collections, function (value) {
    //     if (model == value[collection_name]) {
    //       $scope[collection_name + '_name'] = model;
    //       $scope[collection_name] = value.value;
    //       if (collection_name == 'location') {
    //         $scope.showCustomLoc = false;
    //         if ($scope.location_name == 'Custom Entry') {
    //           $scope.showCustomLoc = true;
    //           $scope.location = parseFloat($scope.custom_locations.custom_location);
    //         }
    //         $scope.survey.surveys.external_temperature = value;
    //       } else if (collection_name == 'meter') {
    //         if ($scope.survey.surveys.external_temperature.location == 'Custom Entry') {
    //           $scope.location = parseFloat($scope.custom_locations.custom_location);

    //         }
    //         $scope.survey.surveys.altitude_adjustment = value;
    //       } else if (collection_name == 'region') {
    //         $scope.current_region = value
    //         $scope.survey.surveys[collection_name] = value;
    //       } else
    //         $scope.survey.surveys[collection_name] = value;
    //       $scope.ext_temp = $scope.location + $scope.meter;
    //     }

    //     if (collection_name == 'meter') {
    //       $scope.survey.surveys.external_temperature.value = $scope.location;
    //     }
    //     $scope.setValueChanged();
    //     $scope.setValueRunCalculation()
    //   });
    // };

    $scope.changeCustomTemperature = function () {
      $scope.location = parseFloat($scope.custom_locations.custom_location);
      $scope.ext_temp = $scope.location + $scope.meter;
      $scope.survey.surveys.custom_external_temperature = $scope.custom_locations;
      $scope.survey.surveys.external_temperature.value = $scope.custom_locations.custom_location;
      $scope.setValueChanged();
      $scope.setValueRunCalculation()
    }
    /**
     * @method
     * @desc It will allow the user/s to edit existing data from the tables.
     */

    function ValidateMaterials (bool) {
      var count = 0;

      angular.forEach($scope.survey.surveys.rooms, function (room) {
        if ($scope.page == 6) {
          if (!room.validateMaterials.externalTypeWallA || !room.validateMaterials.externalTypeWallB)
            count++;
        } else if ($scope.page == 7) {
          if (!room.validateMaterials.internalWall ||
            !room.validateMaterials.partyWall ||
            !room.validateMaterials.windowsTypeA ||
            !room.validateMaterials.windowsTypeB ||
            !room.validateMaterials.roofGlazing ||
            !room.validateMaterials.externalDoor)
            count++;
        } else if ($scope.page == 8) {
          if (!room.validateMaterials.floor || !room.validateMaterials.ceilingFloor)
            count++
        }
      });

      if (count == 0)
        bool = true;

      return bool
    }

    function ValidateMaterials1 (bool) {
      var count = 0;

      angular.forEach($scope.survey.surveys.rooms, function (room) {
        if ($scope.tabNum == 6) {
          if (!room.validateMaterials.externalTypeWallA || !room.validateMaterials.externalTypeWallB)
            count++;
        } else if ($scope.tabNum == 7) {
          if (!room.validateMaterials.internalWall ||
            !room.validateMaterials.partyWall ||
            !room.validateMaterials.windowsTypeA ||
            !room.validateMaterials.windowsTypeB ||
            !room.validateMaterials.roofGlazing ||
            !room.validateMaterials.externalDoor)
            count++;
        } else if ($scope.tabNum == 8) {
          if (!room.validateMaterials.floor || !room.validateMaterials.ceilingFloor)
            count++
        }
      });

      if (count == 0)
        bool = true;

      return bool
    }

    $scope.isValid = function () {
      var ret = true;
      if (step1Form.title.value === '' ||
        step1Form.name.value === '' ||
        step1Form.addressLine1.value === '' ||
        step1Form.postCode.value === '' ||
        step1Form.approxcity.value === '? string: ?' ||
        step1Form.altitudeadjustment.value === '? string: ?') {
        ret = false;
        alertService('danger', 'Please fill in all required fields.');
      }
      return ret;
    }

    $scope.calculateStep9 = function () {

      $scope.maxFlowTemp = 0;
      $scope.hasNegativeVal = 0;
      $scope.roomNames = []
      angular.forEach($scope.survey.surveys.rooms, function (room, idx) {
        calculationService.initialize($scope.survey, idx);
        calculationService.calculate_heat_loss();
        calculationService.calculate_kilowatt_hours();
        if (room.heat_loss.external_wall_type_a < 0 || room.heat_loss.external_wall_type_b < 0) {
          $scope.hasNegativeVal++
          let names = {name: room.room_name}
          $scope.roomNames.push(names)
        }

        if (room.flow_temperature > $scope.maxFlowTemp) {
          $scope.maxFlowTemp = room.flow_temperature;
        }
      });

      calculationService.calculate_total_power_watts();
      calculationService.calculate_total_energy_kilowatts();

      calculationService.initialize($scope.survey);
      calculationService.calculate_summary_results();

      $scope.survey = calculationService.getAll().survey;

      var partner_id_array = [];
      $scope.survey.surveys.rooms = _.map($scope.survey.surveys.rooms, function (room) {
        if (!!room.is_the_room_split && room.is_the_room_split == "1") {

          var hasId = 0;
          _.each(partner_id_array, function (id) {
            if (id == room.room_partner_id) {
              hasId++;
            }
          });

          if (hasId == 0) {
            partner_id_array.push(room.room_id);

            _.each($scope.survey.surveys.rooms, function (inner_room) {
              if (room.room_partner_id == inner_room.room_id) {

                inner_room.linked_colors = room.linked_colors = '#' + Math.floor(Math.random() * 16777215).toString(16);
                if (!!room.heat_loss && inner_room.heat_loss) {
                  if (_.isNumber(room.heat_loss.total_watts) && _.isNumber(inner_room.heat_loss.total_watts)) {
                    room.heat_loss.linked_total_watts = room.heat_loss.linked_watts_per_meter_squared = parseFloat((room.heat_loss.total_watts + inner_room.heat_loss.total_watts).toFixed(2));
                  }

                  var total_floors = 0;
                  if (_.isNumber(room.floor_area) && _.isNumber(inner_room.floor_area))
                    total_floors = parseFloat((room.floor_area + inner_room.floor_area).toFixed(2));

                  room.heat_loss.linked_watts_per_meter_squared = parseFloat((room.heat_loss.linked_watts_per_meter_squared / total_floors).toFixed(2));

                  var max_total_watts = 0;
                  _.each($scope.survey.surveys.rooms, function (room) {
                    if (max_total_watts == 0)
                      max_total_watts = room.heat_loss.total_watts;
                    else if (max_total_watts < room.heat_loss.total_watts)
                      max_total_watts = room.heat_loss.total_watts;
                  });
                  room.heat_loss.linked_total_watts_percentage = parseFloat((room.heat_loss.linked_total_watts / max_total_watts).toFixed(2)) * 100;
                }
              }
            });
          } else {
            room.split_disable = true;
          }
        }
        return room;
      });
      $scope.showTable = true;
    }

    function ValidateRooms (bool) {
      var count = 0;
      angular.forEach($scope.survey.surveys.rooms, function (room) {
        if (!room.room_built)
          count++;
      });

      if (count == 0)
        bool = true;

      return bool
    }

    function ValidateRoomsAbove (bool) {
      var count = 0;
      angular.forEach($scope.survey.surveys.rooms, function (room) {
        if (room.is_there_a_roof == 'NO' && room.Which_room_is_above == 'None')
          count++;
      });

      if (count == 0)
        bool = true;

      return bool
    }

    function ValidateRoomsBelow (bool) {
      var count = 0;
      var defaultandCustomRooms = $rootScope.cloud_data.uf_heating_temps;
      angular.forEach($scope.survey.surveys.rooms, function (room) {
        if (room.which_room_is_below == '')
          count++;
        if(defaultandCustomRooms[room.which_room_is_below] == undefined) {
          count++;
        }
      });
      if (count == 0) bool = true;

      return bool
    }

    function ValidateMaterialsMandatory (bool) {
      var count = 0;

      angular.forEach($scope.survey.surveys.rooms, function (room) {
        if ($scope.page == 6) {
          if (room.external_wall.type.a.length && !room.external_type.wall.a)
            count++;
          else if (room.external_wall.type.b.length && !room.external_type.wall.b)
            count++;
          else if (room.internal_wall_length && !room.internal_wall)
            count++;
          if (room.party_wall_length && !room.party_wall)
            count++;
        } else if ($scope.page == 7) {
          if (room.external_wall.type.a.window_area && !room.windows.type.a)
            count++;
          else if (room.external_wall.type.b.window_area && !room.windows.type.b)
            count++;
          else if (room.roof_glazing_area && !room.roof_glazing)
            count++;
          else if (room.external_door_area && !room.external_door)
            count++;
        } else if ($scope.page == 8) {
          if (room.floor_area && !room.floor)
            count++;
          else if (!room.ceiling_or_roof)
            count++;
        }
      });

      if (count == 0)
        bool = true;

      return bool
    }

    function ValidateMaterialsMandatory1 (bool) {
      var count = 0;

      angular.forEach($scope.survey.surveys.rooms, function (room) {
        if ($scope.tabNum == 6) {
          if (room.external_wall.type.a.length && !room.external_type.wall.a)
            count++;
          else if (room.external_wall.type.b.length && !room.external_type.wall.b)
            count++;
          else if ((room.internal_wall_length || room.room_dimensions.internal_wall) && !room.internal_wall)
            count++;
          if (room.party_wall_length && !room.party_wall)
            count++;
        } else if ($scope.tabNum == 7) {
          if (room.external_wall.type.a.window_area && !room.windows.type.a)
            count++;
          else if (room.external_wall.type.b.window_area && !room.windows.type.b)
            count++;
          else if (room.roof_glazing_area && !room.roof_glazing)
            count++;
          else if (room.external_door_area && !room.external_door)
            count++;
        } else if ($scope.tabNum == 8) {
          if (room.floor_area && !room.floor)
            count++;
          else if (!room.ceiling_or_roof)
            count++;
        }
      });

      if (count == 0)
        bool = true;

      return bool
    }

    $scope.switchPage = function (step) {
      var isMaterialValidated = ValidateMaterials(false);
      var isMaterialMandatoryValidated = ValidateMaterialsMandatory(false);
      if ($scope.validateCustom.hasUndefinedCustomRoomName && $scope.page == 3)
        alertService('danger', 'Undefined Custom Room name!', 'You must define the required field by clicking on it.');
      else if (!ValidateRooms(false) && $scope.page == 3)
        alertService('danger', 'Undefined Year Built!', 'You must define the required field by clicking on it.');
      else if (!ValidateRoomsAbove(false) && $scope.page == 3)
        alertService('danger', 'Room above not defined!', 'You must define the required field by clicking on it.');
        else if (!ValidateRoomsBelow(false) && $scope.page == 3)
        alertService('danger', 'Room below not defined!', 'You must define the required field by clicking on it.');
        else if (!isMaterialValidated && ($scope.page == 6 || $scope.page == 7 || $scope.page == 8))
        alertService('danger', 'Undefined Custom Materials!', 'You must define the required field by clicking on it.');
      else if (!isMaterialMandatoryValidated && ($scope.page == 6 || $scope.page == 7 || $scope.page == 8))
        alertService('danger', 'Undefined Mandatory Items!', 'You must define the required field by clicking on it.');
      else {
        if ($scope.page == 4) {
          for (let i = 0; i < $scope.survey.surveys.rooms.length; i++) {
            let room = $scope.survey.surveys.rooms[i]
            if (room.is_the_room_complex != 'YES') {
              if ((!room.external_wall.type.b.length && room.external_wall.type.b.window_area) || (!room.external_wall.type.a.length && room.external_wall.type.a.window_area)) {
                alertService('danger', 'Undefined Mandatory Items!', 'You must define the required field by clicking on it.');
                return;
              }
            }
          }
        }
        if ($scope.page == 1) {
          if ($scope.survey.surveys.region.region == 'Custom Entry') {
            if (!$scope.survey.surveys.region.region_name || !$scope.survey.surveys.region.value || !$scope.survey.surveys.region.ground_temp) {
              alertService('danger', 'Enter the Custom Region Entries', '')
              $scope.step1Validation = true
              return
            }
          } else {
            $scope.step1Validation = false
          }
        }
        // $scope.survey.surveys.external_design_temperature = $scope.ext_temp;
        summaryHelperService.switchAndUpdateSurvey(step, null, $scope.survey, $scope.page, true).then(function (resolved) {
          $scope.survey = resolved.survey;
          $scope.page = resolved.page;
          $rootScope['summary'] = {
            'page': resolved.page
          }
          $scope.selectedPage = String($scope.page);
        });
      }
    };
    $scope.setActiveTab = function (tab) {
      var errAlertContent = "Please fill all the required fields/Data";
      if (tab == 1) {
        $scope.tabNum = tab
        tabNum = tab
        initTabs();
        tabClasses[tabNum] = "active";

      } else if (tab == "back") {
        $scope.tabNum = 3
        tabNum = 3
        tab = 3
        initTabs();
        tabClasses[tabNum] = "active";

      } else if (tab == 'six') {
        $scope.tabNum = 6
        tabNum = 6
        tab = 6
        initTabs();
        tabClasses[tabNum] = "active";
      } else if (tab == 'seven') {
        $scope.tabNum = 7
        tabNum = 7
        tab = 7
        initTabs();
        tabClasses[tabNum] = "active";
      } else if (tab == 'eight') {
        $scope.tabNum = 8
        tabNum = 8
        tab = 8
        initTabs();
        tabClasses[tabNum] = "active";
      }
      else {
        var tabNum = tab
        var step = tab + 1
        // $scope.survey.surveys.external_design_temperature = $scope.ext_temp;

        $scope.survey.surveys.is_locked = true;
        let name = $rootScope.user.first_name + ' ' + $rootScope.user.surname
        $scope.survey.surveys.locked_by = {
          user_id: $rootScope.user._id,
          email: $rootScope.user.email,
          name: name,
          on: Date.now()
        }
        //adding logs
        let accessLog = {
          cur_access: $rootScope.user._id,
          email: $rootScope.user.email,
          name: name,
          date: Date.now()
        }
        if ($scope.survey.surveys.logs && $scope.survey.surveys.logs.length > 0) {
          $scope.survey.surveys.logs.push(accessLog)
        } else {
          $scope.survey.surveys.logs = []
          $scope.survey.surveys.logs.push(accessLog)
        }

        $scope.survey.surveys.hasError = {
          step1: $scope.step1Validation,
          step2: $scope.step2Validation,
          step3: $scope.step3Validation,
          step4: $scope.step4Validation,
          step5: $scope.step5Validation,
          step6: $scope.step6Validation,
          step7: $scope.step7Validation,
          step8: $scope.step8Validation
        }

        summaryHelperService.switchAndUpdateSurvey(step, null, $scope.survey, $scope.page, $scope.valueChanged).then(function (resolved) {
          $scope.survey = resolved.survey;
          $scope.page = resolved.page;
          $rootScope['summary'] = {
            'page': resolved.page
          }
          $scope.valueChanged = false;
          $scope.selectedPage = String($scope.page);
          if (tab == 9) {
            $scope.showTable = false;
            $scope.initStep9();
          }
        });
      }

      $scope.tabNum = tab
      tabNum = tab
      initTabs();
      tabClasses[tabNum] = "active";
    };
    if ($routeParams.page == 3) {
      $scope.setActiveTab("back");
    } else if ($routeParams.page == 6) {
      $scope.setActiveTab("six")
    } else if ($routeParams.page == 7) {
      $scope.setActiveTab("seven")
    } else if ($routeParams.page == 8) {
      $scope.setActiveTab("eight")
    } else {
      $scope.setActiveTab(1);
    }

    /**
     * @method
     * @desc It
     */
    $scope.moveTo = function (location) {
      var isMaterialValidated = ValidateMaterials(false);
      var isMaterialMandatoryValidated = ValidateMaterialsMandatory(false);
      if (!isMaterialValidated && ($scope.page == 8)) {
        alertService('danger', 'Undefined Custom Materials!', 'You must define the required field by clicking on it.');
      } else if (!isMaterialMandatoryValidated && ($scope.page == 8)) {
        alertService('danger', 'Undefined Mandatory Materials!', 'You must define the required field by clicking on it.');
      } else {
        if (!$scope.survey.surveys.proposed_install_type || $scope.survey.surveys.proposed_install_type == undefined || $scope.survey.surveys.proposed_install_type == null || $scope.survey.surveys.proposed_install_type == '' ||
          !$scope.survey.surveys.preferred_manufacture || $scope.survey.surveys.preferred_manufacture == undefined || $scope.survey.surveys.preferred_manufacture == null || $scope.survey.surveys.preferred_manufacture == '' ||
          !$scope.survey.surveys.preferred_model || $scope.survey.surveys.preferred_model == undefined || $scope.survey.surveys.preferred_model == null || $scope.survey.surveys.preferred_model == '' ||
          !$scope.survey.surveys.output_at_designed_external_temperature || $scope.survey.surveys.output_at_designed_external_temperature == undefined || $scope.survey.surveys.output_at_designed_external_temperature == null || $scope.survey.surveys.output_at_designed_external_temperature == '' ||
          !$scope.survey.surveys.maximum_designed_flow_temperature || $scope.survey.surveys.maximum_designed_flow_temperature == undefined || $scope.survey.surveys.maximum_designed_flow_temperature == null || $scope.survey.surveys.maximum_designed_flow_temperature == '' ||
          !$scope.survey.surveys.output_capcity_at_designed_dhw || $scope.survey.surveys.output_capcity_at_designed_dhw == undefined || $scope.survey.surveys.output_capcity_at_designed_dhw == null || $scope.survey.surveys.output_capcity_at_designed_dhw == ''
        ) {
          $scope.step9Validation = true
          alertService('danger', 'Please fill all the required fields/Data');
        } else {
          if ($scope.valueChanged) {
            summaryHelperService.switchAndUpdateSurvey(null, location, $scope.survey, null, $scope.valueChanged).then(function () {
              $scope.step9Validation = false
              $location.path('/' + location + '/' + $scope.survey._id);

            });
          } else {
            $location.path('/' + location + '/' + $scope.survey._id);
          }
        }

      }
    };

    $scope.defineCustomName = function (idx) {

      var modalOptions = {};
      modalOptions.templateUrl = '/partials/views/summary/components/_modal_custom_name';
      modalOptions.controller = 'ModalCustomNameController';
      modalOptions.size = 'md';
      var modalInstance = null;
      if (!_.isUndefined($scope.survey.surveys.rooms[idx].is_custom_room_defined)) {
        modalInstance = $modal.open({
          templateUrl: modalOptions.templateUrl,
          controller: modalOptions.controller,
          animation: true,
          size: modalOptions.size,
          resolve: {
            room: function () {
              return {
                index: idx,
                survey: $scope.survey,
                isAlreadyDefined: $scope.survey.surveys.rooms[idx].is_custom_room_defined
              }
            },
            validateCustom: $scope.validateCustom
          }
        });

        modalInstance.result.then(function (collection) {
          $scope.setValueChanged()
          $scope.setValueRunCalculation()
          $scope.survey = collection.survey;
          $scope.validateCustom = collection.validateCustom;
        }, function () { });

      } else {
        var options = {
          templateUrl: '/partials/views/summary/components/_modal_adjust',
          controller: 'ModalAdjustController',
          size: 'md'
        };

        modalInstance = $modal.open({
          templateUrl: options.templateUrl,
          controller: options.controller,
          animation: true,
          size: options.size,
          resolve: {
            data: function () {
              return {
                index: idx,
                survey: $scope.survey
              }
            }
          }
        });

        modalInstance.result.then(function (collection) {
          $scope.setValueChanged()
          $scope.setValueRunCalculation()
          $scope.survey = collection.survey;
        }, function () { });
      }
    };

    $scope.checkCustomAboveBelow = function (room, where) {
      var keys = _.keys($rootScope.cloud_data.uf_heating_temps);
      var room_name = room[where];

      var hasUfHeating = 0;
      _.each(keys, function (key) {
        if (key == room_name) {
          hasUfHeating++;
        }
      });

      if (hasUfHeating == 0)
        return true;
      else
        return false;
    };

    $scope.openDegreeDayDataModal = function () {

      var modalOptions = {};
      modalOptions.templateUrl = '/partials/views/summary/components/_modal_degree_data';
      modalOptions.controller = 'ModalDegreeDataController';
      modalOptions.size = 'md';

      var modalInstance = $modal.open({
        templateUrl: modalOptions.templateUrl,
        controller: modalOptions.controller,
        animation: true,
        size: modalOptions.size,
        resolve: {
          data: function () {
            return $scope.survey.surveys.weeks;
          }
        }
      });

      modalInstance.result.then(function (selectedItem) {
        $scope.survey.surveys.weeks = selectedItem;
        var weekType = $scope.survey.surveys.weeks === 'low_weeks' ? '39' : '52'
        var postcodeLetters = $scope.survey.surveys.post_code.match(regexForUkPostCodeLetters)[0];
        var degreeDayObj = degreeDayHash[postcodeLetters.toUpperCase()]
        $scope.survey.surveys.region.value = degreeDayObj[weekType];
        // $scope.regions = $rootScope.cloud_data.regions[$scope.survey.surveys.weeks];

        // $scope.selected($scope.region_name, "regions");
        // $scope.selected($scope.location_name, "locations");
        // $scope.selected($scope.meter_name, "meters");
      }, function () { });
    };

    function isMaterialValidated (index, item) {
      var room = $scope.survey.surveys.rooms[index];
      var materialToValidate;
      var split = item.split('.');
      var count = 0;

      if (item == 'external_type.wall.a' ||
        item == 'external_type.wall.b' ||
        item == 'internal_wall' ||
        item == 'party_wall' ||
        item == 'windows.type.a' ||
        item == 'windows.type.b' ||
        item == 'roof_glazing' ||
        item == 'external_door' ||
        item == 'floor' ||
        item == 'ceiling_or_roof') {
        if (split.length == 4)
          materialToValidate = room[split[0]][split[1]][split[2]][split[3]];
        else if (split.length == 3)
          materialToValidate = room[split[0]][split[1]][split[2]];
        else if (split.length == 2)
          materialToValidate = room[split[0]][split[1]];
        else if (split.length == 1)
          materialToValidate = room[split[0]];

        if (materialToValidate == null)
          return true;

        angular.forEach($rootScope.materials.defaults, function (def) {
          if (def.material.includes(materialToValidate))
            count++;
        });

        angular.forEach($rootScope.materials.customs, function (cus) {
          if (cus.material === materialToValidate)
            count++;
          // if (cus.material.includes(materialToValidate))
          //   count++;
        });

        if (count > 0)
          return true;
        else
          return false;
      } else
        return true;
    }

    $scope.filterSecId = function (manufacture) {
      var result = [];

      var flag = false;
      angular.forEach(manufacture, function (items) {
        _.each(items, function (item, idx) {
          if (idx == 'company_name') {
            if (item == $scope.survey.surveys.preferred_manufacture)
              flag = true;
          }
          if (idx == 'models') {
            if (!!flag) {
              result = item;
              flag = false;
            }
          }
        });
      });

      return result;
    };

    /**
     * @method
     * @desc It will allow the user/s to edit existing data from the tables.
     */

    $scope.modalEditType = function (typw, index) {
      var roomIndex = $scope.survey.surveys.rooms.length - 1
      var room1 = JSON.parse(JSON.stringify($scope.survey.surveys.rooms[index]))
      var modalOptions = {};
      modalOptions.templateUrl = '/partials/views/summary/components/_modal_type_edit';
      modalOptions.controller = 'ModalEditTypeController';
      modalOptions.size = 'md';

      var modalInstance = $modal.open({
        animation: true,
        templateUrl: modalOptions.templateUrl,
        controller: modalOptions.controller,
        size: modalOptions.size = 'md',
        resolve: {
          room: function () {
            return $scope.survey.surveys.rooms;
          },
          roomDetails: room1
        }
      });

      modalInstance.result.then(function (type) {
        if (!$scope.survey.surveys.rooms[index].complex_room_details) {
          $scope.survey.surveys.rooms[index].complex_room_details = {}
        }
        $scope.survey.surveys.rooms[index].is_the_room_complex = 'YES'
        $scope.survey.surveys.rooms[index].complex_room_details.room_type = type
        apiService.update('surveys', $scope.survey).then(function (response) {
          init()
          alertService('success', 'Type', 'Type Updated successfully!');
        }, commonService.onError);
      }, function () {
      });
    }


    $scope.modalEdit = function (item, idx, property, typ) {
      var copiedValue;
      var rooms = $scope.survey.surveys.rooms;
      var split = item.split('.');

      if (!!$scope.copy.status && item == $scope.copy.collection) {

        copiedValue = rooms[idx];
        angular.forEach(split, function (item) {
          copiedValue = copiedValue[item];
        });

        angular.forEach(rooms, function (rm, index) {
          if (split.length == 4)
            $scope.survey.surveys.rooms[index][split[0]][split[1]][split[2]][split[3]] = copiedValue;
          else if (split.length == 3)
            $scope.survey.surveys.rooms[index][split[0]][split[1]][split[2]] = copiedValue;
          else if (split.length == 2)
            $scope.survey.surveys.rooms[index][split[0]][split[1]] = copiedValue;
          else if (split.length == 1)
            $scope.survey.surveys.rooms[index][split[0]] = copiedValue;
        });

        $scope.copy.status = !$scope.copy.status;
        angular.forEach($scope.survey.surveys.rooms, function (value) {

          if (!angular.isDefined(value.validateMaterials))
            value.validateMaterials = {};
          var buildingMaterials = {
            externalTypeWallA: value.external_type.wall.a,
            externalTypeWallB: value.external_type.wall.b,
            internalWall: value.internal_wall,
            partyWall: value.party_wall,
            windowsTypeA: value.windows.type.a,
            windowsTypeB: value.windows.type.b,
            roofGlazing: value.roof_glazing,
            externalDoor: value.external_door,
            floor: value.floor,
            ceilingFloor: value.ceiling_or_roof
          };

          var materialOptions = ['defaults', 'customs'];

          angular.forEach(buildingMaterials, function (item, idx) {
            value.validateMaterials[idx] = item ? false : true;

            if (value.validateMaterials[idx] == 'null') {
              // do nothing
            } else {
              angular.forEach(materialOptions, function (type) {
                angular.forEach($rootScope.materials[type], function (collections) {
                  if (collections.material == item) {
                    value.validateMaterials[idx] = true;
                  }
                });
              });
            }
          });
        });
        if (item === 'room_built') {
          for (let i = 0; i < $scope.survey.surveys.rooms.length; i++) {
            try {
              $scope.survey = summaryHelperService.populateAirChangesPerHour(i, $scope.survey.surveys.rooms[i], $scope.survey);
              $scope.survey = summaryHelperService.populateDesignTemperature(i, $scope.survey.surveys.rooms[i], $scope.survey);
            } catch (e) {
              console.log(e);
            }
          }
        }

      } else {
        var customMaterial = {};
        customMaterial.survey = $scope.survey;
        customMaterial.property = property;
        // customMaterial.page = $scope.page;
        customMaterial.page = $scope.tabNum
        if (!isMaterialValidated(idx, item)) {
          modalService.setTemplateUrl('/partials/views/summary/components/_modal');
          modalService.setController('ModalEditController');
          modalService.showModal($scope.survey.surveys.rooms, item, idx, "none", "input", customMaterial).then(function (result) {
            $scope.setValueChanged()
            $scope.setValueRunCalculation()
            angular.forEach($scope.survey.surveys.rooms, function (room) {
              var split = item.split('.');

              if (split.length > 1) {
                if (split.length == 2) {
                  if (room[split[0]][split[1]] === result.old) {
                    room[split[0]][split[1]] = result.material;
                  }
                } else if (split.length == 3) {
                  if (room[split[0]][split[1]][split[2]] === result.old) {
                    room[split[0]][split[1]][split[2]] = result.material;
                  }
                } else if (split.length == 4) {
                  if (room[split[0]][split[1]][split[2]][split[3]] === result.old) {
                    room[split[0]][split[1]][split[2]][split[3]] = result.material;
                  }
                }
              } else {
                if (room[item] === result.old) {
                  room[item] = result.material;
                }
              }
            });

            if (split.length == 1)
              rooms[idx][split[0]] = result.material;
            else if (split.length == 2)
              rooms[idx][split[0]][split[1]] = result.material;
            else if (split.length == 3)
              rooms[idx][split[0]][split[1]][split[2]] = result.material;
            else if (item.length == 4)
              rooms[idx][split[0]][split[1]][split[2]][split[3]] = result.material;

            result.type = property;

            if (!!result.isOptionSelect) {

              alertService('success', 'Custom material', 'You added a material from the default materials');

              angular.forEach($scope.survey.surveys.rooms, function (value) {

                if (!angular.isDefined(value.validateMaterials))
                  value.validateMaterials = {};

                var buildingMaterials = {
                  externalTypeWallA: value.external_type.wall.a,
                  externalTypeWallB: value.external_type.wall.b,
                  internalWall: value.internal_wall,
                  partyWall: value.party_wall,
                  windowsTypeA: value.windows.type.a,
                  windowsTypeB: value.windows.type.b,
                  roofGlazing: value.roof_glazing,
                  externalDoor: value.external_door,
                  floor: value.floor,
                  ceilingFloor: value.ceiling_or_roof
                };

                var materialOptions = ['defaults', 'customs'];

                angular.forEach(buildingMaterials, function (item, idx) {
                  value.validateMaterials[idx] = item ? false : true;

                  if (value.validateMaterials[idx] == 'null') {
                    // nothing
                  } else {
                    angular.forEach(materialOptions, function (type) {
                      angular.forEach($rootScope.materials[type], function (collections) {
                        if (collections.material == item) {
                          value.validateMaterials[idx] = true;
                        }
                      });
                    });
                  }
                });
              });
            } else {
              apiService
                .save('customs', result)
                .then(function (response) {
                  alertService('success', 'Custom material', response.message);
                  $rootScope.materials.customs.push(result);
                  materialService.update();

                  angular.forEach($scope.survey.surveys.rooms, function (value) {

                    if (!angular.isDefined(value.validateMaterials))
                      value.validateMaterials = {};

                    var buildingMaterials = {
                      externalTypeWallA: value.external_type.wall.a,
                      externalTypeWallB: value.external_type.wall.b,
                      internalWall: value.internal_wall,
                      partyWall: value.party_wall,
                      windowsTypeA: value.windows.type.a,
                      windowsTypeB: value.windows.type.b,
                      roofGlazing: value.roof_glazing,
                      externalDoor: value.external_door,
                      floor: value.floor,
                      ceilingFloor: value.ceiling_or_roof
                    };

                    var materialOptions = ['defaults', 'customs'];

                    angular.forEach(buildingMaterials, function (item, idx) {
                      value.validateMaterials[idx] = item ? false : true;

                      if (value.validateMaterials[idx] == 'null') {
                        // nothing
                      } else {
                        angular.forEach(materialOptions, function (type) {
                          angular.forEach($rootScope.materials[type], function (collections) {
                            if (collections.material == item) {
                              value.validateMaterials[idx] = true;
                            }
                          });
                        });
                      }
                    });
                  });

                }, function (error) {
                  alertService('danger', 'Something went wrong!', error.message);
                });
            }

          });
        } else {
          if (!!$scope.copy.status)
            $scope.copy.status = false;
          modalService.setTemplateUrl('/partials/views/summary/components/_modal');
          modalService.setController('ModalEditController');
          modalService.showModal($scope.survey.surveys.rooms, item, idx, property, typ).then(function (result) {
            $scope.setValueChanged()
            $scope.setValueRunCalculation()
            $scope.survey.surveys.rooms = result.scope;
            if (result.minMax) {
              $scope.minMax = result.minMax
            }
            angular.forEach($scope.survey.surveys.rooms, function (value) {

              if (!angular.isDefined(value.validateMaterials))
                value.validateMaterials = {};
              var buildingMaterials = {
                externalTypeWallA: value.external_type.wall.a,
                externalTypeWallB: value.external_type.wall.b,
                internalWall: value.internal_wall,
                partyWall: value.party_wall,
                windowsTypeA: value.windows.type.a,
                windowsTypeB: value.windows.type.b,
                roofGlazing: value.roof_glazing,
                externalDoor: value.external_door,
                floor: value.floor,
                ceilingFloor: value.ceiling_or_roof
              };

              var materialOptions = ['defaults', 'customs'];

              angular.forEach(buildingMaterials, function (item, idx) {
                value.validateMaterials[idx] = item ? false : true;

                if (value.validateMaterials[idx] == 'null') {
                  // nothing
                } else {
                  angular.forEach(materialOptions, function (type) {
                    angular.forEach($rootScope.materials[type], function (collections) {
                      if (collections.material == item) {
                        value.validateMaterials[idx] = true;
                      }
                    });
                  });
                }
              });
              calculateVaultedCeilingsDimentions();
            });
            try {
              $scope.survey = summaryHelperService.populateAirChangesPerHour(result.idx, $scope.survey.surveys.rooms[result.idx], $scope.survey);
              $scope.survey = summaryHelperService.populateDesignTemperature(result.idx, $scope.survey.surveys.rooms[result.idx], $scope.survey);
            } catch (e) {
              console.log(e);
            }
          });
        }
      }
    };

    /**
     * @function
     * @desc Function to initialize data
     */
    function init () {
      $scope.loading = true
      $scope.floorArea = 0;
      $rootScope.adminManu = $rootScope.manufactures.filter(function (o) {
        return o._user_id != $rootScope.user._id;
      });
      $rootScope.myManu = $rootScope.manufactures.filter(function (o) {
        return o._user_id == $rootScope.user._id;
      })
      apiService.get('surveys', {
        _id: $routeParams.id
      }).then(function (survey) {
        //if(survey.isLocked == undefined || survey.isLocked == false) {
        $scope.loading = false
        $scope.survey = survey;
        $scope.survey.surveys.hasError = {
          step1: false, step2: false, step3: false, step4: false, step5: false, step6: false, step7: false, step8: false
        }
        $scope.survey.surveys.title = $scope.survey.surveys.title ? $scope.survey.surveys.title : '';
        $scope.survey.surveys.address_one = $scope.survey.surveys.address_one ? $scope.survey.surveys.address_one : '';
        $scope.survey.surveys.address_two = $scope.survey.surveys.address_two ? $scope.survey.surveys.address_two : '';
        $scope.survey.surveys.address_three = $scope.survey.surveys.address_three ? $scope.survey.surveys.address_three : '';
        $scope.survey.surveys.region = $scope.survey.surveys.region ? $scope.survey.surveys.region : {};

        $scope.region_name = $scope.survey.surveys.region.region ? $scope.survey.surveys.region.region != 'Custom Entry' ? $scope.survey.surveys.region.region : 'Custom Entry' : '';
        $scope.region = $scope.survey.surveys.region.value ? $scope.survey.surveys.region.value : '';
        $scope.current_region = $scope.survey.surveys.region ? $scope.survey.surveys.region : {}
        $scope.location_name = $scope.survey.surveys.external_temperature ? $scope.survey.surveys.external_temperature.location : '';
        $scope.location = $scope.survey.surveys.external_temperature ? $scope.survey.surveys.external_temperature.value : '';

        $scope.meter_name = $scope.survey.surveys.altitude_adjustment ? $scope.survey.surveys.altitude_adjustment.meter : '';
        $scope.meter = $scope.survey.surveys.altitude_adjustment ? $scope.survey.surveys.altitude_adjustment.value : '';

        $scope.ext_temp = $scope.location + $scope.meter;

        $scope.custom_locations.custom_location_name = $scope.survey.surveys.custom_external_temperature ? $scope.survey.surveys.custom_external_temperature.custom_location_name : '';
        $scope.custom_locations.custom_location = $scope.survey.surveys.custom_external_temperature ? $scope.survey.surveys.custom_external_temperature.custom_location : '';

        $scope.survey.surveys.totalComplexExtWall = 0;

        if ($scope.location_name == 'Custom Entry' && $scope.custom_locations.custom_location_name !== '') {
          $scope.showCustomLoc = true;
          $scope.ext_temp = parseInt($scope.custom_locations.custom_location) + $scope.meter;
        } else {
          $scope.custom_locations.custom_location_name = '';
        }
        $scope.regions = $rootScope.cloud_data.regions[$scope.survey.surveys.weeks];
        if (!!$rootScope.reference) {

          angular.forEach($scope.survey.surveys.rooms, function (room) {
            var split = $rootScope.reference.item.split('.');

            if (split.length > 1) {
              if (split.length == 2) {
                if (room[split[0]][split[1]] === $rootScope.reference.name) {
                  room[split[0]][split[1]] = $rootScope.reference.newValue;
                }
              } else if (split.length == 3) {
                if (room[split[0]][split[1]][split[2]] === $rootScope.reference.name) {
                  room[split[0]][split[1]][split[2]] = $rootScope.reference.newValue;
                }
              } else if (split.length == 4) {
                if (room[split[0]][split[1]][split[2]][split[3]] === $rootScope.reference.name) {
                  room[split[0]][split[1]][split[2]][split[3]] = $rootScope.reference.newValue;
                }
              }
            } else {
              if (room[$scope.reference.item] === $rootScope.reference.name) {
                room[$scope.reference.item] = $rootScope.reference.newValue;
              }
            }
          });

          $rootScope.reference = undefined;
        }
        //highlightMinMax1('floor_area', 'floorAreaMin', 'floorAreaMax');

        calculateVaultedCeilingsDimentions();

        // TODO: refactor default values
        if (_.isUndefined($scope.survey.surveys.output_at_designed_external_temperature))
          $scope.survey.surveys.output_at_designed_external_temperature = 0;
        if (_.isUndefined($scope.survey.surveys.maximum_designed_flow_temperature))
          $scope.survey.surveys.maximum_designed_flow_temperature = 0;
        if (_.isUndefined($scope.survey.surveys.output_capcity_at_designed_dhw))
          $scope.survey.surveys.output_capcity_at_designed_dhw = 0;
        if (_.isUndefined($scope.survey.surveys.if_biomass_which_fuel_type))
          $scope.survey.surveys.if_biomass_which_fuel_type = 'Biomass Wood Pellets';
        if (_.isUndefined($scope.survey.surveys.hp_heating_at_ground_temp))
          $scope.survey.surveys.hp_heating_at_ground_temp = 16;
        if (_.isUndefined($scope.survey.surveys.custom_names)) {
          $scope.survey.surveys.custom_names = {
            "None": {
              "temp": [10, 10, 10],
              "air": [0, 0, 0]
            }
          };
        }

        $rootScope.cloud_data.uf_heating_temps = lodash.merge($rootScope.cloud_data.uf_heating_temps, $scope.survey.surveys.custom_names);

        // TODO: for mvhr refactor later
        if ($scope.survey.surveys.average_designed_temperature == null) {
          $scope.setValueChanged()
        }
        $scope.survey.surveys.average_designed_temperature = 0;

        $scope.survey.surveys.floorArea = 0;
        $scope.survey.surveys.totalExtA = 0;
        $scope.survey.surveys.totalExtB = 0;

        if (_.isUndefined($scope.survey.surveys.insulation_thermal_conductivity) && $rootScope.materials.insulation_thermal_conductivity == null)
          $scope.survey.surveys.insulation_thermal_conductivity = $rootScope.materials.insulation_thermal_conductivity = 0.025;
        else {
          if ($rootScope.materials.insulation_thermal_conductivity != null)
            $scope.survey.surveys.insulation_thermal_conductivity = $rootScope.materials.insulation_thermal_conductivity;
          else
            $rootScope.materials.insulation_thermal_conductivity = $scope.survey.surveys.insulation_thermal_conductivity;
        }
        var i = 0;

        var mapped = _.map($rootScope.materials.defaults, function (material) {
          if (material.value_type == 'r_value') {
            material.u_value = parseFloat((material.depth / $rootScope.materials.insulation_thermal_conductivity).toFixed(1));
            i = i + 1;
          }
          return material;
        });

        $rootScope.materials.defaults = mapped;
        materialService.update();

        if (typeof $scope.survey.surveys.reference == 'undefined')
          $scope.survey.surveys.reference = 0;

        if (typeof $scope.survey.surveys.is_bivalent_required == 'undefined')
          $scope.survey.surveys.is_bivalent_required = 'NO';

        if (typeof $scope.survey.surveys.is_radiators_required == undefined)
          $scope.survey.surveys.is_radiators_required = 'NO';

        if ($scope.survey.surveys.includedReport) {
          if (typeof $scope.survey.surveys.includedReport.pipeRadiators == undefined) {
            $scope.survey.surveys.includedReport.pipeRadiators = 'NO';
          }
        }

        if (typeof $scope.survey.surveys.weeks == 'undefined')
          $scope.survey.surveys.weeks = 'high_weeks';
        if (typeof $scope.survey.surveys.status == 'undefined')
          $scope.survey.surveys.status = 'PROGRESS';

        $scope.regions = $rootScope.cloud_data.regions[$scope.survey.surveys.weeks];

        if (typeof $scope.survey.surveys.is_property_greater == 'undefined')
          $scope.survey.surveys.is_property_greater = 'NO';

        if (typeof $scope.survey.surveys.thermal_bridges_insulated == 'undefined')
          $scope.survey.surveys.thermal_bridges_insulated = 'NO';

        if (typeof $scope.survey.surveys.has_mvhr == 'undefined')
          $scope.survey.surveys.has_mvhr = 'NO';

        // $scope.regions = $rootScope.cloud_data.regions[$scope.survey.surveys.weeks];

        assignPropertyValue();
        $scope.survey = summaryHelperService.resetCurrentRadWatts($scope.survey);

        // Validations
        angular.forEach($scope.survey.surveys.rooms, function (value, key) {
          var num1, num2;

          if (!angular.isDefined(value.validateMaterials))
            value.validateMaterials = {};

          var buildingMaterials = {
            externalTypeWallA: value.external_type.wall.a,
            externalTypeWallB: value.external_type.wall.b,
            internalWall: value.internal_wall,
            partyWall: value.party_wall,
            windowsTypeA: value.windows ? value.windows.type.a : '',
            windowsTypeB: value.windows ? value.windows.type.b : '',
            roofGlazing: value.roof_glazing,
            externalDoor: value.external_door,
            floor: value.floor,
            ceilingFloor: value.ceiling_or_roof
          };

          var materialOptions = ['defaults', 'customs'];
          angular.forEach(buildingMaterials, function (item, idx) {
            value.validateMaterials[idx] = item ? false : true;

            if (value.validateMaterials[idx] == 'null') {
              // nothing
            } else {
              angular.forEach(materialOptions, function (type) {
                angular.forEach($rootScope.materials[type], function (collections) {
                  if (collections.material == item) {
                    value.validateMaterials[idx] = true;
                  }
                });
              });
            }
          });

          if (value.is_the_room_complex == 'YES') {
            num1 = value.complex_room_details.dim.one ? value.complex_room_details.dim.one : 0;
            num2 = value.complex_room_details.dim.two ? value.complex_room_details.dim.two : 0;
            value.floor_area = parseFloat((num1 * num2).toFixed(2));
          }

          if (typeof value.emitter_type == 'undefined') {
            if ($scope.survey.surveys.rooms[key].underfloor_heating == 'YES')
              $scope.survey.surveys.rooms[key].emitter_type = "Underfloor Heating";
            else
              $scope.survey.surveys.rooms[key].emitter_type = "Standard Radiators";
          }

          if (value.exposed_location == 'YES')
            $scope.survey.surveys.rooms[key].exposed_location_value = 0.1;
          else
            $scope.survey.surveys.rooms[key].exposed_location_value = 0;

          if (value.intermittent_heating_required == 'YES') {
            if (value.room_built >= 2006)
              $scope.survey.surveys.rooms[key].intermittent_heating_value = 0.2;
            else
              $scope.survey.surveys.rooms[key].intermittent_heating_value = 0.1;
          } else
            $scope.survey.surveys.rooms[key].intermittent_heating_value = 0;

          if (typeof value.lowest_parallel_room_temp == 'undefined')
            $scope.survey.surveys.rooms[key].lowest_parallel_room_temp = 18;

          if (typeof value.high_ceiling_percentage == 'undefined')
            $scope.survey.surveys.rooms[key].high_ceiling_percentage = 0;

          // check room if custom
          try {
            $scope.survey = summaryHelperService.populateAirChangesPerHour(key, value, $scope.survey);
            $scope.survey = summaryHelperService.populateDesignTemperature(key, value, $scope.survey);
          } catch (e) {
            if (typeof $scope.survey.surveys.rooms[key].is_custom_room_defined == 'undefined')
              $scope.survey.surveys.rooms[key].is_custom_room_defined = false;

            if ($scope.survey.surveys.rooms[key].is_custom_room_defined == false) {
              $scope.validateCustom.hasUndefinedCustomRoomName = true;
              $scope.validateCustom.count = $scope.validateCustom.count + 1;
            }
          }

          $scope.survey = summaryHelperService.getCurrentRadWatts(key, value, $scope.survey);

          if (!!value.floor_area) {
            $scope.survey.surveys.floorArea += value.floor_area;
            $scope.survey.surveys.floorArea = parseFloat((parseFloat($scope.survey.surveys.floorArea)).toFixed(2));
          }

          if (!!value.external_wall.type.a.length) {
            if (!_.isNumber(value.external_wall.type.a.length) && !!value.external_wall.type.a.length)
              value.external_wall.type.a.length = parseInt(value.external_wall.type.a.length);

            $scope.survey.surveys.totalExtA += value.external_wall.type.a.length;
            $scope.survey.surveys.totalExtA = parseFloat(($scope.survey.surveys.totalExtA).toFixed(2));
          }

          if (!!value.external_wall.type.b.length) {
            if (!_.isNumber(value.external_wall.type.b.length) && !!value.external_wall.type.b.length)
              value.external_wall.type.b.length = parseInt(value.external_wall.type.b.length);

            $scope.survey.surveys.totalExtB += value.external_wall.type.b.length;
            $scope.survey.surveys.totalExtB = parseFloat(($scope.survey.surveys.totalExtB).toFixed(2));
          }
        });

        $scope.survey = summaryHelperService.consoidateOutPutForMVTForSplitRoom($scope.survey);

        $scope.survey.surveys.totalExtWallLength = parseFloat(($scope.survey.surveys.totalExtA +
          $scope.survey.surveys.totalExtB +
          $scope.survey.surveys.totalComplexExtWall).toFixed(2));
        $scope.survey = summaryHelperService.computeAverageDesignTemperature($scope.survey);
        validateInit()
        let ret = surveyService.highlightMinMax($scope.survey.surveys.rooms);
        $scope.survey.surveys.rooms = ret.rooms;
        $scope.minMax = ret.minMax;
      }, function (error) {
        if (error) {
          console.log(error);
          alertService('warning', 'Access Locked', error.error)
        }
      });

    }

    init();

    function calculateVaultedCeilingsDimentions () {
      angular.forEach($scope.survey.surveys.rooms, function (room, idx) {

        var dimensionsArray = ['Volume', 'External wall', 'Party wall', 'Internal wall', 'Roof', 'Floor area', 'External wall length'];
        var dimensionsPropertiesArray = ['volume', 'external_wall', 'party_wall', 'internal_wall', 'roof', 'floor_area', 'external_wall_length'];

        if (room.is_the_room_complex == 'YES') {

          if (_.isUndefined($scope.survey.surveys.rooms[idx].room_dimensions))
            $scope.survey.surveys.rooms[idx].room_dimensions = {};

          _.each(dimensionsArray, function (element, index) {
            var isRoof = false;
            var isVolume = false;
            if (element == 'Roof')
              isRoof = true;

            if (element == 'Volume')
              isVolume = true;

            if (element == 'Floor area')
              $scope.survey.surveys.rooms[idx].room_dimensions[dimensionsPropertiesArray[index]] = parseFloat((room.complex_room_details.dim.one * room.complex_room_details.dim.two).toFixed(2));
            else if (element == 'External wall length') {
              // TODO: Still needs fixing
              var sum = 0;
              var count = 0;
              if (room.complex_room_details.wall) {
                _.each(room.complex_room_details.wall.type, function (elem) {

                  if (elem == 'External wall') {
                    if (count == 0 || count == 2)
                      sum = sum + room.complex_room_details.dim.one;
                    else if (count == 1 || count == 3)
                      sum = sum + room.complex_room_details.dim.two;
                    count = count + 1;
                  }

                });
              }
              sum = parseFloat(sum);
              $scope.survey.surveys.totalComplexExtWall += parseFloat((sum).toFixed(2));
              $scope.survey.surveys.rooms[idx].room_dimensions[dimensionsPropertiesArray[index]] = parseFloat((sum).toFixed(2));
            } else
              $scope.survey.surveys.rooms[idx].room_dimensions[dimensionsPropertiesArray[index]] = calculationService.helpers.get_complex_value($scope.surveys, room, element, isRoof, isVolume);
          });
          errorChecker(5, room, idx);
        }

      });
    }
    function validateInit () {
      // step 1
      if (!$scope.survey.surveys.client_name || !$scope.survey.surveys.title || !$scope.survey.surveys.project_name || !$scope.survey.surveys.address_one || $scope.survey.surveys.region.region == '' || $scope.survey.surveys.region.region == undefined || $scope.survey.surveys.region.region == null || $scope.location_name == '' || $scope.location_name == undefined || $scope.location_name == null || $scope.meter_name == '' || $scope.meter_name == undefined || $scope.meter_name == null) {
        $scope.step1Validation = true

        // $scope.step2Disable = true
      } else {
        $scope.step1Validation = false
        // $scope.step2Disable = false
      }

      // step 2
      // if($scope.survey.surveys.proposed_install_type == "None"){
      //         $scope.step2Validation = true

      // }else if($scope.survey.surveys.proposed_install_type.toLowerCase() == "ashp"){
      //         if(!$scope.survey.surveys.is_ashp_high_temp_model){
      //           $scope.step2Validation = true

      //         }else{
      //           $scope.step2Validation = false
      //         }
      // }else if($scope.survey.surveys.proposed_install_type.toLowerCase() == "biomass"){
      //   if(!$scope.survey.surveys.biomass_type){
      //     $scope.step2Validation = true

      //   }else{
      //     $scope.step2Validation = false
      //   }
      // }else{
      //   $scope.step2Validation = false
      // }
      $scope.step2Validation = false
      // step 3
      if ($scope.validateCustom.hasUndefinedCustomRoomName) {
        $scope.step3Validation = true
      } else if (!ValidateRooms(false)) {
        $scope.step3Validation = true
      }
      else if (!ValidateRoomsAbove(false)) {
        $scope.step3Validation = true
      } else if (!ValidateRoomsBelow(false)) {
        $scope.step3Validation = true
      }
      else {
        $scope.step3Validation = false
      }

      // step 4
      var count_4 = 0
      for (let i = 0; i < $scope.survey.surveys.rooms.length; i++) {
        let room = $scope.survey.surveys.rooms[i]
        if (room.floor_area == 0) {
          count_4++
          $scope.step4Validation = true
        } else if (room.is_the_room_complex != 'YES') {
          if ((!room.external_wall.type.b.length && room.external_wall.type.b.window_area) || (!room.external_wall.type.a.length && room.external_wall.type.a.window_area)) {
            $scope.step4Validation = true
            count_4++
          }
          if (room.room_height == 0) {
            count_4++
          }
        }
        if (count_4 == 0) {
          $scope.step4Validation = false
        } else {
          $scope.step4Validation = true
        }

      }

      // step 5
      let count_5 = validateStep5();
      if (count_5 == 0) {
        $scope.step5Validation = false
      } else {
        $scope.step5Validation = true
      }

      // step 6,7,6
      var count_6 = 0
      var count_7 = 0
      var count_8 = 0
      angular.forEach($scope.survey.surveys.rooms, function (room) {
        if (!room.validateMaterials.externalTypeWallA || !room.validateMaterials.externalTypeWallB) {
          count_6++;
        }
        if (!room.validateMaterials.internalWall || !room.validateMaterials.partyWall || !room.validateMaterials.windowsTypeA || !room.validateMaterials.windowsTypeB || !room.validateMaterials.roofGlazing || !room.validateMaterials.externalDoor) {
          count_7++;
        }
        if (!room.validateMaterials.floor || !room.validateMaterials.ceilingFloor) {
          count_8++;
        }
      });
      var count_6mm = 0
      var count_7mm = 0
      var count_8mm = 0
      angular.forEach($scope.survey.surveys.rooms, function (room) {

        if (room.external_wall.type.a.length && !room.external_type.wall.a) {
          count_6mm++;
        } else if (room.external_wall.type.b.length && !room.external_type.wall.b) {
          count_6mm++;
        } else if ((room.internal_wall_length || room?.room_dimensions?.internal_wall) && !room.internal_wall) {
          count_6mm++;
        }
        if (room.party_wall_length && !room.party_wall) {
          count_6mm++;
        }

        if (room.external_wall.type.a.window_area && !room.windows.type.a) {
          count_7mm++;
        } else if (room.external_wall.type.b.window_area && !room.windows.type.b) {
          count_7mm++;
        } else if (room.roof_glazing_area && !room.roof_glazing) {
          count_7mm++;
        } else if (room.external_door_area && !room.external_door) {
          count_7mm++;
        }

        if (room.floor_area && !room.floor) {
          count_8mm++;
        } else if (!room.ceiling_or_roof) {
          count_8mm++;

        }
      });
      if (count_6 == 0 && count_6mm == 0) {
        $scope.step6Validation = false
      } else {
        $scope.step6Validation = true
      }

      if (count_7 == 0 && count_7mm == 0) {
        $scope.step7Validation = false
      } else {
        $scope.step7Validation = true
      }

      if (count_8 == 0 && count_8mm == 0) {
        $scope.step8Validation = false
      } else {
        $scope.step8Validation = true
      }

      //step 9
      if (!$scope.survey.surveys.proposed_install_type || $scope.survey.surveys.proposed_install_type == undefined || $scope.survey.surveys.proposed_install_type == null || $scope.survey.surveys.proposed_install_type == '' ||
        !$scope.survey.surveys.preferred_manufacture || $scope.survey.surveys.preferred_manufacture == undefined || $scope.survey.surveys.preferred_manufacture == null || $scope.survey.surveys.preferred_manufacture == '' ||
        !$scope.survey.surveys.preferred_model || $scope.survey.surveys.preferred_model == undefined || $scope.survey.surveys.preferred_model == null || $scope.survey.surveys.preferred_model == '' ||
        !$scope.survey.surveys.output_at_designed_external_temperature || $scope.survey.surveys.output_at_designed_external_temperature == undefined || $scope.survey.surveys.output_at_designed_external_temperature == null || $scope.survey.surveys.output_at_designed_external_temperature == '' ||
        !$scope.survey.surveys.maximum_designed_flow_temperature || $scope.survey.surveys.maximum_designed_flow_temperature == undefined || $scope.survey.surveys.maximum_designed_flow_temperature == null || $scope.survey.surveys.maximum_designed_flow_temperature == '' ||
        !$scope.survey.surveys.output_capcity_at_designed_dhw || $scope.survey.surveys.output_capcity_at_designed_dhw == undefined || $scope.survey.surveys.output_capcity_at_designed_dhw == null || $scope.survey.surveys.output_capcity_at_designed_dhw == ''
      ) {
        $scope.step9Validation = true
      }
      // disable the tabs
      if ($scope.step1Validation) {
        $scope.step2Disable = true
        $scope.step3Disable = true
        $scope.step4Disable = true
        $scope.step5Disable = true
        $scope.step6Disable = true
        $scope.step7Disable = true
        $scope.step8Disable = true
        $scope.step9Disable = true
        $scope.step10Disable = true

      } else if ($scope.step2Validation) {
        $scope.step3Disable = true
        $scope.step4Disable = true
        $scope.step5Disable = true
        $scope.step6Disable = true
        $scope.step7Disable = true
        $scope.step8Disable = true
        $scope.step9Disable = true
        $scope.step10Disable = true


      } else if ($scope.step3Validation) {
        $scope.step4Disable = true
        $scope.step5Disable = true
        $scope.step6Disable = true
        $scope.step7Disable = true
        $scope.step8Disable = true
        $scope.step9Disable = true
        $scope.step10Disable = true


      } else if ($scope.step4Validation) {
        $scope.step5Disable = true
        $scope.step6Disable = true
        $scope.step7Disable = true
        $scope.step8Disable = true
        $scope.step9Disable = true
        $scope.step10Disable = true


      } else if ($scope.step5Validation) {
        $scope.step6Disable = true
        $scope.step7Disable = true
        $scope.step8Disable = true
        $scope.step9Disable = true
        $scope.step10Disable = true


      } else if ($scope.step6Validation) {
        $scope.step7Disable = true
        $scope.step8Disable = true
        $scope.step9Disable = true
        $scope.step10Disable = true


      } else if ($scope.step7Validation) {
        $scope.step8Disable = true
        $scope.step9Disable = true
        $scope.step10Disable = true


      } else if ($scope.step8Validation) {
        $scope.step9Disable = true
        $scope.step10Disable = true


      }

      $scope.survey.surveys.hasError = {
        step1: $scope.step1Validation,
        step2: $scope.step2Validation,
        step3: $scope.step3Validation,
        step4: $scope.step4Validation,
        step5: $scope.step5Validation,
        step6: $scope.step6Validation,
        step7: $scope.step7Validation,
        step8: $scope.step8Validation
      }

    }


    function modalOpen (type) {

      var templateUrl = '/partials/views/summary/components/_modal_summary';
      var controller = 'ModalSummaryController';
      var size = 'md';

      var items = {
        thermal_bridges_insulated: {
          title: 'Thermal Bridges Insulated',
          question: 'Do you want to change the default value from 8%',
          property: 'thermal_bridges_value',
          value: $scope.survey.surveys.thermal_bridges_value ? $scope.survey.surveys.thermal_bridges_value : 8
        },
        has_mvhr: {
          title: 'MVHR System',
          question: 'Do you want to change the default value from 50% (Air Change Rates Will Be Changed On All Rooms, except for custom defined rooms).',
          property: 'mvhr_value',
          value: $scope.survey.surveys.mvhr_value ? $scope.survey.surveys.mvhr_value : 50
        }
      };



      var modalInstance = $modal.open({
        animation: true,
        templateUrl: templateUrl,
        controller: controller,
        size: size,
        resolve: {
          items: function () {
            return items[type];
          }
        }
      });

      modalInstance.result.then(function (selectedItem) {
        $scope.setValueChanged()
        $scope.setValueRunCalculation()
        if (selectedItem == 'YES') {
          //TODO: refactor; must let the user modify the input
          $scope.survey.surveys[items[type].property] = selectedItem;
        } else {
          $scope.survey.surveys[items[type].property] = selectedItem;
        }
        angular.forEach($scope.survey.surveys.rooms, function (value, key) {
          try {
            $scope.survey = summaryHelperService.populateAirChangesPerHour(key, value, $scope.survey);
          } catch (e) { }

        });
      }, function () {

      });
    }

    function validateStep5 () {
      var valCount5 = 0
      angular.forEach($scope.survey.surveys.rooms, function (room) {
        if (room.is_the_room_complex == 'YES') {
          //apply default
          room.complex_room_details.dim.one = room.complex_room_details.dim.one ? room.complex_room_details.dim.one : 0;
          room.complex_room_details.dim.two = room.complex_room_details.dim.two ? room.complex_room_details.dim.two : 0;
          room.complex_room_details.dim.three = room.complex_room_details.dim.three ? room.complex_room_details.dim.three : 0;
          room.complex_room_details.dim.four = room.complex_room_details.dim.four ? room.complex_room_details.dim.four : 0;
          room.complex_room_details.dim.five = room.complex_room_details.dim.five ? room.complex_room_details.dim.five : 0;
          room.complex_room_details.dim.six = room.complex_room_details.dim.six ? room.complex_room_details.dim.six : 0;

          room.complex_room_details.wall.type.a = room.complex_room_details.wall.type.a ? room.complex_room_details.wall.type.a : null;
          room.complex_room_details.wall.type.b = room.complex_room_details.wall.type.b ? room.complex_room_details.wall.type.b : null;
          room.complex_room_details.wall.type.c = room.complex_room_details.wall.type.c ? room.complex_room_details.wall.type.c : null;
          room.complex_room_details.wall.type.d = room.complex_room_details.wall.type.d ? room.complex_room_details.wall.type.d : null;

          //regardless of type
          if (room.complex_room_details.dim.one == 0 ||
            room.complex_room_details.dim.two == 0 ||
            room.complex_room_details.dim.three == 0 ||
            room.complex_room_details.wall.type.a == null ||
            room.complex_room_details.wall.type.c == null) {
            valCount5++
          }

          // type 1
          if (room.complex_room_details?.room_type == "Type 1" && room.complex_room_details != null) {
            if (room.complex_room_details.dim.four == 0 ||
              room.complex_room_details.dim.five != 0 ||
              room.complex_room_details.dim.six != 0 ||
              room.complex_room_details.wall.type.b == null ||
              room.complex_room_details.wall.type.d == null) {
              valCount5++
            }
          } else if (room.complex_room_details?.room_type == "Type 2" && room.complex_room_details != null) {
            if (room.complex_room_details.dim.four != 0 ||
              room.complex_room_details.dim.five != 0 ||
              room.complex_room_details.dim.six != 0) {
              valCount5++
            }
          } else if (room.complex_room_details?.room_type == "Type 3" && room.complex_room_details != null) {
            if (room.complex_room_details.dim.four == 0 ||
              room.complex_room_details.dim.six == 0 ||
              room.complex_room_details.dim.five != 0 ||
              room.complex_room_details.wall.type.b == null ||
              room.complex_room_details.wall.type.d == null) {
              valCount5++
            }
          } else if (room.complex_room_details?.room_type == "Type 4" && room.complex_room_details != null) {
            if (room.complex_room_details.dim.five == 0 ||
              room.complex_room_details.dim.four != 0 ||
              room.complex_room_details.dim.six != 0) {
              valCount5++
            }
          } else if (room.complex_room_details?.room_type == "Type 5" && room.complex_room_details != null) {
            if (room.complex_room_details.dim.four == 0 ||
              room.complex_room_details.dim.five != 0 ||
              room.complex_room_details.dim.six != 0 ||
              room.complex_room_details.wall.type.b == null ||
              room.complex_room_details.wall.type.d == null) {
              valCount5++
            }
          } else if (room.complex_room_details?.room_type == "Type 6" && room.complex_room_details != null) {
            if (room.complex_room_details.dim.four != 0 ||
              room.complex_room_details.dim.five != 0 ||
              room.complex_room_details.dim.six != 0 ||
              room.complex_room_details.wall.type.b == null ||
              room.complex_room_details.wall.type.d == null) {
              valCount5++
            }
          } else if (room.complex_room_details?.room_type == "Type 7" && room.complex_room_details != null) {
            if (room.complex_room_details.dim.four == 0 ||
              room.complex_room_details.dim.six == 0 ||
              room.complex_room_details.dim.five != 0 ||
              room.complex_room_details.wall.type.b == null ||
              room.complex_room_details.wall.type.d == null) {
              valCount5++
            }
          } else if (room.complex_room_details?.room_type == "Type 8" && room.complex_room_details != null) {
            if (room.complex_room_details.dim.five == null ||
              room.complex_room_details.dim.four != 0 ||
              room.complex_room_details.dim.six != 0 ||
              room.complex_room_details.wall.type.b == null) {
              valCount5++
            }
          }

          if (room.room_dimensions.external_wall_calcError) {
            valCount5++
          }
          if (room.room_dimensions.party_wall_calcError) {
            valCount5++
          }
          if (room.room_dimensions.internal_wall_calcError) {
            valCount5++
          }
        }
      });
      return valCount5;
    }

    function assignPropertyValue () {
      if ($scope.survey.surveys.thermal_bridges_insulated == 'NO') {
        $scope.survey.surveys.thermal_bridges_value = null;
      } else {
        $scope.survey.surveys.thermal_bridges_value = 8;
        $scope.survey.surveys.is_property_greater = 'YES';
      }
      $scope.setValueChanged()
    }

    function errorChecker (step, room, idx) {
      if (step == 5) {
        //$scope.survey.surveys.rooms.forEach((room, idx) => {
        $scope.survey.surveys.rooms[idx].room_dimensions.external_wall_calcError = false;
        if (room.room_dimensions.external_wall == 0) {
          if (room.complex_room_details.wall.type.a == "External wall" ||
            room.complex_room_details.wall.type.b == "External wall" ||
            room.complex_room_details.wall.type.c == "External wall" ||
            room.complex_room_details.wall.type.d == "External wall") {
            $scope.survey.surveys.rooms[idx].room_dimensions.external_wall_calcError = true;
          }
        }
        $scope.survey.surveys.rooms[idx].room_dimensions.party_wall_calcError = false;
        if (room.room_dimensions.party_wall == 0) {
          if (room.complex_room_details.wall.type.a == "Party wall" ||
            room.complex_room_details.wall.type.b == "Party wall" ||
            room.complex_room_details.wall.type.c == "Party wall" ||
            room.complex_room_details.wall.type.d == "Party wall") {
            $scope.survey.surveys.rooms[idx].room_dimensions.party_wall_calcError = true;
          }
        }
        $scope.survey.surveys.rooms[idx].room_dimensions.internal_wall_calcError = false;
        if (room.room_dimensions.internal_wall == 0) {
          if (room.complex_room_details.wall.type.a == "Internal wall" ||
            room.complex_room_details.wall.type.b == "Internal wall" ||
            room.complex_room_details.wall.type.c == "Internal wall" ||
            room.complex_room_details.wall.type.d == "Internal wall") {
            $scope.survey.surveys.rooms[idx].room_dimensions.internal_wall_calcError = true;
          }
        }
        //});
      }
    }

    // function highlightMinMax1(field, minText, maxText) {
    //   // floor Area
    //   let minMax = {minIdx: 0, maxIdx: 0}
    //   let maxValue = 0;
    //   let minValue = $scope.survey.surveys.rooms[0][field];

    //   $scope.survey.surveys.rooms.forEach((room, idx) => {
    //     // floor area
    //     // floor area min
    //     if(room[field] != null && room[field] != 0 && room[field] < minValue){
    //       minMax.minIdx = idx;
    //       minValue = room[field];
    //     } else {
    //       $scope.survey.surveys.rooms[idx][minText] = false;
    //     }
    //     // floorarea max
    //     if(room[field] > maxValue) {
    //       minMax.maxIdx = idx
    //       maxValue = room[field];
    //     } else {
    //       $scope.survey.surveys.rooms[idx][maxText] = false;
    //     }
    //   });

    //   // floor area
    //   $scope.survey.surveys.rooms[minMax.minIdx][minText] = true;
    //   $scope.survey.surveys.rooms[minMax.maxIdx][maxText] = true;

    // }

    $scope.initValueChecker = function () {
      if ($scope.survey.surveys.isValueChecked) {
        var modalInstance = $modal.open({
          animation: true,
          templateUrl: '/partials/views/summary/components/_modal_value_checker',
          controller: 'ModalValueCheckerInstanceController',
          size: 'md',
          resolve: {
            data: function () {
              return {
                isInfo: true,
                survey: $scope.survey,
                field: '',
              }
            }
          }
        });

        modalInstance.result.then(function (result) {
          // console.log('after popup result info true do nothing :::', result)
        });
      } else {
        var modalInstance = $modal.open({
          animation: true,
          templateUrl: '/partials/views/summary/components/_modal_value_checker',
          controller: 'ModalValueCheckerInstanceController',
          size: 'md',
          resolve: {
            data: function () {
              return {
                isInfo: false,
                survey: $scope.survey,
                field: '',
                minMax: $scope.minMax
              }
            }
          }
        });
      }

      modalInstance.result.then(function (result) {
        if (result) {
          result.surveys.rooms = surveyService.highlightMinMax(result.surveys.rooms).rooms;
          apiService.update('surveys', result).then(function (response) {
            $scope.survey = response;
          });
        }
      });

    };

  }

  /**
   * Function for Heat Summary Controller
   */
  HeatSummaryReviewController.$inject = ['_', '$location', '$scope', '$routeParams', 'apiService', 'commonService', 'calculationService', 'summaryHelperService', '$modal', 'alertService', '$rootScope'];

  function HeatSummaryReviewController (_, $location, $scope, $routeParams, apiService, commonService, calculationService, summaryHelperService, $modal, alertService, $rootScope) {

    init();
    $scope.loading = true
    $scope.openHeatSourceModal = function () {

      var modalOptions = {};
      modalOptions.templateUrl = '/partials/views/summary/heat-summary-review/components/_modal_heat_source_type';
      modalOptions.controller = 'ModalHeatSourceInstanceController';
      modalOptions.size = 'md';

      var modalInstance = $modal.open({
        animation: true,
        templateUrl: modalOptions.templateUrl,
        controller: modalOptions.controller,
        size: modalOptions.size = 'md',
        resolve: {
          data: function () {
            return {
              survey: $scope.survey,
              maxFlowTemp: $scope.maxFlowTemp
            }
          }
        }
      });

      modalInstance.result.finally(function () {
        $scope.setValueChanged()
        $scope.setValueRunCalculation()
        for (let i = 0; i < $scope.survey.surveys.preferred_model.length; i++) {
          if (!$scope.survey.surveys.preferred_model[i]) {
            $scope.survey.surveys.preferred_model.splice(i, 1)
          }
        }
      });

    };

    $scope.moveTo = function (location, page) {
      summaryHelperService.switchAndUpdateSurvey(null, location, $scope.survey, null, true).then(function () {
        if (page)
          $location.path('/' + location + '/' + $scope.survey._id + '/' + page);
        else {
          if (!!$scope.survey.surveys.preferred_manufacture &&
            !!$scope.survey.surveys.preferred_model &&
            !!$scope.survey.surveys.output_at_designed_external_temperature &&
            !!$scope.survey.surveys.maximum_designed_flow_temperature &&
            !!$scope.survey.surveys.output_capcity_at_designed_dhw)
            $location.path('/' + location + '/' + $scope.survey._id);
          else
            alertService('warning', 'Heat Source information required', 'You need to select manufacture model and input required data.');
        }

      });
    };

    function init () {
      $rootScope.adminManu = $rootScope.manufactures.filter(function (o) {
        return o._user_id != $rootScope.user._id;
      });
      $rootScope.myManu = $rootScope.manufactures.filter(function (o) {
        return o._user_id == $rootScope.user._id;
      })
      apiService.get('surveys', {
        _id: $routeParams.id
      }).then(function (survey) {
        $scope.survey = survey;
        $scope.loading = false
        $scope.maxFlowTemp = 0;
        angular.forEach($scope.survey.surveys.rooms, function (room, idx) {
          calculationService.initialize($scope.survey, idx);
          calculationService.calculate_heat_loss();
          calculationService.calculate_kilowatt_hours();
          if (room.flow_temperature > $scope.maxFlowTemp) {
            $scope.maxFlowTemp = room.flow_temperature;
          }
        });

        calculationService.calculate_total_power_watts();
        calculationService.calculate_total_energy_kilowatts();

        calculationService.initialize(survey);
        calculationService.calculate_summary_results();

        $scope.survey = calculationService.getAll().survey;

        var partner_id_array = [];
        $scope.survey.surveys.rooms = _.map($scope.survey.surveys.rooms, function (room) {
          if (!!room.is_the_room_split && room.is_the_room_split == "1") {

            var hasId = 0;
            _.each(partner_id_array, function (id) {
              if (id == room.room_partner_id) {
                hasId++;
              }
            });

            if (hasId == 0) {
              partner_id_array.push(room.room_id);

              _.each($scope.survey.surveys.rooms, function (inner_room) {
                if (room.room_partner_id == inner_room.room_id) {

                  inner_room.linked_colors = room.linked_colors = '#' + Math.floor(Math.random() * 16777215).toString(16);
                  if (!!room.heat_loss && inner_room.heat_loss) {
                    if (_.isNumber(room.heat_loss.total_watts) && _.isNumber(inner_room.heat_loss.total_watts)) {
                      room.heat_loss.linked_total_watts = room.heat_loss.linked_watts_per_meter_squared = parseFloat((room.heat_loss.total_watts + inner_room.heat_loss.total_watts).toFixed(2));
                    }

                    var total_floors = 0;
                    if (_.isNumber(room.floor_area) && _.isNumber(inner_room.floor_area))
                      total_floors = parseFloat((room.floor_area + inner_room.floor_area).toFixed(2));

                    room.heat_loss.linked_watts_per_meter_squared = parseFloat((room.heat_loss.linked_watts_per_meter_squared / total_floors).toFixed(2));

                    var max_total_watts = 0;
                    _.each($scope.survey.surveys.rooms, function (room) {
                      if (max_total_watts == 0)
                        max_total_watts = room.heat_loss.total_watts;
                      else if (max_total_watts < room.heat_loss.total_watts)
                        max_total_watts = room.heat_loss.total_watts;
                    });
                    room.heat_loss.linked_total_watts_percentage = parseFloat((room.heat_loss.linked_total_watts / max_total_watts).toFixed(2)) * 100;
                  }
                }
              });
            } else {
              room.split_disable = true;
            }
          }
          return room;
        });


      }, commonService.onError);
    }
  }

  TechnologySummaryController.$inject = ['$location', '$scope', '$routeParams', 'apiService', 'commonService', 'summaryHelperService', 'calculationService'];

  function TechnologySummaryController ($location, $scope, $routeParams, apiService, commonService, summaryHelperService, calculationService) {

    init();

    $scope.moveTo = function (location, page) {
      summaryHelperService.switchAndUpdateSurvey(null, location, $scope.survey, null, true).then(function () {
        if (page)
          $location.path('/' + location + '/' + $scope.survey._id + '/' + page);
        else
          $location.path('/' + location + '/' + $scope.survey._id);
      });
    };

    $scope.computeRHI = function () {

      var annual_space_heating_demand = $scope.survey.surveys.summary_results.annual_space_heating_demand;
      var annual_water_heating_demand = $scope.survey.surveys.summary_results.annual_water_heating_demand;

      var spacing_heating_supplied_by_hp;
      var water_heating_supplied_by_hp;

      if ($scope.survey.surveys.summary_results.spacing_heating_supplied_by_hp == 'YES')
        spacing_heating_supplied_by_hp = 1;
      else if ($scope.survey.surveys.summary_results.spacing_heating_supplied_by_hp == 'NO')
        spacing_heating_supplied_by_hp = 0;

      if ($scope.survey.surveys.summary_results.water_heating_supplied_by_hp == 'YES')
        water_heating_supplied_by_hp = 1;
      else if ($scope.survey.surveys.summary_results.water_heating_supplied_by_hp == 'NO')
        water_heating_supplied_by_hp = 0;

      $scope.survey.surveys.summary_results.maximum_qualifying_heat_supplied_by_the_hp = parseFloat((annual_space_heating_demand * spacing_heating_supplied_by_hp + annual_water_heating_demand * water_heating_supplied_by_hp).toFixed(2));
      $scope.survey.surveys.summary_results.maximum_qualifying_renewable_heat = parseFloat(($scope.survey.surveys.summary_results.maximum_qualifying_heat_supplied_by_the_hp * (1 - 1 / $scope.worst_performing_room.emitters.space_heating_likely_spf)).toFixed(2));
    };

    function init () {
      apiService.get('surveys', {
        _id: $routeParams.id
      }).then(function (survey) {

        var proposed_install_type;
        var heating_type;
        var room_index;

        $scope.survey = survey;

        angular.forEach($scope.survey.surveys.rooms, function (room, idx) {
          calculationService.initialize($scope.survey, idx);
          calculationService.calculate_heat_loss();
          calculationService.calculate_kilowatt_hours();
        });

        calculationService.calculate_total_power_watts();
        calculationService.calculate_total_energy_kilowatts();

        calculationService.initialize(survey);
        calculationService.calculate_summary_results();

        $scope.survey = calculationService.getAll().survey;

        proposed_install_type = $scope.survey.surveys.proposed_install_type.toLowerCase();
        heating_type = $scope.survey.surveys.fuel_compare.heating_type;
        room_index = $scope.survey.surveys.worst_performing_room;

        if (proposed_install_type == 'ashp' || proposed_install_type == 'gshp')
          $scope.summary_title = 'Heat Pump Summary';
        else if (proposed_install_type == 'biomass')
          $scope.summary_title = 'Biomass Summary';
        else
          $scope.summary_title = 'Fossil Fuel Summary';

        $scope.worst_performing_room = $scope.survey.surveys.rooms[room_index];

        angular.forEach(heating_type, function (items) {

          if ($scope.survey.surveys.proposed_install_type.toLowerCase() == 'ashp' || $scope.survey.surveys.proposed_install_type.toLowerCase() == 'gshp') {
            if (items.name == 'Direct Electric')
              $scope.cost_per_unit = items.price_per_unit;

            if (items.name == $scope.survey.surveys.bivalent_fuel_type) {
              $scope.efficiency = items.efficiency + '%';
              $scope.pence_per_kw = items.pence_per_kwh;
            }
          } else {
            if (items.name == $scope.survey.surveys.if_biomass_which_fuel_type)
              $scope.cost_per_unit = items.pence_per_kwh;
          }
        });
      }, commonService.onError);
    }
  }

  SummaryResultsController.$inject = ['_', '$rootScope', '$scope', '$routeParams', '$location', 'commonService', 'apiService', 'summaryHelperService', 'calculationService'];

  function SummaryResultsController (_, $rootScope, $scope, $routeParams, $location, commonService, apiService, summaryHelperService, calculationService) {

    $rootScope.showHeader = false;
    $rootScope.showFooter = false;
    $rootScope.heatmanagerview = true;

    init();

    $scope.checkType = function (model) {
      if (typeof (model) == 'string') {
        return true
      } else {
        return false
      }
    }

    $scope.moveTo = function (location, page) {

      if ($scope.survey.surveys.status == 'PROGRESS') {
        $scope.survey.surveys.status = 'COMPLETED';
      }

      if (!!$rootScope.user.is_admin)
        $scope.survey.surveys.is_request_to_complete = undefined;

      summaryHelperService.switchAndUpdateSurvey(null, location, $scope.survey, null, true).then(function () {
        if (page)
          $location.path('/' + location + '/' + $scope.survey._id + '/' + page);
        else
          $location.path('/' + location + '/' + $scope.survey._id);
      });
    };

    $scope.starRating = function (num) {
      return new Array(num);
    };

    function init () {
      apiService.get('surveys', {
        _id: $routeParams.id
      }).then(function (survey) {
        $scope.survey = survey;

        var proposed_install_type = $scope.survey.surveys.proposed_install_type.toLowerCase();
        var room_index = $scope.survey.surveys.worst_performing_room;

        if (room_index > -1) {
          if (!!$scope.survey.surveys.rooms[room_index].linked_colors) {
            let ri = room_index > 0 ? room_index - 1: 0;
            $scope.worst_performing_room = $scope.survey.surveys.rooms[ri];
          } else {
            $scope.worst_performing_room = $scope.survey.surveys.rooms[room_index];
          }
        }

        calculationService.initialize(survey);
        calculationService.calculate_summary_results();

        if (proposed_install_type.toLowerCase() == 'ashp' || proposed_install_type.toLowerCase() == 'gshp') {

          if (isNaN($scope.survey.surveys.domestic_hot_water.annual_demand))
            $scope.survey.surveys.domestic_hot_water.annual_demand = 0;

          $scope.total_energy_required = parseFloat(($scope.survey.surveys.total_energy_kilowatts + $scope.survey.surveys.domestic_hot_water.annual_demand).toFixed(2));
          $scope.total_estimated_running_cost = $scope.survey.surveys.summary_results.cost_of_electricity_for_hp;

        } else if (proposed_install_type.toLowerCase() == 'biomass') {
          $scope.total_energy_required = parseFloat((survey.surveys.total_energy_kilowatts + survey.surveys.domestic_hot_water.hot_water_annual_demand).toFixed(2));
          $scope.total_estimated_running_cost = $scope.survey.surveys.summary_results.cost_of_biofuel_for_bhs;
        } else {
          $scope.total_energy_required = parseFloat((survey.surveys.total_energy_kilowatts + survey.surveys.domestic_hot_water.hot_water_annual_demand).toFixed(2));

          var heating_type = survey.surveys.fuel_compare.heating_type;

          _.each(heating_type, function (items) {
            if (proposed_install_type.toLowerCase() == items.name.toLowerCase()) {
              $scope.total_estimated_running_cost = items.annual_running_cost;
            }
          });
        }
      }, commonService.onError);
    }
  }

  ModalHeatSourceInstanceController.$inject = ['_', '$scope', '$modalInstance', 'data', 'apiService', 'alertService', '$rootScope'];

  function ModalHeatSourceInstanceController (_, $scope, $modalInstance, data, apiService, alertService, $rootScope) {

    $scope.merchantManu = []
    $scope.merchantInputDisable = true
    $scope.merchantManuInputDisable = true
    $scope.merchantModalInputDisable = true
    $scope.allManu = [];
    $scope.imageVisible = false
    $scope.scopTemp = []
    $scope.textAlert = false
    $scope.scopDefaultTemp = [
      { temp: '35' },
      { temp: '40' },
      { temp: '45' },
      { temp: '50' },
      { temp: '55' },
      { temp: '60' },
      { temp: '65' },
      { temp: '70' },
      { temp: '75' },
      { temp: '80' },
    ]
    $scope.selectedModelForImg = []
    $scope.fuelDisable = false;
    $scope.manuSelectedModal = []
    $scope.onChange = {};

    $scope.manuInput = true
    $scope.modalInput = true

    $scope.survey = data.survey;
    $scope.maxFlowTemp = data.maxFlowTemp;

    $scope.save = function (event) {
      if (event.keyCode == 13) {
        $scope.ok()
      }
    }

    let query = {
      limit: 100,
      skip: 0,
    }

    $scope.onMerchantChange = function () {
      $scope.merchantManuInputDisable = true
      $scope.merchantModalInputDisable = true
      $scope.survey.surveys.preferred_manufacture = ""
      $scope.survey.surveys.preferred_model = ['']
      $scope.selectedModelForImg = []
      if ($scope.survey.surveys.preferred_merchant == 'none') {
        $scope.survey.surveys.preferred_model = ['']
      } else {
        $scope.merchantList = $scope.allManu.filter(function (val) { return val.isMerchant });
        getManufacturersForMerchants()
      }
    }

    function getManufacturersForMerchants () {
      var details = $scope.merchantList.filter(function (val) { return val.company_name == $scope.survey.surveys.preferred_merchant });
      if (details.length == 0) {
        var details = $scope.mcsCompList.filter(function (val) { return val.company_name == $scope.survey.surveys.preferred_merchant });
      }
      apiService.get('merchantByUserId', { _id: details[0]._id }).then(function (details1) {
        $scope.premiumMerchantManufacturers = details1.merchant.map(function (data) {
          data.company_name = data.manufacture_name
          return data
        })
        $scope.merchantManuInputDisable = false
        $scope.manuSelectedModal = []
      });
    }

    $scope.onMerchantManuChange = function () {
      $scope.survey.surveys.preferred_model = ['']
      $scope.selectedModelForImg = []
      var manufacDetails = $scope.premiumMerchantManufacturers.filter(function (val) { return val.company_name == $scope.survey.surveys.preferred_manufacture });
      $scope.merchantModals = manufacDetails[0].models
      $scope.merchantModalInputDisable = false
      $scope.merchantManuInputDisable = false
    }

    function initHeatSourceModal () {

      /**
       * algorithm:
       * get heat source type - got from cloud data
       * get
       */

      // apiService['getAllPremier'].query(function (response) {
        // $scope.premiumManufactures = response;
        $scope.allManu = $scope.allManu.concat($rootScope.premiumManufactures);
      // });
      $rootScope.adminManu = $rootScope.manufactures.filter(function (o) {
        return o._user_id != $rootScope.user._id;
      });
      $rootScope.myManu = $rootScope.manufactures.filter(function (o) {
        return o._user_id == $rootScope.user._id;
      })
      $scope.allManu = $scope.allManu.concat($rootScope.adminManu);
      $scope.allManu = $scope.allManu.concat($rootScope.myManu);

      if ($scope.survey.surveys.preferred_merchant || $scope.survey.surveys.preferred_merchant != "none") {
        apiService['manufacturerAll'].query(query, function (response) {
          $scope.allManu = $scope.allManu.concat(response.users)
          let dataList = response.users
          $scope.ManufactureList = dataList.filter(function (val) { return val.isManufacturer && !val.isMerchant });
          $scope.merchantList = dataList.filter(function (val) { return val.isMerchant && !val.isMcsUmbrellaComp });
          $scope.mcsCompList = dataList.filter(function (val) { return val.isMcsUmbrellaComp });
          $scope.merchantInputDisable = false;
          var merchantSelected = dataList.filter(function (val) { return val.company_name == $scope.survey.surveys.preferred_merchant; });
          if (merchantSelected.length > 0) {
            $scope.userDetails = merchantSelected[0]
            getManufactureForMerchant($scope.userDetails)
          } else {
            $scope.survey.surveys.preferred_merchant = "none";
            if ($scope.survey.surveys.preferred_manufacture) {
              $scope.maufacturersModelList();
            }
          }
        });
      }

      $scope.onHeatSourceTypeChange();

      if ($scope.survey.surveys.preferred_model) {
        if (typeof ($scope.survey.surveys.preferred_model) == 'string') {
          $scope.survey.surveys.preferred_model = [$scope.survey.surveys.preferred_model]
        } else if (typeof ($scope.survey.surveys.preferred_model) == 'object') {
          if ($scope.survey.surveys.preferred_model.length == 0) {
            $scope.survey.surveys.preferred_model = ['']
          }
        }
      } else {
        $scope.survey.surveys.preferred_model = ['']
      }
    }

    function getManufactureForMerchant (userDetails) {
      if ($scope.survey.surveys.preferred_merchant != 'none' || !$scope.survey.surveys.preferred_merchant) {
        apiService.get('merchantByUserId', { _id: userDetails._id }).then(async function (details1) {
          $scope.premiumMerchantManufacturers = details1.merchant.map(function (data) {
            data.company_name = data.manufacture_name
            return data
          });
          $scope.merchantManuInputDisable = false
          $scope.merchantModalInputDisable = false
          getModelsForMerchantManufacturers();
        });
      }
    }

    function getModelsForMerchantManufacturers () {
      var manufacDetails = $scope.premiumMerchantManufacturers.filter(function (val) { return val.manufacture_name == $scope.survey.surveys.preferred_manufacture })
      $scope.merchantModals = manufacDetails[0].models
      $scope.merchantModalInputDisable = false
      for (let i = 0; i < $scope.survey.surveys.preferred_model.length; i++) {
        $scope.change.onMerchantManuModalChange(i)
      }
      $scope.maufacturersModelList()
    }

    $scope.onManufactureChange = function () {
      $scope.survey.surveys.preferred_model = ['']
      //$scope.manuSelectedModal = []
      $scope.maufacturersModelList();
    }

    $scope.maufacturersModelList = function () {

      var result = [];
      var flag = false;
      if ($scope.survey.surveys.preferred_manufacture) {
        var subsManu = $scope.allManu.filter(function (val) { return val.company_name == $scope.survey.surveys.preferred_manufacture });

        if (subsManu.length != 0) {
          result = subsManu[0].models
        } else {
          angular.forEach(manufacture, function (items) {
            _.each(items, function (item, idx) {
              if (idx == 'company_name') {
                if (item == $scope.survey.surveys.preferred_manufacture)
                  flag = true;
              }
              if (idx == 'models') {
                if (!!flag) {
                  result = item;
                  flag = false;
                }
              }
            });
          });
        }
        $scope.modalList = result
        $scope.manuSelectedModal = []
        for (let i = 0; i < $scope.survey.surveys.preferred_model.length; i++) {
          $scope.modelDetail(i, 0)
        }
      }
      return result;
    }


    $scope.modelDetail = function (index, modal) {
      var modelName = $scope.survey.surveys.preferred_model[index]
      // if($scope.survey.surveys.preferred_model.length < 1){
      //   $scope.survey.surveys.maximum_designed_flow_temperature = ''
      // }
      // $scope.change.onFlowTempChange();
      if (!$scope.survey.surveys.preferred_merchant || $scope.survey.surveys.preferred_merchant == "none") {
        var selectedModel = $scope.modalList.filter(function (o) {
          return o.model_name == modelName;
        });
      } else {
        var selectedModel = $scope.modalList.filter(function (o) {
          return o.model_name == modelName;
        });
      }
      var selectedModel = $scope.modalList.filter(function (o) {
        return o.model_name == modelName;
      });
      if($scope.survey.surveys.preferred_model != ''){
        $scope.manuSelectedModal[index] = selectedModel[0]
      }
    }

    $scope.change = {
      onFlowTempChange: function () {
        var modalsForTemp = $scope.modalList;
        if ($scope.survey.surveys.proposed_install_type == "GSHP" || $scope.survey.surveys.proposed_install_type == "ASHP") {
          if (!$scope.survey.surveys.preferred_merchant || $scope.survey.surveys.preferred_merchant == "none") {
            modalsForTemp = $scope.modalList
          } else {
            modalsForTemp = $scope.merchantModals
          }
        }

        var singleModal = modalsForTemp.filter(function (o) {
          return o.model_name == $scope.survey.surveys.preferred_model[0];
        })
        var temp = singleModal[0].scop
        var checkVal = temp.filter(function (o) {
          return o.temp == $scope.survey.surveys.maximum_designed_flow_temperature;
        })
        if (singleModal[0].model_name != 'To be confirmed' && checkVal.length == 0) {
          if ($scope.survey.surveys.proposed_install_type == "GSHP" || $scope.survey.surveys.proposed_install_type == "ASHP") {
            alertService('danger', '', 'Temperature is not available please select valid Temperature');
            $scope.survey.surveys.maximum_designed_flow_temperature = ''
            $scope.textAlert = true
          } else {
            $scope.textAlert = false;
          }
        } else if (singleModal[0].model_name != 'To be confirmed' && checkVal[0].spf == null) {
          if ($scope.survey.surveys.proposed_install_type == "GSHP" || $scope.survey.surveys.proposed_install_type == "ASHP") {
            alertService('danger', '', 'Selected Temperature does not have any spf value please select a different one');
            $scope.textAlert = true
          } else {
            $scope.textAlert = false;
          }
        } else {
          $scope.textAlert = false;
        }
      },
      onMerchantManuModalChange: function (index) {
        // if($scope.survey.surveys.preferred_model.length < 1){
        //   $scope.survey.surveys.maximum_designed_flow_temperature = ''
        // }
        $scope.change.onFlowTempChange();
        $scope.selectedModel = $scope.merchantModals.filter(function (o) {
          return o.model_name == $scope.survey.surveys.preferred_model[index];
        });
        $scope.selectedModelForImg[index] = $scope.selectedModel[0]

      }
    }

    $scope.imgAndPdf = function () {
      $scope.imageVisible = !$scope.imageVisible
    }

    $scope.onHeatSourceTypeChange = function () {
      var fossilfuels = ["Biomass", "Oil", "LPG", "Mains Gas", "Direct Electric"]
      $scope.maxFlowTempList = ["35", "40", "45"]

      var selectedFuel = fossilfuels.find(
        function (el) {
          return el === $scope.survey.surveys.proposed_install_type
        }
      );
      if (selectedFuel !== undefined) {
        $scope.fuelDisable = true;
        $scope.survey.surveys.output_capcity_at_designed_dhw = $scope.survey.surveys.output_at_designed_external_temperature;
      } else {
        $scope.fuelDisable = false;
      }
    }

    $scope.updateOutputCapacity = function () {
      var fossilfuels = ["Biomass", "Oil", "LPG", "Mains Gas", "Direct Electric"]

      var selectedFuel = fossilfuels.find(
        function (el) {
          return el === $scope.survey.surveys.proposed_install_type
        }
      );
      if (selectedFuel !== undefined) {
        $scope.survey.surveys.output_capcity_at_designed_dhw = $scope.survey.surveys.output_at_designed_external_temperature;
      }
    }

    $scope.ok = function () {
      let req = false;

      if ($scope.survey.surveys.proposed_install_type == "GSHP" || $scope.survey.surveys.proposed_install_type == "ASHP") {
        if ($scope.survey.surveys.preferred_model[0] == '' || !$scope.survey.surveys.preferred_model || $scope.survey.surveys.preferred_model.length == 0) {
          alertService('danger', '', 'Please Select Model');
          req = false;
        } else {
          var modalsForTemp = $scope.modalList;
          if ($scope.survey.surveys.proposed_install_type == "GSHP" || $scope.survey.surveys.proposed_install_type == "ASHP") {
            if (!$scope.survey.surveys.preferred_merchant || $scope.survey.surveys.preferred_merchant == "none") {
              modalsForTemp = $scope.modalList
            } else {
              modalsForTemp = $scope.merchantModals
            }
          }
          var singleModal = modalsForTemp.filter(function (o) {
            return o.model_name == $scope.survey.surveys.preferred_model[0];
          })
          var scop = singleModal[0].scop;
          if($scope.survey.surveys.domestic_hot_water){
            $scope.survey.surveys.domestic_hot_water.flow_temperature_for_hot_water = $scope.survey.surveys.domestic_hot_water.flow_temperature_for_hot_water ? $scope.survey.surveys.domestic_hot_water.flow_temperature_for_hot_water : {temp: 0, value: 0};
            $scope.survey.surveys.domestic_hot_water.flow_temperature_collection = scop;
            var temp = $scope.survey.surveys.domestic_hot_water.flow_temperature_for_hot_water.temp;
            var tempFilt = scop.filter(function(o){
              return o.temp == temp;
            });
            if(tempFilt.length > 0) {
              $scope.survey.surveys.domestic_hot_water.flow_temperature_for_hot_water = {temp: tempFilt[0].temp, value: tempFilt[0].spf};
            } else {
              $scope.survey.surveys.domestic_hot_water.flow_temperature_for_hot_water = {temp: undefined, value: null}
              alertService('warning', 'DWH', 'Domestic Hot water - information required.');
            }
          } else {
            $scope.survey.surveys.domestic_hot_water = {}
            $scope.survey.surveys.domestic_hot_water.flow_temperature_collection = scop;
          }
          $scope.textAlert = false
          req = true
        }
      } else {
        if ($scope.survey.surveys.preferred_model[0] == '' || !$scope.survey.surveys.preferred_model || $scope.survey.surveys.preferred_model.length == 0) {
          alertService('danger', '', 'Please Select Model');
          req = false;
        } else {
          $scope.textAlert = false
          req = true
        }
      }
      if ($scope.survey.surveys.preferred_model && $scope.survey.surveys.maximum_designed_flow_temperature == '') {
        alertService('danger', '', 'Flow temperation is required');
        req = false
      }
      if (req == true) {
        $modalInstance.close($scope.survey);
      }
    };

    $scope.cancel = function () {
      $modalInstance.dismiss('cancel');
    };

    initHeatSourceModal();
    //end of controller
  }

  ModalNotesInstanceController.$inject = ['$scope', '$modalInstance', 'notes', 'room', 'parentIndex', 'apiService', '$routeParams', 'commonService', 'alertService'];

  function ModalNotesInstanceController ($scope, $modalInstance, notes, room, parentIndex, apiService, $routeParams, commonService, alertService) {
    $scope.data = {}
    $scope.notesEdit = false
    $scope.editInput = false
    $scope.editDesp = function (desp) {
      $scope.data.description
      $scope.editInput = true
    }
    init()
    function init () {
      apiService.get('surveys', {
        _id: $routeParams.id
      }).then(function (survey) {
        $scope.survey = survey
      })
    }
    $scope.editNotes = function (type) {
      if (type == 'edit') {
        $scope.notesEdit = true
      } else if (type == 'cancel') {
        $scope.notesEdit = false
        $scope.room.room_notes = ''
      } else {
        $scope.notesEdit = false
      }
    }
    $scope.notes = notes;
    $scope.room = room;
    $scope.isEdit = false;
    $scope.imageZoom = false

    $scope.openImage = function (index, room, img) {

      $scope.imageIndex = index
      $scope.image = img.imageLink
      // $scope.description = img.imageDesc
      $scope.data.description = img.imageDesc
      $scope.imageZoom = true

    }
    $scope.backToList = function () {
      $scope.imageZoom = false
    }
    $scope.save = function () {
      $scope.isEdit = !$scope.isEdit;
    };

    $scope.edit = function () {
      $scope.isEdit = !$scope.isEdit;
    };

    $scope.done = function () {
      $modalInstance.close($scope.room.room_notes);
    };

    $scope.notesSave = function () {
      $scope.survey.surveys.rooms[parentIndex].room_notes = $scope.room.room_notes
      $scope.editNotes('cancel2')
      //   apiService.update('surveys', $scope.survey).then(function (response) {
      //     $scope.editNotes('cancel')
      //     init()
      //     alertService('success', 'Room', 'notes Updated successfully!');
      //  }, commonService.onError);
    }
    $scope.despSave = function () {

      $scope.survey.surveys.rooms[parentIndex].images[$scope.imageIndex].imageDesc = $scope.data.description
      apiService.update('surveys', $scope.survey).then(function (response) {
        $scope.room.images[$scope.imageIndex].imageDesc = $scope.data.description
        $scope.cancel()
        init()
        alertService('success', 'Image', 'description Updated successfully!');
      }, commonService.onError);

    }
    $scope.cancel = function () {
      $scope.editInput = false
      init()
      // $modalInstance.close($scope.room)
    }

  }

  /**
   * controller ModalCustomNameController
   * used to update custom room name. custom design temperation and custom air changes.
   */
  ModalCustomNameController.$inject = ['$rootScope', '$scope', '$modalInstance', 'room', 'validateCustom', '_'];

  function ModalCustomNameController ($rootScope, $scope, $modalInstance, room, validateCustom, _) {

    var validateData = validateCustom
    var survey = room.survey;
    var idx = room.index;
    var collection = {
      isAlreadyDefined: room.isAlreadyDefined
    };
    $scope.room_name = survey.surveys.rooms[idx].room_name;
    $scope.room = survey.surveys.rooms[idx];
    let firstTime = true
    $scope.selectValues = [];
    $scope.selectedItem = {};
    $scope.selectedValue = $scope.room.room_type || null;
    // $scope.displayValues = {};
    $scope.isInput = false;
    $scope.setInput = {
      isAdjust: $scope.room.isAdjust ? $scope.room.isAdjust : false,
      isAdjustCustomTemp: $scope.room.isAdjustCustomTemp ? $scope.room.isAdjustCustomTemp : false
    };

    angular.forEach($rootScope.cloud_data.custom_uf_heating_temps, function (item, idx) {
      $scope.selectValues.push(idx);
    });

    $scope.getCustomValues = function (itm) {
      survey.surveys.rooms[idx].room_type = itm;
      angular.forEach($rootScope.cloud_data.custom_uf_heating_temps, function (item, idx) {
        if (itm == idx)
          $scope.selectedItem = item;
      });

      if (survey.surveys.rooms[idx].room_built >= 2000)
        $scope.room.designed_temperature = $scope.selectedItem.temp[0];
      else if (survey.surveys.rooms[idx].room_built < 2000)
        $scope.room.designed_temperature = $scope.selectedItem.temp[1];

      if (survey.surveys.rooms[idx].room_built >= 2006)
        $scope.room.air_changes_per_hour = $scope.selectedItem.air[0];
      else if (survey.surveys.rooms[idx].room_built >= 2000 && survey.surveys.rooms[idx].room_built < 2006)
        $scope.room.air_changes_per_hour = $scope.selectedItem.air[1];
      else if (survey.surveys.rooms[idx].room_built < 2000)
        $scope.room.air_changes_per_hour = $scope.selectedItem.air[2];
    };

    if ($scope.room.room_type) {
      if (survey.surveys.custom_names.hasOwnProperty($scope.room_name)) {
        $scope.room.designed_temperature = survey.surveys.custom_names[$scope.room_name].temp[0]
        $scope.room.air_changes_per_hour = survey.surveys.custom_names[$scope.room_name].air[0]
      }
      //firstTime = false
    }
    $scope.ok = function () {
      survey.surveys.rooms[idx].isAdjust = $scope.setInput.isAdjust;
      survey.surveys.rooms[idx].isAdjustCustomTemp = $scope.setInput.isAdjustCustomTemp;
      if ($scope.room.designed_temperature && $scope.room.air_changes_per_hour) {
        survey.surveys.rooms[idx].air_changes_per_hour = $scope.room.air_changes_per_hour;
        survey.surveys.rooms[idx].designed_temperature = $scope.room.designed_temperature;
        survey.surveys.rooms[idx].given_air_changes_per_hour = $scope.room.air_changes_per_hour;
        if ($scope.room.room_type) {
          survey.surveys.rooms[idx].is_custom_room_defined = true;
          if (validateData.count > 0) validateData.count = validateData.count - 1;
          if (validateData.count == 0) {
            validateData.hasUndefinedCustomRoomName = false;
          }
        } else {
          validateData.count = validateData.count + 1;
          validateData.hasUndefinedCustomRoomName = true;
        }
        var keys = _.keys($rootScope.cloud_data.uf_heating_temps);
        var room_name = $scope.room.room_name;


        var isCustomName = 0;
        _.each(keys, function (key) {
          if (key == room_name) {
            isCustomName++;
          }
        });

        room_name = room_name.replace('.', '_');

        if (isCustomName == 0) {

          survey.surveys.custom_names[room_name] = {};
          survey.surveys.custom_names[room_name].temp = [];
          survey.surveys.custom_names[room_name].air = [];

          survey.surveys.custom_names[room_name].temp.push($scope.room.designed_temperature);
          survey.surveys.custom_names[room_name].temp.push($scope.room.designed_temperature);
          survey.surveys.custom_names[room_name].temp.push($scope.room.designed_temperature);
          survey.surveys.custom_names[room_name].air.push($scope.room.air_changes_per_hour);
          survey.surveys.custom_names[room_name].air.push($scope.room.air_changes_per_hour);
          survey.surveys.custom_names[room_name].air.push($scope.room.air_changes_per_hour);

          var obj = {};
          obj[room_name] = survey.surveys.custom_names[room_name];
          $rootScope.cloud_data.uf_heating_temps = lodash.merge($rootScope.cloud_data.uf_heating_temps, obj);
        } else {

          if(!survey.surveys.custom_names[room_name]) {
            survey.surveys.custom_names[room_name] = {};
            survey.surveys.custom_names[room_name].temp = [];
            survey.surveys.custom_names[room_name].air = [];
          }

          survey.surveys.custom_names[room_name].temp[0] = $scope.room.designed_temperature;
          survey.surveys.custom_names[room_name].temp[1] = $scope.room.designed_temperature;
          survey.surveys.custom_names[room_name].temp[2] = $scope.room.designed_temperature;
          survey.surveys.custom_names[room_name].air[0] = $scope.room.air_changes_per_hour;
          survey.surveys.custom_names[room_name].air[1] = $scope.room.air_changes_per_hour;
          survey.surveys.custom_names[room_name].air[2] = $scope.room.air_changes_per_hour;
        }
        let ret = {};
        ret.survey = survey;
        ret.validateCustom = validateData;
        $modalInstance.close(ret);
      }
    };

    $scope.cancel = function () {
      survey.surveys.rooms[idx].is_custom_room_defined = false;
      $modalInstance.dismiss('cancel');
    };
  }

  ModalAdjustController.$inject = ['$rootScope', '$scope', '$modalInstance', 'data', 'alertService'];

  function ModalAdjustController ($rootScope, $scope, $modalInstance, data, alertService) {

    var survey = data.survey;
    var idx = data.index;
    $scope.room = survey.surveys.rooms[idx];
    $scope.room_type_list = $rootScope.cloud_data.custom_uf_heating_temps;
    $scope.showCustomRoom = false;

    if ($scope.room.room_type != null) {
      $scope.showCustomRoom = true;
    }
    //if($scope.room.custom_names.room_)
    var oldRoomName = survey.surveys.rooms[idx].room_name
    $scope.setInput = {
      isAdjust: $scope.room.isAdjust ? $scope.room.isAdjust : false,
      isAdjustCustomTemp: $scope.room.isAdjustCustomTemp ? $scope.room.isAdjustCustomTemp : false
    };

    $scope.default_uf_heating_temps = $rootScope.cloud_data.uf_heating_temps
    $scope.save = function (event) {
      if (event.keyCode == 13) {
        $scope.ok()
      }
    }
    $scope.ok = function () {
      var nameCheck = survey.surveys.rooms.filter(function (val) {
        return val.room_name.toLowerCase() == $scope.room.room_name.toLowerCase();
      });

      // const index = survey.surveys.rooms.findIndex(object => {
      //   return object.room_name == $scope.room.room_name;
      // });
      if (nameCheck.length > 1) {
        alertService('danger', 'Room', 'This Room Name is already available');
        survey.surveys.rooms[idx].room_name = oldRoomName
      } else {
        if ($scope.room.room_name != "" && !$scope.room.room_name) {
          alertService('danger', 'Room', 'Please Enter Room Name');
          survey.surveys.rooms[idx].room_name = oldRoomName
        } else {

          if ($scope.showCustomRoom == false) {
            $scope.room.room_type = undefined;
          } else {
            if ($scope.room.room_type == undefined) {
              alertService('danger', 'Room', 'This Room Type is required');
            }
            if ($scope.room.room_name == "") {
              alertService('danger', 'Room', 'Room name is required');
            }
          }

          if ($scope.room.room_type != undefined) {
            $scope.room.is_custom_room_defined = true;
          }
          survey.surveys.rooms[idx] = $scope.room;
          survey.surveys.rooms[idx].isAdjust = $scope.setInput.isAdjust;
          survey.surveys.rooms[idx].isAdjustCustomTemp = $scope.setInput.isAdjustCustomTemp;
          var room_name = survey.surveys.rooms[idx].room_name;
          if ($scope.showCustomRoom) {
            var room_name = survey.surveys.rooms[idx].room_type;
          }
          if (!$scope.setInput.isAdjustCustomTemp) {
            if (survey.surveys.rooms[idx].room_built >= 2000) {
              if ($rootScope.cloud_data.custom_uf_heating_temps[room_name]) {
                $scope.room.designed_temperature = $rootScope.cloud_data.custom_uf_heating_temps[room_name].temp[0];
              } else {
                $scope.room.designed_temperature = $scope.default_uf_heating_temps[room_name].temp[2];
              }
            } else if (survey.surveys.rooms[idx].room_built < 2000) {
              if ($rootScope.cloud_data.custom_uf_heating_temps[room_name]) {
                $scope.room.designed_temperature = $rootScope.cloud_data.custom_uf_heating_temps[room_name].temp[1];
              } else {
                $scope.room.designed_temperature = $scope.default_uf_heating_temps[room_name].temp[0];
              }
            }
          }
          if (!$scope.setInput.isAdjust) {
            if (survey.surveys.rooms[idx].room_built >= 2006) {
              if ($rootScope.cloud_data.custom_uf_heating_temps[room_name]) {
                $scope.room.air_changes_per_hour = $rootScope.cloud_data.custom_uf_heating_temps[room_name].air[0];
              } else {
                $scope.room.air_changes_per_hour = $scope.default_uf_heating_temps[room_name].air[0];
              }
            } else if (survey.surveys.rooms[idx].room_built >= 2000 && survey.surveys.rooms[idx].room_built < 2006) {
              if ($rootScope.cloud_data.custom_uf_heating_temps[room_name]) {
                $scope.room.air_changes_per_hour = $rootScope.cloud_data.custom_uf_heating_temps[room_name].air[1];
              } else {
                $scope.room.air_changes_per_hour = $scope.default_uf_heating_temps[room_name].air[1];
              }
            } else if (survey.surveys.rooms[idx].room_built < 2000) {
              if ($rootScope.cloud_data.custom_uf_heating_temps[room_name]) {
                $scope.room.air_changes_per_hour = $rootScope.cloud_data.custom_uf_heating_temps[room_name].air[2];
              } else {
                $scope.room.air_changes_per_hour = $scope.default_uf_heating_temps[room_name].air[2];
              }
            }
          }
          let ret = {};
          ret.survey = survey
          $modalInstance.close(ret);
        }
      }
    };

    $scope.cancel = function () {
      $modalInstance.dismiss('cancel');
    };
  }

  ModalDegreeDataController.$inject = ['$scope', '$modalInstance', 'data'];

  function ModalDegreeDataController ($scope, $modalInstance, data) {

    $scope.selectData = {
      options: [
        '39 weeks',
        '52 weeks'
      ]
    };

    if (data == 'low_weeks')
      $scope.selectData.selected = $scope.selectData.options[0];
    else if (data == 'high_weeks')
      $scope.selectData.selected = $scope.selectData.options[1];

    $scope.ok = function () {
      var selected = null;
      if ($scope.selectData.selected == '39 weeks')
        selected = 'low_weeks';
      else if ($scope.selectData.selected == '52 weeks')
        selected = 'high_weeks';


      if($scope.degreeDayObj) $scope.region = $scope.degreeDayObj[selected === 'low_weeks' ? '39' : '52']
      $modalInstance.close(selected);
    };

    $scope.cancel = function () {
      $modalInstance.dismiss('cancel');
    };
  }

  /**
   * Function Modal Surveys Controller
   */
  ModalSummaryController.$inject = ['$scope', '$modalInstance', 'items'];

  function ModalSummaryController ($scope, $modalInstance, items) {
    $scope.modalQuestion = items.question;
    $scope.modalTitle = items.title;
    $scope.subTitle = items.subTitle;
    $scope.selectedItem = items.value;

    $scope.ok = function () {
      $modalInstance.close($scope.selectedItem);
    };

    $scope.cancel = function () {
      $modalInstance.dismiss('cancel');
    };
  }

  /**
   * Function Modal Surveys Controller
   */
  ModalSurveysController.$inject = ['$scope', '$modalInstance', 'items'];

  function ModalSurveysController ($scope, $modalInstance, items) {

    $scope.items = items;

    $scope.selected = {
      item: items.value
    };

    $scope.save = function (event) {
      if (event.keyCode == 13) {
        $scope.ok()
      }
    }

    $scope.ok = function () {
      $modalInstance.close($scope.selected.item);
    };

    $scope.cancel = function () {
      $modalInstance.dismiss('cancel');
    };
  }

  ModalConsultantController.$inject = ['$scope', '$modalInstance', 'items'];

  function ModalConsultantController ($scope, $modalInstance, items) {

    $scope.tick = false;

    $scope.ok = function () {
      $modalInstance.close($scope.tick);
    };

    $scope.cancel = function () {
      $modalInstance.dismiss('cancel');
    };
  }

  // ModalFlowTempController.$inject = ['$scope', '$modalInstance', 'items'];
  // function ModalFlowTempController($scope, $modalInstance, items) {

  //   $scope.tick = false;

  //   $scope.ok = function () {
  //   };

  //   $scope.cancel = function () {
  //     $modalInstance.dismiss('cancel');
  //   };
  // }

  /**
   * Function Modal Edit Controller
   */
  ModalEditController.$inject = ['$scope', '$rootScope', '$location', '$modalInstance', 'items', 'alertService', '$routeParams'];

  function ModalEditController ($scope, $rootScope, $location, $modalInstance, items, alertService, $routeParams) {
    $scope.page = $routeParams.page ? parseInt($routeParams.page) : 1;
    $scope.modalTitle = items.title;
    $scope.unit = items.unit
    $scope.subTitle = items.subTitle;
    $scope.type = items.type;
    $scope.items = items.collections;
    $scope.items.push("Remove");
    $scope.save = function (event) {
      if (event.keyCode == 13) {
        $scope.ok()
      }
    }
    $scope.isCustomMaterials = items.isCustomMaterials;
    var default_value = $scope.items[0];

    if (items.default_value)
      default_value = items.default_value;

    $scope.addBuildingElement = function () {
      $rootScope.reference = {};
      $rootScope.reference.idx = items.idx;
      $rootScope.reference.item = items.item;
      $rootScope.reference.type = items.property;
      $rootScope.reference.survey = items.survey;
      $rootScope.reference.page = items.page;
      $modalInstance.dismiss('cancel');
      $location.path('/custom-materials/' + items.property);
    };

    $scope.selected = {
      item: default_value
    };

    var searchItem = $scope.selected.item;
    var hasZeroAtEnd = false;
    var str;

    if (!!$scope.isCustomMaterials) {
      $scope.selectToOptions = false;
      $scope.modalTitle = 'Add to Custom Materials';
      $scope.selected.old = $scope.selected.item;
      if ($scope.selected.item.toString().substring($scope.selected.item.length - 2, $scope.selected.item.length - 1) == '0') {
        hasZeroAtEnd = true;
      }

      $scope.selected.u_value = Number($scope.selected.item.toString().replace(/[^0-9\.]+/g, ""));

      if (typeof $scope.selected.u_value != 'number')
        $scope.selected.u_value = 0;

      str = searchItem.toString().search("\\(");

      if (str != -1) {
        $scope.selected.item = $scope.selected.item.toString().substr(0, str - 1);
        $scope.selected.u_value = parseFloat(searchItem.toString().substr(str + 1, searchItem.toString().length));
      } else
        $scope.selected.u_value = 0;
    }

    $scope.chooseOptions = function () {
      $scope.selectToOptions = !$scope.selectToOptions;
      if (!!$scope.selectToOptions)
        $scope.materials = $rootScope.materials.defaults;
    };

    $scope.ok = function () {
      if (items.isCustomMaterials != false) {
        if (isNaN($scope.selected.u_value)) {
          alertService('danger', 'Not a number', 'You should enter a number character to proceed');
          return;
        }
        if (hasZeroAtEnd) {

          var split = [];

          try {
            split = ($scope.selected.u_value).split('.');

            if (split[1].length == 1 && split[1] == '0') {
              $scope.selected.u_value = split[0] += '.0';
            } else if (split[1].length > 1) {
              var char = split[1].split('');
              var conchar = '';

              for (var i = 0; i < char.length; i++) {

                if (char[(char.length - 1) - i] == '0') {
                  char[char.length - i] = '';
                } else
                  break;
              }

              for (var j = 0; j < char.length; j++) {
                conchar += char[j];
              }

              $scope.selected.u_value = split[0] += '.' + conchar;
            } else
              $scope.selected.u_value += '0';
          } catch (e) {
            $scope.selected.u_value += '0';
          }
        }

        $modalInstance.close($scope.selected);
        if ($scope.selectToOptions) {
          $scope.selected.isOptionSelect = true;
          $scope.selected.u_value = undefined;
        }
      } else {
        var value;
        if (isNaN($scope.selected.item)) {
          value = $scope.selected.item;
          if ($scope.selected.item == 'Remove') {
            value = null;
          }
        } else {
          value = $scope.selected.item ? parseFloat($scope.selected.item) : 0;
        }
        $modalInstance.close(value);
      }
    };

    $scope.cancel = function () {
      $modalInstance.dismiss('cancel');
    };

  }

  ModalEditTypeController.$inject = ['$scope', '$modalInstance', 'room', 'apiService', '$routeParams', 'commonService', 'alertService', 'roomDetails'];

  function ModalEditTypeController ($scope, $modalInstance, room, apiService, $routeParams, commonService, alertService, roomDetails) {

    $scope.type = roomDetails.complex_room_details?.room_type
    $scope.typeList = ['Type 1', 'Type 2', 'Type 3', 'Type 4', 'Type 5', 'Type 6', 'Type 7', 'Type 8']
    init()
    function init () {
      apiService.get('surveys', {
        _id: $routeParams.id
      }).then(function (survey) {
        $scope.survey = survey
      })
    }



    $scope.ok = function () {

      if (!!$scope.type && $scope.type != "") {
        $modalInstance.close($scope.type);
      } else {
        alertService('danger', '', 'Please select type');
      }


    };
    $scope.cancel = function () {
      $modalInstance.dismiss('cancel');
    };

  }

  ModalCommentController.$inject = ['$scope', '$modalInstance', 'alertService', 'apiService', '$routeParams', 'commonService', 'calculationService', '$rootScope', 'data'];

  function ModalCommentController ($scope, $modalInstance, alertService, apiService, $routeParams, commonService, calculationService, $rootScope, data) {
    $scope.user = JSON.parse(window.localStorage.getItem('user'))
    $scope.loading = false
    $scope.isEdit = false
    $scope.inputVisible = true
    apiService.get('surveys', {
      _id: $routeParams.id
    }).then(function (survey) {
      $scope.survey = survey;
      $scope.manufacturerID = survey.surveys.manufacturerID
      if (data.survey.surveys.commentsManufacturerRead == true && $scope.user.isManufacturer == true) {
        $scope.inputVisible = false
      }
    }, commonService.onError);

    init()
    function init () {
      setTimeout(() => {
        apiService.get('surveysComments', {_id: $routeParams.id}).then(function (surveyff) {
          $scope.commentsList = surveyff
          commentlist($scope.commentsList)
        }, commonService.onError);
        if (data.survey.surveys.commentsManufacturerRead == true && $scope.user.isManufacturer == true) {
          $scope.inputVisible = false
        }
      }, 500);
    }



    $scope.comment = {}
    $scope.editComment = function (comment, index, selectedStep) {
      $scope.index = index
      $scope.isEditComment = true
      $scope.comment = comment.message
      $scope.comments = comment
      $scope.selectedStep = selectedStep
      $scope.placeHolder = "Please update comments here... "
    }
    $scope.updateComment = function () {
      $scope.comments.message = $scope.comment

      if (!$scope.comment) {
        alertService('danger', '', 'Please Enter the comment!');
      } else {
        apiService.update('surveysComments', $scope.comments).then(function (response) {
          $scope.comment = ""
          $scope.isEditComment = false
          $scope.placeHolder = ""
          alertService('success', 'comment', 'comment Update successfully!');
        }, commonService.onError);
      }
    }
    function commentlist (list) {
      $scope.step1 = list?.filter(function (o) {
        return o.step == "1";
      });

      $scope.step2 = list?.filter(function (o) {
        return o.step == "2";
      });
      $scope.step3 = list?.filter(function (o) {
        return o.step == "3";
      });
      $scope.step4 = list?.filter(function (o) {
        return o.step == "4";
      });
      $scope.step5 = list?.filter(function (o) {
        return o.step == "5";
      });
      $scope.step6 = list?.filter(function (o) {
        return o.step == "6";
      });
      $scope.step7 = list?.filter(function (o) {
        return o.step == "7";
      });
      $scope.step8 = list?.filter(function (o) {
        return o.step == "8";
      });
      $scope.step9 = list?.filter(function (o) {
        return o.step == "9";
      });
      $scope.stepDHW = list?.filter(function (o) {
        return o.step == "domestic-hot-water";
      });
      $scope.stepEP = list?.filter(function (o) {
        return o.step == "emitters-performance";
      });
      $scope.stepCR = list?.filter(function (o) {
        return o.step == "current-radiators";
      });
      $scope.stepNR = list?.filter(function (o) {
        return o.step == "new-radiators";
      });
      $scope.stepBivalent = list?.filter(function (o) {
        return o.step == "bivalent";
      });
      $scope.stepFuelComp = list?.filter(function (o) {
        return o.step == "fuel-comparison";
      });
      $scope.stepGround = list?.filter(function (o) {
        return o.step == "ground-loop";
      });
      $scope.stepPipeCalc = list?.filter(function (o) {
        return o.step == "pipe-calculator";
      });
    }
    $scope.comment = ""

    $scope.ok = function () {
      $scope.loading = true
      if (!$scope.comment) {
        alertService('danger', '', 'Please Enter the comment!');
        $scope.loading = false
      } else {
        if ($scope.user.isManufacturer) {
          data.survey.surveys.commentsManufacturerReply = true
          data.survey.surveys.commentsMemberReply = false
        } else {
          data.survey.surveys.commentsManufacturerRead = false
          data.survey.surveys.commentsManufacturerReply = false
          data.survey.surveys.commentsMemberReply = true
        }

        apiService.surveysComments.save({
          message: $scope.comment,
          msgDate: new Date().toString(),
          user_id: $scope.user._id,
          step: data.step,
          survey_id: data.survey._id
        }, function (response) {
          if (response.success) {
            alertService('success', 'Send', response.message);
            apiService.update('surveys', data.survey).then(function (response) {
              init()
              $scope.loading = false
              $scope.comment = ""
            }, commonService.onError);

          }
        }, function (error) { });
      }

      // if ($scope.comment != null && $scope.comment != '' && $scope.comment != ' ' )
      //     $modalInstance.close($scope.comment);
      // else {
      //     alertService('danger', '', 'Enter comment for send!');
      //     // $modalInstance.dismiss('cancel');
      // }
    };

    $scope.cancel = function () {
      $modalInstance.dismiss('cancel');
    };
  }

  ModalEditTemperatureController.$inject = ['$scope', '$modalInstance', 'apiService', '$routeParams', 'alertService', 'data'];

  // $scope.regions = $rootScope.cloud_data.regions[$scope.survey.surveys.weeks];

  function ModalEditTemperatureController ($scope, $modalInstance, apiService, $routeParams, alertService, data) {
    function roundTO2Decimal (value) {
      if(typeof value === "string") value = Number(value)
      return Math.round(value * 100) / 100;
    }

    $scope = angular.extend($scope, data);

    $scope.editSurvey = {
      external_temperature: $scope.survey.surveys.external_temperature ? JSON.parse(JSON.stringify($scope.survey.surveys.external_temperature.value)): '',
      altitude_adjustment_meter: $scope.survey.surveys.altitude_adjustment ? JSON.parse(JSON.stringify($scope.survey.surveys.altitude_adjustment.meter)): '',
      altitude_adjustment_value: $scope.survey.surveys.altitude_adjustment ? JSON.parse(JSON.stringify($scope.survey.surveys.altitude_adjustment.value)): '',
      external_design_temperature: $scope.survey.surveys.external_design_temperature ? JSON.parse(JSON.stringify($scope.survey.surveys.external_design_temperature)): '',
    }
    const currentData = $scope.survey

    $scope.UpdateAltidue = function(){
      const AdditionalTemp = roundTO2Decimal(Number($scope.editSurvey.altitude_adjustment_meter) * -0.3 / 50)
      const ExternalDesignTemp = $scope.editSurvey.external_temperature + AdditionalTemp
      $scope.editSurvey.altitude_adjustment_value = AdditionalTemp;
      $scope.editSurvey.external_design_temperature = roundTO2Decimal(ExternalDesignTemp)
    }

    $scope.UpdateExternalDesignTemp = function(){
      const AdditionalTemp = $scope.editSurvey.altitude_adjustment_value
      const ExternalTemp = $scope.editSurvey.external_temperature
      $scope.editSurvey.external_design_temperature = roundTO2Decimal(ExternalTemp + AdditionalTemp)
    }

    $scope.ok = function () {
      $scope.disabled.value = false
      $scope.editedTemp.value = 'touched'
      if($scope.survey.surveys.region == '') {
        $scope.survey.surveys.region = {};
      }
      $scope.survey.surveys.region.region = 'Custom Entry';
      $scope.survey.surveys.external_design_temperature = JSON.parse(JSON.stringify($scope.editSurvey.external_design_temperature))
      $scope.survey.surveys.external_temperature.location = $scope.survey.surveys.external_temperature.location ? $scope.survey.surveys.external_temperature.location: $scope.survey.surveys.address_one;

      $modalInstance.close($scope.comment);
    };

    $scope.cancel = function () {
      $scope.editedTemp.value = ''
      $modalInstance.dismiss('cancel');
    };

  }

  ModalEditDegreeDayController.$inject = ['$scope', '$modalInstance', 'apiService', '$routeParams', 'alertService', 'data'];

  function ModalEditDegreeDayController ($scope, $modalInstance, apiService, $routeParams, alertService, data) {

    $scope = angular.extend($scope, data);

    $scope.editDegreeDay = $scope.survey.surveys.region.value ? JSON.parse(JSON.stringify($scope.survey.surveys.region.value)) : '';

    $scope.ok = function () {
      $scope.disableDay.value = false
      $scope.editedDay.value = 'touched'
      if($scope.survey.surveys.region == '') {
        $scope.survey.surveys.region = {};
      }
      $scope.survey.surveys.region.value = JSON.parse(JSON.stringify($scope.editDegreeDay));
      $scope.survey.surveys.region.region = 'Custom Entry';
      $modalInstance.close($scope.comment);
    };

    $scope.cancel = function () {
      $modalInstance.dismiss('cancel');
    };

  }


  ModalNewRoomController.$inject = ['$scope', '$modalInstance', 'apiService', '$routeParams', 'alertService', 'data'];

  function ModalNewRoomController ($scope, $modalInstance, apiService, $routeParams, alertService, data) {

    $scope.detail = {
      room_name: '',
      voulted: 'NO',
      is_custom_room_defined: false,
      room_type: ''
    }
    var room = data.rooms;
    var roomDetails = data.roomDetails;

    init()
    function init () {

      apiService.get('surveys', {
        _id: $routeParams.id
      }).then(function (survey) {
        $scope.survey = survey
      })

    }

    $scope.save = function (event) {
      if (event.keyCode == 13) {
        $scope.ok()
      }
    }

    $scope.ok = function () {

      if ($scope.detail.room_name != "") {
        var roomsCheck = room.filter(function (val) { return val.room_name.toLowerCase() == $scope.detail.room_name.toLowerCase(); })
        if (roomsCheck.length < 1) {
          let largeRoomId = 0
          room.forEach(element => {
            if (parseInt(element.room_id) > largeRoomId) {
              largeRoomId = parseInt(element.room_id);
            }
          });
          if ($scope.detail.is_custom_room_defined) {
            roomDetails.is_custom_room_defined = true;
            if ($scope.detail.room_type == '') {
              alertService('danger', '', 'Please Select the custom room Type');
              return;
            } else {
              roomDetails.room_type = $scope.detail.room_type;
            }
          }
          if ($scope.detail.voulted == 'YES' && !$scope.detail.voultedType) {
            alertService('danger', '', 'Please Select the voulted Type');
          } else {
            if ($scope.detail.voulted == 'YES') {
              if (roomDetails.complex_room_details == null) {
                roomDetails.complex_room_details = {
                  room_type: "",
                  dim: {
                    one: 0,
                    two: 0,
                    three: 0,
                    four: 0,
                    five: 0,
                    six: 0,
                  },
                  wall: {
                    type: {
                      a: null,
                      b: null,
                      c: null,
                      d: null
                    }
                  }
                };
              }
              roomDetails.complex_room_details.room_type = $scope.detail.voultedType
              roomDetails.is_the_room_complex = "YES"
            } else {
              roomDetails.complex_room_details = null
              roomDetails.is_the_room_complex = "NO"
            }
            if (!roomDetails.complex_room_details || roomDetails.complex_room_details == null) {
              roomDetails.complex_room_details = null
              roomDetails.is_the_room_complex = "NO"
            }
            let roomId = parseInt(largeRoomId) + 1;

            // not a split rooms
            roomDetails.room_id = roomId.toString();
            roomDetails.room_partner_id = "";
            roomDetails.linked_colors = undefined;
            roomDetails.is_the_room_split = 0;

            roomDetails.room_name = $scope.detail.room_name
            roomDetails.images = []
            roomDetails.room_notes = ""
            //roomDetails.is_the_room_complex = $scope.detail.is_the_room_complex ? $scope.detail.is_the_room_complex : 'NO';
            let newRoom = JSON.parse(angular.toJson(roomDetails))
            $modalInstance.close(newRoom);
          }
        } else {
          alertService('danger', 'Exist', 'This room is already exist');
        }
      } else {
        alertService('danger', '', 'Please Fill all Fields');
      }


    };
    $scope.cancel = function () {
      $modalInstance.dismiss('cancel');
    };

  }


  ModalValueCheckerInstanceController.$inject = ['$scope', '$modalInstance', '$modal', 'data', 'apiService', 'surveyService'];

  function ModalValueCheckerInstanceController ($scope, $modalInstance, $modal, data, apiService, surveyService) {

    $scope.edit = false;
    $scope.edited = 0;
    $scope.model = {}

    var fieldList = [
      { field: 'floor_area', fieldName: 'Floor Area', unit: 'm\u00B2', keyMax: 'floorAreaMax', keyMin: 'floorAreaMin' },
      { field: 'room_height', fieldName: 'Room Height', unit: 'm', keyMax: 'roomHeightMax', keyMin: 'roomHeightMin' },
      { field: 'external_wall.type.a.length', fieldName: 'External wall type A', unit: 'm', keyMax: '', keyMin: '' },
      { field: 'external_wall.type.b.length', fieldName: 'External wall type B', unit: 'm', keyMax: '', keyMin: '' },
      { field: 'external_wall.type.a.window_area', fieldName: 'External Window type A', unit: 'm\u00B2', keyMax: '', keyMin: '' },
      { field: 'external_wall.type.b.window_area', fieldName: 'External Window type B', unit: 'm\u00B2', keyMax: '', keyMin: '' },
      { field: 'internal_wall_length', fieldName: 'Internal wall length', unit: 'm', keyMax: 'intWallMax', keyMin: 'intWallMim' },
      { field: 'party_wall_length', fieldName: 'Party wall length', unit: 'm', keyMax: 'partyWallMax', keyMin: 'partyWallMin' },
      { field: 'external_door_area', fieldName: 'External door area', unit: 'm\u00B2', keyMax: 'exDoorMax', keyMin: 'exDoorMin' },
      { field: 'roof_glazing_area', fieldName: 'Roof glazing area', unit: 'm\u00B2', keyMax: 'roofMax', keyMin: 'roofMin' },
    ]
    // load inits
    $scope.fieldNo = data.field
    if (data.field == '') {
      $scope.fieldNo = 0
    }

    $scope.valueChanged = function () {
      $scope.edited = 1;
    }

    var data = data;
    var survey = data.survey;
    var minMax = data.minMax[$scope.fieldNo];
    $scope.fieldData = fieldList[$scope.fieldNo];
    $scope.isInfo = data.isInfo;

    if (minMax.minMax.minIdx == -1) {
      minMax.minMax.minIdx = 0;
    }
    if (minMax.minMax.maxIdx == -1) {
      minMax.minMax.maxIdx = 1;
    }
    if ($scope.fieldNo >= 0) {
      $scope.minRoom = survey.surveys.rooms[minMax.minMax.minIdx]
      $scope.maxRoom = survey.surveys.rooms[minMax.minMax.maxIdx]
      let spField = minMax.field.split('.');

      if (spField.length == 1) {
        $scope.model.fieldValueMin = survey.surveys.rooms[minMax.minMax.minIdx][spField[0]];
        $scope.model.fieldValueMax = survey.surveys.rooms[minMax.minMax.maxIdx][spField[0]];
      } else {
        $scope.model.fieldValueMin = survey.surveys.rooms[minMax.minMax.minIdx][spField[0]][spField[1]][spField[2]][spField[3]];
        $scope.model.fieldValueMax = survey.surveys.rooms[minMax.minMax.maxIdx][spField[0]][spField[1]][spField[2]][spField[3]];
      }
    }

    $scope.onEditCancel = function () {
      $scope.edit = false;
    }

    $scope.onEdit = function () {
      $scope.edit = true;
    }

    $scope.onSave = function () {
      let spField = minMax.field.split('.');
      if (spField.length == 1) {
        survey.surveys.rooms[minMax.minMax.minIdx][spField[0]] = $scope.model.fieldValueMin;
        survey.surveys.rooms[minMax.minMax.maxIdx][spField[0]] = $scope.model.fieldValueMax;
      } else {
        survey.surveys.rooms[minMax.minMax.minIdx][spField[0]][spField[1]][spField[2]][spField[3]] = $scope.model.fieldValueMin;
        survey.surveys.rooms[minMax.minMax.maxIdx][spField[0]][spField[1]][spField[2]][spField[3]] = $scope.model.fieldValueMax;
      }
      $scope.edit = false;
    };

    $scope.onCancel = function () {
      $scope.edited = 0;
      $modalInstance.close(survey);
    };

    $scope.onAccept = function () {
      survey.surveys.rooms[minMax.minMax.minIdx].isValueChecked = true;
      $modalInstance.close(survey);
    };

    $scope.nextCheck = function () {
      // reopen with new value
      // if($scope.edited > 0) {
      $modalInstance.close(data.survey);
      // } else {
      //   $modalInstance.close();
      // }
      if ($scope.fieldNo <= 8) {
        var modalInstance = $modal.open({
          animation: true,
          templateUrl: '/partials/views/summary/components/_modal_value_checker',
          controller: 'ModalValueCheckerInstanceController',
          size: 'md',
          resolve: {
            data: function () {
              $scope.fieldNo++
              let obj = {
                info: false,
                survey: data.survey,
                field: $scope.fieldNo,
                minMax: data.minMax
              }
              return obj;
            }
          }
        });

        modalInstance.result.then(function (result) {
          if (result) {
            result.surveys.rooms = surveyService.highlightMinMax(result.surveys.rooms).rooms;
            apiService.update('surveys', result).then(function (response) {
              $scope.survey = response;
            });
          }
        });
      }


    };

  }


})();
