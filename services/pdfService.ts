import * as pdfjsLib from 'pdfjs-dist';

// Important: In a real build environment (Vite/Webpack), you might handle workers differently.
// For this standalone setup, we set the workerSrc to a CDN matching the library version.
// We use a generic version fallback if the library version isn't detected correctly, 
// but pdfjsLib.version usually works.
pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version || '3.11.174'}/pdf.worker.min.js`;

export const extractTextFromPDF = async (file: File): Promise<{ text: string; pageCount: number }> => {
  try {
    const arrayBuffer = await file.arrayBuffer();
    
    // Load the document
    const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
    const pdf = await loadingTask.promise;
    
    let fullText = '';
    const numPages = pdf.numPages;

    for (let i = 1; i <= numPages; i++) {
      const page = await pdf.getPage(i);
      const textContent = await page.getTextContent();
      
      // Extract strings from items
      const pageText = textContent.items
        .map((item: any) => item.str)
        .join(' ');
        
      fullText += `--- Page ${i} ---\n${pageText}\n\n`;
    }

    return { text: fullText, pageCount: numPages };
  } catch (error) {
    console.error("Error extracting text from PDF:", error);
    throw new Error("Failed to parse PDF. Please ensure the file is a valid PDF document.");
  }
};
