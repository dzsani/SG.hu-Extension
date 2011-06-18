
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
	});
}

var blocklist =  {
	
	init : function() {
		
		// Create user list
		blocklist.list();
		
		// Create remove events
		$('#blocklist a').click(function(e) {
			e.preventDefault();
			blocklist.remove(this);
		})
	},
	
	list: function() {
		// If theres is no entry in localStorage
		if(typeof localStorage['block_list'] == "undefined") {
			return false;
		}
	
		// If the list is empty
		if(localStorage['block_list'] == '') {
			return false;
		}
	
		// Everything is OK, remove the default message
		$('#blocklist').html('');
	
		// Fetch the userlist into an array
		var users = localStorage['block_list'].split(',').sort();
	
		// Iterate over, add users to the list
		for(c = 0; c < users.length; c++) {
			$('#blocklist').append('<li><span>'+users[c]+'</span> <a href="#">töröl</a></li>');
		}
	},
	
	remove : function(el) {
		
		// Get username
		var user = $(el).prev().html();
				
		// Remove user from the list
		$(el).closest('li').remove();
		
		// Get the blocklist array
		var list = localStorage['block_list'].split(',');
		
		// Get the removed user index
		var index = list.indexOf(user);
		
		// Remove user from array
		list.splice(index, 1);
		
		// Save changes in localStorage
		localStorage['block_list'] = list;
		
		// Add default message to the list if it is now empty
		if($('#blocklist li').length == 0) {
			$('<li>Jelenleg üres a tiltólistád</li>').appendTo('#blocklist');
		}
	}
}

$(document).ready(function() {
	
	// Check localStorage vars,
	// create with default vals if dont exists
	checkPrefs();
	
	// Save setting fn
	savePrefs();
	
	// List blocked users
	blocklist.init();
});
