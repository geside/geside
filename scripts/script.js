const { dialog } = require('electron').remote
const exec = require('child_process').exec;
var fs = require("fs");
var path = require('path');
var dirName = __dirname
const shell = require('electron').shell
// listens every key we pressed
document.addEventListener("keydown", function(event) {
	console.log(event.which);
  if(event.ctrlKey && event.which == "83"){
		saveFile();
  }
  if(event.ctrlKey && event.which == "82") {
		compile();
  }
  if(event.ctrlKey && event.which == "87"){
	closeTab(getCurTabInd());
  }
  if(event.ctrlKey && event.which == "9"){
	goTab(getCurTabInd() + 1);
  }
});

// file read
var readConfigJson = function() {
	settings = JSON.parse(fs.readFileSync("settings.json", "utf8"));
}
var settings;
readConfigJson();

  
// controlling for changes every 100ms
var intervalID = window.setInterval(myCallback, 100);
function myCallback() {
	var uns = document.getElementsByClassName("unsaved");
	if(getTabLen() > 0){
		if(uns[getCurTabInd()].style.display == "none" && !checkContent())
				disp("block");
	}
}
// Opens all tabs before program closed
window.onload =fileLog;
function fileLog() {
	var log = gesReadFile("tabs.log");
	logs = log.split("\n");
	var i = 0;
	while(logs[i] && i < logs.length){
		openSavedTab(logs[i++], logs[i++]);
	}
}

var compile = function() {// compiling file using gcc
	if(tabs[getCurTabInd()].extension != ".c"){
		return;
	}
	saveFile();
	process.chdir(getCurTabPath());
	var fileName = path.basename(getCurTabTit(), tabs[getCurTabInd()].extension)

	if(process.platform == "win32"){
		compileCode = "gcc -o " + fileName + " "+ fileName + tabs[getCurTabInd()].extension;
	}
	else if(process.platform == "linux"){
		compileCode = "gcc " +fileName + tabs[getCurTabInd()].extension + " -o " + fileName;
	}

	const child = exec(compileCode ,(error, stdout, stderr) => {
		if(error){
			console.error(stderr);
			console.log(error);
			alert("There has been an error! \n\n\n" + stderr);
			throw error;
		}
		else{
			setTimeout(function(){
				shell.openItem(fileName);
				process.chdir(dirName);
			}, 200)
		}
		})
}

var saveFile = function() {
	//saveTabs();// saving all tabs to remember for next opening
	tabs[getCurTabInd()].firstContent = getCurTabText();
	disp("none");
	var title = getCurTabTit();
	dirName = __dirname;
	if(title && getCurTabPath()) {
		process.chdir(getCurTabPath());
		gesWriteFile(getCurTabTit(), getCurTabText());
		process.chdir(dirName);
	}
}

var openFile = function() {
	var currentDir = __dirname
	var file = dialog.showOpenDialog({ properties: ['openFile']}) + "";
	//path.split('\\').pop().split('/').pop();
	var filename = path.parse(file).base;// main.c gibi dosya ismi
	var extension = path.extname(filename)
	dirname = path.dirname(file)// gittiğimiz path

	var i = 0;
	var isOpenAlready = false;
	while(i < getTabLen()){
		if(dirname == tabs[i].path && filename == getTitle(i)){
			isOpenAlready = true;
			goTab(i);
			break;
		}
		i++;
	}
	
	if(dirname && !isOpenAlready) {
		process.chdir(dirname)
		var text = gesReadFile(filename)
		process.chdir(currentDir)
		newTab(filename, text, dirname, extension)
		tabs[getCurTabInd()].firstContent = getCurTabText();
		disp("none");
	}
	
}
var openSavedTab = function(incomingPath, title) {
	var currentDir = __dirname
	var filename = title;
	var dirname = incomingPath;
	var extension = path.extname(filename);
	
	if(dirname) {
		process.chdir(dirname)
		var text = gesReadFile(filename)
		process.chdir(currentDir)
		newTab(filename, text, dirname, extension)
		tabs[getCurTabInd()].firstContent = getCurTabText();
		disp("none");
	}
}
var saveTabs = function() {
	gesWriteFile("tabs.log", "");
	var i = 0;
	while(i < getTabLen()){
		fs.appendFileSync('tabs.log', tabs[i].path + "\n" + getTitle(i++) +"\n");
	}
}
// This func is for settings. When we changed something it has to be simulated real time, so we are closing and opening every tab while changing.
var closeAndOpenEveryTab = function() {
	saveTabs();
	var i = 0;
	while(i <= getTabLen()){
		goTab(i);
		saveFile();
		closeTabHard();
		i++;
	}
	setTimeout(fileLog(), 200);
}
var newProject = function() {
	var file = dialog.showSaveDialog({defaultPath: '~/untitled.c'});
	var filename = path.parse(file).base;
	dirname = path.dirname(file)

	newTab(filename, "", dirname, path.extname(filename));
	process.chdir(dirname);
	createFile(filename, "");
	disp("none");
	process.chdir(dirname);
}

