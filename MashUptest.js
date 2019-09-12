var c_serverUrl = "http://internal.bi.verisk.com/spotfire/wp/";
var c_analysisPath = "/ACE India/Public/Standardisation_Demo_BI_Portal_2";


var customization = new spotfire.webPlayer.Customization();
//Hide UI elements
customization.showCustomizableHeader = false;
customization.showStatusBar = false;
customization.showToolBar = false;
customization.showPageNavigation = false;
customization.showFilterPanel = false;
customization.showDodPanel = false;

var c_parameters = ["flattenDXP=Y;","VizTabName =Page1;","vizName = Line Chart;"];;
var c_reloadAnalysisInstance = false;


var app;

app = new spotfire.webPlayer.Application(c_serverUrl, customization, c_analysisPath, c_parameters, c_reloadAnalysisInstance);

// Register error callback.
app.onError(errorCallback);
app.onOpened(onOpened);

console.log("Opening document at : " + (new Date).toLocaleTimeString());
DemoDashboard = app.openDocument("container", "Page1=Line Chart", customization);
DemoDashboard.onDocumentReady(onDocumentReady);

//
// Web Player Callbacks
//
function onOpened(analysisDocument){
    //console.log("Document load completed at : " + (new Date).toLocaleTimeString());
}
function errorCallback(errorCode, description){
    // Log error message if something goes wrong in the Web Player.
    console.log(errorCode + ": " + description);
}

function onDocumentReady(){
    //console.log('ready');
}
