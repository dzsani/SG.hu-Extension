var settings = {

	init : function() {
		
		// Create the settings button
		$('<div id="ext_settings_button"><img src="'+safari.extension.baseURI+'img/settings/icon.png" alt=""></div>').appendTo('body');
		
		// Create the hiding overlay
		$('<div id="ext_settings_hide_overlay"></div>').appendTo('body');
		
		// Create click event for settings pane
		$('#ext_settings_button').toggle(
			function() { settings.show(); },
			function() { settings.hide(); }
		);
		
		// Inject the html code
		var html = '';
		
		html += '<div id="ext_settings_wrapper">';
			html += '<ul id="ext_settings_header">';
				html += '<li>Névjegy</li>';
				html += '<li>Főoldal</li>';
				html += '<li>Topik</li>';
				html += '<li>Tiltólista</li>';
				html += '<li class="clear"></li>';
			html += '</ul>';
			
			html += '<div class="settings_page">';
				html += 'valami';
			html += '</div>';
			
			html += '<div class="settings_page">';
				html += '<div>';
					html += '<h3>Chat elrejtése</h3>';
					html += '<p>Ezzel az opcióval a fórum főoldalon levő közös chatet tüntethted el maradéktalanul.</p>';
					html += '<div class="button" id="chat_hide"></div>';
				html += '</div>';
				html += '<div>';
					html += '<h3>Csak olvasatlan üzenttel rendelkező kedvencek mutatása</h3>';
					html += '<p>A fórum főoldalán található kedvencek listában csak az olvasatlan üzenettel rendelkező topikok lesznek listázva. A bővítmény létrehoz tovább egy kapcsolót a kedvencek cím mellett mellyel könnyen visszaválthatsz a régi nézetre.</p>';
					html += '<div class="button" id="fav_show_only_unreaded"></div>';
				html += '</div>';
				html += '<div>';
					html += '<h3>Rövid kommentjelzők</h3>';
					html += '<p>A főoldali kedvencek listában nem jelenik meg helyet foglalva új sorban az "N új üzeneted érkezett" szöveg, ehelyett helytakarékos módon csak egy piros szám jelzi az új üzeneteket a topik neve mellett.</p>';
					html += '<div class="button" id="short_comment_marker"></div>';
				html += '</div>';
				html += '<div>';
					html += '<h3>Egyedi listaelemek</h3>';
					html += '<p class="sub">';
						html += '<label><input type="checkbox" id="custom_list_styles_merlinw"> MerlinW-féle kiemelés</label>';
					html += '</p>';
					html += '<p>A fórum főoldalon átalakított, átdizájnolt listákat láthatsz, mely jobban kiemeli többek között a kedvenceknél a fórumkategóriákat is.</p>';
					html += '<div class="button" id="custom_list_styles"></div>';
				html += '</div>';
				html += '<div>';
					html += '<h3>Blokkok átrendezése, rejtése</h3>';
					html += '<p class="sub">';
						html += '<label><input type="checkbox" id="hide_blocks_buttons"> Átrendező gombok elrejtése</label><br>';
						html += '<button type="button" id="reset_blocks_config">Alapbeállítások visszaállítása</button>';
					html += '</p>';
					html += '<p>A fórum főoldal oldalsávjain található blokkok tetszőleges átrendezése, rejtése.</p>';
					html += '<div class="button" id="custom_blocks"></div>';
				html += '</div>';
			html += '</div>';

			html += '<div class="settings_page">';
				html += '<div>';
					html += '<h3>Ugrás az utolsó üzenethez</h3>';
					html += '<p>Az "ugrás az utolsó olvasatlan üzenethez" több oldalon keresztül is működik, egy topikba lépve automatikusan az utolsó üzenethez görget.</p>';
					html += '<div class="button" id="jump_unreaded_messages"></div>';
				html += '</div>';
				html += '<div>';
					html += '<h3>Következő oldal betöltése a lap aljára érve</h3>';
					html += '<p>A lap aljára görgetve a bővítmény a háttérben betölti a következő oldal tartalmát, majd megjeleníti az új kommenteket oldalfrissítés vagy lapozás nélkül.</p>';
					html += '<div class="button" id="autoload_next_page"></div>';
				html += '</div>';
				html += '<div>';
					html += '<h3>Oldal tetejére görgető gomb</h3>';
					html += '<p>A jobb felső sarokban a bővítmény létrehoz egy gombot, melyre ráklikkelve az oldal tetejére görget.</p>';
					html += '<div class="button" id="scroll_to_page_top"></div>';
				html += '</div>';
				html += '<div>';
					html += '<h3>Animált válaszerre</h3>';
					html += '<p>A "válasz XY üzenetére" linkre kattintva animáltan nyílnak le a visszaidézett hozzászólások.</p>';
					html += '<div class="button" id="animated_reply_to"></div>';
				html += '</div>';
				html += '<div>';
					html += '<h3>Overlay kommentmező</h3>';
					html += '<p>Egy hozzászólásra válaszolva az oldal nem ugrik fel a felső textarához, ehelyett kiemeli a megválaszolandó kommentet és egy overlay szövegmező jelenik meg alatta.</p>';
					html += '<div class="button" id="overlay_reply_to"></div>';
				html += '</div>';
				html += '<div>';
					html += '<h3>Nekem érkező üzenetek kiemelése</h3>';
					html += '<p>Bármely topikban a neked címzett üzenetek mellé egy narancssárga nyíl kerül, ezzel jelezve hogy ezt az üzenetet neked szánták.</p>';
					html += '<div class="button" id="highlight_comments_for_me"></div>';
				html += '</div>';	
				html += '<div>';
					html += '<h3>Kommentek szálonkénti elrendezése</h3>';
					html += '<p>Bármely topikban a megkezdett beszélgetéseket szálonként átrendezi a script. Egy megválaszolt üzenet az eredeti üzenet alá kerül, ezzel jelezve és elkülönítve az egymásnak szánt üzeneteket.</p>';
					html += '<div class="button" id="threaded_comments"></div>';
				html += '</div>';
				html += '<div>';
					html += '<h3>Említett kommentek beidézése</h3>';
					html += '<p class="sub">';
						html += '<label><input type="checkbox" id="show_mentioned_comments_in_links"> Linkeken belüli keresés is</label>';
					html += '</p>';
					html += '<p>Bármely topikban egy beírt kommentazonosító detektálása, kattintásra az említett komment beidézése</p>';
					html += '<div class="button" id="show_mentioned_comments"></div>';
				html += '</div>';
			html += '</div>';

			html += '<div class="settings_page">';
				html += '<ul id="ext_blocklist">';
					html += '<li id="ext_empty_blocklist">Jelenleg üres a tiltólistád</li>';
				html += '</ul>';
			html += '</div>';
		html += '</div>';
		
		// Append settings pane html to body
		$(html).appendTo('body');
		
		// Set header list backgrounds
		$('#ext_settings_header li').css({ 'background-image' : 'url('+safari.extension.baseURI+'img/settings/icons.png)' });
		
		// Create tabs event
		$('#ext_settings_header li').click(function() {
			
			settings.tab( $(this).index() );
		});
		
		// Select the first tab
		settings.tab(0);
		
		// Set-up blocklist
		blocklist.init();
	},
	
	show : function() {
		
		// Set the overlay
		$('#ext_settings_hide_overlay').css({ display : 'block', opacity : 0 });
		$('#ext_settings_hide_overlay').animate({ opacity : 0.6 }, 200);
		
		// Get the viewport and panel dimensions
		var viewWidth	= $(window).width();
		var paneWidth	= $('#ext_settings_wrapper').width();
		var paneHeight	= $('#ext_settings_wrapper').height();
		var leftProp	= viewWidth / 2 - paneWidth / 2;

		// Apply calculated CSS settings to the panel
		$('#ext_settings_wrapper').css({ left : leftProp, top : '-'+(paneHeight+10)+'px' });
		
		// Reveal the panel
		$('#ext_settings_wrapper').delay(250).animate({ top : 0 }, 350);
		
	},
	
	hide : function() {
		
		// Get the settings pane height
		var paneHeight = $('#ext_settings_wrapper').height();
		
		// Hide the pane
		$('#ext_settings_wrapper').animate({ top : '-'+(paneHeight+10)+'px'}, 350, function(){
			
			// Restore the overlay
			$('#ext_settings_hide_overlay').animate({ opacity : 0 }, 200, function() {
				$(this).css('display', 'none');
			});
		});
	},
	
	tab : function(index) {
		
		// Set the current height to prevent resize
		$('#ext_settings_wrapper').css({ height : $('#ext_settings_wrapper').height() });
       
		// Hide all tab pages
		$('.settings_page').css('display', 'none');
       
		// Show the selected tab page
		$('.settings_page').eq(index).css('display', 'block');
       
		// Get new height of settings pane
		var newPaneHeight = $('#ext_settings_header').height() + $('.settings_page').eq(index).outerHeight();

		// Animate the resize
		$('#ext_settings_wrapper').stop().animate({ height : newPaneHeight }, 200, function() {
		
			// Set auto height
			$('#ext_settings_wrapper').css({ height : 'auto' });
		});
		
		// Remove all selected background in the header
		$('#ext_settings_header li').removeClass('on');
		
		// Add selected background to the selectad tab button
		$('#ext_settings_header li').eq(index).addClass('on');
	}
};


