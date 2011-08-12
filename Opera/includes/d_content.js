// Predefined vars
var userName, isLoggedIn, dataStore;

dataStore = widget.preferences;

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


var chat_hide = {
	
	activated : function() {

		window.$('table:eq(3) td:eq(2) center:eq(0) *:lt(2)').hide();
		window.$('table:eq(3) td:eq(2) br').hide();
	},
	
	disabled : function() {

		window.$('table:eq(3) td:eq(2) center:eq(0) *:lt(2)').show();
		window.$('table:eq(3) td:eq(2) br').show();	
	}
}


var jump_unreaded_messages = {
	
	activated : function() {
	
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
	
	disabled : function() {
	
		window.$('.ext_faves').next().find('a').each(function() {
			
			if( window.$(this).attr('href').indexOf('&order') != -1) {
				
				var start = window.$(this).attr('href').indexOf('&order');
				
				window.$(this).attr('href', window.$(this).attr('href').substring(0, start));
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
			window.$('body').animate({ scrollTop : targetOffset}, 500);
			
			// Remove original HR tag
			window.$('a[name=pirosvonal]').remove();
			
		}, 1000, target);

		// Url to rewrite
		var url = document.location.href.substring(0, 44);

		// Update the url to avoid re-jump
		history.replaceState({ page : url }, '', url);
	}
	
};

var fav_show_only_unreaded = {
	
	activated : function() {
	
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
			window.$('.ext_faves').next().find('div:last').after('<p id="ext_filtered_faves_error">Nincs olvasatlan topik</p>');
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
	},
	
	disabled : function() {
		
		// Remove hidden class
		window.$('.ext_hidden_fave').removeClass('ext_hidden_fave');
		
		// Remove toggle button
		window.$('#ext_show_filtered_faves').remove();
	}
};


var short_comment_marker = {
	
	activated : function() {
	
		window.$('.ext_faves').next().find('div a').each(function() {
		
			if( window.$(this).find('small').length > 0) {
			
				// Received new messages counter
				var newMsg = parseInt( window.$(this).find('small').html().match(/\d+/g) );
			
				// Remove the old marker text
				window.$(this).find('br').hide();
				window.$(this).find('font:last').hide();
			
				// Add the new marker after the topic title
				window.$(this).html( window.$(this).html() + ' <span class="ext_short_comment_marker" style="color: red;">'+newMsg+'</span>');
			}
		});
	},
	
	disabled : function() {
	
		window.$('.ext_faves').next().find('div a').each(function() {
		
			if( window.$(this).find('small').length > 0) {
						
				// Remove the old marker text
				window.$(this).find('br').show();
				window.$(this).find('font:last').show();
			
				// Add the new marker after the topic title
				
				window.$(this).find('.ext_short_comment_marker').remove();
			}
		});
	}
};

var blocklist =  {
	
	
	init : function() {

		// Create the block buttons
		window.$('.topichead a[href*="forummsg.php"]').each(function() {
			window.$('<a href="#" class="block_user">letiltás</a> <span>| </span> ').insertBefore(this);
		});
	
		// Create the block evenst
		window.$('.block_user').click(function(e) {
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

		window.$(".topichead").each( function() {
		
			var nick = (window.$(this).find("table tr:eq(0) td:eq(0) a img").length == 1) ? window.$(this).find("table tr:eq(0) td:eq(0) a img").attr("alt") : window.$(this).find("table tr:eq(0) td:eq(0) a")[0].innerHTML;
				nick = nick.replace(/ - VIP/, "");
		
			for(var i = 0; i < deletelist.length; i++) {
				if(nick.toLowerCase() == deletelist[i].toLowerCase()) {
					window.$(this).parent().hide();
				}
			}
		});
	},
	
	block : function(el) {

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
					window.$(this).hide();
				})
			});
		
			// Post message
			opera.extension.postMessage({ name : "addToBlocklist", message : nick });
		
			// Add name to blocklist 
			window.$('<li><span>'+nick+'</span> <a href="#">töröl</a></li>').appendTo('#ext_blocklist')
		
			// Remove empty blocklist message
			window.$('#ext_empty_blocklist').remove();
		}
	},
	
	unblock : function(user) {

		window.$(".topichead").each( function() {
		
			var nick = (window.$(this).find("table tr:eq(0) td:eq(0) a img").length == 1) ? window.$(this).find("table tr:eq(0) td:eq(0) a img").attr("alt") : window.$(this).find("table tr:eq(0) td:eq(0) a")[0].innerHTML;
				nick = nick.replace(/ - VIP/, "");

			if(nick.toLowerCase() == user.toLowerCase()) {

				// Show temporary the comment height
				window.$(this).closest('center').css({ display : 'block', height : 'auto' });
				
				// Get height
				var height = window.$(this).closest('center').height();
				
				// Set back to invisible, then animate
				window.$(this).closest('center').css({ height : 0 }).animate({ opacity : 1, height : height }, 500);
			}
		});
	}
};






