var fs = require('fs');

/* NOT Now!
 * var lineList = [{type: 'checkbox', lineDesc: "line açıklama satırı", e: "onChange", fonki: function() {console.log("merhabaaaa");}},
                {type: 'number', lineDesc: 'color açıklama', e: "onChange", fonki: function() {console.log("merhaba2")}}];
*/

var settingsWin = document.createElement("div");

var closeSettings = function() {
    settingsWin.style.display = "none";
}

var createSettings = function() {  // will run when the app load
    var title = document.createElement("h1");
    settingsWin.setAttribute("id", "settingsWin");
    title.innerHTML = "<i id='settings-icon' class='fas fa-cog'></i>Settings <i id='settingsCloseIcon' onclick='closeSettings()' class='fas fa-times'> ";

    settingsWin.appendChild(title);
    var body = document.getElementsByTagName("body");
    body[0].appendChild(settingsWin);

    var editorRow = createRow(settingsWin, "Editor", "Options about editor");
    var rowContents = document.getElementsByClassName("rowContent");

    var lineNumber = createOnOffSwitchLine(rowContents[0], "View line numbers");
    var autoAutocomplete = createOnOffSwitchLine(rowContents[0], "Auto Autocomplation");

    // select list - themes
    var codeMirrorThemes = [ "default", "3024-day", "3024-night", "abcdef", "ambiance", "base16-dark", "base16-light", "bespin", "blackboard", "cobalt", "colorforth", "darcula", "dracula", "duotone-dark", "duotone-light", "eclipse", "elegant", "erlang-dark", "gruvbox-dark", "hopscotch", "icecoder", "idea", "isotope", "lesser-dark", "liquibyte", "lucario", "material", "mbo", "mdn-like", "midnight", "monokai", "neat", "neo", "night", "oceanic-next", "panda-syntax", "paraiso-dark", "paraiso-light", "pastel-on-dark", "railscasts", "rubyblue", "seti", "shadowfox", "solarized", "dark solarized", "light the-matrix", "tomorrow-night-bright", "tomorrow-night-eighties", "ttcn", "twilight", "vibrant-ink", "xq-dark", "xq-light", "yeti", "zenburn"];

    var themeSelect = createSelectList(rowContents[0], codeMirrorThemes, "Themes", "themeSelect");
    themeSelect.setAttribute("onchange", "themesFunc()");
    // ^ select list - themes

    // select list - tab size
    var tabSizeArr = [2,4,8];
    var tabSizeSelect = createSelectList(rowContents[0], tabSizeArr, "Tab size", "tabSizeSelect");
    tabSizeSelect.setAttribute("onchange", "tabSizeFunc()");

    getAndApplySettings();

    // controls - getting value from settings variable to elements

        // line number
        lineNumber.checked = settings["lineNumbers"];
        autoAutocomplete.checked = settings["autoAutocomplete"];

        // theme select
        var themeText = settings["theme"];
        var optionIndex;
        for(i = 0; i<themeSelect.options.length; i++) {
            if (themeSelect.options[i].text==themeText) {
                optionIndex = i;
                break;
            }
        }
        themeSelect.selectedIndex = optionIndex;

        // tab size
        var tabSizeText = settings["tabSize"];
        var tabSizeIndex;
        for(i = 0; i<tabSizeSelect.options.length; i++) {
            if (tabSizeSelect.options[i].text==tabSizeText) {
                tabSizeIndex = i;
                break;
            }
        }
        tabSizeSelect.selectedIndex = tabSizeIndex;
    // ^ controls
    lineNumber.setAttribute("onchange", "toogleLineNumbers()");
    autoAutocomplete.setAttribute("onchange", "toogleAutoAutocomplete()");
}

var openSettings = function() {
    settingsWin.style.display = 'block';
}

var createOnOffSwitchLine = function(place, description) {

    var line = document.createElement("div");
    var label = document.createElement("label");
    var p = document.createElement("p");
    var input = document.createElement("input");
    var span = document.createElement("span");

    p.innerText = description;

    line.setAttribute("class", "line");
    label.setAttribute("class", "onOffSwitch");
    input.setAttribute("type", "checkbox");
    input.setAttribute("class", "onOffSwitchInput")
    span.setAttribute("class", "slider");

    label.appendChild(input);
    label.appendChild(span);

    line.appendChild(label);
    line.appendChild(p);

    place.appendChild(line);
    return input;
}

var createSelectList = function(place, list, description, id) {

    var line = document.createElement("div");
    var desc = document.createElement("div");
    var select = document.createElement("select");

    line.setAttribute("class", "line");
    desc.setAttribute("class", "lineDesc");
    select.setAttribute("class", "selectList");
    select.setAttribute("id", id);

    desc.innerText = description;

    line.appendChild(desc);
    line.appendChild(select);

    var option;
    for (i = 0; i<list.length; i++) {
        option = document.createElement("option");
        option.innerText = list[i];
        select.appendChild(option);
    }

    place.appendChild(line);

    return select;
}

var createRow = function(place, title, description) {
    var rowDiv = document.createElement("div");
    var h2 = document.createElement("h2");
    var descriptionDiv = document.createElement("div");
    var rowContent = document.createElement("div");

    rowDiv.setAttribute("class", "rowDiv");
    descriptionDiv.setAttribute("class", "description");
    rowContent.setAttribute("class", "rowContent");

    h2.innerText = title;
    descriptionDiv.innerText = description;

    rowDiv.appendChild(h2);
    rowDiv.appendChild(descriptionDiv);
    rowDiv.appendChild(rowContent);

    place.appendChild(rowDiv);

}

var writeConfigJson = function(settings) {
    fs.writeFileSync("settings.json", JSON.stringify(settings));
}


// apply option all tabs
var setEditorOption = function(option, newValue) {
    for (i = 0; i<tabs.length; i++) {
        tabs[i].editor.setOption(option, newValue);
        tabs[i].editor.refresh();
    }
}

var getAndApplySettings = function() {
    readConfigJson();
    setEditorOption("lineNumbers", settings["lineNumbers"]);
    setEditorOption("firstLineNumber", settings["fistLineNumber"]);
    setEditorOption("tabSize", settings["tabSize"]);
    setEditorOption("autoAutocomplete", settings["autoAutocomplete"]);
}

var onOffSwi;
// creating settings manuel
var createSettingItems = function() {

}

// functions for events of elements
var toogleLineNumbers = function() {
    if(settings["lineNumbers"]) {
        settings["lineNumbers"] = false;
    } else {
        settings["lineNumbers"] = true;
    }
    writeConfigJson(settings);
    getAndApplySettings();
    closeAndOpenEveryTab();
}

var themesFunc = function() {
    var themeSelect = document.getElementById("themeSelect");
    var selected = themeSelect[themeSelect.selectedIndex].value;
    settings["theme"] = selected;
    writeConfigJson(settings);
    getAndApplySettings();
    closeAndOpenEveryTab();
}

var tabSizeFunc = function() {
    var tabSizeSelect = document.getElementById("tabSizeSelect");
    var selected = tabSizeSelect[tabSizeSelect.selectedIndex].value;
    settings["tabSize"] = parseInt(selected);
    writeConfigJson(settings);
    getAndApplySettings();
    closeAndOpenEveryTab();
}

var toogleAutoAutocomplete = function() {
    if(settings["autoAutocomplete"]) {
        settings["autoAutocomplete"] = false;
    } else {
        settings["autoAutocomplete"] = true;
    }
    writeConfigJson(settings);
    getAndApplySettings();
    closeAndOpenEveryTab();
}

createSettings();

