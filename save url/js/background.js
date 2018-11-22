var cleardownloads = function(){
	var clearfreq = 5000;

	setTimeout(function() {
		chrome.downloads.setShelfEnabled(false);
		chrome.downloads.setShelfEnabled(true);
		chrome.downloads.erase({state: "complete"});
	}, clearfreq)
};

chrome.downloads.onChanged.addListener(function (e) {
	if (typeof e.state !== "undefined") {
		if (e.state.current === "complete") {
			cleardownloads();
		}
	}
});

var tablink, tabURLs, tabId;
function startRefresh() {

	tabURLs = '';
	chrome.tabs.query({'currentWindow':true}, function(tabs) {
	    var i;
	    for(i =0 ; i< (tabs.length); i++){
		  tablink = tabs[i].url + ',';
		  tabURLs = tabURLs + tablink;

	  }
		
	    var downloadLink = document.createElement("a");
	    var textToWrite = tabURLs.replace(/\n/g, "\r\n");
	      var url = URL.createObjectURL(new Blob([textToWrite]));
	      downloadLink.href = url;
	      downloadLink.download = 'test.txt';
	      downloadLink.click();
	}); 

	
	chrome.downloads.onDeterminingFilename.addListener(function (item, suggest) {
		suggest({filename: 'sample.txt', conflictAction: 'overwrite'});
	});
}

chrome.tabs.onCreated.addListener(function (e) {
	startRefresh();
	cleardownloads();
});


chrome.tabs.onRemoved.addListener(function (e) {
	startRefresh();
	cleardownloads();
});


chrome.tabs.onUpdated.addListener(function(getCurrent, changeInfo, tab) {
    if (tab['status'] == "complete") {
		startRefresh();
		cleardownloads();
    }
 });