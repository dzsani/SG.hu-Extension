var cp = {

	init : function(page) {
		
		var iconImg = "iVBORw0KGgoAAAANSUhEUgAAABwAAAAdCAYAAAC5UQwxAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAABXpJREFUeNq0VmlIXFcUnhnH0XFX1KpYC+4bjlstWiVitNikhkJk3MdoXCtWSNQiAZcaScX8UFBiQtIMFReIaRtoJKgJ6g/3UaupW3ChWrWOGpe6j2O/K++F0XmmkSYPDvfdc+8792zfdx/78PCQdZZHKBR6Y7gE4UGeQZrO8j37LAeGhYWdw9ByQh0HEb+rDc5ZvOPz+VcZdHFnscFlUoaHh5OUXYTU19XVvUmZhobGRzs7O8f2qqqqGpzQeUBiIANMkSulNCIi4iaGGwqq65AXkCwVFZWvDg4OdI6liMPZlsvlpJblEANIHUSFWq6BiCAHjAdGRkaShmhnvccHDiXCofuMNTQyMvoMG1jvU/T19b0V58dqGBIS0lVTU7Oxv7+vrVRsLnfb3d29PigoSGJvb/+a6Kanp7Wbmppcu7q6Lu/u7uor1YvNlvn4+LQ0NDSwSCYxV6ohHwYyamtrc2UyGZ9WmpiYSFJSUu6JxWKjmZmZINTRi+AQHnchKy0JCQlT1dXVUXDAX+EweXBwcBl6okgkEi2f2jR3794VdHR09EJ/FL2ZmVlXcnJyYUFBwXeohR8jmNnsP2JjY3Px3dWxsbELtN7R0VE4PDz86K047Ovri4EBLsk3j8fbxGEFhYWF32LJ77Q6Yb9TVVXV93FxcUWampp/0/qpqalwpb0kwvj4eIK7VNI3UNohEi1yuI2NzROk8CFw9ivtkKGh4ZCnp+dz7JP39PScl0qlAnoNsLkmEAjs4XQSFfku7L/E6z8UJsVc5N8OG+uxoKrQykejhYXF47m5uSv0XE9PbxzRXldTUxvF9DA0NPRpdnZ22crKijNFAknOzs4JAwMDSZQpNRzqQb0TWvyTAyMEe6pHHXRC1NXVuzE60HNLS8vfcFhzYmKiKUQAeWFtbf2EXkczWfr7+/fBQRmTPR0dnYtcAwMD/sbGBiNoJyYmdgAHNh3h4uLiGonMw8PjEMblg4ODrIWFhWV6HZmSoeZ7mHOYLgVdXV01DurRg1RsM3m0vLxsh02v6PnS0tIVwEMXMpqWlkai58OJb+h1bW3tGdj6hFTlpC1ScwcHh1bSNHyJRJLa2tp6fm9vTwMGnNAkRsQjpLTKz8/veXNz84/Yx6EaYRrvP1H8GAmxoyOA87eGhoZ2QAIFVE03TE1NJSTFWGsPCAgoo3FICNmG7CkvL08dGRkR0V3m7e3ticiKxsfHL72NM42NjSVoIlFlZWUrutyQ6MzNzRtzcnLy8CqHTCErUpra1iES8hIYGHiI2l0G02iSLuvu7n6Ynp5+DVHrzs7OnmM6DHz5ElfazYqKih8Icihsyr28vB7g207F7ldimqysrHCktopmGirSnqioqFtbW1tunZ2d/miyj6nLV+rq6toKKHSUlpYmI7IvTlzOudvb24Wn3ocZGRnWMD6siEmFZw+QqHNxcfkddTkAC8nQobz+/n6nzc3NMKxrnZLtL6l/H+UbX0tL6wI+PsIkw8ND5KLe3l4mLj21tvhLECIzzxi51M3NbZJgieQaI4saZYRT/+veA14JZndO6kGPo4pzlfz8fJYCu0tXV1f15+fn3YnjpJ19fX3vREdH319fX99YW1szAeC1FPGFNK/Z2to+jYmJuYOramBycvJTlIRH1nBv/gLqvN3Y2Lj25hsGRrAEg4QCT/a4cIcA1p+h+wtiXVxcfA9kfeyKAthH8/LyhHh9RaYg+6/b2tq8wcOzwHB9Zmbm4Lv8lxJcmkDmKKY/ekpKSh6BGEIVN4KL25GVzxX2qBPeh7xGx0v/148wGEcIESOtfApXe8DaDUDl9gf58yb8i5SFoVMFOJSLJhuysrJ6jCtq/kMdeESxVLpJhy/gsK2zfPyvAAMAVDFmO5bXbNwAAAAASUVORK5CYII=";
		var iconsImg = "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";
		var buttonImg = "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";
		
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
				html += '<li>Profilok</li>';
				html += '<li>Tiltólista</li>';
				html += '<li class="clear"></li>';
			html += '</ul>';
			
			html += '<div class="settings_page">';
				html += '<h3>SG Fórum+</h3>';
				html += '<p>Verzió: 2.1.0<br></p>';
				html += '<p>Kiadás dátuma: 2011. 10. 28.</p>';
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
					html += '<p class="sub">';
						html += '<label><input type="checkbox" id="fav_show_only_unreaded_remember"> Utolsó állapot megjegyzése</label><br>';
					html += '</p>';
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
				html += '<div>';
					html += '<h3>Üzenetközpont (BÉTA)</h3>';
					html += '<p>Saját üzenetek naplózása, azokra érkező válaszok nyomkövetése.</p>';
					html += '<div class="button" id="message_center"></div>';
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
				html += '<div>';
					html += '<h3>WYSIWYG Editor</h3>';
					html += '<p>Office-szerű formázógombokat kapsz a kommentíró mezőbe élő előnézettel.</p>';
					html += '<div class="button" id="wysiwyg_editor"></div>';
				html += '</div>';
				html += '<div>';
					html += '<h3>Topikba érkező új üzenetek automatikus kinyerése</h3>';
					html += '<p>Amíg egy topikban tartózkodsz, a bővítmény automatikusan kinyeri az olvasás ideje alatt érkező új üezenteket.</p>';
					html += '<div class="button" id="fetch_new_comments"></div>';
				html += '</div>';
				html += '<div>';
					html += '<h3>Navigációs gombok megjelenítése</h3>';
					html += '<p class="sub">';
						html += 'Gombok helye: ';
						html += '<select id="navigation_buttons_position">';
							html += '<option value="lefttop">Bal felül</option>';
							html += '<option value="leftcenter">Bal középen</option>';
							html += '<option value="leftbottom">Bal alul</option>';
							html += '<option value="righttop">Jobb felül</option>';
							html += '<option value="rightcenter">Jobb középen</option>';
							html += '<option value="rightbottom">Jobb alul</option>';
						html += '</select>';
					html += '</p>';
					html += '<p>Egy topikban vagy a cikkeknél gyors elérést biztosító funkciógombok</p>';
					html += '<div class="button" id="show_navigation_buttons"></div>';
				html += '</div>';
				html += '<div>';
					html += '<h3>Pontrendszer letiltása</h3>';
					html += '<p>Ez az opció eltávolítja a pontozó gombokat és minden rejtett hozzászólást láthatóvá tesz.</p>';
					html += '<div class="button" id="disable_point_system"></div>';
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
				html += '<ul class="profiles">';
			    	html += '<li class="sample">';
			    		html += '<input type="hidden" name="color" class="color" value="ff4242,ffc9c9">';
			    		html += '<span class="color" style="background-color: #ff4242"></span>';
			    		html += '<input type="text" name="title" class="title" value="Profil elnevezése">';
			    		html += '<ul>';
			    			html += '<li style="background-color: #ffc9c9"><span>ff4242,ffc9c9</span></li>';
			    			html += '<li style="background-color: #f2c9ff"><span>d13eff,f2c9ff</span></li>';
			    			html += '<li style="background-color: #c6c6ff"><span>4242ff,c6c6ff</span></li>';
			    			html += '<li style="background-color: #c6e9ff"><span>4ebbff,c6e9ff</span></li>';
			    			html += '<li style="background-color: #d5ffc6"><span>6afe36,d5ffc6</span></li>';
			    			html += '<li style="background-color: #fdffc6"><span>f8ff34,fdffc6</span></li>';
			    			html += '<li style="background-color: #ffe7c6"><span>ffa428,ffe7c6</span></li>';
			    			html += '<li style="background-color: #e1e1e1"><span>a9a9a9,e1e1e1</span></li>';
			    		html += '</ul>';
			    		html += '<textarea name="users" class="users">Felhasználók</textarea>';
			    		html += '<p class="options">';
			    			html += 'Opciók:';
			    			html += '<label><input type="checkbox" name="background" class="background"> Hozzászólás hátterének kiemelése</label>';
			    		html += '</p>';
			    		html += '<p class="remove">eltávolít</p>';
			    	html += '</li>';
			    html += '</ul>';
			    html += '<a href="#" class="new_profile">Új csoport hozzáadása</a>';
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
		$('.settings_page .button').css({ 'background-image' : 'url(data:image/png;base64,'+buttonImg+')' });
		
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
		$('.settings_page input:checkbox').click(function() {
			settings.save(this);
		});


		// Set select boxes
		$('.settings_page select').change(function() {
			settings.select(this);
		});
		
		
		// Reset blocks config
		$('#reset_blocks_config').click(function() {
			self.postMessage({ name : "setSetting", key : 'blocks_config', val : '' });
		});

		
		// Init profiles settings
		profiles_cp.init();
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
			$(ele).css({ 'background-position' : '0px 0px' });
			$(ele).attr('class', 'button off');
			
			settings.save(ele);
		} else {
		
			$(ele).css({ 'background-position' : '-40px 0px' });
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
		self.postMessage({ name : "removeUserFromBlocklist", message : user });

		
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

			if(dataStore[ $(this).attr('id') ] == true) {
				$(this).addClass('on');
			
			} else {
				$(this).addClass('off');
			}
		});
		
		// Restore settings for checkboxes
		$('input:checkbox').each(function() {
			
			if(dataStore[ $(this).attr('id') ] == true) {
				$(this).attr('checked', true);
			}
		});

		
		// Restore settings for select boxes
		$('.settings_page select').each(function() {
			
			$(this).find('option[value="'+dataStore[ $(this).attr('id') ]+'"]').attr('selected', true);
		});
	},
	
	save : function(ele) {

		if( $(ele).hasClass('on') || $(ele).attr('checked') == 'checked' || $(ele).attr('checked') == true) {
			
			// Save new settings ...
			self.postMessage({ name : "setSetting", key : $(ele).attr('id'), val : true });
			
			// Check for interactive action
			if( typeof window[$(ele).attr('id')].activated != 'undefined') {
				window[$(ele).attr('id')].activated();
			}
			
			// Set new value to dataStore var
			dataStore[$(ele).attr('id')] = true;
		
		} else {

			// Save new settings ...
			self.postMessage({ name : "setSetting", key : $(ele).attr('id'), val : false });
			
			// Check for interactive action
			if( typeof window[$(ele).attr('id')].disabled != 'undefined') {
				window[$(ele).attr('id')].disabled();
			}
			
			// Set new value to dataStore var
			dataStore[$(ele).attr('id')] = false;
		}
	},
	
	select : function(ele) {
		
		// Get the settings value
		var val = $(ele).find('option:selected').val();
		
		// Update in dataStore
		dataStore[ $(ele).attr('id') ] = val;
		
		// Update in localStorage
		self.postMessage({ name : "setSetting", key : $(ele).attr('id'), val : val });
	}
};

