import { app, ipcMain, Tray, Menu, BrowserWindow, globalShortcut, clipboard, nativeImage } from 'electron';
import CaptureScreen from 'electron-capture-screen'
const captureScreen = new CaptureScreen();
const path = require('path');
if (process.env.NODE_ENV !== 'development') {
    global.__static = path.join(__dirname, '/static').replace(/\\/g, '\\\\');
}
let mainWindow;
const winURL = process.env.NODE_ENV === 'development' ? `http://localhost:9080` : `file://${__dirname}/index.html`;

let appIcon = null;
let flashIconTimer = null;

let iconPath = '/static/icon.ico';
if (process.env.NODE_ENV === 'development') {
    iconPath = '../../static/icon.ico';
}


let settingsWindow

const createSettingWindow = () => {
    //设置窗口
    ipcMain.on('open-settings-window', () => {
        const settingsWindowConfig = {
            width: 450,
            height: 320,
            title: '应用设置',
            resizable: false,
            webPreferences: {
                nodeIntegration: true
            },
            show: false
        }
        settingsWindow = new BrowserWindow(settingsWindowConfig)
        settingsWindow.loadURL(winURL + '#/Setting')
        settingsWindow.setMenu(null)
        settingsWindow.on('ready-to-show', () => {
            settingsWindow.show()
        })
        settingsWindow.on('close', () => {
            settingsWindow = null
        })
    })
}

function createWindow() {
    mainWindow = new BrowserWindow({
        height: 600,
        useContentSize: true,
        width: 1000,
        frame: false,
        webSecurity: false,
        webPreferences: {
            webSecurity: false,
            nodeIntegration: true,  // 解决require is not defined问题
            webviewTag: true  // 解决webview无法显示问题
        }
    });
    // useCapture() // 初始化截屏
    mainWindow.loadURL(winURL);
    mainWindow.on('closed', () => {
        mainWindow = null;
    });
    // 托盘
    appIcon = new Tray(path.join(__dirname, iconPath));

    let contextMenu = Menu.buildFromTemplate([
        {
            label: '显示',
            click: function () {
                showMain();
            }
        },
        {
            label: '设置',
            click: () => {
                ipcMain.emit('open-settings-window')
            }
        },
        {
            label: '退出',
            click: function () {
                app.quit();
            }
        }
    ]);

    appIcon.setToolTip('易群');
    appIcon.setContextMenu(contextMenu);
    appIcon.on('click', function () {
        showMain();
    });
}
// 截屏功能
function screenshot() {
    globalShortcut.register('CmdOrCtrl+Shift+A', () => {
        captureScreen.init();
    });
    globalShortcut.register('Esc', () => {
        captureScreen.hide();
    });
    // 获取截图信息, 已写入剪切板
    captureScreen.on('capture', dataURL => {
        console.log(dataURL);
        const image = nativeImage.createFromDataURL(dataURL)
        clipboard.writeImage(image)
    });
}
app.on('ready', () => {
    createWindow()
    screenshot()
    createSettingWindow()
});


app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', () => {
    if (mainWindow === null) {
        createWindow();
    }
});

ipcMain.on('capture-screen', () => captureScreen.init());

ipcMain.on('min', () => mainWindow.minimize());

ipcMain.on('max', () => {
    if (mainWindow.isMaximized()) {
        mainWindow.unmaximize();
    } else {
        mainWindow.maximize();
    }
});

// 只是隐藏任务栏
ipcMain.on('close', () => {
    hideMain();
});

// 闪烁任务栏
ipcMain.on('flashFrame', () => {
    mainWindow.flashFrame(true);
});

let emptyIconPath = '/static/empty.ico';
if (process.env.NODE_ENV === 'development') {
    emptyIconPath = '../../static/empty.ico';
}
// 闪烁任务栏
ipcMain.on('flashIcon', () => {
    if (!mainWindow.isVisible()) {
        clearFlashIconTimer();
        let count = 0;
        flashIconTimer = setInterval(function () {
            count++;
            if (count % 2 === 0) {
                appIcon.setImage(path.join(__dirname, emptyIconPath));
            } else {
                appIcon.setImage(path.join(__dirname, iconPath));
            }
        }, 500);
    }
});

ipcMain.on('clearFlashIcon', () => {
    clearFlashIconTimer();
    appIcon.setImage(path.join(__dirname, iconPath));
});

/**
 * 展示窗口，打开任务栏
 */
function showMain() {
    mainWindow.setSkipTaskbar(false);
    mainWindow.show();

    clearFlashIconTimer();
    appIcon.setImage(path.join(__dirname, iconPath));
}

/**
 * 清除图片闪烁的定时器
 */
function clearFlashIconTimer() {
    if (flashIconTimer) {
        clearInterval(flashIconTimer);
    }
}

/**
 * 隐藏窗口，隐藏任务栏
 */
function hideMain() {
    mainWindow.setSkipTaskbar(true);
    mainWindow.hide();
}

/**
 * Auto Updater
 *
 * Uncomment the following code below and install `electron-updater` to
 * support auto updating. Code Signing with a valid certificate is required.
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-electron-builder.html#auto-updating
 */

/*
import { autoUpdater } from 'electron-updater'

autoUpdater.on('update-downloaded', () => {
  autoUpdater.quitAndInstall()
})

app.on('ready', () => {
  if (process.env.NODE_ENV === 'production') autoUpdater.checkForUpdates()
})
 */
import { autoUpdater } from 'electron-updater'

// 检测更新，在你想要检查更新的时候执行，renderer事件触发后的操作自行编写
!function updateHandle() {
    let message = {
        error: '检查更新出错',
        checking: '正在检查更新……',
        updateAva: '检测到新版本，正在下载……',
        updateNotAva: '现在使用的就是最新版本，不用更新',
    };
    const uploadUrl = "http://120.27.95.106:8081/up"; // 下载地址，不加后面的**.exe
    autoUpdater.setFeedURL(uploadUrl);
    autoUpdater.on('error', function (error) {
        sendUpdateMessage(message.error)
    });
    autoUpdater.on('checking-for-update', function () {
        sendUpdateMessage(message.checking)
    });
    autoUpdater.on('update-available', function (info) {
        sendUpdateMessage(message.updateAva)
    });
    autoUpdater.on('update-not-available', function (info) {
        sendUpdateMessage(message.updateNotAva)
    });

    // 更新下载进度事件
    autoUpdater.on('download-progress', function (progressObj) {
        settingsWindow.webContents.send('downloadProgress', progressObj)
    })
    autoUpdater.on('update-downloaded', function (event, releaseNotes, releaseName, releaseDate, updateUrl, quitAndUpdate) {
        ipcMain.on('isUpdateNow', (e, arg) => {
            //some code here to handle event
            autoUpdater.quitAndInstall();
        });
        settingsWindow.webContents.send('isUpdateNow')
    });
    ipcMain.on("checkForUpdate", () => {
        if (process.env.NODE_ENV === 'development') {
            // 调试环境必须主动设置当前版本，electron-update有bug会去取electron的版本,而不是app的版本
            autoUpdater.currentVersion = '1.0.0'
        }
        //执行自动更新检查
        autoUpdater.checkForUpdates();
    })
}()

// 通过main进程发送事件给renderer进程，提示更新信息
function sendUpdateMessage(text) {
    mainWindow.webContents.send('message', text)
}