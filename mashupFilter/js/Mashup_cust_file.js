
//
// Constants
//
var c_serverUrl = "https://globalops.analytics.ge.com/spotfire/wp/";
var c_analysisPath_Summary = "/GlobalOps/MashUp Demo/IndirectSourcing-SPEND_Summary";
var c_analysisPath_CustomRep = "/GlobalOps/MashUp Demo/IndirectSourcing-SPEND_CustomRep";
var customization = new spotfire.webPlayer.Customization();
var c_parameters = "";
var c_parameters_summary = ["CreateSingleVizHeader = Y;","VizTabName =Summary;","vizName = Text Area Header;"];
var c_parameters_filter = ["CreateSingleVizFilter = Y;","VizTabName =Summary;","vizName = Text Area Filter;"];
var c_parameters_custom = "pageCount=1;";

var c_reloadAnalysisInstance = false;

var isFilterRunning = false;

var app,app2,app3,app4;
var dashboard,dashboard2,headerArea,filterArea;


var tabNames = ['Summary', 'Custom Trending', 'Preferred Supplier', 'Supplier Search'];
var currentTab="other";
var filterState=false;
var markingState=false;
var filterState1=false;
var temp;
window.filterPara = "";
window.pageFilter = "";
window.name="";

//
// Initialize the mashup when page is loaded
//
window.onload = function()
{
    document.domain = "ge.com";
    console.log("initializing app at : " + (new Date).toLocaleTimeString());


    // Create an application.

    app = new spotfire.webPlayer.Application(c_serverUrl, customization, c_analysisPath_Summary, c_parameters, c_reloadAnalysisInstance);
    app2 = new spotfire.webPlayer.Application(c_serverUrl, customization, c_analysisPath_CustomRep, c_parameters_custom, c_reloadAnalysisInstance);
    app3 = new spotfire.webPlayer.Application(c_serverUrl, customization, c_analysisPath_Summary, c_parameters_summary, c_reloadAnalysisInstance);
    app4 = new spotfire.webPlayer.Application(c_serverUrl, customization, c_analysisPath_Summary, c_parameters_filter, c_reloadAnalysisInstance);

    // Register error callback.
    app.onError(errorCallback);
    app.onOpened(onOpened);
    app2.onError(errorCallback);
    app2.onOpened(onOpened);
    app3.onError(errorCallback);
    app3.onOpened(onOpened);
    app4.onError(errorCallback);
    app4.onOpened(onOpened);
    console.log("Opening document at : " + (new Date).toLocaleTimeString());

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

    //Open Document for Dashboard 1
    summaryDashboard = app.openDocument("containersummary","Summary", customization);
    summaryDashboard.onDocumentReady(onDocumentReady);
    trendingDashboard = app.openDocument("containertrending","Custom Trending", customization);
    trendingDashboard.onDocumentReady(onDocumentReady);
    supplierDashboard = app.openDocument("containersupplier","Preferred Supplier", customization);
    supplierDashboard.onDocumentReady(onDocumentReady);
    searchDashboard = app.openDocument("containersearch","Supplier Search", customization);
    searchDashboard.onDocumentReady(onDocumentReady);

    customDashboard = app2.openDocument("customcontainer", "Custom Reporting", customization);
    customDashboard.onDocumentReady(onDocumentReady);

    headerArea = app3.openDocument("topContainer", "Summary=Text Area Header", customization);
    headerArea.onDocumentReady(onDocumentReady);

    filterArea = app4.openDocument("leftContainer", "Summary=Text Area Filter", customization);
    filterArea.onDocumentReady(onDocumentReady);



    // Register Filters callbacks
    // Any calls to he API proxies will be executed once the document is loaded on the server (when registered onOpened callback is called)
    summaryDashboard.data.onRangeChanged("Filtering scheme1","T_ZYCUS_DATA","Region",onRangeChangedCallback);
    filterArea.data.onRangeChanged("Filtering scheme1","T_ZYCUS_DATA","Region",onRangefilterChangedCallback);

    // Register PageCount Property Callback
    customDashboard.onDocumentPropertyChanged("pageCount",onChangedPageCountCallback);
    customDashboard.onDocumentPropertyChanged("BussinessUnit",onChangedBussinessUnitCallback);
    customDashboard.onDocumentPropertyChanged("VerticalNew",onChangedVerticalNewCallback);

    customDashboard.marking.getMarkingNames(function(fn){
        console.log(fn);
    });

    customDashboard.marking.onChanged("CustRep","T_ZYCUS_DATA_2",["BUSINESS_TIER_1","BUSINESS_TIER_2","BUSINESS_TIER_3","COMMODITY_TIER_1","CORPORATE_PREFERRED","ES_ACCOUNT"],100,onChangeMarkingCallback);

}

