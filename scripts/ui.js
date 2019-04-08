const { remote } = require('electron')
const { Menu, MenuItem } = remote
const {ipcRenderer} = require('electron')

ipcRenderer.on('openSettings', (event, arg) => {
    openSettings();
});
ipcRenderer.on('undo', (event, arg) => {
	tabs[getCurTabInd()].editor.undo();
})
ipcRenderer.on('redo', (event, arg) => {
	tabs[getCurTabInd()].editor.redo();
})
ipcRenderer.on('build', (event, arg) => {
    justCompile();
});
ipcRenderer.on('run', (event, arg) => {
    compile();
});
const menu = new Menu()
menu.append(new MenuItem({
    label: 'File',
    submenu : [
        {
            label: "New File",
            click () {
                newProject();
            }
        },
        {
            label: "Open File",
            click () {
                openFile();
            }
        },
        {
            label: "Open Folder",
            click () {
                openFolder();
            }
        },
        {
            label: "Save File",
            click() {
                saveFile();
            }
        }
    ]})
)

menu.append(new MenuItem({
    label: 'Edit',
    submenu : [
        {
        	label: "Undo",
        	accelerator: 'Ctrl+Z',
	        click() {
	        	tabs[getCurTabInd()].editor.undo();
	        } },
        {
        	label: "Redo",
        	accelerator: 'Ctrl+Y',
         	click() {
        		tabs[getCurTabInd()].editor.redo();
        }},
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
            label: "Build",
            accelerator: 'Ctrl-B',
            click () {
                console.log("run clicked");
                justCompile();
            }
        },
        { type: "separator" },
        {
        	label: "Run",
        	//accelerator: 'Ctrl+R',
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
            label: "Settings",
            click () {
                openSettings();
            }
        },
    ]})
)

menu.append(new MenuItem({
	label: 'Help',
	submenu: [
		{
			label: "About",
        	click () {
            	shell.openExternal("https://github.com/geside/geside");
       		}
		},
		{
			label: "License",
			click () {
            	shell.openExternal("https://github.com/geside/geside/blob/master/LICENSE");
			}
		},
		{
			label: "Report Issue",
			click () {
				shell.openExternal("https://github.com/geside/geside/issues");
			}
		}
	]
}))

Menu.setApplicationMenu(menu)

function openWin() {
  myWindow = window.open('preferences.html', 'Preferences', 'frame=no')
}

function closeWin() {
  myWindow.close();   // Closes the new window
}
