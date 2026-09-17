// src/utils/latexMacroAssets.ts

export const LATEX_MACRO_ASSETS: Record<string, { src: string; className?: string }> = {
  // 5 Bảng biến thiên
  "\\BBTmot": { src: "/assets/latex-macros/BBTmot.png", className: "latex-bbt" },
  "\\BBTtwo": { src: "/assets/latex-macros/BBTtwo.png", className: "latex-bbt" },
  "\\BBTthree": { src: "/assets/latex-macros/BBTthree.png", className: "latex-bbt" },
  "\\BBTSeven": { src: "/assets/latex-macros/BBTSeven.png", className: "latex-bbt latex-bbt-small" },
  "\\BBTFour": { src: "/assets/latex-macros/BBTFour.png", className: "latex-bbt latex-bbt-small" },

  // 7 Đồ thị
  "\\GraphCauSix": { src: "/assets/latex-macros/GraphCauSix.png", className: "latex-graph" },
  "\\GraphCauNine": { src: "/assets/latex-macros/GraphCauNine.png", className: "latex-graph" },
  "\\GraphCauTen": { src: "/assets/latex-macros/GraphCauTen.png", className: "latex-graph" },
  "\\GraphCauEleven": { src: "/assets/latex-macros/GraphCauEleven.png", className: "latex-graph" },
  "\\GraphTFOne": { src: "/assets/latex-macros/GraphTFOne.png", className: "latex-graph" },
  "\\GraphIIITwo": { src: "/assets/latex-macros/GraphIIITwo.png", className: "latex-graph" },
};

export function replaceLatexMacroAssets(text: string): string {
  let result = text;
  for (const [macro, asset] of Object.entries(LATEX_MACRO_ASSETS)) {
    const token = `%%LATEX_ASSET_MACRO_${encodeURIComponent(macro)}%%`;
    const html = `<span class="latex-macro-asset ${asset.className ?? ""}"><img src="${asset.src}" alt="macro" /></span>`;
    result = result.split(macro).join(token);
    result = result.split(token).join(html);
  }
  return result;
}