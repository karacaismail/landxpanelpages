# Deploy

Hedef: `https://karacaismail.github.io/landxpanelpages/`

## Yöntem

GitHub Actions → Pages artifact (resmi yol). gh-pages branch yok.

## Vite config

```ts
// vite.config.ts
export default defineConfig({
  plugins: [react()],
  base: '/landxpanelpages/',
  build: { outDir: 'dist', target: 'es2020', sourcemap: false }
});
```

## SPA routing

`HashRouter` kullanıyoruz. Pages 404 sorunu olmadığı için `404.html` opsiyonel. Yine de eklenir (kopya `index.html`).

## Workflow

`.github/workflows/deploy.yml`:
```yaml
name: Deploy to Pages
on:
  push: { branches: [main] }
  workflow_dispatch:
permissions:
  contents: read
  pages: write
  id-token: write
concurrency:
  group: pages
  cancel-in-progress: true
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: '20', cache: 'npm' }
      - run: npm ci
      - run: npm run typecheck
      - run: npm run build
      - uses: actions/configure-pages@v5
      - uses: actions/upload-pages-artifact@v3
        with: { path: dist }
  deploy:
    needs: build
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - id: deployment
        uses: actions/deploy-pages@v4
```

## İlk push

Mevcut remote: `https://github.com/karacaismail/landxpanelpages.git`

Bir kez (manuel, token env üzerinden):
```bash
# Token sadece tek seferlik, history yok
HISTFILE=/dev/null git -c "credential.helper=!f(){ echo username=x-access-token; echo password=$GH_TOKEN; };f" push origin <branch>:main
# alternatif: tek seferlik URL ile
git push "https://x-access-token:${GH_TOKEN}@github.com/karacaismail/landxpanelpages.git" HEAD:main
# remote'ta token kalsın istemiyoruz — zaten remote URL'i token'sızdı
```

## Pages settings (kullanıcı tarafından)

GitHub repo → Settings → Pages → Source: **GitHub Actions**

(README'de hatırlatma var.)

## Doğrulama

```
npm ci
npm run build
npm run preview           # http://localhost:4173/landxpanelpages/
```

## Cache busting

Vite'in built-in hash'i yeterli; manuel müdahale yok.

## SEO meta

`index.html`'de title, description, og:image, hreflang TR/EN.
JSON-LD ilan detay sayfalarında runtime'da inject (`<script type="application/ld+json">`).
