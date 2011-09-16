/**
 @preserve CLEditor BBCode Plugin v1.0.0
 http://premiumsoftware.net/cleditor
 requires CLEditor v1.3.0 or later
 
 Copyright 2010, Chris Landowski, Premium Software, LLC
 Dual licensed under the MIT or GPL Version 2 licenses.
*/

// ==ClosureCompiler==
// @compilation_level SIMPLE_OPTIMIZATIONS
// @output_file_name jquery.cleditor.bbcode.min.js
// ==/ClosureCompiler==

/*

  The CLEditor useCSS optional parameter should be set to false for this plugin
  to function properly.

  Supported HTML and BBCode Tags:

  Bold              <b>Hello</b>
                    [b]Hello[/b]
  Italics           <i>Hello</i>
                    [i]Hello[/i]
  Underlined        <u>Hello</u>
                    [u]Hello[/u]
  Strikethrough     <strike>Hello</strike>
                    [s]Hello[/s]
  Unordered Lists   <ul><li>Red</li><li>Blue</li><li>Green</li></ul>
                    [list][*]Red[/*][*]Green[/*][*]Blue[/*][/list]
  Ordered Lists     <ol><li>Red</li><li>Blue</li><li>Green</li></ol>
                    [list=1][*]Red[/*][*]Green[/*][*]Blue[/*][/list]
  Images            <img src="http://premiumsoftware.net/image.jpg">
                    [img]http://premiumsoftware.net/image.jpg[/img]
  Links             <a href="http://premiumsoftware.net">Premium Software</a>
                    [url=http://premiumsoftware.net]Premium Software[/url]

*/

