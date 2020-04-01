
function error(){
	console.log('error occured');
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


function hideCol() {
	
	document.lastCol = $('div.sfc-column-header').length;
	if (document.lastCol > 0) {
		if (!document.customStylesReady){
    		$("head").append('<style>div[name="aColumn"]:nth-of-type('+document.lastCol+') { display: none !important;}'+
			'div.sfc-column-header:nth-of-type('+document.lastCol+') { display: none !important;}'+'</style>');
    		document.customStylesReady=1;
		}
		document.rid = $('div[name="aColumn"]:nth-of-type('+document.lastCol+')').find('div.sfc-value-cell').text()
		document.ff = $("#filterFlag > input").first().val();
		return true;
	}
	return false;
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

function chekrow() {
	var rc = $('div[name="aColumn"]:nth-of-type('+document.lastCol+')').find('div.sfc-value-cell').text();
	
	if (rc != document.rid){
		document.rid = rc;
		return true;
	}
	return false;
}

function checkFilterChange(){
	var ff = $("#filterFlag > input").first().val();
	var rc = $('div[name="aColumn"]:nth-of-type('+document.lastCol+')').find('div.sfc-value-cell').text();

	if (rc != document.rid && ff != document.ff){
		document.rid = rc;
		document.ff = ff;
		return true;
	}
	
	return false;
}

function checkTabLoad(){
	if ($('div[name="aColumn"]:nth-of-type(1)').find('div.sfc-value-cell:nth-of-type(1)').text()) {
		return true;
	}
	return false;
}


$('body').on("click","div[tabindex][title]",function(){
	var tab = this.title;
	if (tab == "Tab2" ){
		//waitFor(tableLoad,5000,sendData,error);
		waitFor(checkFilterChange,5000,sendData,error);
		
	}
});

$('body').on("click",'#prev input', function(){
	console.log('prev clicked');
	waitFor(chekrow,5000,sendData,error);
});

$('body').on("click",'#next input', function(){
	console.log('next clicked');
	waitFor(chekrow,5000,sendData,error);
});

if (!document.firstSend){
    waitFor(checkTabLoad,5000,hideCol,error);
	waitFor(function(){ return (document.customStylesReady == 1);}, 5000, sendData,error);
	console.log('first time');
    document.firstSend=1;
}

