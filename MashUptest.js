var c_serverUrl = "http://internal.bi.verisk.com/spotfire/wp/";

var c_analysisPath = "/ACE India/Public/Standardisation_Demo_BI_Portal";
var c_analysisPath2 = "/ACE India/Public/Standardisation_Demo_BI_Portal_2";


var customization = new spotfire.webPlayer.Customization();
//Hide UI elements
customization.showCustomizableHeader = false;
customization.showStatusBar = false;
customization.showToolBar = false;
customization.showPageNavigation = false;
customization.showFilterPanel = false;
customization.showDodPanel = false;

var c_parameters = 'flattenDXP="Y";VizTabName="Page1";vizName="Bar Chart (Dashboard 1)";';
var c_parameters2 = 'flattenDXP="Y";VizTabName="Page1";vizName="Line Chart (Dashboard 2)";';
var c_reloadAnalysisInstance = false;


var app, app2;

app = new spotfire.webPlayer.Application(c_serverUrl, customization, c_analysisPath, c_parameters, c_reloadAnalysisInstance);
app2 = new spotfire.webPlayer.Application(c_serverUrl, customization, c_analysisPath2, c_parameters2, c_reloadAnalysisInstance);

// Register error callback.
app.onError(errorCallback);
app2.onError(errorCallback);
app.onOpened(onOpened);
app2.onOpened(onOpened);

console.log("Opening document at : " + (new Date).toLocaleTimeString());

DemoDashboard = app.openDocument("container", "Page1=Bar Chart (Dashboard 1)", customization);
DemoDashboard.onDocumentReady(onDocumentReady);

DemoDashboard2 = app2.openDocument("container2", "Page1=Line Chart (Dashboard 2)", customization);
DemoDashboard2.onDocumentReady(onDocumentReady);

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
