
var folderTreeWidthInt = 250;
var folderTreeWidth = folderTreeWidthInt + "px";

var icons = {"image":"fas fa-images",
             "text" :"far fa-file-alt",
             "folder": "fas fa-folder",
             "folder-open": "fas fa-folder-open",
             "unk" : "fas fa-question-circle"};
var folderTreeOpened = false;

// DOM
var area = document.createElement("div");
var ul = document.createElement("ul");
var folderTreeIcon = document.createElement("div");
var folderTreeIconFA = document.createElement("i");
var tabS = document.getElementById("tabs");
var contents = document.getElementsByClassName("content");

var createFolderTree = function() {

    // area
    area.setAttribute("id", "treeFolderArea");
    area.setAttribute("class", "horizontalSlider");

    // ul
    ul.setAttribute("id","treeFolderUl");
    ul.tabFactor = 0;

    // icon
    folderTreeIcon.setAttribute("id", "folderTreeIcon");
    folderTreeIcon.setAttribute("onclick", "toggleFolderTree()");
    folderTreeIconFA.setAttribute("class", "fas fa-folder");

    folderTreeIcon.appendChild(folderTreeIconFA);
    area.appendChild(ul);
    document.body.appendChild(folderTreeIcon);
    document.body.appendChild(area);

}

var openFolderTree = function() {
    area.style.maxWidth =folderTreeWidth;
    errorBar.style.left =folderTreeWidth;
    errorBar.style.maxWidth = "calc( 100% - "+ folderTreeWidth+ " )";
    tabS.style.left = folderTreeWidthInt + 44 + "px";
    tabS.style.maxWidth = "calc( 100% - 44px - " + folderTreeWidth+ " )";
    folderTreeIcon.style.left = folderTreeWidth;
    for(i = 0; i<contents.length; i++) {
        contents[i].style.left =folderTreeWidth;
    }
    folderTreeOpened = true;
}

var closeFolderTree = function() {
    //area.style.display = "none";
    area.style.maxWidth = "0";
    errorBar.style.left = "0";
    errorBar.style.maxWidth = "100%";
    tabS.style.left = "44px";
    tabS.style.maxWidth = "100%";
    folderTreeIcon.style.left = "0";
    for(i = 0; i<contents.length; i++) {
        contents[i].style.left = "0";
    }
    folderTreeOpened = false;
}

var toggleFolderTree = function() {
    if(folderTreeOpened) {
        closeFolderTree();
    } else {
        openFolderTree();
    }
}

// folder - file etc.

var folderInd = 0;
var folderList = new Array();

var openFolder = function() {
	var mainFolder = dialog.showOpenDialog({ properties: ['openDirectory']}) + "";
    if(!("undefined" == mainFolder)) {
        clearFolderTree();
        loadMainFolder(mainFolder);
    }
}

var loadMainFolder = function(path) {
    ul.path = path;
    if(isFolder(path)) {
        var cw = addFolder(ul, getNameFromPath(path), true);
        var arr = fs.readdirSync(path);
        for (i = 0; i<arr.length; i++) {
            if(isFolder(path + "/"+ arr[i])) {
                addFolder(cw, arr[i], false);
            } else {
                addLine(cw, arr[i], detectFileType(arr[i]));
            }
        }
    } else {
        return false;
    }
    openFolderTree();
}

var addFolder = function(parentUl, name, isMain) {
    var retrn = addLine(parentUl, name, "folder");
    var li = retrn[0];
    var title = retrn[1];


    title.setAttribute("onclick", "toggleViewChildren(" + folderInd + ")");
    var childrenWrapper = document.createElement("ul");
    childrenWrapper.setAttribute("class", "closedFolder");

    childrenWrapper.tabFactor = parentUl.tabFactor + 1;
    if(isMain) {
        childrenWrapper.path = parentUl.path;
        childrenWrapper.loaded = true;
    } else {
        childrenWrapper.path = parentUl.path + "/" + name;
        childrenWrapper.loaded = false;
    }
    //console.log(childrenWrapper.path);

    li.appendChild(childrenWrapper);

    folderList[folderInd] = childrenWrapper;
    folderInd++;
    return childrenWrapper;
}

var addLine = function(parentUl, name, type) {

    var li = document.createElement("li");
    var icon = document.createElement("i");
    var text = document.createElement("span");
    var title = document.createElement("span");

    icon.setAttribute("class", icons[type]);
    text.innerText = name;
    title.appendChild(icon);
    title.appendChild(text);
    li.appendChild(title);

    li.style.paddingLeft = parentUl.tabFactor * 6 + "px";

    parentUl.appendChild(li);
    return [li, title];
}

var loadFolder = function(index) {
    var path = folderList[index].path;
    var arr = fs.readdirSync(path);
    for (i = 0; i<arr.length; i++) {
        if(isFolder(path + "/"+ arr[i])) {
            addFolder(folderList[index], arr[i], false);
        } else {
            addLine(folderList[index], arr[i], detectFileType(arr[i]));
        }
    }
    folderList[index].loaded = true;
}

var clearFolderTree = function() {
    if(ul.hasChildNodes())
        ul.removeChild(ul.firstChild);
        folderList = new Array();
}

var toggleViewChildren = function(index) {
    if(!folderList[index].loaded) {
        loadFolder(index);
    }
    if(folderList[index].classList[0]=="closedFolder") {
        folderList[index].setAttribute("class", "openedFolder");
        folderList[index].parentElement.children[0].children[0].setAttribute("class", icons["folder-open"]);
    } else {
        folderList[index].setAttribute("class", "closedFolder");
        folderList[index].parentElement.children[0].children[0].setAttribute("class", icons["folder"]);
    }
}

var isFolder = function(path) {
    try {
        var stat = fs.lstatSync(path);
        return stat.isDirectory();
    } catch (e) {
        return false;
    }
}

var detectFileType = function(name) {
    var type = "unk";
    var pieces = name.split(".");
    var extension = pieces[pieces.length - 1];
    var txts = ["txt", "md", "c", "cpp", "py", "html", "css", "js", "json", "log"];
    for(j = 0; j<images.length; j++) {
        if(images[j]=='.' + extension) {   // images from script.js
            type = "image";
            break;
        }
    }
    for(k = 0; k<txts.length; k++) {
        if(txts[k]==extension) {
            type = "text";
            break;
        }
    }
    return type;
}

var getNameFromPath = function(path) {
    var slash = "/";
	if(process.platform == "win32"){
        slash = "\\";
	}
    var pathArr = path.split(slash);
    if(pathArr[pathArr.length - 1]=='') {
        return pathArr[pathArr.length - 2];   //  example  /home/yunusemre/
    } else {
        return pathArr[pathArr.length - 1];
    }
}


createFolderTree();
closeFolderTree();
