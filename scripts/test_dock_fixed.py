import asyncio
from playwright.async_api import async_playwright

async def run():
    async with async_playwright() as p:
        browser = await p.chromium.launch()
        page = await browser.new_page(viewport={'width': 1440, 'height': 850})
        await page.goto('http://localhost:8080/index.html')
        await page.wait_for_timeout(600)

        for i in range(4):
            dock = await page.query_selector('#heroContextCard')
            box = await dock.bounding_box()
            title = await page.inner_text('#heroContextTitle')
            counter = await page.inner_text('#heroContextCounter')
            print(f'Slide {i}: {title:28} [{counter}] -> W:{box["width"]:.1f} H:{box["height"]:.1f} X:{box["x"]:.1f} Y:{box["y"]:.1f}')
            await page.screenshot(path=f'assets/img/fixed_slide{i}.png')
            await page.click('#heroNextSlide')
            await page.wait_for_timeout(400)

        await browser.close()

if __name__ == '__main__':
    asyncio.run(run())
