
function removeChatWindow() {

	// Remove BR and SCRIPT tag
	// Remove 'new window' div
	// Remove the chat frame
	
	$('center iframe').closest('td').children(':not(center)').remove();
	$('center iframe').next().remove();
	$('center iframe').remove();
}

$(document).ready(function() {

	removeChatWindow();	

});