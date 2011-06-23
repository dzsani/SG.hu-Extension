

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
		
		// Target comment ele
		var target = $('.topichead').closest('center').eq(lastMsg-1);
		
		// Insert the horizontal rule
		$('<hr>').insertAfter(target).attr('id', 'ext_unreaded_hr');

		// Autoscroll
		$('body').delay(1000).animate({ scrollTop : targetOffset}, 500);
		
		// Target offsets
		var windowHalf = $(window).height() / 2;
		var targetHalf = $(target).outerHeight() / 2;
		var targetTop = $(target).offset().top;
		var targetOffset = targetTop - (windowHalf - targetHalf);
		
		// Scroll to target element
		$('body').delay(1000).animate({ scrollTop : targetOffset}, 500);
		
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
		
		var username = ($(this).find("table tr:eq(0) td:eq(0) a img").length == 1) ? $(this).find("table tr:eq(0) td:eq(0) a img").attr("alt") : $(this).find("table tr:eq(0) td:eq(0) a")[0].innerHTML;
			username = username.replace(/ - VIP/, "");
		
		for(var i = 0; i < deletelist.length; i++) {
			if(username.toLowerCase() == deletelist[i].toLowerCase()) {
				$(this).parent().remove();
			}
		}
	});
}

function getBlockedUserNameFromButton(el) {

	var userName = '';
	
	var anchor = $(el).closest('.topichead').find('a[href*="forumuserinfo.php"]');
	var tmpUrl = anchor.attr('href').replace('http://www.sg.hu/', '');
	
	if(anchor.children('img').length > 0) {
		userName = anchor.children('img').attr('title').replace(" - VIP", "");
	
	} else {
		userName = anchor.html().replace(" - VIP", "");
	}
	
	if(confirm('Biztos tiltólistára teszed "'+userName+'" nevű felhasználót?')) {
	
		$('.topichead a[href='+tmpUrl+']').each(function() {
	
			// Remove the comment
			$(this).closest('center').animate({ height : 0, opacity : 0 }, 500, function() {
				$(this).remove();
			})
		});
	
		if(userName != '') { port.postMessage({ type : "setBlockedUser", data : userName }); }
	}
}

function getBlockedUserNameFromLink(data) {

	var userName = '';
	var tmpUrl = data['linkUrl'].replace('http://www.sg.hu/', '');
	
	$('.topichead a[href='+tmpUrl+']').each(function() {
	
		// Fetch username
		userName = $(this).html();
		
		// Remove the comment
		$(this).closest('center').animate({ height : 0, opacity : 0 }, 500, function() {
			$(this).remove();
		})
	});
	
	if(userName != '') { port.postMessage({ type : "setBlockedUser", data : userName }); }
}


function getBlockedUserNameFromImage(data) {

	var userName = '';
	var tmpUrl = data['srcUrl'].replace('http://www.sg.hu', '');
	
	$('.topichead img[src='+tmpUrl+']').each(function() {
	
		// Fetch the username
		userName = ($(this).attr('title').replace(' - VIP', ''));
		
		// Remove the comment
		$(this).closest('center').animate({ height : 0, opacity : 0 }, 500, function() {
			$(this).remove();
		})
	});
	
	if(userName != '') { port.postMessage({ type : "setBlockedUser", data : userName }); }
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
			$('<div class="ext_autopager_idicator">'+(autoLoadNextPage.currPage+1)+'. oldal</div>').insertBefore('.std1:last');
			
			var tmp = $(data);
			var tmp = tmp.find('.topichead');
			
			tmp.each(function() {
				
				$(this).closest('center').insertBefore('.std1:last');
			
			});
			
			autoLoadNextPage.progress = false;
			autoLoadNextPage.currPage++;
			
			// Reinit settings
			
			// highlight_comments_for_me
			if(dataStore['highlight_comments_for_me'] == 'true' && isLoggedIn()) {
				highlightCommentsForMe();
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
			$('#'+target).css('display', 'block');
			replyTo();
			overlayReplyTo.init();
		});
	}
	else { $('#'+target).slideUp(); }
}

var overlayReplyTo = {
	
	
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
	
		// Create the hidden layer
		$('<div class="ext_hidden_layer"></div>').prependTo('body').hide().fadeTo(300, 0.9);
		
		// Highlight the reply comment
		var comment_clone = $(comment).clone().insertBefore(comment).addClass('ext_highlighted_comment');
		
		
		// Create textarea clone
		var textarea_clone = $('textarea:first').closest('div').clone().insertBefore(comment).addClass('ext_clone_textarea');
		
		// Textarea position
		var top = $(comment).offset().top + $(comment).height();
		
		var left = $(document).width() / 2 - 405;
			textarea_clone.delay(350).css({ top : top + 200, left : left, opacity : 0 }).animate({ top : top + 10, opacity : 1 }, 300);
			
		// Change textarea name attr to avoid conflicts
		$('form[name=newmessage]:first').attr('name', 'tmp');
		
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
					});
				});
			});
		});
	}
};


function highlightCommentsForMe() {
	var userName = getUserName();
	var comments = $('.msg-replyto a:contains("'+getUserName()+'")').closest('center');
	
	comments.each(function() {
		
		if($(this).find('.ext_comments_for_me_indicator').length == 0) {
		
			$(this).css('position', 'relative').append('<img src="'+chrome.extension.getURL('img/comments_for_me_indicator.png')+'" class="ext_comments_for_me_indicator">');
		}
	});
	
}

$(document).ready(function() {

	// FORUM.PHP
	if(document.location.href.match('forum.php')) {
	
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
	
	}
});


var dataStore;
var port = chrome.extension.connect();


port.postMessage({ type : "getStorageData" });

port.onMessage.addListener(function(response) {

	if(response.type == 'setStorageData') {
		dataStore = response.data;
	
	} else if(response.type == 'getBlockedUserNameFromLink') {
		getBlockedUserNameFromLink(response.data);
	
	} else if(response.type == 'getBlockedUserNameFromImage') {
		getBlockedUserNameFromImage(response.data);
	}	
});