var closeTab = function() {
	setTimeout(function(){
		// closing function
		if(!checkContent()) {
			// yolu olan tab   -- değiştirilip değiştirilmediğini kontrol etmemiz gerekiyor
			// yoldaki dosyanın içeriği ile editor içerisindeki textin control edilmesi en sağlıklısı sanırım
			// şimdilik içeriğin değiştirilip değiştirilmediğini kontrol etmeden kapatacak
			var answer = dialog.showMessageBox({
					type:'question',
					buttons:["Yes", "No"],
					title: "File Not Saved",
					message: "Do you want to save the file?"
				});
				if(answer) {
					closeTabHard();
				} else {
					saveFile();
					closeTabHard();
				}
		} else {
			closeTabHard();
		}
	}, 10);
}

var closeTabHard = function() {// closing tab by using force.
	var parnt = document.getElementById("openedTab");
	var currentTabInd = getCurTabInd();
	parnt.removeChild(parnt.childNodes[currentTabInd]);
	for (i = currentTabInd; i < tabs.length; i++) {
		tabs[i] =tabs[i+1]
	}
	tabs.length -= 1;
	// ^ removing editor
	contOverflowTabBar();
	if((getTabLen() === currentTabInd)) {
		goTab(currentTabInd-1);
	} else {
		goTab(currentTabInd);
	}
}

var tabIndex = -1;
var tabs = new Array();

var openedTab = document.createElement("div");
openedTab.setAttribute("id", "openedTab");
var newTab = function(title, text, path, extension) {  // these parameters are optional,
	tabIndex++;
	var tabIndexStr = "tab-" + tabIndex;
	var text = text || "";
	var title = title || "untitled";
	var path = path || null;
	var extension = extension || "none";
	var firstContent;
	var language;
	var langDict = {
		".c": "text/x-csrc"
		/* not now (v1.0)
		".py": "python",
		".js": "javascript",
		".go": "go",
		*/
	}
	language = langDict[extension];

	var tab = document.createElement("div");
	tab.setAttribute("class", "tab");
	var input = document.createElement("input");
	input.setAttribute("type", "radio");
	input.setAttribute("onclick","contExtForRunButton()");  // for run button hide/visible
	input.setAttribute("id", tabIndexStr);
	input.setAttribute("name", "tab-group-1");
	input.checked = true;
	var label = document.createElement("label");
	label.setAttribute("for", tabIndexStr);
	label.setAttribute("class", "title");
	label.innerHTML = title;

	var unsaved = document.createElement("i");
	unsaved.setAttribute("class", "fas fa-star-of-life unsaved")
	label.appendChild(unsaved);


	var closeTabIcon = document.createElement("i");
	closeTabIcon.setAttribute("class", "fas fa-times");
	label.appendChild(closeTabIcon);

	var content = document.createElement("div");
	content.setAttribute("class", "content");
	tab.appendChild(input);
	tab.appendChild(label);
	tab.appendChild(content);
	openedTab.appendChild(tab);
	document.getElementById("tabs").appendChild(openedTab);
	tabs[getCurTabInd()] = {
		editor:CodeMirror(content, {
			theme: settings["theme"],
			lineNumbers: settings["lineNumbers"],
			value: text,
			mode: language,
			smartIndent: false,
			autoCloseBrackets: true,
			extraKeys: {"Ctrl-Space": "autocomplete"}
		}),
		path: path,
		changed: false,
		extension : extension,
		language : language,
		firstContent: text
	};
	closeTabIcon.setAttribute("onclick", "closeTab()");
	contExtForRunButton();  // for run button
	contOverflowTabBar();   // we have to control each call newTab func
}

var getCurTabInd = function() {  // get current tab index
	var elements = document.getElementsByClassName('tab');
	if(elements.length) {
		for(var i=0; elements[i]; ++i){
			  if(elements[i].childNodes[0].checked){
				   break;
			  }
		}
		return i;
	} else {
		return -1;
	}
}

