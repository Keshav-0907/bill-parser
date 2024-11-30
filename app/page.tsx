"use client";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { useEffect, useState } from "react";
import { formatData } from "@/lib/ai/gemini";
import ReviewTable from "@/components/ReviewTable";
import { useDispatch } from "react-redux";
import {
  addCustomer,
  addInvoice,
  addProduct,
} from "@/store/features/dataSlice";
import { pdfPrompt } from "@/lib/prompts";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { handleGeminiImages } from "@/lib/ai/handleImagesByGemini";

const ALLOWED_FILE_TYPES = {
  "application/pdf": "PDF",
  "image/jpeg": "JPEG",
  "image/png": "PNG",
};

export default function Home() {
  const dispatch = useDispatch();
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [parsedText, setParsedText] = useState<string>("");
  const [fileName, setFileName] = useState<string>("");
  const [geminiResponse, setGeminiResponse] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    if (!parsedText) return;

    const processGeminiResponse = async () => {
      setLoading(true);
      setError("");
      
      try {
        const res = await formatData(parsedText + pdfPrompt);
        const rawText = res?.response?.candidates[0]?.content?.parts[0]?.text;
        
        if (!rawText) {
          throw new Error("Invalid response from Gemini");
        }

        const cleanedText = rawText
          .replace(/^```json/, "")
          .replace(/```$/, "");
        const parsedJSON = JSON.parse(cleanedText);

        // Validate the parsed JSON structure
        if (!parsedJSON?.Invoices || !parsedJSON?.Customers || !parsedJSON?.Products) {
          throw new Error("Invalid data structure in response");
        }

        dispatch(addInvoice(parsedJSON.Invoices));
        dispatch(addCustomer(parsedJSON.Customers));
        dispatch(addProduct(parsedJSON.Products));
        setGeminiResponse(parsedJSON);
      } catch (error) {
        setError(error instanceof Error ? error.message : "Failed to process file");
        console.error("Error processing Gemini response:", error);
      } finally {
        setLoading(false);
      }
    };

    processGeminiResponse();
  }, [parsedText, dispatch]);

  const validateFile = (file: File): boolean => {
    if (!ALLOWED_FILE_TYPES[file.type as keyof typeof ALLOWED_FILE_TYPES]) {
      setError(`File type not supported. Please upload ${Object.values(ALLOWED_FILE_TYPES).join(", ")}`);
      return false;
    }
    if (file.size > 10 * 1024 * 1024) { // 10MB limit
      setError("File size too large. Please upload a file smaller than 10MB");
      return false;
    }
    return true;
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError("");
    const selectedFile = e.target.files?.[0];
    if (selectedFile && validateFile(selectedFile)) {
      setFile(selectedFile);
      setFileName(selectedFile.name);
    } else {
      e.target.value = "";
      setFile(null);
    }
  };

  // const processImageFile = async (file: File): Promise<string> => {
  //   return new Promise((resolve, reject) => {
  //     const reader = new FileReader();
  //     reader.onload = async () => {
  //       try {
  //         // Convert the file to base64
  //         const base64String = reader.result as string;
  //         const base64Data = base64String.split(',')[1]; // Remove data URL prefix
  //         console.log('first 10 bytes:', base64Data);
          
  //         const response = await handleGeminiImages(base64Data);
  //         console.log('response:', response);
  //         // resolve(response);
  //       } catch (error) {
  //         reject(error);
  //       }
  //     };
  //     reader.onerror = (error) => reject(error);
  //     reader.readAsDataURL(file);
  //   });
  // };

  const uploadFile = async () => {
    if (!file) return;

    try {
      setUploading(true);
      setError("");

      if (file.type === "application/pdf") {
        const formData = new FormData();
        formData.append("FILE", file);
        
        const response = await axios.post("/api/parse-pdf", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        setParsedText(response.data);
        
        const responseFileName = response.headers["filename"];
        if (responseFileName) {
          setFileName(responseFileName);
        }
      } else if (file.type.startsWith("image/")) {
        try {
          // const imageText = await processImageFile(file);
          // setParsedText(imageText);
          console.log('file:', file);
        } catch (error) {
          throw new Error("Failed to process image: " + (error instanceof Error ? error.message : "Unknown error"));
        }
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to upload file";
      setError(errorMessage);
      console.error("Upload error:", error);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="bg-gray-950 min-h-screen p-6 md:p-40 flex items-center justify-center w-full">
      <div className="bg-slate-800 rounded-xl p-6 w-full max-w-4xl">
        <div className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          
          <div className="w-full h-60 border-2 border-dashed rounded-md flex flex-col justify-center items-center text-sm relative">
            <input
              type="file"
              id="fileUpload"
              onChange={handleFileChange}
              accept={Object.keys(ALLOWED_FILE_TYPES).join(",")}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
            <div className="text-center space-y-2">
              <p className="text-gray-400">
                {file ? fileName : "Drag and drop or click to upload"}
              </p>
              <p className="text-gray-500 text-xs">
                Supported formats: {Object.values(ALLOWED_FILE_TYPES).join(", ")}
              </p>
            </div>
          </div>

          <Button
            onClick={uploadFile}
            disabled={!file || uploading}
            className="w-full"
          >
            {uploading ? "Processing..." : loading ? "Analyzing..." : "Upload File"}
          </Button>
        </div>

        {geminiResponse && <ReviewTable geminiResponse={geminiResponse} />}
      </div>
    </div>
  );
}