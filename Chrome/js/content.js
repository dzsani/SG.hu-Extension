// Predefined vars
var userName, isLoggedIn, dataStore;

var port = chrome.extension.connect();

function convertBool(string){

	switch(string.toLowerCase()){
		case "true": case "yes": case "1": return true;
		case "false": case "no": case "0": case null: return false;
		default: return Boolean(string);
	}
}

function setPredefinedVars() {
	
	loggedIn = isLoggedIn();
	
	if(loggedIn) {
		userName = getUserName();
	}
}

function isLoggedIn() {
	
	// Article page
	if(document.location.href.match('cikkek')) {
		return $('form[name="newmessage"]').length ? true : false;
	
	
	// Forum main page
	} else if(document.location.href.match('forum.php')) {
		return $('.std1').length ? true : false;
	
	// Topic page
	} else if(document.location.href.match(/listazas.php3\?id/gi)) {
		return ( $('.std1').length > 1) ? true : false;
	}
	
}

function getUserName() {

	// Article page
	if(document.location.href.match('cikkek')) {
		return $('#msg-head b a').html();

	// Forum main page
	} else if(document.location.href.match('forum.php')) {
		return $('.std1 b').text().match(/Szia (.*)!/)[1];
	
	// Topic page
	} else if(document.location.href.match(/listazas.php3\?id/gi)) {
	
		return $('.std1:contains("Bejelentkezve")').text().replace('Bejelentkezve: ', '');
	}
}


var chat_hide = {
	
	activated : function() {

		$('table:eq(3) td:eq(2) center:eq(0) *:lt(2)').hide();
		$('table:eq(3) td:eq(2) br').hide();
	},
	
	disabled : function() {

		$('table:eq(3) td:eq(2) center:eq(0) *:lt(2)').show();
		$('table:eq(3) td:eq(2) br').show();	
	}
}


var jump_unreaded_messages = {
	
	activated : function() {
	
		$('.ext_faves').next().find('a').each(function() {
			
			// If theres a new message
			if($(this).find('small').length > 0) {
			
				// Get the new messages count
				var newMsg = parseInt($(this).find('small').html().match(/\d+/g));
				
				// Get last msn's page number
				var page = Math.ceil( newMsg / 80 );
				
				// Rewrite the url
				$(this).attr('href', $(this).attr('href') + '&order=reverse&index='+page+'&newmsg='+newMsg+'');
			
			// Remove newmsg var from link
			} else if( $(this).attr('href').indexOf('&order') != -1) {
				
				var start = $(this).attr('href').indexOf('&order');
				
				$(this).attr('href', $(this).attr('href').substring(0, start));
			}
		});
	},
	
	disabled : function() {
	
		$('.ext_faves').next().find('a').each(function() {
			
			if( $(this).attr('href').indexOf('&order') != -1) {
				
				var start = $(this).attr('href').indexOf('&order');
				
				$(this).attr('href', $(this).attr('href').substring(0, start));
			}
		});
	},
	
	topic : function() {
	
		// Get new messages counter
		var newMsg = document.location.href.split('&newmsg=')[1];
		
		// Return if there is not comment counter set
		if(typeof newMsg == "undefined" || newMsg == '' || newMsg == 0) {
			return false;
		}
		
		// Get the last msg
		var lastMsg = newMsg % 80;
		
		// Target comment element
		if($('.ext_new_comment').length > 0) {
			var target = $('.ext_new_comment:first').closest('center');
		
		} else if( $('a[name=pirosvonal]').length > 0) {
			var target = $('a[name=pirosvonal]').prev();
			
				// Insert the horizontal rule
				$('<hr>').insertAfter(target).attr('id', 'ext_unreaded_hr');
				
		} else {
			var target = $('.topichead').closest('center').eq(lastMsg-1);
			
			// Insert the horizontal rule
			$('<hr>').insertAfter(target).attr('id', 'ext_unreaded_hr');
		}
		
		// Append hr tag content if any
		var content = $('a[name=pirosvonal]').find('center').insertBefore('a[name=pirosvonal]');
			
		// Remove original hr tag
		$('a[name=pirosvonal]').remove();

		// Url to rewrite
		var url = document.location.href.replace(/&newmsg=\d+/gi, "");

		// Update the url to avoid re-jump
		history.replaceState({ page : url }, '', url);
				
		// Call the jump method with 1 sec delay
		setTimeout(function(){ 
			jump_unreaded_messages.jump();
		}, 1000);
		
		// Add click event the manual 'jump to last msg' button
		$('a[href*="pirosvonal"]').click(function(e) {
			e.preventDefault();
			jump_unreaded_messages.jump();
		});
	},
	
	
	jump : function() {
		
		// Get the target element
		if($('.ext_new_comment').length > 0) {
			var target = $('.ext_new_comment:first').closest('center');
		
		} else if($('#ext_unreaded_hr').length > 0) {
			var target = $('#ext_unreaded_hr');
		
		} else {
			return false;
		}

		// Target offsets
		var windowHalf = $(window).height() / 2;
		var targetHalf = $(target).outerHeight() / 2;
		var targetTop = $(target).offset().top;
		var targetOffset = targetTop - (windowHalf - targetHalf);
		
		// Scroll to target element
		$('body').animate({ scrollTop : targetOffset}, 500);
	}
	
};

var fav_show_only_unreaded = {

	opened : false,
	
	init : function() {
		if(dataStore['fav_show_only_unreaded_remember'] == 'true') {
			fav_show_only_unreaded.opened = convertBool(dataStore['fav_show_only_unreaded_opened']);
		}
	},

	activated : function() {

		// Remove original toggle button
		$('div[class*="csakujuzi"]').remove();

		// Remove style tags from faves containers
		$('.ext_faves').next().children('div').removeAttr("style");

		// Disable page auto-hide function
		setCookie('sgkedvencrejtve', '0', 365);	

		// Move the button away to place toggle button
		$('#ext_refresh_faves').css('right', 18);
		$('#ext_read_faves').css('right', 36);
		
		var counter = 0;
		var counterAll = 0;

		$($('.ext_faves').next().find('div a').get().reverse()).each(function() {
		
			// Skip topics that have unreaded messages
			if( $(this).find('small').length > 0) {
				counter++;
				counterAll++;
				return true;
			}
		
			if( $(this).parent().is('div.std0') ) {
		
				if(counter == 0) {
					$(this).parent().addClass('ext_hidden_fave');
					return true;
				} else {
					counter = 0;
					return true;
				}
			}
		
			// Otherwise, add hidden class
			$(this).parent().addClass('ext_hidden_fave');
		});
	
		// Create an error message if theres no topik with unreaded messages
		if(counterAll == 0 && $('#ext_filtered_faves_error').length == 0) {
			$('.ext_faves').next().find('div:last').after('<p id="ext_filtered_faves_error">Nincs olvasatlan téma</p>');
		}
	
		// Remove old toggle button if any
		$('#ext_show_filtered_faves').remove();
		
		// Set the toggle button
		$('.ext_faves').append('<div id="ext_show_filtered_faves"></div>');
		$('#ext_show_filtered_faves').append('<span id="ext_show_filtered_faves_arrow"></span>');
	
		// Apply some styles
		$('#ext_show_filtered_faves_arrow').attr('class', 'show');

		// Set event handling
		$('#ext_show_filtered_faves').live('click', function() {
		
			if(fav_show_only_unreaded.opened == false) {
				$('#ext_filtered_faves_error').hide();
				$('#ext_show_filtered_faves_arrow').attr('class', 'hide');
				$('.ext_hidden_fave').show();
				
				fav_show_only_unreaded.opened = true;

				// Update last state in LocalStorage
				port.postMessage({ name : "updateFavesFilterLastState", message : true });
			
			} else {
				$('#ext_filtered_faves_error').show();
				$('#ext_show_filtered_faves_arrow').attr('class', 'show');
				$('.ext_hidden_fave').hide();
				
				fav_show_only_unreaded.opened = false;

				// Update last state in LocalStorage
				port.postMessage({ name : "updateFavesFilterLastState", message : false });
			}
		});

		// Check opened status
		if(fav_show_only_unreaded.opened == true) {
			$('#ext_filtered_faves_error').hide();
			$('#ext_show_filtered_faves_arrow').attr('class', 'hide');
			$('.ext_hidden_fave').show();
		}
	},
	
	disabled : function() {
		
		// Remove hidden class
		$('.ext_hidden_fave').removeClass('ext_hidden_fave');
		
		// Remove toggle button
		$('#ext_show_filtered_faves').remove();

		// Put back the buttons to the right side
		$('#ext_refresh_faves').css('right', 0);
		$('#ext_read_faves').css('right', 18);
	}
};


var short_comment_marker = {
	
	activated : function() {
	
		$('.ext_faves').next().find('div a').each(function() {
		
			if( $(this).find('small').length > 0) {
			
				// Received new messages counter
				var newMsg = parseInt( $(this).find('small').html().match(/\d+/g) );
			
				// Remove the old marker text
				$(this).find('br').hide();
				$(this).find('font:last').hide();
			
				// Add the new marker after the topic title
				$(this).html( $(this).html() + ' <span class="ext_short_comment_marker" style="color: red;">'+newMsg+'</span>');
			}
		});
	},
	
	disabled : function() {
	
		$('.ext_faves').next().find('div a').each(function() {
		
			if( $(this).find('small').length > 0) {
						
				// Remove the old marker text
				$(this).find('br').show();
				$(this).find('font:last').show();
			
				// Add the new marker after the topic title
				
				$(this).find('.ext_short_comment_marker').remove();
			}
		});
	}
};

var blocklist =  {
	
	
	init : function() {

		// Create the block buttons
		$('.topichead:not(.blockbutton) a[href*="forummsg.php"]').each(function() {
			
			// Insert the block button
			$('<a href="#" class="block_user">letiltás</a> <span>| </span> ').insertBefore(this);

			// Restore anchor color settings
			if(document.location.href.match('cikkek')) {
				$('a.block_user').css('color', '#444');
			}

			// Add "blockbutton" class to avoid duplicates on re-init
			$(this).closest('.topichead').addClass('blockbutton');
		});
	
		// Create the block evenst
		$('.block_user').die('click').live('click', function(e) {
			e.preventDefault();
			blocklist.block(this);
		});
	},
	
	hidemessages : function() {

		// Return false if theres no blocklist entry
		if(typeof dataStore['block_list'] == "undefined" || dataStore['block_list'] == '') {
			return false;
		}
	
		var deletelist = dataStore['block_list'].split(',');

		$(".topichead").each( function() {
			
			if(document.location.href.match('cikkek')) {
			
				var nick = $(this).find('a:first').html();

			} else {
			
				var nick = ($(this).find("table tr:eq(0) td:eq(0) a img").length == 1) ? $(this).find("table tr:eq(0) td:eq(0) a img").attr("alt") : $(this).find("table tr:eq(0) td:eq(0) a")[0].innerHTML;
					nick = nick.replace(/ - VIP/, "");
			}
			
			for(var i = 0; i < deletelist.length; i++) {
				if(nick.toLowerCase() == deletelist[i].toLowerCase()) {
					$(this).closest('center').hide();
				}
			}
		});
	},
	
	block : function(el) {

		var nick = '';

		var anchor = $(el).closest('.topichead').find('a[href*="forumuserinfo.php"]');
		var tmpUrl = anchor.attr('href').replace('http://www.sg.hu/', '');

		if(anchor.children('img').length > 0) {
			nick = anchor.children('img').attr('title').replace(" - VIP", "");
	
		} else {
			nick = anchor.html().replace(" - VIP", "");
		}
	
		if(confirm('Biztos tiltólistára teszed "'+nick+'" nevű felhasználót?')) {
	
			$('.topichead a[href="'+tmpUrl+'"]').each(function() {
	
				// Remove the comment
				$(this).closest('center').animate({ height : 0, opacity : 0 }, 500, function() {
					$(this).hide();
				})
			});
		
			// Post message
			port.postMessage({ name : "addToBlocklist", message : nick });
		
			// Add name to blocklist 
			$('<li><span>'+nick+'</span> <a href="#">töröl</a></li>').appendTo('#ext_blocklist')
		
			// Remove empty blocklist message
			$('#ext_empty_blocklist').remove();
		}
	},
	
	unblock : function(user) {

		$(".topichead").each( function() {
			
			if(document.location.href.match('cikkek')) {
			
				var nick = $(this).find('a:first').html();
			} else {
			
				var nick = ($(this).find("table tr:eq(0) td:eq(0) a img").length == 1) ? $(this).find("table tr:eq(0) td:eq(0) a img").attr("alt") : $(this).find("table tr:eq(0) td:eq(0) a")[0].innerHTML;
					nick = nick.replace(/ - VIP/, "");
			}

			if(nick.toLowerCase() == user.toLowerCase()) {

				// Show temporary the comment height
				$(this).closest('center').css({ display : 'block', height : 'auto' });
				
				// Get height
				var height = $(this).closest('center').height();
				
				// Set back to invisible, then animate
				$(this).closest('center').css({ height : 0 }).animate({ opacity : 1, height : height }, 500);
			}
		});
	}
};






