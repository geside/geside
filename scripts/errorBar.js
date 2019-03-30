var errorBar = document.createElement("div");
errorBar.setAttribute("id", "errorBar");
errorBar.setAttribute("class", "verticalSlider");
document.body.appendChild(errorBar);

var table = document.createElement("table");
table.setAttribute("id", "errorTable");
var title = document.createElement("tr");
var number = document.createElement("th");
var errorText = document.createElement("th");
var errorLine = document.createElement("th");
title.setAttribute("class", "errorHeader");
number.innerText = "Number";
errorText.innerText = "Error";
errorLine.innerText = "Error Line";
title.appendChild(number);
title.appendChild(errorText);
title.appendChild(errorLine);
table.appendChild(title);

errorBar.appendChild(table);
var closeErrorBar = function() {
    errorBar.style.maxHeight = "0";
    minimizedErrorBar = true;
    errorBarMinimizeButton.style.top = "calc(100% - 30px)";
    errorBarMinimizeButton.childNodes[0].setAttribute("class", "fas fa-exclamation-circle");
}

var openErrorBar = function() {
    errorBar.style.maxHeight = "25%";
    minimizedErrorBar = false;
    errorBarMinimizeButton.style.top = "calc(75% - 30px)";
    errorBarMinimizeButton.childNodes[0].setAttribute("class", "fas fa-window-minimize");

}

var number = 1;
var addError = function (errorText, errorLine) {
    var tr = document.createElement("tr");
    var tdNumber = document.createElement("td");
    var tdError = document.createElement("td");
    var tdErrorLine = document.createElement("td");
    tr.setAttribute("class", "trError");
    tdErrorLine.style.textAlign = 'left';
    tdNumber.innerText = number++;
    tdError.innerText = errorText;
    tdErrorLine.innerText = errorLine;
    tr.appendChild(tdNumber);
    tr.appendChild(tdError);
    tr.appendChild(tdErrorLine);
    table.appendChild(tr);
}

var removeErrors = function() {
    number = 1;
    var errors = document.getElementsByClassName("trError");
    var len = errors.length;
    for (i = 0; i<len; i++) {
        errors[0].remove();
    }
    closeErrorBar();
}

var partError = function(error, title) {
	while(table.childNodes[1]){
		table.removeChild(table.childNodes[1])
	}
    var errors = error.split(title);
    var errorLines;
    for(i = 1 ; i<errors.length; i++) {
        errors[i] = title + errors[i];
        errorLines = errors[i].split(":");
        console.log(errors[i]);
        addError(errors[i], errorLines[1] + ":" + errorLines[2]);
    }
}

var minimizedErrorBar = true;
var errorBarMinimizeButton = document.createElement("div");

var createErrorBarMinimizeButton = function() {
    var i = document.createElement("i");
    errorBarMinimizeButton.setAttribute("id", "errorBarMinimizeButton");
    errorBarMinimizeButton.setAttribute("onclick", "toggleErrorBar()");
    errorBarMinimizeButton.setAttribute("class", "verticalSlider");
    i.setAttribute("class", "far fa-window-minimize");
    errorBarMinimizeButton.appendChild(i);
    document.body.appendChild(errorBarMinimizeButton);
}

var toggleErrorBar = function() {
    if(minimizedErrorBar)
        openErrorBar();
    else
        closeErrorBar();
}

createErrorBarMinimizeButton();
closeErrorBar();
