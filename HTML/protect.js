/* HTML/protect.js (SEO 安全版 - 專注防護內容複製) */
(function() {
    // --- 1. 禁止滑鼠反白與 CSS 注入 ---
    // 這是最有效防複製的手段，且完全不會影響 Google 爬蟲 (爬蟲不使用滑鼠)
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

    // --- 2. 禁止滑鼠事件：選取、拖曳、複製、剪下、貼上 ---
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

    // 禁止開發者工具快捷鍵 (F12, Ctrl+U, Ctrl+S)
    document.addEventListener('keydown', function(e) {
        // 阻擋 F12
        if (e.keyCode == 123) { 
            e.preventDefault();
            return false;
        }
        
        // 阻擋 Ctrl 組合鍵
        if (e.ctrlKey) {
            // 阻擋 Ctrl+Shift+I / J (開啟開發者工具)
            if (e.shiftKey && (e.keyCode == 73 || e.keyCode == 74)) { 
                e.preventDefault();
                return false;
            }
            // 阻擋 Ctrl+U (檢視原始碼), Ctrl+S (另存網頁)
            if (e.keyCode == 85 || e.keyCode == 83) { 
                e.preventDefault();
                return false;
            }
        }
    }, true);

    // 💡 說明：已徹底刪除「User-Agent 白名單」、「Debugger 迴圈」與「清空網頁機制」。
    // 這樣能防範 95% 想要複製你內容的一般使用者，同時確保 Googlebot 能完美收錄你的網站！
})();