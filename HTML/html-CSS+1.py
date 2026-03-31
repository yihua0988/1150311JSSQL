import os
import re

def update_version(match):
    base_url = match.group(1) # 抓取 href="...style.css 部分
    version = match.group(2)  # 抓取現有的數字部分
    quote = match.group(3)    # 抓取最後的雙引號 "
    
    if version:
        # 如果已經有版本號，就把數字 + 1
        new_version = int(version) + 1
    else:
        # 如果原本完全沒有 ?v=1.X，就從 1 開始
        new_version = 1
        
    return f'{base_url}?v=1.{new_version}{quote}'

# 設定要掃描的資料夾路徑 ('.' 代表這個腳本所在的當前資料夾)
folder_path = '.' 

print("🔍 開始掃描 HTML 檔案並更新 CSS 版本號...\n")

updated_count = 0
# os.walk 會自動連同子資料夾 (像是 HTML/) 一起翻找
for root, dirs, files in os.walk(folder_path):
    for file in files:
        if file.endswith('.html'):
            filepath = os.path.join(root, file)
            
            # 使用 utf-8 讀取，避免中文字元變成亂碼
            with open(filepath, 'r', encoding='utf-8') as f:
                content = f.read()

            # Regex 正規表達式：尋找 style.css 結尾，並選擇性捕捉 ?v=1.X
            pattern = r'(href="[^"]*?style\.css)(?:\?v=1\.(\d+))?(")'
            
            # 如果有找到符合的特徵
            if re.search(pattern, content):
                new_content = re.sub(pattern, update_version, content)
                
                # 只有內容真的有改變時，才重新寫入檔案
                if new_content != content:
                    with open(filepath, 'w', encoding='utf-8') as f:
                        f.write(new_content)
                    print(f"✅ 已更新: {filepath}")
                    updated_count += 1

print(f"\n🎉 執行完畢！總共成功更新了 {updated_count} 個 HTML 檔案。")