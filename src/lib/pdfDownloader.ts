import html2canvas from "html2canvas";
import jsPDF from "jspdf";

/**
 * Captures an HTML element by ID and triggers an immediate browser file download as PDF.
 * Never opens the browser print dialog.
 */
export async function downloadElementAsPdf(
  elementId: string,
  filename: string = "Invoice.pdf"
): Promise<boolean> {
  try {
    const element = document.getElementById(elementId);
    if (!element) {
      console.error(`Element with id '${elementId}' not found.`);
      return false;
    }

    // Capture the element at high resolution
    const canvas = await html2canvas(element, {
      scale: 2.5, // Crisp 2.5x resolution for retina-grade text
      useCORS: true,
      logging: false,
      backgroundColor: "#ffffff",
      windowWidth: 1200, // standard rendering width to avoid mobile media-query shrinkage
    });

    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
    });

    const pageWidth = 210; // A4 mm width
    const pageHeight = 297; // A4 mm height
    const margin = 10; // 10mm padding inside A4
    const printableWidth = pageWidth - margin * 2;
    const imgHeight = (canvas.height * printableWidth) / canvas.width;

    // Center horizontally with margin
    pdf.addImage(
      imgData,
      "PNG",
      margin,
      margin,
      printableWidth,
      Math.min(imgHeight, pageHeight - margin * 2)
    );

    // Save directly to the user's downloads folder
    pdf.save(filename.endsWith(".pdf") ? filename : `${filename}.pdf`);
    return true;
  } catch (error) {
    console.error("PDF generation failed:", error);
    return false;
  }
}
