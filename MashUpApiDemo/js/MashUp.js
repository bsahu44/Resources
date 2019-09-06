//
// Constants
//
var c_serverUrl = "http://internal-sf-srv-dev1-f247391a9f4f10-2043682034.us-west-2.elb.amazonaws.com/spotfire/wp/";
var c_analysisPath_BI = "/ACE India/BIPortal/BI Portal";
var c_analysisPath_Risk = "/ACE India/PCS/Analytics/PCS_Risk_POC";

var customization = new spotfire.webPlayer.Customization();

//Hide UI elements
customization.showCustomizableHeader = false;
customization.showTopHeader = false;
customization.showDodPanel = false;
customization.showStatusBar = false;
customization.showToolBar = false;
customization.showPageNavigation = false;
customization.showClose = false;
customization.showAnalysisInfo = false;
customization.showExportFile = false;
customization.showExportVisualization = false;
customization.showUndoRedo = false;
customization.showFilterPanel = false;

var c_parameters = "";
var c_reloadAnalysisInstance = false;

var app,app2;

//
// Initialize the mashup when page is loaded
//
window.onload = function()
{
    // Create an application.

    app = new spotfire.webPlayer.Application(c_serverUrl, customization, c_analysisPath_BI, c_parameters, c_reloadAnalysisInstance);
    app2 = new spotfire.webPlayer.Application(c_serverUrl, customization, c_analysisPath_Risk, c_parameters, c_reloadAnalysisInstance);


    // Register error callback.
    app.onError(errorCallback);
    app.onOpened(onOpened);
    app2.onError(errorCallback);
    app2.onOpened(onOpened);
    
    console.log("Opening document at : " + (new Date).toLocaleTimeString());


    //Open Document for Dashboards
    BIDashboard = app.openDocument("containerBI","BI Portal", customization);
    BIDashboard.onDocumentReady(onDocumentReady);
	
	RiskDashboard = app2.openDocument("containerRisk","Terror=Terror Attack Locations", customization);
    RiskDashboard.onDocumentReady(onDocumentReady);
	
	console.log("Open document at : " + (new Date).toLocaleTimeString());

}
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


function showDash(dashname) {
    $(".dashContainer").css("z-index","0");
    $(".dashContainer").css("visibility","hidden");
    $("#"+dashname).css("z-index","1");
    $("#"+dashname).css("visibility","visible");
    currentTab = dashname;
}


