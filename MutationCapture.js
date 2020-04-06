
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
	if (!document.customStylesReady){
    		$("head").append('<style>div[name="aColumn"]:nth-of-type(1) { display: none !important;}'+
			'div.sfc-column-header:nth-of-type(1) { display: none !important;}'+'</style>');
    		document.customStylesReady=1;
	}
	document.ff = $("#filterFlag > input").first().val();
}


document.setObj = new Set();

function sendData() {
	if (document.firstSend==1) {
		document.cr = $("#capturedRows > input").first().val();
	}
	
	let myArr1 = Array.from(document.setObj);
	//console.log(myArr1);
	var myArray =  document.cr.split(", ");
	myArray.forEach(item => document.setObj.add(item))
	//console.log(document.setObj);
	let myArr2 = Array.from(document.setObj);
	var difference = myArr2.filter(x => myArr1.indexOf(x) === -1);
	if(difference.length != 0){
		console.log(difference);
		
	}
}

document.cr = $("#capturedRows > input").first().val();

function mutate() {
	// target element that we will observe
	const target = $("#capturedRows > input")[0];
// config object
	const config = {
		attributes: true
	};

	

	// subscriber function
	function subscriber(mutations) {
		var cr = $("#capturedRows > input").first().val();
		if (cr != document.cr) {
			document.cr = cr;
			sendData();
		}
  
	}

// instantiating observer
	const observer = new MutationObserver(subscriber);

// observing target
	observer.observe(target, config);
}

function checkFilterChange(){
	var ff = $("#filterFlag > input").first().val();
	if (ff != document.ff && ff == "Y"){
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
		waitFor(checkTabLoad,5000,function(){
			mutate();
			$('#filterChange input').click();
			sendData();
			
		},error);
		
		
	}
});


if (!document.firstSend){
    waitFor(checkTabLoad,5000,hideCol,error);
	document.firstSend=1;
	waitFor(function(){ return (document.customStylesReady == 1);}, 5000, sendData,error);
	mutate();
	console.log('first time');
}

document.filteredRows = $("div#filteredRows").find("span[sf-busy|='false']").text()

$('body').on('click', '#filters', function(){
	
	waitFor(function(){
		var filteredRows = $("div#filteredRows").find("span[sf-busy|='false']").text();
		if (filteredRows != document.filteredRows || filteredRows == ''){
			document.filteredRows = filteredRows;
			return true;
		}
		return false;
	}, 5000, function(){
		$('#filterChange input').click();
	}, error)
});

$('body').on('click', '#prev1',function(){
	$('#prev input').click();
});

$('body').on('click', '#next1',function(){
	$('#next input').click();
});
