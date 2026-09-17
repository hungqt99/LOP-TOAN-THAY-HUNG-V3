// src/utils/latexParser.ts (hoặc file xử lý LaTeX tương đương của bạn)
import { LATEX_MACRO_ASSETS } from './latexMacroAssets';

/**
 * Hàm phân tích và xử lý chuỗi LaTeX, tự động thay thế các macro bảng biến thiên và đồ thị
 * thành thẻ hình ảnh asset tương ứng từ thư mục public/assets/latex-macros/
 */
export function parseLatexWithAssets(content: string): string {
  if (!content) return '';

  // 1. Lấy danh sách các macro từ tệp asset và sắp xếp theo độ dài giảm dần
  // Việc sắp xếp này giúp tránh lỗi trùng khớp chuỗi con (ví dụ macro ngắn nằm trong macro dài)
  const macros = Object.keys(LATEX_MACRO_ASSETS || {}).sort((a, b) => b.length - a.length);

  if (macros.length === 0) {
    return content;
  }

  // 2. Tạo biểu thức chính quy (Regex) để tìm chính xác các macro trong văn bản
  const escapedMacros = macros.map(m => m.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&'));
  const regex = new RegExp(`(${escapedMacros.join('|')})`, 'g');

  // 3. Tách chuỗi theo các macro tìm thấy
  const parts = content.split(regex);

  // 4. Duyệt qua từng phần để thay thế macro thành thẻ HTML <img> hoặc giữ nguyên văn bản
  return parts.map((part) => {
    if (LATEX_MACRO_ASSETS[part]) {
      // Trả về thẻ HTML hình ảnh được căn chỉnh chuẩn xác theo tỉ lệ gốc
      return `<span class="my-3 block text-center"><img src="${LATEX_MACRO_ASSETS[part]}" alt="${part}" class="max-h-72 w-auto mx-auto object-contain rounded-md bg-white p-1 shadow-sm border border-slate-200" loading="lazy" /></span>`;
    }
    
    // Nếu gặp macro hình vẽ/BBT lạ chưa có trong asset, hiển thị nhãn cảnh báo để dễ kiểm tra
    if (part.startsWith('\\BBT') || part.startsWith('\\Graph') || part.startsWith('\\Hinh')) {
      return `<span class="inline-block px-2 py-1 my-1 text-xs font-mono text-amber-700 bg-amber-50 border border-amber-200 rounded">[Chưa có ảnh asset cho: ${part}]</span>`;
    }

    return part;
  }).join('');
}