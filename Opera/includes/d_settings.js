// ==UserScript==
// @include http://sg.hu/*
// @include https://sg.hu/*
// @include http://www.sg.hu/*
// @include https://www.sg.hu/*
// @include http://*.sg.hu/*
// @include https://*.sg.hu/*
// ==/UserScript==

var cp = {

	init : function(page) {
		
		var iconImg		= "iVBORw0KGgoAAAANSUhEUgAAABwAAAAdCAYAAAC5UQwxAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAABXpJREFUeNq0VmlIXFcUnhnH0XFX1KpYC+4bjlstWiVitNikhkJk3MdoXCtWSNQiAZcaScX8UFBiQtIMFReIaRtoJKgJ6g/3UaupW3ChWrWOGpe6j2O/K++F0XmmkSYPDvfdc+8792zfdx/78PCQdZZHKBR6Y7gE4UGeQZrO8j37LAeGhYWdw9ByQh0HEb+rDc5ZvOPz+VcZdHFnscFlUoaHh5OUXYTU19XVvUmZhobGRzs7O8f2qqqqGpzQeUBiIANMkSulNCIi4iaGGwqq65AXkCwVFZWvDg4OdI6liMPZlsvlpJblEANIHUSFWq6BiCAHjAdGRkaShmhnvccHDiXCofuMNTQyMvoMG1jvU/T19b0V58dqGBIS0lVTU7Oxv7+vrVRsLnfb3d29PigoSGJvb/+a6Kanp7Wbmppcu7q6Lu/u7uor1YvNlvn4+LQ0NDSwSCYxV6ohHwYyamtrc2UyGZ9WmpiYSFJSUu6JxWKjmZmZINTRi+AQHnchKy0JCQlT1dXVUXDAX+EweXBwcBl6okgkEi2f2jR3794VdHR09EJ/FL2ZmVlXcnJyYUFBwXeohR8jmNnsP2JjY3Px3dWxsbELtN7R0VE4PDz86K047Ovri4EBLsk3j8fbxGEFhYWF32LJ77Q6Yb9TVVXV93FxcUWampp/0/qpqalwpb0kwvj4eIK7VNI3UNohEi1yuI2NzROk8CFw9ivtkKGh4ZCnp+dz7JP39PScl0qlAnoNsLkmEAjs4XQSFfku7L/E6z8UJsVc5N8OG+uxoKrQykejhYXF47m5uSv0XE9PbxzRXldTUxvF9DA0NPRpdnZ22crKijNFAknOzs4JAwMDSZQpNRzqQb0TWvyTAyMEe6pHHXRC1NXVuzE60HNLS8vfcFhzYmKiKUQAeWFtbf2EXkczWfr7+/fBQRmTPR0dnYtcAwMD/sbGBiNoJyYmdgAHNh3h4uLiGonMw8PjEMblg4ODrIWFhWV6HZmSoeZ7mHOYLgVdXV01DurRg1RsM3m0vLxsh02v6PnS0tIVwEMXMpqWlkai58OJb+h1bW3tGdj6hFTlpC1ScwcHh1bSNHyJRJLa2tp6fm9vTwMGnNAkRsQjpLTKz8/veXNz84/Yx6EaYRrvP1H8GAmxoyOA87eGhoZ2QAIFVE03TE1NJSTFWGsPCAgoo3FICNmG7CkvL08dGRkR0V3m7e3ticiKxsfHL72NM42NjSVoIlFlZWUrutyQ6MzNzRtzcnLy8CqHTCErUpra1iES8hIYGHiI2l0G02iSLuvu7n6Ynp5+DVHrzs7OnmM6DHz5ElfazYqKih8Icihsyr28vB7g207F7ldimqysrHCktopmGirSnqioqFtbW1tunZ2d/miyj6nLV+rq6toKKHSUlpYmI7IvTlzOudvb24Wn3ocZGRnWMD6siEmFZw+QqHNxcfkddTkAC8nQobz+/n6nzc3NMKxrnZLtL6l/H+UbX0tL6wI+PsIkw8ND5KLe3l4mLj21tvhLECIzzxi51M3NbZJgieQaI4saZYRT/+veA14JZndO6kGPo4pzlfz8fJYCu0tXV1f15+fn3YnjpJ19fX3vREdH319fX99YW1szAeC1FPGFNK/Z2to+jYmJuYOramBycvJTlIRH1nBv/gLqvN3Y2Lj25hsGRrAEg4QCT/a4cIcA1p+h+wtiXVxcfA9kfeyKAthH8/LyhHh9RaYg+6/b2tq8wcOzwHB9Zmbm4Lv8lxJcmkDmKKY/ekpKSh6BGEIVN4KL25GVzxX2qBPeh7xGx0v/148wGEcIESOtfApXe8DaDUDl9gf58yb8i5SFoVMFOJSLJhuysrJ6jCtq/kMdeESxVLpJhy/gsK2zfPyvAAMAVDFmO5bXbNwAAAAASUVORK5CYII=";
		var iconsImg	= "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";
		var buttonsImg	= "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";
		
		// Create the settings button
		$('<div id="ext_settings_button"><img src="data:image/png;base64,'+iconImg+'" alt=""></div>').appendTo('body');
		
		// Create the hiding overlay
		$('<div id="ext_settings_hide_overlay"></div>').appendTo('body');
		
		// Create click event for settings pane
		$('#ext_settings_button').click(function() {
			
			if($('#ext_settings_wrapper').hasClass('opened')) {
				cp.hide();
			} else {
				cp.show();
			}
		});
		
		// Inject the html code
		var html = '';
		
		html += '<div id="ext_settings_wrapper">';
			html += '<ul id="ext_settings_header">';
				html += '<li>Névjegy</li>';
				html += '<li>Főoldal</li>';
				html += '<li>Topik</li>';
				html += '<li>Egyéb</li>';
				html += '<li>Tiltólista</li>';
				html += '<li class="clear"></li>';
			html += '</ul>';
			
			html += '<div class="settings_page">';
				html += '<h3>SG Fórum+</h3>';
				html += '<p>Verzió: 0.6.0<br></p>';
				html += '<p>Kiadás dátuma: 2011. 08. 15.</p>';
				html += '<p>Fejlesztő: Gera János "dzsani" <a href="http://kreaturamedia.com" target="_blank">http://kreaturamedia.com</a></p>';
				html += '<p>Közreműködők: Viszt Péter "passatgt" <a href="http://visztpeter.me" target="_blank">http://visztpeter.me</a>, Krupa György "pyro" <a href="http://kreaturamedia.com" target="_blank">http://kreaturamedia.com</a></p>';
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
					html += '<h3>Fórumkategóriák kiemelése</h3>';
					html += '<p>A fórum főoldalon átalakított, átdizájnolt listákat láthatsz, mely jobban kiemeli többek között a kedvenceknél a fórumkategóriákat is.</p>';
					html += '<div class="button" id="highlight_forum_categories"></div>';
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
					html += '<h3>Navigációs gombok megjelenítése</h3>';
					html += '<p>A jobb alsó sarokban egy oldal tetejére görgető gomb, plusz egy vissza a fórum főoldalra gomb jelenik meg</p>';
					html += '<div class="button" id="show_navigation_buttons"></div>';
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
				html += '<div>';
					html += '<h3>Reklámok blokkolása</h3>';
					html += '<p>Ezzel az opcióval eltávolítható az összes reklám az sg.hu-n.</p>';
					html += '<div class="button" id="remove_adds"></div>';
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
		$('#ext_settings_header li').css({ 'background-image' : 'url(data:image/png;base64,'+iconsImg+')' });
		
		// Create tabs event
		$('#ext_settings_header li').click(function() {
			
			cp.tab( $(this).index() );
		});
		
		// Add buttons background image
		$('.settings_page .button').css({ 'background-image' : 'url(data:image/png;base64,'+buttonsImg+')' });
		
		// Get the requested page number
		var page  = typeof page == "undefined" ? 0 : page;
		
		// Select the right page
		cp.tab(page);
		
		// Set-up blocklist
		blocklist_cp.init();
		
		// Close when clicking away
		$('#ext_settings_hide_overlay').click(function() {
			cp.hide();
		});
		
		// Restore settings
		settings.restore();
		
		// Settings change event, saving
		$('.settings_page .button').click(function() {
			cp.button(this);
		});
		
		// Set checkboxes
		$('input:checkbox').click(function() {
			settings.save(this);
		})
		
		
		// Reset blocks config
		$('#reset_blocks_config').click(function() {
			opera.extension.postMessage({ name : "setSetting", key : 'blocks_config', val : '' });
		});
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
		$('#ext_settings_wrapper').delay(250).animate({ top : 10 }, 250);
		
		// Add 'opened' class
		$('#ext_settings_wrapper').addClass('opened');
		
	},
	
	hide : function() {
		
		// Get the settings pane height
		var paneHeight = $('#ext_settings_wrapper').height();
		
		// Hide the pane
		$('#ext_settings_wrapper').animate({ top : '-'+(paneHeight+10)+'px'}, 200, function() {
			
			// Hide the settings pane 
			$(this).css('top', -9000);
			
			// Restore the overlay
			$('#ext_settings_hide_overlay').animate({ opacity : 0 }, 100, function() {
				$(this).css('display', 'none');
			});
			
			// Remove 'opened' class
			$('#ext_settings_wrapper').removeClass('opened');
		});
	},
	
	tab : function(index) {
		
		// Set the current height to prevent resize
		$('#ext_settings_wrapper').css({ height : $('#ext_settings_wrapper').height() });
       
		// Hide all tab pages
		$('.settings_page').css('display', 'none');
       
		// Show the selected tab page
		$('.settings_page').eq(index).fadeIn(250);
       
		// Get new height of settings pane
		var newPaneHeight = $('#ext_settings_header').height() + $('.settings_page').eq(index).outerHeight();

		// Animate the resize
		$('#ext_settings_wrapper').stop().animate({ height : newPaneHeight }, 150, function() {
		
			// Set auto height
			$('#ext_settings_wrapper').css({ height : 'auto' });
		});
		
		// Remove all selected background in the header
		$('#ext_settings_header li').removeClass('on');
		
		// Add selected background to the selectad tab button
		$('#ext_settings_header li').eq(index).addClass('on');
	},
	
	button : function(ele) {

		if( $(ele).hasClass('on') ) {
			$(ele).attr('class', 'button off');
			
			settings.save(ele);
		} else {
		
			$(ele).attr('class', 'button on');
			
			settings.save(ele);
		}
	}
};


