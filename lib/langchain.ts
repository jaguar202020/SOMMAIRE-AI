import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
export async function fetchAndExtractPdfText(fileUrl: string) {
    const response = await fetch(fileUrl);
    if (!response.ok) {
        throw new Error(`Unable to download PDF (${response.status})`);
    }

    const blob = await response.blob();

    const arrayBuffer = await blob.arrayBuffer();

    const loader = new PDFLoader(new Blob([arrayBuffer]));

    const docs = await loader.load();
    //combine all pages
    const pdfText = docs.map((doc)=>doc.pageContent).join("\n").trim();

    if (!pdfText) {
        throw new Error("No readable text could be extracted from this PDF");
    }

    return pdfText;
}