var highlight_forum_categories = {
	
	activated : function() {
		window.$('.std0').find('b').css('color', '#ffffff');
		window.$('.std0').find('b').css('background-color', '#6c9ff7');
		window.$('.std0').find('b').css('padding', '2px');
	},
	
	disabled : function() {
		window.$('.std0').find('b').css('color', '#444');
		window.$('.std0').find('b').css('background-color', '#fff');
		window.$('.std0').find('b').css('padding', '0px');
	}
}


var autoload_next_page = {
	
	progress : false,
	currPage : null,
	maxPage : null,
	counter : 0,
	
	activated : function() {
		
		// Current page index
		autoload_next_page.currPage = parseInt(window.$('.lapozo:last span.current:first').html());
		
		// Get max page number 
		autoload_next_page.maxPage = parseInt(window.$('.lapozo:last a:last').prev().html());
		
		window.$(document).scroll(function() {
			
			var docHeight = window.$('body').height();
			var scrollTop = window.$('body').scrollTop();

			if(docHeight - scrollTop < 3000 && !autoload_next_page.progress && autoload_next_page.currPage < autoload_next_page.maxPage) {
				autoload_next_page.progress = true;
				autoload_next_page.load();
			}
		});
		
	},
	
	disabled : function() {
		
		window.$(document).unbind('scroll');
	},
	
	load : function() {
		
		// Url to call
		var url = document.location.href.substring(0, 44);
		
		// Make the ajax query
		window.$.get(url+'&index='+(autoload_next_page.currPage+1)+'', function(data) {
			
			// Create the 'next page' indicator
			if(dataStore['threaded_comments'] != 'true') {
				window.$('<div class="ext_autopager_idicator">'+(autoload_next_page.currPage+1)+'. oldal</div>').insertBefore('.std1:last');
			}
			
			var tmp = window.$(data);
			var tmp = tmp.find('.topichead');
			
			tmp.each(function() {
				
				window.$(this).closest('center').insertBefore('.std1:last');
			
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
		window.$('<div id="ext_scrolltop">&#9650;</div>').prependTo('body');	
		
		// Add click event to scrolltop button
		window.$('#ext_scrolltop').click(function() {
			window.$('body').animate({ scrollTop : 0 }, 1000);
		});

		// Created the back button
		window.$('<div id="ext_back">&#9664;</div>').prependTo('body');	
		
		// Add event to back button
		window.$('#ext_back').click(function() {
			document.location.href = 'forum.php';
		});
	},
	
	disabled : function() {
	
		window.$('#ext_scrolltop').remove();
		window.$('#ext_back').remove();
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

var overlay_reply_to = {
	
	opened : false,
	
	activated : function() {
	
		window.$('.topichead a:contains("válasz erre")').live('click', function(e) {
			
			// Prevent default submission
			e.preventDefault();

			// Get ref msg ID and comment element
			var msgno = window.$(this).attr('href').match(/\d+/g);
			var entry = window.$(this).closest('center');

			// Call show method
			overlay_reply_to.show(entry, msgno);
		});
	},
	
	disabled : function() {
	
		window.$('.topichead a:contains("válasz erre")').die('click');
	
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
		
		var img = "iVBORw0KGgoAAAANSUhEUgAAACMAAAAiCAYAAADVhWD8AAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAABW1JREFUeNqkmP1LZFUYx493x9kZs/Fl1XHX1VZWpSVsDcnFzc1dSXBzy7RAKgxLfxEEhWCjXwTpt/6FflAwydAMTdMUQVACxajVigSh1KzcMMeX9X08fZ/hOcPxzr3joA98mOHec+/53ufc87zcKCmlsLEo5gLjZC5qRPM5A9CN/OAIHIB9jQM+TuePeWyIOcIIMfg8CXCBp0y4NUFKjBKyB3bAE7DN/3dYmC7qVDEGo4vwgHiQwL/Z4BZIAok8jmyVJ/0Z/ADWwDrwgQ2wBXZZVIiXokzLZGhLEsMiLvGkV0A5uMuCTjPy0G/gK/AreMzifOytPfZSUJAuRhcSyxOmgMvgPnidvSDm5+fF5OSkmJ6eFgsLC2JjYyNwg9zcXJGamipKS0tFSUmJuq+fvdQGfmfvkahNFnQYXDISA0iUA8SAFPAsuAveA+OSbWxsTFZXV0t+krBkZGTItrY2qdlj0ALKwQvgKvAAJzACTmExF4ALXALZoBh8AObVnZqamiISYQbekuPjwefZAZ+yoJvgCohlR0Qpr0SDOHANFIK3wU909eLioiwqKjqTEIXL5ZJdXV1K0Bb4CJSCGyAZuMkhyiu0PKmstgJ8Hbhqa0vm5OScS4hOb2+vEvQXe/4lkMmOiBbslXiQBe6Bh2CfrrB7P9xut4yNjbWdNDk52fJ4QkKCnJqaUoK+A2+wA7zkHcEuIq/kgTdBYDS51U7I0NCQnJiYsBRUWFgY8GhjY6Pl9WVlZUoMPXATeJm94yExT/O7codPHtJIevGshIyMjAS3h1mQEqKsoaHBUlBfX58aMgReA8+BJBKTwFv5PuihETTYSghtbbMpQWYh4QSVl5er06vgHfAi7SyDc8tFjrg3KPb09PSEhFO/3y92d3dDjmOnCWxdAY8JiAq5Znt7O+SawcFBsbS0JDioZnCecwre66TsXbBOcjMzMy3d63Q65cDAgIzEjo6OZE1Nje1L3t/fr4Z+xts829CyMyW7OJK7vLxsnWwODkRVVZUYHh4Om5TII/X19aKjo8N2DKURtlRVihhaTiIfR62vrws8lX32g6CKiopAbrKz5uZm0d7eHlawz+dTf2NUTWTwAWlX8FhZQUGByMvLsz2P+BTy/pxiUmXqY+YJBybhcDhsr6IXFnEm7GSRjImPD1YhO0qDoZWKe1wAifT09DNPEunYrKws9fcfLiP8gkuGmxx9Z+n1rq2ttSwJrOIIGUVbispWZhWziJWVFTXkIUfha3rQozj9JZ2l7Wt1g9bW1pDJ6urqTqQJ3dbW1mR+fn7IfSorK9WQv/Wgp9LBM6CIHlKlA6ubmAWZPagLshNCaLHqG/BATwcuzpq0VFXgexrV3d1tG7BIkNVSKkGdnZ22QrRUsMcPf0dPlKqEuM4V3odckdkmurPi9Xrl7OysEvMt107P6yWEKq68fIKy6OfqivNWeTbLswjeB7e5YggWV6rspOI4A9yiukoV4oiUAdeeR4TH49GrPB97/xXeOEn8qhiqIDf4QCJXfLSONeCRukNLS8uZhBQXF8uZmRm9/v2EyxVahcvmgtzcqlCBnMN7n7bdsF672L24Vl0BbQLN/gQfg1e5qgxpVfQmTjX5qrahVjaZm7h74C2uP8Tq6qqAMDE6OhpInHNzc4HmLS0tTSA4CngjEIHZKLpPgC/AH9zE/cet7okmzq69jdba20Rub1O4vb0NrkaQ/FTPTZUa1Qv/cie5we3tfrj21tz4R5sa/zhueeNZTD64zrWQlyfY5F76F/Aj/1dsao2/+kQiwzX+Vp9ElKgYm08iDvam3ScRxR5741CrFE5OGsHHIl2U/rHIafGx6NjmY9GhSYTlpP8LMABrw9+qClj5kgAAAABJRU5ErkJggg==";
		
		// Add close button
		var close_btm = window.$('<img src="data:image/png;base64,'+img+'" id="ext_close_overlay">').prependTo(textarea_clone).addClass('ext_overlay_close');
		

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
						overlay_reply_to.opened = false;
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
		var comments = window.$('.msg-replyto a:contains("'+userName+'")').closest('center');
	
		// Iterate over them
		comments.each(function() {
		
			if(window.$(this).find('.ext_comments_for_me_indicator').length == 0) {
				
				var img = "iVBORw0KGgoAAAANSUhEUgAAAAwAAAAMCAYAAABWdVznAAAACXBIWXMAAAsTAAALEwEAmpwYAAAKT2lDQ1BQaG90b3Nob3AgSUNDIHByb2ZpbGUAAHjanVNnVFPpFj333vRCS4iAlEtvUhUIIFJCi4AUkSYqIQkQSoghodkVUcERRUUEG8igiAOOjoCMFVEsDIoK2AfkIaKOg6OIisr74Xuja9a89+bN/rXXPues852zzwfACAyWSDNRNYAMqUIeEeCDx8TG4eQuQIEKJHAAEAizZCFz/SMBAPh+PDwrIsAHvgABeNMLCADATZvAMByH/w/qQplcAYCEAcB0kThLCIAUAEB6jkKmAEBGAYCdmCZTAKAEAGDLY2LjAFAtAGAnf+bTAICd+Jl7AQBblCEVAaCRACATZYhEAGg7AKzPVopFAFgwABRmS8Q5ANgtADBJV2ZIALC3AMDOEAuyAAgMADBRiIUpAAR7AGDIIyN4AISZABRG8lc88SuuEOcqAAB4mbI8uSQ5RYFbCC1xB1dXLh4ozkkXKxQ2YQJhmkAuwnmZGTKBNA/g88wAAKCRFRHgg/P9eM4Ors7ONo62Dl8t6r8G/yJiYuP+5c+rcEAAAOF0ftH+LC+zGoA7BoBt/qIl7gRoXgugdfeLZrIPQLUAoOnaV/Nw+H48PEWhkLnZ2eXk5NhKxEJbYcpXff5nwl/AV/1s+X48/Pf14L7iJIEyXYFHBPjgwsz0TKUcz5IJhGLc5o9H/LcL//wd0yLESWK5WCoU41EScY5EmozzMqUiiUKSKcUl0v9k4t8s+wM+3zUAsGo+AXuRLahdYwP2SycQWHTA4vcAAPK7b8HUKAgDgGiD4c93/+8//UegJQCAZkmScQAAXkQkLlTKsz/HCAAARKCBKrBBG/TBGCzABhzBBdzBC/xgNoRCJMTCQhBCCmSAHHJgKayCQiiGzbAdKmAv1EAdNMBRaIaTcA4uwlW4Dj1wD/phCJ7BKLyBCQRByAgTYSHaiAFiilgjjggXmYX4IcFIBBKLJCDJiBRRIkuRNUgxUopUIFVIHfI9cgI5h1xGupE7yAAygvyGvEcxlIGyUT3UDLVDuag3GoRGogvQZHQxmo8WoJvQcrQaPYw2oefQq2gP2o8+Q8cwwOgYBzPEbDAuxsNCsTgsCZNjy7EirAyrxhqwVqwDu4n1Y8+xdwQSgUXACTYEd0IgYR5BSFhMWE7YSKggHCQ0EdoJNwkDhFHCJyKTqEu0JroR+cQYYjIxh1hILCPWEo8TLxB7iEPENyQSiUMyJ7mQAkmxpFTSEtJG0m5SI+ksqZs0SBojk8naZGuyBzmULCAryIXkneTD5DPkG+Qh8lsKnWJAcaT4U+IoUspqShnlEOU05QZlmDJBVaOaUt2ooVQRNY9aQq2htlKvUYeoEzR1mjnNgxZJS6WtopXTGmgXaPdpr+h0uhHdlR5Ol9BX0svpR+iX6AP0dwwNhhWDx4hnKBmbGAcYZxl3GK+YTKYZ04sZx1QwNzHrmOeZD5lvVVgqtip8FZHKCpVKlSaVGyovVKmqpqreqgtV81XLVI+pXlN9rkZVM1PjqQnUlqtVqp1Q61MbU2epO6iHqmeob1Q/pH5Z/YkGWcNMw09DpFGgsV/jvMYgC2MZs3gsIWsNq4Z1gTXEJrHN2Xx2KruY/R27iz2qqaE5QzNKM1ezUvOUZj8H45hx+Jx0TgnnKKeX836K3hTvKeIpG6Y0TLkxZVxrqpaXllirSKtRq0frvTau7aedpr1Fu1n7gQ5Bx0onXCdHZ4/OBZ3nU9lT3acKpxZNPTr1ri6qa6UbobtEd79up+6Ynr5egJ5Mb6feeb3n+hx9L/1U/W36p/VHDFgGswwkBtsMzhg8xTVxbzwdL8fb8VFDXcNAQ6VhlWGX4YSRudE8o9VGjUYPjGnGXOMk423GbcajJgYmISZLTepN7ppSTbmmKaY7TDtMx83MzaLN1pk1mz0x1zLnm+eb15vft2BaeFostqi2uGVJsuRaplnutrxuhVo5WaVYVVpds0atna0l1rutu6cRp7lOk06rntZnw7Dxtsm2qbcZsOXYBtuutm22fWFnYhdnt8Wuw+6TvZN9un2N/T0HDYfZDqsdWh1+c7RyFDpWOt6azpzuP33F9JbpL2dYzxDP2DPjthPLKcRpnVOb00dnF2e5c4PziIuJS4LLLpc+Lpsbxt3IveRKdPVxXeF60vWdm7Obwu2o26/uNu5p7ofcn8w0nymeWTNz0MPIQ+BR5dE/C5+VMGvfrH5PQ0+BZ7XnIy9jL5FXrdewt6V3qvdh7xc+9j5yn+M+4zw33jLeWV/MN8C3yLfLT8Nvnl+F30N/I/9k/3r/0QCngCUBZwOJgUGBWwL7+Hp8Ib+OPzrbZfay2e1BjKC5QRVBj4KtguXBrSFoyOyQrSH355jOkc5pDoVQfujW0Adh5mGLw34MJ4WHhVeGP45wiFga0TGXNXfR3ENz30T6RJZE3ptnMU85ry1KNSo+qi5qPNo3ujS6P8YuZlnM1VidWElsSxw5LiquNm5svt/87fOH4p3iC+N7F5gvyF1weaHOwvSFpxapLhIsOpZATIhOOJTwQRAqqBaMJfITdyWOCnnCHcJnIi/RNtGI2ENcKh5O8kgqTXqS7JG8NXkkxTOlLOW5hCepkLxMDUzdmzqeFpp2IG0yPTq9MYOSkZBxQqohTZO2Z+pn5mZ2y6xlhbL+xW6Lty8elQfJa7OQrAVZLQq2QqboVFoo1yoHsmdlV2a/zYnKOZarnivN7cyzytuQN5zvn//tEsIS4ZK2pYZLVy0dWOa9rGo5sjxxedsK4xUFK4ZWBqw8uIq2Km3VT6vtV5eufr0mek1rgV7ByoLBtQFr6wtVCuWFfevc1+1dT1gvWd+1YfqGnRs+FYmKrhTbF5cVf9go3HjlG4dvyr+Z3JS0qavEuWTPZtJm6ebeLZ5bDpaql+aXDm4N2dq0Dd9WtO319kXbL5fNKNu7g7ZDuaO/PLi8ZafJzs07P1SkVPRU+lQ27tLdtWHX+G7R7ht7vPY07NXbW7z3/T7JvttVAVVN1WbVZftJ+7P3P66Jqun4lvttXa1ObXHtxwPSA/0HIw6217nU1R3SPVRSj9Yr60cOxx++/p3vdy0NNg1VjZzG4iNwRHnk6fcJ3/ceDTradox7rOEH0x92HWcdL2pCmvKaRptTmvtbYlu6T8w+0dbq3nr8R9sfD5w0PFl5SvNUyWna6YLTk2fyz4ydlZ19fi753GDborZ752PO32oPb++6EHTh0kX/i+c7vDvOXPK4dPKy2+UTV7hXmq86X23qdOo8/pPTT8e7nLuarrlca7nuer21e2b36RueN87d9L158Rb/1tWeOT3dvfN6b/fF9/XfFt1+cif9zsu72Xcn7q28T7xf9EDtQdlD3YfVP1v+3Njv3H9qwHeg89HcR/cGhYPP/pH1jw9DBY+Zj8uGDYbrnjg+OTniP3L96fynQ89kzyaeF/6i/suuFxYvfvjV69fO0ZjRoZfyl5O/bXyl/erA6xmv28bCxh6+yXgzMV70VvvtwXfcdx3vo98PT+R8IH8o/2j5sfVT0Kf7kxmTk/8EA5jz/GMzLdsAAAAgY0hSTQAAeiUAAICDAAD5/wAAgOkAAHUwAADqYAAAOpgAABdvkl/FRgAAAJVJREFUeNqU0q8KwgAQx/HPht3qe2gxrRosVt/DLAxMvohBFCwaTbMoiL6EySqszLAV5zbdL90d9z3uX5BlmTbqWPa6WCHGqTF79hAW5ggJjoiamLDkRwWUFEUqgbQiPsQeZ0zKwKuhgz42uGFa1VKdUjz/AS4YY4BDvtb6xBi77zt86o45tvWHy3XFAutfwwRtX+M9AGGwHi5YGX/EAAAAAElFTkSuQmCC";
				
				window.$(this).css('position', 'relative').append('<img src="data:image/png;base64,'+img+'" class="ext_comments_for_me_indicator">');
			}
		});
	},
	
	disabled : function() {
	
		window.$('.ext_comments_for_me_indicator').remove();
	}	
};


var threaded_comments = {
	
	activated : function() {
		// New message counter
		var newMsg = document.location.href.split('&newmsg=')[1];

		// Mark new messages if any
		if(typeof newMsg != "undefined" && newMsg != '') {
			window.$('.topichead:lt('+newMsg+')').find('a:last').after( window.$('<span class="thread_sep"> | </span> <span class="ext_new_comment" style="color: red;">ÚJ</span>') );
		}
	
		// Set prev and next button if any new messages
		if(newMsg > 0) {
			
			window.$('<span class="thread_prev">&laquo;</span>').insertBefore( window.$('.ext_new_comment') );
			window.$('<span class="thread_next">&raquo;</span>').insertAfter( window.$('.ext_new_comment') );
			
			// Bind events
			window.$('.thread_prev').live('click', function() {
				threaded_comments.prev(this);
			});

			window.$('.thread_next').live('click', function() {
				threaded_comments.next(this);
			});
		}
		
		// Sort comments to thread
		threaded_comments.sort();
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
		window.$('body').animate({ scrollTop : targetOffset}, 500);
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
		window.$('body').animate({ scrollTop : targetOffset}, 500);
	},
	
	sort : function() {
		// Sort to thread
		window.$( window.$('.topichead:not(.checked)').closest('center').get().reverse() ).each(function() {
		
			// Check if theres an answered message
			if(window.$(this).find('.msg-replyto a').length == 0) {
			
				// Add checked class
				window.$(this).find('.topichead:first').addClass('checked');
				
				// Return 'true'
				return true;
			}
		
			// Get answered comment numer
			var commentNum = window.$(this).find('.msg-replyto a').html().split('#')[1].match(/\d+/g);
			
			
			// Seach for parent node via comment number
			window.$( window.$(this) ).appendTo( window.$('.topichead a:contains("#'+commentNum+'"):last').closest('center') );
		
			// Set style settings
			window.$(this).css({ 'margin-left' : 15, 'padding-left' : 15, 'border-left' : '1px solid #ddd' });
			window.$(this).find('.topichead').parent().css('width', 810 - (window.$(this).parents('center').length-2) * 30);
			window.$(this).find('.msg-replyto').hide();
			
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

var show_mentioned_comments = {

	activated : function() {
		
		window.$('.maskwindow:not(.checked)').each(function() {

			// Search and replace mentioned comment numbers
			if( window.$(this).html().match(/\#\d+/g) ){
				if( window.$(this).html().match(/<a[^>]+>\#\d+<\/a>/g) && dataStore['show_mentioned_comments_in_links'] == 'true' ) {
					var replaced = window.$(this).html().replace(/<a[^>]+>(\#\d+)<\/a>/g, "<span class=\"ext_mentioned\">window.$1</span>");
				} else if( !window.$(this).html().match(/<.*\#\d+.*>/g) ) {
					var replaced = window.$(this).html().replace(/(\#\d+)/g, "<span class=\"ext_mentioned\">window.$1</span>");					
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
			show_mentioned_comments.show(this);
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
	
		window.$('.ext_blocks_buttons').remove();
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
				visibility	: custom_blocks.getConfigValByKey(window.$(this).attr('id'), 'visibility'),
				contentHide	: custom_blocks.getConfigValByKey(window.$(this).attr('id'), 'contentHide'),
				side		: window.$(this).find('.b-h-o-head').length > 0 ? 'left' : 'right',
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
			
			var minimalizeImg	= "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";
			var closeImg		= "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";
			var downImg			= "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";
			var upImg			= "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";
			var rightImg		= "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";
			var leftImg			= "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";
			
			// Contenthide
			window.$('<img src="data:image/png;base64,'+minimalizeImg+'" class="ext_block_button_right">').prependTo(item).click(function(e) {
				e.preventDefault();
				custom_blocks.contentHide( window.$(this).closest('div').attr('id'), true );
			});

			// Hide
			window.$('<img src="data:image/png;base64,'+closeImg+'" class="ext_block_button_right">').prependTo(item).click(function(e) {
				e.preventDefault();
				custom_blocks.hide( window.$(this).closest('div').attr('id'), true );
			});
			

			// Down
			window.$('<img src="data:image/png;base64,'+downImg+'" class="ext_block_button_left">').prependTo(item).click(function(e) {
				e.preventDefault();
				custom_blocks.down( window.$(this).closest('div').attr('id'), true );
			});

			// Up
			window.$('<img src="data:image/png;base64,'+upImg+'" class="ext_block_button_left">').prependTo(item).click(function(e) {
				e.preventDefault();
				custom_blocks.up( window.$(this).closest('div').attr('id'), true );
			});						

			// Right
			window.$('<img src="data:image/png;base64,'+rightImg+'" class="ext_block_button_left">').prependTo(item).click(function(e) {
				e.preventDefault();
				custom_blocks.right( window.$(this).closest('div').attr('id'), true );
			});			
			// Left
			window.$('<img src="data:image/png;base64,'+leftImg+'" class="ext_block_button_left">').prependTo(item).click(function(e) {
				e.preventDefault();
				custom_blocks.left( window.$(this).closest('div').attr('id'), true );
			});

		});
	},
	
	hide : function(id, clicked) {
		
		if(clicked == true) {
			// Change the config
			custom_blocks.setConfigByKey( id, 'visibility', false);
		
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
			custom_blocks.setConfigByKey( id, 'contentHide', false);
		
			// Hide the item
			window.$('#'+id).children('div:eq(1)').show();
		
		} else {

			// Change the config
			custom_blocks.setConfigByKey( id, 'contentHide', true);
		
			// Hide the item
			window.$('#'+id).children('div:eq(1)').hide();
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
			custom_blocks.reindexOrderConfig();
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
			custom_blocks.reindexOrderConfig();
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
		custom_blocks.reindexOrderConfig();
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
		custom_blocks.reindexOrderConfig();
	}
};


function extInit() {
	
	// Settings
	cp.init();
	
	// FORUM.PHP
	if(document.location.href.match('forum.php')) {

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

	}
	
	// LISTAZAS.PHP
	else if(document.location.href.match(/listazas.php3\?id/gi)) {
		
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

// extInit
if (window.top === window) {
	window.$(document).ready(function() {
    
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

		extInit();
	});
}

