// for gui 
const { dialog } = require('electron').remote
const exec = require('child_process').exec;
var fs = require("fs");
var nrc = require('node-run-cmd');
var path = require('path');
var os = require('os');
var dirName = __dirname

document.addEventListener("keydown", function(event) {// litens every key we pressed for any shortcut or hotkeys.
  console.log(event.which);
  if(event.ctrlKey && event.which == "83"){
  		saveFile();
  }
  if(event.ctrlKey && event.which == "82"){
  		compile();
  }
  	
});
var compile = function() {// compiling file using gcc
	saveFile();
	process.chdir(getCurTabPath());
	var fileName = path.basename(getCurTabTit(), ".c")
	if(os.type() == "Windows_NT"){
		nrc.run("gcc -o " + fileName + " "+ fileName +".c");
		setTimeout(function() {
			const child = exec(fileName , (error, stdout, stderr) => {
		    if (error) {
		        console.error('stderr', stderr);
		        throw error;
		    }
	    	console.log('stdout: ', stdout);
	    	alert(stdout);

	    	fs.unlink(fileName + ".exe", function(err){
				if(err) throw err;
				console.log("Exe file deleted!");
			});
	    	process.chdir(dirName);
		});
		}, 200)
	}
	else if(os.type() == "Linux"){
		nrc.run("gcc " +fileName +".c "+ " -o " + fileName)
		setTimeout(function() {
			const child = exec("./" + fileName , (error, stdout, stderr) => {
		    if (error) {
		        console.error('stderr', stderr);
		        throw error;
		    }
	    	console.log('stdout: ', stdout);

	    	fs.unlink(getCurTabPath() + "/" + fileName, function(err){
	    		if(err) throw err;
	    		console.log("Exe file deleted!");
	    	});
	    	process.chdir(dirName);
		});
		}, 200)
	}
}

var saveFile = function() {
    var title = getCurTabTit();
    dirName = __dirname;
    if(title && title != "untitled") {
        if(getCurTabPath()) {
            process.chdir(getCurTabPath());
            gesWriteFile(getCurTabTit(), getCurTabText());
           	process.chdir(dirName);

        }else {
        	console.log("There are no path");
        }
    }
    else if (title == "untitled"){
    	var titles = document.getElementsByClassName("title");
    	var file = dialog.showSaveDialog({defaultPath: '~/untitled.c'});
    	var filename = path.parse(file).base;
    	dirname = path.dirname(file)
    	console.log(filename);
    	console.log(dirname);
    	
    	tabs[getCurTabInd()].path = dirname;
        titles[getCurTabInd()].innerText = filename;

        process.chdir(getCurTabPath());
        createFile(filename, getCurTabText());
		process.chdir("..")
    }
    else {
    	alert("There has been some error, please try again.");
    }
}

var openFile = function() {
	var currentDir = __dirname
    var file = dialog.showOpenDialog({ properties: ['openFile']}) + "";
    var filename = path.parse(file).base;// getting file name like 'main.c'
    dirname = path.dirname(file)// getting file path
    if(dirname) {
    	process.chdir(dirname)

	    var text = gesReadFile(filename)
	    process.chdir(currentDir)
	    newTab(filename, text, dirname)
    }
}

var newProject = function() {
	var file = dialog.showSaveDialog({defaultPath: '~/untitled.c'});
	var filename = path.parse(file).base;
	dirname = path.dirname(file)
	var currentDir = __dirname;

	newTab(filename, "", dirname);
	process.chdir(dirname);
	createFile(filename, "");
	process.chdir(currentDir);
}

var closeTab = function() {
    setTimeout(function(){
        // closing function
        if(getCurTabPath()) {
            // yolu olan tab   -- değiştirilip değiştirilmediğini kontrol etmemiz gerekiyor
            // yoldaki dosyanın içeriği ile editor içerisindeki textin control edilmesi en sağlıklısı sanırım
            // şimdilik içeriğin değiştirilip değiştirilmediğini kontrol etmeden kapatacak
            closeTabHard();
        } else {
            if(getCurTabText()) { 
                // path i olmaması durumunda kullanıcıya bir uyarı mesajı çıkarmak gerekiyor, kayıt etmek isteyip istemediğini sormak için
                var answer = dialog.showMessageBox({
                    type:'question',
                    buttons:["Yes", "No"],
                    title: "Not Saved File!",
                    message: "Do you want to save the file?"
                });
                if(answer) {
                    closeTabHard();
                } else {
                    saveFile();
                }
            } else {
                closeTabHard();
            }
        }
    }, 10);
}

var closeTabHard = function() {// closing tab by using force.
    var parnt = document.getElementById("tabs");
    var currentTabInd = getCurTabInd();
    parnt.removeChild(parnt.childNodes[15+currentTabInd]);
    for (i = currentTabInd; i < tabs.length; i++) {
        tabs[i] =tabs[i+1]
    }
    // ^ removing editor
    if((getTabLen() === currentTabInd)) {
        goTab(currentTabInd-1);
    } else {
        goTab(currentTabInd);
    }
}

var tabIndex = -1;
var tabs = new Array();
var newTab = function(title, text, path) {  // these parameter's are optional.
    tabIndex++;                            
    tabIndexStr = "tab-" + tabIndex;
    text = text || "";
    title = title || "untitled";
    path = path || null;

    var tab = document.createElement("div");    
    tab.setAttribute("class", "tab");
    var input = document.createElement("input");
    input.setAttribute("type", "radio");
    input.setAttribute("id", tabIndexStr);
    input.setAttribute("name", "tab-group-1");
    input.checked = true;
    var label = document.createElement("label");
    label.setAttribute("for", tabIndexStr);
    label.setAttribute("class", "title");
    label.innerHTML = title;                  
    var closeTabIcon = document.createElement("i");
    closeTabIcon.setAttribute("class", "fas fa-times");
    label.appendChild(closeTabIcon);
    var content = document.createElement("div");
    content.setAttribute("class", "content");
    tab.appendChild(input);
    tab.appendChild(label);
    tab.appendChild(content);
    document.getElementById("tabs").appendChild(tab);
    tabs[getCurTabInd()] = {
        editor:CodeMirror(content, {
            theme: "material",
            lineNumbers: true,
            value: text
        }),
        path: path,
        changed: false,
        language: null,
    };
    closeTabIcon.setAttribute("onclick", "closeTab()");
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
