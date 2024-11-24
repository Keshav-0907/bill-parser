import { NextRequest, NextResponse } from "next/server";
import { promises as fs } from "fs";
import { v4 as uuidv4 } from "uuid";
import PDFParser from "pdf2json";

export async function POST(req: NextRequest) {
  try {
    const formData: FormData = await req.formData();
    const uploadedFiles = formData.getAll("FILE");
    let fileName = "";
    let parsedText = "";

    if (uploadedFiles && uploadedFiles.length > 0) {
      const uploadedFile = uploadedFiles[0];

      if (uploadedFile instanceof File) {
        fileName = uuidv4();
        const tempFilePath = `/tmp/${fileName}.pdf`;
        const fileBuffer = Buffer.from(await uploadedFile.arrayBuffer());
        await fs.writeFile(tempFilePath, fileBuffer);

        const pdfParser = new (PDFParser as any)(null, 1);
        
        try {
          parsedText = await new Promise((resolve, reject) => {
            pdfParser.loadPDF(tempFilePath);
            
            pdfParser.on("pdfParser_dataReady", () => {
              const text = pdfParser.getRawTextContent();
              fs.unlink(tempFilePath).catch(console.error);
              resolve(text);
            });

            pdfParser.on("pdfParser_dataError", (errData: any) => {
              reject(new Error(errData.parserError));
            });
          });
        } catch (parseError) {
          console.error('PDF parsing error:', parseError);
          return NextResponse.json(
            { error: 'Failed to parse PDF' },
            { status: 500 }
          );
        }
      } else {
        console.log('Uploaded file is not in the expected format.');
        return NextResponse.json(
          { error: 'Uploaded file is not in the expected format.' },
          { status: 500 }
        );
      }
    } else {
      console.log('No files found.');
      return NextResponse.json(
        { error: 'No File Found' },
        { status: 404 }
      );
    }

    const response = NextResponse.json(parsedText);
    response.headers.set("FileName", fileName);
    return response;

  } catch (error) {
    console.error('Server error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}