// for gui 
const { dialog } = require('electron').remote
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
var compile = function() {
	const exec = require('child_process').exec;
	
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
            // path'i bilinen dosyanın kayıt işlemleri buraya yazılacak
            process.chdir(getCurTabPath());
            gesWriteFile(getCurTabTit(), getCurTabText());
           	process.chdir(dirName);

        }else {
        	console.log("There are no path");
        }
    }
    else if (title == "untitled"){
    	// eğer + butonuna basarak açtıysak ve tab ismi untitled ise yeni proje açmasını isteyecek ve içindekileri o projedeki dosyaya atacak
    	newProjectWithoutNewTab("1")
    	var titles = document.getElementsByClassName("title");
        titles[getCurTabInd()].innerText = "1" + ".c";
        process.chdir("1")
        gesWriteFile("1.c", getCurTabText())
        process.chdir("..")
    }
    else {
    	console.log("hata");
    }
}

var openFile = function() {
	var path = require('path');

	var currentDir = __dirname
    var file = dialog.showOpenDialog({ properties: ['openFile']}) + "";
    //path.split('\\').pop().split('/').pop();
    var filename = path.parse(file).base;// main.c gibi dosya ismi
    dirname = path.dirname(file)// gittiğimiz path
    //console.log(filename)
    //console.log(dirname)
    if(dirname) {
        // açma kodları buraya yazılacak
        // path burada dizi olarak geliyor, o yüzden ona erişmek için path[0]
    	process.chdir(dirname)
        console.log("burası çalıştı!")

	    var text = gesReadFile(filename)
	    process.chdir(currentDir)
	    newTab(filename)

	    tabs[getCurTabInd()].editor.setValue(text)
	    tabs[getCurTabInd()].path = dirname
	    tabs[getCurTabInd()].editor.refresh()
    }
    console.log(dirName);
    console.log(dirName);
    console.log(getCurTabPath())
}

var newProject = function(name) {
	var os = require('os');

	if(os.type() == "Windows_NT")
		var backslash = String.fromCharCode(92)
	else if(os.type() == "Linux")
		var backslash = String.fromCharCode(47)

	newTab(name + ".c","", __dirname + backslash + name)
	//tabs[getCurTabInd()].path = __dirname + name;
	try {  
        createNewFolder(name)
    } catch(e) {
        console.log('Error:', e.stack);
    }
    setTimeout(function(){
    	process.chdir(name)
		fileContent = getCurTabText();
		gesWriteFile(name + ".c", fileContent)
		//gesWriteFile("output.txt", "")
		process.chdir("..")
    }, 200)
}

var newProjectWithoutNewTab = function(name) {
	createNewFolder(name)
	process.chdir(name)
	fileContent = getCurTabText();
	gesWriteFile(name + ".c", fileContent)
	//gesWriteFile("output.txt", "")
	process.chdir("..")
}

var closeTab = function() {
    setTimeout(function(){
        // kapatma işlemi
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

var closeTabHard = function() {   // tab ı kafasına vurarak kapatma, bunu daha çok  closeTab fonksiyonunun içinde kullanmak için oluşturdum
    var parnt = document.getElementById("tabs");
    var currentTabInd = getCurTabInd();
    parnt.removeChild(parnt.childNodes[16+currentTabInd]);
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
var newTab = function(title, text, path) {  // buradaki 3 parametre de opsiyonel,
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

var goTab = function(index) {  // focus tab  - indeksini verdiğin taba gidiyor
    if (index>=0 && index < getTabLen()) { 
        var elements = document.getElementsByClassName('tab');
        elements[index].childNodes[0].checked = true;
    }
}

var getTabLen = function() {  // get length of tab  - tab sayısını veriyor
    var elements = document.getElementsByClassName('tab');
    return elements.length;
}

var getCurTabText = function() {   // get text of current tab - açık olan tabın textini veriyor
    if (getCurTabInd() >= 0) {
        return tabs[getCurTabInd()].editor.getValue();
    }
} 

var getCurTabPath = function() {
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

var getCurTabTit = function() {        // açık tabın başlığını dönüyor
    var titles = document.getElementsByClassName("title");
    if(titles.length) {
        return titles[getCurTabInd()].innerText;
    } else {
        return false;
    }
}

var gesWriteFile = function(filename, content) {
	fs.writeFile(filename , content, function(err) {
        if(err) {
            return console.log(err);
        }
    }); 
}

var gesReadFile = function(filename) {
	try {  
        var data = fs.readFileSync(filename, 'utf8'); // txt dosyasının tamamını okuyup data'ya eşitliyor
    } catch(e) {
        console.log('Error:', e.stack);
    }
    return data.toString()
}

var createNewFolder = function(name) {
	fs.mkdir(name, { recursive: true }, (err) => {
  		if (err) throw err;
	});
}
