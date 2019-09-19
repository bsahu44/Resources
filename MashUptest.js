var c_serverUrl = "http://internal.bi.verisk.com/spotfire/wp/";

var customization = new spotfire.webPlayer.Customization();
//Hide UI elements
customization.showCustomizableHeader = false;
customization.showStatusBar = false;
customization.showToolBar = false;
customization.showPageNavigation = false;
customization.showFilterPanel = false;
customization.showDodPanel = false;

var c_reloadAnalysisInstance = false;

//Parameters to pass
//analysisPath : '/ACE India/Public/Standardisation_Demo_BI_Portal'
//parameters : 'flattenDXP="Y";VizTabName="Page1";vizName="Bar Chart (Dashboard 1)";'
//divID : 'container'
//vizDetails : 'Page1=Bar Chart (Dashboard 1)'

function openDoc(analysisPath, divID, vizDetails) {
	var c_analysisPath = analysisPath;
	var c_divID = divID;
	var c_vizDetails = vizDetails;
	var res = vizDetails.split("=");
	var tab = res[0];
	var viz = res[1];
	var c_parameters = 'flattenDXP="Y";VizTabName="'+tab+'";vizName="'+viz+'";';
	console.log(c_parameters)
	
	var app;
	app = new spotfire.webPlayer.Application(c_serverUrl, customization, c_analysisPath, c_parameters, c_reloadAnalysisInstance);
	app.onError(errorCallback);
	app.onOpened(onOpened);
	console.log("Opening document at : " + (new Date).toLocaleTimeString());

	DemoDashboard = app.openDocument(c_divID, c_vizDetails, customization);
	DemoDashboard.onDocumentReady(onDocumentReady);
}

//
// Web Player Callbacks
//
function onOpened(analysisDocument){
    console.log("Document load completed at : " + (new Date).toLocaleTimeString());
}
function errorCallback(errorCode, description){
    // Log error message if something goes wrong in the Web Player.
    console.log(errorCode + ": " + description);
}

function onDocumentReady(){
    console.log('ready');
}
