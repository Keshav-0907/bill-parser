"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import axios from "axios";
import { useEffect, useState } from "react";
import { formatData } from "@/lib/ai/gemini";
import ReviewTable from "@/components/ReviewTable";

export default function Home() {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [parsedText, setParsedText] = useState<string>("");
  const [fileName, setFileName] = useState<string>("");
  const [geminiResponse, setGeminiResponse] = useState<string>("");
  const [loading, setLoading] = useState(false);
    const prompt = `Generate a JSON response for the given PDF file. Include the following fields: "Invoices", "Products", and "Customers". Only share the json as the response.  The JSON response should be in the following format:
   "Invoices": {
        serial_number: 1, 
        customer_name: "Navya Sri", 
        product_name: "YONEX ZR 100 LIGHT Racket", 
        quantity: 7, tax: 0, total_amount: 179200, 
        date: "12 Nov 2024"
   },
   , products :{
        product_name: "YONEX ZR 100 LIGHT Racket", 
        quantity: 7, 
        unit_price: 25600, 
        tax: 0, 
        price_with_tax: 179200
   }, 
   customers: {
        customer_name: "Navya Sri", 
        phone_number: "8965236147", 
        total_purchase_amount: 232400
   }`;
   
  useEffect(() => {
    if (!parsedText) return;

    setLoading(true);
    (async () => {
      try {
        const res = await formatData(parsedText + prompt);
        console.log("res", res);
        const rawText = res?.response?.candidates[0]?.content?.parts[0]?.text;
        const cleanedText = rawText
          ?.replace(/^```json/, "")
          .replace(/```$/, "");
        const parsedJSON = JSON.parse(cleanedText);
        setGeminiResponse(parsedJSON);
      } catch (error) {
        console.error("Error parsing Gemini response:", error);
      } finally {
        setLoading(false);
      }
    })();
  }, [parsedText]);

  console.log("geminiResponse:", geminiResponse);

  const uploadFile = async () => {
    if (!file) return;

    try {
      setUploading(true);
      const formData = new FormData();
      formData.append("FILE", file);

      const response = await axios.post("/api/parse-pdf", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setParsedText(response.data);
      const responseFileName = response.headers["filename"];
      if (responseFileName) {
        setFileName(responseFileName);
      }
    } catch (error) {
      console.error("Upload error:", error);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="bg-gray-950 h-full p-40 flex items-center justify-center w-full">
      <div className="bg-slate-800 rounded-xl p-6 w-full ">
        <div className="space-y-4">
          <div className="w-full h-60 border-2 border-dashed rounded-md flex justify-center items-center text-sm relative">
            <input
              type="file"
              id="fileUpload"
              onChange={(e) => setFile(e.target.files?.[0])}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
            <label
              htmlFor="fileUpload"
              className="cursor-pointer text-gray-600 hover:text-gray-800 transition"
            >
              {file ? file.name : "No file chosen"}
            </label>
          </div>

          <Button
            onClick={uploadFile}
            disabled={!file || uploading}
            className="w-full"
          >
            {loading ? "Uploading & Parsing PDF..." : "Upload PDF"}
          </Button>
        </div>

        <div>
          {geminiResponse && <ReviewTable geminiResponse={geminiResponse} />}
        </div>
      </div>
    </div>
  );
}
