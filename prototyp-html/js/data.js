/* Obsah prototypu. Produkty a texty jsou ze skutečné odpovědi asistenta na bscom.cz (6. 10. 2026).
   Co nevíme, je v [hranatých závorkách]. Fotky nahrazuje kresba notebooku. */
window.PD = {
  products: [
    { id: 'hp', name: 'HP 250R G9 Dark Ash', price: 13297, tag: 'Nejlepší poměr cena/výkon', tagKind: '',
      cpu: 'Intel Core i5-1335U', ram: 8, ssd: 512, display: '15,6" Full HD, matný', os: 'Windows 11 Home', weight: '1,74 kg',
      extra: 'Numerická klávesnice', stock: 'Skladem 5 ks', delivery: 'doručení cca 1 den', screen: '#2f6db5',
      href: 'https://www.bscom.cz/notebook-hp-250r-g9-dark-ash-9g1p8et-bcm_d2197349/' },
    { id: 'lenovo', name: 'Lenovo V15 G4 AMN Black', price: 12517, tag: 'Nejlevnější nový', tagKind: 'ok',
      cpu: 'AMD Ryzen 5 7520U', ram: 8, ssd: 512, display: '15,6" Full HD, matný', os: 'Windows 11 Home', weight: '1,65 kg',
      extra: 'Numerická klávesnice', stock: 'Skladem více než 10 ks', delivery: 'doručení cca 1 den', screen: '#6b4fb8',
      href: 'https://www.bscom.cz/notebook-lenovo-v15-g4-amn-black-82yu00u4ck_d1937271/' },
    { id: 'dell', name: 'Repasovaný Dell Latitude 5430', price: 11360, tag: 'Repasovaný · 16 GB RAM', tagKind: '',
      cpu: 'Intel Core i5-1245U', ram: 16, ssd: 256, display: '14" Full HD, dotykový', os: 'Windows 11 Pro', weight: 'neuvedeno',
      extra: 'Záruka 24 měsíců', stock: 'Skladem 1 ks', delivery: 'doručení cca 1 den', screen: '#1f8a7a',
      href: 'https://www.bscom.cz/repasovany-notebook-dell-latitude-5430-zaruka-24-mesicu-312729_d2578271/' },
    { id: 'acer', name: 'Acer TravelMate P2 16', price: 15145, tag: 'Mírně nad rozpočtem', tagKind: 'warn',
      cpu: 'Intel Core 3 100U', ram: 8, ssd: 512, display: '16" IPS 1920 × 1200', os: 'Windows 11 Pro', weight: 'neuvedeno',
      extra: 'Podsvícená klávesnice, čtečka otisků, Wi‑Fi 6E', stock: 'Skladem více než 10 ks', delivery: 'doručení cca 1 den', screen: '#b5562f',
      href: 'https://www.bscom.cz/notebook-acer-travelmate-p2-16-steel-gray-tmp216-51-g2-tco-300d-nx-b6mec-002_d2197772/' }
  ],
  suggestions: [
    { icon: 'laptop', title: 'Notebook do školy', sub: 'do 15 000 Kč', q: 'Hledám notebook do školy do 15 000 Kč' },
    { icon: 'gift', title: 'Lego pro pětiletou', sub: 'do 2 000 Kč', q: 'Hledám lego vhodné pro mou 5letou dceru do 2 000 Kč' },
    { icon: 'battery', title: 'Levná powerbanka', sub: 'alespoň 20 000 mAh', q: 'Nějaká levná powerbanka s kapacitou alespoň 20 000 mAh?' },
    { icon: 'phone', title: 'Sklo na telefon', sub: 'Samsung Galaxy S25 Ultra', q: 'Hledám sklo pro mobilní telefon Samsung Galaxy S25 Ultra' }
  ],
  quick: [
    { icon: 'box', label: 'Stav objednávky', q: 'Jaký je stav mé objednávky?' },
    { icon: 'tool', label: 'Reklamace', q: 'Chci reklamovat zboží' },
    { icon: 'headset', label: 'Mluvit s člověkem', q: 'Chci mluvit s člověkem' }
  ],
  clarify: [
    { q: 'Na co bude notebook hlavně?', options: ['Kancelář a online výuka', 'Programování', 'Grafika a video', 'Hry'] },
    { q: 'Jak velký displej chcete?', options: ['14" a lehký', '15,6"', '16"', 'Je mi to jedno'] }
  ],
  phone: '499 944 944',
  hours: 'Po–Pá 9:00–17:00'
};
