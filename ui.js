//const script  = require('./script')
//module.require('script')
const { remote } = require('electron')
const { Menu, MenuItem } = remote

const menu = new Menu()
menu.append(new MenuItem({
    label: 'File',
    submenu : [
        {
            label: "New",
            click () {
                newProject();
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
            label: "Run",
            click () {
                console.log("run clicked");
                compile();
            }
        }
    ]})
)

menu.append(new MenuItem({
    label: 'Settings',
    submenu : [
        {
            label: "Preferences",
            click () {
                console.log('preferences');
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

function openWin() {
  myWindow = window.open('preferences.html', 'Preferences', 'frame=no')
}

function closeWin() {
  myWindow.close();   // Closes the new window
}