var goTab = function(index) {  // changing tab according to index
	if (index>=0 && index < getTabLen()) {
		var elements = document.getElementsByClassName('tab');
		elements[index].childNodes[0].checked = true;
	}
	contExtForRunButton();
}

var getTabLen = function() {  // getting the length of the tab
	var elements = document.getElementsByClassName('tab');
	return elements.length;
}

var getCurTabText = function() {   // getting the text of current the tab
	if (getCurTabInd() >= 0) {
		return tabs[getCurTabInd()].editor.getValue();
	}
}

var getCurTabPath = function() {// getting current tab's path
	if (getCurTabInd() >= 0) {
		return tabs[getCurTabInd()].path;
	}
}

// tabs[tab numarası].editor.setValue("string bir şeyler"); // bu şekilde istediğin tabın textinin değiştirebilirsin
// tabs[tab numarasi].editor.refresh();                     // bu da o editörü yenilemeye yarıyor, text alanını doldurduktan
//                                                          // sonra yenilemen tavsiyemdir

var getTitle = function(tabIndex) {     // indeksi girilen tab ın başlığını dönüyor  - pek işe yaramayacak gibi
	var titles = document.getElementsByClassName("title");
	return titles[tabIndex].innerText;
}

var getCurTabTit = function() { // returning current tab's title.
	var titles = document.getElementsByClassName("title");
	if(titles.length) {
		return titles[getCurTabInd()].innerText;
	} else {
		return false;
	}
}

var gesWriteFile = function(filename, content) {
	// This func giving error when you run from linux
	/*
	fs.writeFile(filename , content, function(err) {
		if(err) {
			return console.log(err);
		}
	});
	*/
	fs.writeFileSync(filename, content);
}

var gesReadFile = function(filename) {// reading the 'filename's content.
	try {
		var data = fs.readFileSync(filename, 'utf8');
	} catch(e) {
		console.log('Error:', e.stack);
	}
	return data.toString()
}

var createFile = function(filename, content) {// creating file
	fs.appendFile(filename, content, function (err) {
		if (err) throw err;
		console.log('Saved!');
	});
}

var createNewFolder = function(name) {// creating folder
	fs.mkdir(name, { recursive: true }, (err) => {
		if (err) throw err;
	});
}

var contExtForRunButton = function() {  // her tab değişikliğinde bu fonksiyon çalışacak
	var runButton = document.getElementById("runButton");
	if(getTabLen() > 0 && tabs[getCurTabInd()].extension!=".c") {
		// hide
		runButton.style.display = "none";
	} else {
		// visible
		runButton.style.display = "inline-block";
	}
	if(getTabLen() == 0){
		runButton.style.display = "none";
	}
}


/* for openedTab's scroll bar */
var contOverflowTabBar = function() {
	setOpenedTabWidth();
	var tabS = document.getElementById("tabs");
	var contents = document.getElementsByClassName("content");
	var topPx;
	if(openedTab.offsetWidth > tabS.offsetWidth) {
		topPx = "47px";
	} else {
		topPx = "43px";
	}
	for(i = 0; i<contents.length; i++) {
		contents[i].style.top = topPx;
	}
}

var setOpenedTabWidth = function() {
	var titles = document.getElementsByClassName("title");
	var width = 0;
	for(i = 0 ; i<titles.length; i++) {
		width += titles[i].offsetWidth;
	}
	openedTab.style.width = width + "px";
}

window.onresize = function(event) {
	contOverflowTabBar(); // ekranı yeniden boyutlandırma sırasında da kontrol etmemiz gerekiyor
};


/* ^ for openedTab's scroll bar */

var checkContent = function() {
	if(tabs[getCurTabInd()].firstContent != getCurTabText()){
		return false;
	}
	else{
		return true;
	}
}

window.onbeforeunload = function(e) {
	saveTabs();// saving all tabs to remember for next opening
	for(var i = 0; i < getTabLen(); i++){
		if(tabs[i].firstContent != tabs[i].editor.getValue()){
			goTab(i);
			var answer = dialog.showMessageBox({
				type:'question',
				buttons:["Yes", "No"],
				title: getTitle(i) + " is Not Saved",
				message: "Do you want to save the file?"
			});
			if(!answer){
				saveFile();
			}
		}
	}

};
var disp = function(value) {
	var uns = document.getElementsByClassName("unsaved");
	uns[getCurTabInd()].style.display = value;
}
var getDisp= function() {
	var uns = document.getElementsByClassName("unsaved");
	return uns[getCurTabInd()].style.display
}
