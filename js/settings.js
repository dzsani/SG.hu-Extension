
// Convert LocalStorage string based variables
// to real boolean type
function _toBoolean(val) {
	switch(val) {
		case "true": case 1: case "1": return true;
		case "false": case 0: case "0": return false;
		default: return Boolean(val);
	}
}

function checkPrefs() {
	
	if(localStorage['chat_hide']		== undefined) localStorage['chat_hide']		= 'false';
	
	restorePrefs();
	}


function restorePrefs() {

	$('input:checkbox').each(function() {
		if(localStorage[ $(this).attr('id') ] == 'true') {
			$(this).attr('checked', true);
		}
	});
}


function savePrefs() {

	$('input:checkbox').click(function(){ 
		localStorage[ $(this).attr('id') ] = $(this).attr('checked'); 
		alert($(this).attr('checked'));
	});
}

$(document).ready(function() {
	
	// Check localStorage vars,
	// create with default vals if dont exists
	checkPrefs();
	
	// Save setting fn
	savePrefs();
});
