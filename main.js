// Modules to control application life and create native browser window
const {app, BrowserWindow} = require('electron')
const path = require('path')

//const prepareNext = require('electron-next');
const isDev = require('electron-is-dev');

function createWindow () {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 1024,
    height: 800,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: true
    }
  })

  //const devPath = 'http://localhost:8000/start'
  //const prodPath = path.resolve('renderer/out/start/index.html')
  //const entry = isDev ? devPath : 'file://' + prodPath

  mainWindow.loadURL('http://localhost:3000/');
  // and load the index.html of the app.
  //mainWindow.loadFile('index.html')

  // Open the DevTools.
  // mainWindow.webContents.openDevTools()
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  //await prepareNext('./renderer');
  createWindow()
  
  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})



// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.

//We need to spawn a couple of child processes

const { exec } = require('child_process');

//exec('pwd', (error, stdout, stderr) => {
//  console.log(stdout);
//});

console.log("Starting next server");


var spawn = require('child_process').spawn;

//const baseDir = "c:/users/evan marchant/documents/ccard/code/ccardApp";

//console.log('Starting nxt server');
var nextServer = spawn('cmd',['/c', 'npm', 'run', 'nxtStart'], { detached: true });
nextServer.stdout.on('data', d => {
  var str = d.toString();
  var lines = str.split(/(\r?\n)/g);
  console.log(lines.join(""));
});
nextServer.stderr.on('data', d => {
  var str = d.toString();
  var lines = str.split(/(\r?\n)/g);
  console.log(lines.join(""));
})
nextServer.on('close', code => {
  console.log('process exit code ' + code);
});

console.log("Starting java")
var java = spawn('cmd',['/c','\"c:/program files/java/jdk-11.0.1/bin/java\"', '-jar', 'CCardBackend-1.0-SNAPSHOT.jar'], {detached: true, shell:true});
java.stdout.on('data', d=> {
  var str = d.toString();
  var lines = str.split(/(\r?\n)/g);
  console.log(lines.join(""));
});
java.stderr.on('data', d => {
  var str = d.toString();
  var lines = str.split(/(\r?\n)/g);
  console.log(lines.join(""));
});


console.log('ext started');

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', function () {  
  if (process.platform !== 'darwin') app.quit()
})

app.on('before-quit', function() {
  alert('Calling');
  nextServer.kill();
});
