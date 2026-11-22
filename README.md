# TAVEN CANVAS

A creative technology project by TAVEN STUDIOS. DRAW IT. DESCRIBE IT. BUILD IT.

This folder is the TAVEN CANVAS website. It is a static page served by GitHub Pages at
https://tavenstudios.github.io/Taven.Studios/taven-canvas/

## What works now
- Upload PNG, JPG or WEBP sketches (8 MB limit), by click or drag and drop.
- Preview, replace, remove and download the uploaded image.
- Project name and description fields, with a 2000-character limit.
- Save projects in the browser (localStorage). They stay on that device only.
- Clear workspace, with clear success and error messages.

## What does not work yet
- Cloud storage. Uploaded images are NOT sent anywhere. Saved projects keep only the name and text, not the image.
- AI generation. No AI provider is connected. Keys must never go in this page.

## Deploy with GitHub Pages
1. Put this folder inside the `Taven.Studios` repository, so the path is `taven-canvas/index.html`.
2. In the repo, go to Settings > Pages, choose "Deploy from a branch", select `main` and `/ (root)`, then save.
3. Wait a minute, then open the URL above. All asset paths are relative, so it works under `/Taven.Studios/`.

## Next steps
Supabase private storage for sketches, an owner-only dashboard, and a secure backend for AI calls. These need separate hosting, because GitHub Pages cannot keep secrets or run a server.