var highlight_forum_categories = {
	
	activated : function() {
		$('.std0').find('b').css('color', '#ffffff');
		$('.std0').find('b').css('background-color', '#6c9ff7');
		$('.std0').find('b').css('padding', '2px');
	},
	
	disabled : function() {
		$('.std0').find('b').css('color', '#444');
		$('.std0').find('b').css('background-color', '#fff');
		$('.std0').find('b').css('padding', '0px');
	}
}


var autoload_next_page = {
	
	progress : false,
	currPage : null,
	maxPage : null,
	counter : 0,
	
	activated : function() {
		
		// Artcile
		if(document.location.href.match('cikkek')) {
		
			// Current page index
			autoload_next_page.currPage = 1;
			
			// Get topic ID
			var topic_id = $('.std2 a').attr('href').split('?id=')[1];
			
			// Get the topic page to determinate max page number
			$.ajax({
				url : 'listazas.php3?id=' + topic_id,
				success : function(data) {
					
					// Parse the response HTML
					var tmp = $(data);
					
					// Fetch the max page number
					autoload_next_page.maxPage = parseInt($(tmp).find('.lapozo:last a:last').prev().html());
				}
			});
			
			// Get max page number 
			autoload_next_page.maxPage = parseInt($('.lapozo:last a:last').prev().html());

		// Topic
		} else {
			
			// Current page index
			autoload_next_page.currPage = parseInt($('.lapozo:last span.current:first').html());
		
			// Get max page number 
			autoload_next_page.maxPage = parseInt($('.lapozo:last a:last').prev().html());
		}
		
		$(document).scroll(function() {
			
			var docHeight = $('body').height();
			var scrollTop = $('body').scrollTop();

			if(docHeight - scrollTop < 3000 && !autoload_next_page.progress && autoload_next_page.currPage < autoload_next_page.maxPage) {
				autoload_next_page.progress = true;
				autoload_next_page.load();
			}
		});
		
	},
	
	disabled : function() {
		
		$(document).unbind('scroll');
	},
	
	load : function() {
		
		// Url to call
		// date ASC order
		if(document.location.href.match('timeline')) {
			var url = document.location.href.substring(0, 44);
				url = url+'&order=timeline&index='+(autoload_next_page.currPage+1)+'';
			
		// Date DESC order
		} else {
			if(document.location.href.match('cikkek')) {
			
				// Get topic ID
				var topic_id = $('.std2 a').attr('href').split('?id=')[1];		
				
				// Url to call	
				var url = 'listazas.php3?id='+topic_id;
					url =  url+'&index='+(autoload_next_page.currPage+1)+'&callerid=1';
			
			} else { 
				var url = document.location.href.substring(0, 44);
					url = url+'&index='+(autoload_next_page.currPage+1)+'';
			}
		}
		
		// Make the ajax query
		$.get(url, function(data) {
			
			// Create the 'next page' indicator
			if(dataStore['threaded_comments'] != true) {
				if(document.location.href.match('cikkek')) {
					$('<div class="ext_autopager_idicator">'+(autoload_next_page.currPage+1)+'. oldal</div>').insertBefore('.std2:last');
				} else {
					$('<div class="ext_autopager_idicator">'+(autoload_next_page.currPage+1)+'. oldal</div>').insertBefore('.std1:last');
				}
			}
			
			// Parse the response HTML
			var tmp = $(data);
			
			// Articles
			if(document.location.href.match('cikkek')) {
				var tmp = tmp.find('.b-h-o-head a').closest('.b-h-o-head');
				tmp.each(function() {

					// Maintain style settings
					$(this).addClass('topichead');
					$(this).css('background', 'url(images/ful_o_bgbg.gif)');
					$(this).find('.msg-dateicon a').css('color', '#444');
					
					// Insert
					$(this).closest('center').insertBefore('.std2:last');
					$(this).parent().css('width', 700);
				});
			
			// Topics
			} else {
				var tmp = tmp.find('.topichead');
				tmp.each(function() {
					$(this).closest('center').insertBefore('.std1:last');
				});
			}
			
			autoload_next_page.progress = false;
			autoload_next_page.currPage++;
			autoload_next_page.counter++;
			
			// Reinit settings

				// Set-up block buttons
				blocklist.init();
				
				// threaded comments
				if(dataStore['threaded_comments'] == 'true') {
					threaded_comments.sort();
				}

				// highlight_comments_for_me
				if(dataStore['highlight_comments_for_me'] == 'true' && isLoggedIn()) {
					highlight_comments_for_me.activated();
				}
			
				// show menitoned comment
				if(dataStore['show_mentioned_comments'] == 'true') {
					show_mentioned_comments.activated();
				}
			
		});
	}

};


var show_navigation_buttons = {
	
	activated : function() {
		
		// Create the scrolltop button
		$('<div id="ext_scrolltop">&#9650;</div>').prependTo('body');	
		
		// Add click event to scrolltop button
		$('#ext_scrolltop').click(function() {
			$('body').animate({ scrollTop : 0 }, 1000);
		});

		// Created the back button
		$('<div id="ext_back">&#9664;</div>').prependTo('body');	
		
		// Add event to back button
		$('#ext_back').click(function() {
			if(document.location.href.match('cikkek')) {
				document.location.href = 'index.php';
			} else {
				document.location.href = 'forum.php';
			}
		});
		
		
		if(!document.location.href.match('cikkek') && !document.location.href.match('listazas_msg.php')) {
			
			// Create search button
			$('<div id="ext_search"></div>').prependTo('body');
			
			// Place search overlay arrow
			$('<div id="ext_overlay_search_arrow"></div>').appendTo('body');
			
			// Place search icon background
			$('#ext_search').css('background-image', 'url('+chrome.extension.getURL('/img/content/search.png')+')');
		
			// Create the search event
			$('#ext_search').toggle(
				function() { show_navigation_buttons.showSearch(); },
				function() { show_navigation_buttons.hideSearch(); }	
			);
			
			// Get topic ID
			var id = $('select[name="id"] option:selected').val();
		
			// Determining current status
			var status, title = '';
			var whitelist = new Array();
				whitelist = dataStore['topic_whitelist'].split(',');

				if(whitelist.indexOf(id) == -1) {
					status = '+';
					title = 'Téma hozzáadása a fehérlistához';
				} else {
					status = '-';
					title = 'Téma eltávolítása a fehérlistából';
				}
		
			// Create the whitelist button
			$('<div id="ext_whitelist" title="'+title+'">'+status+'</div>').prependTo('body');
		
			// Create whitelist event
			$('#ext_whitelist').click(function() { 
		
				topic_whitelist.execute(this);
			
			});			
		}
	
		
		// Execute when the user is logged in
		if(isLoggedIn() || document.location.href.match('listazas_msg.php')) {
		
			// Create faves button
			$('<div id="ext_nav_faves"></div>').prependTo('body');
		
			// Place the faves icon
			$('#ext_nav_faves').css('background-image', 'url('+chrome.extension.getURL('/img/content/star.png')+')');
		
			// Place faves opened cotainer
			$('<p id="ext_nav_faves_arrow"></p><div id="ext_nav_faves_wrapper"><div id="ext_show_filtered_faves"></div><div class="ext_faves"></div><div></div></div>').prependTo('body');
		
			// Create faves button event
			$('#ext_nav_faves').toggle(
				function() { show_navigation_buttons.showFaves(); },
				function() { show_navigation_buttons.hideFaves(); }
			);
		}
		
		// Set the button positions
			
			// Gather visible buttons
			var buttons = new Array();
				
				if($('#ext_scrolltop').length) {
					buttons.push('ext_scrolltop');
				}

				if($('#ext_back').length) {
					buttons.push('ext_back');
				}

				if($('#ext_search').length) {
					buttons.push('ext_search');
				}

				if($('#ext_whitelist').length) {
					buttons.push('ext_whitelist');
				}

				if($('#ext_nav_faves').length) {
					buttons.push('ext_nav_faves');
				}
			
			// Reverse the array order for bottom positioning
			if(dataStore['navigation_buttons_position'].match('bottom')) {
				buttons = buttons.reverse();
			}
			
			// Calculate buttons height 
			var height = buttons.length * 36;
			
			// Calculate the top position
			var top = ( $(window).height() / 2 ) - ( height / 2);

			// Iterate over the buttons
			for(c = 0; c < buttons.length; c++) {
				
				if(dataStore['navigation_buttons_position'] == 'lefttop') {
				
					$('#'+buttons[c]).css({ left : 10, right : 'auto', top : 30 + (36*c), bottom : 'auto' });
				}

				if(dataStore['navigation_buttons_position'] == 'leftcenter') {
					
					$('#'+buttons[c]).css({ left : 10, right : 'auto', top : top + (36*c), bottom : 'auto' });
				}

				if(dataStore['navigation_buttons_position'] == 'leftbottom') {
				
					$('#'+buttons[c]).css({ left : 10, right : 'auto', bottom : 30 + (36*c), top : 'auto' });
				}

				if(dataStore['navigation_buttons_position'] == 'righttop') {
				
					$('#'+buttons[c]).css({ right : 10, left : 'auto', top : 50 + (36*c), bottom : 'auto' });
				}

				if(dataStore['navigation_buttons_position'] == 'rightcenter') {
					
					$('#'+buttons[c]).css({ right : 10, left : 'auto', top : top + (36*c), bottom : 'auto' });
				}

				if(dataStore['navigation_buttons_position'] == 'rightbottom') {

					$('#'+buttons[c]).css({ right : 10, left : 'auto', bottom : 30 + (36*c), top : 'auto' });
				}
			}
	},
	
	disabled : function() {
	
		$('#ext_scrolltop').remove();
		$('#ext_back').remove();
		$('#ext_search').remove();
		$('#ext_whitelist').remove();
		$('#ext_nav_faves').remove();
	},
	
	showSearch : function() {
		
		// Clone and append the original search form to body
		var clone = $('.lapozo:last').next().next().clone().appendTo('body');
		
		// Add class
		clone.attr('id', 'ext_overlay_search');
		
		// Set position
		show_navigation_buttons.findArrowPosition( $('#ext_overlay_search_arrow'), $('#ext_search') );
		show_navigation_buttons.findPosition( $('#ext_overlay_search'), $('#ext_search') );
		
		// Show the elements
		$('#ext_overlay_search_arrow').show();
		$('#ext_overlay_search').show();
	},
	
	hideSearch : function() {
		$('#ext_overlay_search').remove();
		$('#ext_overlay_search_arrow').hide();
	},
	
	showFaves : function() {
		
		$.ajax({
			url : 'ajax/kedvencdb.php',
			mimeType : 'text/html;charset=utf-8',
			success : function(data) {
						
				// Write data into wrapper
				$('#ext_nav_faves_wrapper div:last-child').html(data);
				
				if(dataStore['jump_unreaded_messages'] == 'true') {
					jump_unreaded_messages.activated();
				}
					
				// Hide topics that doesnt have unreaded messages
				fav_show_only_unreaded.activated();
						
				// Faves: short comment marker
				if(dataStore['short_comment_marker'] == 'true' ) {
					short_comment_marker.activated();
				}
				
				// Set position
				show_navigation_buttons.findArrowPosition( $('#ext_nav_faves_arrow'), $('#ext_nav_faves') );
				show_navigation_buttons.findPosition( $('#ext_nav_faves_wrapper'), $('#ext_nav_faves') );
					
				// Show the container
				$('#ext_nav_faves_wrapper').show();
				$('#ext_nav_faves_arrow').show();
			}
		});
	},
	
	hideFaves : function() {
		$('#ext_nav_faves_wrapper').hide();
		$('#ext_nav_faves_arrow').hide();
	},
	
	findArrowPosition : function(ele, target) {

		
		// Top
		if(dataStore['navigation_buttons_position'].match('bottom')) {
			var vPos = parseInt($(target).css('bottom').replace('px', '')) + $(target).height() / 2- $(ele).outerHeight() / 2;
		} else {
			var vPos = parseInt($(target).css('top').replace('px', '')) + $(target).height() / 2- $(ele).outerHeight() / 2;
		}
		
		// Left
		if(dataStore['navigation_buttons_position'].match('left')) {
			
			if(dataStore['navigation_buttons_position'].match('bottom')) {
				$(ele).css({ 'border-color' : 'transparent #c0c0c0 transparent transparent', top : 'auto', bottom : vPos, left : 30, right : 'auto' });
			} else {
				$(ele).css({ 'border-color' : 'transparent #c0c0c0 transparent transparent', top : vPos, bottom : 'auto', left : 30, right : 'auto' });
			}
		// Right
		} else {
			if(dataStore['navigation_buttons_position'].match('bottom')) {
				$(ele).css({ 'border-color' : 'transparent transparent transparent #c0c0c0', top : 'auto', bottom : vPos, left : 'auto', right : 30 });
			} else {
				$(ele).css({ 'border-color' : 'transparent transparent transparent #c0c0c0', top : vPos, bottom : 'auto', left : 'auto', right : 30 });
			}
		}
	},
	
	findPosition : function(ele, target) {

		
		if(dataStore['navigation_buttons_position'] == 'lefttop') {
			
			var top = parseInt($(target).css('top').replace('px', '')) - 15;

			$(ele).css({ left : 50, right : 'auto', top : top, bottom : 'auto' });
		}

		if(dataStore['navigation_buttons_position'] == 'leftcenter') {
			
			var top = parseInt($(target).css('top').replace('px', '')) + $(target).height() / 2- $(ele).outerHeight() / 2;
			
			$(ele).css({ left : 50, right : 'auto', top : top, bottom : 'auto' });
		}

		if(dataStore['navigation_buttons_position'] == 'leftbottom') {
			
			var bottom = parseInt($(target).css('bottom').replace('px', '')) - 15;
			
			$(ele).css({ left : 50, right : 'auto', top : 'auto', bottom : bottom });
		}

		if(dataStore['navigation_buttons_position'] == 'righttop') {
			
			var top = parseInt($(target).css('top').replace('px', '')) - 15;

			$(ele).css({ left : 'auto', right : 50, top : top, bottom : 'auto' });
		}

		if(dataStore['navigation_buttons_position'] == 'rightcenter') {
			
			var top = parseInt($(target).css('top').replace('px', '')) + $(target).height() / 2- $(ele).outerHeight() / 2;
			
			$(ele).css({ left : 'auto', right : 50, top : top, bottom : 'auto' });
		}

		if(dataStore['navigation_buttons_position'] == 'rightbottom') {
			
			var bottom = parseInt($(target).css('bottom').replace('px', '')) - 15;
			
			$(ele).css({ left : 'auto', right : 50, top : 'auto', bottom : bottom });
		}
	} 
};


