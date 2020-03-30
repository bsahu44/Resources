document.lastCol = $('div.sfc-column-header').length;

function error(){
	console.log('error occured');
}

if (!document.customStylesReady){
    $("head").append('<style>div[name="aColumn"]:nth-of-type('+document.lastCol+') { display: none !important;}'+
	'div.sfc-column-header:nth-of-type('+document.lastCol+') { display: none !important;}'+'</style>');
    document.customStylesReady=1;
}

function waitFor(condition,timeout,callback,error) {
	var start_time = Date.now();
    if(condition()) {
      callback();
    } else if (Date.now() <= (start_time + timeout)) {
      setTimeout(waitFor.bind(null, condition,timeout, callback,error), 100); /* this checks the flag every 100 milliseconds*/
    } else {
      error();
	}
} 

document.setObj = new Set();

function sendData() {

	let myArr1 = Array.from(document.setObj);
	//console.log(myArr1);
	$('div[name="aColumn"]:nth-of-type('+document.lastCol+')').find('div.sfc-value-cell').each(function(i, obj) {
			document.setObj.add($(this).text());
		});
	//console.log(document.setObj);
	let myArr2 = Array.from(document.setObj);
	var difference = myArr2.filter(x => myArr1.indexOf(x) === -1);
	if(difference.length != 0){
		console.log(difference);
	}
}

document.rid = $('div[name="aColumn"]:nth-of-type('+document.lastCol+')').find('div.sfc-value-cell:nth-of-type(1)').text()
function chekrow() {
	var rc = $('div[name="aColumn"]:nth-of-type('+document.lastCol+')').find('div.sfc-value-cell:nth-of-type(1)').text();
	if (rc != document.rid){
		document.rid = rc;
		return true;
	};
}

$('#prev input').on("click",function(){
	console.log('prev clicked');
	waitFor(chekrow,30000,sendData,error);
});

$('#next input').on("click",function(){
	console.log('next clicked');
	waitFor(chekrow,30000,sendData,error);
});

function checkTab(){
	if ($('div[name="aColumn"]:nth-of-type('+document.lastCol+')').find('div.sfc-value-cell:nth-of-type(1)').text()) {
		return true;
	}
	return false;
}

$('body').on("click","div[tabindex][title]",function(){
	var tab = this.title;
	if (tab == "Tab2" ){
		waitFor(checkTab,30000,sendData,error);
	}
});

if (!document.firstSend){
    sendData();
    document.firstSend=1;
}
