# K-Monitor Agrártámogatások kereső frontend

Ez a repository tartalmazza a K-Monitor blog agrártámogatásokkal foglalkozó weboldal támogatás keresőjének forráskódját.

A kereső mögött levő API [itt](https://github.com/Code-for-Hungary/agrartamapi),
a weboldal wordpress sablonja [itt](https://github.com/Code-for-Hungary/agrar-microsite-wp-theme) található.

## Felhasznált szoftverek

[Alpine.js](https://alpinejs.dev/)

[Choices-js](https://github.com/Choices-js/Choices)

[noUiSlider](https://github.com/leongersen/noUiSlider)

[iframe-resizer](https://github.com/davidjbradshaw/iframe-resizer)

## Fejlesztés helyi gépen

Ahhoz, hogy az AJAX kérések működjenek helyi gépen, valamilyen szerverről kell kiszolgálnod a file-okat. A legegyszerűbb ha fel van installálva a gépeden a [Node.js](https://nodejs.org/en/) és az [NPX](https://www.npmjs.com/package/npx) csomag. Ezzel lefutatthatod a `serve` parancsot a projekt mappában, ami létrehoz egy egyszerű HTTP szervert. Mindez így néz ki:

```bash
npx serve
```

A command prompt meg fogja kérdezni, hogy biztos instalálni akarod-e a `serve` csomagot, üsd be az `y`-t és nyomj egy Entert.

```bash
Need to install the following packages:
  serve
Ok to proceed? (y)
```

Ezután a program ki fogja írni milyen címen érheted el az alkalmazást (alapból az a `http://localhost:3000` lesz majd). Bővebben a `serve` csomagról itt [olvashatsz](https://www.npmjs.com/package/serve).

Jelenleg a projektben nincs se JS pipeline, se bundling. A kereső üzleti logikáját a `js/agrar.js` file-ben találod. A UI data-bindingot, [Alpine.js](https://alpinejs.dev/)-el oldjuk meg. Mind a külső függőségeket, mind a saját szkriptjeinket külön `<script>` tagekkel húzzuk be a HTML kódban.

A multiple selecteket [Choices.js](https://github.com/Choices-js/Choices) segítségével valósítjuk meg.

### CSS

Az összes stílust a `css/app.css` file-ban találod. Akárcsak a JS kód esetében, itt sem használunk semmilyen build pipeline-t, se preproccessort.

## Konfiguráció

A "környezeti változókat" egy `./config.js` nevű file-ból várja az alkalmazás. Ezt a file-t nem komitoljuk be gitbe, ellenben találsz egy `./config.example.js` nevű file-t, amit lemásolhatsz, átnevezhetsz `config.js`-é és átírhatod benne a változók értékeit.

Ha UNIX-jellegű rendszert használsz (MAC, Linux, WSL), akkor használhatod a `setup.sh`-t, ami rögtön készít neked egy `config.js`-t.

```bash
# adj neki futatási jogosultságot
sudo chmod +x setup.sh
# majd futasd lefutasd le
./setup.sh
```

# Kódformázás

A konzisztens stílusról a projektben lévő [`.editorconfig`](https://editorconfig.org/) file gondoskodik. Bizonyosodj meg róla, hogy a kódszerkesztőd támogatja-e az `.editorconfig`-ot. A legtöbb kódszerkesztő automatikusan átveszi a beállításokat, de van pár amelyeknél fel kell installálnod egy plugint. A támogatott editorok listáját [itt találod](https://editorconfig.org/#pre-installed).

Az `.editorconfig` mellett használjuk a [Prettier](https://prettier.io/) csomagot is, mely kiegészíti a default konfigurációját az `.editorconfig`-al (lásd a [dokumentációt](https://prettier.io/docs/en/configuration.html#editorconfig)).

A Prettierhez további opcióikat `package.json`-ban található `"prettier"` objektum kulcsaival tudsz hozzáadni, a beállításokról [itt olvashatsz bővebben](https://prettier.io/docs/en/options.html).

Ha ignorálni akarunk file-okat a formázás alól, akkor azt megtehetjük a `.prettierignore` file segítségével. Bővebben erről [itt olvashatsz](https://prettier.io/docs/en/ignore.html).

A Prettiernek köszönhetően van egy parancsunk, amivel a projekt összes file-t automatikusan formázhatjuk (kihagyva az ignorált file-okat és figyelembe véve a konfigurációt).

Futasd az `npm run format` parancsot a projekt könyvtárban (ehhez természetesen [Node.js](http://nodejs.org/)-re lesz szükséged).

Ez a parancs megformáza az összes forrásfile-t.
