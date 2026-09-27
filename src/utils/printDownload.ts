import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';

/**
 * Utility to reliably print or download high-fidelity printable cards and posters as real PDF files (.pdf)
 * or via browser print dialog, functioning smoothly inside sandboxed iframes.
 */

export interface PDFExportOptions {
  elementId: string;
  filename: string;
  title?: string;
  onStart?: () => void;
  onComplete?: () => void;
  onError?: (err: unknown) => void;
}

/**
 * Capture an on-screen element and download it as an actual high-resolution PDF document (.pdf)
 */
export async function downloadElementAsPDF({
  elementId,
  filename,
  title = 'حق چرخہ دستاویزی ثبوت',
  onStart,
  onComplete,
  onError
}: PDFExportOptions): Promise<boolean> {
  try {
    if (onStart) onStart();

    const element = document.getElementById(elementId);
    if (!element) {
      console.warn(`Element #${elementId} not found for PDF export.`);
      // Fallback: try printing
      window.print();
      if (onComplete) onComplete();
      return false;
    }

    // High resolution render
    const canvas = await html2canvas(element, {
      scale: 2.5,
      useCORS: true,
      allowTaint: true,
      backgroundColor: '#FFFDF7',
      logging: false,
      windowWidth: element.scrollWidth,
      windowHeight: element.scrollHeight
    });

    const imgData = canvas.toDataURL('image/png', 1.0);
    const isLandscape = canvas.width > canvas.height * 1.25;

    const pdf = new jsPDF({
      orientation: isLandscape ? 'landscape' : 'portrait',
      unit: 'mm',
      format: 'a4'
    });

    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();

    const margin = 10;
    const availableWidth = pageWidth - margin * 2;
    const availableHeight = pageHeight - margin * 2;

    let targetWidth = availableWidth;
    let targetHeight = (canvas.height * targetWidth) / canvas.width;

    if (targetHeight > availableHeight) {
      targetHeight = availableHeight;
      targetWidth = (canvas.width * targetHeight) / canvas.height;
    }

    const x = margin + (availableWidth - targetWidth) / 2;
    const y = margin + (availableHeight - targetHeight) / 2;

    pdf.addImage(imgData, 'PNG', x, y, targetWidth, targetHeight);
    
    // Set document properties
    pdf.setProperties({
      title: title,
      subject: 'Haq Charkha Fair Artisan Wages',
      creator: 'Haq Charkha Mingora'
    });

    const safeFilename = filename.toLowerCase().endsWith('.pdf') ? filename : `${filename}.pdf`;
    pdf.save(safeFilename);

    if (onComplete) onComplete();
    return true;
  } catch (err) {
    console.error('PDF export error:', err);
    if (onError) onError(err);
    if (onComplete) onComplete();
    // Fallback: trigger print
    try {
      window.print();
    } catch {
      // ignore
    }
    return false;
  }
}

/**
 * Trigger clean browser printing using an invisible iframe to prevent sandbox blocking
 */
export function printElement(elementId: string, title = 'حق چرخہ نرخ نامہ'): boolean {
  try {
    const element = document.getElementById(elementId);
    if (!element) {
      window.print();
      return true;
    }

    const iframe = document.createElement('iframe');
    iframe.id = 'print-helper-frame';
    iframe.style.position = 'fixed';
    iframe.style.right = '0';
    iframe.style.bottom = '0';
    iframe.style.width = '0';
    iframe.style.height = '0';
    iframe.style.border = '0';
    document.body.appendChild(iframe);

    // Extract all styles to preserve Noto Nastaliq Urdu and colors
    let stylesHtml = '';
    const styleSheets = document.querySelectorAll('style, link[rel="stylesheet"]');
    styleSheets.forEach((node) => {
      stylesHtml += node.outerHTML;
    });

    const doc = iframe.contentWindow?.document;
    if (doc) {
      doc.open();
      doc.write(`
        <!DOCTYPE html>
        <html lang="ur" dir="rtl">
        <head>
          <meta charset="UTF-8">
          <title>${title}</title>
          <link rel="preconnect" href="https://fonts.googleapis.com">
          <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
          <link href="https://fonts.googleapis.com/css2?family=Noto+Nastaliq+Urdu:wght@400;600;700&display=swap" rel="stylesheet">
          ${stylesHtml}
          <style>
            @media print {
              body { background: white !important; padding: 0 !important; }
              #${elementId} { border: 2px solid #9B1C1C !important; box-shadow: none !important; width: 100% !important; max-width: 100% !important; }
              .no-print { display: none !important; }
            }
            body {
              font-family: 'Noto Nastaliq Urdu', serif;
              direction: rtl;
              padding: 20px;
              background: white;
            }
          </style>
        </head>
        <body>
          <div style="max-width: 760px; margin: 0 auto;">
            ${element.outerHTML}
          </div>
        </body>
        </html>
      `);
      doc.close();

      setTimeout(() => {
        try {
          iframe.contentWindow?.focus();
          iframe.contentWindow?.print();
        } catch {
          window.print();
        } finally {
          setTimeout(() => {
            if (document.body.contains(iframe)) {
              document.body.removeChild(iframe);
            }
          }, 2000);
        }
      }, 500);
      return true;
    }

    // Direct fallback
    window.print();
    return true;
  } catch (err) {
    console.error('Print frame error:', err);
    try {
      window.print();
      return true;
    } catch {
      return false;
    }
  }
}
