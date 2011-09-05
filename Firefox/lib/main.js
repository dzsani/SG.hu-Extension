// Get page-mod object to load content scripts
var pageMod = require("page-mod");

// Get data object for loadin resources
var data = require("self").data;

pageMod.PageMod({
  include: ["http://sg.hu/*", "http://www.sg.hu/*"],
  contentScriptWhen: 'start',
  contentScriptFile:
    [data.url("js/jquery.js"), data.url("js/json.js"), data.url("js/dom.js"), data.url("js/settings.js"), data.url("js/content.js")]
});