var profiles_cp = {

	init : function() {
		
		// Add new profile group
		$('.settings_page a.new_profile').click(function(e) {
			e.preventDefault();
			profiles_cp.addGroup();
		});
		
		// Color select
		$('.settings_page .profiles li ul li').live('click', function() {
			profiles_cp.changeColor(this);
		});

		// Remove a group
		$('.settings_page .profiles li .remove').live('click', function() {
			profiles_cp.removeGroup(this);
		});
		
		// Keyup event for the form elements
		$('.settings_page .profiles input, .settings_page .profiles textarea').live('keyup', function() {
			profiles_cp.save();
		});
		
		// Checkboxes
		$('.settings_page .profiles input:checkbox').live('click', function() {
			profiles_cp.save();
		});
		
		// Rebuild profiles
		profiles_cp.rebuildProfiles();
	},
	
	rebuildProfiles : function() {
		
		if(dataStore['profiles'] == '') {
			return false;
		}
		
		var profiles = JSON.parse(dataStore['profiles']);

		for(c = 0; c < profiles.length; c++) {
		
			// Get the clone elementent
			var clone = $('.settings_page .profiles li.sample').clone();
		
			// Get the target element
			var target = $('.settings_page .profiles');
			
			// Append the new group
			var content = $(clone).appendTo(target).removeClass('sample');
			
			// Re-set settings
			content.find('.color').val( profiles[c]['color'] );
			content.find('span.color').css('background-color', '#'+profiles[c]['color'][0]);
			content.find('.title').val( profiles[c]['title'] );
			content.find('.users').val( profiles[c]['users'] );
			
			// Re-set checkboxes
			if(profiles[c]['background']) {
				content.find('.background').attr('checked', true);
			}
		}
	},
	
	addGroup : function() {
		
		// Get the clone elementent
		var clone = $('.settings_page .profiles li.sample').clone();
		
		// Get the target element
		var target = $('.settings_page .profiles');
		
		// Append the new group
		$(clone).appendTo(target).removeClass('sample');
		
		// Save the new group
		profiles_cp.save();
	},
	
	removeGroup : function(ele) {
		
		if(confirm('Biztos törlöd ezt a csoportot?')) {
		
			// Remove the group from DOM
			$(ele).closest('li').remove();
		
			// Save changes
			profiles_cp.save();
		}
	},
	
	changeColor : function(ele) {
		
		// Get selected color
		var color = $(ele).find('span').html().split(',');
		
		// Set the color indicator
		$(ele).parent().parent().find('span:first').css('background-color', '#'+color[0]);
		
		// Set the color input
		$(ele).parent().parent().find('input.color').val(color.join(','));
		
		// Save new settings
		profiles_cp.save();
	},
	
	save : function() {
		
		// Var to store data
		var data = new Array();

		// Iterate over the groups
		$('.settings_page .profiles > li:not(.sample)').each(function(index) {
			
			// Create an new empty object for the group settings
			data[index] = {};
				
			// Prefs
			data[index]['color'] = $(this).find('.color').val().split(',');
			data[index]['title'] = $(this).find('.title').val();
			data[index]['users'] = $(this).find('.users').val().split(',');
			
			// Options
			if( $(this).find('.background').attr('checked') == true || $(this).find('.background').attr('checked') == 'checked') {
				data[index]['background'] = true;
			} else {
				data[index]['background'] = false;
			}
			

		});
		
		// Seriaize the form
		self.postMessage({ name : "setSetting", key : 'profiles', val : JSON.stringify(data) });
	}
};

