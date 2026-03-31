/* HTML/protect.js */
(function() {
    // --- 1. SEO 白名單檢查 (讓 Google/Line/FB 爬蟲可以正常讀取) ---
    var userAgent = navigator.userAgent.toLowerCase();
    var allowedBots = [
        'googlebot', 'bingbot', 'baiduspider', 'yandex', 
        'facebookexternalhit', 'line', 'twitterbot', 'slack', 
        'telegrambot', 'discordbot', 'pinterest'
    ];
    
    // 如果是爬蟲，直接結束函式，不執行後面的防護
    for (var i = 0; i < allowedBots.length; i++) {
        if (userAgent.indexOf(allowedBots[i]) !== -1) {
            return;
        }
    }

    // --- 2. 行為攔截 ---
    
    // 跳轉函式 (你可以隨時在這裡修改跳轉目標)
    function redirectToGoogle() {
        // 為了避免誤判導致無限迴圈，可以加個判斷
        if (window.location.hostname !== "www.google.com") {
            window.location.href = "https://www.google.com";
        }
    }

    // [新增] 動態注入 CSS，徹底禁止滑鼠反白選取文字
    var style = document.createElement('style');
    style.innerHTML = `
        * {
            -webkit-user-select: none !important; /* Chrome, Safari, Opera */
            -moz-user-select: none !important;    /* Firefox */
            -ms-user-select: none !important;     /* IE/Edge */
            user-select: none !important;         /* 現代瀏覽器標準 */
        }
    `;
    document.head.appendChild(style);

    // [新增] 禁止選取、拖曳、複製、剪下、貼上
    var preventEvents = ['selectstart', 'dragstart', 'copy', 'cut', 'paste'];
    preventEvents.forEach(function(eventName) {
        document.addEventListener(eventName, function(e) {
            e.preventDefault();
            e.stopPropagation();
        }, true);
    });

    // 禁止右鍵選單
    document.addEventListener('contextmenu', function(e) {
        e.preventDefault();
        e.stopPropagation(); // 強化攔截
    }, true);

    // 禁止鍵盤快捷鍵 (F12, Ctrl+Shift+I/J/C, Ctrl+U, Ctrl+S, Ctrl+C複製)
    document.addEventListener('keydown', function(e) {
        // F12
        if (e.keyCode == 123) {
            e.preventDefault();
            redirectToGoogle();
            return false;
        }
        
        // Ctrl 組合鍵檢查
        if (e.ctrlKey) {
            // Shift 組合鍵 (I, J, C)
            if (e.shiftKey) {
                if (e.keyCode == 73 || e.keyCode == 74 || e.keyCode == 67) { // I, J, C
                    e.preventDefault();
                    redirectToGoogle();
                    return false;
                }
            }
            // 單純 Ctrl 組合鍵 (U=原始碼, S=存檔, C=複製, X=剪下)
            if (e.keyCode == 85 || e.keyCode == 83 || e.keyCode == 67 || e.keyCode == 88) { 
                e.preventDefault();
                // 這裡按下 Ctrl+C 只是阻擋，不一定每次都要跳轉，但如果要嚴格一點也可以觸發 redirectToGoogle()
                // 如果不要因為按 Ctrl+C 就跳轉，把 redirectToGoogle() 註解掉即可
                // redirectToGoogle(); 
                return false;
            }
        }
    }, true);

    // --- 3. 進階偵測：Debugger 時間差攻擊 ---
    // 當使用者硬開開發者工具時，瀏覽器會因為 debugger 指令暫停，產生時間差
    setInterval(function() {
        var start = new Date().getTime();
        debugger; // 如果 DevTools 開啟，會卡在這裡
        var end = new Date().getTime();
        if (end - start > 100) { // 門檻值 (毫秒)
            redirectToGoogle();
        }
    }, 2000); // 每 2 秒檢查一次

})();