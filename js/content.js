// Predefined vars
var userName, isLoggedIn;

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

function removeChatWindow() {

	$('table:eq(3) td:eq(2) center:eq(0) *:lt(2)').remove();
	$('table:eq(3) td:eq(2) br').remove();
}

var  jumpLastUnreadedMessage = {
	
	init : function() {
		$('.b-h-o-head:eq(2)').next().find('a').each(function() {
			
			// If theres a new message
			if($(this).find('small').length > 0) {
			
				// Get the new messages count
				var newMsg = parseInt($(this).find('small').html().match(/\d+/g));
				
				// Get last msn's page number
				var page = Math.ceil( newMsg / 80 );
				
				// Rewrite the url
				$(this).attr('href', $(this).attr('href') + '&order=reverse&index='+page+'&newmsg='+newMsg+'');
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
			
			// Remove original HR tag
			$('a[name=pirosvonal]').remove();
			
		}, 1000, target);

		// Url to rewrite
		var url = document.location.href.substring(0, 44);

		// Update the url to avoid re-jump
		history.replaceState({ page : url }, '', url);
		
		/*
		// Watch offsetTop while the content loads completly
		var interval = setInterval(function(){
			// Target offsetTop
			var targetOffset = $(target).offset().top;
		
			// Scroll to target element
			$('body').animate({ scrollTop : targetOffset}, 200);
		}, 200, target);
		
		// Clear interval when the page loads
		$(window).load(function() {
     		clearInterval(interval);
		});
		*/
	}
	
};

function filterOutReadedFaves() {

	var counter = 0;
	var counterAll = 0;

	$($('#ext_faves').next().find('div a').get().reverse()).each(function() {
		
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
	if(counterAll == 0) {
		$('#ext_faves').next().find('div:last').after('<p id="ext_filtered_faves_error">Nincs olvasatlan topik</p>');
	}
	
	// Set the "show" button
	$('#ext_faves').append('<div id="ext_show_filtered_faves"></div>');
	$('#ext_show_filtered_faves').append('<span id="ext_show_filtered_faves_arrow"></span>');
	
	// Apply some styles
	$('#ext_show_filtered_faves_arrow').attr('class', 'show');

	// Set event handling
	$('#ext_show_filtered_faves').toggle(
		function() {
			$('#ext_filtered_faves_error').hide();
			$('#ext_show_filtered_faves_arrow').attr('class', 'hide');
			$('.ext_hidden_fave').show();
		},
		function() {
			$('#ext_filtered_faves_error').show();
			$('#ext_show_filtered_faves_arrow').attr('class', 'show');
			$('.ext_hidden_fave').hide(); 
		}
	);
}


function shortCommentMarker() {
	
	$('#ext_faves').next().find('div a').each(function() {
		
		if( $(this).find('small').length > 0) {
			
			// Received new messages counter
			var newMsg = parseInt( $(this).find('small').html().match(/\d+/g) );
			
			// Remove the old marker text
			$(this).find('br').remove();
			$(this).find('font:last').remove();
			
			// Add the new marker after the topic title
			$(this).html( $(this).html() + ' <span style="color: red;">'+newMsg+'</span>');
		}
	
	});
}

function setBlockButton() {
	
	// Create the block buttons
	$('.topichead a[href*="forummsg.php"]').each(function() {
	
		$('<a href="#" class="block_user">letiltás</a> <span>| </span> ').insertBefore(this);
	});
	
	// Create the block evenst
	$('.block_user').click(function(e) {
	
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

	$(".topichead").each( function() {
		
		var nick = ($(this).find("table tr:eq(0) td:eq(0) a img").length == 1) ? $(this).find("table tr:eq(0) td:eq(0) a img").attr("alt") : $(this).find("table tr:eq(0) td:eq(0) a")[0].innerHTML;
			nick = nick.replace(/ - VIP/, "");
		
		for(var i = 0; i < deletelist.length; i++) {
			if(nick.toLowerCase() == deletelist[i].toLowerCase()) {
				$(this).parent().remove();
			}
		}
	});
}

function getBlockedUserNameFromButton(el) {

	var nick = '';
	
	var anchor = $(el).closest('.topichead').find('a[href*="forumuserinfo.php"]');
	var tmpUrl = anchor.attr('href').replace('http://www.sg.hu/', '');
	
	if(anchor.children('img').length > 0) {
		nick = anchor.children('img').attr('title').replace(" - VIP", "");
	
	} else {
		nick = anchor.html().replace(" - VIP", "");
	}
	
	if(confirm('Biztos tiltólistára teszed "'+nick+'" nevű felhasználót?')) {
	
		$('.topichead a[href='+tmpUrl+']').each(function() {
	
			// Remove the comment
			$(this).closest('center').animate({ height : 0, opacity : 0 }, 500, function() {
				$(this).remove();
			})
		});
	
		if(nick != '') { port.postMessage({ type : "setBlockedUser", data : nick }); }
	}
}

function getBlockedUserNameFromLink(data) {

	var nick = '';
	var tmpUrl = data['linkUrl'].replace('http://www.sg.hu/', '');
	
	$('.topichead a[href='+tmpUrl+']').each(function() {
	
		// Fetch username
		nick = $(this).html();
		
		// Remove the comment
		$(this).closest('center').animate({ height : 0, opacity : 0 }, 500, function() {
			$(this).remove();
		})
	});
	
	if(nick != '') { port.postMessage({ type : "setBlockedUser", data : nick }); }
}


function getBlockedUserNameFromImage(data) {

	var nick = '';
	var tmpUrl = data['srcUrl'].replace('http://www.sg.hu', '');
	
	$('.topichead img[src='+tmpUrl+']').each(function() {
	
		// Fetch the username
		nick = ($(this).attr('title').replace(' - VIP', ''));
		
		// Remove the comment
		$(this).closest('center').animate({ height : 0, opacity : 0 }, 500, function() {
			$(this).remove();
		})
	});
	
	if(nick != '') { port.postMessage({ type : "setBlockedUser", data : nick }); }
}


function customListStyles() {
	
	// Set the dotted background on left sidebar
	$('.b-h-o-head').next().each(function() {
	
		$(this).css('background', 'transparent url('+chrome.extension.getURL('/img/dotted_left.png')+') repeat-y');
	});
	
	// Set the dotted background on right sidebar
	$('.b-h-b-head').next().each(function() {
	
		$(this).css('background', 'transparent url('+chrome.extension.getURL('/img/dotted_right.png')+') repeat-y');
	});	
	
	// Set flecks for topics
	$('.cikk-bal-etc2').css('background', 'transparent url('+chrome.extension.getURL('/img/fleck_sub.png')+') no-repeat');
	
	// Set flecks for forum cats
	$('.std0').css({
		'padding-left' : 15,
		'background' : 'transparent url('+chrome.extension.getURL('/img/fleck_main.png')+') no-repeat',
		'margin' : '5px 0px'
	
	});
	
	if(dataStore['custom_list_styles_merlinw'] == 'true') {
		$('.std0').find('b').css('color', '#ffffff');
		$('.std0').find('b').css('background-color', '#6c9ff7');
		$('.std0').find('b').css('padding', '2px');
	} else {
		$('.std0').find('b').css('color', '#f0920a');
	}
	
	// EXCEPTIONS
	
	// Hi user
	if(isLoggedIn()) {
		$('.b-h-o-head:first').next().css('background', 'none');
	}
	
	// Popular topics
	if(isLoggedIn()) {
		$('.b-h-o-head:eq(4)').next().css({ 'background' : 'none', 'padding-left' : 5 });
	} else {
		$('.b-h-o-head:eq(2)').next().css({ 'background' : 'none', 'padding-left' : 5 });
	}
	
	// User search
	$('.b-h-b-head:eq(1)').next().css('background', 'none');
	
	// Forum stat
	$('.b-h-b-head:eq(4)').next().css('background', 'none');
	$('.b-h-b-head:eq(4)').next().find('.std0').css({ 'background' : 'none', 'padding-left' : 0 });
}


var autoLoadNextPage = {
	
	progress : false,
	currPage : null,
	maxPage : null,
	counter : 0,
	
	init : function() {
		
		// Current page index
		autoLoadNextPage.currPage = parseInt($('.lapozo:last span.current:first').html());
		
		// Get max page number 
		autoLoadNextPage.maxPage = parseInt($('.lapozo:last a:last').prev().html());
		
		$(document).scroll(function() {
			
			var docHeight = $('body').height();
			var scrollTop = $('body').scrollTop();

			if(docHeight - scrollTop < 3000 && !autoLoadNextPage.progress && autoLoadNextPage.currPage < autoLoadNextPage.maxPage) {
				autoLoadNextPage.progress = true;
				autoLoadNextPage.load();
			}
		});
		
	},
	
	load : function() {
		
		// Url to call
		var url = document.location.href.substring(0, 44);
		
		// Make the ajax query
		$.get(url+'&index='+(autoLoadNextPage.currPage+1)+'', function(data) {
			
			// Create the 'next page' indicator
			if(dataStore['threaded_comments'] != 'true') {
				$('<div class="ext_autopager_idicator">'+(autoLoadNextPage.currPage+1)+'. oldal</div>').insertBefore('.std1:last');
			}
			
			var tmp = $(data);
			var tmp = tmp.find('.topichead');
			
			tmp.each(function() {
				
				$(this).closest('center').insertBefore('.std1:last');
			
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
		
		$('<div id="ext_scrolltop">&#9650;</div>').prependTo('body');	
		
		$('#ext_scrolltop').click(function() {
			scrollToDocumentTop.scroll();
		});
	},
	
	scroll : function() {
		$('body').animate({ scrollTop : 0 }, 1000);
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

var overlayReplyTo = {
	
	opened : false,
	
	init : function() {
		$('.topichead a:contains("válasz erre")').live('click', function(e) {
			
			// Prevent default submission
			e.preventDefault();
			
			// Get ref msg ID and comment element
			var msgno = $(this).attr('href').match(/\d+/g);
			var entry = $(this).closest('center');

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
		
		// Set the textarea focus
		textarea_clone.find('textarea').focus();
		
		// Add close button
		var close_btm = $('<img src="'+chrome.extension.getURL('img/overlay_close.png')+'" id="ext_close_overlay">').prependTo(textarea_clone).addClass('ext_overlay_close');
		

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
	var comments = $('.msg-replyto a:contains("'+userName+'")').closest('center');
	
	// Iterate over them
	comments.each(function() {
		
		if($(this).find('.ext_comments_for_me_indicator').length == 0) {
		
			$(this).css('position', 'relative').append('<img src="'+chrome.extension.getURL('img/comments_for_me_indicator.png')+'" class="ext_comments_for_me_indicator">');
		}
	});
	
}


var threadedComments = {
	
	init : function() {
		// New message counter
		var newMsg = document.location.href.split('&newmsg=')[1];

		// Mark new messages if any
		if(typeof newMsg != "undefined" && newMsg != '') {
			$('.topichead:lt('+newMsg+')').find('a:last').after( $('<span> | </span> <span class="ext_new_comment" style="color: red;">ÚJ</span>') );
		}
	
		// Set prev and next button if any new messages
		if(newMsg > 0) {
			
			$('<span class="thread_prev">&laquo;</span>').insertBefore( $('.ext_new_comment') );
			$('<span class="thread_next">&raquo;</span>').insertAfter( $('.ext_new_comment') );
			
			// Bind events
			$('.thread_prev').live('click', function() {
				threadedComments.prev(this);
			});

			$('.thread_next').live('click', function() {
				threadedComments.next(this);
			});
		}
		
		// Sort comments to thread
		threadedComments.sort();
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
				
				// Return true
				return true;
			}
		
			// Get answered comment numer
			var commentNum = $(this).find('.msg-replyto a').html().split('#')[1].match(/\d+/g)
			
			
			// Seach for parent node via comment number
			$( $(this) ).appendTo( $('.topichead a:contains("#'+commentNum+'"):last').closest('center') );
		
			// Set style settings
			$(this).css({ 'margin-left' : 15, 'padding-left' : 15, 'border-left' : '1px solid #ddd' });
			$(this).find('.topichead').parent().css('width', 810 - ($(this).parents('center').length-2) * 30);
			$(this).find('.msg-replyto').remove();
			
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

var showMentionedComment = {

	init : function() {
		
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
			showMentionedComment.show(this);
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
		$('.ext_block').each(function(index) {
			
			var tmp = {
				
				id 			: $(this).attr('id'),
				visibility	: blocks.getConfigValByKey($(this).attr('id'), 'visibility'),
				contentHide	: blocks.getConfigValByKey($(this).attr('id'), 'contentHide'),
				side		: $(this).find('.b-h-o-head').length > 0 ? 'left' : 'right',
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
			$('<img src="'+chrome.extension.getURL('img/blocks/minimalize.png')+'" class="ext_block_button_right">').prependTo(item).click(function(e) {
				e.preventDefault();
				blocks.contentHide( $(this).closest('div').attr('id'), true );
			});

			// Hide
			$('<img src="'+chrome.extension.getURL('img/blocks/close.png')+'" class="ext_block_button_right">').prependTo(item).click(function(e) {
				e.preventDefault();
				blocks.hide( $(this).closest('div').attr('id'), true );
			});
			

			// Down
			$('<img src="'+chrome.extension.getURL('img/blocks/down.png')+'" class="ext_block_button_left">').prependTo(item).click(function(e) {
				e.preventDefault();
				blocks.down( $(this).closest('div').attr('id'), true );
			});

			// Up
			$('<img src="'+chrome.extension.getURL('img/blocks/up.png')+'" class="ext_block_button_left">').prependTo(item).click(function(e) {
				e.preventDefault();
				blocks.up( $(this).closest('div').attr('id'), true );
			});						

			// Right
			$('<img src="'+chrome.extension.getURL('img/blocks/right.png')+'" class="ext_block_button_left">').prependTo(item).click(function(e) {
				e.preventDefault();
				blocks.right( $(this).closest('div').attr('id'), true );
			});			
			// Left
			$('<img src="'+chrome.extension.getURL('img/blocks/left.png')+'" class="ext_block_button_left">').prependTo(item).click(function(e) {
				e.preventDefault();
				blocks.left( $(this).closest('div').attr('id'), true );
			});

		});
	},
	
	hide : function(id, clicked) {
		
		if(clicked == true) {
			// Change the config
			blocks.setConfigByKey( id, 'visibility', false);
		
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
			blocks.setConfigByKey( id, 'contentHide', false);
		
			// Hide the item
			$('#'+id).children('div:eq(1)').slideDown(200);
		
		} else {

			// Change the config
			blocks.setConfigByKey( id, 'contentHide', true);
		
			// Hide the item
			$('#'+id).children('div:eq(1)').slideUp(200);
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
			blocks.reindexOrderConfig();
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
			blocks.reindexOrderConfig();
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
		blocks.reindexOrderConfig();
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


var dataStore;
var port = chrome.extension.connect();


port.postMessage({ type : "getStorageData" });

port.onMessage.addListener(function(response) {

	if(response.type == 'setStorageData') {
		
		// Save localStorage data
		dataStore = response.data;
		
		// Add domready event
		$(document).ready(function() {
			extInit();
		});
	
	} else if(response.type == 'getBlockedUserNameFromLink') {
		getBlockedUserNameFromLink(response.data);
	
	} else if(response.type == 'getBlockedUserNameFromImage') {
		getBlockedUserNameFromImage(response.data);
	}	
});