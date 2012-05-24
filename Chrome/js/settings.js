var cp = {

	init : function(page) {
		
		// Create the settings button
		$('<div id="ext_settings_button"><img src="'+chrome.extension.getURL('/img/settings/icon.png')+'" alt=""></div>').appendTo('body');
		
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
				html += '<li>Sync</li>';
				html += '<li>Logger</li>';
				html += '<li class="clear"></li>';
			html += '</ul>';
			
			html += '<div class="settings_page">';
				html += '<h3>SG Fórum+</h3>';
				html += '<p>Verzió: 2.6.1<br></p>';
				html += '<p>Kiadás dátuma: 2012. 05. 24.</p>';
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
				html += '<div>';
					html += '<h3>Hosszú kommentek oszloposítása</h3>';
					html += '<p>Meghatározott karakterszám felett a bővítmény oszlopokra bontja az üzeneteket a könnyebb olvashatóság miatt. </p>';
					html += '<div class="button" id="columnify_comments"></div>';
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
			    html += '<button class="profile_save">Változások mentése</button>';
			    html += '<a href="#" class="new_profile">Új csoport hozzáadása</a>';
			html += '</div>';

			html += '<div class="settings_page">';
				html += '<ul id="ext_blocklist">';
					html += '<li id="ext_empty_blocklist">Jelenleg üres a tiltólistád</li>';
				html += '</ul>';
			html += '</div>';
			
			html += '<div class="settings_page sync">';
				
				html += '<div class="signup">';
					html += '<h3>Regisztráció</h3>';
					html += '<p class="desc">';
						html += 'A jelszavad visszafejthető módon, lokálisan is tárolódik! ';
						html += 'Ha publikus számítógépeken is használod a bővítményt, ';
						html += 'válassz egyedi jelszót, amit máshol nem használsz!';
					html += '</p>';
					html += '<form action="http://sgsync.dev.kreatura.hu/api_v2/signup/" method="post">';
						html += '<input type="text" name="nick" placeholder="Felhasználónév">';
						html += '<input type="password" name="pass" placeholder="Jelszó">';
						html += '<button type="submit">Regisztráció</button>';
					html += '</form>';
				html += '</div>';
				
				html += '<div class="login">';
					html += '<h3>Belépés</h3>';
					html += '<form action="http://sgsync.dev.kreatura.hu/api_v2/auth/" method="post">';
						html += '<input type="text" name="nick" placeholder="Felhasználónév">';
						html += '<input type="password" name="pass" placeholder="Jelszó">';
						html += '<button type="submit">Belépés</button>';
						
						html += '<div class="status">';
							if(dataStore['sync_auth_key'] != '') {
							html += '<div class="loggedin">&#10003;</div>';
							html += '<strong>Belépve mint: </strong>';
							html += '<span>'+dataStore['sync_nick']+'</span>';
							}
						html += '</div>';
					html += '</form>';
				html += '</div>';
				
				html += '<div class="log">';
					html += '<h3>Statisztika és lehetőségek</h3>';
					html += '<strong>Utolsó szinkronizálás: </strong>';
					if(dataStore['sync_last_sync'] == 0) { 
					html += '<span class="last_sync">Soha</span>';
					} else {
	
						var month = date('M', dataStore['sync_last_sync']);

						// Convert mounts names
						$.each([
							['Jan', 'január'],
							['Feb', 'február'],
							['Mar', 'március'],
							['Apr', 'április'],
							['May', 'május'],
							['Jun', 'június'],
							['Jul', 'július'],
							['Aug', 'augusztus'],
							['Sep', 'szeptember'],
							['Oct', 'október'],
							['Nov', 'november'],
							['Dec', 'december'],
			
						], function(index, item) {
							month = month.replace(item[0], item[1]);
						});						
					
					html += '<span class="last_sync">'+month+' '+date('d. -  H:i', dataStore['sync_last_sync'])+'</span>';
					}
					html += '<button class="sync">Szinkronizálás most</button>';
				html += '</div>';
			html += '</div>';

			html += '<div class="settings_page debugger">';
				html += '<h3>Debugger</h3>';
				html += '<textarea readonly="readonly">';
				
				if(dataStore['debugger_messages'] != '') {

					// Parse debugger messages
					var messages = JSON.parse(dataStore['debugger_messages']);	
		
					for(c = 0; c < messages.length; c++) {
						html += ""+messages[c]+"\r\n";
					}
				}
				
				html += '</textarea>';
				html += '<button>Clear</button>';
			html += '</div>';

		html += '</div>';

		
		// Append settings pane html to body
		$(html).appendTo('body');
		
		// Set header list backgrounds
		$('#ext_settings_header li').css({ 'background-image' : 'url('+chrome.extension.getURL('/img/settings/icons.png')+')' });
		
		// Create tabs event
		$('#ext_settings_header li').click(function() {
			
			cp.tab( $(this).index() );
		});
		
		// Add buttons background image
		$('.settings_page .button').css({ 'background-image' : 'url('+chrome.extension.getURL('/img/settings/button.png')+')' });
		
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
			port.postMessage({ name : "setSetting", key : 'blocks_config', val : '' });
		});

		// Init profiles settings
		profiles_cp.init();

		// Init sync settings
		sync_cp.init();

		// Init log
		log.init();
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
			$(ele).animate({ 'background-position-x' : 0 }, 300);
			$(ele).attr('class', 'button off');
			
			settings.save(ele);
		} else {
		
			$(ele).animate({ 'background-position-x' : -40 }, 300);
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
		port.postMessage({ name : "removeUserFromBlocklist", message : user });
		
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
				$(this).attr('class', 'button on');
			
			} else {
				$(this).attr('class', 'button off');
			}
		});
		
		// Restore settings for checkboxes
		$('input:checkbox').each(function() {
			
			if(dataStore[ $(this).attr('id') ] == 'true') {
				$(this).attr('checked', true);
			} else {
				$(this).attr('checked', false);
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
			port.postMessage({ name : "setSetting", key : $(ele).attr('id'), val : 'true' });

			// Set new value to dataStore var
			dataStore[$(ele).attr('id')] = 'true';
	
			// Sync new settings
			if(dataStore['sync_auth_key'] != '') {
				sync_cp.save('Settings Panel');
			}
			
			// Check for interactive action
			if( typeof window[$(ele).attr('id')].activated != 'undefined') {
				window[$(ele).attr('id')].activated();
			}
		
		} else {

			// Save new settings ...
			port.postMessage({ name : "setSetting", key : $(ele).attr('id'), val : 'false' });

			// Set new value to dataStore var
			dataStore[$(ele).attr('id')] = 'false';

			// Sync new settings
			if(dataStore['sync_auth_key'] != '') {
				sync_cp.save('Settings Panel');
			}

			// Check for interactive action
			if( typeof window[$(ele).attr('id')].disabled != 'undefined') {
				window[$(ele).attr('id')].disabled();
			}
		}
	},
	
	select : function(ele) {
		
		// Get the settings value
		var val = $(ele).find('option:selected').val();
		
		// Update in dataStore
		dataStore[ $(ele).attr('id') ] = val;

		// Sync new settings
		if(dataStore['sync_auth_key'] != '') {
			sync_cp.save('Settings Panel');
		}

		// Update in localStorage
		port.postMessage({ name : "setSetting", key : $(ele).attr('id'), val : val });
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
		
		// Save the settings
		$('.settings_page .profile_save').click(function(e) {
			
			// Prevent browsers default submission
			e.preventDefault();
			
			// Save the settings
			profiles_cp.save();
		});
		
		// Rebuild profiles
		profiles_cp.rebuildProfiles();
	},
	
	rebuildProfiles : function() {
		
		if(dataStore['profiles'] == '') {
			return false;
		}
		
		// Empty the list
		$('.settings_page .profiles > li:not(.sample)').remove();
		
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
	},
	
	removeGroup : function(ele) {
		
		if(confirm('Biztos törlöd ezt a csoportot?')) {
		
			// Remove the group from DOM
			$(ele).closest('li').remove();
		}
	},
	
	changeColor : function(ele) {
		
		// Get selected color
		var color = $(ele).find('span').html().split(',');
		
		// Set the color indicator
		$(ele).parent().parent().find('span:first').css('background-color', '#'+color[0]);
		
		// Set the color input
		$(ele).parent().parent().find('input.color').val(color.join(','));
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
		
		// Save settings in localStorage
		port.postMessage({ name : "setSetting", key : 'profiles', val : JSON.stringify(data) });
		
		// Save new settings in dataStore
		dataStore['profiles'] = JSON.stringify(data);
		
		// Save new settings in sync
		sync_cp.save('Settings Panel');

		// Saved indicator
		$('<p class="profile_status">&#10003;</p>').insertAfter( $('.settings_page .profile_save') );
			
		// Remove the idicator in 2 sec
		setTimeout(function() {
			$('.settings_page .profile_status').remove();
		}, 3000);
	}
};