var update_fave_list = {

	activated : function() {

		// Disable site's built-in auto-update by remove "fkedvenc" ID
		$('#fkedvenc').removeAttr('id');
		
		// Create refhref button
		$('.ext_faves').append('<div id="ext_refresh_faves"></div>');

		// Move the button away if unreaded faves is on
		if(dataStore['fav_show_only_unreaded'] == 'true' && isLoggedIn() ) {
			$('#ext_refresh_faves').css('right', 18);
		}

		// Set refresh image
		$('<img src="'+chrome.extension.getURL('/img/content/refresh.png')+'">').appendTo('#ext_refresh_faves');
		
		// Add click event
		$('#ext_refresh_faves').click(function() {
			update_fave_list.refresh();
		});
		
		// Set up auto-update
		setInterval(function() {
			update_fave_list.refresh();
		}, 30000);
	},
	
	refresh : function() {
		
		// Set 'in progress' icon
		$('#ext_refresh_faves img').attr('src', chrome.extension.getURL('/img/content/refresh_waiting.png') );	
		
		$.ajax({
			url : 'ajax/kedvencdb.php',
			mimeType : 'text/html;charset=utf-8',
			success : function(data) {

				// Set 'completed' icon
				$('#ext_refresh_faves img').attr('src', chrome.extension.getURL('/img/content/refresh_done.png') );
				
				// Set back the normal icon in 1 sec
				setTimeout(function() {
					$('#ext_refresh_faves img').attr('src', chrome.extension.getURL('/img/content/refresh.png') );
				}, 2000);
				
				// Append new fave list
				$('.ext_faves:first').next().html(data);
				
				// Faves: show only with unreaded messages
				if(dataStore['fav_show_only_unreaded'] == 'true' && isLoggedIn() ) {
					fav_show_only_unreaded.activated();
				}

				// Faves: short comment marker
				if(dataStore['short_comment_marker'] == 'true' && isLoggedIn() ) {
					short_comment_marker.activated();
				}

				// Custom list styles
				if(dataStore['highlight_forum_categories'] == 'true') {
					highlight_forum_categories.activated();
				}

				// Jump the last unreaded message
				if(dataStore['jump_unreaded_messages'] == 'true' && isLoggedIn() ) {
					jump_unreaded_messages.activated();
				}
			}
		});
	}
};



var make_read_all_faves = {
	
	activated : function() {

		// Create the 'read them all' button
		$('.ext_faves').append('<div id="ext_read_faves"><div>');

		// Move the button away if unreaded faves is on
		if(dataStore['fav_show_only_unreaded'] == 'true' && isLoggedIn() ) {
			$('#ext_read_faves').css('right', 36);
		}

		// Append the image
		$('<img src="'+chrome.extension.getURL('/img/content/makereaded.png">')+'').appendTo('#ext_read_faves');
		
		// Add click event
		$('#ext_read_faves').click(function() {
			make_read_all_faves.makeread();
		});
	},
	
	makeread : function() {
		
		if(confirm('Biztos olvasottnak jelölöd az összes kedvenced?')) {
			
			// Set 'in progress' icon
			$('#ext_read_faves img').attr('src', chrome.extension.getURL('/img/content/makereaded_waiting.png') );
			
			var count = 0;
			var counter = 0;
			
			// Get unreaded topics count
			$('.ext_faves').next().find('div a').each(function() {
				
				// Dont bother the forum categories
				if( $(this).parent().is('.std0') ) {
					return true;
				}
				
				// Also dont bother readed topics
				if( $(this).find('font').length == 0) {
					return true;
				}
				
				count++;
			});
			
			// Iterate over all faves
			$('.ext_faves').next().find('div a').each(function() {
				
				// Dont bother the forum categories
				if( $(this).parent().is('.std0') ) {
					return true;
				}
				
				// Also dont bother readed topics
				if( $(this).find('font').length == 0) {
					return true;
				}
				
				var ele = $(this);
				
				// Make an ajax query to refresh last readed time
				$.get( $(this).attr('href'), function() {
					
					$(ele).find('font').remove();
					$(ele).find('.ext_short_comment_marker').remove();
					
					if(dataStore['fav_show_only_unreaded'] == 'true' && fav_show_only_unreaded.opened == false) {
						$(ele).parent().addClass('ext_hidden_fave');
					}
					
					counter++;
				});
			});
			
			var interval = setInterval(function() {
				
				if(count == counter) {
					
					// Set 'completed' icon
					$('#ext_read_faves img').attr('src', chrome.extension.getURL('/img/content/makereaded_done.png') );
			
					// Set normal icon
					setTimeout(function() {
						$('#ext_read_faves img').attr('src', chrome.extension.getURL('/img/content/makereaded.png') );
					}, 2000);
					
					// Faves: show only with unreaded messages
					if(dataStore['fav_show_only_unreaded'] == 'true' && isLoggedIn() ) {
						fav_show_only_unreaded.activated();
					}

					// Reset faves newmsg vars
					if(dataStore['jump_unreaded_messages'] == 'true' && isLoggedIn() ) {
						jump_unreaded_messages.activated();
					}

					clearInterval(interval);
				}
				
			}, 100);
			
		}
	
	}
};


function replyTo() {
	$('.msg-replyto a').live('click', function(e) {
	
		// Prevent default submisson
		e.preventDefault();
		
		// Get original link params
		var _params = $(this).attr('href').split(':');
		
		// Run replacement funciton
		eval('ext_'+_params[1]+'');
	});
}


function ext_valaszmsg(target, id, no, callerid) {
	
	if ($('#'+target).css('display') != 'block') {

		if(document.location.href.match('cikkek')) {
			var url = '/listazas_egy.php3?callerid=1&id=' + id + '&no=' + no;
		} else {
			var url = '/listazas_egy.php3?callerid=2&id=' + id + '&no=' + no;
		}

		$.get(url, function(data) { 

			// Show the comment
			$('#'+target).html(data).hide().slideDown();

			// Maintain style settings
			if(document.location.href.match('cikkek')) {
				$('#'+target).find('.b-h-o-head a').closest('.b-h-o-head').attr('class', 'b-h-o-head topichead');
				$('#'+target).find('.b-h-o-head').css('background', 'url(images/ful_o_bgbg.gif)');
				$('#'+target).find('.b-h-o-head .msg-dateicon a').css('color', '#444');
			}

			// show menitoned comment
			if(dataStore['show_mentioned_comments'] == 'true') {
				show_mentioned_comments.activated();
			}

			// Set-up block buttons
			blocklist.init();
		});
	}
	else { $('#'+target).slideUp(); }
}

