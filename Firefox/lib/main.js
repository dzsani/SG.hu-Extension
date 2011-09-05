// Get page-mod object to load content scripts
var pageMod = require("page-mod");

// Simple Storage for storing and getting settings
var ss = require("simple-storage");

// Get data object for loadin resources
var data = require("self").data;

pageMod.PageMod({
	include: ["http://sg.hu/*", "http://www.sg.hu/*"],
	contentScriptWhen: 'start',
	contentScriptFile: [data.url("js/jquery.js"), data.url("js/json.js"), data.url("js/dom.js"), data.url("js/settings.js"), data.url("js/content.js")],
	onAttach: function onAttach(worker) {
	
		worker.on('message', function(event) {
			
			alert('a');
			// Send back the settings object
			if(event.name == 'getSettings') {
					
				panel.port.emit("message", { name : "setSettings", message : ss.storage } );
				
			// Sets the blocks config
			} else if(event.name == 'setBlocksConfig') {
				ss.storage.blocks_config = event.message;
				
			// Add user to blocklist
			} else if(event.name == 'addToBlocklist') {

				// If theres in no entry in localStorage
				if(typeof ss.storage.block_list == "undefined") {
					ss.storage.block_list = '';
				}
		
				// If the blocklist is empty
				if(ss.storage.block_list == '') { 
					ss.storage.block_list = event.message;
		
				// If the blocklist is not empty
				} else {
					var blocklist = new Array();
						blockList = ss.storage.block_list.split(',');
			
					if(blockList.indexOf(event.message) == -1) { 
						blockList.push(event.message); 
						ss.storage.block_list = blockList.join(',');
					}
				}
		
			// Reset blocks config
			} else if(event.name == 'resetBlocksConfig') {
				ss.storage.blocks_config = '';
				
			// Remove user form blocklist
			} else if(event.name == 'removeUserFromBlocklist') {

				// Get username
				var user = event.message;
	
				// Get the blocklist array
				var list = ss.storage.block_list.split(',');
		
				// Get the removed user index
				var index = list.indexOf(user);
		
				// Remove user from array
				list.splice(index, 1);
					
				// Save changes in localStorage
				ss.storage.block_list = list.join(',');
				
			// Save posted settings
			} else if(event.name == 'setSetting') {

				// Setting name
				var key = event.message.key;
					
				// Setting value
				var val = event.message.val;
					
				ss.storage[key] = val;
			}

		});
	}
});

// Set predefined settings values
if( typeof ss.storage.chat_hide 							== 'undefined') ss.storage.chat_hide 							= false;
if( typeof ss.storage.custom_blocks							== 'undefined') ss.storage.custom_blocks 						= false;
if( typeof ss.storage.jump_unreaded_messages				== 'undefined') ss.storage.jump_unreaded_messages				= true;
if( typeof ss.storage.fav_show_only_unreaded				== 'undefined') ss.storage.fav_show_only_unreaded				= true;
if( typeof ss.storage.short_comment_marker					== 'undefined') ss.storage.short_comment_marker					= true;
if( typeof ss.storage.highlight_forum_categories			== 'undefined') ss.storage.custom_list_styles					= false;
if( typeof ss.storage.threaded_comments						== 'undefined') ss.storage.threaded_comments					= false;
if( typeof ss.storage.block_list							== 'undefined') ss.storage.block_list							= '';
if( typeof ss.storage.autoload_next_page					== 'undefined') ss.storage.autoload_next_page					= true;
if( typeof ss.storage.overlay_reply_to						== 'undefined') ss.storage.overlay_reply_to						= true;
if( typeof ss.storage.highlight_comments_for_me				== 'undefined') ss.storage.highlight_comments_for_me			= true;
if( typeof ss.storage.show_mentioned_comments				== 'undefined') ss.storage.show_mentioned_comments				= true;
if( typeof ss.storage.show_mentioned_comments_in_links		== 'undefined') ss.storage.show_mentioned_comments_in_links		= true;
if( typeof ss.storage.blocks_config							== 'undefined') ss.storage.blocks_config						= '';
if( typeof ss.storage.hide_blocks_buttons					== 'undefined') ss.storage.hide_blocks_buttons					= false;
if( typeof ss.storage.show_navigation_buttons				== 'undefined') ss.storage.show_navigation_buttons				= true;
if( typeof ss.storage.remove_adds							== 'undefined') ss.storage.remove_adds							= false;
