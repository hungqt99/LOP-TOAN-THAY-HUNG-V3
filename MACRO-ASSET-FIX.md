# Fix BBT / TikZ macros to match the original exam

This version uses the figure/table assets extracted from the original exam data instead of re-drawing BBT and graphs with the browser table/TikZ approximations.

## Included macros
- BBTmot, BBTtwo, BBTthree, BBTSeven, BBTFour
- GraphCauSix, GraphCauNine, GraphCauTen, GraphCauEleven
- GraphTFOne, GraphIIITwo, GraphIVThree

## Important
Do not add another `BBT_MACROS` or `GRAPH_MACROS` declaration to `MathRenderer.tsx`.
The replacement is centralized in `src/utils/latexMacroAssets.ts`.

## Deploy
```bash
npm install
npm run build
git add .
git commit -m "Render original LaTeX BBT and graph assets"
git push
```

The images are under `public/assets/latex-macros/` and are served as static assets by Vercel.
