// for gui 
const { dialog } = require('electron').remote

var run = function() {
    // çalıştırma kodları buraya yazılacak her dilde farklı olduğu için burası biraz karışabilir
}

var saveFile = function() {
    var title = getCurTabTit();
    if(title) {
        if(path) {
            // path'i bilinen dosyanın kayıt işlemleri buraya yazılacak
        } else {
            var path = dialog.showSaveDialog({
                title: title,
            });
            if(path) {
                // yeni dosyanın da artık path'i var
            } else {
                // saveFileDialog açılmış ama kaydedilecek yer seçilmemiş
            }
        }
    }
}

var openFile = function() {
    var path = dialog.showOpenDialog({ properties: ['openFile']});
    if(path) {
        // açma kodları buraya yazılacak
        // path burada dizi olarak geliyor, o yüzden ona erişmek için path[0]
    }
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




