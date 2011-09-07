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
					html += '<p>A bal alsó sarokban navigációs gombok jelennek meg, amikkel az oldal tetejére lehet görgetni, visszalépni a fórum főoldalra, vagy éppen keresni az adott témában.</p>';
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
					html += '<div class="button" id="remove_ads"></div>';
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
