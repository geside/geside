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
}

var openErrorBar = function() {
    errorBar.style.maxHeight = "25%";
}

var number = 1;
var addError = function (errorText, errorLine) {
    var tr = document.createElement("tr");
    var tdNumber = document.createElement("td");
    var tdError = document.createElement("td");
    var tdErrorLine = document.createElement("td");
    tdErrorLine.style.textAlign = 'left';
    tdNumber.innerText = number++;
    tdError.innerText = errorText;
    tdErrorLine.innerText = errorLine;
    tr.appendChild(tdNumber);
    tr.appendChild(tdError);
    tr.appendChild(tdErrorLine);
    table.appendChild(tr);
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
