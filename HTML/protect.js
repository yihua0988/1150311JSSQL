/* HTML/protect.js */
(function() {
    // --- 1. SEO 白名單檢查 ---
    var userAgent = navigator.userAgent.toLowerCase();
    var allowedBots = [
        'googlebot', 'bingbot', 'baiduspider', 'yandex', 
        'facebookexternalhit', 'line', 'twitterbot', 'slack', 
        'telegrambot', 'discordbot', 'pinterest'
    ];
    
    for (var i = 0; i < allowedBots.length; i++) {
        if (userAgent.indexOf(allowedBots[i]) !== -1) {
            return;
        }
    }

    // --- 2. 暴力清空機制 (無提示瞬間銷毀版) ---
    function blockAccess() {
        // 第一時間直接把整個網頁結構徹底清空，不顯示任何文字或提示
        document.documentElement.innerHTML = "";
        
        // 直接執行轉址
        if (window.location.hostname !== "www.google.com") {
            window.location.href = "https://www.google.com";
        }
    }

    // 禁止滑鼠反白與 CSS 注入
    var style = document.createElement('style');
    style.innerHTML = `
        * {
            -webkit-user-select: none !important; 
            -moz-user-select: none !important;    
            -ms-user-select: none !important;     
            user-select: none !important;         
        }
    `;
    document.head.appendChild(style);

    // 禁止事件：選取、拖曳、複製、剪下、貼上
    var preventEvents = ['selectstart', 'dragstart', 'copy', 'cut', 'paste'];
    preventEvents.forEach(function(eventName) {
        document.addEventListener(eventName, function(e) {
            e.preventDefault();
            e.stopPropagation();
        }, true);
    });

    // --- 3. 禁止鍵盤與右鍵行為 ---
    // 禁止右鍵選單
    document.addEventListener('contextmenu', function(e) {
        e.preventDefault();
        e.stopPropagation(); 
    }, true);

    // 禁止鍵盤快捷鍵 (F12, Ctrl+U, Ctrl+S)
    document.addEventListener('keydown', function(e) {
        if (e.keyCode == 123) { // F12
            e.preventDefault();
            blockAccess();
            return false;
        }
        if (e.ctrlKey) {
            if (e.shiftKey && (e.keyCode == 73 || e.keyCode == 74)) { // Ctrl+Shift+I / J
                e.preventDefault();
                blockAccess();
                return false;
            }
            if (e.keyCode == 85 || e.keyCode == 83) { // Ctrl+U, Ctrl+S
                e.preventDefault();
                blockAccess();
                return false;
            }
        }
    }, true);

    // --- 4. 多重維度偵測 (每 0.1 秒掃描一次) ---
    setInterval(function() {
        // 註：已移除「視窗比例異常偵測 (widthDiff/heightDiff)」，避免與網頁縮放功能衝突。

        // [防護 B] Debugger 時間差攻擊 (防護力極強且不會影響網頁縮放)
        var start = new Date().getTime();
        debugger; 
        var end = new Date().getTime();
        if (end - start > 50) { // 門檻值 50 毫秒
            blockAccess();
        }
    }, 100); // 100 毫秒 (0.1秒)

    // 註：已移除 visibilitychange 與 resize 事件中的尺寸檢查，
    // 交由上方的 Debugger 迴圈與鍵盤監聽來負責防護即可。

})();