var sync_cp = {
	
	init : function() {
		
		// Signup
		$('.settings_page.sync .signup form').submit(function(e) {
			
			// Prevent borwsers default submisson
			e.preventDefault();
			
			// POST the data
			$.post($(this).attr('action'), $(this).serialize(), function(data) {
				sync_cp.signup(data);
			});
		
		});
		
		// Login
		$('.settings_page.sync .login form').submit(function(e) {
		
			// Prevent browsers default submission
			e.preventDefault();

			// POST the data
			$.post($(this).attr('action'), $(this).serialize(), function(data) {
				sync_cp.login(data);
			});
		});
		
		// Sync now button
		$('.settings_page.sync .log button.sync').click(function(e) {

			// Prevent browsers default submission
			e.preventDefault();
			
			// Get settings 
			sync_cp.get();
		});
		
		// Ping for settings chances
		setTimeout(function() {
			sync_cp.ping();
		}, 10000);
	},
	
	signup : function(data) {
		
		// Show the message
		alert(data.messages[0]);
		
		// On success
		if(data.errorCount == 0) {
			
			// Get the values
			var signup_nick = $('.settings_page.sync .signup input[name="nick"]');
			var signup_pass = $('.settings_page.sync .signup input[name="pass"]');
			
			// Store login credentials in localStorage
			port.postMessage({ name : "setSetting", key : 'sync_auth_key', val : data['auth_key'] });
			port.postMessage({ name : "setSetting", key : 'sync_nick', val : signup_nick.val() });

			// Store login credentials in dataStore
			dataStore['sync_auth_key'] = data['auth_key'];
			dataStore['sync_nick'] = signup_nick.val();

			// Empty status div
			$('.settings_page.sync .login .status').html('');
			
			// HTML to insert
			html  = '<div class="loggedin">&#10003;</div>';
			html += '<strong>Belépve mint: </strong>';
			html += '<span>'+signup_nick.val()+'</span>';
			
			// Insert new status
			$('.settings_page.sync .login .status').html(html);

			// Empty signup fields
			signup_nick.val('');
			signup_pass.val('');
			
			// Upload the config data after the signup process
			sync_cp.save('Sync Signup');
		}
	},
	
	login : function(data) {
				
		// Show error message if any
		if(data.errorCount > 0) {
					
			// Clear HTML from previous tries
			$('.settings_page.sync .login .status').html('');
					
			// HTML to append
			html = '<div class="loggedin error">X</div>';
			html += '<strong>Hiba: </strong>';
			html += '<span>'+data.messages[0]+'</span>';
					
			$(html).appendTo($('.settings_page.sync .login .status'));
				
		// Success
		} else {
			
			// Get the nick
			var login_nick = $('.settings_page.sync .login input[name="nick"]');
			
			// Clear HTML from previous tries
			$('.settings_page.sync .login .status').html('');
	
			html = '<div class="loggedin">&#10003;</div>';
			html += '<strong>Belépve mint: </strong>';
			html += '<span>'+login_nick.val()+'</span>';
			
			$(html).appendTo($('.settings_page.sync .login .status'));

			// Store login credentials in localStorage
			port.postMessage({ name : "setSetting", key : 'sync_auth_key', val : data['auth_key'] });
			port.postMessage({ name : "setSetting", key : 'sync_nick', val : login_nick.val() });
			
			// Store login credentials in dataStore
			dataStore['sync_nick'] = login_nick.val();
			dataStore['sync_auth_key'] = data['auth_key'];
			
			// Download the config
			sync_cp.get();
		}
	},
	
	
	ping : function() {

		// Exit when the user is not authenticated
		if(dataStore['sync_auth_key'] == '') {
			return;
		}

		// Get current timestamp
		var time = Math.round(new Date().getTime() / 1000)
		
		if(dataStore['sync_last_sync'] < time - 60*10) {
		
			// Log the request
			log.add('Pinging sgsync.dev.kreatura.hu\r\n');
	
			$.getJSON('http://sgsync.dev.kreatura.hu/api_v2/ping/', { auth_key : dataStore['sync_auth_key'] }, function(data) {
				
				// Update the latest data from sync
				if(data.date_m > dataStore['sync_last_sync']) {
					sync_cp.get();
				
				// There is no updates, 
				// Update the last checked date
				} else {

					// Get current timestamp
					var time = Math.round(new Date().getTime() / 1000)

					// Update the last sync time
					port.postMessage({ name : "setSetting", key : 'sync_last_sync', val : time });
				}
			});
		}
	},
	
	
	save : function(origin) {

		// Log the request
		log.add('Initiating sync (UP) to save changes', origin);

		// Make the request
		$.post( 'http://sgsync.dev.kreatura.hu/api_v2/set/', { auth_key : dataStore['sync_auth_key'], data : JSON.stringify(dataStore) }, function() {
		
			// Log the request
			log.add('Client data was sent successfully\r\n');		
		});
	},
	
	
	get : function() {

		// Log the request
		log.add('Initiating sync (DOWN) to get changes');

		$.getJSON('http://sgsync.dev.kreatura.hu/api_v2/get/', { auth_key : dataStore['sync_auth_key'] }, function(data) {
		
			if(data.errorCount > 0) {
			
				// Log the request
				log.add('Sync failed, authentication error\r\n');
				
				// Show the error message
			    alert('A szinkronizáció meghiúsult, ellenőrizd a felhasználóneved, jelszavad!');
			    return;
			}

			// Log the request
			log.add('Data received, processing...');

			// Get current timestamp
			var time = Math.round(new Date().getTime() / 1000)

			// Update the last sync time
			port.postMessage({ name : "setSetting", key : 'sync_last_sync', val : time });
			
			// Update data in dataStore object
			config = JSON.parse(data['settings']);
			
			// Update settings in localStorage
			for (var key in config) {

				// Exclude some settings
				if(key.match('sync') || key.match('debugger')) {
					continue;
				}
				
				// Store in localStorage
				port.postMessage({ name : "setSetting", key : key, val : config[key] });

				// Store in dataStore
				dataStore[key] = config[key];
			}

			// Log the request
			log.add('New profile settings has been saved');
			log.add('Updating the GUI...\r\n');

			// Update settings GUI
			settings.restore();
			blocklist_cp.list();
			profiles_cp.rebuildProfiles();
			
			// Update last sync date
			var month = date('M', time);

			// Convert mounts names
			$.each([
				['Jan', 'január'],
				['Feb', 'február'],
				['Mar', 'március'],
				['Apr', 'április'],
				['May', 'május'],
				['Jun', 'június'],
				['Jul', 'július'],
				['Aug', 'augusztus'],
				['Sep', 'szeptember'],
				['Oct', 'október'],
				['Nov', 'november'],
				['Dec', 'december'],
			
			], function(index, item) {
				month = month.replace(item[0], item[1]);
			});						
			
			// Update last sync date
			$('.settings_page.sync .log .last_sync').html(''+month+' '+date('d. -  H:i', time)+'');

			// HTML for indicator
			html = '<div class="status">';
			html += '<div class="loggedin">&#10003;</div>';
			html += '</div>';
			
			// Insert HTML
			$(html).insertAfter( $('.settings_page.sync .log button') );
			
			// Remove the idicator in 2 sec
			setTimeout(function() {
				$('.settings_page.sync .log .status').remove();
			}, 3000);
		});
	}
};

