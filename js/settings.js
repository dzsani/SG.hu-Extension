
// Convert LocalStorage string based variables
// to real boolean type
function _toBoolean(val) {
	switch(val) {
		case "true": case 1: case "1": return true;
		case "false": case 0: case "0": return false;
		default: return Boolean(val);
	}
}

// List of checkboxes
var checkboxes = ['chat_hide'];

function checkPrefs() {
	
	if(localStorage['chat_hide']		== undefined) localStorage['chat_hide']		= 'false';
	
	restorePrefs();
	}

function restorePrefs() {

	$.each(checkboxes, function(index, value) {
		if(localStorage[value] == 'true') $('#'+value).attr('checked', true);
		});
	}

function savePrefs() {
	
	$.each(checkboxes, function(index, value) {
		$('#'+value).click(function(){ localStorage[value] = $('#'+value).attr('checked'); });
		});
	
	}

$(document).ready(function() {
	checkPrefs();
	savePrefs();
	});
