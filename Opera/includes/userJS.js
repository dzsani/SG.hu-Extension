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

function setPredefinedVars() {
	userName = getUserName();
	loggedIn = isLoggedIn();
}

function isLoggedIn() {

	// Forum main page
	if(document.location.href.match('forum.php')) {
		return window.$('.std1').length ? true : false;
	
	// Topic page
	} else if(document.location.href.match(/listazas.php3\?id/gi)) {
		return ( window.$('.std1').length > 1) ? true : false;
	}
	
}

function getUserName() {
	// Forum main page
	if(document.location.href.match('forum.php')) {
		return window.$('.std1 b').text().match(/Szia (.*)!/)[1];
	
	// Topic page
	} else if(document.location.href.match(/listazas.php3\?id/gi)) {
	
		return window.$('.std1:contains("Bejelentkezve")').text().replace('Bejelentkezve: ', '');
	}
}

function removeChatWindow() {

	window.$('table:eq(3) td:eq(2) center:eq(0) *:lt(2)').remove();
	window.$('table:eq(3) td:eq(2) br').remove();
}

var  jumpLastUnreadedMessage = {
	
	init : function() {
		window.$('.ext_faves').next().find('a').each(function() {
			
			// If theres a new message
			if(window.$(this).find('small').length > 0) {
			
				// Get the new messages count
				var newMsg = parseInt(window.$(this).find('small').html().match(/\d+/g));
				
				// Get last msn's page number
				var page = Math.ceil( newMsg / 80 );
				
				// Rewrite the url
				window.$(this).attr('href', window.$(this).attr('href') + '&order=reverse&index='+page+'&newmsg='+newMsg+'');
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
		if(window.$('.ext_new_comment').length > 0) {
			var target = window.$('.ext_new_comment:first').closest('center');
		
		} else if( window.$('a[name=pirosvonal]').length > 0) {
			var target = window.$('a[name=pirosvonal]').prev();
			
				// Insert the horizontal rule
				window.$('<hr>').insertAfter(target).attr('id', 'ext_unreaded_hr');
				
		} else {
			var target = window.$('.topichead').closest('center').eq(lastMsg-1);
			
			// Insert the horizontal rule
			window.$('<hr>').insertAfter(target).attr('id', 'ext_unreaded_hr');
		}
		
		
		// Set 1 sec delay 
		setTimeout(function(){ 
		
			// Target offsets
			var windowHalf = window.$(window).height() / 2;
			var targetHalf = window.$(target).outerHeight() / 2;
			var targetTop = window.$(target).offset().top;
			var targetOffset = targetTop - (windowHalf - targetHalf);
		
			// Scroll to target element
			window.$('html').animate({ scrollTop : targetOffset}, 500);
			
			// Remove original HR tag
			window.$('a[name=pirosvonal]').remove();
			
		}, 1000, target);

	}
	
};

function filterOutReadedFaves() {

	var counter = 0;
	var counterAll = 0;

	window.$(window.$('.ext_faves').next().find('div a').get().reverse()).each(function() {

		// Skip topics that have unreaded messages
		if( window.$(this).find('small').length > 0) {
			counter++;
			counterAll++;
			return true;
		}
		
		if( window.$(this).parent().is('div.std0') ) {
		
			if(counter == 0) {
				window.$(this).parent().addClass('ext_hidden_fave');
				return true;
			} else {
				counter = 0;
				return true;
			}

		}
		
		// Otherwise, add hidden class
		window.$(this).parent().addClass('ext_hidden_fave');
	});

	// Create an error message if theres no topik with unreaded messages
	if(counterAll == 0) {
		window.$('.ext_hidden_fave:last').after('<p id="ext_filtered_faves_error">Nincs olvasatlan topik</p>');
	}
	
	// Set the "show" button
	window.$('.ext_faves').append('<div id="ext_show_filtered_faves"></div>');
	window.$('#ext_show_filtered_faves').append('<span id="ext_show_filtered_faves_arrow"></span>');
	
	// Apply some styles
	window.$('#ext_show_filtered_faves_arrow').attr('class', 'show');

	// Set event handling
	window.$('#ext_show_filtered_faves').toggle(
		function() {
			window.$('#ext_filtered_faves_error').hide();
			window.$('#ext_show_filtered_faves_arrow').attr('class', 'hide');
			window.$('.ext_hidden_fave').show();
		},
		function() {
			window.$('#ext_filtered_faves_error').show();
			window.$('#ext_show_filtered_faves_arrow').attr('class', 'show');
			window.$('.ext_hidden_fave').hide(); 
		}
	);
}


function shortCommentMarker() {
	
	window.$('.ext_faves').next().find('div a').each(function() {
		
		if( window.$(this).find('small').length > 0) {
			
			// Received new messages counter
			var newMsg = parseInt( window.$(this).find('small').html().match(/\d+/g) );
			
			// Remove the old marker text
			window.$(this).find('br').remove();
			window.$(this).find('font:last').remove();
			
			// Add the new marker after the topic title
			window.$(this).html( window.$(this).html() + ' <span style="color: red;">'+newMsg+'</span>');
		}
	
	});
}

function setBlockButton() {

	// Create the block buttons
	window.$('.topichead a[href*="forummsg.php"]').each(function() {
	
		window.$('<a href="#" class="block_user">letiltás</a> <span>| </span> ').insertBefore(this);
	});
	
	// Create the block evenst
	window.$('.block_user').click(function(e) {
	
		e.preventDefault();
		getBlockedUserNameFromButton(this);
	});
}

function blockMessages() {
	
	// Return false if theres no blocklist entry
	if(typeof dataStore['block_list'] == "undefined" || dataStore['block_list'] == '') {
		return false;
	}
	
	var deletelist = dataStore['block_list'].split(',');

	window.$(".topichead").each( function() {
		
		var nick = (window.$(this).find("table tr:eq(0) td:eq(0) a img").length == 1) ? window.$(this).find("table tr:eq(0) td:eq(0) a img").attr("alt") : window.$(this).find("table tr:eq(0) td:eq(0) a")[0].innerHTML;
			nick = nick.replace(/ - VIP/, "");
		
		for(var i = 0; i < deletelist.length; i++) {
			if(nick.toLowerCase() == deletelist[i].toLowerCase()) {
				window.$(this).parent().remove();
			}
		}
	});
}

function getBlockedUserNameFromButton(el) {

	var nick = '';
	
	var anchor = window.$(el).closest('.topichead').find('a[href*="forumuserinfo.php"]');
	var tmpUrl = anchor.attr('href').replace('http://www.sg.hu/', '');

	if(anchor.children('img').length > 0) {
		nick = anchor.children('img').attr('title').replace(" - VIP", "");
	
	} else {
		nick = anchor.html().replace(" - VIP", "");
	}
	
	if(confirm('Biztos tiltólistára teszed "'+nick+'" nevű felhasználót?')) {
	
		window.$('.topichead a[href="'+tmpUrl+'"]').each(function() {
			
			// Remove the comment
			window.$(this).closest('center').animate({ height : 0, opacity : 0 }, 500, function() {
				window.$(this).remove();
			})
		});
	
		if(nick != '') { 
		
			// If theres in no entry in localStorage
			if(typeof widget.preferences['block_list'] == "undefined") {
				widget.preferences['block_list'] = '';
			}
		
			// If the blocklist is empty
			if(widget.preferences['block_list'] == '') { 
				widget.preferences['block_list'] = nick;
		
			// If the blocklist is not empty
			} else {
				var blocklist = new Array();
					blockList = widget.preferences['block_list'].split(',');
					if(blockList.indexOf(nick) == -1) { blockList.push(nick);  widget.preferences['block_list'] = blockList; }
			}
		}
	}
}

function customListStyles() {
	
	// Set the dotted background on left sidebar
	window.$('.b-h-o-head').next().each(function() {
	
		window.$(this).css('background', 'transparent url('+chrome.extension.getURL('/img/dotted_left.png')+') repeat-y');
	});
	
	// Set the dotted background on right sidebar
	window.$('.b-h-b-head').next().each(function() {
	
		window.$(this).css('background', 'transparent url('+chrome.extension.getURL('/img/dotted_right.png')+') repeat-y');
	});	
	
	// Set flecks for topics
	window.$('.cikk-bal-etc2').css('background', 'transparent url('+chrome.extension.getURL('/img/fleck_sub.png')+') no-repeat');
	
	// Set flecks for forum cats
	window.$('.std0').css({
		'padding-left' : 15,
		'background' : 'transparent url('+chrome.extension.getURL('/img/fleck_main.png')+') no-repeat',
		'margin' : '5px 0px'
	
	});
	
	if(dataStore['custom_list_styles_merlinw'] == 'true') {
		window.$('.std0').find('b').css('color', '#ffffff');
		window.$('.std0').find('b').css('background-color', '#6c9ff7');
		window.$('.std0').find('b').css('padding', '2px');
	} else {
		window.$('.std0').find('b').css('color', '#f0920a');
	}
	
	// EXCEPTIONS
	
	// Hi user
	if(isLoggedIn()) {
		window.$('.b-h-o-head:first').next().css('background', 'none');
	}
	
	// Popular topics
	if(isLoggedIn()) {
		window.$('.b-h-o-head:eq(4)').next().css({ 'background' : 'none', 'padding-left' : 5 });
	} else {
		window.$('.b-h-o-head:eq(2)').next().css({ 'background' : 'none', 'padding-left' : 5 });
	}
	
	// User search
	window.$('.b-h-b-head:eq(1)').next().css('background', 'none');
	
	// Forum stat
	window.$('.b-h-b-head:eq(4)').next().css('background', 'none');
	window.$('.b-h-b-head:eq(4)').next().find('.std0').css({ 'background' : 'none', 'padding-left' : 0 });
}


var autoLoadNextPage = {
	
	progress : false,
	currPage : null,
	maxPage : null,
	counter : 0,
	
	init : function() {
		
		// Current page index
		autoLoadNextPage.currPage = parseInt(window.$('.lapozo:last span.current:first').html());
		
		// Get max page number 
		autoLoadNextPage.maxPage = parseInt(window.$('.lapozo:last a:last').prev().html());
		
		window.$(document).scroll(function() {
			
			var docHeight = window.$('body').height();
			var scrollTop = window.$('html').scrollTop();

			if(docHeight - scrollTop < 3000 && !autoLoadNextPage.progress && autoLoadNextPage.currPage < autoLoadNextPage.maxPage) {
				alert('megy');
				autoLoadNextPage.progress = true;
				autoLoadNextPage.load();
			}
		});
		
	},
	
	load : function() {
		
		// Url to call
		var url = document.location.href.substring(0, 44);
		
		// Make the ajax query
		window.$.get(url+'&index='+(autoLoadNextPage.currPage+1)+'', function(data) {
			
			// Create the 'next page' indicator
			if(dataStore['threaded_comments'] != 'true') {
				window.$('<div class="ext_autopager_idicator">'+(autoLoadNextPage.currPage+1)+'. oldal</div>').insertBefore('.std1:last');
			}
			
			var tmp = window.$(data);
			var tmp = tmp.find('.topichead');
			
			tmp.each(function() {
				
				window.$(this).closest('center').insertBefore('.std1:last');
			
			});
			
			autoLoadNextPage.progress = false;
			autoLoadNextPage.currPage++;
			autoLoadNextPage.counter++;
			
			// Reinit settings

			// threaded comments
			if(dataStore['threaded_comments'] == 'true') {
				threadedComments.sort();
			}

			// highlight_comments_for_me
			if(dataStore['highlight_comments_for_me'] == 'true' && isLoggedIn()) {
				highlightCommentsForMe();
			}
			
			// show menitoned comment
			if(dataStore['show_mentioned_comments'] == 'true') {
				showMentionedComment.init();
			}
			
		});
	}

};


var scrollToDocumentTop = {
	
	init : function() {
		
		window.$('<div id="ext_scrolltop">&#9650;</div>').prependTo('body');	
		
		window.$('#ext_scrolltop').click(function() {
			scrollToDocumentTop.scroll();
		});
	},
	
	scroll : function() {
		window.$('html').animate({ scrollTop : 0 }, 1000);
	}
	
};

function replyTo() {
	window.$('.msg-replyto a').live('click', function(e) {
	
		// Prevent default submisson
		e.preventDefault();
		
		// Get original link params
		var _params = window.$(this).attr('href').split(':');
		
		// Run replacement funciton
		eval('ext_'+_params[1]+'');
	});
}


function ext_valaszmsg(target, id, no, callerid) {
	
	if (window.$('#'+target).css('display') != 'block') {
		var url = '/listazas_egy.php3?callerid=2&id=' + id + '&no=' + no;
		window.$.get(url, function(data) { 
			window.$('#'+target).html(data).hide().slideDown();
		});
	}
	else { window.$('#'+target).slideUp(); }
}

var overlayReplyTo = {
	
	opened : false,
	
	init : function() {
		window.$('.topichead a:contains("válasz erre")').live('click', function(e) {
			
			// Prevent default submission
			e.preventDefault();
			
			// Get ref msg ID and comment element
			var msgno = window.$(this).attr('href').match(/\d+/g);
			var entry = window.$(this).closest('center');

			// Call show method
			overlayReplyTo.show(entry, msgno);
		});
	},
	
	show : function(comment, msgno) {

		// Return when the user is not logged in
		if(!isLoggedIn()) { alert('Nem vagy bejelentkezve!'); return; }
		
		// Prevent multiple instances
		if(overlayReplyTo.opened) {
			return false;
		
		// Set opened status
		} else {
			overlayReplyTo.opened = true;
		}
		
		// Create the hidden layer
		window.$('<div class="ext_hidden_layer"></div>').prependTo('body').hide().fadeTo(300, 0.9);
		
		// Highlight the reply comment
		var comment_clone = window.$(comment).clone().prependTo('body').addClass('ext_highlighted_comment');
		
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
		var textarea_clone = window.$('textarea:first').closest('div').clone().prependTo('body').addClass('ext_clone_textarea');
		
		// Textarea position
		var top = window.$(comment_clone).offset().top + window.$(comment_clone).height();
	
		
		var left = window.$(document).width() / 2 - 405;
			textarea_clone.delay(350).css({ top : top + 200, left : left, opacity : 0 }).animate({ top : top + 10, opacity : 1 }, 300);
			
		// Change textarea name attr to avoid conflicts
		window.$('form[name=newmessage]:gt(0)').attr('name', 'tmp');
		
		// Set msg no input
		textarea_clone.find('input[name=no_ref]').attr('value', msgno);
		
		// Autoscroll
		var pageBottom	= window.$(window).scrollTop() + window.$(window).height();
		var textBottom 	= window.$('.ext_clone_textarea').offset().top + window.$('.ext_clone_textarea').height();

		if(textBottom > pageBottom) { 
			var scT = textBottom - window.$(window).height() + 50;
			window.$('body').animate( { scrollTop : scT }, 500);
		}
		
		// Set the textarea focus
		textarea_clone.find('textarea').focus();
		
		// Add close button
		var close_btm = window.$('<span id="ext_close_overlay">X</span>').prependTo(textarea_clone).addClass('ext_overlay_close');
		

		// Add Close event
		window.$(close_btm).click(function() {
			window.$(textarea_clone).fadeTo(100, 0, function() {
				window.$(this).remove();
				window.$(comment_clone).fadeTo(100, 0, function() {
					window.$(this).remove();
					window.$('.ext_hidden_layer').fadeTo(300, 0, function() {
						window.$(this).remove();
						window.$('form[name=tmp]:first').attr('name', 'newmessage');
						
						// Set back opened status
						overlayReplyTo.opened = false;
					});
				});
			});
		});
	}
};


function highlightCommentsForMe() {
	
	// Return false when no username set
	if(userName == '') {
		return false;
	}
	
	// Get the proper domnodes
	var comments = window.$('.msg-replyto a:contains("'+userName+'")').closest('center');
	
	// Iterate over them
	comments.each(function() {
		
		if(window.$(this).find('.ext_comments_for_me_indicator').length == 0) {
		
			window.$(this).css('position', 'relative').append('<span class="ext_comments_for_me_indicator">--</span>');
		}
	});
	
}


var threadedComments = {
	
	init : function() {
		// New message counter
		var newMsg = document.location.href.split('&newmsg=')[1];

		// Mark new messages if any
		if(typeof newMsg != "undefined" && newMsg != '') {
			window.$('.topichead:lt('+newMsg+')').find('a:last').after( window.$('<span> | </span> <span class="ext_new_comment" style="color: red;">ÚJ</span>') );
		}
	
		// Set prev and next button if any new messages
		if(newMsg > 0) {
			
			window.$('<span class="thread_prev">&laquo;</span>').insertBefore( window.$('.ext_new_comment') );
			window.$('<span class="thread_next">&raquo;</span>').insertAfter( window.$('.ext_new_comment') );
			
			// Bind events
			window.$('.thread_prev').live('click', function() {
				threadedComments.prev(this);
			});

			window.$('.thread_next').live('click', function() {
				threadedComments.next(this);
			});
		}
		
		// Sort comments to thread
		threadedComments.sort();
	},

	prev : function(ele) {
		
		// Get the index value of the current element
		var index = window.$(ele).index('.thread_prev');
		
		// Check if is it the first element
		if(index == 0) {
			return false;
		}
		
		var target = window.$('.ext_new_comment').eq((index-1)).closest('center').children('table');
		
		// Target offsets
		var windowHalf = window.$(window).height() / 2;
		var targetHalf = window.$(target).outerHeight() / 2;
		var targetTop = window.$(target).offset().top;
		var targetOffset = targetTop - (windowHalf - targetHalf);
		
		// Scroll to target element
		window.$('html').animate({ scrollTop : targetOffset}, 500);
	},
	
	next : function(ele) {
		
		// Get the index value of the current element
		var index = window.$(ele).index('.thread_next');
		
		// Check if is it the last element
		if(index+1 >= window.$('.ext_new_comment').length) {
			return false;
		}
		
		var target = window.$('.ext_new_comment').eq((index+1)).closest('center').children('table');

		// Target offsets
		var windowHalf = window.$(window).height() / 2;
		var targetHalf = window.$(target).outerHeight() / 2;
		var targetTop = window.$(target).offset().top;
		var targetOffset = targetTop - (windowHalf - targetHalf);
		
		// Scroll to target element
		window.$('html').animate({ scrollTop : targetOffset}, 500);
	},
	
	sort : function() {
		// Sort to thread
		window.$( window.$('.topichead:not(.checked)').closest('center').get().reverse() ).each(function() {
		
			// Check if theres an answered message
			if(window.$(this).find('.msg-replyto a').length == 0) {
			
				// Add checked class
				window.$(this).find('.topichead:first').addClass('checked');
				
				// Return true
				return true;
			}
		
			// Get answered comment numer
			var commentNum = window.$(this).find('.msg-replyto a').html().split('#')[1].match(/\d+/g)
			
			
			// Seach for parent node via comment number
			window.$( window.$(this) ).appendTo( window.$('.topichead a:contains("#'+commentNum+'"):last').closest('center') );
		
			// Set style settings
			window.$(this).css({ 'margin-left' : 15, 'padding-left' : 15, 'border-left' : '1px solid #ddd' });
			window.$(this).find('.topichead').parent().css('width', 810 - (window.$(this).parents('center').length-2) * 30);
			window.$(this).find('.msg-replyto').remove();
			
			// Add checked class
			window.$(this).find('.topichead:first').addClass('checked');

		});
	}
};

function monitorNewCommentsNotification() {
	
	setInterval(function(){
		
		if(window.$('#ujhszjott a').length > 0) {	
		
			var topic_url = window.$('#ujhszjott a').attr('href').substring(0, 27);
			var comment_c = window.$('#ujhszjott a').text().match(/\d+/g);
			
			window.$('#ujhszjott a').attr('href',  topic_url + '&newmsg=' + comment_c);
		}
	
	}, 1000);
}

var showMentionedComment = {

	init : function() {
		
		window.$('.maskwindow:not(.checked)').each(function() {

			// Search and replace mentioned comment numbers
			if( window.$(this).html().match(/\#\d+/g) ){
				if( window.$(this).html().match(/<a[^>]+>\#\d+<\/a>/g) && dataStore['show_mentioned_comments_in_links'] == 'true' ) {
					var replaced = window.$(this).html().replace(/<a[^>]+>(\#\d+)<\/a>/g, "<span class=\"ext_mentioned\">$1</span>");
				} else if( !window.$(this).html().match(/<.*\#\d+.*>/g) ) {
					var replaced = window.$(this).html().replace(/(\#\d+)/g, "<span class=\"ext_mentioned\">$1</span>");					
				}

				// Change the text in the original comment
				window.$(this).html(replaced);
			}
			
			// Change the text in the original comment
			window.$(this).html(replaced);
			
			// Add a special class to not run again this comment
			window.$(this).addClass('checked');
		});
		
		// Attach click events
		window.$('.ext_mentioned').unbind('click').click(function(e) {
		
			// Prevent browser default submission
			e.preventDefault();
			
			// Call the show method
			showMentionedComment.show(this);
		});
	},
	
	show : function(ele) {
		
		// Get comment number
		var no = window.$(ele).html().match(/\d+/g);
		
		// Get topic ID
		var id = document.location.href.split('?id=')[1];
			id = id.split('#')[0];
			id = id.split('&')[0];
		
		var target = window.$(ele).closest('.msg-text').next().attr('id');
		
		eval("ext_valaszmsg('"+target+"', "+id+", "+no+", 2);");
	}
};


var blocks = {
	
	init : function() {
		
		// Set blocks IDs
		blocks.setIDs();
		
		// Check localStorage for config
		if( typeof dataStore['blocks_config'] == 'undefined') {
			blocks.buildConfig();
		}
		
		// Execute config
		blocks.executeConfig();
		
		// Set overlays
		if(dataStore['hide_blocks_buttons'] == 'false') {
			blocks.setOverlay();
		}
	
	},
	
	setIDs : function() {
		
		// Blocks counter
		var counter = 1;
		
		// Left side blocks
		window.$('.b-h-o-head, .b-h-b-head').parent().each(function() {
			
			// Set the ID
			window.$(this).attr('class', 'ext_block').attr('id', 'block-'+counter);
			
			// Increase the counter
			counter++;
		});
	},
	
	buildConfig : function() {
		
		// Var for config
		var config = [];
		
		// Iterate over the blocks
		window.$('.ext_block').each(function(index) {
			
			var tmp = {
				
				id 			: window.$(this).attr('id'),
				visibility	: true,
				contentHide	: false,
				side		: window.$(this).find('.b-h-o-head').length > 0 ? 'left' : 'right',
				index 		: index
			};
			
			config.push(tmp);
			
		});

		
		// Store in localStorage
		port.postMessage({ type : "setBlocksConfig", data : JSON.stringify(config) });
	},
	
	
	setConfigByKey : function(id, key, value) {
		
		var config = JSON.parse(dataStore['blocks_config']);
		
		for(c = 0; c < config.length; c++) {

			if(config[c]['id'] == id) {
				config[c][key] = value;
			}
		}
	
		// Store in localStorage
		port.postMessage({ type : "setBlocksConfig", data : JSON.stringify(config) });
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
		window.$('.ext_block').each(function(index) {
			
			var tmp = {
				
				id 			: window.$(this).attr('id'),
				visibility	: blocks.getConfigValByKey(window.$(this).attr('id'), 'visibility'),
				contentHide	: blocks.getConfigValByKey(window.$(this).attr('id'), 'contentHide'),
				side		: window.$(this).find('.b-h-o-head').length > 0 ? 'left' : 'right',
				index 		: index
			};
			
			_config.push(tmp);
			
		});

		
		// Store in localStorage
		port.postMessage({ type : "setBlocksConfig", data : JSON.stringify(_config) });
	},
	
	executeConfig : function() {
		
		var config = JSON.parse(dataStore['blocks_config']);
			config = config.reverse();
			
		for(c = 0; c < config.length; c++) {

			// Visibility
			if( config[c]['visibility'] == false ) {
				blocks.hide(config[c]['id'], false);
			}

			// ContentHide
			if( config[c]['contentHide'] == true ) {
				blocks.contentHide(config[c]['id'], false);
			}
			
			// Side and pos
			if( config[c]['side'] == 'left' ) {
				
				window.$('#'+config[c]['id']).prependTo('table:eq(3) td:eq(0)');
				
			} else {
				
				window.$('#'+config[c]['id']).prependTo('table:eq(3) td:eq(2) table:first tr > td:eq(2)');
			}
		}
		
		// Maintain style settings
		window.$('table:eq(3) td:eq(0)').find('.b-h-b-head').removeClass('b-h-b-head').addClass('b-h-o-head');
		window.$('table:eq(3) td:eq(0)').find('.hasab-head-b').removeClass('hasab-head-b').addClass('hasab-head-o');
		window.$('table:eq(3) td:eq(0)').find('img[src="images/ful_b_l.png"]').attr('src', 'images/ful_o_l.png');

		// Maintain style settings
		window.$('table:eq(3) td:eq(2) table:first tr > td:eq(2)').find('.b-h-o-head').removeClass('b-h-o-head').addClass('b-h-b-head');
		window.$('table:eq(3) td:eq(2) table:first tr > td:eq(2)').find('.hasab-head-o').removeClass('hasab-head-o').addClass('hasab-head-b');
		window.$('table:eq(3) td:eq(2) table:first tr > td:eq(2)').find('img[src="images/ful_o_l.png"]').attr('src', 'images/ful_b_l.png');
	
	},
	
	setOverlay : function() {
		
		window.$('.ext_block').each(function() {
			
			var item = window.$('<p class="ext_blocks_buttons"></p>').prependTo(this);

			// Contenthide
			window.$('<img src="'+chrome.extension.getURL('img/blocks/minimalize.png')+'" class="ext_block_button_right">').prependTo(item).click(function(e) {
				e.preventDefault();
				blocks.contentHide( window.$(this).closest('div').attr('id'), true );
			});

			// Hide
			window.$('<img src="'+chrome.extension.getURL('img/blocks/close.png')+'" class="ext_block_button_right">').prependTo(item).click(function(e) {
				e.preventDefault();
				blocks.hide( window.$(this).closest('div').attr('id'), true );
			});
			

			// Down
			window.$('<img src="'+chrome.extension.getURL('img/blocks/down.png')+'" class="ext_block_button_left">').prependTo(item).click(function(e) {
				e.preventDefault();
				blocks.down( window.$(this).closest('div').attr('id'), true );
			});

			// Up
			window.$('<img src="'+chrome.extension.getURL('img/blocks/up.png')+'" class="ext_block_button_left">').prependTo(item).click(function(e) {
				e.preventDefault();
				blocks.up( window.$(this).closest('div').attr('id'), true );
			});						

			// Right
			window.$('<img src="'+chrome.extension.getURL('img/blocks/right.png')+'" class="ext_block_button_left">').prependTo(item).click(function(e) {
				e.preventDefault();
				blocks.right( window.$(this).closest('div').attr('id'), true );
			});			
			// Left
			window.$('<img src="'+chrome.extension.getURL('img/blocks/left.png')+'" class="ext_block_button_left">').prependTo(item).click(function(e) {
				e.preventDefault();
				blocks.left( window.$(this).closest('div').attr('id'), true );
			});

		});
	},
	
	hide : function(id, clicked) {
		
		if(clicked == true) {
			// Change the config
			blocks.setConfigByKey( id, 'visibility', false);
		
			// Hide the item
			window.$('#'+id).slideUp(200);
		} else {
			window.$('#'+id).hide();
		}
	},
	
	contentHide : function(id, clicked) {
		
		if(clicked == false) {
			window.$('#'+id).children('div:eq(1)').hide();
			return true;
		}
		
		if( window.$('#'+id).children('div:eq(1)').css('display') == 'none' ) {
		
			// Change the config
			blocks.setConfigByKey( id, 'contentHide', false);
		
			// Hide the item
			window.$('#'+id).children('div:eq(1)').slideDown(200);
		
		} else {

			// Change the config
			blocks.setConfigByKey( id, 'contentHide', true);
		
			// Hide the item
			window.$('#'+id).children('div:eq(1)').slideUp(200);
		}
	},
	
	left : function(id) {
		
		// Check current side settings
		if(window.$('#'+id).find('.b-h-o-head').length == 0) {
		
			// Move the block
			window.$('#'+id).prependTo('table:eq(3) td:eq(0)');

			// Maintain style settings
			window.$('#ext_left_sidebar').find('.b-h-b-head').removeClass('b-h-b-head').addClass('b-h-o-head');
			window.$('#ext_left_sidebar').find('.hasab-head-b').removeClass('hasab-head-b').addClass('hasab-head-o');
			window.$('#ext_left_sidebar').find('img[src="images/ful_b_l.png"]').attr('src', 'images/ful_o_l.png');
		
			// Store data in localStorage
			blocks.reindexOrderConfig();
		}
	},

	right : function(id) {
		
		// Check current side settings
		if(window.$('#'+id).find('.b-h-b-head').length == 0) {
		
			// Move the block
			window.$('#'+id).prependTo('table:eq(3) td:eq(2) table:first tr > td:eq(2)');

			// Maintain style settings
			window.$('#ext_right_sidebar').find('.b-h-o-head').removeClass('b-h-o-head').addClass('b-h-b-head');
			window.$('#ext_right_sidebar').find('.hasab-head-o').removeClass('hasab-head-o').addClass('hasab-head-b');
			window.$('#ext_right_sidebar').find('img[src="images/ful_o_l.png"]').attr('src', 'images/ful_b_l.png');
	
			// Store data in localStorage
			blocks.reindexOrderConfig();
		}
	},
	
	up: function(id) {
		
		// Get index val
		var index = window.$('#'+id).index('.ext_block');

		// Current position
		if( window.$('#'+id).closest('#ext_left_sidebar').length > 0 ) {
		
			if(index == 0) {
				return false;
			}
		
		} else {

			var first = window.$('#ext_left_sidebar .ext_block').length;
			if(index == first) {
				return false;
			}
		}
		
		// Move to target
		window.$('#'+id).insertBefore('.ext_block:eq('+(index-1)+')');		

		// Store data in localStorage
		blocks.reindexOrderConfig();
	},
	
	down : function(id) {

		// Get index val
		var index = window.$('#'+id).index('.ext_block');
		
		// Current position
		if( window.$('#'+id).closest('#ext_left_sidebar').length > 0 ) {
			
			var last = window.$('#ext_left_sidebar .ext_block').length - 1;
			
			if(last == index) {
				return false;
			}
		}
		
		// Move to target
		window.$('#'+id).insertAfter('.ext_block:eq('+(index+1)+')');

		// Store data in localStorage
		blocks.reindexOrderConfig();
	}
};

function extInit() {
	
	// FORUM.PHP
	if(document.location.href.match('forum.php')) {

		// setPredefinedVars
		setPredefinedVars();
		
		// Custom blocks
		if(dataStore['custom_blocks'] == 'true') {
			blocks.init();
		}
		
		// Remove chat window
		if(dataStore['chat_hide'] == 'true') {
			removeChatWindow();
		}
		
		// Jump the last unreaded message
		if(dataStore['jump_unreaded_messages'] == 'true' && isLoggedIn() ) {
			jumpLastUnreadedMessage.init();
		}
		
		// Faves: show only with unreaded messages
		if(dataStore['fav_show_only_unreaded'] == 'true' && isLoggedIn() ) {
			filterOutReadedFaves();
		}

		// Faves: short comment marker
		if(dataStore['short_comment_marker'] == 'true'&& isLoggedIn() ) {
			shortCommentMarker();
		}

		// Custom list styles
		if(dataStore['custom_list_styles'] == 'true') {
			customListStyles();
		}

	}
	
	// LISTAZAS.PHP
	else if(document.location.href.match(/listazas.php3\?id/gi)) {

		// setPredefinedVars
		setPredefinedVars();
		
		// Monitor the new comments notification
		monitorNewCommentsNotification();
		
		//gradual_comments
		if(dataStore['threaded_comments'] == 'true') {
			threadedComments.init();
		}
		
		// Jump the last unreaded message
		if(dataStore['jump_unreaded_messages'] && isLoggedIn() ) {
			jumpLastUnreadedMessage.jump();
		}
		
		// Block users/messages
		if(dataStore['block_list'] != '') {
			blockMessages();
		}
		
		// setBlockButton
		setBlockButton();
		
		// Load next page when scrolling down
		if(dataStore['autoload_next_page'] == 'true') {
			autoLoadNextPage.init();
		}
		
		// Scroll to page top button
		if(dataStore['scroll_to_page_top'] == 'true') {
			scrollToDocumentTop.init();
		}
		
		// Animated replyto
		if(dataStore['animated_reply_to'] == 'true') {
			replyTo();
		}
		
		// Overlay reply-to
		if(dataStore['overlay_reply_to'] == 'true') {
			overlayReplyTo.init();
		}
		
		// highlight_comments_for_me
		if(dataStore['highlight_comments_for_me'] == 'true' && isLoggedIn()) {
			highlightCommentsForMe();
		}
		
		// show menitoned comment
		if(dataStore['show_mentioned_comments'] == 'true') {
			showMentionedComment.init();
		}
	}
}


opera.extension.onmessage = function(event) {

	if(event.data.type == 'getBlockedUserNameFromLink') {
		getBlockedUserNameFromLink(event.data.data);
	
	} else if(event.data.type == 'getBlockedUserNameFromImage') {
		getBlockedUserNameFromImage(event.data.data);
	}	
};


// extInit
window.$(document).ready(function() {

	// Get extesion settings
	dataStore = widget.preferences;

    // Specify the path to the stylesheet here:
    var path = 'css/userCSS.css';
    
    /* No need to change anything below this line */
    
    // Error check for the stylesheet filename.
    if (!path) {
        opera.postError('EXTENSION ERROR: No CSS file has been specified');
        return;
    }
    
    var onCSS = function(event) {
        var message = event.data;
        
        // Check this is the correct message and path from the background script.
        if (message.topic === 'LoadedInjectedCSS' && message.data.path === path) {
            // Remove the message listener so it doesn't get called again.
            opera.extension.removeEventListener('message', onCSS, false);
            
            var css = message.data.css;

            // Create a <style> element and add it to the <head> element of the current page.
            // Insert the contents of the stylesheet into the <style> element.
            var style = document.createElement('style');
            style.setAttribute('type', 'text/css');            
            style.appendChild(document.createTextNode(css));
            document.getElementsByTagName('head')[0].appendChild(style);
        }
    }

    // On receipt of a message from the background script, execute onCSS().
    opera.extension.addEventListener('message', onCSS, false);
    
    // Send the stylesheet path to the background script to get the CSS.
    opera.extension.postMessage({
        topic: 'LoadInjectedCSS',
        data: path
    });

	extInit();
});
