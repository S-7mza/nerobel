from playwright.sync_api import sync_playwright

with sync_playwright() as p:
    browser = p.chromium.launch()
    page = browser.new_page(viewport={'width': 800, 'height': 300})
    html = '''
    <html>
    <body style="background: #111; display:flex; justify-content:center; align-items:center; height:100vh; margin:0;">
        <img src="http://localhost:8080/assets/icons/theros-logo-white.svg" style="width: 500px;">
    </body>
    </html>
    '''
    page.set_content(html)
    page.screenshot(path='C:/Users/7mza/.gemini/antigravity-ide/brain/91c0eadf-5c12-47e1-9592-adb8f974273a/.tempmediaStorage/theros_real_logo.png')
    browser.close()
print('Screenshot taken with dark background!')
