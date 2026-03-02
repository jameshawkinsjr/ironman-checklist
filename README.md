# Ironman 70.3 Checklist

A race-day packing checklist for Ironman 70.3 (and other triathlons). Check off gear by discipline so you don’t forget anything before the start.

**Live app:** [jameshawkinsjr.github.io/ironman-checklist](https://jameshawkinsjr.github.io/ironman-checklist)

---

## What it does

- **Sections:** Swim, T1, Bike, T2, Run, and Race Day — each with a suggested list of gear and essentials.
- **Check off items** as you pack. Your progress is saved in the browser (localStorage) so it’s there next time you open the app.
- **Add your own items** in any section (e.g. race-specific or personal gear).
- **Remove items** you don’t need.
- **Reset list** to clear all checkboxes and restore the default lists (custom items are removed).
- **Progress bar** shows how many items you’ve checked; at 100% you get a quick “Ready to race” confirmation.

Use it on your phone the night before or morning of the race so everything is packed and nothing’s left behind.

---

## Run it locally

```bash
npm install
npm start
```

Open [http://localhost:3000](http://localhost:3000). To build for production:

```bash
npm run build
```

---

## Deploy to GitHub Pages

Deployment uses the **built** app (the `build` folder), not the repo source.

- **Automatic:** Push to `main`. The workflow in `.github/workflows/deploy.yml` builds the app and pushes the build to the `gh-pages` branch. In the repo **Settings → Pages**, set source to “Deploy from a branch” and choose the `gh-pages` branch, root folder.
- **Manual:** Run `npm run deploy` to build and push the `build` folder to `gh-pages` yourself.
