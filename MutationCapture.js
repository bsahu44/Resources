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
		if (cr != document.cr && cr != "") {
			document.cr = cr;
			sendData();
		}
	}

	// instantiating observer
	const observer = new MutationObserver(subscriber);
	// observing target
	observer.observe(target, config);
}


if (!document.firstSend){
	hideCol();
	document.firstSend=1;
	waitFor(function(){ return ($("div#filteredRows").find("span[sf-busy|='false']").text()!="");}, 5000, function(){
			mutate();
			var temp =  $("#capturedRows > input").first().val();
			$('#filterChange input').click();
			sendData();
			document.filteredRows = $("div#filteredRows").find("span[sf-busy|='false']").text();
			document.cr = $("#capturedRows > input").first().val();
			console.log('first time');
			},error);
	
}

$('body').on("click","div[tabindex][title]",function(){
	var tab = this.title;
	if (tab == "Tab2" ){
		waitFor(function(){
		var filteredRows = $("div#filteredRows").find("span[sf-busy|='false']").text();
		if (filteredRows != document.filteredRows && filteredRows != ""){
			document.filteredRows = filteredRows;
			mutate();
			return true;
		}
		return false;
		}, 10000, function(){
			
			$('#filterChange input').click();
			console.log('Tab2 clicked');
		}, error);	
	}
});


$('body').on('click', '#filters', function(){
	waitFor(function(){
		var filteredRows = $("div#filteredRows").find("span[sf-busy|='false']").text();
		if (filteredRows != document.filteredRows && filteredRows != ""){
			document.filteredRows = filteredRows;
			mutate();
			return true;
		}
		return false;
	}, 10000, function(){
		$('#filterChange input').click();
		console.log('filter clicked');
	}, error)
});

$('body').on('click', '#prev1',function(){
	$('#prev input').click();
	console.log('prev clicked');
});

$('body').on('click', '#next1',function(){
	$('#next input').click();
	console.log('next clicked');
});
