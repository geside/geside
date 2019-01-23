// for gui 
const { dialog } = require('electron').remote

var run = function() {
    // çalıştırma kodları buraya yazılacak her dilde farklı olduğu için burası biraz karışabilir
}

var saveFile = function() {
    var path = dialog.showSaveDialog();
    if(path) {
        var title = getCurTabTit();
        if(title) {
            // kaydetme kodları buraya yazılacak
            //    title burada kaydedilecek isim
        }
        // openFile fonksiyonundaki not bu fonksiyon içinde geçerli olabilir
    }
}

var openFile = function() {
    var path = dialog.showOpenDialog({ properties: ['openFile']});
    if(path) {
        // açma kodları buraya yazılacak
        // path string olarak gelmiyor olabilir, çoklu seçme özelliği açık değil ama o özelliği açınca dizi olarak geldiğini gördüm
        // hata ile karşılaşılacak olursa onu bir kontrol etmek gerekebilir
    }
}



var closeTab = function() {
    setTimeout(function(){
        var parnt = document.getElementById("tabs");
        var currentTabInd = getCurTabInd();
        parnt.removeChild(parnt.childNodes[15+currentTabInd]);
        // removing editor
        //var removeEleman = function(ind) { for (i = ind; i < dizi.length; i++) { dizi[i] = dizi[i+1];}
        for (i = currentTabInd; i < editors.length; i++) {
            editors[i] = editors[i+1]
        }
        // ^ removing editor
        if((getTabLen() === currentTabInd)) {
            goTab(currentTabInd-1);
        } else {
            goTab(currentTabInd);
        }
    }, 10);
}

var tabIndex = -1;
var editors = new Array();
var newTab = function(title) {
    tabIndex++;
    tabIndexStr = "tab-" + tabIndex;
    title = title || "untitled";
    /*  sets 
           newTab creates this every run
   <div class="tab">
       <input type="radio" id="tab-1" name="tab-group-1" checked>
       <label for="tab-1">Untitled</label>
       <div class="content">

       </div> 
   </div>
    */

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
    editors[getCurTabInd()] = CodeMirror(content, {
        theme: "material",
        lineNumbers: true
    });
    closeTabIcon.setAttribute("onclick", "closeTab()");
}

// editors[tabNumarası].getValue();  // yazılanları alır
// getCurText fonksiyonu ile açık olan tabın textine erişebilirsin
// buradaki editors diziden başka bir şey değil, ben oluşturdum


var getCurTabInd = function() {  // get current tab index
    var elements = document.getElementsByClassName('tab');
    for(var i=0; elements[i]; ++i){
          if(elements[i].childNodes[0].checked){
               break;
          }
    }
    return i;
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

var getCurText = function() {   // get text of current tab - açık olan tabın textini veriyor
    if (getCurTabInd() != 0) {
        return editors[getCurTabInd()].getValue();
    }
} 

// editors[tabNumarası].setValue("string bir şeyler"); // bu şekilde istediğin tabın textinin değiştirebilirsin
// editors[tabNumarası].refresh();                     // bu da o editörü yenilemeye yarıyor, text alanını doldurduktan
//                                                          // sonra yenilemen tavsiyemdir

var getTitle = function(tabIndex) {     // indeksi girilen tab ın başlığını dönüyor
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



