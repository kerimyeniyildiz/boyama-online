import jsPDF from 'jspdf';

export async function generatePDFFromImage(imageUrl: string, filename?: string): Promise<void> {
  try {
    // Call our API to get processed image data
    const response = await fetch('/api/generate-pdf', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        imageUrl,
        filename
      })
    });

    const data = await response.json();

    if (!data.success) {
      throw new Error(data.error || 'Failed to process image');
    }

    const { imageData, width, height, filename: pdfFilename, mime } = data.data;

    // Determine if image is landscape or portrait
    const isLandscape = width > height;

    // Create PDF with appropriate orientation
    const pdf = new jsPDF({
      orientation: isLandscape ? 'landscape' : 'portrait',
      unit: 'mm',
      format: 'a4'
    });

    // Get PDF page dimensions based on orientation
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();

    const margin = 5; // Smaller margin for better image display
    const footerSpace = 10;
    const maxWidth = pageWidth - margin * 2;
    const maxHeight = pageHeight - (margin * 2) - footerSpace;

    const aspectRatio = width / height;
    let imgWidth, imgHeight;

    // Calculate size to fit image while maintaining aspect ratio
    if (aspectRatio > maxWidth / maxHeight) {
      // Image is relatively wider, fit to width
      imgWidth = maxWidth;
      imgHeight = maxWidth / aspectRatio;
    } else {
      // Image is relatively taller, fit to height
      imgHeight = maxHeight;
      imgWidth = maxHeight * aspectRatio;
    }

    // Center the image on the page
    const x = (pageWidth - imgWidth) / 2;
    const y = (pageHeight - imgHeight) / 2;

    // Add the image to PDF
    pdf.addImage(imageData, (mime === 'image/png' ? 'PNG' : 'JPEG') as any, x, y, imgWidth, imgHeight);

    // Footer branding
    const footerY = pageHeight - margin;
    pdf.setFontSize(10);
    pdf.setTextColor(120, 120, 120);
    pdf.text('www.boyamasayfasi.com.tr', pageWidth / 2, footerY, { align: 'center' });

    // Generate filename if not provided
    const finalFilename = pdfFilename || `coloring-page-${Date.now()}.pdf`;

    // Download the PDF
    pdf.save(finalFilename);

  } catch (error) {
    console.error('Error generating PDF:', error);
    throw error;
  }
}

export function getImageFilenameFromUrl(imageUrl: string): string {
  const parts = imageUrl.split('/');
  const filename = parts[parts.length - 1];
  const nameWithoutExt = filename.split('.')[0];
  return `${nameWithoutExt}.pdf`;
}
