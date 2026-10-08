# Nákupní asistent bscom – prototyp

Živá stránka: https://bsmarketingai.github.io/AI---Chatbot/
Zdroj návrhu: plátno Claude Design „Asistent bscom – návrh“ (https://claude.ai/artifact/BVYMS9CuxRiBt4iSo4eNpv)

Proklikávací prototyp nového nákupního AI asistenta pro bscom.cz (návrh BSSHOP, říjen 2026). Odpovědi asistenta jsou simulované; připravená je větev „notebook do školy“ se 4 skutečnými notebooky z bscom.cz.

## Jak to funguje

Stránka běží přímo ze souborů plátna Claude Design. Každý `*.dc.html` je jeden artboard z plátna, beze změny.

| Soubor | Obsah |
| --- | --- |
| `index.html` | vstupní stránka, přesměruje na `Main.dc.html` |
| `Main.dc.html` | celý interaktivní prototyp (přizpůsobí se šířce okna) |
| `Tablet.dc.html`, `Mobil.dc.html` | prototyp v pevné šířce 820 a 390 px |
| `Mobil-NN-*.dc.html`, `Desktop-NN-*.dc.html` | jednotlivé stavy |
| `prototyp.css` | tokeny a styly všech komponent |
| `canvas.json` | rozložení plátna (pro sledování změn) |
| `support.js` | běhové prostředí Claude Design (načte React 18 z cdn.jsdelivr.net) |
| `prototyp-html/` | starší HTML verze s lištou (šířka, stavy, bubliny) |

## Postup při změnách

1. Změny dělejte na plátně v Claude Design (nebo je zadejte Claudovi).
2. Napište Claudovi „synchronizuj GitHub“. Claude stáhne aktuální soubory z plátna do této složky.
3. V GitHub Desktop: Commit to main → Push origin. Stránka se za 1–2 minuty aktualizuje.

Nastavení Pages (jen jednou): Settings → Pages → Deploy from a branch → `main`, `/ (root)`.

Stránka má `noindex`, aby ji nenašly vyhledávače.