var log = {
	
	init : function() {
		
		// Clear event
		$('.settings_page.debugger button').click(function() {
			log.clear();
		});
	},
	
	add : function(message, origin) {

		// Get current timestamp
		var time = Math.round(new Date().getTime() / 1000)

		// Parse messages
		if(dataStore['debugger_messages'] != '') {
			var messages = JSON.parse(dataStore['debugger_messages']);
		
		} else {
			var messages = [];
		}
		
		var month = date('M', time);

		// Convert mounts names
		$.each([
		    ['Jan', 'január'],
		    ['Feb', 'február'],
		    ['Mar', 'március'],
		    ['Apr', 'április'],
		    ['May', 'május'],
		    ['Jun', 'június'],
		    ['Jul', 'július'],
		    ['Aug', 'augusztus'],
		    ['Sep', 'szeptember'],
		    ['Oct', 'október'],
		    ['Nov', 'november'],
		    ['Dec', 'december'],
		
		], function(index, item) {
		    month = month.replace(item[0], item[1]);
		});
		
		// Append timestamp
		message	= month + date('d. H:i - ', time) + message;

		// Append origin
		if(typeof origin != "undefined") {
			message = message + ' | Origin: ' + origin;
		}

		// Add new messages
		messages.push(message);
		
		if(messages.length > 100) {
			messages.splice(0, 1);
		}
		
		// Add to dataStore
		dataStore['debugger_messages'] = JSON.stringify(messages);
	
		// Store new settings
		port.postMessage({ name : "setSetting", key : 'debugger_messages', val : JSON.stringify(messages) });

		// Update the GUI
		var html = $('.settings_page.debugger textarea').html();
			
		$('.settings_page.debugger textarea').html( html + message + "\r\n" );
	},
	
	clear : function() {
	
		// Clear in localStorage
		port.postMessage({ name : "setSetting", key : 'debugger_messages', val : '' });
		
		// Clear in dataStore
		dataStore['debugger_messages'] = '';
		
		// Clear the debugger window
		$('.settings_page.debugger textarea').html('');
	}
};
