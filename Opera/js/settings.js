// Convert LocalStorage string based variables
// to real boolean type
function _toBoolean(val) {
	switch(val) {
		case "true": case 1: case "1": return true;
		case "false": case 0: case "0": return false;
		default: return Boolean(val);
	}
}


var _settings = {
	
	check : function() {

		if(widget.preferences.chat_hide							== undefined) widget.preferences.chat_hide							= 'false';
		if(widget.preferences.fav_show_only_unreaded			== undefined) widget.preferences.fav_show_only_unreaded				= 'false';
		if(widget.preferences.short_comment_marker				== undefined) widget.preferences.short_comment_marker				= 'false';
		if(widget.preferences.custom_list_styles				== undefined) widget.preferences.custom_list_styles					= 'false';
		if(widget.preferences.jump_unreaded_messages			== undefined) widget.preferences.jump_unreaded_messages				= 'false';
		if(widget.preferences.autoload_next_page				== undefined) widget.preferences.autoload_next_page					= 'false';
		if(widget.preferences.scroll_to_page_top				== undefined) widget.preferences.scroll_to_page_top					= 'false';
		if(widget.preferences.animated_reply_to					== undefined) widget.preferences.animated_reply_to					= 'false';
		if(widget.preferences.overlay_reply_to					== undefined) widget.preferences.overlay_reply_to					= 'false';
		if(widget.preferences.highlight_comments_for_me			== undefined) widget.preferences.highlight_comments_for_me			= 'false';
		if(widget.preferences.threaded_comments					== undefined) widget.preferences.threaded_comments					= 'false';
		if(widget.preferences.show_mentioned_comments_in_links	== undefined) widget.preferences.show_mentioned_comments_in_links	= 'false';
		if(widget.preferences.custom_blocks						== undefined) widget.preferences.custom_blocks						= 'false';
		if(widget.preferences.hide_blocks_buttons				== undefined) widget.preferences.hide_blocks_buttons				= 'false';

	
		_settings.restore();
	},
	
	
	restore : function() {
		

		
		// Restore settings for buttons
		$('#right .button').each(function() {

			if(widget.preferences[ $(this).attr('id') ] == 'true') {
				$(this).addClass('on');
			
			} else {
				$(this).addClass('off');
			}
		});
		
		// Restore settings for checkboxes
		$('input:checkbox').each(function() {
			
			if(widget.preferences[ $(this).attr('id') ] == 'true') {
				$(this).attr('checked', true);
			}
		});
	},
	
	save : function(ele) {

		if( $(ele).hasClass('on') || $(ele).attr('checked') == 'checked') {
			widget.preferences[ $(ele).attr('id') ] = true; 
		
		} else {
			widget.preferences[ $(ele).attr('id') ] = false; 
		}
	}
};


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
		if(typeof widget.preferences['block_list'] == "undefined") {
			return false;
		}
	
		// If the list is empty
		if(widget.preferences['block_list'] == '') {
			return false;
		}
	
		// Everything is OK, remove the default message
		$('#blocklist').html('');
	
		// Fetch the userlist into an array
		var users = widget.preferences['block_list'].split(',').sort();
	
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
		var list = widget.preferences['block_list'].split(',');
		
		// Get the removed user index
		var index = list.indexOf(user);
		
		// Remove user from array
		list.splice(index, 1);
		
		// Save changes in localStorage
		widget.preferences['block_list'] = list;
		
		// Add default message to the list if it is now empty
		if($('#blocklist li').length == 0) {
			$('<li>Jelenleg üres a tiltólistád</li>').appendTo('#blocklist');
		}
	}
}


function resetBlocksConfig() {
	widget.preferences.removeItem('blocks_config');
}

/**********************************************************/
/*                P A G E  S C R I P T S                  */
/**********************************************************/
var _page = {

	init : function() {
		
		// Bind click event for left side menu
		$('#left ul li').click(function() {

			// Get settings option index
			var index = $(this).index();
			
			// Remove 'active' class for all
			// left side menu items
			$('#left ul li').removeAttr('class');
			
			// Hide all subpages
			$('#right > div').hide();
			
			// Add active class for active left menu item
			$(this).attr('class', 'active');
			
			// Show the chosen subpage
			$('#right > div').eq(index).show();
		});
		
		// Auto-click on the first item
		$('#left ul li:first').click();
		
		// Set buttons
		$('#right .button').click(function() {
			_page.button(this);
		});
		
		// Set checkboxes
		$('input:checkbox').click(function() {
			_settings.save(this);
		})
		
		// Reset blocks config
		$('#reset_blocks_config').click(function() {
			resetBlocksConfig();
		});
	},
	
	button : function(ele) {

		if( $(ele).hasClass('on') ) {
			$(ele).css({ 'background-position' : '-70px 0px' });
			$(ele).attr('class', 'button off');
			
			_settings.save(ele);
		} else {
		
			$(ele).css({ 'background-position' : '0px 0px' });
			$(ele).attr('class', 'button on');
			
			_settings.save(ele);
		}
	}
};


$(document).ready(function() {
	
	// Check localStorage vars,
	// create with default vals if dont exists
	_settings.check();
	
	
	// List blocked users
	blocklist.init();
	
	// Init page scripts
	_page.init();
});
