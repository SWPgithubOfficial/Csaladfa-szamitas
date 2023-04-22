var canvas = null;
var ctx = null;

var attrForm = null;
var attrOverlay = null;
var attrList = null;

var toolDiv = null;

var attrTypeSelect = null;

var usedNames = [];
var usedIds = [];
var nodes = [];

var usedPIds = [];
var parentRects = [];
var parentRectData = {};

var nodeData = {};

var selectedTool = 0;
var tools = ["Move","Delete"];

var attrCheckboxes = [];
var attrInput = [];
var baseAttr = {
    "empty":{
        "name":"Üres tulajdonság",
        "phenotypes":{
            "AA":"fenotípus"}
    },
    "dominans":{
        "name":"Domináns öröklődés",
        "phenotypes":{
            "AA":"Aktív",
            "Aa":"Aktív",
            "aa":"Inaktív"}
    },
    "recessziv":{
        "name":"Recesszív öröklődés",
        "phenotypes":{
            "AA":"Inaktív",
            "Aa":"Inaktív",
            "aa":"Aktív"}
    },
    "intermedier":{
        "name":"Intermedier öröklődés",
        "phenotypes":{
            "AA":"A állapot",
            "AB":"AB köztes állapot",
            "BB":"B állapot"}
    }
};
var attrData = {
    "t_0":{
        "name":"AB0 vércsoport",
        "phenotypes":{
            "AA":"A",
            "Ai":"A",
            "BB":"B",
            "Bi":"B",
            "AB":"AB",
            "ii":"0"},
        "rawGene":"AiB"
    },
    "t_1":{
        "name":"Rh vércsoport",
        "phenotypes":{
            "DD":"Rh+",
            "Dd":"Rh+",
            "dd":"Rh-"},
        "rawGene":"Dd"
    }
};

//node drag
var startPosX = 0.0;
var startPosY = 0.0;

var currentDrag = null;

//connections
var usedCIds = [];
var connections = [];

var pConnections = [];

//connection drag
var cStartN = null;

//parent connection drag
var pStartN = null;
