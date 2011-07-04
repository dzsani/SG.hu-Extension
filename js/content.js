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
		
			// Url to rewrite
			var url = document.location.href.substring(0, 44);
		
			// Update the url to avoid re-jump
			history.replaceState({ page : url }, '', url);
			
			// Remove original HR tag
			$('a[name=pirosvonal]').remove();
			
		}, 1000, target);

		
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

	$($('.b-h-o-head:eq(2)').next().find('div a').get().reverse()).each(function() {
		
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
		$('.b-h-o-head:eq(2)').next().find('div:last').after('<p id="ext_filtered_faves_error">Nincs olvasatlan topik</p>');
	}
	
	// Set the "show" button
	$('.b-h-o-head:eq(2)').append('<div id="ext_show_filtered_faves"></div>');
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
	
	$('.b-h-o-head:eq(2)').next().find('div a').each(function() {
		
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
	
	$('.std0').find('b').css('color', '#f0920a');
	
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
				threadedComments.sortByOffset( autoLoadNextPage.counter * 80 - 1 );
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
		$( $('.topichead').closest('center').get().reverse() ).each(function() {
		
			// Check if theres an answered message
			if($(this).find('.msg-replyto a').length == 0) {
				return true;
			}
		
			// Get answered comment numer
			var commentNum = $(this).find('.msg-replyto a').html().split('#')[1].match(/\d+/g)
		
			// Seach for parent node via comment number
			$( $(this) ).appendTo( $('.topichead a:contains("#'+commentNum+'")').closest('center') );
		
			// Set style settings
			$(this).css({ 'margin-left' : 15, 'padding-left' : 15, 'border-left' : '1px solid #ddd' });
			$(this).find('.topichead').parent().css('width', 810 - ($(this).parents('center').length-2) * 30);
			$(this).find('.msg-replyto').remove();
		});
	},
	
	sortByOffset : function(offset) {

		// Sort to thread
		$( $('.topichead:gt('+offset+')').closest('center').get().reverse() ).each(function() {
			
			// Check if theres an answered message
			if($(this).find('.msg-replyto a').length == 0) {
				return true;
			}
			
			// Get answered comment numer
			var commentNum = $(this).find('.msg-replyto a').html().split('#')[1].match(/\d+/g)
		
			// Seach for parent node via comment number
			$( $(this) ).appendTo( $('.topichead a:contains("#'+commentNum+'")').closest('center') );
		
			// Set style settings
			$(this).css({ 'margin-left' : 15, 'padding-left' : 15, 'border-left' : '1px solid #ddd' });
			$(this).find('.topichead').parent().css('width', 810 - ($(this).parents('center').length-2) * 30);
			$(this).find('.msg-replyto').remove();
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
			var repaced = $(this).html().replace(/(\#\d+)/g, "<span class=\"ext_mentioned\">$1</span>");

			// Change the text in the original comment
			$(this).html(repaced);
			
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

function extInit() {

	// FORUM.PHP
	if(document.location.href.match('forum.php')) {

		// setPredefinedVars
		setPredefinedVars();
		
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