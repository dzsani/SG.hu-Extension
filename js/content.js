
function removeChatWindow() {

	$('table:eq(3) td:eq(2) center:eq(0) *:lt(2)').remove();
	$('table:eq(3) td:eq(2) br').remove();
}

var  jumpLastUnreadedMessage = {
	
	init : function() {
		$('.b-h-o-head:eq(2)').next().find('a').each(function() {
			
			// If theres a new message
			if($(this).find('small').length > 0) {
			
				// Get the new messages count
				var newMsg = parseInt($(this).find('small').html().match(/\d+/g));
				
				// Get last msn's page number
				var page = Math.ceil( newMsg / 80 );
				
				// Rewrite the url
				$(this).attr('href', $(this).attr('href') + '&order=reverse&index='+page+'&newmsg='+newMsg+'');
			}
		});
	}, 
	
	jump : function() {
		
		// Get new messages counter
		var newMsg = document.location.href.split('&newmsg=')[1];

		// Get the last msg
		var lastMsg = newMsg % 80;
		
		// Target comment ele
		var target = $('#ujhszjott').next().children('center:eq('+(lastMsg-1)+')');
		
		// Insert the horizontal rule
		$('<hr>').insertAfter(target);

		// Target offsetTop
		var targetOffset = $(target).offset().top;
		
		// Scroll to target element
		$('body').animate({ scrollTop : targetOffset}, 500);
		
		// Watch offsetTop while the content loads completly
		var interval = setInterval(function(){
			// Target offsetTop
			var targetOffset = $(target).offset().top;
		
			// Scroll to target element
			$('body').animate({ scrollTop : targetOffset}, 200);
		}, 200, target);
		
		// Clear interval when the page loads
		$(window).load(function() {
     		clearInterval(interval);
		});
	}
	
};

function filterOutReadedFaves() {
	$('.b-h-o-head:eq(2)').next().find('div:not(.std0) a').each(function() {
		
		// Skip topics that have unreaded messages
		if( $(this).find('small').length > 0) {
			return true;
		}
		
		// Otherwise, add hidden class
		$(this).parent().addClass('ext_hidden_fave');
	});
	
	// Set the "show" button
	$('.b-h-o-head:eq(2)').append('<span id="ext_show_filtered_faves">mutat</span>');
	
	// Set event handling
	$('#ext_show_filtered_faves').toggle(
		function() { $(this).html('elrejt'); $('.ext_hidden_fave').show(); },
		function() { $(this).html('mutat'); $('.ext_hidden_fave').hide(); }
	);
}


$(document).ready(function() {
	
	// FORUM.PHP
	if(window.location.href.match('forum.php')) {
	
		// Remove chat window
		if(dataStore['chat_hide'] == 'true') {
			removeChatWindow();
		}
		
		// Jump the last unreaded message
		if(dataStore['jump_unreaded_messages'] == 'true') {
			jumpLastUnreadedMessage.init();
		}
		
		// Faves: show only with unreaded messages
		if(dataStore['fav_show_only_unreaded'] == 'true') {
			filterOutReadedFaves();
		}
	}
	
	// LISTAZAS.PHP
	else if(window.location.href.match('listazas.php3')) {
	
		// Jump the last unreaded message
		if(dataStore['jump_unreaded_messages']) {
			jumpLastUnreadedMessage.jump();
		}
	}
});


var dataStore;
var port = chrome.extension.connect();


port.postMessage({ type : "getStorageData" });

port.onMessage.addListener(function(response) {

	if(response.type == 'setStorageData') {
		dataStore = response.data;
		extInit();
	}
});