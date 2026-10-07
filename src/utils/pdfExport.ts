/**
 * Universal HTML element to PDF export utility using html2canvas & jsPDF.
 */

declare global {
  interface Window {
    html2canvas?: (element: HTMLElement, options?: any) => Promise<HTMLCanvasElement>;
    jspdf?: {
      jsPDF: new (options?: any) => any;
    };
  }
}

export async function exportElementToPdf(element: HTMLElement, filename: string): Promise<boolean> {
  const originalDisplay = element.style.display;
  element.style.display = 'block';

  try {
    if (window.html2canvas && window.jspdf) {
      const canvas = await window.html2canvas(element, {
        scale: 1.8,
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff',
      });

      const imgData = canvas.toDataURL('image/jpeg', 0.95);
      const { jsPDF } = window.jspdf;
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
      });

      const imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

      let heightLeft = pdfHeight;
      let position = 0;

      pdf.addImage(imgData, 'JPEG', 0, position, pdfWidth, pdfHeight);
      heightLeft -= pdf.internal.pageSize.getHeight();

      while (heightLeft >= 0) {
        position = heightLeft - pdfHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'JPEG', 0, position, pdfWidth, pdfHeight);
        heightLeft -= pdf.internal.pageSize.getHeight();
      }

      pdf.save(filename);
      return true;
    } else {
      window.print();
      return true;
    }
  } catch (err) {
    console.error('PDF export error:', err);
    window.print();
    return false;
  } finally {
    element.style.display = originalDisplay;
  }
}
