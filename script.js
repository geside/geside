// for gui 
const { dialog } = require('electron').remote
const exec = require('child_process').exec;
var fs = require("fs");
var nrc = require('node-run-cmd');
var path = require('path');
var os = require('os');
var dirName = __dirname

// for menu-bar

// bu const ve require olayını çözmek gerekir iyice doldu buralar
const { remote } = require('electron')
const { Menu, MenuItem } = remote

const menu = new Menu()
menu.append(new MenuItem({
    label: 'File',
    submenu : [
        {
            label: "New",
            click () {
                newTab();
            }
        },
        {
            label: "Open",
            click () {
                openFile();
            }
        },
        {
            label: "Save",
            click() {
                saveFile();
            }
        }
    ]})
)

menu.append(new MenuItem({
    label: 'Edit',
    submenu : [
        { role: "undo" },
        { role: "redo" },
        { type: "separator" },
        { role: "cut" },
        { role: "copy" },
        { role: "paste" },
        { role: "delete" },
        { role: "selectall" }
    ]})
)

menu.append(new MenuItem({
    label: 'Build',
    submenu : [
        {
            label: "Compile",
            click () {
                console.log("compile clicked");
            }
        },
        {
            label: "Run",
            click () {
                console.log("run clicked");
                compile();
            }
        }
    ]})
)

menu.append(new MenuItem({
    label: 'Help',
    submenu : [
        {
            label: "Preferences",
            click () {
                console.log("preferences clicked");
            }
        },
        {
            label: "About",
            click () {
                console.log("about clicked");
            }
        }
    ]})
)
Menu.setApplicationMenu(menu)

// ^ for menu-bar
 

var run = function() {
	var fileName = path.basename(getCurTabTit(), ".c")
	//dirName += backslash + fileName
	//gesWriteFile("programs.txt", fileName + "\n" + getCurTabPath())

	dirName = __dirname

	
	process.chdir(getCurTabPath())
	gesWriteFile("output.txt", "")
	process.chdir(dirName)
	
	if(os.type() == "Windows_NT")
		nrc.run("compile");
	else if(os.type() == "Linux")
		nrc.run("./compile");

	setTimeout(function(){
		if(fileName) {
    	process.chdir(getCurTabPath())
    }
    else{
    	console.log("hata")
    }

    var output = gesReadFile("output.txt")
    console.log(output)

    fs.unlink('output.txt',function (err){
    if (err) throw err;
    // if no error, file has been deleted successfully
    console.log('File deleted!');
	})
	console.log(fileName)
	if(os.type() == "Windows_NT"){
		fs.unlink(fileName + ".exe", function(err){
			if(err) throw err;
			console.log("Exe file deleted!");
		})
	}
	else if(os.type() == "Linux"){
		fs.unlink(fileName, function (err){
	    	if (err) throw err;
	    		// if no error, file has been deleted successfully
	    		console.log('Exe file deleted!');
			})
	}
    process.chdir(dirName)

	}, 200)
    
}

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
    //path.split('\\').pop().split('/').pop();
    var filename = path.parse(file).base;// main.c gibi dosya ismi
    var extension = path.extname(filename)
    dirname = path.dirname(file)// gittiğimiz path
    if(dirname) {
    	process.chdir(dirname)
	    var text = gesReadFile(filename)
	    process.chdir(currentDir)
	    newTab(filename, text, dirname, extension)
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
    parnt.removeChild(parnt.childNodes[5+currentTabInd]);
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
var newTab = function(title, text, path, extension) {  // buradaki 3 parametre de opsiyonel,
    tabIndex++;                            
    var tabIndexStr = "tab-" + tabIndex;
    var text = text || "";
    var title = title || "untitled";
    var path = path || null;
    var extension = extension || "none";
    var language;
    var langDict = {
        ".c": "text/x-csrc",
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
            value: text,
            mode: language
        }),
        path: path,
        changed: false,
        extension : extension,
        language : language
    };
    closeTabIcon.setAttribute("onclick", "closeTab()");
    contExtForRunButton();  // for run button 
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

var contExtForRunButton = function() {  // her tab değişikliğinde bu fonksiyon çalışacak
    var runButton = document.getElementById("runButton");
    if(tabs[getCurTabInd()].extension!=".c") {
        // hide
        runButton.style.display = "none";
    } else {
        // visible
        runButton.style.display = "inline-block";
    }
}


