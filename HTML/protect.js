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
        // [防護 A] 視窗比例異常偵測 (針對預先開好 F12 的人)
        var widthDiff = window.outerWidth - window.innerWidth;
        var heightDiff = window.outerHeight - window.innerHeight;
        
        // 容錯值設為 200
        if ((widthDiff > 200 || heightDiff > 200) && window.innerWidth > 500) {
            blockAccess();
        }

        // [防護 B] Debugger 時間差攻擊
        var start = new Date().getTime();
        debugger; 
        var end = new Date().getTime();
        if (end - start > 50) { // 門檻值 50 毫秒
            blockAccess();
        }
    }, 100); // 這裡改為 100 毫秒 (0.1秒)

    // [防護 C] 只要切換視窗回來，立刻重新檢查
    document.addEventListener("visibilitychange", function() {
        if (!document.hidden) {
            var widthDiff = window.outerWidth - window.innerWidth;
            var heightDiff = window.outerHeight - window.innerHeight;
            if ((widthDiff > 200 || heightDiff > 200) && window.innerWidth > 500) {
                blockAccess();
            }
        }
    });

    // [防護 D] 只要拉動視窗大小，立刻重新檢查
    window.addEventListener('resize', function() {
        var widthDiff = window.outerWidth - window.innerWidth;
        var heightDiff = window.outerHeight - window.innerHeight;
        if ((widthDiff > 200 || heightDiff > 200) && window.innerWidth > 500) {
            blockAccess();
        }
    });

})();