const { Client: trayectoria, LocalAuth } = require('whatsapp-web.js');

const sofi = new trayectoria({
    authStrategy: new LocalAuth({
        clientId: "Sofia" //Un identificador
    }),
    puppeteer: {
        args: [
            "--no-sandbox",
            '--disable-setuid-sandbox',
            '--disable-dev-shm-usage',
            '--disable-accelerated-2d-canvas',
            '--no-first-run',
            '--no-zygote',
            '--single-process',
            '--disable-gpu',
            '--disable-voice-input',
            '--no-default-browser-check',
            '--disable-translate',
            '--disable-sync',
            '--disable-site-isolation-trials',
            '--disable-renderer-backgrounding',
            '--disable-infobars',
            '--disable-remote-fonts',
            '--disable-logging',
            '--disable-hang-monitor',
            '--disable-default-apps',
            '--disable-breakpad',
            '--headless=new',
        ],
        defaultViewport: {
            width: 100,
            height: 100,
        },
        headless: "true",
        ignoreHTTPSErrors: true,
    },
    maxConcurrency: 1,
    maxBrowserMemory: 150 * 1024 * 1024,
    disableMediaDownload: true,
    maxCachedMessages: 0,
});

module.exports = sofi;