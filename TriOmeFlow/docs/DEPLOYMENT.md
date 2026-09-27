# Deployment

## GitHub Pages

1. Push the repository to GitHub.
2. Open **Settings → Pages**.
3. Choose **Deploy from a branch**.
4. Select `main` and `/ (root)`.
5. Save.

There is no build step. GitHub Pages serves the root `index.html` directly.

## Local check

From the repository directory:

```bash
python -m http.server 8000
```

Open `http://localhost:8000` in Chrome or Edge.

## Offline competition file

Use:

```text
dist/TriOmeFlow_Submission.html
```

This is the self-contained version for direct offline use.