var overlay_reply_to = {
	
	opened : false,
	
	activated : function() {
	
		// Change tabindexes for suit the overlay textarea
		$('textarea:first').attr('tabindex', '3');
		$('textarea:first').closest('div').find('a:last').attr('tabindex', '4');
		
		// Change the behavior the replyto button
		$('.topichead a:contains("válasz")').live('click', function(e) {
			
			// Prevent default submission
			e.preventDefault();

			// Get ref msg ID and comment element
			var msgno = $(this).attr('href').match(/\d+/g);
			var entry = $(this).closest('center');

			// Call show method
			overlay_reply_to.show(entry, msgno);
		});
	},
	
	disabled : function() {
	
		$('.topichead a:contains("válasz")').die('click');
	
	},
	
	show : function(comment, msgno) {

		// Return when the user is not logged in
		if(!isLoggedIn()) { alert('Nem vagy bejelentkezve!'); return; }
		
		// Prevent multiple instances
		if(overlay_reply_to.opened) {
			return false;
		
		// Set opened status
		} else {
			overlay_reply_to.opened = true;
		}
		
		// Create the hidden layer
		$('<div class="ext_hidden_layer"></div>').prependTo('body').hide().fadeTo(300, 0.9);
		
		// Highlight the reply comment
		var comment_clone = $(comment).clone().prependTo('body').addClass('ext_highlighted_comment');
		
		// Maintain comment clone positions
		comment_clone.css({ 'left' : comment.children('table:first').offset().left, 'top' : comment.children('table:first').offset().top });
		
		// Remove threaded view padding and border
		comment_clone.css({ margin : 0 , padding : 0, border : 0 });
		
		// Remove 'msg for me' indicator
		comment_clone.find('.ext_comments_for_me_indicator').remove();
		
		// Remove sub-center tags
		comment_clone.find('center').remove();
		
		// Remove quoted subcomments
		comment_clone.find('center').parent('div').remove();
		
		if(document.location.href.match('cikkek')) {
			comment_clone.css('width', 700);
		}
		
		// Create textarea clone
		
		// WYSIWYG editor
		if(dataStore['wysiwyg_editor'] == 'true') {
			
			if(document.location.href.match('cikkek')) {
			
				var textarea_clone = $('<div class="ext_clone_textarea"></div>').prependTo('body');
				$('form[name="newmessage"]').clone(true, true).prependTo('.ext_clone_textarea:first');

				// Add 'article' class to the clone
				textarea_clone.addClass('article');
					
				// Remove username line
				textarea_clone.find('b').remove();
					
				// Maintain style settings 
				textarea_clone.find('div:first').removeAttr('id');
				
				// Remove div padding
				textarea_clone.find('form div div').css('padding', 0);

			} else {
				var textarea_clone = $('form[name="newmessage"]').closest('div').clone(true, true).prependTo('body').addClass('ext_clone_textarea');
		
				// Add 'article' class to the clone
				textarea_clone.addClass('topic');
				
				// Remove username
				textarea_clone.find('.std1').remove();
				
				// Remove div padding
				textarea_clone.find('form div:eq(0)').css('padding', 0);
			}
			
			textarea_clone.find('.cleditorMain').remove();
			textarea_clone.find('form div:eq(0)').append('<textarea cols="50" rows="10" name="message"></textarea>');

			// Copy textarea original comment to the tmp element
			textarea_clone.find('textarea').val( $('form[name=newmessage]:gt(0) textarea').val() );

				
			// Apply some styles
			textarea_clone.css({'background' : 'none', 'border' : 'none' });
				
				
			// Fix buttons
			textarea_clone.find('a:eq(0)').css({ position : 'absolute', top : 220, left : 0 });
			textarea_clone.find('a:eq(1)').css({ position : 'absolute', top : 220, left : 90, visibility : 'visible' });
			textarea_clone.find('a:eq(2)').css({ display: 'none' });
			textarea_clone.find('a:eq(3)').css({ display: 'none' });
			textarea_clone.find('a:eq(4)').css({ position : 'absolute', top : 220, left : 180 });
			textarea_clone.find('a:eq(5)').css({ position : 'absolute', top : 220, left : 270, right : 'auto' });
			textarea_clone.find('a:eq(6)').css({ position : 'absolute', top : 220, right : 0 });
				
			// Fix smile list
			if(document.location.href.match('cikkek')) {
				textarea_clone.find('#ext_smiles').css({ 'padding-left' : 50, 'padding-right' : 50, 'margin-top' : 20 });
			} else {
				textarea_clone.find('#ext_smiles').css({ 'padding-left' : 100, 'padding-right' : 100, 'margin-top' : 15 });
			}
			textarea_clone.find('.ext_smiles_block h3').css('color', 'black');
			
			// CLEditor init
			if(document.location.href.match('cikkek')) {
				$(".ext_clone_textarea textarea").cleditor({ width : 696, height: 200 })[0].focus();
				textarea_clone.find('.cleditorMain').css({ position : 'relative', top : -10 });
			} else {
				$(".ext_clone_textarea textarea").cleditor({ width : 800 })[0].focus();
			}

		
		// Normal textarea
		} else {
		
				
			if(document.location.href.match('cikkek')) {

				var textarea_clone = $('<div class="ext_clone_textarea"></div>').prependTo('body');
				$('form[name="newmessage"]').clone(true, true).prependTo('.ext_clone_textarea:first');


				// Add 'article' class to the clone
				textarea_clone.addClass('article');
					
				// Remove username line
				textarea_clone.find('b').remove();
					
				// Maintain style settings 
				textarea_clone.find('div:first').removeAttr('id');

				// Create a container element around the textarea for box-shadow
				$('<div id="ext_clone_textarea_shadow"></div>').insertAfter(textarea_clone.find('textarea'));
				
				// Put textarea the container
				textarea_clone.find('textarea').appendTo('#ext_clone_textarea_shadow');
									
			} else {
	
				var textarea_clone = $('form[name="newmessage"] textarea').closest('div').clone(true, true).prependTo('body').addClass('ext_clone_textarea');

				// Add 'topic' class to the clone
				textarea_clone.addClass('topic');
					
				// Remove username line
				textarea_clone.find('.std1').remove();
			
				// Create a container element around the textarea for box-shadow
				$('<div id="ext_clone_textarea_shadow"></div>').insertAfter(textarea_clone.find('textarea'));
				
				// Put textarea the container
				textarea_clone.find('textarea').appendTo('#ext_clone_textarea_shadow');		
			}
		
			// Copy textarea original comment to the tmp element
			textarea_clone.find('textarea').val( $('form[name=newmessage]:gt(0) textarea').val() );
				
			// Fix buttons
			textarea_clone.find('a:eq(0)').css({ position : 'absolute',  left : 0 });
			textarea_clone.find('a:eq(1)').css({ position : 'absolute',  left : 90 });
			textarea_clone.find('a:eq(2)').css({ position : 'absolute',  left : 180 });
			textarea_clone.find('a:eq(3)').css({ position : 'absolute',  left : 270 });
			textarea_clone.find('a:eq(4)').css({ position : 'absolute',  left : 360 });
			textarea_clone.find('a:eq(5)').css({ position : 'absolute',  left : 450 });
			textarea_clone.find('a:eq(6)').css({ position : 'absolute',  right : 0 });
		}
		
		// Textarea position
		var top = $(comment_clone).offset().top + $(comment_clone).height();
		
		if(document.location.href.match('cikkek')) {
			var left = $(document).width() / 2 - 350;
		} else {
			var left = $(document).width() / 2 - 405;
		}

			textarea_clone.delay(350).css({ top : top + 200, left : left, opacity : 0 }).animate({ top : top + 10, opacity : 1 }, 300);
			
		// Change textarea name attr to avoid conflicts
		$('form[name=newmessage]:gt(0)').attr('name', 'tmp');
		
		// Set msg no input
		textarea_clone.find('input[name=no_ref]').attr('value', msgno);
		
		// Autoscroll
		var pageBottom	= $(window).scrollTop() + $(window).height();
		var textBottom 	= $('.ext_clone_textarea').offset().top + $('.ext_clone_textarea').height();

		if(textBottom > pageBottom) { 
			var scT = textBottom - $(window).height() + 50;
			$('body').animate( { scrollTop : scT }, 500);
		}

		// Set the right tabindex
		textarea_clone.find('textarea').attr('tabindex', '1');
		textarea_clone.find('a:last').attr('tabindex', '2');

		// Set the textarea focus
		textarea_clone.find('textarea').focus();
		
		// Set the iframe focus
		if(dataStore['wysiwyg_editor'] == 'true') {
			textarea_clone.find('iframe')[0].focus();
		}

		// Block default tab action in non-WYSIWYG editor
		$('body').keydown(function(event) {
			if (event.keyCode == '9') {
    			 event.preventDefault();
    			 textarea_clone.find('a:last').focus();
   			}
		});

		// Block default tab action in a WYSIWYG editor
		if(dataStore['wysiwyg_editor'] == 'true') {
			$(textarea_clone.find('iframe')[0].contentDocument.body).keydown(function(event) {
				if (event.keyCode == '9') {
    				 event.preventDefault();
    				 textarea_clone.find('a:last').focus();
   				}
			});
		}
		
		// Thickbox
		textarea_clone.find('a.thickbox').each(function() {
			
			// Get the title and other stuff
			var t = $(this).attr('title') || $(this).attr('name') || null;
			var g = $(this).attr('rel') || false;
			var h = $(this).attr('href');
			
			$(this).attr('href', 'javascript:TB_show(\''+t+'\',\''+h+'\','+g+');');
			
			$(this).blur();
		});
	
		
		// Add close button
		var close_btm = $('<img src="'+chrome.extension.getURL('img/content/overlay_close.png')+'" id="ext_close_overlay">').prependTo(textarea_clone).addClass('ext_overlay_close');

		// Change close button position if WYSIWYG editor is disabled
		if(dataStore['wysiwyg_editor'] != true) {
			close_btm.css({ 'right' : 4, 'top' : 9 });
		}

		// Add Close event
		$(close_btm).click(function() {
			$(textarea_clone).fadeTo(100, 0, function() {
				$(this).remove();
				$(comment_clone).fadeTo(100, 0, function() {
					$(this).remove();
					$('.ext_hidden_layer').fadeTo(300, 0, function() {
						$(this).remove();
						$('form[name=tmp]:first').attr('name', 'newmessage');
						
						// Set back opened status
						overlay_reply_to.opened = false;
						
						// Remove keydown event
						$('body').unbind('keydown');
					});
				});
			});
		});
	}
};

var highlight_comments_for_me = {
	
	
	activated : function() {
	
		// Return false when no username set
		if(userName == '') {
			return false;
		}
	
		// Get the proper domnodes
		var comments = $('.msg-replyto a:contains("'+userName+'")').closest('center');
	
		// Iterate over them
		comments.each(function() {
		
			if($(this).find('.ext_comments_for_me_indicator').length == 0) {
			
				$(this).css('position', 'relative').append('<img src="'+chrome.extension.getURL('/img/content/comments_for_me_indicator.png')+'" class="ext_comments_for_me_indicator">');
			
				if(document.location.href.match('cikkek')) {
					$(this).find('.ext_comments_for_me_indicator').addClass('article');
				} else {
					$(this).find('.ext_comments_for_me_indicator').addClass('topic');
				}			
			}
		});
	},
	
	disabled : function() {
	
		$('.ext_comments_for_me_indicator').remove();
	}	
};


var threaded_comments = {
	
	activated : function() {
		// New message counter
		var newMsg = document.location.href.split('&newmsg=')[1];

		// Mark new messages if any
		if(typeof newMsg != "undefined" && newMsg != '') {
			$('.topichead:lt('+newMsg+')').find('a:last').after( $('<span class="thread_sep"> | </span> <span class="ext_new_comment" style="color: red;">ÚJ</span>') );
		}
	
		// Set prev and next button if any new messages
		if(newMsg > 0) {
			
			$('<span class="thread_prev">&laquo;</span>').insertBefore( $('.ext_new_comment') );
			$('<span class="thread_next">&raquo;</span>').insertAfter( $('.ext_new_comment') );
			
			// Bind events
			$('.thread_prev').live('click', function() {
				threaded_comments.prev(this);
			});

			$('.thread_next').live('click', function() {
				threaded_comments.next(this);
			});
		}
		
		// Sort comments to thread
		threaded_comments.sort();
	},


	prev : function(ele) {
		
		// Get the index value of the current element
		var index = $(ele).index('.thread_prev');
		
		// Check if is it the first element
		if(index == 0) {
			return false;
		}
		
		var target = $('.ext_new_comment').eq((index-1)).closest('center').children('table');
		
		// Target offsets
		var windowHalf = $(window).height() / 2;
		var targetHalf = $(target).outerHeight() / 2;
		var targetTop = $(target).offset().top;
		var targetOffset = targetTop - (windowHalf - targetHalf);
		
		// Scroll to target element
		$('body').animate({ scrollTop : targetOffset}, 500);
	},
	
	next : function(ele) {
		
		// Get the index value of the current element
		var index = $(ele).index('.thread_next');
		
		// Check if is it the last element
		if(index+1 >= $('.ext_new_comment').length) {
			return false;
		}
		
		var target = $('.ext_new_comment').eq((index+1)).closest('center').children('table');

		// Target offsets
		var windowHalf = $(window).height() / 2;
		var targetHalf = $(target).outerHeight() / 2;
		var targetTop = $(target).offset().top;
		var targetOffset = targetTop - (windowHalf - targetHalf);
		
		// Scroll to target element
		$('body').animate({ scrollTop : targetOffset}, 500);
	},
	
	sort : function() {

		// Sort to thread
		$( $('.topichead:not(.checked)').closest('center').get().reverse() ).each(function() {
		
			// Check if theres an answered message
			if($(this).find('.msg-replyto a').length == 0) {
			
				// Add checked class
				$(this).find('.topichead:first').addClass('checked');
				
				// Return 'true'
				return true;
			}
		
			// Get answered comment numer
			var commentNum = $(this).find('.msg-replyto a').html().split('#')[1].match(/\d+/g);
			
			
			// Seach for parent node via comment number
			$( $(this) ).appendTo( $('.topichead a:contains("#'+commentNum+'"):last').closest('center') );
		
			// Set style settings
			if(document.location.href.match('cikkek')) {
				$(this).css({ 'margin-left' : 0, 'padding-left' : 30, 'border-left' : '1px solid #ddd' });
				$(this).find('.topichead').parent().css('width', 700 - $(this).parents('center').length * 30);
				$(this).find('.msg-replyto').hide();
			} else {
				$(this).css({ 'margin-left' : 15, 'padding-left' : 15, 'border-left' : '1px solid #ddd' });
				$(this).find('.topichead').parent().css('width', 810 - ($(this).parents('center').length-2) * 30);
				$(this).find('.msg-replyto').hide();			
			}
			
			// Add checked class
			$(this).find('.topichead:first').addClass('checked');

		});
	}
};


var fetch_new_comments_in_topic = {
	
	counter : 0,
	last_new_msg : 0,
	locked : false,
	
	init : function() {
		
		if($('#ujhszjott').length == 0) {
			return false;
		}
		
		// Set new messages number to zero
		$('#ujhszjott a').html('0 új hozzászólás érkezett!');
		
		// Hide the notification when fetch new comments settgngs is enabled
		if(dataStore['fetch_new_comments'] == 'true') {
			$('#ujhszjott').css({ display : 'none !important', visibility : 'hidden', height : 0, margin : 0, padding : 0, border : 0 });
		}
		
		// Monitor new comments nofification 
		setInterval(function(){
			
			// Get new comments counter
			var newmsg = parseInt($('#ujhszjott a').text().match(/\d+/g));
			
			if(newmsg > fetch_new_comments_in_topic.last_new_msg && fetch_new_comments_in_topic.locked == false) {
				
				// Rewrite the notification url
				fetch_new_comments_in_topic.rewrite();
				
				// Fetch the comments if this option is enabled
				// Set locked status to prevent multiple requests
				if(dataStore['fetch_new_comments'] == 'true') {
					fetch_new_comments_in_topic.locked = true;
					fetch_new_comments_in_topic.fetch();
				}
			}
		}, 1000);
	},
	
	rewrite : function() {
	
		var topic_url = $('#ujhszjott a').attr('href').substring(0, 27);
		var comment_c = $('#ujhszjott a').text().match(/\d+/g);
			
		$('#ujhszjott a').attr('href',  topic_url + '&newmsg=' + comment_c);
	},
	
	fetch : function() {
		
		// Check the page number
		var page = parseInt($('.lapozo:last span.current:first').html());
		
		// Do nothing if we not in the first page
		if(page != 1) {
			return false;
		}
		
		// Get new comments counter
		var newmsg = parseInt($('#ujhszjott a').text().match(/\d+/g));
		
		// Update the newmsg
		var new_comments = newmsg - fetch_new_comments_in_topic.last_new_msg;
		
		// Update the last new msg number
		fetch_new_comments_in_topic.last_new_msg = newmsg;
		
		// Get the topik ID and URL
		var id = $('select[name="id"] option:selected').val();
		var url = 'listazas.php3?id=' + id;
		
		// Get topic contents
		$.ajax({
			url : url,
			mimeType : 'text/html;charset=iso-8859-2',
			success : function(data) {
				
				// Increase the counter
				fetch_new_comments_in_topic.counter++;
				
				// Append horizonal line
				if(fetch_new_comments_in_topic.counter == 1) {
					$('<hr>').insertAfter( $('.std1:first').parent() ).addClass('ext_unreaded_hr');
				}
				
				// Parse the content
				var tmp = $(data);
				
				// Fetch new comments
				var comments = $(tmp).find('.topichead:lt('+new_comments+')').closest('center');

				// Append new comments
				$(comments.get().reverse()).each(function() {
					$(this).insertAfter( $('.std1:first').parent() );
				});
				
				// Remove locked status
				fetch_new_comments_in_topic.locked = false;

				// Reinit settings

					// Set-up block buttons
					blocklist.init();

					// highlight_comments_for_me
					if(dataStore['highlight_comments_for_me'] == 'true' && isLoggedIn()) {
						highlight_comments_for_me.activated();
					}
				
					// show menitoned comment
					if(dataStore['show_mentioned_comments'] == 'true') {
						show_mentioned_comments.activated();
					}
			}
		});
	}
};