(function($) {

  // BBCode only supports a small subset of HTML, so remove
  // any toolbar buttons that are not currently supported.
  $.cleditor.defaultOptions.controls =
	"bold italic underline | size color removeformat | " +
	"alignleft center alignright | " +
	"image link unlink | undo redo source";

  // Save the previously assigned callback handlers
  var oldAreaCallback = $.cleditor.defaultOptions.updateTextArea;
  var oldFrameCallback = $.cleditor.defaultOptions.updateFrame;

  // Wireup the updateTextArea callback handler
  $.cleditor.defaultOptions.updateTextArea = function(html) {

    // Fire the previously assigned callback handler
    if (oldAreaCallback)
      html = oldAreaCallback(html);

    // Convert the HTML to BBCode
    return $.cleditor.convertHTMLtoBBCode(html);

  }

  // Wireup the updateFrame callback handler
  $.cleditor.defaultOptions.updateFrame = function(code) {

    // Fire the previously assigned callback handler
    if (oldFrameCallback)
      code = oldFrameCallback(code);

    // Convert the BBCode to HTML
    return $.cleditor.convertBBCodeToHTML(code);

  }

  // Expose the convertHTMLtoBBCode method
  $.cleditor.convertHTMLtoBBCode = function(html) {
		
    $.each([
      [/[\r|\n]/g, ""],
      
		// BR
		[/<br.*?>/gi, "\r\n"],
		
		// Remove idents
		[/&nbsp;/gi, "  "],
		
		// Get content that surrounded by a DIV
		[/<div>([\s\S]*?)<\/div>/img, "\r\n$1"],
		
		// Bold
		[/<b>([\s\S]*?)<\/b>/gi, "[b]$1[/b]"],
		[/<strong>([\s\S]*?)<\/strong>/gi, "[b]$1[/b]"],
      
		// Italic
		[/<i>([\s\S]*?)<\/i>/gi, "[i]$1[/i]"],
		[/<em>([\s\S]*?)<\/em>/gi, "[i]$1[/i]"],
      
		// Underline
		[/<u>([\s\S]*?)<\/u>/gi, "[u]$1[/u]"],
		[/<ins>([\s\S]*?)<\/ins>/gi, "[u]$1[/u]"],
      
		// Font sizes
		[/<font class="Apple-style-span" size="1">([\s\S]*?)<\/font>/img, "[apro]$1[/apro]"],
		[/<font class="Apple-style-span" size="2">([\s\S]*?)<\/font>/img, "$1"],
		[/<font class="Apple-style-span" size="4">([\s\S]*?)<\/font>/img, "[nagy]$1[/nagy]"],
		[/<font class="Apple-style-span" size="5">([\s\S]*?)<\/font>/img, "[hatalmas]$1[/hatalmas]"],
		[/<font class="Apple-style-span" size="6">([\s\S]*?)<\/font>/img, "[brutalnagy]$1[/brutalnagy]"],
      
		// Font color
		[/<font class="Apple-style-span" color="#ff0000">([\s\S]*?)<\/font>/img, "[szin=red]$1[/szin]"],
		[/<font class="Apple-style-span" color="#ff00ff">([\s\S]*?)<\/font>/img, "[szin=magenta]$1[/szin]"],
		[/<font class="Apple-style-span" color="#800080">([\s\S]*?)<\/font>/img, "[szin=purple]$1[/szin]"],
		[/<font class="Apple-style-span" color="#0000ff">([\s\S]*?)<\/font>/img, "[szin=blue]$1[/szin]"],
		[/<font class="Apple-style-span" color="#00ffff">([\s\S]*?)<\/font>/img, "[szin=cyan]$1[/szin]"],
		[/<font class="Apple-style-span" color="#00ff00">([\s\S]*?)<\/font>/img, "[szin=lime]$1[/szin]"],
		[/<font class="Apple-style-span" color="#008000">([\s\S]*?)<\/font>/img, "[szin=green]$1[/szin]"],
		[/<font class="Apple-style-span" color="#ffff00">([\s\S]*?)<\/font>/img, "[szin=yellow]$1[/szin]"],
		[/<font class="Apple-style-span" color="#ffa500">([\s\S]*?)<\/font>/img, "[szin=orange]$1[/szin]"],
  
		// Font color and size
		[/<font class="Apple-style-span" color="#ff0000" size="1">([\s\S]*?)<\/font>/img, "[apro][szin=red]$1[/szin][/apro]"],
		[/<font class="Apple-style-span" color="#ff00ff" size="1">([\s\S]*?)<\/font>/img, "[apro][szin=magenta]$1[/szin][/apro]"],
		[/<font class="Apple-style-span" color="#800080" size="1">([\s\S]*?)<\/font>/img, "[apro][szin=purple]$1[/szin][/apro]"],
		[/<font class="Apple-style-span" color="#0000ff" size="1">([\s\S]*?)<\/font>/img, "[apro][szin=blue]$1[/szin][/apro]"],
		[/<font class="Apple-style-span" color="#00ffff" size="1">([\s\S]*?)<\/font>/img, "[apro][szin=cyan]$1[/szin][/apro]"],
		[/<font class="Apple-style-span" color="#00ff00" size="1">([\s\S]*?)<\/font>/img, "[apro][szin=lime]$1[/szin][/apro]"],
		[/<font class="Apple-style-span" color="#008000" size="1">([\s\S]*?)<\/font>/img, "[apro][szin=green]$1[/szin][/apro]"],
		[/<font class="Apple-style-span" color="#ffff00" size="1">([\s\S]*?)<\/font>/img, "[apro][szin=yellow]$1[/szin][/apro]"],
		[/<font class="Apple-style-span" color="#ffa500" size="1">([\s\S]*?)<\/font>/img, "[apro][szin=orange]$1[/szin][/apro]"], 

		[/<font class="Apple-style-span" color="#ff0000" size="2">([\s\S]*?)<\/font>/img, "[szin=red]$1[/szin]"],
		[/<font class="Apple-style-span" color="#ff00ff" size="2">([\s\S]*?)<\/font>/img, "[szin=magenta]$1[/szin]"],
		[/<font class="Apple-style-span" color="#800080" size="2">([\s\S]*?)<\/font>/img, "[szin=purple]$1[/szin]"],
		[/<font class="Apple-style-span" color="#0000ff" size="2">([\s\S]*?)<\/font>/img, "[szin=blue]$1[/szin]"],
		[/<font class="Apple-style-span" color="#00ffff" size="2">([\s\S]*?)<\/font>/img, "[szin=cyan]$1[/szin]"],
		[/<font class="Apple-style-span" color="#00ff00" size="2">([\s\S]*?)<\/font>/img, "[szin=lime]$1[/szin]"],
		[/<font class="Apple-style-span" color="#008000" size="2">([\s\S]*?)<\/font>/img, "[szin=green]$1[/szin]"],
		[/<font class="Apple-style-span" color="#ffff00" size="2">([\s\S]*?)<\/font>/img, "[szin=yellow]$1[/szin]"],
		[/<font class="Apple-style-span" color="#ffa500" size="2">([\s\S]*?)<\/font>/img, "[szin=orange]$1[/szin]"], 

		[/<font class="Apple-style-span" color="#ff0000" size="4">([\s\S]*?)<\/font>/img, "[nagy][szin=red]$1[/szin][/nagy]"],
		[/<font class="Apple-style-span" color="#ff00ff" size="4">([\s\S]*?)<\/font>/img, "[nagy][szin=magenta]$1[/szin][/nagy]"],
		[/<font class="Apple-style-span" color="#800080" size="4">([\s\S]*?)<\/font>/img, "[nagy][szin=purple]$1[/szin][/nagy]"],
		[/<font class="Apple-style-span" color="#0000ff" size="4">([\s\S]*?)<\/font>/img, "[nagy][szin=blue]$1[/szin][/nagy]"],
		[/<font class="Apple-style-span" color="#00ffff" size="4">([\s\S]*?)<\/font>/img, "[nagy][szin=cyan]$1[/szin][/nagy]"],
		[/<font class="Apple-style-span" color="#00ff00" size="4">([\s\S]*?)<\/font>/img, "[nagy][szin=lime]$1[/szin][/nagy]"],
		[/<font class="Apple-style-span" color="#008000" size="4">([\s\S]*?)<\/font>/img, "[nagy][szin=green]$1[/szin][/nagy]"],
		[/<font class="Apple-style-span" color="#ffff00" size="4">([\s\S]*?)<\/font>/img, "[nagy][szin=yellow]$1[/szin][/nagy]"],
		[/<font class="Apple-style-span" color="#ffa500" size="4">([\s\S]*?)<\/font>/img, "[nagy][szin=orange]$1[/szin][/nagy]"], 

		[/<font class="Apple-style-span" color="#ff0000" size="5">([\s\S]*?)<\/font>/img, "[hatalmas][szin=red]$1[/szin][/hatalmas]"],
		[/<font class="Apple-style-span" color="#ff00ff" size="5">([\s\S]*?)<\/font>/img, "[hatalmas][szin=magenta]$1[/szin][/hatalmas]"],
		[/<font class="Apple-style-span" color="#800080" size="5">([\s\S]*?)<\/font>/img, "[hatalmas][szin=purple]$1[/szin][/hatalmas]"],
		[/<font class="Apple-style-span" color="#0000ff" size="5">([\s\S]*?)<\/font>/img, "[hatalmas][szin=blue]$1[/szin][/hatalmas]"],
		[/<font class="Apple-style-span" color="#00ffff" size="5">([\s\S]*?)<\/font>/img, "[hatalmas][szin=cyan]$1[/szin][/hatalmas]"],
		[/<font class="Apple-style-span" color="#00ff00" size="5">([\s\S]*?)<\/font>/img, "[hatalmas][szin=lime]$1[/szin][/hatalmas]"],
		[/<font class="Apple-style-span" color="#008000" size="5">([\s\S]*?)<\/font>/img, "[hatalmas][szin=green]$1[/szin][/hatalmas]"],
		[/<font class="Apple-style-span" color="#ffff00" size="5">([\s\S]*?)<\/font>/img, "[hatalmas][szin=yellow]$1[/szin][/hatalmas]"],
		[/<font class="Apple-style-span" color="#ffa500" size="5">([\s\S]*?)<\/font>/img, "[hatalmas][szin=orange]$1[/szin][/hatalmas]"],    

		[/<font class="Apple-style-span" color="#ff0000" size="6">([\s\S]*?)<\/font>/img, "[brutalnagy][szin=red]$1[/szin][/brutalnagy]"],
		[/<font class="Apple-style-span" color="#ff00ff" size="6">([\s\S]*?)<\/font>/img, "[brutalnagy][szin=magenta]$1[/szin][/brutalnagy]"],
		[/<font class="Apple-style-span" color="#800080" size="6">([\s\S]*?)<\/font>/img, "[brutalnagy][szin=purple]$1[/szin][/brutalnagy]"],
		[/<font class="Apple-style-span" color="#0000ff" size="6">([\s\S]*?)<\/font>/img, "[brutalnagy][szin=blue]$1[/szin][/brutalnagy]"],
		[/<font class="Apple-style-span" color="#00ffff" size="6">([\s\S]*?)<\/font>/img, "[brutalnagy][szin=cyan]$1[/szin][/brutalnagy]"],
		[/<font class="Apple-style-span" color="#00ff00" size="6">([\s\S]*?)<\/font>/img, "[brutalnagy][szin=lime]$1[/szin][/brutalnagy]"],
		[/<font class="Apple-style-span" color="#008000" size="6">([\s\S]*?)<\/font>/img, "[brutalnagy][szin=green]$1[/szin][/brutalnagy]"],
		[/<font class="Apple-style-span" color="#ffff00" size="6">([\s\S]*?)<\/font>/img, "[brutalnagy][szin=yellow]$1[/szin][/brutalnagy]"],
		[/<font class="Apple-style-span" color="#ffa500" size="6">([\s\S]*?)<\/font>/img, "[brutalnagy][szin=orange]$1[/szin][/brutalnagy]"], 

		// Text align
		[/<div align="left">([\s\S]*?)<\/div>/img, "$1"],
		[/<div align="center">([\s\S]*?)<\/div>/img, "[center]$1[/center]"],
		[/<div align="right">([\s\S]*?)<\/div>/img, "[right]$1[/right]"],

		// Smiles
		[/<img.*?src.*kep\/faces\/hamm.gif".*?>/gmi, "[#hamm]"],
		[/<img.*?src.*kep\/faces\/mf1.gif".*?>/gmi, "[#mf1]"],
		[/<img.*?src.*kep\/faces\/vigyor4.gif".*?>/gmi, "[#vigyor4]"],
		[/<img.*?src.*kep\/faces\/kocsog.gif".*?>/gmi, "[#kocsog]"],
		[/<img.*?src.*kep\/faces\/puszi.gif".*?>/gmi, "[#puszi]"],
		[/<img.*?src.*kep\/faces\/pias.gif".*?>/gmi, "[#pias]"],
		[/<img.*?src.*kep\/faces\/duhos2.gif".*?>/gmi, "[#duhos2]"],
		[/<img.*?src.*kep\/faces\/puszis.gif".*?>/gmi, "[#puszis]"],
		[/<img.*?src.*kep\/faces\/felkialtas.gif".*?>/gmi, "[#felkialtas]"],
		[/<img.*?src.*kep\/faces\/csodalk.gif".*?>/gmi, "[#csodalk]"],
		[/<img.*?src.*kep\/faces\/alien2.gif".*?>/gmi, "[#alien2]"],
		[/<img.*?src.*kep\/faces\/wow1.gif".*?>/gmi, "[#wow1]"],
		[/<img.*?src.*kep\/faces\/szomoru2.gif".*?>/gmi, "[#szomoru2]"],
		[/<img.*?src.*kep\/faces\/levele.gif".*?>/gmi, "[#levele]"],
		[/<img.*?src.*kep\/faces\/conf.gif".*?>/gmi, "[#conf]"],
		[/<img.*?src.*kep\/faces\/rolleyes.gif".*?>/gmi, "[#rolleyes]"],
		[/<img.*?src.*kep\/faces\/nevetes1.gif".*?>/gmi, "[#nevetes1]"],
		[/<img.*?src.*kep\/faces\/eplus2.gif".*?>/gmi, "[#eplus2]"],
		[/<img.*?src.*kep\/faces\/dumcsi.gif".*?>/gmi, "[#dumcsi]"],
		[/<img.*?src.*kep\/faces\/kacsint.gif".*?>/gmi, "[#kacsint]"],
		[/<img.*?src.*kep\/faces\/shakehead.gif".*?>/gmi, "[#shakehead]"],
		[/<img.*?src.*kep\/faces\/duma.gif".*?>/gmi, "[#duma]"],
		[/<img.*?src.*kep\/faces\/whatever.gif".*?>/gmi, "[#whatever]"],
		[/<img.*?src.*kep\/faces\/zavart1.gif".*?>/gmi, "[#zavart1]"],
		[/<img.*?src.*kep\/faces\/merges3.gif".*?>/gmi, "[#merges3]"],
		[/<img.*?src.*kep\/faces\/taps.gif".*?>/gmi, "[#taps]"],
		[/<img.*?src.*kep\/faces\/gonosz3.gif".*?>/gmi, "[#gonosz3]"],
		[/<img.*?src.*kep\/faces\/eljen.gif".*?>/gmi, "[#eljen]"],
		[/<img.*?src.*kep\/faces\/rinya.gif".*?>/gmi, "[#rinya]"],
		[/<img.*?src.*kep\/faces\/confused.gif".*?>/gmi, "[#confused]"],
		[/<img.*?src.*kep\/faces\/zavart2.gif".*?>/gmi, "[#zavart2]"],
		[/<img.*?src.*kep\/faces\/finom.gif".*?>/gmi, "[#finom]"],
		[/<img.*?src.*kep\/faces\/papakacsint.gif".*?>/gmi, "[#papakacsint]"],
		[/<img.*?src.*kep\/faces\/action.gif".*?>/gmi, "[#action]"],
		[/<img.*?src.*kep\/faces\/vigyor2.gif".*?>/gmi, "[#vigyor2]"],
		[/<img.*?src.*kep\/faces\/fejvakaras.gif".*?>/gmi, "[#fejvakaras]"],
		[/<img.*?src.*kep\/faces\/wave.gif".*?>/gmi, "[#wave]"],
		[/<img.*?src.*kep\/faces\/falbav.gif".*?>/gmi, "[#falbav]"],
		[/<img.*?src.*kep\/faces\/pardon1.gif".*?>/gmi, "[#pardon1]"],
		[/<img.*?src.*kep\/faces\/circling.gif".*?>/gmi, "[#circling]"],
		[/<img.*?src.*kep\/faces\/vigyor5.gif".*?>/gmi, "[#vigyor5]"],
		[/<img.*?src.*kep\/faces\/idiota.gif".*?>/gmi, "[#idiota]"],
		[/<img.*?src.*kep\/faces\/bohoc.gif".*?>/gmi, "[#bohoc]"],
		[/<img.*?src.*kep\/faces\/law.gif".*?>/gmi, "[#law]"],
		[/<img.*?src.*kep\/faces\/help.gif".*?>/gmi, "[#help]"],
		[/<img.*?src.*kep\/faces\/bee1.gif".*?>/gmi, "[#bee1]"],
		[/<img.*?src.*kep\/faces\/nyes.gif".*?>/gmi, "[#nyes]"],
		[/<img.*?src.*kep\/faces\/alien.gif".*?>/gmi, "[#alien]"],
		[/<img.*?src.*kep\/faces\/lookaround.gif".*?>/gmi, "[#lookaround]"],
		[/<img.*?src.*kep\/faces\/bdead.gif".*?>/gmi, "[#bdead]"],
		[/<img.*?src.*kep\/faces\/buck.gif".*?>/gmi, "[#buck]"],
		[/<img.*?src.*kep\/faces\/ejnye1.gif".*?>/gmi, "[#ejnye1]"],
		[/<img.*?src.*kep\/faces\/lama.gif".*?>/gmi, "[#lama]"],
		[/<img.*?src.*kep\/faces\/miaz.gif".*?>/gmi, "[#miaz]"],
		[/<img.*?src.*kep\/faces\/unalmas.gif".*?>/gmi, "[#unalmas]"],
		[/<img.*?src.*kep\/faces\/ticking.gif".*?>/gmi, "[#ticking]"],
		[/<img.*?src.*kep\/faces\/ravasz1.gif".*?>/gmi, "[#ravasz1]"],
		[/<img.*?src.*kep\/faces\/kerdes.gif".*?>/gmi, "[#kerdes]"],
		[/<img.*?src.*kep\/faces\/ijedt.gif".*?>/gmi, "[#ijedt]"],
		[/<img.*?src.*kep\/faces\/worship.gif".*?>/gmi, "[#worship]"],
		[/<img.*?src.*kep\/faces\/sniffles.gif".*?>/gmi, "[#sniffles]"],
		[/<img.*?src.*kep\/faces\/schmoll2.gif".*?>/gmi, "[#schmoll2]"],
		[/<img.*?src.*kep\/faces\/wink.gif".*?>/gmi, "[#wink]"],
		[/<img.*?src.*kep\/faces\/beka2.gif".*?>/gmi, "[#beka2]"],
		[/<img.*?src.*kep\/faces\/crazya.gif".*?>/gmi, "[#crazya]"],
		[/<img.*?src.*kep\/faces\/beka3.gif".*?>/gmi, "[#beka3]"],
		[/<img.*?src.*kep\/faces\/szomoru1.gif".*?>/gmi, "[#szomoru1]"],
		[/<img.*?src.*kep\/faces\/hawaii.gif".*?>/gmi, "[#hawaii]"],
		[/<img.*?src.*kep\/faces\/wow3.gif".*?>/gmi, "[#wow3]"],
		[/<img.*?src.*kep\/faces\/szeret.gif".*?>/gmi, "[#szeret]"],
		[/<img.*?src.*kep\/faces\/nemtudom.gif".*?>/gmi, "[#nemtudom]"],
		[/<img.*?src.*kep\/faces\/vigyor.gif".*?>/gmi, "[#vigyor]"],
		[/<img.*?src.*kep\/faces\/hehe.gif".*?>/gmi, "[#hehe]"],
		[/<img.*?src.*kep\/faces\/nezze.gif".*?>/gmi, "[#nezze]"],
		[/<img.*?src.*kep\/faces\/banplz.gif".*?>/gmi, "[#banplz]"],
		[/<img.*?src.*kep\/faces\/violent.gif".*?>/gmi, "[#violent]"],
		[/<img.*?src.*kep\/faces\/smile.gif".*?>/gmi, "[#smile]"],
		[/<img.*?src.*kep\/faces\/nevetes2.gif".*?>/gmi, "[#nevetes2]"],
		[/<img.*?src.*kep\/faces\/gunyos1.gif".*?>/gmi, "[#gunyos1]"],
		[/<img.*?src.*kep\/faces\/vigyor1.gif".*?>/gmi, "[#vigyor1]"],
		[/<img.*?src.*kep\/faces\/boxer.gif".*?>/gmi, "[#boxer]"],
		[/<img.*?src.*kep\/faces\/phone.gif".*?>/gmi, "[#phone]"],
		[/<img.*?src.*kep\/faces\/sir.gif".*?>/gmi, "[#sir]"],
		[/<img.*?src.*kep\/faces\/heureka.gif".*?>/gmi, "[#heureka]"],
		[/<img.*?src.*kep\/faces\/gonosz2.gif".*?>/gmi, "[#gonosz2]"],
		[/<img.*?src.*kep\/faces\/love11.gif".*?>/gmi, "[#love11]"],
		[/<img.*?src.*kep\/faces\/vomit.gif".*?>/gmi, "[#vomit]"],
		[/<img.*?src.*kep\/faces\/wilting.gif".*?>/gmi, "[#wilting]"],
		[/<img.*?src.*kep\/faces\/email.gif".*?>/gmi, "[#email]"],
		[/<img.*?src.*kep\/faces\/kuss.gif".*?>/gmi, "[#kuss]"],
		[/<img.*?src.*kep\/faces\/fogmosas.gif".*?>/gmi, "[#fogmosas]"],
		[/<img.*?src.*kep\/faces\/vigyor0.gif".*?>/gmi, "[#vigyor0]"],
		[/<img.*?src.*kep\/faces\/gonosz1.gif".*?>/gmi, "[#gonosz1]"],
		[/<img.*?src.*kep\/faces\/mf2.gif".*?>/gmi, "[#mf2]"],
		[/<img.*?src.*kep\/faces\/gun.gif".*?>/gmi, "[#gun]"],
		[/<img.*?src.*kep\/faces\/awink.gif".*?>/gmi, "[#awink]"],
		[/<img.*?src.*kep\/faces\/oooo.gif".*?>/gmi, "[#oooo]"],
		[/<img.*?src.*kep\/faces\/integet2.gif".*?>/gmi, "[#integet2]"],
		[/<img.*?src.*kep\/faces\/merges2.gif".*?>/gmi, "[#merges2]"],
		[/<img.*?src.*kep\/faces\/wow2.gif".*?>/gmi, "[#wow2]"],
		[/<img.*?src.*kep\/faces\/guluszem1.gif".*?>/gmi, "[#guluszem1]"],
		[/<img.*?src.*kep\/faces\/vigyor3.gif".*?>/gmi, "[#vigyor3]"],
		[/<img.*?src.*kep\/faces\/love12.gif".*?>/gmi, "[#love12]"],   

		// Anchor and images
		[/<a.*?href="(.*?)".*?>(.*?)<\/a>/gi, "[url=$1]$2[/url]"],
		[/<img.*?src="(.*?)".*?>/gi, "[img]$1[/img]"],
		
		// Convert all HTML elements to nothing
		[/<.*?>(.*?)<\/.*?>/g, "$1"]
		
      ], function(index, item) {
        html = html.replace(item[0], item[1]);
      });

    return html;

  }

  // Expose the convertBBCodeToHTML method
  $.cleditor.convertBBCodeToHTML = function(code) {

    $.each([
      [/\r/g, ""],
      
		// BR
		[/\n/g, "<br />"],
      
		// Bold
		[/\[b\](.*?)\[\/b\]/gi, "<b>$1</b>"],
      
		// Italic
		[/\[i\](.*?)\[\/i\]/gi, "<i>$1</i>"],
      
		// Underline
		[/\[u\](.*?)\[\/u\]/gi, "<u>$1</u>"],

		// Font sizes
		[/\[apro\]([\s\S]*?)\[\/apro]/gim, '<font class="Apple-style-span" size="1" >$1</font>'],
		[/\[nagy\]([\s\S]*?)\[\/nagy]/gim, '<font class="Apple-style-span" size="4" >$1</font>'],
		[/\[hatalmas\]([\s\S]*?)\[\/hatalmas]/gim, '<font class="Apple-style-span" size="5" >$1</font>'],
		[/\[brutalnagy\]([\s\S]*?)\[\/brutalnagy]/gim, '<font class="Apple-style-span" size="6" >$1</font>'],

		// Font color
		[/\[szin=red\]([\s\S]*?)\[\/szin]/gim, '<font class="Apple-style-span" color="#ff0000">$1</font>'],
		[/\[szin=magenta\]([\s\S]*?)\[\/szin]/gim, '<font class="Apple-style-span" color="#ff00ff">$1</font>'],
		[/\[szin=purple\]([\s\S]*?)\[\/szin]/gim, '<font class="Apple-style-span" color="#800080">$1</font>'],
		[/\[szin=blue\]([\s\S]*?)\[\/szin]/gim, '<font class="Apple-style-span" color="#0000ff">$1</font>'],
		[/\[szin=cyan\]([\s\S]*?)\[\/szin]/gim, '<font class="Apple-style-span" color="#00ffff">$1</font>'],
		[/\[szin=lime\]([\s\S]*?)\[\/szin]/gim, '<font class="Apple-style-span" color="#00ff00">$1</font>'],
		[/\[szin=green\]([\s\S]*?)\[\/szin]/gim, '<font class="Apple-style-span" color="#008000">$1</font>'],
		[/\[szin=yellow\]([\s\S]*?)\[\/szin]/gim, '<font class="Apple-style-span" color="#ffff00">$1</font>'],
		[/\[szin=orange\]([\s\S]*?)\[\/szin]/gim, '<font class="Apple-style-span" color="#ffa500">$1</font>'],
      
		// Text align
		[/\[center\]([\s\S]*?)\[\/center]/gim, '<div align="center">$1</div>'],
		[/\[right\]([\s\S]*?)\[\/right]/gim, '<div align="right">$1</div>'],
		
		// Smiles
		[/\[#hamm]/gmi, '<img src="kep/faces/hamm.gif">'],
		[/\[#mf1]/gmi, '<img src="kep/faces/mf1.gif">'],
		[/\[#vigyor4]/gmi, '<img src="kep/faces/vigyor4.gif">'],
		[/\[#kocsog]/gmi, '<img src="kep/faces/kocsog.gif">'],
		[/\[#puszi]/gmi, '<img src="kep/faces/puszi.gif">'],
		[/\[#pias]/gmi, '<img src="kep/faces/pias.gif">'],
		[/\[#duhos2]/gmi, '<img src="kep/faces/duhos2.gif">'],
		[/\[#puszis]/gmi, '<img src="kep/faces/puszis.gif">'],
		[/\[#felkialtas]/gmi, '<img src="kep/faces/felkialtas.gif">'],
		[/\[#csodalk]/gmi, '<img src="kep/faces/csodalk.gif">'],
		[/\[#alien2]/gmi, '<img src="kep/faces/alien2.gif">'],
		[/\[#wow1]/gmi, '<img src="kep/faces/wow1.gif">'],
		[/\[#szomoru2]/gmi, '<img src="kep/faces/szomoru2.gif">'],
		[/\[#levele]/gmi, '<img src="kep/faces/levele.gif">'],
		[/\[#conf]/gmi, '<img src="kep/faces/conf.gif">'],
		[/\[#rolleyes]/gmi, '<img src="kep/faces/rolleyes.gif">'],
		[/\[#nevetes1]/gmi, '<img src="kep/faces/nevetes1.gif">'],
		[/\[#eplus2]/gmi, '<img src="kep/faces/eplus2.gif">'],
		[/\[#dumcsi]/gmi, '<img src="kep/faces/dumcsi.gif">'],
		[/\[#kacsint]/gmi, '<img src="kep/faces/kacsint.gif">'],
		[/\[#shakehead]/gmi, '<img src="kep/faces/shakehead.gif">'],
		[/\[#duma]/gmi, '<img src="kep/faces/duma.gif">'],
		[/\[#whatever]/gmi, '<img src="kep/faces/whatever.gif">'],
		[/\[#zavart1]/gmi, '<img src="kep/faces/zavart1.gif">'],
		[/\[#merges3]/gmi, '<img src="kep/faces/merges3.gif">'],
		[/\[#taps]/gmi, '<img src="kep/faces/taps.gif">'],
		[/\[#gonosz3]/gmi, '<img src="kep/faces/gonosz3.gif">'],
		[/\[#eljen]/gmi, '<img src="kep/faces/eljen.gif">'],
		[/\[#rinya]/gmi, '<img src="kep/faces/rinya.gif">'],
		[/\[#confused]/gmi, '<img src="kep/faces/confused.gif">'],
		[/\[#zavart2]/gmi, '<img src="kep/faces/zavart2.gif">'],
		[/\[#finom]/gmi, '<img src="kep/faces/finom.gif">'],
		[/\[#papakacsint]/gmi, '<img src="kep/faces/papakacsint.gif">'],
		[/\[#action]/gmi, '<img src="kep/faces/action.gif">'],
		[/\[#vigyor2]/gmi, '<img src="kep/faces/vigyor2.gif">'],
		[/\[#fejvakaras]/gmi, '<img src="kep/faces/fejvakaras.gif">'],
		[/\[#wave]/gmi, '<img src="kep/faces/wave.gif">'],
		[/\[#falbav]/gmi, '<img src="kep/faces/falbav.gif">'],
		[/\[#pardon1]/gmi, '<img src="kep/faces/pardon1.gif">'],
		[/\[#circling]/gmi, '<img src="kep/faces/circling.gif">'],
		[/\[#vigyor5]/gmi, '<img src="kep/faces/vigyor5.gif">'],
		[/\[#idiota]/gmi, '<img src="kep/faces/idiota.gif">'],
		[/\[#bohoc]/gmi, '<img src="kep/faces/bohoc.gif">'],
		[/\[#law]/gmi, '<img src="kep/faces/law.gif">'],
		[/\[#help]/gmi, '<img src="kep/faces/help.gif">'],
		[/\[#bee1]/gmi, '<img src="kep/faces/bee1.gif">'],
		[/\[#nyes]/gmi, '<img src="kep/faces/nyes.gif">'],
		[/\[#alien]/gmi, '<img src="kep/faces/alien.gif">'],
		[/\[#lookaround]/gmi, '<img src="kep/faces/lookaround.gif">'],
		[/\[#bdead]/gmi, '<img src="kep/faces/bdead.gif">'],
		[/\[#buck]/gmi, '<img src="kep/faces/buck.gif">'],
		[/\[#ejnye1]/gmi, '<img src="kep/faces/ejnye1.gif">'],
		[/\[#lama]/gmi, '<img src="kep/faces/lama.gif">'],
		[/\[#miaz]/gmi, '<img src="kep/faces/miaz.gif">'],
		[/\[#unalmas]/gmi, '<img src="kep/faces/unalmas.gif">'],
		[/\[#ticking]/gmi, '<img src="kep/faces/ticking.gif">'],
		[/\[#ravasz1]/gmi, '<img src="kep/faces/ravasz1.gif">'],
		[/\[#kerdes]/gmi, '<img src="kep/faces/kerdes.gif">'],
		[/\[#ijedt]/gmi, '<img src="kep/faces/ijedt.gif">'],
		[/\[#worship]/gmi, '<img src="kep/faces/worship.gif">'],
		[/\[#sniffles]/gmi, '<img src="kep/faces/sniffles.gif">'],
		[/\[#schmoll2]/gmi, '<img src="kep/faces/schmoll2.gif">'],
		[/\[#wink]/gmi, '<img src="kep/faces/wink.gif">'],
		[/\[#beka2]/gmi, '<img src="kep/faces/beka2.gif">'],
		[/\[#crazya]/gmi, '<img src="kep/faces/crazya.gif">'],
		[/\[#beka3]/gmi, '<img src="kep/faces/beka3.gif">'],
		[/\[#szomoru1]/gmi, '<img src="kep/faces/szomoru1.gif">'],
		[/\[#hawaii]/gmi, '<img src="kep/faces/hawaii.gif">'],
		[/\[#wow3]/gmi, '<img src="kep/faces/wow3.gif">'],
		[/\[#szeret]/gmi, '<img src="kep/faces/szeret.gif">'],
		[/\[#nemtudom]/gmi, '<img src="kep/faces/nemtudom.gif">'],
		[/\[#vigyor]/gmi, '<img src="kep/faces/vigyor.gif">'],
		[/\[#hehe]/gmi, '<img src="kep/faces/hehe.gif">'],
		[/\[#nezze]/gmi, '<img src="kep/faces/nezze.gif">'],
		[/\[#banplz]/gmi, '<img src="kep/faces/banplz.gif">'],
		[/\[#violent]/gmi, '<img src="kep/faces/violent.gif">'],
		[/\[#smile]/gmi, '<img src="kep/faces/smile.gif">'],
		[/\[#nevetes2]/gmi, '<img src="kep/faces/nevetes2.gif">'],
		[/\[#gunyos1]/gmi, '<img src="kep/faces/gunyos1.gif">'],
		[/\[#vigyor1]/gmi, '<img src="kep/faces/vigyor1.gif">'],
		[/\[#boxer]/gmi, '<img src="kep/faces/boxer.gif">'],
		[/\[#phone]/gmi, '<img src="kep/faces/phone.gif">'],
		[/\[#sir]/gmi, '<img src="kep/faces/sir.gif">'],
		[/\[#heureka]/gmi, '<img src="kep/faces/heureka.gif">'],
		[/\[#gonosz2]/gmi, '<img src="kep/faces/gonosz2.gif">'],
		[/\[#love11]/gmi, '<img src="kep/faces/love11.gif">'],
		[/\[#vomit]/gmi, '<img src="kep/faces/vomit.gif">'],
		[/\[#wilting]/gmi, '<img src="kep/faces/wilting.gif">'],
		[/\[#email]/gmi, '<img src="kep/faces/email.gif">'],
		[/\[#kuss]/gmi, '<img src="kep/faces/kuss.gif">'],
		[/\[#fogmosas]/gmi, '<img src="kep/faces/fogmosas.gif">'],
		[/\[#vigyor0]/gmi, '<img src="kep/faces/vigyor0.gif">'],
		[/\[#gonosz1]/gmi, '<img src="kep/faces/gonosz1.gif">'],
		[/\[#mf2]/gmi, '<img src="kep/faces/mf2.gif">'],
		[/\[#gun]/gmi, '<img src="kep/faces/gun.gif">'],
		[/\[#awink]/gmi, '<img src="kep/faces/awink.gif">'],
		[/\[#oooo]/gmi, '<img src="kep/faces/oooo.gif">'],
		[/\[#integet2]/gmi, '<img src="kep/faces/integet2.gif">'],
		[/\[#merges2]/gmi, '<img src="kep/faces/merges2.gif">'],
		[/\[#wow2]/gmi, '<img src="kep/faces/wow2.gif">'],
		[/\[#guluszem1]/gmi, '<img src="kep/faces/guluszem1.gif">'],
		[/\[#vigyor3]/gmi, '<img src="kep/faces/vigyor3.gif">'],
		[/\[#love12]/gmi, '<img src="kep/faces/love12.gif">'],  

		// Anchor and images
		[/\[url=(.*?)\](.*?)\[\/url\]/gi, "<a href=\"$1\">$2</a>"],
		[/\[img\](.*?)\[\/img\]/gi, "<img src=\"$1\">"],

      ], function(index, item) {
        code = code.replace(item[0], item[1]);
      });

    return code;

  }

})(jQuery);