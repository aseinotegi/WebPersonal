import asyncio, pathlib
HERE = pathlib.Path(__file__).resolve().parent
PAGE = (HERE.parent.parent / 'index.html').as_uri()
OUT = HERE.parent / 'build' / 'capturas'
OUT.mkdir(parents=True, exist_ok=True), sys
from playwright.async_api import async_playwright
async def main():
    async with async_playwright() as p:
        b = await p.chromium.launch(executable_path='/usr/bin/google-chrome', args=['--no-sandbox'])
        for name, vw, vh, stops in [('d', 1366, 800, [4, 5, 5.7, 6, 6.6, 7, 7.85, 8, 8.62, 9, 9.5]), ('m', 390, 800, [4, 6, 7, 9])]:
            pg = await b.new_page(viewport={'width': vw, 'height': vh})
            await pg.goto(PAGE); await pg.wait_for_timeout(1500)
            errs = []
            pg.on('pageerror', lambda e: errs.append(str(e)))
            for s in stops:
                await pg.evaluate(f"""(() => {{ const st=document.getElementById('dato'); const span=st.offsetHeight-innerHeight; scrollTo(0, st.offsetTop + span*({s}/10)); }})()""")
                await pg.wait_for_timeout(700)
                await pg.screenshot(path=str(OUT / f'{name}_{s}.png'))
            print(name, 'errors', errs)
        await b.close()
asyncio.run(main())