var blocklist =  {
	
	init : function() {
		
		// Create user list
		blocklist.list();
		
		// Create remove events
		$('#ext_blocklist a').live('click', function(e) {
			e.preventDefault();
			blocklist.remove(this);
		})
	},
	
	list: function() {
		// If theres is no entry in dataStore
		if(typeof dataStore['block_list'] == "undefined") {
			return false;
		}
	
		// If the list is empty
		if(dataStore['block_list'] == '') {
			return false;
		}
	
		// Everything is OK, remove the default message
		$('#ext_blocklist').html('');
	
		// Fetch the userlist into an array
		var users = dataStore['block_list'].split(',').sort();
	
		// Iterate over, add users to the list
		for(c = 0; c < users.length; c++) {
			$('#ext_blocklist').append('<li><span>'+users[c]+'</span> <a href="#">töröl</a></li>');
		}
	},
	
	remove : function(el) {
		
		// Get username
		var user = $(el).prev().html();
				
		// Remove user from the list
		$(el).closest('li').remove();
		
		// Remove user from preferences
		safari.self.tab.dispatchMessage("removeUserFromBlocklist", user);
		
		// Add default message to the list if it is now empty
		if($('#ext_blocklist li').length == 0) {
			$('<li id="ext_empty_blocklist">Jelenleg üres a tiltólistád</li>').appendTo('#ext_blocklist');
		}
		
		// Restore user comments
		blocklist.restore(user);
	},
	
	restore : function(user) {

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