function onChangedBussinessUnitCallback(property){
    console.log(property.value);
}

function onChangedVerticalNewCallback(property){
    console.log(property.value);
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

function onChangeMarkingCallback(markingCallback){
    if(markingState == true){
    console.log(markingCallback);
    let ref_this = $("#nav-sub-tab>a.active")[0].id;
    let splitName = ref_this.split("-")[0];
    let name = "ColButton" + splitName
    enablecolButton = document.getElementById(name);
    console.log(name);
    if (enablecolButton.style.display === "none") {
        enablecolButton.style.display = "block";
      }
    }else{
      markingState=true;
    }

}


function onChangedPageCountCallback(property){
    console.log(property.value);
    createPageTab(property.value);
}

function onRangeChangedCallback(DataColumnRangeState){
    //console.log("%o",DataColumnRangeState);
    //console.log("%o",DataColumnRangeState);
    if(filterState == true){
        summaryDashboard.data.getActiveDataTable(function(dataTable) {
            summaryDashboard.filtering.getActiveFilteringScheme(function(filteringScheme) {
                    summaryDashboard.filtering.getModifiedFilterColumns(filteringScheme.filteringSchemeName,spotfire.webPlayer.includedFilterSettings.ALL_WITH_CHECKED_HIERARCHY_NODES,function(filterColumns){
                        customDashboard.data.getActiveDataTable(function(customdataTable){
                            customDashboard.filtering.getActiveFilteringScheme(function(customfilteringScheme){
                                temp=filterColumns;

                                filterColumns.forEach(value => {
                                    console.log(value.filterSettings.values);
                                    var filterColumn = {
                                                            dataColumnName: value.dataColumnName,
                                                            dataTableName: customdataTable.dataTableName,
                                                            filteringSchemeName: customfilteringScheme.filteringSchemeName,
                                                            filterSettings: {
                                                                values: value.filterSettings.values
                                                            }
                                                        };
                                    var summaryColumn = {
                                                            dataColumnName: value.dataColumnName,
                                                            dataTableName: dataTable.dataTableName,
                                                            filteringSchemeName: filteringScheme.filteringSchemeName,
                                                            filterSettings: {
                                                                values: value.filterSettings.values
                                                            }
                                                        };
                                    var filteringOperation = spotfire.webPlayer.filteringOperation.REPLACE;

                                    headerArea.filtering.setFilter(summaryColumn, filteringOperation);
                                    customDashboard.filtering.setFilter(filterColumn, filteringOperation);
                                    console.log("Filter Changed");
                                });
                                /*Append Filters START*/
                                if(name){
                                    var filterIdDiv = document.getElementById(pageFilter);
                                    if(filterIdDiv.style.display== "none"){
                                        filterIdDiv.style.display = "block";
                                    }
                                    document.getElementById(filterPara).innerHTML = "";
                                    temp.forEach(filterValue => {
                                        document.getElementById(filterPara).innerHTML += "<b>"+filterValue.dataColumnName+":</b>";
                                        document.getElementById(filterPara).innerHTML += " "+filterValue.filterSettings.values;
                                        document.getElementById(filterPara).innerHTML += " <b>|</b> ";
                                    });
                                }
                                /*Append Filters END*/
                            });
                        });
                    });
            });
        });
    }else{
        filterState = true;
    }
}


function onRangefilterChangedCallback(DataColumnRangeState){
    if(filterState1 == true){
        filterArea.filtering.getModifiedFilterColumns("Filtering scheme1",spotfire.webPlayer.includedFilterSettings.ALL_WITH_CHECKED_HIERARCHY_NODES,function(filterColumns) {
            summaryDashboard.data.getActiveDataTable(function(dataTable1){
                summaryDashboard.filtering.getActiveFilteringScheme(function(filteringScheme1){
                    filterColumns.forEach(value => {
                        //console.log(value.filterSettings.values);
                        var filterColumn = {
                                                dataColumnName: value.dataColumnName,
                                                dataTableName: dataTable1.dataTableName,
                                                filteringSchemeName: filteringScheme1.filteringSchemeName,
                                                filterSettings: {
                                                    values: value.filterSettings.values
                                                }
                                            };

                        var filteringOperation = spotfire.webPlayer.filteringOperation.REPLACE;
                        summaryDashboard.filtering.setFilter(filterColumn, filteringOperation);
                        console.log("Filter Changed");
                    });
                });
            });
        });
    }else{
        filterState1 = true;
    }
}



// Create Page Tab and Container
function createPageTab(count){
    // Create Page Tab
    if(count-1 > 0){
        name = "CrossTable"+count;
        var pageId = name+'Conatiner';
        var pageIdTab=name+'-tab';
        pageFilter=name+'-filter';
        filterPara = name+'-para';
        prior_count = count -1;
        var Page = "CrossTable " + prior_count;

        // Create Page Tab
        var pagetab = document.getElementById("nav-sub-tab");
        var tabnav = document.createElement('a');
        tabnav.textContent = "Cross Table "+prior_count;
        tabnav.setAttribute("id",pageIdTab);
        tabnav.setAttribute('class','nav-item nav-link');
        tabnav.setAttribute("data-toggle","tab");
        // tabnav.setAttribute('onClick','findDash("'+pageIdTab+'");');
        tabnav.setAttribute("href","#"+name);
        tabnav.setAttribute("role","tab");
        tabnav.setAttribute("aria-controls",name);
        tabnav.setAttribute("aria-selected","false");
        pagetab.appendChild(tabnav);

        // Create Page Conatiner
        var pagetabcontainer = document.getElementById("nav-sub-tabContent");
        var newtabContainer = document.createElement('div');
        newtabContainer.setAttribute('id',name);
        newtabContainer.setAttribute('class','tab-pane');
        newtabContainer.setAttribute('role','tabpanel');

        newtabContainer.setAttribute('aria-labelledby','pageIdTab');
        pagetabcontainer.appendChild(newtabContainer);

        //Create Cross Table Container
        var crossContainer = document.getElementById(name);
        var newCrossContainer = document.createElement("div");
        newCrossContainer.setAttribute('id',pageId);
        crossContainer.appendChild(newCrossContainer);

        //Filter Div
        var newfilterContainer = document.createElement('div');
        newfilterContainer.setAttribute('id',pageFilter);
        newfilterContainer.setAttribute('style','background-color:rgb(233, 233, 233);display:block;');
        crossContainer.prepend(newfilterContainer);

        //Filter Paragraph Tag
        var filterdiv = document.getElementById(pageFilter);
        var filterDetails = document.createElement('p');
        filterDetails.setAttribute('id',filterPara);
        filterDetails.setAttribute('style','display:inline');
        filterDetails.setAttribute('class','m-0');
        filterDetails.innerHTML="<b>Internal / External:</b> External Suppliers <b>|</b> <b>Indirect / Direct:</b> INDIRECT,INDIRECT - DEFERRED CHARGES <b>|</b> <b>Divestiture:</b> GE Total <b>|</b> <b>OUTBOUND:</b> CONTROLLABLE,FREIGHT PAYMENT - INBOUND,FREIGHT PAYMENT - OUTBOUND,FREIGHT PAYMENT - SITE SPECIFIC,FREIGHT PAYMENT - UNDEFINED,NON-CONTROLLABLE,NON-SHARE,NOT AVAILABLE,PENDING <b>|</b> ";
        filterdiv.appendChild(filterDetails);

        //Toggle Hide Button
        var ToggleButton = document.createElement('button');
        ToggleButton.setAttribute('class','btn btn-secondary btn-sm');
        ToggleButton.setAttribute('onClick','hideFilters("'+filterPara+'");');
        ToggleButton.textContent="Hide/Show";
        filterdiv.appendChild(ToggleButton);

        //Loader Div
        var conId = document.getElementById(pageId);
        var loader = document.createElement("div");
        loader.setAttribute('id','loader');
        conId.appendChild(loader);

        //Image Loader
        var img = document.getElementById("loader");
        var imgLoad = document.createElement("img");
        imgLoad.setAttribute('class','img-cen');
        imgLoad.setAttribute('src','img/ajax-loader.gif');
        img.appendChild(imgLoad);

        //Create WebPlayer
        createWebPlayer(pageId,Page);

        cloumnButton(name);
        columnSelector(name);
    }
}

function cloumnButton(name){
  let Item = document.getElementById("column-button");
  let subNav = document.getElementById(name);
  let clnButton = Item.cloneNode(true);
  let colButton = document.createElement("div");
  colButton.setAttribute('class','container-fluid pb-2');
  colButton.setAttribute('style','display:none;');
  colButId = "ColButton"+name;
  colSelectorID = "ColSelect"+name;
  colButton.setAttribute('id',colButId);
  subNav.appendChild(colButton);
  let appendButton = document.getElementById(colButId);
  appendButton.appendChild(clnButton);
  appendButton.getElementsByTagName("button")[0].setAttribute('onClick','hideColSelector("'+colSelectorID+'");');

}

function columnSelector(name){
  colSelectorID = "ColSelect"+name;
  let subNav = document.getElementById(name);
  let Item = document.getElementById("column-selector");
  let clnSelector = Item.cloneNode(true);
  let colSelector = document.createElement("div");
  colSelector.setAttribute('class','container pt-3');
  colSelector.setAttribute('style','display:none;');
  colSelector.setAttribute('id',colSelectorID);
  subNav.appendChild(colSelector);
  let appendSelector = document.getElementById(colSelectorID);
  appendSelector.appendChild(clnSelector);

  colSelector = "column-selector" + name;
  let changeColSelectorId = $('div#column-selector');
  changeColSelectorId[1].id = colSelector;
}


function createWebPlayer(pageId, newPage){
    console.log("New WebPlayer is Created");
    customDashboard = app2.openDocument(pageId, newPage, customization);
    customDashboard.onDocumentReady(onDocumentReady);
}



function showDash(dashname) {
    $(".dashContainer").css("z-index","0");
    $(".dashContainer").css("visibility","hidden");
    $("#"+dashname).css("z-index","1");
    $("#"+dashname).css("visibility","visible");
    currentTab = dashname;
}

// function findDash(name){
//     if(name != "selector"){
//         $("#filterSection").css("display","none");
//     }else{
//         $("#filterSection").css("display","block");
//     }
// }

function hideFilters(filterId){

    var filterToggle = document.getElementById(filterId);
    if (filterToggle.style.display === "none") {
        filterToggle.style.display = "inline";
      } else {
        filterToggle.style.display = "none";
      }
}

function hideColSelector(colId){

    var ColSelToggle = document.getElementById(colId);
    if (ColSelToggle.style.display === "none") {
        ColSelToggle.style.display = "block";
      } else {
        ColSelToggle.style.display = "none";
      }
}