var show_mentioned_comments = {

	activated : function() {
		
		$('.maskwindow:not(.checked),.msg-text').each(function() {
			
			// Filter out duplicates
			if( $(this).parent().is('.maskwindow') ) {
				return true;
			}

			// Search and replace mentioned comment numbers
			if( $(this).html().match(/\#\d+/g) ){
				if( $(this).html().match(/<a[^>]+>\#\d+<\/a>/g) && dataStore['show_mentioned_comments_in_links'] == 'true' ) {
					var replaced = $(this).html().replace(/<a[^>]+>(\#\d+)<\/a>/g, "<span class=\"ext_mentioned\">$1</span>");
				} else if( !$(this).html().match(/<.*\#\d+.*>/g) ) {
					var replaced = $(this).html().replace(/(\#\d+)/g, "<span class=\"ext_mentioned\">$1</span>");					
				}
				
				// Change the text in the original comment
				$(this).html(replaced);
			}
			
			// Change the text in the original comment
			$(this).html(replaced);
			
			// Add a special class to not run again this comment
			$(this).addClass('checked');

			// Remove links from signature
			if($(this).find('.msg-copyright').length > 0) {
				$(this).find('.msg-copyright').html( $(this).find('.msg-copyright').html().replace(/<span class="ext_mentioned">(.*?)<\/span>/,"$1") );
			}
		});
		
		// Attach click events
		$('.ext_mentioned').unbind('click').click(function(e) {
		
			// Prevent browser default submission
			e.preventDefault();
			
			// Call the show method
			show_mentioned_comments.show(this);
		});
	},
	
	show : function(ele) {
		
		// Get comment number
		var no = $(ele).html().match(/\d+/g);
		
		if(document.location.href.match('cikkek')) {
		
			var id = $('.std2 a').attr('href').split('?id=')[1];
		
		} else {
	
			// Get topic ID
			var id = document.location.href.split('?id=')[1];
				id = id.split('#')[0];
				id = id.split('&')[0];
		}
		
		var target = $(ele).closest('.msg-text').next().next().attr('id');
		
		if(document.location.href.match('cikkek')) {
			eval("ext_valaszmsg('"+target+"', "+id+", "+no+", 1);");
		} else {
			eval("ext_valaszmsg('"+target+"', "+id+", "+no+", 2);");
		}
	}
};


var custom_blocks = {
	
	activated : function() {
	
		// Set blocks IDs
		custom_blocks.setIDs();
		
		// Check localStorage for config
		if( typeof dataStore['blocks_config'] == 'undefined' || dataStore['blocks_config'] == '') {
			custom_blocks.buildConfig();
		}
		
		// Execute config
		custom_blocks.executeConfig();

		
		// Set overlays
		if(dataStore['hide_blocks_buttons'] == 'false' || typeof dataStore['hide_blocks_buttons'] == 'undefined') {
			custom_blocks.setOverlay();
		}
	
	},
	
	disabled : function() {
	
		$('.ext_blocks_buttons').remove();
	},
	
	setIDs : function() {
		
		// Blocks counter
		var counter = 1;
		
		// Left side blocks
		$('#ext_left_sidebar .b-h-o-head, #ext_right_sidebar .b-h-b-head').parent().each(function() {
			
			// Set the ID
			$(this).attr('class', 'ext_block').attr('id', 'block-'+counter);
			
			// Increase the counter
			counter++;
		});
	},
	
	buildConfig : function() {
		
		// Var for config
		var config = [];
		
		// Iterate over the blocks
		$('.ext_block').each(function(index) {
			
			var tmp = {
				
				id 			: $(this).attr('id'),
				visibility	: true,
				contentHide	: false,
				side		: $(this).find('.b-h-o-head').length > 0 ? 'left' : 'right',
				index 		: index
			};
			
			config.push(tmp);
			
		});


		// Store in localStorage
		port.postMessage({ name : "setBlocksConfig", message : JSON.stringify(config) });
		
		// Update in dataStore var
		dataStore['blocks_config'] = JSON.stringify(config);
	},
	
	
	setConfigByKey : function(id, key, value) {
		
		var config = JSON.parse(dataStore['blocks_config']);
		
		for(c = 0; c < config.length; c++) {

			if(config[c]['id'] == id) {
				config[c][key] = value;
			}
		}
	
		// Store in localStorage
		port.postMessage({ name : "setBlocksConfig", message : JSON.stringify(config) });
		
		// Update dataStore var
		dataStore['blocks_config'] = JSON.stringify(config);
	},
	
	getConfigValByKey : function(id, key) {
	
		var config = JSON.parse(dataStore['blocks_config']);
		
		for(c = 0; c < config.length; c++) {

			if(config[c]['id'] == id) {
				return config[c][key];
			}
		}
	},
	
	reindexOrderConfig : function() {

		// Var for config
		var config = JSON.parse(dataStore['blocks_config']);
		var _config = [];
		
		// Iterate over the blocks
		$('.ext_block').each(function(index) {
			
			var tmp = {
				
				id 			: $(this).attr('id'),
				visibility	: custom_blocks.getConfigValByKey($(this).attr('id'), 'visibility'),
				contentHide	: custom_blocks.getConfigValByKey($(this).attr('id'), 'contentHide'),
				side		: $(this).find('.b-h-o-head').length > 0 ? 'left' : 'right',
				index 		: index
			};
			
			_config.push(tmp);
			
		});

		
		// Store in localStorage
		port.postMessage({ name : "setBlocksConfig", message : JSON.stringify(_config) });
	},
	
	executeConfig : function() {

		var config = JSON.parse(dataStore['blocks_config']);
			config = config.reverse();
			
		for(c = 0; c < config.length; c++) {

			// Visibility
			if( config[c]['visibility'] == false ) {
				custom_blocks.hide(config[c]['id'], false);
			}

			// ContentHide
			if( config[c]['contentHide'] == true ) {
				custom_blocks.contentHide(config[c]['id'], false);
			}
			
			// Side and pos
			if( config[c]['side'] == 'left' ) {
				
				$('#'+config[c]['id']).prependTo('table:eq(3) td:eq(0)');
				
			} else {
				
				$('#'+config[c]['id']).prependTo('table:eq(3) td:eq(2) table:first tr > td:eq(2)');
			}
		}
		
		// Maintain style settings
		$('#ext_left_sidebar').find('.b-h-b-head').removeClass('b-h-b-head').addClass('b-h-o-head');
		$('#ext_left_sidebar').find('.hasab-head-b').removeClass('hasab-head-b').addClass('hasab-head-o');
		$('#ext_left_sidebar').find('img[src="images/ful_b_l.png"]').attr('src', 'images/ful_o_l.png');

		// Maintain style settings
		$('#ext_right_sidebar').find('.b-h-o-head').removeClass('b-h-o-head').addClass('b-h-b-head');
		$('#ext_right_sidebar').find('.hasab-head-o').removeClass('hasab-head-o').addClass('hasab-head-b');
		$('#ext_right_sidebar').find('img[src="images/ful_o_l.png"]').attr('src', 'images/ful_b_l.png');
		
		
		// Fix welcome block for private messages
		$('.ext_welcome:first').next().find('br').css('display', 'inline');
	
	},
	
	setOverlay : function() {

		$('.ext_block').each(function() {
			
			var item = $('<p class="ext_blocks_buttons"></p>').prependTo(this);

			// Contenthide
			$('<img src="'+chrome.extension.getURL('/img/blocks/minimalize.png')+'" class="ext_block_button_right">').prependTo(item).click(function(e) {
				e.preventDefault();
				custom_blocks.contentHide( $(this).closest('div').attr('id'), true );
			});

			// Hide
			$('<img src="'+chrome.extension.getURL('/img/blocks/close.png')+'" class="ext_block_button_right">').prependTo(item).click(function(e) {
				e.preventDefault();
				custom_blocks.hide( $(this).closest('div').attr('id'), true );
			});
			

			// Down
			$('<img src="'+chrome.extension.getURL('/img/blocks/down.png')+'" class="ext_block_button_left">').prependTo(item).click(function(e) {
				e.preventDefault();
				custom_blocks.down( $(this).closest('div').attr('id'), true );
			});

			// Up
			$('<img src="'+chrome.extension.getURL('/img/blocks/up.png')+'" class="ext_block_button_left">').prependTo(item).click(function(e) {
				e.preventDefault();
				custom_blocks.up( $(this).closest('div').attr('id'), true );
			});						

			// Right
			$('<img src="'+chrome.extension.getURL('/img/blocks/right.png')+'" class="ext_block_button_left">').prependTo(item).click(function(e) {
				e.preventDefault();
				custom_blocks.right( $(this).closest('div').attr('id'), true );
			});			
			// Left
			$('<img src="'+chrome.extension.getURL('/img/blocks/left.png')+'" class="ext_block_button_left">').prependTo(item).click(function(e) {
				e.preventDefault();
				custom_blocks.left( $(this).closest('div').attr('id'), true );
			});

		});
	},
	
	hide : function(id, clicked) {
		
		if(clicked == true) {
			// Change the config
			custom_blocks.setConfigByKey( id, 'visibility', false);
		
			// Hide the item
			$('#'+id).slideUp(200);
		} else {
			$('#'+id).hide();
		}
	},
	
	contentHide : function(id, clicked) {
		
		if(clicked == false) {
			$('#'+id).children('div:eq(1)').hide();
			return true;
		}
		
		if( $('#'+id).children('div:eq(1)').css('display') == 'none' ) {
		
			// Change the config
			custom_blocks.setConfigByKey( id, 'contentHide', false);
		
			// Hide the item
			$('#'+id).children('div:eq(1)').show();
		
		} else {

			// Change the config
			custom_blocks.setConfigByKey( id, 'contentHide', true);
		
			// Hide the item
			$('#'+id).children('div:eq(1)').hide();
		}
	},
	
	left : function(id) {
		
		// Check current side settings
		if($('#'+id).find('.b-h-o-head').length == 0) {
		
			// Move the block
			$('#'+id).prependTo('#ext_left_sidebar');

			// Maintain style settings
			$('#ext_left_sidebar').find('.b-h-b-head').removeClass('b-h-b-head').addClass('b-h-o-head');
			$('#ext_left_sidebar').find('.hasab-head-b').removeClass('hasab-head-b').addClass('hasab-head-o');
			$('#ext_left_sidebar').find('img[src="images/ful_b_l.png"]').attr('src', 'images/ful_o_l.png');
		
			// Store data in localStorage
			custom_blocks.reindexOrderConfig();
		}
	},

	right : function(id) {
		
		// Check current side settings
		if($('#'+id).find('.b-h-b-head').length == 0) {
		
			// Move the block
			$('#'+id).prependTo('#ext_right_sidebar');

			// Maintain style settings
			$('#ext_right_sidebar').find('.b-h-o-head').removeClass('b-h-o-head').addClass('b-h-b-head');
			$('#ext_right_sidebar').find('.hasab-head-o').removeClass('hasab-head-o').addClass('hasab-head-b');
			$('#ext_right_sidebar').find('img[src="images/ful_o_l.png"]').attr('src', 'images/ful_b_l.png');
	
			// Store data in localStorage
			custom_blocks.reindexOrderConfig();
		}
	},
	
	up: function(id) {
		
		// Get index val
		var index = $('#'+id).index('.ext_block');

		// Current position
		if( $('#'+id).closest('#ext_left_sidebar').length > 0 ) {
		
			if(index == 0) {
				return false;
			}
		
		} else {

			var first = $('#ext_left_sidebar .ext_block').length;
			if(index == first) {
				return false;
			}
		}
		
		// Move to target
		$('#'+id).insertBefore('.ext_block:eq('+(index-1)+')');		

		// Store data in localStorage
		custom_blocks.reindexOrderConfig();
	},
	
	down : function(id) {

		// Get index val
		var index = $('#'+id).index('.ext_block');
		
		// Current position
		if( $('#'+id).closest('#ext_left_sidebar').length > 0 ) {
			
			var last = $('#ext_left_sidebar .ext_block').length - 1;
			
			if(last == index) {
				return false;
			}
		}
		
		// Move to target
		$('#'+id).insertAfter('.ext_block:eq('+(index+1)+')');

		// Store data in localStorage
		custom_blocks.reindexOrderConfig();
	}
};

var remove_adds = {

	activated : function() {
		
		// Page top
		$('img[src*="hirdetes.gif"]').parent().remove();
		
		// Home sidebar
		$('.std0:contains("Hirdetés")').parent().css({ display : 'block', width : 122 });
		$('.std0:contains("Hirdetés")').remove();
		
		// Save init time in unix timestamp
		var time = Math.round(new Date().getTime() / 1000)

		// Text ads
		var interval = setInterval(function() {

			var newTime = Math.round(new Date().getTime() / 1000);
			
			if($('.etargetintext').length > 0) {

				$('.etargetintext').each(function() {
					
					$('<span>'+$(this).html()+'</span>').insertAfter(this);
					$(this).remove();
				});

				clearInterval(interval);
			}
			
			// Break the cycle in 5 sec
			if( (time+5) < newTime ) {
				clearInterval(interval);
			}
		}, 500, interval);
		
	},
};

var wysiwyg_editor = {

	activated : function() {
		
		// Rearrange buttons
		if(document.location.href.match('cikkek')) {
		
			// Remove username
			$('form[name="newmessage"] b').remove();		
		
			// CLEditor init
			$('textarea[name="message"]').cleditor({ width: 660 });
		
		} else {

			// CLEditor init
			$('textarea[name="message"]').cleditor();
		}
		
		$('form[name="newmessage"]').css('position', 'relative');
		$('form[name="newmessage"] a:eq(0)').css({ 'position' : 'absolute', 'left' : 20 });
		$('form[name="newmessage"] a:eq(1)').css({ 'position' : 'absolute', 'left' : 110 });
		$('form[name="newmessage"] a:eq(2)').css('visibility', 'hidden');
		$('form[name="newmessage"] a:eq(3)').css('visibility', 'hidden');
		$('form[name="newmessage"] a:eq(4)').css({ 'position' : 'absolute', 'left' : 200 });
		$('form[name="newmessage"] a:eq(5)').css({ 'position' : 'absolute', 'left' : 290 });
		$('form[name="newmessage"] a:eq(6)').css({ 'position' : 'absolute', 'right' : 22 });		

		
		// Insert video
		$('form[name="newmessage"] a:eq(4)').click(function(e) {
			e.preventDefault();

			var thisTitle="";
			
			
			var thisURL = prompt("Add meg a beszúrandó video URL-jét!  (pl.: http://www.youtube.com/watch?v=sUntx0pe_qI)", "http://www.youtube.com/watch?v=sUntx0pe_qI");
				
			if (thisURL && (((thisURL.length>25 && thisURL.substring(0,20) == "http://www.youtu.be/") || (thisURL.length>25 && thisURL.substring(0,16) == "http://youtu.be/") || thisURL.length>25 && thisURL.substring(0,25) == "http://www.youtube.com/v/") || (thisURL.length>31 && thisURL.substring(0,31) == "http://www.youtube.com/watch?v="))) {
					
				var maxurlhossz = thisURL.search("&");
					
				if (maxurlhossz === -1) {
						maxurlhossz = 2000; 
				}
                
				kezdhossz=31;
					
				if (thisURL.substring(0,25)=="http://www.youtube.com/v/") {
					kezdhossz=25;
					
				} else if (thisURL.substring(0,16)=="http://youtu.be/") {
					kezdhossz=16;
					
				} else if (thisURL.substring(0,20)=="http://www.youtu.be/") {
					kezdhossz=20;
				}
              	
				var videocode = "[flash]http://www.youtube.com/v/"+thisURL.substring(kezdhossz,maxurlhossz)+"&fs=1&rel=0&color1=0x4E7AAB&color2=0x4E7AAB[/flash]";
				
				var imod = $(".cleditorMain:first iframe").contents().find('body').html() + videocode;
				$('.cleditorMain:first iframe').contents().find('body').html(imod);
			}

		});
		
		// Create smiles container
		$('<div id="ext_smiles"></div>').appendTo('form[name="newmessage"]');
		
		// Add click event to show or hide smile list
		$('form[name="newmessage"] a:eq(0)').toggle(
			function(e) {
				e.preventDefault();
				$('#ext_smiles').slideDown();
			},
			
			function(e) {
				e.preventDefault();
				$('#ext_smiles').slideUp();
			}
		);
		
		var html = '';
		
		html += '<div class="ext_smiles_block left">';
			html += '<h3>Vidám</h3>';
			html += '<img src="/kep/faces/vigyor4.gif" alt=""> ';
			html += '<img src="/kep/faces/pias.gif" alt=""> ';
			html += '<img src="/kep/faces/nevetes1.gif" alt=""> ';
			html += '<img src="/kep/faces/eplus2.gif" alt=""> ';
			html += '<img src="/kep/faces/finom.gif" alt=""> ';
			html += '<img src="/kep/faces/vigyor2.gif" alt=""> ';
			html += '<img src="/kep/faces/vigyor5.gif" alt=""> ';
			html += '<img src="/kep/faces/bohoc.gif" alt=""> ';
			html += '<img src="/kep/faces/bee1.gif" alt=""> ';
			html += '<img src="/kep/faces/nyes.gif" alt=""> ';
			html += '<img src="/kep/faces/lookaround.gif" alt=""> ';
			html += '<img src="/kep/faces/buck.gif" alt=""> ';
			html += '<img src="/kep/faces/crazya.gif" alt=""> ';
			html += '<img src="/kep/faces/hawaii.gif" alt=""> ';
			html += '<img src="/kep/faces/vigyor.gif" alt=""> ';
			html += '<img src="/kep/faces/hehe.gif" alt=""> ';
			html += '<img src="/kep/faces/smile.gif" alt=""> ';
			html += '<img src="/kep/faces/nevetes2.gif" alt=""> ';
			html += '<img src="/kep/faces/email.gif" alt=""> ';
			html += '<img src="/kep/faces/vigyor0.gif" alt=""> ';
			html += '<img src="/kep/faces/vigyor3.gif" alt=""> ';
		html += '</div>';
		
		html += '<div class="ext_smiles_block right">';
			html += '<h3>Szomorú</h3>';
			html += '<img src="/kep/faces/szomoru2.gif" alt=""> ';
			html += '<img src="/kep/faces/shakehead.gif" alt=""> ';
			html += '<img src="/kep/faces/duma.gif" alt=""> ';
			html += '<img src="/kep/faces/rinya.gif" alt=""> ';
			html += '<img src="/kep/faces/sniffles.gif" alt=""> ';
			html += '<img src="/kep/faces/szomoru1.gif" alt=""> ';
			html += '<img src="/kep/faces/sir.gif" alt=""> ';
		html += '</div>';
		
		html += '<div class="ext_smiles_block left">';
			html += '<h3>Egyetért</h3>';
			html += '<img src="/kep/faces/eljen.gif" alt=""> ';
			html += '<img src="/kep/faces/kacsint.gif" alt=""> ';
			html += '<img src="/kep/faces/taps.gif" alt=""> ';
			html += '<img src="/kep/faces/papakacsint.gif" alt=""> ';
			html += '<img src="/kep/faces/wave.gif" alt=""> ';
			html += '<img src="/kep/faces/worship.gif" alt=""> ';
			html += '<img src="/kep/faces/wink.gif" alt=""> ';
			html += '<img src="/kep/faces/awink.gif" alt=""> ';

		html += '</div>';

		html += '<div class="ext_smiles_block right">';
			html += '<h3>Ellenez</h3>';
			html += '<img src="/kep/faces/levele.gif" alt=""> ';
			html += '<img src="/kep/faces/gonosz3.gif" alt=""> ';
			html += '<img src="/kep/faces/action.gif" alt=""> ';
			html += '<img src="/kep/faces/falbav.gif" alt=""> ';
			html += '<img src="/kep/faces/ejnye1.gif" alt=""> ';
			html += '<img src="/kep/faces/unalmas.gif" alt=""> ';
			html += '<img src="/kep/faces/schmoll2.gif" alt=""> ';
			html += '<img src="/kep/faces/nezze.gif" alt=""> ';
			html += '<img src="/kep/faces/kuss.gif" alt=""> ';
	


		html += '</div>';

		html += '<div class="ext_smiles_block left">';
			html += '<h3>Szeretet</h3>';
			html += '<img src="/kep/faces/hamm.gif" alt=""> ';
			html += '<img src="/kep/faces/puszi.gif" alt=""> ';
			html += '<img src="/kep/faces/puszis.gif" alt=""> ';
			html += '<img src="/kep/faces/law.gif" alt=""> ';
			html += '<img src="/kep/faces/szeret.gif" alt=""> ';
			html += '<img src="/kep/faces/love11.gif" alt=""> ';
			html += '<img src="/kep/faces/love12.gif" alt=""> ';
		html += '</div>';

		html += '<div class="ext_smiles_block right">';
			html += '<h3>Utálat</h3>';
			html += '<img src="/kep/faces/mf1.gif" alt=""> ';
			html += '<img src="/kep/faces/kocsog.gif" alt=""> ';
			html += '<img src="/kep/faces/duhos2.gif" alt=""> ';
			html += '<img src="/kep/faces/lama.gif" alt=""> ';
			html += '<img src="/kep/faces/banplz.gif" alt=""> ';
			html += '<img src="/kep/faces/violent.gif" alt=""> ';
			html += '<img src="/kep/faces/gunyos1.gif" alt=""> ';
			html += '<img src="/kep/faces/boxer.gif" alt=""> ';
			html += '<img src="/kep/faces/mf2.gif" alt=""> ';
			html += '<img src="/kep/faces/gun.gif" alt=""> ';
		html += '</div>';

		html += '<div class="ext_smiles_block left">';
			html += '<h3>Csodálkozik</h3>';
			html += '<img src="/kep/faces/csodalk.gif" alt=""> ';
			html += '<img src="/kep/faces/wow1.gif" alt=""> ';
			html += '<img src="/kep/faces/conf.gif" alt=""> ';
			html += '<img src="/kep/faces/rolleyes.gif" alt=""> ';
			html += '<img src="/kep/faces/whatever.gif" alt=""> ';
			html += '<img src="/kep/faces/zavart1.gif" alt=""> ';
			html += '<img src="/kep/faces/confused.gif" alt=""> ';
			html += '<img src="/kep/faces/zavart2.gif" alt=""> ';
			html += '<img src="/kep/faces/fejvakaras.gif" alt=""> ';
			html += '<img src="/kep/faces/pardon1.gif" alt=""> ';
			html += '<img src="/kep/faces/circling.gif" alt=""> ';
			html += '<img src="/kep/faces/ijedt.gif" alt=""> ';
			html += '<img src="/kep/faces/wow3.gif" alt=""> ';
			html += '<img src="/kep/faces/nemtudom.gif" alt=""> ';
			html += '<img src="/kep/faces/merges2.gif" alt=""> ';
			html += '<img src="/kep/faces/wow2.gif" alt=""> ';
			html += '<img src="/kep/faces/guluszem1.gif" alt=""> ';

		html += '</div>';

		html += '<div class="ext_smiles_block right">';
			html += '<h3>Egyéb</h3>';
			html += '<img src="/kep/faces/felkialtas.gif" alt=""> ';
			html += '<img src="/kep/faces/alien2.gif" alt=""> ';
			html += '<img src="/kep/faces/dumcsi.gif" alt=""> ';
			html += '<img src="/kep/faces/idiota.gif" alt=""> ';
			html += '<img src="/kep/faces/help.gif" alt=""> ';
			html += '<img src="/kep/faces/alien.gif" alt=""> ';
			html += '<img src="/kep/faces/bdead.gif" alt=""> ';
			html += '<img src="/kep/faces/ticking.gif" alt=""> ';
			html += '<img src="/kep/faces/ravasz1.gif" alt=""> ';
			html += '<img src="/kep/faces/beka2.gif" alt=""> ';
			html += '<img src="/kep/faces/beka3.gif" alt=""> ';
			html += '<img src="/kep/faces/nezze.gif" alt=""> ';
			html += '<img src="/kep/faces/vigyor1.gif" alt=""> ';
			html += '<img src="/kep/faces/phone.gif" alt=""> ';
			html += '<img src="/kep/faces/heureka.gif" alt=""> ';
			html += '<img src="/kep/faces/gonosz2.gif" alt=""> ';
			html += '<img src="/kep/faces/vomit.gif" alt=""> ';
			html += '<img src="/kep/faces/fogmosas.gif" alt=""> ';
			html += '<img src="/kep/faces/gonosz1.gif" alt=""> ';
			html += '<img src="/kep/faces/oooo.gif" alt=""> ';
			html += '<img src="/kep/faces/integet2.gif" alt=""> ';


		html += '</div>';

		html += '<div style="clear:both;"></div>';
		
		$(html).appendTo('#ext_smiles');


		// Add click event to the smiles
		$('#ext_smiles img').click(function(e) {

			e.preventDefault();
				
			var tag = $(this).attr('src').replace(/.*ep\/faces\/(.*?)\..*/ig, "$1");
	
			var bhtml = '[#' + tag + ']';
			var ihtml = '<img src="/kep/faces/' + tag + '.gif">';

			var tarea = $('textarea[name="message"]:first').val() + bhtml;
			var imod = $(".cleditorMain:first iframe").contents().find('body').html() + ihtml;

			$('textarea[name="message"]:first').val(tarea);
			$('textarea[name="message"]:first').cleditor()[0].focus();
			$('.cleditorMain:first iframe').contents().find('body').html(imod);
			$('textarea[name="message"]:first').cleditor()[0].focus();
		});
		
	}

};



var message_center = {
	
	init : function() {
		
		// HTML code to insert
		var html = '';
		
			html += '<tr>';
				html += '<td colspan="4">';
					html += '<div>';
						html += '<div class="b-h-o-head ext_mc_tabs">';
							html += '<img src="images/ful_o_l.png" width="1" height="21" vspace="0" hspace="0" align="left">';
							html += '<span class="hasab-head-o">Fórumkategóriák</span>';
						html += '</div>';

						html += '<div class="b-h-b-head ext_mc_tabs">';
							html += '<img src="images/ful_b_l.png" width="1" height="21" vspace="0" hspace="0" align="left">';
							html += '<span class="hasab-head-b">Saját üzeneteim</span>';
						html += '</div>';
						
						html += '<div class="b-h-b-head ext_mc_tabs">';
							html += '<img src="images/ful_b_l.png" width="1" height="21" vspace="0" hspace="0" align="left">';
							html += '<span class="hasab-head-b">Válaszok</span>';
						html += '</div>';
					html += '</div>';
				html += '</td>';
			html += '</tr>';
		
		// Insert tabs
		$('.cikk-2').closest('tr').before(html);
		
		// Create DIV for each pages
		$('.cikk-2').addClass('ext_mc_pages');
		$('.cikk-2').after('<div class="ext_mc_pages"><h3>Még nem érkezett válasz egyetlen kommentedre sem.</h3><div class="contents"></div></div>');
		$('.cikk-2').after('<div class="ext_mc_pages"><h3>Még nincs egy elmentett üzenet sem.</h3></div>');
		
		// Fix right sidebar top position
		$('.cikk-2').closest('tr').children('td:eq(2)').css({ position : 'relative', top : -21 });
		
		// Show the last used tab
		message_center.tab(dataStore['mc_selected_tab']);
		
		// Set tab selection events
		$('.ext_mc_tabs').click(function() {
			message_center.tab( $(this).index() );
		});

		// buildOwnCommentsTab
		message_center.buildOwnCommentsTab();

		// Set auto list building in 6 mins
		setInterval(function() {
			message_center.buildOwnCommentsTab();
		}, 360000);
		
		// buildAnswersTab
		message_center.buildAnswersTab();

		// Set auto list building in 6 mins
		setInterval(function() {
			message_center.buildAnswersTab();
		}, 360000);	

		// Start searching ..
		message_center.search();
		
		// Set auto-search in 5 mins
		setInterval(function() {
			message_center.search();
		}, 300000);

	}, 
	
	topic : function() {
		
		// Set-up post logger
		message_center.log();
		
		// Start searching ..
		message_center.search();
		
		// Set auto-search in 5 mins
		setInterval(function() {
			message_center.search();
		}, 300000);
		
		message_center.jump();
	},

	article : function() {
		
		// Set-up post logger
		message_center.log();
		
		// Start searching ..
		message_center.search();
		
		// Set auto-search in 5 mins
		setInterval(function() {
			message_center.search();
		}, 300000);
		
		message_center.jump();	
	},

	tab : function(n) {
		
		// Hide all pages
		$('.ext_mc_pages').hide();
		
		// Show selected page
		$('.ext_mc_pages').eq(n).show();
		
		// Maintain styles, remove active style 
		$('.ext_mc_tabs').removeClass('b-h-o-head').addClass('b-h-b-head');
		$('.ext_mc_tabs').find('img[src*="ful_o_l.png"]').attr('src', 'images/ful_b_l.png');
		$('.ext_mc_tabs').find('.hasab-head-o').removeClass('hasab-head-o').addClass('hasab-head-b');
		
		// Maintain styles, add active style 
		$('.ext_mc_tabs').eq(n).removeClass('b-h-b-head').addClass('b-h-o-head');
		$('.ext_mc_tabs').eq(n).find('img[src*="ful_b_l.png"]').attr('src', 'images/ful_o_l.png');
		$('.ext_mc_tabs').eq(n).find('.hasab-head-b').removeClass('hasab-head-b').addClass('hasab-head-o');
		
		// Store last selected tag for initial status
		port.postMessage({ name : "setMCSelectedTab", message : n });
	},
	
	jump : function() {
		
		// Check for message ID in the url
		// Do nothing if not find any comment id
		if(!document.location.href.match('#komment')) {
			return false;
		}
		
		// Fetch comment ID
		var url = document.location.href.split('#komment=');
		var id = url[1];

		// Reset hash
		window.location.hash = '';

		// Find the comment in DOM
		var target = $('.topichead a:contains("#'+id+'")').closest('center');

		// Target offsets
		var windowHalf = $(window).height() / 2;
		var targetHalf = $(target).outerHeight() / 2;
		var targetTop = $(target).offset().top;
		var targetOffset = targetTop - (windowHalf - targetHalf);
		
		// Scroll to target element
		$('body').delay(1000).animate({ scrollTop : targetOffset}, 500, function() {
			$(target).css({ border: '2px solid red', margin : '10px 0px', 'padding-bottom' : 10 });
		});
	},
	
	log : function() {
		
		// Check the latest comment for getting the comment ID
		if(getCookie('updateComment')) {

			// Get messages for MC
			var messages = JSON.parse(dataStore['mc_messages']);
			
			// Get the comment ID
			var id = getCookie('updateComment');
			
			// Get message contents
			var message = $('.topichead a:contains("#'+id+'")').closest('center').find('.maskwindow').html();

			// Filter out html-s
			$.each([
				[/<div align="RIGHT">([\s\S]*?)<\/div>/img, '']
			], function(index, item) {
				message = message.replace(item[0], item[1]);
			});	
			
			for(c = 0; c < messages.length; c++) {
				if(messages[c]['comment_id'] == id) {
				
					// Update message content
					messages[c]['message'] = message;
				}
			}

			// Store new messages object in LocalStorage
			port.postMessage({ name : "setMCMessages", message : JSON.stringify(messages) });
			
			// Store in dataStore var
			dataStore['mc_messages'] = JSON.stringify(messages);
			
			// Remove marker for getting an ID
			removeCookie('updateComment');
		}

		// Check for update marker
		if(getCookie('getCommentID') == '1') {

			// Get messages for MC
			var messages = JSON.parse(dataStore['mc_messages']);
			

			// Get the comment ID
			var id = $('.topichead:first a:last').html().match(/\d+/g);
			
			// Get message contents
			var message = $('.topichead:first').next().find('.maskwindow').html();
			
			// Filter out html-s
			$.each([
				[/<div align="RIGHT">([\s\S]*?)<\/div>/img, '']
			], function(index, item) {
				message = message.replace(item[0], item[1]);
			});	
			
			// Store the ID for the latest message
			messages[0]['comment_id'] = id[0];

			// Update message content
			messages[0]['message'] = message;

			// Store new messages object in LocalStorage
			port.postMessage({ name : "setMCMessages", message : JSON.stringify(messages) });
			
			// Store in dataStore var
			dataStore['mc_messages'] = JSON.stringify(messages);
			
			// Remove marker for getting an ID
			removeCookie('getCommentID');
		}
	
		// Catch comment event
		if(!document.location.href.match('szerkcode')) {
		
			$('form[name="newmessage"]').submit(function() {

				// Article
				if(document.location.href.match('cikkek')) {

					// Get topic name
					var topic_name = $('.cikk-title:first').html();
			
					// Get topic ID
					var topic_id	= $('.std2:last a').attr('href');
						topic_id	= topic_id.split('?id=')[1];
				
				// Topic
				} else {
				
					// Get topic name
					var topic_name = $('select[name="id"] option:selected').text();
			
					// Get topic ID
					var topic_id	= $('select[name="id"] option:selected').val();
				}
			
				// Get comment time
				var time = Math.round(new Date().getTime() / 1000);
			
				// Get message
				var message = $(this).find('textarea').val();
			
				// Build the message object
				var tmp = {
			
					topic_name : topic_name,
					topic_id : topic_id,
					time : time,
					message : message,
					checked : time,
					answers : new Array()
				};
			
			
				// If theres no previous messages
				if(dataStore['mc_messages'] == '') {
					var messages = new Array();
						messages.push(tmp);
			
				// There is other messages
				} else {
			
					// Get the previous messages from localStorage
					var messages = JSON.parse(dataStore['mc_messages']);
				
					// Unshift the new message
					messages.unshift(tmp);
				
					// Check for max entries
					if(messages.length > 10) {
						messages.splice(9);
					}
				}
			
				// Store in localStorage
				port.postMessage({ name : "setMCMessages", message : JSON.stringify(messages) });
			
				// Set a marker for gettni the comment ID
				setCookie('getCommentID', '1', 1);	
			});
		} else {
			
			$('form[name="newmessage"]').submit(function() {
			
				// Get comment ID
				var comment_id = parseInt($('.std1:first').find('b').html().match(/\d+/g));
				
				// Set marker to be update this comment
				setCookie('updateComment', comment_id, 1);	
			});
		
		}
	},
	
	search : function() {
		
		// Check if theres any previous posts
		if(dataStore['mc_messages'] == '')  {
			return false;
		}
		
		// Get the latest post
		var messages = JSON.parse(dataStore['mc_messages']);
		
		// Iterate over the posts
		for(key = 0; key < messages.length; key++) {
			
			// Get current timestamp
			var time = Math.round(new Date().getTime() / 1000);
			
			// Check last searched state
			if(time < messages[key].checked + 60 * 10) {
				continue;
			}

			function doAjax(messages, key) {

				$.ajax({
				
					url : 'utolso80.php?id=' + messages[key]['topic_id'],
					mimeType : 'text/html;charset=iso-8859-2',
					
					success : function(data) {

						// Parse html response
						var tmp = '';
							 tmp = $(data);
							 
						var answers = new Array();
						var TmpAnswers = new Array();
						
							// Search posts that is an answer to us
							 TmpAnswers = $( tmp.find('.msg-replyto a:contains("#'+messages[key]['comment_id']+'")').closest('center').get().reverse() );

						// Iterate over the answers
						if(TmpAnswers.length == 0) {

							// Get current time
							var time = Math.round(new Date().getTime() / 1000);
					
							// Set new checked date
							messages[key]['checked'] = time;						

							// Store in localStorage
							port.postMessage({ name : "setMCMessages", message : JSON.stringify(messages) });
						
							// Store in dataStore
							dataStore['mc_messages'] = JSON.stringify(messages);

							return false;

						}

						for(c = 0; c < TmpAnswers.length; c++) {
							
							var nick = ($(TmpAnswers[c]).find(".topichead table tr:eq(0) td:eq(0) a img").length == 1) ? $(TmpAnswers[c]).find(".topichead table tr:eq(0) td:eq(0) a img").attr("alt") : $(TmpAnswers[c]).find(".topichead table tr:eq(0) td:eq(0) a")[0].innerHTML;
								nick = nick.replace(/ - VIP/, "");
							
							var message = $(TmpAnswers[c]).find('.maskwindow').html();

							var id = $(TmpAnswers[c]).find('.topichead a:last').html().match(/\d+/g)[0];
							
							var AD = {
								id : id,
								author : nick,
								message : message
							};
							
							answers.push( AD );
						}

						// Get current time
						var time = Math.round(new Date().getTime() / 1000);
					
						// Set new checked date
						messages[key]['checked'] = time;
						
						// Set the answers
						messages[key]['answers'] = answers;
					
						// Store in localStorage
						port.postMessage({ name : "setMCMessages", message : JSON.stringify(messages) });
						
						// Store in dataStore
						dataStore['mc_messages'] = JSON.stringify(messages);
						
					}
				});
			}
			
			// Make the requests
			doAjax(messages, key);
		}
	},
	
	buildOwnCommentsTab : function() {

		// Check if theres any previous posts
		if(dataStore['mc_messages'] == '')  {
			return false;
		}

		// Get the previous messages form LocalStorage
		var messages = JSON.parse(dataStore['mc_messages']);
		
		if(messages.length > 0) {
			$('.ext_mc_pages:eq(1)').html('');
		}
		
		// Iterate over the messages
		for(c = 0; c < messages.length; c++) {
			
			// Get the post date and time
			var time = date('Y. m. d. -  H:i', messages[c]['time']);
			
			// Get the today's date
			var today =  date('Y. m. d.', Math.round(new Date().getTime() / 1000));
			
			// Get yesteday's date
			var yesterday = Math.round(new Date().getTime() / 1000) - 60 * 60 * 24;
				yesterday = date('Y. m. d.', yesterday);
				
			// Convert today and yesterday strings
			$.each([
				[today, "ma"],
				[yesterday, "tegnap"]

			], function(index, item) {
				time = time.replace(item[0], item[1]);
			});	
			
			// Get the message
			var msg = messages[c]['message'];
			
			// Filter out BB tags and add line breaks
			$.each([
				[/[\r|\n]/g, "<br>"],
				[/\[.*?\]([\s\S]*?)\[\/.*?\]/g, "$1"]

			], function(index, item) {
				msg = msg.replace(item[0], item[1]);
			});			
			
			var html = '';
			
				html += '<div class="ext_mc_messages">';
					html += '<p><a href="http://www.sg.hu/listazas.php3?id='+messages[c]['topic_id']+'">'+messages[c]['topic_name']+'</a></p>';
					html += '<span>'+time+'</span>';
					html += '<div>'+msg+'</div>';
				html += '</div>';
			
			$(html).appendTo('.ext_mc_pages:eq(1)');
		}	
	},
	
	buildAnswersTab : function() {

		// Check if theres any previous posts
		if(dataStore['mc_messages'] == '')  {
			return false;
		}
	
		// Get the previous messages form LocalStorage
		var messages = JSON.parse(dataStore['mc_messages']);

		// Empty the container first for re-init
		$('.ext_mc_pages:eq(2) div.contents').html('');


		// Iterate over the messages
		for(c = 0; c < messages.length; c++) {
			
			// Html to insert
			var html = '';
			
			// Continue when no answers
			if(messages[c]['answers'].length == 0) {
				continue;
			}

			// Get the post date and time
			var time = date('Y. m. d. -  H:i', messages[c]['time']);
			
			// Get the today's date
			var today =  date('Y. m. d.', Math.round(new Date().getTime() / 1000));
			
			// Get yesteday's date
			var yesterday = Math.round(new Date().getTime() / 1000) - 60 * 60 * 24;
				yesterday = date('Y. m. d.', yesterday);
				
			// Convert today and yesterday strings
			$.each([
				[today, "ma"],
				[yesterday, "tegnap"]

			], function(index, item) {
				time = time.replace(item[0], item[1]);
			});	
			
			// Get the message
			var msg = messages[c]['message'];
			
			// Filter out BB tags and add line breaks
			$.each([
				[/[\r|\n]/g, "<br>"],
				[/\[.*?\]([\s\S]*?)\[\/.*?\]/g, "$1"]

			], function(index, item) {
				msg = msg.replace(item[0], item[1]);
			});	

			// Own comment
			html += '<div class="ext_mc_messages">';
				html += '<p><a href="http://www.sg.hu/listazas.php3?id='+messages[c]['topic_id']+'">'+messages[c]['topic_name']+'</a></p>';
					html += '<span>'+time+'</span>';
					html += '<div>'+msg+'</div>';
			html += '</div>';
			
			// Iterate over the answers
			for(a = 0; a < messages[c]['answers'].length; a++) {
			
				html += '<div class="ext_mc_messages ident">';
					html += '<p>';
						html += ''+messages[c]['answers'][a]['author']+'';
						html += ' - <a href="http://www.sg.hu/listazas.php3?id='+messages[c]['topic_id']+'#komment='+messages[c]['answers'][a]['id']+'" class="ext_mc_jump_to">ugrás a hozzászólásra</a>';
					html +='</p>';
					html += '<div>'+messages[c]['answers'][a]['message']+'</div>';
				html += '</div>';
			}
			
			// Insert html
			$(html).appendTo('.ext_mc_pages:eq(2) div.contents');
			
			if(html != '') {
				$('.ext_mc_pages:eq(2)').find('h3').remove();
			}
		}	
	}

};


function setCookie(c_name,value,exdays) {
	var exdate=new Date();
	exdate.setDate(exdate.getDate() + exdays);
	var c_value=escape(value) + ((exdays==null) ? "" : "; expires="+exdate.toUTCString());
	document.cookie=c_name + "=" + c_value;
}

function getCookie(c_name) {
	var i,x,y,ARRcookies=document.cookie.split(";");
	for (i=0;i<ARRcookies.length;i++) {
		x=ARRcookies[i].substr(0,ARRcookies[i].indexOf("="));
		y=ARRcookies[i].substr(ARRcookies[i].indexOf("=")+1);
		x=x.replace(/^\s+|\s+$/g,"");
		if (x==c_name) {
			return unescape(y);
		}
	}
}

function removeCookie( name, path, domain ) {
	if ( getCookie( name ) ) document.cookie = name + "=" +
	( ( path ) ? ";path=" + path : "") +
	( ( domain ) ? ";domain=" + domain : "" ) +
	";expires=Thu, 01-Jan-1970 00:00:01 GMT";
}



var topic_whitelist = {

	execute : function(ele) {
		
		// Get topic ID
		var id = $('select[name="id"] option:selected').val();
		
		// Add topic to whitelist
		if($(ele).html() == '+') {
			
			// Change the status icon
			$(ele).html('-');
			
			// Change status title
			$(ele).attr('title', 'Téma eltávolítása a fehérlistából');

			// Add to config
			port.postMessage({ name : "addTopicToWhitelist", message : id });
			
		// Remove topic from whitelist
		} else {

			// Change the status icon
			$(ele).html('+');

			// Change status title
			$(ele).attr('title', 'Téma hozzáadása a fehérlistához');

			// Remove from config
			port.postMessage({ name : "removeTopicFromWhitelist", message : id });
		}
	},
};


var textarea_auto_resize = {
	
	height : 150,
	
	init : function() {
		
		// Create the text holder element
		$('<div id="ext_textheight"></div>').prependTo('body');
		
		// Create the keyup event
		$('form[name="newmessage"] textarea').live('keyup', function() {
			textarea_auto_resize.setHeight(this);
		});
		
		textarea_auto_resize.height = $('form[name="newmessage"] textarea').height();
	},
	
	setHeight : function(ele) {
		
		// Get element value
		var val = $(ele).val();
		
		// Escape the value
		val = val.replace(/</gi, '&lt;');
		val = val.replace(/>/gi, '&gt');
		//val = val.replace(/\ /gi, '&nbsp;');
		val = val.replace(/\n/gi, '<br>');
		
		// Set the textholder element width
		$('#ext_textheight').css('width', $(ele).width());
		
		// Set the text holder element's HTML
		$('#ext_textheight').html(val);
		
		// Get the text holder element's height
		var height = $('#ext_textheight').height() + 14;
		
		// Check for expand
		if(height > $(ele).height()) {
			$(ele).height( $(ele).height() + 50);
		}
		
		// Check for shrink
		if( $(ele).height() > textarea_auto_resize.height && height < $(ele).height() ) {
		
			var newHeight = height < textarea_auto_resize.height ? textarea_auto_resize.height : height;
			
			$(ele).height( newHeight );
		}
		
	}
};

function extInit() {
	
	// SG index.php
	if(document.location.href == 'http://www.sg.hu/' || document.location.href.match('index.php')) {
	
		// Settings
		cp.init(3);


	// Articles
	} else if(document.location.href.match('cikkek')) {
	
		// Settings
		cp.init(2);

		// setPredefinedVars
		setPredefinedVars();

		// Maintain style settings
		$('.b-h-o-head a').closest('.b-h-o-head').attr('class', 'b-h-o-head topichead');
		$('.b-h-o-head').css('background', 'url(images/ful_o_bgbg.gif)');
		$('.b-h-o-head .msg-dateicon a').css('color', '#444');

		// Message Center
		if(dataStore['message_center'] == 'true' && isLoggedIn() ) {
			message_center.article();
		}

		// Threaded_comments
		if(dataStore['threaded_comments'] == 'true') {
			threaded_comments.activated();
		}
		
		// Set-up block buttons
		blocklist.init();

		// Block users/messages
		if(dataStore['block_list'] != '') {
			blocklist.hidemessages();
		}

		// Load next page when scrolling down
		if(dataStore['autoload_next_page'] == 'true') {
			autoload_next_page.activated();
		}

		// Show navigation buttons
		if(dataStore['show_navigation_buttons'] == 'true') {
			show_navigation_buttons.activated();
		}
	
		// Animated replyto
		replyTo();

		// Overlay reply-to
		if(dataStore['overlay_reply_to'] == 'true') {
			overlay_reply_to.activated();
		}
	
		// highlight_comments_for_me
		if(dataStore['highlight_comments_for_me'] == 'true' && isLoggedIn()) {
			highlight_comments_for_me.activated();
		}

		// show menitoned comment
		if(dataStore['show_mentioned_comments'] == true) {
			show_mentioned_comments.activated();
		}

		// WYSIWYG Editor
		if(dataStore['wysiwyg_editor'] == 'true') {
			wysiwyg_editor.activated();
		}


		// Auto resizing textarea
		textarea_auto_resize.init();

	// FORUM.PHP
	} else if(document.location.href.match('forum.php') && !document.location.href.match('forum.php3')) {


		// Settings
		cp.init(1);

		// setPredefinedVars
		setPredefinedVars();

		// Remove chat window
		if(dataStore['chat_hide'] == 'true') {
			chat_hide.activated();
		}

		// Custom blocks
		if(dataStore['custom_blocks'] == 'true') {
			custom_blocks.activated();
		}
		
		// Jump the last unreaded message
		if(dataStore['jump_unreaded_messages'] == 'true' && isLoggedIn() ) {
			jump_unreaded_messages.activated();
		}
		
		// Faves: show only with unreaded messages
		if(dataStore['fav_show_only_unreaded'] == 'true' && isLoggedIn() ) {
			fav_show_only_unreaded.init();
			fav_show_only_unreaded.activated();
		}

		// Faves: short comment marker
		if(dataStore['short_comment_marker'] == 'true' && isLoggedIn() ) {
			short_comment_marker.activated();
		}

		// Custom list styles
		if(dataStore['highlight_forum_categories'] == 'true') {
			highlight_forum_categories.activated();
		}
		
		// Refresh faves
		if(isLoggedIn()) {
			update_fave_list.activated();
		}

		// Make readed all faves
		if(isLoggedIn()) {
			make_read_all_faves.activated();
		}
		
		// Message center
		if(dataStore['message_center'] == 'true' && isLoggedIn() ) {
			message_center.init();
		}
	}
	
	// LISTAZAS.PHP
	else if(document.location.href.match(/listazas.php3\?id/gi) || document.location.href.match('listazas_msg.php')) {

		// Settings
		cp.init(2);

		// Get topic ID for whitelist check
		var id = $('select[name="id"] option:selected').val();

		// Determining current status
		var whitelist = new Array();
			whitelist = dataStore['topic_whitelist'].split(',');

		if(whitelist.indexOf(id) == -1) {

			// setPredefinedVars
			setPredefinedVars();
		
			// Monitor the new comments
			if(dataStore['fetch_new_comments'] == 'true') {
				fetch_new_comments_in_topic.init();
			}

			// Message Center
			if(dataStore['message_center'] == 'true' && isLoggedIn() ) {
				message_center.topic();
			}
		
			//gradual_comments
			if(dataStore['threaded_comments'] == 'true') {
				threaded_comments.activated();
			}
		
			// Jump the last unreaded message
			if(dataStore['jump_unreaded_messages'] && isLoggedIn() ) {
				jump_unreaded_messages.topic();
			}
		
			// Set-up block buttons
			blocklist.init();
		
			// Block users/messages
			if(dataStore['block_list'] != '') {
				blocklist.hidemessages();
			}
		
			// Load next page when scrolling down
			if(dataStore['autoload_next_page'] == 'true') {
				autoload_next_page.activated();
			}
		
			// Scroll to page top button
			if(dataStore['show_navigation_buttons'] == 'true') {
				show_navigation_buttons.activated();
			}

		
			// Animated replyto
			replyTo();

			// Overlay reply-to
			if(dataStore['overlay_reply_to'] == 'true') {
				overlay_reply_to.activated();
			}
		
			// highlight_comments_for_me
			if(dataStore['highlight_comments_for_me'] == 'true' && isLoggedIn()) {
				highlight_comments_for_me.activated();
			}
		
			// show menitoned comment
			if(dataStore['show_mentioned_comments'] == 'true') {
				show_mentioned_comments.activated();
			}

			// WYSIWYG Editor
			if(dataStore['wysiwyg_editor'] == 'true') {
				wysiwyg_editor.activated();
			}


			// Auto resizing textarea
			textarea_auto_resize.init();

		// Topic if whitelisted, show the navigation
		// buttons for removal
		} else {
			show_navigation_buttons.activated();
		}	

	}

	// GLOBAL SCRIPTS

		// remove adverts
		if(dataStore['remove_ads'] == 'true') {
			remove_adds.activated();
		}
}


// Filter out iframes
// Request settings object
if (window.top === window) {
	port.postMessage({ name : "getSettings" });
}

port.onMessage.addListener(function(event) {

	if(event.name == 'setSettings') {
	
		// Save localStorage data
		dataStore = event.message;
	
		// Add domready event
		$(document).ready(function() {
			extInit();
		});
	}
});

