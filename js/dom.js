$(document).ready(function() {
	
	// Left sidebar
	$('table:eq(3) td:eq(0)').attr('id', 'ext_left_sidebar');
	
	// Right sidebar
	$('table:eq(3) td:eq(2) table:first tr > td:eq(2)').attr('id', 'ext_right_sidebar');
});