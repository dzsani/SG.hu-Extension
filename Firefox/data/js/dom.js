$(document).ready(function() {
	
	if(document.location.href.match('forum.php') && !document.location.href.match('forum.php3')) {

		// Welcome block
		$('.b-h-o-head:eq(0)').addClass('ext_welcome');

		// Faves
		$('.b-h-o-head:eq(2)').addClass('ext_faves');
	
		// Left sidebar
		$('table:eq(3) td:eq(0)').attr('id', 'ext_left_sidebar');
	
		// Right sidebar
		$('table:eq(3) td:eq(2) table:first tr > td:eq(2)').attr('id', 'ext_right_sidebar');
	}
});