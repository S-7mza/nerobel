from playwright.sync_api import sync_playwright

with sync_playwright() as p:
    browser = p.chromium.launch()
    page = browser.new_page(viewport={'width': 1440, 'height': 900})
    page.goto('http://localhost:8080/index.html')
    page.wait_for_timeout(1000)
    info = page.evaluate("""() => {
        const track = document.getElementById('collectionTrack');
        const next = document.getElementById('collNextBtn');
        const prev = document.getElementById('collPrevBtn');
        return {
            trackExists: !!track,
            scrollWidth: track ? track.scrollWidth : 0,
            clientWidth: track ? track.clientWidth : 0,
            scrollLeft: track ? track.scrollLeft : 0,
            prevDisabled: prev ? prev.disabled : null,
            nextDisabled: next ? next.disabled : null,
            nextVisible: next ? (next.offsetWidth > 0 && next.offsetHeight > 0) : false
        };
    }""")
    print("SLIDER STATE:", info)
    browser.close()
