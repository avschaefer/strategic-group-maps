# Strategic Group Maps

A browser app for building **strategic group maps**: scatter plots of firms along two competitive dimensions (variables). Your work is saved automatically in the browser.

## Using the app

1. **Add variables** (left sidebar) — These are the axes you care about (for example, price vs. quality). You need **at least two** before you can create a map. Click **Add** or press Enter after typing a name. You can edit names inline or remove a variable with **×** (removing a variable also removes any maps that used it).

2. **Add firms** — These are the competitors or brands you want to place on the map. You need **at least one** firm. Each firm gets a color used on every map.

3. **Create a map** — Click **+ New Map**, name the map, and pick which variable is the **horizontal (X)** axis and which is the **vertical (Y)** axis.

4. **Place firms** — On each map you can:
   - **Drag** a firm's bubble on the chart to set its position (ratings are on a fixed scale shown on the axes).
   - Adjust values in the **table** next to the chart if you prefer typing numbers.
   - Use the chart controls to show or hide **labels** and the **legend** when you need a cleaner view.

5. **Export or remove a map** — **Export PNG** downloads an image of the chart area. **Delete** removes that map only (your variables and firms stay in the sidebar).

6. **Backup & restore** — At the bottom of the sidebar, use **Download** to save all your variables, firms, and maps as a `.json` file. Use **Upload** to restore from a previously downloaded file. This lets you recover your work if browser data is cleared, or transfer it to another device.

**Data storage:** Everything is stored in your browser's **local storage** for this site. Clearing site data, using another browser, or private browsing without the same storage means you won't see the same maps. Use the backup buttons described above to keep a portable copy. There is no server account or cloud sync.

## Hosting on Vercel

This project is a static **Vite** build. On [Vercel](https://vercel.com), import the Git repository and use the defaults Vercel suggests for Vite:

- **Build command:** `npm run build`
- **Output directory:** `dist`
- **Install command:** `npm install` (or your package manager's equivalent)

No extra configuration is required for a single-page app at the site root.

## Pushing to Git

Before your first commit, confirm you are **not** committing dependencies or build output. This repo's `.gitignore` already excludes `node_modules`, `dist`, and common log/editor files.

Typical workflow:

```bash
git init
git add .
git commit -m "Initial commit"
```

Connect the folder to your remote (GitHub, GitLab, etc.) and push when you are ready.
