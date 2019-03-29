// Modules to control application life and create native browser window
const {app, Menu, BrowserWindow, Tray} = require('electron')
const MenuItem = require('electron').MenuItem;
// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow

function createWindow () {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    titleBarStyle: 'hidden',
    width: 800,
    height: 600,
    icon: __dirname + '/assets/icons/geside.png'
  })
  // Create context menu
  const ctxMenu = new Menu();
  ctxMenu.append(new MenuItem({
      label: 'Build',
      accelerator: 'Ctrl-B',
      click() {
        mainWindow.send('build')
      }
  }))
  ctxMenu.append(new MenuItem({
      label: 'Run',
      accelerator: 'Ctrl+R',
      click() {
        mainWindow.send('run')
      }
  }))
  ctxMenu.append(new MenuItem({
      type: 'separator'
  }))
  ctxMenu.append(new MenuItem({
      label: 'Undo',
      accelerator: 'Ctrl+Z',
      click() {
        mainWindow.send('undo')
      }
  }))
  ctxMenu.append(new MenuItem({
      label: 'Redo',
      accelerator: 'Ctrl+Y',
      click() {
        mainWindow.send('redo')
      }
  }))
  ctxMenu.append(new MenuItem({
      type: 'separator'
  }))
  ctxMenu.append(new MenuItem({
      role: 'cut',
      accelerator: 'Ctrl+X',
  }))
  ctxMenu.append(new MenuItem({
      role: 'copy',
      accelerator: 'Ctrl+C',
  }))
  ctxMenu.append(new MenuItem({
      role: 'paste',
      accelerator: 'Ctrl+V',
  }))
  ctxMenu.append(new MenuItem({
      role: 'delete'
  }))
  ctxMenu.append(new MenuItem({
      role: 'selectAll',
      accelerator: 'Ctrl+A',
  }))
  ctxMenu.append(new MenuItem({
      type: 'separator'
  }))
  ctxMenu.append(new MenuItem({
      role: 'reload'
  }))
  ctxMenu.append(new MenuItem({
      role: 'toggleFullScreen'
  }))
  ctxMenu.append(new MenuItem({
      role: 'toggleDevTools'
  }))
  ctxMenu.append(new MenuItem({
      label: 'Settings',
      click(){
          mainWindow.send('openSettings')
      }
  }))
  ctxMenu.append(new MenuItem({
      type: 'separator'
  }))
  ctxMenu.append(new MenuItem({
      role: 'quit'
  }))


  mainWindow.webContents.on('context-menu', function(e, params){
      ctxMenu.popup(mainWindow, params.x, params.y);
  })
  // and load the index.html of the app.
  mainWindow.loadFile('index.html')
  
  // Open the DevTools.   
   //mainWindow.webContents.openDevTools()  // developer aracını başlangıçta açmak için

  // Emitted when the window is closed.
  mainWindow.on('closed', function () {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null
  })
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow)

// Quit when all windows are closed.

app.on('window-all-closed', function () {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', function () {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow()
  }
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
