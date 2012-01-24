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
				html += '<li>Profilok</li>';
				html += '<li>Tiltólista</li>';
				html += '<li>Sync</li>';
				html += '<li class="clear"></li>';
			html += '</ul>';
			
			html += '<div class="settings_page">';
				html += '<h3>SG Fórum+</h3>';
				html += '<p>Verzió: 2.2.0<br></p>';
				html += '<p>Kiadás dátuma: 2012. 01. 22.</p>';
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
					html += '<h3>Smile lista csoportba rendezése</h3>';
					html += '<p>A smile lista egy legördülő menüben jelenik meg ahol típusuk szerint csoportokba vannak rendezve. Például: szomorú, vidám, stb.</p>';
					html += '<div class="button" id="group_smiles"></div>';
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
			    html += '<button class="profile_save">Változások mentése</button>';
			    html += '<a href="#" class="new_profile">Új csoport hozzáadása</a>';
			html += '</div>';

			html += '<div class="settings_page">';
				html += '<ul id="ext_blocklist">';
					html += '<li id="ext_empty_blocklist">Jelenleg üres a tiltólistád</li>';
				html += '</ul>';
			html += '</div>';

			html += '<div class="settings_page sync">';
				
				html += '<div class="set">';
					html += '<form action="http://sgsync.dev.kreatura.hu/api/set/" method="post">';
						html += '<input type="hidden" name="nick">';
						html += '<input type="hidden" name="pass">';
						html += '<input type="hidden" name="data">';
					html += '</form>';
				html += '</div>';
				
				html += '<div class="signup">';
					html += '<h3>Regisztráció</h3>';
					html += '<p class="desc">';
						html += 'A jelszavad visszafejthető módon, lokálisan is tárolódik! ';
						html += 'Ha publikus számítógépeken is használod a bővítményt, ';
						html += 'válassz egyedi jelszót, amit máshol nem használsz!';
					html += '</p>';
					html += '<form action="http://sgsync.dev.kreatura.hu/api/signup/?callback=?" method="post">';
						html += '<input type="text" name="nick" placeholder="Felhasználónév">';
						html += '<input type="password" name="pass" placeholder="Jelszó">';
						html += '<button type="submit">Regisztráció</button>';
					html += '</form>';
				html += '</div>';
				
				html += '<div class="login">';
					html += '<h3>Belépés</h3>';
					html += '<form action="http://sgsync.dev.kreatura.hu/api/auth/?callback=?" method="post">';
						html += '<input type="text" name="nick" placeholder="Felhasználónév" value="'+dataStore['sync_nick']+'">';
						html += '<input type="password" name="pass" placeholder="Jelszó" value="'+dataStore['sync_pass']+'">';
						html += '<button type="submit">Belépés</button>';
						
						html += '<div class="status">';
							if(dataStore['sync_nick'] != '' && dataStore['sync_status'] == 'true') {
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
		$('.settings_page input:checkbox').click(function() {
			settings.save(this);
		});


		// Set select boxes
		$('.settings_page select').change(function() {
			settings.select(this);
		});
		
		
		// Reset blocks config
		$('#reset_blocks_config').click(function() {
			opera.extension.postMessage({ name : "setSetting", key : 'blocks_config', val : '' });
		});

		// Init profiles settings
		profiles_cp.init();

		// Init sync settings
		sync_cp.init();
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
			opera.extension.postMessage({ name : "setSetting", key : $(ele).attr('id'), val : 'true' });
			
			// Set new value to dataStore var
			dataStore[$(ele).attr('id')] = 'true';
	
			// Sync new settings
			if(dataStore['sync_status'] == 'true') {
				sync_cp.save();
			}
			
			// Check for interactive action
			if( typeof window[$(ele).attr('id')].activated != 'undefined') {
				window[$(ele).attr('id')].activated();
			}
		
		} else {

			// Save new settings ...
			opera.extension.postMessage({ name : "setSetting", key : $(ele).attr('id'), val : 'false' });
			
			// Set new value to dataStore var
			dataStore[$(ele).attr('id')] = 'false';

			// Sync new settings
			if(dataStore['sync_status'] == 'true') {
				sync_cp.save();
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
		
		// Update in localStorage
		opera.extension.postMessage({ name : "setSetting", key : $(ele).attr('id'), val : val });
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
		
		// Seriaize the form
		opera.extension.postMessage({ name : "setSetting", key : 'profiles', val : JSON.stringify(data) });

		// Save new settings in dataStore
		dataStore['profiles'] = JSON.stringify(data);
		
		// Save new settings in sync
		sync_cp.save();

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
		sync_cp.ping();
	},
	
	signup : function(data) {
		
		// Show the message
		alert(data.messages[0]);
		
		// On success
		if(data.errorCount == 0) {
			
			// Target elements
			var login_nick = $('.settings_page.sync .login input[name="nick"]');
			var login_pass = $('.settings_page.sync .login input[name="pass"]');
			
			// Get the values
			var signup_nick = $('.settings_page.sync .signup input[name="nick"]');
			var signup_pass = $('.settings_page.sync .signup input[name="pass"]');
			
			// Set the login values
			login_nick.val(signup_nick.val());
			login_pass.val(signup_pass.val());
			
			// Store login credentials in localStorage
			opera.extension.postMessage({ name : "setSetting", key : 'sync_nick', val : signup_nick.val() });
			opera.extension.postMessage({ name : "setSetting", key : 'sync_pass', val : signup_pass.val() });
			opera.extension.postMessage({ name : "setSetting", key : 'sync_status', val : 'true' });
			
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
			sync_cp.save();
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
			
			// Target elements
			var login_nick = $('.settings_page.sync .login input[name="nick"]');
			var login_pass = $('.settings_page.sync .login input[name="pass"]');
			
			// Clear HTML from previous tries
			$('.settings_page.sync .login .status').html('');
	
			html = '<div class="loggedin">&#10003;</div>';
			html += '<strong>Belépve mint: </strong>';
			html += '<span>'+login_nick.val()+'</span>';
			
			$(html).appendTo($('.settings_page.sync .login .status'));

			// Store login credentials in localStorage
			opera.extension.postMessage({ name : "setSetting", key : 'sync_nick', val : login_nick.val() });
			opera.extension.postMessage({ name : "setSetting", key : 'sync_pass', val : login_pass.val() });
			opera.extension.postMessage({ name : "setSetting", key : 'sync_status', val : 'true' });
			
			// Store login credentials in dataStore
			dataStore['sync_nick'] = login_nick.val();
			dataStore['sync_pass'] = login_pass.val();
			dataStore['sync_status'] = 'true';
			
			// Download the config
			sync_cp.get();
		}
	},
	
	
	ping : function() {

		// Exit when the user is not authenticated
		if(dataStore['sync_status'] != 'true') {
			return;
		}

		// Get current timestamp
		var time = Math.round(new Date().getTime() / 1000)

		if(dataStore['sync_last_sync'] < time - 60*10) {
			$.getJSON('http://sgsync.dev.kreatura.hu/api/ping/', { nick : dataStore['sync_nick'], pass : dataStore['sync_pass'] }, function(data) {
				if(data.date_m > dataStore['sync_last_sync']) {
					sync_cp.get();
				}
			});
		}
	},
	
	
	save : function() {
		
		// Target form
		var form = $('.settings_page.sync .set form');
		
		// Set fields
		$(form).find('input[name="nick"]').val(dataStore['sync_nick']);
		$(form).find('input[name="pass"]').val(dataStore['sync_pass']);
		$(form).find('input[name="data"]').val( JSON.stringify(dataStore) );

		// Make the request
		$.post( $(form).attr('action'), $(form).serialize() );
	},
	
	
	get : function() {
		
		$.getJSON('http://sgsync.dev.kreatura.hu/api/get/', { nick : dataStore['sync_nick'], pass : dataStore['sync_pass'] }, function(data) {
		
			if(data.errorCount > 0) {
				alert('A szinkronizáció meghiúsult, ellenőrizd a felhasználóneved, jelszavad!');
				return;
			}
		
			// Get current timestamp
			var time = Math.round(new Date().getTime() / 1000)

			// Update the last sync time
			opera.extension.postMessage({ name : "setSetting", key : 'sync_last_sync', val : time });
			
			// Update data in dataStore object
			dataStore = JSON.parse(data['settings']);
			
			// Update settings in localStorage
			for (var key in dataStore) {
				
				if(!key.match('sync')) {
					opera.extension.postMessage({ name : "setSetting", key : key, val : dataStore[key] });
				}
			}
			
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
