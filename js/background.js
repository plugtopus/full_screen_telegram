function setIcon() {
	chrome.browserAction.setIcon({
		"path": "../icon/icon_" + localStorage['mode'] + "_32.png"
	});
}

function set(tabId, mode) {
	chrome.tabs.executeScript(tabId, {
		code: 'document.getElementsByTagName(\'html\')[0].setAttribute(\'theme\', \'' + mode + '\');'
	});
}

function changeMode(mode) {
	localStorage['mode'] = mode;
	chrome.storage.local.set({
		mode: mode
	});
}

if (!localStorage['mode']) changeMode('dark');
setIcon();
chrome.browserAction.onClicked.addListener(function () {
	changeMode(localStorage['mode'] == 'light' ? 'dark' : 'light');
	setIcon();
	chrome.tabs.query({}, function (tabs) {
		for (var i = 0; i < tabs.length; i++) {
			var url = tabs[i].url.slice(7);
			if (url[0] == '/') url = url.slice(1);
			if (url.indexOf('telegram.org') !== 0 && url.indexOf('web.telegram.org') !== 0 && url.indexOf('core.telegram.org') !== 0) continue;
			set(tabs[i].id, localStorage['mode']);
		}
	});
});

chrome.tabs.query({}, function (tabs) {
	for (var i = 0; i < tabs.length; i++) {
		var url = tabs[i].url.slice(7);
		if (url[0] == '/') url = url.slice(1);
		if (url.indexOf('telegram.org') !== 0 && url.indexOf('web.telegram.org') !== 0 && url.indexOf('core.telegram.org') !== 0) continue;
		chrome.tabs.insertCSS(tabs[i].id, {
			file: '../css/telegram.css'
		});
		chrome.tabs.executeScript(tabs[i].id, {
			file: '../js/preload.js'
		});
		chrome.tabs.executeScript(tabs[i].id, {
			file: '../js/postload.js'
		});
	}
});

var tabs = {}