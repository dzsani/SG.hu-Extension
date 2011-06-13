
function removeChatWindow() {

	// Remove top BR tags from the two column top	
	$('center iframe').next().next().find('table:first').prev().remove();
	$('center iframe').next().next().find('tbody tr').children('td:eq(2)').children(':not(div)').remove();
	
	// Remove BR and chat SCRIPT tag
	$('center iframe').closest('td').children(':not(center)').remove();
	
	// Remove 'new window' DIV
	$('center iframe').next().remove();
	
	// Remove the chat frame
	$('center iframe').remove();
}

$(document).ready(function() {
	
	// FORUM.PHP
	if(window.location.href.match('forum.php')) {
	
		removeChatWindow();	
	}

});