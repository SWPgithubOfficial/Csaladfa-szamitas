var canvas = null;
var ctx = null;

var attrForm = null;
var attrOverlay = null;
var attrList = null;

var toolDiv = null;

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
var attrData = {
    "t_0":{
        "name":"tulajdonság 1",
        "phenotypes":{
            "AA":"nagyon beteg",
            "AB":"kicsit beteg",
            "BB":"nem beteg"
        },
        "rawGene":"AB"
    },
    "t_1":{
        "name":"tulajdonság 2",
        "phenotypes":{
            "AA":"nagyon beteg",
            "AB":"kicsit beteg",
            "BB":"nem beteg"
            
        },
        "rawGene":"AB"
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