var blocklist_cp =  {
	
	init : function() {
		
		// Create user list
		blocklist_cp.list();
		
		// Create remove events
		$('#ext_blocklist a').live('click', function(e) {
			e.preventDefault();
			blocklist_cp.remove(this);
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
		opera.extension.postMessage({ name : "removeUserFromBlocklist", message : user });
		
		// Add default message to the list if it is now empty
		if($('#ext_blocklist li').length == 0) {
			$('<li id="ext_empty_blocklist">Jelenleg üres a tiltólistád</li>').appendTo('#ext_blocklist');
		}
		
		// Restore user comments
		blocklist.unblock(user);
	}
};

var settings = {
	
	restore : function() {

		// Restore settings for buttons
		$('.settings_page .button').each(function() {

			if(dataStore[ $(this).attr('id') ] == 'true') {
				$(this).addClass('on');
			
			} else {
				$(this).addClass('off');
			}
		});
		
		// Restore settings for checkboxes
		$('input:checkbox').each(function() {
			
			if(dataStore[ $(this).attr('id') ] == 'true') {
				$(this).attr('checked', true);
			}
		});
	},
	
	save : function(ele) {
		
		if( $(ele).hasClass('on') || $(ele).attr('checked') == 'checked' || $(ele).attr('checked') == true) {
	
			// Save new settings ...
			opera.extension.postMessage({ name : "setSetting", key : $(ele).attr('id'), val : 'true' });
			
			// Check for interactive action
			if( typeof window[$(ele).attr('id')].activated != 'undefined') {
				window[$(ele).attr('id')].activated();
			}
			
			// Set new value to dataStore var
			dataStore[$(ele).attr('id')] = 'true';
		
		} else {

			// Save new settings ...
			opera.extension.postMessage({ name : "setSetting", key : $(ele).attr('id'), val : 'false' });
			
			// Check for interactive action
			if( typeof window[$(ele).attr('id')].disabled != 'undefined') {
				window[$(ele).attr('id')].disabled();
			}
			
			// Set new value to dataStore var
			dataStore[$(ele).attr('id')] = 'false';
		}
	}
};
