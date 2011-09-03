// Predefined vars
var userName, isLoggedIn, dataStore;

var port = chrome.extension.connect();

function setPredefinedVars() {
	userName = getUserName();
	loggedIn = isLoggedIn();
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
	
	jump : function() {
	
		// Get new messages counter
		var newMsg = document.location.href.split('&newmsg=')[1];

		// Return if there isnot comment counter set
		if(typeof newMsg == "undefined" || newMsg == '') {
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
		
		
		// Set 1 sec delay 
		setTimeout(function(){ 
		
			// Target offsets
			var windowHalf = $(window).height() / 2;
			var targetHalf = $(target).outerHeight() / 2;
			var targetTop = $(target).offset().top;
			var targetOffset = targetTop - (windowHalf - targetHalf);
		
			// Scroll to target element
			$('body').animate({ scrollTop : targetOffset}, 500);
			
			// Append hr tag content if any
			var content = $('a[name=pirosvonal]').find('center').insertBefore('a[name=pirosvonal]');
			
			// Remove original hr tag
			$('a[name=pirosvonal]').remove();
			
		}, 1000, target);

		// Url to rewrite
		var url = document.location.href.substring(0, 44);

		// Update the url to avoid re-jump
		history.replaceState({ page : url }, '', url);
	}
	
};

var fav_show_only_unreaded = {

	opened : false,

	activated : function() {

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
			
			} else {
				$('#ext_filtered_faves_error').show();
				$('#ext_show_filtered_faves_arrow').attr('class', 'show');
				$('.ext_hidden_fave').hide();
				
				fav_show_only_unreaded.opened = false;
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
		$('.topichead a[href*="forummsg.php"]').each(function() {
			$('<a href="#" class="block_user">letiltás</a> <span>| </span> ').insertBefore(this);
		});
	
		// Create the block evenst
		$('.block_user').click(function(e) {
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
			port.postMessage({ name : "addToBlocklist", message : nick });
		
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
		var url = document.location.href.substring(0, 44);
		
		// Make the ajax query
		$.get(url+'&index='+(autoload_next_page.currPage+1)+'', function(data) {
			
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
			document.location.href = 'forum.php';
		});

		// Create search button
		$('<div id="ext_search"></div>').prependTo('body');
		
		// Place search icon background
		$('#ext_search').css('background-image', 'url('+chrome.extension.getURL('/img/content/search.png')+')');
		
		// Create the search event
		$('#ext_search').toggle(
			function() { show_navigation_buttons.showSearch(); },
			function() { show_navigation_buttons.hideSearch(); }	
		);
	},
	
	disabled : function() {
	
		$('#ext_scrolltop').remove();
		$('#ext_back').remove();
	},
	
	showSearch : function() {
		
		// Clone and append the original search form to body
		var clone = $('.lapozo:last').next().next().clone().appendTo('body');
		
		// Add class
		clone.attr('id', 'ext_overlay_search');
	},
	
	hideSearch : function() {
		$('#ext_overlay_search').remove();
	}
};

var update_fave_list = {

	activated : function() {
		
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
		
		// Set auto refresh
		setInterval(function() {
			update_fave_list.refresh();
		}, 30000);
		
	},
	
	refresh : function() {
		
		// Set 'in progress' icon
		$('#ext_refresh_faves img').attr('src', chrome.extension.getURL('/img/content/refresh_waiting.png') );
		
		
		$.ajax({
			url : 'forum.php',
			mimeType : 'text/html;charset=iso-8859-2',
			success : function(data) {
				
				// Set 'completed' icon
				$('#ext_refresh_faves img').attr('src', chrome.extension.getURL('/img/content/refresh_done.png') );
				
				// Set back the normal icon in 1 sec
				setTimeout(function() {
					$('#ext_refresh_faves img').attr('src', chrome.extension.getURL('/img/content/refresh.png') );
				}, 2000);
				
				// Get new fave list
				var tmp = $(data);
					tmp = tmp.find('.b-h-o-head:eq(2)').next().html();
				
				// Append new fave list
				$('.ext_faves:first').next().html(tmp);
				
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
		var url = '/listazas_egy.php3?callerid=2&id=' + id + '&no=' + no;
		$.get(url, function(data) { 
			$('#'+target).html(data).hide().slideDown();
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
		$('.topichead a:contains("válasz erre")').live('click', function(e) {
			
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
	
		$('.topichead a:contains("válasz erre")').die('click');
	
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
		
		// Create textarea clone
		var textarea_clone = $('textarea:first').closest('div').clone().prependTo('body').addClass('ext_clone_textarea');
		
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
			$('body').animate( { scrollTop : scT }, 500);
		}

		// Set the right tabindex
		textarea_clone.find('textarea').attr('tabindex', '1');
		textarea_clone.find('a:last').attr('tabindex', '2');

		// Set the textarea focus
		textarea_clone.find('textarea').focus();

		// Block default tab action
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
		
		// Add close button
		var close_btm = $('<img src="'+chrome.extension.getURL('/img/content/overlay_close.png')+'" id="ext_close_overlay">').prependTo(textarea_clone).addClass('ext_overlay_close');

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
		
		$('.maskwindow:not(.checked)').each(function() {

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
		
		var target = $(ele).closest('.msg-text').next().attr('id');
		
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
		$('.b-h-o-head, .b-h-b-head').parent().each(function() {
			
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
		$('table:eq(3) td:eq(0)').find('.b-h-b-head').removeClass('b-h-b-head').addClass('b-h-o-head');
		$('table:eq(3) td:eq(0)').find('.hasab-head-b').removeClass('hasab-head-b').addClass('hasab-head-o');
		$('table:eq(3) td:eq(0)').find('img[src="images/ful_b_l.png"]').attr('src', 'images/ful_o_l.png');

		// Maintain style settings
		$('table:eq(3) td:eq(2) table:first tr > td:eq(2)').find('.b-h-o-head').removeClass('b-h-o-head').addClass('b-h-b-head');
		$('table:eq(3) td:eq(2) table:first tr > td:eq(2)').find('.hasab-head-o').removeClass('hasab-head-o').addClass('hasab-head-b');
		$('table:eq(3) td:eq(2) table:first tr > td:eq(2)').find('img[src="images/ful_o_l.png"]').attr('src', 'images/ful_b_l.png');
	
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


function extInit() {
	
	// FORUM.PHP
	if(document.location.href.match('forum.php')) {

		// Settings
		cp.init(1);

		// setPredefinedVars
		setPredefinedVars();

		// Custom blocks
		if(dataStore['custom_blocks'] == 'true') {
			custom_blocks.activated();
		}

		// Remove chat window
		if(dataStore['chat_hide'] == 'true') {
			chat_hide.activated();
		}
		
		// Jump the last unreaded message
		if(dataStore['jump_unreaded_messages'] == 'true' && isLoggedIn() ) {
			jump_unreaded_messages.activated();
		}
		
		// Faves: show only with unreaded messages
		if(dataStore['fav_show_only_unreaded'] == 'true' && isLoggedIn() ) {
			fav_show_only_unreaded.activated();
		}

		// Faves: short comment marker
		if(dataStore['short_comment_marker'] == 'true'&& isLoggedIn() ) {
			short_comment_marker.activated();
		}

		// Custom list styles
		if(dataStore['highlight_forum_categories'] == 'true') {
			highlight_forum_categories.activated();
		}
		
		// Refresh faves
		update_fave_list.activated();

		// Make readed all faves
		make_read_all_faves.activated();

	}
	
	// LISTAZAS.PHP
	else if(document.location.href.match(/listazas.php3\?id/gi)) {

		// Settings
		cp.init(2);

		// setPredefinedVars
		setPredefinedVars();
		
		// Monitor the new comments notification
		monitorNewCommentsNotification();
		
		//gradual_comments
		if(dataStore['threaded_comments'] == 'true') {
			threaded_comments.activated();
		}
		
		// Jump the last unreaded message
		if(dataStore['jump_unreaded_messages'] && isLoggedIn() ) {
			jump_unreaded_messages.jump();
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

