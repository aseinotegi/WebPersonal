# story3.html -> repo index.html with self-hosted fonts
import sys
import pathlib
HERE=pathlib.Path(__file__).resolve().parent
s=(HERE.parent/'build'/'story.html').read_text(encoding='utf-8')
old=s[s.index('<link rel="preconnect" href="https://fonts.googleapis.com">'):s.index('rel="stylesheet">')+len('rel="stylesheet">')]
F=[('Inter','inter-latin-400-normal',400,'normal'),('Inter','inter-latin-600-normal',600,'normal'),('Inter','inter-latin-700-normal',700,'normal'),('Inter','inter-latin-400-italic',400,'italic'),('Inter','inter-latin-700-italic',700,'italic'),('Montserrat','montserrat-latin-700-normal',700,'normal'),('Montserrat','montserrat-latin-800-normal',800,'normal'),('JetBrains Mono','jetbrains-mono-latin-500-normal',500,'normal'),('JetBrains Mono','jetbrains-mono-latin-600-normal',600,'normal')]
faces=''.join(f"@font-face{{font-family:'{a}';font-style:{st};font-weight:{w};font-display:swap;src:url(fonts/{f}.woff2) format('woff2')}}" for a,f,w,st in F)
new='<link rel="preload" href="fonts/montserrat-latin-800-normal.woff2" as="font" type="font/woff2" crossorigin>\n<link rel="preload" href="fonts/inter-latin-400-normal.woff2" as="font" type="font/woff2" crossorigin>\n<style>'+faces+'</style>'
s=s.replace(old,new); assert 'googleapis' not in s
desc='Ander Sein, ingeniero de automatización e IIoT en Donostia: sigue la ronda de un robot de inspección, del sensor a la decisión.'
fav="data:image/svg+xml,"+"%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64'%3E%3Crect width='64' height='64' rx='14' fill='%23060D1B'/%3E%3Ccircle cx='32' cy='32' r='24' fill='none' stroke='%2322D3EE' stroke-width='4'/%3E%3Ctext x='32' y='40' text-anchor='middle' font-family='Arial,sans-serif' font-weight='800' font-size='22' fill='%23E6EDF7'%3EAS%3C/text%3E%3C/svg%3E"
meta=f'''<link rel="canonical" href="https://andersein.com/">
<link rel="icon" href="{fav}">
<meta name="theme-color" content="#060D1B">
<meta property="og:type" content="website">
<meta property="og:url" content="https://andersein.com/">
<meta property="og:title" content="Ander Sein · Automatización e IIoT">
<meta property="og:description" content="{desc}">
<meta property="og:locale" content="es_ES">
<meta name="twitter:card" content="summary">
'''
i=s.index('</title>')+len('</title>'); s=s[:i]+'\n'+meta+s[i:]
(HERE.parent.parent/'index.html').write_text(s, encoding='utf-8'); print('index.html actualizado')
