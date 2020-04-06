
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

function capturedRows() {
		var cr = $("#capturedRows > input").first().val();
		if (cr != document.cr) {
			document.cr = cr;
			return true;
			
		}
		return false;
  
}

$('body').on("click",'#prev input', function(){
	console.log('prev clicked');
	waitFor(capturedRows,10000,sendData,error);
});

$('body').on("click",'#next input', function(){
	console.log('next clicked');
	waitFor(capturedRows,10000,sendData,error);
});


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
			$('#filterChange input').click();
			waitFor(capturedRows,10000,sendData,error);
		},error);
		
		
	}
});


if (!document.firstSend){
    waitFor(checkTabLoad,5000,hideCol,error);
	document.firstSend=1;
	waitFor(function(){ return (document.customStylesReady == 1);}, 5000, sendData,error);
	console.log('first time');
}

document.filteredRows = $("#filteredRows").text();

$('body').on('click', '#filters', function(){
	
	waitFor(function(){
		var filteredRows = $("#filteredRows").text();
		if (filteredRows != document.filteredRows || filteredRows == ''){
			document.filteredRows = filteredRows;
			return true;
		}
		return false;
	}, 10000, function(){
		$('#filterChange input').click();
		waitFor(capturedRows,10000,sendData,error);
	}, error)
});
