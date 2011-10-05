// ==UserScript==
// @include http://sg.hu/*
// @include https://sg.hu/*
// @include http://www.sg.hu/*
// @include https://www.sg.hu/*
// @include http://*.sg.hu/*
// @include https://*.sg.hu/*
// ==/UserScript==

// Predefined vars
var userName, isLoggedIn, dataStore;

dataStore = widget.preferences;

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

	// Forum main page
	if(document.location.href.match('forum.php')) {
		return $('.std1').length ? true : false;
	
	// Topic page
	} else if(document.location.href.match(/listazas.php3\?id/gi)) {
		return ( $('.std1').length > 1) ? true : false;
	}
}

function getUserName() {
	// Forum main page
	if(document.location.href.match('forum.php')) {
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
};


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
		var url = document.location.href.substring(0, 66);

		// Update the url to avoid re-jump
		window.history.replaceState({ page : url }, '', url);
				
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
		$('html').animate({ scrollTop : targetOffset}, 500);
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
		$('#ext_show_filtered_faves').click(function() {
		
			if(fav_show_only_unreaded.opened == false) {
				$('#ext_filtered_faves_error').hide();
				$('#ext_show_filtered_faves_arrow').attr('class', 'hide');
				$('.ext_hidden_fave').show();
				
				fav_show_only_unreaded.opened = true;

				// Update last state in LocalStorage
				opera.extension.postMessage({ name : "updateFavesFilterLastState", message : true });
			
			} else {
				$('#ext_filtered_faves_error').show();
				$('#ext_show_filtered_faves_arrow').attr('class', 'show');
				$('.ext_hidden_fave').hide();
				
				fav_show_only_unreaded.opened = false;

				// Update last state in LocalStorage
				opera.extension.postMessage({ name : "updateFavesFilterLastState", message : false });
			}
		});

		// Check opened status
		if(fav_show_only_unreaded.opened == true) {
			$('#ext_filtered_faves_error').hide();
			$('#ext_show_filtered_faves_arrow').attr('class', 'hide');
			//$('.ext_hidden_fave').show();
			$('.ext_hidden_fave').css('display', 'block');
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
		
			var nick = ($(this).find("table tr:eq(0) td:eq(0) a img").length == 1) ? $(this).find("table tr:eq(0) td:eq(0) a img").attr("alt") : $(this).find("table tr:eq(0) td:eq(0) a")[0].innerHTML;
				nick = nick.replace(/ - VIP/, "");
		
			for(var i = 0; i < deletelist.length; i++) {
				if(nick.toLowerCase() == deletelist[i].toLowerCase()) {
					$(this).parent().hide();
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
			opera.extension.postMessage({ name : "addToBlocklist", message : nick });
		
			// Add name to blocklist 
			$('<li><span>'+nick+'</span> <a href="#">töröl</a></li>').appendTo('#ext_blocklist')
		
			// Remove empty blocklist message
			$('#ext_empty_blocklist').remove();
		}
	},
	
	unblock : function(user) {

		$(".topichead").each( function() {
		
			var nick = ($(this).find("table tr:eq(0) td:eq(0) a img").length == 1) ? $(this).find("table tr:eq(0) td:eq(0) a img").attr("alt") : $(this).find("table tr:eq(0) td:eq(0) a")[0].innerHTML;
				nick = nick.replace(/ - VIP/, "");

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
		
		// Current page index
		autoload_next_page.currPage = parseInt($('.lapozo:last span.current:first').html());
		
		// Get max page number 
		autoload_next_page.maxPage = parseInt($('.lapozo:last a:last').prev().html());
		
		$(document).scroll(function() {
			
			var docHeight = $('body').height();
			var scrollTop = $('html').scrollTop();

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
			var url = document.location.href.substring(0, 44);
				url = url+'&index='+(autoload_next_page.currPage+1)+'';
		}
		
		// Make the ajax query
		$.ajax({
			
			url : url, 
			mimeType : 'text/html;charset=iso-8859-2',
			success : function(data) {
			
				// Create the 'next page' indicator
				if(dataStore['threaded_comments'] != 'true') {
					$('<div class="ext_autopager_idicator">'+(autoload_next_page.currPage+1)+'. oldal</div>').insertBefore('.std1:last');
				}
			
				var tmp = $(data);
				var tmp = tmp.find('.topichead');
			
				tmp.each(function() {
				
					$(this).closest('center').insertBefore('.std1:last');
			
				});
			
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

					// Openable spoiler blocks
					if(dataStore['spoiler_blocks'] == 'true') {
						spoiler_blocks.activated();
					}
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
			$('html').animate({ scrollTop : 0 }, 1000);
		});

		// Created the back button
		$('<div id="ext_back">&#9664;</div>').prependTo('body');	
		
		// Add event to back button
		$('#ext_back').click(function() {
			document.location.href = 'forum.php';
		});
		
		// Create search button
		$('<div id="ext_search"></div>').prependTo('body');
		
		// Search icon
		var searchImg = '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';
		
		// Place search icon background
		$('#ext_search').css('background-image', 'url(data:image/png;base64,'+searchImg+')');
		
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

		
		// Execute when the user is logged in
		if(isLoggedIn()) {
		
			var faveImg = "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";
			
			// Create faves button
			$('<div id="ext_nav_faves"></div>').prependTo('body');
		
			// Place the faves icon
			$('#ext_nav_faves').css('background-image', 'url(data:image/png;base64,'+faveImg+')');
		
			// Place faves opened cotainer
			$('<p id="ext_nav_faves_arrow"><div id="ext_nav_faves_wrapper"></p><div class="ext_faves"></div><div></div></div>').prependTo('body');
		
			// Create faves button event
			$('#ext_nav_faves').toggle(
				function() { show_navigation_buttons.showFaves(); },
				function() { show_navigation_buttons.hideFaves(); }
			);
		}

	},
	
	disabled : function() {
	
		$('#ext_scrolltop').remove();
		$('#ext_back').remove();
		$('#ext_search').remove();
	},
	
	showSearch : function() {
		
		// Clone and append the original search form to body
		var clone = $('.lapozo:last').next().next().clone().appendTo('body');
		
		// Add class
		clone.attr('id', 'ext_overlay_search');

		// Place arrow
		$('<div id="ext_overlay_search_arrow"></div>').appendTo('#ext_overlay_search');
	},
	
	hideSearch : function() {
		$('#ext_overlay_search').remove();
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
						
				// Show the container
				$('#ext_nav_faves_wrapper').show();
				$('#ext_nav_faves_arrow').show();
			}
		});
	},
	
	hideFaves : function() {
		$('#ext_nav_faves_wrapper').hide();
		$('#ext_nav_faves_arrow').hide();
	}
};


var update_fave_list = {

	activated : function() {
		
		var refreshImg = "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";
		
		// Disable site's built-in auto-update by remove "fkedvenc" ID
		$('#fkedvenc').removeAttr('id');		
		
		// Create refhref button
		$('.ext_faves').append('<div id="ext_refresh_faves"></div>');

		// Move the button away if unreaded faves is on
		if(dataStore['fav_show_only_unreaded'] == 'true' && isLoggedIn() ) {
			$('#ext_refresh_faves').css('right', 18);
		}
	
		// Set refresh image
		$('<img src="data:image/png;base64,'+refreshImg+'">').appendTo('#ext_refresh_faves');
		
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
	
		var refreshImg = "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";
		var inProgressImg = "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";
		var completedImg = "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";
		
		// Set 'in progress' icon
		$('#ext_refresh_faves img').attr('src', 'data:image/png;base64,'+inProgressImg);
		
		$.ajax({
			url : 'ajax/kedvencdb.php',
			mimeType : 'text/html;charset=utf-8',
			success : function(data) {

				// Set 'completed' icon
				$('#ext_refresh_faves img').attr('src', 'data:image/png;base64,'+completedImg);
				
				// Set back the normal icon in 1 sec
				setTimeout(function() {
					$('#ext_refresh_faves img').attr('src', 'data:image/png;base64,'+refreshImg);
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
		
		var makereadedImg = "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";
		
		// Create the 'read them all' button
		$('.ext_faves').append('<div id="ext_read_faves"><div>');

		// Move the button away if unreaded faves is on
		if(dataStore['fav_show_only_unreaded'] == 'true' && isLoggedIn() ) {
			$('#ext_read_faves').css('right', 36);
		}

		// Append the image
		$('<img src="data:image/png;base64,'+makereadedImg+'">').appendTo('#ext_read_faves');
		
		// Add click event
		$('#ext_read_faves').click(function() {
			make_read_all_faves.makeread();
		});
	},
	
	makeread : function() {

		var makereadedImg = "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";
		var makereadedWaitingImg = "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";
		var makereadedCompletedImg = "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";
		
		if(confirm('Biztos olvasottnak jelölöd az összes kedvenced?')) {
			
			// Set 'in progress' icon
			$('#ext_read_faves img').attr('src', 'data:image/png;base64,'+makereadedWaitingImg);
			
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
					$('#ext_read_faves img').attr('src', 'data:image/png;base64,'+makereadedCompletedImg);
			
					// Set normal icon
					setTimeout(function() {
						$('#ext_read_faves img').attr('src', 'data:image/png;base64,'+makereadedImg);
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
		var url = '/listazas_egy.php3?callerid=2&id=' + id + '&no=' + no;
		$.get(url, function(data) { 
			
			// Show the comment
			$('#'+target).html(data).hide().slideDown();

			// show menitoned comment
			if(dataStore['show_mentioned_comments'] == 'true') {
				show_mentioned_comments.activated();
			}

			// Openable spoiler blocks
			if(dataStore['spoiler_blocks'] == 'true') {
				spoiler_blocks.activated();
			}

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
		var comment_clone = $(comment).clone(true, true).prependTo('body').addClass('ext_highlighted_comment');
		
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
		
		// Create textarea clone
		var textarea_clone = $('form[name="newmessage"] textarea').closest('div').clone().prependTo('body').addClass('ext_clone_textarea');

		// Fix smile list
		if(dataStore['group_smiles'] == 'true') {
		
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
		
			textarea_clone.find('#ext_smiles').css({ 'padding-left' : 100, 'padding-right' : 100, 'margin-top' : 15 });
		}

				// Copy textarea original comment to the tmp element
				textarea_clone.find('textarea').val( $('form[name=newmessage]:gt(0) textarea').val() );
				
				// Remove username line
				textarea_clone.find('.std1').remove();
				
				// Fix buttons
				textarea_clone.find('a:eq(0)').css({ position : 'absolute',  left : 0 });
				textarea_clone.find('a:eq(1)').css({ position : 'absolute',  left : 90 });
				textarea_clone.find('a:eq(2)').css({ position : 'absolute',  left : 180 });
				textarea_clone.find('a:eq(3)').css({ position : 'absolute',  left : 270 });
				textarea_clone.find('a:eq(4)').css({ position : 'absolute',  left : 360 });
				textarea_clone.find('a:eq(5)').css({ position : 'absolute',  left : 450 });
				textarea_clone.find('a:eq(6)').css({ position : 'absolute',  right : 0 });
			
				// Create a container element around the textarea for box-shadow
				$('<div id="ext_clone_textarea_shadow"></div>').insertAfter(textarea_clone.find('textarea'));
				
				// Put textarea the container
				textarea_clone.find('textarea').appendTo('#ext_clone_textarea_shadow');

		// Textarea position
		var top = $(comment_clone).offset().top + $(comment_clone).height();
	
		
		var left = $(document).width() / 2 - 405;
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
			$('html').animate( { scrollTop : scT }, 500);
		}

		// Set the right tabindex
		textarea_clone.find('textarea').attr('tabindex', '1');
		textarea_clone.find('a:last').attr('tabindex', '2');

		// Set the textarea focus
		textarea_clone.find('textarea').focus();

		// Block default tab action in non-WYSIWYG editor
		$('body').keydown(function(event) {
			if (event.keyCode == '9') {
    			 event.preventDefault();
    			 textarea_clone.find('a:last').focus();
   			}
		});

		// Thickbox
		textarea_clone.find('a.thickbox').each(function() {
			
			// Get the title and other stuff
			var t = $(this).attr('title') || $(this).attr('name') || null;
			var g = $(this).attr('rel') || false;
			var h = $(this).attr('href');
			
			$(this).attr('href', 'javascript:TB_show(\''+t+'\',\''+h+'\','+g+');');
			
			$(this).blur();
		});

		var img = "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";
		
		// Add close button
		var close_btm = $('<img src="data:image/png;base64,'+img+'" id="ext_close_overlay">').prependTo(textarea_clone).addClass('ext_overlay_close');
		

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
				
				var img = "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";
				
				$(this).css('position', 'relative').append('<img src="data:image/png;base64,'+img+'" class="ext_comments_for_me_indicator">');
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
		$('html').animate({ scrollTop : targetOffset}, 500);
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
		$('html').animate({ scrollTop : targetOffset}, 500);
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
			$(this).css({ 'margin-left' : 15, 'padding-left' : 15, 'border-left' : '1px solid #ddd' });
			$(this).find('.topichead').parent().css('width', 810 - ($(this).parents('center').length-2) * 30);
			$(this).find('.msg-replyto').hide();
			
			// Add checked class
			$(this).find('.topichead:first').addClass('checked');

		});
	}
};

function monitorNewCommentsNotification() {
	
	setInterval(function(){
		
		if($('#ujhszjott a').length > 0) {	
		
			var topic_url = $('#ujhszjott a').attr('href').substring(0, 27);
			var comment_c = $('#ujhszjott a').text().match(/\d+/g);
			
			$('#ujhszjott a').attr('href',  topic_url + '&newmsg=' + comment_c);
		}
	
	}, 1000);
}

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
		
		// Get topic ID
		var id = document.location.href.split('?id=')[1];
			id = id.split('#')[0];
			id = id.split('&')[0];
		
		var target = $(ele).closest('.msg-text').next().next().attr('id');
		
		eval("ext_valaszmsg('"+target+"', "+id+", "+no+", 2);");
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
		opera.extension.postMessage({ name : "setBlocksConfig", message : JSON.stringify(config) });
		
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
		opera.extension.postMessage({ name : "setBlocksConfig", message : JSON.stringify(config) });

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
		opera.extension.postMessage({ name : "setBlocksConfig", message : JSON.stringify(_config) });
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
			
			var minimalizeImg	= "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";
			var closeImg		= "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";
			var downImg			= "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";
			var upImg			= "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";
			var rightImg		= "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";
			var leftImg			= "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";
			
			// Contenthide
			$('<img src="data:image/png;base64,'+minimalizeImg+'" class="ext_block_button_right">').prependTo(item).click(function(e) {
				e.preventDefault();
				custom_blocks.contentHide( $(this).closest('div').attr('id'), true );
			});

			// Hide
			$('<img src="data:image/png;base64,'+closeImg+'" class="ext_block_button_right">').prependTo(item).click(function(e) {
				e.preventDefault();
				custom_blocks.hide( $(this).closest('div').attr('id'), true );
			});
			

			// Down
			$('<img src="data:image/png;base64,'+downImg+'" class="ext_block_button_left">').prependTo(item).click(function(e) {
				e.preventDefault();
				custom_blocks.down( $(this).closest('div').attr('id'), true );
			});

			// Up
			$('<img src="data:image/png;base64,'+upImg+'" class="ext_block_button_left">').prependTo(item).click(function(e) {
				e.preventDefault();
				custom_blocks.up( $(this).closest('div').attr('id'), true );
			});						

			// Right
			$('<img src="data:image/png;base64,'+rightImg+'" class="ext_block_button_left">').prependTo(item).click(function(e) {
				e.preventDefault();
				custom_blocks.right( $(this).closest('div').attr('id'), true );
			});			
			// Left
			$('<img src="data:image/png;base64,'+leftImg+'" class="ext_block_button_left">').prependTo(item).click(function(e) {
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
			$('#'+id).prependTo('table:eq(3) td:eq(0)');

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
			$('#'+id).prependTo('table:eq(3) td:eq(2) table:first tr > td:eq(2)');

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

var group_smiles = {

	activated : function() {
				
		// Create smiles container
		$('<div id="ext_smiles" style="display: none;"></div>').insertAfter('form[name="newmessage"]');
		
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
		$('#ext_smiles img').live('click', function(e) {

			e.preventDefault();
			var tag = $(this).attr('src').replace(/.*ep\/faces\/(.*?)\..*/ig, "$1");
			var myValue = '[#' + tag + ']';
			var myField = $('form[name="newmessage"] textarea:first')[0];

			if (document.selection) {
				myField.focus();
				sel = document.selection.createRange();
				sel.text = myValue;
			
			} else if (myField.selectionStart || myField.selectionStart == '0') {
				var startPos = myField.selectionStart;
				var endPos = myField.selectionEnd;
				myField.value = myField.value.substring(0, startPos) + myValue + myField.value.substring(endPos, myField.value.length);
			
			} else {
				myField.value += myValue;
			}

			if (myField) { 
				myField.focus();
				myField.setSelectionRange(startPos + myValue.length, startPos + myValue.length);
			}
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
		opera.extension.postMessage({ name : "setMCSelectedTab", message : n });
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
			opera.extension.postMessage({ name : "setMCMessages", message : JSON.stringify(messages) });
			
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
			opera.extension.postMessage({ name : "setMCMessages", message : JSON.stringify(messages) });
			
			// Store in dataStore var
			dataStore['mc_messages'] = JSON.stringify(messages);
			
			// Remove marker for getting an ID
			removeCookie('getCommentID');
		}
	
		// Catch comment event
		if(!document.location.href.match('szerkcode')) {
		
			$('form[name="newmessage"]').submit(function() {

				// Get topic name
				var topic_name = $('select[name="id"] option:selected').text();
			
				// Get topic ID
				var topic_id	= $('select[name="id"] option:selected').val();
			
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
				opera.extension.postMessage({ name : "setMCMessages", message : JSON.stringify(messages) });
			
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
							return false;
						}

						for(c = 0; c < TmpAnswers.length; c++) {
							
							var nick = ($(TmpAnswers[c]).find(".topichead table tr:eq(0) td:eq(0) a img").length == 1) ? $(TmpAnswers[c]).find(".topichead table tr:eq(0) td:eq(0) a img").attr("alt") : $(TmpAnswers[c]).find(".topichead table tr:eq(0) td:eq(0) a")[0].innerHTML;
								nick = nick.replace(/ - VIP/, "");
							
							var message = $(TmpAnswers[c]).find('.maskwindow').html();

							
							var AD = {
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
						opera.extension.postMessage({ name : "setMCMessages", message : JSON.stringify(messages) });
						
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
					html += '<p>'+messages[c]['answers'][a]['author']+'</p>';
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

var spoiler_blocks = {

	activated : function() {
		
		// Iterate over the spoilers
		$('.topichead').closest('center').find('.msg-text div:contains("SPOILER!"):not(.ext_spoiler)').each(function() {
			
			// Get the message
			var message = $(this).find('div').html();
			
			// Html to insert
			var html = '';
				
				html += '<b>SPOILER!</b>';
				html += '<a href="#">Kattints ide a szöveg megtekintéséhez!</a>';
				html += '<div>'+message+'</div>';
			
			// Override original contents
			$(this).html(html);
			
			// Add class to the container
			$(this).addClass('ext_spoiler');
		});
		
		// Add toggle event
		$('.ext_spoiler a').unbind('toggle').toggle(
		
			function(e) {
			
				// Prevent borowser default action
				e.preventDefault();

				// Open the contents
				$(this).next().slideDown();
			},
			
			function(e) {
	
				// Prevent borowser default action
				e.preventDefault();
			
				// Open the contents
				$(this).next().slideUp();
			}
		);
	},
};

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
			opera.extension.postMessage({ name : "addTopicToWhitelist", message : id });
			
		// Remove topic from whitelist
		} else {

			// Change the status icon
			$(ele).html('+');

			// Change status title
			$(ele).attr('title', 'Téma hozzáadása a fehérlistához');

			// Remove from config
			opera.extension.postMessage({ name : "removeTopicFromWhitelist", message : id });
		}
	},
};

function extInit() {
	
	// FORUM.PHP
	if(document.location.href.match('forum.php') && !document.location.href.match('forum.php3')) {

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
		if(dataStore['message_center'] == 'true') {
			message_center.init();
		}
	}
	
	// LISTAZAS.PHP
	else if(document.location.href.match(/listazas.php3\?id/gi)) {

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
		
			// Monitor the new comments notification
			monitorNewCommentsNotification();

			// Message Center
			if(dataStore['message_center'] == 'true') {
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
			show_navigation_buttons.activated();
		
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

			// Group smiles
			if(dataStore['group_smiles'] == 'true') {
				group_smiles.activated();
			}
	

			// Openable spoiler blocks
			if(dataStore['spoiler_blocks'] == 'true') {
				spoiler_blocks.activated();
			}
			
		// Topic is whitelisted, place the navigation buttons 
		// to have the ability of whitelist removal
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

// extInit
if (window.top === window) {
	$(document).ready(function() {
    
    	var onMessage = function(event) {
    
			var msg = event.data;
        
			// Check this is the correct message and path from the background script.
			if (msg.name === 'LoadedInjectedCSS') {
            
				var css = msg.message.css;

				// Create a <style> element and add it to the <head> element of the current page.
				// Insert the contents of the stylesheet into the <style> element.
				var style = document.createElement('style');
					style.setAttribute('type', 'text/css');            
					style.appendChild(document.createTextNode(css));
					document.getElementsByTagName('head')[0].appendChild(style);
			}
		}
	
    	// On receipt of a message from the background script, execute onCSS().
    	opera.extension.addEventListener('message', onMessage, false);
    
    	// Send the stylesheet path to the background script to get the CSS.
    	opera.extension.postMessage({ name : 'LoadInjectedCSS', message : 'css/content.css' });
    	opera.extension.postMessage({ name : 'LoadInjectedCSS', message : 'css/settings.css' });
    	opera.extension.postMessage({ name : 'LoadInjectedCSS', message : 'css/cleditor.css' });

		extInit();
	});
}

